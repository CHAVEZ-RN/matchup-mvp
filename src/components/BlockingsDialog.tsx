import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Ban, Trash2, CalendarDays, Plus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Blocking {
  id: string;
  coach_id: string;
  blocked_date: string;
  start_time: string;
  end_time: string;
  reason: string | null;
  created_at: string;
}

interface BlockingsDialogProps {
  coachId: string;
  onBlockingsChange: () => void;
}

export const BlockingsDialog = ({ coachId, onBlockingsChange }: BlockingsDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [blockings, setBlockings] = useState<Blocking[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [reason, setReason] = useState("");
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  useEffect(() => {
    if (open) fetchBlockings();
  }, [open]);

  const fetchBlockings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("coach_blockings")
      .select("*")
      .eq("coach_id", coachId)
      .gte("blocked_date", new Date().toISOString().split("T")[0])
      .order("blocked_date", { ascending: true });

    if (error) {
      toast({ title: "Error fetching blockings", description: error.message, variant: "destructive" });
    } else {
      setBlockings(data || []);
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!selectedDate) {
      toast({ title: "Please select a date", variant: "destructive" });
      return;
    }
    if (startTime >= endTime) {
      toast({ title: "End time must be after start time", variant: "destructive" });
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("coach_blockings").insert({
      coach_id: coachId,
      blocked_date: format(selectedDate, "yyyy-MM-dd"),
      start_time: startTime,
      end_time: endTime,
      reason: reason || null,
    });

    if (error) {
      toast({ title: "Error adding blocking", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Time blocked successfully" });
      setSelectedDate(undefined);
      setStartTime("09:00");
      setEndTime("17:00");
      setReason("");
      fetchBlockings();
      onBlockingsChange();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("coach_blockings").delete().eq("id", id);
    if (error) {
      toast({ title: "Error removing blocking", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Blocking removed" });
      fetchBlockings();
      onBlockingsChange();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-2 border-destructive/30 hover:bg-destructive/10 gap-2">
          <Ban className="h-4 w-4 text-destructive" />
          Blockings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Manage Blocked Times</DialogTitle>
        </DialogHeader>

        {/* Add new blocking form */}
        <Card className="p-4 border-2 border-border space-y-4">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Blocked Time
          </h4>

          <div className="space-y-3">
            <div>
              <Label>Date</Label>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal border-2 border-border">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => { setSelectedDate(date); setDatePickerOpen(false); }}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Start Time</Label>
                <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="border-2 border-border" />
              </div>
              <div>
                <Label>End Time</Label>
                <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="border-2 border-border" />
              </div>
            </div>

            <div>
              <Label>Reason (optional)</Label>
              <Input placeholder="e.g. Personal, Holiday" value={reason} onChange={(e) => setReason(e.target.value)} className="border-2 border-border" />
            </div>

            <Button onClick={handleAdd} disabled={saving} className="w-full">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              Block Time
            </Button>
          </div>
        </Card>

        {/* Existing blockings list */}
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">Upcoming Blocked Times</h4>
          {loading ? (
            <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : blockings.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No blocked times set</p>
          ) : (
            blockings.map((b) => (
              <Card key={b.id} className="p-3 border-2 border-destructive/20 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {new Date(b.blocked_date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {b.start_time.slice(0, 5)} – {b.end_time.slice(0, 5)}
                    {b.reason && ` · ${b.reason}`}
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(b.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
