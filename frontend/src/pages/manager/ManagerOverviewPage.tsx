import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCapacity } from '../../context/CapacityContext';
import { PageHeader } from '../../components/layout/PageHeader';
import { MetricCard } from '../../components/ui/MetricCard';
import { Button } from '../../components/ui/Button';
import { BottleneckCard } from '../../components/agent/BottleneckCard';
import { MemberCapacityCard } from '../../components/capacity/MemberCapacityCard';
import { TaskFormModal } from '../../components/tasks/TaskFormModal';
import { 
  Sparkles, 
  Users, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Plus, 
  Layers, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../../utils/cn';

export const ManagerOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    members, 
    tasks, 
    metrics, 
    bottlenecks, 
    createTask, 
    resetToInitialDemoState,
    agentStatus 
  } = useCapacity();

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | undefined>(undefined);

  const hasBottleneck = bottlenecks.length > 0;
  const isAgentApproved = agentStatus === 'approved';

  return (
    <div className="space-y-10 font-sans">
      {/* Header */}
      <PageHeader
        tag="OPERATIONS & WORKFORCE COMMAND"
        title="Manager's Overview"
        description="Real-time resource allocation, cognitive load telemetry, and autonomous balancing across active engineering pods."
        actions={
          <>
            <Button
              variant="outline"
              size="md"
              onClick={resetToInitialDemoState}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Reset Demo
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/manager/agent')}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              AI Rebalancing Hub
            </Button>
          </>
        }
      />

      {/* Success Notification if plan just executed */}
      {isAgentApproved && (
        <div className="p-4 bg-green-50 border border-green-300 text-green-900 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <div>
              <span className="font-bold text-sm">Workload Rebalance Active: </span>
              <span className="text-xs">
                Marcus Vance workload adjusted from 48h to 38h. 10 hours successfully allocated to Elena Rostova. Alpha Pod velocity restored.
              </span>
            </div>
          </div>
          <button 
            onClick={resetToInitialDemoState}
            className="text-xs font-bold text-green-800 underline hover:text-green-950"
          >
            Reset Overload Scenario
          </button>
        </div>
      )}

      {/* Critical Bottleneck Alert Section (Exact Match to Stitch design) */}
      {hasBottleneck && (
        <BottleneckCard
          bottleneck={bottlenecks[0]}
          onResolveClick={() => navigate('/manager/agent')}
        />
      )}

      {/* Key Metrics Row (4 cards) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          label="Total Resource Pool"
          value={`${metrics.totalCapacityHours}h`}
          subtext="4 Active Staff Engineers"
          icon={<Users className="w-6 h-6 text-[#141a32]" />}
        />

        <MetricCard
          label="Active Workload"
          value={`${metrics.totalAllocatedHours}h`}
          subtext={`${metrics.utilizationRate}% Capacity Utilization`}
          icon={<Clock className="w-6 h-6 text-[#497cff]" />}
        />

        <MetricCard
          label="Overloaded Nodes"
          value={metrics.overloadedMembersCount > 0 ? `${metrics.overloadedMembersCount} Node` : '0 Nodes'}
          subtext={metrics.overloadedMembersCount > 0 ? 'Marcus Vance (120% Load)' : 'Optimal Balancing'}
          variant={metrics.overloadedMembersCount > 0 ? 'alert' : 'default'}
          icon={<AlertTriangle className="w-6 h-6" />}
        />

        <MetricCard
          label="Team Efficiency Index"
          value={`${metrics.efficiencyIndex}%`}
          subtext={metrics.efficiencyIndex >= 85 ? 'High Velocity Delivery' : 'Degraded by PR Drag'}
          icon={<TrendingUp className="w-6 h-6 text-[#1b873f]" />}
        />
      </section>

      {/* Resource Pods Section (Alpha, Beta, Gamma) */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b border-[#141a32]/15 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#76767e] block mb-1">
              ORGANIZATION TOPOLOGY
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#141a32]">
              Resource Pods
            </h3>
          </div>
          <span className="text-xs text-[#76767e] font-mono">
            3 Active Pods Monitored
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Alpha Pod (Active Demo Pod) */}
          <div className={cn(
            'border p-6 bg-white shadow-sm flex flex-col justify-between card-hover',
            metrics.overloadedMembersCount > 0 ? 'border-[#ba1a1a]/40 ring-1 ring-[#ba1a1a]/20' : 'border-[#141a32]/15'
          )}>
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-serif text-xl font-bold text-[#141a32]">
                    Alpha Engineering
                  </h4>
                  <p className="text-xs text-[#76767e]">Core Backend & Distributed Systems</p>
                </div>
                <span className={cn(
                  'text-[10px] uppercase font-bold px-2 py-0.5 border',
                  metrics.overloadedMembersCount > 0 ? 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a]/30' : 'bg-green-50 text-green-800 border-green-200'
                )}>
                  {metrics.overloadedMembersCount > 0 ? 'Bottleneck' : 'Optimal'}
                </span>
              </div>

              <div className="space-y-3 my-4">
                <div className="flex justify-between text-xs">
                  <span className="text-[#76767e]">Efficiency Index</span>
                  <span className="font-bold text-[#141a32]">{metrics.efficiencyIndex}%</span>
                </div>
                <div className="h-2 w-full bg-[#f0eded] overflow-hidden">
                  <div 
                    className={cn('h-full', metrics.overloadedMembersCount > 0 ? 'bg-[#ba1a1a]' : 'bg-[#497cff]')}
                    style={{ width: `${metrics.utilizationRate}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-[#76767e]">
                  <span>4 Engineers</span>
                  <span>{metrics.totalAllocatedHours}h / {metrics.totalCapacityHours}h</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#141a32]/10 flex justify-between items-center text-xs">
              <span className={metrics.blockersIdentified > 0 ? 'text-[#ba1a1a] font-bold' : 'text-green-700'}>
                {metrics.blockersIdentified > 0 ? `${metrics.blockersIdentified} Blockers Detected` : 'Zero Blockers'}
              </span>
              <button 
                onClick={() => navigate('/manager/agent')}
                className="text-[#497cff] font-bold hover:underline"
              >
                Inspect Pod →
              </button>
            </div>
          </div>

          {/* Beta Pod */}
          <div className="border border-[#141a32]/15 p-6 bg-white shadow-sm flex flex-col justify-between card-hover opacity-90">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-serif text-xl font-bold text-[#141a32]">
                    Beta Platform
                  </h4>
                  <p className="text-xs text-[#76767e]">UI Architecture & Design Systems</p>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-green-50 text-green-800 border border-green-200">
                  Balanced
                </span>
              </div>

              <div className="space-y-3 my-4">
                <div className="flex justify-between text-xs">
                  <span className="text-[#76767e]">Efficiency Index</span>
                  <span className="font-bold text-[#141a32]">88%</span>
                </div>
                <div className="h-2 w-full bg-[#f0eded] overflow-hidden">
                  <div className="h-full bg-[#497cff] w-[82%]"></div>
                </div>
                <div className="flex justify-between text-xs text-[#76767e]">
                  <span>5 Engineers</span>
                  <span>164h / 200h</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#141a32]/10 flex justify-between items-center text-xs">
              <span className="text-[#1b873f] font-medium">Zero Blockers</span>
              <span className="text-[#76767e]">Healthy</span>
            </div>
          </div>

          {/* Gamma Pod */}
          <div className="border border-[#141a32]/15 p-6 bg-white shadow-sm flex flex-col justify-between card-hover opacity-90">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-serif text-xl font-bold text-[#141a32]">
                    Gamma Data Infra
                  </h4>
                  <p className="text-xs text-[#76767e]">ETL Pipelines & ClickHouse</p>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-green-50 text-green-800 border border-green-200">
                  Balanced
                </span>
              </div>

              <div className="space-y-3 my-4">
                <div className="flex justify-between text-xs">
                  <span className="text-[#76767e]">Efficiency Index</span>
                  <span className="font-bold text-[#141a32]">94%</span>
                </div>
                <div className="h-2 w-full bg-[#f0eded] overflow-hidden">
                  <div className="h-full bg-[#1b873f] w-[76%]"></div>
                </div>
                <div className="flex justify-between text-xs text-[#76767e]">
                  <span>3 Engineers</span>
                  <span>91h / 120h</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#141a32]/10 flex justify-between items-center text-xs">
              <span className="text-[#1b873f] font-medium">Zero Blockers</span>
              <span className="text-[#76767e]">Healthy</span>
            </div>
          </div>
        </div>
      </section>

      {/* Active Team Members Roster */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b border-[#141a32]/15 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#76767e] block mb-1">
              INDIVIDUAL BANDWIDTH TELEMETRY
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#141a32]">
              Alpha Engineering Roster
            </h3>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedMemberId(undefined);
              setShowTaskModal(true);
            }}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Assign New Task
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map(member => (
            <MemberCapacityCard
              key={member.id}
              member={member}
              tasks={tasks}
              onRebalanceClick={() => navigate('/manager/agent')}
              onAddTaskClick={(m) => {
                setSelectedMemberId(m.id);
                setShowTaskModal(true);
              }}
            />
          ))}
        </div>
      </section>

      {/* Task Creation Modal */}
      <TaskFormModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSubmit={async (input) => {
          await createTask(input);
        }}
        initialAssigneeId={selectedMemberId}
      />
    </div>
  );
};
