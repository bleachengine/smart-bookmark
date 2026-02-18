"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { useRouter } from "next/navigation"
import BookmarkForm from "../../components/BookmarkForm"
import BookmarkList from "../../components/BookmarkList"
import { Bookmark } from "lucide-react";

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
            console.log("Teestbfddovdfvdomosp:", data)
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
  <div className="h-screen flex bg-gray-100">

    {/* Sidebar */}
    <div className="w-64 bg-white shadow-md p-6 flex flex-col justify-between fixed h-full">
      <div>
        <div className="flex gap-2 justify-center items-center text-blue-600 mb-6"> 
            <h2 className="text-xl font-bold  ">
          SmartBookmark 
        </h2>
        <Bookmark fill="currentColor" size={26} strokeWidth={1.5} />
        </div>
        <div className="text-sm text-gray-500 mb-2">
          Logged in as:
        </div>
        <div className="font-medium text-gray-800 break-words">
          {user.email}
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 cursor-pointer hover:bg-red-700 text-white py-2 rounded transition"
      >
        Logout
      </button>
    </div>

    {/* Main Content */}
    <div className="flex-1 ml-64 p-7 overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
      
 Your Bookmarks
      </h1>

      <div className="mb-8">
        <BookmarkForm  user={user} onBookmarkAdded={fetchBookmarks} />
      </div>

      <BookmarkList bookmarks={bookmarks} onBookmarkDeleted={fetchBookmarks} />
    </div>

  </div>
)

}
