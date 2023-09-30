import PageHeading from "@/components/PageHeading.jsx";

export const metadata = {
  title: "BDKinc :: Solutions",
};

const services = [
  { title: "Helpdesk" },
  { title: "Remote Support" },
  { title: "Cloud Services" },
  { title: "Email" },
];

export default () => (
  <div className="py-2">
    <main className="container">
      <PageHeading>Services</PageHeading>
      <div>
        {services.map(({ title }) => (
          <div key={title}>{title}</div>
        ))}
      </div>
    </main>
  </div>
);
