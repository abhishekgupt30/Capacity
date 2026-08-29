import { useCapacity } from '../context/CapacityContext';

export function useTeamCapacity() {
  const { members, metrics, isLoading, refreshData, resetToInitialDemoState } = useCapacity();
  return {
    members,
    metrics,
    isLoading,
    refreshData,
    resetToInitialDemoState
  };
}
