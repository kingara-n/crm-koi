import { getQuotations } from '@/app/actions/sales'

export default async function SalesPipelinePage() {
  const quotations = await getQuotations()

  // Simplified Kanban columns based on stages
  const columns = ['new_request', 'quotation_in_progress', 'quotation_sent', 'confirmed', 'lost']

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Sales Pipeline</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">New Quotation</button>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex space-x-4 min-w-max pb-4 h-full">
          {columns.map(column => (
            <div key={column} className="w-80 bg-gray-100 rounded-lg flex flex-col">
              <div className="p-3 bg-gray-200 rounded-t-lg font-semibold text-gray-700 uppercase text-sm">
                {column.replace(/_/g, ' ')}
              </div>
              <div className="p-2 flex-1 overflow-y-auto space-y-2">
                {quotations?.filter(q => q.stage === column).map(quotation => (
                  <div key={quotation.id} className="bg-white p-3 rounded shadow-sm border border-gray-200 hover:shadow-md cursor-pointer">
                    <p className="text-sm font-medium text-gray-900">{quotation.clients?.first_name} {quotation.clients?.last_name}</p>
                    <p className="text-xs text-gray-500 mt-1">{quotation.trips?.title || 'No trip linked'}</p>
                    <div className="mt-2 text-xs flex justify-between items-center">
                      <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded">{quotation.currency} {quotation.value}</span>
                      <span className="text-gray-400">{(quotation.progress_percentage || 0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
