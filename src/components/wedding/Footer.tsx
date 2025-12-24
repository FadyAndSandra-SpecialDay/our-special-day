import { motion } from "framer-motion";
import { weddingConfig } from "@/lib/weddingConfig";
import { Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="py-20 px-4 border-t border-border/50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-salmon/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Decorative element */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-20 h-px bg-gradient-to-r from-transparent to-orange/60" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Heart className="w-8 h-8 text-orange fill-coral/40" />
            </motion.div>
            <div className="w-20 h-px bg-gradient-to-l from-transparent to-orange/60" />
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-burgundy mb-8">
            {t("hero.bride")} & {t("hero.groom")}
          </h2>

          <p className="text-xl md:text-2xl font-body text-burgundy/90 mb-12 italic max-w-2xl mx-auto">
            {t("footer.closing")}
          </p>

          <p className="text-base md:text-lg font-body text-burgundy/80 mb-4">
            {t("footer.madeWithLove")}
          </p>

          <p className="text-sm font-body text-burgundy/60 mt-6">
            FSinvitation © {new Date().getFullYear()}
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
