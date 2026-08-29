import React from 'react';
import { useCapacity } from '../../context/CapacityContext';
import { PageHeader } from '../../components/layout/PageHeader';
import { OvertimeReviewCard } from '../../components/overtime/OvertimeReviewCard';
import { Clock, CheckCircle2 } from 'lucide-react';

export const ManagerOvertimePage: React.FC = () => {
  const { overtimeRequests, reviewOvertime } = useCapacity();

  const pendingRequests = overtimeRequests.filter(r => r.status === 'pending');
  const resolvedRequests = overtimeRequests.filter(r => r.status !== 'pending');

  return (
    <div className="space-y-10 font-sans">
      <PageHeader
        tag="AUTHORIZATION QUEUE"
        title="Overtime Review & Approvals"
        description="Review engineering workload extension requests, maintain compliance, and prevent silent burnout."
      />

      {/* Pending Reviews Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-center border-b border-[#141a32]/15 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-amber-500 rounded-none" />
            <h3 className="font-serif text-2xl font-bold text-[#141a32]">
              Pending Approval Queue ({pendingRequests.length})
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pendingRequests.length === 0 ? (
            <div className="col-span-full border border-dashed border-[#141a32]/20 p-10 text-center text-xs text-[#76767e] italic">
              All overtime requests have been resolved.
            </div>
          ) : (
            pendingRequests.map(req => (
              <OvertimeReviewCard
                key={req.id}
                request={req}
                onReview={reviewOvertime}
                isManager={true}
              />
            ))
          )}
        </div>
      </section>

      {/* Resolved History Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-center border-b border-[#141a32]/15 pb-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <h3 className="font-serif text-2xl font-bold text-[#141a32]">
              Resolved History ({resolvedRequests.length})
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resolvedRequests.map(req => (
            <OvertimeReviewCard
              key={req.id}
              request={req}
              onReview={reviewOvertime}
              isManager={true}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
