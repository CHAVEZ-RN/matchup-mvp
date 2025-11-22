import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Calendar, Wallet, Bell, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              Built for Filipino Coaches
            </div>
            
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Stop Chasing Payments.
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent"> Start Coaching.</span>
            </h1>
            
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              The first booking platform designed for PH coaches. Smart calendar, deposit-backed bookings, and AI reminders—all with GCash, Maya, and cash built in.
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button 
                size="lg" 
                className="h-14 px-8 text-lg shadow-lg hover:shadow-xl transition-all"
                onClick={() => navigate("/dashboard")}
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="h-14 px-8 text-lg"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-card py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Coaching is hard enough.
              <br />
              <span className="text-muted-foreground">Managing it shouldn't be.</span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-2 p-6 transition-all hover:border-primary hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">Manual Chaos</h3>
              <p className="text-muted-foreground">
                Juggling calls, chat threads, and spreadsheets leads to double bookings and last-minute cancellations.
              </p>
              <p className="mt-4 text-sm italic text-muted-foreground">
                "Through calls and texts... multiple clients want the same schedule." - Coach Aging
              </p>
            </Card>

            <Card className="border-2 p-6 transition-all hover:border-primary hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10 text-warning">
                <Wallet className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">Payment Headaches</h3>
              <p className="text-muted-foreground">
                Cash and GCash payments get missed, delayed, or lost. No deposits mean constant no-shows.
              </p>
              <p className="mt-4 text-sm italic text-muted-foreground">
                "When they don't pay, I lose money because I also have assistant coaches." - Coach Andrew
              </p>
            </Card>

            <Card className="border-2 p-6 transition-all hover:border-primary hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <Bell className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">Broken Trust</h3>
              <p className="text-muted-foreground">
                Miscommunication and schedule clashes damage relationships and waste your time.
              </p>
              <p className="mt-4 text-sm italic text-muted-foreground">
                "Cancellations from miscommunication... Schedule clashes..." - Coach Pancho
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Built for the way <span className="text-primary">you</span> work
            </h2>
            <p className="text-lg text-muted-foreground">
              Every feature designed around PH payments, coach policies, and Filipino sports culture
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                    <CheckCircle2 className="h-6 w-6 text-success" />
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">Smart Calendar</h3>
                  <p className="text-muted-foreground">
                    One calendar that syncs everything. Athletes book through your link—no more juggling chat apps and spreadsheets.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                    <CheckCircle2 className="h-6 w-6 text-success" />
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">Deposit-Backed Bookings</h3>
                  <p className="text-muted-foreground">
                    Set your policies once. Every booking request includes payment via GCash, Maya, or cash tracking—zero no-shows.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                    <CheckCircle2 className="h-6 w-6 text-success" />
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">AI Assistant</h3>
                  <p className="text-muted-foreground">
                    Automatic reminders, payment nudges, and receipt logging. Your virtual admin that never sleeps.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                    <CheckCircle2 className="h-6 w-6 text-success" />
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">Built for PH Payments</h3>
                  <p className="text-muted-foreground">
                    GCash and Maya integration with cash workflow tracking. Works the way Filipinos actually pay.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <Card className="w-full max-w-md border-2 bg-card p-8 shadow-xl">
                <div className="mb-6 text-center">
                  <div className="mb-4 text-4xl font-bold text-primary">₱399</div>
                  <div className="text-muted-foreground">per month</div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <span>Unlimited bookings</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <span>GCash & Maya integration</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <span>AI reminders & tracking</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <span>Custom booking policies</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <span>Calendar sync</span>
                  </div>
                </div>

                <Button className="w-full" size="lg" onClick={() => navigate("/dashboard")}>
                  Start Free Trial
                </Button>
                
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Or use our freemium tier forever
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-primary-glow py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Join Metro Manila's top coaches
          </h2>
          <p className="mb-8 text-lg opacity-90">
            Basketball, Tennis, Golf, Badminton, and S&C coaches are already saving 10+ hours per week
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="h-14 px-8 text-lg shadow-lg hover:shadow-xl"
            onClick={() => navigate("/dashboard")}
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
