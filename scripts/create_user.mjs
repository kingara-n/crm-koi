import { createClient } from '@supabase/supabase-js'


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function createUser() {
  console.log("Signing up user...")
  const { data, error } = await supabase.auth.signUp({
    email: 'kingara@koitravel.co.ke',
    password: 'admin123',
  })

  if (error) {
    console.error("Error signing up:", error.message)
    return
  }

  console.log("Successfully signed up!", data.user.id)
  console.log("They are now in the 'pending' state.")
}

createUser()
