"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getContactInfo, updateContactInfo, type ContactInfo, type OfficeHour } from "@/lib/api"

export default function ContactInfoPage() {
    const [formData, setFormData] = useState<ContactInfo>({
        phone: "",
        email: "",
        address: "",
        latitude: 0,
        longitude: 0,
        officeHours: [],
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const { toast } = useToast()

    useEffect(() => { fetchData() }, [])

    const fetchData = async () => {
        try {
            const data = await getContactInfo()
            setFormData(data)
        } catch {
            toast({ title: "Error", description: "Failed to fetch contact info", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            const updated = await updateContactInfo(formData)
            setFormData(updated)
            toast({ title: "Success", description: "Contact info updated successfully" })
        } catch {
            toast({ title: "Error", description: "Failed to update contact info", variant: "destructive" })
        } finally {
            setSaving(false)
        }
    }

    const addOfficeHour = () => {
        setFormData({ ...formData, officeHours: [...formData.officeHours, { day: "", hours: "" }] })
    }

    const removeOfficeHour = (index: number) => {
        setFormData({ ...formData, officeHours: formData.officeHours.filter((_, i) => i !== index) })
    }

    const updateOfficeHour = (index: number, field: keyof OfficeHour, value: string) => {
        const updated = formData.officeHours.map((oh, i) => i === index ? { ...oh, [field]: value } : oh)
        setFormData({ ...formData, officeHours: updated })
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div><h1 className="text-3xl font-bold">Contact Information</h1><p className="text-muted-foreground">Manage contact details displayed in the app</p></div>
                <div className="animate-pulse space-y-4"><div className="h-64 bg-gray-200 rounded"></div></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div><h1 className="text-3xl font-bold">Contact Information</h1><p className="text-muted-foreground">Manage contact details displayed in the app</p></div>

            <form onSubmit={handleSave}>
                <Card>
                    <CardHeader><CardTitle>Contact Details</CardTitle><CardDescription>Update phone, email, address, and office hours</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label htmlFor="phone">Phone</Label><Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></div>
                            <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
                        </div>
                        <div><Label htmlFor="address">Address</Label><Textarea id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label htmlFor="latitude">Latitude</Label><Input id="latitude" type="number" step="any" value={formData.latitude} onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })} /></div>
                            <div><Label htmlFor="longitude">Longitude</Label><Input id="longitude" type="number" step="any" value={formData.longitude} onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })} /></div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <Label>Office Hours</Label>
                                <Button type="button" variant="outline" size="sm" onClick={addOfficeHour}><Plus className="h-3 w-3 mr-1" />Add</Button>
                            </div>
                            <div className="space-y-2">
                                {formData.officeHours.map((oh, i) => (
                                    <div key={i} className="flex gap-2 items-center">
                                        <Input placeholder="Day (e.g. Monday - Friday)" value={oh.day} onChange={(e) => updateOfficeHour(i, "day", e.target.value)} />
                                        <Input placeholder="Hours (e.g. 9:00 AM - 6:00 PM)" value={oh.hours} onChange={(e) => updateOfficeHour(i, "hours", e.target.value)} />
                                        <Button type="button" variant="ghost" size="sm" onClick={() => removeOfficeHour(i)}><X className="h-4 w-4" /></Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Button type="submit" disabled={saving}><Save className="h-4 w-4 mr-2" />{saving ? "Saving..." : "Save Changes"}</Button>
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}
