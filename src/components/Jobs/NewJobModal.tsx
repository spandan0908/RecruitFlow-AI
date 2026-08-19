'use client';

import React, { useState } from 'react';
import { Client, ContractType, Job } from '../../types';
import { X, Briefcase, Plus, Tag } from 'lucide-react';

interface NewJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  onSubmit: (job: Omit<Job, 'id' | 'createdAt' | 'candidateCount'>) => void;
}

export const NewJobModal: React.FC<NewJobModalProps> = ({
  isOpen,
  onClose,
  clients,
  onSubmit
}) => {
  const [title, setTitle] = useState('');
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [contractType, setContractType] = useState<ContractType>('Full-Time');
  const [minExp, setMinExp] = useState(4);
  const [maxExp, setMaxExp] = useState(8);
  const [location, setLocation] = useState('San Francisco, CA (Hybrid)');
  const [remote, setRemote] = useState(true);
  const [salaryRange, setSalaryRange] = useState('$150,000 - $180,000 / year');
  const [skillInput, setSkillInput] = useState('');
  const [requiredSkills, setRequiredSkills] = useState<string[]>(['Python', 'SQL', 'AWS']);
  const [assignedRecruiterName, setAssignedRecruiterName] = useState('Alex Mercer');
  const [assignedSmeName, setAssignedSmeName] = useState('Dr. Michael Vance (Chief Architect)');

  if (!isOpen) return null;

  const handleAddSkill = () => {
    if (skillInput.trim() && !requiredSkills.includes(skillInput.trim())) {
      setRequiredSkills([...requiredSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter(s => s !== skill));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find(c => c.id === clientId);
    onSubmit({
      title,
      clientId,
      clientName: client?.name || 'Enterprise Client',
      contractType,
      minExperience: minExp,
      maxExperience: maxExp,
      location,
      remote,
      salaryRange,
      requiredSkills,
      preferredSkills: ['Kubernetes', 'Docker'],
      assignedRecruiterId: 'rec-1',
      assignedRecruiterName,
      assignedSmeId: 'sme-1',
      assignedSmeName,
      status: 'Active'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-modal rounded-2xl border border-slate-800 w-full max-w-2xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-white text-base">Create New Job Requisition</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Job Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Cloud Architect"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Staffing Client Account *</label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.industry})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Contract Type</label>
              <select
                value={contractType}
                onChange={(e) => setContractType(e.target.value as ContractType)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Contract (C2C)">Contract (C2C)</option>
                <option value="Contract (W2)">Contract (W2)</option>
                <option value="Part-Time">Part-Time</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Min Exp (Years)</label>
              <input
                type="number"
                min={0}
                max={25}
                value={minExp}
                onChange={(e) => setMinExp(parseInt(e.target.value, 10))}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Max Exp (Years)</label>
              <input
                type="number"
                min={1}
                max={30}
                value={maxExp}
                onChange={(e) => setMaxExp(parseInt(e.target.value, 10))}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Location & Remote Option</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Austin, TX"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Compensation / Pay Band</label>
              <input
                type="text"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                placeholder="e.g. $160,000 - $190,000 / year"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Required Skills Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Required Skills Tags *</label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                placeholder="Type skill tag (e.g. Snowflake, PySpark, Kubernetes) and press Enter"
                className="flex-1 bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {requiredSkills.map(skill => (
                <span key={skill} className="px-2.5 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded text-xs flex items-center gap-1">
                  <Tag className="w-3 h-3 text-blue-400" /> {skill}
                  <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-slate-400 hover:text-white ml-1">×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Team Assignments */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Recruiter</label>
              <select
                value={assignedRecruiterName}
                onChange={(e) => setAssignedRecruiterName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="Alex Mercer">Alex Mercer (Lead Recruiter)</option>
                <option value="Jessica Taylor">Jessica Taylor (Senior Sourcing Recruiter)</option>
                <option value="Rachel Green">Rachel Green (HR Lead)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned SME Evaluator</label>
              <select
                value={assignedSmeName}
                onChange={(e) => setAssignedSmeName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="Dr. Michael Vance (Chief Architect)">Dr. Michael Vance (Chief Architect)</option>
                <option value="Kevin Patel (Principal DevOps SME)">Kevin Patel (Principal DevOps SME)</option>
                <option value="Amanda Lin (Frontend SME)">Amanda Lin (Frontend SME)</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white gradient-bg hover:opacity-90 rounded-xl shadow-lg shadow-blue-500/20 cursor-pointer"
            >
              Post Job Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
