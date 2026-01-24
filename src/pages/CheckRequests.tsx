import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { isAdminEmail, subscribeToContactRequests, updateRequestStatus, ContactRequest } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Phone, Mail, Clock, User, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const CheckRequests = () => {
  const navigate = useNavigate();
  const { user, loading } = useFirebaseAuth();
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !isAdminEmail(user.email))) {
      toast.error("Access denied. Admin only.");
      navigate("/");
      return;
    }

    if (user && isAdminEmail(user.email)) {
      const unsubscribe = subscribeToContactRequests((data) => {
        setRequests(data);
        setLoadingRequests(false);
      });

      return () => unsubscribe();
    }
  }, [user, loading, navigate]);

  const handleStatusChange = async (requestId: string, newStatus: ContactRequest['status']) => {
    try {
      await updateRequestStatus(requestId, newStatus);
      toast.success("Status updated");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="destructive">Pending</Badge>;
      case 'contacted':
        return <Badge variant="secondary">Contacted</Badge>;
      case 'resolved':
        return <Badge variant="default">Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (timestamp: object | number) => {
    if (typeof timestamp === 'number') {
      return format(new Date(timestamp), 'MMM dd, yyyy hh:mm a');
    }
    return 'Just now';
  };

  if (loading || loadingRequests) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Check Requests</h1>
            <p className="text-sm text-muted-foreground">
              {requests.length} callback request{requests.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <MessageSquare className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h2 className="text-lg font-medium text-foreground">No requests yet</h2>
            <p className="text-muted-foreground">Callback requests will appear here</p>
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Name
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">Subject</TableHead>
                  <TableHead className="font-semibold">Message</TableHead>
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Date
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{request.name || 'N/A'}</TableCell>
                    <TableCell>
                      <a 
                        href={`mailto:${request.email}`}
                        className="text-primary hover:underline"
                      >
                        {request.email}
                      </a>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
                        onClick={() => handleCall(request.phone)}
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        {request.phone}
                      </Button>
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate" title={request.subject}>
                      {request.subject}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate" title={request.message}>
                      {request.message}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatDate(request.createdAt)}
                    </TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      <Select
                        value={request.status}
                        onValueChange={(value) => handleStatusChange(request.id!, value as ContactRequest['status'])}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  );
};

export default CheckRequests;
