import React, { useState, useRef } from 'react';
import { useCreateComplaint } from '../../hooks/useCreateComplaint';
import { useCategories } from '../../hooks/useCategories';
import { complaintApi } from '../../api/complaintApi';
import { Loader2, Send, UploadCloud, X, RefreshCw, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './complaint.css';
import '../../components/auth/auth.css';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    latitude: '',
    longitude: '',
    city: '',
    state: '',
    address: '',
    ward: '',
    pincode: ''
  });
  
  const [images, setImages] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  
  // Tracking partial failure state
  const [createdComplaintId, setCreatedComplaintId] = useState(null);
  const [uploadFailed, setUploadFailed] = useState(false);
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const { mutateAsync: submitComplaint, isPending: isSubmitting } = useCreateComplaint();
  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories();
  const categories = categoriesData || [];

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.categoryId) errors.categoryId = 'Category is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    
    if (formData.latitude) {
      const lat = parseFloat(formData.latitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        errors.latitude = 'Latitude must be between -90 and 90';
      }
    }
    
    if (formData.longitude) {
      const lng = parseFloat(formData.longitude);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        errors.longitude = 'Longitude must be between -180 and 180';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (validationErrors[e.target.name]) {
      setValidationErrors({ ...validationErrors, [e.target.name]: '' });
    }
  };

  const validateFiles = (files) => {
    const validFiles = [];
    for (const file of files) {
      if (!ALLOWED_FORMATS.includes(file.type)) {
        toast.error(`${file.name} has an invalid format. Allowed: JPG, PNG, WEBP.`);
        continue;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        toast.error(`${file.name} is too large. Max size is 5MB.`);
        continue;
      }
      validFiles.push(file);
    }
    return validFiles;
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const newFiles = validateFiles(Array.from(e.target.files));
      if (images.length + newFiles.length > 5) {
        toast.error('You can only upload up to 5 images in total');
        return;
      }
      setImages(prev => [...prev, ...newFiles]);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const newFiles = validateFiles(Array.from(e.dataTransfer.files));
      if (images.length + newFiles.length > 5) {
        toast.error('You can only upload up to 5 images in total');
        return;
      }
      setImages(prev => [...prev, ...newFiles]);
    }
  };

  const performImageUpload = async (complaintId) => {
    setIsUploading(true);
    setUploadFailed(false);
    try {
      await complaintApi.uploadImages(complaintId, images);
      toast.success('Complaint submitted successfully!');
      navigate('/dashboard/complaints');
    } catch (imgError) {
      setUploadFailed(true);
      toast.error('Your complaint has been created successfully, but one or more images failed to upload.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      let complaintId = createdComplaintId;
      
      // Only create if we haven't already
      if (!complaintId) {
        const createdComplaintResponse = await submitComplaint({
          ...formData,
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null
        });
        
        complaintId = createdComplaintResponse.data?.id || createdComplaintResponse.id;
        setCreatedComplaintId(complaintId);
      }

      // Upload Images if any exist
      if (images.length > 0 && complaintId) {
        await performImageUpload(complaintId);
      } else {
        // No images to upload
        toast.success('Complaint submitted successfully!');
        navigate('/dashboard/complaints');
      }
    } catch (error) {
      // Creation error handled by useCreateComplaint toast natively
    }
  };

  const isPending = isSubmitting || isUploading;

  // Render Partial Failure State
  if (uploadFailed && createdComplaintId) {
    return (
      <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h2 className="auth-title" style={{ color: '#ef4444' }}>Image Upload Failed</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Your complaint has been created successfully, but one or more images failed to upload.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <button 
            className="auth-button" 
            onClick={() => performImageUpload(createdComplaintId)} 
            disabled={isUploading}
          >
            {isUploading ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
            {isUploading ? 'Retrying Upload...' : 'Retry Image Upload'}
          </button>
          
          <button 
            className="auth-button" 
            style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-primary)' }}
            onClick={() => navigate('/dashboard/complaints')}
            disabled={isUploading}
          >
            Continue without Images <ArrowRight size={18} style={{ marginLeft: '8px' }} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Left Column */}
          <div className="form-col">
            <div className="auth-form-group">
              <label className="auth-label">Title *</label>
              <input type="text" name="title" className="auth-input" placeholder="Brief title of the issue" value={formData.title} onChange={handleChange} disabled={isPending} />
              {validationErrors.title && <span className="validation-error">{validationErrors.title}</span>}
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Category *</label>
              <select name="categoryId" className="auth-input" value={formData.categoryId} onChange={handleChange} disabled={isPending || isLoadingCategories}>
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {validationErrors.categoryId && <span className="validation-error">{validationErrors.categoryId}</span>}
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Description *</label>
              <textarea name="description" className="auth-input" style={{ minHeight: '120px', resize: 'vertical' }} placeholder="Detailed description of the issue" value={formData.description} onChange={handleChange} disabled={isPending} />
              {validationErrors.description && <span className="validation-error">{validationErrors.description}</span>}
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Address</label>
              <input type="text" name="address" className="auth-input" placeholder="Street address or landmark" value={formData.address} onChange={handleChange} disabled={isPending} />
            </div>
            
            <div className="auth-form-group">
              <label className="auth-label">City *</label>
              <input type="text" name="city" className="auth-input" placeholder="Enter city" value={formData.city} onChange={handleChange} disabled={isPending} />
              {validationErrors.city && <span className="validation-error">{validationErrors.city}</span>}
            </div>
          </div>

          {/* Right Column */}
          <div className="form-col">
            
            <div className="geo-group" style={{ display: 'flex', gap: '10px' }}>
              <div className="auth-form-group" style={{ flex: 1 }}>
                <label className="auth-label">Latitude</label>
                <input type="number" step="any" name="latitude" className="auth-input" placeholder="e.g. 19.0760" value={formData.latitude} onChange={handleChange} disabled={isPending} />
                {validationErrors.latitude && <span className="validation-error">{validationErrors.latitude}</span>}
              </div>
              <div className="auth-form-group" style={{ flex: 1 }}>
                <label className="auth-label">Longitude</label>
                <input type="number" step="any" name="longitude" className="auth-input" placeholder="e.g. 72.8777" value={formData.longitude} onChange={handleChange} disabled={isPending} />
                {validationErrors.longitude && <span className="validation-error">{validationErrors.longitude}</span>}
              </div>
            </div>

            <div className="geo-group" style={{ display: 'flex', gap: '10px' }}>
              <div className="auth-form-group" style={{ flex: 1 }}>
                <label className="auth-label">State</label>
                <input type="text" name="state" className="auth-input" placeholder="e.g. Maharashtra" value={formData.state} onChange={handleChange} disabled={isPending} />
              </div>
              <div className="auth-form-group" style={{ flex: 1 }}>
                <label className="auth-label">Pincode</label>
                <input type="text" name="pincode" className="auth-input" placeholder="e.g. 400001" value={formData.pincode} onChange={handleChange} disabled={isPending} />
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Images (Max 5, 5MB each)</label>
              <div 
                className="upload-dropzone" 
                onDragOver={handleDragOver} 
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud size={32} style={{ marginBottom: '10px', color: 'rgba(255, 255, 255, 0.7)' }} />
                <p>Drag & drop JPG, PNG, WEBP here or click to browse</p>
                <input 
                  type="file" 
                  multiple 
                  accept="image/jpeg, image/png, image/webp" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  style={{ display: 'none' }} 
                  disabled={isPending}
                />
              </div>

              {images.length > 0 && (
                <div className="image-preview-container">
                  {images.map((file, idx) => (
                    <div key={idx} className="image-preview">
                      <img src={URL.createObjectURL(file)} alt="preview" />
                      <button type="button" className="remove-img-btn" onClick={(e) => { e.stopPropagation(); removeImage(idx); }}>
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <button type="submit" className="auth-button" disabled={isPending} style={{ marginTop: '20px' }}>
          {isPending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
          {isSubmitting ? 'Creating Complaint...' : isUploading ? 'Uploading Images...' : 'Submit Complaint'}
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;
