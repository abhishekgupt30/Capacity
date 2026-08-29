import { useCapacity } from '../context/CapacityContext';

export function useOvertime() {
  const { overtimeRequests, submitOvertime, reviewOvertime, isLoading } = useCapacity();
  return {
    overtimeRequests,
    submitOvertime,
    reviewOvertime,
    isLoading
  };
}
