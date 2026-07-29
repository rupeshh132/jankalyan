import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { complaintApi } from '../../api/complaintApi';

const statusConfig = {
  SUBMITTED: { label: 'Complaint Submitted', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-100', border: 'border-green-500' },
  UNDER_REVIEW: { label: 'Under Review', icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-100', border: 'border-yellow-500' },
  IN_PROGRESS: { label: 'In Progress', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-100', border: 'border-blue-500' },
  RESOLVED: { label: 'Resolved', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-600' },
  REJECTED: { label: 'Rejected', icon: XCircle, color: 'text-red-500', bg: 'bg-red-100', border: 'border-red-500' }
};

const defaultSteps = ['SUBMITTED', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED'];

const ComplaintTracker = ({ complaintId }) => {
  const { data: history = [], isLoading, isError } = useQuery({
    queryKey: ['complaintHistory', complaintId],
    queryFn: () => complaintApi.getComplaintHistory(complaintId),
    enabled: !!complaintId,
  });

  if (!complaintId) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-muted-foreground border border-dashed rounded-lg">
        <AlertCircle className="h-8 w-8 mb-2 opacity-50" />
        <p>Please enter a Complaint ID to track.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-destructive/10 text-destructive rounded-lg flex items-start gap-3">
        <AlertCircle className="h-5 w-5 mt-0.5" />
        <div>
          <h4 className="font-semibold">Tracking Failed</h4>
          <p className="text-sm opacity-90">Could not find tracking history for this complaint. Please verify the ID.</p>
        </div>
      </div>
    );
  }

  // Determine current active status from history, or default to SUBMITTED
  const currentStatus = history.length > 0 ? history[0].newStatus : 'SUBMITTED';
  const isRejected = currentStatus === 'REJECTED';
  
  // Use a custom step list if rejected
  const stepsToRender = isRejected ? ['SUBMITTED', 'REJECTED'] : defaultSteps;
  
  // Map history to steps
  const historyMap = history.reduce((acc, curr) => {
    acc[curr.newStatus] = curr.createdAt;
    return acc;
  }, {});
  
  // If no history exists yet (maybe newly created and history not synced), just mark SUBMITTED as active
  if (history.length === 0) {
    historyMap['SUBMITTED'] = new Date().toISOString();
  }

  // Find index of current status to determine which steps are completed
  const currentStepIndex = stepsToRender.indexOf(currentStatus) === -1 
    ? stepsToRender.indexOf('SUBMITTED') // fallback
    : stepsToRender.indexOf(currentStatus);

  return (
    <div className="bg-card rounded-lg shadow-sm border p-6 max-w-lg w-full mx-auto">
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        Tracking Status
        <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded">
          ID: {complaintId.split('-')[0]}...
        </span>
      </h3>
      
      <div className="relative">
        {/* Vertical Line background */}
        <div className="absolute left-[15px] top-4 bottom-8 w-0.5 bg-border z-0"></div>

        <div className="space-y-8 relative z-10">
          {stepsToRender.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const timestamp = historyMap[step];
            const config = statusConfig[step];
            const Icon = config.icon;

            return (
              <div key={step} className="flex gap-4">
                <div className="relative flex flex-col items-center">
                  {/* Circle Indicator */}
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 bg-card
                      ${isCompleted ? config.border : 'border-border'}
                      ${isCompleted ? config.color : 'text-muted-foreground'}
                    `}
                  >
                    {isCompleted ? (
                      <Icon className="h-4 w-4" />
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-border" />
                    )}
                  </div>
                  
                  {/* Fill the line if completed (except for last item) */}
                  {index < stepsToRender.length - 1 && isCompleted && index < currentStepIndex && (
                    <div className="absolute top-8 left-1/2 -ml-px w-0.5 h-full bg-primary/40 -z-10"></div>
                  )}
                </div>

                <div className={`flex-1 pt-1 ${isCompleted ? '' : 'opacity-50'}`}>
                  <h4 className={`text-base font-semibold ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {config.label}
                  </h4>
                  {timestamp ? (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {format(new Date(timestamp), "EEE, d MMM ''yy - h:mm a")}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground/60 mt-0.5">
                      Pending
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ComplaintTracker;
