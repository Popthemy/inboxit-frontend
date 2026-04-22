import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { FilterDropdown } from "@/components/dashboard/FilterDropdown";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { MessagePreview } from "@/components/dashboard/MessagePreview";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Download,
  Mail,
  MessageSquare,
  Webhook,
  Phone,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useMessages } from "@/contexts/MessageContext";
import { NormalizedMessage } from "@/utils/messageNormalizer";

type ChannelType = "email" | "slack" | "webhook" | "sms" | "whatsapp";

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "success", label: "Success" },
  { value: "error", label: "Failed" },
  { value: "pending", label: "Pending" },
];

const channelOptions = [
  { value: "all", label: "All Channels" },
  { value: "email", label: "Email" },
  { value: "slack", label: "Slack" },
  { value: "webhook", label: "Webhook" },
  { value: "sms", label: "SMS" },
  { value: "whatsapp", label: "WhatsApp" },
];

const pageSizeOptions = [
  { value: "10", label: "10 / page" },
  { value: "25", label: "25 / page" },
  { value: "50", label: "50 / page" },
  { value: "100", label: "100 / page" },
];

const channelMeta: Record<
  ChannelType,
  { label: string; icon: typeof Mail; sortLabel: string }
> = {
  email: { label: "Email", icon: Mail, sortLabel: "email address" },
  slack: { label: "Slack", icon: MessageSquare, sortLabel: "Slack channel" },
  webhook: { label: "Webhook", icon: Webhook, sortLabel: "webhook URL" },
  sms: { label: "SMS", icon: Phone, sortLabel: "phone number" },
  whatsapp: { label: "WhatsApp", icon: Phone, sortLabel: "phone number" },
};

type SortField = keyof NormalizedMessage | "channel";
type SortDir = "asc" | "desc";

function ChannelBadge({ channel }: { channel: ChannelType }) {
  const meta = channelMeta[channel] || channelMeta.email;
  const Icon = meta.icon;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
      {meta.label}
    </span>
  );
}

