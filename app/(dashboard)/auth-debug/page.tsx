import Link from "next/link"
import { Button } from "@/components/ui/button"
import AuthDebug from "@/components/debug/auth-debug"
import CookieInspector from "@/components/debug/cookie-inspector"
import CleanLogout from "@/components/debug/clean-logout"
import DirectLogin from "@/components/debug/direct-login"
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
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
          <h3 className="font-medium text-yellow-800">Authentication Issue Detected</h3>
          <p className="text-yellow-700 mt-1">
            Based on your error messages, it appears your auth cookie is in an unexpected format. Try using the Cookie
            Inspector below to examine the cookie, then use the Clean Logout tool to completely sign out and clear
            cookies. After that, use the Direct Login tool to sign back in.
          </p>
        </div>

        <AuthDebug />

        <CookieInspector />

        <CleanLogout />

        <DirectLogin />

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
              <li>Use the "Clean Logout" tool above to completely sign out</li>
              <li>Use the "Direct Login" tool to sign back in</li>
              <li>Clear your browser cookies and cache</li>
              <li>Try a different browser</li>
              <li>Disable any privacy extensions that might block cookies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
