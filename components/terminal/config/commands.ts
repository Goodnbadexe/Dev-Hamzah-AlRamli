import { Command, CommandResult, TerminalContext, AccessLevel } from '../types';
import { getPublicIP, generateFakeHash, simulateNetworkScan } from '../utils/network';
import { asciiArt, createAnimatedText, createProgressBar, createLoadingAnimation } from '../utils/ascii-art';
import { ctfChallenges } from './ctf-challenges';

// Standard Commands
const helpCommand: Command = {
  name: 'help',
  description: 'Display available commands',
  aliases: ['h', '?'],
  hidden: false,
  requiresAuth: false,
  adminOnly: false,
  usage: 'help [command]',
  handler: async (args: string[], context: TerminalContext): Promise<CommandResult> => {
    // Award XP for first help command and track stats
    const gameManager = context.gameManager;
    let achievements: any[] = [];
    let experienceGained = 0;
    
    if (gameManager) {
      gameManager.incrementStat('commandsExecuted');
      
      // Award XP for first help command
      const commandCount = context.behaviorTracker.commandCounts.get('help') || 0;
      if (commandCount === 0) {
        const expResult = gameManager.addExperience(5);
        experienceGained = 5;
        
        // Check for new achievements
        const currentAchievements = gameManager.getGameState().achievements;
        const newAchievements = currentAchievements.filter((a: any) => 
          Date.now() - a.unlockedAt.getTime() < 1000
        );
        achievements.push(...newAchievements);
      }
    }

    // Check for help spam behavior
    if (context.behaviorTracker.consecutiveHelps >= 3) {
      return {
        output: '🤖 Stop, could you find something else to do? Maybe try "hack" or "matrix" for some fun! 😄',
        type: 'warning'
      };
    }

    if (args.length > 0) {
      const commandName = args[0].toLowerCase();
      const command = commandRegistry.find(cmd => 
        cmd.name === commandName || cmd.aliases.includes(commandName)
      );
      
      if (command) {
        let output = `📖 Help for "${command.name}":\n\n`;
        output += `Description: ${command.description}\n`;
        if (command.usage) {
          output += `Usage: ${command.usage}\n`;
        }
        if (command.aliases.length > 0) {
          output += `Aliases: ${command.aliases.join(', ')}\n`;
        }
        if (command.requiresAuth) {
          output += `⚠️  Requires authentication\n`;
        }
        if (command.adminOnly) {
          output += `🔒 Admin only\n`;
        }
        return { 
          output, 
          type: 'info',
          achievements: achievements.length > 0 ? achievements : undefined,
          experienceGained: experienceGained > 0 ? experienceGained : undefined
        };
      } else {
        return {
          output: `Command "${commandName}" not found. Use "help" to see all available commands.`,
          type: 'error'
        };
      }
    }

    // Show all available commands
    let output = '🚀 Available Commands:\n\n';
    
    const availableCommands = commandRegistry.filter(cmd => {
      if (cmd.hidden && context.user.accessLevel !== 'root') return false;
      if (cmd.adminOnly && !['admin', 'root'].includes(context.user.accessLevel || '')) return false;
      if (cmd.requiresAuth && context.user.accessLevel === 'guest') return false;
      return true;
    });

    availableCommands.forEach(cmd => {
      const authIcon = cmd.requiresAuth ? '🔐 ' : '';
      const adminIcon = cmd.adminOnly ? '👑 ' : '';
      output += `  ${authIcon}${adminIcon}${cmd.name.padEnd(12)} - ${cmd.description}\n`;
    });

    output += '\n💡 Use "help <command>" for detailed information about a specific command.';
    output += '\n🎯 Try "hack", "matrix", or "ctf" for some fun!';
    
    return { 
      output, 
      type: 'info',
      achievements: achievements.length > 0 ? achievements : undefined,
      experienceGained: experienceGained > 0 ? experienceGained : undefined
    };
  }
};

const clearCommand: Command = {
  name: 'clear',
  description: 'Clear the terminal screen',
  aliases: ['cls', 'c'],
  hidden: false,
  requiresAuth: false,
  adminOnly: false,
  handler: async (): Promise<CommandResult> => {
    return { output: '', type: 'clear' };
  }
};

