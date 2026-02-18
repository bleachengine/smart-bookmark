"use client"

import { supabase } from "../lib/supabase"
import { Trash2, ExternalLink } from "lucide-react"

export default function BookmarkList({ bookmarks, onBookmarkDeleted }) {

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id)

    if (!error) {
      onBookmarkDeleted()
    }
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="bg-white rounded-xl shadow-md p-6 transition transform hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold text-lg text-gray-800">
              {bookmark.title}
            </h3>

            <button
              onClick={() => handleDelete(bookmark.id)}
              className="text-red-500 cursor-pointer hover:text-red-700 transition"
            >
              <Trash2 size={22} />
            </button>
          </div>

          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-sm flex items-center gap-2 hover:underline break-all"
          >
            {bookmark.url}
            <ExternalLink size={16} />
          </a>
        </div>
      ))}
    </div>
  )
}
