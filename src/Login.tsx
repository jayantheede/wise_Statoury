import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCMS } from './CMSContext';
import { ShieldAlert, ArrowLeft, KeyRound, Smartphone } from 'lucide-react';

export const Login: React.FC = () => {
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'password' | 'otp'>('password');
  const [error, setError] = useState(false);
  const { login } = useCMS();
  const navigate = useNavigate();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate initial credential check
    if (password === 'Admin@Wise#1') {
      setStep('otp');
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '123456') { // Standard simulation OTP
      if (login(password)) {
        navigate('/admin');
      }
    } else {
      setError(true);
    }
  };

  return (
    <div className="admin-wrapper flex items-center justify-center">
      <button 
        onClick={() => step === 'otp' ? setStep('password') : navigate('/')} 
        className="action-btn bg-white shadow-sm border border-gray-200 hover:text-blue-600 px-4 py-2" 
        style={{ position: 'absolute', top: '2rem', left: '2rem' }}
      >
        <ArrowLeft size={18} className="mr-2" /> {step === 'otp' ? 'Back to Password' : 'Back to Portal'}
      </button>

      <div className="admin-card" style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem' }}>
        <div className="flex flex-col items-center mb-8 text-center">
          <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
            {step === 'password' ? (
              <ShieldAlert size={40} className="text-blue-600" />
            ) : (
              <Smartphone size={40} className="text-blue-600" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {step === 'password' ? 'Admin Access' : 'OTP Verification'}
          </h2>
          <p className="text-sm text-gray-500">
            {step === 'password' 
              ? 'Enter the administrator password to manage portal content.' 
              : 'A 6-digit code has been sent to your registered device.'}
          </p>
        </div>

        {step === 'password' ? (
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="password" 
                className="input-field" 
                placeholder="Password"
                style={{ paddingLeft: '2.75rem' }}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                autoFocus
              />
            </div>
            {error && (
              <p className="text-sm text-red-500 font-medium italic">Incorrect password. Please try again.</p>
            )}
            <button type="submit" className="btn btn-primary justify-center mt-2 w-full">
              Continue
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <Smartphone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                maxLength={6}
                className="input-field" 
                placeholder="Enter 6-digit OTP"
                style={{ paddingLeft: '2.75rem', letterSpacing: '0.25em', textAlign: 'center', fontWeight: 'bold' }}
                value={otp}
                onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setError(false); }}
                autoFocus
              />
            </div>
            {error && (
              <p className="text-sm text-red-500 font-medium italic">Invalid OTP code. Please check and try again.</p>
            )}
            <p className="text-xs text-center text-gray-400 mt-1">
              Test OTP: <span className="font-mono font-bold">123456</span>
            </p>
            <button type="submit" className="btn btn-primary justify-center mt-2 w-full">
              Verify & Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
