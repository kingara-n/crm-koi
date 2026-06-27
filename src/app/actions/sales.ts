'use server'

import { createClient } from '@/utils/supabase/server'
import { Database } from '@/types/supabase' // Assuming types will be generated

export async function getQuotations() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('quotations').select('*, clients(*), trips(*)').order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

export async function createQuotation(quotationData: any) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('quotations').insert({
    ...quotationData,
    stage: 'new_request',
  }).select().single()
  if (error) throw new Error(error.message)
  return data
}

export async function updateQuotationStage(id: string, stage: string, lossReason?: string) {
  const supabase = await createClient()
  
  const updatePayload: any = { stage, updated_at: new Date().toISOString() }
  if (stage === 'acknowledged') {
    updatePayload.acknowledged_at = new Date().toISOString()
  }
  if (lossReason) {
    updatePayload.loss_reason = lossReason
  }

  const { data, error } = await supabase.from('quotations').update(updatePayload).eq('id', id).select().single()
  if (error) throw new Error(error.message)
  return data
}

export async function checkSLABreaches() {
  const supabase = await createClient()
  // 24 hours ago
  const slaDeadline = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  
  const { data, error } = await supabase
    .from('quotations')
    .select('*')
    .eq('stage', 'new_request')
    .lt('created_at', slaDeadline)
    
  if (error) throw new Error(error.message)
  return data // Returns quotations that breached the 24h SLA
}
