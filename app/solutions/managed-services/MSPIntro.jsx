"use client";

import { motion } from "framer-motion";
import { forwardRef } from "react";

const MSPIntro = forwardRef(({ className, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      className="text-center pt-6"
      initial={{ opacity: 0, filter: "blur(20px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ delay: 0.7 }}
    >
      <h2 className="text-5xl font-bold font-heading dark:text-bdk-blue-lightest">
        Maximize Productivity with Limited Downtime and Unlimited Help Desk
        Support
      </h2>
      <div className="flex justify-center pt-8">
        <div className="h-2 w-64 bg-bdk-blue"></div>
      </div>
    </motion.div>
  );
});

export default MSPIntro;
