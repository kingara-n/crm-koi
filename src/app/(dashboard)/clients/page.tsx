import { getClients } from '@/app/actions/core'

export default async function ClientsPage() {
  const clients = await getClients()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Clients</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Add Client</button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {clients?.map((client) => (
            <li key={client.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-indigo-600">{client.first_name} {client.last_name}</h3>
                  <p className="text-sm text-gray-500">{client.email || 'No email'} &bull; {client.client_type}</p>
                </div>
                <div className="text-sm text-gray-500">
                  <p>{client.country || 'Unknown Country'}</p>
                </div>
              </div>
            </li>
          ))}
          {(!clients || clients.length === 0) && (
            <li className="p-4 text-center text-gray-500">No clients found.</li>
          )}
        </ul>
      </div>
    </div>
  )
}
