import type { Metadata } from "next";
import "./globals.css"
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast"
import { Geist } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Learning Assistant",
  description: "AI-powered study assistant that helps you learn faster with document chat, summary, concept explanations, flashcards, and quizzes.",
  icons: {
    icon: "/favicon.svg",
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
      className={`${geist.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Toaster />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
