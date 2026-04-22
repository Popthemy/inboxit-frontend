import React, { createContext, useContext, useState, useCallback } from "react";
import { fetchMessages, fetchMessageById } from "../services/messageService";
import {
  normalizeMessage,
  NormalizedMessage,
} from "../utils/messageNormalizer";

interface MessageContextType {
  messages: NormalizedMessage[];
  selectedMessage: NormalizedMessage | null;
  loading: boolean;
  nextPage: string | null;
  prevPage: string | null;
  count: number;
  loadMessages: (page?: number, pageSize?: number) => Promise<void>;
  loadMessage: (id: number) => Promise<void>;
  setSelectedMessage: (message: NormalizedMessage | null) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<NormalizedMessage[]>([]);
  const [selectedMessage, setSelectedMessage] =
    useState<NormalizedMessage | null>(null);
  const [loading, setLoading] = useState(false);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  const loadMessages = useCallback(async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const data = await fetchMessages(page, pageSize);
      const normalized = data.results.map(message => normalizeMessage(message));
      console.log("messages:", normalized, data.count, data.previous)
      setMessages(normalized);
      setNextPage(data.next);
      setPrevPage(data.previous);
      setCount(data.count);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMessage = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const data = await fetchMessageById(id);
      const normalized = normalizeMessage(data);
      setSelectedMessage(normalized);
    } catch (error) {
      console.error(`Failed to fetch message ${id}:`, error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <MessageContext.Provider
      value={{
        messages,
        selectedMessage,
        loading,
        nextPage,
        prevPage,
        count,
        loadMessages,
        loadMessage,
        setSelectedMessage,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error("useMessages must be used within a MessageProvider");
  }
  return context;
};
