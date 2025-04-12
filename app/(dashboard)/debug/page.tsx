import Link from "next/link"
import { Button } from "@/components/ui/button"
import EnhancedProjectDebug from "@/components/debug/enhanced-project-debug"
import { Shield } from "lucide-react"

export default function DebugPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Debug Tools</h1>
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/auth-debug">
              <Shield className="h-4 w-4 mr-2" />
              Auth Debug
            </Link>
          </Button>
          <Button asChild>
            <Link href="/debug/create-test-project">Create Test Project</Link>
          </Button>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mb-8">
        <h3 className="font-medium text-yellow-800">Authentication Error Detected</h3>
        <p className="text-yellow-700 mt-1">
          You're seeing "Auth session missing!" errors. Please check the
          <Link href="/auth-debug" className="text-yellow-800 underline mx-1">
            authentication debug page
          </Link>
          to troubleshoot this issue.
        </p>
      </div>

      <EnhancedProjectDebug />
    </div>
  )
}
