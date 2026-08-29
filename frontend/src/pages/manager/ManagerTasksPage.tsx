import React, { useState } from 'react';
import { useCapacity } from '../../context/CapacityContext';
import { PageHeader } from '../../components/layout/PageHeader';
import { TaskBoard } from '../../components/tasks/TaskBoard';
import { TaskFormModal } from '../../components/tasks/TaskFormModal';
import { Button } from '../../components/ui/Button';
import { Plus } from 'lucide-react';

export const ManagerTasksPage: React.FC = () => {
  const { tasks, updateTaskStatus, createTask } = useCapacity();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-8 font-sans">
      <PageHeader
        tag="ORGANIZATION DISPATCH"
        title="Team Task Management"
        description="Cross-member sprint tasks, blocker identification, and workload dispatch."
        actions={
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowModal(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create & Allocate Task
          </Button>
        }
      />

      <TaskBoard
        tasks={tasks}
        onStatusChange={updateTaskStatus}
        onNewTaskClick={() => setShowModal(true)}
      />

      <TaskFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={async (input) => {
          await createTask(input);
        }}
      />
    </div>
  );
};
