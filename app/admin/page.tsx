import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import OrganizationsManagement from "@/components/admin/organizations-management"
import UsersManagement from "@/components/admin/users-management"

export default async function AdminPage() {
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Check if user is a super user
  const { data: profile } = await supabase.from("profiles").select("is_super_user").eq("id", session.user.id).single()

  if (!profile?.is_super_user) {
    redirect("/dashboard")
  }

  // Get all organizations
  const { data: organizations } = await supabase.from("organizations").select("*").order("name")

  // Get all users with their organizations
  const { data: users } = await supabase
    .from("profiles")
    .select(`
      id,
      email,
      full_name,
      organization_id,
      is_super_user,
      organizations (
        name
      )
    `)
    .order("email")

  // Format users data
  const formattedUsers =
    users?.map((user) => ({
      id: user.id,
      email: user.email || "",
      full_name: user.full_name,
      organization_id: user.organization_id,
      organization_name: user.organizations?.name || null,
      is_super_user: user.is_super_user || false,
    })) || []

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <Tabs defaultValue="organizations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        <TabsContent value="organizations">
          <OrganizationsManagement organizations={organizations || []} />
        </TabsContent>
        <TabsContent value="users">
          <UsersManagement users={formattedUsers} organizations={organizations || []} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
