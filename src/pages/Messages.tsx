import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { 
  subscribeToChats, 
  subscribeToMessages, 
  sendMessage, 
  createChat,
  markMessagesAsRead 
} from "@/lib/firebase";
import { ArrowLeft, Send, Plus, MessageCircle, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { toast } from "sonner";

interface Chat {
  id: string;
  createdBy: string;
  createdByEmail: string;
  createdByName: string;
  participants: Record<string, boolean>;
  metadata?: {
    lastMessage: string;
    lastMessageTime: number;
    lastSenderId: string;
  };
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: number;
  read: boolean;
}

const Messages = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useFirebaseAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  // Check admin status
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return;
      
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.uid)
        .eq("role", "admin")
        .maybeSingle();

      setIsAdmin(!!roleData);
      setLoading(false);
    };

    if (user) {
      checkAdmin();
    }
  }, [user]);

  // Subscribe to chats
  useEffect(() => {
    if (!user || loading) return;

    const unsubscribe = subscribeToChats(user.uid, isAdmin, (chatList) => {
      setChats(chatList);
    });

    return unsubscribe;
  }, [user, isAdmin, loading]);

  // Subscribe to messages for selected chat
  useEffect(() => {
    if (!selectedChat) {
      setMessages([]);
      return;
    }

    const unsubscribe = subscribeToMessages(selectedChat.id, (messageList) => {
      setMessages(messageList);
    });

    // Mark messages as read
    if (user) {
      markMessagesAsRead(selectedChat.id, user.uid);
    }

    return unsubscribe;
  }, [selectedChat, user]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCreateChat = async () => {
    if (!user) return;

    try {
      const chatId = await createChat(
        user.uid,
        user.email || "",
        user.displayName || "User"
      );
      
      if (chatId) {
        toast.success("Chat created! Start messaging.");
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Failed to create chat");
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !user) return;

    setSending(true);
    try {
      await sendMessage(
        selectedChat.id,
        user.uid,
        user.displayName || user.email || "User",
        newMessage.trim()
      );
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const getUnreadCount = (chat: Chat): number => {
    if (!user) return 0;
    // This would need real-time tracking, simplified for now
    return 0;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Messages | CodeFyre</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-foreground">
              {isAdmin ? "All Chats" : "My Messages"}
            </h1>
            {isAdmin && (
              <Badge variant="outline" className="ml-2 border-primary text-primary">
                Admin
              </Badge>
            )}
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
            {/* Chats List */}
            <div className="md:col-span-1 border border-border rounded-lg bg-card overflow-hidden flex flex-col">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-foreground">Conversations</h2>
                  <p className="text-sm text-muted-foreground">
                    {chats.length} chat{chats.length !== 1 ? "s" : ""}
                  </p>
                </div>
                {!isAdmin && (
                  <Button
                    size="sm"
                    onClick={handleCreateChat}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    New Chat
                  </Button>
                )}
              </div>
              <ScrollArea className="flex-1">
                {chats.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No conversations yet</p>
                    {!isAdmin && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCreateChat}
                        className="mt-3"
                      >
                        Start a conversation
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {chats.map((chat) => (
                      <button
                        key={chat.id}
                        onClick={() => setSelectedChat(chat)}
                        className={`w-full p-4 text-left transition-colors hover:bg-muted/50 ${
                          selectedChat?.id === chat.id
                            ? "bg-primary/10 border-l-2 border-l-primary"
                            : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground truncate">
                                {isAdmin 
                                  ? chat.createdByName || chat.createdByEmail 
                                  : "Support Team"}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {chat.metadata?.lastMessage || "No messages yet"}
                            </p>
                            {chat.metadata?.lastMessageTime && (
                              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {format(new Date(chat.metadata.lastMessageTime), "MMM d, h:mm a")}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Chat Messages */}
            <div className="md:col-span-2 border border-border rounded-lg bg-card overflow-hidden flex flex-col">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {isAdmin 
                            ? selectedChat.createdByName || selectedChat.createdByEmail 
                            : "Support Team"}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {isAdmin ? selectedChat.createdByEmail : "We typically reply within a few hours"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                          <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                          <p>No messages yet. Start the conversation!</p>
                        </div>
                      ) : (
                        messages.map((msg) => {
                          const isOwnMessage = msg.senderId === user.uid;
                          return (
                            <div
                              key={msg.id}
                              className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                                  isOwnMessage
                                    ? "bg-primary text-primary-foreground rounded-br-sm"
                                    : "bg-muted text-foreground rounded-bl-sm"
                                }`}
                              >
                                {!isOwnMessage && (
                                  <p className="text-xs font-medium mb-1 opacity-70">
                                    {msg.senderName}
                                  </p>
                                )}
                                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                <p className={`text-xs mt-1 ${
                                  isOwnMessage ? "text-primary-foreground/60" : "text-muted-foreground"
                                }`}>
                                  {msg.timestamp && format(new Date(msg.timestamp), "h:mm a")}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="p-4 border-t border-border">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className="flex-1 bg-background"
                        disabled={sending}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sending}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Select a conversation to start chatting</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Messages;