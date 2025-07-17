// External libraries
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

// Context providers
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { ToastProvider } from './contexts/ToastContext'

// Components
import AccessibilityChecker from './components/AccessibilityChecker'
import CrispChat from './components/CrispChat'
import Footer from './components/Footer'
import Header from './components/Header'
import { ProtectedRoute } from './components/ProtectedRoute'

// Pages
import About from './pages/About'
import AdminCategories from './pages/AdminCategories'
import AdminContacts from './pages/AdminContacts'
import AdminDashboard from './pages/AdminDashboard'
import AdminOrders from './pages/AdminOrders'
import AdminProducts from './pages/AdminProducts'
import AdminUsers from './pages/AdminUsers'
import Auth from './pages/Auth'
import Cancel from './pages/Cancel'
import Checkout from './pages/Checkout'
import Contact from './pages/Contact'
import Home from './pages/Home'
import OrderConfirmation from './pages/OrderConfirmation'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Product from './pages/Product'
import Products from './pages/Products'
import ResetPassword from './pages/ResetPassword'
import Success from './pages/Success'
import TermsOfService from './pages/TermsOfService'
import UserSettings from './pages/UserSettings'

// Hooks
import { useScrollToTop } from './hooks/useScrollToTop'

const App: React.FC = (): JSX.Element => {
  const location = useLocation()

  useScrollToTop()

  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <div className="min-h-screen bg-black text-white">
            <Header />
            <AnimatePresence mode="wait">
              <motion.main
                key={location.pathname}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageTransition}
                transition={{ duration: 0.3 }}
                className="flex-1"
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:id" element={<Product />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-confirmation" element={<OrderConfirmation />} />
                  <Route path="/success" element={<Success />} />
                  <Route path="/cancel" element={<Cancel />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />

                  {/* Authentication Routes */}
                  <Route
                    path="/auth"
                    element={
                      <ProtectedRoute requireAuth={false}>
                        <Auth />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/reset-password" element={<ResetPassword />} />

                  {/* Protected Routes */}
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <UserSettings />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/products"
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <AdminProducts />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <AdminUsers />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/orders"
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <AdminOrders />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/categories"
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <AdminCategories />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/contacts"
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <AdminContacts />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </motion.main>
            </AnimatePresence>
            <Footer />

            {/* Live Chat Widget */}
            <CrispChat />

            {/* Accessibility Checker (Development Only) */}
            <AccessibilityChecker />
          </div>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
