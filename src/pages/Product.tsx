import React from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Star, Download, Heart, Share2, ArrowLeft, Check } from 'lucide-react'

const Product: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  // Mock product data - in real app, this would come from an API
  const product = {
    id: 1,
    title: "Developer Portfolio Kit",
    category: "Web Template",
    price: 49,
    originalPrice: 79,
    rating: 4.9,
    reviews: 127,
    downloads: 1234,
    description: "A complete portfolio template designed for developers who want to showcase their work with style. Features dark mode, smooth animations, and responsive design.",
    longDescription: "This comprehensive portfolio kit includes everything you need to create a professional developer portfolio. Built with React, TypeScript, and Tailwind CSS, it features a modern design with smooth animations, dark/light mode toggle, and full responsiveness across all devices.",
    features: [
      "React 18 + TypeScript",
      "Tailwind CSS styling",
      "Dark/Light mode toggle",
      "Framer Motion animations",
      "Responsive design",
      "SEO optimized",
      "Fast loading performance",
      "Clean, modern code"
    ],
    includes: [
      "Complete source code",
      "Documentation",
      "Setup guide",
      "Custom components",
      "Sample content",
      "Deployment guide"
    ],
    tags: ["React", "TypeScript", "Tailwind", "Framer Motion", "Portfolio", "Developer"],
    images: [
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600"
    ],
    demoUrl: "https://demo.studio-nullbyte.com/portfolio",
    githubUrl: "https://github.com/studio-nullbyte/portfolio-kit"
  }

  return (
    <>
      <Helmet>
        <title>{product.title} - Studio Nullbyte</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="min-h-screen pt-20">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-8">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center text-gray-400 hover:text-white transition-colors font-mono text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </button>
        </div>

        {/* Product Header */}
        <section className="py-12 bg-code-gray">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="aspect-video bg-code-gray-dark rounded-sm overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {product.images.slice(1).map((image, index) => (
                    <div key={index} className="aspect-square bg-code-gray-dark rounded-sm overflow-hidden">
                      <img
                        src={image}
                        alt={`${product.title} ${index + 2}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-electric-violet font-mono">
                    {product.category}
                  </span>
                  <span className="text-gray-400">•</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm">{product.rating}</span>
                    <span className="text-gray-400 text-sm">({product.reviews} reviews)</span>
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-mono font-bold mb-4">
                  {product.title}
                </h1>

                <p className="text-gray-400 text-lg mb-6">
                  {product.description}
                </p>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-mono font-bold text-electric-violet">
                      ${product.price}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      ${product.originalPrice}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <Download className="w-4 h-4" />
                    <span>{product.downloads.toLocaleString()} downloads</span>
                  </div>
                </div>

                <div className="flex gap-4 mb-6">
                  <button className="btn-primary flex-1">
                    Add to Cart - ${product.price}
                  </button>
                  <button className="btn-secondary">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="btn-secondary">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex gap-4 mb-8">
                  <a
                    href={product.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost"
                  >
                    Live Demo
                  </a>
                  <a
                    href={product.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost"
                  >
                    View Code
                  </a>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Details */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-mono font-bold mb-6">
                  About This Template
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-400 leading-relaxed">
                    {product.longDescription}
                  </p>
                </div>

                <h3 className="text-xl font-mono font-bold mt-8 mb-4">
                  Key Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-electric-violet" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="card">
                  <h3 className="text-xl font-mono font-bold mb-4">
                    What's Included
                  </h3>
                  <ul className="space-y-3">
                    {product.includes.map((item, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="w-4 h-4 text-electric-violet" />
                        <span className="text-gray-300 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="card mt-6">
                  <h3 className="text-xl font-mono font-bold mb-4">
                    License
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Single-use license for personal and commercial projects. 
                    Full source code included with lifetime updates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Product
