import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Check if user is a super user
  const { data: profile } = await supabase.from("profiles").select("is_super_user").eq("id", session.user.id).single()

  if (!profile?.is_super_user) {
    redirect("/dashboard")
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
        <p className="font-bold">Success!</p>
        <p>You have successfully accessed the admin page as a super user.</p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Debug Information:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify({ isSuperUser: profile?.is_super_user }, null, 2)}
        </pre>
      </div>
    </div>
  )
}
