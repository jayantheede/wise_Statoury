import React from 'react';
import { useCMS } from './CMSContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, User, Newspaper } from 'lucide-react';

export const BlogPortal: React.FC = () => {
  const { blogs, heroImage } = useCMS();
  const navigate = useNavigate();

  return (
    <div className="portal-wrapper min-h-screen bg-gray-50">
      <header className="statutory-hero" style={{ height: '220px', backgroundImage: `url(${heroImage})` }}>
        <div className="hero-overlay" />
        <div className="hero-content text-center flex flex-col items-center justify-center h-full">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={16} /> Back to Portal
          </button>
          <h1 className="text-4xl font-bold text-white uppercase tracking-wider flex items-center gap-3">
            <Newspaper size={32} /> Content Blog
          </h1>
          <div className="breadcrumbs mt-2 opacity-80">Home / News & Updates</div>
        </div>
      </header>

      <main className="container py-12 pb-32 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.map(blog => (
            <article key={blog.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
              {blog.imageUrl && (
                <div className="h-56 overflow-hidden">
                  <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex gap-4 text-xs font-semibold text-blue-600 mb-3 uppercase tracking-wider">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {blog.date}</span>
                  {blog.author && <span className="flex items-center gap-1"><User size={14} /> {blog.author}</span>}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{blog.title}</h2>
                <div className="prose prose-sm text-gray-600 line-clamp-4 flex-1 mb-6">
                  {blog.content.split('\n').map((paragraph, i) => (
                    <p key={i} className="mb-2">{paragraph}</p>
                  ))}
                </div>
                <button className="text-blue-600 font-bold text-sm tracking-wider flex items-center gap-2 hover:gap-3 transition-all mt-auto w-max">
                  Read Full Article <ArrowRight size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>

        {blogs.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <Newspaper size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-500">No Articles Yet</h2>
            <p className="text-gray-400 mt-2">Check back later for news and updates.</p>
          </div>
        )}
      </main>
    </div>
  );
};
