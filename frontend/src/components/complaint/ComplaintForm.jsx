import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCreateComplaint } from '../../hooks/useCreateComplaint';
import { complaintService } from '../../services/complaintService';
import { Loader2, Send } from 'lucide-react';
import './complaint.css';
import '../../components/auth/auth.css'; // Reusing glassmorphism forms

const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    latitude: 0,
    longitude: 0,
    city: '',
    state: '',
    address: '',
    ward: '',
    pincode: ''
  });
  
  const [validationErrors, setValidationErrors] = useState({});
  const { mutate: submitComplaint, isPending, error } = useCreateComplaint();

  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: complaintService.getCategories
  });
  const categories = categoriesData?.data || [];

  const validate = () => {
    const errors = {};
    if (!formData.title) errors.title = 'Title is required';
    if (!formData.description) errors.description = 'Description is required';
    if (!formData.city) errors.city = 'City is required';
    if (!formData.categoryId) errors.categoryId = 'Category is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (validationErrors[e.target.name]) {
      setValidationErrors({ ...validationErrors, [e.target.name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      submitComplaint(formData);
    }
  };

  const getErrorMessage = () => {
    if (!error) return null;
    return error.response?.data?.message || error.message || 'Submission failed';
  };

  return (
    <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="auth-title">Report a Complaint</h2>
      
      {error && <div className="auth-error">{getErrorMessage()}</div>}

      <form onSubmit={handleSubmit}>
        <div className="auth-form-group">
          <label className="auth-label">Title</label>
          <input
            type="text"
            name="title"
            className="auth-input"
            placeholder="Brief title of the issue"
            value={formData.title}
            onChange={handleChange}
            disabled={isPending}
          />
          {validationErrors.title && <span className="validation-error">{validationErrors.title}</span>}
        </div>

        <div className="auth-form-group">
          <label className="auth-label">Category</label>
          <select
            name="categoryId"
            className="auth-input"
            value={formData.categoryId}
            onChange={handleChange}
            disabled={isPending || isLoadingCategories}
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {validationErrors.categoryId && <span className="validation-error">{validationErrors.categoryId}</span>}
        </div>

        <div className="auth-form-group">
          <label className="auth-label">Description</label>
          <textarea
            name="description"
            className="auth-input"
            style={{ minHeight: '100px', resize: 'vertical' }}
            placeholder="Detailed description of the issue"
            value={formData.description}
            onChange={handleChange}
            disabled={isPending}
          />
          {validationErrors.description && <span className="validation-error">{validationErrors.description}</span>}
        </div>

        <div className="auth-form-group">
          <label className="auth-label">City</label>
          <input
            type="text"
            name="city"
            className="auth-input"
            placeholder="Enter city"
            value={formData.city}
            onChange={handleChange}
            disabled={isPending}
          />
          {validationErrors.city && <span className="validation-error">{validationErrors.city}</span>}
        </div>

        <button type="submit" className="auth-button" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
          {isPending ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;
