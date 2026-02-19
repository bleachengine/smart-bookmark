"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { useRouter } from "next/navigation"
import BookmarkForm from "../../components/BookmarkForm"
import BookmarkList from "../../components/BookmarkList"
import { Bookmark, LogOut } from "lucide-react"
import { Space_Grotesk, Manrope } from "next/font/google"

const headingFont = Space_Grotesk({
    subsets: ["latin"],
    weight: ["600", "700"],
})

const bodyFont = Manrope({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
})

export default function Dashboard() {
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [bookmarks, setBookmarks] = useState([])


    const fetchBookmarks = async () => {
        const { data, error } = await supabase
            .from("bookmarks")
            .select("*")
            .order("created_at", { ascending: false })
                                                    //fetches the data from sb and setting up in bookmark state
        if (error) {
            console.log("Fetch error:", error.message)
        } else {
            setBookmarks(data)
            // console.log(data)
        }
    }


    useEffect(() => {
        const checkUser = async () => {
            const { data } = await supabase.auth.getUser()
            // console.log("Teestbfddovdfvdomosp:", data)
            if (!data.user) {
                router.push("/")                            //check users data from sb
            } else {
                setUser(data.user)
                await fetchBookmarks()

            }
        }

        checkUser()
    }, [router])



    useEffect(() => {
        if (!user) return

        const channel = supabase
            .channel("realtime-bookmarks")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "bookmarks",
                    filter: `user_id=eq.${user.id}`
                },
                () => {
                    fetchBookmarks()                        //realtime chnages in dashboard
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [user])


    const handleLogout = async () => {
        await supabase.auth.signOut()   // sign out the user and redirect it to /
        router.push("/")
    }

    if (!user) return null

return (
  <div className={`${bodyFont.className} min-h-screen bg-[radial-gradient(circle_at_top,_#e2e8f0_0%,_#f1f5f9_42%,_#f8fafc_72%,_#ffffff_100%)]`}>
    <div className="mx-auto flex max-w-[1440px] flex-col lg:flex-row">
      <aside className="w-full border-b border-slate-700/70 bg-slate-950 px-4 py-6 text-slate-100 lg:sticky lg:top-0 lg:h-screen lg:w-80 lg:border-r lg:border-b-0 lg:px-8">
        <div className="flex h-full flex-col justify-between gap-10">
          <div>
            <div className="mb-10 flex items-center gap-2">
              <Bookmark fill="currentColor" size={26} strokeWidth={1.5} />
              <h2 className={`${headingFont.className} text-3xl font-semibold tracking-tight`}>
                SmartBookmark
              </h2>
            </div>

            <div className="rounded-2xl flex items-center gap-2 border border-slate-800 bg-slate-900/80 p-3">
              <p className="text-[14px] tracking-[0.10em] text-slate-400 uppercase">Logged in as:</p>
              <p className="text-[14px] break-words tracking-[0.10em]  font-medium uppercase text-slate-100">
                {user.user_metadata.full_name || "No Name"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-400/40 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 px-6 py-8 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs tracking-[0.22em] text-slate-500 uppercase">Dashboard</p>
              <h1 className={`${headingFont.className} text-3xl font-semibold tracking-tight text-slate-900`}>
                Your Bookmarks
              </h1>
            </div>
            <span className="rounded-full border border-slate-300 bg-white/80 px-3 py-1 text-sm font-medium text-slate-700">
              {bookmarks.length} saved
            </span>
          </div>

          <div className="mb-7">
            <BookmarkForm user={user} onBookmarkAdded={fetchBookmarks} />
          </div>

          <BookmarkList bookmarks={bookmarks} onBookmarkDeleted={fetchBookmarks} />
        </div>
      </main>
    </div>
  </div>
)

}
