# Meme Wars Backend Specification

## Overview
This document outlines the database structure and functionality required for the Meme Wars platform using Supabase as the backend service.

## Database Tables

### 1. users
Primary table for user information
```sql
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
    total_wins INTEGER DEFAULT 0
);
```

### 2. battles
Represents individual meme battles
```sql
CREATE TABLE battles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('upcoming', 'active', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    winner_team TEXT,
    total_votes INTEGER DEFAULT 0
);
```

### 3. memes
Stores meme submissions for battles
```sql
CREATE TABLE memes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    battle_id UUID REFERENCES battles(id),
    user_id UUID REFERENCES users(id),
    image_url TEXT NOT NULL,
    team TEXT NOT NULL CHECK (team IN ('left', 'right')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    votes_count INTEGER DEFAULT 0,
    reported_count INTEGER DEFAULT 0
);
```

### 4. votes
Records user votes on memes
```sql
CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    battle_id UUID REFERENCES battles(id),
    user_id UUID REFERENCES users(id),
    team TEXT NOT NULL CHECK (team IN ('left', 'right')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(battle_id, user_id)
);
```

### 5. comments
Stores user comments on battles
```sql
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    battle_id UUID REFERENCES battles(id),
    user_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    team TEXT CHECK (team IN ('left', 'right', null))
);
```

### 6. notifications
User notifications for various events
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    type TEXT NOT NULL CHECK (type IN ('battle_start', 'battle_end', 'vote_received', 'comment_received')),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 7. user_achievements
Tracks user achievements and badges
```sql
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    achievement_type TEXT NOT NULL,
    achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_type)
);
```

## Features & Functionality

### Current Features
1. **User Authentication**
   - Wallet connection (Phantom)
   - Random username generation
   - Profile management

2. **Battle System**
   - Active battle voting
   - Meme submission
   - Vote tracking
   - Battle countdown
   - Team-based competition

3. **Social Features**
   - Comments
   - Team selection
   - Profile viewing

4. **Content Management**
   - Meme submission
   - Battle progression
   - Leaderboard tracking

### Planned Features
1. **Enhanced Battle System**
   - Battle themes/categories
   - Special event battles
   - Tournament mode
   - Battle rewards

2. **Social Enhancements**
   - Follow system
   - Direct messaging
   - Team chat
   - Emoji reactions

3. **Gamification**
   - Achievement system
   - Experience points
   - Seasonal rankings
   - Custom badges

4. **Content Moderation**
   - Report system
   - Content filtering
   - Community moderation
   - Appeal system

## API Endpoints

### User Management
- POST /auth/wallet-login
- GET /users/{username}
- PATCH /users/{id}
- GET /users/{id}/achievements
- GET /users/{id}/statistics

### Battle System
- GET /battles/active
- GET /battles/upcoming
- GET /battles/{id}
- POST /battles/{id}/vote
- GET /battles/{id}/results

### Meme Management
- POST /memes
- GET /memes/{battle_id}
- POST /memes/{id}/vote
- GET /memes/trending

### Social Features
- POST /comments
- GET /comments/{battle_id}
- POST /notifications/mark-read
- GET /notifications

## Security Considerations

1. **Data Protection**
   - Implement RLS (Row Level Security)
   - Validate wallet signatures
   - Rate limiting on API endpoints

2. **Content Safety**
   - Image content verification
   - Text content moderation
   - User reporting system

3. **Transaction Security**
   - Vote manipulation prevention
   - Duplicate submission checks
   - Timestamp validation

## Performance Optimizations

1. **Caching Strategy**
   - Cache battle results
   - Cache leaderboard data
   - Cache user profiles

2. **Database Indexes**
```sql
-- Add indexes for common queries
CREATE INDEX idx_battles_status ON battles(status);
CREATE INDEX idx_memes_battle_id ON memes(battle_id);
CREATE INDEX idx_votes_battle_id_user_id ON votes(battle_id, user_id);
CREATE INDEX idx_users_username ON users(username);
```

3. **Query Optimization**
   - Implement pagination
   - Use materialized views for leaderboards
   - Optimize join operations

## Monitoring & Analytics

1. **System Metrics**
   - Active users
   - Battle participation
   - Vote distribution
   - Response times

2. **User Analytics**
   - Engagement metrics
   - Retention rates
   - Feature usage
   - User growth

3. **Content Metrics**
   - Popular memes
   - Battle activity
   - Comment engagement
   - Team balance
