'use client'

import { Button } from '@/components/ui/button'
import { createBrowserClient } from '@/utils/supabase'

export function LoginButton() {
  const supabase = createBrowserClient()

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      console.error('Error logging in with Google:', error.message)
    }
  }

  return (
    <Button variant="outline" onClick={handleGoogleLogin}>
      Sign in with Google
    </Button>
  )
}
