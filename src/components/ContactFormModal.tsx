import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { submitContactRequest } from "@/lib/firebase";
import { toast } from "sonner";
import { Loader2, Phone, CheckCircle } from "lucide-react";

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactFormModal = ({ isOpen, onClose }: ContactFormModalProps) => {
  const { user } = useFirebaseAuth();
  const [subject, setSubject] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in to send a request");
      return;
    }

    if (!subject.trim() || !message.trim() || !phone.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    // Basic phone validation
    const phoneRegex = /^[+]?[\d\s-()]{8,}$/;
    if (!phoneRegex.test(phone.trim())) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Submitting contact request for user:", user.uid);
      await submitContactRequest({
        userId: user.uid,
        email: user.email || "",
        name: user.displayName || "",
        phone: phone.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });

      console.log("Contact request submitted successfully");
      setIsSuccess(true);
      toast.success("Request submitted successfully! We'll call you back soon.");
      
      setTimeout(() => {
        setSubject("");
        setPhone("");
        setMessage("");
        setIsSuccess(false);
        onClose();
      }, 2500);
    } catch (error: unknown) {
      console.error("Error submitting request:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      // Check for permission denied errors
      if (errorMessage.includes("PERMISSION_DENIED") || errorMessage.includes("permission")) {
        toast.error("Database permission error. Please contact support.");
      } else {
        toast.error("Failed to submit request. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSubject("");
      setPhone("");
      setMessage("");
      setIsSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Contact Us</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Fill out the form below and we'll get back to you as soon as possible.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <CheckCircle className="w-16 h-16 text-primary animate-scale-in" />
            <p className="text-foreground font-medium">Request Submitted!</p>
            <p className="text-muted-foreground text-sm text-center">
              We'll review your request and call you back soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Your Email
              </Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
                className="bg-muted text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject" className="text-foreground">
                Subject
              </Label>
              <Input
                id="subject"
                type="text"
                placeholder="e.g., New Website Project"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={isSubmitting}
                className="bg-input text-foreground border-border placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="e.g., +91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isSubmitting}
                className="bg-input text-foreground border-border placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-foreground">
                Message
              </Label>
              <Textarea
                id="message"
                placeholder="Tell us about your project, requirements, budget, timeline..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isSubmitting}
                rows={4}
                className="bg-input text-foreground border-border placeholder:text-muted-foreground resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Phone className="mr-2 h-4 w-4" />
                  Request a Call Back
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContactFormModal;
