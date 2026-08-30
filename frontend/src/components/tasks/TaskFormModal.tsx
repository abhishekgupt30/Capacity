import React, { useState } from 'react';
import { CreateTaskInput, TaskPriority, TaskStatus } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useTeamCapacity } from '../../hooks/useTeamCapacity';
import { useAuth } from '../../context/AuthContext';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateTaskInput) => Promise<void>;
  initialAssigneeId?: string;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialAssigneeId
}) => {
  const { members } = useTeamCapacity();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [estimated_hours, setEstimatedHours] = useState<number>(4);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [assignee_id, setAssigneeId] = useState(initialAssigneeId || members[0]?.id || '');
  const [deadline, setDeadline] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
  const [tagsInput, setTagsInput] = useState('Platform, Backend');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
        await onSubmit({
        title,
        description,
        estimated_hours,
        priority,
        status,
          assignee_id,
          team_id: user?.team_id || '',
        deadline,
        tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      });
      // reset form
      setTitle('');
      setDescription('');
      setEstimatedHours(4);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Engineering Task"
      subtitle="Allocate workload to active team members"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
        <div>
          <label className="block uppercase font-bold text-[#76767e] mb-1">
            Task Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Implement Distributed Telemetry Collector"
            className="w-full border border-[#141a32]/25 bg-white p-2.5 text-sm font-sans focus:outline-none focus:border-[#497cff]"
          />
        </div>

        <div>
          <label className="block uppercase font-bold text-[#76767e] mb-1">
            Description & Context
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Technical details, pull request requirements, or architecture notes..."
            className="w-full border border-[#141a32]/25 bg-white p-2.5 text-sm font-sans focus:outline-none focus:border-[#497cff]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block uppercase font-bold text-[#76767e] mb-1">
              Estimated Hours (Workload) *
            </label>
            <input
              type="number"
              min={1}
              max={40}
              required
              value={estimated_hours}
              onChange={(e) => setEstimatedHours(Number(e.target.value))}
              className="w-full border border-[#141a32]/25 bg-white p-2 text-sm font-sans focus:outline-none focus:border-[#497cff]"
            />
          </div>

          <div>
            <label className="block uppercase font-bold text-[#76767e] mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full border border-[#141a32]/25 bg-white p-2 text-sm font-sans focus:outline-none focus:border-[#497cff]"
            >
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block uppercase font-bold text-[#76767e] mb-1">
              Assignee
            </label>
            <select
              value={assignee_id}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full border border-[#141a32]/25 bg-white p-2 text-sm font-sans focus:outline-none focus:border-[#497cff]"
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.allocated_hours}h / {m.weekly_capacity}h)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block uppercase font-bold text-[#76767e] mb-1">
              Target Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full border border-[#141a32]/25 bg-white p-2 text-sm font-sans focus:outline-none focus:border-[#497cff]"
            />
          </div>
        </div>

        <div>
          <label className="block uppercase font-bold text-[#76767e] mb-1">
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Platform, Database, API"
            className="w-full border border-[#141a32]/25 bg-white p-2 text-sm font-sans focus:outline-none focus:border-[#497cff]"
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
            disabled={!assignee_id || members.length === 0}
          >
            Create & Allocate Task
          </Button>
        </div>
      </form>
    </Modal>
  );
};
