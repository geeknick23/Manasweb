"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { getAuthorizedEmails } from "@/lib/api"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const validateToken = async (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))

      if (Date.now() >= payload.exp * 1000) {
        return { valid: false, reason: 'Token expired' }
      }
      
      return { valid: true, email: payload.email }
    } catch {
      return { valid: false, reason: 'Invalid token format' }
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      console.log("Checking authentication...")
      const token = localStorage.getItem("admin_jwt")
      if (!token) {
        console.log("No token found, redirecting to login")
        router.push("/login")
        return
      }

      console.log("Token found, validating...")
      const { valid, email } = await validateToken(token)
      if (!valid) {
        console.log("Token invalid, redirecting to login")
        router.push("/login")
        return
      }

      console.log("Token valid, checking authorized users...")
      // Fetch authorized users and check if the user's email is in the list
      try {
        const authorizedUsers = await getAuthorizedEmails()
        console.log("Authorized users:", authorizedUsers)
        console.log("User email:", email)
        if (!authorizedUsers.includes(email as string)) {
          console.log("User not authorized, redirecting to login")
          router.push("/login?error=unauthorized")
          return
        }
        // If everything is fine, user can stay
        console.log("Authentication successful, setting isAuthenticated to true")
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Error checking authorization:", error)
        // Clear token on auth error
        localStorage.removeItem("admin_jwt")
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1" />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}
