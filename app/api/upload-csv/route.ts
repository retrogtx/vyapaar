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

    console.log('Parsed CSV Records:', records) // Log parsed records

    // Process and insert the records into the database
    for (const record of records) {
      try {
        console.log('Inserting record:', record) // Log each record before insertion
        const customerData = {
          id: uuidv4(),
          name: record.Name || record.name,
          email: record.Email || record.email,
          gender: record.Gender || record.gender,
          phone: record.Phone || record.phone,
          city: record.City || record.city,
          state: record.State || record.state,
          purchaseHistory: record.PurchaseHistory || record.purchaseHistory,
          lastInteractionDate: record.LastInteractionDate || record.lastInteractionDate,
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
              lastInteractionDate: customerData.lastInteractionDate,
            }
          })
      } catch (dbError) {
        console.error('Database error:', dbError)
        return NextResponse.json({ error: 'Database error occurred' }, { status: 500 })
      }
    }

    return NextResponse.json({ message: 'CSV data processed successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error processing CSV:', error)
    return NextResponse.json({ error: 'Failed to process CSV data' }, { status: 500 })
  }
}
