import { Command, CommandResult, TerminalContext, CommandHandler } from './types';
import { commandRegistry } from './config/commands';
import { easterEggs } from './config/easter-eggs';

export class CommandProcessor {
  private commands: Map<string, Command> = new Map();
  private aliases: Map<string, string> = new Map();
  private cooldowns: Map<string, number> = new Map();

  constructor() {
    this.loadCommands();
  }

  private loadCommands(): void {
    commandRegistry.forEach(command => {
      this.commands.set(command.name, command);
      
      // Register aliases
      command.aliases.forEach(alias => {
        this.aliases.set(alias, command.name);
      });
    });
  }

  async executeCommand(input: string, context: TerminalContext): Promise<CommandResult> {
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      return { output: '', type: 'info' };
    }

    const args = this.parseCommand(trimmedInput);
    const commandName = args[0].toLowerCase();
    const commandArgs = args.slice(1);

    // Update behavior tracking
    this.updateBehaviorTracking(commandName, context);

    // Resolve command name (handle aliases)
    const resolvedCommand = this.aliases.get(commandName) || commandName;
    const command = this.commands.get(resolvedCommand);

    if (!command) {
      // Check for Easter eggs only if command doesn't exist
      const easterEggResult = this.checkEasterEggs(trimmedInput, context);
      if (easterEggResult) {
        return easterEggResult;
      }
      return this.handleUnknownCommand(commandName, context);
    }

    // Check permissions
    const permissionResult = this.checkPermissions(command, context);
    if (permissionResult) {
      return permissionResult;
    }

    // Check cooldown
    const cooldownResult = this.checkCooldown(command, context);
    if (cooldownResult) {
      return cooldownResult;
    }

    try {
      // Execute command
      const result = await command.handler(commandArgs, context);
      
      // Apply cooldown if specified
      if (command.cooldown) {
        this.cooldowns.set(`${context.user.username}_${command.name}`, Date.now() + command.cooldown);
      }

      return result;
    } catch (error) {
      return {
        output: `Error executing command: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error'
      };
    }
  }

  private parseCommand(input: string): string[] {
    // Simple command parsing - can be enhanced for complex arguments
    return input.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
  }

  private updateBehaviorTracking(commandName: string, context: TerminalContext): void {
    const { behaviorTracker } = context;
    
    // Update command count
    const currentCount = behaviorTracker.commandCounts.get(commandName) || 0;
    behaviorTracker.commandCounts.set(commandName, currentCount + 1);
    
    // Track consecutive help commands
    if (commandName === 'help') {
      behaviorTracker.consecutiveHelps++;
    } else {
      behaviorTracker.consecutiveHelps = 0;
    }
    
    behaviorTracker.lastCommandTime = new Date();
  }

  private checkEasterEggs(input: string, context: TerminalContext): CommandResult | null {
    for (const egg of easterEggs) {
      if (this.matchesEasterEgg(input, egg.trigger)) {
        // Check if condition is met (if specified)
        if (egg.condition && !egg.condition(context)) {
          continue;
        }

        // Check if it's a one-time Easter egg
        if (egg.oneTime && context.behaviorTracker.discoveredSecrets.includes(egg.trigger)) {
          continue;
        }

        // Mark as discovered
        if (!context.behaviorTracker.discoveredSecrets.includes(egg.trigger)) {
          context.behaviorTracker.discoveredSecrets.push(egg.trigger);
        }

        return {
          output: egg.response,
          type: 'success',
          playSound: egg.sound,
          triggerEffect: egg.effect
        };
      }
    }

    return null;
  }

  private matchesEasterEgg(input: string, trigger: string): boolean {
    // Support different trigger types
    if (trigger.startsWith('regex:')) {
      const regex = new RegExp(trigger.substring(6), 'i');
      return regex.test(input);
    }
    
    if (trigger.startsWith('exact:')) {
      return input === trigger.substring(6);
    }
    
    // Default: case-insensitive match
    return input.toLowerCase().includes(trigger.toLowerCase());
  }

  private checkPermissions(command: Command, context: TerminalContext): CommandResult | null {
    const { user } = context;
    
    if (command.requiresAuth && user.accessLevel === 'guest') {
      return {
        output: 'Access denied. Please login first. (hint: try "login")',
        type: 'error'
      };
    }
    
    if (command.adminOnly && !['admin', 'root'].includes(user.accessLevel)) {
      return {
        output: 'Insufficient privileges. Admin access required.',
        type: 'error'
      };
    }
    
    return null;
  }

  private checkCooldown(command: Command, context: TerminalContext): CommandResult | null {
    if (!command.cooldown) return null;
    
    const cooldownKey = `${context.user.username}_${command.name}`;
    const cooldownEnd = this.cooldowns.get(cooldownKey);
    
    if (cooldownEnd && Date.now() < cooldownEnd) {
      const remainingTime = Math.ceil((cooldownEnd - Date.now()) / 1000);
      return {
        output: `Command on cooldown. Try again in ${remainingTime} seconds.`,
        type: 'warning'
      };
    }
    
    return null;
  }

  private handleUnknownCommand(commandName: string, context: TerminalContext): CommandResult {
    const suggestions = this.getSuggestions(commandName);
    const funnyResponses = [
      `Command '${commandName}' not found, but found your determination!`,
      `'${commandName}' is not a command, but it could be a great band name.`,
      `Error 404: Command '${commandName}' not found, but your creativity is noted.`,
      `'${commandName}' - sounds like a spell from Harry Potter, but it's not a valid command.`,
      `Command '${commandName}' not recognized. Did you mean to hack the mainframe?`
    ];
    
    let output = funnyResponses[Math.floor(Math.random() * funnyResponses.length)];
    
    if (suggestions.length > 0) {
      output += `\n\nDid you mean: ${suggestions.join(', ')}?`;
    }
    
    output += '\n\nType "help" to see available commands.';
    
    return {
      output,
      type: 'error'
    };
  }

