import { useState } from "react";
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
import { Mail, Settings, LogOut } from "lucide-react";
import { toast } from "sonner";
import ContactFormModal from "./ContactFormModal";

interface ProfileDropdownProps {
  user: User;
}

const ProfileDropdown = ({ user }: ProfileDropdownProps) => {
  const { signOut } = useFirebaseAuth();
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);

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
