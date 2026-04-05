"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Edit, Trash2, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  getAllAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  type AdminUser,
} from "@/lib/api"

export default function AdminUsersPage() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [filteredAdminUsers, setFilteredAdminUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAdminUser, setSelectedAdminUser] = useState<AdminUser | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchAdminUsers()
  }, [])

  useEffect(() => {
    const filtered = adminUsers.filter((user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredAdminUsers(filtered)
  }, [adminUsers, searchTerm])

  const fetchAdminUsers = async () => {
    try {
      const data = await getAllAdminUsers()
      setAdminUsers(data)
      setFilteredAdminUsers(data)
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch admin users",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAdminUser = async (userData: { email: string }) => {
    try {
      const newUser = await createAdminUser(userData)
      setAdminUsers([...adminUsers, newUser])
      setCreateDialogOpen(false)
      toast({
        title: "Success",
        description: "Admin user created successfully",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to create admin user",
        variant: "destructive",
      })
    }
  }

  const handleUpdateAdminUser = async (userData: { email: string }) => {
    if (!selectedAdminUser) return
    try {
      const updatedUser = await updateAdminUser(selectedAdminUser._id, userData)
      setAdminUsers(adminUsers.map((user) => (user._id === selectedAdminUser._id ? updatedUser : user)))
      setEditDialogOpen(false)
      toast({
        title: "Success",
        description: "Admin user updated successfully",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to update admin user",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAdminUser = async () => {
    if (!selectedAdminUser) return
    try {
      await deleteAdminUser(selectedAdminUser._id)
      setAdminUsers(adminUsers.filter((user) => user._id !== selectedAdminUser._id))
      setDeleteDialogOpen(false)
      toast({
        title: "Success",
        description: "Admin user deleted successfully",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete admin user",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Users</h1>
          <p className="text-muted-foreground">Manage admin users</p>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Users</h1>
          <p className="text-muted-foreground">Manage admin users</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Admin User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin User Management</CardTitle>
          <CardDescription>View and manage all admin users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search admin users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdminUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>{user.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedAdminUser(user)
                            setEditDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedAdminUser(user)
                            setDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create Admin User Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Admin User</DialogTitle>
            <DialogDescription>Add a new admin user by email</DialogDescription>
          </DialogHeader>
          <AdminUserForm onSubmit={handleCreateAdminUser} onCancel={() => setCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Admin User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Admin User</DialogTitle>
            <DialogDescription>Update admin user email</DialogDescription>
          </DialogHeader>
          {selectedAdminUser && (
            <AdminUserForm
              adminUser={selectedAdminUser}
              onSubmit={handleUpdateAdminUser}
              onCancel={() => setEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Admin User Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Admin User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedAdminUser?.email}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAdminUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AdminUserForm({
  adminUser,
  onSubmit,
  onCancel,
}: {
  adminUser?: AdminUser
  onSubmit: (data: { email: string }) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    email: adminUser?.email || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{adminUser ? "Update" : "Create"}</Button>
      </DialogFooter>
    </form>
  )
} 