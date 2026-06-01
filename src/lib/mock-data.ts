export interface LogEntry {
  id: string;
  timestamp: string;
  source: string;
  message: string;
  type: 'info' | 'security' | 'warning' | 'critical';
}

export const INITIAL_LOGS: LogEntry[] = [
  { id: '1', timestamp: '2024-01-01T12:00:00.000Z', source: 'BOOTSTRAP', message: 'Initializing THE_ALCHEMIST_FORTRESS v1.0', type: 'info' },
  { id: '2', timestamp: '2024-01-01T12:00:01.000Z', source: 'AUTH', message: 'Identity Confirmed: admin-fortress@vice44-121e4.iam.gserviceaccount.com', type: 'info' },
  { id: '3', timestamp: '2024-01-01T12:00:02.000Z', source: 'VFS', message: 'Signal Clear. Neural Map connectivity established.', type: 'info' },
  { id: '4', timestamp: '2024-01-01T12:00:03.000Z', source: 'FIREWALL', message: 'Unauthorized handshake attempt blocked from 192.168.1.45', type: 'security' },
  { id: '5', timestamp: '2024-01-01T12:00:04.000Z', source: 'AICA_SYSTEM', message: 'Inbound Handshake: AICA-2025.Assessment verified.', type: 'info' },
];

export const VAULTS = [
  { id: 'arithmagen', name: 'ArithmaGen', status: 'secure', level: 0.85, color: '#00E5FF' },
  { id: 'md65', name: 'MD65', status: 'locked', level: 1.0, color: '#FF1744' },
  { id: 'ai-home', name: 'AI Home', status: 'active', level: 0.42, color: '#00E5FF' },
  { id: 'aica-assessment', name: 'AICA-2025', status: 'assessing', level: 0.98, color: '#00E5FF' },
  { id: 'neural-map', name: 'Neural Map', status: 'syncing', level: 0.68, color: '#00E5FF' },
];
