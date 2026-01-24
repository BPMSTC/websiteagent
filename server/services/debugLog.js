/**
 * Debug logging service - tracks all API calls and actions
 * Persists to file for history across server restarts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log file configuration
const LOGS_DIR = path.join(__dirname, '..', 'logs');
const LOG_FILE = path.join(LOGS_DIR, 'debug-history.json');
const MAX_ENTRIES = 200; // Keep more entries for file-based storage

// In-memory cache (synced with file)
let activityLog = [];

// Ensure logs directory exists and load existing logs
function initialize() {
  try {
    if (!fs.existsSync(LOGS_DIR)) {
      fs.mkdirSync(LOGS_DIR, { recursive: true });
      console.log('📁 Created logs directory');
    }
    
    if (fs.existsSync(LOG_FILE)) {
      const data = fs.readFileSync(LOG_FILE, 'utf8');
      activityLog = JSON.parse(data);
      console.log(`📋 Loaded ${activityLog.length} log entries from history`);
    }
  } catch (error) {
    console.error('Failed to initialize debug log:', error.message);
    activityLog = [];
  }
}

// Save logs to file (debounced to avoid too many writes)
let saveTimeout = null;
function saveToFile() {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      fs.writeFileSync(LOG_FILE, JSON.stringify(activityLog, null, 2));
    } catch (error) {
      console.error('Failed to save debug log:', error.message);
    }
  }, 500); // Debounce 500ms
}

// Initialize on module load
initialize();

export const LogType = {
  API_CALL: 'api_call',
  IMAGE_GEN: 'image_gen',
  IMAGE_UPLOAD: 'image_upload',
  VERIFICATION: 'verification',
  ERROR: 'error',
  INFO: 'info'
};

export function log(type, action, details = {}) {
  const entry = {
    id: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString(),
    type,
    action,
    details,
    duration: null
  };

  activityLog.unshift(entry);
  
  // Keep only last N entries
  if (activityLog.length > MAX_ENTRIES) {
    activityLog.pop();
  }

  // Save to file
  saveToFile();

  // Also console log for terminal visibility
  const emoji = {
    [LogType.API_CALL]: '🤖',
    [LogType.IMAGE_GEN]: '🎨',
    [LogType.IMAGE_UPLOAD]: '☁️',
    [LogType.VERIFICATION]: '✅',
    [LogType.ERROR]: '❌',
    [LogType.INFO]: 'ℹ️'
  };

  console.log(`${emoji[type] || '📝'} [${type}] ${action}`, 
    Object.keys(details).length > 0 ? JSON.stringify(details, null, 2) : '');

  return entry.id;
}

export function updateLog(id, updates) {
  const entry = activityLog.find(e => e.id === id);
  if (entry) {
    Object.assign(entry, updates);
    saveToFile();
  }
}

export function logDuration(id, startTime) {
  const duration = Date.now() - startTime;
  updateLog(id, { duration });
  return duration;
}

export function getRecentActivity(limit = 50) {
  return activityLog.slice(0, limit);
}

export function getAllActivity() {
  return [...activityLog];
}

export function getStats() {
  const now = Date.now();
  const last5Min = activityLog.filter(e => 
    new Date(e.timestamp).getTime() > now - 5 * 60 * 1000
  );
  const lastHour = activityLog.filter(e => 
    new Date(e.timestamp).getTime() > now - 60 * 60 * 1000
  );
  const last24Hours = activityLog.filter(e => 
    new Date(e.timestamp).getTime() > now - 24 * 60 * 60 * 1000
  );

  return {
    totalEntries: activityLog.length,
    last5Minutes: {
      total: last5Min.length,
      apiCalls: last5Min.filter(e => e.type === LogType.API_CALL).length,
      imageGenerations: last5Min.filter(e => e.type === LogType.IMAGE_GEN).length,
      imageUploads: last5Min.filter(e => e.type === LogType.IMAGE_UPLOAD).length,
      errors: last5Min.filter(e => e.type === LogType.ERROR).length
    },
    lastHour: {
      total: lastHour.length,
      apiCalls: lastHour.filter(e => e.type === LogType.API_CALL).length,
      imageGenerations: lastHour.filter(e => e.type === LogType.IMAGE_GEN).length,
      imageUploads: lastHour.filter(e => e.type === LogType.IMAGE_UPLOAD).length,
      errors: lastHour.filter(e => e.type === LogType.ERROR).length
    },
    last24Hours: {
      total: last24Hours.length,
      apiCalls: last24Hours.filter(e => e.type === LogType.API_CALL).length,
      imageGenerations: last24Hours.filter(e => e.type === LogType.IMAGE_GEN).length,
      imageUploads: last24Hours.filter(e => e.type === LogType.IMAGE_UPLOAD).length,
      errors: last24Hours.filter(e => e.type === LogType.ERROR).length
    },
    tokensUsed: {
      last5Min: last5Min
        .filter(e => e.details?.tokens)
        .reduce((sum, e) => sum + ((e.details.tokens.input || 0) + (e.details.tokens.output || 0)), 0),
      lastHour: lastHour
        .filter(e => e.details?.tokens)
        .reduce((sum, e) => sum + ((e.details.tokens.input || 0) + (e.details.tokens.output || 0)), 0),
      last24Hours: last24Hours
        .filter(e => e.details?.tokens)
        .reduce((sum, e) => sum + ((e.details.tokens.input || 0) + (e.details.tokens.output || 0)), 0)
    }
  };
}

export function clearLog() {
  activityLog.length = 0;
  saveToFile();
}

export function getLogFilePath() {
  return LOG_FILE;
}
