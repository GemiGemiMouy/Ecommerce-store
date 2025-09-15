import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { Product } from "../types";
import { CartContext } from "../context/CartContext";
import { fetchProducts } from "../services/api";

const Home: React.FC = () => {
  const context = useContext(CartContext);
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero slider images
  const heroImages = [
    {
      id: 1,
      image: "https://i.pinimg.com/1200x/db/0b/f6/db0bf6abc011c7a6621e7b8db6b18a1d.jpg",
      title: "Fashion Forward",
      subtitle: "Discover the latest trends in modern fashion",
      cta: "Shop Fashion"
    },
    {
      id: 2,
      image: "https://i.pinimg.com/1200x/79/3a/23/793a23e36432732908af5b4ea75e27aa.jpg",
      title: "Tech Innovation",
      subtitle: "Cutting-edge technology meets premium design",
      cta: "Explore Tech"
    },
    {
      id: 3,
      image: "https://i.pinimg.com/736x/19/a8/ec/19a8ec7d65432b804e45295f0d647933.jpg",
      title: "Lifestyle Essentials",
      subtitle: "Everything you need for your modern lifestyle",
      cta: "Shop Lifestyle"
    },
    {
      id: 4,
      image: "https://i.pinimg.com/736x/2d/77/a5/2d77a589c424b8e6cc5855265c768eb2.jpg",
      title: "Premium Quality",
      subtitle: "Handpicked products for discerning customers",
      cta: "Discover Premium"
    }
  ];

  // Featured categories
  const categories = [
    {
      id: 1,
      name: "Fashion",
      image: "https://i.pinimg.com/736x/62/84/7c/62847c7b24286532100aa615745c6b0c.jpg",
      description: "Trendy & Modern",
      link: "/products?category=fashion"
    },
    {
      id: 2,
      name: "Technology",
      image: "https://i.pinimg.com/736x/e2/29/67/e229672c83df7d5ffafcf6ec258a8bd7.jpg",
      description: "Cutting-Edge Tech",
      link: "/products?category=technology"
    },
    {
      id: 3,
      name: "Accessories",
      image: "https://i.pinimg.com/1200x/79/a3/a5/79a3a523f1f364e59fc89b5087b184dd.jpg",
      description: "Style & Function",
      link: "/products?category=accessories"
    },
    {
      id: 4,
      name: "Lifestyle",
      image: "https://i.pinimg.com/736x/ab/bd/f7/abbdf74a39f4c134a2a8f5390d6844f3.jpg",
      description: "Home & Living",
      link: "/products?category=lifestyle"
    }
  ];

  // Testimonials
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Fashion Blogger",
      image: "https://i.pinimg.com/736x/e3/5f/43/e35f434bbd812b92b6d536d455f30508.jpg",
      rating: 5,
      text: "Amazing quality and fast shipping! The products exceeded my expectations."
    },
    {
      id: 2,
      name: "Mike Chen",
      role: "Tech Enthusiast",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&auto=format&q=80",
      rating: 5,
      text: "Best tech products I've found online. Great customer service too!"
    },
    {
      id: 3,
      name: "Emma Davis",
      role: "Lifestyle Influencer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face&auto=format&q=80",
      rating: 5,
      text: "Love the curated selection. Everything is so stylish and functional!"
    }
  ];

  // Brand partners
  const brandPartners = [
    { 
      name: "Apple", 
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      ), 
      color: "from-gray-800 to-gray-900" 
    },
    { 
      name: "Samsung", 
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      ), 
      color: "from-blue-600 to-blue-800" 
    },
    { 
      name: "Nike", 
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 7.8C20.4 4.2 15.4 2 9.7 2 4.2 2 0 6.2 0 11.7c0 2.1.5 4.1 1.4 5.9.9 1.8 2.2 3.4 3.8 4.6 1.6 1.2 3.4 2 5.4 2.3 2 .3 4.1.1 6-.6 1.9-.7 3.6-1.9 5-3.4 1.4-1.5 2.5-3.3 3.1-5.3.6-2 .7-4.1.3-6.1-.4-2-1.3-3.8-2.6-5.3z"/>
        </svg>
      ), 
      color: "from-orange-500 to-red-600" 
    },
    { 
      name: "Adidas", 
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      ), 
      color: "from-black to-gray-800" 
    },
    { 
      name: "Sony", 
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
        </svg>
      ), 
      color: "from-purple-600 to-purple-800" 
    },
    { 
      name: "Canon", 
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2l1.09-3.63L7.5 9.5l3.63-1.09L12 5l1.87 3.41L17.5 9.5l-1.09 3.63L18 16l-3.41 1.87L12 21l-1.87-3.41L6.5 16z"/>
        </svg>
      ), 
      color: "from-red-500 to-red-700" 
    }
  ];

  useEffect(() => {
    fetchProducts().then(data => {
      setProducts(data);
      setFeaturedProducts(data.slice(0, 6)); // Show first 6 as featured
    });
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroImages.length]);

  if (!context) return <div className="p-4">Loading...</div>;
  const { addToCart } = context;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* 1. Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          {heroImages.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ${
                index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
            </div>
          ))}
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-4xl">
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full mb-4 animate-fade-in">
                  ✨ Premium Collection
                </span>
              </div>
              <h1 className="text-6xl sm:text-8xl font-bold text-white mb-8 animate-fade-in leading-tight tracking-tight">
                {heroImages[currentSlide].title}
              </h1>
              <p className="text-2xl sm:text-3xl mb-10 text-gray-200 animate-fade-in-delay max-w-3xl leading-relaxed">
                {heroImages[currentSlide].subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-6 animate-fade-in-delay-2">
                <Link
                  to="/products"
                  className="group px-10 py-5 bg-white text-gray-900 font-bold rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl text-center text-lg flex items-center justify-center space-x-3"
                >
                  <span>Shop Now</span>
                  <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  to="/about"
                  className="px-10 py-5 border-2 border-white text-white font-bold rounded-2xl hover:bg-white hover:text-gray-900 transition-all duration-300 text-center text-lg backdrop-blur-sm"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-4">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white scale-125 shadow-lg' 
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75 hover:scale-110'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
          className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20 p-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-2xl transition-all duration-300 hover:scale-110"
        >
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroImages.length)}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 p-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-2xl transition-all duration-300 hover:scale-110"
        >
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </section>

      {/* 2. Value Proposition / Trust Badges */}
      <section className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Choose GeminiStore?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to providing you with the best shopping experience possible
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group text-center p-8 hover:bg-gray-50 rounded-3xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <svg className="w-10 h-10 text-gray-700 group-hover:text-gray-900 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m6 4.5v-3a3 3 0 00-3-3H6.75a3 3 0 00-3 3v3m0 0V9.75a3 3 0 013-3h1.5a3 3 0 013 3v9m-9 0h9" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-gray-700 transition-colors duration-300">Free Shipping</h3>
              <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 transition-colors duration-300 leading-relaxed">Free shipping on orders over $50. Fast and reliable delivery worldwide.</p>
            </div>
            
            <div className="group text-center p-8 hover:bg-gray-50 rounded-3xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <svg className="w-10 h-10 text-gray-700 group-hover:text-gray-900 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-gray-700 transition-colors duration-300">Quality Guarantee</h3>
              <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 transition-colors duration-300 leading-relaxed">Premium quality products with 30-day money-back guarantee.</p>
            </div>
            
            <div className="group text-center p-8 hover:bg-gray-50 rounded-3xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <svg className="w-10 h-10 text-gray-700 group-hover:text-gray-900 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-gray-700 transition-colors duration-300">Secure Payment</h3>
              <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 transition-colors duration-300 leading-relaxed">Safe and secure payment processing with SSL encryption.</p>
            </div>

            <div className="group text-center p-8 hover:bg-gray-50 rounded-3xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <svg className="w-10 h-10 text-gray-700 group-hover:text-gray-900 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM7.5 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-gray-700 transition-colors duration-300">24/7 Support</h3>
              <p className="text-gray-600  dark:text-gray-400 group-hover:text-gray-800 transition-colors duration-300 leading-relaxed">Round-the-clock customer support for all your needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Categories */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Discover our curated collections across different categories
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map(category => (
              <Link
                key={category.id}
                to={category.link}
                className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
              >
                <div className="aspect-w-16 aspect-h-12">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-8 left-8 text-white">
                    <h3 className="text-3xl font-bold mb-2 group-hover:text-gray-200 transition-colors duration-300">{category.name}</h3>
                    <p className="text-gray-300 text-lg group-hover:text-gray-100 transition-colors duration-300">{category.description}</p>
                    <div className="mt-4 flex items-center text-white group-hover:text-gray-200 transition-colors duration-300">
                      <span className="text-sm font-semibold">Explore Collection</span>
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Products */}
      <section className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Discover our handpicked selection of premium products, carefully curated for quality and style.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
          
          <div className="text-center">
            <Link
              to="/products"
              className="group inline-flex items-center px-10 py-5 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              <span>View All Products</span>
              <svg className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Promotions / Banners */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Summer Sale Banner */}
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 p-10 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold mr-4 group-hover:bg-white/30 transition-colors duration-300">🔥 HOT DEAL</span>
                  <span className="text-sm opacity-90">Limited Time</span>
                </div>
                <h3 className="text-5xl font-bold mb-3 group-hover:text-gray-200 transition-colors duration-300">Summer Sale</h3>
                <p className="text-2xl mb-3 font-bold text-gray-300 group-hover:text-white transition-colors duration-300">Up to 30% off</p>
                <p className="text-gray-400 mb-8 text-lg group-hover:text-gray-300 transition-colors duration-300">Selected items only - Don't miss out!</p>
                <Link
                  to="/products?sale=true"
                  className="group/btn inline-flex items-center px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  <span>Shop Sale Now</span>
                  <svg className="ml-3 w-6 h-6 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-24 translate-x-24 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-20 -translate-x-20 group-hover:scale-110 transition-transform duration-500"></div>
            </div>

            {/* New Arrivals Banner */}
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-700 to-gray-800 p-10 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold mr-4 group-hover:bg-white/30 transition-colors duration-300">✨ NEW</span>
                  <span className="text-sm opacity-90">Just Launched</span>
                </div>
                <h3 className="text-5xl font-bold mb-3 group-hover:text-gray-200 transition-colors duration-300">New Arrivals</h3>
                <p className="text-2xl mb-3 font-bold text-gray-300 group-hover:text-white transition-colors duration-300">Fresh Styles</p>
                <p className="text-gray-400 mb-8 text-lg group-hover:text-gray-300 transition-colors duration-300">Be the first to discover our latest collection</p>
                <Link
                  to="/products?new=true"
                  className="group/btn inline-flex items-center px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  <span>Explore New</span>
                  <svg className="ml-3 w-6 h-6 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-24 translate-x-24 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-20 -translate-x-20 group-hover:scale-110 transition-transform duration-500"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Customer Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="group bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-5 shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 text-lg group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-6 h-6 text-yellow-400 group-hover:text-yellow-500 transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-400 italic text-lg leading-relaxed group-hover:text-gray-800  dark:group-hover:text-gray-200 transition-colors duration-300">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Newsletter Signup */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Stay Updated
          </h2>
          <p className="text-gray-300 mb-4 text-xl max-w-3xl mx-auto leading-relaxed">
            Subscribe to our newsletter and be the first to know about new products, exclusive offers, and special discounts.
          </p>
          <p className="text-yellow-400 font-bold mb-10 text-lg">
            Get 10% off your first order!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-white text-gray-900 text-lg placeholder-gray-500"
            />
            <button className="px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
              Subscribe
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-6">
            No spam, unsubscribe at any time
          </p>
        </div>
      </section>

      {/* 8. Social Proof Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Leading Brands
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We partner with the world's most innovative brands to bring you the best products
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {brandPartners.map((brand, index) => (
              <div key={index} className="group text-center p-8 hover:bg-gray-50 rounded-3xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
                <div className={`w-20 h-20 bg-gradient-to-br ${brand.color} rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <div className="text-white">
                    {brand.icon}
                  </div>
                </div>
                <p className="text-gray-700 font-bold text-lg group-hover:text-gray-900 transition-colors duration-300">{brand.name}</p>
              </div>
          ))}
        </div>
      </div>
      </section>
    </div>
  );
};

export default Home;
