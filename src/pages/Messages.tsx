import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { FilterDropdown } from "@/components/dashboard/FilterDropdown";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { MessagePreview } from "@/components/dashboard/MessagePreview";

const mockMessages = [
  {
    id: "1",
    from: "contact@acme.com",
    to: "support@company.com",
    subject: "Partnership inquiry",
    body: "<p>Hello, we're interested in exploring a potential partnership opportunity.</p><p>Could we schedule a call this week?</p>",
    status: "success" as const,
    apiKeyPrefix: "if_live_a3b8",
    date: "Mar 9, 2026 14:23",
    rawPayload: { name: "John", email: "contact@acme.com", message: "Partnership inquiry" },
  },
  {
    id: "2",
    from: "dev@startup.io",
    to: "support@company.com",
    subject: "API Integration Question",
    body: "<p>I'm having trouble with the webhook integration. Could you help?</p>",
    status: "success" as const,
    apiKeyPrefix: "if_live_q7r8",
    date: "Mar 9, 2026 13:45",
    rawPayload: { name: "Alice", email: "dev@startup.io", message: "API Integration Question" },
  },
  {
    id: "3",
    from: "hello@agency.co",
    to: "newsletter@company.com",
    subject: "Newsletter Subscription",
    body: "<p>Please add me to your newsletter list.</p>",
    status: "error" as const,
    apiKeyPrefix: "if_live_a3b8",
    date: "Mar 9, 2026 12:30",
    rawPayload: { email: "hello@agency.co", subscribe: true },
  },
  {
    id: "4",
    from: "sales@corp.net",
    to: "sales@company.com",
    subject: "Quote Request",
    body: "<p>We need a quote for 500 licenses.</p>",
    status: "success" as const,
    apiKeyPrefix: "if_live_q7r8",
    date: "Mar 9, 2026 11:15",
    rawPayload: { name: "Bob", email: "sales@corp.net", licenses: 500 },
  },
  {
    id: "5",
    from: "support@tech.io",
    to: "support@company.com",
    subject: "Bug Report",
    body: "<p>Found a bug in the form submission process.</p>",
    status: "pending" as const,
    apiKeyPrefix: "if_test_g3h4",
    date: "Mar 9, 2026 10:00",
    rawPayload: { email: "support@tech.io", type: "bug", description: "Form bug" },
  },
];

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "success", label: "Success" },
  { value: "error", label: "Failed" },
  { value: "pending", label: "Pending" },
];

export default function Messages() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<typeof mockMessages[0] | null>(null);
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground">View all form submissions and their status.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          placeholder="Search messages..."
          value={searchQuery}
          onChange={setSearchQuery}
          className="flex-1"
        />
        <FilterDropdown
          placeholder="Status"
          value={statusFilter}
          onValueChange={setStatusFilter}
          options={statusOptions}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="rounded-lg border border-border overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead>From</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>API Key</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockMessages.map((message, index) => (
              <motion.tr
                key={message.id}
                className="border-b border-border cursor-pointer hover:bg-muted/30 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/messages/${message.id}`)}
              >
                <TableCell className="font-mono text-xs">{message.from}</TableCell>
                <TableCell className="font-medium">{message.subject}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{message.to}</TableCell>
                <TableCell>
                  <StatusBadge status={message.status} />
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{message.apiKeyPrefix}...</TableCell>
                <TableCell className="text-muted-foreground text-sm">{message.date}</TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      <AnimatePresence>
        {selectedMessage && (
          <MessagePreview
            message={selectedMessage}
            onClose={() => setSelectedMessage(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
