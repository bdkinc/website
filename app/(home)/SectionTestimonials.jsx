"use client";

import { motion } from "framer-motion";

const testimonies = [
  {
    name: "Stacey",
    comment:
      "We have a very small business and BDK\n" +
      "has provided us an excellent level of\n" +
      "service. Very pleased with how\n" +
      "responsive they’ve been handling\n" +
      "anything we need. Good price.",
  },
  {
    name: "Jill",
    comment:
      "What a great group of people! I can be a\n" +
      "challenge to work with. I want it right, I\n" +
      "want it quick, and I always want it done\n" +
      "before I ask. My team at BDK is the best!\n" +
      "They work so well and fast to get what I\n" +
      "need done! They are also very patient\n" +
      "with me, which is also a blessing. The\n" +
      "BDK Team is awesome.",
  },
  {
    name: "Amy",
    comment:
      "It’s like having someone on staff! They\n" +
      "are always available to take our call. IF\n" +
      "they can’t make it to our location right\n" +
      "away when we call then they remote in\n" +
      "and/or walk us through what we need.",
  },
];

export default function SectionTestimonials() {
  return (
    <section
      id="testimonials"
      className="relative py-16 border-t-4 border-b-4 overflow-hidden border-slate-100 dark:border-slate-800 after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:bg-repeat after:heropattern-circuitboard-slate-100 after:dark:heropattern-circuitboard-slate-800 after:rotate-45"
    >
      <motion.div
        className="container flex gap-16"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.3 } },
        }}
        initial={"hidden"}
        whileInView={"show"}
        viewport={{ once: true }}
      >
        {testimonies.map((testimony, index) => (
          <motion.div
            className={`p-8 z-10 prose lg:prose-lg xl:prose-xl w-1/3 flex flex-col justify-between border-2 border-bdk-blue bg-white dark:bg-slate-900 ${
              index !== 0
                ? "shadow-[2rem_2rem_rgba(30,41,59,1)] dark:shadow-[2rem_2rem_rgba(79,151,209,1)]"
                : ""
            }`}
            key={testimony.name}
            variants={{
              hidden: { opacity: 0, scale: 0.9, translateX: "-4rem" },
              show: { opacity: 1, scale: 1, translateX: "0" },
            }}
            transition={{ duration: 0.7 }}
          >
            <div>
              <blockquote className="mb-4">{testimony.comment}</blockquote>
            </div>
            <div className="px-6">
              <div className="font-semibold dark:text-slate-100">
                - {testimony.name}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
