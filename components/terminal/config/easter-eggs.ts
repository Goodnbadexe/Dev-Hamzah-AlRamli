import { EasterEgg, TerminalContext } from '../types';
import { asciiArt } from '../utils/ascii-art';

export const easterEggs: EasterEgg[] = [
  // Secret unlock commands
  {
    trigger: 'hacktheplanet',
    response: `🌍 HACK THE PLANET! 🌍\n\n${asciiArt.planet}\n\n"We are all connected. Each computer terminal is a node in the network of human consciousness."\n\n🎉 Achievement Unlocked: Planet Hacker!\n💡 Secret tip: Try 'matrix' command!`,
    sound: 'achievement',
    effect: 'screen_flash',
    oneTime: true
  },
  
  {
    trigger: 'konami',
    response: `🎮 KONAMI CODE DETECTED! 🎮\n\n${asciiArt.gamepad}\n\n↑↑↓↓←→←→BA\n\n🚀 30 Lives Granted!\n🎯 Cheat Mode: ACTIVATED\n\n(Just kidding, but you get style points!)`,
    sound: 'powerup',
    effect: 'rainbow_text',
    oneTime: true
  },
  
  {
    trigger: 'exact:42',
    response: `🤖 The Answer to the Ultimate Question of Life, the Universe, and Everything!\n\n${asciiArt.robot}\n\n"Don't Panic!" - The Hitchhiker's Guide to the Galaxy\n\n🎉 Deep Thought approves of your knowledge!`,
    sound: 'sci_fi',
    oneTime: true
  },
  
  // Behavior-based Easter eggs
  {
    trigger: 'help',
    response: 'Really? Help again? 🤔\n\nMaybe try actually USING some commands instead of just reading about them!\n\n💡 Pro tip: The best way to learn is by doing!',
    condition: (context: TerminalContext) => context.behaviorTracker.consecutiveHelps > 5,
    sound: 'sigh'
  },
  
  {
    trigger: 'clear',
    response: `🧹 Cleaning obsession detected!\n\nYou've cleared the screen multiple times.\n\nMaybe it's time to make some mess? Try exploring other commands! 😄`,
    condition: (context: TerminalContext) => (context.behaviorTracker.commandCounts.get('clear') || 0) > 10
  },
  
  // Fun responses to common typos
  {
    trigger: 'regex:^hel+p*$',
    response: 'Did you mean "help"? 🤓\n\nLooks like your keyboard is having a moment! Try again with proper spelling.',
    sound: 'error_gentle'
  },
  
  {
    trigger: 'regex:^cle+a*r*$',
    response: 'Almost there! Did you mean "clear"? 🎯\n\nClose enough - I can read your mind! 🧠',
    sound: 'error_gentle'
  },
  
  // Pop culture references
  {
    trigger: 'winter is coming',
    response: `❄️ WINTER IS COMING ❄️\n\n${asciiArt.wolf}\n\n"The man who passes the sentence should swing the sword."\n- Ned Stark\n\n🗡️ House Stark remembers your reference!`,
    sound: 'dramatic',
    oneTime: true
  },
  
  {
    trigger: 'may the force',
    response: `⭐ MAY THE FORCE BE WITH YOU ⭐\n\n${asciiArt.lightsaber}\n\n"Do or do not, there is no try." - Yoda\n\n🌟 The Force is strong with this one!`,
    sound: 'lightsaber',
    oneTime: true
  },
  
  {
    trigger: 'i am your father',
    response: `👨‍👦 NOOOOOOOOO! 👨‍👦\n\n"That's impossible!" - Luke Skywalker\n\n${asciiArt.vader}\n\n🖤 The dark side is strong with you!`,
    sound: 'vader_breathing',
    oneTime: true
  },
  
  // Hacker culture references
  {
    trigger: 'regex:(anonymous|we are legion)',
    response: `👥 ANONYMOUS DETECTED 👥\n\n"We are Anonymous.\nWe are Legion.\nWe do not forgive.\nWe do not forget.\nExpect us."\n\n🎭 Remember: With great power comes great responsibility!`,
    sound: 'mysterious',
    oneTime: true
  },
  
  {
    trigger: 'regex:(mr\.?\s*robot|fsociety)',
    response: `🤖 MR. ROBOT REFERENCE DETECTED 🤖\n\n"Hello, friend."\n\n${asciiArt.fsociety}\n\n💻 fsociety approves of your taste in shows!`,
    sound: 'glitch',
    effect: 'screen_glitch',
    oneTime: true
  },
  
  // Programming jokes
  {
    trigger: 'regex:(hello\s*world|hello world)',
    response: `👋 HELLO WORLD! 👋\n\n${asciiArt.hello_world}\n\nThe first program every developer writes!\n\n🎉 Welcome to the wonderful world of coding!`,
    sound: 'welcome'
  },
  
  {
    trigger: 'regex:(404|not found)',
    response: `🔍 ERROR 404: HUMOR NOT FOUND 🔍\n\nJust kidding! Here's your humor:\n\n"Why do programmers prefer dark mode?\nBecause light attracts bugs!" 🐛\n\n😄 *ba dum tss*`,
    sound: 'drum_roll'
  },
  
  {
    trigger: 'regex:(bug|debug)',
    response: `🐛 BUG DETECTED! 🐛\n\n"It's not a bug, it's a feature!"\n- Every developer ever\n\n${asciiArt.bug}\n\n🔧 Time to debug your life choices! 😄`,
    sound: 'bug_sound'
  },
  
  // Motivational responses
  {
    trigger: 'regex:(tired|exhausted|sleepy)',
    response: `😴 FATIGUE DETECTED 😴\n\n"The best time to plant a tree was 20 years ago.\nThe second best time is now."\n\n☕ Maybe grab some coffee and keep going!\n💪 You've got this, hacker!`,
    sound: 'motivational'
  },
  
  {
    trigger: 'regex:(give up|quit|surrender)',
    response: `🚫 GIVING UP IS NOT AN OPTION! 🚫\n\n"Success is not final, failure is not fatal:\nit is the courage to continue that counts."\n- Winston Churchill\n\n🔥 Keep pushing forward! Every expert was once a beginner!`,
    sound: 'motivational',
    effect: 'screen_flash'
  },
  
  // Random fun responses
  {
    trigger: 'regex:(coffee|caffeine)',
    response: `☕ COFFEE DETECTED! ☕\n\n${asciiArt.coffee}\n\n"Code runs on coffee and determination!"\n\n⚡ Caffeine levels: MAXIMUM\n🚀 Productivity boost: ENGAGED!`,
    sound: 'coffee_sip'
  },
  
  {
    trigger: 'regex:(pizza|food)',
    response: `🍕 FUEL FOR HACKERS DETECTED! 🍕\n\n"Pizza is the universal language of programmers."\n\n${asciiArt.pizza}\n\n🎯 Optimal coding nutrition achieved!`,
    sound: 'nom_nom'
  },
  
  {
    trigger: 'regex:(cat|kitten|meow)',
    response: `🐱 FELINE DETECTED! 🐱\n\n${asciiArt.cat}\n\n"In ancient times cats were worshipped as gods;\nthey have not forgotten this."\n\n😸 Meow! *purrs in binary*`,
    sound: 'meow'
  },
  
  // Time-based responses
  {
    trigger: 'regex:(good morning|morning)',
    response: `🌅 GOOD MORNING, HACKER! 🌅\n\n"Every morning is a new opportunity to hack the day!"\n\n☕ Time to caffeinate and dominate!\n💻 Let's write some epic code today!`,
    sound: 'morning_birds'
  },
  
  {
    trigger: 'regex:(good night|goodnight|sleep)',
    response: `🌙 GOOD NIGHT, CODE WARRIOR! 🌙\n\n"Sleep is just a time when your subconscious\nsolves the bugs you couldn't fix while awake."\n\n😴 Sweet dreams of clean code and zero bugs!`,
    sound: 'lullaby'
  },
  
  // Meta responses about the terminal itself
  {
    trigger: 'regex:(who made|who created|developer)',
    response: `👨‍💻 CREATOR INQUIRY DETECTED! 👨‍💻\n\n"This terminal was crafted with love, coffee, and countless debugging sessions."\n\n🎨 Built by passionate developers who believe\nthat coding should be fun and engaging!\n\n💝 Made with ❤️ for the hacker community!`,
    sound: 'appreciation'
  },
  
  {
    trigger: 'regex:(source code|github|repo)',
    response: `📂 SOURCE CODE INQUIRY! 📂\n\n"The best way to learn is to read the source!"\n\n${asciiArt.github}\n\n🔍 Explore, learn, and contribute!\n🌟 Open source is the way!`,
    sound: 'success'
  },
  
  // Seasonal/Holiday responses
  {
    trigger: 'regex:(christmas|xmas|santa)',
    response: `🎄 HO HO HO! 🎄\n\n${asciiArt.santa}\n\n"All I want for Christmas is bug-free code!"\n\n🎁 Santa's checking his code twice!\n✨ Merry Christmas, you filthy animal! (Home Alone reference)`,
    sound: 'jingle_bells',
    oneTime: false
  },
  
  {
    trigger: 'regex:(halloween|spooky|ghost)',
    response: `👻 BOO! SPOOKY SEASON! 👻\n\n${asciiArt.ghost}\n\n"The only thing scarier than a ghost\nis a production bug on Friday evening!"\n\n🎃 Happy Halloween, brave coder!`,
    sound: 'spooky',
    effect: 'screen_flicker'
  },
  
  // Achievement-style responses
  {
    trigger: 'regex:(achievement|unlock|trophy)',
    response: `🏆 ACHIEVEMENT SYSTEM ACTIVATED! 🏆\n\n"Every command you type is progress!"\n\n🎯 Current achievements:\n• Terminal Explorer\n• Command Discoverer\n• Easter Egg Hunter\n\n🌟 Keep exploring to unlock more!`,
    sound: 'achievement'
  },
  
  // Catch-all for enthusiasm
  {
    trigger: 'regex:(awesome|amazing|cool|wow)',
    response: `🎉 ENTHUSIASM DETECTED! 🎉\n\n"Your positive energy is contagious!"\n\n⚡ Keep that awesome attitude!\n🚀 The world needs more enthusiastic hackers like you!`,
    sound: 'cheer'
  }
];

// Helper function to get random Easter egg response
export function getRandomEasterEgg(): string {
  const randomResponses = [
    '🎲 Random fact: Bananas are berries, but strawberries aren\'t!',
    '🤖 Beep boop! I\'m definitely not a robot... *nervous beeping*',
    '🎯 Fun fact: You\'re awesome! (This is scientifically proven)',
    '🌟 "The best error message is the one that never shows up." - Thomas Fuchs',
    '🎪 Welcome to the digital circus! Enjoy the show!',
    '🔮 Magic 8-Ball says: "Outlook good for more coding!"',
    '🎨 "Code is poetry written in a language only machines understand."',
    '🚀 "Houston, we have a... perfectly working system!"'
  ];
  
  return randomResponses[Math.floor(Math.random() * randomResponses.length)];
}