const fullscreenCommand: Command = {
  name: 'fullscreen',
  description: 'Enter fullscreen terminal mode',
  aliases: ['fs', 'full'],
  hidden: false,
  requiresAuth: false,
  adminOnly: false,
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
  hidden: false,
  requiresAuth: false,
  adminOnly: false,
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
  hidden: false,
  requiresAuth: false,
  adminOnly: false,
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
    
    // Use AuthManager for proper authentication
     if (context.gameManager && context.gameManager.authManager) {
       const authResult = context.gameManager.authManager.login(username, password);
       if (authResult.success && authResult.user) {
         // Update context user from auth result
         context.user.username = username;
         context.user.accessLevel = authResult.user.role as AccessLevel || 'user';
       }
       return {
         output: authResult.message,
         type: authResult.success ? 'success' : 'error',
         playSound: authResult.success ? 'login' : undefined,
         triggerEffect: authResult.success && username === 'admin' ? 'matrix_rain' : 
                       authResult.success && username === 'root' ? 'screen_glitch' : undefined
       };
     }
    
    // Fallback for backward compatibility
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
  hidden: false,
  requiresAuth: true,
  adminOnly: false,
  handler: async (args: string[], context: TerminalContext): Promise<CommandResult> => {
    const previousLevel = context.user.accessLevel;
    
    // Use AuthManager for proper logout
    if (context.gameManager && context.gameManager.authManager) {
      const logoutResult = context.gameManager.authManager.logout();
      // Update context user
      context.user.username = 'guest';
      context.user.accessLevel = 'guest';
      return {
        output: logoutResult.message,
        type: 'info'
      };
    }
    
    // Fallback for backward compatibility
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
  hidden: false,
  requiresAuth: false,
  adminOnly: false,
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
  hidden: false,
  requiresAuth: false,
  adminOnly: false,
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
  requiresAuth: false,
  adminOnly: false,
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
  hidden: false,
  requiresAuth: true,
  adminOnly: false,
  cooldown: 10000, // 10 seconds
  handler: async (args: string[]): Promise<CommandResult> => {
    const target = args[0] || 'localhost';
    
    const scanResults = [
      `🎯 ${createAnimatedText('NETWORK RECONNAISSANCE INITIATED', 'matrix')}`,
      `📡 Target: ${target}`,
      '',
      `${createLoadingAnimation(0)} Initializing port scanner...`,
      `${createLoadingAnimation(1)} Resolving hostname... ${createProgressBar(20)}`,
      `${createLoadingAnimation(2)} Scanning TCP ports... ${createProgressBar(45)}`,
      `${createLoadingAnimation(0)} Checking UDP services... ${createProgressBar(70)}`,
      `${createLoadingAnimation(1)} Analyzing responses... ${createProgressBar(90)}`,
      `${createLoadingAnimation(2)} Generating report... ${createProgressBar(100)}`,
      '',
      createAnimatedText('SCAN COMPLETE', 'glitch'),
      '',
      '🔍 Open Ports Found:',
      '  • 22/tcp   SSH     OpenSSH 8.0',
      '  • 80/tcp   HTTP    nginx 1.18.0',
      '  • 443/tcp  HTTPS   nginx 1.18.0',
      '  • 3000/tcp HTTP    Node.js Express',
      '',
      '🛡️ Security Assessment:',
      '  ⚠️  SSH service detected - potential entry point',
      '  ✅ HTTPS enabled - encrypted traffic',
      '  🔍 Development server running - investigate further',
      '',
      await simulateNetworkScan(target)
    ];
    
    return {
      output: scanResults.join('\n'),
      type: 'success',
      playSound: 'scan'
    };
  }
};

const hashCommand: Command = {
  name: 'hash',
  description: 'Generate or crack password hashes',
  aliases: ['md5', 'sha1', 'crack'],
  hidden: false,
  requiresAuth: true,
  adminOnly: false,
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
  hidden: false,
  requiresAuth: false,
  adminOnly: false,
  usage: 'hack [target]',
  handler: async (args: string[], context: TerminalContext): Promise<CommandResult> => {
    const target = args[0] || 'localhost';
    
    const hackingSteps = [
      `🎯 ${createAnimatedText('Target acquired: ' + target, 'glitch')}`,
      `🔍 Scanning for vulnerabilities... ${createProgressBar(25)}`,
      `⚡ Exploiting buffer overflow... ${createProgressBar(50)}`,
      `🔓 Bypassing firewall... ${createProgressBar(75)}`,
      `💾 Accessing mainframe... ${createProgressBar(90)}`,
      `🚀 Root access obtained! ${createProgressBar(100)}`,
      '',
      createAnimatedText('SYSTEM BREACH SUCCESSFUL', 'matrix'),
      createLoadingAnimation(0) + ' Extracting sensitive data...',
      createLoadingAnimation(1) + ' Planting backdoor...',
      createLoadingAnimation(2) + ' Covering tracks...'
    ];
    
    return {
      output: hackingSteps.join('\n') + `\n\n🏆 Successfully hacked ${target}!\n\n💀 HACKER MODE ACTIVATED 💀\n\n${asciiArt.skull}`,
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
  requiresAuth: false,
  adminOnly: false,
  handler: async (): Promise<CommandResult> => {
    const matrixText = [
      createAnimatedText('ENTERING THE MATRIX...', 'matrix'),
      '',
      asciiArt.matrix,
      '',
      createAnimatedText('"There is no spoon." - Neo', 'glitch'),
      '',
      '🔴 Take the red pill, or 🔵 take the blue pill?',
      '',
      createLoadingAnimation(0) + ' Reality.exe loading...',
      createLoadingAnimation(1) + ' Consciousness.dll initialized...',
      createLoadingAnimation(2) + ' Welcome to the real world.'
    ];
    
    return {
      output: matrixText.join('\n'),
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
  hidden: false,
  requiresAuth: true,
  adminOnly: false,
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
        // Check if already solved
        if (context.gameState.solvedChallenges?.includes(challengeId)) {
          return {
            output: '✅ You have already solved this challenge!',
            type: 'info'
          };
        }

        // Use GameStateManager to handle the solution
        const gameManager = context.gameManager;
        if (gameManager) {
          const result = gameManager.solveChallenge(challengeId);
          if (result.success) {
            const achievements = [];
            
            // Check for new achievements
            const currentAchievements = gameManager.getGameState().achievements;
            const newAchievements = currentAchievements.filter((a: any) => 
              Date.now() - a.unlockedAt.getTime() < 1000 // Recently unlocked (within 1 second)
            );
            
            achievements.push(...newAchievements);
            
            return {
              output: `🎉 Correct! Flag accepted!\n\nPoints earned: ${challenge.points}\nExperience gained: ${challenge.points}\n${result.reward.levelUp ? `\n🎊 LEVEL UP! You are now level ${result.reward.newLevel}!` : ''}\n\n${challenge.reward || 'Great job, hacker!'}`,
              type: 'success',
              playSound: 'victory',
              achievements: achievements,
              experienceGained: challenge.points
            };
          }
        }
        
        // Fallback if GameStateManager is not available
        return {
          output: `🎉 Correct! Flag accepted!\n\nPoints earned: ${challenge.points}\n\n${challenge.reward || 'Great job, hacker!'}`,
          type: 'success',
          playSound: 'victory',
          experienceGained: challenge.points
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
  hidden: false,
  requiresAuth: false,
  adminOnly: false,
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
  hidden: false,
  requiresAuth: true,
  adminOnly: true,
  usage: 'su <username>',
  handler: async (args: string[], context: TerminalContext): Promise<CommandResult> => {
    if (args.length === 0) {
      return { output: 'Usage: su <username>', type: 'warning' };
    }
    
    const targetUser = args[0];
    
    // Use AuthManager for proper user switching
     if (context.gameManager && context.gameManager.authManager) {
       const switchResult = context.gameManager.authManager.switchUser(targetUser, 'toor');
       if (switchResult.success) {
         // Update context user
         context.user.username = targetUser;
         context.user.accessLevel = switchResult.user?.role as AccessLevel || 'user';
       }
       return {
         output: switchResult.message,
         type: switchResult.success ? 'success' : 'error',
         triggerEffect: switchResult.success && targetUser === 'root' ? 'screen_glitch' : undefined
       };
     }
    
    // Fallback for backward compatibility
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
};

const statsCommand: Command = {
  name: 'stats',
  description: 'Display your game statistics and achievements',
  aliases: ['status', 'profile'],
  hidden: false,
  requiresAuth: false,
  adminOnly: false,
  handler: async (args: string[], context: TerminalContext): Promise<CommandResult> => {
    const gameManager = context.gameManager;
    if (!gameManager) {
      return {
        output: 'Game system not initialized.',
        type: 'error'
      };
    }

    const gameState = gameManager.getGameState();
    const stats = gameManager.getStats();
    
    let output = `📊 ${createAnimatedText('YOUR HACKER PROFILE', 'matrix')}\n\n`;
    
    // Basic stats
    output += `🎯 Level: ${gameState.level} ${createProgressBar((gameState.level / 10) * 100, 15)}\n`;
    output += `⚡ Experience: ${gameState.experience} XP ${createProgressBar((gameState.experience % 100), 20)}\n`;
    output += `🏆 Score: ${gameState.score}\n`;
    output += `🔥 Current Streak: ${gameState.currentStreak}\n`;
    output += `🌟 Best Streak: ${gameState.bestStreak}\n\n`;
    
    // Achievements
    if (gameState.achievements.length > 0) {
      output += `🏅 ${createAnimatedText('ACHIEVEMENTS UNLOCKED', 'glitch')}:\n`;
      gameState.achievements.forEach((achievement: any) => {
        output += `  🏆 ${achievement.name} - ${achievement.description}\n`;
      });
      output += '\n';
    } else {
      output += '🏅 No achievements yet. Try completing some challenges!\n\n';
    }
    
    // Activity stats
    output += `📈 ${createAnimatedText('ACTIVITY STATS', 'matrix')}:\n`;
    stats.forEach((stat: string) => {
      output += `  ${stat}\n`;
    });
    
    output += '\n💡 Tip: Complete CTF challenges to gain more XP and unlock achievements!';
    
    return {
      output,
      type: 'info'
    };
  }
};

const artCommand: Command = {
  name: 'art',
  description: 'Display ASCII art gallery with effects',
  aliases: ['gallery', 'ascii'],
  hidden: false,
  requiresAuth: false,
  adminOnly: false,
  usage: 'art [random|list|<name>]',
  handler: async (args: string[]): Promise<CommandResult> => {
    const artNames = Object.keys(asciiArt);
    
    if (args[0] === 'list') {
      return {
        output: `🎨 ${createAnimatedText('ASCII ART GALLERY', 'matrix')}\n\n` +
                `Available art pieces:\n` +
                artNames.map(name => `  • ${name}`).join('\n') +
                `\n\n💡 Use 'art <name>' to display specific art or 'art random' for surprise!`,
        type: 'success'
      };
    }
    
    let selectedArt: string;
    let artName: string;
    
    if (args[0] === 'random' || !args[0]) {
      artName = artNames[Math.floor(Math.random() * artNames.length)];
      selectedArt = asciiArt[artName as keyof typeof asciiArt];
    } else {
      artName = args[0].toLowerCase();
      if (artNames.includes(artName)) {
        selectedArt = asciiArt[artName as keyof typeof asciiArt];
      } else {
        return {
          output: `❌ Art piece '${artName}' not found. Use 'art list' to see available options.`,
          type: 'error'
        };
      }
    }
    
    const effects = [
      createAnimatedText(`Displaying: ${artName.toUpperCase()}`, 'glitch'),
      '',
      selectedArt,
      '',
      createLoadingAnimation(0) + ' Rendering pixels...',
      createLoadingAnimation(1) + ' Applying effects...',
      createLoadingAnimation(2) + ' Art display complete!'
    ];
    
    return {
      output: effects.join('\n'),
      type: 'success',
      triggerEffect: 'screen_glitch'
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
  suCommand,
  statsCommand,
  artCommand
];