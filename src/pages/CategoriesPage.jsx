import React, { useState } from 'react';
import { Plus, ChevronRight, X, Tag } from 'lucide-react';

export default function CategoriesPage({ 
  categories = [], 
  products = [], 
  onAddCategory, 
  onSelectCategory 
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🧴');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddCategory({
      id: Date.now(),
      name: name.trim(),
      icon: icon,
      description: description || 'Skincare category'
    });

    setName('');
    setDescription('');
    setModalOpen(false);
  };

  return (
    <div className="page-main-content">
      {/* Page Header */}
      <div className="page-header-row" style={{ marginBottom: '22px' }}>
        <div>
          <h2 className="page-title">Categories</h2>
          <p className="page-subtitle">Manage product categories</p>
        </div>

        <button 
          className="btn-primary-add"
          onClick={() => setModalOpen(true)}
        >
          <Plus size={16} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Vertical Cards List */}
      <div className="categories-list-container">
        {categories.length === 0 ? (
          <div className="table-responsive-card" style={{ padding: '48px 20px', textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <Tag size={36} color="#94a3b8" />
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#334155' }}>No categories created yet</span>
              <span style={{ fontSize: '13px', color: '#64748b' }}>
                Add skincare categories like Cleanser, Serum, or Toner to organize products.
              </span>
              <button 
                className="btn-primary-add" 
                onClick={() => setModalOpen(true)}
                style={{ marginTop: '8px' }}
              >
                <Plus size={16} />
                <span>Add First Category</span>
              </button>
            </div>
          </div>
        ) : (
          categories.map((cat) => {
            const count = products.filter(p => p.category === cat.name).length;
            return (
              <div 
                key={cat.id || cat.name} 
                className="category-row-card"
                onClick={() => onSelectCategory(cat.name)}
              >
                <div className="category-left-group">
                  <div className="category-icon-box">
                    <span className="category-emoji-icon">{cat.icon || '🧴'}</span>
                  </div>
                  <div className="category-info-col">
                    <h3 className="category-name-title">{cat.name}</h3>
                    <span className="category-products-sub">{count} products</span>
                  </div>
                </div>

                <ChevronRight size={18} color="#94a3b8" />
              </div>
            );
          })
        )}
      </div>

      {/* Add Category Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add Skincare Category</h3>
              <button className="modal-close-btn" onClick={() => setModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="input-field-label">Category Name *</label>
                <input 
                  type="text" 
                  className="custom-text-input" 
                  placeholder="e.g. Eye Creams, Face Oils, Serums"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="input-field-label">Category Icon / Emoji</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['🧴', '💧', '🧪', '🥣', '☀️', '✨', '🌿', '👁️'].map((emo) => (
                    <button 
                      key={emo} 
                      type="button" 
                      onClick={() => setIcon(emo)}
                      style={{ 
                        fontSize: '20px', 
                        padding: '6px 10px', 
                        borderRadius: '8px', 
                        border: icon === emo ? '2px solid #1868f7' : '1px solid #e2e8f0',
                        background: icon === emo ? '#eff6ff' : '#ffffff',
                        cursor: 'pointer'
                      }}
                    >
                      {emo}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="input-field-label">Description</label>
                <input 
                  type="text" 
                  className="custom-text-input" 
                  placeholder="Brief description of category products"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-form-cancel" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary-add">Create Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
