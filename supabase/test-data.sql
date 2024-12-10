-- Insert test battle
INSERT INTO battles (
    title,
    description,
    start_time,
    end_time,
    status
) VALUES (
    'Cats vs Dogs',
    'The eternal battle between our furry friends',
    NOW(),
    NOW() + INTERVAL '24 hours',
    'active'
);

-- Get the battle ID for reference
DO $$ 
DECLARE 
    battle_id UUID;
BEGIN
    SELECT id INTO battle_id FROM battles WHERE title = 'Cats vs Dogs';

    -- Insert test memes
    INSERT INTO memes (battle_id, user_id, image_url, team) VALUES
    (battle_id, '00000000-0000-0000-0000-000000000000', 'https://picsum.photos/800/800?random=1', 'left'),
    (battle_id, '00000000-0000-0000-0000-000000000000', 'https://picsum.photos/800/800?random=2', 'right'),
    (battle_id, '00000000-0000-0000-0000-000000000000', 'https://picsum.photos/800/800?random=3', 'left'),
    (battle_id, '00000000-0000-0000-0000-000000000000', 'https://picsum.photos/800/800?random=4', 'right');

    -- Insert test comments
    INSERT INTO comments (battle_id, user_id, content, team) VALUES
    (battle_id, '00000000-0000-0000-0000-000000000000', 'Team cats all the way!', 'left'),
    (battle_id, '00000000-0000-0000-0000-000000000000', 'Dogs are the best!', 'right'),
    (battle_id, '00000000-0000-0000-0000-000000000000', 'This is hilarious!', null);

END $$;
