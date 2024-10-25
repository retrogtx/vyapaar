"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface Insight {
  id: number
  title: string
}

export default function CampaignInsights() {
  const [insights, setInsights] = useState<Insight[]>([])

  useEffect(() => {
    // Fetch campaign insights from API
    // This is a placeholder, replace with actual API call
    setInsights([
      { id: 1, title: "Email campaign performance improved by 15%" },
      { id: 2, title: "Social media engagement up 20% this month" },
    ])
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {insights.map((insight) => (
            <li key={insight.id}>{insight.title}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
