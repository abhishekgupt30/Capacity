import React, { useState } from 'react';
import { OvertimeRequest, OvertimeStatus } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { CheckCircle2, XCircle, Clock, Calendar, User, FileText } from 'lucide-react';
import { cn } from '../../utils/cn';

interface OvertimeReviewCardProps {
  request: OvertimeRequest;
  onReview: (requestId: string, status: OvertimeStatus, notes?: string) => Promise<void>;
  isManager?: boolean;
}

export const OvertimeReviewCard: React.FC<OvertimeReviewCardProps> = ({
  request,
  onReview,
  isManager = false
}) => {
  const [manager_notes, setManagerNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async (status: OvertimeStatus) => {
    setIsProcessing(true);
    try {
      await onReview(request.id, status, manager_notes);
    } finally {
      setIsProcessing(false);
    }
  };

  const isPending = request.status === 'pending';

  return (
    <div className={cn(
      'border border-[#141a32]/15 bg-[#ffffff] p-6 shadow-sm font-sans flex flex-col justify-between card-hover',
      isPending ? 'border-amber-300 bg-amber-50/10' : ''
    )}>
      <div>
        {/* Top Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <img
              src={request.employee_avatar}
              alt={request.employee_name}
              className="w-10 h-10 rounded-none border border-[#141a32]/20 object-cover"
            />
            <div>
              <h4 className="font-serif text-lg font-bold text-[#141a32]">
                {request.employee_name}
              </h4>
              <p className="text-xs text-[#76767e]">
                {request.employee_title}
              </p>
            </div>
          </div>
          <Badge overtimeStatus={request.status} size="sm" />
        </div>

        {/* Project & Hours Badge */}
        <div className="bg-[#fcf9f8] p-3 border border-[#141a32]/10 mb-4 flex flex-wrap justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#497cff]" />
            <span className="font-bold text-[#141a32]">{request.project_name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#ba1a1a] bg-[#ffdad6] px-2 py-0.5">
              +{request.requested_hours} Hours Requested
            </span>
            <span className="text-[#76767e] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {request.date}
            </span>
          </div>
        </div>

        {/* Reason text */}
        <div className="mb-4">
          <span className="text-[10px] uppercase font-bold text-[#76767e] block mb-1">
            Justification & Context:
          </span>
          <p className="text-xs text-[#46464d] leading-relaxed italic bg-white p-3 border border-[#141a32]/10">
            "{request.reason}"
          </p>
        </div>

        {/* Review Notes (if already reviewed) */}
        {request.manager_notes && (
          <div className="mb-4 p-3 bg-[#f0eded] border border-[#141a32]/10 text-xs">
            <div className="text-[10px] uppercase font-bold text-[#141a32] mb-1">
              Reviewed by {request.reviewed_by} on {request.reviewed_at ? new Date(request.reviewed_at).toLocaleDateString() : 'N/A'}:
            </div>
            <p className="text-[#46464d]">{request.manager_notes}</p>
          </div>
        )}
      </div>

      {/* Action Bar for Managers on Pending requests */}
      {isManager && isPending && (
        <div className="pt-4 border-t border-[#141a32]/10 space-y-3">
          <input
            type="text"
            placeholder="Add optional review feedback/notes..."
            value={manager_notes}
            onChange={(e) => setManagerNotes(e.target.value)}
            className="w-full text-xs p-2 border border-[#141a32]/20 focus:outline-none focus:border-[#497cff]"
          />
          <div className="flex gap-2 justify-end">
            <Button
              size="sm"
              variant="secondary"
              disabled={isProcessing}
              onClick={() => handleAction('rejected')}
              leftIcon={<XCircle className="w-3.5 h-3.5" />}
            >
              Reject
            </Button>
            <Button
              size="sm"
              variant="success"
              isLoading={isProcessing}
              onClick={() => handleAction('approved')}
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
            >
              Approve Overtime
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
