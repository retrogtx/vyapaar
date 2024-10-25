import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'twitter-api-sdk';
import { db } from '@/db';
import { leads } from '@/db/schema';
/**
 * 
 * IMPORTANT, THIS DOESNT WORKKK BECAUSE WE ARE BROKE TO BUY API, BUT IT WORKS WITH THE RIGHT PREMIUM API:
Limitations of Free API Access
User Lookup Restrictions:
The free Twitter developer account does not allow you to look up user data from Twitter, except for your own account, and even this is extremely limited24. Attempts to use functions like lookup_users() will result in errors due to insufficient permissions2.
Data Retrieval:
You cannot retrieve tweets or timelines from other users. The only available endpoint for free access is GET /2/users/me, which provides information about your own account45.
Posting Capability:
While you can post tweets and interact with your own account, retrieving data such as tweets from other users or performing complex queries is restricted under the free tier45.
 */

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

// Validate required environment variables
if (!process.env.X_BEARER) {
  throw new Error('X_BEARER token is not defined in environment variables');
}

// Initialize Twitter client with bearer token for App-only authentication
const twitterClient = new Client(process.env.X_BEARER);

export async function POST(request: NextRequest) {
  // Define topics at the top level of the function so it's available in catch block
  let topics: string[] = [];
  
  try {
    // Validate Twitter client
    if (!twitterClient) {
      return NextResponse.json({ 
        error: 'Twitter client not initialized' 
      }, { status: 500 });
    }

    // Extract and store topics from request
    const { topics: requestTopics, filters } = await request.json() as {
      topics: string[];
      filters: Filter[];
    };
    
    // Assign to our top-level topics variable
    topics = requestTopics;

    // Validate input
    if (!Array.isArray(topics) || topics.length === 0) {
      return NextResponse.json({ 
        error: 'Topics must be a non-empty array' 
      }, { status: 400 });
    }

    // Build an advanced search query following X API guidelines
    const searchQuery = topics.map((topic: string) => {
      const formattedTopic = topic.includes(' ') ? `"${topic}"` : topic;
      return `(${formattedTopic})`; 
    }).join(' OR ');

    // Add search operators for better results
    const enhancedQuery = `${searchQuery} -is:retweet -is:reply lang:en has:mentions min_faves:5`;
    
    console.log('Searching X with query:', enhancedQuery);

    const tweets = await twitterClient.tweets.tweetsRecentSearch({
      query: enhancedQuery,
      max_results: 100,
      "tweet.fields": [
        "created_at",
        "author_id",
        "public_metrics",
        "entities",
        "context_annotations",
        "conversation_id",
        "in_reply_to_user_id"
      ],
      "user.fields": [
        "name",
        "username",
        "description",
        "public_metrics",
        "verified",
        "location",
        "url"
      ],
      "expansions": [
        "author_id",
        "entities.mentions.username",
        "referenced_tweets.id",
        "referenced_tweets.id.author_id"
      ],
    }) as TwitterResponse;

    // Enhanced error handling
    if (!tweets.data || tweets.data.length === 0) {
      console.log('No tweets found for query:', enhancedQuery);
      return NextResponse.json({ 
        leads: [], 
        count: 0,
        message: `No tweets found matching: ${topics.join(', ')}`
      });
    }

    // Process and filter tweets with improved engagement metrics
    const relevantLeads = tweets.data.filter((tweet: Tweet) => {
      return filters.every((filter: Filter) => {
        switch (filter.type) {
          case 'followerCount': {
            const user = tweets.includes?.users?.find(u => u.id === tweet.author_id);
            const followerCount = user?.public_metrics?.followers_count ?? 0;
            return followerCount >= (filter.minFollowers ?? 0);
          }
          case 'engagement': {
            const metrics = tweet.public_metrics;
            const engagement = (metrics?.retweet_count ?? 0) + 
                             (metrics?.like_count ?? 0) +
                             (metrics?.reply_count ?? 0) +
                             (metrics?.quote_count ?? 0);
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
    console.error('Error monitoring X:', error);
    
    // Enhanced error handling with specific X API errors
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      
      if (errorMessage.includes('client-not-enrolled')) {
        return NextResponse.json({ 
          error: 'Please ensure your X API credentials are from a Project with appropriate access level',
          details: 'Visit https://developer.twitter.com/en/portal/projects-and-apps',
          topics
        }, { status: 403 });
      }
      
      if (errorMessage.includes('too many requests')) {
        return NextResponse.json({ 
          error: 'Rate limit exceeded. Please try again later.',
          topics
        }, { status: 429 });
      }

      if (errorMessage.includes('invalid token')) {
        return NextResponse.json({ 
          error: 'Authentication failed. Please check your X API credentials.',
          topics
        }, { status: 401 });
      }
    }

    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to monitor X',
      topics
    }, { status: 500 });
  }
}
