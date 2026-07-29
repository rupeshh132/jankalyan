import React, { useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProfile, useUpdateProfile, useUploadProfilePhoto } from '../../hooks/useProfile';
import { User, Mail, Phone, MapPin, Loader2, Save, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, logout } = useAuth();
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

  // Update form data when profile data is loaded
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
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file (JPEG, PNG, etc.)');
        return;
      }
      // Check file size (e.g. max 5MB)
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

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Profile Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Basic Info */}
        <div className="col-span-1 space-y-6">
          <div className="bg-card rounded-xl border shadow-sm p-6 flex flex-col items-center text-center">
            <div 
              className="relative mb-4 group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-32 h-32 rounded-full bg-primary/10 border-4 border-background shadow-lg overflow-hidden flex items-center justify-center">
                {profile.profileImage ? (
                  <img src={profile.profileImage} alt={profile.fullName} className="w-full h-full object-cover" />
                ) : (
                  <User size={64} className="text-primary/40" />
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
            <h2 className="text-xl font-bold text-foreground">{formData.fullName || profile.fullName}</h2>
            <p className="text-sm text-muted-foreground">{formData.email}</p>
            
            <div className="mt-6 w-full flex items-center justify-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary">
              Role: {user?.role || 'Citizen'}
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="col-span-1 md:col-span-2">
          <div className="bg-card rounded-xl border shadow-sm">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
              <p className="text-sm text-muted-foreground">Update your photo and personal details here.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      disabled
                      className="flex h-10 w-full rounded-md border border-input bg-muted pl-10 pr-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Email address cannot be changed.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border gap-4">
                <button 
                  type="button" 
                  onClick={() => logout()}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-destructive text-destructive hover:bg-destructive/10 h-10 px-8 md:hidden"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </button>
                <button 
                  type="submit" 
                  disabled={updateProfileMutation.isPending}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-8 flex-1 md:flex-none"
                >
                  {updateProfileMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
