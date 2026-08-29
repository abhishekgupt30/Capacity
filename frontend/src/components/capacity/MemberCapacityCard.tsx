import React from 'react';
import { MemberCapacity, Task } from '../../types';
import { CapacityMeter } from '../ui/CapacityMeter';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { AlertTriangle, Clock, Layers, Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface MemberCapacityCardProps {
  member: MemberCapacity;
  tasks?: Task[];
  onRebalanceClick?: (member: MemberCapacity) => void;
  onAddTaskClick?: (member: MemberCapacity) => void;
}

export const MemberCapacityCard: React.FC<MemberCapacityCardProps> = ({
  member,
  tasks = [],
  onRebalanceClick,
  onAddTaskClick
}) => {
  const isOverloaded = member.allocatedHours > member.weeklyCapacity;
  const memberTasks = tasks.filter(t => t.assigneeId === member.id);

  return (
    <div className={cn(
      'border border-[#141a32]/15 bg-[#ffffff] p-6 shadow-sm flex flex-col justify-between font-sans transition-all duration-200 card-hover relative',
      isOverloaded ? 'border-[#ba1a1a]/40 ring-1 ring-[#ba1a1a]/30' : ''
    )}>
      {/* Top Header */}
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <img
              src={member.avatar}
              alt={member.name}
              className="w-10 h-10 rounded-none border border-[#141a32]/20 object-cover"
            />
            <div>
              <h4 className="font-serif text-lg font-bold text-[#141a32]">
                {member.name}
              </h4>
              <p className="text-xs text-[#76767e]">
                {member.title}
              </p>
            </div>
          </div>
          <Badge variant="capacity" capacityStatus={member.status} size="sm" />
        </div>

        {/* Capacity Meter Component */}
        <div className="mb-6">
          <CapacityMeter
            allocatedHours={member.allocatedHours}
            capacityHours={member.weeklyCapacity}
            size="md"
            status={member.status}
          />
        </div>

        {/* Efficiency & Blocker Statistics */}
        <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-[#141a32]/10 mb-4 text-xs">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#76767e] block">
              Efficiency Index
            </span>
            <span className="font-bold text-[#141a32] text-sm">
              {member.efficiencyIndex}%
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#76767e] block">
              Blockers / PR Drag
            </span>
            <span className={cn('font-bold text-sm', member.blockersCount > 0 ? 'text-[#ba1a1a]' : 'text-[#1b873f]')}>
              {member.blockersCount > 0 ? `${member.blockersCount} Blockers` : 'Zero Blockers'}
            </span>
          </div>
        </div>

        {/* Active Allocated Tasks preview */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#76767e]">
              Active Allocated Tickets ({memberTasks.length})
            </span>
          </div>

          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {memberTasks.length === 0 ? (
              <div className="text-xs text-[#76767e] italic py-2">
                No active tickets assigned
              </div>
            ) : (
              memberTasks.map(task => (
                <div
                  key={task.id}
                  className="p-2 bg-[#fcf9f8] border border-[#141a32]/10 text-xs flex justify-between items-center"
                >
                  <div className="truncate pr-2">
                    <span className="font-mono text-[10px] font-bold text-[#497cff] mr-1.5">
                      {task.projectKey}
                    </span>
                    <span className="text-[#141a32] font-medium">{task.title}</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#76767e] shrink-0">
                    {task.estimatedHours}h
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Card Action footer */}
      <div className="pt-6 mt-6 border-t border-[#141a32]/10 flex gap-2">
        {isOverloaded ? (
          <Button
            size="sm"
            variant="primary"
            className="w-full"
            onClick={() => onRebalanceClick?.(member)}
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
          >
            Rebalance with AI
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={() => onAddTaskClick?.(member)}
          >
            + Assign Task
          </Button>
        )}
      </div>
    </div>
  );
};
