"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Project name must be at least 3 characters.",
  }),
  organization_name: z.string().min(2, {
    message: "Organization name must be at least 2 characters.",
  }),
  description: z.string().optional(),
})

interface CreateProjectFormProps {
  userId: string
}

export default function CreateProjectForm({ userId }: CreateProjectFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      organization_name: "",
      description: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      // Create the project
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          name: values.name,
          organization_name: values.organization_name,
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
          name="organization_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input placeholder="Acme Nonprofit" {...field} />
              </FormControl>
              <FormDescription>The name of the organization being assessed.</FormDescription>
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
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
