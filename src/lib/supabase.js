import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to increment a column value
const increment = (column) => {
  return supabase.sql`${column} + 1`;
};

function generateUsername(walletAddress) {
  // Take first 4 and last 4 characters of the wallet address
  const prefix = walletAddress.slice(0, 4);
  const suffix = walletAddress.slice(-4);
  return `user_${prefix}${suffix}`.toLowerCase();
}

// User related functions
export async function getUser(walletAddress) {
  try {
    console.log('Fetching user with wallet:', walletAddress);
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getUser:', error);
    return null;
  }
}

export async function createUser({ wallet_address }) {
  try {
    console.log('Creating user with wallet:', wallet_address);
    
    // Generate a unique username based on wallet address
    const username = generateUsername(wallet_address);
    
    const { data, error } = await supabase
      .from('users')
      .insert([
        { 
          wallet_address,
          username,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createUser:', error);
    throw error;
  }
}

export async function updateUser(userId, updates) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateUser:', error);
    throw error;
  }
}

export async function getUserProfile(walletAddress) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        wallet_address,
        username,
        avatar_url,
        bio,
        total_votes_received,
        total_votes_cast,
        total_memes_submitted,
        total_wins
      `)
      .eq('wallet_address', walletAddress)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

export async function updateUsername(userId, newUsername, walletAddress) {
  try {
    console.log('Updating username for wallet:', walletAddress, 'to:', newUsername);
    
    // First check if username is taken
    const isTaken = await isUsernameTaken(newUsername);
    if (isTaken) {
      throw new Error('Username is already taken');
    }

    // Direct update using raw SQL
    const { data: updatedUser, error: updateError } = await supabase
      .rpc('update_username', {
        p_wallet_address: walletAddress,
        p_new_username: newUsername
      });

    if (updateError) {
      console.error('Error updating username:', updateError);
      throw updateError;
    }

    console.log('Username updated successfully, returning user:', updatedUser);
    return updatedUser;
  } catch (error) {
    console.error('Error in updateUsername:', error);
    throw error;
  }
}

export async function isUsernameTaken(username) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;
    return data !== null;
  } catch (error) {
    console.error('Error checking username:', error);
    return true;
  }
}

// Battle related functions
export async function getActiveBattle() {
  try {
    const { data, error } = await supabase
      .from('battles')
      .select(`
        *,
        memes (
          id,
          image_url,
          team,
          user:users (
            username,
            avatar_url
          )
        ),
        votes (
          team,
          user:users (
            username
          )
        ),
        comments (
          id,
          content,
          team,
          created_at,
          user:users (
            username,
            avatar_url
          )
        )
      `)
      .eq('status', 'active')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting active battle:', error);
    return null;
  }
}

// Vote related functions
export async function castVote(voteData) {
  try {
    const { data, error } = await supabase
      .from('votes')
      .insert([voteData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error casting vote:', error);
    throw error;
  }
}

export async function getVoteStatus(battleId, userId) {
  try {
    const { data, error } = await supabase
      .from('votes')
      .select('team')
      .eq('battle_id', battleId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  } catch (error) {
    console.error('Error getting vote status:', error);
    return null;
  }
}

// Comment related functions
export async function getComments(battleId) {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        user:users (
          username,
          avatar_url
        )
      `)
      .eq('battle_id', battleId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting comments:', error);
    return [];
  }
}

export async function addComment(commentData) {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert([commentData])
      .select(`
        *,
        user:users (
          username,
          avatar_url
        )
      `)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
}

// Leaderboard related functions
export async function getLeaderboard(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        username,
        avatar_url,
        total_votes_received,
        total_votes_cast,
        total_memes_submitted,
        total_wins
      `)
      .order('total_votes_received', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
}

// Meme related functions
export const submitMeme = async ({
  battleId,
  userId,
  imageUrl,
  team,
  submissionName,
  twitterHandle,
  telegramHandle,
  walletAddress
}) => {
  console.log('Submitting meme to database:', {
    battleId,
    userId,
    imageUrl,
    team,
    submissionName,
    twitterHandle,
    telegramHandle,
    walletAddress
  });

  const { data, error } = await supabase
    .from('memes')
    .insert([{
      battle_id: battleId,
      user_id: userId,
      image_url: imageUrl,
      team,
      submission_name: submissionName,
      twitter_handle: twitterHandle,
      telegram_handle: telegramHandle,
      wallet_address: walletAddress,
      votes_count: 0
    }])
    .select()
    .single();

  if (error) {
    console.error('Error submitting meme:', error);
    throw error;
  }

  console.log('Meme submitted successfully:', data);
  return data;
};

// Wallet activity logging
export async function logWalletActivity({ wallet_address, action_type, metadata = {} }) {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('wallet_address', wallet_address)
      .single();

    if (!user) {
      console.error('No user found for wallet activity logging');
      return null;
    }

    const { data, error } = await supabase
      .from('wallet_activities')
      .insert([
        {
          user_id: user.id,
          wallet_address,
          activity_type: action_type,
          metadata
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error logging wallet activity:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in logWalletActivity:', error);
    return null;
  }
}

// Realtime subscriptions
export function subscribeToVotes(battleId, callback) {
  return supabase
    .channel(`battle:${battleId}:votes`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'votes',
        filter: `battle_id=eq.${battleId}`
      },
      callback
    )
    .subscribe();
}

export function subscribeToComments(battleId, callback) {
  return supabase
    .channel(`battle:${battleId}:comments`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'comments',
        filter: `battle_id=eq.${battleId}`
      },
      callback
    )
    .subscribe();
}
