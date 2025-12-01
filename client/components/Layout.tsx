import { Outlet } from 'react-router'
import Navbar from './Navbar'
import { useLocation } from 'react-router-dom'

export default function Layout() {
  const location = useLocation()
  const noNavbarPaths = ['/', '/onboarding']
  const wingdings = false

  return (
    <div className={wingdings ? "font-['wingdings']" : 'font-sans'}>
      <header className="flex flex-col items-center">
        <h1 className="p-6 text-4xl">GlIGHFE!</h1>
      </header>
      <main className="flex flex-col items-center pb-20">
        {/* Bottom padding to account for fixed navbar height */}
        <Outlet />
      </main>
      {!noNavbarPaths.includes(location.pathname) ? <Navbar /> : null}
    </div>
  )
}
