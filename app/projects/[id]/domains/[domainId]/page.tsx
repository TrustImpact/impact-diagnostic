import { notFound, redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { ASSESSMENT_DOMAINS, DOMAIN_QUESTIONS } from "@/lib/constants"
import DomainAssessment from "@/components/projects/domain-assessment"

interface DomainPageProps {
  params: {
    id: string
    domainId: string
  }
  searchParams: {
    assessment: string
  }
}

export default async function DomainPage({ params, searchParams }: DomainPageProps) {
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const assessmentId = searchParams.assessment

  if (!assessmentId) {
    redirect(`/projects/${params.id}`)
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

  // Get domain info
  const domain = ASSESSMENT_DOMAINS.find((d) => d.id === params.domainId)

  if (!domain) {
    notFound()
  }

  // Get questions for this domain
  const questions = DOMAIN_QUESTIONS[params.domainId as keyof typeof DOMAIN_QUESTIONS] || []

  if (!questions.length) {
    notFound()
  }

  // Get existing scores for this domain
  const { data: existingScores } = await supabase
    .from("assessment_scores")
    .select("*")
    .eq("assessment_id", assessmentId)
    .eq("domain", params.domainId)

  // Map scores to questions
  const questionsWithScores = questions.map((question) => {
    const score = existingScores?.find((s) => s.question_id === question.id)
    return {
      ...question,
      score: score?.score || null,
      notes: score?.notes || "",
    }
  })

  return (
    <div className="container py-10">
      <DomainAssessment project={project} domain={domain} questions={questionsWithScores} assessmentId={assessmentId} />
    </div>
  )
}
