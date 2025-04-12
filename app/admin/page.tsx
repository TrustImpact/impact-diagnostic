import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import OrganizationsManagement from "@/components/admin/organizations-management"

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

  // Get all organizations
  const { data: organizations } = await supabase.from("organizations").select("*").order("name")

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <OrganizationsManagement organizations={organizations || []} />
    </div>
  )
}
