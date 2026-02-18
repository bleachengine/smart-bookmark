"use client"

import { useEffect } from "react"
import { supabase } from "../lib/supabase"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.push("/dashboard")                 // auto redirect to dashboard if bro alr loggedin
      }
    })
  }, [router])

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({           //sb oauth login using google
      provider: "google"
    })
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-black text-white rounded-lg"
      >
        Sign in with Google
      </button>
    </main>
  )
}
