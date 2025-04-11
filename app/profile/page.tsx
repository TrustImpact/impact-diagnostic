import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import ProfileForm from "@/components/profile/profile-form"

export default async function ProfilePage() {
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get user profile with organization
  const { data: profile } = await supabase
    .from("profiles")
    .select(`
      *,
      organizations (
        id,
        name
      )
    `)
    .eq("id", session.user.id)
    .single()

  // Get all organizations
  const { data: organizations } = await supabase.from("organizations").select("*").order("name")

  return (
    <div className="container max-w-2xl py-10">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      <ProfileForm profile={profile} organizations={organizations || []} />
    </div>
  )
}
