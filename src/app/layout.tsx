import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { TRPCReactProvider } from "@/trpc/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Provider from "./_components/providers/SessionProvider";
import Header from "./_components/header";
import ReduxProvider from "./_components/providers/ReduxProvider";
import { getServerSession } from "next-auth/next";
import { NextUiProvider } from "./_components/providers/NextUIProvider";
import { ToastContainer } from "react-toastify";
import Footer from "./_components/Footer";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "ELE Online Gaming Tournaments",
  description: "ELE Online Gaming Tournaments, win cash, and gain experience.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  // const user = await db.query.users.findMany({
  //   with: {
  //     teams: true
  //   }
  // })

  // const user2 = await db.query.users.findMany({
  //   with: {
  //     teamMembers: true
  //   }
  // })

  // const user = await db.query.users.findMany({
  //   with: {
  //     teams: {
  //       where: (teams, {eq}) => eq(teams.game, "mw3")
  //     }
  //   }
  // })

  // console.log("user2", user[0])

  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <Provider>
          <ReduxProvider user={session?.user}>
            <TRPCReactProvider>
              <NextUiProvider>
                <div className="bg-slate-950">
                  <Header />
                  {children}
                  <ToastContainer />
                  <Footer />
                </div>
                <ReactQueryDevtools initialIsOpen={false} />
              </NextUiProvider>
            </TRPCReactProvider>
          </ReduxProvider>
        </Provider>
        <Analytics />
      </body>
    </html>
  );
}
