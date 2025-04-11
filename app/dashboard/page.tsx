import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  // Create a Supabase client for server components
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  // Get the session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If no session, redirect to login
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-4">Welcome, {session.user.email}</p>
      <p className="mt-2">You are successfully logged in!</p>

      <div className="mt-8 p-4 bg-gray-100 rounded-md">
        <h2 className="text-xl font-semibold">Debug Information</h2>
        <p className="mt-2">User ID: {session.user.id}</p>
        <p>Email: {session.user.email}</p>
        <p>Session expires at: {new Date(session.expires_at! * 1000).toLocaleString()}</p>
      </div>
    </div>
  )
}

