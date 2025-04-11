import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import ProjectsList from "@/components/dashboard/projects-list"
import CreateProjectButton from "@/components/dashboard/create-project-button"

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()

  try {
    // Get session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      console.log("No session found, redirecting to login")
      redirect("/login")
    }

    // Get projects with error handling
    const { data: projects, error } = await supabase
      .from("projects")
      .select("*")
      .or(`owner_id.eq.${session.user.id},project_collaborators(user_id).eq.${session.user.id}`)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching projects:", error)
    }

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
      </div>
    )
  } catch (error) {
    console.error("Dashboard error:", error)
    redirect("/login")
  }
}
