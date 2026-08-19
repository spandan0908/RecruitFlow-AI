'use client';

import React from 'react';
import { Client, Job, Candidate, UserRole } from '../../types';
import { Building2, Mail, Phone, MapPin, Briefcase, Users, CheckCircle2 } from 'lucide-react';

interface ClientListProps {
  clients: Client[];
  jobs: Job[];
  candidates: Candidate[];
  currentRole: UserRole;
}

export const ClientList: React.FC<ClientListProps> = ({
  clients,
  jobs,
  candidates,
  currentRole
}) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-cyan-400" /> Staffing Agency Client Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Client account management, open job requisitions, candidate pipeline status, and shortlist approvals
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map(client => {
          const clientJobs = jobs.filter(j => j.clientId === client.id);
          const clientCandidates = candidates.filter(c => clientJobs.some(j => j.id === c.jobId));

          return (
            <div key={client.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 hover:border-cyan-500/40 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {client.industry}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {client.status}
                  </span>
                </div>

                <h3 className="font-bold text-white text-lg mt-3">{client.name}</h3>

                <div className="mt-3 space-y-1.5 text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <p className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" /> Contact: <strong>{client.contactPerson}</strong>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-400" /> {client.email}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {client.location}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Requisitions</span>
                  <span className="font-bold text-cyan-400 text-sm">{clientJobs.length} Active Jobs</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Shortlisted</span>
                  <span className="font-bold text-emerald-400 text-sm">{clientCandidates.length} Candidates</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
