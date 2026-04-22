import { CartProvider } from "components/cart/cart-context";
import Navbar from "components/layout/navbar";
import { GeistSans } from "geist/font/sans";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import { JetBrains_Mono } from "next/font/google";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { baseUrl } from "@/lib/utils";
import { AuthProvider } from "@/hooks/use-auth";

import { WishlistProvider } from "components/product/wishlist-context";

import "./globals.css";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const MessengerChatButton = dynamic(() => import("components/layout/messenger-chat-button"), {
});

const SITE_NAME = "Mono Studio";

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="vi" className={cn("font-sans", GeistSans.variable, jetbrainsMono.variable)}>
      <body className="bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <Navbar />
              <main>{children}</main>
              <MessengerChatButton />
              <Toaster closeButton richColors position="bottom-right" />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
