import { createClient } from '@/utils/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch some summary data for the dashboard
  const { count: clientsCount } = await supabase.from('clients').select('*', { count: 'exact', head: true })
  const { count: activeTrips } = await supabase.from('trips').select('*', { count: 'exact', head: true })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Welcome to Koi Travel CRM</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {/* Stats Cards */}
         <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
           <h3 className="text-gray-500 text-sm font-medium">Total Clients</h3>
           <p className="mt-2 text-3xl font-semibold text-gray-900">{clientsCount || 0}</p>
         </div>
         <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
           <h3 className="text-gray-500 text-sm font-medium">Active Trips</h3>
           <p className="mt-2 text-3xl font-semibold text-gray-900">{activeTrips || 0}</p>
         </div>
      </div>
      
      {/* Notifications/Tasks Panel could go here */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
         <h3 className="text-lg font-medium text-gray-900">Your Tasks</h3>
         <p className="mt-2 text-gray-600">No pending tasks.</p>
      </div>
    </div>
  )
}
