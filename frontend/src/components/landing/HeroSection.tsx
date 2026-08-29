import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Play, Activity, Sparkles, ShieldCheck } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4 md:px-12 max-w-[1440px] mx-auto border-b border-[#141a32]/15 bg-[#ffffff]/60 grid-bg overflow-hidden">
      <div className="absolute top-2 left-4 font-mono text-[10px] text-[#76767e]/60 uppercase tracking-widest">
        SYS_CORE_v3.1 // ENTERPRISE_CAPACITY_ENGINE
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Headline Column */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-[#141a32] leading-[1.02] tracking-tight mb-6">
            SECURING<br />
            TEAM'S<br />
            PROMISE
          </h1>
          <p className="font-sans text-base md:text-lg text-[#46464d] max-w-lg mb-8 leading-relaxed">
            Precision capacity optimization strategies designed for operational clarity and sustainable peak performance. Next-generation intelligence for engineering orgs.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/manager')}
            >
              Explore Operations Portal
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/manager/agent')}
              leftIcon={<Play className="w-4 h-4 fill-current" />}
            >
              Simulate AI Agent
            </Button>
          </div>
        </div>

        {/* Right Live Telemetry Column */}
        <div className="lg:col-span-5 flex flex-col items-center gap-4 w-full">
          {/* System Health Mini-Dashboard */}
          <div className="border border-[#141a32]/15 bg-[#ffffff] p-6 shadow-sm relative overflow-hidden group w-full max-w-md">
            <div className="absolute top-2 right-2 font-mono text-[10px] text-[#76767e]/60 uppercase tracking-widest">
              LIVE_TELEMETRY
            </div>

            <div className="flex items-center justify-between mb-6 border-b border-[#141a32]/15 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 pulse-dot" />
                <span className="font-sans text-xs uppercase tracking-widest font-bold text-[#141a32]">
                  System Health
                </span>
              </div>
              <span className="font-sans text-xs text-[#76767e]">
                Syncing: Active
              </span>
            </div>

            <div className="space-y-4 font-sans">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[11px] text-[#76767e] uppercase tracking-wider mb-1">
                    Global Workload Load
                  </div>
                  <div className="font-serif text-4xl font-bold text-[#141a32]">
                    42%
                  </div>
                </div>
                {/* Mini bar sparkline */}
                <div className="w-32 h-10 flex items-end gap-1.5 opacity-85">
                  <div className="w-1/6 bg-[#497cff] h-[40%]"></div>
                  <div className="w-1/6 bg-[#497cff] h-[65%]"></div>
                  <div className="w-1/6 bg-[#497cff] h-[35%]"></div>
                  <div className="w-1/6 bg-[#497cff] h-[55%]"></div>
                  <div className="w-1/6 bg-[#497cff] h-[42%]"></div>
                  <div className="w-1/6 bg-[#141a32] h-[85%]"></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#141a32]/15">
                <div>
                  <div className="text-[10px] text-[#76767e] uppercase tracking-wider mb-0.5">
                    Avg Latency
                  </div>
                  <div className="font-mono text-base text-[#141a32] font-bold">
                    12ms
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[#76767e] uppercase tracking-wider mb-0.5">
                    Active Telemetry Nodes
                  </div>
                  <div className="font-mono text-base text-[#141a32] font-bold">
                    3,492
                  </div>
                </div>
              </div>
            </div>

            {/* Corner architectural ticks */}
            <div className="absolute bottom-0 right-0 w-4 h-4 border-t border-l border-[#141a32]/20"></div>
          </div>

          {/* Floating AI Insight Banner */}
          <div className="border border-[#141a32]/15 bg-[#fcf9f8] p-4 shadow-md w-full max-w-md card-hover">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#497cff]/10 text-[#497cff] shrink-0">
                <Sparkles className="w-4 h-4 text-[#497cff]" />
              </div>
              <div>
                <div className="font-sans text-[10px] text-[#76767e] font-bold uppercase tracking-wider mb-1">
                  AI INSIGHT // BOTTLENECK PREDICTION
                </div>
                <div className="font-sans text-xs text-[#141a32] leading-relaxed">
                  Alpha Pod Lead Marcus Vance operating at 120% capacity. Auto-rebalancing recommended to avoid 3-week sprint delay.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
