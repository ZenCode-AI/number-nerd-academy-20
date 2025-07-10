import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTest } from '@/contexts/TestContext';
import { Clock } from 'lucide-react';

const TestHeader = () => {
  const navigate = useNavigate();
  const { testData, timeRemaining, submitTest } = useTest();

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeRemaining <= 300) return 'text-red-600'; // Last 5 minutes
    if (timeRemaining <= 600) return 'text-yellow-600'; // Last 10 minutes
    return 'text-green-600';
  };

  const handleSubmitTest = () => {
    if (window.confirm('Are you sure you want to submit your test? This action cannot be undone.')) {
      submitTest();
      navigate(`/student/test/${testData?.id}/results`);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 relative z-20">
      <div className="flex items-center justify-between">
        {/* Test Info */}
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900">{testData?.name}</h1>
          <div className="text-sm text-gray-500">
            {testData?.subject} • {testData?.difficulty}
          </div>
        </div>

        {/* Timer and Submit */}
        <div className="flex items-center gap-6">
          {/* Timer */}
          <div className={`flex items-center gap-2 font-mono text-xl font-bold px-4 py-2 bg-gray-50 rounded-lg ${getTimeColor()}`}>
            <Clock className="h-5 w-5" />
            {formatTime(timeRemaining)}
          </div>
          <Button onClick={handleSubmitTest} className="bg-green-600 hover:bg-green-700 px-6 py-2">
            Submit Test
          </Button>
        </div>
      </div>
    </header>
  );
};

export default TestHeader;
