"use client"

import { useState } from "react"
import { Search, ShoppingBag, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/firebase-auth-context"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import SearchOverlay from "./SearchOverlay"

const Navbar = () => {
  const links = ["Collections", "Blog", "About", "Contact"]
  const { user, loading, signOut } = useAuth()
  const { itemCount } = useCart()
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNavigation = (link: string) => {
    let href = "#"
    if (link === "Blog") href = "/blog"
    if (link === "Collections") href = "/collections"
    if (link === "About") href = "/about"
    if (link === "Contact") href = "/contact"
    
    router.push(href)
    setMobileMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-background/95 backdrop-blur-sm border-border/60 shadow-[0_1px_3px_0_hsl(var(--foreground)/0.04)]">
      <div className="mx-auto max-w-[90%] sm:max-w-[85%] lg:max-w-[80%] flex items-center justify-between h-14 md:h-16 lg:h-20">
        {/* Logo */}
        <a href="/" className="font-serif text-base md:text-lg lg:text-xl font-bold text-foreground shrink-0 py-2">
          Mudita Book Store
        </a>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex items-center gap-6 lg:gap-12 flex-1 mx-6 lg:mx-8">
          {links.map((link) => {
            let href = "#"
            if (link === "Blog") href = "/blog"
            if (link === "Collections") href = "/collections"
            if (link === "About") href = "/about"
            if (link === "Contact") href = "/contact"
            
            return (
              <li key={link}>
                <a
                  href={href}
                  className="text-sm lg:text-base text-gray-600 hover:text-primary font-medium transition-colors duration-200"
                >
                  {link}
                </a>
              </li>
            )
          })}
        </ul>

        {/* Right Section - Icons */}
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
          {/* Search Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSearchOpen(true)}
            className="h-9 w-9 md:h-10 md:w-10 lg:h-11 lg:w-11 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
            aria-label="Search"
          >
            <Search className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
          </Button>

          {/* Auth Section */}
          {!loading &&
            (user ? (
              <>
                {/* Shopping Cart Button */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => router.push("/cart")}
                  className="h-9 w-9 md:h-10 md:w-10 lg:h-11 lg:w-11 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors relative"
                  aria-label="Shopping cart"
                >
                  <ShoppingBag className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-text text-[10px] flex items-center justify-center font-bold shadow-md">
                      {itemCount > 99 ? "99+" : itemCount}
                    </span>
                  )}
                </Button>

                {/* Sign Out Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => signOut().then(() => router.push("/"))}
                  className="h-9 w-9 md:h-10 md:w-10 lg:h-11 lg:w-11 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
                </Button>
              </>
            ) : (
              /* Login Button */
              <Button
                className="bg-primary/80 text-text hover:bg-primary text-xs md:text-sm lg:text-base font-medium px-3 md:px-4 lg:px-6 h-9 md:h-10 lg:h-11 rounded-full shadow-md hover:shadow-lg transition-all"
                onClick={() => router.push("/login")}
              >
                Login
              </Button>
            ))}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-9 w-9 md:hidden text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors ml-1"
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/60 bg-background/98 backdrop-blur-sm">
          <div className="mx-auto max-w-[90%] py-3 space-y-1">
            {links.map((link) => (
              <button
                key={link}
                onClick={() => handleNavigation(link)}
                className="block w-full text-left px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-primary hover:bg-secondary/40 rounded-lg transition-colors"
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Search Overlay */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
  )
}

export default Navbar
