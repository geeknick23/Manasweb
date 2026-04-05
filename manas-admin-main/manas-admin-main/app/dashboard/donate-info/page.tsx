"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getDonateInfo, updateDonateInfo, type DonateInfo } from "@/lib/api"

export default function DonateInfoPage() {
    const [formData, setFormData] = useState<DonateInfo>({
        bankName: "",
        accountName: "",
        accountNumber: "",
        ifscCode: "",
        upiId: "",
        taxExemptionNote: "",
        headerTitle: "",
        headerSubtitle: "",
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const { toast } = useToast()

    useEffect(() => { fetchData() }, [])

    const fetchData = async () => {
        try {
            const data = await getDonateInfo()
            setFormData(data)
        } catch {
            toast({ title: "Error", description: "Failed to fetch donate info", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            const updated = await updateDonateInfo(formData)
            setFormData(updated)
            toast({ title: "Success", description: "Donation info updated successfully" })
        } catch {
            toast({ title: "Error", description: "Failed to update donate info", variant: "destructive" })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div><h1 className="text-3xl font-bold">Donation Information</h1><p className="text-muted-foreground">Manage donation details displayed in the app</p></div>
                <div className="animate-pulse space-y-4"><div className="h-64 bg-gray-200 rounded"></div></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div><h1 className="text-3xl font-bold">Donation Information</h1><p className="text-muted-foreground">Manage donation details displayed in the app</p></div>

            <form onSubmit={handleSave}>
                <Card className="mb-6">
                    <CardHeader><CardTitle>Page Header</CardTitle><CardDescription>Customize the donation page header text</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        <div><Label htmlFor="headerTitle">Header Title</Label><Input id="headerTitle" value={formData.headerTitle} onChange={(e) => setFormData({ ...formData, headerTitle: e.target.value })} /></div>
                        <div><Label htmlFor="headerSubtitle">Header Subtitle</Label><Input id="headerSubtitle" value={formData.headerSubtitle} onChange={(e) => setFormData({ ...formData, headerSubtitle: e.target.value })} /></div>
                    </CardContent>
                </Card>

                <Card className="mb-6">
                    <CardHeader><CardTitle>Bank Details</CardTitle><CardDescription>Update bank information for donations</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label htmlFor="bankName">Bank Name</Label><Input id="bankName" value={formData.bankName} onChange={(e) => setFormData({ ...formData, bankName: e.target.value })} /></div>
                            <div><Label htmlFor="accountName">Account Name</Label><Input id="accountName" value={formData.accountName} onChange={(e) => setFormData({ ...formData, accountName: e.target.value })} /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label htmlFor="accountNumber">Account Number</Label><Input id="accountNumber" value={formData.accountNumber} onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })} /></div>
                            <div><Label htmlFor="ifscCode">IFSC Code</Label><Input id="ifscCode" value={formData.ifscCode} onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })} /></div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="mb-6">
                    <CardHeader><CardTitle>UPI & Tax Info</CardTitle><CardDescription>Update UPI details and tax exemption note</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        <div><Label htmlFor="upiId">UPI ID</Label><Input id="upiId" value={formData.upiId} onChange={(e) => setFormData({ ...formData, upiId: e.target.value })} /></div>
                        <div><Label htmlFor="taxExemptionNote">Tax Exemption Note</Label><Textarea id="taxExemptionNote" value={formData.taxExemptionNote} onChange={(e) => setFormData({ ...formData, taxExemptionNote: e.target.value })} /></div>
                    </CardContent>
                </Card>

                <Button type="submit" disabled={saving} size="lg"><Save className="h-4 w-4 mr-2" />{saving ? "Saving..." : "Save Changes"}</Button>
            </form>
        </div>
    )
}
