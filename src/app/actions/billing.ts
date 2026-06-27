'use server'

import { createClient } from '@/utils/supabase/server'

// --- INVOICES ---
export async function getInvoices() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('invoices').select('*, clients(*), trips(*)').order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

export async function createInvoice(invoiceData: any, lineItems: any[]) {
  const supabase = await createClient()
  
  // Create Invoice
  const { data: invoice, error: invoiceError } = await supabase.from('invoices').insert(invoiceData).select().single()
  if (invoiceError) throw new Error(invoiceError.message)
    
  // Create Line Items
  const itemsToInsert = lineItems.map(item => ({ ...item, invoice_id: invoice.id }))
  const { error: itemsError } = await supabase.from('invoice_line_items').insert(itemsToInsert)
  if (itemsError) throw new Error(itemsError.message)
    
  return invoice
}

// --- PURCHASE ORDERS ---
export async function getPurchaseOrders() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('purchase_orders').select('*, suppliers(*), trips(*)').order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

export async function createPurchaseOrder(poData: any) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('purchase_orders').insert(poData).select().single()
  if (error) throw new Error(error.message)
  return data
}

// --- PAYMENTS ---
export async function recordPayment(paymentData: any) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('payments').insert(paymentData).select().single()
  if (error) throw new Error(error.message)
    
  // If payment is for invoice, potentially update invoice status here.
  return data
}

// --- EXCHANGE RATES ---
export async function setExchangeRate(currencyPair: string, rate: number, effectiveMonth: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase.from('exchange_rates').insert({
    currency_pair: currencyPair,
    rate,
    effective_month: effectiveMonth,
    set_by: user.id
  }).select().single()
  
  if (error) throw new Error(error.message)
  return data
}

export async function getCurrentExchangeRates() {
  const supabase = await createClient()
  // In a real app, query by the most recent effective_month
  const { data, error } = await supabase.from('exchange_rates').select('*').order('effective_month', { ascending: false }).limit(10)
  if (error) throw new Error(error.message)
  return data
}
