import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { ArrowLeft, Mail, MailOpen, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface ContactMessage {
  id: string;
  sender_id: string;
  sender_email: string;
  sender_name: string | null;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

const Messages = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useFirebaseAuth();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const checkAdminAndFetchMessages = async () => {
      if (!user) return;

      try {
        // Check if user is admin
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.uid)
          .eq("role", "admin")
          .maybeSingle();

        const userIsAdmin = !!roleData;
        setIsAdmin(userIsAdmin);

        // Fetch messages
        const { data: messagesData, error } = await supabase
          .from("contact_messages")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching messages:", error);
        } else {
          setMessages(messagesData || []);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      checkAdminAndFetchMessages();
    }
  }, [user]);

  const handleSelectMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);

    // Mark as read if admin and unread
    if (isAdmin && message.status === "unread") {
      await supabase
        .from("contact_messages")
        .update({ status: "read" })
        .eq("id", message.id);

      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? { ...m, status: "read" } : m))
      );
    }
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
              {isAdmin ? "All Messages" : "My Messages"}
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
            {/* Messages List */}
            <div className="md:col-span-1 border border-border rounded-lg bg-card overflow-hidden">
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold text-foreground">Inbox</h2>
                <p className="text-sm text-muted-foreground">
                  {messages.length} message{messages.length !== 1 ? "s" : ""}
                </p>
              </div>
              <ScrollArea className="h-[calc(100%-80px)]">
                {messages.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No messages yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {messages.map((message) => (
                      <button
                        key={message.id}
                        onClick={() => handleSelectMessage(message)}
                        className={`w-full p-4 text-left transition-colors hover:bg-muted/50 ${
                          selectedMessage?.id === message.id
                            ? "bg-primary/10 border-l-2 border-l-primary"
                            : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {message.status === "unread" ? (
                              <Mail className="w-4 h-4 text-primary" />
                            ) : (
                              <MailOpen className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-sm truncate ${
                                  message.status === "unread"
                                    ? "font-semibold text-foreground"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {message.sender_name || message.sender_email}
                              </span>
                              {message.status === "unread" && (
                                <Badge className="bg-primary text-primary-foreground text-xs">
                                  New
                                </Badge>
                              )}
                            </div>
                            <p
                              className={`text-sm truncate ${
                                message.status === "unread"
                                  ? "font-medium text-foreground"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {message.subject}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {format(new Date(message.created_at), "MMM d, h:mm a")}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Message Detail */}
            <div className="md:col-span-2 border border-border rounded-lg bg-card overflow-hidden">
              {selectedMessage ? (
                <div className="h-full flex flex-col">
                  <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                      {selectedMessage.subject}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>
                          {selectedMessage.sender_name || "Unknown"} (
                          {selectedMessage.sender_email})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          {format(
                            new Date(selectedMessage.created_at),
                            "MMMM d, yyyy 'at' h:mm a"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ScrollArea className="flex-1 p-6">
                    <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                      {selectedMessage.message}
                    </p>
                  </ScrollArea>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <MailOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Select a message to read</p>
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