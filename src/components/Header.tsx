import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingCart, User, Settings, LogOut, Shield } from 'lucide-react'
import { useAuthContext } from '../contexts/AuthContext'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, profile, signOut } = useAuthContext()

  const handleSignOut = async () => {
    try {
      const { error } = await signOut()
      
      if (!error) {
        // Close menus and redirect to home
        setIsUserMenuOpen(false)
        setIsMenuOpen(false)
        navigate('/')
      } else {
        alert('Failed to sign out. Please try again.')
      }
    } catch (error) {
      alert('An unexpected error occurred while signing out.')
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
    setIsUserMenuOpen(false)
  }, [location])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isUserMenuOpen) {
        const target = event.target as Element
        if (!target.closest('.user-menu-container')) {
          setIsUserMenuOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isUserMenuOpen])

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/90 backdrop-blur-md border-b border-gray-800' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
              <img 
                src="/images/SNLogo.jpg" 
                alt="Studio Nullbyte Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <span className="font-mono text-lg sm:text-xl font-bold glitch-text group-hover:text-electric-violet transition-colors">
              <span className="hidden xs:inline">Studio</span><span className="text-electric-violet">Nullbyte</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`font-mono text-sm transition-colors hover:text-electric-violet ${
                  location.pathname === item.path
                    ? 'text-electric-violet'
                    : 'text-gray-300'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Admin Link in Main Navigation */}
            {profile?.role === 'admin' && (
              <Link
                to="/admin"
                className={`flex items-center gap-1 font-mono text-sm transition-colors hover:text-electric-violet ${
                  location.pathname.startsWith('/admin')
                    ? 'text-electric-violet'
                    : 'text-gray-300'
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            )}
          </nav>

          {/* Cart, User Menu, and Mobile Menu Button */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button className="p-2 hover:bg-gray-800 rounded-sm transition-colors">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            
            {/* User Authentication */}
            {user ? (
              <div className="relative user-menu-container">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-sm transition-colors"
                >
                  <div className="w-6 h-6 bg-electric-violet rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-black" />
                  </div>
                  <span className="hidden sm:inline font-mono text-sm text-gray-300">
                    {profile?.full_name || user.email?.split('@')[0] || 'User'}
                  </span>
                </button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-code-gray-light border border-gray-700 rounded-lg shadow-lg z-50"
                    >
                      <div className="py-2">
                        <Link
                          to="/settings"
                          className="flex items-center gap-3 px-4 py-2 font-mono text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Account Settings
                        </Link>
                        
                        {/* Admin Menu Items */}
                        {profile?.role === 'admin' && (
                          <>
                            <hr className="border-gray-700 my-1" />
                            <div className="px-4 py-2">
                              <p className="font-mono text-xs text-gray-500 uppercase tracking-wider">Admin</p>
                            </div>
                            <Link
                              to="/admin"
                              className="flex items-center gap-3 px-4 py-2 font-mono text-sm text-electric-violet hover:text-white hover:bg-electric-violet/10 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Shield className="w-4 h-4" />
                              Dashboard
                            </Link>
                            <Link
                              to="/admin/products"
                              className="flex items-center gap-3 px-4 py-2 font-mono text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              Products
                            </Link>
                            <Link
                              to="/admin/users"
                              className="flex items-center gap-3 px-4 py-2 font-mono text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              Users
                            </Link>
                            <Link
                              to="/admin/categories"
                              className="flex items-center gap-3 px-4 py-2 font-mono text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              Categories
                            </Link>
                            <Link
                              to="/admin/orders"
                              className="flex items-center gap-3 px-4 py-2 font-mono text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              Orders
                            </Link>
                            <Link
                              to="/admin/contacts"
                              className="flex items-center gap-3 px-4 py-2 font-mono text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              Messages
                            </Link>
                          </>
                        )}
                        
                        <hr className="border-gray-700 my-1" />
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-2 font-mono text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/auth"
                className="hidden sm:flex items-center gap-2 bg-electric-violet hover:bg-electric-violet-light text-white font-mono text-sm py-2 px-4 rounded transition-colors"
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
            )}
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-800 rounded-sm transition-colors"
            >
              {isMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-black/95 backdrop-blur-md border-t border-gray-800"
          >
            <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`font-mono text-base sm:text-lg py-2 transition-colors hover:text-electric-violet ${
                      location.pathname === item.path
                        ? 'text-electric-violet'
                        : 'text-gray-300'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Admin Link in Mobile Main Navigation */}
                {profile?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`flex items-center gap-2 font-mono text-base sm:text-lg py-2 transition-colors hover:text-electric-violet ${
                      location.pathname.startsWith('/admin')
                        ? 'text-electric-violet'
                        : 'text-gray-300'
                    }`}
                  >
                    <Shield className="w-5 h-5" />
                    Admin
                  </Link>
                )}
                
                {/* Mobile Auth Links */}
                <hr className="border-gray-700 my-2" />
                {user ? (
                  <>
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 font-mono text-base sm:text-lg py-2 text-gray-300 hover:text-electric-violet transition-colors"
                    >
                      <Settings className="w-5 h-5" />
                      Account Settings
                    </Link>
                    
                    {/* Mobile Admin Menu Items */}
                    {profile?.role === 'admin' && (
                      <>
                        <hr className="border-gray-700 my-2" />
                        <div className="py-2">
                          <p className="font-mono text-sm text-gray-500 uppercase tracking-wider">Admin</p>
                        </div>
                        <Link
                          to="/admin"
                          className="flex items-center gap-3 font-mono text-base sm:text-lg py-2 text-electric-violet hover:text-electric-violet-light transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Shield className="w-5 h-5" />
                          Dashboard
                        </Link>
                        <Link
                          to="/admin/products"
                          className="flex items-center gap-3 font-mono text-base sm:text-lg py-2 text-gray-300 hover:text-electric-violet transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Products
                        </Link>
                        <Link
                          to="/admin/users"
                          className="flex items-center gap-3 font-mono text-base sm:text-lg py-2 text-gray-300 hover:text-electric-violet transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Users
                        </Link>
                        <Link
                          to="/admin/categories"
                          className="flex items-center gap-3 font-mono text-base sm:text-lg py-2 text-gray-300 hover:text-electric-violet transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Categories
                        </Link>
                        <Link
                          to="/admin/orders"
                          className="flex items-center gap-3 font-mono text-base sm:text-lg py-2 text-gray-300 hover:text-electric-violet transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Orders
                        </Link>
                        <Link
                          to="/admin/contacts"
                          className="flex items-center gap-3 font-mono text-base sm:text-lg py-2 text-gray-300 hover:text-electric-violet transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Messages
                        </Link>
                        <hr className="border-gray-700 my-2" />
                      </>
                    )}
                    
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 font-mono text-base sm:text-lg py-2 text-red-400 hover:text-red-300 transition-colors text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    className="flex items-center gap-3 font-mono text-base sm:text-lg py-2 text-electric-violet hover:text-electric-violet-light transition-colors"
                  >
                    <User className="w-5 h-5" />
                    Sign In
                  </Link>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header
