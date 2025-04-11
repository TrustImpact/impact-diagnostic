import { notFound, redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { ASSESSMENT_DOMAINS, DOMAIN_QUESTIONS } from "@/lib/constants"
import ProjectHeader from "@/components/projects/project-header"
import ResultsOverview from "@/components/projects/results-overview"
import DomainScores from "@/components/projects/domain-scores"
import DownloadResultsButton from "@/components/projects/download-results-button"

interface ResultsPageProps {
  params: {
    id: string
  }
}

export default async function ResultsPage({ params }: ResultsPageProps) {
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
  const { data: scores } = await supabase.from("assessment_scores").select("*").eq("assessment_id", assessment.id)

  // Calculate domain scores
  const domainScores = ASSESSMENT_DOMAINS.map((domain) => {
    const domainScores = scores?.filter((score) => score.domain === domain.id) || []
    const totalQuestions = domain.questionCount || 0
    const completedQuestions = domainScores.length

    // Handle inverted scores for calculation
    const adjustedScores = domainScores.map((score) => {
      const question = DOMAIN_QUESTIONS[domain.id as keyof typeof DOMAIN_QUESTIONS]?.find(
        (q) => q.id === score.question_id,
      )
      return question?.inverted ? { ...score, score: 10 - score.score } : score
    })

    const averageScore =
      adjustedScores.length > 0
        ? adjustedScores.reduce((sum, score) => sum + score.score, 0) / adjustedScores.length
        : 0

    return {
      id: domain.id,
      name: domain.name,
      score: averageScore,
      completedQuestions,
      totalQuestions,
      progress: totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0,
      questionScores: domainScores,
    }
  })

  // Calculate overall score
  const completedDomains = domainScores.filter((d) => d.completedQuestions > 0)
  const overallScore =
    completedDomains.length > 0
      ? completedDomains.reduce((sum, domain) => sum + domain.score, 0) / completedDomains.length
      : 0

  return (
    <div className="container py-10">
      <ProjectHeader project={project} />

      <div className="mt-10 space-y-10">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Assessment Results</h2>
          <DownloadResultsButton
            projectName={project.name}
            organizationName={project.organization_name}
            domainScores={domainScores}
            overallScore={overallScore}
          />
        </div>

        <ResultsOverview domainScores={domainScores} overallScore={overallScore} />

        <DomainScores domainScores={domainScores} projectId={params.id} />
      </div>
    </div>
  )
}
