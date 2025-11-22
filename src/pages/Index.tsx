import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Calendar, Wallet, MessageSquare, Trophy, Target, ArrowRight, Star, Users, Shield, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const painPoints = [
    {
      icon: Calendar,
      title: "Manual na Kalat",
      description: "Coaches juggle calls, chat apps, and spreadsheets—resulting in double bookings and last-minute cancellations.",
      quote: "Through calls and texts... multiple clients want the same schedule.",
      author: "Coach Aging"
    },
    {
      icon: Wallet,
      title: "Payment Headaches",
      description: "Cash and GCash payments get missed, delayed, or stolen. No deposits mean constant no-shows.",
      quote: "When they don't pay, I lose money because I also have assistant coaches.",
      author: "Coach Andrew"
    },
    {
      icon: MessageSquare,
      title: "Broken Communication",
      description: "Miscommunication and schedule clashes damage relationships and waste your valuable time.",
      quote: "Cancellations from miscommunication... Schedule clashes...",
      author: "Coach Pancho"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Premium Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark shadow-lg">
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
              Built for Filipino Coaches • With AI Assistant
            </div>
            
            <h1 className="mb-8 text-5xl font-extrabold tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Tigilan ang takbo sa bayad.
              <br />
              <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                Simulan ang tunay na coaching.
              </span>
            </h1>
            
            <p className="mb-10 text-xl text-muted-foreground md:text-2xl font-light leading-relaxed">
              Smart calendar + deposit-backed bookings + AI assistant para sa GCash, Maya, at cash.
              <br />
              <span className="font-medium text-foreground">Lahat nandito na. No more SMS. No more spreadsheets.</span>
            </p>
            
            <div className="flex flex-col gap-5 sm:flex-row sm:justify-center">
              <Button 
                size="lg" 
                className="h-16 px-10 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all bg-gradient-to-r from-primary to-primary-dark pulse-glow"
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
                <MessageSquare className="h-5 w-5 text-secondary" />
                <span className="font-medium">AI Assistant Included</span>
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
              Coaches lose 10+ hours weekly
              <br />
              <span className="text-muted-foreground font-light">chasing schedules and payments</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              50% of Metro Manila coaches spend more time on admin than actual coaching
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {painPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <Card key={index} className="group relative overflow-hidden border-2 border-border/50 p-8 transition-all duration-500 hover:border-primary hover:shadow-xl hover:-translate-y-2 bg-card">
                  <div className="absolute top-0 right-0 h-32 w-32 bg-primary/10 rounded-full blur-3xl transition-all duration-500 group-hover:scale-150" />
                  <div className="relative">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-card-foreground">{point.title}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">{point.description}</p>
                    <blockquote className="border-l-4 border-primary/30 pl-4 text-sm italic text-muted-foreground">
                      "{point.quote}" — {point.author}
                    </blockquote>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Solution Section with AI */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-20">
            <h2 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
              Ginawa para sa <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Filipino Coaches</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Every feature built around PH payments, coach policies, and Filipino sports culture
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="group flex gap-6 p-6 rounded-2xl transition-all hover:bg-success/5 hover:shadow-lg">
                <div className="flex-shrink-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-success/20 to-success/10 shadow-lg group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="h-7 w-7 text-success" />
                  </div>
                </div>
                <div>
                  <h3 className="mb-3 text-2xl font-bold text-foreground">Smart Calendar</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    One calendar for everything. Athletes book through your link—goodbye chat apps and spreadsheets.
                  </p>
                </div>
              </div>

              <div className="group flex gap-6 p-6 rounded-2xl transition-all hover:bg-primary/5 hover:shadow-lg">
                <div className="flex-shrink-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg group-hover:scale-110 transition-transform">
                    <Wallet className="h-7 w-7 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="mb-3 text-2xl font-bold text-foreground">Deposit-Backed Bookings</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Set policies once. Every booking includes GCash, Maya, or cash tracking—zero no-shows guaranteed.
                  </p>
                </div>
              </div>

              <div className="group flex gap-6 p-6 rounded-2xl bg-gradient-to-br from-secondary/10 to-secondary/5 border-2 border-secondary/20 transition-all hover:shadow-xl">
                <div className="flex-shrink-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-secondary/30 to-secondary/20 shadow-lg group-hover:scale-110 transition-transform">
                    <MessageSquare className="h-7 w-7 text-secondary" />
                  </div>
                </div>
                <div>
                  <h3 className="mb-3 text-2xl font-bold text-foreground flex items-center gap-2">
                    AI Assistant
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">NEW</span>
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Athletes can chat with AI 24/7 for booking questions, payment status, and schedules—no more SMS reminders needed!
                  </p>
                </div>
              </div>

              <div className="group flex gap-6 p-6 rounded-2xl transition-all hover:bg-accent/5 hover:shadow-lg">
                <div className="flex-shrink-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 shadow-lg group-hover:scale-110 transition-transform">
                    <Trophy className="h-7 w-7 text-accent" />
                  </div>
                </div>
                <div>
                  <h3 className="mb-3 text-2xl font-bold text-foreground">Built for PH Payments</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    GCash and Maya integration plus cash workflow tracking. Works exactly how Filipinos pay.
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="flex items-center justify-center">
              <Card className="relative w-full max-w-md overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-card to-card/80 p-10 shadow-2xl backdrop-blur-sm">
                <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-secondary/20 blur-3xl" />
                <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
                
                <div className="relative">
                  <div className="mb-8 text-center">
                    <div className="mb-3 inline-block rounded-full bg-secondary/20 px-4 py-1 text-sm font-semibold text-secondary">
                      Premium + AI
                    </div>
                    <div className="mb-2 flex items-baseline justify-center gap-2">
                      <span className="text-5xl font-extrabold text-primary">₱399</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Walang hidden fees, walang surprises</p>
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
                      <span className="font-medium">24/7 AI Assistant</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-6 w-6 text-success flex-shrink-0" />
                      <span className="font-medium">Custom booking policies</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-6 w-6 text-success flex-shrink-0" />
                      <span className="font-medium">Automatic payment tracking</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-6 w-6 text-success flex-shrink-0" />
                      <span className="font-medium">Priority support (Tagalog)</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full h-14 text-lg font-semibold shadow-lg bg-gradient-to-r from-primary to-primary-dark hover:shadow-xl" 
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
      <section className="relative overflow-hidden bg-gradient-to-r from-primary via-primary-dark to-accent py-24">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="container relative mx-auto px-4 text-center">
          <h2 className="mb-6 text-4xl font-extrabold text-white md:text-5xl">
            Join 500+ Top Coaches sa Metro Manila
          </h2>
          <p className="mb-10 text-xl text-white/90 font-light leading-relaxed">
            Basketball, Tennis, Golf, Badminton, and S&C coaches save 10+ hours weekly with MatchUp
          </p>
          <Button 
            size="lg" 
            className="h-16 px-10 text-lg font-semibold bg-secondary text-secondary-foreground shadow-xl hover:shadow-2xl hover:scale-105 transition-all pulse-glow"
            onClick={() => navigate("/dashboard")}
          >
            Simulan Nang Libre
            <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-dark">
                  <Calendar className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground">MatchUp</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Ginawa ng Pinoy coaches, para sa Pinoy coaches
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="/dashboard" className="hover:text-primary transition-colors">Sign In</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-3">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Email: hello@matchup.ph</li>
                <li>Support: support@matchup.ph</li>
                <li>Metro Manila, Philippines</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2025 MatchUp. All rights reserved. Built with ❤️ for Filipino coaches.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
