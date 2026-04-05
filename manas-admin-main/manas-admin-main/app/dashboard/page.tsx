"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Heart, Trophy, MessageSquare, Newspaper } from "lucide-react"
import {
  getAllUsers,
  getAllImpactCards,
  getAllAchievementCards,
  getAllSuccessStories,
  getAllMediaCards,
  getAllVolunteers,
} from "@/lib/api"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    users: 0,
    impactCards: 0,
    achievementCards: 0,
    successStories: 0,
    mediaCards: 0,
    volunteers: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log("Fetching dashboard stats...")
        
        // Fetch each stat individually to handle errors gracefully
        const fetchWithFallback = async (apiCall: () => Promise<any[]>, fallback: number = 0) => {
          try {
            const data = await apiCall()
            return Array.isArray(data) ? data.length : fallback
          } catch (error) {
            console.error("API call failed:", error)
            return fallback
          }
        }

        const [users, impactCards, achievementCards, successStories, mediaCards, volunteers] = await Promise.all([
          fetchWithFallback(getAllUsers),
          fetchWithFallback(getAllImpactCards),
          fetchWithFallback(getAllAchievementCards),
          fetchWithFallback(getAllSuccessStories),
          fetchWithFallback(getAllMediaCards),
          fetchWithFallback(getAllVolunteers),
        ])

        console.log("Stats fetched successfully:", {
          users,
          impactCards,
          achievementCards,
          successStories,
          mediaCards,
          volunteers,
        })

        setStats({
          users,
          impactCards,
          achievementCards,
          successStories,
          mediaCards,
          volunteers,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
        // Set default stats on error to prevent white screen
        setStats({
          users: 0,
          impactCards: 0,
          achievementCards: 0,
          successStories: 0,
          mediaCards: 0,
          volunteers: 0,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: "Total Users",
      value: stats.users,
      description: "Registered users",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Impact Cards",
      value: stats.impactCards,
      description: "Published impact stories",
      icon: Heart,
      color: "text-red-600",
    },
    {
      title: "Achievement Cards",
      value: stats.achievementCards,
      description: "Foundation achievements",
      icon: Trophy,
      color: "text-yellow-600",
    },
    {
      title: "Success Stories",
      value: stats.successStories,
      description: "User testimonials",
      icon: MessageSquare,
      color: "text-green-600",
    },
    {
      title: "Media Cards",
      value: stats.mediaCards,
      description: "Media coverage",
      icon: Newspaper,
      color: "text-purple-600",
    },
    {
      title: "Volunteer Applications",
      value: stats.volunteers,
      description: "People who want to volunteer",
      icon: Heart,
      color: "text-pink-600",
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-purple-600">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to MANAS Foundation Admin Panel</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-purple-600">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to MANAS Foundation Admin Panel</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">System running smoothly</p>
                  <p className="text-xs text-muted-foreground">All services operational</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Database backup completed</p>
                  <p className="text-xs text-muted-foreground">Daily backup successful</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">• Manage user profiles and verification status</p>
              <p className="text-sm">• Update impact and achievement cards</p>
              <p className="text-sm">• Review and publish success stories</p>
              <p className="text-sm">• Manage media coverage and news</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
