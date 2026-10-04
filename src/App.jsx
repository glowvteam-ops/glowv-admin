import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import { adminApi } from './services/adminApi';

// Page Imports
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import AddProductPage from './pages/AddProductPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import CustomersPage from './pages/CustomersPage';
import CategoriesPage from './pages/CategoriesPage';
import InventoryPage from './pages/InventoryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';

import './App.css';

const normalizeProductForUi = (product) => {
  const status = product?.status === 'ACTIVE' || product?.isActive === true ? 'Active'
    : product?.status === 'INACTIVE' ? 'Inactive'
    : product?.status === 'ARCHIVED' ? 'Inactive'
    : 'Active';

  return {
    id: product?.id ?? Date.now(),
    name: product?.name ?? 'Unnamed Product',
    brand: product?.brand ?? 'GlowV',
    category: product?.categoryName ?? product?.category ?? 'Serum',
    price: Number(product?.price ?? 0),
    originalPrice: Number(product?.originalPrice ?? product?.price ?? 0),
    stock: Number(product?.stock ?? 0),
    status,
    image: product?.imageUrl ?? product?.image ?? 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&auto=format&fit=crop&q=80',
    description: product?.description ?? '',
    ingredients: Array.isArray(product?.ingredients) ? product.ingredients.join(', ') : (product?.ingredients ?? ''),
    skinTypes: Array.isArray(product?.skinTypes) ? product.skinTypes : [],
    skinConcerns: Array.isArray(product?.concerns) ? product.concerns : [],
  };
};

const normalizeOrderStatus = (status) => {
  const value = String(status ?? '').trim();
  const normalized = value.toLowerCase().replace(/[_-]+/g, ' ');

  switch (normalized) {
    case 'new':
      return 'New';
    case 'pending':
      return 'Pending';
    case 'confirmed':
      return 'Confirmed';
    case 'packed':
      return 'Packed';
    case 'shipped':
      return 'Shipped';
    case 'out for delivery':
      return 'Out for Delivery';
    case 'delivered':
      return 'Delivered';
    case 'cancelled':
    case 'canceled':
      return 'Cancelled';
    case 'return requested':
      return 'Return Requested';
    case 'returned':
      return 'Returned';
    default:
      return value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Pending';
  }
};

