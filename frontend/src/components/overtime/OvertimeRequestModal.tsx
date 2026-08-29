import React, { useState } from 'react';
import { RequestOvertimeInput } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

interface OvertimeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: RequestOvertimeInput) => Promise<void>;
}

export const OvertimeRequestModal: React.FC<OvertimeRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const { user } = useAuth();
  const [requestedHours, setRequestedHours] = useState<number>(6);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [projectName, setProjectName] = useState('Core Telemetry Pipeline v3.1');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || !user) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        employeeId: user.id,
        requestedHours,
        date,
        projectName,
        reason
      });
      setReason('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Overtime Authorization"
      subtitle="Submit formal workload extension for manager review"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
        <div className="p-3 bg-[#dce1ff]/30 border border-[#141a32]/10 text-xs text-[#141a32]">
          <div className="font-bold">Applicant: {user?.name || 'Alex Rivera'}</div>
          <div className="text-[#46464d]">Current Weekly Bandwidth: {user?.currentHours || 38}h / 40h standard</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block uppercase font-bold text-[#76767e] mb-1">
              Requested Hours *
            </label>
            <input
              type="number"
              min={1}
              max={20}
              required
              value={requestedHours}
              onChange={(e) => setRequestedHours(Number(e.target.value))}
              className="w-full border border-[#141a32]/25 bg-white p-2.5 text-sm font-sans focus:outline-none focus:border-[#497cff]"
            />
          </div>

          <div>
            <label className="block uppercase font-bold text-[#76767e] mb-1">
              Effective Date *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-[#141a32]/25 bg-white p-2.5 text-sm font-sans focus:outline-none focus:border-[#497cff]"
            />
          </div>
        </div>

        <div>
          <label className="block uppercase font-bold text-[#76767e] mb-1">
            Project / Milestone Name *
          </label>
          <input
            type="text"
            required
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="e.g. Distributed Database Clustering"
            className="w-full border border-[#141a32]/25 bg-white p-2.5 text-sm font-sans focus:outline-none focus:border-[#497cff]"
          />
        </div>

        <div>
          <label className="block uppercase font-bold text-[#76767e] mb-1">
            Business Justification & Impact *
          </label>
          <textarea
            rows={4}
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain the critical delivery dependency, incident mitigation, or sprint blocker requiring additional hours..."
            className="w-full border border-[#141a32]/25 bg-white p-2.5 text-sm font-sans focus:outline-none focus:border-[#497cff]"
          />
        </div>

        <div className="pt-4 border-t border-[#141a32]/10 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
          >
            Submit Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};
