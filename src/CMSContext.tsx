import React, { createContext, useContext, useState, useEffect } from 'react';
import { type StatutoryLink, type StatutoryCategory, initialData, initialCategories } from './data';

interface CMSContextType {
  categories: StatutoryCategory[];
  links: StatutoryLink[];
  addCategory: (name: string) => void;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  addLink: (link: Omit<StatutoryLink, 'id'>) => void;
  updateLink: (id: string, updatedLink: Omit<StatutoryLink, 'id'>) => void;
  deleteLink: (id: string) => void;
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<StatutoryCategory[]>(() => {
    const saved = localStorage.getItem('vit_categories_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return initialCategories; }
    }
    return initialCategories;
  });

  const [links, setLinks] = useState<StatutoryLink[]>(() => {
    const saved = localStorage.getItem('vit_links_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return initialData; }
    }
    return initialData;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('vit_auth') === 'true';
  });

  useEffect(() => { localStorage.setItem('vit_categories_v2', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('vit_links_v2', JSON.stringify(links)); }, [links]);
  useEffect(() => { localStorage.setItem('vit_auth', isAuthenticated.toString()); }, [isAuthenticated]);

  const addCategory = (name: string) => {
    const newCategory: StatutoryCategory = { id: `cat-${Date.now()}`, name };
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (id: string, name: string) => {
    setCategories(categories.map(c => c.id === id ? { ...c, name } : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
    setLinks(links.filter(l => l.categoryId !== id)); // cascades delete
  };

  const addLink = (link: Omit<StatutoryLink, 'id'>) => {
    const newLink = { ...link, id: `link-${Date.now()}` };
    setLinks([...links, newLink]);
  };

  const updateLink = (id: string, updatedLink: Omit<StatutoryLink, 'id'>) => {
    setLinks(links.map(l => l.id === id ? { ...l, ...updatedLink } : l));
  };

  const deleteLink = (id: string) => {
    setLinks(links.filter(l => l.id !== id));
  };

  const login = (password: string) => {
    if (password === 'admin123') {
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
      categories, links, 
      addCategory, updateCategory, deleteCategory,
      addLink, updateLink, deleteLink,
      isAuthenticated, login, logout
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
