'use server'

import { createClient } from '@/utils/supabase/server'

export async function createMention(targetUserId: string, targetRecordType: string, targetRecordId: string, message: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase.from('tags_mentions').insert({
    actor_id: user.id,
    target_user_id: targetUserId,
    target_record_type: targetRecordType,
    target_record_id: targetRecordId,
    message
  }).select().single()

  if (error) throw new Error(error.message)
  
  // Create a corresponding task for the mentioned user
  await supabase.from('tasks').insert({
    user_id: targetUserId,
    source: 'mention',
    due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 1 day later
  })

  // Here we would also trigger a transactional email
  
  return data
}

export async function getMyTasks() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase.from('tasks').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

export async function completeTask(taskId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('tasks').update({ is_done: true }).eq('id', taskId)
  if (error) throw new Error(error.message)
  return true
}
