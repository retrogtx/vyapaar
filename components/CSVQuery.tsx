'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function CSVQuery() {
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleQuery = async () => {
    if (!query.trim() || isLoading) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/query-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()
      setResponse(data.reply)
    } catch (error) {
      console.error('Error querying CSV data:', error)
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Query CSV Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about the uploaded CSV data..."
            onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
            disabled={isLoading}
          />
          <Button onClick={handleQuery} disabled={isLoading}>
            {isLoading ? 'Querying...' : 'Query'}
          </Button>
          {response && (
            <div className="mt-4">
              <h3 className="font-bold">Response:</h3>
              <p>{response}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
