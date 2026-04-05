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
import { Search, Edit, Trash2, Plus, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getAllProjects, createProject, updateProject, deleteProject, type Project } from "@/lib/api"

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const { toast } = useToast()

    useEffect(() => { fetchProjects() }, [])

    useEffect(() => {
        const filtered = projects.filter(
            (p) =>
                p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        setFilteredProjects(filtered)
    }, [projects, searchTerm])

    const fetchProjects = async () => {
        try {
            const data = await getAllProjects()
            setProjects(data)
            setFilteredProjects(data)
        } catch {
            toast({ title: "Error", description: "Failed to fetch projects", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = async (data: Omit<Project, "_id" | "id">) => {
        try {
            const newItem = await createProject(data)
            setProjects([...projects, newItem])
            setCreateDialogOpen(false)
            toast({ title: "Success", description: "Project created successfully" })
        } catch {
            toast({ title: "Error", description: "Failed to create project", variant: "destructive" })
        }
    }

    const handleUpdate = async (data: Partial<Project>) => {
        if (!selectedProject) return
        try {
            const updated = await updateProject(selectedProject._id, data)
            setProjects(projects.map((p) => (p._id === selectedProject._id ? updated : p)))
            setEditDialogOpen(false)
            toast({ title: "Success", description: "Project updated successfully" })
        } catch {
            toast({ title: "Error", description: "Failed to update project", variant: "destructive" })
        }
    }

    const handleDelete = async () => {
        if (!selectedProject) return
        try {
            await deleteProject(selectedProject._id)
            setProjects(projects.filter((p) => p._id !== selectedProject._id))
            setDeleteDialogOpen(false)
            toast({ title: "Success", description: "Project deleted successfully" })
        } catch {
            toast({ title: "Error", description: "Failed to delete project", variant: "destructive" })
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div><h1 className="text-3xl font-bold">Projects</h1><p className="text-muted-foreground">Manage projects displayed in the app</p></div>
                <div className="animate-pulse space-y-4"><div className="h-10 bg-gray-200 rounded"></div><div className="h-64 bg-gray-200 rounded"></div></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div><h1 className="text-3xl font-bold">Projects</h1><p className="text-muted-foreground">Manage projects displayed in the app</p></div>
                <Button onClick={() => setCreateDialogOpen(true)}><Plus className="h-4 w-4 mr-2" />Add Project</Button>
            </div>

            <Card>
                <CardHeader><CardTitle>Projects Management</CardTitle><CardDescription>View and manage all projects</CardDescription></CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search projects..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" />
                    </div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Highlights</TableHead>
                                    <TableHead>Order</TableHead>
                                    <TableHead>Active</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProjects.map((project) => (
                                    <TableRow key={project._id}>
                                        <TableCell className="font-medium">{project.title}</TableCell>
                                        <TableCell className="max-w-xs truncate">{project.description}</TableCell>
                                        <TableCell>{project.highlights?.length || 0} items</TableCell>
                                        <TableCell>{project.order}</TableCell>
                                        <TableCell>{project.isActive ? "✅" : "❌"}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Button variant="ghost" size="sm" onClick={() => { setSelectedProject(project); setEditDialogOpen(true) }}><Edit className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="sm" onClick={() => { setSelectedProject(project); setDeleteDialogOpen(true) }}><Trash2 className="h-4 w-4" /></Button>
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
                <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Create Project</DialogTitle><DialogDescription>Add a new project</DialogDescription></DialogHeader>
                    <ProjectForm onSubmit={handleCreate} onCancel={() => setCreateDialogOpen(false)} />
                </DialogContent>
            </Dialog>

            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Project</DialogTitle><DialogDescription>Update project information</DialogDescription></DialogHeader>
                    {selectedProject && <ProjectForm project={selectedProject} onSubmit={handleUpdate} onCancel={() => setEditDialogOpen(false)} />}
                </DialogContent>
            </Dialog>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent><DialogHeader><DialogTitle>Delete Project</DialogTitle><DialogDescription>Are you sure you want to delete &quot;{selectedProject?.title}&quot;? This action cannot be undone.</DialogDescription></DialogHeader>
                    <DialogFooter><Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleDelete}>Delete</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function ProjectForm({ project, onSubmit, onCancel }: { project?: Project; onSubmit: (data: any) => void; onCancel: () => void }) {
    const [formData, setFormData] = useState({
        title: project?.title || "",
        description: project?.description || "",
        highlights: project?.highlights || [] as string[],
        icon: project?.icon || "star",
        color: project?.color || "#6366f1",
        order: project?.order || 0,
        isActive: project?.isActive ?? true,
    })
    const [newHighlight, setNewHighlight] = useState("")

    const addHighlight = () => {
        if (newHighlight.trim()) {
            setFormData({ ...formData, highlights: [...formData.highlights, newHighlight.trim()] })
            setNewHighlight("")
        }
    }

    const removeHighlight = (index: number) => {
        setFormData({ ...formData, highlights: formData.highlights.filter((_, i) => i !== index) })
    }

    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSubmit(formData) }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label htmlFor="title">Title</Label><Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required /></div>
            <div><Label htmlFor="description">Description</Label><Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required /></div>
            <div>
                <Label>Highlights</Label>
                <div className="flex gap-2 mb-2">
                    <Input value={newHighlight} onChange={(e) => setNewHighlight(e.target.value)} placeholder="Add a highlight..." onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addHighlight() } }} />
                    <Button type="button" variant="outline" onClick={addHighlight}>Add</Button>
                </div>
                <div className="space-y-1">
                    {formData.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded">
                            <span className="flex-1">{h}</span>
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeHighlight(i)}><X className="h-3 w-3" /></Button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex gap-4">
                <div className="flex-1"><Label htmlFor="icon">Icon Name</Label><Input id="icon" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} placeholder="e.g. heart, star, school" /></div>
                <div className="flex-1"><Label htmlFor="color">Color</Label><Input id="color" type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} /></div>
            </div>
            <div className="flex gap-4">
                <div className="flex-1"><Label htmlFor="order">Display Order</Label><Input id="order" type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} /></div>
                <div className="flex items-center gap-2 pt-6"><input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} /><Label htmlFor="isActive">Active</Label></div>
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button><Button type="submit">{project ? "Update" : "Create"}</Button></DialogFooter>
        </form>
    )
}
