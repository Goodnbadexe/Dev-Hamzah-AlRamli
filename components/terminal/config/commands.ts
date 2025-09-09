import { Command, CommandResult, TerminalContext } from '../types';
import { getPublicIP, generateFakeHash, simulateNetworkScan } from '../utils/network';
import { asciiArt } from '../utils/ascii-art';
import { ctfChallenges } from './ctf-challenges';

// Standard Commands
const helpCommand: Command = {
  name: 'help',
  description: 'Display available commands',
  aliases: ['h', '?'],
  usage: 'help [command]',
  handler: async (args: string[], context: TerminalContext): Promise<CommandResult> => {
    const { behaviorTracker } = context;
    
    // Easter egg for excessive help usage
    if (behaviorTracker.consecutiveHelps > 3) {
      return {
        output: 'Stop, could you find something else to do? 🤔\n\nMaybe try exploring some commands instead of asking for help all the time!',
        type: 'warning'
      };
    }
    
    if (args.length > 0) {
      // Show help for specific command
      const targetCommand = commandRegistry.find(cmd => 
        cmd.name === args[0] || cmd.aliases.includes(args[0])
      );
      
      if (targetCommand) {
        let helpText = `📖 ${targetCommand.name.toUpperCase()}\n\n`;
        helpText += `Description: ${targetCommand.description}\n`;
        if (targetCommand.usage) {
          helpText += `Usage: ${targetCommand.usage}\n`;
        }
        if (targetCommand.aliases.length > 0) {
          helpText += `Aliases: ${targetCommand.aliases.join(', ')}\n`;
        }
        return { output: helpText, type: 'info' };
      } else {
        return { output: `No help available for '${args[0]}'`, type: 'error' };
      }
    }
    
    // Show general help
    let output = '🚀 Available Commands:\n\n';
    
    // Filter commands based on user permissions
    const availableCommands = commandRegistry.filter(cmd => {
      if (cmd.hidden) return false;
      if (cmd.adminOnly && context.user.accessLevel !== 'admin' && context.user.accessLevel !== 'root') return false;
      if (cmd.requiresAuth && context.user.accessLevel === 'guest') return false;
      return true;
    });
    
    availableCommands.forEach(cmd => {
      output += `  ${cmd.name.padEnd(12)} - ${cmd.description}\n`;
    });
    
    output += '\n💡 Tip: Type "help <command>" for detailed usage information.';
    output += '\n🔍 Pro tip: Some commands have hidden features. Try exploring!';
    
    return { output, type: 'info' };
  }
};

const clearCommand: Command = {
  name: 'clear',
  description: 'Clear the terminal screen',
  aliases: ['cls', 'c'],
  handler: async (): Promise<CommandResult> => {
    return { output: '', type: 'clear' };
  }
};

const fullscreenCommand: Command = {
  name: 'fullscreen',
  description: 'Enter fullscreen terminal mode',
  aliases: ['fs', 'full'],
  handler: async (): Promise<CommandResult> => {
    return {
      output: '🖥️ Entering fullscreen mode...',
      type: 'success',
      triggerEffect: 'fullscreen'
    };
  }
};

const ipCommand: Command = {
  name: 'ip',
  description: 'Display your public IP address',
  aliases: ['myip', 'whatismyip'],
  handler: async (): Promise<CommandResult> => {
    try {
      const ip = await getPublicIP();
      return {
        output: `🌐 Your public IP address: ${ip}\n\n🔒 Remember: Your IP is your digital fingerprint on the internet!`,
        type: 'success'
      };
    } catch (error) {
      return {
        output: '❌ Failed to retrieve IP address. Are you connected to the internet?',
        type: 'error'
      };
    }
  }
};