function downloadCSV(rows: NormalizedMessage[], filename: string) {
  const headers = [
    "#",
    "Channel",
    "From",
    "To",
    "Subject",
    "Status",
    "API Key",
    "Date",
  ];
  const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [
    headers.join(","),
    ...rows.map((r, i) =>
      [
        i + 1,
        "email", // Default channel
        r.from,
        r.to.join("; "),
        r.subject,
        r.status,
        `${r.apiKeyPrefix}...`,
        r.date,
      ]
        .map((v) => escape(String(v)))
        .join(","),
    ),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadJSON(rows: NormalizedMessage[], filename: string) {
  const blob = new Blob([JSON.stringify(rows, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Messages() {
  const navigate = useNavigate();
  const {
    messages,
    loading,
    loadMessages,
    loadMessage,
    selectedMessage,
    setSelectedMessage,
    count,
    nextPage,
    prevPage,
  } = useMessages();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [apiKeyFilter, setApiKeyFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const apiKeyOptions = useMemo(() => {
    const prefixes = Array.from(
      new Set(messages.map((m) => m.apiKeyPrefix)),
    ).filter(Boolean);
    return [
      { value: "all", label: "All API Keys" },
      ...prefixes.map((p) => ({
        value: p,
        label: `${p}...`,
      })),
    ];
  }, [messages]);

  useEffect(() => {
    loadMessages(currentPage, pageSize);
  }, [loadMessages, currentPage, pageSize]);

  const filteredMessages = useMemo(() => {
    const filtered = messages.filter((msg) => {
      const matchesSearch =
        !searchQuery ||
        msg.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.to.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus =
        statusFilter === "all" || msg.status === statusFilter;
      const matchesApiKey =
        apiKeyFilter === "all" || msg.apiKeyPrefix === apiKeyFilter;
      // Note: channel is mocked as email for now
      const matchesChannel =
        channelFilter === "all" || "email" === channelFilter;
      return matchesSearch && matchesStatus && matchesApiKey && matchesChannel;
    });

    const sorted = [...filtered].sort((a, b) => {
      let cmp = 0;
      const valA = a[sortField as keyof NormalizedMessage];
      const valB = b[sortField as keyof NormalizedMessage];

      if (typeof valA === "string" && typeof valB === "string") {
        cmp = valA.localeCompare(valB);
      } else if (Array.isArray(valA) && Array.isArray(valB)) {
        cmp = valA.join(",").localeCompare(valB.join(","));
      } else if (valA < valB) {
        cmp = -1;
      } else if (valA > valB) {
        cmp = 1;
      }

      return sortDir === "asc" ? cmp : -cmp;
    });

    return sorted;
  }, [
    messages,
    searchQuery,
    statusFilter,
    apiKeyFilter,
    channelFilter,
    sortField,
    sortDir,
  ]);

  const totalPages = Math.max(1, Math.ceil(count / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIdx = (safeCurrentPage - 1) * pageSize;
  const paginatedMessages = filteredMessages;

  const allSelectedOnPage =
    paginatedMessages.length > 0 &&
    paginatedMessages.every((m) => selectedIds.has(m.id));
  const someSelectedOnPage =
    paginatedMessages.some((m) => selectedIds.has(m.id)) && !allSelectedOnPage;

  const resetPage = () => setCurrentPage(1);
  const handleStatusChange = (v: string) => {
    setStatusFilter(v);
    resetPage();
  };
  const handleApiKeyChange = (v: string) => {
    setApiKeyFilter(v);
    resetPage();
  };
  const handleChannelChange = (v: string) => {
    setChannelFilter(v);
    resetPage();
  };
  const handleSearchChange = (v: string) => {
    setSearchQuery(v);
    resetPage();
  };
  const handlePageSizeChange = (v: string) => {
    setPageSize(Number(v));
    resetPage();
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const toggleSelectAllOnPage = () => {
    const next = new Set(selectedIds);
    if (allSelectedOnPage) paginatedMessages.forEach((m) => next.delete(m.id));
    else paginatedMessages.forEach((m) => next.add(m.id));
    setSelectedIds(next);
  };

  const toggleRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const clearSelection = () => setSelectedIds(new Set());

  const exportSelected = (format: "csv" | "json") => {
    const rows = messages.filter((m) => selectedIds.has(m.id));
    if (rows.length === 0) {
      toast({
        title: "No messages selected",
        description: "Select rows to export, or use 'Export all'.",
      });
      return;
    }
    const stamp = new Date().toISOString().split("T")[0];
    if (format === "csv") downloadCSV(rows, `messages-selected-${stamp}.csv`);
    else downloadJSON(rows, `messages-selected-${stamp}.json`);
    toast({
      title: `Exported ${rows.length} message${rows.length === 1 ? "" : "s"}`,
      description: `Format: ${format.toUpperCase()}`,
    });
  };

  const exportAll = (format: "csv" | "json", scope: "filtered" | "all") => {
    const rows = scope === "filtered" ? filteredMessages : messages;
    const stamp = new Date().toISOString().split("T")[0];
    const name = scope === "filtered" ? "filtered" : "all";
    if (format === "csv") downloadCSV(rows, `messages-${name}-${stamp}.csv`);
    else downloadJSON(rows, `messages-${name}-${stamp}.json`);
    toast({
      title: `Exported ${rows.length} message${rows.length === 1 ? "" : "s"}`,
      description: `${scope === "filtered" ? "Filtered" : "All"} • ${format.toUpperCase()}`,
    });
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ArrowUpDown className="h-3 w-3 opacity-40" />;
    return sortDir === "asc" ? (
      <ArrowUp className="h-3 w-3" />
    ) : (
      <ArrowDown className="h-3 w-3" />
    );
  };

  const sortLabelFor = (field: "from" | "to") => {
    if (channelFilter === "all")
      return field === "from" ? "Sort by sender" : "Sort by recipient";
    const meta = channelMeta[channelFilter as ChannelType];
    return `Sort by ${meta.sortLabel}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground">
            View all form submissions and their status.
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              Filtered ({filteredMessages.length})
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={() => exportAll("csv", "filtered")}>
              Export filtered as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportAll("json", "filtered")}>
              Export filtered as JSON
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>All ({messages.length})</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => exportAll("csv", "all")}>
              Export all as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportAll("json", "all")}>
              Export all as JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        <SearchBar
          placeholder="Search by sender, subject, or recipient..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="flex-1"
        />
        <div className="flex flex-wrap gap-2">
          <FilterDropdown
            placeholder="Channel"
            value={channelFilter}
            onValueChange={handleChannelChange}
            options={channelOptions}
          />
          <FilterDropdown
            placeholder="Status"
            value={statusFilter}
            onValueChange={handleStatusChange}
            options={statusOptions}
          />
          <FilterDropdown
            placeholder="API Key"
            value={apiKeyFilter}
            onValueChange={handleApiKeyChange}
            options={apiKeyOptions}
          />
        </div>
      </div>

      {/* Bulk action bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg border border-primary/30 bg-primary/5"
          >
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-foreground">
                {selectedIds.size} selected
              </span>
              <span className="text-muted-foreground hidden sm:inline">
                across all filters
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="gap-2"
                onClick={() => exportSelected("csv")}
              >
                <Download className="h-3.5 w-3.5" />
                CSV
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-2"
                onClick={() => exportSelected("json")}
              >
                <Download className="h-3.5 w-3.5" />
                JSON
              </Button>
              <Button size="sm" variant="ghost" onClick={clearSelection}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="rounded-lg border border-border overflow-hidden"
      >
        <div className="max-h-[60vh] overflow-auto relative">
          {loading && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-20 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-[0_1px_0_0_hsl(var(--border))]">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-10">
                  <Checkbox
                    checked={
                      allSelectedOnPage
                        ? true
                        : someSelectedOnPage
                          ? "indeterminate"
                          : false
                    }
                    onCheckedChange={toggleSelectAllOnPage}
                    aria-label="Select all on this page"
                  />
                </TableHead>
                <TableHead className="w-12 text-muted-foreground">#</TableHead>
                <TableHead className="hidden sm:table-cell">
                  <button
                    onClick={() => toggleSort("channel")}
                    className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
                  >
                    Channel <SortIcon field="channel" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => toggleSort("from")}
                    className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
                    title={sortLabelFor("from")}
                  >
                    From <SortIcon field="from" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => toggleSort("subject")}
                    className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
                  >
                    Subject <SortIcon field="subject" />
                  </button>
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  <button
                    onClick={() => toggleSort("to")}
                    className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
                    title={sortLabelFor("to")}
                  >
                    Recipient <SortIcon field="to" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => toggleSort("status")}
                    className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
                  >
                    Status <SortIcon field="status" />
                  </button>
                </TableHead>
                <TableHead className="hidden lg:table-cell">API Key</TableHead>
                <TableHead className="hidden sm:table-cell">
                  <button
                    onClick={() => toggleSort("date")}
                    className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
                  >
                    Date <SortIcon field="date" />
                  </button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMessages.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-12 text-muted-foreground"
                  >
                    No messages match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedMessages.map((message, index) => {
                  const rowNumber = startIdx + index + 1;
                  const isSelected = selectedIds.has(message.id);
                  return (
                    <motion.tr
                      key={message.id}
                      className={`border-b border-border cursor-pointer transition-colors ${isSelected ? "bg-primary/5" : "hover:bg-muted/30"}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03, duration: 0.2 }}
                      onClick={() => navigate(`/messages/${message.id}`)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleRow(message.id)}
                          aria-label={`Select message ${rowNumber}`}
                        />
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm tabular-nums">
                        {rowNumber}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <ChannelBadge channel={"email"} />
                      </TableCell>
                      <TableCell className="font-mono text-xs max-w-[180px] truncate">
                        {message.from}
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {message.subject}
                      </TableCell>
                      <TableCell className="hidden md:table-cell font-mono text-xs text-muted-foreground max-w-[220px] truncate">
                        {message.to.join(", ")}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={message.status} />
                      </TableCell>
                      <TableCell className="hidden lg:table-cell font-mono text-xs text-muted-foreground">
                        {message.apiKeyPrefix}...
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground text-sm whitespace-nowrap">
                        {message.date}
                      </TableCell>
                    </motion.tr>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            Showing {filteredMessages.length === 0 ? 0 : startIdx + 1}–
            {Math.min(startIdx + pageSize, filteredMessages.length)} of{" "}
            {filteredMessages.length}
          </p>
          <FilterDropdown
            placeholder="Page size"
            value={String(pageSize)}
            onValueChange={handlePageSizeChange}
            options={pageSizeOptions}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={safeCurrentPage <= 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (p) =>
                p === 1 ||
                p === totalPages ||
                Math.abs(p - safeCurrentPage) <= 1,
            )
            .map((page, idx, arr) => {
              const prev = arr[idx - 1];
              const showEllipsis = prev && page - prev > 1;
              return (
                <div key={page} className="flex items-center gap-2">
                  {showEllipsis && (
                    <span className="text-muted-foreground text-sm">…</span>
                  )}
                  <Button
                    variant={page === safeCurrentPage ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                </div>
              );
            })}
          <Button
            variant="outline"
            size="sm"
            disabled={safeCurrentPage >= totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

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
