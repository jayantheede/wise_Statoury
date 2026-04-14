import React, { createContext, useContext, useState, useEffect } from 'react';
import { type StatutoryLink, type StatutoryCategory, type BlogPost, type PsychologistInfo, initialData, initialCategories } from './data';

interface CMSContextType {
  categories: StatutoryCategory[];
  links: StatutoryLink[];
  blogs: BlogPost[];
  addCategory: (name: string) => void;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  addLink: (link: Omit<StatutoryLink, 'id'>) => void;
  updateLink: (id: string, updatedLink: Partial<StatutoryLink>) => void;
  deleteLink: (id: string) => void;
  updateLinkSections: (id: string, sections: StatutoryLink['sections']) => void;
  updateLinkFull: (id: string, updated: Partial<StatutoryLink>) => void;
  addBlog: (blog: Omit<BlogPost, 'id'>) => void;
  updateBlog: (id: string, blog: Partial<BlogPost>) => void;
  deleteBlog: (id: string) => void;
  psychologist: PsychologistInfo;
  updatePsychologist: (info: PsychologistInfo) => void;
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  heroImage: string;
  setHeroImage: (url: string) => void;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<StatutoryCategory[]>(initialCategories);
  const [links, setLinks] = useState<StatutoryLink[]>(initialData);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [psychologist, setPsychologist] = useState<PsychologistInfo>({
    name: 'Mr. Ram Prudhvy Teja',
    designation: 'Sr. Psychologist',
    qualifications: 'M.Sc. (Psychology),PG Diploma in Mental Health',
    description: 'A psychologist studies human behavior and mental processes... They play a vital role...',
    mou1Link: '#',
    mou2Link: '#'
  });
  const [heroImage, setHeroImage] = useState<string>('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2600&auto=format&fit=crop');

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('wise_auth') === 'true';
  });

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        if (data.categories) setCategories(data.categories);
        if (data.links) setLinks(data.links);
        if (data.heroImage) setHeroImage(data.heroImage);
        if (data.blogs) setBlogs(data.blogs);
        if (data.psychologist) setPsychologist(data.psychologist);
        setLoading(false);
      })
      .catch((e) => {
        console.error('Failed to load from backend, using defaults', e);
        setLoading(false);
      });
  }, []);

  // Synchronize state to backend - ONLY if authenticated (Admin only)
  useEffect(() => {
    if (loading || !isAuthenticated) return; 
    
    const controller = new AbortController();
    fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categories, links, heroImage, blogs, psychologist }),
      signal: controller.signal
    }).then(async res => {
      if (!res.ok) {
        console.error("Save failed", await res.text());
        // We only alert in admin mode now
        if (window.location.pathname.includes('admin')) {
          alert("Storage Warning: Data sync failed. Try reducing file sizes or using links.");
        }
      }
    }).catch(e => {
      if (e.name !== 'AbortError') console.error("Sync error", e);
    });

    return () => controller.abort();
  }, [categories, links, heroImage, blogs, psychologist, loading, isAuthenticated]);

  useEffect(() => { localStorage.setItem('wise_auth', isAuthenticated.toString()); }, [isAuthenticated]);

  if (loading) {
    return <div className="min-h-screen bg-[#151515] flex items-center justify-center text-white font-bold tracking-widest text-xl uppercase">Loading...</div>;
  }

  const addCategory = (name: string) => {
    const newCategory: StatutoryCategory = { id: `cat-${Date.now()}`, name };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: string, name: string) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, name } : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    setLinks(prev => prev.filter(l => l.categoryId !== id)); // cascades delete
  };

  const addLink = (link: Omit<StatutoryLink, 'id'>) => {
    const newLink = { ...link, id: `link-${Date.now()}` };
    setLinks(prev => [...prev, newLink]);
  };

  const updateLink = (id: string, updatedLink: Partial<StatutoryLink>) => {
    setLinks(prev => prev.map(l => l.id === id ? { ...l, ...updatedLink } : l));
  };

  const updateLinkSections = (id: string, sections: StatutoryLink['sections']) => {
    setLinks(prev => prev.map(l => l.id === id ? { ...l, sections } : l));
  };

  const updateLinkFull = (id: string, updated: Partial<StatutoryLink>) => {
    setLinks(prev => prev.map(l => l.id === id ? { ...l, ...updated } : l));
  };

  const deleteLink = (id: string) => {
    setLinks(prev => prev.filter(l => l.id !== id));
  };

  const addBlog = (blog: Omit<BlogPost, 'id'>) => {
    setBlogs(prev => [{ ...blog, id: `blog-${Date.now()}` }, ...prev]);
  };

  const updateBlog = (id: string, updatedBlog: Partial<BlogPost>) => {
    setBlogs(prev => prev.map(b => b.id === id ? { ...b, ...updatedBlog } : b));
  };

  const deleteBlog = (id: string) => {
    setBlogs(prev => prev.filter(b => b.id !== id));
  };

  const updatePsychologist = (info: PsychologistInfo) => setPsychologist(info);

  const login = (password: string) => {
    if (password === 'Admin@Wise#1') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <CMSContext.Provider value={{
      categories, links, blogs,
      addCategory, updateCategory, deleteCategory,
      addLink, updateLink, deleteLink, updateLinkSections, updateLinkFull,
      addBlog, updateBlog, deleteBlog,
      psychologist, updatePsychologist,
      isAuthenticated, login, logout,
      heroImage, setHeroImage
    }}>
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) throw new Error('useCMS must be used within CMSProvider');
  return context;
};
