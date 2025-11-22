import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Calendar, MapPin, Trophy, ArrowLeft, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Coach {
  id: string;
  business_name: string | null;
  bio: string | null;
  years_of_experience: number | null;
  certifications: string[] | null;
  sports_offered: string[];
  hourly_rate: number;
  locations: string[];
  profiles: {
    full_name: string;
    avatar_url: string | null;
  };
}

const BrowseCoaches = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [filteredCoaches, setFilteredCoaches] = useState<Coach[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
    fetchCoaches();
  }, []);

  useEffect(() => {
    filterCoaches();
  }, [selectedSport, selectedLocation, coaches]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);
  };

  const fetchCoaches = async () => {
    try {
      const { data, error } = await supabase
        .from("coach_profiles")
        .select(`
          *,
          profiles:profiles(full_name, avatar_url)
        `)
        .eq("is_active", true);

      if (error) throw error;

      setCoaches(data || []);
      setFilteredCoaches(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load coaches",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterCoaches = () => {
    let filtered = coaches;

    if (selectedSport !== "all") {
      filtered = filtered.filter(coach =>
        coach.sports_offered.includes(selectedSport)
      );
    }

    if (selectedLocation !== "all") {
      filtered = filtered.filter(coach =>
        coach.locations.includes(selectedLocation)
      );
    }

    setFilteredCoaches(filtered);
  };

  const allSports = Array.from(new Set(coaches.flatMap(c => c.sports_offered))).sort();
  const allLocations = Array.from(new Set(coaches.flatMap(c => c.locations))).sort();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-2 border-border bg-card backdrop-blur-xl sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Find a Coach</h1>
                <p className="text-xs text-muted-foreground">{filteredCoaches.length} coaches available</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <Select value={selectedSport} onValueChange={setSelectedSport}>
            <SelectTrigger className="w-full sm:w-[200px] border-2 border-border">
              <SelectValue placeholder="All Sports" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              {allSports.map(sport => (
                <SelectItem key={sport} value={sport}>{sport}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-full sm:w-[200px] border-2 border-border">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {allLocations.map(location => (
                <SelectItem key={location} value={location}>{location}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Coaches Grid */}
        {filteredCoaches.length === 0 ? (
          <Card className="border-2 border-border bg-card p-12 text-center">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-2xl font-bold text-foreground mb-2">No coaches found</h3>
            <p className="text-muted-foreground">Try adjusting your filters</p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCoaches.map((coach) => (
              <Card
                key={coach.id}
                className="group border-2 border-border bg-card p-6 transition-all hover:border-secondary hover:shadow-xl hover:shadow-secondary/10 hover:-translate-y-1 cursor-pointer"
                onClick={() => navigate(`/coach/${coach.id}`)}
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    {coach.business_name || coach.profiles.full_name}
                  </h3>
                  {coach.years_of_experience && (
                    <p className="text-sm text-muted-foreground">
                      {coach.years_of_experience} years experience
                    </p>
                  )}
                </div>

                {coach.bio && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {coach.bio}
                  </p>
                )}

                <div className="mb-4 flex flex-wrap gap-2">
                  {coach.sports_offered.slice(0, 3).map((sport) => (
                    <Badge key={sport} className="bg-secondary text-secondary-foreground">
                      {sport}
                    </Badge>
                  ))}
                  {coach.sports_offered.length > 3 && (
                    <Badge variant="outline">+{coach.sports_offered.length - 3} more</Badge>
                  )}
                </div>

                <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="line-clamp-1">
                    {coach.locations.slice(0, 2).join(", ")}
                    {coach.locations.length > 2 && ` +${coach.locations.length - 2}`}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-sm text-muted-foreground">Hourly Rate</p>
                    <p className="text-2xl font-bold text-secondary">₱{coach.hourly_rate.toLocaleString()}</p>
                  </div>
                  <Button className="bg-primary text-foreground hover:bg-primary-hover">
                    View Profile
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BrowseCoaches;
