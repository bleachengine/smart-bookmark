"use client"

import { useState } from "react"
import { supabase } from "../lib/supabase"
import { Plus } from "lucide-react"
import { Space_Grotesk } from "next/font/google"

const headingFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["600"],
})

export default function BookmarkForm({ user, onBookmarkAdded }) {
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title || !url) return

    setLoading(true)

    const { error } = await supabase
      .from("bookmarks")
      .insert([
        {
          title,
          url,
          user_id: user.id,
        },
      ])

    setLoading(false)

    if (!error) {
      setTitle("")
      setUrl("")
      onBookmarkAdded()
    }
  }

  return (
    <div className="w-full rounded-3xl border border-slate-200/70 bg-white/80 p-5 shadow-lg shadow-slate-200/40 backdrop-blur-sm sm:p-6">
      <h2 className={`${headingFont.className} mb-5 text-2xl font-semibold tracking-tight text-slate-900`}>
        Add Bookmark
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto]"
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-xl border border-slate-300/80 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-500 focus:border-slate-500 focus:outline-none"
        />

        <input
          type="text"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="rounded-xl border border-slate-300/80 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-500 focus:border-slate-500 focus:outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-medium text-white transition hover:bg-slate-700 disabled:opacity-50"
        >
          <Plus size={18} />
          {loading ? "Adding..." : "Add"}
        </button>
      </form>
    </div>

  )
}
