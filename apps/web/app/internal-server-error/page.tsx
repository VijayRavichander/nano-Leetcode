"use client"
import React from 'react';
import { ServerCrash, RefreshCw, Home, ArrowLeft } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Error Animation */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <ServerCrash className="w-24 h-24 text-red-500 animate-pulse" />
            <div className="absolute -top-2 -right-2">
              <div className="animate-spin">
                <RefreshCw className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Error Content */}
        <div className="text-center space-y-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
              500
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-100">
              Internal Server Error
            </h2>
          </div>
          
          <div className="space-y-4 text-gray-300">
            <p className="text-lg">
              Oops! Something went wrong on our servers.
            </p>
            <p className="text-sm max-w-md mx-auto">
              We're experiencing some technical difficulties. Our team has been notified and is working to resolve the issue.
            </p>
          </div>

          {/* Error Code */}
          <div className="bg-gray-800/50 rounded-lg py-2 px-4 inline-block mx-auto">
            <code className="text-red-400 text-sm font-mono">
              Error Code: 500_INTERNAL_SERVER_ERROR
            </code>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto justify-center"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Try Again</span>
          </button>
          
          <button 
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto justify-center"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Support Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            If the problem persists, please contact our support team
          </p>
          <a 
            href="mailto:support@example.com"
            className="text-red-400 hover:text-red-300 text-sm mt-1 inline-flex items-center gap-1 group"
          >
            support@example.com
            <ArrowLeft className="w-4 h-4 transform rotate-180 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;