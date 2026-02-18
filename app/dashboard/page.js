"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      console.log("Teestbfddovdfvdomosp:",data)
      if (!data.user) {
        router.push("/")
      } else {
        setUser(data.user)
      }
    }

    checkUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (!user) return null

  return (
    <main className="flex min-h-screen items-center justify-center flex-col gap-4">
      <p>Welcome, {user.email}</p>
      <button
        onClick={handleLogout}
        className="px-6 py-3 bg-red-500 text-white rounded-lg"
      >
        Logout
      </button>
    </main>
  )
}
