export default function MessageBubble({ role, content }) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mr-2 flex-shrink-0 shadow">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      )}
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm ${
          isUser
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-md'
            : 'bg-white border border-gray-100 text-gray-800 rounded-bl-md'
        }`}
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
      </div>
      {isUser && (
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center ml-2 flex-shrink-0">
          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )}
    </div>
  );
}
