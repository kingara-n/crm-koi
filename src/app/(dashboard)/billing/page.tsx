import { getInvoices, getCurrentExchangeRates } from '@/app/actions/billing'

export default async function BillingPage() {
  const invoices = await getInvoices()
  const exchangeRates = await getCurrentExchangeRates()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Billing & Finance</h2>
        <div className="space-x-4">
          <button className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50">Manage FX Rates</button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Create Invoice</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* FX Rate Panel */}
        <div className="bg-white shadow rounded-lg p-4 border border-gray-200 lg:col-span-1 h-fit">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Current FX Rates</h3>
          <ul className="space-y-3">
            {exchangeRates?.map(rate => (
              <li key={rate.id} className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-700">{rate.currency_pair}</span>
                <span className="text-indigo-600">{rate.rate}</span>
              </li>
            ))}
            {(!exchangeRates || exchangeRates.length === 0) && (
              <li className="text-sm text-gray-500">No rates set for this month.</li>
            )}
          </ul>
        </div>

        {/* Invoices List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg lg:col-span-3 border border-gray-200">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
             <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Invoices</h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {invoices?.map((invoice) => (
              <li key={invoice.id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium text-indigo-600">
                    Invoice #{invoice.id.split('-')[0]} - {invoice.clients?.first_name} {invoice.clients?.last_name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">Due: {new Date(invoice.due_date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 
                      invoice.status === 'overdue' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                    {invoice.status}
                  </span>
                  <span className="text-sm font-medium text-gray-900">{invoice.currency}</span>
                </div>
              </li>
            ))}
            {(!invoices || invoices.length === 0) && (
              <li className="p-4 text-center text-gray-500">No invoices found.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
