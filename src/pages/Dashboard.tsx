import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Calendar, 
  Bell, 
  Home,
  CalendarDays,
  Receipt,
  User,
  Clock,
  MapPin,
  ChevronRight,
  MessageSquare,
  LogOut,
  Settings,
  Loader2,
  Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AIAssistant from "@/components/AIAssistant";
import { BookingsCalendar } from "@/components/BookingsCalendar";

interface Booking {
  id: string;
  sport: string;
  location: string;
  session_date: string;
  session_time: string;
  status: string;
  total_amount: number;
  coach_id: string;
  athlete_name: string;
  athlete_email?: string;
  athlete_phone: string;
  athlete_notes?: string;
  booking_reference: string;
  coach_profiles?: {
    profiles: {
      full_name: string;
    };
  };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("home");
  const [showAI, setShowAI] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [coachProfile, setCoachProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    pending: 0,
    awaitingPayment: 0,
    reschedules: 0
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);

    // Get profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    setProfile(profileData);

    // If coach, check for coach profile
    if (profileData?.user_type === "coach") {
      const { data: coachData } = await supabase
        .from("coach_profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      setCoachProfile(coachData);

      // If no coach profile, redirect to setup
      if (!coachData) {
        navigate("/coach/profile-setup");
        return;
      }

      // Fetch coach bookings
      await fetchCoachBookings(session.user.id);
    } else {
      // Fetch athlete bookings
      await fetchAthleteBookings(session.user.id);
    }

    setIsLoading(false);
  };

  const fetchCoachBookings = async (coachId: string) => {
    console.log("Fetching bookings for coach:", coachId);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("coach_id", coachId)
      .order("session_date", { ascending: true });

    console.log("Bookings data:", data);
    console.log("Bookings error:", error);

    if (error) {
      toast({
        title: "Error fetching bookings",
        description: error.message,
        variant: "destructive"
      });
    } else if (data) {
      setBookings(data);
      calculateStats(data);
    }
  };

  const fetchAthleteBookings = async (athleteId: string) => {
    // Athletes no longer have accounts, this function is deprecated
    // Redirecting to browse coaches instead
    navigate("/browse-coaches");
  };

