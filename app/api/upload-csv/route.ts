import { NextRequest, NextResponse } from 'next/server'
import { parse } from 'csv-parse/sync'
import { db } from '@/db'
import { customers } from '@/db/schema'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const csvContent = await file.text()

    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true
    })

    console.log('Parsed CSV Records:', records)

    // Process and insert the records into the database
    for (const record of records) {
      try {
        console.log('Inserting record:', record)
        
        // Create a properly typed customer data object
        const customerData = {
          id: uuidv4(),
          name: (record.Name || record.name || '') as string,
          email: (record.Email || record.email || '') as string,
          gender: (record.Gender || record.gender || '') as string,
          phone: (record.Phone || record.phone || '') as string,
          city: (record.City || record.city || '') as string,
          state: (record.State || record.state || '') as string,
          purchaseHistory: (record.PurchaseHistory || record.purchaseHistory || '') as string,
          age: parseInt(record.Age || record.age || '0'),
          businessExpenses: parseInt(record.BusinessExpenses || record.businessExpenses || '0'),
          businessGrowthRate: parseFloat(record.BusinessGrowthRate || record.businessGrowthRate || '0'),
          customerSatisfactionScore: parseInt(record.CustomerSatisfactionScore || record.customerSatisfactionScore || '0'),
          loyaltyPoints: parseInt(record.LoyaltyPoints || record.loyaltyPoints || '0'),
          averageOrderValue: parseInt(record.AverageOrderValue || record.averageOrderValue || '0'),
          createdAt: new Date(),
          updatedAt: new Date()
        }

        await db.insert(customers).values(customerData)
          .onConflictDoUpdate({
            target: [customers.email],
            set: {
              name: customerData.name,
              gender: customerData.gender,
              phone: customerData.phone,
              city: customerData.city,
              state: customerData.state,
              purchaseHistory: customerData.purchaseHistory,
              age: customerData.age,
              businessExpenses: customerData.businessExpenses,
              businessGrowthRate: customerData.businessGrowthRate,
              customerSatisfactionScore: customerData.customerSatisfactionScore,
              loyaltyPoints: customerData.loyaltyPoints,
              averageOrderValue: customerData.averageOrderValue,
              updatedAt: customerData.updatedAt
            }
          })
      } catch (dbError) {
        console.error('Database error:', dbError)
        return NextResponse.json({ 
          error: 'Database error occurred',
          details: dbError 
        }, { status: 500 })
      }
    }

    return NextResponse.json({ 
      message: 'CSV data processed successfully',
      recordCount: records.length 
    })

  } catch (error) {
    console.error('Error processing CSV:', error)
    return NextResponse.json({ 
      error: 'Failed to process CSV data',
      details: error 
    }, { status: 500 })
  }
}
