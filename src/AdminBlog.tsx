import React, { useState } from 'react';
import { useCMS } from './CMSContext';
import { Plus, Trash2, Edit3, Image as ImageIcon } from 'lucide-react';
import { type BlogPost } from './data';

export const AdminBlog: React.FC = () => {
  const { blogs, addBlog, updateBlog, deleteBlog } = useCMS();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<BlogPost>>({});

  const handleAddBlog = () => {
    addBlog({
      title: 'New Blog Post',
      content: 'Start writing your content here...',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleEdit = (blog: BlogPost) => {
    setEditingId(blog.id);
    setFormData(blog);
  };

  const handleSave = () => {
    if (editingId && formData.title) {
      updateBlog(editingId, formData);
      setEditingId(null);
      setFormData({});
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Content Blog Manager</h2>
        <button onClick={handleAddBlog} className="btn btn-primary">
          <Plus size={18} /> Add New Post
        </button>
      </div>

      <div className="space-y-4">
        {blogs.map(blog => (
          <div key={blog.id} className="border border-gray-100 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            {editingId === blog.id ? (
              <div className="w-full space-y-4">
                <input 
                  type="text" 
                  value={formData.title || ''} 
                  onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                  className="admin-input font-bold text-lg"
                  placeholder="Post Title"
                />
                <input 
                  type="date" 
                  value={formData.date || ''} 
                  onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
                  className="admin-input"
                />
                <input 
                  type="text" 
                  value={formData.author || ''} 
                  onChange={e => setFormData(p => ({ ...p, author: e.target.value }))}
                  className="admin-input"
                  placeholder="Author Name"
                />
                
                <div className="flex items-center gap-4">
                  <label className="btn btn-outline text-blue-600 bg-blue-50 border-blue-200 cursor-pointer text-sm py-2">
                    <ImageIcon size={16} /> Cover Image
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                  {formData.imageUrl && <span className="text-xs text-green-600 font-bold">Image Attached</span>}
                </div>

                <textarea 
                  value={formData.content || ''} 
                  onChange={e => setFormData(p => ({ ...p, content: e.target.value }))}
                  className="admin-input min-h-[200px]"
                  placeholder="Write your blog content here. You can use multiple paragraphs."
                />

                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setEditingId(null)} className="btn btn-outline">Cancel</button>
                  <button onClick={handleSave} className="btn btn-primary">Save Post</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg">{blog.title}</h3>
                  <div className="flex gap-4 text-xs text-gray-500 mt-1">
                    <span>{blog.date}</span>
                    {blog.author && <span>By {blog.author}</span>}
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{blog.content}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(blog)} className="action-btn bg-blue-50 text-blue-600">
                    <Edit3 size={16} />
                  </button>
                  <button onClick={() => deleteBlog(blog.id)} className="action-btn bg-red-50 text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {blogs.length === 0 && (
          <div className="text-center p-8 text-gray-400 bg-gray-50 rounded-xl">
            No blog posts published yet.
          </div>
        )}
      </div>
    </div>
  );
};
