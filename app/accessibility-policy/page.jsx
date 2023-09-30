import PageHeading from "@/components/PageHeading";

export const metadata = {
  title: "BDKinc :: Accessibility Policy",
};

export default function AccessibilityPolicy() {
  return (
    <div className="py-4">
      <main className="container">
        <PageHeading>Accessibility Statement</PageHeading>
        <div className="prose lg:prose-lg xl:prose-xl dark:text-slate-100">
          <p>
            B. Donald Kimball, Inc. is committed to ensuring digital
            accessibility for people with disabilities. We are continually
            improving the user experience for everyone, and applying the
            relevant accessibility standards.
          </p>
          <div className="doc-multiple" data-props="measeures|otherMeaseures">
            <h2>Efforts to support accessibility</h2>
            <p>
              B. Donald Kimball, Inc. takes the following measures to ensure
              accessibility:
            </p>
            <ul className="doc-measeures mb0">
              <li>Accessibility is part of our mission statement.</li>
              <li>Accessibility is part of our internal policies.</li>
            </ul>
          </div>
          <div
            className="doc-multiple"
            data-props="conformanceStatus|standardsApplied|otherStandardsApplied|additionalRequirements"
          >
            <h2>Conformance status</h2>
            <div className="doc-standardsApplied">
              <h3>Current accessibility standard of the site:</h3>
              <p>Unknown</p>
            </div>

            <h3>Current content conformance status:</h3>
            <p className="doc-conformanceStatus">
              Partially conformant: some parts of the content do not fully
              conform to the accessibility standard.
            </p>
          </div>
          <div
            className="doc-multiple"
            data-props="technologies|otherTechnologies"
          >
            <h2>Technologies</h2>
            <p>
              Accessibility of this site relies on the following technologies to
              work:
            </p>
            <ul className="doc-technologies mb0">
              <li>HTML</li>
              <li>WAI-ARIA</li>
              <li>CSS</li>
              <li>Javascript</li>
            </ul>
            <p className="mt15"></p>
          </div>
          <div className="doc-multiple" data-props="approach|otherApproach">
            <h2>Assessment methods</h2>
            <p>
              B. Donald Kimball, Inc. assessed the accessibility of this site
              using the following method(s):
            </p>
            <ul className="doc-approach mb0">
              <li>
                Self-evaluation: the site was evaluated internally by the
                company or organization.
              </li>
            </ul>
          </div>
          <div
            className="doc-multiple"
            data-props="phone|email|postalAddress|responseDuration"
          >
            <h2>Feedback process</h2>
            <p>
              We welcome your feedback on the accessibility of this site. Please
              contact us via one of the following methods:
            </p>
            <ul>
              <li className="doc-phone">Phone: 1-800-309-0004</li>
              <li className="doc-email">
                E-mail: <a href="mailto:info@bdkinc.com">info@bdkinc.com</a>
              </li>
              <li className="doc-postalAddress">
                Postal Address: 29515 Canvasback Drive
              </li>
            </ul>
            <p className="doc-responseDuration">
              We aim to respond to feedback within 1 business day.
            </p>
          </div>
          <div
            className="doc-multiple"
            data-props="processesName|processesFunction"
          >
            <h2>Formal approval of this accessibility statement</h2>
            <p>This accessibility statement is approved by:</p>
            <p className="doc-orgName mb0">B. Donald Kimball, Inc.</p>
            <p className="doc-processesName mb0">Brian Kimball</p>
            <p className="doc-processesFunction">CTO</p>
          </div>
          <div className="doc-publicationDate">
            <hr />
            <p>
              This statement was created on 12/7/2022 using the{" "}
              <a href="https://siteimprove.com/toolkit/accessibility-statement-generator/">
                Siteimprove Accessibility Statement Generator Tool
              </a>
              .
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
