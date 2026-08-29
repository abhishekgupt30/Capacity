import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCapacity } from '../../context/CapacityContext';
import { PageHeader } from '../../components/layout/PageHeader';
import { OvertimeReviewCard } from '../../components/overtime/OvertimeReviewCard';
import { OvertimeRequestModal } from '../../components/overtime/OvertimeRequestModal';
import { Button } from '../../components/ui/Button';
import { Clock, Plus, ShieldCheck } from 'lucide-react';

export const EmployeeOvertimePage: React.FC = () => {
  const { user } = useAuth();
  const { overtimeRequests, submitOvertime } = useCapacity();
  const [showModal, setShowModal] = useState(false);

  const myRequests = overtimeRequests.filter(r => r.employee_id === user?.id);

  return (
    <div className="space-y-8 font-sans">
      <PageHeader
        tag="CAPACITY COMPLIANCE"
        title="Overtime Management"
        description="Formal workload extensions and manager authorization logs."
        actions={
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowModal(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Request Overtime
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myRequests.length === 0 ? (
          <div className="col-span-full border border-dashed border-[#141a32]/20 p-12 text-center text-[#76767e]">
            No overtime requests on record. All workload remains balanced within normal hours.
          </div>
        ) : (
          myRequests.map(req => (
            <OvertimeReviewCard
              key={req.id}
              request={req}
              onReview={async () => {}}
              isManager={false}
            />
          ))
        )}
      </div>

      <OvertimeRequestModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={async (input) => {
          await submitOvertime(input);
        }}
      />
    </div>
  );
};
