-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set up storage for meme images
INSERT INTO storage.buckets (id, name, public) VALUES ('memes', 'memes', true);
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'memes');
CREATE POLICY "Authenticated Users Can Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'memes' AND auth.role() = 'authenticated');

-- Create ENUM types
CREATE TYPE battle_status AS ENUM ('upcoming', 'active', 'completed');
CREATE TYPE team_side AS ENUM ('left', 'right');
CREATE TYPE notification_type AS ENUM ('battle_start', 'battle_end', 'vote_received', 'comment_received');

-- Create tables
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_votes_received INTEGER DEFAULT 0,
    total_votes_cast INTEGER DEFAULT 0,
    total_memes_submitted INTEGER DEFAULT 0,
    total_wins INTEGER DEFAULT 0,
    last_connected TIMESTAMP WITH TIME ZONE,
    wallet_network TEXT DEFAULT 'mainnet',
    wallet_type TEXT DEFAULT 'phantom',
    signature_count INTEGER DEFAULT 0,
    CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30)
);

CREATE TABLE battles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status battle_status NOT NULL DEFAULT 'upcoming',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    winner_team team_side,
    total_votes INTEGER DEFAULT 0,
    CONSTRAINT valid_times CHECK (end_time > start_time),
    CONSTRAINT title_length CHECK (char_length(title) >= 3 AND char_length(title) <= 100)
);

CREATE TABLE memes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    battle_id UUID REFERENCES battles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    team team_side NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    votes_count INTEGER DEFAULT 0,
    reported_count INTEGER DEFAULT 0
);

CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    battle_id UUID REFERENCES battles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    team team_side NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(battle_id, user_id)
);

CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    battle_id UUID REFERENCES battles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    team team_side,
    CONSTRAINT content_length CHECK (char_length(content) >= 1 AND char_length(content) <= 1000)
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_type TEXT NOT NULL,
    achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_type)
);

CREATE TABLE wallet_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    wallet_address TEXT NOT NULL,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('connect', 'disconnect', 'signature')),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_battles_status ON battles(status);
CREATE INDEX idx_battles_start_time ON battles(start_time);
CREATE INDEX idx_memes_battle_id ON memes(battle_id);
CREATE INDEX idx_votes_battle_id_user_id ON votes(battle_id, user_id);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_comments_battle_id ON comments(battle_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id, is_read);
CREATE INDEX idx_users_wallet ON users(wallet_address);
CREATE INDEX idx_wallet_activities_user ON wallet_activities(user_id, created_at);

-- Create functions for battle status updates
CREATE OR REPLACE FUNCTION update_battle_status()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE battles
    SET status = 
        CASE 
            WHEN NOW() < start_time THEN 'upcoming'
            WHEN NOW() BETWEEN start_time AND end_time THEN 'active'
            ELSE 'completed'
        END
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for battle status updates
CREATE TRIGGER battle_status_update
    AFTER INSERT OR UPDATE OF start_time, end_time
    ON battles
    FOR EACH ROW
    EXECUTE FUNCTION update_battle_status();

-- Create function to update vote counts
CREATE OR REPLACE FUNCTION update_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
    -- Update meme votes count
    UPDATE memes
    SET votes_count = (
        SELECT COUNT(*) 
        FROM votes 
        WHERE battle_id = NEW.battle_id AND team = memes.team
    )
    WHERE battle_id = NEW.battle_id;

    -- Update battle total votes
    UPDATE battles
    SET total_votes = (
        SELECT COUNT(*) 
        FROM votes 
        WHERE battle_id = NEW.battle_id
    )
    WHERE id = NEW.battle_id;

    -- Update user stats
    UPDATE users
    SET total_votes_cast = total_votes_cast + 1
    WHERE id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for vote counts
CREATE TRIGGER vote_counts_update
    AFTER INSERT OR DELETE
    ON votes
    FOR EACH ROW
    EXECUTE FUNCTION update_vote_counts();

