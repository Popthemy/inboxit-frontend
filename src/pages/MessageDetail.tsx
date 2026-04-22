import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Trash2,
  RefreshCw,
  Mail,
  Clock,
  Key,
  CheckCircle,
  XCircle,
  AlertCircle,
  Copy,
  Download,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/dashboard/CodeBlock";
import { useToast } from "@/hooks/use-toast";
import { useMessages } from "@/contexts/MessageContext";

const statusConfig = {
  success: { icon: CheckCircle, color: "text-success", label: "Delivered" },
  error: { icon: XCircle, color: "text-destructive", label: "Failed" },
  pending: { icon: AlertCircle, color: "text-warning", label: "Pending" },
};

export default function MessageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectedMessage, loadMessage, loading } = useMessages();

  useEffect(() => {
    if (id) {
      loadMessage(Number(id));
    }
  }, [id, loadMessage]);

  if (loading || !selectedMessage) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const message = selectedMessage;
  const status =
    statusConfig[message.status as keyof typeof statusConfig] ||
    statusConfig.pending;
  const StatusIcon = status.icon;

  const handleDelete = () => {
    toast({
      title: "Message deleted",
      description: `Message ${message.id} has been removed.`,
    });
    navigate("/messages");
  };

  const handleRetry = () => {
    toast({
      title: "Retrying delivery",
      description: "Message has been queued for redelivery.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/messages")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {message.subject}
            </h1>
            <p className="text-sm text-muted-foreground font-mono">
              {message.id}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {message.status === "error" && (
            <Button variant="outline" className="gap-2" onClick={handleRetry}>
              <RefreshCw className="h-4 w-4" /> Retry
            </Button>
          )}
          <Button
            variant="destructive"
            className="gap-2"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Tabs defaultValue="preview">
            <TabsList className="mb-4">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="payload">Raw Payload</TabsTrigger>
              <TabsTrigger value="headers">Headers</TabsTrigger>
            </TabsList>

            <TabsContent value="preview">
              <Card className="border-border bg-card">
                <CardContent className="pt-6">
                  <div
                    className="prose prose-sm max-w-none text-foreground"
                    dangerouslySetInnerHTML={{ __html: message.body }}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payload">
              <CodeBlock
                code={JSON.stringify(message.rawPayload, null, 2)}
                language="json"
                title="Request Body"
              />
            </TabsContent>

            <TabsContent value="headers">
              <CodeBlock
                code={JSON.stringify(message.rawPayload.headers || {}, null, 2)}
                language="json"
                title="Request Headers"
              />
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Sidebar Meta */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-sm">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <StatusIcon className={`h-5 w-5 ${status.color}`} />
                <span className="font-medium text-foreground">
                  {status.label}
                </span>
              </div>
              {message.error && (
                <p className="text-xs text-destructive mt-2">{message.error}</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-sm">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">From</p>
                  <p className="font-mono text-xs">{message.from}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">To</p>
                  <p className="font-mono text-xs">{message.to.join(", ")}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Submitted</p>
                  <p className="text-xs">{message.acceptedAt}</p>
                </div>
              </div>
              {message.sentAt && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <div>
                    <p className="text-xs text-muted-foreground">Delivered</p>
                    <p className="text-xs">{message.sentAt}</p>
                  </div>
                </div>
              )}
              <Separator />
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">API Key</p>
                  <p className="font-mono text-xs">{message.apiKeyPrefix}...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
