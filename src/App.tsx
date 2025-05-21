import React from 'react';
import { MarketingFlow } from './components/MarketingFlow';

function App() {
  return (
    <div className="w-full h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">RSOC Flow</h1>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <MarketingFlow />
        </div>
      </div>
    </div>
  );
}

export default App; 