# Smart Bookmark App

A simple private bookmark manager built with:

- Next.js (App Router)
- Supabase (Auth, Database, Realtime)
- Tailwind CSS
- Deployed on Vercel

---

## Features

- Sign in using Google OAuth
- Add bookmarks (title + URL)
- See only my own bookmarks
- Delete my own bookmarks
- Real-time updates across tabs
- Live deployed version on Vercel

---

## 🚀 What I Built

This app allows users to:

- Sign in using Google OAuth only  
- Add bookmarks (title + URL)  
- See only their own bookmarks (private per user)  
- Delete their own bookmarks  
- See real-time updates without page refresh  
- Use the app live on Vercel  

---

## 🧠 Problems I Faced & How I Solved Them

### 1️⃣ Choosing TypeScript or JavaScript

At first, I was confused whether to use TypeScript or JavaScript.  
Since I am not very comfortable with TypeScript, I chose JavaScript to move faster and focus on functionality.

---

### 2️⃣ First Time Using Supabase

I had never worked with Supabase before, so it was new to me.

I read the documentation to understand:
- How to create a Supabase project
- How to create a client using the project URL and anon key
- How authentication works

I created a client file using the credentials and connected it to my Next.js app.

---

### 3️⃣ Setting Up Google OAuth

I:

- Created a project in Google Cloud Console
- Enabled the required API
- Filled branding details
- Created an OAuth Client
- Added the callback URL from Supabase
- Copied the Client ID and Client Secret
- Added them back into Supabase → Google Provider

After that, Google sign-in worked correctly.

---

### 4️⃣ Authentication State Handling

I added logic to:

- Check if a user is logged in
- Show user email after login
- Persist session after refresh
- Protect the dashboard route
- Redirect unauthenticated users to the homepage

---

### 5️⃣ Creating the Database Table

I created a `bookmarks` table in Supabase with:

- `id` (UUID, primary key)
- `user_id` (UUID, foreign key → auth.users)
- `title`
- `url`
- `created_at`

I added a foreign key so only valid authenticated users can own bookmarks.

---

### 6️⃣ Row Level Security (RLS)

RLS was enabled by default, but queries were returning empty results.

The issue was missing policies.

I created policies for:

- SELECT (read own bookmarks)
- INSERT (add own bookmarks)
- DELETE (delete own bookmarks)
- UPDATE (edit own bookmarks)

All policies use:

```
auth.uid() = user_id
```

After this, bookmarks became private per user.

---

### 7️⃣ Realtime Delete Not Working

Insert was working in real-time across tabs,  
but delete was not reflecting in the second tab.

After researching, I found that Supabase requires:

```
REPLICA IDENTITY FULL
```

I could not find this option in the UI.

I used the SQL Editor and ran:

```sql
ALTER TABLE public.bookmarks REPLICA IDENTITY FULL;
```

After that, delete worked in real-time across tabs.

---

### 8️⃣ Tailwind CSS Version Issue

I initially used Tailwind v3 style setup, but my project was using Tailwind v4.

After confirming the correct setup in `globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Tailwind styling worked properly.

---

### 9️⃣ Deployment Redirect Issue

After deploying to Vercel, Google login was still redirecting to:

```
localhost:3000/dashboard
```

The issue was that Supabase Site URL was still set to localhost.

I fixed it by:

- Updating Site URL in Supabase
- Adding my Vercel domain to Redirect URLs

After that, production login worked correctly.

---

### 🔟 Google OAuth Name Showing Supabase Random String

Google was showing my Supabase project reference instead of my app name.

I updated:

- App name in Google Branding
- Authorized domains
- OAuth configuration

Since the app is in testing mode, this behavior is expected, and login works correctly.

---

##  Final Result

- Google OAuth working
- Private bookmarks per user
- Real-time insert and delete
- RLS fully configured
- Protected dashboard route
- Clean UI with Tailwind
- Successfully deployed on Vercel
