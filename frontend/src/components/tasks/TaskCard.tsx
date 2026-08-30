import React, { useState } from 'react';
import { Task, TaskStatus } from '../../types';
import { Badge } from '../ui/Badge';
import { Clock, AlertTriangle, MoreVertical, CheckCircle2, User, RotateCcw } from 'lucide-react';
import { cn } from '../../utils/cn';

interface TaskCardProps {
  task: Task;
  onStatusChange?: (task_id: string, status: TaskStatus) => void;
  onReassign?: (task_id: string) => void;
  onClick?: (task: Task) => void;
  compact?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onStatusChange,
  onReassign,
  onClick,
  compact = false
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const statuses: { label: string; value: TaskStatus }[] = [
    { label: 'To Do', value: 'todo' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Review', value: 'review' },
    { label: 'Completed', value: 'completed' }
  ];

  return (
    <div
      className={cn(
        'border border-[#141a32]/15 bg-[#ffffff] p-4 transition-all duration-150 relative group font-sans card-hover',
        task.blocker_risk ? 'border-[#ba1a1a]/40 bg-[#ffdad6]/10' : '',
        task.status === 'completed' ? 'opacity-60 grayscale bg-[#f0eded]' : ''
      )}
    >
      {/* Top row: Key + Priority + Quick menu */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-bold text-[#497cff]">
            {task.project_key}
          </span>
          <Badge variant="priority" priority={task.priority} size="sm" />
        </div>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 text-[#76767e] hover:text-[#141a32] transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div 
              className="absolute right-0 mt-1 w-36 bg-[#ffffff] architectural-border shadow-lg z-30 p-1 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-[9px] uppercase font-bold text-[#76767e] px-2 py-1">
                Move Status
              </div>
              {statuses.map(s => (
                <button
                  key={s.value}
                  onClick={() => {
                    onStatusChange?.(task.id, s.value);
                    setShowMenu(false);
                  }}
                  className={cn(
                    'w-full text-left px-2 py-1 hover:bg-[#f0eded] text-xs flex items-center justify-between',
                    task.status === s.value ? 'font-bold text-[#497cff]' : 'text-[#141a32]'
                  )}
                >
                  <span>{s.label}</span>
                  {task.status === s.value && <CheckCircle2 className="w-3 h-3" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h4 
        onClick={() => onClick?.(task)}
        className="font-serif text-base font-bold text-[#141a32] mb-2 line-clamp-2 hover:text-[#497cff] cursor-pointer"
      >
        {task.title}
      </h4>

      {/* Blocker Alert Warning */}
      {task.blocker_risk && (
        <div className="mb-3 p-1.5 bg-[#ffdad6]/50 border border-[#ba1a1a]/30 flex items-center gap-1.5 text-[11px] text-[#ba1a1a] font-medium">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>PR Throughput Delay / Blocker</span>
        </div>
      )}

      {/* Description if not compact */}
      {!compact && task.description && (
        <p className="text-xs text-[#46464d] mb-4 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {task.status === 'completed' && (
        <button
          type="button"
          onClick={() => onStatusChange?.(task.id, 'todo')}
          className="mb-4 w-full border border-[#141a32]/20 bg-white px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-[#141a32] hover:bg-[#dce1ff] transition-colors flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-3 h-3" />
          Redo Task
        </button>
      )}

      {/* Footer: Hours + Assignee */}
      <div className="pt-3 border-t border-[#141a32]/10 flex justify-between items-center text-xs">
        <div className="flex items-center gap-1.5 text-[#76767e] font-medium">
          <Clock className="w-3.5 h-3.5 text-[#141a32]" />
          <span>{task.estimated_hours}h est</span>
        </div>

        <div className="flex items-center gap-2">
          {task.assignee_avatar ? (
            <img
              src={task.assignee_avatar}
              alt={task.assignee_name}
              className="w-5 h-5 rounded-none border border-[#141a32]/20 object-cover"
            />
          ) : (
            <div className="w-5 h-5 bg-[#f0eded] border border-[#141a32]/20 flex items-center justify-center text-[10px]">
              <User className="w-3 h-3 text-[#76767e]" />
            </div>
          )}
          <span className="text-[11px] font-semibold text-[#141a32]">
            {task.assignee_name.split(' ')[0]}
          </span>
        </div>
      </div>
    </div>
  );
};
