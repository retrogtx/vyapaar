import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"

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
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to your Dashboard</h1>
      <p className="text-xl mb-4">Hello, {session.user?.name || 'User'}!</p>
      <SignOutButton />
    </div>
  )
}
