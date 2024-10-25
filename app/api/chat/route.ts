import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: NextRequest) {
  const { messages } = await request.json()

  try {
    const completion = await groq.chat.completions.create({
      messages: messages,
      model: "mixtral-8x7b-32768",
    })

    const reply = completion.choices[0]?.message?.content

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Error calling Groq API:', error)
    return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 })
  }
}
