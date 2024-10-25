import { NextRequest, NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY is not defined in environment variables');
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { lead, matchedTopics, template } = await request.json();

    // Get template style
    const styles = {
      casual: "friendly and conversational",
      professional: "formal and business-focused",
      direct: "concise and straightforward"
    };
    
    const style = styles[template as keyof typeof styles] || styles.casual;

    const prompt = `
      As a business development expert, create a ${style} outreach message for a potential lead with the following details:
      
      Name: ${lead.name}
      Twitter Username: @${lead.username}
      Bio: ${lead.bio || 'No bio available'}
      Recent Tweet: "${lead.tweet}"
      Topics of Interest: ${matchedTopics.join(', ')}
      Follower Count: ${lead.followerCount.toLocaleString()}

      Requirements for the message:
      1. Keep it brief and conversational (2-3 sentences)
      2. Reference their recent tweet or bio naturally
      3. Mention our shared interest in: ${matchedTopics.join(', ')}
      4. Include a soft call to action (like asking for a quick chat)
      5. Match the ${style} style
      6. Don't be overly sales-focused

      Generate only the message without any additional formatting or context.
    `;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert at writing personalized, engaging outreach messages that start meaningful business conversations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.2-90b-text-preview",  // Changed to Llama
      temperature: 0.7,
      max_tokens: 200,
      top_p: 1,
      stream: false,
    });

    const message = completion.choices[0]?.message?.content?.trim();

    if (!message) {
      throw new Error('No message generated');
    }

    return NextResponse.json({ 
      message,
      status: 'success' 
    });

  } catch (error) {
    console.error('Error generating message:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to generate message' 
    }, { 
      status: 500 
    });
  }
}
