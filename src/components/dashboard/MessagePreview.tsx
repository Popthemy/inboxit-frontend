import { motion } from "framer-motion";
import { X, Paperclip, Image, Code } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "./StatusBadge";
import { CodeBlock } from "./CodeBlock";

interface MessagePreviewProps {
  message: {
    id: string;
    from: string;
    to: string;
    subject: string;
    body: string;
    status: "success" | "error" | "pending";
    apiKeyPrefix: string;
    date: string;
    attachments?: string[];
    imageUrl?: string;
    rawPayload: Record<string, unknown>;
  };
  onClose: () => void;
}

export function MessagePreview({ message, onClose }: MessagePreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-y-0 right-0 w-full max-w-xl bg-card border-l border-border shadow-xl z-50 overflow-auto"
    >
      <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
        <h2 className="font-semibold text-lg">Message Details</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-6 space-y-6">
        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{message.subject}</CardTitle>
              <StatusBadge status={message.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">From:</span>
                <p className="font-mono text-xs mt-1">{message.from}</p>
              </div>
              <div>
                <span className="text-muted-foreground">To:</span>
                <p className="font-mono text-xs mt-1">{message.to}</p>
              </div>
              <div>
                <span className="text-muted-foreground">API Key:</span>
                <p className="font-mono text-xs mt-1">{message.apiKeyPrefix}...</p>
              </div>
              <div>
                <span className="text-muted-foreground">Date:</span>
                <p className="text-xs mt-1">{message.date}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="body" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="body" className="flex-1">Body</TabsTrigger>
            <TabsTrigger value="attachments" className="flex-1">
              <Paperclip className="h-4 w-4 mr-1" />
              Attachments
            </TabsTrigger>
            <TabsTrigger value="raw" className="flex-1">
              <Code className="h-4 w-4 mr-1" />
              Raw
            </TabsTrigger>
          </TabsList>

          <TabsContent value="body" className="mt-4">
            <Card className="border-border">
              <CardContent className="p-4">
                <div 
                  className="prose prose-sm prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: message.body }}
                />
              </CardContent>
            </Card>
            {message.imageUrl && (
              <Card className="border-border mt-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Embedded Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <img 
                    src={message.imageUrl} 
                    alt="Message attachment"
                    className="rounded-lg max-w-full"
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="attachments" className="mt-4">
            <Card className="border-border">
              <CardContent className="p-4">
                {message.attachments && message.attachments.length > 0 ? (
                  <ul className="space-y-2">
                    {message.attachments.map((attachment, i) => (
                      <li key={i} className="flex items-center gap-2 p-2 bg-muted rounded">
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-mono">{attachment}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No attachments</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="raw" className="mt-4">
            <CodeBlock 
              code={JSON.stringify(message.rawPayload, null, 2)} 
              language="json"
              title="Raw Payload"
            />
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}
