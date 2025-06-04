import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AlphaAgents: The Foundation Layer for Swiss Automation 3.0",
  description: "Our multi-agent platform provides the infrastructure to scale decentralized AI automation applications for Swiss enterprises",
  metadataBase: new URL('https://alpha-informatik.ch'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AlphaAgents: The Foundation Layer for Swiss Automation 3.0',
    description: 'Our multi-agent platform provides the infrastructure to scale decentralized AI automation applications for Swiss enterprises',
    url: 'https://alpha-informatik.ch',
    siteName: 'AlphaAgents',
    locale: 'de_CH',
    type: 'website',
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de-CH">
      <head>
        <link rel="canonical" href="https://alpha-informatik.ch" />
        <meta name="geo.region" content="CH" />
        <meta name="geo.position" content="47.3769;8.5417" />
        <meta name="ICBM" content="47.3769, 8.5417" />
        <meta name="geo.placename" content="Zürich, Switzerland" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
