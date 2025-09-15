import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { Product } from "../types";
import { fetchProductById, fetchProducts } from "../services/api";
import { CartContext } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import ProductReviews from "../components/ProductReviews";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("Black");
  const [selectedSize, setSelectedSize] = useState("M");
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const context = useContext(CartContext);

  useEffect(() => {
    if (id) {
      fetchProductById(Number(id)).then(p => p && setProduct(p));
      fetchProducts().then(products => {
        const related = products
          .filter(p => p.category === product?.category && p.id !== Number(id))
          .slice(0, 4);
        setRelatedProducts(related);
      });
    }
  }, [id, product?.category]);

  if (!product || !context)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading product...</p>
        </div>
      </div>
    );

  const { addToCart } = context;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 3000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = "/checkout";
  };

  const handleWishlist = () => setIsWishlisted(!isWishlisted);

  const productImages = product.images?.length ? product.images : [product.image];

  const stockCount = product.stock || 0;
  const isLowStock = stockCount > 0 && stockCount <= 5;
  const isOutOfStock = stockCount === 0;
  const deliveryEstimate = "2-3 business days";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Breadcrumb */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Link to="/" className="hover:text-gray-900 dark:hover:text-white flex items-center gap-1">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-gray-900 dark:hover:text-white">
            Products
          </Link>
          <span>/</span>
          <span className="font-semibold text-gray-900 dark:text-white truncate max-w-xs">
            {product.title}
          </span>
        </div>
      </div>

      {/* Main Section */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Image Gallery */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl">
            <img
              src={productImages[selectedImage]}
            alt={product.title}
              className="w-full h-[500px] object-cover transition-transform duration-500 hover:scale-105 cursor-zoom-in rounded-3xl"
          />
        </div>
          <div className="grid grid-cols-4 gap-3">
            {productImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`aspect-square rounded-xl border-2 overflow-hidden ${
                  selectedImage === idx
                    ? "border-gray-900 dark:border-white shadow-lg"
                    : "border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400"
                }`}
              >
                <img src={img} alt={`${product.title} ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          <span className="text-sm text-gray-500 dark:text-gray-400">{product.category}</span>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{product.title}</h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.rating || 0) ? "text-yellow-400" : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
              <span className="ml-2 text-gray-700 dark:text-gray-300 font-semibold">{product.rating || 0}</span>
            </div>
            <span className="text-gray-500 dark:text-gray-400">({product.reviewCount || 0} reviews)</span>
          </div>

          <div className="text-3xl font-bold text-gray-900 dark:text-white">${product.price}</div>
          <p className="text-gray-600 dark:text-gray-400">{product.description}</p>

          {/* Color & Size Options */}
          <div className="space-y-6">
            {/* Color Selection */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-lg">Color</h3>
              <div className="flex flex-wrap gap-3">
                {["Black", "White", "Gray", "Navy"].map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`group relative px-6 py-3 rounded-xl border-2 font-medium transition-all duration-300 hover:scale-105 ${
                      selectedColor === color
                        ? "border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg transform scale-105"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                    }`}
                  >
                    <span className="relative z-10">{color}</span>
                    {selectedColor === color && (
                      <div className="absolute inset-0 bg-gray-900 dark:bg-white rounded-xl animate-pulse opacity-20"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-lg">Size</h3>
              <div className="flex flex-wrap gap-3">
                {["XS", "S", "M", "L", "XL"].map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`group relative px-6 py-3 rounded-xl border-2 font-medium transition-all duration-300 hover:scale-105 ${
                      selectedSize === size
                        ? "border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg transform scale-105"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                    }`}
                  >
                    <span className="relative z-10">{size}</span>
                    {selectedSize === size && (
                      <div className="absolute inset-0 bg-gray-900 dark:bg-white rounded-xl animate-pulse opacity-20"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-900 dark:text-white">Quantity:</span>
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            >
              -
            </button>
            <span className="font-semibold text-gray-900 dark:text-white">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            >
              +
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full py-3 rounded-2xl font-bold transition ${
                isAdded
                  ? "bg-green-500 text-white"
                  : isOutOfStock
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-gray-700"
              }`}
            >
              {isAdded ? "Added to Cart!" : "Add to Cart"}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="w-full py-3 rounded-2xl border-2 border-gray-900 dark:border-white font-bold text-gray-900 dark:text-white hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition"
            >
              Buy Now
            </button>
          <button
              onClick={handleWishlist}
              className={`w-full py-3 rounded-2xl border-2 font-semibold transition ${
                isWishlisted 
                  ? "border-red-500 text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400" 
                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              {isWishlisted ? "Saved to Wishlist" : "Save to Wishlist"}
          </button>
        </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <ProductReviews />
      </div>
    </div>
  );
};

export default ProductDetail;
