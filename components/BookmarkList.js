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
    <>
      {bookmarks.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300/80 bg-white/70 p-12 text-center">
          <h3 className="text-xl font-semibold text-slate-900">No bookmarks yet</h3>
          <p className="mt-2 text-slate-600">Add your first link to get started.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {bookmarks.map((bookmark) => (
            <article
              key={bookmark.id}
              className="group rounded-2xl border border-slate-200/80 bg-white/85 p-5 shadow-sm shadow-slate-200/30 transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <h3 className="line-clamp-2 text-xl font-semibold tracking-tight text-slate-900">
                  {bookmark.title}
                </h3>

                <button
                  onClick={() => handleDelete(bookmark.id)}
                  className="cursor-pointer text-slate-400 transition hover:text-red-500"
                  aria-label={`Delete ${bookmark.title}`}
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 break-all text-sm text-slate-600 transition group-hover:text-slate-900"
              >
                {bookmark.url}
                <ExternalLink size={15} />
              </a>
            </article>
          ))}
        </div>
      )}
    </>
  )
}
