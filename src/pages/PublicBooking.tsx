import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trophy, Award, Briefcase, Send, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const PublicBooking = () => {
  const { coachId } = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [coach, setCoach] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [bookingCompleted, setBookingCompleted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchCoachDetails();
  }, [coachId]);

  const fetchCoachDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('coach_profiles')
        .select(`
          *,
          profiles!inner(full_name, phone)
        `)
        .eq('id', coachId)
        .single();

      if (error) throw error;

      setCoach(data);
      
      // Set initial greeting message
      setMessages([{
        role: "assistant",
        content: `Hello! Welcome to the booking portal for Coach ${data.profiles.full_name}${data.business_name ? ` (${data.business_name})` : ''}.\n\nI specialize in: ${data.sports_offered.join(', ')}\nAvailable locations: ${data.locations.join(', ')}\nRate: ₱${data.hourly_rate}/hour\n\nI'm here to help you book a training session! To get started, please tell me:\n1. Your full name\n2. Your phone number\n3. Which sport you'd like to train\n4. Your preferred location\n5. When you'd like to book (date and time)\n\nFeel free to share all this information at once, or we can go step by step!`
      }]);
    } catch (error) {
      console.error('Error fetching coach:', error);
      toast({
        title: "Error",
        description: "Failed to load coach details",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isSending || bookingCompleted) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const { data, error } = await supabase.functions.invoke('booking-assistant', {
        body: { 
          messages: [...messages, userMessage],
          coachId,
          sessionId
        }
      });

      if (error) throw error;

      if (data?.reply) {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
        
        if (data.bookingCreated) {
          setBookingCompleted(true);
          toast({
            title: "Booking Submitted!",
            description: `Your booking request has been sent to the coach. Reference: ${data.bookingReference}`,
          });
        }
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!coach) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 text-center border-2">
          <h2 className="text-2xl font-bold mb-2">Coach Not Found</h2>
          <p className="text-muted-foreground">The coach you're looking for doesn't exist.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Coach Info */}
      <div className="border-b-2 border-border bg-card shadow-sm">
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {coach.profiles.full_name}
              </h1>
              {coach.business_name && (
                <p className="text-lg text-muted-foreground mb-3">{coach.business_name}</p>
              )}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span>{coach.sports_offered.join(', ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <span>₱{coach.hourly_rate}/hour</span>
                </div>
                {coach.years_of_experience && (
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span>{coach.years_of_experience} years experience</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent text-foreground border border-border"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isSending && (
            <div className="flex justify-start">
              <div className="bg-accent rounded-2xl px-4 py-3 border border-border">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t-2 border-border bg-card p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={bookingCompleted ? "Booking completed!" : "Type your message..."}
              disabled={isSending || bookingCompleted}
              className="flex-1 border-2 border-border"
            />
            <Button
              onClick={handleSend}
              disabled={isSending || !input.trim() || bookingCompleted}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <p className="text-xs text-muted-foreground">
              AI-powered booking assistant • Available 24/7
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicBooking;
