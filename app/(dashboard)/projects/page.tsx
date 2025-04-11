import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import ProjectsList from "@/components/dashboard/projects-list"
import CreateProjectButton from "@/components/dashboard/create-project-button"

export const dynamic = "force-dynamic"

export default async function ProjectsPage() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Get projects
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .or(`owner_id.eq.${session!.user.id},project_collaborators(user_id).eq.${session!.user.id}`)
    .order("created_at", { ascending: false })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <CreateProjectButton />
      </div>

      <ProjectsList projects={projects || []} />
    </div>
  )
}
