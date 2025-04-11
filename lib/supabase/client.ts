import { createClient } from "@supabase/supabase-js"
import { getSiteUrl } from "./server-config"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: "pkce",
    autoRefreshToken: true,
    detectSessionInUrl: true,
    persistSession: true,
    // Use the site URL for redirects
    redirectTo: `${getSiteUrl()}/auth/callback`,
    storageKey: "impact-diagnostic-auth",
    storage: {
      getItem: (key) => {
        if (typeof window !== "undefined") {
          return window.localStorage.getItem(key)
        }
        return null
      },
      setItem: (key, value) => {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, value)
        }
      },
      removeItem: (key) => {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(key)
        }
      },
    },
  },
})
