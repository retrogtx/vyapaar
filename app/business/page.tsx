import { db } from "@/db"
import { customers } from "@/db/schema"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import BusinessMetricsChart from "@/components/business-metrics-chart"
import BusinessPredictionChart from "@/components/business-prediction-chart"
import { Groq } from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

interface BusinessMetrics {
  totalExpenses: number;
  avgGrowthRate: number;
  avgOrderValue: number;
  avgSatisfaction: number;
  totalCustomers: number;
}

async function getBusinessData() {
  const data = await db.select().from(customers).execute()
  return data
}

async function getPredictions(metrics: BusinessMetrics) {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a business analytics expert that provides growth predictions based on historical data. Always return predictions as arrays of 6 numbers."
        },
        {
          role: "user",
          content: `Based on these business metrics, predict the next 6 months of growth rates (as percentages), expenses (as absolute values), and satisfaction scores (1-10).
          Return only JSON data in this format: 
          {
            "growthRates": [6 numbers representing monthly growth %],
            "expenses": [6 numbers representing monthly expenses],
            "satisfaction": [6 numbers between 1-10]
          }
          Current metrics: ${JSON.stringify(metrics)}`
        }
      ],
      model: "llama3-70b-8192",
      temperature: 0.2,
    })

    const prediction = JSON.parse(completion.choices[0]?.message?.content || "{}")
    
    // Validate and provide fallback values if needed
    const fallbackPrediction = {
      growthRates: Array(6).fill(metrics.avgGrowthRate || 5),
      expenses: Array(6).fill(metrics.totalExpenses / 12 || 10000),
      satisfaction: Array(6).fill(metrics.avgSatisfaction || 7)
    }

    return {
      growthRates: prediction.growthRates?.length === 6 ? prediction.growthRates : fallbackPrediction.growthRates,
      expenses: prediction.expenses?.length === 6 ? prediction.expenses : fallbackPrediction.expenses,
      satisfaction: prediction.satisfaction?.length === 6 ? prediction.satisfaction : fallbackPrediction.satisfaction
    }
  } catch (error) {
    console.error("Failed to get predictions:", error)
    // Return reasonable default predictions based on current metrics
    return {
      growthRates: Array(6).fill(metrics.avgGrowthRate || 5),  // 5% growth default
      expenses: Array(6).fill(metrics.totalExpenses / 12 || 10000),  // Monthly average or 10k default
      satisfaction: Array(6).fill(metrics.avgSatisfaction || 7)  // 7/10 satisfaction default
    }
  }
}

export default async function BusinessPage() {
  const businessData = await getBusinessData()

  // Calculate averages and totals
  const metrics = businessData.reduce((acc, curr) => ({
    totalExpenses: acc.totalExpenses + (curr.businessExpenses || 0),
    avgGrowthRate: acc.avgGrowthRate + (curr.businessGrowthRate || 0),
    avgOrderValue: acc.avgOrderValue + (curr.averageOrderValue || 0),
    avgSatisfaction: acc.avgSatisfaction + (curr.customerSatisfactionScore || 0),
    totalCustomers: acc.totalCustomers + 1
  }), {
    totalExpenses: 0,
    avgGrowthRate: 0,
    avgOrderValue: 0,
    avgSatisfaction: 0,
    totalCustomers: 0
  })

  // Calculate final averages
  metrics.avgGrowthRate = metrics.avgGrowthRate / metrics.totalCustomers
  metrics.avgOrderValue = metrics.avgOrderValue / metrics.totalCustomers
  metrics.avgSatisfaction = metrics.avgSatisfaction / metrics.totalCustomers

  // Get AI predictions
  const predictions = await getPredictions(metrics)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Business Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <BusinessMetricsChart data={businessData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Growth Predictions</CardTitle>
          </CardHeader>
          <CardContent>
            <BusinessPredictionChart predictions={predictions} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Key Performance Indicators</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold">₹{metrics.totalExpenses.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Growth Rate</p>
              <p className="text-2xl font-bold">{metrics.avgGrowthRate.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Order Value</p>
              <p className="text-2xl font-bold">₹{metrics.avgOrderValue.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Customers</p>
              <p className="text-2xl font-bold">{metrics.totalCustomers}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Satisfaction</p>
              <p className="text-2xl font-bold">{metrics.avgSatisfaction.toFixed(1)}/10</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Business Expenses</TableHead>
                <TableHead>Growth Rate</TableHead>
                <TableHead>Satisfaction Score</TableHead>
                <TableHead>Average Order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {businessData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>₹{item.businessExpenses?.toLocaleString()}</TableCell>
                  <TableCell>{item.businessGrowthRate}%</TableCell>
                  <TableCell>{item.customerSatisfactionScore}/10</TableCell>
                  <TableCell>₹{item.averageOrderValue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
