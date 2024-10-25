import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'twitter-api-sdk';
import { db } from '@/db';
import { leads } from '@/db/schema';

// Define interfaces for type safety
interface Filter {
  type: 'followerCount' | 'engagement';
  minFollowers?: number;
  minEngagement?: number;
}

interface TwitterUser {
  id: string;
  username: string;
  name: string;
  description?: string;
  public_metrics?: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
    listed_count: number;
  };
}

interface Tweet {
  id: string;
  author_id: string;
  text: string;
  public_metrics?: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
}

interface TwitterResponse {
  data: Tweet[];
  includes?: {
    users?: TwitterUser[];
  };
}

interface Lead {
  id: string;
  username: string;
  name: string;
  bio?: string;
  tweet: string;
  followerCount: number;
  topics: string[];
}

if (!process.env.X_BEARER) {
  throw new Error('X_BEARER token is not defined in environment variables');
}

// Create client with the X bearer token
const twitterClient = new Client(process.env.X_BEARER);

export async function POST(request: NextRequest) {
  try {
    // Validate Twitter client
    if (!twitterClient) {
      return NextResponse.json({ 
        error: 'Twitter client not initialized' 
      }, { status: 500 });
    }

    const { topics, filters } = await request.json() as {
      topics: string[];
      filters: Filter[];
    };

    // Validate input
    if (!Array.isArray(topics) || topics.length === 0) {
      return NextResponse.json({ 
        error: 'Topics must be a non-empty array' 
      }, { status: 400 });
    }

    // Create search query from topics
    const searchQuery = topics.map((topic: string) => `"${topic}"`).join(' OR ');

    console.log('Searching Twitter with query:', searchQuery); // Debug log

    // Get tweets matching the search query
    const tweets = await twitterClient.tweets.tweetsRecentSearch({
      query: searchQuery,
      "tweet.fields": ["created_at", "author_id", "public_metrics"],
      "user.fields": ["name", "username", "description", "public_metrics"],
      expansions: ["author_id"],
      max_results: 100,
    }) as TwitterResponse;

    if (!tweets.data || tweets.data.length === 0) {
      return NextResponse.json({ 
        leads: [], 
        count: 0,
        message: 'No tweets found matching the criteria'
      });
    }

    // Process and filter tweets
    const relevantLeads = tweets.data.filter((tweet: Tweet) => {
      return filters.every((filter: Filter) => {
        switch (filter.type) {
          case 'followerCount': {
            const user = tweets.includes?.users?.find(u => u.id === tweet.author_id);
            return (user?.public_metrics?.followers_count ?? 0) >= (filter.minFollowers ?? 0);
          }
          case 'engagement': {
            const engagement = (tweet.public_metrics?.retweet_count ?? 0) + 
                             (tweet.public_metrics?.like_count ?? 0);
            return engagement >= (filter.minEngagement ?? 0);
          }
          default:
            return true;
        }
      });
    });

    // Store leads in database
    if (relevantLeads.length > 0) {
      const savedLeads = await Promise.all(relevantLeads.map(async (lead: Tweet) => {
        const user = tweets.includes?.users?.find(u => u.id === lead.author_id);
        
        if (!user || !lead.author_id || !lead.text) {
          console.warn('Skipping lead due to missing data:', { lead, user });
          return null;
        }

        try {
          await db.insert(leads).values({
            id: lead.id,
            twitterId: lead.author_id,
            username: user.username,
            name: user.name,
            bio: user.description ?? '',
            tweet: lead.text,
            followerCount: user.public_metrics?.followers_count ?? 0,
            createdAt: new Date(),
            topics: topics,
          });

          const newLead: Lead = {
            id: lead.id,
            username: user.username,
            name: user.name,
            bio: user.description,
            tweet: lead.text,
            followerCount: user.public_metrics?.followers_count ?? 0,
            topics
          };

          return newLead;
        } catch (error) {
          console.error('Error saving lead to database:', error);
          return null;
        }
      }));

      const validLeads = savedLeads.filter((lead): lead is Lead => lead !== null);

      return NextResponse.json({ 
        leads: validLeads,
        count: validLeads.length,
        message: 'Leads fetched and saved successfully'
      });
    }

    return NextResponse.json({ 
      leads: [],
      count: 0,
      message: 'No relevant leads found'
    });

  } catch (error) {
    console.error('Error monitoring Twitter:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to monitor Twitter' 
    }, { status: 500 });
  }
}
