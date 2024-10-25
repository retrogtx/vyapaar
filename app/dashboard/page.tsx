import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"
import CustomerSegments from "@/components/customer-segments"
import CampaignInsights from "@/components/campaign-insights"
import AIChat from "@/components/ai-chat"
import CSVUpload from "@/components/CSVUpload"

function SignOutButton() {
  async function handleSignOut() {
    'use server'
    await signOut()
  }

  return (
    <form action={handleSignOut}>
      <button className="bg-white text-black font-bold py-2 px-4 rounded hover:bg-gray-200 transition-colors">
        Sign Out
      </button>
    </form>
  )
}

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect("/")
  }

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to your Dashboard</h1>
        <p className="text-xl mb-4">Hello, {session.user?.name || 'User'}!</p>
        <SignOutButton />
      </div>

      <h2 className="text-3xl font-bold mb-4">CRM Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CustomerSegments />
        <CampaignInsights />
      </div>
      <CSVUpload />
      <AIChat />
    </div>
  )
}
