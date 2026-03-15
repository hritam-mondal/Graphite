import { createContext, useContext, useState, type ReactNode, useCallback } from "react";
import { generateUUID } from "@lib/utils";

type Role = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
}

export interface ChatSession {
  id: string;
  title: string;
  preview?: string;
  createdAt: Date;
  updatedAt: Date;
  messages: ChatMessage[];
}

interface ChatContextType {
  chatSessions: ChatSession[];
  activeChatId: string | null;

  createNewChat: () => string;
  deleteChat: (id: string) => void;
  renameChat: (id: string, title: string) => void;
  setActiveChat: (id: string) => void;

  updateChatPreview: (id: string, preview: string) => void;

  pinChat: (id: string) => void;
  unpinChat: (id: string) => void;

  searchChats: (query: string) => ChatSession[];
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: "default-1",
      title: "Welcome to Chat",
      preview: "Let's start a conversation...",
      createdAt: new Date(Date.now() - 3600000),
      updatedAt: new Date(Date.now() - 3600000),
      messages: [],
    },
    {
      id: "default-2",
      title: "Previous Chat",
      preview: "Tell me about React hooks",
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 86400000),
      messages: [],
    },
    {
      id: "default-3",
      title: "Another Conversation",
      preview: "How to build a sidebar in React?",
      createdAt: new Date(Date.now() - 172800000),
      updatedAt: new Date(Date.now() - 172800000),
      messages: [],
    },
  ]);

  const [activeChatId, setActiveChatId] = useState<string | null>(
    chatSessions[0]?.id ?? null
  );

  /* Create new chat */

  const createNewChat = useCallback((): string => {
    const id = generateUUID();

    const newChat: ChatSession = {
      id,
      title: `Chat ${new Date().toLocaleDateString()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
    };

    setChatSessions(prev => [newChat, ...prev]);
    setActiveChatId(id);

    return id;
  }, []);

  /* Delete chat */

  const deleteChat = useCallback((id: string) => {
    setChatSessions(prev => {
      const filtered = prev.filter(c => c.id !== id);

      setActiveChatId(current =>
        current === id ? filtered[0]?.id ?? null : current
      );

      return filtered;
    });
  }, []);

  /* Rename */

  const renameChat = useCallback((id: string, title: string) => {
    setChatSessions(prev =>
      prev.map(chat =>
        chat.id === id
          ? { ...chat, title, updatedAt: new Date() }
          : chat
      )
    );
  }, []);

  /* Preview update */

  const updateChatPreview = useCallback((id: string, preview: string) => {
    setChatSessions(prev =>
      prev.map(chat =>
        chat.id === id
          ? { ...chat, preview, updatedAt: new Date() }
          : chat
      )
    );
  }, []);

  /* Pin chat (move to top) */

  const pinChat = useCallback((id: string) => {
    setChatSessions(prev => {
      const chat = prev.find(c => c.id === id);
      if (!chat) return prev;

      return [chat, ...prev.filter(c => c.id !== id)];
    });
  }, []);

  /* Unpin chat (move to bottom) */

  const unpinChat = useCallback((id: string) => {
    setChatSessions(prev => {
      const chat = prev.find(c => c.id === id);
      if (!chat) return prev;

      return [...prev.filter(c => c.id !== id), chat];
    });
  }, []);

  /* Search */

  const searchChats = useCallback(
    (query: string): ChatSession[] => {
      const q = query.toLowerCase();

      return chatSessions.filter(chat =>
        chat.title.toLowerCase().includes(q) ||
        chat.preview?.toLowerCase().includes(q)
      );
    },
    [chatSessions]
  );

  return (
    <ChatContext.Provider
      value={{
        chatSessions,
        activeChatId,

        createNewChat,
        deleteChat,
        renameChat,
        setActiveChat: setActiveChatId,

        updateChatPreview,

        pinChat,
        unpinChat,

        searchChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

/* Hook */

export const useChat = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }

  return context;
};