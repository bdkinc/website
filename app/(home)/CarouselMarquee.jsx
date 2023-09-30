"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const areas = [
  {
    title: "Experienced",
    body: "With over a century of combined experience, we have the tools, team and track record to provide world-class IT solutions to clients of any size.",
  },
  {
    title: "Trusted",
    body: "At the heart of our organization, we care about our customers. It is our goal to not only support, but propel your business toward success.",
  },
  {
    title: "Innovative",
    body: "We are not your typical IT service provider. We strive to add value to our clients, rather than aiming to drive our bottom line.",
  },
];

export default function CarouselMarquee() {
  const [selected, setSelected] = useState(areas[0]);

  useEffect(() => {
    let count = 0;

    const interval = setInterval((e) => {
      let randomNumber = Math.floor(Math.random() * 11);
      count = (count + randomNumber) % areas.length;
      setSelected(areas[count]);
    }, 11000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-24 block">
      {areas.map((area) => (
        <motion.div
          className={`absolute top-0 ${
            selected.title === area.title ? "active" : ""
          }`}
          data-active={selected.title === area.title ? "true" : "false"}
          key={area.title}
          animate={{
            opacity: selected.title === area.title ? 1 : 0,
            filter: selected.title === area.title ? "blur(0px)" : "blur(20px)",
          }}
        >
          <div className="text-3xl font-semibold leading-relaxed">
            {area.title}
          </div>
          <p>{area.body}</p>
        </motion.div>
      ))}
    </div>
  );
}
