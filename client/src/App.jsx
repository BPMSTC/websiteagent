import { useState } from 'react';
import AuthGate from './components/AuthGate';
import ConfigPanel from './components/ConfigPanel';
import ChatInterface from './components/ChatInterface';
import PreviewPane from './components/PreviewPane';
import ExportButtons from './components/ExportButtons';
import DebugDashboard from './components/DebugDashboard';
import { useChat } from './hooks/useChat';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [config, setConfig] = useState(null);
  const [showDebug, setShowDebug] = useState(false);
  const { conversation, currentHtml, loading, error, sendMessage, reset } = useChat();

  const handleStartSession = (sessionConfig) => {
    setConfig(sessionConfig);
    // Send initial generation request
    sendMessage(sessionConfig, null);
  };

  const handleNewPage = () => {
    reset();
    setConfig(null);
  };

  if (!authenticated) {
    return <AuthGate onAuthenticated={() => setAuthenticated(true)} />;
  }

  if (!config) {
    return <ConfigPanel onStart={handleStartSession} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Page Builder
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="font-medium text-gray-700">{config.topic}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                Level {config.depthLevel}
              </span>
              {config.styleFlags.length > 0 && (
                <>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="text-gray-400">{config.styleFlags.join(', ')}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={handleNewPage}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Page
        </button>
        <button
          onClick={() => setShowDebug(true)}
          className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm"
          title="Debug Dashboard"
        >
          🔧
        </button>
      </header>

      {/* Debug Dashboard Modal */}
      {showDebug && <DebugDashboard onClose={() => setShowDebug(false)} />}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat Panel */}
        <div className="w-[45%] bg-white overflow-hidden flex flex-col shadow-xl">
          <ChatInterface
            conversation={conversation}
            loading={loading}
            error={error}
            onSendMessage={(msg) => sendMessage(config, msg)}
          />
        </div>

        {/* Preview Panel */}
        <div className="flex-1 flex flex-col p-4 gap-2">
          <div className="flex-1 overflow-hidden rounded-2xl shadow-2xl">
            <PreviewPane html={currentHtml} />
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Export your page</span>
            <ExportButtons html={currentHtml} topic={config.topic} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
