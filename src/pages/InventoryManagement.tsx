import React, { useState, useEffect } from "react";
import { Product } from "../types";
import { fetchProducts, updateProductStock } from "../services/api";

interface StockAlert {
  id: number;
  productId: number;
  productName: string;
  currentStock: number;
  threshold: number;
  type: 'low' | 'out';
  date: string;
}

const InventoryManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [stockUpdate, setStockUpdate] = useState({ quantity: 0, operation: 'add' as 'add' | 'subtract' });
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    generateStockAlerts();
  }, [products, lowStockThreshold]);

  const loadProducts = async () => {
    try {
      const productsData = await fetchProducts();
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateStockAlerts = () => {
    const alerts: StockAlert[] = [];
    
    products.forEach(product => {
      const stock = product.stock || 0;
      
      if (stock === 0) {
        alerts.push({
          id: Date.now() + Math.random(),
          productId: product.id,
          productName: product.title,
          currentStock: stock,
          threshold: lowStockThreshold,
          type: 'out',
          date: new Date().toISOString()
        });
      } else if (stock <= lowStockThreshold) {
        alerts.push({
          id: Date.now() + Math.random(),
          productId: product.id,
          productName: product.title,
          currentStock: stock,
          threshold: lowStockThreshold,
          type: 'low',
          date: new Date().toISOString()
        });
      }
    });
    
    setStockAlerts(alerts);
  };

  const handleStockUpdate = async () => {
    if (!selectedProduct) return;

    try {
      const newStock = stockUpdate.operation === 'add' 
        ? (selectedProduct.stock || 0) + stockUpdate.quantity
        : Math.max(0, (selectedProduct.stock || 0) - stockUpdate.quantity);

      // Update the product in the products array
      setProducts(prev => prev.map(p => 
        p.id === selectedProduct.id 
          ? { ...p, stock: newStock }
          : p
      ));

      // Reset form
      setStockUpdate({ quantity: 0, operation: 'add' });
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { status: 'Out of Stock', color: 'text-red-600 bg-red-100' };
    if (stock <= lowStockThreshold) return { status: 'Low Stock', color: 'text-yellow-600 bg-yellow-100' };
    return { status: 'In Stock', color: 'text-green-600 bg-green-100' };
  };

  const totalProducts = products.length;
  const inStockProducts = products.filter(p => (p.stock || 0) > lowStockThreshold).length;
  const lowStockProducts = products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= lowStockThreshold).length;
  const outOfStockProducts = products.filter(p => (p.stock || 0) === 0).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Inventory Management</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Track and manage your product inventory</p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Low Stock Threshold:</label>
              <input
                type="number"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Inventory Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-2xl">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Products</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-2xl">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Stock</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{inStockProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-2xl">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Low Stock</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{lowStockProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-2xl">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Out of Stock</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{outOfStockProducts}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Alerts */}
        {stockAlerts.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Stock Alerts</h2>
            <div className="space-y-4">
              {stockAlerts.map(alert => (
                <div key={alert.id} className={`p-4 rounded-xl border-l-4 ${
                  alert.type === 'out' ? 'bg-red-50 border-red-500' : 'bg-yellow-50 border-yellow-500'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{alert.productName}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Current stock: {alert.currentStock} units
                        {alert.type === 'low' && ` (below threshold of ${alert.threshold})`}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      alert.type === 'out' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {alert.type === 'out' ? 'Out of Stock' : 'Low Stock'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inventory Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Product Inventory</h2>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Inventory Value: <span className="font-bold text-gray-900 dark:text-white">${totalValue.toFixed(2)}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-2 font-semibold text-gray-900 dark:text-white">Product</th>
                  <th className="text-left py-4 px-2 font-semibold text-gray-900 dark:text-white">Category</th>
                  <th className="text-left py-4 px-2 font-semibold text-gray-900 dark:text-white">Price</th>
                  <th className="text-left py-4 px-2 font-semibold text-gray-900 dark:text-white">Stock</th>
                  <th className="text-left py-4 px-2 font-semibold text-gray-900 dark:text-white">Status</th>
                  <th className="text-left py-4 px-2 font-semibold text-gray-900 dark:text-white">Value</th>
                  <th className="text-left py-4 px-2 font-semibold text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => {
                  const stockStatus = getStockStatus(product.stock || 0);
                  const inventoryValue = product.price * (product.stock || 0);
                  
                  return (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 dark:bg-gray-900">
                      <td className="py-4 px-2">
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{product.title}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">ID: {product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-gray-700">{product.category}</td>
                      <td className="py-4 px-2 font-semibold text-gray-900 dark:text-white">${product.price}</td>
                      <td className="py-4 px-2 font-semibold text-gray-900 dark:text-white">{product.stock || 0}</td>
                      <td className="py-4 px-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${stockStatus.color}`}>
                          {stockStatus.status}
                        </span>
                      </td>
                      <td className="py-4 px-2 font-semibold text-gray-900 dark:text-white">${inventoryValue.toFixed(2)}</td>
                      <td className="py-4 px-2">
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-all duration-300"
                        >
                          Update Stock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Update Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Update Stock</h3>
              
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedProduct.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Current stock: {selectedProduct.stock || 0}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Operation</label>
                  <select
                    value={stockUpdate.operation}
                    onChange={(e) => setStockUpdate(prev => ({ ...prev, operation: e.target.value as 'add' | 'subtract' }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option value="add">Add Stock</option>
                    <option value="subtract">Subtract Stock</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    value={stockUpdate.quantity}
                    onChange={(e) => setStockUpdate(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    min="1"
                    required
                  />
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    New stock will be:{' '}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {stockUpdate.operation === 'add' 
                        ? (selectedProduct.stock || 0) + stockUpdate.quantity
                        : Math.max(0, (selectedProduct.stock || 0) - stockUpdate.quantity)
                      }
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex space-x-4 mt-8">
                <button
                  onClick={handleStockUpdate}
                  className="flex-1 px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all duration-300"
                >
                  Update Stock
                </button>
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    setStockUpdate({ quantity: 0, operation: 'add' });
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 dark:bg-gray-900 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryManagement;