const normalizeOrderForUi = (order) => {
  const customer = order?.customer || {};
  const address = order?.address || {};
  const items = Array.isArray(order?.items) ? order.items : [];
  const totalItems = items.reduce((sum, item) => sum + Number(item?.quantity || 0), 0);
  const formattedAddress = [address.streetAddress, address.city, address.state, address.postalCode, address.country]
    .filter(Boolean)
    .join(', ');

  return {
    id: order?.id ?? order?.orderNumber ?? `#${Date.now()}`,
    rawId: order?.orderNumber ?? order?.rawId ?? order?.id,
    customer: {
      name: customer.name || customer.fullName || 'Customer',
      phone: customer.phone || address.phone || '+91 98765 43210',
      email: customer.email || '',
      address: customer.address || formattedAddress || 'Address unavailable',
      avatar: customer.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    },
    items: items.map((item) => ({
      id: item?.id ?? item?.productId ?? `${Math.random()}`,
      name: item?.name || item?.productName || 'GlowV Product',
      price: Number(item?.price || 0),
      quantity: Number(item?.quantity || 0),
      image: item?.image || item?.imageUrl || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=120&auto=format&fit=crop&q=80',
    })),
    itemsCount: Number(order?.itemsCount ?? (totalItems || items.length)),
    amount: Number(order?.amount ?? order?.total ?? 0),
    subtotal: Number(order?.subtotal ?? order?.amount ?? order?.total ?? 0),
    shipping: Number(order?.shipping ?? 0),
    discount: Number(order?.discount ?? 0),
    date: order?.date || (order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'),
    status: normalizeOrderStatus(order?.status ?? order?.orderStatus ?? 'Pending'),
    orderStatus: order?.orderStatus ?? order?.status ?? 'PENDING',
    paymentStatus: order?.paymentStatus ?? 'PAID',
    createdAt: order?.createdAt ?? order?.created_at,
  };
};

const buildOrderNotifications = (orderList = []) => {
  return orderList.slice(0, 6).map((order, index) => {
    const orderId = order?.rawId || order?.id || `#${index + 1}`;
    const customerName = order?.customer?.name || 'Customer';
    const amount = Number(order?.amount ?? order?.total ?? 0);
    const title = index === 0 ? 'New order received' : 'Order activity';

    return {
      id: `order-${orderId}`,
      title,
      desc: `Order ${orderId} from ${customerName} for ₹${amount.toFixed(2)} is awaiting confirmation.`,
      time: order?.createdAt
        ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unread: true,
    };
  });
};

const mergeOrderNotifications = (orderList, previousNotifications) => {
  const previousById = new Map(previousNotifications.map((item) => [item.id, item]));

  return buildOrderNotifications(orderList).map((notification) => ({
    ...notification,
    unread: previousById.get(notification.id)?.unread ?? notification.unread,
  }));
};

export default function App() {
  // Authentication state - Starts with false, requiring login with the required credentials
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('glowvai_auth') === 'true';
  });
  
  const [adminUser, setAdminUser] = useState(() => {
    return {
      name: 'Admin',
      email: 'glowv.admin123@gmail.com',
      role: 'Super Admin'
    };
  });

  // App Navigation tab
  const [currentTab, setCurrentTab] = useState('dashboard');

  // App Persistent Centralized State
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('glowvai_products');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('glowvai_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('glowvai_customers');
    return saved ? JSON.parse(saved) : [];
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('glowvai_categories');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('glowvai_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  // Selected Order for Screen 6 Details
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const [backendProducts, backendCategories, backendOrders] = await Promise.all([
          adminApi.listProducts(),
          adminApi.listCategories(),
          adminApi.listOrders(),
        ]);

        if (Array.isArray(backendProducts)) {
          setProducts(backendProducts.map(normalizeProductForUi));
        }

        if (Array.isArray(backendCategories)) {
          setCategories(backendCategories.map((item) => ({
            id: item.id,
            name: item.name,
            slug: item.slug,
            description: item.description,
          })));
        }

        if (Array.isArray(backendOrders)) {
          const normalizedOrders = backendOrders.map(normalizeOrderForUi);
          setOrders(normalizedOrders);
          setNotifications((previous) => mergeOrderNotifications(normalizedOrders, previous));
        }
      } catch (err) {
        console.warn('Admin backend unavailable, keeping local mock catalog:', err.message);
      }
    };

    loadCatalog();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return undefined;

    let active = true;
    let requestInFlight = false;

    const refreshOrders = async () => {
      if (requestInFlight) return;
      requestInFlight = true;
      try {
        const backendOrders = await adminApi.listOrders();
        if (active && Array.isArray(backendOrders)) {
          const normalizedOrders = backendOrders.map(normalizeOrderForUi);
          setOrders(normalizedOrders);
          setNotifications((previous) => mergeOrderNotifications(normalizedOrders, previous));
        }
      } catch (err) {
        if (active) console.warn('Could not refresh admin orders:', err.message);
      } finally {
        requestInFlight = false;
      }
    };

    refreshOrders();
    const intervalId = window.setInterval(refreshOrders, 10000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [isAuthenticated]);

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('glowvai_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('glowvai_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('glowvai_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('glowvai_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('glowvai_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Handlers
  const handleLoginSuccess = (user) => {
    setAdminUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('glowvai_auth', 'true');
    localStorage.setItem('glowv_admin_token', 'glowv-admin-demo');
    setCurrentTab('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('glowvai_auth');
    localStorage.removeItem('glowv_admin_token');
  };

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setCurrentTab('order-details');
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const updated = await adminApi.updateOrderStatus(orderId, newStatus);
      if (!updated) throw new Error('The server did not return the updated order.');
      const normalized = normalizeOrderForUi(updated);

      setOrders((prev) => prev.map((ord) => (ord.id === orderId ? normalized : ord)));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(normalized);
      }
      return normalized;
    } catch (err) {
      console.error('Order status update failed:', err);
      throw err;
    }
  };

  const handleAddProduct = async (newProd) => {
    try {
      const payload = {
        name: newProd.name,
        brand: newProd.brand,
        category: newProd.category,
        price: Number(newProd.price),
        originalPrice: Number(newProd.originalPrice || newProd.price),
        stock: Number(newProd.stock || 0),
        status: newProd.status === 'Inactive' ? 'INACTIVE' : 'ACTIVE',
        description: newProd.description || '',
        ingredients: Array.isArray(newProd.ingredients)
          ? newProd.ingredients
          : String(newProd.ingredients || '').split(',').map((item) => item.trim()).filter(Boolean),
        skinTypes: Array.isArray(newProd.skinTypes) ? newProd.skinTypes : [],
        concerns: Array.isArray(newProd.skinConcerns) ? newProd.skinConcerns : [],
        imageUrl: newProd.image || null,
      };

      const created = await adminApi.createProduct(payload);
      setProducts((prev) => [normalizeProductForUi(created), ...prev.filter((p) => p.id !== created?.id)]);
      setCurrentTab('products');
    } catch (err) {
      console.error('Create product failed:', err);
      alert(err.message || 'Failed to create product.');
    }
  };

  const handleSaveProductUpdate = async (updatedProduct) => {
    try {
      const payload = {
        name: updatedProduct.name,
        brand: updatedProduct.brand,
        category: updatedProduct.category,
        price: Number(updatedProduct.price),
        originalPrice: Number(updatedProduct.originalPrice || updatedProduct.price),
        stock: Number(updatedProduct.stock || 0),
        status: updatedProduct.status === 'Inactive' ? 'INACTIVE' : 'ACTIVE',
        description: updatedProduct.description || '',
        ingredients: Array.isArray(updatedProduct.ingredients)
          ? updatedProduct.ingredients
          : String(updatedProduct.ingredients || '').split(',').map((item) => item.trim()).filter(Boolean),
        skinTypes: Array.isArray(updatedProduct.skinTypes) ? updatedProduct.skinTypes : [],
        concerns: Array.isArray(updatedProduct.skinConcerns) ? updatedProduct.skinConcerns : [],
        imageUrl: updatedProduct.image || null,
      };

      const updated = await adminApi.updateProduct(updatedProduct.id, payload);
      setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? normalizeProductForUi(updated) : p)));
    } catch (err) {
      console.error('Update product failed:', err);
      alert(err.message || 'Failed to update product.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await adminApi.deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error('Delete product failed:', err);
      alert(err.message || 'Failed to delete product.');
    }
  };

  const handleAddCustomer = (newCustomer) => {
    setCustomers([newCustomer, ...customers]);
  };

  const handleDeleteCustomer = (customerId) => {
    setCustomers(customers.filter((c) => c.id !== customerId));
  };

  const handleCreateOrder = (newOrder) => {
    setOrders([newOrder, ...orders]);
    setSelectedOrder(newOrder);
  };

  const handleAddCategory = (newCat) => {
    setCategories([...categories, newCat]);
  };

  const handleUpdateProductStock = async (productId, newCount) => {
    try {
      const updated = await adminApi.updateStock(productId, newCount);
      setProducts((prev) => prev.map((item) => (item.id === productId ? normalizeProductForUi(updated) : item)));
    } catch (err) {
      console.error('Stock update failed:', err);
      alert(err.message || 'Failed to update product stock.');
    }
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  // Quick Screen Switcher options
  const screenOptions = [
    { value: 'login', label: 'Screen 1: Login Page' },
    { value: 'dashboard', label: 'Screen 2: Dashboard' },
    { value: 'products', label: 'Screen 3: Products Catalog' },
    { value: 'add-product', label: 'Screen 4: Add Product' },
    { value: 'orders', label: 'Screen 5: Orders' },
    { value: 'order-details', label: 'Screen 6: Order Details' },
    { value: 'customers', label: 'Screen 7: Customers' },
    { value: 'categories', label: 'Screen 8: Categories' },
    { value: 'inventory', label: 'Screen 8b: Inventory' },
    { value: 'analytics', label: 'Screen 9: Analytics' },
    { value: 'notifications', label: 'Notifications' },
    { value: 'settings', label: 'Settings' },
  ];

  const handleScreenChange = (e) => {
    const val = e.target.value;
    if (val === 'login') {
      setIsAuthenticated(false);
      localStorage.removeItem('glowvai_auth');
    } else {
      setIsAuthenticated(true);
      localStorage.setItem('glowvai_auth', 'true');
      setCurrentTab(val);
    }
  };

  // If not authenticated, render Screen 1 (Login Page)
  if (!isAuthenticated) {
    return (
      <div className="glowvai-admin-app">
        <LoginPage onLoginSuccess={handleLoginSuccess} />

        {/* Global floating switcher for review */}
        <div className="screen-preview-switcher">
          <span className="screen-switcher-label">Mockup View:</span>
          <select 
            value="login" 
            onChange={handleScreenChange}
            className="screen-select-dropdown"
          >
            {screenOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  // Render Authenticated Admin Workspace (Screens 2 - 9)
  return (
    <div className="glowvai-admin-app">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab}
        unreadNotificationsCount={notifications.filter(n => n.unread).length}
      />

      <div className="app-main-layout">
        {/* Topbar */}
        <TopBar 
          onLogout={handleLogout} 
          notifications={notifications}
          onMarkNotificationsRead={handleMarkAllNotificationsRead}
          onOpenNotifications={() => setCurrentTab('notifications')}
        />

        {/* Dynamic Screen Routing */}
        {currentTab === 'dashboard' && (
          <DashboardPage 
            products={products}
            orders={orders}
            customers={customers}
            onNavigate={(tab) => setCurrentTab(tab)}
            onSelectOrder={handleSelectOrder}
          />
        )}

        {currentTab === 'products' && (
          <ProductsPage 
            products={products}
            categories={categories}
            onAddProductClick={() => setCurrentTab('add-product')}
            onDeleteProduct={handleDeleteProduct}
            onSaveProductUpdate={handleSaveProductUpdate}
          />
        )}

        {currentTab === 'add-product' && (
          <AddProductPage 
            categories={categories}
            onCancel={() => setCurrentTab('products')}
            onSaveProduct={handleAddProduct}
          />
        )}

        {currentTab === 'orders' && (
          <OrdersPage 
            orders={orders}
            products={products}
            customers={customers}
            onSelectOrder={handleSelectOrder}
            onCreateOrder={handleCreateOrder}
          />
        )}

        {currentTab === 'order-details' && (
          <OrderDetailsPage 
            order={selectedOrder || orders[0]}
            onBack={() => setCurrentTab('orders')}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {currentTab === 'customers' && (
          <CustomersPage 
            customers={customers}
            onAddCustomer={handleAddCustomer}
            onDeleteCustomer={handleDeleteCustomer}
          />
        )}

        {currentTab === 'categories' && (
          <CategoriesPage 
            categories={categories}
            products={products}
            onAddCategory={handleAddCategory}
            onSelectCategory={(categoryName) => {
              setCurrentTab('products');
            }}
          />
        )}

        {currentTab === 'inventory' && (
          <InventoryPage 
            products={products}
            onUpdateProductStock={handleUpdateProductStock}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsPage 
            products={products}
            orders={orders}
            customers={customers}
          />
        )}

        {currentTab === 'notifications' && (
          <NotificationsPage 
            notifications={notifications}
            onMarkAllRead={handleMarkAllNotificationsRead}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsPage />
        )}
      </div>

      {/* Floating Demo Screen Switcher */}
      <div className="screen-preview-switcher">
        <span className="screen-switcher-label">Mockup View:</span>
        <select 
          value={currentTab} 
          onChange={handleScreenChange}
          className="screen-select-dropdown"
        >
          {screenOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
