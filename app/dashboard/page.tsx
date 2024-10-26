'use client'

import { useSession } from "next-auth/react"
import AIChat from "@/components/ai-chat"
import CSVUpload from "@/components/CSVUpload"
import CSVQuery from "@/components/CSVQuery"
import GettingStartedGuide from "@/components/getting-started"
import { useToast } from "@/hooks/use-toast"
import { useEffect } from "react"

export default function DashboardPage() {
  const { toast } = useToast()
  const { data: session } = useSession()

  useEffect(() => {
    toast({
      title: "Welcome back!",
      description: "You're now viewing your dashboard.",
    })
  }, [toast])

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to your Dashboard</h1>
        <p className="text-xl mb-4">Hello, {session?.user?.name || 'User'}!</p>
      </div>

      <GettingStartedGuide />
      <CSVUpload />
      <CSVQuery />
      <AIChat />
    </div>
  )
}
