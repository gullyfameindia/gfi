'use client';

import { useState, useEffect } from 'react';
import { Shield, Save } from 'lucide-react';
import { getTermsAndConditions, updateTermsAndConditions } from '@/lib/cmsApi';

export default function TermsConditions() {
  const [termsContent, setTermsContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await getTermsAndConditions();
      setLoading(false);
      
      if (response.success && response.data) {
        
        const content = typeof response.data === 'string' 
          ? response.data 
          : (response.data.termsAndConditions || response.data.content || '');
        setTermsContent(content);
      }
    };
    
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!termsContent.trim()) return;
    
    setLoading(true);
    const response = await updateTermsAndConditions(termsContent);
    setLoading(false);
    
    if (response.success) {
      alert('Terms & Conditions updated successfully!');
    } else {
      alert(`Failed to update: ${response.message}`);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Shield className="h-5 w-5 text-primary-600" />
        <h2 className="text-lg font-semibold text-gray-900">Terms & Conditions</h2>
      </div>
      <textarea
        rows={20}
        className="w-full rounded-lg border border-gray-300 p-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
        value={termsContent}
        onChange={(e) => setTermsContent(e.target.value)}
        placeholder="By using Gully Fame, you agree to the following terms..."
        disabled={loading}
      />
      <div className="flex justify-end">
        <button 
          className={`flex items-center space-x-2 rounded-lg px-6 py-3 transition-colors font-medium ${
            termsContent.trim() && !loading
              ? 'bg-primary-600 text-white hover:bg-primary-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!termsContent.trim() || loading}
          onClick={handleSave}
        >
          <Save className="h-4 w-4" />
          <span>Update Terms</span>
        </button>
      </div>
    </div>
  );
}

