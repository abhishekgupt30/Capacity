import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCapacity } from '../../context/CapacityContext';
import { PageHeader } from '../../components/layout/PageHeader';
import { TaskBoard } from '../../components/tasks/TaskBoard';
import { TaskFormModal } from '../../components/tasks/TaskFormModal';
import { Button } from '../../components/ui/Button';
import { Plus } from 'lucide-react';

export const EmployeeTasksPage: React.FC = () => {
  const { user } = useAuth();
  const { tasks, updateTaskStatus, createTask } = useCapacity();
  const [showModal, setShowModal] = useState(false);

  // Filter tasks for this employee or all team tasks
  const myTasks = tasks.filter(t => t.assignee_id === user?.id);

  return (
    <div className="space-y-8 font-sans">
      <PageHeader
        tag="WORKLOAD BOARD"
        title="My Tasks & Assignments"
        description="Interactive sprint Kanban board. Update status or add tickets to track capacity."
        actions={
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowModal(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Task
          </Button>
        }
      />

      <TaskBoard
        tasks={myTasks}
        onStatusChange={updateTaskStatus}
        onNewTaskClick={() => setShowModal(true)}
      />

      <TaskFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={async (input) => {
          await createTask(input);
        }}
        initialAssigneeId={user?.id}
      />
    </div>
  );
};
