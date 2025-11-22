import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Loader2, Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const SPORTS_OPTIONS = ["Basketball", "Tennis", "Volleyball", "Badminton", "Football", "Swimming", "Golf"];
const METRO_MANILA_LOCATIONS = [
  "Makati", "BGC Taguig", "Quezon City", "Mandaluyong", "Pasig", 
  "Manila", "Pasay", "Paranaque", "Las Pinas", "Muntinlupa",
  "Marikina", "San Juan", "Caloocan", "Malabon", "Navotas", "Valenzuela"
];

const CoachProfileSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [existingProfile, setExistingProfile] = useState<any>(null);

  // Form state
  const [businessName, setBusinessName] = useState("");
  const [bio, setBio] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<string[]>([""]);
  const [cancellationPolicy, setCancellationPolicy] = useState("");
  const [depositRequired, setDepositRequired] = useState(true);
  const [depositPercentage, setDepositPercentage] = useState("50");

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

    // Check if user is a coach
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (profile?.user_type !== "coach") {
      toast({
        title: "Access Denied",
        description: "This page is only for coaches.",
        variant: "destructive",
      });
      navigate("/dashboard");
      return;
    }

    // Check for existing coach profile
    const { data: coachProfile } = await supabase
      .from("coach_profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (coachProfile) {
      setExistingProfile(coachProfile);
      setBusinessName(coachProfile.business_name || "");
      setBio(coachProfile.bio || "");
      setYearsExperience(coachProfile.years_of_experience?.toString() || "");
      setHourlyRate(coachProfile.hourly_rate?.toString() || "");
      setSelectedSports(coachProfile.sports_offered || []);
      setSelectedLocations(coachProfile.locations || []);
      setCertifications(coachProfile.certifications || [""]);
      setCancellationPolicy(coachProfile.cancellation_policy || "");
      setDepositRequired(coachProfile.deposit_required);
      setDepositPercentage(coachProfile.deposit_percentage?.toString() || "50");
    }
  };

  const toggleSport = (sport: string) => {
    setSelectedSports(prev =>
      prev.includes(sport)
        ? prev.filter(s => s !== sport)
        : [...prev, sport]
    );
  };

  const toggleLocation = (location: string) => {
    setSelectedLocations(prev =>
      prev.includes(location)
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  const addCertification = () => {
    setCertifications([...certifications, ""]);
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const updateCertification = (index: number, value: string) => {
    const updated = [...certifications];
    updated[index] = value;
    setCertifications(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedSports.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one sport.",
        variant: "destructive",
      });
      return;
    }

    if (selectedLocations.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one location.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const profileData = {
        id: user.id,
        business_name: businessName,
        bio,
        years_of_experience: yearsExperience ? parseInt(yearsExperience) : null,
        certifications: certifications.filter(c => c.trim() !== ""),
        sports_offered: selectedSports,
        hourly_rate: parseFloat(hourlyRate),
        locations: selectedLocations,
        cancellation_policy: cancellationPolicy,
        deposit_required: depositRequired,
        deposit_percentage: parseInt(depositPercentage),
      };

      const { error } = existingProfile
        ? await supabase.from("coach_profiles").update(profileData).eq("id", user.id)
        : await supabase.from("coach_profiles").insert(profileData);

      if (error) throw error;

      toast({
        title: "Success!",
        description: existingProfile ? "Profile updated successfully!" : "Profile created successfully!",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-2 border-border bg-card backdrop-blur-xl sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-xl">
                <Calendar className="h-7 w-7 text-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">MatchUp</h1>
                <p className="text-xs text-muted-foreground">Coach Profile Setup</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h2 className="text-4xl font-extrabold text-foreground mb-2">
            {existingProfile ? "Update Your Profile" : "Complete Your Coach Profile"}
          </h2>
          <p className="text-lg text-muted-foreground">
            Athletes will see this information when booking sessions
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <Card className="border-2 border-border bg-card p-6">
            <h3 className="text-2xl font-bold text-foreground mb-4">Basic Information</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="businessName">Business/Coach Name</Label>
                <Input
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g., Elite Basketball Training"
                  className="border-2 border-border bg-background"
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell athletes about your coaching experience, philosophy, and achievements..."
                  rows={4}
                  className="border-2 border-border bg-background"
                />
              </div>

              <div>
                <Label htmlFor="yearsExperience">Years of Experience</Label>
                <Input
                  id="yearsExperience"
                  type="number"
                  min="0"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value)}
                  placeholder="5"
                  className="border-2 border-border bg-background"
                />
              </div>
            </div>
          </Card>

          {/* Certifications */}
          <Card className="border-2 border-border bg-card p-6">
            <h3 className="text-2xl font-bold text-foreground mb-4">Certifications</h3>
            
            <div className="space-y-3">
              {certifications.map((cert, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={cert}
                    onChange={(e) => updateCertification(index, e.target.value)}
                    placeholder="e.g., FIBA Level 2 Basketball Coach"
                    className="border-2 border-border bg-background"
                  />
                  {certifications.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeCertification(index)}
                      className="border-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addCertification}
                className="w-full border-2 border-secondary hover:bg-secondary/10"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Certification
              </Button>
            </div>
          </Card>

          {/* Sports & Rates */}
          <Card className="border-2 border-border bg-card p-6">
            <h3 className="text-2xl font-bold text-foreground mb-4">Sports & Pricing</h3>
            
            <div className="space-y-6">
              <div>
                <Label className="mb-3 block">Sports Offered *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {SPORTS_OPTIONS.map((sport) => (
                    <div
                      key={sport}
                      onClick={() => toggleSport(sport)}
                      className={`flex items-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedSports.includes(sport)
                          ? "border-secondary bg-secondary/10"
                          : "border-border hover:border-secondary/50"
                      }`}
                    >
                      <Checkbox checked={selectedSports.includes(sport)} />
                      <span className="text-sm font-medium">{sport}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="hourlyRate">Hourly Rate (₱) *</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  placeholder="1500"
                  className="border-2 border-border bg-background"
                />
                <p className="text-xs text-muted-foreground mt-1">Your rate per hour of coaching</p>
              </div>
            </div>
          </Card>

          {/* Locations */}
          <Card className="border-2 border-border bg-card p-6">
            <h3 className="text-2xl font-bold text-foreground mb-4">Service Locations *</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {METRO_MANILA_LOCATIONS.map((location) => (
                <div
                  key={location}
                  onClick={() => toggleLocation(location)}
                  className={`flex items-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedLocations.includes(location)
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Checkbox checked={selectedLocations.includes(location)} />
                  <span className="text-sm font-medium">{location}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Booking Policies */}
          <Card className="border-2 border-border bg-card p-6">
            <h3 className="text-2xl font-bold text-foreground mb-4">Booking Policies</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
                <Textarea
                  id="cancellationPolicy"
                  value={cancellationPolicy}
                  onChange={(e) => setCancellationPolicy(e.target.value)}
                  placeholder="e.g., 24-hour notice required for full refund"
                  rows={3}
                  className="border-2 border-border bg-background"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="depositRequired"
                  checked={depositRequired}
                  onCheckedChange={(checked) => setDepositRequired(checked as boolean)}
                />
                <Label htmlFor="depositRequired" className="cursor-pointer">
                  Require deposit for bookings
                </Label>
              </div>

              {depositRequired && (
                <div>
                  <Label htmlFor="depositPercentage">Deposit Percentage (%)</Label>
                  <Input
                    id="depositPercentage"
                    type="number"
                    min="1"
                    max="100"
                    value={depositPercentage}
                    onChange={(e) => setDepositPercentage(e.target.value)}
                    className="border-2 border-border bg-background"
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="flex-1 h-12 border-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-12 bg-secondary text-secondary-foreground hover:bg-secondary-hover"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>{existingProfile ? "Update Profile" : "Create Profile"}</>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CoachProfileSetup;
