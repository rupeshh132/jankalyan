import React, { useState, useRef, useEffect } from 'react';
import { useCreateComplaint } from '../../hooks/useCreateComplaint';
import { useUpdateComplaint } from '../../hooks/useUpdateComplaint';
import { useCategories } from '../../hooks/useCategories';
import { complaintApi } from '../../api/complaintApi';
import { Loader2, Send, UploadCloud, X, RefreshCw, ArrowRight, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './complaint.css';
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const ComplaintForm = ({ initialData = null, isEditMode = false }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    categoryId: initialData?.categoryId || '',
    latitude: initialData?.latitude || '',
    longitude: initialData?.longitude || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    address: initialData?.address || '',
    ward: initialData?.ward || '',
    pincode: initialData?.pincode || '',
    isAnonymous: initialData?.isAnonymous || false
  });
  
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState(initialData?.images || []);
  const [validationErrors, setValidationErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  
  // Tracking partial failure state
  const [createdComplaintId, setCreatedComplaintId] = useState(null);
  const [uploadFailed, setUploadFailed] = useState(false);
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const { mutateAsync: submitComplaint, isPending: isSubmitting } = useCreateComplaint();
  const { mutateAsync: updateComplaint, isPending: isUpdating } = useUpdateComplaint();
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
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
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
      if (existingImages.length + images.length + newFiles.length > 5) {
        toast.error('You can only upload up to 5 images in total');
        return;
      }
      setImages(prev => [...prev, ...newFiles]);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingImage = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image permanently?')) return;
    
    setIsDeletingImage(true);
    try {
      await complaintApi.deleteImage(imageId);
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
      toast.success('Image deleted successfully');
    } catch (err) {
      toast.error('Failed to delete image');
    } finally {
      setIsDeletingImage(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const newFiles = validateFiles(Array.from(e.dataTransfer.files));
      if (existingImages.length + images.length + newFiles.length > 5) {
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
      toast.success(isEditMode ? 'Complaint updated successfully!' : 'Complaint submitted successfully!');
      navigate('/dashboard/complaints');
    } catch (imgError) {
      setUploadFailed(true);
      toast.error('Complaint saved, but one or more images failed to upload.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      let complaintId = isEditMode ? initialData.id : createdComplaintId;
      
      const payload = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null
      };
      
      if (isEditMode) {
        await updateComplaint({ id: complaintId, data: payload });
      } else if (!complaintId) {
        const createdComplaintResponse = await submitComplaint(payload);
        complaintId = createdComplaintResponse.data?.id || createdComplaintResponse.id;
        setCreatedComplaintId(complaintId);
      }

      // Upload Images if any new ones exist
      if (images.length > 0 && complaintId) {
        await performImageUpload(complaintId);
      } else {
        toast.success(isEditMode ? 'Complaint updated successfully!' : 'Complaint submitted successfully!');
        navigate('/dashboard/complaints');
      }
    } catch (error) {
      // Handled by hook toasts
    }
  };

  const isPending = isSubmitting || isUpdating || isUploading || isDeletingImage;

  // Render Partial Failure State
  if (uploadFailed && (createdComplaintId || isEditMode)) {
    const targetId = isEditMode ? initialData.id : createdComplaintId;
    return (
      <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h2 className="auth-title" style={{ color: '#ef4444' }}>Image Upload Failed</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Your complaint was saved successfully, but one or more new images failed to upload.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <button 
            className="auth-button" 
            onClick={() => performImageUpload(targetId)} 
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
            Continue <ArrowRight size={18} style={{ marginLeft: '8px' }} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {uploadFailed && (createdComplaintId || isEditMode) ? (
        <Card className="text-center p-8 border-destructive bg-destructive/5">
          <h2 className="text-2xl font-bold text-destructive mb-2">Image Upload Failed</h2>
          <p className="text-muted-foreground mb-8">
            Your complaint was saved successfully, but one or more new images failed to upload.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-4 py-2" 
              onClick={() => performImageUpload(isEditMode ? initialData.id : createdComplaintId)} 
              disabled={isUploading}
            >
              {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              {isUploading ? 'Retrying Upload...' : 'Retry Image Upload'}
            </button>
            
            <button 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              onClick={() => navigate('/dashboard/complaints')}
              disabled={isUploading}
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </Card>
      ) : (
        <div className="bg-card rounded-xl border shadow-sm">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Title <span className="text-destructive">*</span></label>
                    <input 
                      type="text" 
                      name="title" 
                      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${validationErrors.title ? 'border-destructive' : ''}`}
                      placeholder="Brief title of the issue" 
                      value={formData.title} 
                      onChange={handleChange} 
                      disabled={isPending} 
                    />
                    {validationErrors.title && <span className="text-sm text-destructive">{validationErrors.title}</span>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Category <span className="text-destructive">*</span></label>
                    <select 
                      name="categoryId" 
                      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${validationErrors.categoryId ? 'border-destructive' : ''}`}
                      value={formData.categoryId} 
                      onChange={handleChange} 
                      disabled={isPending || isLoadingCategories}
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    {validationErrors.categoryId && <span className="text-sm text-destructive">{validationErrors.categoryId}</span>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Description <span className="text-destructive">*</span></label>
                    <textarea 
                      name="description" 
                      className={`flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y ${validationErrors.description ? 'border-destructive' : ''}`}
                      placeholder="Detailed description of the issue" 
                      value={formData.description} 
                      onChange={handleChange} 
                      disabled={isPending} 
                    />
                    {validationErrors.description && <span className="text-sm text-destructive">{validationErrors.description}</span>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Address</label>
                    <input 
                      type="text" 
                      name="address" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Street address or landmark" 
                      value={formData.address} 
                      onChange={handleChange} 
                      disabled={isPending} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">City <span className="text-destructive">*</span></label>
                    <input 
                      type="text" 
                      name="city" 
                      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${validationErrors.city ? 'border-destructive' : ''}`}
                      placeholder="Enter city" 
                      value={formData.city} 
                      onChange={handleChange} 
                      disabled={isPending} 
                    />
                    {validationErrors.city && <span className="text-sm text-destructive">{validationErrors.city}</span>}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none">Latitude</label>
                      <input 
                        type="number" 
                        step="any" 
                        name="latitude" 
                        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${validationErrors.latitude ? 'border-destructive' : ''}`}
                        placeholder="e.g. 19.0760" 
                        value={formData.latitude} 
                        onChange={handleChange} 
                        disabled={isPending} 
                      />
                      {validationErrors.latitude && <span className="text-sm text-destructive">{validationErrors.latitude}</span>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none">Longitude</label>
                      <input 
                        type="number" 
                        step="any" 
                        name="longitude" 
                        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${validationErrors.longitude ? 'border-destructive' : ''}`}
                        placeholder="e.g. 72.8777" 
                        value={formData.longitude} 
                        onChange={handleChange} 
                        disabled={isPending} 
                      />
                      {validationErrors.longitude && <span className="text-sm text-destructive">{validationErrors.longitude}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none">State</label>
                      <input 
                        type="text" 
                        name="state" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="e.g. Maharashtra" 
                        value={formData.state} 
                        onChange={handleChange} 
                        disabled={isPending} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none">Pincode</label>
                      <input 
                        type="text" 
                        name="pincode" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="e.g. 400001" 
                        value={formData.pincode} 
                        onChange={handleChange} 
                        disabled={isPending} 
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="isAnonymous"
                      name="isAnonymous" 
                      checked={formData.isAnonymous} 
                      onChange={handleChange} 
                      disabled={isPending} 
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                    />
                    <label htmlFor="isAnonymous" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer">
                      <EyeOff size={16} className="text-muted-foreground" /> Submit Anonymously
                    </label>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Images (Max 5, 5MB each)</label>
                    <div 
                      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isPending ? 'opacity-50 pointer-events-none' : 'hover:bg-muted hover:border-primary/50'}`}
                      onDragOver={handleDragOver} 
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <UploadCloud size={32} className="mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Drag & drop JPG, PNG, WEBP here or click to browse</p>
                      <input 
                        type="file" 
                        multiple 
                        accept="image/jpeg, image/png, image/webp" 
                        ref={fileInputRef} 
                        onChange={handleImageChange} 
                        className="hidden" 
                        disabled={isPending}
                      />
                    </div>

                    {(existingImages.length > 0 || images.length > 0) && (
                      <div className="flex flex-wrap gap-4 mt-4">
                        {/* Existing Images */}
                        {existingImages.map((img) => (
                          <div key={img.id} className="relative w-20 h-20 rounded-md overflow-hidden ring-1 ring-border group">
                            <img src={img.imageUrl} alt="existing" className="w-full h-full object-cover" />
                            <button 
                              type="button" 
                              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" 
                              onClick={(e) => { e.stopPropagation(); handleDeleteExistingImage(img.id); }}
                              disabled={isPending}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                        
                        {/* New Images */}
                        {images.map((file, idx) => (
                          <div key={idx} className="relative w-20 h-20 rounded-md overflow-hidden border-2 border-dashed border-primary">
                            <img src={URL.createObjectURL(file)} alt="new-preview" className="w-full h-full object-cover" />
                            <button 
                              type="button" 
                              className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center" 
                              onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                              disabled={isPending}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end">
                <button 
                  type="submit" 
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-8" 
                  disabled={isPending}
                >
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  {isSubmitting ? 'Creating Complaint...' : isUpdating ? 'Updating Complaint...' : isUploading ? 'Uploading Images...' : isDeletingImage ? 'Deleting Image...' : isEditMode ? 'Save Changes' : 'Submit Complaint'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintForm;
