import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  ChevronDown, 
  Edit3, 
  Trash2, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  X,
  PackageOpen
} from 'lucide-react';

export default function ProductsPage({ 
  products, 
  categories = [],
  onAddProductClick, 
  onDeleteProduct,
  onSaveProductUpdate 
}) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'active' | 'inactive'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    brand: '',
    category: '',
    price: '',
    originalPrice: '',
    stock: '',
    status: 'Active',
    description: ''
  });

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setEditForm({
      name: prod.name,
      brand: prod.brand,
      category: prod.category,
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      stock: prod.stock,
      status: prod.status,
      description: prod.description || ''
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    const updated = {
      ...editingProduct,
      name: editForm.name,
      brand: editForm.brand,
      category: editForm.category,
      price: Number(editForm.price),
      originalPrice: Number(editForm.originalPrice),
      stock: Number(editForm.stock),
      status: editForm.status,
      description: editForm.description
    };
    onSaveProductUpdate(updated);
    setEditingProduct(null);
  };

  // Filter products
  const filteredProducts = products.filter((prod) => {
    // Tab filter
    if (activeTab === 'active' && prod.status.toLowerCase() !== 'active') return false;
    if (activeTab === 'inactive' && prod.status.toLowerCase() !== 'inactive') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = prod.name.toLowerCase().includes(q);
      const matchBrand = prod.brand.toLowerCase().includes(q);
      if (!matchName && !matchBrand) return false;
    }

    // Category filter
    if (selectedCategory !== 'All' && prod.category !== selectedCategory) return false;

    // Status filter
    if (selectedStatus !== 'All' && prod.status !== selectedStatus) return false;

    return true;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p.id));
    }
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const activeCount = products.filter(p => p.status === 'Active').length;
  const inactiveCount = products.filter(p => p.status === 'Inactive').length;

  return (
    <div className="page-main-content">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h2 className="page-title">Products</h2>
          <p className="page-subtitle">Manage your product catalog</p>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="catalog-toolbar">
        <div className="search-with-filters">
          <div className="catalog-search-box">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search products, brands..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="catalog-search-input"
            />
          </div>

          <div className="filter-select-wrapper">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="toolbar-select"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c.id || c.name} value={c.name}>{c.name}</option>
              ))}
              {categories.length === 0 && (
                <>
                  <option value="Cleanser">Cleanser</option>
                  <option value="Toner">Toner</option>
                  <option value="Serum">Serum</option>
                  <option value="Moisturizer">Moisturizer</option>
                  <option value="Sunscreen">Sunscreen</option>
                  <option value="Treatment">Treatment</option>
                </>
              )}
            </select>
          </div>

          <div className="filter-select-wrapper">
            <select 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="toolbar-select"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <button 
          className="btn-primary-add"
          onClick={onAddProductClick}
        >
          <Plus size={16} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Tabs Row */}
      <div className="catalog-tabs-row">
        <button 
          className={`catalog-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All ({products.length})
        </button>
        <button 
          className={`catalog-tab-btn ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active ({activeCount})
        </button>
        <button 
          className={`catalog-tab-btn ${activeTab === 'inactive' ? 'active' : ''}`}
          onClick={() => setActiveTab('inactive')}
        >
          Inactive ({inactiveCount})
        </button>
      </div>

      {/* Table Container */}
      <div className="table-responsive-card">
        <table className="custom-data-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <input 
                  type="checkbox" 
                  checked={filteredProducts.length > 0 && selectedIds.length === filteredProducts.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>Product</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '48px 20px', color: '#64748b' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <PackageOpen size={36} color="#94a3b8" />
                    <span style={{ fontSize: '15px', fontWeight: 600, color: '#334155' }}>No products found</span>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>
                      {products.length === 0 
                        ? 'Your skincare catalog is currently empty.' 
                        : 'No products match your search or filter criteria.'}
                    </span>
                    {products.length === 0 && (
                      <button 
                        className="btn-primary-add" 
                        onClick={onAddProductClick}
                        style={{ marginTop: '8px' }}
                      >
                        <Plus size={16} />
                        <span>Add First Product</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredProducts.map((prod) => (
                <tr key={prod.id}>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(prod.id)}
                      onChange={() => toggleSelect(prod.id)}
                    />
                  </td>
                  <td>
                    <div className="product-cell-flex">
                      <img 
                        src={prod.image || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=150&auto=format&fit=crop&q=80'} 
                        alt={prod.name} 
                        className="product-table-thumb"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=150&auto=format&fit=crop&q=80';
                        }}
                      />
                      <span className="product-table-name">{prod.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="brand-name-text">{prod.brand}</span>
                  </td>
                  <td>
                    <span className="table-price">₹{prod.price?.toLocaleString()}</span>
                  </td>
                  <td>
                    <span className={`table-stock-num ${prod.stock <= 10 ? 'stock-critical' : ''}`}>
                      {prod.stock}
                    </span>
                  </td>
                  <td>
                    <span className={`status-pill ${prod.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                      {prod.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="table-action-btns">
                      <button 
                        className="action-icon-btn" 
                        onClick={() => openEditModal(prod)}
                        title="Edit product"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button 
                        className="action-icon-btn text-danger" 
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete ${prod.name}?`)) {
                            onDeleteProduct(prod.id);
                          }
                        }}
                        title="Delete product"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Table Footer with Pagination */}
        <div className="table-pagination-footer">
          <span className="pagination-text">Showing 1-{filteredProducts.length} of {products.length} products</span>
          <div className="pagination-controls">
            <button className="page-nav-btn" disabled><ChevronLeft size={14} /></button>
            <button className="page-num-btn active">1</button>
            <button className="page-nav-btn" disabled><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* Real Edit Product Modal */}
      {editingProduct && (
        <div className="modal-overlay" onClick={() => setEditingProduct(null)}>
          <div className="modal-card" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Skincare Product</h3>
              <button className="modal-close-btn" onClick={() => setEditingProduct(null)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-field-row">
                <div className="field-group">
                  <label className="input-field-label">Product Name *</label>
                  <input 
                    type="text" 
                    className="custom-text-input" 
                    value={editForm.name} 
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} 
                    required 
                  />
                </div>
                <div className="field-group">
                  <label className="input-field-label">Brand *</label>
                  <input 
                    type="text" 
                    className="custom-text-input" 
                    value={editForm.brand} 
                    onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })} 
                    required 
                  />
                </div>
              </div>

              <div className="form-field-row">
                <div className="field-group">
                  <label className="input-field-label">Category</label>
                  <select 
                    className="custom-text-input"
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c.id || c.name} value={c.name}>{c.name}</option>
                    ))}
                    {categories.length === 0 && (
                      <>
                        <option value="Cleanser">Cleanser</option>
                        <option value="Toner">Toner</option>
                        <option value="Serum">Serum</option>
                        <option value="Moisturizer">Moisturizer</option>
                        <option value="Sunscreen">Sunscreen</option>
                        <option value="Treatment">Treatment</option>
                      </>
                    )}
                  </select>
                </div>
                <div className="field-group">
                  <label className="input-field-label">Status</label>
                  <select 
                    className="custom-text-input"
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="form-field-row">
                <div className="field-group">
                  <label className="input-field-label">Price (₹) *</label>
                  <input 
                    type="number" 
                    className="custom-text-input" 
                    value={editForm.price} 
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} 
                    required 
                  />
                </div>
                <div className="field-group">
                  <label className="input-field-label">Stock Units *</label>
                  <input 
                    type="number" 
                    className="custom-text-input" 
                    value={editForm.stock} 
                    onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })} 
                    required 
                  />
                </div>
              </div>

              <div className="field-group">
                <label className="input-field-label">Description</label>
                <textarea 
                  rows={2}
                  className="custom-textarea"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" className="btn-form-cancel" onClick={() => setEditingProduct(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-add">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
