import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Calendar, ArrowLeft, Loader2, MapPin, Trophy, Star, Award } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CoachDetail = () => {
  const { coachId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [coach, setCoach] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [athleteProfile, setAthleteProfile] = useState<any>(null);

  // Booking form state
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [duration, setDuration] = useState("1.0");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    checkAuth();
    fetchCoachDetails();
  }, [coachId]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);

    // Check if athlete profile exists
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (profile?.user_type === "athlete") {
      const { data: athleteData } = await supabase
        .from("athlete_profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (!athleteData) {
        // Create athlete profile if doesn't exist
        await supabase.from("athlete_profiles").insert({ id: session.user.id });
      } else {
        setAthleteProfile(athleteData);
      }
    }
  };

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
      navigate("/browse-coaches");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!coach || !duration) return 0;
    return coach.hourly_rate * parseFloat(duration);
  };

  const calculateDeposit = () => {
    if (!coach || !coach.deposit_required) return 0;
    return (calculateTotal() * coach.deposit_percentage) / 100;
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSport || !selectedLocation || !sessionDate || !sessionTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);

    try {
      const { error } = await supabase.from("bookings").insert({
        coach_id: coachId,
        athlete_id: user.id,
        sport: selectedSport,
        location: selectedLocation,
        session_date: sessionDate,
        session_time: sessionTime,
        duration_hours: parseFloat(duration),
        total_amount: calculateTotal(),
        status: "pending",
        notes,
      });

      if (error) throw error;

      toast({
        title: "Booking Submitted!",
        description: "Your booking request has been sent to the coach for approval.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
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

  if (!coach) return null;

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-2 border-border bg-card backdrop-blur-xl sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/browse-coaches")}
              className="hover:bg-primary/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-xl">
              <Calendar className="h-7 w-7 text-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {coach.business_name || coach.profiles.full_name}
              </h1>
              <p className="text-xs text-muted-foreground">Coach Profile</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Coach Details */}
          <div className="space-y-6">
            <Card className="border-2 border-border bg-card p-6">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {coach.business_name || coach.profiles.full_name}
              </h2>
              
              <div className="flex items-center gap-4 mb-6">
                {coach.years_of_experience && (
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-secondary" />
                    <span className="text-sm font-medium">{coach.years_of_experience} years exp</span>
                  </div>
                )}
                <div className="text-3xl font-bold text-secondary">
                  ₱{coach.hourly_rate.toLocaleString()}/hr
                </div>
              </div>

              {coach.bio && (
                <div className="mb-6">
                  <h3 className="font-bold text-foreground mb-2">About</h3>
                  <p className="text-muted-foreground">{coach.bio}</p>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-bold text-foreground mb-3">Sports Offered</h3>
                <div className="flex flex-wrap gap-2">
                  {coach.sports_offered.map((sport: string) => (
                    <Badge key={sport} className="bg-secondary text-secondary-foreground">
                      {sport}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-foreground mb-3">Service Locations</h3>
                <div className="flex flex-wrap gap-2">
                  {coach.locations.map((location: string) => (
                    <Badge key={location} variant="outline" className="border-primary">
                      <MapPin className="h-3 w-3 mr-1" />
                      {location}
                    </Badge>
                  ))}
                </div>
              </div>

              {coach.certifications && coach.certifications.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-foreground mb-3">Certifications</h3>
                  <ul className="space-y-2">
                    {coach.certifications.map((cert: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Award className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                        <span>{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {coach.cancellation_policy && (
                <div>
                  <h3 className="font-bold text-foreground mb-2">Cancellation Policy</h3>
                  <p className="text-sm text-muted-foreground">{coach.cancellation_policy}</p>
                </div>
              )}
            </Card>
          </div>

          {/* Booking Form */}
          <div>
            <Card className="border-2 border-secondary bg-card p-6 sticky top-24">
              <h3 className="text-2xl font-bold text-foreground mb-6">Book a Session</h3>
              
              <form onSubmit={handleSubmitBooking} className="space-y-4">
                <div>
                  <Label htmlFor="sport">Sport *</Label>
                  <Select value={selectedSport} onValueChange={setSelectedSport} required>
                    <SelectTrigger className="border-2 border-border">
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent>
                      {coach.sports_offered.map((sport: string) => (
                        <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation} required>
                    <SelectTrigger className="border-2 border-border">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {coach.locations.map((location: string) => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="sessionDate">Date *</Label>
                  <Input
                    id="sessionDate"
                    type="date"
                    min={minDate}
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    required
                    className="border-2 border-border"
                  />
                </div>

                <div>
                  <Label htmlFor="sessionTime">Time *</Label>
                  <Input
                    id="sessionTime"
                    type="time"
                    value={sessionTime}
                    onChange={(e) => setSessionTime(e.target.value)}
                    required
                    className="border-2 border-border"
                  />
                </div>

                <div>
                  <Label htmlFor="duration">Duration (hours) *</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger className="border-2 border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5">30 minutes</SelectItem>
                      <SelectItem value="1.0">1 hour</SelectItem>
                      <SelectItem value="1.5">1.5 hours</SelectItem>
                      <SelectItem value="2.0">2 hours</SelectItem>
                      <SelectItem value="2.5">2.5 hours</SelectItem>
                      <SelectItem value="3.0">3 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requests or information..."
                    rows={3}
                    className="border-2 border-border"
                  />
                </div>

                {/* Pricing Summary */}
                <div className="border-t-2 border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Session Total:</span>
                    <span className="font-bold text-foreground">₱{calculateTotal().toLocaleString()}</span>
                  </div>
                  {coach.deposit_required && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Deposit ({coach.deposit_percentage}%):</span>
                        <span className="font-bold text-secondary">₱{calculateDeposit().toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        *Deposit required to confirm booking
                      </p>
                    </>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isBooking}
                  className="w-full h-12 bg-secondary text-secondary-foreground hover:bg-secondary-hover text-lg font-semibold"
                >
                  {isBooking ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Request Booking"
                  )}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground">
                  The coach will review and approve your booking request
                </p>
              </form>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoachDetail;
