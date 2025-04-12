"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"

export default function CreateTestProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [projectName, setProjectName] = useState("Test Project")
  const [orgName, setOrgName] = useState("Test Organization")

  const createProject = async () => {
    setLoading(true)

    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) throw new Error(`Auth error: ${userError.message}`)
      if (!user) throw new Error("No authenticated user found")

      // Create project directly
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          name: projectName,
          organization_name: orgName,
          owner_id: user.id,
          description: "Test project created from debug tool",
        })
        .select()
        .single()

      if (projectError) throw new Error(`Project creation error: ${projectError.message}`)

      // Create initial assessment
      const { error: assessmentError } = await supabase.from("assessments").insert({
        project_id: project.id,
        created_by: user.id,
      })

      if (assessmentError) throw new Error(`Assessment creation error: ${assessmentError.message}`)

      toast({
        title: "Test project created",
        description: `Project ID: ${project.id}`,
      })

      // Refresh the router
      router.refresh()
    } catch (err: any) {
      console.error("Project creation error:", err)
      toast({
        title: "Error creating project",
        description: err.message || "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Create Test Project</h1>

      <Card>
        <CardHeader>
          <CardTitle>Create a Test Project</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name</Label>
            <Input id="projectName" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="orgName">Organization Name</Label>
            <Input id="orgName" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
          </div>

          <Button onClick={createProject} disabled={loading}>
            {loading ? "Creating..." : "Create Test Project"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
