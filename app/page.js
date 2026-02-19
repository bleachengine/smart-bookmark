"use client"

import { useEffect } from "react"
import { supabase } from "../lib/supabase"
import { useRouter } from "next/navigation"
import { Space_Grotesk, Manrope } from "next/font/google"

const headingFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["600", "700"],
})

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500"],
})

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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#dbeafe_0%,_#eff6ff_42%,_#f8fafc_72%,_#ffffff_100%)] px-6">
      <section className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center">
        <div className="w-full rounded-3xl border border-slate-200/70 bg-white/80 p-8 text-center shadow-xl shadow-slate-300/20 backdrop-blur-sm sm:p-12">
          <p className={`${bodyFont.className} mb-3 text-xs tracking-[0.24em] text-slate-500 uppercase`}>
            Your Personal Link Hub
          </p>

          <h1 className={`${headingFont.className} text-4xl font-bold text-slate-900 sm:text-5xl`}>
            SmartBookmark
          </h1>

          <p className={`${bodyFont.className} mx-auto mt-4 max-w-md text-lg text-slate-600`}>
            Add, manage, revisit bookmarks.
          </p>

          <button
            onClick={handleLogin}
            className={`${bodyFont.className} mx-auto mt-10 flex cursor-pointer items-center gap-3 rounded-xl border border-slate-900 bg-slate-900 px-6 py-3 text-white transition-colors duration-300 hover:bg-white hover:text-slate-900`}
          >
            <span>Sign in with Google</span>
            <img src="/Google_G_logo.svg" alt="Google" />
          </button>
        </div>
      </section>
    </main>
  )
}
