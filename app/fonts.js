import { Montserrat, Open_Sans } from "next/font/google";

export const fontMontserrat = Montserrat({
  weight: ["400", "600", "700"],
  variable: "--montserrat-font",
  subsets: ["latin"],
});

export const fontOpenSans = Open_Sans({
  weight: ["400", "600", "700"],
  variable: "--open-sans-font",
  subsets: ["latin"],
});
