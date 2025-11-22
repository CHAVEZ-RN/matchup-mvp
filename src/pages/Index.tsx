import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Calendar, Dumbbell, Trophy, Target, Zap, ArrowRight, Star, Users, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const programs = [
    {
      icon: Dumbbell,
      title: "Strength Training",
      description: "Build muscle, increase strength, and transform your physique with personalized resistance programs.",
      duration: "12 weeks"
    },
    {
      icon: Zap,
      title: "HIIT & Conditioning",
      description: "High-intensity workouts designed to burn fat, boost metabolism, and improve cardiovascular health.",
      duration: "8 weeks"
    },
    {
      icon: Target,
      title: "Goal-Specific Coaching",
      description: "Customized training plans tailored to your unique goals—whether it's weight loss, athletic performance, or overall wellness.",
      duration: "Flexible"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marathon Runner",
      content: "This coaching transformed my training completely. I shaved 20 minutes off my marathon time!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Busy Professional",
      content: "Finally found a program that fits my schedule. Lost 30 lbs and gained confidence.",
      rating: 5
    },
    {
      name: "Emma Williams",
      role: "Athlete",
      content: "The personalized approach made all the difference. Best investment in my fitness journey.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-dark">
                <Dumbbell className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">FitCoach Pro</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#programs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Programs
              </a>
              <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Reviews
              </a>
              <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
            
            <Button 
              onClick={() => navigate("/dashboard")}
              className="bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg transition-all"
            >
              Book Session
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-accent via-accent/95 to-primary-dark">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute top-1/4 right-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[128px]" />
        <div className="absolute bottom-1/4 left-1/4 h-96 w-96 rounded-full bg-secondary/20 blur-[128px]" />
        
        <div className="container relative mx-auto px-4 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-2 text-sm font-semibold text-secondary backdrop-blur-sm">
              <Trophy className="h-4 w-4" />
              Certified Personal Training
            </div>
            
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white md:text-6xl lg:text-7xl">
              Transform Your Body.
              <br />
              <span className="bg-gradient-to-r from-secondary to-yellow-300 bg-clip-text text-transparent">
                Elevate Your Life.
              </span>
            </h1>
            
            <p className="mb-10 text-xl text-white/80 md:text-2xl leading-relaxed">
              Expert coaching tailored to your goals. Build strength, lose weight, and achieve peak performance with personalized training programs designed for results.
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button 
                size="lg" 
                className="h-14 px-8 text-lg font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-xl hover:shadow-2xl transition-all pulse-glow"
                onClick={() => navigate("/dashboard")}
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="h-14 px-8 text-lg font-semibold border-2 border-white/20 text-white hover:bg-white/10"
              >
                View Programs
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 text-white">
              <div>
                <div className="mb-2 text-4xl font-bold text-secondary">500+</div>
                <div className="text-sm text-white/70">Clients Trained</div>
              </div>
              <div>
                <div className="mb-2 text-4xl font-bold text-secondary">15+</div>
                <div className="text-sm text-white/70">Years Experience</div>
              </div>
              <div>
                <div className="mb-2 text-4xl font-bold text-secondary">98%</div>
                <div className="text-sm text-white/70">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
              Coaching Programs
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose a program designed to help you reach your fitness goals faster
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {programs.map((program, index) => {
              const Icon = program.icon;
              return (
                <Card key={index} className="group relative overflow-hidden border-2 border-border p-8 transition-all duration-300 hover:border-primary hover:shadow-xl hover:-translate-y-2 bg-card">
                  <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition-all group-hover:scale-150" />
                  <div className="relative">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 group-hover:scale-110 transition-transform">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-card-foreground">{program.title}</h3>
                    <p className="mb-6 text-muted-foreground leading-relaxed">{program.description}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{program.duration}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Button 
              size="lg"
              onClick={() => navigate("/dashboard")}
              className="bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg transition-all"
            >
              Schedule Free Consultation
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-primary-dark to-accent">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Ready to Get Started?
            </h2>
            <p className="mb-10 text-xl text-white/80 leading-relaxed">
              Book your first session today and take the first step towards achieving your fitness goals. No commitment required.
            </p>
            <Button 
              size="lg" 
              className="h-16 px-10 text-lg font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-xl hover:shadow-2xl transition-all pulse-glow"
              onClick={() => navigate("/dashboard")}
            >
              Book Your Session Now
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
              Client Success Stories
            </h2>
            <p className="text-lg text-muted-foreground">
              Real results from real people who transformed their lives
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2 border-border p-8 bg-card hover:shadow-lg transition-shadow">
                <div className="mb-4 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="mb-6 text-muted-foreground italic leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t bg-accent text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <Dumbbell className="h-6 w-6 text-secondary-foreground" />
                </div>
                <span className="text-2xl font-bold">FitCoach Pro</span>
              </div>
              <p className="text-white/70 mb-6 leading-relaxed">
                Transform your fitness journey with expert coaching, personalized programs, and unwavering support.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
              <ul className="space-y-2 text-white/70">
                <li><a href="#programs" className="hover:text-secondary transition-colors">Programs</a></li>
                <li><a href="#testimonials" className="hover:text-secondary transition-colors">Testimonials</a></li>
                <li><a href="#contact" className="hover:text-secondary transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Contact</h3>
              <ul className="space-y-2 text-white/70">
                <li>Email: coach@fitcoachpro.com</li>
                <li>Phone: (555) 123-4567</li>
                <li>Location: New York, NY</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/50 text-sm">
            <p>© 2025 FitCoach Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
