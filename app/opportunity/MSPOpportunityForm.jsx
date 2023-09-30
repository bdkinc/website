"use client";

import { packages } from "@/app/solutions/managed-services/page";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import CheckboxField from "@/components/CheckboxField";
import Dialog from "@/components/Dialog";
import Label from "@/components/Label";
import RadioGroup from "@/components/RadioGroup";
import TextField from "@/components/TextField";
import { cn } from "@/components/utils";
import { Formik, Form } from "formik";
import isEqual from "lodash/isEqual";
import { useEffect, useState } from "react";

const tiers = {
  pro: {
    essentials: true,
  },
  premiere: {
    essentials: true,
    "email security": "basic",
    network: "basic",
  },
  elite: {
    essentials: true,
    "email security": "complete",
    network: "complete",
    ransomware: true,
  },
};

const packagePurchase = {
  essentials: [
    "N-Central with 3rd-party patching & AVDefender",
    "Backup Product Cove, Evault or Veeam",
  ],
  "email security": {
    basic: ["Barracuda Basic"],
    complete: [
      "Barracuda Complete with Archiving, Phishing training and Impersonation protection",
    ],
  },
  network: {
    basic: ["Auvik", "GoDaddy registrar and DNS"],
    complete: [
      "Auvik",
      "Cloudflare DNS with firewall configured for encrypted DNS",
      "PTAAS through Passpoint",
    ],
  },
  ransomware: [
    "Sentinel One",
    "Keeper",
    "Barracuda Complete with Archiving, Phishing training and Impersonation protection",
  ],
};

