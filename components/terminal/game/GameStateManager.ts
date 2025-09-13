// Game state management for CTF challenges and achievements

import { GameState, Achievement, CTFChallenge } from '../types';
import { ctfChallenges } from '../config/ctf-challenges';

export class GameStateManager {
  private gameState: GameState;
  private readonly storageKey = 'hacker_terminal_game_state';

  constructor() {
    this.gameState = this.loadGameState();
  }

  private loadGameState(): GameState {
    try {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            ...parsed,
            startTime: new Date(parsed.startTime),
            lastActivity: new Date(parsed.lastActivity),
            achievements: parsed.achievements.map((a: any) => ({
              ...a,
              unlockedAt: new Date(a.unlockedAt)
            }))
          };
        }
      }
    } catch (error) {
      console.warn('Failed to load game state:', error);
    }

    return this.createNewGameState();
  }

  private createNewGameState(): GameState {
    return {
      level: 1,
      experience: 0,
      score: 0,
      solvedChallenges: [],
      unlockedCommands: ['help', 'clear', 'whoami', 'date', 'echo'],
      achievements: [],
      stats: {
        commandsExecuted: 0,
        challengesSolved: 0,
        easterEgsFound: 0,
        loginAttempts: 0,
        timeSpent: 0
      },
      startTime: new Date(),
      lastActivity: new Date(),
      currentStreak: 0,
      bestStreak: 0,
      hints: {
        used: 0,
        available: 3
      }
    };
  }

  public saveGameState(): void {
    try {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.storageKey, JSON.stringify(this.gameState));
      }
    } catch (error) {
      console.warn('Failed to save game state:', error);
    }
  }

  public getGameState(): GameState {
    return { ...this.gameState };
  }

  public addExperience(amount: number): { levelUp: boolean; newLevel: number } {
    this.gameState.experience += amount;
    const oldLevel = this.gameState.level;
    const newLevel = Math.floor(this.gameState.experience / 100) + 1;
    
    if (newLevel > oldLevel) {
      this.gameState.level = newLevel;
      this.unlockCommandsForLevel(newLevel);
      this.checkAchievements();
      this.saveGameState();
      return { levelUp: true, newLevel };
    }

    this.saveGameState();
    return { levelUp: false, newLevel: oldLevel };
  }

  public addScore(points: number): void {
    this.gameState.score += points;
    this.saveGameState();
  }

  public solveChallenge(challengeId: string): { success: boolean; reward: any } {
    if (this.gameState.solvedChallenges.includes(challengeId)) {
      return { success: false, reward: null };
    }

    const challenge = ctfChallenges.find(c => c.id === challengeId);
    if (!challenge) {
      return { success: false, reward: null };
    }

    this.gameState.solvedChallenges.push(challengeId);
    this.gameState.stats.challengesSolved++;
    this.gameState.currentStreak++;
    
    if (this.gameState.currentStreak > this.gameState.bestStreak) {
      this.gameState.bestStreak = this.gameState.currentStreak;
    }

    const points = challenge.points || 0;
    const expGained = this.addExperience(points);
    this.addScore(points);

    // Unlock rewards
    if (challenge.rewards && challenge.rewards.commands) {
      challenge.rewards.commands.forEach(cmd => {
        if (!this.gameState.unlockedCommands.includes(cmd)) {
          this.gameState.unlockedCommands.push(cmd);
        }
      });
    }

    this.checkAchievements();
    this.saveGameState();

    return {
      success: true,
      reward: {
        points: points,
        experience: points,
        levelUp: expGained.levelUp,
        newLevel: expGained.newLevel,
        unlockedCommands: challenge.rewards?.commands || [],
        message: challenge.rewards?.message
      }
    };
  }

  public incrementStat(stat: keyof GameState['stats'], amount: number = 1): void {
    this.gameState.stats[stat] += amount;
    this.gameState.lastActivity = new Date();
    this.checkAchievements();
    this.saveGameState();
  }

  public unlockAchievement(achievementId: string): Achievement | null {
    if (this.gameState.achievements.some(a => a.id === achievementId)) {
      return null; // Already unlocked
    }

    const achievement: Achievement = {
      id: achievementId,
      name: this.getAchievementName(achievementId),
      description: this.getAchievementDescription(achievementId),
      icon: this.getAchievementIcon(achievementId),
      unlockedAt: new Date(),
      points: this.getAchievementPoints(achievementId)
    };

    this.gameState.achievements.push(achievement);
    this.addScore(achievement.points || 0);
    this.saveGameState();

    return achievement;
  }

  public isCommandUnlocked(command: string): boolean {
    return this.gameState.unlockedCommands.includes(command);
  }

  public getAvailableChallenges(): CTFChallenge[] {
    return ctfChallenges.filter(challenge => {
      // Check if challenge is unlocked based on level and prerequisites
      if (challenge.difficulty === 'easy') return true;
      if (challenge.difficulty === 'medium' && this.gameState.level >= 3) return true;
      if (challenge.difficulty === 'hard' && this.gameState.level >= 5) return true;
      if (challenge.difficulty === 'expert' && this.gameState.level >= 8) return true;
      return false;
    });
  }

  public getProgress(): string {
    const totalChallenges = ctfChallenges.length;
    const solvedChallenges = this.gameState.solvedChallenges.length;
    const progressPercent = Math.round((solvedChallenges / totalChallenges) * 100);
    
    return `Progress: ${solvedChallenges}/${totalChallenges} challenges (${progressPercent}%)`;
  }

  public getStats(): string[] {
    const stats = this.gameState.stats;
    const timeSpent = Math.floor((Date.now() - this.gameState.startTime.getTime()) / 1000 / 60);
    
    return [
      `Level: ${this.gameState.level}`,
      `Experience: ${this.gameState.experience}`,
      `Score: ${this.gameState.score}`,
      `Commands Executed: ${stats.commandsExecuted}`,
      `Challenges Solved: ${stats.challengesSolved}`,
      `Easter Eggs Found: ${stats.easterEgsFound}`,
      `Current Streak: ${this.gameState.currentStreak}`,
      `Best Streak: ${this.gameState.bestStreak}`,
      `Time Spent: ${timeSpent} minutes`,
      `Achievements: ${this.gameState.achievements.length}`
    ];
  }

  public getLeaderboard(): string[] {
    // Mock leaderboard for demo
    return [
      '🏆 LEADERBOARD 🏆',
      '1. Neo - 9999 points',
      '2. Trinity - 8888 points',
      '3. Morpheus - 7777 points',
      `4. You - ${this.gameState.score} points`,
      '5. Agent Smith - 1337 points'
    ];
  }

  public useHint(): { success: boolean; message: string } {
    if (this.gameState.hints.available <= 0) {
      return {
        success: false,
        message: 'No hints available. Solve challenges to earn more!'
      };
    }

    this.gameState.hints.available--;
    this.gameState.hints.used++;
    this.saveGameState();

    const hints = [
      'Try looking for hidden files with ls -la',
      'Some commands have secret parameters',
      'Check the source code for clues',
      'Base64 encoding is commonly used in CTFs',
      'Try different user accounts',
      'Look for patterns in error messages',
      'Network commands might reveal useful information'
    ];

    const randomHint = hints[Math.floor(Math.random() * hints.length)];

    return {
      success: true,
      message: `💡 Hint: ${randomHint}`
    };
  }

  public resetGame(): void {
    this.gameState = this.createNewGameState();
    this.saveGameState();
  }

  private unlockCommandsForLevel(level: number): void {
    const levelCommands = {
      2: ['ls', 'cat', 'pwd'],
      3: ['grep', 'find', 'ps'],
      4: ['netstat', 'ping', 'nslookup'],
      5: ['ssh', 'scp', 'wget'],
      6: ['nmap', 'nc', 'tcpdump'],
      7: ['john', 'hashcat', 'hydra'],
      8: ['metasploit', 'burp', 'wireshark'],
      9: ['volatility', 'binwalk', 'strings'],
      10: ['gdb', 'radare2', 'ghidra']
    };

    const commands = levelCommands[level as keyof typeof levelCommands];
    if (commands) {
      commands.forEach(cmd => {
        if (!this.gameState.unlockedCommands.includes(cmd)) {
          this.gameState.unlockedCommands.push(cmd);
        }
      });
    }
  }

  private checkAchievements(): void {
    const achievements = [
      { id: 'first_command', condition: () => this.gameState.stats.commandsExecuted >= 1 },
      { id: 'command_master', condition: () => this.gameState.stats.commandsExecuted >= 100 },
      { id: 'first_challenge', condition: () => this.gameState.stats.challengesSolved >= 1 },
      { id: 'challenge_master', condition: () => this.gameState.stats.challengesSolved >= 10 },
      { id: 'easter_hunter', condition: () => this.gameState.stats.easterEgsFound >= 5 },
      { id: 'level_up', condition: () => this.gameState.level >= 5 },
      { id: 'high_scorer', condition: () => this.gameState.score >= 1000 },
      { id: 'streak_master', condition: () => this.gameState.bestStreak >= 5 },
      { id: 'persistent', condition: () => this.gameState.stats.loginAttempts >= 10 }
    ];

    achievements.forEach(achievement => {
      if (achievement.condition() && !this.gameState.achievements.some(a => a.id === achievement.id)) {
        this.unlockAchievement(achievement.id);
      }
    });
  }

  private getAchievementName(id: string): string {
    const names = {
      first_command: 'First Steps',
      command_master: 'Command Master',
      first_challenge: 'Challenge Accepted',
      challenge_master: 'CTF Champion',
      easter_hunter: 'Easter Egg Hunter',
      level_up: 'Level Up!',
      high_scorer: 'High Scorer',
      streak_master: 'Streak Master',
      persistent: 'Persistent Hacker'
    };
    return names[id as keyof typeof names] || 'Unknown Achievement';
  }

  private getAchievementDescription(id: string): string {
    const descriptions = {
      first_command: 'Execute your first command',
      command_master: 'Execute 100 commands',
      first_challenge: 'Solve your first CTF challenge',
      challenge_master: 'Solve 10 CTF challenges',
      easter_hunter: 'Find 5 easter eggs',
      level_up: 'Reach level 5',
      high_scorer: 'Score 1000 points',
      streak_master: 'Achieve a 5-challenge streak',
      persistent: 'Attempt login 10 times'
    };
    return descriptions[id as keyof typeof descriptions] || 'Unknown achievement';
  }

  private getAchievementPoints(id: string): number {
    const points = {
      first_command: 10,
      command_master: 100,
      first_challenge: 50,
      challenge_master: 500,
      easter_hunter: 200,
      level_up: 150,
      high_scorer: 300,
      streak_master: 250,
      persistent: 75
    };
    return points[id as keyof typeof points] || 0;
  }

  private getAchievementIcon(id: string): string {
    const icons = {
      first_command: '🚀',
      command_master: '👑',
      first_challenge: '🏁',
      challenge_master: '🏆',
      easter_hunter: '🥚',
      level_up: '⬆️',
      high_scorer: '💯',
      streak_master: '🔥',
      persistent: '💪'
    };
    return icons[id as keyof typeof icons] || '🎖️';
  }
}