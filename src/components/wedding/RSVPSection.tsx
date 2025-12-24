import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Check, Heart, X, Loader2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

interface GuestInfo {
  name: string;
  rowIndex: number;
}

const RSVPSection = () => {
  const { t } = useTranslation();
  const [selectedGuest, setSelectedGuest] = useState<GuestInfo | null>(null);
  const [attendance, setAttendance] = useState<"attending" | "not-attending" | "">("");
  const [searchQuery, setSearchQuery] = useState("");
  const [guests, setGuests] = useState<GuestInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  // Fetch guests from Google Sheets when search query changes
  useEffect(() => {
    const fetchGuests = async () => {
      if (searchQuery.length < 2) {
        setGuests([]);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('get-guests', {
          body: { searchQuery }
        });

        if (error) {
          console.error("Error fetching guests:", error);
          return;
        }

        setGuests(data.guests || []);
      } catch (err) {
        console.error("Failed to fetch guests:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchGuests, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedGuest || !attendance) {
      toast({
        title: t("rsvp.formIncomplete"),
        description: t("rsvp.formIncompleteMessage"),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save RSVP to Google Sheet
      const { data, error } = await supabase.functions.invoke('save-rsvp', {
        body: {
          guestName: selectedGuest.name,
          attending: attendance === "attending",
          rowIndex: selectedGuest.rowIndex,
        },
      });

      if (error || data?.success === false) {
        // Extract error message, prioritizing note (detailed error) if available
        let description = "We couldn't save your RSVP. Please try again.";
        if (data) {
          if (data.note) {
            // Show detailed error from Google Sheets API if available
            description = data.note.length > 200 
              ? `${data.note.substring(0, 200)}...` 
              : data.note;
          } else if (data.error) {
            description = data.error;
          }
        } else if (error?.message) {
          description = error.message;
        }

        toast({
          title: t("rsvp.error"),
          description,
          variant: "destructive",
        });
        return;
      }

      setIsSubmitted(true);
      toast({
        title: t("rsvp.success"),
        description: t("rsvp.successMessage"),
      });
    } catch (err) {
      console.error('Failed to save RSVP:', err);
      toast({
        title: t("rsvp.error"),
        description: t("rsvp.errorMessage"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section id="rsvp" className="py-24 px-4 bg-secondary/30 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-rose/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-sage/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-2xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-orange/20 flex items-center justify-center shadow-glow">
              <Check className="w-12 h-12 text-orange" />
            </div>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground mb-6"
          >
            {t("rsvp.success")}, {selectedGuest?.name}!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg font-body text-muted-foreground"
          >
            {t("rsvp.successMessage")}
          </motion.p>
        </div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="py-24 px-4 bg-peach/40 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-coral/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-salmon/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base md:text-lg font-body text-coral uppercase tracking-[0.3em] mb-4"
          >
            {t("rsvp.subtitle")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-display font-semibold text-burgundy mb-6"
          >
            {t("rsvp.title")}
          </motion.h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-8 lg:p-10 shadow-soft border-gold/10 bg-card/80 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Guest Search */}
              <div className="space-y-4">
                <Label className="text-base font-display">{t("rsvp.selectName")}</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={t("rsvp.searchPlaceholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="font-body pl-10"
                  />
                  {isLoading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange animate-spin" />
                  )}
                </div>

                {searchQuery.length >= 2 && guests.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg bg-card">
                    {guests.map((guest, index) => (
                      <button
                        key={`${guest.name}-${index}`}
                        type="button"
                        onClick={() => {
                          setSelectedGuest(guest);
                          setSearchQuery("");
                          setGuests([]);
                        }}
                        className={`p-3 text-left rounded-md font-body transition-colors ${
                          selectedGuest?.name === guest.name
                            ? "bg-orange/20 text-burgundy border border-orange/40"
                            : "hover:bg-muted"
                        }`}
                      >
                        {guest.name}
                      </button>
                    ))}
                  </div>
                )}

                {searchQuery.length >= 2 && !isLoading && guests.length === 0 && (
                    <p className="text-base text-burgundy/80 font-body p-4 text-center border rounded-lg">
                    {t("rsvp.noGuestsFound")}
                  </p>
                )}

                {selectedGuest && (
                  <div className="flex items-center gap-2 p-3 bg-salmon/20 rounded-lg border border-coral/30">
                    <Heart className="w-5 h-5 text-coral" />
                    <span className="font-body text-foreground">{selectedGuest.name}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedGuest(null)}
                      className="ml-auto text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Attendance Selection */}
              <div className="space-y-4">
                <Label className="text-lg font-display text-burgundy">{t("rsvp.confirmAttendance")}</Label>
                <RadioGroup
                  value={attendance}
                  onValueChange={(value) => setAttendance(value as "attending" | "not-attending")}
                  className="grid grid-cols-2 gap-4"
                >
                  <Label
                    htmlFor="attending"
                    className={`flex flex-col items-center gap-2 p-6 border-2 rounded-lg cursor-pointer transition-all ${
                      attendance === "attending"
                        ? "border-orange bg-orange/15"
                        : "border-border hover:border-coral/50"
                    }`}
                  >
                    <RadioGroupItem value="attending" id="attending" className="sr-only" />
                    <Check className={`w-10 h-10 ${attendance === "attending" ? "text-orange" : "text-muted-foreground"}`} />
                    <span className="font-display font-medium">{t("rsvp.attending")}</span>
                  </Label>
                  <Label
                    htmlFor="not-attending"
                    className={`flex flex-col items-center gap-2 p-6 border-2 rounded-lg cursor-pointer transition-all ${
                      attendance === "not-attending"
                        ? "border-burgundy bg-burgundy/15"
                        : "border-border hover:border-burgundy/50"
                    }`}
                  >
                    <RadioGroupItem value="not-attending" id="not-attending" className="sr-only" />
                    <X className={`w-10 h-10 ${attendance === "not-attending" ? "text-burgundy" : "text-muted-foreground"}`} />
                    <span className="font-display font-medium">{t("rsvp.notAttending")}</span>
                  </Label>
                </RadioGroup>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !selectedGuest || !attendance}
                className="w-full py-6 text-xl font-display bg-orange hover:bg-orange/90 text-white shadow-lg"
              >
                {isSubmitting ? t("rsvp.submitting") : t("rsvp.submit")}
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default RSVPSection;