function MessageDisplay({ values }) {
  useEffect(() => {
    console.log({ values });
  }, []);

  return (
    <div>
      {values.packages.managed ? (
        <div className="mb-6 bg-slate-100 dark:bg-slate-800 dark:text-slate-100 p-6">
          <div className="font-heading font-semibold mb-2">
            Products that need to be purchased:
          </div>
          <div className="pl-6">
            <ul className="flex flex-col space-y-2 list-disc">
              {Object.keys(values.packages.managed).map((m) => {
                console.log(m);
                return (
                  <li key={m}>
                    <div>{m}</div>
                    <div>
                      {packagePurchase.hasOwnProperty(m)
                        ? packagePurchase[m]
                        : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function MSPOpportunityForm() {
  const [open, setOpen] = useState(false);

  const onSubmit = (values) => {
    setPurchases(
      Object.keys(values.packages.managed).map((pack) => {
        if (typeof values.packages.managed[pack] === "string") {
          return packagePurchase[pack][values.packages.managed[pack]].join(
            ", ",
          );
        } else {
          return packagePurchase[pack].join(", ");
        }
      }),
    );
    setOpen(true);
  };

  return (
    <div>
      <Formik
        initialValues={{
          customerName: "",
          users: 0,
          computers: 0,
          servers: 0,
          tier: "pro",
          packages: {
            managed: {
              essentials: true,
            },
            other: [],
          },
        }}
        onSubmit={onSubmit}
      >
        {(formik) => (
          <div>
            <Dialog open={open} onOpenChange={setOpen}>
              <MessageDisplay values={formik.values} />
            </Dialog>
            <Form className="flex flex-col gap-y-4">
              <fieldset className="flex flex-col space-y-3 mb-6">
                <legend className="font-heading font-semibold text-lg">
                  General Information
                </legend>
                <TextField
                  name="customerName"
                  label="Customer Name"
                  placeholder="Customer Name"
                />
                <TextField type="number" name="users" label="Users" min="0" />
                <TextField
                  type="number"
                  name="computers"
                  label="Computers"
                  min="0"
                />
                <TextField
                  type="number"
                  name="servers"
                  label="Servers"
                  min="0"
                />
              </fieldset>
              <fieldset className="flex flex-col space-y-3 mb-6">
                <legend className="font-heading font-semibold text-lg">
                  MSP
                </legend>
                <div>
                  <Label>Presets</Label>
                  <RadioGroup
                    name={"tier"}
                    className={cn("grid grid-cols-3 gap-8")}
                    onValueChange={(value) => {
                      formik.setFieldValue("tier", value);
                      formik.setFieldValue("packages.managed", tiers[value]);
                    }}
                    value={formik.values.tier}
                  >
                    {Object.keys(tiers).map((tier) => (
                      <RadioGroup.Item
                        key={tier}
                        className={cn("border p-4")}
                        value={tier}
                      >
                        <div className="pl-4 w-full">
                          <div className="capitalize font-semibold font-heading">
                            {tier}
                          </div>
                          <div>
                            {Object.keys(tiers[tier]).map((pack) => (
                              <div key={pack}>{pack}</div>
                            ))}
                          </div>
                        </div>
                      </RadioGroup.Item>
                    ))}
                  </RadioGroup>
                </div>
                <div className="space-y-4">
                  {Object.keys(packages.managed).map((pack) => (
                    <Checkbox.Option
                      key={pack}
                      checked={
                        !!(
                          pack === "essentials" ||
                          formik.values.packages.managed[pack]
                        )
                      }
                      name={`packages.managed[${pack}]`}
                      value={formik.values.packages.managed[pack]}
                      className={cn(
                        "w-full border dark:bg-slate-800 dark:border-slate-900 p-4",
                      )}
                      disabled={pack === "essentials" ? true : undefined}
                      onCheckedChange={(isChecked) => {
                        formik.setFieldValue(
                          `packages.managed[${pack}]`,
                          !Array.isArray(packages.managed[pack]) && isChecked
                            ? "basic"
                            : isChecked,
                        );
                        const newValues = {
                          ...formik.values.packages.managed,
                          [pack]: isChecked,
                        };

                        Object.keys(tiers).forEach((tier) => {
                          if (isEqual(newValues, tiers[tier])) {
                            formik.setFieldValue("tier", tier);
                          } else {
                            formik.setFieldValue("tier", "");
                          }
                        });
                      }}
                    >
                      <div>
                        <div className="capitalize font-heading font-semibold leading-loose">
                          {pack}
                        </div>
                        {Array.isArray(packages.managed[pack]) ? (
                          <div>{packages.managed[pack].join(", ")}</div>
                        ) : (
                          <RadioGroup
                            className={cn("space-y-2")}
                            value={formik.values.packages.managed[pack] || ""}
                            onValueChange={(value) => {
                              formik.setFieldValue(
                                `packages.managed[${pack}]`,
                                value,
                              );

                              const newValues = {
                                ...formik.values.packages.managed,
                                [pack]: value,
                              };

                              Object.keys(tiers).forEach((tier) => {
                                console.log(newValues, tiers[tier]);
                                if (isEqual(newValues, tiers[tier])) {
                                  formik.setFieldValue("tier", tier);
                                } else {
                                  formik.setFieldValue("tier", "");
                                }
                              });
                            }}
                          >
                            {Object.keys(packages.managed[pack]).map(
                              (level) => (
                                <RadioGroup.Item key={level} value={level}>
                                  <span className="font-semibold ml-2 mr-4 capitalize">
                                    {level}
                                  </span>
                                  <span>
                                    {packages.managed[pack][level].join(", ")}
                                  </span>
                                </RadioGroup.Item>
                              ),
                            )}
                          </RadioGroup>
                        )}
                      </div>
                    </Checkbox.Option>
                  ))}
                </div>
              </fieldset>
              <fieldset className="flex flex-col space-y-3">
                <legend className="font-heading font-semibold text-lg">
                  Additional
                </legend>
                <CheckboxField
                  name={"packages.other"}
                  className={cn("space-y-4")}
                >
                  {Object.keys(packages.other).map((pack) => (
                    <Checkbox.Option
                      key={pack}
                      value={pack}
                      className={
                        "w-full border dark:bg-slate-800 dark:border-slate-900 p-4"
                      }
                    >
                      <div className="font-semibold capitalize font-heading">
                        {pack}
                      </div>
                      <div>{packages.other[pack].join(", ")}</div>
                    </Checkbox.Option>
                  ))}
                </CheckboxField>
              </fieldset>
              <div>
                <Button type={"Submit"}>Submit</Button>
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </div>
  );
}
