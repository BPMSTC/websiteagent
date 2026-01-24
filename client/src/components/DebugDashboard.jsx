import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:3001/api';

export default function DebugDashboard({ onClose }) {
  const [data, setData] = useState(null);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [timeRange, setTimeRange] = useState('all'); // 'all', '5min', '1hour', '24hours'
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'api_call', 'image_gen', 'error', etc.

  const fetchData = async () => {
    try {
      const [debugRes, configRes] = await Promise.all([
        fetch(`${API_BASE}/debug`),
        fetch(`${API_BASE}/debug/config`)
      ]);
      const debugData = await debugRes.json();
      const configData = await configRes.json();
      setData(debugData);
      setConfig(configData);
    } catch (error) {
      console.error('Failed to fetch debug data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    if (autoRefresh) {
      const interval = setInterval(fetchData, 3000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const clearLog = async () => {
    if (confirm('Clear all log history? This cannot be undone.')) {
      await fetch(`${API_BASE}/debug/clear`, { method: 'POST' });
      fetchData();
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      api_call: 'bg-blue-100 text-blue-800',
      image_gen: 'bg-purple-100 text-purple-800',
      image_upload: 'bg-green-100 text-green-800',
      verification: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      info: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || colors.info;
  };

  const getTypeEmoji = (type) => {
    const emojis = {
      api_call: '🤖',
      image_gen: '🎨',
      image_upload: '☁️',
      verification: '✅',
      error: '❌',
      info: 'ℹ️'
    };
    return emojis[type] || '📝';
  };

  // Filter activity by time range and type
  const getFilteredActivity = () => {
    if (!data?.activity) return [];
    
    let filtered = [...data.activity];
    
    // Time filter
    if (timeRange !== 'all') {
      const now = Date.now();
      const ranges = {
        '5min': 5 * 60 * 1000,
        '1hour': 60 * 60 * 1000,
        '24hours': 24 * 60 * 60 * 1000
      };
      const cutoff = now - ranges[timeRange];
      filtered = filtered.filter(e => new Date(e.timestamp).getTime() > cutoff);
    }
    
    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(e => e.type === typeFilter);
    }
    
    return filtered;
  };

  const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading debug data...</p>
        </div>
      </div>
    );
  }

  const filteredActivity = getFilteredActivity();
  const stats = data?.stats;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              🔧 Debug Dashboard
            </h2>
            <p className="text-slate-300 text-sm">Persistent log history • {data?.stats?.totalEntries || 0} total entries</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              Auto-refresh
            </label>
            <button
              onClick={fetchData}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm"
            >
              Refresh
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm"
            >
              Close
            </button>
          </div>
        </div>

        {/* Config Status */}
        <div className="px-6 py-3 bg-slate-100 border-b">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Environment Configuration</h3>
          <div className="flex flex-wrap gap-3 text-sm">
            {config && Object.entries(config).map(([key, value]) => (
              <span key={key} className={`px-2 py-1 rounded ${value.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {key}: {value}
              </span>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
            <div className="grid grid-cols-3 gap-4">
              {/* Last 5 Minutes */}
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Last 5 Minutes</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>🤖 API: <strong>{stats.last5Minutes?.apiCalls || 0}</strong></div>
                  <div>🎨 Images: <strong>{stats.last5Minutes?.imageGenerations || 0}</strong></div>
                  <div>☁️ Uploads: <strong>{stats.last5Minutes?.imageUploads || 0}</strong></div>
                  <div className={stats.last5Minutes?.errors > 0 ? 'text-red-600' : ''}>
                    ❌ Errors: <strong>{stats.last5Minutes?.errors || 0}</strong>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t text-sm">
                  📊 Tokens: <strong>{(stats.tokensUsed?.last5Min || 0).toLocaleString()}</strong>
                </div>
              </div>

              {/* Last Hour */}
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Last Hour</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>🤖 API: <strong>{stats.lastHour?.apiCalls || 0}</strong></div>
                  <div>🎨 Images: <strong>{stats.lastHour?.imageGenerations || 0}</strong></div>
                  <div>☁️ Uploads: <strong>{stats.lastHour?.imageUploads || 0}</strong></div>
                  <div className={stats.lastHour?.errors > 0 ? 'text-red-600' : ''}>
                    ❌ Errors: <strong>{stats.lastHour?.errors || 0}</strong>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t text-sm">
                  📊 Tokens: <strong>{(stats.tokensUsed?.lastHour || 0).toLocaleString()}</strong>
                </div>
              </div>

              {/* Last 24 Hours */}
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Last 24 Hours</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>🤖 API: <strong>{stats.last24Hours?.apiCalls || 0}</strong></div>
                  <div>🎨 Images: <strong>{stats.last24Hours?.imageGenerations || 0}</strong></div>
                  <div>☁️ Uploads: <strong>{stats.last24Hours?.imageUploads || 0}</strong></div>
                  <div className={stats.last24Hours?.errors > 0 ? 'text-red-600' : ''}>
                    ❌ Errors: <strong>{stats.last24Hours?.errors || 0}</strong>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t text-sm">
                  📊 Tokens: <strong>{(stats.tokensUsed?.last24Hours || 0).toLocaleString()}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="px-6 py-3 bg-gray-50 border-b flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Time:</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-sm border rounded-lg px-2 py-1"
            >
              <option value="all">All Time</option>
              <option value="5min">Last 5 Minutes</option>
              <option value="1hour">Last Hour</option>
              <option value="24hours">Last 24 Hours</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Type:</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-sm border rounded-lg px-2 py-1"
            >
              <option value="all">All Types</option>
              <option value="api_call">🤖 API Calls</option>
              <option value="image_gen">🎨 Image Generation</option>
              <option value="image_upload">☁️ Image Upload</option>
              <option value="verification">✅ Verification</option>
              <option value="error">❌ Errors</option>
              <option value="info">ℹ️ Info</option>
            </select>
          </div>

          <div className="flex-1"></div>
          
          <span className="text-sm text-gray-500">
            Showing {filteredActivity.length} of {data?.activity?.length || 0} entries
          </span>
          
          <button
            onClick={clearLog}
            className="text-xs px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg"
          >
            Clear All History
          </button>
        </div>

        {/* Activity Log */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {filteredActivity.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {data?.activity?.length === 0 
                ? 'No activity recorded yet. Try generating a page!'
                : 'No entries match the current filters.'}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredActivity.map((entry) => (
                <div
                  key={entry.id}
                  className={`p-3 rounded-lg border ${entry.type === 'error' ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'} hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getTypeEmoji(entry.type)}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(entry.type)}`}>
                        {entry.type}
                      </span>
                      <span className="font-medium text-gray-800">{entry.action}</span>
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-2">
                      {entry.duration && (
                        <span className="px-1.5 py-0.5 bg-gray-100 rounded">
                          {entry.duration}ms
                        </span>
                      )}
                      <span title={new Date(entry.timestamp).toLocaleString()}>
                        {formatTimeAgo(entry.timestamp)}
                      </span>
                    </div>
                  </div>
                  
                  {entry.details && Object.keys(entry.details).length > 0 && (
                    <details className="mt-2">
                      <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                        Show details
                      </summary>
                      <div className="mt-1 text-xs bg-gray-50 rounded p-2 font-mono overflow-x-auto">
                        <pre className="whitespace-pre-wrap break-all">
                          {JSON.stringify(entry.details, null, 2)}
                        </pre>
                      </div>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
