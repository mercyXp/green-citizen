import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import DashboardClient from "@/app/components/dashboard/DashboardClient"

export default async function DashboardPage() {
  const supabase = await createClient()

  // 1. Auth check (server-enforced)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // 2. Fetch user profile securely
  const { data: profile, error } = await supabase
    .from("users")
    .select("id, username, display_name, district, total_points")
    .eq("id", user.id)
    .single()

  if (error || !profile) {
    redirect("/onboarding")
  }

   // ===== FOR DEMO PURPOSES: fallback if no profile exists =====
  // if (!profile || error) redirect("/onboarding");
  const safeProfile = profile || {
    id: user.id,
    username: user.email?.split("@")[0] || "DemoUser",
    display_name: user.email || "Demo User",
    district: "N/A",
    total_points: 0,
  };


  // 3. Pass trusted data to client
  return (
    <main className="max-w-6xl mx-auto p-6">
      <DashboardClient initialProfile={safeProfile} />
    </main>
  )
}
//This page handles user authentication, fetches the user's profile data, and renders the dashboard client component with that data.