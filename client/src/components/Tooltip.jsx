import { useState } from 'react';

export default function Tooltip({ text, children }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-flex items-center">
      {children}
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="ml-2 w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 text-xs font-bold flex items-center justify-center transition-colors cursor-help"
        aria-label="More information"
      >
        ?
      </button>
      {show && (
        <div className="absolute z-50 left-full ml-2 top-1/2 -translate-y-1/2 w-64 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg">
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-gray-900" />
          {text}
        </div>
      )}
    </div>
  );
}
