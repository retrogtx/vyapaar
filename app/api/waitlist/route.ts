import { db } from "@/db/index";
import { waitlistUsers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Email validation regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validate email format
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
    }

    // Check if the email already exists in the waitlist
    const existingUser = await db.select().from(waitlistUsers).where(eq(waitlistUsers.email, email)).execute();

    if (existingUser.length > 0) {
      return NextResponse.json({ message: "Email already on the waitlist" }, { status: 400 });
    }

    // Insert the new email into the waitlist table
    await db.insert(waitlistUsers).values({
      email,
    }).execute();

    return NextResponse.json({ message: "Email added to waitlist successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error adding email to waitlist:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
