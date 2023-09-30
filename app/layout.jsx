import "../assets/styles.scss";
import { fontMontserrat, fontOpenSans } from "./fonts";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata = {
  title: "BDKinc",
  description: "Welcome to BDKinc, IT Made Simple",
};

export default function AppLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${fontMontserrat.variable} ${fontOpenSans.variable}`}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="system">
          <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col bg-left-top text-slate-900 dark:text-slate-100">
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
