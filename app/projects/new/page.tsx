import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import CreateProjectForm from "@/components/projects/create-project-form"

export default async function NewProjectPage() {
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container max-w-2xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Project</h1>
        <p className="text-muted-foreground mt-2">Start a new impact assessment project for an organization</p>
      </div>

      <CreateProjectForm userId={session.user.id} />
    </div>
  )
}
