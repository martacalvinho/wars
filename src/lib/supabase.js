import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// User related functions
export async function getUser(walletAddress) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single();

  if (error) throw error;
  return data;
}

export async function createUser(userData) {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUser(userId, updates) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Battle related functions
export async function getActiveBattle() {
  const { data, error } = await supabase
    .from('battles')
    .select(`
      *,
      memes (
        *,
        user:users (username, avatar_url)
      )
    `)
    .eq('status', 'active')
    .order('start_time', { ascending: false })
    .limit(1)
    .single();

  if (error) throw error;
  return data;
}

export async function getUpcomingBattles(limit = 3) {
  const { data, error } = await supabase
    .rpc('get_upcoming_battles', { limit_count: limit });

  if (error) throw error;
  return data;
}

export async function submitMeme(memeData) {
  const { data, error } = await supabase
    .from('memes')
    .insert([memeData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Vote related functions
export async function castVote(voteData) {
  const { data, error } = await supabase
    .from('votes')
    .insert([voteData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getVoteStatus(battleId, userId) {
  const { data, error } = await supabase
    .from('votes')
    .select('team')
    .eq('battle_id', battleId)
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
  return data;
}

// Comment related functions
export async function getComments(battleId) {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      user:users (username, avatar_url)
    `)
    .eq('battle_id', battleId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function addComment(commentData) {
  const { data, error } = await supabase
    .from('comments')
    .insert([commentData])
    .select(`
      *,
      user:users (username, avatar_url)
    `)
    .single();

  if (error) throw error;
  return data;
}

// Leaderboard related functions
export async function getLeaderboard(limit = 10) {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .limit(limit);

  if (error) throw error;
  return data;
}

// Wallet activity logging
export async function logWalletActivity(activityData) {
  const { error } = await supabase
    .rpc('log_wallet_activity', activityData);

  if (error) throw error;
}

// Profile related functions
export async function getUserProfile(username) {
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      memes (
        *,
        battle:battles (title, status)
      )
    `)
    .eq('username', username)
    .single();

  if (error) throw error;
  return data;
}

export async function getUserStats(userId) {
  const { data, error } = await supabase
    .rpc('get_user_stats', { user_id: userId });

  if (error) throw error;
  return data;
}

// Realtime subscriptions
export function subscribeToVotes(battleId, callback) {
  return supabase
    .channel(`battle:${battleId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'votes',
      filter: `battle_id=eq.${battleId}`
    }, callback)
    .subscribe();
}

export function subscribeToComments(battleId, callback) {
  return supabase
    .channel(`comments:${battleId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'comments',
      filter: `battle_id=eq.${battleId}`
    }, callback)
    .subscribe();
}
