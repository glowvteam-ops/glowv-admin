import React, { useState } from 'react';
import { UploadCloud, Plus, X, ArrowLeft } from 'lucide-react';

export default function AddProductPage({ onCancel, onSaveProduct, categories = [] }) {
  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [status, setStatus] = useState('Active');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');

  // Pill multi-selects
  const [selectedSkinTypes, setSelectedSkinTypes] = useState(['Normal', 'Oily']);
  const [selectedConcerns, setSelectedConcerns] = useState(['Acne', 'Dark Spots']);

  // Clean initial images (real user uploads)
  const [images, setImages] = useState([]);

  const skinTypeOptions = ['Normal', 'Dry', 'Oily', 'Combination', 'Sensitive'];
  const concernOptions = ['Acne', 'Dark Spots', 'Sun Protection', 'Uneven Tone', 'Pores', 'Fine Lines'];

  const toggleSkinType = (type) => {
    if (selectedSkinTypes.includes(type)) {
      setSelectedSkinTypes(selectedSkinTypes.filter(t => t !== type));
    } else {
      setSelectedSkinTypes([...selectedSkinTypes, type]);
    }
  };

  const toggleConcern = (concern) => {
    if (selectedConcerns.includes(concern)) {
      setSelectedConcerns(selectedConcerns.filter(c => c !== concern));
    } else {
      setSelectedConcerns([...selectedConcerns, concern]);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImages([...images, url]);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages(images.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!productName || !brand || !price) {
      alert('Please fill in product name, brand and price.');
      return;
    }

    const newProd = {
      id: Date.now(),
      name: productName,
      brand: brand,
      category: category || 'Serum',
      price: Number(price),
      originalPrice: Number(originalPrice) || Number(price),
      stock: Number(stockQuantity) || 50,
      status: status,
      image: images[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&auto=format&fit=crop&q=80',
      description: description,
      ingredients: ingredients,
      skinTypes: selectedSkinTypes,
      skinConcerns: selectedConcerns
    };

    onSaveProduct(newProd);
  };

  return (
    <div className="page-main-content">
      {/* Top Title Bar */}
      <div className="page-header-row" style={{ marginBottom: '22px' }}>
        <div>
          <h2 className="page-title">Add Product</h2>
          <p className="page-subtitle">Create a new skincare product</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="add-product-form-layout">
        <div className="form-two-column-grid">
          
          {/* Left Column: Product Images */}
          <div className="form-card-box">
            <h3 className="form-box-title">Product Images</h3>
            
            <label className="image-dropzone-label">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                style={{ display: 'none' }} 
              />
              <div className="dropzone-icon-circle">
                <UploadCloud size={24} color="#1868f7" />
              </div>
              <span className="dropzone-main-text">Add Product Images</span>
              <span className="dropzone-sub-text">Drag & drop images or click to upload</span>
              <span className="dropzone-hint">PNG, JPG, WEBP (Max size: 5MB)</span>
            </label>

            {/* Thumbnail previews */}
            <div className="uploaded-thumbnails-row">
              {images.map((imgSrc, idx) => (
                <div key={idx} className="thumb-preview-box">
                  <img 
                    src={imgSrc} 
                    alt={`preview ${idx}`} 
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&auto=format&fit=crop&q=80';
                    }}
                  />
                  <button 
                    type="button" 
                    className="thumb-remove-btn"
                    onClick={() => handleRemoveImage(idx)}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              <label className="thumb-add-more-box">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  style={{ display: 'none' }} 
                />
                <Plus size={20} color="#94a3b8" />
              </label>
            </div>
          </div>

          {/* Right Column: Product Details */}
          <div className="form-card-box">
            <h3 className="form-box-title">Product Details</h3>

            <div className="form-field-row">
              <div className="field-group">
                <label className="input-field-label">Product Name *</label>
                <input 
                  type="text" 
                  className="custom-text-input" 
                  placeholder="Enter product name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                />
              </div>

              <div className="field-group">
                <label className="input-field-label">Brand *</label>
                <input 
                  type="text" 
                  className="custom-text-input" 
                  placeholder="Enter brand name"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field-group" style={{ marginTop: '14px' }}>
              <label className="input-field-label">Category *</label>
              <select 
                className="custom-text-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select category</option>
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

            <div className="form-field-row" style={{ marginTop: '14px' }}>
              <div className="field-group">
                <label className="input-field-label">Price (₹) *</label>
                <input 
                  type="number" 
                  className="custom-text-input" 
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              <div className="field-group">
                <label className="input-field-label">Original Price (₹)</label>
                <input 
                  type="number" 
                  className="custom-text-input" 
                  placeholder="Enter original price"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="form-field-row" style={{ marginTop: '14px' }}>
              <div className="field-group">
                <label className="input-field-label">Stock Quantity *</label>
                <input 
                  type="number" 
                  className="custom-text-input" 
                  placeholder="Enter stock quantity"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  required
                />
              </div>

              <div className="field-group">
                <label className="input-field-label">Status</label>
                <select 
                  className="custom-text-input"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width Section: Description, Ingredients, Skin tags */}
        <div className="form-card-box" style={{ marginTop: '18px' }}>
          <div className="field-group">
            <label className="input-field-label">Description</label>
            <textarea 
              rows={3}
              className="custom-textarea"
              placeholder="Enter product description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="field-group" style={{ marginTop: '14px' }}>
            <label className="input-field-label">Ingredients</label>
            <input 
              type="text" 
              className="custom-text-input"
              placeholder="Enter ingredients (comma separated)"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
            />
          </div>

          {/* Skin Types Tags */}
          <div className="tag-picker-group" style={{ marginTop: '18px' }}>
            <label className="input-field-label">Skin Types</label>
            <div className="pills-flex-wrap">
              {skinTypeOptions.map((type) => {
                const isSelected = selectedSkinTypes.includes(type);
                return (
                  <button 
                    key={type}
                    type="button"
                    className={`tag-selectable-pill ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleSkinType(type)}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Skin Concerns Tags */}
          <div className="tag-picker-group" style={{ marginTop: '18px' }}>
            <label className="input-field-label">Skin Concerns</label>
            <div className="pills-flex-wrap">
              {concernOptions.map((concern) => {
                const isSelected = selectedConcerns.includes(concern);
                return (
                  <button 
                    key={concern}
                    type="button"
                    className={`tag-selectable-pill ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleConcern(concern)}
                  >
                    {concern}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Form Actions */}
        <div className="form-bottom-actions">
          <button 
            type="button" 
            className="btn-form-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-primary-add"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
}
