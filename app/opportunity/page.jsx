import MSPOpportunityForm from "./MSPOpportunityForm";
import PageHeading from "@/components/PageHeading";

export const metadata = {
  title: "BDKinc :: Opportunity",
};

export default () => {
  return (
    <main className="container">
      <PageHeading>Opportunity</PageHeading>
      <div>
        <MSPOpportunityForm />
      </div>
    </main>
  );
};
