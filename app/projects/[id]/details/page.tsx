import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import ProjectDetailsForm from "@/components/projects/project-details-form"

interface ProjectDetailsPageProps {
  params: {
    id: string
  }
}

export default async function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get project details
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", params.id)
    .single()

  if (projectError || !project) {
    notFound()
  }

  // Check if user has access to this project
  const { data: collaborator } = await supabase
    .from("project_collaborators")
    .select("*")
    .eq("project_id", params.id)
    .eq("user_id", session.user.id)
    .maybeSingle()

  const isOwner = project.owner_id === session.user.id
  const isCollaborator = !!collaborator

  if (!isOwner && !isCollaborator) {
    // User doesn't have access to this project
    redirect("/dashboard")
  }

  return (
    <div className="container py-10">
      <Button variant="ghost" asChild className="mb-4 pl-0 hover:bg-transparent">
        <Link href={`/projects/${params.id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Project
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Project Details</h1>
        <p className="text-muted-foreground mt-2">Update your project information</p>
      </div>

      <div className="max-w-2xl">
        <ProjectDetailsForm project={project} />
      </div>
    </div>
  )
}
