Good—this is a solid place to introduce structure, because without it your messages layer will get messy fast. Right now your backend shape, list vs detail responses, and frontend types don’t line up yet. Let’s fix that properly.

🧠 First: understand the mismatch
Backend (list)
{
  "id": 47,
  "visitor_email": "...",
  "recipient_emails": "...",
  "subject": "...",
  "sent_at": "...",
  "status": "sent"
}
Backend (detail)

Adds:

{
  "body": {...},
  "accepted_at": "...",
  "error": "",
  "attachments": null,
  "image_url": null,
  "apikey": 8
}
Frontend expects:
{
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  status: "success" | "error" | "pending";
  apiKeyPrefix: string;
  date: string;
}

👉 These are not aligned, so normalization is required.

✅ 1. Service Layer (API calls)

Keep this clean and dumb—just fetch.

// services/message.service.ts

import axios from "axios";

export const fetchMessages = async (page = 1) => {
  const res = await axios.get(`/api/v2/messages/?page=${page}`);
  return res.data;
};

export const fetchMessageById = async (id: number) => {
  const res = await axios.get(`/api/v2/messages/${id}/`);
  return res.data;
};
✅ 2. Normalization Layer (IMPORTANT)

This is where most people mess up—you should never pass backend shape directly to UI.

// utils/message.normalizer.ts

type BackendMessage = any;

export const normalizeMessage = (msg: BackendMessage) => {
  return {
    id: String(msg.id),

    from: msg.visitorEmail,
    to: msg.recipientEmails,

    subject: msg.subject,

    body:
      typeof msg.body === "object"
        ? JSON.stringify(msg.body, null, 2)
        : msg.body || "",

    status: mapStatus(msg.status),

    apiKeyPrefix: msg.apikey ?? "", // ⚠️ backend gives ID, not prefix

    date: msg.sentAt || msg.acceptedAt,

    attachments: msg.attachments || [],
    imageUrl: msg.imageUrl || undefined,

    rawPayload: msg,
  };
};

const mapStatus = (status: string) => {
  switch (status) {
    case "sent":
      return "success";
    case "failed":
      return "error";
    default:
      return "pending";
  }
};
⚠️ Big issue here
"apikey": 8

👉 That is NOT a prefix.

So:

apiKeyPrefix: msg.apikey

❌ wrong concept

👉 You either:

fetch API key separately
or drop it from UI for now
✅ 3. Context (State Management)

Keep pagination + loading centralized.

// context/MessageContext.tsx

import { createContext, useContext, useState } from "react";
import { fetchMessages, fetchMessageById } from "../services/message.service";
import { normalizeMessage } from "../utils/message.normalizer";

const MessageContext = createContext(null);

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadMessages = async (page = 1) => {
    setLoading(true);
    const data = await fetchMessages(page);

    const normalized = data.results.map(normalizeMessage);

    setMessages(normalized);
    setLoading(false);
  };

  const loadMessage = async (id: number) => {
    setLoading(true);
    const data = await fetchMessageById(id);

    const normalized = normalizeMessage(data);
    setSelectedMessage(normalized);

    setLoading(false);
  };

  return (
    <MessageContext.Provider
      value={{
        messages,
        selectedMessage,
        loading,
        loadMessages,
        loadMessage,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => useContext(MessageContext);
✅ 4. Component usage
List component
const { messages, loadMessages } = useMessages();

useEffect(() => {
  loadMessages();
}, []);
Open preview
const { loadMessage } = useMessages();

const handleOpen = (id: string) => {
  loadMessage(Number(id));
};
Preview component

Your interface:

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
  };
}

👉 This now matches your normalized data ✅

⚠️ Subtle problems you should fix now
1. recipient_emails is a string

Backend:

"recipient_emails": "a@gmail.com,b@gmail.com"

👉 Normalize:

to: msg.recipientEmails.split(",")

Then update your type:

to: string[];
2. body is an object

You're forcing it into string.

Better:

body: msg.body ?? {}

Then render properly instead of stringifying.

3. Pagination (you’re ignoring it)

You get:

"next": "...page=2"

👉 You should store it:

const [nextPage, setNextPage] = useState<string | null>(null);

setNextPage(data.next);
4. Status mismatch

Backend:

"status": "sent"

Frontend:

"success"

👉 Good that you mapped it—keep that consistent everywhere.

🧩 Final architecture (clean mental model)
API (snake_case)
   ↓ humps
Service (fetch only)
   ↓
Normalizer (critical layer)
   ↓
Context (state + orchestration)
   ↓
Components (pure UI)
🔥 If you skip normalization…

You will end up with:

visitorEmail in one component
visitor_email in another
sentAt vs date
random bugs everywhere
✅ Bottom line

Your plan is correct—but the key fixes are:

✔ Normalize aggressively
✔ Don’t trust backend shape in UI
✔ Don’t treat apikey as prefix
✔ Separate list vs detail properly

If you want, I can help you:

add infinite scroll / pagination
cache messages (React Query style)
or design a better message preview UI (your current body handling will break soon)