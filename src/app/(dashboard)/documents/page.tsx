import { createClient } from '@/utils/supabase/server'

export default async function DocumentsPage() {
  const supabase = await createClient()
  const { data: documents } = await supabase.from('documents').select('*, users(first_name, last_name)').order('uploaded_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Document Vault</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Upload Document</button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents?.map((doc) => (
            <li key={doc.id} className="border border-gray-200 rounded-lg p-4 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-medium text-gray-900 truncate pr-4">{doc.type.toUpperCase()}</h3>
                  {doc.expiry_date && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      Expires: {new Date(doc.expiry_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">Linked to: {doc.entity_type} ({doc.entity_id.split('-')[0]})</p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500 border-t pt-2">
                <span>By {doc.users?.first_name}</span>
                <a href={doc.file_url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-900">View File &rarr;</a>
              </div>
            </li>
          ))}
          {(!documents || documents.length === 0) && (
            <div className="col-span-full text-center text-gray-500 py-4">No documents found in the vault.</div>
          )}
        </ul>
      </div>
    </div>
  )
}
