import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    return NextResponse.json({
      authenticated: !!session,
      session: session
        ? {
            user_id: session.user.id,
            email: session.user.email,
            expires_at: session.expires_at,
          }
        : null,
      cookies: Object.fromEntries(Array.from(cookieStore.getAll()).map((cookie) => [cookie.name, "present"])),
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to get auth state",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
