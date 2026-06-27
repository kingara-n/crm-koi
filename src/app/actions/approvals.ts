'use server'

import { createClient } from '@/utils/supabase/server'

export async function requestApproval(targetRecordType: string, targetRecordId: string, diffPayload: any, requiredLevel = 1) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase.from('approval_requests').insert({
    target_record_type: targetRecordType,
    target_record_id: targetRecordId,
    diff_payload: diffPayload,
    required_approval_level: requiredLevel,
    requested_by: user.id
  }).select().single()

  if (error) throw new Error(error.message)
  return data
}

export async function approveRequest(requestId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Log the approval
  await supabase.from('approval_logs').insert({
    request_id: requestId,
    approver_id: user.id,
    action: 'approved'
  })

  // Check if required approvals are met
  const { data: request } = await supabase.from('approval_requests').select('*, approval_logs(*)').eq('id', requestId).single()
  
  if (request && request.approval_logs.length >= request.required_approval_level) {
    // Mark as fully approved
    await supabase.from('approval_requests').update({ status: 'approved' }).eq('id', requestId)
    // Actually apply the diff payload here in a real scenario
    // e.g., if target_record_type == 'invoice', update invoices set ...
    
    // Log audit
    await logAudit(user.id, 'apply_approval', request.target_record_type, request.target_record_id, request.diff_payload)
  }

  return true
}

export async function logAudit(actorId: string, action: string, entityType: string, entityId: string, diffPayload: any) {
  const supabase = await createClient()
  await supabase.from('audit_logs').insert({
    actor_id: actorId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    diff_payload: diffPayload
  })
}
