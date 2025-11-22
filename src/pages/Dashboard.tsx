import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Sparkles,
  MessageSquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AIAssistant from "@/components/AIAssistant";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");
  const [showAI, setShowAI] = useState(false);

  // Mock data based on wireframe
  const stats = {
    pending: 2,
    awaitingPayment: 4,
    reschedules: 3
  };

  const todaySessions = [
    {
      id: 1,
      time: "4:00 PM",
      athlete: "Miguel D.",
      sport: "Basketball",
      location: "Ateneo Gym",
      status: "paid"
    },
    {
      id: 2,
      time: "6:00 PM",
      athlete: "Sarah L.",
      sport: "Tennis",
      location: "Rockwell Club",
      status: "paid"
    }
  ];

  const upcomingBookings = [
    {
      id: 3,
      time: "4:00 PM",
      date: "Tomorrow",
      athlete: "Jose M.",
      sport: "Volleyball",
      location: "UP Gym",
      status: "awaiting-payment"
    },
    {
      id: 4,
      time: "5:00 PM",
      date: "Nov 26",
      athlete: "Anna R.",
      sport: "Badminton",
      location: "BGC Sports Club",
      status: "pending"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-success text-success-foreground shadow-sm">Paid</Badge>;
      case "awaiting-payment":
        return <Badge className="bg-warning text-warning-foreground shadow-sm">Awaiting</Badge>;
      case "pending":
        return <Badge className="bg-muted text-muted-foreground shadow-sm">Pending</Badge>;
      default:
        return null;
    }
  };

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
                <p className="text-xs text-muted-foreground">Coach Dashboard</p>
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
                  3
                </span>
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-primary/20 border border-border">
                <User className="h-5 w-5 text-foreground" />
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
              variant={activeTab === "transactions" ? "default" : "ghost"}
              className={`w-full justify-start h-12 text-base font-medium transition-all ${
                activeTab === "transactions" 
                  ? "bg-primary text-foreground shadow-lg" 
                  : "hover:bg-primary/20"
              }`}
              onClick={() => setActiveTab("transactions")}
            >
              <Receipt className="mr-3 h-5 w-5" />
              Transactions
            </Button>
          </nav>

          {/* AI Assistant Card */}
          <div className="mx-6 mt-8">
            <Card className="relative overflow-hidden border-2 border-secondary bg-card p-6 shadow-xl">
              <div className="absolute top-0 right-0 w-2 h-full bg-secondary opacity-30"></div>
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
            {/* Welcome Section */}
            <div className="mb-10">
              <h2 className="mb-2 text-4xl font-extrabold text-foreground">
                Welcome, Coach! 👋
              </h2>
              <p className="text-lg text-muted-foreground">
                Here's what's happening with your sessions today
              </p>
            </div>

            {/* Stats Cards - From Wireframe */}
            <div className="mb-10 grid gap-6 md:grid-cols-3">
              <Card className="group relative overflow-hidden border-2 border-warning/30 bg-card p-8 transition-all hover:shadow-2xl hover:-translate-y-1">
                <div className="absolute top-0 left-0 w-2 h-full bg-warning"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm font-medium text-muted-foreground">Pending Approvals</p>
                    <p className="text-5xl font-extrabold text-foreground">{stats.pending}</p>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent shadow-lg border-2 border-warning/30">
                    <Clock className="h-8 w-8 text-warning" />
                  </div>
                </div>
              </Card>

              <Card className="group relative overflow-hidden border-2 border-secondary/30 bg-card p-8 transition-all hover:shadow-2xl hover:-translate-y-1">
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
                    <p className="mb-1 text-sm font-medium text-muted-foreground">Reschedules</p>
                    <p className="text-5xl font-extrabold text-foreground">{stats.reschedules}</p>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent shadow-lg border-2 border-primary/30">
                    <CalendarDays className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Today's Sessions */}
            <div className="mb-10">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-3xl font-bold text-foreground">Today's Sessions</h3>
                <Button variant="ghost" className="gap-2 hover:bg-primary/10">
                  View All
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                {todaySessions.map((session) => (
                  <Card key={session.id} className="group overflow-hidden border-2 border-border bg-card p-6 transition-all hover:border-secondary hover:shadow-xl hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl bg-accent shadow-lg border-2 border-primary/30">
                          <span className="text-xs font-medium text-muted-foreground">Today</span>
                          <span className="text-xl font-bold text-primary">{session.time}</span>
                        </div>
                        
                        <div>
                          <div className="mb-2 flex items-center gap-3">
                            <p className="text-xl font-bold text-foreground">{session.athlete}</p>
                            {getStatusBadge(session.status)}
                          </div>
                          <p className="mb-2 text-sm font-medium text-muted-foreground">{session.sport}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{session.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button className="bg-primary text-foreground shadow-lg hover:bg-primary-hover hover:shadow-xl transition-all">
                        View Details
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Upcoming Bookings */}
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-3xl font-bold text-foreground">Upcoming Bookings</h3>
                <Button variant="ghost" className="gap-2 hover:bg-primary/10">
                  View All
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <Card key={booking.id} className="group overflow-hidden border-2 border-border bg-card p-6 transition-all hover:border-secondary hover:shadow-xl hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl bg-accent shadow-lg border-2 border-muted/50">
                          <span className="text-xs font-medium text-muted-foreground">{booking.date}</span>
                          <span className="text-lg font-bold text-foreground">{booking.time}</span>
                        </div>
                        
                        <div>
                          <div className="mb-2 flex items-center gap-3">
                            <p className="text-xl font-bold text-foreground">{booking.athlete}</p>
                            {getStatusBadge(booking.status)}
                          </div>
                          <p className="mb-2 text-sm font-medium text-muted-foreground">{booking.sport}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{booking.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="outline" className="border-2 border-primary/30 hover:bg-primary hover:text-foreground transition-all">
                        {booking.status === "pending" ? "Review" : "View"}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* AI Assistant Floating */}
      {showAI && <AIAssistant onClose={() => setShowAI(false)} />}

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 border-t-2 border-border bg-card md:hidden shadow-2xl">
        <div className="flex items-center justify-around p-4">
          <Button
            variant={activeTab === "home" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("home")}
            className={activeTab === "home" ? "bg-primary text-foreground" : ""}
          >
            <Home className="h-5 w-5" />
          </Button>
          <Button
            variant={activeTab === "bookings" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("bookings")}
            className={activeTab === "bookings" ? "bg-primary text-foreground" : ""}
          >
            <CalendarDays className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAI(!showAI)}
            className="relative"
          >
            <MessageSquare className="h-5 w-5 text-secondary" />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-secondary animate-pulse" />
          </Button>
          <Button
            variant={activeTab === "transactions" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("transactions")}
            className={activeTab === "transactions" ? "bg-primary text-foreground" : ""}
          >
            <Receipt className="h-5 w-5" />
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
