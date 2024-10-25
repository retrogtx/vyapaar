import { signIn } from "@/auth"
import { Button } from "@/components/ui/button"

export default function SignIn() {
  async function handleSignIn() {
    'use server'
    await signIn("google")
  }

  return (
    <form action={handleSignIn} className="mt-4 w-full max-w-md">
      <Button>
        Sign in with Google
      </Button>
    </form>
  )
}
