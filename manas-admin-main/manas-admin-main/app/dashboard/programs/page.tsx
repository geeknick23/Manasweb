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
import { getAllPrograms, createProgram, updateProgram, deleteProgram, type Program } from "@/lib/api"

export default function ProgramsPage() {
    const [programs, setPrograms] = useState<Program[]>([])
    const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const { toast } = useToast()

    useEffect(() => { fetchPrograms() }, [])

    useEffect(() => {
        const filtered = programs.filter(
            (p) =>
                p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        setFilteredPrograms(filtered)
    }, [programs, searchTerm])

    const fetchPrograms = async () => {
        try {
            const data = await getAllPrograms()
            setPrograms(data)
            setFilteredPrograms(data)
        } catch {
            toast({ title: "Error", description: "Failed to fetch programs", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = async (data: Omit<Program, "_id" | "id">) => {
        try {
            const newItem = await createProgram(data)
            setPrograms([...programs, newItem])
            setCreateDialogOpen(false)
            toast({ title: "Success", description: "Program created successfully" })
        } catch {
            toast({ title: "Error", description: "Failed to create program", variant: "destructive" })
        }
    }

    const handleUpdate = async (data: Partial<Program>) => {
        if (!selectedProgram) return
        try {
            const updated = await updateProgram(selectedProgram._id, data)
            setPrograms(programs.map((p) => (p._id === selectedProgram._id ? updated : p)))
            setEditDialogOpen(false)
            toast({ title: "Success", description: "Program updated successfully" })
        } catch {
            toast({ title: "Error", description: "Failed to update program", variant: "destructive" })
        }
    }

    const handleDelete = async () => {
        if (!selectedProgram) return
        try {
            await deleteProgram(selectedProgram._id)
            setPrograms(programs.filter((p) => p._id !== selectedProgram._id))
            setDeleteDialogOpen(false)
            toast({ title: "Success", description: "Program deleted successfully" })
        } catch {
            toast({ title: "Error", description: "Failed to delete program", variant: "destructive" })
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div><h1 className="text-3xl font-bold">Programs</h1><p className="text-muted-foreground">Manage programs displayed in the app</p></div>
                <div className="animate-pulse space-y-4"><div className="h-10 bg-gray-200 rounded"></div><div className="h-64 bg-gray-200 rounded"></div></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div><h1 className="text-3xl font-bold">Programs</h1><p className="text-muted-foreground">Manage programs displayed in the app</p></div>
                <Button onClick={() => setCreateDialogOpen(true)}><Plus className="h-4 w-4 mr-2" />Add Program</Button>
            </div>

            <Card>
                <CardHeader><CardTitle>Programs Management</CardTitle><CardDescription>View and manage all programs</CardDescription></CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search programs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" />
                    </div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Order</TableHead>
                                    <TableHead>Active</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPrograms.map((program) => (
                                    <TableRow key={program._id}>
                                        <TableCell className="font-medium">{program.title}</TableCell>
                                        <TableCell className="max-w-xs truncate">{program.description}</TableCell>
                                        <TableCell>{program.order}</TableCell>
                                        <TableCell>{program.isActive ? "✅" : "❌"}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Button variant="ghost" size="sm" onClick={() => { setSelectedProgram(program); setEditDialogOpen(true) }}><Edit className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="sm" onClick={() => { setSelectedProgram(program); setDeleteDialogOpen(true) }}><Trash2 className="h-4 w-4" /></Button>
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
                <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Create Program</DialogTitle><DialogDescription>Add a new program</DialogDescription></DialogHeader>
                    <ProgramForm onSubmit={handleCreate} onCancel={() => setCreateDialogOpen(false)} />
                </DialogContent>
            </Dialog>

            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Program</DialogTitle><DialogDescription>Update program information</DialogDescription></DialogHeader>
                    {selectedProgram && <ProgramForm program={selectedProgram} onSubmit={handleUpdate} onCancel={() => setEditDialogOpen(false)} />}
                </DialogContent>
            </Dialog>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent><DialogHeader><DialogTitle>Delete Program</DialogTitle><DialogDescription>Are you sure you want to delete &quot;{selectedProgram?.title}&quot;? This action cannot be undone.</DialogDescription></DialogHeader>
                    <DialogFooter><Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleDelete}>Delete</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function ProgramForm({ program, onSubmit, onCancel }: { program?: Program; onSubmit: (data: any) => void; onCancel: () => void }) {
    const [formData, setFormData] = useState({
        title: program?.title || "",
        description: program?.description || "",
        imageUrl: program?.imageUrl || "",
        order: program?.order || 0,
        isActive: program?.isActive ?? true,
    })

    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSubmit(formData) }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label htmlFor="title">Title</Label><Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required /></div>
            <div><Label htmlFor="description">Description</Label><Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required /></div>
            <div><Label htmlFor="imageUrl">Image URL</Label><Input id="imageUrl" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} /></div>
            <div className="flex gap-4">
                <div className="flex-1"><Label htmlFor="order">Display Order</Label><Input id="order" type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} /></div>
                <div className="flex items-center gap-2 pt-6"><input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} /><Label htmlFor="isActive">Active</Label></div>
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button><Button type="submit">{program ? "Update" : "Create"}</Button></DialogFooter>
        </form>
    )
}
