/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from 'react'
import { useToast } from "@/hooks/use-toast"

export default function CSVUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploaded, setIsUploaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
      setIsUploaded(false)
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

    setIsLoading(true)
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
        setIsUploaded(true)
      } else {
        throw new Error('File upload failed')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload CSV file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-black p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Upload Customer Data CSV</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="csvFile" className="block text-sm font-medium text-gray-400">
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
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isUploaded || isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </span>
          ) : isUploaded ? 'Uploaded' : 'Upload CSV'}
        </button>
      </form>
    </div>
  )
}
