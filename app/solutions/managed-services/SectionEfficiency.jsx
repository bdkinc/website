import CheckCircle from "@/components/CheckCircle";
import { cn } from "@/components/utils";
import { forwardRef } from "react";

const bullets = {
  "System Monitoring":
    "Our advanced monitoring tools keep a vigilant eye on your network, servers and devices, detecting any anomalies or performance issues.",
  "Proactive Maintenance":
    "We take a proactive approach to IT maintenance -- ensuring your systems are up to date, secure and optimized for peak performance.",
  "Rapid Response and Resolution":
    "In the event of an IT issue, our team is available around the clock to provide rapid response and efficient issue resolution. We understand the urgency of the situation and work diligently to get your systems back online as quickly as possible.",
};

const SectionEfficiency = forwardRef(({ className, ...props }, ref) => {
  return (
    <section
      ref={ref}
      className={cn("grid grid-cols-2 gap-16", className)}
      {...props}
    >
      <div className="prose lg:prose-lg xl:prose-xl dark:text-slate-100">
        <p>
          At <strong className="dark:text-slate-100">BDK Inc.</strong>, we
          understand that your business relies heavily on seamless technology
          operations. When IT issues arise, every minute counts. That's why we
          offer comprehensive managed IT services designed to keep your systems
          running smoothly and ensure uninterrupted productivity.
        </p>
        <h3 className="leading-loose dark:text-bdk-blue-lightest">
          Minimize Downtime, Maximize Efficiency
        </h3>
        <p>
          Downtime can be detrimental to your business, causing financial loss,
          missed opportunities, and frustrated employees. Our team of
          experienced IT professionals is dedicated to minimizing downtime and
          maximizing the efficiency of your technology infrastructure. We
          proactively monitor your systems, detect potential issues, and resolve
          them before they become major problems.
        </p>
      </div>
      <div>
        <div className="p-6 shadow-bdk">
          <div className="text-3xl font-bold leading-loose dark:text-bdk-blue-lightest">
            Our Approach to Limiting Downtime
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
      </div>
    </section>
  );
});

export default SectionEfficiency;
