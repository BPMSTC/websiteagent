import { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';

export default function ChatInterface({ conversation, loading, error, onSendMessage }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    onSendMessage(input.trim());
    setInput('');
  };

  const suggestions = [
    { text: 'Add more examples', icon: '📝' },
    { text: 'Make this simpler', icon: '✨' },
    { text: 'Add code samples', icon: '💻' },
    { text: 'More visuals', icon: '🎨' },
    { text: 'Explain differently', icon: '🔄' }
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="px-5 py-4 border-b bg-white">
        <h2 className="font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          AI Assistant
        </h2>
        <p className="text-sm text-gray-500">Chat to refine your page</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {conversation.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <p className="text-gray-500">Generating your page...</p>
            <p className="text-gray-400 text-sm mt-1">This may take a moment</p>
          </div>
        )}

        {conversation.map((msg, index) => (
          <MessageBubble key={index} role={msg.role} content={msg.content} />
        ))}

        {loading && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
              <span className="text-indigo-700 font-medium">Generating your page...</span>
            </div>
            <p className="text-sm text-indigo-500">
              {conversation.length === 0 
                ? "This may take 15-30 seconds if images are being generated" 
                : "Updating your page..."}
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium">Generation Failed</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {conversation.length > 0 && !loading && (
        <div className="px-5 pb-3">
          <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Quick actions</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map(({ text, icon }) => (
              <button
                key={text}
                onClick={() => {
                  setInput(text);
                  inputRef.current?.focus();
                }}
                className="text-sm px-3 py-1.5 bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 rounded-full text-gray-600 hover:text-indigo-600 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>{icon}</span>
                {text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for changes..."
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 transition-all shadow-lg hover:shadow-xl disabled:shadow-none font-medium"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
