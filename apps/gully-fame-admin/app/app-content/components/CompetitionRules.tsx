'use client';

import { useState, useEffect } from 'react';
import { FileText, Save } from 'lucide-react';
import { getCompetitionRules, updateCompetitionRules } from '@/lib/cmsApi';

export default function CompetitionRules() {
  const [rulesContent, setRulesContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await getCompetitionRules();
      setLoading(false);
      
      if (response.success && response.data) {
        
        const content = typeof response.data === 'string' 
          ? response.data 
          : (response.data.competitionRules || response.data.content || '');
        setRulesContent(content);
      }
    };
    
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!rulesContent.trim()) return;
    
    setLoading(true);
    const response = await updateCompetitionRules(rulesContent);
    setLoading(false);
    
    if (response.success) {
      alert('Competition rules updated successfully!');
    } else {
      alert(`Failed to update: ${response.message}`);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <FileText className="h-5 w-5 text-primary-600" />
        <h2 className="text-lg font-semibold text-gray-900">Competition Rules</h2>
      </div>
      <textarea
        rows={20}
        className="w-full rounded-lg border border-gray-300 p-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all font-mono resize-none"
        value={rulesContent}
        onChange={(e) => setRulesContent(e.target.value)}
        placeholder="1. All participants must be 18 years or older...
2. Content must be original and not violate any copyright...
3. Participants must follow community guidelines..."
        disabled={loading}
      />
      <div className="flex justify-end">
        <button 
          className={`flex items-center space-x-2 rounded-lg px-6 py-3 transition-colors font-medium ${
            rulesContent.trim() && !loading
              ? 'bg-primary-600 text-white hover:bg-primary-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!rulesContent.trim() || loading}
          onClick={handleSave}
        >
          <Save className="h-4 w-4" />
          <span>Update Rules</span>
        </button>
      </div>
    </div>
  );
}

