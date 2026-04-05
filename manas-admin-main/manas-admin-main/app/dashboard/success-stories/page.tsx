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
import {
  getAllSuccessStories,
  createSuccessStory,
  updateSuccessStory,
  deleteSuccessStory,
  type SuccessStory,
} from "@/lib/api"

export default function SuccessStoriesPage() {
  const [stories, setStories] = useState<SuccessStory[]>([])
  const [filteredStories, setFilteredStories] = useState<SuccessStory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchStories()
  })

  useEffect(() => {
    const filtered = stories.filter(
      (story) =>
        story.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.quote.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredStories(filtered)
  }, [stories, searchTerm])

  const fetchStories = async () => {
    try {
      const data = await getAllSuccessStories()
      setStories(data)
      setFilteredStories(data)
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch success stories",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateStory = async (storyData: Omit<SuccessStory, "_id" | "id">) => {
    try {
      const newStory = await createSuccessStory(storyData)
      setStories([...stories, newStory])
      setCreateDialogOpen(false)
      toast({
        title: "Success",
        description: "Success story created successfully",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to create success story",
        variant: "destructive",
      })
    }
  }

  const handleUpdateStory = async (storyData: Partial<SuccessStory>) => {
    if (!selectedStory) return

    try {
      const updatedStory = await updateSuccessStory(selectedStory._id, storyData)
      setStories(stories.map((story) => (story._id === selectedStory._id ? updatedStory : story)))
      setEditDialogOpen(false)
      toast({
        title: "Success",
        description: "Success story updated successfully",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to update success story",
        variant: "destructive",
      })
    }
  }

  const handleDeleteStory = async () => {
    if (!selectedStory) return

    try {
      await deleteSuccessStory(selectedStory._id)
      setStories(stories.filter((story) => story._id !== selectedStory._id))
      setDeleteDialogOpen(false)
      toast({
        title: "Success",
        description: "Success story deleted successfully",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete success story",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Success Stories</h1>
          <p className="text-muted-foreground">Manage user testimonials and success stories</p>
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
          <h1 className="text-3xl font-bold">Success Stories</h1>
          <p className="text-muted-foreground">Manage user testimonials and success stories</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Success Story
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Success Stories Management</CardTitle>
          <CardDescription>View and manage all success stories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search success stories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Author</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Quote</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStories.map((story) => (
                  <TableRow key={story._id}>
                    <TableCell className="font-medium">{story.author}</TableCell>
                    <TableCell>{story.location}</TableCell>
                    <TableCell className="max-w-md truncate">&quot;{story.quote}&quot;</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedStory(story)
                            setEditDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedStory(story)
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

      {/* Create Success Story Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Success Story</DialogTitle>
            <DialogDescription>Add a new user testimonial or success story</DialogDescription>
          </DialogHeader>
          <SuccessStoryForm onSubmit={handleCreateStory} onCancel={() => setCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Success Story Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Success Story</DialogTitle>
            <DialogDescription>Update success story information</DialogDescription>
          </DialogHeader>
          {selectedStory && (
            <SuccessStoryForm
              story={selectedStory}
              onSubmit={handleUpdateStory}
              onCancel={() => setEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Success Story Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Success Story</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the story by {selectedStory?.author}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteStory}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SuccessStoryForm({
  story,
  onSubmit,
  onCancel,
}: {
  story?: SuccessStory
  onSubmit: (data: Omit<SuccessStory, "_id" | "id">) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    quote: story?.quote || "",
    author: story?.author || "",
    location: story?.location || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="author">Author</Label>
        <Input
          id="author"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="quote">Quote</Label>
        <Textarea
          id="quote"
          value={formData.quote}
          onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
          placeholder="Enter the success story or testimonial..."
          rows={4}
          required
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{story ? "Update" : "Create"}</Button>
      </DialogFooter>
    </form>
  )
}