  const calculateStats = (bookingsData: Booking[]) => {
    const pending = bookingsData.filter(b => b.status === "pending").length;
    const awaitingPayment = bookingsData.filter(b => b.status === "approved").length; // Approved but not paid
    const reschedules = 0; // TODO: Add rescheduling logic

    setStats({ pending, awaitingPayment, reschedules });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success text-success-foreground shadow-sm">Completed</Badge>;
      case "approved":
        return <Badge className="bg-warning text-warning-foreground shadow-sm">Approved</Badge>;
      case "pending":
        return <Badge className="bg-muted text-muted-foreground shadow-sm">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-destructive text-destructive-foreground shadow-sm">Rejected</Badge>;
      case "cancelled":
        return <Badge className="bg-destructive text-destructive-foreground shadow-sm">Cancelled</Badge>;
      default:
        return null;
    }
  };

  const todayBookings = bookings.filter(b => {
    const today = new Date().toISOString().split('T')[0];
    return b.session_date === today;
  });

  const upcomingBookings = bookings.filter(b => {
    const today = new Date().toISOString().split('T')[0];
    return b.session_date > today;
  }).slice(0, 5);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const isCoach = profile?.user_type === "coach";

  return (
    <div className="min-h-screen bg-background">
      {/* Premium Header */}
      <header className="border-b-2 border-border bg-card backdrop-blur-xl sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-xl">
                <Calendar className="h-7 w-7 text-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">MatchUp</h1>
                <p className="text-xs text-muted-foreground">
                  {isCoach ? "Coach Dashboard" : "Athlete Dashboard"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative hover:bg-secondary/20 border border-border"
                onClick={() => setShowAI(!showAI)}
              >
                <MessageSquare className="h-5 w-5 text-secondary" />
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-secondary animate-pulse" />
              </Button>
              <Button variant="ghost" size="icon" className="relative hover:bg-primary/20 border border-border">
                <Bell className="h-5 w-5 text-foreground" />
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground flex items-center justify-center">
                  {stats.pending}
                </span>
              </Button>
              {isCoach && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hover:bg-primary/20 border border-border"
                  onClick={() => navigate("/coach/profile-setup")}
                >
                  <Settings className="h-5 w-5 text-foreground" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-destructive/20 border border-border"
                onClick={handleSignOut}
              >
                <LogOut className="h-5 w-5 text-foreground" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Premium Sidebar */}
        <aside className="hidden w-72 border-r-2 border-border bg-card md:block">
          <nav className="space-y-2 p-6">
            <Button
              variant={activeTab === "home" ? "default" : "ghost"}
              className={`w-full justify-start h-12 text-base font-medium transition-all ${
                activeTab === "home" 
                  ? "bg-primary text-foreground shadow-lg" 
                  : "hover:bg-primary/20"
              }`}
              onClick={() => setActiveTab("home")}
            >
              <Home className="mr-3 h-5 w-5" />
              Home
            </Button>
            <Button
              variant={activeTab === "calendar" ? "default" : "ghost"}
              className={`w-full justify-start h-12 text-base font-medium transition-all ${
                activeTab === "calendar" 
                  ? "bg-primary text-foreground shadow-lg" 
                  : "hover:bg-primary/20"
              }`}
              onClick={() => setActiveTab("calendar")}
            >
              <Calendar className="mr-3 h-5 w-5" />
              Calendar
            </Button>
            <Button
              variant={activeTab === "bookings" ? "default" : "ghost"}
              className={`w-full justify-start h-12 text-base font-medium transition-all ${
                activeTab === "bookings" 
                  ? "bg-primary text-foreground shadow-lg" 
                  : "hover:bg-primary/20"
              }`}
              onClick={() => setActiveTab("bookings")}
            >
              <CalendarDays className="mr-3 h-5 w-5" />
              Bookings
            </Button>
            <Button
              variant={activeTab === "transactions" ? "default" : "ghost"}
              className={`w-full justify-start h-12 text-base font-medium transition-all ${
                activeTab === "transactions" 
                  ? "bg-primary text-foreground shadow-lg" 
                  : "hover:bg-primary/20"
              }`}
              onClick={() => navigate("/transactions")}
            >
              <Receipt className="mr-3 h-5 w-5" />
              Transactions
            </Button>
          </nav>

          {/* AI Assistant Card */}
          <div className="mx-6 mt-8">
            <Card className="relative overflow-hidden border-2 border-secondary bg-card p-6 shadow-xl shadow-secondary/10">
              <div className="absolute top-0 right-0 w-2 h-full bg-secondary opacity-50"></div>
              <div className="relative">
                <MessageSquare className="mb-3 h-8 w-8 text-secondary" />
                <h3 className="mb-2 font-bold text-foreground">AI Assistant</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  24/7 assistant for booking questions
                </p>
                <Button 
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary-hover shadow-lg" 
                  size="sm"
                  onClick={() => setShowAI(!showAI)}
                >
                  Chat Now
                </Button>
              </div>
            </Card>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-7xl">
            {activeTab === "home" ? (
              <>
                {/* Welcome Section */}
                <div className="mb-10">
                  <h2 className="mb-2 text-4xl font-extrabold text-foreground">
                    Welcome, {profile?.full_name?.split(' ')[0]}! 👋
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    {isCoach 
                      ? "Here's what's happening with your sessions today"
                      : "Find coaches and manage your bookings"
                    }
                  </p>
                </div>

                {/* Stats Cards - Only for Coaches */}
                {isCoach && (
                  <>
                    {/* Booking Link Card - Always Visible */}
                    <Card className="mb-6 border-2 border-secondary/30 bg-gradient-to-r from-secondary/10 to-primary/10 p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary shadow-lg">
                          <Plus className="h-7 w-7 text-secondary-foreground" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-foreground mb-2">Share Your Booking Link</h3>
                          <div className="flex gap-2 mb-3">
                            <Input 
                              value={`${window.location.origin}/book/${user?.id}`}
                              readOnly
                              className="bg-background border-2 border-border font-mono text-sm flex-1"
                            />
                            <Button
                              variant="outline"
                              className="border-2 border-secondary hover:bg-secondary hover:text-secondary-foreground"
                              onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/book/${user?.id}`);
                                toast({ title: "Copied!", description: "Booking link copied to clipboard" });
                              }}
                            >
                              Copy Link
                            </Button>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-primary/30 hover:bg-primary/10"
                              onClick={() => {
                                const link = `${window.location.origin}/book/${user?.id}`;
                                const message = `Book a session with me on MatchUp! ${link}`;
                                window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
                              }}
                            >
                              Share on WhatsApp
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-primary/30 hover:bg-primary/10"
                              onClick={() => {
                                const link = `${window.location.origin}/book/${user?.id}`;
                                const message = `Book a session with me on MatchUp! ${link}`;
                                window.open(`sms:?body=${encodeURIComponent(message)}`, '_blank');
                              }}
                            >
                              Share via SMS
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>

                    <div className="mb-10 grid gap-6 md:grid-cols-3">
                      <Card className="group relative overflow-hidden border-2 border-secondary/30 bg-card p-8 transition-all hover:shadow-2xl hover:shadow-secondary/10 hover:-translate-y-1">
                        <div className="absolute top-0 left-0 w-2 h-full bg-secondary"></div>
                        <div className="relative flex items-center justify-between">
                          <div>
                            <p className="mb-1 text-sm font-medium text-muted-foreground">Pending Approvals</p>
                            <p className="text-5xl font-extrabold text-foreground">{stats.pending}</p>
                          </div>
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent shadow-lg border-2 border-secondary/30">
                            <Clock className="h-8 w-8 text-secondary" />
                          </div>
                        </div>
                      </Card>

                      <Card className="group relative overflow-hidden border-2 border-secondary/30 bg-card p-8 transition-all hover:shadow-2xl hover:shadow-secondary/10 hover:-translate-y-1">
                        <div className="absolute top-0 left-0 w-2 h-full bg-secondary"></div>
                        <div className="relative flex items-center justify-between">
                          <div>
                            <p className="mb-1 text-sm font-medium text-muted-foreground">Awaiting Payment</p>
                            <p className="text-5xl font-extrabold text-foreground">{stats.awaitingPayment}</p>
                          </div>
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent shadow-lg border-2 border-secondary/30">
                            <Receipt className="h-8 w-8 text-secondary" />
                          </div>
                        </div>
                      </Card>

                      <Card className="group relative overflow-hidden border-2 border-primary/30 bg-card p-8 transition-all hover:shadow-2xl hover:-translate-y-1">
                        <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
                        <div className="relative flex items-center justify-between">
                          <div>
                            <p className="mb-1 text-sm font-medium text-muted-foreground">Total Bookings</p>
                            <p className="text-5xl font-extrabold text-foreground">{bookings.length}</p>
                          </div>
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent shadow-lg border-2 border-primary/30">
                            <CalendarDays className="h-8 w-8 text-primary" />
                          </div>
                        </div>
                      </Card>
                    </div>
                  </>
                )}

                {/* Empty State for Coaches with No Bookings */}
                {isCoach && bookings.length === 0 && (
                  <Card className="border-2 border-primary/30 bg-card p-12 mb-10">
                    <div className="max-w-2xl mx-auto text-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-accent shadow-xl border-2 border-primary/30 mx-auto mb-6">
                        <CalendarDays className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="text-3xl font-bold text-foreground mb-3">Welcome to MatchUp!</h3>
                      <p className="text-lg text-muted-foreground mb-8">
                        Your dashboard will come to life when athletes start booking with you. Share your booking link:
                      </p>
                      
                      <Card className="border-2 border-secondary/30 bg-accent p-6 mb-8">
                        <Label className="text-sm text-muted-foreground mb-2 block">Your Booking Link</Label>
                        <div className="flex gap-2">
                          <Input 
                            value={`${window.location.origin}/book/${user?.id}`}
                            readOnly
                            className="bg-background border-2 border-border font-mono text-sm"
                          />
                          <Button
                            variant="outline"
                            className="border-2 border-secondary hover:bg-secondary/20"
                            onClick={() => {
                              navigator.clipboard.writeText(`${window.location.origin}/book/${user?.id}`);
                              toast({ title: "Copied!", description: "Booking link copied to clipboard" });
                            }}
                          >
                            Copy
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-3">
                          Share this link on social media, WhatsApp, or with your athletes directly
                        </p>
                      </Card>

                      <div className="grid gap-4 md:grid-cols-3 mb-8 text-left">
                        <Card className="border-2 border-secondary/30 bg-accent p-6">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/20 mb-4">
                            <User className="h-6 w-6 text-secondary" />
                          </div>
                          <h4 className="font-bold text-foreground mb-2">1. Share Your Link</h4>
                          <p className="text-sm text-muted-foreground">Athletes click your link to book (no sign-up needed)</p>
                        </Card>
                        
                        <Card className="border-2 border-secondary/30 bg-accent p-6">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/20 mb-4">
                            <Bell className="h-6 w-6 text-secondary" />
                          </div>
                          <h4 className="font-bold text-foreground mb-2">2. Get Notifications</h4>
                          <p className="text-sm text-muted-foreground">We'll notify you when athletes book sessions</p>
                        </Card>
                        
                        <Card className="border-2 border-secondary/30 bg-accent p-6">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/20 mb-4">
                            <Receipt className="h-6 w-6 text-secondary" />
                          </div>
                          <h4 className="font-bold text-foreground mb-2">3. Manage Everything</h4>
                          <p className="text-sm text-muted-foreground">Approve sessions, track payments, grow your business</p>
                        </Card>
                      </div>

                      <div className="flex gap-4 justify-center">
                        <Button
                          size="lg"
                          variant="outline"
                          className="border-2 border-secondary hover:bg-secondary/10 h-14 px-8"
                          onClick={() => setShowAI(true)}
                        >
                          <MessageSquare className="mr-2 h-5 w-5" />
                          Chat with AI
                        </Button>
                        <Button
                          size="lg"
                          className="bg-primary text-foreground hover:bg-primary-hover h-14 px-8"
                          onClick={() => navigate("/coach/profile-setup")}
                        >
                          <Settings className="mr-2 h-5 w-5" />
                          Edit Profile
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}


            {/* Today's Sessions */}
            {todayBookings.length > 0 && (
              <div className="mb-10">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-3xl font-bold text-foreground">Today's Sessions</h3>
                </div>

                <div className="space-y-4">
                  {todayBookings.map((booking) => (
                    <Card key={booking.id} className="group overflow-hidden border-2 border-border bg-card p-6 transition-all hover:border-secondary hover:shadow-xl hover:shadow-secondary/10 hover:-translate-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl bg-accent shadow-lg border-2 border-secondary/30">
                            <span className="text-xs font-medium text-muted-foreground">Today</span>
                            <span className="text-xl font-bold text-secondary">{booking.session_time.slice(0, 5)}</span>
                          </div>
                          
                          <div>
                            <div className="mb-2 flex items-center gap-3">
                              <p className="text-xl font-bold text-foreground">
                                {booking.athlete_name}
                              </p>
                              {getStatusBadge(booking.status)}
                            </div>
                            <p className="mb-2 text-sm font-medium text-muted-foreground">{booking.sport}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{booking.location}</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button 
                          className="bg-primary text-foreground shadow-lg hover:bg-primary-hover hover:shadow-xl transition-all"
                          onClick={() => navigate(`/booking/${booking.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

                {/* Upcoming Bookings */}
                {upcomingBookings.length > 0 && (
                  <div>
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="text-3xl font-bold text-foreground">Upcoming Bookings</h3>
                      <Button 
                        variant="ghost" 
                        className="gap-2 hover:bg-primary/10"
                        onClick={() => setActiveTab("bookings")}
                      >
                        View All
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {upcomingBookings.map((booking) => (
                        <Card key={booking.id} className="group overflow-hidden border-2 border-border bg-card p-6 transition-all hover:border-secondary hover:shadow-xl hover:shadow-secondary/10 hover:-translate-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                              <div className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl bg-accent shadow-lg border-2 border-muted/50">
                                <span className="text-xs font-medium text-muted-foreground">{new Date(booking.session_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                <span className="text-lg font-bold text-foreground">{booking.session_time.slice(0, 5)}</span>
                              </div>
                              
                              <div>
                              <div className="mb-2 flex items-center gap-3">
                                <p className="text-xl font-bold text-foreground">
                                  {booking.athlete_name}
                                </p>
                                {getStatusBadge(booking.status)}
                              </div>
                                <p className="mb-2 text-sm font-medium text-muted-foreground">{booking.sport}</p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <MapPin className="h-4 w-4" />
                                  <span>{booking.location}</span>
                                </div>
                              </div>
                            </div>
                            
                            <Button 
                              variant="outline" 
                              className="border-2 border-primary/30 hover:bg-primary hover:text-foreground transition-all"
                              onClick={() => navigate(`/booking/${booking.id}`)}
                            >
                              {isCoach && booking.status === "pending" ? "Review" : "View"}
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : activeTab === "calendar" ? (
              /* Calendar Tab View */
              <div>
                <div className="mb-10">
                  <h2 className="mb-2 text-4xl font-extrabold text-foreground">Calendar View</h2>
                  <p className="text-lg text-muted-foreground">
                    View and manage your bookings on the calendar
                  </p>
                </div>

                <BookingsCalendar bookings={bookings} />
              </div>
            ) : (
              /* Bookings Tab View */
              <div>
                <div className="mb-10">
                  <h2 className="mb-2 text-4xl font-extrabold text-foreground">All Bookings</h2>
                  <p className="text-lg text-muted-foreground">
                    {isCoach ? "Manage all your athlete bookings" : "View all your session bookings"}
                  </p>
                </div>

                {bookings.length === 0 ? (
                  <Card className="border-2 border-primary/30 bg-card p-12 text-center">
                    <CalendarDays className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-2xl font-bold text-foreground mb-2">No bookings yet</h3>
                    <p className="text-muted-foreground mb-6">
                      {isCoach 
                        ? "Your bookings will appear here once athletes start booking sessions with you"
                        : "Start by browsing available coaches and booking your first session"
                      }
                    </p>
                    {!isCoach && (
                      <Button
                        size="lg"
                        className="bg-secondary text-secondary-foreground hover:bg-secondary-hover shadow-lg"
                        onClick={() => navigate("/browse-coaches")}
                      >
                        Browse Coaches
                      </Button>
                    )}
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {bookings.map((booking) => (
                      <Card key={booking.id} className="group overflow-hidden border-2 border-border bg-card p-6 transition-all hover:border-secondary hover:shadow-xl hover:shadow-secondary/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6 flex-1">
                            <div className="flex h-24 w-24 flex-col items-center justify-center rounded-2xl bg-accent shadow-lg border-2 border-muted/50">
                              <span className="text-sm font-medium text-muted-foreground">
                                {new Date(booking.session_date).toLocaleDateString('en-US', { month: 'short' })}
                              </span>
                              <span className="text-3xl font-extrabold text-foreground">
                                {new Date(booking.session_date).getDate()}
                              </span>
                              <span className="text-xs font-medium text-muted-foreground">
                                {booking.session_time.slice(0, 5)}
                              </span>
                            </div>
                            
                            <div className="flex-1">
                              <div className="mb-2 flex items-center gap-3">
                                <p className="text-2xl font-bold text-foreground">
                                  {booking.athlete_name}
                                </p>
                                {getStatusBadge(booking.status)}
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <p className="text-sm font-medium text-foreground">{booking.sport}</p>
                                <span className="text-muted-foreground">•</span>
                                <p className="text-sm text-muted-foreground">{booking.booking_reference}</p>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  <span>{booking.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-foreground">₱{booking.total_amount}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <Button 
                            className="bg-primary text-foreground shadow-lg hover:bg-primary-hover hover:shadow-xl transition-all"
                            onClick={() => navigate(`/booking/${booking.id}`)}
                          >
                            {isCoach && booking.status === "pending" ? "Review Booking" : "View Details"}
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* AI Assistant Overlay */}
      {showAI && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-3xl h-[80vh] border-2 border-secondary shadow-2xl shadow-secondary/20 flex flex-col overflow-hidden">
            <AIAssistant onClose={() => setShowAI(false)} />
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
