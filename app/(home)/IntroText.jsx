"use client";

import CarouselMarquee from "@/app/(home)/CarouselMarquee";
import { motion } from "framer-motion";

export default function IntroText() {
  return (
    <div className="py-2">
      <div className="mb-12 relative">
        <motion.div
          initial={{ scale: 1.1, opacity: 0, filter: "blur(20px)" }}
          animate={{ scale: 1, opacity: 100, filter: "blur(0px)" }}
          transition={{ duration: 0.4 }}
          className="text-3xl leading-relaxed"
        >
          Your trusted ally for
        </motion.div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0, filter: "blur(20px)" }}
          animate={{ scale: 1, opacity: 100, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="font-heading text-6xl font-bold text-bdk-blue uppercase"
        >
          All Things IT
        </motion.div>
        <motion.div
          initial={{ opacity: 0, filter: "blur(20px)" }}
          animate={{ opacity: 100, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="text-xl mb-6"
        >
          We focus on your IT needs so you can focus on the rest.
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
          animate={{ opacity: 100, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 1.2 }}
          className="text-2xl"
        >
          <CarouselMarquee />
        </motion.div>
      </div>
    </div>
  );
}
