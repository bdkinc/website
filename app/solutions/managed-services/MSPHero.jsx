"use client";

import PageHeading from "@/components/PageHeading";
import { cn } from "@/components/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { forwardRef } from "react";

const words = [
  "Helpdesk",
  "Patching",
  "Monitoring",
  "Remote",
  "On-site",
  "Proactive",
  "Anti-virus",
  "Backups",
  "Ransomware",
  "Email",
  "Security",
  "Protection",
  "High Availability",
  "Disaster Recovery",
];

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const Hero = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "hero heropattern-circuitboard-slate-100 dark:heropattern-circuitboard-slate-800 border-2 border-slate-100 dark:border-slate-800 overflow-hidden",
        className,
      )}
      {...props}
    >
      <div className="container h-[480px] relative">
        <motion.div
          className="absolute -top-24 right-0 w-3/4"
          initial={{ translateX: "100em", opacity: 0, filter: "blur(20px)" }}
          animate={{ translateX: "0", opacity: 1, filter: "blur(0px)" }}
        >
          <Image
            src={"/img/pacifica.jpg"}
            width={2048}
            height={1020}
            alt="BDK, inc. Company Photo"
            priority
          />
        </motion.div>
        {words.map((word, index) => (
          <motion.div
            className="absolute font-bold text-bdk-blue-darker dark:text-bdk-blue drop-shadow"
            animate={{
              top: [
                ...Array.from(
                  { length: 30 },
                  () => `${randomIntFromInterval(10, 90)}%`,
                ),
              ],
              left: [
                ...Array.from(
                  { length: 30 },
                  () => `${randomIntFromInterval(0, 90)}%`,
                ),
              ],
              fontSize: [
                ...Array.from(
                  { length: 30 },
                  () => `${randomIntFromInterval(24, 64)}px`,
                ),
              ],
            }}
            transition={{
              duration: 200,
              times: [
                Array.from({ length: 30 }, () => randomIntFromInterval(20, 30)),
              ],
              repeat: Infinity,
              repeatDelay: 0,
            }}
          >
            <motion.div
              className="whitespace-nowrap"
              initial={{ opacity: 0, filter: "blur(20px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.4 * index, duration: 0.8 }}
            >
              {word}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

export default Hero;
