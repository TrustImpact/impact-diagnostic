import Link from "next/link"
import { Button } from "@/components/ui/button"
import EnhancedProjectDebug from "@/components/debug/enhanced-project-debug"
import SimpleAuthFix from "@/components/debug/simple-auth-fix"
import { Shield, LogIn } from "lucide-react"

export default function DebugPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Debug Tools</h1>
        <div className="flex gap-4">
          <SimpleAuthFix />
          <Button asChild variant="outline">
            <Link href="/auth-debug">
              <Shield className="h-4 w-4 mr-2" />
              Auth Debug
            </Link>
          </Button>
          <Button asChild>
            <Link href="/special-login">
              <LogIn className="h-4 w-4 mr-2" />
              Special Login
            </Link>
          </Button>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mb-8">
        <h3 className="font-medium text-yellow-800">Authentication Error Detected</h3>
        <p className="text-yellow-700 mt-1">
          You're seeing "Auth session missing!" errors. Based on the error messages, your auth cookie appears to be in
          an unexpected format. Please try the following steps:
        </p>
        <ol className="list-decimal ml-5 mt-2 space-y-1 text-yellow-700">
          <li>
            Go to the{" "}
            <Link href="/auth-debug" className="text-yellow-800 underline">
              Auth Debug page
            </Link>{" "}
            and use the "Clean Logout" tool
          </li>
          <li>
            Use the{" "}
            <Link href="/special-login" className="text-yellow-800 underline">
              Special Login page
            </Link>{" "}
            to sign back in
          </li>
          <li>If that doesn't work, try using a different browser</li>
        </ol>
      </div>

      <EnhancedProjectDebug />
    </div>
  )
}
