import React from 'react';
import { useCMS } from './CMSContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, FileText, Download, FileDown } from 'lucide-react';

export const Psychologist: React.FC = () => {
  const { heroImage, psychologist } = useCMS();
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
            <User size={32} /> Psychologist
          </h1>
          <div className="breadcrumbs mt-2 opacity-80">Home / Psychologist</div>
        </div>
      </header>

      <main className="container py-12 pb-32 max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">Psychologist</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800">{psychologist.name}</h3>
              <p className="text-gray-600 font-medium">{psychologist.designation}</p>
              <p className="text-gray-600">{psychologist.qualifications}</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50/50 text-sm text-gray-700 leading-relaxed space-y-4">
              {psychologist.description.split('\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-max">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">MOU's</h2>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse">
                <tbody>
                  <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-800 border-r border-gray-200">MOU-1</td>
                    <td className="py-4 px-6 text-center">
                      <a href={psychologist.mou1Link !== '#' ? psychologist.mou1Link : undefined} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center text-gray-600 hover:text-red-600 transition-colors cursor-pointer" title="Download MOU-1">
                        <FileDown size={28} strokeWidth={1.5} className="text-gray-700" />
                        <span className="text-red-500 -ml-2 mt-2"><Download size={12} strokeWidth={3} /></span>
                      </a>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-800 border-r border-gray-200">MOU-2</td>
                    <td className="py-4 px-6 text-center">
                      <a href={psychologist.mou2Link !== '#' ? psychologist.mou2Link : undefined} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center text-gray-600 hover:text-red-600 transition-colors cursor-pointer" title="Download MOU-2">
                        <FileDown size={28} strokeWidth={1.5} className="text-gray-700" />
                        <span className="text-red-500 -ml-2 mt-2"><Download size={12} strokeWidth={3} /></span>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
