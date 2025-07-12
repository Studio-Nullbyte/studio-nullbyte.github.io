import { useState, useEffect } from 'react'
import { useAuthContext } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

interface AdminStats {
  totalUsers: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  newContactSubmissions: number
}

interface User {
  id: string
  user_id: string
  full_name: string | null
  email: string
  role: string
  created_at: string
  updated_at: string
}

interface Product {
  id: string
  title: string
  description: string
  price: number
  category_id: string
  category?: {
    name: string
    slug: string
  }
  image_url: string | null
  download_url: string | null
  preview_url: string | null
  tags: string[]
  featured: boolean
  active: boolean
  created_at: string
  updated_at: string
}

interface Order {
  id: string
  user_id: string
  total_amount: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded'
  payment_method: string | null
  payment_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
  user_profiles?: {
    full_name: string | null
    email: string
  }
  order_items?: {
    id: string
    product_id: string
    price: number
    quantity: number
    products: {
      title: string
    }
  }[]
}

interface Category {
  id: string
  name: string
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string
  message: string
  submitted_at: string
  status: string
}

export function useAdmin() {
  const { profile } = useAuthContext()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = () => {
      if (profile) {
        setIsAdmin(profile.role === 'admin')
      } else {
        setIsAdmin(false)
      }
      setLoading(false)
    }

    checkAdminStatus()
  }, [profile])

  // Admin Statistics
  const getAdminStats = async (): Promise<AdminStats> => {
    try {
      const [
        usersResult,
        productsResult,
        ordersResult,
        revenueResult,
        pendingOrdersResult,
        contactsResult
      ] = await Promise.all([
        supabase.from('user_profiles').select('id', { count: 'exact', head: true }),
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase
          .from('orders')
          .select('total_amount')
          .eq('status', 'completed'),
        supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending'),
        supabase
          .from('contact_submissions')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'new')
      ])

      const totalRevenue = revenueResult.data?.reduce(
        (sum, order) => sum + parseFloat(order.total_amount.toString()),
        0
      ) || 0

      return {
        totalUsers: usersResult.count || 0,
        totalProducts: productsResult.count || 0,
        totalOrders: ordersResult.count || 0,
        totalRevenue,
        pendingOrders: pendingOrdersResult.count || 0,
        newContactSubmissions: contactsResult.count || 0
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error)
      throw error
    }
  }

  // User Management
  const getUsers = async () => {
    try {
      const { data, error } = await supabase.auth.admin.listUsers()

      if (error) throw error

      // Get user profiles for additional data
      const userIds = data.users.map(user => user.id)
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('user_id, full_name, role')
        .in('user_id', userIds)

      // Combine auth users with profile data
      const usersWithProfiles = data.users.map(user => {
        const profile = profiles?.find(p => p.user_id === user.id)
        const [firstName, lastName] = (profile?.full_name || '').split(' ')
        
        return {
          id: user.id,
          email: user.email || '',
          first_name: firstName || null,
          last_name: lastName || null,
          avatar_url: user.user_metadata?.avatar_url || null,
          role: (profile?.role as 'user' | 'admin') || 'user',
          is_active: true, // Default to active for now
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          email_confirmed_at: user.email_confirmed_at
        }
      })

      return usersWithProfiles
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  }

  const updateUser = async (userId: string, updates: Partial<User>) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error

      // Log admin activity
      await supabase.rpc('log_admin_activity', {
        p_action: 'update_user',
        p_table_name: 'user_profiles',
        p_record_id: userId,
        p_new_values: updates
      })

      return { data, error: null }
    } catch (error) {
      console.error('Error updating user:', error)
      return { data: null, error }
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId)
      if (error) throw error

      // Log admin activity
      await supabase.rpc('log_admin_activity', {
        p_action: 'delete_user',
        p_table_name: 'user_profiles',
        p_record_id: userId
      })

      return { error: null }
    } catch (error) {
      console.error('Error deleting user:', error)
      return { error }
    }
  }

  // Product Management
  const getProducts = async (): Promise<Product[]> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name, slug)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  }

  const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single()

      if (error) throw error

      // Log admin activity
      await supabase.rpc('log_admin_activity', {
        p_action: 'create_product',
        p_table_name: 'products',
        p_record_id: data.id,
        p_new_values: product
      })

      return { data, error: null }
    } catch (error) {
      console.error('Error creating product:', error)
      return { data: null, error }
    }
  }

  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', productId)
        .select()
        .single()

      if (error) throw error

      // Log admin activity
      await supabase.rpc('log_admin_activity', {
        p_action: 'update_product',
        p_table_name: 'products',
        p_record_id: productId,
        p_new_values: updates
      })

      return { data, error: null }
    } catch (error) {
      console.error('Error updating product:', error)
      return { data: null, error }
    }
  }

  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) throw error

      // Log admin activity
      await supabase.rpc('log_admin_activity', {
        p_action: 'delete_product',
        p_table_name: 'products',
        p_record_id: productId
      })

      return { error: null }
    } catch (error) {
      console.error('Error deleting product:', error)
      return { error }
    }
  }

  // Order Management
  const getOrders = async (): Promise<Order[]> => {
    try {
      // First, try to get orders with a simple query
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (ordersError) {
        console.error('Error fetching orders:', ordersError)
        throw ordersError
      }

      if (!ordersData || ordersData.length === 0) {
        return []
      }

      // Get unique user IDs from orders
      const userIds = [...new Set(ordersData.map(order => order.user_id))]

      // Fetch user profiles separately
      const { data: userProfiles, error: userError } = await supabase
        .from('user_profiles')
        .select('id, full_name, email')
        .in('id', userIds)

      if (userError) {
        console.warn('Error fetching user profiles:', userError)
      }

      // Create a map of user profiles for quick lookup
      const userProfilesMap = new Map()
      if (userProfiles) {
        userProfiles.forEach(profile => {
          userProfilesMap.set(profile.id, profile)
        })
      }

      // Get order items for all orders
      const orderIds = ordersData.map(order => order.id)
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          id,
          order_id,
          product_id,
          price,
          quantity,
          products(title)
        `)
        .in('order_id', orderIds)

      if (itemsError) {
        console.warn('Error fetching order items:', itemsError)
      }

      // Create a map of order items grouped by order_id
      const orderItemsMap = new Map()
      if (orderItems) {
        orderItems.forEach(item => {
          if (!orderItemsMap.has(item.order_id)) {
            orderItemsMap.set(item.order_id, [])
          }
          orderItemsMap.get(item.order_id).push(item)
        })
      }

      // Combine all data
      const enrichedOrders = ordersData.map(order => ({
        ...order,
        user_profiles: userProfilesMap.get(order.user_id) || null,
        order_items: orderItemsMap.get(order.id) || []
      }))

      return enrichedOrders
    } catch (error) {
      console.error('Error fetching orders:', error)
      throw error
    }
  }

  const updateOrder = async (orderId: string, updates: { status?: string; notes?: string | null }) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId)
        .select()
        .single()

      if (error) throw error

      // Log admin activity
      await supabase.rpc('log_admin_activity', {
        p_action: 'update_order',
        p_table_name: 'orders',
        p_record_id: orderId,
        p_new_values: updates
      })

      return { data, error: null }
    } catch (error) {
      console.error('Error updating order:', error)
      return { data: null, error }
    }
  }

  // Contact Submissions Management
  const getContactSubmissions = async (): Promise<ContactSubmission[]> => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('submitted_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching contact submissions:', error)
      throw error
    }
  }

  const updateContactSubmissionStatus = async (submissionId: string, status: string) => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .update({ status })
        .eq('id', submissionId)
        .select()
        .single()

      if (error) throw error

      // Log admin activity
      await supabase.rpc('log_admin_activity', {
        p_action: 'update_contact_status',
        p_table_name: 'contact_submissions',
        p_record_id: submissionId,
        p_new_values: { status }
      })

      return { data, error: null }
    } catch (error) {
      console.error('Error updating contact submission status:', error)
      return { data: null, error }
    }
  }

  // Categories Management
  const getCategories = async (): Promise<Category[]> => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  }

  const createCategory = async (category: { name: string; description?: string }) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: category.name,
          description: category.description || null,
          is_active: true
        })
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error creating category:', error)
      return { data: null, error }
    }
  }

  const updateCategory = async (categoryId: string, updates: { name?: string; description?: string; is_active?: boolean }) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', categoryId)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error updating category:', error)
      return { data: null, error }
    }
  }

  const deleteCategory = async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId)

      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Error deleting category:', error)
      return { error }
    }
  }

  return {
    isAdmin,
    loading,
    // Statistics
    getAdminStats,
    // User management
    getUsers,
    updateUser,
    deleteUser,
    // Product management
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    // Order management
    getOrders,
    updateOrder,
    // Contact submissions
    getContactSubmissions,
    updateContactSubmissionStatus,
    // Categories
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
  }
}

export type { Order, Category }
