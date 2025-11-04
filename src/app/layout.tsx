//import './globals.css'
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
            <div className="max-w-3xl mx-auto">Trail App MVP</div>
          </header>
          <main className="max-w-3xl mx-auto p-4">{children}</main>
        </div>
      </body>
    </html>
  )
}
