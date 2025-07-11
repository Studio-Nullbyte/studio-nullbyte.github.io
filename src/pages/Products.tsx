import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Filter, Search, Star, Download } from 'lucide-react'

const Products: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = [
    { id: 'all', name: 'All Products', count: 47 },
    { id: 'web', name: 'Web Templates', count: 15 },
    { id: 'notion', name: 'Notion Templates', count: 12 },
    { id: 'ai', name: 'AI Prompts', count: 8 },
    { id: 'docs', name: 'Document Templates', count: 7 },
    { id: 'ui', name: 'UI Components', count: 5 }
  ]

  const products = [
    {
      id: 1,
      title: "Developer Portfolio Kit",
      category: "web",
      price: 49,
      rating: 4.9,
      downloads: 1234,
      description: "Complete portfolio template with dark mode, animations, and responsive design.",
      tags: ["React", "TypeScript", "Tailwind", "Framer Motion"],
      image: "/api/placeholder/400/300",
      featured: true
    },
    {
      id: 2,
      title: "AI Prompt Engineering Library",
      category: "ai",
      price: 29,
      rating: 4.8,
      downloads: 892,
      description: "200+ tested prompts for ChatGPT, Claude, and other AI models.",
      tags: ["ChatGPT", "Claude", "Midjourney", "Productivity"],
      image: "/api/placeholder/400/300",
      featured: true
    },
    {
      id: 3,
      title: "Notion Productivity System",
      category: "notion",
      price: 19,
      rating: 4.7,
      downloads: 2156,
      description: "Complete productivity system with project management and habit tracking.",
      tags: ["Productivity", "GTD", "Projects", "Habits"],
      image: "/api/placeholder/400/300",
      featured: false
    },
    {
      id: 4,
      title: "SaaS Landing Page Template",
      category: "web",
      price: 39,
      rating: 4.8,
      downloads: 567,
      description: "Modern SaaS landing page with conversion-optimized sections.",
      tags: ["React", "Next.js", "Tailwind", "SEO"],
      image: "/api/placeholder/400/300",
      featured: false
    },
    {
      id: 5,
      title: "Technical Documentation Template",
      category: "docs",
      price: 15,
      rating: 4.6,
      downloads: 423,
      description: "Professional documentation template for technical projects.",
      tags: ["Markdown", "Documentation", "Technical", "API"],
      image: "/api/placeholder/400/300",
      featured: false
    },
    {
      id: 6,
      title: "Modern UI Component Library",
      category: "ui",
      price: 59,
      rating: 4.9,
      downloads: 789,
      description: "50+ React components with dark mode and accessibility features.",
      tags: ["React", "Components", "Accessibility", "Storybook"],
      image: "/api/placeholder/400/300",
      featured: true
    }
  ]

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <>
      <Helmet>
        <title>Products - Studio Nullbyte</title>
        <meta name="description" content="Browse our collection of web templates, Notion templates, AI prompts, and more." />
      </Helmet>

      <div className="min-h-screen pt-16 sm:pt-20">
        {/* Header */}
        <section className="py-12 sm:py-16 lg:py-20 bg-code-gray">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-mono font-bold mb-4">
                Browse <span className="text-electric-violet">Products</span>
              </h1>
              <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
                Handcrafted templates and tools to accelerate your next project.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col gap-4 mb-6 sm:mb-8">
                <div className="relative">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-black border border-gray-700 rounded-sm focus:border-electric-violet focus:outline-none font-mono text-sm sm:text-base"
                  />
                </div>
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <span className="text-xs sm:text-sm text-gray-400 font-mono">Filter by category</span>
                </div>
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2 mb-6 sm:mb-8 justify-center sm:justify-start">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-2 sm:px-4 rounded-sm font-mono text-xs sm:text-sm transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-electric-violet text-black'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card group relative"
                >
                  {product.featured && (
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-electric-violet text-black px-2 py-1 rounded-sm text-xs font-mono font-bold z-10">
                      FEATURED
                    </div>
                  )}
                  
                  <div className="aspect-video bg-code-gray-dark rounded-sm mb-4 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-electric-violet font-mono uppercase">
                      {categories.find(cat => cat.id === product.category)?.name.split(' ')[0]}
                    </span>
                    <span className="text-lg sm:text-xl font-mono font-bold text-electric-violet">
                      ${product.price}
                    </span>
                  </div>
                  
                  <h3 className="text-base sm:text-lg font-mono font-bold mb-2 group-hover:text-electric-violet transition-colors">
                    {product.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 text-xs sm:text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
                      <span>{product.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{product.downloads.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-sm"
                      >
                        {tag}
                      </span>
                    ))}
                    {product.tags.length > 3 && (
                      <span className="text-xs text-gray-400">
                        +{product.tags.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <button className="btn-primary w-full">
                    View Details
                  </button>
                </motion.div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 font-mono">
                  No products found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}

export default Products
