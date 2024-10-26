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

    for (const record of records) {
      try {
        console.log('Inserting record:', record)
        
        const rawCustomerData = {
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

        const customerData = {
          ...rawCustomerData,
          businessExpenses: Number(rawCustomerData.businessExpenses) || 0,
          businessGrowthRate: Number(rawCustomerData.businessGrowthRate) || 0,
          customerSatisfactionScore: Number(rawCustomerData.customerSatisfactionScore) || 0,
          loyaltyPoints: Number(rawCustomerData.loyaltyPoints) || 0,
          averageOrderValue: Number(rawCustomerData.averageOrderValue) || 0,
          age: Number(rawCustomerData.age) || 0
        };
        if (!customerData.businessExpenses && 
            !customerData.businessGrowthRate && 
            !customerData.customerSatisfactionScore) {
          throw new Error('Invalid numerical values in CSV');
        }

        await db.insert(customers).values(customerData)
          .onConflictDoUpdate({
            target: [customers.email],
            set: {
              ...(customerData.name && { name: customerData.name }),
              ...(customerData.gender && { gender: customerData.gender }),
              ...(customerData.phone && { phone: customerData.phone }),
              ...(customerData.city && { city: customerData.city }),
              ...(customerData.state && { state: customerData.state }),
              ...(customerData.purchaseHistory && { purchaseHistory: customerData.purchaseHistory }),
              ...(customerData.age && { age: customerData.age }),
              ...(customerData.businessExpenses && { businessExpenses: customerData.businessExpenses }),
              ...(customerData.businessGrowthRate && { businessGrowthRate: customerData.businessGrowthRate }),
              ...(customerData.customerSatisfactionScore && { customerSatisfactionScore: customerData.customerSatisfactionScore }),
              ...(customerData.loyaltyPoints && { loyaltyPoints: customerData.loyaltyPoints }),
              ...(customerData.averageOrderValue && { averageOrderValue: customerData.averageOrderValue }),
              updatedAt: new Date()
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
