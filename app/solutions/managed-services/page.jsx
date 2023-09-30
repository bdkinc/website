import MSPTiers from "./MSPTiers";
import Hero from "@/app/solutions/managed-services/MSPHero";
import MSPIntro from "@/app/solutions/managed-services/MSPIntro";
import SectionEfficiency from "@/app/solutions/managed-services/SectionEfficiency";
import SectionHelpdesk from "@/app/solutions/managed-services/SectionHelpdesk";
import CheckCircle from "@/components/CheckCircle";
import PageHeading from "@/components/PageHeading";
import Link from "next/link";

export const packages = {
  managed: {
    essentials: [
      "remote management & monitoring",
      "patching & updates",
      "anti-virus",
      "backup monitoring",
      "helpdesk",
    ],
    "email security": {
      basic: [
        "advanced spam filtering",
        "geographical filtering",
        "quarantine reporting",
      ],
      get complete() {
        return [
          ...this.basic,
          "mail archiving",
          "phishing protection",
          "impersonation protection",
        ];
      },
    },
    network: {
      basic: ["snmp monitoring", "topology mapping", "dns management"],
      get complete() {
        return [
          ...this.basic,
          "ddos mitigation",
          "encrypted DNS",
          "pen testing",
        ];
      },
    },
    get ransomware() {
      return [
        ...this["email security"].complete,
        "endpoint detection & response",
        "password manager",
      ];
    },
  },
  other: {
    office: ["Microsoft 365", "Google Business"],
    voip: ["cloud voip"],
    hosting: ["intel", "power", "azure", "aws"],
    website: ["Wordpress", "Custom"],
    development: ["new", "existing"],
    consulting: ["1 x 1", "training", "network survey", "t & m services"],
    "internal it": ["ticketing", "training"],
    IBMi: ["swma", "hma", "ptfs"],
    "high availability": ["maxava", "double-take"],
    "disaster recovery": ["backup server", "carbonite", "cove"],
    "penetration testing": ["penetration testing", "vulnerability testing"],
    erp: ["hosted erp", "migrations", "support"],
    edi: ["as2", "sftp", "automation"],
  },
};

export const tiers = {
  pro: [...packages.managed.essentials.map((title) => `Essentials - ${title}`)],
  premiere: [
    ...packages.managed.essentials.map((title) => `Essentials - ${title}`),
    ...packages.managed.network.basic.map((title) => `Network - ${title}`),
    ...packages.managed["email security"].basic.map(
      (title) => `Email - ${title}`,
    ),
  ],
  elite: [
    ...packages.managed.essentials.map((title) => `Essentials - ${title}`),
    ...packages.managed.network.complete.map((title) => `Network - ${title}`),
    ...packages.managed["email security"].complete.map(
      (title) => `Email - ${title}`,
    ),
    "Ransomware - endpoint detection & response",
    "Ransomware - password manager",
  ],
};

export default () => (
  <>
    <div className="container">
      <PageHeading>Managed IT Services (MSP)</PageHeading>
    </div>
    <Hero className={"mb-8"} />
    <main className="container mb-12">
      <div className="flex flex-col space-y-16 mb-16">
        <MSPIntro />
        <SectionEfficiency />
        <SectionHelpdesk />
        <MSPTiers />
      </div>
      <div className="dark:text-slate-100 text-center flex justify-center w-full text-lg leading-loose">
        <div>
          <Link
            href={"/contact"}
            className="text-bdk-blue hover:text-bdk-blue-light underline"
          >
            Contact us
          </Link>{" "}
          today to learn more about our comprehensive managed IT services and
          how we can empower your business for success.
        </div>
      </div>
    </main>
  </>
);
