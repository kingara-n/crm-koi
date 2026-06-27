import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Contract renewals (3mo before expiry)
    const threeMonthsFromNow = new Date()
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
    const threeMoDate = threeMonthsFromNow.toISOString().split('T')[0]

    const { data: contracts } = await supabaseClient
      .from('contracts')
      .select('*')
      .eq('end_date', threeMoDate)

    // Log tasks/notifications for contracts
    if (contracts && contracts.length > 0) {
       console.log(`Found ${contracts.length} contracts due for renewal.`)
       // TODO: Insert tasks for sales team
    }

    // 2. AR reminders (3 days before due date)
    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)
    const threeDayDate = threeDaysFromNow.toISOString().split('T')[0]

    const { data: invoices } = await supabaseClient
      .from('invoices')
      .select('*')
      .eq('due_date', threeDayDate)
      .neq('status', 'paid')

    if (invoices && invoices.length > 0) {
      console.log(`Found ${invoices.length} invoices due in 3 days.`)
      // TODO: Insert notifications for accounting
    }

    // 3. AP reminders (7 days before due date)
    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
    const sevenDayDate = sevenDaysFromNow.toISOString().split('T')[0]

    const { data: pos } = await supabaseClient
      .from('purchase_orders')
      .select('*')
      .eq('due_date', sevenDayDate)
      .neq('status', 'paid')

    if (pos && pos.length > 0) {
      console.log(`Found ${pos.length} POs due in 7 days.`)
      // TODO: Insert notifications for accounting
    }

    // 4. Birthday greetings
    const today = new Date()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')

    // Query clients where date_of_birth matches today's month and day
    // In actual SQL: EXTRACT(MONTH FROM date_of_birth) = month AND EXTRACT(DAY FROM date_of_birth) = day
    // For Deno REST, we might need an RPC for this or fetch all and filter if small.
    // Assuming an RPC exists for birthday queries.
    const { data: birthdays } = await supabaseClient.rpc('get_birthdays_today', { current_month: month, current_day: day })

    if (birthdays && birthdays.length > 0) {
      console.log(`Found ${birthdays.length} birthdays today.`)
      // TODO: Insert tasks for marketing
    }

    return new Response(JSON.stringify({ success: true, processed: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    })
  }
})
