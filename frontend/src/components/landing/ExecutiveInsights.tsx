import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, AlertTriangle, PieChart, ArrowUpRight } from 'lucide-react';
import { Button } from '../ui/Button';

export const ExecutiveInsights: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="insights" className="py-16 md:py-24 border-b border-[#141a32]/15 bg-[#f6f3f2]/50 relative grid-bg">
      <div className="absolute top-2 right-4 font-mono text-[9px] text-[#76767e]/60 uppercase tracking-widest">
        EXEC_DASH_v1.0 // REAL_TIME_TELEMETRY
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-12 font-sans">
        <div className="flex justify-between items-end mb-12 border-b border-[#141a32]/15 pb-4">
          <div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#76767e] block mb-1">
              EXECUTIVE TELEMETRY
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#141a32]">
              Executive Insights
            </h2>
          </div>
          <div className="text-xs uppercase text-[#76767e] tracking-widest hidden md:block">
            Real-time Node Telemetry
          </div>
        </div>

        {/* 3-Card Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Capacity Utilization */}
          <div className="bg-[#ffffff] border border-[#141a32]/15 p-6 shadow-sm card-hover relative group">
            <div className="flex justify-between items-start mb-6">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#46464d]">
                Capacity Utilization
              </span>
              <TrendingUp className="w-5 h-5 text-[#497cff]" />
            </div>
            <div className="text-4xl font-serif font-bold text-[#141a32] mb-4">
              78%
            </div>
            <div className="h-2 w-full bg-[#f0eded] overflow-hidden mb-3">
              <div className="h-full bg-[#497cff] w-[78%] transition-all duration-1000"></div>
            </div>
            <div className="flex justify-between items-center text-xs">
              <p className="text-[#46464d]">+5% vs last quarter</p>
              <p className="text-[10px] text-[#141a32] font-semibold">Optimal Range: 70-85%</p>
            </div>
          </div>

          {/* Card 2: Cognitive Load Index */}
          <div className="bg-[#ffffff] border border-[#ba1a1a]/20 p-6 shadow-sm card-hover relative group">
            <div className="flex justify-between items-start mb-6">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#46464d]">
                Cognitive Load Index
              </span>
              <AlertTriangle className="w-5 h-5 text-[#ba1a1a]" />
            </div>
            <div className="text-4xl font-serif font-bold text-[#ba1a1a] mb-4">
              42/100
            </div>
            {/* Warning segments */}
            <div className="flex gap-1.5 h-6 items-end mb-3">
              <div className="w-1/5 bg-[#e5e2e1] h-[30%]"></div>
              <div className="w-1/5 bg-[#e5e2e1] h-[50%]"></div>
              <div className="w-1/5 bg-[#e5e2e1] h-[70%]"></div>
              <div className="w-1/5 bg-[#ba1a1a] h-[85%]"></div>
              <div className="w-1/5 bg-[#ba1a1a] h-[95%]"></div>
            </div>
            <div className="flex justify-between items-center text-xs">
              <p className="text-[#ba1a1a] font-medium">Critical alert in Alpha Pod</p>
              <button 
                onClick={() => navigate('/manager/agent')}
                className="text-[11px] font-semibold text-[#141a32] underline hover:text-[#497cff]"
              >
                Resolve with AI
              </button>
            </div>
          </div>

          {/* Card 3: Resource Allocation */}
          <div className="bg-[#ffffff] border border-[#141a32]/15 p-6 shadow-sm card-hover relative group">
            <div className="flex justify-between items-start mb-6">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#46464d]">
                Resource Allocation
              </span>
              <PieChart className="w-5 h-5 text-[#141a32]" />
            </div>
            <div className="flex items-center gap-6">
              {/* Radial circle representation */}
              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f0eded" strokeWidth="12" />
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#497cff" strokeWidth="12" strokeDasharray="238.7" strokeDashoffset="131.3" />
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#141a32" strokeWidth="12" strokeDasharray="238.7" strokeDashoffset="180" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-[#141a32]">
                  100%
                </div>
              </div>

              <ul className="space-y-1.5 w-full text-xs font-sans">
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-[#497cff] inline-block" />
                    Product Focus
                  </span>
                  <span className="font-bold">45%</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-[#141a32] inline-block" />
                    R&D / Core
                  </span>
                  <span className="font-bold">35%</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-[#76767e] inline-block" />
                    Maintenance
                  </span>
                  <span className="font-bold">20%</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
