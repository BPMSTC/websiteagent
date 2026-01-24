import { useState } from 'react';
import DepthSelector from './DepthSelector';
import StyleFlags from './StyleFlags';
import ImageInputSection from './ImageInputSection';
import DebugDashboard from './DebugDashboard';
import Tooltip from './Tooltip';

export default function ConfigPanel({ onStart }) {
  const [topic, setTopic] = useState('');
  const [depthLevel, setDepthLevel] = useState(2);
  const [styleFlags, setStyleFlags] = useState([]);
  const [images, setImages] = useState([]);
  const [showDebug, setShowDebug] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    onStart({
      topic: topic.trim(),
      depthLevel,
      styleFlags,
      images
    });
  };

  const handleStyleFlagToggle = (flag) => {
    setStyleFlags(prev => 
      prev.includes(flag)
        ? prev.filter(f => f !== flag)
        : [...prev, flag]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-8 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header - Compact */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl mb-3 shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Create Your Page
          </h1>
          <p className="text-indigo-300 text-base">
            Configure your content, then let AI do the magic ✨
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-6">
          {/* Topic Input */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100">
            <Tooltip text="Enter the subject you want to teach. Be specific for better results. Example: 'JavaScript async/await' rather than just 'JavaScript'.">
              <label className="block text-base font-semibold text-gray-800">
                📚 What topic do you want to teach?
              </label>
            </Tooltip>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full mt-2 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-base bg-white transition-all"
              placeholder="e.g., JavaScript Promises, CSS Flexbox, Python Lists..."
              autoFocus
            />
          </div>

          {/* Depth Level */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100">
            <Tooltip text="Controls how detailed the content will be. Level 1 is a brief overview, Level 3 is comprehensive with examples, and Level 5 is an in-depth deep dive.">
              <label className="block text-base font-semibold text-gray-800">
                📊 Content Depth Level
              </label>
            </Tooltip>
            <div className="mt-3">
              <DepthSelector value={depthLevel} onChange={setDepthLevel} />
            </div>
          </div>

          {/* Style Flags */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100">
            <Tooltip text="Optional preferences for your page. Add code examples, include practice exercises, or request visual diagrams to enhance learning.">
              <label className="block text-base font-semibold text-gray-800">
                🎨 Style Preferences <span className="font-normal text-gray-500 text-sm">(optional)</span>
              </label>
            </Tooltip>
            <div className="mt-3">
              <StyleFlags selected={styleFlags} onToggle={handleStyleFlagToggle} />
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-5 border border-pink-100">
            <Tooltip text="Add images via URL or let AI generate them. Provide a description of how each image should be used in your content.">
              <label className="block text-base font-semibold text-gray-800">
                🖼️ Images <span className="font-normal text-gray-500 text-sm">(optional)</span>
              </label>
            </Tooltip>
            <div className="mt-3">
              <ImageInputSection images={images} onChange={setImages} />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!topic.trim()}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 transition-all shadow-lg hover:shadow-xl disabled:shadow-none transform hover:-translate-y-0.5 disabled:transform-none flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Generate Page
          </button>
        </form>

        {/* Debug Button */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setShowDebug(true)}
            className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1 mx-auto"
          >
            🔧 Debug Dashboard
          </button>
        </div>
      </div>

      {/* Debug Dashboard Modal */}
      {showDebug && <DebugDashboard onClose={() => setShowDebug(false)} />}
    </div>
  );
}
