//import './globals.css'
import Link from 'next/link'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'Trail App',
  description: 'Local trail running community app',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <head>
          {/* Tailwind CDN */}
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <div className="min-h-screen bg-slate-50">
          <header className="p-4 bg-white shadow-sm">
            <Link
              href="/"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Trail Mission
            </Link>
          </header>
          <main className="max-w-3xl mx-auto p-4">{children}</main>
        </div>
      </body>
    </html>
  )
}
