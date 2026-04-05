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
import { getAllMilestones, createMilestone, updateMilestone, deleteMilestone, type Milestone } from "@/lib/api"

export default function MilestonesPage() {
    const [milestones, setMilestones] = useState<Milestone[]>([])
    const [filteredMilestones, setFilteredMilestones] = useState<Milestone[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const { toast } = useToast()

    useEffect(() => { fetchMilestones() }, [])

    useEffect(() => {
        const filtered = milestones.filter(
            (m) =>
                m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                m.date.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        setFilteredMilestones(filtered)
    }, [milestones, searchTerm])

    const fetchMilestones = async () => {
        try {
            const data = await getAllMilestones()
            setMilestones(data)
            setFilteredMilestones(data)
        } catch {
            toast({ title: "Error", description: "Failed to fetch milestones", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = async (data: Omit<Milestone, "_id" | "id">) => {
        try {
            const newItem = await createMilestone(data)
            setMilestones([...milestones, newItem])
            setCreateDialogOpen(false)
            toast({ title: "Success", description: "Milestone created successfully" })
        } catch {
            toast({ title: "Error", description: "Failed to create milestone", variant: "destructive" })
        }
    }

    const handleUpdate = async (data: Partial<Milestone>) => {
        if (!selectedMilestone) return
        try {
            const updated = await updateMilestone(selectedMilestone._id, data)
            setMilestones(milestones.map((m) => (m._id === selectedMilestone._id ? updated : m)))
            setEditDialogOpen(false)
            toast({ title: "Success", description: "Milestone updated successfully" })
        } catch {
            toast({ title: "Error", description: "Failed to update milestone", variant: "destructive" })
        }
    }

    const handleDelete = async () => {
        if (!selectedMilestone) return
        try {
            await deleteMilestone(selectedMilestone._id)
            setMilestones(milestones.filter((m) => m._id !== selectedMilestone._id))
            setDeleteDialogOpen(false)
            toast({ title: "Success", description: "Milestone deleted successfully" })
        } catch {
            toast({ title: "Error", description: "Failed to delete milestone", variant: "destructive" })
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div><h1 className="text-3xl font-bold">Journey Milestones</h1><p className="text-muted-foreground">Manage timeline milestones on the About page</p></div>
                <div className="animate-pulse space-y-4"><div className="h-10 bg-gray-200 rounded"></div><div className="h-64 bg-gray-200 rounded"></div></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div><h1 className="text-3xl font-bold">Journey Milestones</h1><p className="text-muted-foreground">Manage timeline milestones on the About page</p></div>
                <Button onClick={() => setCreateDialogOpen(true)}><Plus className="h-4 w-4 mr-2" />Add Milestone</Button>
            </div>

            <Card>
                <CardHeader><CardTitle>Milestones Management</CardTitle><CardDescription>View and manage journey timeline milestones</CardDescription></CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search milestones..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" />
                    </div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Order</TableHead>
                                    <TableHead>Active</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredMilestones.map((milestone) => (
                                    <TableRow key={milestone._id}>
                                        <TableCell className="font-medium">{milestone.date}</TableCell>
                                        <TableCell>{milestone.title}</TableCell>
                                        <TableCell className="max-w-xs truncate">{milestone.description}</TableCell>
                                        <TableCell>{milestone.order}</TableCell>
                                        <TableCell>{milestone.isActive ? "✅" : "❌"}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Button variant="ghost" size="sm" onClick={() => { setSelectedMilestone(milestone); setEditDialogOpen(true) }}><Edit className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="sm" onClick={() => { setSelectedMilestone(milestone); setDeleteDialogOpen(true) }}><Trash2 className="h-4 w-4" /></Button>
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
                <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Create Milestone</DialogTitle><DialogDescription>Add a new journey milestone</DialogDescription></DialogHeader>
                    <MilestoneForm onSubmit={handleCreate} onCancel={() => setCreateDialogOpen(false)} />
                </DialogContent>
            </Dialog>

            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Milestone</DialogTitle><DialogDescription>Update milestone information</DialogDescription></DialogHeader>
                    {selectedMilestone && <MilestoneForm milestone={selectedMilestone} onSubmit={handleUpdate} onCancel={() => setEditDialogOpen(false)} />}
                </DialogContent>
            </Dialog>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent><DialogHeader><DialogTitle>Delete Milestone</DialogTitle><DialogDescription>Are you sure you want to delete &quot;{selectedMilestone?.title}&quot;? This action cannot be undone.</DialogDescription></DialogHeader>
                    <DialogFooter><Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleDelete}>Delete</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function MilestoneForm({ milestone, onSubmit, onCancel }: { milestone?: Milestone; onSubmit: (data: any) => void; onCancel: () => void }) {
    const [formData, setFormData] = useState({
        date: milestone?.date || "",
        title: milestone?.title || "",
        description: milestone?.description || "",
        order: milestone?.order || 0,
        isActive: milestone?.isActive ?? true,
    })

    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSubmit(formData) }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label htmlFor="date">Date</Label><Input id="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} placeholder="e.g. Aug 2022" required /></div>
            <div><Label htmlFor="title">Title</Label><Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required /></div>
            <div><Label htmlFor="description">Description</Label><Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required /></div>
            <div className="flex gap-4">
                <div className="flex-1"><Label htmlFor="order">Display Order</Label><Input id="order" type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} /></div>
                <div className="flex items-center gap-2 pt-6"><input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} /><Label htmlFor="isActive">Active</Label></div>
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button><Button type="submit">{milestone ? "Update" : "Create"}</Button></DialogFooter>
        </form>
    )
}
