import React, { useState, useEffect } from 'react';
import { useCMS } from './CMSContext';
import { Save, UserCircle2 } from 'lucide-react';
import { type PsychologistInfo } from './data';

export const AdminPsychologist: React.FC = () => {
  const { psychologist, updatePsychologist } = useCMS();
  const [formData, setFormData] = useState<PsychologistInfo>(psychologist);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setFormData(psychologist);
  }, [psychologist]);

  const handleSave = () => {
    updatePsychologist(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-4xl max-w-3xl">
      <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
        <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg">
          <UserCircle2 size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Campus Psychologist Profile</h2>
          <p className="text-sm text-gray-500">Manage the public details and MOU links for the campus psychologist.</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="admin-input"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Primary Designation</label>
            <input 
              type="text" 
              value={formData.designation} 
              onChange={e => setFormData({ ...formData, designation: e.target.value })}
              className="admin-input"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Qualifications / Degrees</label>
          <input 
            type="text" 
            value={formData.qualifications} 
            onChange={e => setFormData({ ...formData, qualifications: e.target.value })}
            className="admin-input"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Description (Supports multiple paragraphs)</label>
          <textarea 
            value={formData.description} 
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="admin-input min-h-[200px]"
            placeholder="Write the about description here. Use enter to separate paragraphs."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">MOU-1 Document Link</label>
            <input 
              type="text" 
              value={formData.mou1Link} 
              onChange={e => setFormData({ ...formData, mou1Link: e.target.value })}
              className="admin-input font-mono text-sm"
              placeholder="e.g. Google Drive link or # to hide"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">MOU-2 Document Link</label>
            <input 
              type="text" 
              value={formData.mou2Link} 
              onChange={e => setFormData({ ...formData, mou2Link: e.target.value })}
              className="admin-input font-mono text-sm"
              placeholder="e.g. Google Drive link or # to hide"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            onClick={handleSave} 
            className={`btn px-8 flex items-center justify-center gap-2 ${isSaved ? 'bg-green-500 hover:bg-green-600 text-white shadow-md' : 'btn-primary'}`}
          >
            <Save size={18} /> {isSaved ? 'Saved Successfully!' : 'Save Psychologist Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};
