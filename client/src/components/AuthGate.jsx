import { useState } from 'react';
import { api } from '../utils/api';

export default function AuthGate({ onAuthenticated }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.verifyPassword(password);
      onAuthenticated();
    } catch {
      setError('Invalid password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-[50%] min-w-[400px]">
        {/* Hero Section */}
        <div className="text-center mb-8">
          {/* Animated Icon Grid */}
          <div className="flex justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg transform -rotate-6">
              <span className="text-2xl">📚</span>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg transform rotate-6">
              <span className="text-2xl">✨</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-3">
            Instructional Page Builder
          </h1>
          <p className="text-indigo-300 text-lg mb-2">
            AI-Powered Content Creation for Educators
          </p>
          <p className="text-indigo-400/70 text-sm max-w-md mx-auto">
            Transform your teaching topics into beautiful, accessible HTML pages ready for Blackboard and Canvas in minutes.
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <span className="px-3 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-medium border border-indigo-500/30">
            🎯 5 Depth Levels
          </span>
          <span className="px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium border border-purple-500/30">
            💬 Conversational Editing
          </span>
          <span className="px-3 py-1.5 bg-pink-500/20 text-pink-300 rounded-full text-xs font-medium border border-pink-500/30">
            🖼️ AI Image Generation
          </span>
          <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-medium border border-emerald-500/30">
            ♿ Accessibility Ready
          </span>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Faculty Access</h2>
            <p className="text-gray-500 text-sm mt-1">Enter your password to get started</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2 text-sm">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
                placeholder="Enter your faculty password"
                disabled={loading}
                autoFocus
              />
              {error && (
                <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 transition-all shadow-lg hover:shadow-xl disabled:shadow-none transform hover:-translate-y-0.5 disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Verifying...
                </span>
              ) : 'Get Started →'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-indigo-400/50 text-xs mt-6">
          Powered by Claude AI • Built for educators
        </p>
      </div>
    </div>
  );
}
