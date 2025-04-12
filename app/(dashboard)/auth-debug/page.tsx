import Link from "next/link"
import { Button } from "@/components/ui/button"
import AuthDebug from "@/components/debug/auth-debug"
import ForceLogin from "@/components/debug/force-login"
import FixedProjectDebug from "@/components/debug/fixed-project-debug"
import { ArrowLeft } from "lucide-react"

export default function AuthDebugPage() {
  return (
    <div>
      <div className="flex items-center mb-8">
        <Button asChild variant="ghost" size="sm" className="mr-4">
          <Link href="/debug">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Debug Tools
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Authentication Debug</h1>
      </div>

      <div className="space-y-8 max-w-2xl">
        <AuthDebug />

        <ForceLogin />

        <FixedProjectDebug />

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Authentication Troubleshooting</h2>

          <div className="space-y-2">
            <h3 className="font-medium">Common Issues:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Session cookies may be missing or expired</li>
              <li>Browser privacy settings might be blocking cookies</li>
              <li>CORS issues might be preventing proper authentication</li>
              <li>Network issues might be preventing communication with Supabase</li>
              <li>Client-side Supabase initialization might not be accessing the cookie correctly</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Try These Solutions:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use the "Force Login Fix" button above</li>
              <li>Click "Refresh Authentication Session" above</li>
              <li>Log out and log back in</li>
              <li>Clear your browser cookies and cache</li>
              <li>Try a different browser</li>
              <li>Disable any privacy extensions that might block cookies</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-between">
          <Button asChild variant="outline">
            <Link href="/login">Go to Login Page</Link>
          </Button>
          <Button asChild>
            <Link href="/debug/create-test-project">Create Test Project</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
