import { useCapacity } from '../context/CapacityContext';

export function useAgent() {
  const { 
    bottlenecks, 
    rebalancePlan, 
    agentStatus, 
    agentLogs, 
    runAgentRebalance, 
    approveAgentPlan, 
    rejectAgentPlan 
  } = useCapacity();
  
  return {
    bottlenecks,
    rebalancePlan,
    agentStatus,
    agentLogs,
    runAgentRebalance,
    approveAgentPlan,
    rejectAgentPlan
  };
}
