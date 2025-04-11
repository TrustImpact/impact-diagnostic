import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import ProjectsList from "@/components/dashboard/projects-list"
import CreateProjectButton from "@/components/dashboard/create-project-button"
import AuthDebug from "@/components/debug/auth-debug"

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

  // Get projects
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .or(`owner_id.eq.${session.user.id},project_collaborators(user_id).eq.${session.user.id}`)
    .order("created_at", { ascending: false })

  return (
    <div className="container py-10">
      <DashboardHeader />

      <div className="mt-8 flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Your Projects</h2>
        <CreateProjectButton />
      </div>

      <div className="mt-6">
        <ProjectsList projects={projects || []} />
      </div>

      {/* Debug component - remove in production */}
      <AuthDebug />
    </div>
  )
}
