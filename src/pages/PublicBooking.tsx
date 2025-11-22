import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Loader2, MapPin, Trophy, Star, Award, Phone, Mail, User as UserIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PublicBooking = () => {
  const { coachId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [coach, setCoach] = useState<any>(null);

  // Athlete information (no account needed)
  const [athleteName, setAthleteName] = useState("");
  const [athleteEmail, setAthleteEmail] = useState("");
  const [athletePhone, setAthletePhone] = useState("");

  // Booking form state
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [duration, setDuration] = useState("1.0");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchCoachDetails();
  }, [coachId]);

  const fetchCoachDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("coach_profiles")
        .select(`
          *,
          profiles:profiles(full_name, avatar_url, phone)
        `)
        .eq("id", coachId)
        .single();

      if (error) throw error;
      setCoach(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load coach details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!coach || !duration) return 0;
    return coach.hourly_rate * parseFloat(duration);
  };

  const calculateDeposit = () => {
    if (!coach?.deposit_required) return 0;
    const total = calculateTotal();
    return (total * coach.deposit_percentage) / 100;
  };

  const handleBooking = async () => {
    if (!selectedSport || !selectedLocation || !sessionDate || !sessionTime || !athleteName || !athletePhone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);

    try {
      const { error } = await supabase.from("bookings").insert({
        coach_id: coachId,
        athlete_name: athleteName,
        athlete_email: athleteEmail || null,
        athlete_phone: athletePhone,
        athlete_notes: notes || null,
        sport: selectedSport,
        location: selectedLocation,
        session_date: sessionDate,
        session_time: sessionTime,
        duration_hours: parseFloat(duration),
        total_amount: calculateTotal(),
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Booking Submitted!",
        description: "Your booking request has been sent to the coach. You'll receive a confirmation shortly.",
      });

      // Redirect to success page or reset form
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create booking",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!coach) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-foreground mb-2">Coach Not Found</h2>
          <p className="text-muted-foreground">This coach profile doesn't exist or has been removed.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-2 border-border bg-card backdrop-blur-xl sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-xl">
              <Calendar className="h-7 w-7 text-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">MatchUp</h1>
              <p className="text-xs text-muted-foreground">Book Your Session</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Coach Profile Section */}
          <Card className="border-2 border-border bg-card mb-8 overflow-hidden">
            <div className="relative h-32 bg-gradient-to-r from-primary/20 to-secondary/20"></div>
            <div className="p-8 -mt-16">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-accent shadow-2xl border-4 border-card">
                  <Trophy className="h-14 w-14 text-primary" />
                </div>

                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-foreground mb-2">{coach.profiles?.full_name}</h2>
                  {coach.business_name && (
                    <p className="text-lg text-muted-foreground mb-3">{coach.business_name}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-3 mb-4">
                    <Badge className="bg-secondary text-secondary-foreground shadow-sm">
                      ₱{coach.hourly_rate}/hr
                    </Badge>
                    {coach.years_of_experience && (
                      <Badge variant="outline" className="border-primary/30">
                        <Award className="h-3 w-3 mr-1" />
                        {coach.years_of_experience} years exp
                      </Badge>
                    )}
                  </div>

                  {coach.bio && (
                    <p className="text-sm text-muted-foreground mb-4">{coach.bio}</p>
                  )}

                  {coach.certifications && coach.certifications.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {coach.certifications.map((cert: string, index: number) => (
                        <Badge key={index} variant="outline" className="border-secondary/30">
                          <Star className="h-3 w-3 mr-1 text-secondary" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Booking Form */}
          <Card className="border-2 border-border bg-card p-8">
            <h3 className="text-2xl font-bold text-foreground mb-6">Book a Session</h3>

            <div className="space-y-6">
              {/* Your Information */}
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-4">Your Information</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        value={athleteName}
                        onChange={(e) => setAthleteName(e.target.value)}
                        placeholder="Juan Dela Cruz"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={athletePhone}
                        onChange={(e) => setAthletePhone(e.target.value)}
                        placeholder="09XX XXX XXXX"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={athleteEmail}
                        onChange={(e) => setAthleteEmail(e.target.value)}
                        placeholder="juan@example.com"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Session Details */}
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-4">Session Details</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="sport">Sport *</Label>
                    <Select value={selectedSport} onValueChange={setSelectedSport}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sport" />
                      </SelectTrigger>
                      <SelectContent>
                        {coach.sports_offered?.map((sport: string) => (
                          <SelectItem key={sport} value={sport}>
                            {sport}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {coach.locations?.map((location: string) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="date">Session Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={sessionDate}
                      onChange={(e) => setSessionDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div>
                    <Label htmlFor="time">Session Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={sessionTime}
                      onChange={(e) => setSessionTime(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="duration">Duration (hours) *</Label>
                    <Select value={duration} onValueChange={setDuration}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.5">0.5 hours</SelectItem>
                        <SelectItem value="1.0">1 hour</SelectItem>
                        <SelectItem value="1.5">1.5 hours</SelectItem>
                        <SelectItem value="2.0">2 hours</SelectItem>
                        <SelectItem value="2.5">2.5 hours</SelectItem>
                        <SelectItem value="3.0">3 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requests or information for the coach..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Payment Summary */}
              <Card className="border-2 border-primary/30 bg-accent p-6">
                <h4 className="text-lg font-semibold text-foreground mb-4">Payment Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hourly Rate:</span>
                    <span className="font-medium text-foreground">₱{coach.hourly_rate}/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium text-foreground">{duration} hours</span>
                  </div>
                  <div className="border-t border-border pt-2 mt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Amount:</span>
                      <span className="text-primary">₱{calculateTotal()}</span>
                    </div>
                  </div>
                  {coach.deposit_required && (
                    <div className="bg-secondary/10 p-3 rounded-lg mt-3">
                      <p className="text-sm text-foreground">
                        <strong>Deposit Required:</strong> ₱{calculateDeposit()} ({coach.deposit_percentage}%)
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Pay the deposit to secure your booking. Full payment before the session.
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Submit Button */}
              <Button
                size="lg"
                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary-hover shadow-lg h-14 text-lg"
                onClick={handleBooking}
                disabled={isBooking}
              >
                {isBooking ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Calendar className="mr-2 h-5 w-5" />
                    Submit Booking Request
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                The coach will review your booking and confirm via phone or email
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PublicBooking;
