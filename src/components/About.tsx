import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { FeaturesSectionWithBentoGrid } from "@/components/ui/feature-section-with-bento-grid";

const DEFAULT_VIDEO_SRC = "https://videos.pexels.com/video-files/30333849/13003128_2560_1440_25fps.mp4";

export default function About() {
  return (
    <section id="about" className="py-16 md:py-28 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Bento Grid Feature Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
        >
          <FeaturesSectionWithBentoGrid
            title="Design Journey, Impact & Studio Culture"
            description="5+ years of UX design across enterprise SaaS, fintech, and automotive R&D. Currently making car dashboards less terrifying at Mercedes-Benz."
            videoSrc={DEFAULT_VIDEO_SRC}
          />

          {/* CTA with the same link */}
          <div className="mt-12 sm:mt-14 flex justify-center">
            <Link 
              to="/about"
              className="inline-flex items-center gap-3.5 bg-foreground text-background px-8 md:px-9 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-brand-primary hover:text-white transition-all shadow-xs hover:shadow-sm active:translate-y-px outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 group"
            >
              Full Story & Journey
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
