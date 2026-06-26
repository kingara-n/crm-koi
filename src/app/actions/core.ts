'use server'

import { createClient } from '@/utils/supabase/server'

// --- CLIENTS ---
export async function getClients() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

export async function createClientRecord(clientData: any) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('clients').insert(clientData).select().single()
  if (error) throw new Error(error.message)
  return data
}

// --- TRIPS ---
export async function getTrips() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('trips').select('*, trip_participants(*)').order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

export async function createTrip(tripData: any) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('trips').insert(tripData).select().single()
  if (error) throw new Error(error.message)
  return data
}

// --- SUPPLIERS ---
export async function getSuppliers() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('suppliers').select('*').order('name', { ascending: true })
  if (error) throw new Error(error.message)
  return data
}

export async function createSupplier(supplierData: any) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('suppliers').insert(supplierData).select().single()
  if (error) throw new Error(error.message)
  return data
}

// --- RATE SHEETS ---
export async function getRateSheets(supplierId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('rate_sheets').select('*').eq('supplier_id', supplierId)
  if (error) throw new Error(error.message)
  return data
}

// --- DOCUMENTS ---
export async function getDocuments(entityType: string, entityId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('documents').select('*').eq('entity_type', entityType).eq('entity_id', entityId)
  if (error) throw new Error(error.message)
  return data
}
