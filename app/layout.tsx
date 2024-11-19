import "./globals.css"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "Qubic",
  description: "Qubic Web",
  icons: {
    icon: `${process.env.NODE_ENV === 'production' ? '/qubic-vanity' : ''}/img/logo.png`,
    apple: `${process.env.NODE_ENV === 'production' ? '/qubic-vanity' : ''}/img/logo.png`,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
