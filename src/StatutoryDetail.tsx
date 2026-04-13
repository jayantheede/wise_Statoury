import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCMS } from './CMSContext';
import { ArrowLeft, ExternalLink, FileText } from 'lucide-react';

export const StatutoryDetail: React.FC = () => {
  const { linkId } = useParams<{ linkId: string }>();
  const { links } = useCMS();
  const navigate = useNavigate();
  
  const link = links.find(l => l.id === linkId);

  if (!link) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800">Content Not Found</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-blue-600 flex items-center gap-2">
          <ArrowLeft size={18} /> Back to Portal
        </button>
      </div>
    );
  }

  const getResolvedImageUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('drive.google.com/file/d/')) {
      const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (match) return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
    return url;
  };

  const headers = link.customHeaders || ['ID.No', 'Type', 'Description', 'Link / Description'];

  return (
    <div className="portal-wrapper min-h-screen bg-gray-50">
      <header className="statutory-hero" style={{ height: '220px', backgroundImage: `url(${useCMS().heroImage})` }}>
        <div className="hero-overlay" />
        <div className="hero-content text-center flex flex-col items-center justify-center">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={16} /> Back to Home
          </button>
          <h1 className="text-4xl font-bold text-white uppercase tracking-wider">{link.title}</h1>
          <div className="breadcrumbs mt-2 opacity-80">Home / Statutory / {link.title}</div>
        </div>
      </header>

      <main className="container py-12">
        <div className="max-w-5xl mx-auto">
          {link.sections && link.sections.length > 0 ? (
            <div className="grid gap-8">
              {link.sections.map((section) => (
                <section key={section.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="bg-gray-800 px-8 py-4">
                    <h2 className="text-lg font-bold text-white uppercase tracking-wide">{section.title}</h2>
                  </div>
                  <div className="p-0">
                    <table className="admin-table statutory-table w-full">
                      <thead>
                        <tr className="bg-gray-50 border-bottom border-gray-200">
                          <th className="py-4 px-6 text-sm font-bold text-gray-700 w-20">{headers[0]}</th>
                          <th className="py-4 px-6 text-sm font-bold text-gray-700 w-1/4">{headers[1]}</th>
                          <th className="py-4 px-6 text-sm font-bold text-gray-700 w-1/4">{headers[2]}</th>
                          <th className="py-4 px-6 text-sm font-bold text-gray-700">{headers[3]}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.items.map((item, idx) => (
                          <tr key={idx} className="border-bottom border-gray-100 hover:bg-gray-50/50 transition-colors">
                            <td className="py-4 px-6 text-sm text-gray-600">{item.idNo}</td>
                            <td className="py-4 px-6 text-sm text-gray-800 font-medium">{item.type}</td>
                            <td className="py-4 px-6 text-sm text-gray-600">{item.description}</td>
                            <td className="py-4 px-6 text-sm text-gray-800">
                              {item.isImage ? (
                                <img src={getResolvedImageUrl(item.value)} alt={item.type || 'Image'} className="h-16 object-contain" />
                              ) : item.isLink ? (
                                <a 
                                  href={item.value.startsWith('http') || item.value.startsWith('mailto:') || item.value.startsWith('tel:') || item.value.startsWith('data:') ? item.value : `https://${item.value}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="view-btn-green"
                                >
                                  View <ExternalLink size={14} className="ml-1" />
                                </a>
                              ) : (
                                <span className="font-semibold">{item.value}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ))}
            </div>
          ) : null}

          {link.images && link.images.length > 0 && (
            <div className="mt-12">
              <div className="bg-gray-800 px-8 py-4 rounded-t-2xl">
                <h2 className="text-lg font-bold text-white uppercase tracking-wide">Infrastructure / Gallery</h2>
              </div>
              <div className="bg-white p-6 rounded-b-2xl shadow-sm border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {link.images.map((img, idx) => (
                    <div key={idx} className="aspect-video rounded-xl overflow-hidden border border-gray-100 group relative">
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-bold bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">View Image</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!link.sections?.length && !link.images?.length ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
              <FileText size={64} className="mx-auto text-gray-200 mb-4" />
              <h3 className="text-xl font-bold text-gray-800">No detailed sections available</h3>
              <p className="text-gray-500 mt-2">This link currently points directly to: </p>
              <a href={link.url} className="text-blue-600 font-mono mt-2 inline-block break-all px-8">{link.url}</a>
              <div className="mt-8">
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  Open Direct Link <ExternalLink size={18} />
                </a>
              </div>
            </div>
          ) : null}
        </div>
      </main>

      <footer className="py-12 text-center text-gray-400 text-sm border-t border-gray-200 bg-white mt-12">
        <p>© 2026 West Godavari Institute of Science and Engineering. All Rights Reserved.</p>
      </footer>
    </div>
  );
};
