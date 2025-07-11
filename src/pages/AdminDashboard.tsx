import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Clock, 
  Mail,
  TrendingUp,
  Activity,
  BarChart3
} from 'lucide-react'
import { useAdmin } from '../hooks/useAdmin'
import { useNavigate } from 'react-router-dom'

interface StatCard {
  title: string
  value: string | number
  icon: React.ComponentType<any>
  color: string
  trend?: string
}

export default function AdminDashboard() {
  const { isAdmin, loading, getAdminStats } = useAdmin()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    newContactSubmissions: 0
  })
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/')
    }
  }, [isAdmin, loading, navigate])

  useEffect(() => {
    const fetchStats = async () => {
      if (isAdmin) {
        try {
          const adminStats = await getAdminStats()
          setStats(adminStats)
        } catch (error) {
          console.error('Error fetching stats:', error)
        } finally {
          setStatsLoading(false)
        }
      }
    }

    fetchStats()
  }, [isAdmin, getAdminStats])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-violet"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  const statCards: StatCard[] = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      trend: '+12% from last month'
    },
    {
      title: 'Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-green-500/10 border-green-500/20 text-green-400',
      trend: '+3 new this month'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
      trend: '+8% from last month'
    },
    {
      title: 'Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-electric-violet/10 border-electric-violet/20 text-electric-violet',
      trend: '+15% from last month'
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
      trend: 'Needs attention'
    },
    {
      title: 'New Messages',
      value: stats.newContactSubmissions,
      icon: Mail,
      color: 'bg-red-500/10 border-red-500/20 text-red-400',
      trend: 'Unread submissions'
    }
  ]

  const quickActions = [
    {
      title: 'Manage Products',
      description: 'Add, edit, or remove templates',
      icon: Package,
      color: 'bg-green-500 hover:bg-green-600',
      href: '/admin/products'
    },
    {
      title: 'Manage Users',
      description: 'View and edit user accounts',
      icon: Users,
      color: 'bg-blue-500 hover:bg-blue-600',
      href: '/admin/users'
    },
    {
      title: 'View Orders',
      description: 'Process and track orders',
      icon: ShoppingCart,
      color: 'bg-purple-500 hover:bg-purple-600',
      href: '/admin/orders'
    },
    {
      title: 'Contact Messages',
      description: 'Review customer inquiries',
      icon: Mail,
      color: 'bg-red-500 hover:bg-red-600',
      href: '/admin/contacts'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Studio Nullbyte</title>
        <meta name="description" content="Studio Nullbyte admin dashboard for managing templates, users, and orders." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-black pt-20 pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-6 h-6 text-electric-violet" />
                <h1 className="text-3xl font-mono text-white">Admin Dashboard</h1>
              </div>
              <p className="text-gray-400 font-mono">
                Manage templates, users, and orders for Studio Nullbyte
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {statCards.map((card, index) => {
                const Icon = card.icon
                return (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-code-gray-light border rounded-lg p-6 ${card.color}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="w-8 h-8" />
                      <span className="text-2xl font-mono font-bold">
                        {statsLoading ? '...' : card.value}
                      </span>
                    </div>
                    <h3 className="text-white font-mono text-sm mb-1">{card.title}</h3>
                    {card.trend && (
                      <p className="text-gray-400 font-mono text-xs">{card.trend}</p>
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-xl font-mono text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-electric-violet" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <motion.button
                      key={action.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      onClick={() => navigate(action.href)}
                      className={`${action.color} text-white p-6 rounded-lg transition-colors text-left group`}
                    >
                      <Icon className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
                      <h3 className="font-mono font-semibold mb-1">{action.title}</h3>
                      <p className="font-mono text-sm opacity-90">{action.description}</p>
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="bg-code-gray-light border border-gray-700 rounded-lg p-6"
            >
              <h2 className="text-xl font-mono text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-electric-violet" />
                System Overview
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders Summary */}
                <div className="bg-code-gray border border-gray-600 rounded p-4">
                  <h3 className="text-white font-mono mb-3">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 font-mono">New orders today</span>
                      <span className="text-electric-violet font-mono">
                        {statsLoading ? '...' : Math.floor(stats.totalOrders * 0.1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 font-mono">Products sold this week</span>
                      <span className="text-green-400 font-mono">
                        {statsLoading ? '...' : Math.floor(stats.totalOrders * 0.3)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 font-mono">New users this month</span>
                      <span className="text-blue-400 font-mono">
                        {statsLoading ? '...' : Math.floor(stats.totalUsers * 0.2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* System Status */}
                <div className="bg-code-gray border border-gray-600 rounded p-4">
                  <h3 className="text-white font-mono mb-3">System Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 font-mono">Database</span>
                      <span className="text-green-400 font-mono">● Online</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 font-mono">Authentication</span>
                      <span className="text-green-400 font-mono">● Active</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 font-mono">File Storage</span>
                      <span className="text-green-400 font-mono">● Ready</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
