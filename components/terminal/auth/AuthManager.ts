// Authentication and session management for the hacker terminal

import { User, Session, AuthResult } from '../types';

export class AuthManager {
  private users: Map<string, User> = new Map();
  private sessions: Map<string, Session> = new Map();
  private currentSession: Session | null = null;
  private loginAttempts: Map<string, number> = new Map();
  private readonly maxAttempts = 3;
  private readonly lockoutTime = 5 * 60 * 1000; // 5 minutes
  private readonly sessionKey = 'hacker_terminal_session';

  constructor() {
    this.initializeDefaultUsers();
    this.currentSession = this.loadSession();
    
    // Create default guest session if no session exists
    if (!this.currentSession) {
      this.createGuestSession();
    }
  }

  private loadSession(): Session | null {
    try {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem(this.sessionKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            ...parsed,
            startTime: new Date(parsed.startTime),
            lastActivity: new Date(parsed.lastActivity)
          };
        }
      }
    } catch (error) {
      console.warn('Failed to load session:', error);
    }
    return null;
  }

  private saveSession(): void {
    try {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined' && window.localStorage && this.currentSession) {
        localStorage.setItem(this.sessionKey, JSON.stringify(this.currentSession));
      }
    } catch (error) {
      console.warn('Failed to save session:', error);
    }
  }

  private clearSession(): void {
    try {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(this.sessionKey);
      }
    } catch (error) {
      console.warn('Failed to clear session:', error);
    }
  }

  private initializeDefaultUsers(): void {
    // Guest user (no password required)
    this.users.set('guest', {
      username: 'guest',
      password: '',
      role: 'user',
      permissions: ['basic'],
      createdAt: new Date(),
      lastLogin: null,
      isLocked: false
    });

    // Default users
    this.users.set('user', {
      username: 'user',
      password: 'password',
      role: 'user',
      permissions: ['basic'],
      createdAt: new Date(),
      lastLogin: null,
      isLocked: false
    });

    this.users.set('admin', {
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      permissions: ['basic', 'admin', 'ctf', 'hidden'],
      createdAt: new Date(),
      lastLogin: null,
      isLocked: false
    });

    this.users.set('root', {
      username: 'root',
      password: 'toor',
      role: 'root',
      permissions: ['basic', 'admin', 'ctf', 'hidden', 'root'],
      createdAt: new Date(),
      lastLogin: null,
      isLocked: false
    });

    // Hidden master user
    this.users.set('h4ck3r', {
      username: 'h4ck3r',
      password: 'hacktheplanet',
      role: 'master',
      permissions: ['basic', 'admin', 'ctf', 'hidden', 'root', 'master'],
      createdAt: new Date(),
      lastLogin: null,
      isLocked: false
    });

    // CTF challenge user
    this.users.set('ctf_user', {
      username: 'ctf_user',
      password: 'flag{welcome_to_ctf}',
      role: 'ctf',
      permissions: ['basic', 'ctf'],
      createdAt: new Date(),
      lastLogin: null,
      isLocked: false
    });
  }

  private createGuestSession(): void {
    const guestUser = this.users.get('guest');
    if (guestUser) {
      const sessionId = 'guest_' + Date.now();
      this.currentSession = {
        id: sessionId,
        userId: 'guest',
        username: 'guest',
        permissions: ['basic'],
        startTime: new Date(),
        lastActivity: new Date(),
        isActive: true
      };
      this.sessions.set(sessionId, this.currentSession);
      this.saveSession();
    }
  }

  public login(username: string, password: string): AuthResult {
    const user = this.users.get(username);
    
    if (!user) {
      this.recordFailedAttempt(username);
      return {
        success: false,
        message: 'User not found. Access denied.',
        user: null,
        session: null
      };
    }

    if (user.isLocked) {
      return {
        success: false,
        message: 'Account is locked. Contact administrator.',
        user: null,
        session: null
      };
    }

    if (this.isUserLockedOut(username)) {
      return {
        success: false,
        message: `Too many failed attempts. Try again later.`,
        user: null,
        session: null
      };
    }

    if (user.password !== password) {
      this.recordFailedAttempt(username);
      const attempts = this.loginAttempts.get(username) || 0;
      const remaining = this.maxAttempts - attempts;
      
      return {
        success: false,
        message: `Invalid password. ${remaining} attempts remaining.`,
        user: null,
        session: null
      };
    }

    // Successful login
    this.loginAttempts.delete(username);
    user.lastLogin = new Date();
    
    const session: Session = {
      id: this.generateSessionId(),
      userId: user.username,
      startTime: new Date(),
      lastActivity: new Date(),
      isActive: true,
      permissions: user.permissions
    };

    this.sessions.set(session.id, session);
    this.currentSession = session;
    this.saveSession();

    return {
      success: true,
      message: this.getWelcomeMessage(user),
      user,
      session
    };
  }

  public logout(): AuthResult {
    if (this.currentSession) {
      this.currentSession.isActive = false;
      this.currentSession = null;
      this.clearSession();
      
      return {
        success: true,
        message: 'Logged out successfully. Connection terminated.',
        user: null,
        session: null
      };
    }

    return {
      success: false,
      message: 'No active session found.',
      user: null,
      session: null
    };
  }

  public getCurrentSession(): Session | null {
    return this.currentSession;
  }

  public getCurrentUser(): User | null {
    if (!this.currentSession) return null;
    return this.users.get(this.currentSession.userId) || null;
  }

  public hasPermission(permission: string): boolean {
    if (!this.currentSession) return false;
    return this.currentSession.permissions.includes(permission);
  }

  public isLoggedIn(): boolean {
    return this.currentSession !== null && this.currentSession.isActive;
  }

  public switchUser(username: string, password: string): AuthResult {
    if (!this.isLoggedIn()) {
      return {
        success: false,
        message: 'Must be logged in to switch users.',
        user: null,
        session: null
      };
    }

    // Special case for su root
    if (username === 'root' && this.hasPermission('admin')) {
      const rootUser = this.users.get('root');
      if (rootUser && rootUser.password === password) {
        this.currentSession!.permissions = rootUser.permissions;
        return {
          success: true,
          message: '🔴 ROOT ACCESS GRANTED 🔴\nWarning: You now have unlimited power.',
          user: rootUser,
          session: this.currentSession
        };
      }
    }

    return this.login(username, password);
  }

  public createUser(username: string, password: string, role: string = 'user'): AuthResult {
    if (!this.hasPermission('admin')) {
      return {
        success: false,
        message: 'Permission denied. Admin access required.',
        user: null,
        session: null
      };
    }

    if (this.users.has(username)) {
      return {
        success: false,
        message: 'User already exists.',
        user: null,
        session: null
      };
    }

    const permissions = this.getPermissionsForRole(role);
    const newUser: User = {
      username,
      password,
      role,
      permissions,
      createdAt: new Date(),
      lastLogin: null,
      isLocked: false
    };

    this.users.set(username, newUser);

    return {
      success: true,
      message: `User '${username}' created successfully with role '${role}'.`,
      user: newUser,
      session: this.currentSession
    };
  }

  public listUsers(): string[] {
    if (!this.hasPermission('admin')) {
      return ['Permission denied.'];
    }

    const userList: string[] = [];
    this.users.forEach((user, username) => {
      const status = user.isLocked ? '[LOCKED]' : '[ACTIVE]';
      const lastLogin = user.lastLogin ? user.lastLogin.toLocaleString() : 'Never';
      userList.push(`${username} - ${user.role} ${status} - Last login: ${lastLogin}`);
    });

    return userList;
  }

  public getLoginHints(): string[] {
    return [
      'Default credentials: user/password',
      'Try common usernames: admin, root, guest',
      'Some passwords might be obvious...',
      'CTF users have special passwords',
      'Master users are hidden for a reason'
    ];
  }

  private recordFailedAttempt(username: string): void {
    const attempts = (this.loginAttempts.get(username) || 0) + 1;
    this.loginAttempts.set(username, attempts);

    if (attempts >= this.maxAttempts) {
      setTimeout(() => {
        this.loginAttempts.delete(username);
      }, this.lockoutTime);
    }
  }

  private isUserLockedOut(username: string): boolean {
    const attempts = this.loginAttempts.get(username) || 0;
    return attempts >= this.maxAttempts;
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  private getWelcomeMessage(user: User): string {
    const messages = {
      user: `Welcome back, ${user.username}. Basic access granted.`,
      admin: `🔶 ADMIN ACCESS GRANTED 🔶\nWelcome, ${user.username}. You have elevated privileges.`,
      root: `🔴 ROOT ACCESS GRANTED 🔴\nWelcome, ${user.username}. You have unlimited power.`,
      master: `🌟 MASTER ACCESS GRANTED 🌟\nWelcome, ${user.username}. You are the chosen one.`,
      ctf: `🏁 CTF MODE ACTIVATED 🏁\nWelcome, ${user.username}. Ready for challenges?`
    };

    return messages[user.role as keyof typeof messages] || `Welcome, ${user.username}.`;
  }

  private getPermissionsForRole(role: string): string[] {
    const rolePermissions = {
      user: ['basic'],
      admin: ['basic', 'admin', 'ctf', 'hidden'],
      root: ['basic', 'admin', 'ctf', 'hidden', 'root'],
      master: ['basic', 'admin', 'ctf', 'hidden', 'root', 'master'],
      ctf: ['basic', 'ctf']
    };

    return rolePermissions[role as keyof typeof rolePermissions] || ['basic'];
  }

  // Easter egg methods
  public getSecretUsers(): string[] {
    if (!this.hasPermission('master')) {
      return ['Access denied. Master level required.'];
    }

    return [
      'h4ck3r - The legendary master hacker',
      'ctf_user - Challenge seeker',
      'neo - The One (disabled)',
      'trinity - The hacker goddess (disabled)',
      'morpheus - The mentor (disabled)'
    ];
  }

  public hackAttempt(): string {
    const responses = [
      'Nice try, but this system is unhackable... or is it? 😏',
      'Detected intrusion attempt. Initiating countermeasures... just kidding!',
      'You think you can hack me? I\'m already three steps ahead.',
      'Error 418: I\'m a teapot. Also, you\'re not that good at hacking.',
      'Hack attempt logged. The FBI will be with you shortly... NOT!'
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }
}