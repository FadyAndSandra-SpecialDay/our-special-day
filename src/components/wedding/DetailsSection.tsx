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
    <section id="details" className="py-24 px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose/3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
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
            className="text-sm font-body text-gold uppercase tracking-[0.3em] mb-4"
          >
            {t("details.joinUs")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground mb-4"
          >
            {t("details.title")}
          </motion.h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {/* Date Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="p-8 lg:p-10 text-center shadow-soft border-gold/10 h-full bg-card/50 backdrop-blur-sm hover:shadow-glow transition-all duration-300 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
                className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors duration-300"
              >
                <Calendar className="w-8 h-8 text-gold" />
              </motion.div>
              <h3 className="text-xl lg:text-2xl font-display font-medium text-foreground mb-3">
                {t("details.theDate")}
              </h3>
              <p className="font-body text-muted-foreground text-base">{formattedDate}</p>
            </Card>
          </motion.div>

          {/* Church Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-8 lg:p-10 text-center shadow-soft border-gold/10 h-full bg-card/50 backdrop-blur-sm hover:shadow-glow transition-all duration-300 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
                className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors duration-300"
              >
                <Church className="w-8 h-8 text-gold" />
              </motion.div>
              <h3 className="text-xl lg:text-2xl font-display font-medium text-foreground mb-3">
                {t("details.churchCeremony")}
              </h3>
              <p className="font-body text-gold font-medium text-lg">{weddingConfig.church.time}</p>
              <p className="font-body text-muted-foreground text-sm mt-2">
                {t("details.churchName")}
              </p>
              <a
                href={weddingConfig.church.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-sm text-gold hover:text-gold/80 font-body transition-colors group-hover:underline"
              >
                <MapPin className="w-4 h-4" /> {t("details.viewMap")}
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
            <Card className="p-8 lg:p-10 text-center shadow-soft border-gold/10 h-full bg-card/50 backdrop-blur-sm hover:shadow-glow transition-all duration-300 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
                className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors duration-300"
              >
                <Clock className="w-8 h-8 text-gold" />
              </motion.div>
              <h3 className="text-xl lg:text-2xl font-display font-medium text-foreground mb-3">
                {t("details.reception")}
              </h3>
              <p className="font-body text-gold font-medium text-lg">{weddingConfig.venue.time}</p>
              <p className="font-body text-muted-foreground text-sm mt-2">
                {t("details.venueName")}
              </p>
              <a
                href={weddingConfig.venue.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-sm text-gold hover:text-gold/80 font-body transition-colors group-hover:underline"
              >
                <MapPin className="w-4 h-4" /> {t("details.viewMap")}
              </a>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DetailsSection;
