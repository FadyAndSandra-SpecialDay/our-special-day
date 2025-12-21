import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { weddingConfig } from "@/lib/weddingConfig";
import { MapPin, Clock, Calendar, Church } from "lucide-react";
import { useTranslation } from "react-i18next";

const DetailsSection = () => {
  const { t, i18n } = useTranslation();
  const weddingDate = new Date(weddingConfig.weddingDate);
  const formattedDate = weddingDate.toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section id="details" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-body text-gold uppercase tracking-[0.3em] mb-4">
            {t("details.joinUs")}
          </p>
          <h2 className="text-4xl md:text-5xl font-display font-semibold text-foreground mb-4">
            {t("details.title")}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Date Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="p-8 text-center shadow-soft border-gold/10 h-full">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
                <Calendar className="w-7 h-7 text-gold" />
              </div>
              <h3 className="text-xl font-display font-medium text-foreground mb-2">
                {t("details.theDate")}
              </h3>
              <p className="font-body text-muted-foreground">{formattedDate}</p>
            </Card>
          </motion.div>

          {/* Church Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-8 text-center shadow-soft border-gold/10 h-full">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
                <Church className="w-7 h-7 text-gold" />
              </div>
              <h3 className="text-xl font-display font-medium text-foreground mb-2">
                {t("details.churchCeremony")}
              </h3>
              <p className="font-body text-gold font-medium">{weddingConfig.church.time}</p>
              <p className="font-body text-muted-foreground text-sm mt-1">
                {t("details.churchName")}
              </p>
              <a
                href={weddingConfig.church.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-3 text-sm text-gold hover:underline font-body"
              >
                <MapPin className="w-3 h-3" /> {t("details.viewMap")}
              </a>
            </Card>
          </motion.div>

          {/* Venue Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="p-8 text-center shadow-soft border-gold/10 h-full">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
                <Clock className="w-7 h-7 text-gold" />
              </div>
              <h3 className="text-xl font-display font-medium text-foreground mb-2">
                {t("details.reception")}
              </h3>
              <p className="font-body text-gold font-medium">{weddingConfig.venue.time}</p>
              <p className="font-body text-muted-foreground text-sm mt-1">
                {t("details.venueName")}
              </p>
              <a
                href={weddingConfig.venue.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-3 text-sm text-gold hover:underline font-body"
              >
                <MapPin className="w-3 h-3" /> {t("details.viewMap")}
              </a>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DetailsSection;
