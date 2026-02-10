import React from 'react';

const ComingSoonPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Coming Soon!</h1>
      <p className="text-xl text-gray-600 mb-8">This SaaS product is under development.</p>
      <p className="text-lg text-gray-500">Stay tuned for updates!</p>
    </div>
  );
};

export default ComingSoonPage;
