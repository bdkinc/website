import CheckCircle from "@/components/CheckCircle";
import { cn } from "@/components/utils";
import Link from "next/link";
import { forwardRef } from "react";

const bullets = {
  "Expert Assistance":
    "Our MSP team consists of highly skilled technicians who are\n" +
    "            well-versed in a wide range of technologies. They are equipped to\n" +
    "            handle any IT-related issue and provide expert guidance and\n" +
    "            solutions.",
  "Timely Responses":
    "We understand the importance of timely assistance. Our help desk\n" +
    "            team ensures that your requests are acknowledged promptly, and we\n" +
    "            work diligently to resolve your issues efficiently.",
  "Onsite and Remote Support Capabilities":
    "Many IT problems can be resolved remotely, saving you time, and\n" +
    "            minimizing disruption. Our help desk team utilizes secure remote\n" +
    "            access tools to diagnose and fix issues remotely, reducing the need\n" +
    "            for onsite visits. However, we can easily deploy one of our\n" +
    "            technicians onsite if needed.",
};

const SectionHelpdesk = forwardRef(({ className, ...props }, ref) => {
  return (
    <section className={cn("grid grid-cols-2 gap-16", className)}>
      <div className="shadow-bdk p-6">
        <div className="text-3xl font-bold leading-loose dark:text-bdk-blue-lightest">
          The Benefits of BDK’s Help Desk Support
        </div>
        <ul className="flex flex-col space-y-6">
          {Object.keys(bullets).map((bullet) => (
            <li key={bullet} className="flex space-x-4 items-center">
              <div>
                <CheckCircle />
              </div>
              <div>
                <div className="dark:text-bdk-blue-lightest font-bold">
                  {bullet}
                </div>
                <div>
                  <p>{bullets[bullet]}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="prose lg:prose-lg dark:text-slate-100 pt-6">
        <h4 className="leading-loose text-4xl dark:text-bdk-blue-lightest">
          Unlimited Help Desk Support
        </h4>
        <p>
          Our managed IT services team provides unlimited help desk support and
          ensures that your business has access to technical expertise whenever
          they need it. Whether it's a minor software glitch or a critical
          system failure, our responsive help desk team is just a phone call or
          email away.
        </p>
        <div className="text-2xl font-heading font-bold">Partner with BDK</div>
        <p>
          Don't let IT issues slow down your business. Our proactive approach,
          advanced monitoring, and responsive help desk team will ensure that
          your technology infrastructure remains reliable, secure, and optimized
          for peak performance.
        </p>
      </div>
    </section>
  );
});

export default SectionHelpdesk;
