"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

type Profile = {
  id: string
  username: string
  display_name: string | null
  district: string
  total_points: number
}

export default function DashboardClient({
  initialProfile,
}: {
  initialProfile: Profile
}) {
  const supabase = createClient()
  const [profile, setProfile] = useState(initialProfile)
  const [loading, setLoading] = useState(false)

  // Example: refresh points after action upload
  const refreshProfile = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from("users")
      .select("id, username, display_name, district, total_points")
      .eq("id", profile.id)
      .single()

    if (!error && data) {
      setProfile(data)
    }

    setLoading(false)
  }

  return (
    <section className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome, {profile.display_name ?? profile.username}
          </h1>
          <p className="text-sm text-gray-500">{profile.district}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Stat label="Total Points" value={profile.total_points} />
        <Stat label="Rank" value="—" />
        <Stat label="Status" value="Verified Citizen" />
      </div>

      <button
        onClick={refreshProfile}
        disabled={loading}
        className="px-4 py-2 border rounded"
      >
        {loading ? "Refreshing..." : "Refresh"}
      </button>
    </section>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded bg-white p-4 shadow">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  )
}
//This component displays user profile information on the dashboard and allows refreshing of data.