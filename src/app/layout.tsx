import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Seazone AI Guest Guide",
  description: "Guia digital inteligente para hóspedes",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}