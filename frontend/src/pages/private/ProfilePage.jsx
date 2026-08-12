import React, { useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProfile, useUpdateProfile, useUploadProfilePhoto } from '../../hooks/useProfile';
import { User, Mail, Phone, MapPin, Loader2, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user } = useAuth();
  const { data: profileData, isLoading: isProfileLoading, isError } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const uploadPhotoMutation = useUploadProfilePhoto();
  const fileInputRef = useRef(null);
  
  const profile = profileData?.data || {};

  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });

  const [validationErrors, setValidationErrors] = useState({});

  React.useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
      });
    }
  }, [profileData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file (JPEG, PNG, etc.)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      uploadPhotoMutation.mutate(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate({
      fullName: formData.fullName,
      phone: formData.phone,
      address: formData.address,
    });
  };

  if (isProfileLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center text-destructive">
        Failed to load profile. Please refresh the page.
      </div>
    );
  }

  const inputStyle = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid #d1d5db',
    borderRadius: '0',
    padding: '8px 0',
    fontFamily: 'Inter, sans-serif',
    fontSize: '15px',
    color: '#111827',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  };

  const labelStyle = {
    display: 'block',
    fontFamily: 'Inter, sans-serif',
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#6b7280',
    marginBottom: '4px',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', fontWeight: 700, color: '#111827', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
          Your Profile
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#6b7280', margin: 0 }}>
          Keep your contact details up to date.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Basic Info */}
        <div className="col-span-1">
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)' }}>
            <div 
              className="relative mb-6 group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-[120px] h-[120px] rounded-full bg-primary/5 overflow-hidden flex items-center justify-center border border-gray-100">
                {profile.profileImage ? (
                  <img src={profile.profileImage} alt={profile.fullName} className="w-full h-full object-cover" />
                ) : (
                  <User size={48} className="text-primary/40" />
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {uploadPhotoMutation.isPending ? (
                  <Loader2 className="text-white animate-spin" size={24} />
                ) : (
                  <>
                    <Camera className="text-white mb-1" size={24} />
                    <span className="text-xs text-white font-medium">Change</span>
                  </>
                )}
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handlePhotoUpload}
            />
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>{formData.fullName || profile.fullName}</h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#64748b', margin: 0 }}>{formData.email}</p>
            
            <div style={{ marginTop: '20px', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '6px 14px', borderRadius: '999px', background: '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0' }}>
              {user?.role || 'Citizen'}
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="col-span-1 md:col-span-2">
          <div style={{
            background: '#FAFAFF', 
            border: '1px solid #e5e7eb', 
            borderRadius: '16px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)'
          }}>
            {/* Local Styles for Blob Animation */}
            <style>{`
              @keyframes profile-blob-1 {
                0%, 100% { transform: translate(0, 0) scale(1); }
                33% { transform: translate(15%, -10%) scale(1.05); }
                66% { transform: translate(-10%, 15%) scale(0.95); }
              }
              @keyframes profile-blob-2 {
                0%, 100% { transform: translate(0, 0) scale(1); }
                33% { transform: translate(-15%, 10%) scale(1.05); }
                66% { transform: translate(10%, -15%) scale(0.95); }
              }
              @keyframes profile-blob-3 {
                0%, 100% { transform: translate(0, 0) scale(1); }
                33% { transform: translate(10%, 15%) scale(0.95); }
                66% { transform: translate(-15%, -10%) scale(1.05); }
              }
              @media (prefers-reduced-motion: reduce) {
                .profile-mesh-blob { animation: none !important; }
              }
            `}</style>

            {/* Background Gradient Mesh */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: 'none' }}>
              <div className="profile-mesh-blob" style={{ position: 'absolute', top: '-20%', left: '-20%', width: '70%', height: '70%', background: 'radial-gradient(circle, rgba(162, 233, 255, 0.4) 0%, rgba(162, 233, 255, 0) 70%)', borderRadius: '50%', filter: 'blur(80px)', animation: 'profile-blob-1 20s ease-in-out infinite' }} />
              <div className="profile-mesh-blob" style={{ position: 'absolute', top: '-10%', right: '-20%', width: '70%', height: '80%', background: 'radial-gradient(circle, rgba(239, 204, 255, 0.4) 0%, rgba(239, 204, 255, 0) 70%)', borderRadius: '50%', filter: 'blur(80px)', animation: 'profile-blob-2 25s ease-in-out infinite', animationDelay: '5s' }} />
              <div className="profile-mesh-blob" style={{ position: 'absolute', bottom: '-30%', left: '-10%', width: '80%', height: '80%', background: 'radial-gradient(circle, rgba(193, 232, 255, 0.4) 0%, rgba(193, 232, 255, 0) 70%)', borderRadius: '50%', filter: 'blur(80px)', animation: 'profile-blob-3 22s ease-in-out infinite', animationDelay: '2s' }} />
            </div>

            <div className="relative z-10 p-8">
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0 }}>Personal Information</h3>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label style={labelStyle}>Full Name</label>
                    <input 
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      style={inputStyle}
                      onFocus={(e) => e.target.style.borderBottomColor = '#111827'}
                      onBlur={(e) => e.target.style.borderBottomColor = '#d1d5db'}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      disabled
                      style={{ ...inputStyle, color: '#9ca3af', borderBottomStyle: 'dashed' }}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      style={inputStyle}
                      onFocus={(e) => e.target.style.borderBottomColor = '#111827'}
                      onBlur={(e) => e.target.style.borderBottomColor = '#d1d5db'}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Address</label>
                    <input 
                      type="text" 
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      style={inputStyle}
                      onFocus={(e) => e.target.style.borderBottomColor = '#111827'}
                      onBlur={(e) => e.target.style.borderBottomColor = '#d1d5db'}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                    type="submit" 
                    disabled={updateProfileMutation.isPending}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#111827',
                      color: '#ffffff',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      fontWeight: 600,
                      padding: '0 32px',
                      height: '40px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: updateProfileMutation.isPending ? 'not-allowed' : 'pointer',
                      transition: 'background 0.5s ease',
                      opacity: updateProfileMutation.isPending ? 0.7 : 1
                    }}
                    onMouseEnter={e => { if (!updateProfileMutation.isPending) e.currentTarget.style.background = '#2563eb'; }}
                    onMouseLeave={e => { if (!updateProfileMutation.isPending) e.currentTarget.style.background = '#111827'; }}
                  >
                    {updateProfileMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
