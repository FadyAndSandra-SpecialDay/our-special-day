import { motion } from "framer-motion";
import CountdownTimer from "./CountdownTimer";
import { weddingConfig } from "@/lib/weddingConfig";
import { Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const { t, i18n } = useTranslation();
  const weddingDate = new Date(weddingConfig.weddingDate);
  const formattedDate = weddingDate.toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden gradient-hero">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-rose/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-40 right-10 w-40 h-40 bg-salmon/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-coral/15 rounded-full blur-2xl animate-float" style={{ animationDelay: "4s" }} />
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-orange/12 rounded-full blur-2xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      {/* Ornamental border */}
      <div className="absolute inset-4 md:inset-10 border border-salmon/30 rounded-lg pointer-events-none" />
      <div className="absolute inset-6 md:inset-12 border border-coral/20 rounded-lg pointer-events-none" />
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20 pointer-events-none" />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-base md:text-lg font-body text-coral uppercase tracking-[0.3em] mb-8"
        >
          {t("hero.togetherWithFamilies")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-semibold text-burgundy leading-tight">
            {t("hero.bride")}
            <span className="inline-flex items-center mx-4 md:mx-6">
              <Heart className="w-10 h-10 md:w-14 md:h-14 text-orange fill-coral/40" />
            </span>
            {t("hero.groom")}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent to-orange/60" />
          <span className="text-orange text-xl md:text-2xl">✦</span>
          <div className="w-16 md:w-24 h-px bg-gradient-to-l from-transparent to-orange/60" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-xl md:text-2xl lg:text-3xl font-body text-burgundy/90 mb-6 max-w-2xl mx-auto italic"
        >
          {t("hero.invitation")}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-burgundy mb-10"
        >
          {formattedDate}
        </motion.p>

        {/* Bible Verse */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mb-12 max-w-2xl mx-auto"
        >
          <blockquote className="text-base md:text-lg font-body text-muted-foreground italic border-l-2 border-gold/50 pl-4 rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-4">
            "{t("hero.bibleVerse.text")}"
          </blockquote>
          <p className="text-base md:text-lg font-body text-orange mt-3">— {t("hero.bibleVerse.reference")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <p className="text-base md:text-lg font-body text-burgundy/80 uppercase tracking-widest mb-8">
            {t("hero.countingDown")}
          </p>
          <CountdownTimer targetDate={weddingConfig.weddingDate} />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-gold/30 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-gold rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