  private getSuggestions(input: string): string[] {
    const suggestions: string[] = [];
    const inputLower = input.toLowerCase();
    
    // Find commands with similar names
    for (const [commandName] of this.commands) {
      if (this.calculateSimilarity(inputLower, commandName) > 0.6) {
        suggestions.push(commandName);
      }
    }
    
    // Check aliases too
    for (const [alias] of this.aliases) {
      if (this.calculateSimilarity(inputLower, alias) > 0.6) {
        suggestions.push(alias);
      }
    }
    
    return suggestions.slice(0, 3); // Limit to 3 suggestions
  }

  private calculateSimilarity(str1: string, str2: string): number {
    // Simple Levenshtein distance-based similarity
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  // Public methods for command management
  registerCommand(command: Command): void {
    this.commands.set(command.name, command);
    command.aliases.forEach(alias => {
      this.aliases.set(alias, command.name);
    });
  }

  unregisterCommand(commandName: string): void {
    const command = this.commands.get(commandName);
    if (command) {
      this.commands.delete(commandName);
      command.aliases.forEach(alias => {
        this.aliases.delete(alias);
      });
    }
  }

  getAvailableCommands(context: TerminalContext): Command[] {
    return Array.from(this.commands.values()).filter(command => {
      // Filter based on permissions and hidden status
      if (command.hidden && context.user.accessLevel !== 'root') {
        return false;
      }
      
      if (command.adminOnly && !['admin', 'root'].includes(context.user.accessLevel)) {
        return false;
      }
      
      if (command.requiresAuth && context.user.accessLevel === 'guest') {
        return false;
      }
      
      return true;
    });
  }

  getCommandHelp(commandName: string): string | null {
    const resolvedCommand = this.aliases.get(commandName) || commandName;
    const command = this.commands.get(resolvedCommand);
    
    if (!command) return null;
    
    let help = `${command.name}: ${command.description}`;
    
    if (command.usage) {
      help += `\nUsage: ${command.usage}`;
    }
    
    if (command.aliases.length > 0) {
      help += `\nAliases: ${command.aliases.join(', ')}`;
    }
    
    return help;
  }
}