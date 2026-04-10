import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, LayoutDashboard, Globe } from 'lucide-react';

export const UploadSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="success-page">
      <div className="success-card shadow-2xl">
        <div className="success-icon">
          <CheckCircle size={80} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mt-6">Upload Successful!</h1>
        <p className="text-gray-500 mt-4 text-center max-w-md">
          Your document has been successfully processed and added to the portal. 
          The public view has been updated with the new link.
        </p>
        
        <div className="success-actions mt-10">
          <button 
            onClick={() => navigate('/admin')} 
            className="btn btn-primary w-full flex items-center justify-center gap-2"
          >
            <LayoutDashboard size={18} /> Back to Dashboard
          </button>
          
          <div className="grid grid-cols-2 gap-4 mt-4 w-full">
            <button 
              onClick={() => navigate('/')} 
              className="btn btn-outline flex items-center justify-center gap-2"
            >
              <Globe size={18} /> View Portal
            </button>
            <button 
              onClick={() => window.history.back()} 
              className="btn btn-secondary flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} /> Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
