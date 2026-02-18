"use client"

import { supabase } from "../lib/supabase"

export default function BookmarkList({ bookmarks, onBookmarkDeleted }) {

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id)

    if (error) {
      console.log("Delete error:", error.message)
    } else {
      onBookmarkDeleted()
    }
  }

  return (
    <div className="flex flex-col gap-2 w-80">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="border p-3 rounded flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">{bookmark.title}</p>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500"
            >
              {bookmark.url}
            </a>
          </div>

          <button
            onClick={() => handleDelete(bookmark.id)}
            className="text-red-500 text-sm"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}
