import { useCapacity } from '../context/CapacityContext';

export function useTasks() {
  const { tasks, createTask, updateTaskStatus, reassignTask, deleteTask, isLoading } = useCapacity();
  return {
    tasks,
    createTask,
    updateTaskStatus,
    reassignTask,
    deleteTask,
    isLoading
  };
}
