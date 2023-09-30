"use client";

import CheckCircle from "@/components/CheckCircle";
import { motion } from "framer-motion";
import { FaImage } from "react-icons/fa";

const bullets = [
  {
    title: "IBM Power Systems Expertise",
    detail:
      "We're IBM Power Systems experts, including the IBMi\n" +
      "(aka AS/400) and Linux. While many service providers\n" +
      "are windows shops and only have experience running\n" +
      "Windows, BDK does not believe in one operating\n" +
      "system to rule them all.",
  },
  {
    title: "Vendor Neutral",
    detail:
      "We don't believe in vendor lock in. Do you like Lenovo,\n" +
      "Dell, HP, Mac? Great! We are comfortable with all of\n" +
      "those. Do you want to keep your Power servers?\n" +
      "Awesome! We do too! Our goal is to keep the tools\n" +
      "which you are familiar and the brands you trust.",
  },
  {
    title: "Family-Owned Focused on Relationships",
    detail:
      "As a family-owned and run business, we know the\n" +
      "deep value of relationships and strive to develop true\n" +
      "partnerships with our customers. We want to know\n" +
      "your business, so we can help you grow. We want you\n" +
      "to be able to focus on running your business, and trust\n" +
      "us to handle the IT for you.",
  },
  {
    title: "Partnerships",
    detail:
      "We know where our expertise lies and when it is\n" +
      "important to team up with other businesses that\n" +
      "specialize where needed.",
  },
];

export default function SectionWhyBDK() {
  return (
    <section id="why-bdk" className="py-16">
      <div className="container flex items-center gap-16">
        <div className="w-1/2">
          <div className="w-full h-64 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-900 flex items-center justify-center text-slate-200 dark:text-slate-900">
            <FaImage />
          </div>
        </div>
        <div className="w-1/2">
          <h4 className="text-5xl font-semibold leading-loose mb-4 dark:text-bdk-blue-lighter">
            Why BDK, Inc.?
          </h4>
          <motion.div
            className="flex flex-col gap-y-4"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.3 } },
            }}
            initial={"hidden"}
            whileInView={"show"}
            viewport={{ once: true }}
          >
            {bullets.map((bullet) => (
              <motion.div
                variants={{
                  hidden: { opacity: 0, scale: 0.9, translateX: "4rem" },
                  show: { opacity: 1, scale: 1, translateX: "0" },
                }}
                transition={{ duration: 0.7 }}
                className="flex gap-4"
                key={bullet.title}
              >
                <div className="pt-2 w-12 h-12">
                  <CheckCircle />
                </div>
                <div>
                  <div className="font-heading text-xl font-semibold">
                    {bullet.title}
                  </div>
                  <p>{bullet.detail}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
