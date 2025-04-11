"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthDebug() {
  const [authState, setAuthState] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function checkAuthState() {
    setLoading(true)
    setError(null)

    try {
      // Check client-side auth
      const {
        data: { session },
      } = await supabase.auth.getSession()

      // Check server-side auth via our debug endpoint
      const response = await fetch("/api/auth-debug")
      const serverState = await response.json()

      setAuthState({
        clientSession: session
          ? {
              user_id: session.user.id,
              email: session.user.email,
              expires_at: session.expires_at,
            }
          : null,
        serverState,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuthState()
  }, [])

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Authentication Debug</CardTitle>
        <CardDescription>Information about your current authentication state</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading authentication state...</p>
        ) : error ? (
          <div className="text-red-500">
            <p>Error: {error}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Client-side Session:</h3>
              <pre className="bg-gray-100 p-2 rounded mt-2 overflow-auto text-xs">
                {JSON.stringify(authState?.clientSession, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="font-medium">Server-side Authentication:</h3>
              <pre className="bg-gray-100 p-2 rounded mt-2 overflow-auto text-xs">
                {JSON.stringify(authState?.serverState, null, 2)}
              </pre>
            </div>

            <Button onClick={checkAuthState}>Refresh Auth State</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
