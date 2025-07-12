import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  Package, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff,
  Search,
  Filter,
  Star,
  AlertCircle,
  CheckCircle,
  Save,
  X
} from 'lucide-react'
import { useAdmin, type Category } from '../hooks/useAdmin'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'

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

export default function AdminProducts() {
  const { isAdmin, loading, getProducts, getCategories, createProduct, updateProduct, deleteProduct } = useAdmin()
  const navigate = useNavigate()
  
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showActiveOnly, setShowActiveOnly] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    download_url: '',
    preview_url: '',
    tags: '',
    featured: false,
    active: true
  })

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/')
    }
  }, [isAdmin, loading, navigate])

  useEffect(() => {
    const fetchData = async () => {
      if (isAdmin) {
        try {
          const [productsData, categoriesData] = await Promise.all([
            getProducts(),
            getCategories()
          ])
          setProducts(productsData)
          setCategories(categoriesData)
        } catch (error) {
          setError('Failed to load products')
        } finally {
          setProductsLoading(false)
        }
      }
    }

    fetchData()
  }, [isAdmin, getProducts, getCategories])

  // Filter products
  useEffect(() => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category_id === selectedCategory)
    }

    if (showActiveOnly) {
      filtered = filtered.filter(product => product.active)
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedCategory, showActiveOnly])

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      category_id: '',
      image_url: '',
      download_url: '',
      preview_url: '',
      tags: '',
      featured: false,
      active: true
    })
    setEditingProduct(null)
    setIsFormOpen(false)
    setError('')
    setMessage('')
  }

  const openCreateForm = () => {
    resetForm()
    setIsFormOpen(true)
  }

  const openEditForm = (product: Product) => {
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      category_id: product.category_id,
      image_url: product.image_url || '',
      download_url: product.download_url || '',
      preview_url: product.preview_url || '',
      tags: product.tags.join(', '),
      featured: product.featured,
      active: product.active
    })
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setError('')

    try {
      const productData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category_id: formData.category_id,
        image_url: formData.image_url.trim() || null,
        download_url: formData.download_url.trim() || null,
        preview_url: formData.preview_url.trim() || null,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        featured: formData.featured,
        active: formData.active
      }

      let result
      if (editingProduct) {
        result = await updateProduct(editingProduct.id, productData)
      } else {
        result = await createProduct(productData)
      }

      if (result.error) {
        setError('Failed to save product')
      } else {
        setMessage(editingProduct ? 'Product updated successfully!' : 'Product created successfully!')
        
        // Refresh products list
        const updatedProducts = await getProducts()
        setProducts(updatedProducts)
        
        setTimeout(() => {
          resetForm()
        }, 1500)
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (productId: string, productTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${productTitle}"? This action cannot be undone.`)) {
      return
    }

    try {
      const result = await deleteProduct(productId)
      if (result.error) {
        setError('Failed to delete product')
      } else {
        setMessage('Product deleted successfully!')
        
        // Remove from local state
        setProducts(products.filter(p => p.id !== productId))
      }
    } catch (error) {
      setError('An unexpected error occurred')
    }
  }

  if (loading || productsLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-violet"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>Manage Products - Admin - Studio Nullbyte</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="pb-6">
        <div className="w-full px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Package className="w-6 h-6 text-electric-violet" />
                  <h1 className="text-3xl font-mono text-white">Manage Products</h1>
                </div>
                <button
                  onClick={openCreateForm}
                  className="flex items-center gap-2 bg-electric-violet hover:bg-electric-violet-light text-white font-mono px-4 py-2 rounded transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
              </div>
              <p className="text-gray-400 font-mono">
                Manage your template catalog and product listings
              </p>
            </div>

            {/* Status Messages */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-terminal-green/10 border border-terminal-green/30 rounded p-3 mb-6"
              >
                <CheckCircle className="w-4 h-4 text-terminal-green" />
                <span className="text-sm font-mono text-terminal-green">{message}</span>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded p-3 mb-6"
              >
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-sm font-mono text-red-400">{error}</span>
              </motion.div>
            )}

            {/* Filters */}
            <div className="bg-code-gray-light border border-gray-700 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-code-gray border border-gray-600 pl-10 pr-4 py-2 rounded font-mono text-white placeholder-gray-500 focus:outline-none focus:border-electric-violet transition-colors"
                  />
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-code-gray border border-gray-600 pl-10 pr-4 py-2 rounded font-mono text-white focus:outline-none focus:border-electric-violet transition-colors appearance-none"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Active Filter */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showActiveOnly}
                    onChange={(e) => setShowActiveOnly(e.target.checked)}
                    className="w-4 h-4 text-electric-violet bg-code-gray border-gray-600 rounded focus:ring-electric-violet focus:ring-2"
                  />
                  <span className="font-mono text-white text-sm">Active only</span>
                </label>

                {/* Results Count */}
                <div className="flex items-center justify-end">
                  <span className="font-mono text-gray-400 text-sm">
                    {filteredProducts.length} of {products.length} products
                  </span>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-code-gray-light border rounded-lg overflow-hidden hover:border-electric-violet/50 transition-colors ${
                    !product.active ? 'opacity-60' : ''
                  }`}
                >
                  {/* Product Image */}
                  <div className="aspect-video bg-code-gray relative">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-gray-600" />
                      </div>
                    )}
                    
                    {/* Status Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {product.featured && (
                        <span className="flex items-center gap-1 bg-yellow-500/90 text-black px-2 py-1 rounded text-xs font-mono">
                          <Star className="w-3 h-3" />
                          Featured
                        </span>
                      )}
                      {!product.active && (
                        <span className="flex items-center gap-1 bg-red-500/90 text-white px-2 py-1 rounded text-xs font-mono">
                          <EyeOff className="w-3 h-3" />
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-mono text-white font-semibold line-clamp-1">
                        {product.title}
                      </h3>
                      <span className="font-mono text-electric-violet font-bold">
                        ${product.price}
                      </span>
                    </div>
                    
                    <p className="text-gray-400 font-mono text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 font-mono">
                        {product.category?.name}
                      </span>
                      <span className="text-gray-500 font-mono">
                        {new Date(product.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Tags */}
                    {product.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {product.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="bg-code-gray text-gray-300 px-2 py-1 rounded text-xs font-mono"
                          >
                            {tag}
                          </span>
                        ))}
                        {product.tags.length > 3 && (
                          <span className="text-gray-500 text-xs font-mono">
                            +{product.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-700">
                      <button
                        onClick={() => openEditForm(product)}
                        className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-mono transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                        Edit
                      </button>
                      
                      {product.preview_url && (
                        <a
                          href={product.preview_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-mono transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          Preview
                        </a>
                      )}
                      
                      <button
                        onClick={() => handleDelete(product.id, product.title)}
                        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-mono transition-colors ml-auto"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredProducts.length === 0 && !productsLoading && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-mono text-gray-400 mb-2">No products found</h3>
                <p className="text-gray-500 font-mono text-sm mb-6">
                  {searchTerm || selectedCategory ? 'Try adjusting your filters' : 'Get started by adding your first product'}
                </p>
                {!searchTerm && !selectedCategory && (
                  <button
                    onClick={openCreateForm}
                    className="bg-electric-violet hover:bg-electric-violet-light text-white font-mono py-2 px-4 rounded transition-colors"
                  >
                    Add First Product
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Product Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-code-gray-light border border-gray-700 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <form onSubmit={handleSubmit} className="p-6">
              {/* Form Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-mono text-white">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-mono text-gray-300 mb-2">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-code-gray border border-gray-600 px-4 py-3 rounded font-mono text-white placeholder-gray-500 focus:outline-none focus:border-electric-violet transition-colors"
                    placeholder="Enter product title"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-mono text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full bg-code-gray border border-gray-600 px-4 py-3 rounded font-mono text-white placeholder-gray-500 focus:outline-none focus:border-electric-violet transition-colors resize-none"
                    placeholder="Enter product description"
                    required
                  />
                </div>

                {/* Price & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-mono text-gray-300 mb-2">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full bg-code-gray border border-gray-600 px-4 py-3 rounded font-mono text-white placeholder-gray-500 focus:outline-none focus:border-electric-violet transition-colors"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-mono text-gray-300 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                      className="w-full bg-code-gray border border-gray-600 px-4 py-3 rounded font-mono text-white focus:outline-none focus:border-electric-violet transition-colors"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* URLs */}
                <div>
                  <label className="block text-sm font-mono text-gray-300 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    className="w-full bg-code-gray border border-gray-600 px-4 py-3 rounded font-mono text-white placeholder-gray-500 focus:outline-none focus:border-electric-violet transition-colors"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-mono text-gray-300 mb-2">
                    Download URL
                  </label>
                  <input
                    type="url"
                    value={formData.download_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, download_url: e.target.value }))}
                    className="w-full bg-code-gray border border-gray-600 px-4 py-3 rounded font-mono text-white placeholder-gray-500 focus:outline-none focus:border-electric-violet transition-colors"
                    placeholder="https://example.com/download"
                  />
                </div>

                <div>
                  <label className="block text-sm font-mono text-gray-300 mb-2">
                    Preview URL
                  </label>
                  <input
                    type="url"
                    value={formData.preview_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, preview_url: e.target.value }))}
                    className="w-full bg-code-gray border border-gray-600 px-4 py-3 rounded font-mono text-white placeholder-gray-500 focus:outline-none focus:border-electric-violet transition-colors"
                    placeholder="https://example.com/preview"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-mono text-gray-300 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full bg-code-gray border border-gray-600 px-4 py-3 rounded font-mono text-white placeholder-gray-500 focus:outline-none focus:border-electric-violet transition-colors"
                    placeholder="React, TypeScript, Template"
                  />
                </div>

                {/* Checkboxes */}
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="w-4 h-4 text-electric-violet bg-code-gray border-gray-600 rounded focus:ring-electric-violet focus:ring-2"
                    />
                    <span className="font-mono text-white text-sm">Featured Product</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                      className="w-4 h-4 text-electric-violet bg-code-gray border-gray-600 rounded focus:ring-electric-violet focus:ring-2"
                    />
                    <span className="font-mono text-white text-sm">Active</span>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-700">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex items-center gap-2 bg-electric-violet hover:bg-electric-violet-light disabled:opacity-50 disabled:cursor-not-allowed text-white font-mono py-3 px-6 rounded transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {formLoading ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
                
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-mono py-3 px-6 rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  )
}
