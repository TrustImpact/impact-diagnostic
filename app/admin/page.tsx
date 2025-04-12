import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  // Create a Supabase client
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  // Get the session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>You must be logged in to access this page.</p>
        </div>
      </div>
    )
  }

  // Get user profile with detailed error handling
  let profile = null
  let profileError = null
  let organizations = []

  try {
    // Get profile with super user status
    const { data, error } = await supabase
      .from("profiles")
      .select("*, organizations(id, name)")
      .eq("id", session.user.id)
      .single()

    if (error) {
      profileError = `Profile error: ${error.message}`
    } else {
      profile = data
    }

    // Get organizations regardless of super user status (for debugging)
    const { data: orgsData, error: orgsError } = await supabase.from("organizations").select("*")

    if (orgsError) {
      profileError = (profileError || "") + ` Organizations error: ${orgsError.message}`
    } else {
      organizations = orgsData || []
    }
  } catch (e: any) {
    profileError = `Unexpected error: ${e.message}`
  }

  // Display debug information without redirecting
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
        <p className="font-bold">Debug Information</p>
        <p>This page shows detailed information about your user account and permissions.</p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Authentication Status</h3>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">User ID</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{session.user.id}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{session.user.email}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Super User Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {profile?.is_super_user === true ? (
                  <span className="text-green-600 font-bold">TRUE</span>
                ) : profile?.is_super_user === false ? (
                  <span className="text-red-600 font-bold">FALSE</span>
                ) : (
                  <span className="text-yellow-600 font-bold">UNKNOWN: {String(profile?.is_super_user)}</span>
                )}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Organization</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {profile?.organizations?.name || "None"}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {profileError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">Error</p>
          <p>{profileError}</p>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Organizations ({organizations.length})</h3>
        </div>
        <div className="border-t border-gray-200">
          {organizations.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {organizations.map((org: any) => (
                <li key={org.id} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{org.name}</p>
                    <p className="text-xs text-gray-500">ID: {org.id}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-3 text-sm text-gray-500">No organizations found.</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Raw Data</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify({ session, profile, organizations }, null, 2)}
        </pre>
      </div>
    </div>
  )
}
