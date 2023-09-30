"use client";

import Button from "@/components/Button";
import CheckCircle from "@/components/CheckCircle";
import { motion } from "framer-motion";
import Link from "next/link";

const sections = [
  {
    abbr: "MSP",
    title: "Managed Services",
    list: ["Helpdesk", "Monitoring", "Patching & AV", "Consulting"],
    bgImage: "/img/bg-helpdesk.png",
    href: "/solutions/managed-services",
  },
  {
    abbr: "CSP",
    title: "Cloud Services",
    list: ["Hosting & VOIP", "ERP & EDI", "Office 365", "Backups & DR"],
    bgImage: "/img/cloud-hosting.jpg",
    href: "/solutions/cloud-services",
  },
  {
    abbr: "DEV",
    title: "Development Services",
    list: ["Analytics", "Programming", "Development", "Reporting"],
    bgImage: "/img/bg-dev-and-analytics.png",
    href: "/solutions/development-services",
  },
];

export default function SectionSolutions() {
  return (
    <section
      id="solutions"
      className="relative py-16 border-t-4 border-b-4 overflow-hidden border-slate-100 dark:border-slate-800 after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:bg-repeat after:heropattern-circuitboard-slate-100 after:dark:heropattern-circuitboard-slate-800 after:rotate-45 after:-translate-x-[24rem] after:translate-y-[4rem]"
    >
      <div className="container flex justify-center mb-24">
        <div className="text-center relative z-10">
          <div className="prose lg:prose-lg xl:prose-xl dark:text-slate-200 mb-8">
            <motion.h3
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="font-heading dark:text-slate-100"
            >
              IT Made Simple for Your Business
            </motion.h3>
            <motion.p
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              Technology is a critical component for running a business — one
              that requires the right expertise to ensure things run
              efficiently. We partner with you to provide a full range of IT
              solutions and services to support your business needs.
            </motion.p>
          </div>
          <div className="flex gap-x-4 justify-center w-full">
            <motion.div
              initial={{ translateX: "-8rem", opacity: 0 }}
              whileInView={{ translateX: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <Button as={Link} href="/quote">
                Request a Quote &rarr;
              </Button>
            </motion.div>
            <motion.div
              initial={{ translateX: "8rem", opacity: 0 }}
              whileInView={{ translateX: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <Button as={Link} href="/solutions">
                See our Solutions &rarr;
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
      <motion.div
        className="container flex gap-x-16 px-8 relative z-50"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.3 } },
        }}
        initial={"hidden"}
        whileInView={"show"}
        viewport={{ once: true }}
      >
        {sections.map((section, index) => (
          <motion.div
            className="w-1/3 z-50"
            key={section.abbr}
            variants={{
              hidden: { scale: 0.9, translateX: "4rem" },
              show: { scale: 1, translateX: "0" },
            }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href={section.href}
              className={`p-8 border-2 bg-white dark:bg-slate-900 border-bdk-blue transition inline-block w-full hover:scale-105 ${
                index !== 0
                  ? "shadow-[2rem_2rem_rgba(30,41,59,1)] dark:shadow-[2rem_2rem_rgba(79,151,209,1)]"
                  : ""
              }`}
            >
              <div>
                <h3 className="font-heading text-6xl font-bold">
                  {section.abbr}
                </h3>
                <h4 className="text-2xl text-bdk-blue-light font-semibold">
                  {section.title}
                </h4>
                <div className="flex flex-col gap-3 py-6">
                  {section.list.map((text) => (
                    <div className="flex items-center" key={text}>
                      <CheckCircle />
                      <div className="text-2xl ml-4">{text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
