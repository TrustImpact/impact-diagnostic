import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import EnhancedProjectDebug from "@/components/debug/enhanced-project-debug"
import ProjectQueryDebug from "@/components/debug/project-query-debug"
import DirectSqlQuery from "@/components/debug/direct-sql-query"

export const dynamic = "force-dynamic"

export default function DebugPage() {
  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Debug Tools</h1>
          <p className="text-muted-foreground">Tools to help diagnose and fix issues with your application</p>
        </div>
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
          <Button asChild>
            <Link href="/auth-debug">Authentication Debug</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Project Visibility Debug</CardTitle>
            <CardDescription>Diagnose issues with project visibility and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectQueryDebug />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Direct SQL Query</CardTitle>
            <CardDescription>
              Run SQL queries directly against the database (requires special permissions)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DirectSqlQuery />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enhanced Project Debug</CardTitle>
            <CardDescription>Detailed information about users, profiles, organizations, and projects</CardDescription>
          </CardHeader>
          <CardContent>
            <EnhancedProjectDebug />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Create Test Project</CardTitle>
            <CardDescription>Create a test project directly in the database</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>Use this tool to create a test project if you're having trouble creating projects through the UI.</p>
              <Button asChild>
                <Link href="/debug/create-test-project">Create Test Project</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
