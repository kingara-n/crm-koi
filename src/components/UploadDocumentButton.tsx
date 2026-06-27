'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function UploadDocumentButton() {
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      // 1. Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // 2. Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `documents/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // 3. Get public URL (or signed URL depending on bucket privacy)
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath)

      // 4. Save record to documents table
      const { error: dbError } = await supabase.from('documents').insert({
        entity_type: 'client', // Defaulting to client for demo
        entity_id: user.id, // Using user id as a proxy for demo
        type: 'general',
        file_url: publicUrl,
        uploaded_by: user.id
      })

      if (dbError) throw dbError

      alert('Document uploaded successfully!')
      router.refresh() // Refresh the page to show new document
    } catch (error: any) {
      alert('Error uploading document: ' + error.message)
    } finally {
      setIsUploading(false)
      // Reset input
      e.target.value = ''
    }
  }

  return (
    <div className="relative">
      <input
        type="file"
        id="document-upload"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleUpload}
        disabled={isUploading}
      />
      <label
        htmlFor="document-upload"
        className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
          isUploading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
        }`}
      >
        {isUploading ? 'Uploading...' : 'Upload Document'}
      </label>
    </div>
  )
}
