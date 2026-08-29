import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCapacity } from '../../context/CapacityContext';
import { PageHeader } from '../../components/layout/PageHeader';
import { AgentExecutionTimeline } from '../../components/agent/AgentExecutionTimeline';
import { RebalancePlanView } from '../../components/agent/RebalancePlanView';
import { BottleneckCard } from '../../components/agent/BottleneckCard';
import { Button } from '../../components/ui/Button';
import { 
  Sparkles, 
  Bot, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Zap,
  ArrowRight,
  Clock
} from 'lucide-react';

export const ManagerAgentPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    bottlenecks, 
    rebalancePlan, 
    agentStatus, 
    agentLogs, 
    runAgentRebalance, 
    approveAgentPlan, 
    rejectAgentPlan,
    resetToInitialDemoState,
    isLoading
  } = useCapacity();

  const isIdle = agentStatus === 'idle';
  const isRunning = agentStatus === 'analyzing' || agentStatus === 'simulating';
  const isReady = agentStatus === 'ready';
  const isApproved = agentStatus === 'approved';
  const isRejected = agentStatus === 'rejected';

  return (
    <div className="space-y-10 font-sans">
      {/* Page Header */}
      <PageHeader
        tag="NEURAL WORKFORCE ORCHESTRATION"
        title="AI Capacity Agent"
        description="Autonomous workload simulation and bottleneck mitigation engine. Evaluates repository telemetry and proposes optimal task reallocations."
        actions={
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={resetToInitialDemoState}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Reset Demo Scenario
            </Button>
            {isIdle && (
              <Button
                variant="primary"
                size="md"
                onClick={runAgentRebalance}
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                Run AI Diagnosis
              </Button>
            )}
          </div>
        }
      />

      {/* State: Approved Banner */}
      {isApproved && (
        <div className="architectural-border bg-green-50 border-green-300 p-8 shadow-sm text-green-950 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600 text-white">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold">
                Workload Optimization Executed
              </h3>
              <p className="text-xs uppercase tracking-wider text-green-800 font-semibold mt-0.5">
                Authorized by Engineering Director Sarah Jenkins
              </p>
            </div>
          </div>

          <p className="text-sm text-green-900 leading-relaxed max-w-3xl">
            10 hours of workload successfully shifted from Marcus Vance (48h → 38h) to Elena Rostova (26h → 36h). All members in Alpha Pod now sit in the optimal capacity equilibrium band (90-95%).
          </p>

          <div className="pt-4 flex flex-wrap gap-4">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/manager')}
            >
              Return to Manager Overview
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetToInitialDemoState}
            >
              Replay Overload Simulation
            </Button>
          </div>
        </div>
      )}

      {/* State: Rejected Banner */}
      {isRejected && (
        <div className="architectural-border bg-amber-50 border-amber-300 p-6 shadow-sm flex items-center justify-between text-amber-950">
          <div className="flex items-center gap-3">
            <XCircle className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <h4 className="font-serif text-lg font-bold">
                Rebalancing Proposal Dismissed
              </h4>
              <p className="text-xs text-amber-800">
                You declined the AI recommendation. Alpha Pod remains in its previous state.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={runAgentRebalance}
          >
            Re-run Simulation
          </Button>
        </div>
      )}

      {/* Bottleneck Alert if Idle */}
      {isIdle && bottlenecks.length > 0 && (
        <BottleneckCard
          bottleneck={bottlenecks[0]}
          onResolveClick={runAgentRebalance}
        />
      )}

      {/* Execution Timeline (Analyzing / Simulating / Ready) */}
      {(isRunning || isReady) && agentLogs.length > 0 && (
        <AgentExecutionTimeline
          logs={agentLogs}
          currentStatus={agentStatus}
        />
      )}

      {/* Ready State: Full Rebalancing Plan View */}
      {isReady && rebalancePlan && (
        <RebalancePlanView
          plan={rebalancePlan}
          onApprove={approveAgentPlan}
          onReject={rejectAgentPlan}
          isExecuting={isLoading}
        />
      )}

      {/* Idle State Context Card */}
      {isIdle && bottlenecks.length === 0 && (
        <div className="border border-[#141a32]/15 bg-white p-12 text-center space-y-4">
          <div className="w-12 h-12 bg-[#f0eded] mx-auto flex items-center justify-center text-[#141a32]">
            <Bot className="w-6 h-6" />
          </div>
          <h4 className="font-serif text-2xl font-bold text-[#141a32]">
            Telemetry Baseline Optimal
          </h4>
          <p className="text-xs text-[#46464d] max-w-md mx-auto">
            No active bottlenecks detected across engineering pods. You can trigger an ad-hoc neural simulation at any time.
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={runAgentRebalance}
          >
            Trigger Ad-Hoc Pod Simulation
          </Button>
        </div>
      )}
    </div>
  );
};