-- Create function to determine battle winner
CREATE OR REPLACE FUNCTION determine_battle_winner()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND OLD.status = 'active' THEN
        UPDATE battles
        SET winner_team = (
            SELECT team
            FROM (
                SELECT team, COUNT(*) as vote_count
                FROM votes
                WHERE battle_id = NEW.id
                GROUP BY team
                ORDER BY vote_count DESC
                LIMIT 1
            ) winner
        )
        WHERE id = NEW.id;

        -- Update winner stats
        UPDATE users
        SET total_wins = total_wins + 1
        WHERE id IN (
            SELECT user_id
            FROM memes
            WHERE battle_id = NEW.id
            AND team = (SELECT winner_team FROM battles WHERE id = NEW.id)
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for determining battle winner
CREATE TRIGGER battle_winner_determination
    AFTER UPDATE OF status
    ON battles
    FOR EACH ROW
    EXECUTE FUNCTION determine_battle_winner();

-- Create function to log wallet activity
CREATE OR REPLACE FUNCTION log_wallet_activity(
    p_user_id UUID,
    p_wallet_address TEXT,
    p_activity_type TEXT,
    p_metadata JSONB DEFAULT '{}'::JSONB
)
RETURNS void AS $$
BEGIN
    INSERT INTO wallet_activities (user_id, wallet_address, activity_type, metadata)
    VALUES (p_user_id, p_wallet_address, p_activity_type, p_metadata);

    -- Update user's last connected time if connecting
    IF p_activity_type = 'connect' THEN
        UPDATE users
        SET last_connected = NOW()
        WHERE id = p_user_id;
    END IF;

    -- Increment signature count if signing
    IF p_activity_type = 'signature' THEN
        UPDATE users
        SET signature_count = signature_count + 1
        WHERE id = p_user_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Set up Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE memes ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_activities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public users read" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public battles read" ON battles FOR SELECT USING (true);
CREATE POLICY "Admins can manage battles" ON battles FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public memes read" ON memes FOR SELECT USING (true);
CREATE POLICY "Users can submit memes" ON memes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own memes" ON memes FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Public votes read" ON votes FOR SELECT USING (true);
CREATE POLICY "Users can vote" ON votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can change votes" ON votes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public comments read" ON comments FOR SELECT USING (true);
CREATE POLICY "Users can comment" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users see own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON notifications FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can mark notifications read" ON notifications FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users see own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can grant achievements" ON user_achievements FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can view own wallet activities" 
    ON wallet_activities FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "System can insert wallet activities" 
    ON wallet_activities FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

-- Create view for leaderboard
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
    u.id,
    u.username,
    u.avatar_url,
    u.total_wins,
    u.total_votes_received,
    u.total_memes_submitted,
    COUNT(DISTINCT m.battle_id) as battles_participated
FROM users u
LEFT JOIN memes m ON u.id = m.user_id
GROUP BY u.id, u.username, u.avatar_url, u.total_wins, u.total_votes_received, u.total_memes_submitted
ORDER BY u.total_wins DESC, u.total_votes_received DESC;

-- Create view for wallet statistics
CREATE OR REPLACE VIEW wallet_statistics AS
SELECT 
    u.id,
    u.username,
    u.wallet_address,
    u.wallet_network,
    u.wallet_type,
    u.signature_count,
    u.last_connected,
    COUNT(DISTINCT wa.id) as total_activities,
    MAX(CASE WHEN wa.activity_type = 'connect' THEN wa.created_at END) as last_wallet_connect,
    COUNT(CASE WHEN wa.activity_type = 'signature' THEN 1 END) as total_signatures
FROM users u
LEFT JOIN wallet_activities wa ON u.id = wa.user_id
GROUP BY u.id, u.username, u.wallet_address, u.wallet_network, u.wallet_type, u.signature_count, u.last_connected;

-- Create function to get upcoming battles
CREATE OR REPLACE FUNCTION get_upcoming_battles(limit_count INTEGER)
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    status battle_status,
    total_votes INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.id,
        b.title,
        b.description,
        b.start_time,
        b.end_time,
        b.status,
        b.total_votes
    FROM battles b
    WHERE b.status = 'upcoming'
    ORDER BY b.start_time ASC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to get user stats
CREATE OR REPLACE FUNCTION get_user_stats(user_id UUID)
RETURNS TABLE (
    total_battles INTEGER,
    win_rate NUMERIC,
    avg_votes_per_meme NUMERIC,
    total_comments INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT m.battle_id)::INTEGER as total_battles,
        COALESCE(ROUND(u.total_wins::NUMERIC / NULLIF(COUNT(DISTINCT m.battle_id), 0) * 100, 2), 0) as win_rate,
        COALESCE(ROUND(SUM(m.votes_count)::NUMERIC / NULLIF(COUNT(m.*), 0), 2), 0) as avg_votes_per_meme,
        COUNT(c.*)::INTEGER as total_comments
    FROM users u
    LEFT JOIN memes m ON u.id = m.user_id
    LEFT JOIN comments c ON u.id = c.user_id
    WHERE u.id = user_id
    GROUP BY u.total_wins;
END;
$$ LANGUAGE plpgsql;

-- Create function to get user's wallet history
CREATE OR REPLACE FUNCTION get_wallet_history(p_user_id UUID)
RETURNS TABLE (
    activity_date TIMESTAMP WITH TIME ZONE,
    activity_type TEXT,
    wallet_address TEXT,
    metadata JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        wa.created_at,
        wa.activity_type,
        wa.wallet_address,
        wa.metadata
    FROM wallet_activities wa
    WHERE wa.user_id = p_user_id
    ORDER BY wa.created_at DESC;
END;
$$ LANGUAGE plpgsql;
