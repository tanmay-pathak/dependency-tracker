'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { LoginButton } from '@/components/LoginButton'
import { createBrowserClient } from '@/utils/supabase'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const supabase = createBrowserClient()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setIsLoggedIn(!!user)
    }
    checkUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        setIsLoggedIn(true)
        router.refresh()
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false)
        router.refresh()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsMenuOpen(false)
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/projects', label: 'Projects' },
    { href: '/versions', label: 'Versions' },
  ]

  return (
    <header className="w-full border-b border-border bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            Dependency Tracker
          </Link>
          {isLoggedIn && (
            <nav className="hidden sm:block">
              <ul className="flex space-x-4">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`transition-colors ${
                        pathname.startsWith(item.href)
                          ? 'font-bold text-primary'
                          : 'text-muted-foreground hover:text-primary'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="hidden sm:block"
                >
                  Logout
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="sm:hidden"
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                  aria-label="Toggle menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <LoginButton />
            )}
          </div>
        </div>
        {isLoggedIn && isMenuOpen && (
          <nav className="mt-4 sm:hidden">
            <ul className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block py-2 transition-colors ${
                      pathname.startsWith(item.href)
                        ? 'font-bold text-primary'
                        : 'text-muted-foreground hover:text-primary'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full justify-start"
                >
                  Logout
                </Button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}