const loginCommand: Command = {
  name: 'login',
  description: 'Authenticate to access advanced features',
  aliases: ['auth', 'signin'],
  usage: 'login [username] [password]',
  handler: async (args: string[], context: TerminalContext): Promise<CommandResult> => {
    if (context.user.accessLevel !== 'guest') {
      return {
        output: `Already logged in as ${context.user.username} (${context.user.accessLevel})`,
        type: 'info'
      };
    }
    
    if (args.length < 2) {
      return {
        output: 'Usage: login <username> <password>\n\nHint: Try "user" / "password" or discover the master credentials! 😉',
        type: 'warning'
      };
    }
    
    const [username, password] = args;
    
    // Check credentials
    if (username === 'user' && password === 'password') {
      context.user.username = username;
      context.user.accessLevel = 'user';
      return {
        output: '✅ Login successful! Welcome back, user.\n\n🎉 You now have access to additional commands. Type "help" to see what\'s new!',
        type: 'success',
        playSound: 'login'
      };
    }
    
    if (username === 'admin' && password === 'hacktheplanet') {
      context.user.username = username;
      context.user.accessLevel = 'admin';
      return {
        output: '🔥 Admin access granted! You are now in the matrix.\n\n⚡ Advanced commands unlocked. Use your power wisely!',
        type: 'success',
        playSound: 'admin_login',
        triggerEffect: 'matrix_rain'
      };
    }
    
    if (username === 'root' && password === 'toor') {
      context.user.username = username;
      context.user.accessLevel = 'root';
      return {
        output: '💀 ROOT ACCESS GRANTED 💀\n\n🚨 You have unlimited power. All hidden commands are now visible.\n\n' + asciiArt.skull,
        type: 'success',
        playSound: 'root_access',
        triggerEffect: 'screen_glitch'
      };
    }
    
    return {
      output: '❌ Invalid credentials. Access denied.\n\n💡 Hint: Default credentials might be simpler than you think...',
      type: 'error'
    };
  }
};

const logoutCommand: Command = {
  name: 'logout',
  description: 'End current session',
  aliases: ['exit', 'quit'],
  requiresAuth: true,
  handler: async (args: string[], context: TerminalContext): Promise<CommandResult> => {
    const previousLevel = context.user.accessLevel;
    context.user.username = 'guest';
    context.user.accessLevel = 'guest';
    
    return {
      output: `👋 Logged out from ${previousLevel} session. See you later, hacker!`,
      type: 'info'
    };
  }
};

const whoamiCommand: Command = {
  name: 'whoami',
  description: 'Display current user information',
  aliases: ['who'],
  handler: async (args: string[], context: TerminalContext): Promise<CommandResult> => {
    const { user, session } = context;
    
    let output = `👤 Current User: ${user.username}\n`;
    output += `🔐 Access Level: ${user.accessLevel}\n`;
    output += `⏰ Session Started: ${session.startTime.toLocaleString()}\n`;
    output += `🎯 Commands Executed: ${Array.from(context.behaviorTracker.commandCounts.values()).reduce((a, b) => a + b, 0)}`;
    
    if (user.accessLevel !== 'guest') {
      output += `\n🏆 Secrets Discovered: ${context.behaviorTracker.discoveredSecrets.length}`;
    }
    
    return { output, type: 'info' };
  }
};

const treeCommand: Command = {
  name: 'tree',
  description: 'Display directory structure',
  aliases: ['ls', 'dir'],
  handler: async (): Promise<CommandResult> => {
    const funnyTrees = [
      '🌳 Branches of knowledge growing...\n\n📁 /wisdom\n├── 📄 curiosity.txt\n├── 📄 persistence.log\n└── 📁 hidden_secrets/\n    └── 🔒 [ACCESS DENIED]',
      '🌲 File system forest detected:\n\n📂 Current Directory\n├── 🎯 motivation.exe\n├── 📜 ancient_wisdom.scroll\n├── 🔍 easter_eggs/\n└── 💎 treasure.hidden',
      '🌴 Digital palm tree structure:\n\n🏠 /home/hacker\n├── ⚡ power_level.max\n├── 🧠 brain_dump.core\n└── 🎪 fun_zone/\n    ├── 🎭 jokes.db\n    └── 🎮 games.archive'
    ];
    
    return {
      output: funnyTrees[Math.floor(Math.random() * funnyTrees.length)],
      type: 'success'
    };
  }
};

