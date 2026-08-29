import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCapacity } from '../../context/CapacityContext';
import { PageHeader } from '../../components/layout/PageHeader';
import { CapacityMeter } from '../../components/ui/CapacityMeter';
import { MetricCard } from '../../components/ui/MetricCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { TaskCard } from '../../components/tasks/TaskCard';
import { TaskFormModal } from '../../components/tasks/TaskFormModal';
import { OvertimeRequestModal } from '../../components/overtime/OvertimeRequestModal';
import { 
  CheckSquare, 
  Clock, 
  TrendingUp, 
  Plus, 
  Send, 
  AlertCircle,
  Sparkles,
  Layers
} from 'lucide-react';
import { TaskStatus } from '../../types';

export const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const { tasks, members, updateTaskStatus, createTask, submitOvertime } = useCapacity();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showOvertimeModal, setShowOvertimeModal] = useState(false);

  // Current employee data
  const currentMember = members.find(m => m.id === user?.id) || members[1]; // default Alex Rivera
  const myTasks = tasks.filter(t => t.assigneeId === currentMember.id || t.assigneeName.includes('Alex'));
  const pendingReviewCount = myTasks.filter(t => t.status === 'review').length;

  return (
    <div className="space-y-10 font-sans">
      {/* Page Header */}
      <PageHeader
        tag="EMPLOYEE CAPACITY TELEMETRY"
        title={
          <span>
            Welcome back, <span className="text-[#497cff]">{user?.name || 'Alex'}</span>
          </span>
        }
        description={`Alpha Pod • ${currentMember.title} • Personal Workload & Telemetry`}
        actions={
          <>
            <Button
              variant="outline"
              size="md"
              onClick={() => setShowOvertimeModal(true)}
              leftIcon={<Clock className="w-4 h-4" />}
            >
              Request Overtime
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowTaskModal(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Task
            </Button>
          </>
        }
      />

      {/* Global System Capacity Section (Exact Match to Stitch design) */}
      <section className="architectural-border bg-[#ffffff] p-6 md:p-10 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#76767e] block mb-1">
              GLOBAL SYSTEM CAPACITY
            </span>
            <div className="font-serif text-3xl md:text-5xl font-bold text-[#141a32]">
              78.4%
            </div>
          </div>
          <div className="mt-2 md:mt-0 text-right">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#1b873f] bg-green-50 border border-green-200 px-2.5 py-1">
              Optimal Allocation Band
            </span>
            <p className="text-xs text-[#76767e] mt-1.5">
              Personal Load: {currentMember.allocatedHours}h / {currentMember.weeklyCapacity}h
            </p>
          </div>
        </div>

        {/* Large Architectural Capacity Meter */}
        <CapacityMeter
          allocatedHours={currentMember.allocatedHours}
          capacityHours={currentMember.weeklyCapacity}
          showDetails={false}
          size="lg"
        />

        <div className="flex justify-between items-center mt-3 text-xs text-[#76767e] uppercase tracking-wider">
          <span>Base Load (0h)</span>
          <span>Target Equilibrium (28-34h)</span>
          <span>Peak Optimization Threshold ({currentMember.weeklyCapacity}h)</span>
        </div>
      </section>

      {/* Key Indicators (3-card row) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          label="Active Assigned Tasks"
          value={myTasks.length}
          subtext={`${pendingReviewCount} Pending Verification`}
          icon={<CheckSquare className="w-6 h-6 text-[#141a32]" />}
        />

        <MetricCard
          label="Overtime Delta"
          value={`+${currentMember.overtimeHours || 4.2}h`}
          subtext="Within Safe Operational Bounds"
          icon={<Clock className="w-6 h-6 text-[#497cff]" />}
        />

        <MetricCard
          label="Efficiency Index"
          value={`${currentMember.efficiencyIndex}%`}
          subtext="Top Quartile Delivery Velocity"
          icon={<TrendingUp className="w-6 h-6 text-[#1b873f]" />}
        />
      </section>

      {/* Active Workload Stream */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b border-[#141a32]/15 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#76767e] block mb-1">
              CURRENT ASSIGNMENTS
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#141a32]">
              Active Workload Stream
            </h3>
          </div>
          <span className="text-xs text-[#76767e] font-mono">
            {myTasks.length} Tickets in Sprint
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myTasks.length === 0 ? (
            <div className="col-span-full border border-dashed border-[#141a32]/20 p-12 text-center text-[#76767e]">
              No active tasks allocated. Click "+ Add Task" to begin.
            </div>
          ) : (
            myTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={updateTaskStatus}
              />
            ))
          )}
        </div>
      </section>

      {/* Modals */}
      <TaskFormModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSubmit={async (input) => {
          await createTask(input);
        }}
        initialAssigneeId={currentMember.id}
      />

      <OvertimeRequestModal
        isOpen={showOvertimeModal}
        onClose={() => setShowOvertimeModal(false)}
        onSubmit={async (input) => {
          await submitOvertime(input);
        }}
      />
    </div>
  );
};
