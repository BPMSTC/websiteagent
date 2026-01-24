const depthLevels = [
  {
    level: 0,
    name: 'Minimalist',
    description: 'Quick reference',
    icon: '⚡',
    color: 'from-emerald-400 to-teal-500',
    selectedBg: 'bg-emerald-50',
    selectedBorder: 'border-emerald-500'
  },
  {
    level: 1,
    name: 'Intro',
    description: 'First exposure',
    icon: '🌱',
    color: 'from-blue-400 to-cyan-500',
    selectedBg: 'bg-blue-50',
    selectedBorder: 'border-blue-500'
  },
  {
    level: 2,
    name: 'Intermediate',
    description: 'How & why',
    icon: '📖',
    color: 'from-indigo-400 to-purple-500',
    selectedBg: 'bg-indigo-50',
    selectedBorder: 'border-indigo-500'
  },
  {
    level: 3,
    name: 'Advanced',
    description: 'Best practices',
    icon: '🚀',
    color: 'from-orange-400 to-pink-500',
    selectedBg: 'bg-orange-50',
    selectedBorder: 'border-orange-500'
  },
  {
    level: 4,
    name: 'Graduate',
    description: 'Deep theory',
    icon: '🎓',
    color: 'from-rose-400 to-red-500',
    selectedBg: 'bg-rose-50',
    selectedBorder: 'border-rose-500'
  }
];

export default function DepthSelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {depthLevels.map(({ level, name, description, icon, color, selectedBg, selectedBorder }) => (
        <button
          key={level}
          type="button"
          onClick={() => onChange(level)}
          className={`relative flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 ${
            value === level
              ? `${selectedBorder} ${selectedBg} shadow-lg ring-4 ring-opacity-30 ${selectedBorder.replace('border', 'ring')}`
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 bg-white'
          }`}
        >
          {value === level && (
            <div className={`absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br ${color} rounded-full flex items-center justify-center shadow-md`}>
              <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          <span className="text-xl mb-1">{icon}</span>
          <span className={`inline-flex items-center justify-center w-5 h-5 bg-gradient-to-br ${color} rounded-full text-xs font-bold text-white`}>
            {level}
          </span>
          <span className="font-semibold text-gray-900 text-xs text-center mt-1">{name}</span>
          <span className="text-gray-400 text-[10px] text-center leading-tight">{description}</span>
        </button>
      ))}
    </div>
  );
}
