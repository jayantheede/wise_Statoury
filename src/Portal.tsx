import React from 'react';
import { useCMS } from './CMSContext';
import { Link } from 'react-router-dom';

export const Portal: React.FC = () => {
  const { categories, links } = useCMS();

  return (
    <div className="portal-wrapper relative">
      <div className="admin-link-wrapper" style={{ zIndex: 100, display: 'flex', gap: '10px' }}>
        <Link to="/psychologist" className="admin-link" style={{ background: '#10b981' }}>Psychologist</Link>
        <Link to="/blog" className="admin-link" style={{ background: '#3b82f6' }}>Read Blog</Link>
        <Link to="/login" className="admin-link">Admin Access</Link>
      </div>

      {/* Exact Hero Header (Without Navigation Bar) */}
      <div className="statutory-hero" style={{ backgroundImage: `url(${useCMS().heroImage})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-widest uppercase">Statutory</h1>
          <p className="breadcrumbs mt-2 opacity-80 font-medium">Home &nbsp;&bull;&nbsp; Statutory</p>
        </div>
      </div>
      
      <div className="container" style={{ position: 'relative', zIndex: 10, marginTop: '-50px', background: '#151515', paddingTop: '50px' }}>
        <div className="row">
          {categories.map((category) => {
            const categoryLinks = links.filter(l => l.categoryId === category.id);
            return (
              <div key={category.id} className="col-md-3">
                <h4 className="statutory-heading">{category.name}</h4>
                <ul>
                  {categoryLinks.map(link => (
                    <li key={link.id} className="statutory-link-item">
                      {link.url === '#' ? (
                        <Link to={`/statutory/${link.id}`} className="statutory-link">
                          {link.title}
                        </Link>
                      ) : link.url.startsWith('/') ? (
                        <Link to={link.url} className="statutory-link">
                          {link.title}
                        </Link>
                      ) : (
                        <a href={link.url.startsWith('http') || link.url.startsWith('mailto:') || link.url.startsWith('tel:') || link.url.startsWith('data:') ? link.url : `https://${link.url}`} className="statutory-link" target="_blank" rel="noopener noreferrer">
                          {link.title}
                        </a>
                      )}
                    </li>
                  ))}
                  {categoryLinks.length === 0 && (
                    <li className="statutory-link-item">
                      <span style={{ color: '#555', fontStyle: 'italic', fontSize: '14px' }}>No items added</span>
                    </li>
                  )}
                </ul>
              </div>
            );
          })}

          {/* Hardcoded Psychologist Profile Link Card */}
          <div className="col-md-3">
            <h4 className="statutory-heading">Wellness & Support</h4>
            <ul>
              <li className="statutory-link-item">
                <Link to="/psychologist" className="statutory-link">
                  Campus Psychologist
                </Link>
              </li>
              <li className="statutory-link-item">
                <Link to="/blog" className="statutory-link">
                  News & Updates
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
