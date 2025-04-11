import { notFound, redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import ProjectHeader from "@/components/projects/project-header"
import DomainsList from "@/components/projects/domains-list"
import { ASSESSMENT_DOMAINS } from "@/lib/constants"

interface ProjectPageProps {
  params: {
    id: string
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
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

  // Get the latest assessment for this project
  const { data: assessment } = await supabase
    .from("assessments")
    .select("*")
    .eq("project_id", params.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  // Get domain scores
  const { data: scores } = await supabase
    .from("assessment_scores")
    .select("domain, score")
    .eq("assessment_id", assessment.id)

  // Calculate domain completion and scores
  const domainScores = ASSESSMENT_DOMAINS.map((domain) => {
    const domainScores = scores?.filter((score) => score.domain === domain.id) || []
    const totalQuestions = domain.questionCount || 0
    const completedQuestions = domainScores.length
    const averageScore =
      domainScores.length > 0 ? domainScores.reduce((sum, score) => sum + score.score, 0) / domainScores.length : 0

    return {
      ...domain,
      progress: totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0,
      score: averageScore,
      completedQuestions,
      totalQuestions,
    }
  })

  return (
    <div className="container py-10">
      <ProjectHeader project={project} />

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-6">Assessment Domains</h2>
        <DomainsList domains={domainScores} projectId={params.id} assessmentId={assessment.id} />
      </div>
    </div>
  )
}
