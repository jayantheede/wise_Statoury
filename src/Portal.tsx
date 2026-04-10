import React from 'react';
import { useCMS } from './CMSContext';
import { Link } from 'react-router-dom';

export const Portal: React.FC = () => {
  const { categories, links } = useCMS();

  return (
    <div className="portal-wrapper relative">
      <div className="admin-link-wrapper" style={{ zIndex: 100 }}>
        <Link to="/login" className="admin-link">Admin Access</Link>
      </div>

      {/* Exact Hero Header (Without Navigation Bar) */}
      <div className="statutory-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Statutory</h1>
          <p className="breadcrumbs">Home &nbsp;&bull;&nbsp; Statutory</p>
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
                      <a href={link.url} className="statutory-link">
                        {link.title}
                      </a>
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
        </div>
      </div>
    </div>
  );
};
