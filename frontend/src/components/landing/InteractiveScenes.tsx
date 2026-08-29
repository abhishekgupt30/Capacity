import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/Button';
import { 
  AlertTriangle, 
  ArrowRight, 
  Bot, 
  CheckCircle2, 
  Clock, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  Zap,
  RotateCcw
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface Scene {
  id: number;
  title: string;
  tag: string;
  headline: string;
  description: string;
  color: string;
  marcusHours: number;
  elenaHours: number;
  alexHours: number;
  riskLevel: string;
  icon: React.ReactNode;
}

const SCENES: Scene[] = [
  {
    id: 1,
    title: 'Scene 1: Scattered Workload',
    tag: 'FRAGMENTATION',
    headline: 'Uncoordinated Task Assignments',
    description: 'Engineering teams juggle Jira tickets, sudden emergency pull requests, and hidden overtime without central telemetry.',
    color: '#76767e',
    marcusHours: 42,
    elenaHours: 28,
    alexHours: 35,
    riskLevel: 'Moderate',
    icon: <Layers className="w-6 h-6 text-[#76767e]" />
  },
  {
    id: 2,
    title: 'Scene 2: Pressure Builds',
    tag: 'STRAIN DETECTED',
    headline: 'Key Engineers Exceed 120% Bandwidth',
    description: 'Marcus Vance absorbs 14h of Redis cluster migrations and 18 PR reviews, pushing weekly commitments to 48 hours.',
    color: '#d97706',
    marcusHours: 48,
    elenaHours: 26,
    alexHours: 38,
    riskLevel: 'Elevated Risk',
    icon: <Clock className="w-6 h-6 text-amber-600" />
  },
  {
    id: 3,
    title: 'Scene 3: Capacity Risk Detected',
    tag: 'TELEMETRY WARNING',
    headline: 'Architectural Bottleneck Flagged',
    description: 'Capacita telemetry detects a 34% drop in Alpha Pod PR throughput and 4 blocked release dependencies.',
    color: '#ba1a1a',
    marcusHours: 48,
    elenaHours: 26,
    alexHours: 38,
    riskLevel: 'Critical Bottleneck',
    icon: <AlertTriangle className="w-6 h-6 text-[#ba1a1a]" />
  },
  {
    id: 4,
    title: 'Scene 4: AI Agent Activates',
    tag: 'NEURAL EVALUATION',
    headline: 'Autonomous Bottleneck Diagnosis',
    description: 'Capacita AI scans repository ownership, commit history, and skill matrices across the entire engineering roster.',
    color: '#497cff',
    marcusHours: 48,
    elenaHours: 26,
    alexHours: 38,
    riskLevel: 'AI Analyzing...',
    icon: <Bot className="w-6 h-6 text-[#497cff]" />
  },
  {
    id: 5,
    title: 'Scene 5: Task Redistribution Simulation',
    tag: 'SIMULATION ENGINE',
    headline: 'Computing Optimal Load Offloading',
    description: 'The simulation models shifting 6h of Redis partitioning and 4h of PR reviews to Elena Rostova (Staff Backend, 26h current load).',
    color: '#497cff',
    marcusHours: 38,
    elenaHours: 36,
    alexHours: 38,
    riskLevel: 'Simulated 0% Overload',
    icon: <Zap className="w-6 h-6 text-[#497cff]" />
  },
  {
    id: 6,
    title: 'Scene 6: Manager Approval',
    tag: 'HUMAN IN THE LOOP',
    headline: 'Explicit Leadership Authorization',
    description: 'The AI never executes changes autonomously. Engineering Director Sarah Jenkins reviews the exact impact before confirming.',
    color: '#141a32',
    marcusHours: 38,
    elenaHours: 36,
    alexHours: 38,
    riskLevel: 'Pending Approval',
    icon: <ShieldCheck className="w-6 h-6 text-[#141a32]" />
  },
  {
    id: 7,
    title: 'Scene 7: Balanced Workload',
    tag: 'OPTIMIZED STATE',
    headline: 'Sustainable Velocity Restored',
    description: 'Marcus operates at 38h, Elena at 36h. All engineers sit in the 90-95% optimal band. Sprint PR delivery accelerates by 3.4x.',
    color: '#1b873f',
    marcusHours: 38,
    elenaHours: 36,
    alexHours: 38,
    riskLevel: 'Fully Balanced',
    icon: <CheckCircle2 className="w-6 h-6 text-green-600" />
  }
];

export const InteractiveScenes: React.FC = () => {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const currentScene = SCENES[activeSceneIndex];

  return (
    <section id="solutions" className="py-16 md:py-24 border-b border-[#141a32]/15 bg-[#fcf9f8] relative">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-[#141a32]/15 pb-6">
          <div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#76767e] block mb-2">
              THE WORKLOAD LIFECYCLE // 7-STAGE ARCHITECTURE
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#141a32]">
              Workload → Risk → AI → Balance
            </h2>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0 font-sans text-xs">
            <span className="text-[#76767e]">Step {activeSceneIndex + 1} of 7</span>
            <button
              onClick={() => setActiveSceneIndex(0)}
              className="p-1.5 hover:bg-[#f0eded] border border-[#141a32]/15 ml-2 text-[#76767e]"
              title="Reset to Scene 1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Step Navigation Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-8 font-sans">
          {SCENES.map((scene, idx) => (
            <button
              key={scene.id}
              onClick={() => setActiveSceneIndex(idx)}
              className={cn(
                'p-3 text-left border transition-all duration-200 flex flex-col justify-between h-20',
                activeSceneIndex === idx
                  ? 'bg-[#ffffff] border-[#497cff] shadow-sm ring-1 ring-[#497cff]'
                  : 'bg-[#f6f3f2] border-[#141a32]/15 hover:bg-[#ffffff] opacity-75'
              )}
            >
              <span className="text-[9px] uppercase tracking-wider font-bold text-[#76767e]">
                0{scene.id}
              </span>
              <span className={cn(
                'text-xs font-semibold leading-tight line-clamp-2',
                activeSceneIndex === idx ? 'text-[#141a32]' : 'text-[#46464d]'
              )}>
                {scene.title.split(': ')[1]}
              </span>
            </button>
          ))}
        </div>

        {/* Dynamic Interactive Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border border-[#141a32]/15 bg-[#ffffff] shadow-sm">
          {/* Narrative Column (6 cols) */}
          <div className="lg:col-span-6 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-[#141a32]/15 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 border border-[#141a32]/15 bg-[#fcf9f8]">
                  {currentScene.icon}
                </span>
                <span className="font-sans text-xs uppercase font-bold tracking-widest text-[#497cff]">
                  {currentScene.tag}
                </span>
              </div>

              <h3 className="font-serif text-2xl md:text-4xl font-bold text-[#141a32] mb-4 leading-tight">
                {currentScene.headline}
              </h3>

              <p className="font-sans text-base text-[#46464d] leading-relaxed mb-8">
                {currentScene.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-[#141a32]/15">
              <Button
                variant="outline"
                size="sm"
                disabled={activeSceneIndex === 0}
                onClick={() => setActiveSceneIndex(Math.max(0, activeSceneIndex - 1))}
              >
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {activeSceneIndex < SCENES.length - 1 ? (
                  <Button
                    variant="primary"
                    size="sm"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    onClick={() => setActiveSceneIndex(Math.min(SCENES.length - 1, activeSceneIndex + 1))}
                  >
                    Next Phase
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => setActiveSceneIndex(0)}
                  >
                    Replay Workflow
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Live Simulation Visualizer Column (6 cols) */}
          <div className="lg:col-span-6 p-8 md:p-12 bg-[#fcf9f8] flex flex-col justify-between font-sans">
            <div>
              <div className="flex justify-between items-center mb-6 pb-3 border-b border-[#141a32]/15">
                <span className="text-xs uppercase font-bold tracking-wider text-[#141a32]">
                  Live Pod Bandwidth Telemetry
                </span>
                <span className={cn(
                  'text-[11px] font-bold px-2 py-0.5 border uppercase',
                  currentScene.id >= 5 ? 'bg-green-50 text-green-800 border-green-300' : 'bg-red-50 text-[#ba1a1a] border-red-200'
                )}>
                  {currentScene.riskLevel}
                </span>
              </div>

              {/* Live Member Capacity Bars */}
              <div className="space-y-6">
                {/* Marcus Vance */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-[#141a32]">Marcus Vance (Principal Eng)</span>
                    <span className={cn(currentScene.marcusHours > 40 ? 'text-[#ba1a1a]' : 'text-[#141a32]')}>
                      {currentScene.marcusHours}h / 40h ({Math.round((currentScene.marcusHours / 40) * 100)}%)
                    </span>
                  </div>
                  <div className="h-4 w-full bg-white border border-[#141a32]/20 overflow-hidden relative">
                    <div 
                      className={cn(
                        'h-full transition-all duration-700',
                        currentScene.marcusHours > 40 ? 'bg-[#ba1a1a]' : 'bg-[#141a32]'
                      )}
                      style={{ width: `${Math.min((currentScene.marcusHours / 40) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Elena Rostova */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-[#141a32]">Elena Rostova (Staff Backend)</span>
                    <span className="text-[#141a32]">
                      {currentScene.elenaHours}h / 40h ({Math.round((currentScene.elenaHours / 40) * 100)}%)
                    </span>
                  </div>
                  <div className="h-4 w-full bg-white border border-[#141a32]/20 overflow-hidden relative">
                    <div 
                      className="h-full bg-[#497cff] transition-all duration-700"
                      style={{ width: `${Math.min((currentScene.elenaHours / 40) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Alex Rivera */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-[#141a32]">Alex Rivera (Lead Architect)</span>
                    <span className="text-[#141a32]">
                      {currentScene.alexHours}h / 40h (95%)
                    </span>
                  </div>
                  <div className="h-4 w-full bg-white border border-[#141a32]/20 overflow-hidden relative">
                    <div 
                      className="h-full bg-[#141a32] transition-all duration-700"
                      style={{ width: '95%' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Stage Output Summary */}
            <div className="mt-8 p-4 bg-white border border-[#141a32]/15 text-xs text-[#46464d] flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#76767e] uppercase">
                STATUS: {activeSceneIndex < 4 ? 'BURNOUT_RISK' : activeSceneIndex === 4 ? 'SIMULATING' : 'OPTIMAL'}
              </span>
              <span className="font-semibold text-[#141a32]">
                Alpha Pod Throughput: {activeSceneIndex < 4 ? '66% (Degraded)' : '98% (Sustained)'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
