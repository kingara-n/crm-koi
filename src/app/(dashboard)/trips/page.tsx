import { getTrips } from '@/app/actions/core'

export default async function TripsPage() {
  const trips = await getTrips()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Trips</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Create Trip</button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {trips?.map((trip) => (
            <li key={trip.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-indigo-600">{trip.title}</h3>
                  <p className="text-sm text-gray-500">
                    {trip.start_date ? new Date(trip.start_date).toLocaleDateString() : 'TBD'} - 
                    {trip.end_date ? new Date(trip.end_date).toLocaleDateString() : 'TBD'}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  <p>{trip.trip_participants?.length || 0} Participants</p>
                </div>
              </div>
            </li>
          ))}
          {(!trips || trips.length === 0) && (
            <li className="p-4 text-center text-gray-500">No trips found.</li>
          )}
        </ul>
      </div>
    </div>
  )
}
