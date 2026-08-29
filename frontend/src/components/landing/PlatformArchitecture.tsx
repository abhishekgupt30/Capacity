import React from 'react';
import { Database, Cpu, ArrowRight, Bell, GitBranch, MessageSquare, Terminal } from 'lucide-react';

export const PlatformArchitecture: React.FC = () => {
  return (
    <section id="architecture" className="border-t border-[#141a32]/15 py-16 md:py-24 bg-[#ffffff] relative font-sans">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 relative z-10">
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#76767e] border border-[#141a32]/20 px-3 py-1 rounded-none bg-[#fcf9f8] mb-3">
            SYSTEM TOPOLOGY // ARCHITECTURAL FLOW
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#141a32]">
            Platform Architecture
          </h2>
          <p className="text-base text-[#46464d] max-w-2xl mt-3 leading-relaxed">
            Continuous telemetry processed through our proprietary neural engine, delivering actionable operational clarity.
          </p>
        </div>

        {/* 3-Step Flow Diagram */}
        <div className="border border-[#141a32]/15 p-6 md:p-12 relative bg-[#fcf9f8]">
          <div className="absolute top-2 left-3 font-mono text-[9px] uppercase text-[#76767e]">
            DATA_FLOW_DIAGRAM
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center items-stretch relative">
            {/* Step 1: Ingestion */}
            <div className="border border-[#141a32]/15 bg-[#ffffff] p-8 flex flex-col items-center justify-between card-hover relative">
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#497cff] pulse-dot" />
              <div>
                <div className="w-12 h-12 border border-[#141a32]/15 bg-[#f6f3f2] flex items-center justify-center mb-6 mx-auto text-[#141a32]">
                  <Database className="w-6 h-6" />
                </div>
                <h4 className="font-sans text-xs uppercase tracking-widest font-bold mb-3 text-[#141a32]">
                  01. Data Ingestion
                </h4>
                <p className="text-xs text-[#46464d] leading-relaxed mb-6">
                  Continuous integration from enterprise toolchain via secure webhook streams. Aggregates Jira sprint velocity, GitHub PR queue depth, and Slack async context.
                </p>
              </div>

              <div className="w-full flex justify-between px-4 border-t border-[#141a32]/10 pt-4 text-[10px] font-mono text-[#76767e]">
                <span>JIRA</span>
                <span>GITHUB</span>
                <span>SLACK</span>
              </div>
            </div>

            {/* Step 2: AI Engine (Midnight Hero) */}
            <div className="border border-[#141a32]/15 bg-[#141a32] text-white p-8 flex flex-col items-center justify-between relative shadow-xl transform md:scale-105 z-20">
              <div className="absolute top-2 right-2 font-mono text-[9px] text-[#bfc5e4]/50 uppercase">
                CORE_ENGINE_ACTIVE
              </div>
              <div>
                <div className="relative mb-6 mx-auto w-14 h-14 flex items-center justify-center">
                  <Cpu className="w-8 h-8 text-[#bfc5e4]" />
                  <div className="absolute inset-0 border border-[#bfc5e4]/30 animate-spin" style={{ animationDuration: '10s' }}></div>
                </div>
                <h4 className="font-sans text-xs uppercase tracking-widest font-bold mb-3 text-[#bfc5e4]">
                  02. Autonomous AI Engine
                </h4>
                <p className="text-xs text-[#bfc5e4] leading-relaxed mb-6">
                  Deep neural networks evaluate cognitive load indices, predict burnout probability, and run constraint-satisfaction simulations to generate minimal-disruption rebalance plans.
                </p>
              </div>

              <div className="w-full bg-white/20 h-1 overflow-hidden">
                <div className="h-full bg-[#497cff] w-3/4 animate-pulse"></div>
              </div>
            </div>

            {/* Step 3: Actionable Output */}
            <div className="border border-[#141a32]/15 bg-[#ffffff] p-8 flex flex-col items-center justify-between card-hover relative">
              <div className="absolute top-2 right-2 font-mono text-[9px] uppercase text-[#76767e]">
                OUTPUT_READY
              </div>
              <div>
                <div className="w-12 h-12 border border-[#141a32]/15 bg-[#f6f3f2] flex items-center justify-center mb-6 mx-auto text-[#141a32]">
                  <Terminal className="w-6 h-6 text-[#497cff]" />
                </div>
                <h4 className="font-sans text-xs uppercase tracking-widest font-bold mb-3 text-[#141a32]">
                  03. Actionable Output
                </h4>
                <p className="text-xs text-[#46464d] leading-relaxed mb-6">
                  Prescriptive reallocation blueprints, bottleneck pre-emption alerts, and manager-approved 1-click execution workflows for immediate sprint recovery.
                </p>
              </div>

              <div className="w-full flex justify-between px-4 border-t border-[#141a32]/10 pt-4 text-[10px] font-mono text-[#76767e]">
                <span>ALERTS</span>
                <span>SIMULATIONS</span>
                <span>APPROVAL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
