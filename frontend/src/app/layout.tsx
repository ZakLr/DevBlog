import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionWrapper } from "../../components/SessionWrapper";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { UserContext } from "../../lib/UserContext";
import { Provider } from "react-redux";
import StoreProvider from "./StoreProvider";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, makeStore } from "../../state/store";

const inter = Inter({ subsets: ["latin"] });
import NextTopLoader from "nextjs-toploader";
export const metadata: Metadata = {
  title: "DevBlog",
  description: "The Blog for Everyone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
      <html lang="en">
        <body className={inter.className }>
          <NextTopLoader
            color="#910A67"
          />
        <StoreProvider>
          <div className="flex flex-col items-center justify-center">
            <Navbar />
          </div>
            {children}
            <Footer />
          </StoreProvider>
        </body>
      </html>
    
  );
}
