import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Clock, MapPin, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Booking {
  id: string;
  sport: string;
  location: string;
  session_date: string;
  session_time: string;
  status: string;
  total_amount: number;
  athlete_name: string;
  booking_reference: string;
}

interface BookingsCalendarProps {
  bookings: Booking[];
}

export const BookingsCalendar = ({ bookings }: BookingsCalendarProps) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Get bookings for selected date
  const selectedDateBookings = bookings.filter(booking => {
    if (!selectedDate) return false;
    const bookingDate = new Date(booking.session_date);
    return bookingDate.toDateString() === selectedDate.toDateString();
  });

  // Get dates that have bookings
  const bookedDates = bookings.map(booking => new Date(booking.session_date));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success text-success-foreground";
      case "approved":
        return "bg-warning text-warning-foreground";
      case "pending":
        return "bg-muted text-muted-foreground";
      case "rejected":
        return "bg-destructive text-destructive-foreground";
      case "cancelled":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Paid";
      case "approved":
        return "Awaiting Payment";
      case "pending":
        return "Pending";
      case "rejected":
        return "Rejected";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2 items-start">
      {/* Calendar */}
      <Card className="p-6 border-2 border-border">
        <h3 className="text-2xl font-bold text-foreground mb-4">Select Date</h3>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border-2 border-border"
          modifiers={{
            booked: bookedDates,
          }}
          modifiersStyles={{
            booked: {
              fontWeight: "bold",
              backgroundColor: "hsl(var(--secondary) / 0.2)",
              color: "hsl(var(--secondary))",
            },
          }}
        />
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-4 h-4 rounded-full bg-secondary/20 border-2 border-secondary"></div>
          <span>Days with bookings</span>
        </div>
      </Card>

      {/* Bookings for Selected Date */}
      <Card className="p-6 border-2 border-border">
        <h3 className="text-2xl font-bold text-foreground mb-4">
          {selectedDate
            ? `Bookings for ${selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}`
            : "Select a date"}
        </h3>

        {selectedDateBookings.length > 0 ? (
          <div className="space-y-4">
            {selectedDateBookings.map((booking) => (
              <Card
                key={booking.id}
                className="p-4 border-2 border-border hover:border-secondary transition-all cursor-pointer"
                onClick={() => navigate(`/booking/${booking.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-foreground text-lg">{booking.sport}</h4>
                    <p className="text-sm text-muted-foreground">{booking.booking_reference}</p>
                  </div>
                  <Badge className={getStatusColor(booking.status)}>
                    {getStatusLabel(booking.status)}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{booking.athlete_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{booking.session_time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{booking.location}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-border">
                  <span className="text-lg font-bold text-foreground">₱{booking.total_amount}</span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No bookings for this date</p>
          </div>
        )}
      </Card>
    </div>
  );
};
