import type { Metadata } from "next";
import { Lato } from "next/font/google";

import "./globals.css";
import Providers from "./providers";

const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Infobe",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={lato.className}>
      <body className="h-screen w-screen overflow-x-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
