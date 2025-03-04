import './globals.css'
import { Inter } from 'next/font/google'
import { SessionProvider } from '@/components/Auth/SessionProvider'
import { Preloader } from '@/components/ui/Preloader'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Versicherungs-Dokumentenmanagement',
  description: 'Intelligentes Dokumentenmanagement für Versicherungsunternehmen',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className={`${inter.className} bg-white`}>
        <Preloader />
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
} 