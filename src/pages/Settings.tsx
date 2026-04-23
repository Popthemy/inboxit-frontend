import { motion } from "framer-motion";
import { User, Shield, BarChart3, Gauge } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import ComingSoon from "@/components/common/comingSoon";

export default function Settings() {
  const isComingSoon = true

  if (isComingSoon) return <ComingSoon ></ComingSoon>
  

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="usage" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            API Usage
          </TabsTrigger>
          <TabsTrigger value="limits" className="gap-2">
            <Gauge className="h-4 w-4" />
            Rate Limits
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" defaultValue="Acme Inc." />
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your password.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button>Update Password</Button>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Add an extra layer of security.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Enable 2FA for your account</p>
                  <p className="text-xs text-muted-foreground">
                    Requires authenticator app
                  </p>
                </div>
                <Switch />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Usage Tab */}
        <TabsContent value="usage">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>API Usage</CardTitle>
                <CardDescription>
                  Your current billing period usage.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Messages Sent</span>
                    <span className="font-mono">1,200 / 5,000</span>
                  </div>
                  <Progress value={24} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    24% of monthly limit used
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>API Requests</span>
                    <span className="font-mono">8,450 / 50,000</span>
                  </div>
                  <Progress value={17} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    17% of monthly limit used
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Storage</span>
                    <span className="font-mono">245 MB / 1 GB</span>
                  </div>
                  <Progress value={24.5} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    24.5% of storage used
                  </p>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Billing period: March 1 - March 31, 2026
                  </p>
                  <Button variant="outline" className="mt-2">
                    Upgrade Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Rate Limits Tab */}
        <TabsContent value="limits">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Rate Limits</CardTitle>
                <CardDescription>
                  Your API rate limits based on current plan.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm">Requests per minute</span>
                    <span className="font-mono text-sm">60</span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm">Requests per hour</span>
                    <span className="font-mono text-sm">1,000</span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm">Requests per day</span>
                    <span className="font-mono text-sm">10,000</span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm">Max payload size</span>
                    <span className="font-mono text-sm">10 MB</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Need higher limits?{" "}
                  <Button variant="link" className="p-0 h-auto text-xs">
                    Contact sales
                  </Button>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
