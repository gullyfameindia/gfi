'use client';

import { useState, useEffect } from 'react';
import { Info, Save } from 'lucide-react';
import { getAboutUs, updateAboutUs } from '@/lib/cmsApi';

export default function AboutUs() {
  const [aboutContent, setAboutContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await getAboutUs();
      setLoading(false);
      
      if (response.success && response.data) {
        
        const content = typeof response.data === 'string' 
          ? response.data 
          : (response.data.aboutUs || response.data.content || '');
        setAboutContent(content);
      }
    };
    
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!aboutContent.trim()) return;
    
    setLoading(true);
    const response = await updateAboutUs(aboutContent);
    setLoading(false);
    
    if (response.success) {
      alert('About Us updated successfully!');
    } else {
      alert(`Failed to update: ${response.message}`);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Info className="h-5 w-5 text-primary-600" />
        <h2 className="text-lg font-semibold text-gray-900">About Us</h2>
      </div>
      <textarea
        rows={20}
        className="w-full rounded-lg border border-gray-300 p-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
        value={aboutContent}
        onChange={(e) => setAboutContent(e.target.value)}
        placeholder="Gully Fame is a talent competition platform..."
        disabled={loading}
      />
      <div className="flex justify-end">
        <button 
          className={`flex items-center space-x-2 rounded-lg px-6 py-3 transition-colors font-medium ${
            aboutContent.trim() && !loading
              ? 'bg-primary-600 text-white hover:bg-primary-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!aboutContent.trim() || loading}
          onClick={handleSave}
        >
          <Save className="h-4 w-4" />
          <span>Update About</span>
        </button>
      </div>
    </div>
  );
}

