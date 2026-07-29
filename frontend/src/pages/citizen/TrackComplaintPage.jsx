import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import ComplaintTracker from '../../components/complaint/ComplaintTracker';

const TrackComplaintPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';
  
  const [searchInput, setSearchInput] = useState(initialId);
  const [trackingId, setTrackingId] = useState(initialId);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setTrackingId(searchInput.trim());
      setSearchParams({ id: searchInput.trim() });
    }
  };

  useEffect(() => {
    if (initialId && initialId !== trackingId) {
      setTrackingId(initialId);
      setSearchInput(initialId);
    }
  }, [initialId]);

  return (
    <div className="page-container max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center justify-center gap-3">
          <MapPin className="h-8 w-8 text-primary" />
          Track Your Complaint
        </h1>
        <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
          Enter your complaint tracking ID below to see its real-time status and progress history.
        </p>
      </div>

      <div className="bg-card p-6 rounded-xl shadow-sm border mb-8 max-w-lg mx-auto">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              type="text"
              placeholder="Enter Complaint ID (e.g., 123e4567-e89b...)"
              className="pl-10 w-full"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <Button type="submit">Track</Button>
        </form>
      </div>

      {trackingId ? (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ComplaintTracker complaintId={trackingId} />
        </div>
      ) : (
        <div className="mt-12 text-center text-muted-foreground/60">
          <p>The tracking timeline will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default TrackComplaintPage;
