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
import { Search, Edit, Trash2, Plus, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getAllMediaCards, createMediaCard, updateMediaCard, deleteMediaCard, type MediaCard } from "@/lib/api"

export default function MediaCardsPage() {
  const [cards, setCards] = useState<MediaCard[]>([])
  const [filteredCards, setFilteredCards] = useState<MediaCard[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCard, setSelectedCard] = useState<MediaCard | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchCards()
  }, [])

  useEffect(() => {
    const filtered = cards.filter(
      (card) =>
        card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredCards(filtered)
  }, [cards, searchTerm])

  const fetchCards = async () => {
    try {
      const data = await getAllMediaCards()
      setCards(data)
      setFilteredCards(data)
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch media cards",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCard = async (cardData: Omit<MediaCard, "_id" | "id">) => {
    try {
      const newCard = await createMediaCard(cardData)
      setCards([...cards, newCard])
      setCreateDialogOpen(false)
      toast({
        title: "Success",
        description: "Media card created successfully",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to create media card",
        variant: "destructive",
      })
    }
  }

  const handleUpdateCard = async (cardData: Partial<MediaCard>) => {
    if (!selectedCard) return

    try {
      const updatedCard = await updateMediaCard(selectedCard._id, cardData)
      setCards(cards.map((card) => (card._id === selectedCard._id ? updatedCard : card)))
      setEditDialogOpen(false)
      toast({
        title: "Success",
        description: "Media card updated successfully",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to update media card",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCard = async () => {
    if (!selectedCard) return

    try {
      await deleteMediaCard(selectedCard._id)
      setCards(cards.filter((card) => card._id !== selectedCard._id))
      setDeleteDialogOpen(false)
      toast({
        title: "Success",
        description: "Media card deleted successfully",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete media card",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Media Cards</h1>
          <p className="text-muted-foreground">Manage media coverage and news articles</p>
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
          <h1 className="text-3xl font-bold">Media Cards</h1>
          <p className="text-muted-foreground">Manage media coverage and news articles</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Media Card
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Media Cards Management</CardTitle>
          <CardDescription>View and manage all media cards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search media cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCards.map((card) => (
                  <TableRow key={card._id}>
                    <TableCell className="font-medium">{card.title}</TableCell>
                    <TableCell>{card.source}</TableCell>
                    <TableCell>{card.date}</TableCell>
                    <TableCell className="max-w-xs truncate">{card.description}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">/media/{card._id}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(`/media/${card._id}`);
                            toast({
                              title: "URL Copied",
                              description: "Media URL copied to clipboard",
                            });
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedCard(card)
                            setEditDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedCard(card)
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

      {/* Create Media Card Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Media Card</DialogTitle>
            <DialogDescription>Add a new media coverage or news article</DialogDescription>
          </DialogHeader>
          <MediaCardForm onSubmit={handleCreateCard} onCancel={() => setCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Media Card Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Media Card</DialogTitle>
            <DialogDescription>Update media card information</DialogDescription>
          </DialogHeader>
          {selectedCard && (
            <MediaCardForm card={selectedCard} onSubmit={handleUpdateCard} onCancel={() => setEditDialogOpen(false)} />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Media Card Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Media Card</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedCard?.title}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCard}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function MediaCardForm({
  card,
  onSubmit,
  onCancel,
}: {
  card?: MediaCard
  onSubmit: (data: Omit<MediaCard, "_id" | "id">) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    title: card?.title || "",
    date: card?.date || "",
    source: card?.source || "",
    description: card?.description || "",
    imageUrl: card?.imageUrl || "",
    detailedDescription: card?.detailedDescription || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="source">Source</Label>
          <Input
            id="source"
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            placeholder="e.g., Times of India, CNN"
            required
          />
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            placeholder="e.g., March 15, 2024"
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="detailedDescription">Detailed Description</Label>
        <Textarea
          id="detailedDescription"
          value={formData.detailedDescription}
          onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
          placeholder="Full article or extended details for the detail page"
        />
      </div>
      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          type="text"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          required
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{card ? "Update" : "Create"}</Button>
      </DialogFooter>
    </form>
  )
}
