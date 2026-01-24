export default function PreviewPane({ html }) {
  if (!html) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
            <svg
              className="h-10 w-10 text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-indigo-300 font-medium">Preview</p>
          <p className="text-slate-500 text-sm mt-1">Your page will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white rounded-2xl overflow-hidden">
      <iframe
        srcDoc={html}
        title="Preview"
        className="w-full h-full"
        sandbox="allow-scripts"
      />
    </div>
  );
}
