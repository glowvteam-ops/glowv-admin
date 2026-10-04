import React, { useState } from 'react';
import { X, Check, Boxes, CheckCircle2 } from 'lucide-react';

export default function InventoryPage({ products = [], onUpdateProductStock }) {
  const [activeTab, setActiveTab] = useState('Low Stock');
  const [modalProduct, setModalProduct] = useState(null);
  const [newStock, setNewStock] = useState(25);

  const lowStockItems = products.filter(p => p.stock > 0 && p.stock <= 10);
  const outOfStockItems = products.filter(p => p.stock === 0);

  const displayedItems = activeTab === 'Low Stock' ? lowStockItems : outOfStockItems;

  const handleOpenUpdate = (prod) => {
    setModalProduct(prod);
    setNewStock(prod.stock + 20);
  };

  const handleSaveStock = (e) => {
    e.preventDefault();
    if (!modalProduct) return;
    onUpdateProductStock(modalProduct.id, Number(newStock));
    setModalProduct(null);
  };

  return (
    <div className="page-main-content">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h2 className="page-title">Inventory</h2>
          <p className="page-subtitle">Manage product stock</p>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="catalog-tabs-row">
        <button 
          className={`catalog-tab-btn ${activeTab === 'Low Stock' ? 'active' : ''}`}
          onClick={() => setActiveTab('Low Stock')}
        >
          Low Stock ({lowStockItems.length})
        </button>
        <button 
          className={`catalog-tab-btn ${activeTab === 'Out of Stock' ? 'active' : ''}`}
          onClick={() => setActiveTab('Out of Stock')}
        >
          Out of Stock ({outOfStockItems.length})
        </button>
      </div>

      {/* Table Container */}
      <div className="table-responsive-card">
        <table className="custom-data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Current Stock</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedItems.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '48px 20px', color: '#64748b' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle2 size={36} color="#10b981" />
                    <span style={{ fontSize: '15px', fontWeight: 600, color: '#334155' }}>
                      {activeTab === 'Low Stock' ? 'No low stock alerts' : 'No out of stock items'}
                    </span>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>
                      {products.length === 0 
                        ? 'No products have been added to the inventory yet.' 
                        : `All skincare products currently meet minimum inventory thresholds.`}
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              displayedItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="product-cell-flex">
                      <img 
                        src={item.image || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=120&auto=format&fit=crop&q=80'} 
                        alt={item.name} 
                        className="product-table-thumb" 
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=120&auto=format&fit=crop&q=80';
                        }}
                      />
                      <span className="product-table-name">{item.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`inventory-count-text ${item.stock === 0 ? 'text-danger' : 'text-warning'}`}>
                      {item.stock}
                    </span>
                  </td>
                  <td>
                    <span className={`status-pill ${item.stock === 0 ? 'badge-cancelled' : 'badge-pending'}`}>
                      {item.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn-update-stock"
                      onClick={() => handleOpenUpdate(item)}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Update Stock Modal */}
      {modalProduct && (
        <div className="modal-overlay" onClick={() => setModalProduct(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Restock Inventory</h3>
              <button className="modal-close-btn" onClick={() => setModalProduct(null)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveStock}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                <img 
                  src={modalProduct.image || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=120&auto=format&fit=crop&q=80'} 
                  alt={modalProduct.name} 
                  style={{ width: '46px', height: '46px', borderRadius: '8px', objectFit: 'cover' }} 
                />
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 600 }}>{modalProduct.name}</h4>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Current stock: {modalProduct.stock} units</span>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="input-field-label">New Total Units in Warehouse</label>
                <input 
                  type="number" 
                  min="0"
                  className="custom-text-input"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-form-cancel" onClick={() => setModalProduct(null)}>Cancel</button>
                <button type="submit" className="btn-primary-add">Save Stock</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
