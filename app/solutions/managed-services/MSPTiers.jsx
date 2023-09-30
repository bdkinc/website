import { tiers } from "./page";
import CheckCircle from "@/components/CheckCircle";
import Link from "next/link";

function MSPTiers() {
  return (
    <section id="tiered">
      <div className="prose lg:prose-lg mb-4 dark:text-slate-100">
        <h3 className="text-3xl mb-4 font-heading font-semibold dark:text-bdk-blue-lightest">
          MSP Tiers
        </h3>
        <p>
          This table represents our tiered MSP offerings. Any of these tiers can
          include Unlimited Helpdesk Support with monthly billing, or be
          purchased as a retainer. <Link href={"/quote"}>Request a Quote</Link>{" "}
          to find out more about using BDK's services in your business.
        </p>
      </div>
      <div className="pt-2 overflow-hidden shadow-bdk p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 dark:border-black">
              <th scope="col" className="py-2 px-4">
                <div className="hidden">Name</div>
              </th>
              {Object.keys(tiers).map((key) => (
                <th scope="col" className="py-2 px-4 capitalize" key={key}>
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tiers["elite"].map((item, index) => (
              <tr
                key={item}
                className={`${
                  index % 2 === 0
                    ? "bg-slate-100 dark:bg-slate-800"
                    : "bg-white dark:bg-slate-900"
                }`}
              >
                <th scope="row" className="p-2 text-lg">
                  {item}
                </th>
                {Object.keys(tiers).map((key) => (
                  <td key={key} className="text-center">
                    <div className="flex justify-center w-full">
                      {tiers[key].includes(item) ? <CheckCircle /> : ""}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default MSPTiers;
