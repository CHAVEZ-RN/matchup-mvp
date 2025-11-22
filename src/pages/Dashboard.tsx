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
  ChevronRight
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
        return <Badge className="bg-success text-success-foreground">Paid</Badge>;
      case "awaiting-payment":
        return <Badge className="bg-warning text-warning-foreground">Awaiting Payment</Badge>;
      case "pending":
        return <Badge className="bg-muted text-muted-foreground">Pending</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow">
                <Calendar className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">MatchUp</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden w-64 border-r bg-card md:block">
          <nav className="space-y-2 p-4">
            <Button
              variant={activeTab === "home" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("home")}
            >
              <Home className="mr-2 h-5 w-5" />
              Home
            </Button>
            <Button
              variant={activeTab === "bookings" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("bookings")}
            >
              <CalendarDays className="mr-2 h-5 w-5" />
              Bookings
            </Button>
            <Button
              variant={activeTab === "calendar" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("calendar")}
            >
              <Calendar className="mr-2 h-5 w-5" />
              Calendar
            </Button>
            <Button
              variant={activeTab === "transactions" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("transactions")}
            >
              <Receipt className="mr-2 h-5 w-5" />
              Transactions
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-6xl">
            {/* Welcome */}
            <div className="mb-8">
              <h2 className="mb-2 text-3xl font-bold text-foreground">
                Welcome back, Coach!
              </h2>
              <p className="text-muted-foreground">
                Here's what's happening with your sessions today
              </p>
            </div>

            {/* Stats Cards */}
            <div className="mb-8 grid gap-4 md:grid-cols-3">
              <Card className="border-2 border-warning/20 bg-card p-6 transition-all hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Approvals</p>
                    <p className="text-3xl font-bold text-foreground">{stats.pending}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                    <Clock className="h-6 w-6 text-warning" />
                  </div>
                </div>
              </Card>

              <Card className="border-2 border-accent/20 bg-card p-6 transition-all hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Awaiting Payment</p>
                    <p className="text-3xl font-bold text-foreground">{stats.awaitingPayment}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                    <Wallet className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </Card>

              <Card className="border-2 border-primary/20 bg-card p-6 transition-all hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Reschedules</p>
                    <p className="text-3xl font-bold text-foreground">{stats.reschedules}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <CalendarDays className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Today's Sessions */}
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-foreground">Today's Sessions</h3>
                <Button variant="ghost" size="sm">
                  View All
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {todaySessions.map((session) => (
                  <Card key={session.id} className="border-2 bg-card p-4 transition-all hover:border-primary hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 flex-col items-center justify-center rounded-lg bg-primary/10">
                          <span className="text-xs text-muted-foreground">Today</span>
                          <span className="text-lg font-bold text-primary">{session.time}</span>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-foreground">{session.athlete}</p>
                            {getStatusBadge(session.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">{session.sport}</p>
                          <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{session.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Upcoming Bookings */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-foreground">Upcoming Bookings</h3>
                <Button variant="ghost" size="sm">
                  View All
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {upcomingBookings.map((booking) => (
                  <Card key={booking.id} className="border-2 bg-card p-4 transition-all hover:border-primary hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 flex-col items-center justify-center rounded-lg bg-muted">
                          <span className="text-xs text-muted-foreground">{booking.date}</span>
                          <span className="text-sm font-bold text-foreground">{booking.time}</span>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-foreground">{booking.athlete}</p>
                            {getStatusBadge(booking.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">{booking.sport}</p>
                          <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{booking.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm">
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
      <nav className="fixed bottom-0 left-0 right-0 border-t bg-card md:hidden">
        <div className="flex items-center justify-around p-4">
          <Button
            variant={activeTab === "home" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("home")}
          >
            <Home className="h-5 w-5" />
          </Button>
          <Button
            variant={activeTab === "bookings" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("bookings")}
          >
            <CalendarDays className="h-5 w-5" />
          </Button>
          <Button
            variant={activeTab === "calendar" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("calendar")}
          >
            <Calendar className="h-5 w-5" />
          </Button>
          <Button
            variant={activeTab === "transactions" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("transactions")}
          >
            <Receipt className="h-5 w-5" />
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
