"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import { Formik, Form, Field } from "formik";
import { useRouter } from "next/navigation";
import { FaPaperPlane, FaSync } from "react-icons/fa";
import { object, string } from "yup";

const initialValues = { name: "", email: "", phone: "", message: "" };
const validationSchema = object().shape({
  name: string().required("Required"),
  email: string().email("Invalid email").required("Required"),
  phone: string().required("Required"),
  message: string().required("Required"),
});

function ContactForm() {
  const router = useRouter();

  function handleSubmit(values, { setSubmitting }) {
    console.log(values);
    setTimeout(() => {
      setSubmitting(false);
    }, 400);
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors, touched, submitCount }) => (
        <div className="relative">
          <Form>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block font-semibold text-gray-800 dark:text-blue-200 mb-2"
              >
                Your Name <span className="text-red-500">*</span>
              </label>
              <Field
                id="name"
                type="text"
                name="name"
                as={Input}
                placeholder="Pat Doe"
                autoFocus={router.route === "/contact"}
                className={`${
                  errors.name &&
                  touched.name &&
                  submitCount > 0 &&
                  "border-red-500"
                }`}
              />
              {errors.name && touched.name && submitCount > 0 && (
                <div className="text-red-500">{errors.name}</div>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block font-semibold text-gray-800 dark:text-blue-200 mb-2"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <Field
                id="email"
                type="email"
                name="email"
                as={Input}
                placeholder="pat.doe@example.com"
                className={`${
                  touched.email &&
                  errors.email &&
                  submitCount > 0 &&
                  "border-red-500"
                }`}
              />
              {touched.email && errors.email && submitCount > 0 && (
                <div className="text-red-500">{errors.email}</div>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block font-semibold text-gray-800 dark:text-blue-200 mb-2"
              >
                Phone <span className="text-red-500">*</span>
              </label>
              <Field
                id="phone"
                type="text"
                name="phone"
                as={Input}
                placeholder="(202) 555-0112"
                className={`${
                  touched.phone &&
                  errors.phone &&
                  submitCount > 0 &&
                  "border-red-500"
                }`}
              />
              {touched.phone && errors.phone && submitCount > 0 && (
                <div className="text-red-500">{errors.phone}</div>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="message"
                className="block font-semibold text-gray-800 dark:text-blue-200 mb-2"
              >
                Message <span className="text-red-500">*</span>
              </label>
              <Field
                id="message"
                as={Textarea}
                name="message"
                placeholder="I would like..."
                className={`${
                  touched.message &&
                  errors.message &&
                  submitCount > 0 &&
                  "border-red-500"
                }`}
              />
              {touched.message && errors.message && submitCount > 0 && (
                <div className="text-red-500">{errors.message}</div>
              )}
            </div>
            <div className="mb-4">
              <Button type="submit" disabled={isSubmitting}>
                <span>Submit</span>
                <span className="ml-2 text-sm">
                  {isSubmitting ? <FaSync /> : <FaPaperPlane />}
                </span>
              </Button>
            </div>
          </Form>
          {isSubmitting && (
            <div className="absolute top-0 left-0 bottom-0 right-0 bg-white dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-50" />
          )}
        </div>
      )}
    </Formik>
  );
}

export default ContactForm;
