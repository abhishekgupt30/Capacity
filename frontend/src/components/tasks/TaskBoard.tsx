import React, { useState } from 'react';
import { Task, TaskStatus } from '../../types';
import { TaskCard } from './TaskCard';
import { Search, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface TaskBoardProps {
  tasks: Task[];
  onStatusChange: (task_id: string, status: TaskStatus) => void;
}

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'todo', title: 'To Do', color: '#76767e' },
  { id: 'in_progress', title: 'In Progress', color: '#497cff' },
  { id: 'review', title: 'Review Required', color: '#d97706' },
  { id: 'completed', title: 'Completed', color: '#1b873f' }
];

export const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  onStatusChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');
  const [filterBlockerOnly, setFilterBlockerOnly] = useState(false);
  const oneDayMs = 24 * 60 * 60 * 1000;

  // Unique assignees for filter
  const assignees = Array.from(new Set(tasks.map(t => t.assignee_name)));

  const visibleTasks = tasks.filter(task => {
    if (task.status !== 'completed' || !task.completed_at) return true;
    return Date.now() - new Date(task.completed_at).getTime() <= oneDayMs;
  });

  const filteredTasks = visibleTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.project_key.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAssignee = filterAssignee === 'all' || task.assignee_name === filterAssignee;
    const matchesBlocker = !filterBlockerOnly || task.blocker_risk;
    return matchesSearch && matchesAssignee && matchesBlocker;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#ffffff] p-4 border border-[#141a32]/15">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search box */}
          <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
            <Search className="w-4 h-4 text-[#76767e] absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tickets (e.g., CAP-101)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#141a32]/20 focus:outline-none focus:border-[#497cff]"
            />
          </div>

          {/* Assignee Filter */}
          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="text-xs border border-[#141a32]/20 bg-white py-1.5 px-3 focus:outline-none focus:border-[#497cff]"
          >
            <option value="all">All Assignees</option>
            {assignees.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          {/* Blocker only toggle */}
          <button
            onClick={() => setFilterBlockerOnly(!filterBlockerOnly)}
            className={cn(
              'text-xs px-3 py-1.5 border font-semibold flex items-center gap-1.5 transition-colors',
              filterBlockerOnly
                ? 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a]/40'
                : 'bg-white text-[#46464d] border-[#141a32]/20 hover:bg-[#f6f3f2]'
            )}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Blockers Only</span>
          </button>
        </div>

      </div>

      {/* Kanban 4 Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {COLUMNS.map(column => {
          const colTasks = filteredTasks.filter(t => t.status === column.id);
          const colHours = colTasks.reduce((acc, t) => acc + t.estimated_hours, 0);

          return (
            <div
              key={column.id}
              className="border border-[#141a32]/15 bg-[#fcf9f8] flex flex-col min-h-[500px]"
            >
              {/* Column Header */}
              <div className="p-4 border-b border-[#141a32]/15 bg-[#ffffff] flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-none"
                    style={{ backgroundColor: column.color }}
                  />
                  <h4 className="font-sans text-xs uppercase font-bold tracking-wider text-[#141a32]">
                    {column.title}
                  </h4>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#76767e] bg-[#f0eded] px-2 py-0.5 border border-[#141a32]/10">
                  {colTasks.length} ({colHours}h)
                </span>
              </div>

              {/* Column Task List */}
              <div className="p-3 space-y-3 flex-grow overflow-y-auto max-h-[calc(100vh-320px)]">
                {colTasks.length === 0 ? (
                  <div className="h-32 border border-dashed border-[#141a32]/15 flex items-center justify-center text-xs text-[#76767e] italic">
                    No tickets in this queue
                  </div>
                ) : (
                  colTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={onStatusChange}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
