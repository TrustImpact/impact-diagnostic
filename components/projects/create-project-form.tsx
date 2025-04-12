"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Project name must be at least 3 characters.",
  }),
  organization_id: z.string().min(1, {
    message: "Please select an organization.",
  }),
  description: z.string().optional(),
})

interface Organization {
  id: string
  name: string
}

interface CreateProjectFormProps {
  userId: string
}

export default function CreateProjectForm({ userId }: CreateProjectFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [isLoadingOrgs, setIsLoadingOrgs] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      organization_id: "",
      description: "",
    },
  })

  useEffect(() => {
    async function fetchOrganizations() {
      try {
        const { data, error } = await supabase.from("organizations").select("id, name").order("name")

        if (error) throw error

        setOrganizations(data || [])
      } catch (error) {
        console.error("Error fetching organizations:", error)
        toast({
          title: "Error",
          description: "Failed to load organizations. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingOrgs(false)
      }
    }

    fetchOrganizations()
  }, [])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      // Get the organization name from the selected ID
      const organization = organizations.find((org) => org.id === values.organization_id)

      if (!organization) {
        throw new Error("Selected organization not found")
      }

      // Create the project
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          name: values.name,
          organization_id: values.organization_id,
          organization_name: organization.name,
          description: values.description || null,
          owner_id: userId,
        })
        .select()
        .single()

      if (projectError) throw projectError

      // Create initial assessment
      const { error: assessmentError } = await supabase.from("assessments").insert({
        project_id: project.id,
        created_by: userId,
      })

      if (assessmentError) throw assessmentError

      toast({
        title: "Project created",
        description: "Your new project has been created successfully.",
      })

      router.push(`/projects/${project.id}`)
    } catch (error: any) {
      console.error("Error creating project:", error)
      toast({
        title: "Something went wrong",
        description: error.message || "Failed to create project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="Q3 2023 Impact Assessment" {...field} />
              </FormControl>
              <FormDescription>Give your project a descriptive name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="organization_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an organization" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingOrgs ? (
                    <SelectItem value="loading" disabled>
                      Loading organizations...
                    </SelectItem>
                  ) : organizations.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No organizations available
                    </SelectItem>
                  ) : (
                    organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormDescription>Select the organization being assessed.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief description of this assessment project"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>Provide additional context about this assessment project.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || isLoadingOrgs}>
            {isLoading ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
