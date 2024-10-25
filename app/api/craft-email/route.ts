import { NextRequest, NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import { db } from '@/db';
import { customers } from '@/db/schema';
import { Resend } from 'resend';
import { EmailTemplate } from '@/components/email-template';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { product, region } = await request.json();

    // Fetch customer data based on the region
    const allCustomers = await db.select().from(customers).execute();
    const filteredCustomers = allCustomers.filter(customer => customer.state === region);

    if (filteredCustomers.length === 0) {
      return NextResponse.json({ error: `No customers found in ${region}` }, { status: 404 });
    }

    // Use Groq LLM to generate email content
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant that crafts emails." },
        { role: "user", content: `Please create a good advertisement email for my ${product} for my customers living in ${region}.` }
      ],
      model: "llama-3.2-90b-text-preview",
    });

    const emailContent = completion.choices[0]?.message?.content;

    if (!emailContent) {
      return NextResponse.json({ error: 'Failed to generate email content' }, { status: 500 });
    }

    // Send the email to the filtered customers
    const emailAddresses = filteredCustomers.map(customer => customer.email);
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: emailAddresses,
      subject: `Special Offer on ${product} for ${region} Customers`,
      react: EmailTemplate({ firstName: 'Customer', content: emailContent }),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ message: 'Emails sent successfully', data });
  } catch (error) {
    console.error('Error crafting and sending email:', error);
    return NextResponse.json({ error: 'Failed to craft and send email' }, { status: 500 });
  }
}
