import { useState } from 'react';

export default function ImageInputSection({ images, onChange }) {
  const [showForm, setShowForm] = useState(false);
  const [inputType, setInputType] = useState('url'); // 'url' or 'generate'
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [placement, setPlacement] = useState('');

  const handleAdd = () => {
    if (inputType === 'url' && url.trim()) {
      onChange([...images, {
        type: 'url',
        url: url.trim(),
        placement: placement.trim() || 'Use where appropriate'
      }]);
      setUrl('');
      setPlacement('');
      setShowForm(false);
    } else if (inputType === 'generate' && description.trim()) {
      onChange([...images, {
        type: 'generate',
        description: description.trim(),
        placement: placement.trim() || 'Use where appropriate'
      }]);
      setDescription('');
      setPlacement('');
      setShowForm(false);
    }
  };

  const handleRemove = (index) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {/* Existing Images List */}
      {images.length > 0 && (
        <div className="space-y-2">
          {images.map((img, index) => (
            <div
              key={index}
              className="flex items-start gap-3 bg-white rounded-lg p-3 border border-gray-200 shadow-sm"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                img.type === 'url' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-purple-100 text-purple-600'
              }`}>
                {img.type === 'url' ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {img.type === 'url' ? img.url : `🎨 Generate: ${img.description}`}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">📍 {img.placement}</p>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Image Form */}
      {showForm ? (
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm space-y-3">
          {/* Type Toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setInputType('url')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                inputType === 'url'
                  ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Image URL
            </button>
            <button
              type="button"
              onClick={() => setInputType('generate')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                inputType === 'generate'
                  ? 'bg-purple-100 text-purple-700 ring-2 ring-purple-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI Generate
            </button>
          </div>

          {/* URL Input */}
          {inputType === 'url' && (
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          )}

          {/* Generate Description Input */}
          {inputType === 'generate' && (
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the image you want AI to create..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
            />
          )}

          {/* Placement Input */}
          <input
            type="text"
            value={placement}
            onChange={(e) => setPlacement(e.target.value)}
            placeholder="Where should this image go? (e.g., 'In the introduction', 'After code example')"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
          />

          {/* Actions */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={inputType === 'url' ? !url.trim() : !description.trim()}
              className="flex-1 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:from-indigo-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-300 transition-all"
            >
              Add Image
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setUrl('');
                setDescription('');
                setPlacement('');
              }}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-2 text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Image (URL or AI-generated)
        </button>
      )}

      {/* Help Text */}
      {images.length === 0 && !showForm && (
        <p className="text-xs text-gray-400 text-center">
          Optionally add images to include in your page
        </p>
      )}
    </div>
  );
}
