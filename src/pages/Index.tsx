import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Calendar, Wallet, Bell, ArrowRight, Shield, Zap, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Premium Header */}
      <header className="absolute top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow shadow-lg">
                <Calendar className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">MatchUp</h1>
                <p className="text-xs text-muted-foreground">Para sa Pinoy Coaches</p>
              </div>
            </div>
            
            <Button 
              variant="outline"
              className="border-primary/20 hover:bg-primary hover:text-primary-foreground"
              onClick={() => navigate("/dashboard")}
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-secondary/20 blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[128px]" />
        
        <div className="container relative mx-auto px-4 py-12 md:py-20">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-5 py-2 text-sm font-semibold text-foreground backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-secondary" />
              Eksklusibo para sa Filipino Coaches
            </div>
            
            <h1 className="mb-8 text-5xl font-extrabold tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Tigilan ang
              <span className="gradient-text"> takbo sa bayad.</span>
              <br />
              Simulan ang
              <span className="gradient-text"> tunay na coaching.</span>
            </h1>
            
            <p className="mb-10 text-xl text-muted-foreground md:text-2xl font-light leading-relaxed">
              Ang una at tanging booking platform na ginawa para sa Pinoy coaches.
              <br />
              <span className="font-medium text-foreground">GCash. Maya. Smart Calendar. AI Assistant.</span> Lahat nandito na.
            </p>
            
            <div className="flex flex-col gap-5 sm:flex-row sm:justify-center">
              <Button 
                size="lg" 
                className="h-16 px-10 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all bg-gradient-to-r from-primary to-primary-glow"
                onClick={() => navigate("/dashboard")}
              >
                Simulan Nang Libre
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="h-16 px-10 text-lg font-semibold border-2 border-primary/20 hover:bg-primary/5"
              >
                Panoorin ang Demo
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-success" />
                <span className="font-medium">100% Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-secondary" />
                <span className="font-medium">Instant Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="font-medium">500+ Active Coaches</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="relative bg-card/50 backdrop-blur-sm py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-20">
            <h2 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
              Mahirap na mag-coach.
              <br />
              <span className="text-muted-foreground font-light">Huwag nang pahirapan pa ang admin.</span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="group relative overflow-hidden border-2 border-border/50 p-8 transition-all duration-500 hover:border-primary hover:shadow-xl hover:-translate-y-2 bg-card">
              <div className="absolute top-0 right-0 h-32 w-32 bg-destructive/10 rounded-full blur-3xl transition-all duration-500 group-hover:scale-150" />
              <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-destructive/20 to-destructive/10 shadow-lg">
                <Calendar className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-card-foreground">Manual na Kalat</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Pagod ka na sa tawag, chat threads, at spreadsheets na nagreresulta sa double bookings at last-minute cancellations.
              </p>
              <blockquote className="border-l-4 border-destructive/30 pl-4 text-sm italic text-muted-foreground">
                "Through calls and texts... multiple clients want the same schedule." — Coach Aging
              </blockquote>
            </Card>

            <Card className="group relative overflow-hidden border-2 border-border/50 p-8 transition-all duration-500 hover:border-secondary hover:shadow-xl hover:-translate-y-2 bg-card">
              <div className="absolute top-0 right-0 h-32 w-32 bg-warning/10 rounded-full blur-3xl transition-all duration-500 group-hover:scale-150" />
              <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-warning/20 to-warning/10 shadow-lg">
                <Wallet className="h-8 w-8 text-warning" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-card-foreground">Sakit ng Ulo sa Bayad</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Cash at GCash payments na nakakalimutan, nalate, o nawawala. Walang deposit kaya puro no-show.
              </p>
              <blockquote className="border-l-4 border-warning/30 pl-4 text-sm italic text-muted-foreground">
                "When they don't pay, I lose money because I also have assistant coaches." — Coach Andrew
              </blockquote>
            </Card>

            <Card className="group relative overflow-hidden border-2 border-border/50 p-8 transition-all duration-500 hover:border-accent hover:shadow-xl hover:-translate-y-2 bg-card">
              <div className="absolute top-0 right-0 h-32 w-32 bg-accent/10 rounded-full blur-3xl transition-all duration-500 group-hover:scale-150" />
              <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 shadow-lg">
                <Bell className="h-8 w-8 text-accent" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-card-foreground">Sirang Tiwala</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Miscommunication at schedule conflicts na sumisira ng relationships at nag-aaksaya ng oras mo.
              </p>
              <blockquote className="border-l-4 border-accent/30 pl-4 text-sm italic text-muted-foreground">
                "Cancellations from miscommunication... Schedule clashes..." — Coach Pancho
              </blockquote>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-20">
            <h2 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
              Ginawa para sa <span className="gradient-text">ikaw</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Bawat feature ay dinisenyo para sa PH payments, coaching policies, at Filipino sports culture
            </p>
          </div>

          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <div className="space-y-8">
              <div className="group flex gap-6 p-6 rounded-2xl transition-all hover:bg-success/5 hover:shadow-lg">
                <div className="flex-shrink-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-success/20 to-success/10 shadow-lg group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="h-7 w-7 text-success" />
                  </div>
                </div>
                <div>
                  <h3 className="mb-3 text-2xl font-bold text-foreground">Smart Calendar</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Isang calendar para sa lahat. Mga athletes ay mag-book through your link—goodbye chat apps at spreadsheets.
                  </p>
                </div>
              </div>

              <div className="group flex gap-6 p-6 rounded-2xl transition-all hover:bg-primary/5 hover:shadow-lg">
                <div className="flex-shrink-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="h-7 w-7 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="mb-3 text-2xl font-bold text-foreground">Deposit-Backed Bookings</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Set your policies once. Bawat booking ay may payment via GCash, Maya, o cash tracking—zero no-shows.
                  </p>
                </div>
              </div>

              <div className="group flex gap-6 p-6 rounded-2xl transition-all hover:bg-secondary/5 hover:shadow-lg">
                <div className="flex-shrink-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 shadow-lg group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="h-7 w-7 text-secondary" />
                  </div>
                </div>
                <div>
                  <h3 className="mb-3 text-2xl font-bold text-foreground">AI Assistant</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Automatic reminders, payment nudges, at receipt logging. Ang virtual admin mo na hindi natutulog.
                  </p>
                </div>
              </div>

              <div className="group flex gap-6 p-6 rounded-2xl transition-all hover:bg-accent/5 hover:shadow-lg">
                <div className="flex-shrink-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 shadow-lg group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="h-7 w-7 text-accent" />
                  </div>
                </div>
                <div>
                  <h3 className="mb-3 text-2xl font-bold text-foreground">Para sa PH Payments</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    GCash at Maya integration with cash workflow tracking. Gumagana sa tunay na paraan ng pagbabayad ng Pinoy.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <Card className="relative w-full max-w-md overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-card to-card/80 p-10 shadow-2xl backdrop-blur-sm">
                <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-secondary/20 blur-3xl" />
                <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
                
                <div className="relative">
                  <div className="mb-8 text-center">
                    <div className="mb-3 inline-block rounded-full bg-secondary/20 px-4 py-1 text-sm font-semibold text-secondary">
                      Premium
                    </div>
                    <div className="mb-2 flex items-baseline justify-center gap-2">
                      <span className="text-5xl font-extrabold text-primary">₱399</span>
                      <span className="text-muted-foreground">/buwan</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Walang hidden fees</p>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-6 w-6 text-success flex-shrink-0" />
                      <span className="font-medium">Unlimited bookings</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-6 w-6 text-success flex-shrink-0" />
                      <span className="font-medium">GCash & Maya integration</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-6 w-6 text-success flex-shrink-0" />
                      <span className="font-medium">AI reminders & tracking</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-6 w-6 text-success flex-shrink-0" />
                      <span className="font-medium">Custom booking policies</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-6 w-6 text-success flex-shrink-0" />
                      <span className="font-medium">Priority support (Tagalog)</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full h-14 text-lg font-semibold shadow-lg bg-gradient-to-r from-primary to-primary-glow hover:shadow-xl" 
                    size="lg" 
                    onClick={() => navigate("/dashboard")}
                  >
                    Subukan Nang Libre
                  </Button>
                  
                  <p className="mt-6 text-center text-sm text-muted-foreground">
                    O gamitin ang <span className="font-semibold text-foreground">freemium tier</span> forever
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary via-primary-glow to-accent py-24">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="container relative mx-auto px-4 text-center">
          <h2 className="mb-6 text-4xl font-extrabold text-primary-foreground md:text-5xl">
            Sumali sa Top Coaches ng Metro Manila
          </h2>
          <p className="mb-10 text-xl text-primary-foreground/90 font-light leading-relaxed">
            Basketball, Tennis, Golf, Badminton, at S&C coaches ay nag-sesave na ng 10+ oras kada linggo
          </p>
          <Button 
            size="lg" 
            className="h-16 px-10 text-lg font-semibold bg-secondary text-secondary-foreground shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            onClick={() => navigate("/dashboard")}
          >
            Simulan Nang Libre
            <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow">
              <Calendar className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground">MatchUp</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Ginawa ng Pinoy coaches, para sa Pinoy coaches
          </p>
          <p className="text-xs text-muted-foreground">
            © 2025 MatchUp. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
