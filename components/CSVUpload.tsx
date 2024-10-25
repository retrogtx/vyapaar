/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from 'react'
import { useToast } from "@/hooks/use-toast"

export default function CSVUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploaded, setIsUploaded] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
      setIsUploaded(false) // Reset upload state when a new file is selected
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload.",
        variant: "destructive",
      })
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload-csv', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "CSV file uploaded successfully.",
        })
        setFile(null)
        setIsUploaded(true) // Set upload state to true
      } else {
        throw new Error('File upload failed')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload CSV file. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Upload Customer Data CSV</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="csvFile" className="block text-sm font-medium text-gray-700">
            Select CSV file
          </label>
          <input
            type="file"
            id="csvFile"
            accept=".csv"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          disabled={isUploaded} // Disable button if upload is complete
        >
          {isUploaded ? 'Uploaded' : 'Upload CSV'}
        </button>
      </form>
    </div>
  )
}
