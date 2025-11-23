import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Calendar, ArrowLeft, Loader2, MapPin, User, CheckCircle, XCircle, DollarSign, Ban } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { sendBookingEmail } from "@/lib/emailService";
import { CancelBookingDialog } from "@/components/CancelBookingDialog";

const BookingDetail = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [isCoach, setIsCoach] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Payment tracking state
  const [paymentMethod, setPaymentMethod] = useState<"gcash" | "maya" | "cash">("gcash");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [isDeposit, setIsDeposit] = useState(true);

  useEffect(() => {
    checkAuth();
  }, [bookingId]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    setIsCoach(profile?.user_type === "coach");
    await fetchBookingDetails(session.user.id, profile?.user_type === "coach");
  };

  const fetchBookingDetails = async (userId: string, userIsCoach: boolean) => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          coach_profiles:coach_profiles!coach_id(
            profiles:profiles(full_name, phone),
            business_name
          ),
          payments:payments(*)
        `)
        .eq("id", bookingId)
        .single();

      if (error) throw error;

      // Check if user has access to this booking (coaches only now)
      if (userIsCoach && data.coach_id !== userId) {
        throw new Error("Access denied");
      }
      if (!userIsCoach) {
        // Non-coaches shouldn't access this page
        throw new Error("Access denied");
      }

      setBooking(data);

      // Set default payment amount to total
      setPaymentAmount(data.total_amount.toString());
      setIsDeposit(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load booking details",
        variant: "destructive",
      });
      navigate("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveBooking = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "approved" })
        .eq("id", bookingId);

      if (error) throw error;

      toast({
        title: "Booking Approved!",
        description: "The athlete has been notified.",
      });

      await fetchBookingDetails(user.id, isCoach);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRejectBooking = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "rejected" })
        .eq("id", bookingId);

      if (error) throw error;

      // Send rejection email
      try {
        await sendBookingEmail(
          booking.athlete_email || "",
          "booking_rejected",
          {
            athleteName: booking.athlete_name,
            coachName: booking.coach_profiles?.profiles?.full_name || "Coach",
            sport: booking.sport,
            location: booking.location,
            sessionDate: new Date(booking.session_date).toLocaleDateString(),
            sessionTime: booking.session_time,
            duration: booking.duration_hours,
            totalAmount: booking.total_amount,
            bookingReference: booking.booking_reference,
          }
        );
      } catch (emailError) {
        console.error("Failed to send rejection email:", emailError);
      }

      toast({
        title: "Booking Rejected",
        description: "The athlete has been notified via email.",
      });

      await fetchBookingDetails(user.id, isCoach);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRecordPayment = async () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid payment amount",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase.from("payments").insert({
        booking_id: bookingId,
        amount: parseFloat(paymentAmount),
        payment_method: paymentMethod,
        payment_status: "paid",
        reference_number: referenceNumber || null,
        payment_date: new Date().toISOString(),
        is_deposit: isDeposit,
      });

      if (error) throw error;

      // Check if full payment is made
      const totalPaid = booking.payments.reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0) + parseFloat(paymentAmount);
      
      if (totalPaid >= booking.total_amount) {
        await supabase
          .from("bookings")
          .update({ status: "completed" })
          .eq("id", bookingId);
      }

      toast({
        title: "Payment Recorded!",
        description: `₱${parseFloat(paymentAmount).toLocaleString()} payment recorded successfully.`,
      });

      // Reset form
      setReferenceNumber("");
      await fetchBookingDetails(user.id, isCoach);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!booking) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success text-success-foreground">Completed</Badge>;
      case "approved":
        return <Badge className="bg-warning text-warning-foreground">Approved</Badge>;
      case "pending":
        return <Badge className="bg-muted text-muted-foreground">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-destructive text-destructive-foreground">Rejected</Badge>;
      case "cancelled":
        return <Badge className="bg-destructive text-destructive-foreground">Cancelled</Badge>;
      default:
        return null;
    }
  };

  const totalPaid = booking.payments?.reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0) || 0;
  const remainingBalance = booking.total_amount - totalPaid;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-2 border-border bg-card backdrop-blur-xl sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
              className="hover:bg-primary/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-xl">
              <Calendar className="h-7 w-7 text-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Booking Details</h1>
              <p className="text-xs text-muted-foreground">#{booking.id.slice(0, 8)}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Booking Info */}
          <Card className="border-2 border-border bg-card p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  {booking.sport} Session
                </h2>
                {getStatusBadge(booking.status)}
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-3xl font-bold text-secondary">₱{booking.total_amount.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-foreground mb-3">Session Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">
                        {new Date(booking.session_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-muted-foreground">{booking.session_time.slice(0, 5)} • {booking.duration_hours} hour(s)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{booking.location}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-3">
                  {isCoach ? "Athlete" : "Coach"}
                </h3>
                <div className="flex items-start gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">
                      {isCoach 
                        ? booking.athlete_profiles?.profiles?.full_name
                        : booking.coach_profiles?.profiles?.full_name || booking.coach_profiles?.business_name
                      }
                    </p>
                    {(isCoach ? booking.athlete_profiles?.profiles?.phone : booking.coach_profiles?.profiles?.phone) && (
                      <p className="text-muted-foreground">
                        {isCoach ? booking.athlete_profiles.profiles.phone : booking.coach_profiles.profiles.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {booking.notes && (
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="font-bold text-foreground mb-2">Notes</h3>
                <p className="text-sm text-muted-foreground">{booking.notes}</p>
              </div>
            )}
          </Card>

          {/* Coach Actions - Approve/Reject */}
          {isCoach && booking.status === "pending" && (
            <Card className="border-2 border-secondary bg-card p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Review Booking</h3>
              <div className="flex gap-4">
                <Button
                  onClick={handleApproveBooking}
                  disabled={isUpdating}
                  className="flex-1 h-12 bg-success text-success-foreground hover:bg-success/90"
                >
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Approve Booking
                </Button>
                <Button
                  onClick={handleRejectBooking}
                  disabled={isUpdating}
                  variant="destructive"
                  className="flex-1 h-12"
                >
                  <XCircle className="mr-2 h-5 w-5" />
                  Reject Booking
                </Button>
              </div>
            </Card>
          )}

          {/* Cancel Booking - Show for approved/pending bookings */}
          {isCoach && (booking?.status === "approved" || booking?.status === "pending") && (
            <Card className="border-2 border-destructive/20 bg-card p-6">
              <h3 className="text-xl font-bold text-destructive mb-4">Cancel Booking</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Cancel this booking and notify the athlete. This action cannot be undone.
              </p>
              <Button
                onClick={() => setShowCancelDialog(true)}
                disabled={isUpdating}
                variant="destructive"
                className="w-full h-12"
              >
                <Ban className="mr-2 h-5 w-5" />
                Cancel Booking
              </Button>
            </Card>
          )}

          {/* Payment Tracking */}
          <Card className="border-2 border-border bg-card p-6">
            <h3 className="text-xl font-bold text-foreground mb-4">Payment Tracking</h3>
            
            <div className="mb-6 p-4 bg-accent rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Paid:</span>
                <span className="font-bold text-success">₱{totalPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Remaining Balance:</span>
                <span className="font-bold text-foreground">₱{remainingBalance.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment History */}
            {booking.payments && booking.payments.length > 0 && (
              <div className="mb-6">
                <h4 className="font-bold text-foreground mb-3">Payment History</h4>
                <div className="space-y-2">
                  {booking.payments.map((payment: any) => (
                    <div key={payment.id} className="flex justify-between items-center p-3 bg-accent rounded-lg text-sm">
                      <div>
                        <p className="font-medium">
                          ₱{parseFloat(payment.amount).toLocaleString()}
                          {payment.is_deposit && <Badge className="ml-2 text-xs">Deposit</Badge>}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {payment.payment_method.toUpperCase()}
                          {payment.reference_number && ` • ${payment.reference_number}`}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(payment.payment_date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Record Payment Form - Only for coaches */}
            {isCoach && remainingBalance > 0 && booking.status === "approved" && (
              <div className="space-y-4 pt-6 border-t border-border">
                <h4 className="font-bold text-foreground">Record Payment</h4>
                
                <div>
                  <Label>Payment Method</Label>
                  <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="gcash" id="gcash" />
                        <Label htmlFor="gcash" className="cursor-pointer">GCash</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="maya" id="maya" />
                        <Label htmlFor="maya" className="cursor-pointer">Maya</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash" className="cursor-pointer">Cash</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Amount *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="1500"
                      className="border-2 border-border"
                    />
                  </div>

                  <div>
                    <Label htmlFor="reference">Reference # (optional)</Label>
                    <Input
                      id="reference"
                      type="text"
                      value={referenceNumber}
                      onChange={(e) => setReferenceNumber(e.target.value)}
                      placeholder="GC12345678"
                      className="border-2 border-border"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isDeposit"
                    checked={isDeposit}
                    onChange={(e) => setIsDeposit(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="isDeposit" className="cursor-pointer">
                    This is a deposit payment
                  </Label>
                </div>

                <Button
                  onClick={handleRecordPayment}
                  disabled={isUpdating}
                  className="w-full h-12 bg-secondary text-secondary-foreground hover:bg-secondary-hover"
                >
                  <DollarSign className="mr-2 h-5 w-5" />
                  Record Payment
                </Button>
              </div>
            )}
          </Card>
        </div>
      </main>

      {/* Cancel Booking Dialog */}
      <CancelBookingDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        booking={booking}
        onSuccess={() => fetchBookingDetails(user.id, isCoach)}
      />
    </div>
  );
};

export default BookingDetail;
