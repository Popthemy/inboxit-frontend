import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Building, Camera, Save, CreditCard, Bell, BellOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [webhookAlerts, setWebhookAlerts] = useState(false);

  const handleSave = () => {
    toast({ title: "Profile updated", description: "Your changes have been saved." });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground">Manage your account details and preferences.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-border bg-card">
            <CardContent className="pt-6 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold text-2xl">
                    {user?.name?.split(" ").map(n => n[0]).join("") || "JD"}
                  </span>
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <h3 className="font-semibold text-foreground text-lg">{user?.name || "John Doe"}</h3>
              <p className="text-sm text-muted-foreground">{user?.email || "john@example.com"}</p>
              <Badge variant="secondary" className="mt-2 capitalize">{user?.plan || "pro"} Plan</Badge>
              <Separator className="my-4" />
              <div className="text-left space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member since</span>
                  <span className="text-foreground">Jan 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">API Keys</span>
                  <span className="text-foreground">3 active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Messages sent</span>
                  <span className="text-foreground">5,263</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Edit Form */}
        <motion.div
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input defaultValue="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input defaultValue={user?.email || "john@example.com"} className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input defaultValue={user?.company || "Acme Inc."} className="pl-10" />
                </div>
              </div>
              <Button className="gap-2" onClick={handleSave}>
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose how you want to be notified.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email notifications</p>
                    <p className="text-xs text-muted-foreground">Get notified for each form submission</p>
                  </div>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BellOff className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Webhook failure alerts</p>
                    <p className="text-xs text-muted-foreground">Alert when a delivery fails</p>
                  </div>
                </div>
                <Switch checked={webhookAlerts} onCheckedChange={setWebhookAlerts} />
              </div>
            </CardContent>
          </Card>

          {/* Billing */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Billing
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Current Plan: <span className="text-primary capitalize">{user?.plan || "Pro"}</span></p>
                <p className="text-xs text-muted-foreground">Next billing date: April 1, 2026</p>
              </div>
              <Button variant="outline">Manage Billing</Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
