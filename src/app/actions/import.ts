'use server'

import { createClient } from '@/utils/supabase/server'

// Legacy "SafariOffice" Importer
export async function importSafariOfficeData(rows: any[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const importedClients = []
  
  for (const row of rows) {
    // Map legacy columns to new schema
    const clientData = {
      first_name: row['First Name'] || row['FName'],
      last_name: row['Last Name'] || row['LName'],
      email: row['Email Address'],
      country: row['Country'],
      client_type: row['Type']?.toLowerCase() === 'corporate' ? 'corporate' : 'leisure',
      source_channel: 'legacy_import'
    }

    if (clientData.first_name && clientData.last_name) {
      const { data, error } = await supabase.from('clients').insert(clientData).select().single()
      if (!error && data) {
        importedClients.push(data)
      }
    }
  }

  // Log the import action
  await supabase.from('audit_logs').insert({
    actor_id: user.id,
    action: 'legacy_data_import',
    entity_type: 'clients',
    entity_id: user.id, // Using user ID as a proxy for the batch
    diff_payload: { imported_count: importedClients.length }
  })

  return importedClients.length
}
