'use client';

import React from 'react';
import { IntegrationProvider } from '../../types';
import { Sliders, CheckCircle2, XCircle, RefreshCw, Globe, Database, Mail, Calendar, Video } from 'lucide-react';

const LinkedinIcon = (props: any) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

interface IntegrationsHubProps {
  integrations: IntegrationProvider[];
  onToggleIntegration: (id: string) => void;
}

export const IntegrationsHub: React.FC<IntegrationsHubProps> = ({
  integrations,
  onToggleIntegration
}) => {
  const categories = ['Sourcing Portal', 'Communication', 'Calendar & Video'] as const;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Linkedin': return LinkedinIcon;
      case 'Database': return Database;
      case 'Mail': return Mail;
      case 'Calendar': return Calendar;
      case 'Video': return Video;
      default: return Globe;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Sliders className="w-6 h-6 text-indigo-400" /> Modular Integration Provider Hub
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Pluggable provider interfaces for job boards, email servers, calendar sync, and video interview tools
        </p>
      </div>

      {categories.map(cat => {
        const catIntegrations = integrations.filter(i => i.category === cat);

        return (
          <div key={cat} className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
              {cat} Adapters
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {catIntegrations.map(item => {
                const Icon = getIcon(item.iconName);
                const isConnected = item.status === 'Connected';

                return (
                  <div key={item.id} className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between hover:border-indigo-500/40 transition-all">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>

                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isConnected ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {item.status}
                        </span>
                      </div>

                      <h3 className="font-bold text-white text-sm mt-3">{item.name}</h3>
                      <p className="text-[11px] text-slate-400 mt-1 leading-normal">{item.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-[9px] text-slate-500 font-mono">Last Sync: {item.lastSync || 'Active'}</span>

                      <button
                        onClick={() => onToggleIntegration(item.id)}
                        className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                          isConnected 
                            ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                            : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {isConnected ? 'Disconnect' : 'Connect Adapter'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
