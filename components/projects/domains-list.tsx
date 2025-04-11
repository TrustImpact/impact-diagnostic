"use client"

import Link from "next/link"
import { BarChart, Database, FileText, GitBranch, Settings, Target, Users, type LucideIcon } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface Domain {
  id: string
  name: string
  description: string
  icon: string
  progress: number
  score: number
  completedQuestions: number
  totalQuestions: number
}

interface DomainsListProps {
  domains: Domain[]
  projectId: string
  assessmentId: string
}

const iconMap: Record<string, LucideIcon> = {
  Target,
  FileText,
  Users,
  GitBranch,
  BarChart,
  Database,
  Settings,
}

export default function DomainsList({ domains, projectId, assessmentId }: DomainsListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {domains.map((domain) => {
        const Icon = iconMap[domain.icon] || Target

        return (
          <Card key={domain.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center">
                    <Icon className="h-5 w-5 mr-2 text-muted-foreground" />
                    {domain.name}
                  </CardTitle>
                  <CardDescription>{domain.description}</CardDescription>
                </div>
                {domain.progress > 0 && <div className="text-2xl font-bold">{domain.score.toFixed(1)}</div>}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {domain.completedQuestions} of {domain.totalQuestions} questions
                  </span>
                  <span className="font-medium">{Math.round(domain.progress)}%</span>
                </div>
                <Progress value={domain.progress} className="h-2" />
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 px-6 py-3">
              <Button asChild className="w-full" variant="outline">
                <Link href={`/projects/${projectId}/domains/${domain.id}?assessment=${assessmentId}`}>
                  {domain.progress > 0 ? "Continue Assessment" : "Start Assessment"}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
