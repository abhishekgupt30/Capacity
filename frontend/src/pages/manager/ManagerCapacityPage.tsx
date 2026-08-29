import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCapacity } from '../../context/CapacityContext';
import { PageHeader } from '../../components/layout/PageHeader';
import { MemberCapacityCard } from '../../components/capacity/MemberCapacityCard';
import { TaskFormModal } from '../../components/tasks/TaskFormModal';
import { Button } from '../../components/ui/Button';
import { Sparkles, Plus, Filter } from 'lucide-react';

export const ManagerCapacityPage: React.FC = () => {
  const navigate = useNavigate();
  const { members, tasks, createTask } = useCapacity();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | undefined>(undefined);

  const filteredMembers = members.filter(m => {
    if (filterStatus === 'all') return true;
    return m.status === filterStatus;
  });

  return (
    <div className="space-y-8 font-sans">
      <PageHeader
        tag="WORKFORCE MATRIX"
        title="Team Capacity & Load"
        description="Comprehensive bandwidth allocation, sprint capacity limits, and efficiency telemetry for Alpha Engineering."
        actions={
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/manager/agent')}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Run AI Rebalancing
          </Button>
        }
      />

      {/* Filter toolbar */}
      <div className="flex justify-between items-center bg-white p-4 border border-[#141a32]/15">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#76767e]" />
          <span className="text-xs uppercase font-bold text-[#76767e]">Filter by Status:</span>
          <div className="flex gap-1 ml-2">
            {['all', 'overloaded', 'approaching', 'balanced', 'underutilized'].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`text-xs px-3 py-1 uppercase tracking-wider font-semibold border ${
                  filterStatus === s 
                    ? 'bg-[#141a32] text-white border-[#141a32]' 
                    : 'bg-white text-[#46464d] border-[#141a32]/20 hover:bg-[#f0eded]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs text-[#76767e] font-mono">
          Showing {filteredMembers.length} of {members.length} Engineers
        </span>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredMembers.map(member => (
          <MemberCapacityCard
            key={member.id}
            member={member}
            tasks={tasks}
            onRebalanceClick={() => navigate('/manager/agent')}
            onAddTaskClick={(m) => {
              setSelectedMemberId(m.id);
              setShowTaskModal(true);
            }}
          />
        ))}
      </div>

      <TaskFormModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSubmit={async (input) => {
          await createTask(input);
        }}
        initialAssigneeId={selectedMemberId}
      />
    </div>
  );
};
