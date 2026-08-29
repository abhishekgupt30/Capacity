import React from 'react';

export const ImpactMetricsBar: React.FC = () => {
  const metrics = [
    { value: '1.2M+', label: 'Tasks Rebalanced' },
    { value: '94%', label: 'Burnout Risk Reduction' },
    { value: '3.4x', label: 'Delivery Velocity Gain' },
    { value: '24/7', label: 'Autonomous Optimization', live: true }
  ];

  return (
    <section className="border-b border-[#141a32]/15 bg-[#141a32] text-white relative font-sans">
      <div className="absolute top-2 left-4 font-mono text-[9px] text-[#bfc5e4]/50 uppercase tracking-widest">
        METRICS_AGG_GLOBAL
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-white/15 text-center">
          {metrics.map((item, idx) => (
            <div key={idx} className="pt-4 md:pt-0 md:px-6 flex flex-col justify-center">
              <div className="font-serif text-3xl md:text-4xl font-bold mb-1 flex items-center justify-center gap-2">
                <span>{item.value}</span>
                {item.live && (
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-ping inline-block" />
                )}
              </div>
              <div className="text-[11px] uppercase tracking-widest text-[#bfc5e4] font-medium">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
