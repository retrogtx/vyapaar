import { NextRequest, NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import { db } from '@/db';
import { customers } from '@/db/schema';
import { Resend } from 'resend';
import { EmailTemplate } from '@/components/email-template';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { product, region, previewOnly } = await request.json();

    // Fetch customer data based on the region
    const allCustomers = await db.select().from(customers).execute();
    console.log('All customers:', allCustomers.length);
    
    const filteredCustomers = allCustomers.filter(customer => 
      customer.state?.toLowerCase() === region.toLowerCase()
    );
    console.log('Filtered customers:', filteredCustomers.length);
    console.log('Filtered customers details:', filteredCustomers);

    if (filteredCustomers.length === 0) {
      return NextResponse.json({ 
        error: `No customers found in ${region}` 
      }, { status: 404 });
    }

    // Use Groq LLM to generate email content
    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are a marketing expert that crafts compelling, personalized email content. Keep the tone professional but friendly." 
        },
        { 
          role: "user", 
          content: `Create a marketing email for ${product} targeting customers in ${region}. Include a compelling subject line and a clear call to action.` 
        }
      ],
      model: "llama-3.2-90b-text-preview",
    });

    const emailContent = completion.choices[0]?.message?.content;

    if (!emailContent) {
      return NextResponse.json({ 
        error: 'Failed to generate email content' 
      }, { status: 500 });
    }

    // If this is just a preview request, return the content
    if (previewOnly) {
      return NextResponse.json({ 
        emailContent,
        recipientCount: filteredCustomers.length 
      });
    }

    console.log('Starting to send emails to:', filteredCustomers.map(c => c.email));

    // Send emails individually to each customer
    const emailPromises = filteredCustomers.map(async (customer) => {
      try {
        console.log(`Attempting to send email to ${customer.email}`);
        const result = await resend.emails.send({
          from: 'Vyapaar <onboarding@resend.dev>',
          to: [customer.email],
          subject: `Special Offer on ${product} for ${region} Customers`,
          react: EmailTemplate({ 
            firstName: customer.name || 'Valued Customer',
            content: emailContent 
          }),
        });
        console.log(`Email sent successfully to ${customer.email}`, result);
        
        // Add delay after sending each email
        await delay(1000);
        
        return { success: true, data: result };
      } catch (error) {
        console.error(`Failed to send email to ${customer.email}:`, error);
        return { success: false, error, email: customer.email };
      }
    });

    // Wait for all emails to be sent
    const results = await Promise.all(emailPromises);
    console.log('Email sending results:', results);

    // Count successful sends
    const successfulSends = results.filter(result => result.success).length;
    const failedSends = results.filter(result => !result.success).length;

    console.log(`Successful sends: ${successfulSends}, Failed sends: ${failedSends}`);

    if (successfulSends === 0) {
      return NextResponse.json({ 
        error: 'Failed to send any emails' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Emails sent successfully', 
      recipientCount: successfulSends,
      failedCount: failedSends,
      totalAttempted: filteredCustomers.length,
      results: results // Include detailed results in response
    });

  } catch (error) {
    console.error('Error crafting and sending email:', error);
    return NextResponse.json({ 
      error: 'Failed to craft and send email' 
    }, { status: 500 });
  }
}
