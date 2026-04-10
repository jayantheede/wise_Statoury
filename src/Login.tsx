import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCMS } from './CMSContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const Login: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const { login } = useCMS();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      navigate('/admin');
    } else {
      setError(true);
    }
  };

  return (
    <div className="admin-wrapper flex items-center justify-center">
      <button 
        onClick={() => navigate('/')} 
        className="action-btn bg-white shadow-sm border border-gray-200 hover:text-blue-600 px-4 py-2" 
        style={{ position: 'absolute', top: '2rem', left: '2rem' }}
      >
        <ArrowLeft size={18} className="mr-2" /> Back to Portal
      </button>

      <div className="admin-card" style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem' }}>
        <div className="flex flex-col items-center mb-8 text-center">
          <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
            <ShieldAlert size={40} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Access</h2>
          <p className="text-sm text-gray-500">Enter the administrator password to manage portal content.</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <input 
              type="password" 
              className="input-field" 
              placeholder="Password (admin123)"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              autoFocus
            />
          </div>
          {error && (
            <p className="text-sm text-red-500 font-medium">Incorrect password.</p>
          )}
          <button type="submit" className="btn btn-primary justify-center mt-2 w-full">
            Secure Login
          </button>
        </form>
      </div>
    </div>
  );
};
