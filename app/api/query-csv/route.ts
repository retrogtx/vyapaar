import { NextRequest, NextResponse } from 'next/server'
import { Groq } from 'groq-sdk'
import { db } from '@/db'
import { customers } from '@/db/schema'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: NextRequest) {
  const { query } = await request.json()

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: 'GROQ_API_KEY is not set' }, { status: 500 })
  }

  try {
    // Fetch all customer data from the database
    const allCustomers = await db.select().from(customers).execute()

    // Convert customer data to a string representation
    const customerData = JSON.stringify(allCustomers, null, 2)

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant that answers questions about customer data." },
        { role: "user", content: `Here is the customer data:\n\n${customerData}\n\nQuestion: ${query}` }
      ],
      model: "llama-3.2-90b-text-preview",
    })

    const reply = completion.choices[0]?.message?.content

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Error querying LLM:', error)
    return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 })
  }
}
