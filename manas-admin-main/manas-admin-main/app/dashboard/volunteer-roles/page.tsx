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
import { Textarea } from "@/components/ui/textarea"
import { Search, Edit, Trash2, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getAllVolunteerRoles, createVolunteerRole, updateVolunteerRole, deleteVolunteerRole, type VolunteerRole } from "@/lib/api"

export default function VolunteerRolesPage() {
    const [roles, setRoles] = useState<VolunteerRole[]>([])
    const [filteredRoles, setFilteredRoles] = useState<VolunteerRole[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedRole, setSelectedRole] = useState<VolunteerRole | null>(null)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const { toast } = useToast()

    useEffect(() => { fetchRoles() }, [])

    useEffect(() => {
        const filtered = roles.filter(
            (r) =>
                r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.description.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        setFilteredRoles(filtered)
    }, [roles, searchTerm])

    const fetchRoles = async () => {
        try {
            const data = await getAllVolunteerRoles()
            setRoles(data)
            setFilteredRoles(data)
        } catch {
            toast({ title: "Error", description: "Failed to fetch volunteer roles", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = async (data: Omit<VolunteerRole, "_id" | "id">) => {
        try {
            const newItem = await createVolunteerRole(data)
            setRoles([...roles, newItem])
            setCreateDialogOpen(false)
            toast({ title: "Success", description: "Volunteer role created successfully" })
        } catch {
            toast({ title: "Error", description: "Failed to create volunteer role", variant: "destructive" })
        }
    }

    const handleUpdate = async (data: Partial<VolunteerRole>) => {
        if (!selectedRole) return
        try {
            const updated = await updateVolunteerRole(selectedRole._id, data)
            setRoles(roles.map((r) => (r._id === selectedRole._id ? updated : r)))
            setEditDialogOpen(false)
            toast({ title: "Success", description: "Volunteer role updated successfully" })
        } catch {
            toast({ title: "Error", description: "Failed to update volunteer role", variant: "destructive" })
        }
    }

    const handleDelete = async () => {
        if (!selectedRole) return
        try {
            await deleteVolunteerRole(selectedRole._id)
            setRoles(roles.filter((r) => r._id !== selectedRole._id))
            setDeleteDialogOpen(false)
            toast({ title: "Success", description: "Volunteer role deleted successfully" })
        } catch {
            toast({ title: "Error", description: "Failed to delete volunteer role", variant: "destructive" })
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div><h1 className="text-3xl font-bold">Volunteer Roles</h1><p className="text-muted-foreground">Manage volunteer opportunity types</p></div>
                <div className="animate-pulse space-y-4"><div className="h-10 bg-gray-200 rounded"></div><div className="h-64 bg-gray-200 rounded"></div></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div><h1 className="text-3xl font-bold">Volunteer Roles</h1><p className="text-muted-foreground">Manage volunteer opportunity types</p></div>
                <Button onClick={() => setCreateDialogOpen(true)}><Plus className="h-4 w-4 mr-2" />Add Role</Button>
            </div>

            <Card>
                <CardHeader><CardTitle>Volunteer Roles Management</CardTitle><CardDescription>View and manage all volunteer roles</CardDescription></CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search roles..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" />
                    </div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Icon</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Order</TableHead>
                                    <TableHead>Active</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRoles.map((role) => (
                                    <TableRow key={role._id}>
                                        <TableCell>{role.icon}</TableCell>
                                        <TableCell className="font-medium">{role.title}</TableCell>
                                        <TableCell className="max-w-xs truncate">{role.description}</TableCell>
                                        <TableCell>{role.order}</TableCell>
                                        <TableCell>{role.isActive ? "✅" : "❌"}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Button variant="ghost" size="sm" onClick={() => { setSelectedRole(role); setEditDialogOpen(true) }}><Edit className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="sm" onClick={() => { setSelectedRole(role); setDeleteDialogOpen(true) }}><Trash2 className="h-4 w-4" /></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Create Volunteer Role</DialogTitle><DialogDescription>Add a new volunteer role</DialogDescription></DialogHeader>
                    <VolunteerRoleForm onSubmit={handleCreate} onCancel={() => setCreateDialogOpen(false)} />
                </DialogContent>
            </Dialog>

            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Volunteer Role</DialogTitle><DialogDescription>Update volunteer role information</DialogDescription></DialogHeader>
                    {selectedRole && <VolunteerRoleForm role={selectedRole} onSubmit={handleUpdate} onCancel={() => setEditDialogOpen(false)} />}
                </DialogContent>
            </Dialog>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent><DialogHeader><DialogTitle>Delete Volunteer Role</DialogTitle><DialogDescription>Are you sure you want to delete &quot;{selectedRole?.title}&quot;? This action cannot be undone.</DialogDescription></DialogHeader>
                    <DialogFooter><Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleDelete}>Delete</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function VolunteerRoleForm({ role, onSubmit, onCancel }: { role?: VolunteerRole; onSubmit: (data: any) => void; onCancel: () => void }) {
    const [formData, setFormData] = useState({
        title: role?.title || "",
        description: role?.description || "",
        icon: role?.icon || "star",
        order: role?.order || 0,
        isActive: role?.isActive ?? true,
    })

    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSubmit(formData) }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label htmlFor="title">Title</Label><Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required /></div>
            <div><Label htmlFor="description">Description</Label><Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required /></div>
            <div><Label htmlFor="icon">Icon Name</Label><Input id="icon" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} placeholder="e.g. school, medical_services, favorite" /></div>
            <div className="flex gap-4">
                <div className="flex-1"><Label htmlFor="order">Display Order</Label><Input id="order" type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} /></div>
                <div className="flex items-center gap-2 pt-6"><input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} /><Label htmlFor="isActive">Active</Label></div>
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button><Button type="submit">{role ? "Update" : "Create"}</Button></DialogFooter>
        </form>
    )
}
