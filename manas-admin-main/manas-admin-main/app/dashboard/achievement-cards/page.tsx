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
  getAllAchievementCards,
  createAchievementCard,
  updateAchievementCard,
  deleteAchievementCard,
  type AchievementCard,
} from "@/lib/api"

export default function AchievementCardsPage() {
  const [cards, setCards] = useState<AchievementCard[]>([])
  const [filteredCards, setFilteredCards] = useState<AchievementCard[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCard, setSelectedCard] = useState<AchievementCard | null>(null)
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
        card.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredCards(filtered)
  }, [cards, searchTerm])

  const fetchCards = async () => {
    try {
      const data = await getAllAchievementCards()
      setCards(data)
      setFilteredCards(data)
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch achievement cards",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCard = async (cardData: Omit<AchievementCard, "_id" | "id">) => {
    try {
      const newCard = await createAchievementCard(cardData)
      setCards([...cards, newCard])
      setCreateDialogOpen(false)
      toast({
        title: "Success",
        description: "Achievement card created successfully",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to create achievement card",
        variant: "destructive",
      })
    }
  }

  const handleUpdateCard = async (cardData: Partial<AchievementCard>) => {
    if (!selectedCard) return

    try {
      const updatedCard = await updateAchievementCard(selectedCard._id, cardData)
      setCards(cards.map((card) => (card._id === selectedCard._id ? updatedCard : card)))
      setEditDialogOpen(false)
      toast({
        title: "Success",
        description: "Achievement card updated successfully",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to update achievement card",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCard = async () => {
    if (!selectedCard) return

    try {
      await deleteAchievementCard(selectedCard._id)
      setCards(cards.filter((card) => card._id !== selectedCard._id))
      setDeleteDialogOpen(false)
      toast({
        title: "Success",
        description: "Achievement card deleted successfully",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete achievement card",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Achievement Cards</h1>
          <p className="text-muted-foreground">Manage foundation achievements</p>
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
          <h1 className="text-3xl font-bold">Achievement Cards</h1>
          <p className="text-muted-foreground">Manage foundation achievements</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Achievement Card
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Achievement Cards Management</CardTitle>
          <CardDescription>View and manage all achievement cards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search achievement cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Icon</TableHead>
                  <TableHead>Number</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCards.map((card) => (
                  <TableRow key={card._id}>
                    <TableCell>{card.icon}</TableCell>
                    <TableCell className="font-bold text-purple-600">{card.number}</TableCell>
                    <TableCell className="font-medium">{card.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{card.description}</TableCell>
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

      {/* Create Achievement Card Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Achievement Card</DialogTitle>
            <DialogDescription>Add a new foundation achievement</DialogDescription>
          </DialogHeader>
          <AchievementCardForm onSubmit={handleCreateCard} onCancel={() => setCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Achievement Card Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Achievement Card</DialogTitle>
            <DialogDescription>Update achievement card information</DialogDescription>
          </DialogHeader>
          {selectedCard && (
            <AchievementCardForm
              card={selectedCard}
              onSubmit={handleUpdateCard}
              onCancel={() => setEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Achievement Card Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Achievement Card</DialogTitle>
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

function AchievementCardForm({
  card,
  onSubmit,
  onCancel,
}: {
  card?: AchievementCard
  onSubmit: (data: Omit<AchievementCard, "_id" | "id">) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    icon: card?.icon || "",
    number: card?.number || "",
    title: card?.title || "",
    description: card?.description || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="icon">Icon</Label>
        <Input
          id="icon"
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          placeholder="e.g., 🏆, 💝, 🌟"
          required
        />
      </div>
      <div>
        <Label htmlFor="number">Number</Label>
        <Input
          id="number"
          value={formData.number}
          onChange={(e) => setFormData({ ...formData, number: e.target.value })}
          placeholder="e.g., 500+, 1000"
          required
        />
      </div>
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
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

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{card ? "Update" : "Create"}</Button>
      </DialogFooter>
    </form>
  )
}
