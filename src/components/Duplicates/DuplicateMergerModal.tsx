'use client';

import React from 'react';
import { DuplicatePair } from '../../lib/store';
import { Copy, AlertTriangle, ArrowRight, CheckCircle2, Shield, Sparkles } from 'lucide-react';

interface DuplicateMergerModalProps {
  duplicatePairs: DuplicatePair[];
  onMerge: (primaryId: string, duplicateId: string) => void;
}

export const DuplicateMergerModal: React.FC<DuplicateMergerModalProps> = ({
  duplicatePairs,
  onMerge
}) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-amber-500/30 bg-amber-950/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 w-fit">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Duplicate Cleanup Engine
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-2">
            Automated Duplicate Record Merger
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Detect duplicate candidate profiles imported from different portals (LinkedIn, Indeed, Monster) and merge history into a single master record.
          </p>
        </div>

        <div className="text-right">
          <div className="text-3xl font-black text-amber-400">{duplicatePairs.length}</div>
          <span className="text-[10px] text-slate-400 font-bold uppercase">Duplicates Pending Review</span>
        </div>
      </div>

      {/* Duplicate Pairs List */}
      {duplicatePairs.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="font-bold text-white text-base">Central Database Clean & Unified</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            No duplicate candidates detected by email, phone, or LinkedIn profile URLs. Your candidate records are 100% deduplicated.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {duplicatePairs.map((pair, index) => (
            <div key={index} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Match Reason: {pair.reason}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Similarity Score: <strong className="text-emerald-400">{pair.similarityScore}% Match</strong>
                  </span>
                </div>

                <button
                  onClick={() => onMerge(pair.primary.id, pair.duplicate.id)}
                  className="px-4 py-2 text-xs font-bold text-white gradient-bg hover:opacity-90 rounded-xl shadow-lg shadow-blue-500/20 flex items-center space-x-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Merge Duplicate Into Primary Record</span>
                </button>
              </div>

              {/* Side-by-Side Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Primary Master Profile */}
                <div className="glass-panel p-4 rounded-xl border border-blue-500/30 bg-blue-950/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Master Record (Primary)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300">
                      {pair.primary.source} Source Tag
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{pair.primary.name}</h4>
                  <p className="text-xs text-slate-300">{pair.primary.title} • {pair.primary.yearsExperience} Yrs Exp</p>
                  <div className="text-xs text-slate-400 space-y-0.5 pt-1">
                    <p>Email: <strong className="text-slate-200">{pair.primary.email}</strong></p>
                    <p>Phone: <strong className="text-slate-200">{pair.primary.phone}</strong></p>
                    <p>Stage: <strong className="text-blue-400">{pair.primary.stage}</strong></p>
                    <p>Notes Count: <strong className="text-slate-200">{pair.primary.notes.length} notes</strong></p>
                  </div>
                </div>

                {/* Incoming Duplicate Profile */}
                <div className="glass-panel p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Duplicate Record (Secondary)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                      {pair.duplicate.source} Source Tag
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{pair.duplicate.name}</h4>
                  <p className="text-xs text-slate-300">{pair.duplicate.title} • {pair.duplicate.yearsExperience} Yrs Exp</p>
                  <div className="text-xs text-slate-400 space-y-0.5 pt-1">
                    <p>Email: <strong className="text-slate-200">{pair.duplicate.email}</strong></p>
                    <p>Phone: <strong className="text-slate-200">{pair.duplicate.phone}</strong></p>
                    <p>Stage: <strong className="text-amber-400">{pair.duplicate.stage}</strong></p>
                    <p>Notes Count: <strong className="text-slate-200">{pair.duplicate.notes.length} notes</strong></p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
