import React, { useState, useEffect } from 'react';
import { type StatutoryLink } from './data';
import { Plus, Trash2, X, Save, ArrowLeft, Upload, Check } from 'lucide-react';

interface ContentManagerProps {
  link: StatutoryLink;
  onSave: (data: { sections: StatutoryLink['sections'], images?: string[], customHeaders?: [string, string, string, string] }) => void;
  onCancel: () => void;
}

export const ContentManager: React.FC<ContentManagerProps> = ({ link, onSave, onCancel }) => {
  const [sections, setSections] = useState<StatutoryLink['sections']>(link.sections || []);
  const [images, setImages] = useState<string[]>(link.images || []);
  const [customHeaders, setCustomHeaders] = useState<[string, string, string, string]>(link.customHeaders || ['ID.No', 'Type', 'Description', 'Link / Description']);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Auto-save effect
  useEffect(() => {
    const timer = setTimeout(() => {
      onSave({ sections, images, customHeaders });
      setSaveStatus('Auto-saved successfully!');
      setTimeout(() => setSaveStatus(null), 2000);
    }, 1000);
    return () => clearTimeout(timer);
  }, [sections, images, customHeaders]);

  const handleBack = () => {
    onSave({ sections, images, customHeaders });
    onCancel();
  };

  const updateHeader = (idx: number, val: string) => {
    const newHeaders = [...customHeaders] as [string, string, string, string];
    newHeaders[idx] = val;
    setCustomHeaders(newHeaders);
  };

  const addSection = () => {
    const newSection = {
      id: `sec-${Date.now()}`,
      title: 'New Section',
      items: [{ idNo: '1.x', type: 'New Type', description: 'Description', value: '#', isLink: true }]
    };
    setSections([...(sections || []), newSection]);
  };

  const removeSection = (secId: string) => {
    if(!sections) return;
    setSections(sections.filter(s => s.id !== secId));
  };

  const updateSectionTitle = (secId: string, title: string) => {
    if(!sections) return;
    setSections(sections.map(s => s.id === secId ? { ...s, title } : s));
  };

  const addItem = (secId: string) => {
    if(!sections) return;
    setSections(sections.map(s => {
      if (s.id === secId) {
        return {
          ...s,
          items: [...s.items, { idNo: '', type: '', description: '', value: '', isLink: false }]
        };
      }
      return s;
    }));
  };

  const removeItem = (secId: string, itemIdx: number) => {
    if(!sections) return;
    setSections(sections.map(s => {
      if (s.id === secId) {
        const newItems = [...s.items];
        newItems.splice(itemIdx, 1);
        return { ...s, items: newItems };
      }
      return s;
    }));
  };

  const updateItem = (secId: string, itemIdx: number, field: string, value: any) => {
    if(!sections) return;
    setSections(sections.map(s => {
      if (s.id === secId) {
        const newItems = [...s.items];
        newItems[itemIdx] = { ...newItems[itemIdx], [field]: value };
        return { ...s, items: newItems };
      }
      return s;
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImages(prev => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  return (
    <div className="content-manager pb-20">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button onClick={handleBack} className="action-btn bg-white border border-gray-200" title="Save & Go Back">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Managing Detail Content</h2>
            <p className="text-sm text-gray-500">{link.title}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <label className="btn btn-outline text-blue-600 bg-blue-50 border-blue-200 cursor-pointer flex items-center justify-center gap-2">
            <Upload size={18} /> Add Images
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
          <button onClick={addSection} className="btn btn-outline text-blue-600 bg-blue-50 border-blue-200">
            <Plus size={18} /> Add Section
          </button>
          <button onClick={() => { onSave({ sections, images, customHeaders }); handleBack(); }} className="btn btn-primary shadow-md relative overflow-hidden group">
            {saveStatus ? <><Check size={18} /> {saveStatus}</> : <><Save size={18} /> Save All & Close</>}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Customize Table Headers for {link.title}</h3>
        <div className="grid grid-cols-4 gap-4">
          <input type="text" value={customHeaders[0]} onChange={(e) => updateHeader(0, e.target.value)} className="admin-input" placeholder="Header 1 (e.g. S.No)" />
          <input type="text" value={customHeaders[1]} onChange={(e) => updateHeader(1, e.target.value)} className="admin-input" placeholder="Header 2 (e.g. Member Name)" />
          <input type="text" value={customHeaders[2]} onChange={(e) => updateHeader(2, e.target.value)} className="admin-input" placeholder="Header 3 (e.g. Designation)" />
          <input type="text" value={customHeaders[3]} onChange={(e) => updateHeader(3, e.target.value)} className="admin-input" placeholder="Header 4 (e.g. Position)" />
        </div>
      </div>

      {images.length > 0 && (
        <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            Image Gallery Documentations
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 group shadow-sm hover:shadow-md transition-shadow">
                <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                <button 
                  onClick={() => removeImage(idx)} 
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {sections && sections.map((section) => (
          <div key={section.id} className="admin-card border border-blue-100 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-bottom border-gray-100">
              <input 
                type="text" 
                className="bg-transparent font-bold text-gray-800 border-none focus:ring-0 w-full text-lg outline-none" 
                value={section.title}
                onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                placeholder="Section Title (e.g. 1. Basic Information)"
              />
              <button 
                onClick={() => removeSection(section.id)}
                className="action-btn text-red-500 hover:text-red-700 bg-white shadow-sm border border-red-100"
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className="p-6 overflow-x-auto">
              <table className="w-full border-collapse min-w-[700px]">
                <thead>
                  <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest border-bottom border-gray-100 bg-gray-50/50">
                    <th className="py-3 px-4 w-20">{customHeaders[0] || 'ID.No'}</th>
                    <th className="py-3 px-4 w-1/4">{customHeaders[1] || 'Type'}</th>
                    <th className="py-3 px-4 w-1/4">{customHeaders[2] || 'Description'}</th>
                    <th className="py-3 px-1">{customHeaders[3] || 'Value / Link URL'}</th>
                    <th className="py-3 px-1 w-20 text-center text-[10px]">Is Link?</th>
                    <th className="py-3 px-1 w-20 text-center text-[10px]">Is Image?</th>
                    <th className="py-3 px-4 w-12 text-right"></th>
                  </tr>
                </thead>
                <tbody>
                  {section.items.map((item, iIdx) => (
                    <tr key={iIdx} className="border-bottom border-gray-50 last:border-none group hover:bg-blue-50/20 transition-colors">
                      <td className="py-2 px-1">
                        <input className="table-input" value={item.idNo} onChange={(e) => updateItem(section.id, iIdx, 'idNo', e.target.value)} placeholder="1.1" />
                      </td>
                      <td className="py-2 px-1">
                        <input className="table-input" value={item.type} onChange={(e) => updateItem(section.id, iIdx, 'type', e.target.value)} placeholder="Type" />
                      </td>
                      <td className="py-2 px-1">
                        <input className="table-input" value={item.description} onChange={(e) => updateItem(section.id, iIdx, 'description', e.target.value)} placeholder="Description" />
                      </td>
                      <td className="py-2 px-1">
                        <input className="table-input font-mono text-xs text-blue-600 bg-blue-50/30" value={item.value} onChange={(e) => updateItem(section.id, iIdx, 'value', e.target.value)} placeholder="Value or URL" />
                      </td>
                      <td className="py-2 px-1 text-center">
                        <div className="flex justify-center">
                          <input type="checkbox" checked={item.isLink} onChange={(e) => updateItem(section.id, iIdx, 'isLink', e.target.checked)} className="cursor-pointer w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-2" title="Toggle as Link" />
                        </div>
                      </td>
                      <td className="py-2 px-1 text-center">
                        <div className="flex justify-center">
                          <input type="checkbox" checked={item.isImage} onChange={(e) => updateItem(section.id, iIdx, 'isImage', e.target.checked)} className="cursor-pointer w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500 focus:ring-2" title="Toggle as Image" />
                        </div>
                      </td>
                      <td className="py-2 px-1 text-right">
                        <button onClick={() => removeItem(section.id, iIdx)} className="action-btn text-red-400 hover:text-white bg-transparent hover:bg-red-500 opacity-0 group-hover:opacity-100 transition-all"><X size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button 
                onClick={() => addItem(section.id)}
                className="mt-6 flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors py-2 px-4 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200"
              >
                <Plus size={16} /> Add Document Row
              </button>
            </div>
          </div>
        ))}
        
        {(!sections || sections.length === 0) && (
          <div className="empty-state py-20 bg-white shadow-sm border-dashed border-gray-300 rounded-2xl">
            <h3 className="text-lg font-bold text-gray-400 mb-2">No Content Sections</h3>
            <p className="text-sm text-gray-500 mb-6">Create your first section to build the sub-page hierarchy.</p>
            <button onClick={addSection} className="btn btn-primary">
              <Plus size={18} /> Start Building Sub-page
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
