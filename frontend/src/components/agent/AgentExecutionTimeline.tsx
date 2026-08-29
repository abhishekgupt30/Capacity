import React from 'react';
import { AgentLogStep } from '../../types';
import { Loader2, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface AgentExecutionTimelineProps {
  logs: AgentLogStep[];
  currentStatus: string;
}

export const AgentExecutionTimeline: React.FC<AgentExecutionTimelineProps> = ({
  logs,
  currentStatus
}) => {
  return (
    <div className="border border-[#141a32]/15 bg-[#ffffff] p-6 md:p-8 font-sans shadow-sm">
      <div className="flex justify-between items-center pb-4 mb-6 border-b border-[#141a32]/15">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#76767e] block mb-0.5">
            NEURAL OPTIMIZATION PIPELINE
          </span>
          <h4 className="font-serif text-xl font-bold text-[#141a32]">
            Agent Analysis & Simulation Stream
          </h4>
        </div>
        <div className="flex items-center gap-2">
          {currentStatus === 'analyzing' || currentStatus === 'simulating' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#dce1ff] text-[#141a32] text-xs font-bold uppercase tracking-wider">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#497cff]" />
              Processing
            </span>
          ) : currentStatus === 'ready' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-800 border border-green-300 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
              Simulation Ready
            </span>
          ) : null}
        </div>
      </div>

      <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-px before:bg-[#141a32]/15">
        {logs.map((log) => {
          const isCompleted = log.status === 'completed';
          const isActive = log.status === 'active';
          const isFailed = log.status === 'failed';

          return (
            <div key={log.step} className="flex items-start gap-4 relative pl-1">
              {/* Step indicator */}
              <div className={cn(
                'w-7 h-7 flex items-center justify-center rounded-none z-10 shrink-0 font-mono text-xs font-bold',
                isCompleted 
                  ? 'bg-[#141a32] text-white' 
                  : isActive 
                    ? 'bg-[#497cff] text-white animate-pulse' 
                    : isFailed
                      ? 'bg-[#ba1a1a] text-white'
                      : 'bg-[#f0eded] text-[#76767e] border border-[#141a32]/20'
              )}>
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isActive ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>{log.step}</span>
                )}
              </div>

              {/* Step details */}
              <div className="flex-grow pt-0.5">
                <div className="flex justify-between items-baseline">
                  <h5 className={cn(
                    'text-sm font-bold',
                    isActive ? 'text-[#497cff]' : isCompleted ? 'text-[#141a32]' : 'text-[#76767e]'
                  )}>
                    {log.title}
                  </h5>
                  {isActive && (
                    <span className="font-mono text-[10px] text-[#497cff] uppercase animate-pulse">
                      Simulating...
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#46464d] mt-1 leading-relaxed">
                  {log.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
