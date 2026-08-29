import React, { useState } from 'react';
import { RebalancePlan } from '../../types';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Clock, 
  Zap, 
  AlertCircle 
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface RebalancePlanViewProps {
  plan: RebalancePlan;
  onApprove: () => void;
  onReject: () => void;
  isExecuting?: boolean;
}

export const RebalancePlanView: React.FC<RebalancePlanViewProps> = ({
  plan,
  onApprove,
  onReject,
  isExecuting = false
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  return (
    <div className="space-y-8 font-sans">
      {/* Plan Header Card */}
      <div className="architectural-border bg-[#141a32] text-white p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-2 right-4 font-mono text-[9px] text-[#bfc5e4]/50 uppercase">
          PLAN_ID: {plan.id}
        </div>

        <div className="flex items-center gap-3 mb-3">
          <span className="p-1.5 bg-[#497cff] text-white">
            <Sparkles className="w-5 h-5" />
          </span>
          <span className="text-xs uppercase font-bold tracking-widest text-[#bfc5e4]">
            AI REBALANCE BLUEPRINT // CONFIDENCE {plan.confidenceScore}%
          </span>
        </div>

        <h3 className="font-serif text-3xl md:text-4xl font-bold mb-3">
          {plan.title}
        </h3>
        <p className="text-sm text-[#bfc5e4] max-w-3xl leading-relaxed">
          {plan.summary}
        </p>

        {/* Human in the loop reassurance tag */}
        <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center gap-4 text-xs text-[#bfc5e4]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            <span>Human-in-the-loop: Awaiting Manager Sarah Jenkins approval</span>
          </div>
          <div className="text-[11px] font-mono opacity-60">
            Generated: {new Date(plan.generatedAt).toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Expected Impact Summary (4-Card Row) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-[#141a32]/15 bg-[#ffffff] p-5">
          <div className="text-[10px] uppercase tracking-wider text-[#76767e] font-semibold mb-1">
            Overload Elimination
          </div>
          <div className="font-serif text-3xl font-bold text-[#1b873f]">
            {plan.impact.overloadEliminated}
          </div>
          <p className="text-[11px] text-[#76767e] mt-1">Zero team members &gt; 40h</p>
        </div>

        <div className="border border-[#141a32]/15 bg-[#ffffff] p-5">
          <div className="text-[10px] uppercase tracking-wider text-[#76767e] font-semibold mb-1">
            Burnout Reduction
          </div>
          <div className="font-serif text-3xl font-bold text-[#141a32]">
            {plan.impact.burnoutReduction}
          </div>
          <p className="text-[11px] text-[#76767e] mt-1">Cognitive strain stabilized</p>
        </div>

        <div className="border border-[#141a32]/15 bg-[#ffffff] p-5">
          <div className="text-[10px] uppercase tracking-wider text-[#76767e] font-semibold mb-1">
            Velocity Multiplier
          </div>
          <div className="font-serif text-3xl font-bold text-[#497cff]">
            {plan.impact.velocityGain}
          </div>
          <p className="text-[11px] text-[#76767e] mt-1">PR review bottleneck cleared</p>
        </div>

        <div className="border border-[#141a32]/15 bg-[#ffffff] p-5">
          <div className="text-[10px] uppercase tracking-wider text-[#76767e] font-semibold mb-1">
            Sprint Time Saved
          </div>
          <div className="font-serif text-3xl font-bold text-[#141a32]">
            {plan.impact.estimatedTimeSaved}
          </div>
          <p className="text-[11px] text-[#76767e] mt-1">Faster release cycle</p>
        </div>
      </div>

      {/* Before vs Proposed Member Workload Shifts */}
      <div className="border border-[#141a32]/15 bg-[#ffffff] p-6 md:p-8">
        <h4 className="font-serif text-2xl font-bold text-[#141a32] mb-6">
          Workload Allocation: Current vs. Proposed
        </h4>

        <div className="space-y-6">
          {plan.shifts.map((shift, idx) => (
            <div key={idx} className="border border-[#141a32]/15 p-5 bg-[#fcf9f8]">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div>
                  <span className="font-serif text-lg font-bold text-[#141a32]">
                    {shift.memberName}
                  </span>
                  <span className="text-xs text-[#76767e] ml-2">
                    ({shift.role})
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold">
                  <span className={cn(shift.currentHours > 40 ? 'text-[#ba1a1a]' : 'text-[#76767e]')}>
                    {shift.currentHours}h / 40h
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#497cff]" />
                  <span className="text-[#1b873f] bg-green-50 px-2 py-0.5 border border-green-200">
                    {shift.proposedHours}h / 40h (Optimized)
                  </span>
                </div>
              </div>

              {/* Visual before/after bar comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <div className="text-[10px] uppercase text-[#76767e] mb-1 font-semibold">
                    Current Load: {Math.round((shift.currentHours / 40) * 100)}%
                  </div>
                  <div className="h-3 w-full bg-white border border-[#141a32]/20 overflow-hidden">
                    <div
                      className={cn('h-full', shift.currentHours > 40 ? 'bg-[#ba1a1a]' : 'bg-[#141a32]')}
                      style={{ width: `${Math.min((shift.currentHours / 40) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase text-[#76767e] mb-1 font-semibold">
                    Proposed Load: {Math.round((shift.proposedHours / 40) * 100)}%
                  </div>
                  <div className="h-3 w-full bg-white border border-[#141a32]/20 overflow-hidden">
                    <div
                      className="h-full bg-[#1b873f]"
                      style={{ width: `${Math.min((shift.proposedHours / 40) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3 text-xs text-[#46464d] italic bg-white p-2.5 border border-[#141a32]/10">
                Reasoning: {shift.reasoning}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Specific Task Shifts */}
      <div className="border border-[#141a32]/15 bg-[#ffffff] p-6 md:p-8">
        <h4 className="font-serif text-2xl font-bold text-[#141a32] mb-6">
          Specific Task Reassignments (10 Hours Total Shift)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plan.tasksToReassign.map((task) => (
            <div key={task.taskId} className="border border-[#141a32]/15 p-5 bg-[#fcf9f8] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-xs font-bold text-[#497cff]">
                    {task.projectKey}
                  </span>
                  <span className="text-xs font-bold bg-[#141a32] text-white px-2 py-0.5">
                    {task.estimatedHours}h
                  </span>
                </div>
                <h5 className="font-serif text-lg font-bold text-[#141a32] mb-2">
                  {task.taskTitle}
                </h5>
                <p className="text-xs text-[#46464d] leading-relaxed mb-4">
                  {task.rationale}
                </p>
              </div>

              <div className="pt-3 border-t border-[#141a32]/10 flex items-center justify-between text-xs font-semibold">
                <span className="text-[#ba1a1a]">From: {task.fromMemberName}</span>
                <ArrowRight className="w-4 h-4 text-[#76767e]" />
                <span className="text-[#1b873f]">To: {task.toMemberName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Approval Bar */}
      <div className="border-t-2 border-[#141a32] pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#f6f3f2] p-6">
        <div className="text-xs text-[#46464d] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#497cff]" />
          <span>Approving this plan will update Marcus & Elena's allocations and reassign the PR tickets immediately.</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="secondary"
            size="md"
            onClick={onReject}
            disabled={isExecuting}
            leftIcon={<XCircle className="w-4 h-4" />}
          >
            Reject Plan
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => setShowConfirmModal(true)}
            isLoading={isExecuting}
            leftIcon={<CheckCircle className="w-4 h-4" />}
          >
            Approve & Execute Rebalance
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Authorize Workload Rebalance"
        subtitle="Alpha Pod • 10 Hours Workload Shift"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#46464d] leading-relaxed">
            You are approving the AI-generated reallocation for <strong>Alpha Engineering</strong>. This will execute the following operations:
          </p>

          <ul className="space-y-2 text-xs text-[#141a32] bg-[#f0eded] p-4 border border-[#141a32]/15">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#1b873f] shrink-0" />
              <span>Shift 6h Redis cluster partitioning from Marcus Vance to Elena Rostova</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#1b873f] shrink-0" />
              <span>Shift 4h PR review batch from Marcus Vance to Elena Rostova</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#1b873f] shrink-0" />
              <span>Adjust Marcus weekly allocation from 48h to 38h (Balanced)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#1b873f] shrink-0" />
              <span>Adjust Elena weekly allocation from 26h to 36h (Balanced)</span>
            </li>
          </ul>

          <div className="pt-4 flex justify-end gap-3 border-t border-[#141a32]/10">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfirmModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setShowConfirmModal(false);
                onApprove();
              }}
            >
              Confirm & Apply Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
