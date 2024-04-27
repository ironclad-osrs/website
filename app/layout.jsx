import {
  IBM_Plex_Sans as Sans,
  IBM_Plex_Mono as Mono
} from 'next/font/google'

import './globals.css'

const sans = Sans({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-sans'
})

const mono = Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono'
})

export const metadata = {
  title: 'Ironclad'
}

const Layout = ({ children }) => {
  return (
    <html lang='en' className={`${sans.variable} ${mono.variable}`}>
      <body>
        {children}
      </body>
    </html>
  )
}

export default Layout
