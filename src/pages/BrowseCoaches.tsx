import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trophy, MapPin, DollarSign, Star, Search, Calendar } from "lucide-react";

interface Coach {
  id: string;
  business_name: string | null;
  bio: string | null;
  years_of_experience: number | null;
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
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSport, setSelectedSport] = useState<string>("");

  useEffect(() => {
    fetchCoaches();
  }, []);

  const fetchCoaches = async () => {
    try {
      const { data, error } = await supabase
        .from('coach_profiles')
        .select(`
          *,
          profiles!inner(full_name, avatar_url)
        `)
        .eq('is_active', true);

      if (error) throw error;

      setCoaches(data || []);
    } catch (error: any) {
      console.error('Error fetching coaches:', error);
      toast({
        title: "Error",
        description: "Failed to load coaches. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const allSports = Array.from(new Set(coaches.flatMap(coach => coach.sports_offered)));

  const filteredCoaches = coaches.filter(coach => {
    const matchesSearch = 
      coach.profiles.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach.sports_offered.some(sport => sport.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSport = !selectedSport || coach.sports_offered.includes(selectedSport);

    return matchesSearch && matchesSport;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-2 border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-xl">
                <Calendar className="h-7 w-7 text-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">MatchUp</h1>
                <p className="text-xs text-muted-foreground">Browse Coaches</p>
              </div>
            </div>
            
            <Button 
              variant="outline"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="border-b-2 border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name, business, or sport..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-2"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedSport === "" ? "default" : "outline"}
                onClick={() => setSelectedSport("")}
                size="sm"
              >
                All Sports
              </Button>
              {allSports.map(sport => (
                <Button
                  key={sport}
                  variant={selectedSport === sport ? "default" : "outline"}
                  onClick={() => setSelectedSport(sport)}
                  size="sm"
                >
                  {sport}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Coaches Grid */}
      <div className="container mx-auto px-4 py-8">
        {filteredCoaches.length === 0 ? (
          <Card className="p-12 text-center border-2">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">No coaches found</h2>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCoaches.map(coach => (
              <Card 
                key={coach.id} 
                className="group overflow-hidden border-2 border-border hover:border-secondary hover:shadow-xl transition-all cursor-pointer"
                onClick={() => navigate(`/book/${coach.id}`)}
              >
                <div className="p-6">
                  {/* Avatar and Name */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {coach.profiles.avatar_url ? (
                        <img 
                          src={coach.profiles.avatar_url} 
                          alt={coach.profiles.full_name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Trophy className="h-8 w-8 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-foreground truncate">
                        {coach.profiles.full_name}
                      </h3>
                      {coach.business_name && (
                        <p className="text-sm text-muted-foreground truncate">
                          {coach.business_name}
                        </p>
                      )}
                      {coach.years_of_experience && (
                        <p className="text-sm text-muted-foreground">
                          {coach.years_of_experience} years experience
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  {coach.bio && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {coach.bio}
                    </p>
                  )}

                  {/* Sports */}
                  <div className="flex items-center gap-2 mb-3">
                    <Trophy className="h-4 w-4 text-primary flex-shrink-0" />
                    <div className="flex flex-wrap gap-1">
                      {coach.sports_offered.map((sport, idx) => (
                        <span 
                          key={idx}
                          className="text-xs bg-accent px-2 py-1 rounded-full border border-border"
                        >
                          {sport}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Locations */}
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                    <p className="text-sm text-muted-foreground truncate">
                      {coach.locations.join(', ')}
                    </p>
                  </div>

                  {/* Rate */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-secondary" />
                      <span className="text-2xl font-bold text-secondary">
                        ₱{coach.hourly_rate}
                      </span>
                      <span className="text-sm text-muted-foreground">/hour</span>
                    </div>
                    <Button 
                      size="sm"
                      className="bg-secondary text-secondary-foreground hover:bg-secondary-hover"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/book/${coach.id}`);
                      }}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseCoaches;
