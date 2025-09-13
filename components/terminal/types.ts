// Terminal System Type Definitions

export interface Command {
  name: string;
  aliases: string[];
  description: string;
  usage?: string;
  hidden: boolean;
  requiresAuth: boolean;
  adminOnly: boolean;
  cooldown?: number;
  handler: (args: string[], context: TerminalContext) => Promise<CommandResult> | CommandResult;
}

export interface CommandResult {
  output: string;
  type: 'success' | 'error' | 'info' | 'warning' | 'clear';
  clearScreen?: boolean;
  playSound?: string;
  triggerEffect?: string;
  updateGameState?: Partial<GameState>;
  achievements?: Achievement[];
  experienceGained?: number;
}

export interface TerminalContext {
  user: User;
  session: Session;
  behaviorTracker: BehaviorTracker;
  gameState: GameState;
  currentDirectory: string;
  fileSystem: FileSystem;
  gameManager?: any; // GameStateManager instance
}

export interface User {
  username: string;
  password: string;
  role: string;
  permissions: string[];
  createdAt: Date;
  lastLogin: Date | null;
  isLocked: boolean;
  accessLevel?: AccessLevel;
  unlockedFeatures?: string[];
  ctfProgress?: CTFProgress;
  loginTime?: Date;
}

export type AccessLevel = 'guest' | 'user' | 'admin' | 'root';

export interface Session {
  id: string;
  userId: string;
  username?: string;
  permissions: string[];
  startTime: Date;
  lastActivity: Date;
  isActive: boolean;
  commandHistory?: HistoryEntry[];
  currentStreak?: number;
  totalCommands?: number;
}

export interface AuthResult {
  success: boolean;
  message: string;
  user: User | null;
  session: Session | null;
}

export interface HistoryEntry {
  type: 'input' | 'output';
  content: string;
  timestamp: Date;
  command?: string;
}

export interface BehaviorTracker {
  commandCounts: Map<string, number>;
  patterns: UserPattern[];
  lastCommandTime: Date;
  consecutiveHelps: number;
  discoveredSecrets: string[];
}

export interface UserPattern {
  pattern: string;
  count: number;
  lastTriggered: Date;
}

export interface GameState {
  level: number;
  experience: number;
  score: number;
  unlockedChallenges?: string[];
  completedChallenges?: string[];
  solvedChallenges: string[];
  unlockedCommands: string[];
  currentChallenge?: string;
  flags?: string[];
  achievements: Achievement[];
  stats: {
    commandsExecuted: number;
    challengesSolved: number;
    easterEgsFound: number;
    loginAttempts: number;
    timeSpent: number;
  };
  startTime: Date;
  lastActivity: Date;
  currentStreak: number;
  bestStreak: number;
  hints: {
    used: number;
    available: number;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  points?: number;
}

export interface CTFProgress {
  totalFlags: number;
  foundFlags: string[];
  currentLevel: number;
  hintsUsed: number;
  timeSpent: number;
}

export interface FileSystem {
  [path: string]: string[] | string;
}

export interface EasterEgg {
  trigger: string;
  response: string;
  condition?: (context: TerminalContext) => boolean;
  effect?: string;
  sound?: string;
  oneTime?: boolean;
}

export interface CTFChallenge {
  id: string;
  name?: string;
  title?: string;
  description: string;
  content?: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  prerequisites?: string[];
  hints?: string[];
  hint?: string;
  solution?: string;
  flag: string;
  reward: string;
  rewards?: {
    commands?: string[];
    message?: string;
  };
  points?: number;
  unlocks?: string[];
  category?: 'crypto' | 'web' | 'forensics' | 'reverse' | 'pwn' | 'misc';
}

export interface TerminalConfig {
  commands: Command[];
  easterEggs: EasterEgg[];
  ctfChallenges: CTFChallenge[];
  fileSystem: FileSystem;
  themes: Theme[];
  soundEffects: SoundEffect[];
}

export interface Theme {
  name: string;
  colors: {
    background: string;
    text: string;
    prompt: string;
    success: string;
    error: string;
    warning: string;
  };
  font: string;
  effects: string[];
}

export interface SoundEffect {
  name: string;
  url: string;
  volume: number;
}

export interface VisualEffect {
  name: string;
  trigger: string;
  animation: string;
  duration: number;
  sound?: string;
}

// API Response Types
export interface IPResponse {
  ip: string;
  country?: string;
  region?: string;
  city?: string;
  isp?: string;
}

export interface GeolocationResponse {
  latitude: number;
  longitude: number;
  accuracy: number;
}

// Command Handler Function Type
export type CommandHandler = (args: string[], context: TerminalContext) => Promise<CommandResult> | CommandResult;

// Event Types
export interface TerminalEvent {
  type: 'command_executed' | 'easter_egg_triggered' | 'challenge_completed' | 'level_up';
  data: any;
  timestamp: Date;
}

// Configuration Types
export interface TerminalSettings {
  soundEnabled: boolean;
  effectsEnabled: boolean;
  theme: string;
  fontSize: number;
  autoComplete: boolean;
  showHints: boolean;
}