// Hidden/Fun Commands
const motivateCommand: Command = {
  name: 'motivate',
  description: 'Get some hacker motivation',
  aliases: ['inspire', 'quote'],
  hidden: true,
  handler: async (): Promise<CommandResult> => {
    const quotes = [
      '"The best way to predict the future is to invent it." - Alan Kay',
      '"Code is like humor. When you have to explain it, it\'s bad." - Cory House',
      '"First, solve the problem. Then, write the code." - John Johnson',
      '"The only way to learn a new programming language is by writing programs in it." - Dennis Ritchie',
      '"Hack the planet! 🌍" - The Hackers Manifesto',
      '"In a world of locked doors, the man with the key is king." - Anonymous Hacker',
      '"The quieter you become, the more you are able to hear." - Kali Linux'
    ];
    
    return {
      output: `💪 ${quotes[Math.floor(Math.random() * quotes.length)]}\n\n🚀 Keep pushing boundaries!`,
      type: 'success',
      playSound: 'motivational'
    };
  }
};

const scanCommand: Command = {
  name: 'scan',
  description: 'Perform network reconnaissance',
  aliases: ['nmap', 'recon'],
  requiresAuth: true,
  cooldown: 10000, // 10 seconds
  handler: async (args: string[]): Promise<CommandResult> => {
    const target = args[0] || 'localhost';
    
    return {
      output: await simulateNetworkScan(target),
      type: 'success',
      playSound: 'scan'
    };
  }
};

const hashCommand: Command = {
  name: 'hash',
  description: 'Generate or crack password hashes',
  aliases: ['md5', 'sha1', 'crack'],
  requiresAuth: true,
  usage: 'hash <text> [algorithm]',
  handler: async (args: string[]): Promise<CommandResult> => {
    if (args.length === 0) {
      return {
        output: 'Usage: hash <text> [algorithm]\n\nSupported algorithms: md5, sha1, sha256',
        type: 'warning'
      };
    }
    
    const text = args[0];
    const algorithm = args[1] || 'md5';
    
    const hash = generateFakeHash(text, algorithm);
    
    return {
      output: `🔐 ${algorithm.toUpperCase()} Hash:\n\nInput: ${text}\nHash:  ${hash}\n\n💡 Remember: Real hashing is one-way!`,
      type: 'success'
    };
  }
};

const hackCommand: Command = {
  name: 'hack',
  description: 'Start hacking simulation',
  aliases: ['h4ck', 'pwn'],
  usage: 'hack [target]',
  handler: async (args: string[], context: TerminalContext): Promise<CommandResult> => {
    const target = args[0] || 'localhost';
    const hackingSteps = [
      `🎯 Target acquired: ${target}`,
      '🔍 Scanning for vulnerabilities...',
      '⚡ Exploiting buffer overflow...',
      '🔓 Bypassing firewall...',
      '💾 Accessing mainframe...',
      '🚀 Root access obtained!'
    ];
    
    return {
      output: hackingSteps.join('\n') + `\n\n🏆 Successfully hacked ${target}!\n\n💀 HACKER MODE ACTIVATED 💀`,
      type: 'success',
      triggerEffect: 'screen_glitch'
    };
  }
};

const matrixCommand: Command = {
  name: 'matrix',
  description: 'Enter the Matrix',
  aliases: ['neo'],
  hidden: true,
  handler: async (): Promise<CommandResult> => {
    return {
      output: asciiArt.matrix + '\n\n"There is no spoon." - Neo\n\n🔴 Take the red pill, or 🔵 take the blue pill?',
      type: 'success',
      triggerEffect: 'matrix_rain',
      playSound: 'matrix'
    };
  }
};

