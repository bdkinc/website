"use client";

import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import CheckboxField from "@/components/CheckboxField";
import Select from "@/components/Select";
import SelectField from "@/components/SelectField";
import TextAreaField from "@/components/TextAreaField";
import TextField from "@/components/TextField";
import { Formik, Form } from "formik";
import { useRouter } from "next/navigation";
import * as yup from "yup";

export default function QuoteForm() {
  const router = useRouter();

  return (
    <Formik
      initialValues={{}}
      validationSchema={yup.object().shape({
        name: yup.string().required(),
        email: yup.string().email().required(),
        company: yup.string().required(),
        users: yup.string(),
      })}
      onSubmit={(values, { setSubmitting }) => {
        console.log(values);
        setTimeout(() => {
          setSubmitting(false);
        }, 400);
      }}
    >
      {(formik) => (
        <Form className="flex flex-col gap-y-4">
          <TextField name="name" label="Your Name" placeholder="Pat Doe" />
          <TextField
            type="email"
            name="email"
            label="Your Email"
            placeholder="pat.doe@example.com"
          />
          <TextField
            name="company"
            label="Your Company"
            placeholder="Example, inc."
          />
          <CheckboxField
            name="services"
            label="Which services are you interested?"
          >
            <Checkbox.Option value="msp">
              MSP (Remote Management, Helpdesk, Patching, etc.)
            </Checkbox.Option>
            <Checkbox.Option value="csp">
              CSP (Cloud, Hosting, etc.)
            </Checkbox.Option>
            <Checkbox.Option value="edi">
              EDI (Electronic Data Interchange)
            </Checkbox.Option>
            <Checkbox.Option value="erp">
              ERP (Enterprise Resource Planning)
            </Checkbox.Option>
            <Checkbox.Option value="dev">
              Development (Software Development)
            </Checkbox.Option>
            <Checkbox.Option value="analytics">
              Analytics (Business Intelligence, Data Analytics, etc.)
            </Checkbox.Option>
            <Checkbox.Option value="ransomware">
              Ransomware Protection (EDR, Security, etc.)
            </Checkbox.Option>
            <Checkbox.Option value="other">
              Other (please specify below)
            </Checkbox.Option>
          </CheckboxField>
          {formik.values?.services?.includes("msp") && (
            <SelectField
              name="users"
              label="How many users?"
              placeholder="select amount..."
            >
              <Select.Option value="less than 10">&lt; 10</Select.Option>
              <Select.Option value="10-50">10 - 50</Select.Option>
              <Select.Option value="50-100">50 - 100</Select.Option>
              <Select.Option value="greater than 100">&gt; 100</Select.Option>
            </SelectField>
          )}
          {["msp", "csp"].filter((serv) =>
            formik.values?.services?.includes(serv),
          ).length > 0 && (
            <TextField
              type="number"
              name="servers"
              label="How many servers?"
              min="0"
            />
          )}
          <TextAreaField label="Message" name="message" />
          <div>
            <Button type="submit">Submit</Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
