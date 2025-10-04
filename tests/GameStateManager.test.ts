// === METADATA ===
// Purpose: Unit tests for GameStateManager stats and achievements
// Author: @Goodnbad.exe
// Inputs: None (mocks localStorage)
// Outputs: Test assertions for state updates
// Assumptions: Node env; window/localStorage mocked
// Tests: npm test -- -t GameStateManager
// Complexity: O(n) for sequences of operations
// === END METADATA ===
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GameStateManager } from '@/components/terminal/game/GameStateManager';

// Mock localStorage for Node tests
class LocalStorageMock {
  private store: Record<string, string> = {};
  getItem(key: string) { return this.store[key] || null; }
  setItem(key: string, value: string) { this.store[key] = value; }
  removeItem(key: string) { delete this.store[key]; }
  clear() { this.store = {}; }
}

declare global {
  // eslint-disable-next-line no-var
  var window: any;
}

describe('GameStateManager', () => {
  let gsm: GameStateManager;

  beforeEach(() => {
    (global as any).window = { localStorage: new LocalStorageMock() };
    gsm = new GameStateManager();
  });

  it('initializes with default stats including easterEggsFound', () => {
    const state = gsm.getGameState();
    expect(state.stats.commandsExecuted).toBe(0);
    expect(state.stats.challengesSolved).toBe(0);
    expect(state.stats.easterEggsFound).toBe(0);
  });

  it('increments stats and checks achievements', () => {
    gsm.incrementStat('commandsExecuted');
    gsm.incrementStat('commandsExecuted', 99);
    const progress = gsm.getProgress();
    expect(progress).toContain('Progress:');

    const statsLines = gsm.getStats();
    expect(statsLines.some(l => l.includes('Commands Executed: 100'))).toBe(true);
  });

  it('adds experience and unlocks commands on level up', () => {
    const res = gsm.addExperience(250); // level should become 3
    expect(res.levelUp).toBe(true);
    expect(res.newLevel).toBeGreaterThan(1);
    const state = gsm.getGameState();
    expect(state.unlockedCommands.length).toBeGreaterThan(0);
  });

  it('handles achievement unlocking', () => {
    // Achieve easter_hunter by simulating 5 eggs
    gsm.incrementStat('easterEggsFound', 5);
    const state = gsm.getGameState();
    expect(state.achievements.some(a => a.id === 'easter_hunter')).toBe(true);
  });
});