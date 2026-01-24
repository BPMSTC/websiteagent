const styleOptions = [
  {
    id: 'accessible',
    name: 'Accessible',
    description: 'Screen-reader friendly',
    icon: '♿',
    color: 'from-blue-400 to-blue-600',
    selectedBg: 'bg-blue-50',
    ring: 'ring-blue-300'
  },
  {
    id: 'visual',
    name: 'Visual',
    description: 'More diagrams & images',
    icon: '🎨',
    color: 'from-pink-400 to-pink-600',
    selectedBg: 'bg-pink-50',
    ring: 'ring-pink-300'
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'More code examples',
    icon: '💻',
    color: 'from-emerald-400 to-emerald-600',
    selectedBg: 'bg-emerald-50',
    ring: 'ring-emerald-300'
  },
  {
    id: 'conversational',
    name: 'Casual',
    description: 'Friendly tone',
    icon: '💬',
    color: 'from-amber-400 to-amber-600',
    selectedBg: 'bg-amber-50',
    ring: 'ring-amber-300'
  },
  {
    id: 'humor',
    name: 'Fun',
    description: 'Light-hearted',
    icon: '😄',
    color: 'from-purple-400 to-purple-600',
    selectedBg: 'bg-purple-50',
    ring: 'ring-purple-300'
  }
];

export default function StyleFlags({ selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-3">
      {styleOptions.map(({ id, name, description, icon, color, selectedBg, ring }) => {
        const isSelected = selected.includes(id);
        return (
          <button
            key={id}
            type="button"
            onClick={() => onToggle(id)}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all duration-200 ${
              isSelected
                ? `border-transparent ${selectedBg} shadow-lg ring-4 ${ring} ring-opacity-50`
                : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
            }`}
          >
            <span className={`w-8 h-8 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center text-sm shadow-sm`}>
              {icon}
            </span>
            <div className="text-left">
              <span className="font-semibold text-gray-900 text-sm">{name}</span>
              <span className="text-gray-400 text-xs block leading-tight">{description}</span>
            </div>
            {isSelected && (
              <div className={`absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-br ${color} rounded-full flex items-center justify-center shadow-md`}>
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
