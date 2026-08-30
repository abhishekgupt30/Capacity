import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCapacity } from '../../context/CapacityContext';
import { PageHeader } from '../../components/layout/PageHeader';
import { MetricCard } from '../../components/ui/MetricCard';
import { Button } from '../../components/ui/Button';
import { BottleneckCard } from '../../components/agent/BottleneckCard';
import { MemberCapacityCard } from '../../components/capacity/MemberCapacityCard';
import { TaskFormModal } from '../../components/tasks/TaskFormModal';
import { Users, Clock, AlertTriangle, TrendingUp, Plus } from 'lucide-react';

export const ManagerOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { members, tasks, metrics, bottlenecks, createTask, isLoading, error } = useCapacity();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string>();

  if (isLoading && members.length === 0) {
    return <div className="p-12 text-center text-[#76767e]">Loading team data...</div>;
  }
  if (error && members.length === 0) {
    return <div className="border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">{error}</div>;
  }

  return <div className="space-y-10 font-sans">
    <PageHeader
      tag="OPERATIONS & WORKFORCE COMMAND"
      title="Manager's Overview"
      description="Real-time resource allocation and capacity analysis for your team."
    />

    {bottlenecks.length > 0 && <BottleneckCard bottleneck={bottlenecks[0]} onResolveClick={() => navigate('/manager/agent')} />}

    {members.length === 0 ? <div className="border border-dashed border-[#141a32]/20 p-12 text-center text-[#76767e]">No team members or workload data available.</div> : <>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Total Capacity" value={`${metrics.total_capacity_hours}h`} subtext={`${metrics.active_resources} Active Members`} icon={<Users className="w-6 h-6 text-[#141a32]" />} />
        <MetricCard label="Active Workload" value={`${metrics.total_allocated_hours}h`} subtext={`${metrics.utilization_rate}% Capacity Utilization`} icon={<Clock className="w-6 h-6 text-[#497cff]" />} />
        <MetricCard label="Overloaded Members" value={`${metrics.overloaded_members_count}`} subtext={metrics.overloaded_members_count ? 'Requires capacity review' : 'No overload detected'} variant={metrics.overloaded_members_count ? 'alert' : 'default'} icon={<AlertTriangle className="w-6 h-6" />} />
        <MetricCard label="Efficiency Index" value={`${metrics.efficiency_index}%`} subtext="Calculated from completed workload" icon={<TrendingUp className="w-6 h-6 text-[#1b873f]" />} />
      </section>

      <section className="border border-[#141a32]/15 bg-white p-6 shadow-sm">
        <div className="flex justify-between items-end border-b border-[#141a32]/15 pb-4 mb-6">
          <div><span className="text-[10px] font-bold uppercase tracking-widest text-[#76767e]">CURRENT TEAM</span><h3 className="font-serif text-2xl md:text-3xl font-bold text-[#141a32]">{metrics.team_name}</h3><p className="text-xs text-[#76767e]">{metrics.department}</p></div>
          <span className="text-xs text-[#76767e]">{metrics.total_allocated_hours}h / {metrics.total_capacity_hours}h</span>
        </div>
        <div className="h-2 w-full bg-[#f0eded] overflow-hidden"><div className="h-full bg-[#497cff]" style={{ width: `${Math.min(metrics.utilization_rate, 100)}%` }} /></div>
        <div className="flex justify-between mt-3 text-xs text-[#76767e]"><span>{metrics.blockers_identified} active blockers</span><span>{metrics.critical_dependencies} critical dependencies</span><span>{metrics.avg_cycle_time_days} average cycle days</span></div>
      </section>

      <section className="space-y-6">
        <div className="flex justify-between items-end border-b border-[#141a32]/15 pb-4"><div><span className="text-[10px] font-bold uppercase tracking-widest text-[#76767e]">INDIVIDUAL CAPACITY</span><h3 className="font-serif text-2xl md:text-3xl font-bold text-[#141a32]">Team Members</h3></div><Button size="sm" variant="outline" onClick={() => { setSelectedMemberId(undefined); setShowTaskModal(true); }} leftIcon={<Plus className="w-3.5 h-3.5" />}>Assign Task</Button></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map(member => <MemberCapacityCard key={member.id} member={member} tasks={tasks} onRebalanceClick={() => navigate('/manager/agent')} onAddTaskClick={m => { setSelectedMemberId(m.id); setShowTaskModal(true); }} />)}
        </div>
      </section>
    </>}

    <TaskFormModal isOpen={showTaskModal} onClose={() => setShowTaskModal(false)} onSubmit={async input => { await createTask(input); setShowTaskModal(false); }} initialAssigneeId={selectedMemberId} />
  </div>;
};
