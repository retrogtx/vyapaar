import { auth } from "@/auth"
import { redirect } from "next/navigation"
import AIChat from "@/components/ai-chat"
import CSVUpload from "@/components/CSVUpload"
import CSVQuery from "@/components/CSVQuery"
import GettingStartedGuide from "@/components/getting-started"

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
      </div>

      <GettingStartedGuide />
      <CSVUpload />
      <CSVQuery />
      <AIChat />
    </div>
  )
}
