"use client"

import { useState } from "react"
import { supabase } from "../lib/supabase"

 function BookmarkForm({ user, onBookmarkAdded }) {
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")

  const handleAddBookmark = async (e) => {
    e.preventDefault()

    if (!title || !url) return

    const { error } = await supabase
      .from("bookmarks")
      .insert([
        {
          title,
          url,
          user_id: user.id
        }
      ])

    if (error) {
      console.log("Insert error:", error.message)
    } else {
      setTitle("")
      setUrl("")
      onBookmarkAdded() 
    }
  }

  return (
    <form
      onSubmit={handleAddBookmark}
      className="flex flex-col gap-3 w-80"
    >
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="text"
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="border p-2 rounded"
      />
      <button
        type="submit"
        className="bg-black text-white py-2 rounded"
      >
        Add Bookmark
      </button>
    </form>
  )
}


export default BookmarkForm