import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user role for UI adjustments
  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar sidebar would go here based on profile?.role */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-indigo-800">
          Koi Travel
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="/" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800">Dashboard</a>
          <a href="/clients" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800">Clients</a>
          <a href="/trips" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800">Trips</a>
          <a href="/sales" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800">Sales Pipeline</a>
          {profile?.role === 'admin' || profile?.role === 'accounting' ? (
             <a href="/billing" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800">Billing</a>
          ) : null}
        </nav>
        <div className="p-4 border-t border-indigo-800 text-sm">
           Role: {profile?.role}
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow flex items-center justify-between p-4">
          <h1 className="text-xl font-semibold text-gray-800">Overview</h1>
          <div>
            <span className="mr-4 text-sm text-gray-600">{user.email}</span>
            <form action="/auth/signout" method="post" className="inline">
              <button type="submit" className="text-sm text-red-600 hover:underline">Sign out</button>
            </form>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
