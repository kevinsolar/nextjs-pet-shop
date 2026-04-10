import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import "@/styles/globals.css"
import { Header } from "@/components/header"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
})

const interTight = Inter({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["700"],
})

export const metadata: Metadata = {
  title: "Mundo Pet",
  description:
    "Aqui você pode ver todos os clientes e serviços agendados para hoje.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${interTight.variable} antialiased`}>
        <Header />

        <main className="max-w-3xl qhd:max-w-5xl mx-auto flex-1 flex flex-col mt-12">
          {children}
          <Toaster position="top-right" />
        </main>
      </body>
    </html>
  )
}
