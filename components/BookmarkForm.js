"use client"

import { useState } from "react"
import { supabase } from "../lib/supabase"
import { Plus } from "lucide-react"

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
   <div className="bg-white rounded-2xl shadow-lg p-6 w-full">
  <h2 className="text-xl font-semibold mb-6 text-gray-800">
    Add New Bookmark
  </h2>

  <form
    onSubmit={handleSubmit}
    className="flex flex-col md:flex-row items-stretch gap-4"
  >
    <input
      type="text"
      placeholder="Title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    />

    <input
      type="text"
      placeholder="URL"
      value={url}
      onChange={(e) => setUrl(e.target.value)}
      className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    />

    <button
      type="submit"
      disabled={loading}
      className="cursor-pointer flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:scale-105 transition disabled:opacity-50"
    >
      <Plus size={18} />
      {loading ? "Adding..." : "Add"}
    </button>
  </form>
</div>

  )
}