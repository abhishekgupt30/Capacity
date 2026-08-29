import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCapacity } from '../../context/CapacityContext';
import { PageHeader } from '../../components/layout/PageHeader';
import { AgentExecutionTimeline } from '../../components/agent/AgentExecutionTimeline';
import { RebalancePlanView } from '../../components/agent/RebalancePlanView';
import { BottleneckCard } from '../../components/agent/BottleneckCard';
import { Button } from '../../components/ui/Button';
import { Sparkles, Bot, RefreshCw, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export const ManagerAgentPage: React.FC = () => {
  const navigate = useNavigate();
  const { bottlenecks, rebalancePlan, agentStatus, agentLogs, runAgentRebalance, approveAgentPlan, rejectAgentPlan, refreshData, isLoading, error } = useCapacity();
  const isRunning = agentStatus === 'analyzing' || agentStatus === 'simulating';
  const isReady = agentStatus === 'ready';
  return <div className="space-y-10 font-sans">
    <PageHeader tag="WORKLOAD ANALYSIS" title="Capacity Analysis" description="Analyze current team workloads and review database-backed task reallocation recommendations." actions={<div className="flex gap-3"><Button variant="outline" size="md" onClick={() => void refreshData()} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>Refresh Data</Button>{(agentStatus === 'idle' || agentStatus === 'rejected' || agentStatus === 'error') && <Button variant="primary" size="md" onClick={() => void runAgentRebalance()} leftIcon={<Sparkles className="w-4 h-4" />}>Run Analysis</Button>}</div>} />
    {error && <div className="border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}
    {isRunning && <div className="architectural-border border-[#497cff]/30 bg-[#f4f6ff] p-8 text-center" role="status" aria-live="polite">
      <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-[#497cff]" />
      <h4 className="font-serif text-2xl font-bold text-[#141a32]">Analyzing team capacity…</h4>
      <p className="mt-2 text-sm text-[#46464d]">The AI agent is reviewing workloads and preparing rebalancing recommendations.</p>
    </div>}
    {agentStatus === 'approved' && <div className="architectural-border bg-green-50 border-green-300 p-6 text-green-950 flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-600" /><span>The approved workload changes have been committed to the database.</span></div>}
    {agentStatus === 'rejected' && <div className="architectural-border bg-amber-50 border-amber-300 p-6 text-amber-950 flex items-center gap-3"><XCircle className="w-5 h-5 text-amber-600" /><span>The proposed workload changes were not applied.</span></div>}
    {agentStatus === 'idle' && bottlenecks.length > 0 && <BottleneckCard bottleneck={bottlenecks[0]} onResolveClick={() => void runAgentRebalance()} />}
    {(isRunning || isReady) && agentLogs.length > 0 && <AgentExecutionTimeline logs={agentLogs} currentStatus={agentStatus} />}
    {isReady && rebalancePlan && <RebalancePlanView plan={rebalancePlan} onApprove={approveAgentPlan} onReject={rejectAgentPlan} isExecuting={isLoading} />}
    {agentStatus === 'idle' && bottlenecks.length === 0 && <div className="border border-[#141a32]/15 bg-white p-12 text-center space-y-4"><Bot className="w-8 h-8 mx-auto text-[#141a32]" /><h4 className="font-serif text-2xl font-bold text-[#141a32]">No active bottlenecks</h4><p className="text-xs text-[#46464d] max-w-md mx-auto">No current capacity issues were found for this team.</p><Button variant="primary" size="md" onClick={() => void runAgentRebalance()}>Run Team Analysis</Button></div>}
    <Button variant="outline" size="sm" onClick={() => navigate('/manager')}>Return to Overview</Button>
  </div>;
};
