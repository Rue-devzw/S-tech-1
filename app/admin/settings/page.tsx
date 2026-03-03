"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Save, Bell, Shield, Globe, Palette } from "lucide-react"

export default function SettingsPage() {
    const { toast } = useToast()

    const [general, setGeneral] = useState({
        siteName: "S-Tech Digital Hub",
        siteTagline: "Digital Excellence in Zimbabwe",
        contactEmail: "info@s-tech.co.zw",
        supportPhone: "+263 77 123 4567",
        address: "15 Samora Machel Ave, Harare, Zimbabwe",
    })

    const [notifications, setNotifications] = useState({
        emailOnNewInquiry: true,
        emailOnNewSale: true,
        weeklyReport: false,
        systemAlerts: true,
    })

    const [security, setSecurity] = useState({
        twoFactorAuth: false,
        sessionTimeout: "60",
        requireStrongPasswords: true,
    })

    function saveGeneral() {
        toast({ title: "Settings Saved", description: "General settings have been updated." })
    }

    function saveNotifications() {
        toast({ title: "Notification Preferences Saved", description: "Your notification settings have been updated." })
    }

    function saveSecurity() {
        toast({ title: "Security Settings Saved", description: "Security configuration has been updated." })
    }

    return (
        <div className="space-y-8 max-w-3xl mx-auto">
            <div>
                <h1 className="text-3xl font-headline font-bold text-primary mb-2">Settings</h1>
                <p className="text-muted-foreground">Configure your S-Tech Digital Hub platform settings.</p>
            </div>

            {/* General Settings */}
            <Card className="border-none shadow-sm">
                <CardHeader className="flex flex-row items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl">
                        <Globe className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-headline font-bold text-primary">General</CardTitle>
                        <CardDescription>Basic platform information and contact details.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label htmlFor="siteName">Site Name</Label>
                            <Input id="siteName" value={general.siteName} onChange={e => setGeneral(p => ({ ...p, siteName: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="siteTagline">Tagline</Label>
                            <Input id="siteTagline" value={general.siteTagline} onChange={e => setGeneral(p => ({ ...p, siteTagline: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contactEmail">Contact Email</Label>
                            <Input id="contactEmail" type="email" value={general.contactEmail} onChange={e => setGeneral(p => ({ ...p, contactEmail: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="supportPhone">Support Phone</Label>
                            <Input id="supportPhone" value={general.supportPhone} onChange={e => setGeneral(p => ({ ...p, supportPhone: e.target.value }))} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Office Address</Label>
                        <Textarea id="address" value={general.address} onChange={e => setGeneral(p => ({ ...p, address: e.target.value }))} rows={2} />
                    </div>
                    <Button className="bg-primary hover:bg-primary/90 text-white" onClick={saveGeneral}>
                        <Save className="w-4 h-4 mr-2" /> Save General Settings
                    </Button>
                </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="border-none shadow-sm">
                <CardHeader className="flex flex-row items-center gap-3">
                    <div className="p-2 bg-accent/10 rounded-xl">
                        <Bell className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-headline font-bold text-primary">Notifications</CardTitle>
                        <CardDescription>Control when and how you receive notifications.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-5">
                    {[
                        { key: "emailOnNewInquiry", label: "Email on new inquiry", desc: "Receive an email whenever a new customer inquiry is submitted." },
                        { key: "emailOnNewSale", label: "Email on new sale", desc: "Get notified immediately when a purchase is completed." },
                        { key: "weeklyReport", label: "Weekly performance report", desc: "Receive a weekly summary of revenue, sales, and visitor stats." },
                        { key: "systemAlerts", label: "System alerts", desc: "Critical maintenance and security alert notifications." },
                    ].map(item => (
                        <div key={item.key}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-primary">{item.label}</p>
                                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                                </div>
                                <Switch
                                    checked={notifications[item.key as keyof typeof notifications]}
                                    onCheckedChange={val => setNotifications(p => ({ ...p, [item.key]: val }))}
                                />
                            </div>
                            <Separator className="mt-4" />
                        </div>
                    ))}
                    <Button className="bg-primary hover:bg-primary/90 text-white" onClick={saveNotifications}>
                        <Save className="w-4 h-4 mr-2" /> Save Notification Settings
                    </Button>
                </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="border-none shadow-sm">
                <CardHeader className="flex flex-row items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-xl">
                        <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-headline font-bold text-primary">Security</CardTitle>
                        <CardDescription>Manage authentication and access control settings.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-primary">Two-Factor Authentication</p>
                            <p className="text-sm text-muted-foreground">Require 2FA for all admin logins.</p>
                        </div>
                        <Switch checked={security.twoFactorAuth} onCheckedChange={val => setSecurity(p => ({ ...p, twoFactorAuth: val }))} />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-primary">Strong Password Policy</p>
                            <p className="text-sm text-muted-foreground">Enforce uppercase, number, and symbol requirements.</p>
                        </div>
                        <Switch checked={security.requireStrongPasswords} onCheckedChange={val => setSecurity(p => ({ ...p, requireStrongPasswords: val }))} />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                        <Input
                            id="sessionTimeout"
                            type="number"
                            className="max-w-xs"
                            value={security.sessionTimeout}
                            onChange={e => setSecurity(p => ({ ...p, sessionTimeout: e.target.value }))}
                        />
                    </div>
                    <Button className="bg-primary hover:bg-primary/90 text-white" onClick={saveSecurity}>
                        <Save className="w-4 h-4 mr-2" /> Save Security Settings
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
