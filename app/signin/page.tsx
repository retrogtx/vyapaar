import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { signIn } from "@/auth"

export default function GoogleSignIn() {
  async function handleGoogleSignIn() {
    'use server'
    await signIn("google")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-white">Sign in to your account</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleGoogleSignIn}>
            <Button 
              type="submit"
              variant="outline" 
              className="w-full flex items-center justify-center bg-gray-700 text-white hover:bg-gray-600 border-gray-600"
            >
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
              </svg>
              Sign in with Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
