import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCMS } from './CMSContext';
import { type StatutoryLink, type StatutoryCategory } from './data';
import { LogOut, Plus, Edit2, Trash2, Home, X, FolderPlus, Settings, Upload, FileText, Newspaper, User } from 'lucide-react';
import { ContentManager } from './ContentManager';
import { AdminBlog } from './AdminBlog';
import { AdminPsychologist } from './AdminPsychologist';

export const Admin: React.FC = () => {
  const { categories, links, addCategory, updateCategory, deleteCategory, addLink, updateLink, deleteLink, updateLinkSections, logout, heroImage, setHeroImage } = useCMS();
  const navigate = useNavigate();
  
  const [activeCategoryId, setActiveCategoryId] = useState<string>(categories[0]?.id || '');

  // Modals state
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [linkFormData, setLinkFormData] = useState({ title: '', url: '', categoryId: activeCategoryId });
  const [isUploading, setIsUploading] = useState(false);

  const [activeTab, setActiveTab] = useState<'content' | 'blog' | 'psychologist'>('content');
  const [managingLinkId, setManagingLinkId] = useState<string | null>(null);

  const handleSaveSections = (data: { sections: StatutoryLink['sections'], images?: string[], customHeaders?: [string, string, string, string] }) => {
    if (managingLinkId) {
      updateLinkSections(managingLinkId, data.sections);
      updateLink(managingLinkId, { images: data.images, customHeaders: data.customHeaders });
      setManagingLinkId(null);
    }
  };

  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catFormData, setCatFormData] = useState({ name: '' });

  const filteredLinks = links.filter(l => l.categoryId === activeCategoryId);
  const activeCategory = categories.find(c => c.id === activeCategoryId);

  const handleLogout = () => { logout(); navigate('/'); };

  // Category Actions
  const openCatModal = (cat?: StatutoryCategory) => {
    if (cat) {
      setEditingCatId(cat.id);
      setCatFormData({ name: cat.name });
    } else {
      setEditingCatId(null);
      setCatFormData({ name: '' });
    }
    setIsCatModalOpen(true);
  };

  const saveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCatId) {
      updateCategory(editingCatId, catFormData.name);
    } else {
      addCategory(catFormData.name);
    }
    setIsCatModalOpen(false);
  };

  // Link Actions
  const openLinkModal = (link?: StatutoryLink) => {
    if (link) {
      setEditingLinkId(link.id);
      setLinkFormData({ title: link.title, url: link.url, categoryId: link.categoryId });
    } else {
      setEditingLinkId(null);
      setLinkFormData({ title: '', url: '#', categoryId: activeCategoryId });
    }
    setIsLinkModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setLinkFormData({ ...linkFormData, url: result });
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const saveLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLinkId) {
      updateLink(editingLinkId, linkFormData);
    } else {
      addLink(linkFormData);
    }
    setIsLinkModalOpen(false);
    navigate('/admin/success');
  };

  return (
    <div className="admin-wrapper">
      <aside className="admin-sidebar shadow-xl">
        <div className="admin-brand">
          <Settings size={28} className="text-blue-600" />
          <h2>Admin CMS</h2>
        </div>
        
        <nav className="flex-1 overflow-y-auto mt-6 px-4">
          <div className="flex justify-between items-center mb-4 px-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Categories</span>
            <button onClick={() => openCatModal()} className="add-btn hover:text-blue-600">
              <Plus size={16} />
            </button>
          </div>
          
          <div className="flex flex-col gap-1">
            {categories.map(cat => (
              <div key={cat.id} className={`admin-nav-item group ${activeCategoryId === cat.id ? 'active' : ''}`}>
                <button
                  className="flex-1 text-left truncate font-medium"
                  onClick={() => setActiveCategoryId(cat.id)}
                >
                  {cat.name}
                </button>
                <div className="admin-nav-actions">
                  <button onClick={() => openCatModal(cat)} className="action-btn"><Edit2 size={14} /></button>
                  <button onClick={() => deleteCategory(cat.id)} className="action-btn text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}

            <button 
              onClick={() => setActiveTab('blog')} 
              className={`admin-nav-item mt-4 ${activeTab === 'blog' ? 'active bg-blue-50 text-blue-600 border-r-4 border-blue-500' : ''}`}
            >
              <Newspaper size={18} />
              <span className="font-medium">Content Blog</span>
            </button>

            <button 
              onClick={() => setActiveTab('psychologist')} 
              className={`admin-nav-item mt-1 ${activeTab === 'psychologist' ? 'active bg-emerald-50 text-emerald-600 border-r-4 border-emerald-500' : ''}`}
            >
              <User size={18} />
              <span className="font-medium">Psychologist Config</span>
            </button>
            
            {categories.length === 0 && (
              <p className="text-sm text-gray-400 px-2 italic mt-4 text-center">No categories yet.</p>
            )}
          </div>
        </nav>
        
        <div className="admin-footer">
          <button onClick={() => navigate('/')} className="admin-nav-item w-full">
            <Home size={18} /> <span className="font-medium">Public Portal</span>
          </button>
          <button onClick={handleLogout} className="admin-nav-item w-full text-red-500 hover:bg-red-50 hover:text-red-600 mt-2">
            <LogOut size={18} /> <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
            <p className="text-sm text-gray-500 mt-1">Manage global configuration and contents</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
            <div className="h-10 w-24 rounded overflow-hidden border border-gray-200">
              <img src={heroImage} alt="Global Hero Preview" className="h-full w-full object-cover" />
            </div>
            <div className="text-sm">
              <label className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer flex items-center gap-1">
                <Upload size={14} /> Upload Hero
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    const r = new FileReader();
                    r.onloadend = () => setHeroImage(r.result as string);
                    r.readAsDataURL(f);
                  }
                }} />
              </label>
            </div>
          </div>
        </div>

        <div className="admin-content">
          {managingLinkId ? (
            <ContentManager 
              link={links.find(l => l.id === managingLinkId)!} 
              onSave={handleSaveSections}
              onCancel={() => setManagingLinkId(null)}
            />
          ) : activeTab === 'blog' ? (
            <AdminBlog />
          ) : activeTab === 'psychologist' ? (
            <div className="max-w-5xl">
              <AdminPsychologist />
            </div>
          ) : activeCategory ? (
            <>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{activeCategory.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage links and URLs under this category</p>
                </div>
                <button onClick={() => openLinkModal()} className="btn btn-primary shadow-sm hover:shadow-md">
                  <Plus size={18} /> Add New Link
                </button>
              </div>

              <div className="admin-card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>URL Destination</th>
                      <th style={{ width: '120px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                  {filteredLinks.length > 0 ? (
                    filteredLinks.map(link => (
                      <tr key={link.id}>
                        <td className="font-semibold text-gray-800">{link.title}</td>
                        <td className="text-sm font-mono text-gray-500 bg-gray-50 rounded px-2 py-1 inline-block mt-2 mb-2">{link.url}</td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setManagingLinkId(link.id)} className="action-btn shadow-sm border border-gray-200 bg-blue-50 text-blue-600 hover:border-blue-300 hover:bg-blue-100" title="Edit Inner Pages">
                              <FileText size={16} />
                            </button>
                            <button onClick={() => openLinkModal(link)} className="action-btn shadow-sm border border-gray-200 bg-white hover:border-blue-300 hover:text-blue-600" title="Edit Link Properties">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => deleteLink(link.id)} className="action-btn shadow-sm border border-gray-200 bg-white hover:border-red-300 hover:text-red-500" title="Delete Form">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center py-16">
                        <FolderPlus size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium">No links found</p>
                        <p className="text-sm text-gray-400 mt-1">Get started by creating a new link.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon text-gray-400">
              <FolderPlus size={64} strokeWidth={1} />
            </div>
            <h2>No Categories Selected</h2>
            <p>Create a category from the sidebar to start managing your portal links.</p>
            <button onClick={() => openCatModal()} className="btn btn-primary shadow-md mt-4">
              <Plus size={18} /> Create First Category
            </button>
          </div>
        )}
        </div>
      </main>

      {/* Modern Modals */}
      {isCatModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-panel shadow-2xl">
            <div className="modal-header">
              <h3 className="text-xl font-bold text-gray-900">{editingCatId ? 'Edit Category' : 'New Category'}</h3>
              <button onClick={() => setIsCatModalOpen(false)} className="action-btn text-gray-400 hover:text-gray-900"><X size={20} /></button>
            </div>
            <form onSubmit={saveCategory} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category Name</label>
                <input type="text" className="input-field" placeholder="e.g. Governance" value={catFormData.name} onChange={e => setCatFormData({ ...catFormData, name: e.target.value })} required autoFocus />
              </div>
              <button type="submit" className="btn btn-primary w-full justify-center shadow-md">Save Category</button>
            </form>
          </div>
        </div>
      )}

      {/* Link Modal */}
      {isLinkModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-panel shadow-2xl">
            <div className="modal-header">
              <h3 className="text-xl font-bold text-gray-900">{editingLinkId ? 'Edit Link' : 'New Link'}</h3>
              <button onClick={() => setIsLinkModalOpen(false)} className="action-btn text-gray-400 hover:text-gray-900"><X size={20} /></button>
            </div>
            <form onSubmit={saveLink} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Link Title</label>
                <input type="text" className="input-field" placeholder="e.g. Mandatory Disclosure" value={linkFormData.title} onChange={e => setLinkFormData({ ...linkFormData, title: e.target.value })} required autoFocus />
              </div>
              <div className="upload-container mb-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Upload Document (Optional)</label>
                <div className="relative">
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={handleFileUpload}
                  />
                  <div className={`upload-dropzone ${isUploading ? 'uploading' : ''}`}>
                    {linkFormData.url.startsWith('data:') ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <FileText size={18} />
                        <span className="text-sm font-medium">Document Attached</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Upload size={18} />
                        <span className="text-sm font-medium">Click to upload file</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-1.5">
                  <label className="block text-sm font-semibold text-gray-700">URL Target / Destination</label>
                  <button 
                    type="button"
                    onClick={() => setLinkFormData({ ...linkFormData, url: '#' })}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 transition-colors"
                  >
                    + Use Inner Table Page
                  </button>
                </div>
                <input 
                  type="text" 
                  className="input-field font-mono text-sm" 
                  placeholder="https:// or paste /psychologist" 
                  value={linkFormData.url} 
                  onChange={e => setLinkFormData({ ...linkFormData, url: e.target.value })} 
                  required 
                />
                {linkFormData.url === '#' && (
                  <p className="text-xs text-green-600 mt-1 font-medium flex items-center gap-1">
                    ✓ This will create an editable sub-page template!
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category Assignment</label>
                <select className="input-field" value={linkFormData.categoryId} onChange={e => setLinkFormData({ ...linkFormData, categoryId: e.target.value })}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <button type="submit" className="btn btn-primary w-full justify-center shadow-md mt-2" disabled={isUploading}>
                {isUploading ? 'Uploading...' : (editingLinkId ? 'Update Link' : 'Save & Publish')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
