-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create ENUM types if they don't exist
DO $$ BEGIN
    CREATE TYPE battle_status AS ENUM ('upcoming', 'active', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE team_side AS ENUM ('left', 'right');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('battle_start', 'battle_end', 'vote_received', 'comment_received');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS users (
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

CREATE TABLE IF NOT EXISTS battles (
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

CREATE TABLE IF NOT EXISTS memes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    battle_id UUID REFERENCES battles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    team team_side NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    votes_count INTEGER DEFAULT 0,
    reported_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    battle_id UUID REFERENCES battles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    team team_side NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(battle_id, user_id)
);

CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    battle_id UUID REFERENCES battles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    team team_side,
    CONSTRAINT content_length CHECK (char_length(content) >= 1 AND char_length(content) <= 1000)
);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_type TEXT NOT NULL,
    achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_type)
);

CREATE TABLE IF NOT EXISTS wallet_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    wallet_address TEXT NOT NULL,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('connect', 'disconnect', 'signature')),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes if they don't exist
DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_battles_status ON battles(status);
    CREATE INDEX IF NOT EXISTS idx_battles_start_time ON battles(start_time);
    CREATE INDEX IF NOT EXISTS idx_memes_battle_id ON memes(battle_id);
    CREATE INDEX IF NOT EXISTS idx_votes_battle_id_user_id ON votes(battle_id, user_id);
    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    CREATE INDEX IF NOT EXISTS idx_comments_battle_id ON comments(battle_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id, is_read);
    CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);
    CREATE INDEX IF NOT EXISTS idx_wallet_activities_user ON wallet_activities(user_id, created_at);
END $$;

-- Enable row level security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$ BEGIN
    CREATE POLICY "Public users read" ON users FOR SELECT USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update users RLS policy to allow updates
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Drop and recreate the update policy
DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can update own profile" ON users;
    CREATE POLICY "Users can update own profile" ON users 
    FOR UPDATE USING (true);
EXCEPTION
    WHEN undefined_object THEN null;
END $$;

-- Enable RLS again
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Allow anyone to create a user" ON users FOR INSERT WITH CHECK (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Drop existing triggers
DROP TRIGGER IF EXISTS battle_status_update ON battles;
DROP TRIGGER IF EXISTS vote_counts_update ON votes;
DROP TRIGGER IF EXISTS battle_winner_determination ON battles;
DROP TRIGGER IF EXISTS update_user_stats_on_vote ON votes;
DROP TRIGGER IF EXISTS update_user_stats_on_meme ON memes;

-- Drop existing functions
DROP FUNCTION IF EXISTS update_battle_status() CASCADE;
DROP FUNCTION IF EXISTS update_vote_counts() CASCADE;
DROP FUNCTION IF EXISTS determine_battle_winner() CASCADE;
DROP FUNCTION IF EXISTS update_user_stats() CASCADE;

-- Recreate functions
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
        UPDATE users u
        SET total_wins = total_wins + 1
        FROM memes m
        WHERE m.battle_id = NEW.id 
        AND m.team = (SELECT winner_team FROM battles WHERE id = NEW.id)
        AND m.user_id = u.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate triggers
CREATE TRIGGER battle_status_update
    AFTER INSERT OR UPDATE OF start_time, end_time
    ON battles
    FOR EACH ROW
    EXECUTE FUNCTION update_battle_status();

CREATE TRIGGER vote_counts_update
    AFTER INSERT OR DELETE
    ON votes
    FOR EACH ROW
    EXECUTE FUNCTION update_vote_counts();

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

-- Create function to update username
CREATE OR REPLACE FUNCTION update_username(p_wallet_address TEXT, p_new_username TEXT)
RETURNS json AS $$
DECLARE
    v_updated_user json;
BEGIN
    UPDATE users 
    SET 
        username = p_new_username,
        updated_at = NOW()
    WHERE wallet_address = p_wallet_address
    RETURNING row_to_json(users.*) INTO v_updated_user;
    
    RETURN v_updated_user;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set up Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE memes ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_activities ENABLE ROW LEVEL SECURITY;

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
