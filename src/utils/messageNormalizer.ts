export interface NormalizedMessage {
  id: string;
  from: string;
  to: string[];
  subject: string;
  body: string;
  status: "success" | "error" | "pending";
  apiKeyPrefix: string;
  date: string;
  attachments?: string[];
  imageUrl?: string;
  rawPayload: any;
  error?: string;
  acceptedAt?: string;
  sentAt?: string;
}

const mapStatus = (status: string): "success" | "error" | "pending" => {
  switch (status) {
    case "sent":
      return "success";
    case "failed":
      return "error";
    default:
      return "pending";
  }
};

export const normalizeMessage = (msg: any): NormalizedMessage => {
  // recipientEmails is a comma separated string from backend
  const to =
    typeof msg.recipientEmails === "string"
      ? msg.recipientEmails.split(",").map((e: string) => e.trim())
      : [];

  // body can be an object, but UI expects a string for now (though we might change that later)
  const body =
    typeof msg.body === "object"
      ? JSON.stringify(msg.body, null, 2)
      : msg.body || "";

  return {
    id: String(msg.id ?? msg.uid),
    from: msg.visitorEmail || "",
    to,
    subject: msg.subject || "(No Subject)",
    body,
    status: mapStatus(msg.status),
    apiKeyPrefix: msg.apikey ? String(msg.apikey) : "", // Backend gives ID, not prefix
    date: new Date(msg.acceptedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }) || "",
    attachments: msg.attachments || [],
    imageUrl: msg.imageUrl || undefined,
    rawPayload: msg,
    error: msg.error || undefined,
    acceptedAt: new Date(msg.acceptedAt).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }) || undefined,
    sentAt: new Date(msg.sentAt).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }) || undefined,
  };
};
