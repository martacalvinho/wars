-- Add social media columns to memes table
ALTER TABLE memes 
ADD COLUMN twitter_handle TEXT,
ADD COLUMN telegram_handle TEXT,
ADD COLUMN wallet_address TEXT REFERENCES users(wallet_address),
ADD COLUMN submission_name TEXT;

-- Create an index on wallet_address for faster lookups
CREATE INDEX IF NOT EXISTS idx_memes_wallet_address ON memes(wallet_address);

-- Create a view for user meme statistics
CREATE OR REPLACE VIEW user_meme_stats AS
SELECT 
    u.wallet_address,
    u.username,
    COUNT(m.id) as total_memes_submitted,
    SUM(m.votes_count) as total_votes_received,
    COUNT(CASE WHEN b.winner_team = m.team THEN 1 END) as total_wins
FROM users u
LEFT JOIN memes m ON u.wallet_address = m.wallet_address
LEFT JOIN battles b ON m.battle_id = b.id
GROUP BY u.wallet_address, u.username;

-- Update the memes RLS policies to allow users to view their own submissions
DROP POLICY IF EXISTS "Users can view their own memes" ON memes;
CREATE POLICY "Users can view their own memes" ON memes
    FOR SELECT
    USING (
        auth.uid()::text = wallet_address
        OR
        true  -- Still allow public viewing of all memes
    );
