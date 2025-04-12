import Link from "next/link"
import { Button } from "@/components/ui/button"
import EnhancedProjectDebug from "@/components/debug/enhanced-project-debug"

export default function DebugPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Debug Tools</h1>
        <Button asChild>
          <Link href="/debug/create-test-project">Create Test Project</Link>
        </Button>
      </div>

      <EnhancedProjectDebug />
    </div>
  )
}
