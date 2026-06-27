import { getSuppliers } from '@/app/actions/core'

export default async function SuppliersPage() {
  const suppliers = await getSuppliers()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Suppliers</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Request Supplier Addition</button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {suppliers?.map((supplier) => (
          <div key={supplier.id} className="border border-gray-200 rounded-md p-4 hover:shadow-lg transition">
            <h3 className="text-lg font-medium text-gray-900">{supplier.name}</h3>
            <p className="text-sm text-gray-500 mb-2 capitalize">{supplier.category} &bull; {supplier.status}</p>
            <p className="text-sm text-gray-600">Terms: {supplier.payment_terms || 'N/A'}</p>
          </div>
        ))}
        {(!suppliers || suppliers.length === 0) && (
          <div className="col-span-full p-4 text-center text-gray-500">No suppliers found.</div>
        )}
      </div>
    </div>
  )
}
