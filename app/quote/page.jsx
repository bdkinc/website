import QuoteForm from "@/app/quote/QuoteForm";
import PageHeading from "@/components/PageHeading";

export const metadata = {
  title: "BDKinc :: Request a Quote",
};

export default function QuotePage() {
  return (
    <main className="container">
      <PageHeading>Request a Quote</PageHeading>
      <div className="mb-6">
        <QuoteForm />
      </div>
    </main>
  );
}
