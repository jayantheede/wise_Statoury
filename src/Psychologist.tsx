import React from 'react';
import { useCMS } from './CMSContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Download, FileDown, ExternalLink } from 'lucide-react';

export const Psychologist: React.FC = () => {
  const { heroImage, psychologist } = useCMS();
  const navigate = useNavigate();

  return (
    <div className="portal-wrapper min-h-screen bg-[#050505] text-gray-300 overflow-x-hidden">
      {/* Dynamic Background Accents */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <header className="relative h-[450px] flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Hero" 
            className="w-full h-full object-cover scale-105 blur-[2px] opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#050505]" />
        </div>

        <div className="hero-content relative z-10 text-center px-6 max-w-5xl">
          <button 
            onClick={() => navigate('/')} 
            className="group flex items-center gap-3 text-white/50 hover:text-white transition-all mb-8 bg-white/5 hover:bg-white/10 px-6 py-3 rounded-full backdrop-blur-2xl border border-white/10 mx-auto transform hover:scale-105"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
            <span className="font-semibold tracking-wide">Return to Statutory Portal</span>
          </button>
          
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse" />
            <div className="relative w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 backdrop-blur-2xl shadow-2xl">
              <User size={48} className="text-blue-500" />
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl font-black text-white uppercase tracking-[0.15em] mb-4 drop-shadow-2xl">
            {psychologist.name.split(' ')[0]} <span className="text-blue-600">{psychologist.name.split(' ').slice(1).join(' ')}</span>
          </h1>
          
          <div className="flex items-center justify-center gap-4 text-gray-400 font-bold tracking-[0.3em] text-xs uppercase">
            <span className="h-[1px] w-12 bg-white/20" />
            {psychologist.designation}
            <span className="h-[1px] w-12 bg-white/20" />
          </div>
        </div>
      </header>

      <main className="relative z-10 container py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Profile Section */}
          <div className="lg:col-span-12 xl:col-span-8 space-y-10">
            <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[40px] border border-white/5 p-12 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] -mr-[250px] -mt-[250px]" />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-12">
                  <div>
                    <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Professional Profile</h2>
                    <p className="text-blue-500 font-bold text-sm tracking-widest uppercase">Clinical Psychology & Behavioral Support</p>
                  </div>
                  <div className="hidden md:block text-right">
                    <div className="text-3xl font-black text-white/5 uppercase">Biography</div>
                  </div>
                </div>

                <div className="space-y-8 text-xl leading-relaxed text-gray-400 font-light">
                  {psychologist.description.split('\n').map((paragraph, i) => {
                    if (paragraph.includes('Contact Number')) {
                      return (
                        <div key={i} className="my-10 p-8 rounded-[32px] bg-blue-600/10 border border-blue-500/20 shadow-2xl group transition-all hover:bg-blue-600/20">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/40">
                              <Download size={28} className="text-white rotate-[-135deg]" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Emergency Consultation</div>
                              <div className="text-3xl font-bold text-white">{paragraph.split(':')[1]?.trim()}</div>
                            </div>
                            <a 
                              href={`tel:${paragraph.split(':')[1]?.trim()}`}
                              className="ml-auto bg-white text-black px-8 py-4 rounded-2xl font-bold hover:bg-blue-500 hover:text-white transition-all transform hover:scale-105 active:scale-95"
                            >
                              Connect Now
                            </a>
                          </div>
                        </div>
                      )
                    }
                    return <p key={i}>{paragraph}</p>
                  })}
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Available', value: '24 / 7', icon: '⚡' },
                    { label: 'Consultations', value: 'Private', icon: '🔒' },
                    { label: 'Department', value: 'Wellness', icon: '🌱' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-3xl transition-all hover:border-white/20">
                      <div className="text-2xl mb-2">{stat.icon}</div>
                      <div className="text-white font-bold text-lg">{stat.value}</div>
                      <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* MOUs Sidebar Section */}
          <div className="lg:col-span-12 xl:col-span-4 space-y-10">
            <div className="bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-3xl rounded-[40px] border border-white/10 p-10 h-full relative overflow-hidden shadow-2xl">
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                  <FileDown className="text-blue-500" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">MOUs & Verification</h2>
              </div>
              
              <div className="space-y-6">
                {[
                  { title: "Institutional MOU", phase: "Primary Accreditation", link: psychologist.mou1Link },
                  { title: "Community Support", phase: "Public Wellness Agreement", link: psychologist.mou2Link }
                ].map((mou, i) => (
                  <div key={i} className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-500" />
                    <div className="relative bg-[#0A0A0A] border border-white/5 group-hover:border-blue-500/50 rounded-3xl p-8 transition-all">
                      <div className="mb-6">
                        <div className="text-blue-500 font-black text-[10px] uppercase tracking-[0.2em] mb-2 px-3 py-1 bg-blue-500/10 rounded-full w-fit">Validated Resource</div>
                        <h3 className="text-xl font-bold text-white mb-1">{mou.title}</h3>
                        <p className="text-gray-500 text-sm font-medium">{mou.phase}</p>
                      </div>
                      
                      {mou.link && mou.link !== '#' ? (
                        <div className="flex flex-col gap-3">
                          <a 
                            href={mou.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-white/5 hover:bg-blue-600 text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all border border-white/10 hover:border-blue-600"
                          >
                            <ExternalLink size={18} /> View Official Document
                          </a>
                          <a 
                             href={mou.link}
                             download
                             className="text-gray-500 hover:text-white text-xs font-bold text-center py-2 transition-colors flex items-center justify-center gap-2"
                          >
                            <Download size={14} /> Download for Records
                          </a>
                        </div>
                      ) : (
                        <div className="bg-white/5 py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-gray-600 cursor-not-allowed border border-white/5">
                          <FileDown size={18} /> Verification Pending
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-8 bg-blue-600/5 border border-blue-500/10 rounded-3xl">
                <div className="flex items-center gap-3 mb-3 text-blue-400">
                   <User size={16} /> 
                   <span className="text-xs font-bold uppercase tracking-widest">Compliance Status</span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed italic">
                  All MOUs on this page are verified by the institutional legal and compliance board.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
