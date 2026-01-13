import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "firebase/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Settings, LogOut, Inbox } from "lucide-react";
import { toast } from "sonner";
import ContactFormModal from "./ContactFormModal";

interface ProfileDropdownProps {
  user: User;
}

const ProfileDropdown = ({ user }: ProfileDropdownProps) => {
  const navigate = useNavigate();
  const { signOut } = useFirebaseAuth();
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user?.uid) return;

      try {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.uid)
          .eq("role", "admin")
          .maybeSingle();

        setIsAdmin(!!data);

        if (data) {
          // Fetch unread message count for admin
          const { count } = await supabase
            .from("contact_messages")
            .select("*", { count: "exact", head: true })
            .eq("status", "unread");

          setUnreadCount(count || 0);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };

    checkAdminStatus();
  }, [user?.uid]);

  const handleMessagesClick = () => {
    navigate("/messages");
  };

  const handleContactUs = () => {
    setIsContactFormOpen(true);
  };

  const handleSettings = () => {
    toast.info("Settings coming soon!");
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
  };

  const getInitials = () => {
    if (user.displayName) {
      return user.displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="relative rounded-full ring-2 ring-transparent hover:ring-primary/50 transition-all duration-200 focus:outline-none focus:ring-primary">
            <Avatar className="h-10 w-10 cursor-pointer">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "Profile"} />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            {isAdmin && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-56 bg-popover border-border z-50"
          sideOffset={8}
        >
          <div className="px-3 py-2">
            <p className="text-sm font-medium text-foreground truncate">
              {user.displayName || "User"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
          <DropdownMenuSeparator className="bg-border" />
          {isAdmin && (
            <DropdownMenuItem 
              onClick={handleMessagesClick}
              className="cursor-pointer text-foreground focus:bg-muted focus:text-foreground"
            >
              <Inbox className="mr-2 h-4 w-4" />
              Messages
              {unreadCount > 0 && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem 
            onClick={handleContactUs}
            className="cursor-pointer text-foreground focus:bg-muted focus:text-foreground"
          >
            <Mail className="mr-2 h-4 w-4" />
            Contact Us
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleSettings}
            className="cursor-pointer text-foreground focus:bg-muted focus:text-foreground"
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border" />
          <DropdownMenuItem 
            onClick={handleSignOut}
            className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ContactFormModal 
        isOpen={isContactFormOpen} 
        onClose={() => setIsContactFormOpen(false)} 
      />
    </>
  );
};

export default ProfileDropdown;
