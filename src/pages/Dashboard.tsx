import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Users, 
  Wallet, 
  Bell, 
  Home,
  CalendarDays,
  Receipt,
  User,
  Clock,
  MapPin,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");

  // Mock data
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
        return <Badge className="bg-success text-success-foreground shadow-sm">Bayad Na</Badge>;
      case "awaiting-payment":
        return <Badge className="bg-warning text-warning-foreground shadow-sm">Hinihintay ang Bayad</Badge>;
      case "pending":
        return <Badge className="bg-muted text-muted-foreground shadow-sm">Pending</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Premium Header */}
      <header className="border-b border-border/40 bg-card/80 backdrop-blur-xl sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow shadow-lg">
                <Calendar className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">MatchUp</h1>
                <p className="text-xs text-muted-foreground">Coach Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative hover:bg-primary/10">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-[10px] font-bold text-accent-foreground flex items-center justify-center">
                  3
                </span>
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Premium Sidebar */}
        <aside className="hidden w-72 border-r border-border/40 bg-card/50 backdrop-blur-sm md:block">
          <nav className="space-y-2 p-6">
            <Button
              variant={activeTab === "home" ? "default" : "ghost"}
              className={`w-full justify-start h-12 text-base font-medium transition-all ${
                activeTab === "home" 
                  ? "bg-gradient-to-r from-primary to-primary-glow shadow-lg" 
                  : "hover:bg-primary/10"
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
                  ? "bg-gradient-to-r from-primary to-primary-glow shadow-lg" 
                  : "hover:bg-primary/10"
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
                  ? "bg-gradient-to-r from-primary to-primary-glow shadow-lg" 
                  : "hover:bg-primary/10"
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
                  ? "bg-gradient-to-r from-primary to-primary-glow shadow-lg" 
                  : "hover:bg-primary/10"
              }`}
              onClick={() => setActiveTab("transactions")}
            >
              <Receipt className="mr-3 h-5 w-5" />
              Transactions
            </Button>
          </nav>

          {/* Upgrade Card */}
          <div className="mx-6 mt-8">
            <Card className="relative overflow-hidden border-2 border-secondary/30 bg-gradient-to-br from-secondary/10 to-secondary/5 p-6 shadow-xl">
              <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-secondary/20 blur-2xl" />
              <div className="relative">
                <Sparkles className="mb-3 h-8 w-8 text-secondary" />
                <h3 className="mb-2 font-bold text-foreground">Upgrade to Premium</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Unlock unlimited features para sa mas maraming kita
                </p>
                <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg" size="sm">
                  Upgrade Now
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
                Mabuhay, Coach! 👋
              </h2>
              <p className="text-lg text-muted-foreground">
                Ito ang nangyayari sa iyong sessions ngayong araw
              </p>
            </div>

            {/* Premium Stats Cards */}
            <div className="mb-10 grid gap-6 md:grid-cols-3">
              <Card className="group relative overflow-hidden border-2 border-warning/30 bg-gradient-to-br from-card to-warning/5 p-8 transition-all hover:shadow-2xl hover:-translate-y-1">
                <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-warning/20 blur-2xl transition-all group-hover:scale-150" />
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm font-medium text-muted-foreground">Pending Approvals</p>
                    <p className="text-5xl font-extrabold text-foreground">{stats.pending}</p>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-warning/30 to-warning/20 shadow-lg">
                    <Clock className="h-8 w-8 text-warning" />
                  </div>
                </div>
              </Card>

              <Card className="group relative overflow-hidden border-2 border-accent/30 bg-gradient-to-br from-card to-accent/5 p-8 transition-all hover:shadow-2xl hover:-translate-y-1">
                <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-accent/20 blur-2xl transition-all group-hover:scale-150" />
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm font-medium text-muted-foreground">Hinihintay ang Bayad</p>
                    <p className="text-5xl font-extrabold text-foreground">{stats.awaitingPayment}</p>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/30 to-accent/20 shadow-lg">
                    <Wallet className="h-8 w-8 text-accent" />
                  </div>
                </div>
              </Card>

              <Card className="group relative overflow-hidden border-2 border-primary/30 bg-gradient-to-br from-card to-primary/5 p-8 transition-all hover:shadow-2xl hover:-translate-y-1">
                <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-primary/20 blur-2xl transition-all group-hover:scale-150" />
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm font-medium text-muted-foreground">Reschedules</p>
                    <p className="text-5xl font-extrabold text-foreground">{stats.reschedules}</p>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-primary/20 shadow-lg">
                    <CalendarDays className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Today's Sessions */}
            <div className="mb-10">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-3xl font-bold text-foreground">Sessions Ngayong Araw</h3>
                <Button variant="ghost" className="gap-2 hover:bg-primary/10">
                  Tingnan Lahat
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                {todaySessions.map((session) => (
                  <Card key={session.id} className="group overflow-hidden border-2 border-border/50 bg-card p-6 transition-all hover:border-primary hover:shadow-xl hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg">
                          <span className="text-xs font-medium text-muted-foreground">Ngayon</span>
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
                      
                      <Button className="bg-gradient-to-r from-primary to-primary-glow shadow-lg hover:shadow-xl transition-all">
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
                <h3 className="text-3xl font-bold text-foreground">Paparating na Bookings</h3>
                <Button variant="ghost" className="gap-2 hover:bg-primary/10">
                  Tingnan Lahat
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <Card key={booking.id} className="group overflow-hidden border-2 border-border/50 bg-card p-6 transition-all hover:border-primary hover:shadow-xl hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-muted to-muted/50 shadow-lg">
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
                      
                      <Button variant="outline" className="border-2 border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all">
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

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-border/40 bg-card/90 backdrop-blur-xl md:hidden shadow-2xl">
        <div className="flex items-center justify-around p-4">
          <Button
            variant={activeTab === "home" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("home")}
            className={activeTab === "home" ? "bg-gradient-to-r from-primary to-primary-glow" : ""}
          >
            <Home className="h-5 w-5" />
          </Button>
          <Button
            variant={activeTab === "bookings" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("bookings")}
            className={activeTab === "bookings" ? "bg-gradient-to-r from-primary to-primary-glow" : ""}
          >
            <CalendarDays className="h-5 w-5" />
          </Button>
          <Button
            variant={activeTab === "calendar" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("calendar")}
            className={activeTab === "calendar" ? "bg-gradient-to-r from-primary to-primary-glow" : ""}
          >
            <Calendar className="h-5 w-5" />
          </Button>
          <Button
            variant={activeTab === "transactions" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("transactions")}
            className={activeTab === "transactions" ? "bg-gradient-to-r from-primary to-primary-glow" : ""}
          >
            <Receipt className="h-5 w-5" />
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
