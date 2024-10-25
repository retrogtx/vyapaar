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
import CustomerLocationChart from "@/components/customer-location-chart"

async function getCustomers() {
  const data = await db.select().from(customers).execute()
  return data
}

function extractPurchaseCount(purchaseHistory: string | null): number {
  if (!purchaseHistory) return 0
  
  // Extract the first number from the string
  const match = purchaseHistory.match(/\d+/)
  if (match) {
    return Number(match[0])
  }
  return 0
}

export default async function CustomersPage() {
  const customerData = await getCustomers()

  // Debug: Log all customers and their purchase histories
  customerData.forEach(customer => {
    console.log(`Customer ${customer.name}:`, {
      purchaseHistory: customer.purchaseHistory,
      extracted: extractPurchaseCount(customer.purchaseHistory)
    })
  })

  // Find customer with most purchases
  const mostValuableCustomer = customerData.reduce((max, current) => {
    const currentValue = extractPurchaseCount(current.purchaseHistory)
    const maxValue = extractPurchaseCount(max.purchaseHistory)

    console.log('Comparing:', {
      current: current.name,
      currentValue,
      max: max.name,
      maxValue
    })

    return currentValue > maxValue ? current : max
  }, customerData[0])

  // Calculate purchase counts by state
  const stateStats = customerData.reduce((acc: { [key: string]: number }, customer) => {
    const state = customer.state || 'Unknown'
    const purchases = extractPurchaseCount(customer.purchaseHistory)
    acc[state] = (acc[state] || 0) + purchases
    return acc
  }, {})

  // Get top 3 states by purchase count
  const topStates = Object.entries(stateStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  const purchaseCount = extractPurchaseCount(mostValuableCustomer?.purchaseHistory)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Customer Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomerLocationChart customers={customerData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Customers</p>
              <p className="text-2xl font-bold">{customerData.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active States</p>
              <p className="text-2xl font-bold">
                {new Set(customerData.map(c => c.state)).size}
              </p>
            </div>
            <div className="col-span-2 border-t pt-4 mt-2">
              <p className="text-sm text-muted-foreground mb-1">Most Valuable Customer</p>
              <p className="text-xl font-semibold">{mostValuableCustomer?.name || 'N/A'}</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <span>{mostValuableCustomer?.city}, {mostValuableCustomer?.state}</span>
                <span className="mx-2">•</span>
                <span>{purchaseCount} purchases</span>
              </div>
            </div>
            <div className="col-span-2 border-t pt-4 mt-2">
              <p className="text-sm text-muted-foreground mb-2">Top States by Orders</p>
              {topStates.map(([state, count], index) => (
                <div key={state} className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <span className="text-lg font-semibold mr-2">{index + 1}.</span>
                    <span className="font-medium">{state}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {count} orders
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Purchase History</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customerData.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{`${customer.city}, ${customer.state}`}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.purchaseHistory}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
