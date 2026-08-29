import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { ArrowRight, Activity, Database, ShieldCheck } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  return <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4 md:px-12 max-w-[1440px] mx-auto border-b border-[#141a32]/15 bg-[#ffffff]/60 grid-bg overflow-hidden">
    <div className="absolute top-2 left-4 font-mono text-[10px] text-[#76767e]/60 uppercase tracking-widest">CAPACITY_OPERATIONS_PLATFORM</div>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
      <div className="lg:col-span-7 flex flex-col justify-center">
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-[#141a32] leading-[1.02] tracking-tight mb-6">SECURING<br />TEAM'S<br />PROMISE</h1>
        <p className="font-sans text-base md:text-lg text-[#46464d] max-w-lg mb-8 leading-relaxed">Connect your teams, workloads, and capacity data in one operational workspace. Make allocation decisions from current records and measurable workload signals.</p>
        <div className="flex flex-wrap gap-4"><Button size="lg" variant="primary" onClick={() => navigate('/login')} rightIcon={<ArrowRight className="w-4 h-4" />}>Open Workspace</Button><Button size="lg" variant="outline" onClick={() => navigate('/signup')}>Create Account</Button></div>
      </div>
      <div className="lg:col-span-5 flex flex-col gap-4 w-full">
        <div className="border border-[#141a32]/15 bg-white p-8 shadow-sm w-full max-w-md"><div className="flex items-center gap-3 mb-6"><Database className="w-6 h-6 text-[#497cff]" /><span className="text-xs uppercase tracking-widest font-bold text-[#141a32]">Data-connected operations</span></div><div className="space-y-4 text-sm text-[#46464d]"><p className="flex gap-3"><Activity className="w-4 h-4 text-[#497cff] shrink-0" />Team workload calculated from persisted tasks and capacity records.</p><p className="flex gap-3"><ShieldCheck className="w-4 h-4 text-[#1b873f] shrink-0" />Authenticated views respect the signed-in team and role.</p></div></div>
        <div className="border border-[#141a32]/15 bg-[#fcf9f8] p-4 w-full max-w-md text-xs text-[#46464d]">Sign in to view your organization’s current metrics, assignments, approvals, and capacity analysis.</div>
      </div>
    </div>
  </section>;
};