// CTF Commands
const ctfCommand: Command = {
  name: 'ctf',
  description: 'Access Capture The Flag challenges',
  aliases: ['challenge', 'puzzle'],
  requiresAuth: true,
  usage: 'ctf [list|start <id>|hint <id>|submit <id> <flag>]',
  handler: async (args: string[], context: TerminalContext): Promise<CommandResult> => {
    if (args.length === 0 || args[0] === 'list') {
      let output = '🏁 Available CTF Challenges:\n\n';
      
      ctfChallenges.forEach((challenge, index) => {
        const status = context.gameState.solvedChallenges.includes(challenge.id) ? '✅' : '❌';
        output += `${status} ${index + 1}. ${challenge.title} (${challenge.difficulty})\n`;
      });
      
      output += '\n💡 Use "ctf start <id>" to begin a challenge!';
      
      return { output, type: 'info' };
    }
    
    const action = args[0];
    const challengeId = args[1];
    
    if (action === 'start' && challengeId) {
      const challenge = ctfChallenges.find(c => c.id === challengeId);
      if (!challenge) {
        return { output: 'Challenge not found!', type: 'error' };
      }
      
      return {
        output: `🎯 Challenge: ${challenge.title}\n\nDifficulty: ${challenge.difficulty}\nPoints: ${challenge.points}\n\n${challenge.description}\n\n${challenge.content}`,
        type: 'info'
      };
    }
    
    if (action === 'hint' && challengeId) {
      const challenge = ctfChallenges.find(c => c.id === challengeId);
      if (!challenge) {
        return { output: 'Challenge not found!', type: 'error' };
      }
      
      return {
        output: `💡 Hint for "${challenge.title}":\n\n${challenge.hint}`,
        type: 'info'
      };
    }
    
    if (action === 'submit' && challengeId && args[2]) {
      const challenge = ctfChallenges.find(c => c.id === challengeId);
      if (!challenge) {
        return { output: 'Challenge not found!', type: 'error' };
      }
      
      const flag = args[2];
      if (flag === challenge.flag) {
        if (!context.gameState.solvedChallenges.includes(challengeId)) {
          context.gameState.solvedChallenges.push(challengeId);
          context.gameState.totalPoints += challenge.points;
        }
        
        return {
          output: `🎉 Correct! Flag accepted!\n\nPoints earned: ${challenge.points}\nTotal points: ${context.gameState.totalPoints}\n\n${challenge.reward || 'Great job, hacker!'}`,
          type: 'success',
          playSound: 'victory'
        };
      } else {
        return {
          output: '❌ Incorrect flag. Keep trying!\n\n💡 Use "ctf hint <id>" if you need help.',
          type: 'error'
        };
      }
    }
    
    return {
      output: 'Usage: ctf [list|start <id>|hint <id>|submit <id> <flag>]',
      type: 'warning'
    };
  }
};

// Admin Commands
const rootCommand: Command = {
  name: 'root',
  description: 'Attempt to gain root access',
  aliases: ['admin', 'superuser'],
  usage: 'root',
  handler: async (args: string[], context: TerminalContext): Promise<CommandResult> => {
    const responses = [
      '🚫 Access denied. You are not in the sudoers file. This incident will be reported.',
      '💀 Nice try! Root access requires more than just typing "root".',
      '🔒 Root privileges locked. Try logging in as an admin first.',
      '⚡ ERROR: Insufficient privileges. Contact your system administrator.',
      '🎭 You think you can just become root? That\'s not how this works!'
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      output: randomResponse + '\n\n💡 Hint: Try "login admin" or "su root" if you have credentials.',
      type: 'error'
    };
  }
};

const suCommand: Command = {
  name: 'su',
  description: 'Switch user (admin only)',
  aliases: ['sudo'],
  adminOnly: true,
  usage: 'su <username>',
  handler: async (args: string[], context: TerminalContext): Promise<CommandResult> => {
    if (args.length === 0) {
      return { output: 'Usage: su <username>', type: 'warning' };
    }
    
    const targetUser = args[0];
    
    if (targetUser === 'root') {
      context.user.username = 'root';
      context.user.accessLevel = 'root';
      return {
        output: '💀 Switched to root user. Ultimate power achieved!\n\n' + asciiArt.warning,
        type: 'success',
        triggerEffect: 'screen_glitch'
      };
    }
    
    return {
      output: `❌ Cannot switch to user '${targetUser}'. Permission denied.`,
      type: 'error'
    };
  }
}

// Export command registry
export const commandRegistry: Command[] = [
  helpCommand,
  clearCommand,
  fullscreenCommand,
  ipCommand,
  loginCommand,
  logoutCommand,
  whoamiCommand,
  treeCommand,
  motivateCommand,
  scanCommand,
  hashCommand,
  hackCommand,
  matrixCommand,
  ctfCommand,
  rootCommand,
  suCommand
];