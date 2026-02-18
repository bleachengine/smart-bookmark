"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { useRouter } from "next/navigation"
import BookmarkForm from "../../components/BookmarkForm"
import BookmarkList from "../../components/BookmarkList"


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
            console.log(data)
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
        <main className="flex min-h-screen items-center justify-center flex-col gap-6">

            <h1 className="text-2xl font-semibold">Your Bookmarks</h1>

            <BookmarkForm user={user} onBookmarkAdded={fetchBookmarks} />

            <BookmarkList bookmarks={bookmarks} onBookmarkDeleted={fetchBookmarks} />

            <button onClick={handleLogout} className="px-6 py-3 bg-red-500 text-white rounded-lg">
                Logout
            </button>

        </main>
    )
}
