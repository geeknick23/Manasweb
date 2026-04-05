"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Search, Edit, Trash2, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getAllUsers, updateUser, deleteUser, type User } from "@/lib/api"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.profession.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredUsers(filtered)
  }, [users, searchTerm])

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers()
      setUsers(data)
      setFilteredUsers(data)
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUser = async (userData: Partial<User>) => {
    if (!selectedUser) return

    try {
      const updatedUser = await updateUser(selectedUser._id, userData)
      setUsers(users.map((user) => (user._id === selectedUser._id ? updatedUser : user)))
      setEditDialogOpen(false)
      toast({
        title: "Success",
        description: "User updated successfully",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    try {
      await deleteUser(selectedUser._id)
      setUsers(users.filter((user) => user._id !== selectedUser._id))
      setDeleteDialogOpen(false)
      toast({
        title: "Success",
        description: "User deleted successfully",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage registered users</p>
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
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground">Manage registered users</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>View and manage all registered users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Profession</TableHead>
                  <TableHead>Caste</TableHead>
                  <TableHead>Religion</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.full_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.is_verified ? "default" : "secondary"}>
                        {user.is_verified ? "Verified" : "Unverified"}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.profession}</TableCell>
                    <TableCell>{user.caste}</TableCell>
                    <TableCell>{user.religion}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user)
                            setViewDialogOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user)
                            setEditDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user)
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

      {/* View User Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Complete user information</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Full Name</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser.full_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Date of Birth</Label>
                  <p className="text-sm text-muted-foreground">{new Date(selectedUser.date_of_birth).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Gender</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser.gender}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Marital Status</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser.marital_status}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Education</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser.education}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Profession</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser.profession}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser.phone_number}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Location</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.location.village}, {selectedUser.location.tehsil}, {selectedUser.location.district}, {selectedUser.location.state}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Guardian Name</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser.guardian.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Guardian Contact</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser.guardian.contact}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Caste</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser.caste}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Religion</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser.religion}</p>
                </div>
                {selectedUser.divorce_finalized !== undefined && (
                  <div>
                    <Label className="text-sm font-medium">Divorce Finalized</Label>
                    <p className="text-sm text-muted-foreground">{selectedUser.divorce_finalized ? 'Yes' : 'No'}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium">Children Count</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser.children_count}</p>
                </div>
                {selectedUser.children && selectedUser.children.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Children Details</Label>
                    <div className="space-y-1">
                      {selectedUser.children.map((child, index) => (
                        <p key={index} className="text-sm text-muted-foreground">
                          Child {index + 1}: {child.gender}, Age: {child.age}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {selectedUser.interests_hobbies && (
                <div>
                  <Label className="text-sm font-medium">Interests & Hobbies</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser.interests_hobbies}</p>
                </div>
              )}
              {selectedUser.brief_personal_description && (
                <div>
                  <Label className="text-sm font-medium">Personal Description</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser.brief_personal_description}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <UserEditForm user={selectedUser} onSubmit={handleUpdateUser} onCancel={() => setEditDialogOpen(false)} />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUser?.full_name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function UserEditForm({
  user,
  onSubmit,
  onCancel,
}: {
  user: User
  onSubmit: (data: Partial<User>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    full_name: user.full_name,
    email: user.email,
    date_of_birth: user.date_of_birth,
    gender: user.gender,
    marital_status: user.marital_status,
    education: user.education,
    profession: user.profession,
    phone_number: user.phone_number,
    interests_hobbies: user.interests_hobbies || "",
    brief_personal_description: user.brief_personal_description || "",
    location: user.location,
    guardian: user.guardian,
    caste: user.caste,
    religion: user.religion,
    divorce_finalized: user.divorce_finalized,
    children: user.children || [],
    children_count: user.children_count,
    is_verified: user.is_verified,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            required
          />
        </div>
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
        <div>
          <Label htmlFor="date_of_birth">Date of Birth</Label>
          <Input
            id="date_of_birth"
            type="date"
            value={formData.date_of_birth}
            onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={formData.gender}
            onValueChange={(value: "male" | "female") => setFormData({ ...formData, gender: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="profession">Profession</Label>
          <Input
            id="profession"
            value={formData.profession}
            onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone_number">Phone Number</Label>
          <Input
            id="phone_number"
            value={formData.phone_number}
            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="guardian.name">Guardian Name</Label>
          <Input
            id="guardian.name"
            value={formData.guardian.name}
            onChange={(e) => setFormData({ ...formData, guardian: { ...formData.guardian, name: e.target.value } })}
            required
          />
        </div>
        <div>
          <Label htmlFor="guardian.contact">Guardian Contact</Label>
          <Input
            id="guardian.contact"
            value={formData.guardian.contact}
            onChange={(e) => setFormData({ ...formData, guardian: { ...formData.guardian, contact: e.target.value } })}
            required
          />
        </div>
        <div>
          <Label htmlFor="caste">Caste</Label>
          <Select
            value={formData.caste}
            onValueChange={(value: "general" | "obc" | "sc" | "st" | "other") => setFormData({ ...formData, caste: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="obc">OBC</SelectItem>
              <SelectItem value="sc">SC</SelectItem>
              <SelectItem value="st">ST</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="religion">Religion</Label>
          <Select
            value={formData.religion}
            onValueChange={(value: "hindu" | "muslim" | "christian" | "sikh" | "buddhist" | "jain" | "other") => setFormData({ ...formData, religion: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hindu">Hindu</SelectItem>
              <SelectItem value="muslim">Muslim</SelectItem>
              <SelectItem value="christian">Christian</SelectItem>
              <SelectItem value="sikh">Sikh</SelectItem>
              <SelectItem value="buddhist">Buddhist</SelectItem>
              <SelectItem value="jain">Jain</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="location.village">Village</Label>
          <Input
            id="location.village"
            value={formData.location.village}
            onChange={(e) => setFormData({ ...formData, location: { ...formData.location, village: e.target.value } })}
            required
          />
        </div>
        <div>
          <Label htmlFor="location.tehsil">Tehsil</Label>
          <Input
            id="location.tehsil"
            value={formData.location.tehsil}
            onChange={(e) => setFormData({ ...formData, location: { ...formData.location, tehsil: e.target.value } })}
            required
          />
        </div>
        <div>
          <Label htmlFor="location.district">District</Label>
          <Input
            id="location.district"
            value={formData.location.district}
            onChange={(e) => setFormData({ ...formData, location: { ...formData.location, district: e.target.value } })}
            required
          />
        </div>
        <div>
          <Label htmlFor="location.state">State</Label>
          <Input
            id="location.state"
            value={formData.location.state}
            onChange={(e) => setFormData({ ...formData, location: { ...formData.location, state: e.target.value } })}
            required
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_verified"
          checked={formData.is_verified}
          onCheckedChange={(checked) => setFormData({ ...formData, is_verified: checked })}
        />
        <Label htmlFor="is_verified">Verified User</Label>
      </div>

      {formData.marital_status === 'divorcee' && (
        <div className="flex items-center space-x-2">
          <Switch
            id="divorce_finalized"
            checked={formData.divorce_finalized || false}
            onCheckedChange={(checked) => setFormData({ ...formData, divorce_finalized: checked })}
          />
          <Label htmlFor="divorce_finalized">Divorce Legally Finalized</Label>
        </div>
      )}

      <div>
        <Label htmlFor="children_count">Number of Children</Label>
        <Input
          id="children_count"
          type="number"
          min="0"
          value={formData.children_count}
          onChange={(e) => setFormData({ ...formData, children_count: Number.parseInt(e.target.value) })}
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </DialogFooter>
    </form>
  )
}
