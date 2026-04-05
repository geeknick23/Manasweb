"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Users, Heart, Trophy, MessageSquare, Newspaper, LayoutDashboard, LogOut, Calendar, BookOpen, FolderKanban, Phone, CreditCard, Flag, HandHelping } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    url: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Admin Users",
    url: "/dashboard/admin-users",
    icon: Users,
  },
  {
    title: "Events",
    url: "/dashboard/events",
    icon: Calendar,
  },
  {
    title: "Volunteer Applications",
    url: "/dashboard/volunteers",
    icon: Heart,
  },
  {
    title: "Impact Cards",
    url: "/dashboard/impact-cards",
    icon: Heart,
  },
  {
    title: "Achievement Cards",
    url: "/dashboard/achievement-cards",
    icon: Trophy,
  },
  {
    title: "Success Stories",
    url: "/dashboard/success-stories",
    icon: MessageSquare,
  },
  {
    title: "Media Cards",
    url: "/dashboard/media-cards",
    icon: Newspaper,
  },
]

const contentMenuItems = [
  {
    title: "Programs",
    url: "/dashboard/programs",
    icon: BookOpen,
  },
  {
    title: "Projects",
    url: "/dashboard/projects",
    icon: FolderKanban,
  },
  {
    title: "Contact Info",
    url: "/dashboard/contact-info",
    icon: Phone,
  },
  {
    title: "Donate Info",
    url: "/dashboard/donate-info",
    icon: CreditCard,
  },
  {
    title: "Journey Milestones",
    url: "/dashboard/milestones",
    icon: Flag,
  },
  {
    title: "Volunteer Roles",
    url: "/dashboard/volunteer-roles",
    icon: HandHelping,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = () => {
    localStorage.removeItem("admin_jwt")
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the admin panel.",
    })
    router.push("/")
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-purple-600">MANAS</h2>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Content Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

