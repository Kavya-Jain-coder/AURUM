import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AURUM — Worn by the universe. Made for you.",
  description:
    "Luxury jewellery forged from stardust. Handcrafted 18-24 karat gold rings, necklaces, bracelets & earrings set with conflict-free diamonds and gemstones. Each piece tells a story older than humanity.",
  keywords: [
    "luxury jewellery",
    "gold rings",
    "diamond jewellery",
    "handcrafted jewellery",
    "AURUM",
    "fine jewellery India",
  ],
  openGraph: {
    title: "AURUM — Worn by the universe. Made for you.",
    description:
      "Luxury jewellery forged from stardust. Each AURUM piece tells a story 4.6 billion years in the making.",
    type: "website",
    siteName: "AURUM",
  },
  twitter: {
    card: "summary_large_image",
    title: "AURUM — Worn by the universe. Made for you.",
    description:
      "Luxury jewellery forged from stardust. Each AURUM piece tells a story 4.6 billion years in the making.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${spaceGrotesk.variable}`}
    >
      <body className="bg-aurum-void text-aurum-ivory font-body antialiased">
        <Providers>
          {children}
        </Providers>

        {/* FIX 5: noscript fallback — static hero if JS fails */}
        <noscript>
          <div className="noscript-fallback">
            <h1>AURUM</h1>
            <p>
              Worn by the universe. Made for you.
              <br /><br />
              Please enable JavaScript to experience the full AURUM collection.
            </p>
          </div>
        </noscript>
      </body>
    </html>
  );
}
