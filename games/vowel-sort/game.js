/**
 * Magic E Adventure - Game Logic
 * 
 * Three-phase learning structure based on "I Do, We Do, You Do" pedagogy:
 * 1. DISCOVER (I Do): Finn models Magic E transformations
 * 2. PREDICT (We Do): Child adds Magic E with guidance
 * 3. SORT (You Do): Independent identification practice
 * 
 * Based on research from:
 * - Reading Universe (readinguniverse.org)
 * - Little Lions Literacy
 * - Starfall curriculum structure
 */

// ============================================
// WORD DATA - Minimal pairs for Magic E
// ============================================
const wordPairs = {
  // Demo words (Phase 1) - A vowel
  demo: [
    { cvc: 'cap', cvce: 'cape', emojiCvc: '🧢', emojiCvce: '🦸' },
    { cvc: 'tap', cvce: 'tape', emojiCvc: '🚰', emojiCvce: '📼' },
    { cvc: 'hat', cvce: 'hate', emojiCvc: '🎩', emojiCvce: '😠' }
  ],
  
  // Predict words (Phase 2) - Child adds the E - EXPANDED
  predict: [
    { cvc: 'mat', cvce: 'mate', emojiCvc: '🧘', emojiCvce: '👫' },
    { cvc: 'can', cvce: 'cane', emojiCvc: '🥫', emojiCvce: '🦯' },
    { cvc: 'pan', cvce: 'pane', emojiCvc: '🍳', emojiCvce: '🪟' },
    { cvc: 'man', cvce: 'mane', emojiCvc: '🧑', emojiCvce: '🦁' },
    { cvc: 'rat', cvce: 'rate', emojiCvc: '🐀', emojiCvce: '⭐' },
    { cvc: 'mad', cvce: 'made', emojiCvc: '😡', emojiCvce: '🛠️' },
    // I vowel
    { cvc: 'kit', cvce: 'kite', emojiCvc: '🧰', emojiCvce: '🪁' },
    { cvc: 'pin', cvce: 'pine', emojiCvc: '📌', emojiCvce: '🌲' },
    { cvc: 'hid', cvce: 'hide', emojiCvc: '👀', emojiCvce: '🙈' },
    { cvc: 'bit', cvce: 'bite', emojiCvc: '💾', emojiCvce: '🦷' },
    { cvc: 'dim', cvce: 'dime', emojiCvc: '🌑', emojiCvce: '🪙' },
    // O vowel
    { cvc: 'hop', cvce: 'hope', emojiCvc: '🐰', emojiCvce: '🙏' },
    { cvc: 'rob', cvce: 'robe', emojiCvc: '🦹', emojiCvce: '👘' },
    { cvc: 'not', cvce: 'note', emojiCvc: '🚫', emojiCvce: '📝' },
    { cvc: 'mop', cvce: 'mope', emojiCvc: '🧹', emojiCvce: '😔' },
    // U vowel
    { cvc: 'tub', cvce: 'tube', emojiCvc: '🛁', emojiCvce: '📺' },
    { cvc: 'cub', cvce: 'cube', emojiCvc: '🐻', emojiCvce: '🧊' },
    { cvc: 'cut', cvce: 'cute', emojiCvc: '✂️', emojiCvce: '🥰' }
  ],
  
  // Sort words (Phase 3) - Mix of CVC and CVCe - EXPANDED
  sort: {
    cvc: [
      // A words
      { word: 'cat', emoji: '🐱' },
      { word: 'bat', emoji: '🦇' },
      { word: 'map', emoji: '🗺️' },
      { word: 'nap', emoji: '😴' },
      { word: 'bag', emoji: '👜' },
      { word: 'sad', emoji: '😢' },
      { word: 'dad', emoji: '👨' },
      { word: 'van', emoji: '🚐' },
      { word: 'rat', emoji: '🐀' },
      { word: 'pan', emoji: '🍳' },
      // I words
      { word: 'kit', emoji: '🧰' },
      { word: 'pin', emoji: '📌' },
      { word: 'bit', emoji: '💾' },
      { word: 'hid', emoji: '👀' },
      { word: 'fit', emoji: '💪' },
      { word: 'sit', emoji: '🪑' },
      // O words
      { word: 'hop', emoji: '🐰' },
      { word: 'mop', emoji: '🧹' },
      { word: 'hot', emoji: '🔥' },
      { word: 'pot', emoji: '🍯' },
      { word: 'dog', emoji: '🐕' },
      { word: 'log', emoji: '🪵' },
      // U words
      { word: 'tub', emoji: '🛁' },
      { word: 'cub', emoji: '🐻' },
      { word: 'cut', emoji: '✂️' },
      { word: 'bug', emoji: '🐛' },
      { word: 'rug', emoji: '🟫' },
      { word: 'sun', emoji: '☀️' }
    ],
    cvce: [
      // A words
      { word: 'cake', emoji: '🎂' },
      { word: 'lake', emoji: '🏞️' },
      { word: 'bake', emoji: '🧁' },
      { word: 'name', emoji: '📛' },
      { word: 'game', emoji: '🎮' },
      { word: 'cape', emoji: '🦸' },
      { word: 'tape', emoji: '📼' },
      { word: 'make', emoji: '🔨' },
      { word: 'race', emoji: '🏎️' },
      { word: 'face', emoji: '😊' },
      { word: 'wave', emoji: '🌊' },
      { word: 'save', emoji: '💾' },
      // I words
      { word: 'kite', emoji: '🪁' },
      { word: 'pine', emoji: '🌲' },
      { word: 'hide', emoji: '🙈' },
      { word: 'bite', emoji: '🦷' },
      { word: 'dime', emoji: '🪙' },
      { word: 'time', emoji: '⏰' },
      { word: 'ride', emoji: '🚴' },
      { word: 'bike', emoji: '🚲' },
      { word: 'fire', emoji: '🔥' },
      // O words
      { word: 'hope', emoji: '🙏' },
      { word: 'robe', emoji: '👘' },
      { word: 'note', emoji: '📝' },
      { word: 'home', emoji: '🏠' },
      { word: 'bone', emoji: '🦴' },
      { word: 'cone', emoji: '🍦' },
      { word: 'rose', emoji: '🌹' },
      { word: 'nose', emoji: '👃' },
      // U words
      { word: 'tube', emoji: '📺' },
      { word: 'cube', emoji: '🧊' },
      { word: 'cute', emoji: '🥰' },
      { word: 'huge', emoji: '🦣' },
      { word: 'fuse', emoji: '💥' }
    ]
  }
};

// ============================================
// PROGRESS TRACKER - Mastery & Spaced Repetition
// ============================================
const progressTracker = {
  // Configuration
  config: {
    masteryThreshold: 0.85,           // 85% accuracy to master
    minAttempts: 3,                   // Minimum tries before mastery possible
    consecutiveCorrect: 3,            // OR 3 correct in a row = mastered
    retentionWindow: 7 * 24 * 60 * 60 * 1000, // 7 days before review
    storageKey: 'prestonLearns_magicE_progress'
  },
  
  // Word tracking data
  words: {},
  
  // Level tracking
  currentLevel: 1,
  levelsCompleted: [],
  
  // Load from localStorage
  load() {
    try {
      const saved = localStorage.getItem(this.config.storageKey);
      if (saved) {
        const data = JSON.parse(saved);
        this.words = data.words || {};
        this.currentLevel = data.currentLevel || 1;
        this.levelsCompleted = data.levelsCompleted || [];
      }
    } catch (e) {
      console.log('No saved progress found, starting fresh');
    }
  },
  
  // Save to localStorage
  save() {
    try {
      localStorage.setItem(this.config.storageKey, JSON.stringify({
        words: this.words,
        currentLevel: this.currentLevel,
        levelsCompleted: this.levelsCompleted,
        lastSaved: Date.now()
      }));
    } catch (e) {
      console.error('Failed to save progress:', e);
    }
  },
  
  // Record an attempt for a word
  recordAttempt(word, correct) {
    if (!this.words[word]) {
      this.words[word] = {
        attempts: 0,
        correct: 0,
        streak: 0,
        lastSeen: Date.now(),
        mastered: false,
        masteredAt: null
      };
    }
    
    const w = this.words[word];
    w.attempts++;
    w.lastSeen = Date.now();
    
    if (correct) {
      w.correct++;
      w.streak++;
      
      // Check mastery conditions
      if (!w.mastered) {
        const accuracy = w.correct / w.attempts;
        if ((w.attempts >= this.config.minAttempts && accuracy >= this.config.masteryThreshold) ||
            w.streak >= this.config.consecutiveCorrect) {
          w.mastered = true;
          w.masteredAt = Date.now();
        }
      }
    } else {
      w.streak = 0;
    }
    
    this.save();
    return w;
  },
  
  // Check if word is mastered
  isMastered(word) {
    return this.words[word]?.mastered || false;
  },
  
  // Get words due for review (mastered but retention window passed)
  getDueForReview() {
    const now = Date.now();
    return Object.entries(this.words)
      .filter(([word, data]) => 
        data.mastered && 
        (now - data.lastSeen) > this.config.retentionWindow
      )
      .map(([word]) => word);
  },
  
  // Get mastery stats for current level
  getLevelStats(level) {
    const levelWords = levels[level]?.words || [];
    const allWords = [
      ...levelWords.predict.map(p => p.cvce),
      ...levelWords.sort.cvc.map(w => w.word),
      ...levelWords.sort.cvce.map(w => w.word)
    ];
    
    const mastered = allWords.filter(w => this.isMastered(w)).length;
    const total = allWords.length;
    const accuracy = allWords.reduce((sum, w) => {
      const data = this.words[w];
      if (data && data.attempts > 0) {
        return sum + (data.correct / data.attempts);
      }
      return sum;
    }, 0) / total;
    
    return { mastered, total, accuracy, percentage: (mastered / total) * 100 };
  },
  
  // Check if level is complete (ready to advance)
  isLevelComplete(level) {
    const stats = this.getLevelStats(level);
    const levelConfig = levels[level];
    return stats.mastered >= levelConfig.unlockCriteria.masteredWords &&
           stats.accuracy >= levelConfig.unlockCriteria.accuracy;
  },
  
  // Advance to next level
  advanceLevel() {
    if (!this.levelsCompleted.includes(this.currentLevel)) {
      this.levelsCompleted.push(this.currentLevel);
    }
    if (levels[this.currentLevel + 1]) {
      this.currentLevel++;
      this.save();
      return true;
    }
    return false; // No more levels
  },
  
  // Get overall stats
  getOverallStats() {
    const allWords = Object.keys(this.words);
    const mastered = allWords.filter(w => this.isMastered(w)).length;
    const totalAttempts = allWords.reduce((sum, w) => sum + this.words[w].attempts, 0);
    const totalCorrect = allWords.reduce((sum, w) => sum + this.words[w].correct, 0);
    
    return {
      wordsEncountered: allWords.length,
      wordsMastered: mastered,
      totalAttempts,
      totalCorrect,
      overallAccuracy: totalAttempts > 0 ? (totalCorrect / totalAttempts) : 0,
      currentLevel: this.currentLevel,
      levelsCompleted: this.levelsCompleted.length
    };
  }
};

// ============================================
// LEVEL DEFINITIONS
// ============================================
const levels = {
  // Level 1: Magic E with A vowel only
  1: {
    name: "Magic E - Letter A",
    description: "Learn how Magic E changes the A sound",
    vowelFocus: 'a',
    words: {
      demo: [
        { cvc: 'cap', cvce: 'cape', emojiCvc: '🧢', emojiCvce: '🦸' },
        { cvc: 'tap', cvce: 'tape', emojiCvc: '🚰', emojiCvce: '📼' },
        { cvc: 'hat', cvce: 'hate', emojiCvc: '🎩', emojiCvce: '😠' }
      ],
      predict: [
        { cvc: 'mat', cvce: 'mate', emojiCvc: '🧘', emojiCvce: '👫' },
        { cvc: 'can', cvce: 'cane', emojiCvc: '🥫', emojiCvce: '🦯' },
        { cvc: 'pan', cvce: 'pane', emojiCvc: '🍳', emojiCvce: '🪟' },
        { cvc: 'man', cvce: 'mane', emojiCvc: '🧑', emojiCvce: '🦁' },
        { cvc: 'rat', cvce: 'rate', emojiCvc: '🐀', emojiCvce: '⭐' },
        { cvc: 'mad', cvce: 'made', emojiCvc: '😡', emojiCvce: '🛠️' }
      ],
      sort: {
        cvc: [
          { word: 'cat', emoji: '🐱' },
          { word: 'bat', emoji: '🦇' },
          { word: 'map', emoji: '🗺️' },
          { word: 'nap', emoji: '😴' },
          { word: 'bag', emoji: '👜' },
          { word: 'sad', emoji: '😢' },
          { word: 'dad', emoji: '👨' },
          { word: 'van', emoji: '🚐' },
          { word: 'rat', emoji: '🐀' },
          { word: 'pan', emoji: '🍳' }
        ],
        cvce: [
          { word: 'cake', emoji: '🎂' },
          { word: 'lake', emoji: '🏞️' },
          { word: 'bake', emoji: '🧁' },
          { word: 'name', emoji: '📛' },
          { word: 'game', emoji: '🎮' },
          { word: 'cape', emoji: '🦸' },
          { word: 'tape', emoji: '📼' },
          { word: 'make', emoji: '🔨' },
          { word: 'race', emoji: '🏎️' },
          { word: 'face', emoji: '😊' },
          { word: 'wave', emoji: '🌊' },
          { word: 'save', emoji: '💾' }
        ]
      }
    },
    unlockCriteria: { masteredWords: 12, accuracy: 0.80 },
    vowelSound: 'ay'
  },
  
  // Level 2: Magic E with I vowel
  2: {
    name: "Magic E - Letter I",
    description: "Learn how Magic E changes the I sound",
    vowelFocus: 'i',
    words: {
      demo: [
        { cvc: 'kit', cvce: 'kite', emojiCvc: '🧰', emojiCvce: '🪁' },
        { cvc: 'pin', cvce: 'pine', emojiCvc: '📌', emojiCvce: '🌲' },
        { cvc: 'hid', cvce: 'hide', emojiCvc: '👀', emojiCvce: '🙈' }
      ],
      predict: [
        { cvc: 'bit', cvce: 'bite', emojiCvc: '💾', emojiCvce: '🦷' },
        { cvc: 'dim', cvce: 'dime', emojiCvc: '🌑', emojiCvce: '🪙' },
        { cvc: 'fin', cvce: 'fine', emojiCvc: '🦈', emojiCvce: '👌' },
        { cvc: 'rid', cvce: 'ride', emojiCvc: '🚮', emojiCvce: '🚴' },
        { cvc: 'win', cvce: 'wine', emojiCvc: '🏆', emojiCvce: '🍷' },
        { cvc: 'tim', cvce: 'time', emojiCvc: '👦', emojiCvce: '⏰' }
      ],
      sort: {
        cvc: [
          { word: 'kit', emoji: '🧰' },
          { word: 'pin', emoji: '📌' },
          { word: 'bit', emoji: '💾' },
          { word: 'hid', emoji: '👀' },
          { word: 'fit', emoji: '💪' },
          { word: 'sit', emoji: '🪑' },
          { word: 'dig', emoji: '⛏️' },
          { word: 'big', emoji: '🐘' },
          { word: 'pig', emoji: '🐷' },
          { word: 'wig', emoji: '💇' }
        ],
        cvce: [
          { word: 'kite', emoji: '🪁' },
          { word: 'pine', emoji: '🌲' },
          { word: 'hide', emoji: '🙈' },
          { word: 'bite', emoji: '🦷' },
          { word: 'dime', emoji: '🪙' },
          { word: 'time', emoji: '⏰' },
          { word: 'ride', emoji: '🚴' },
          { word: 'bike', emoji: '🚲' },
          { word: 'fire', emoji: '🔥' },
          { word: 'wine', emoji: '🍷' },
          { word: 'line', emoji: '📏' },
          { word: 'nine', emoji: '9️⃣' }
        ]
      }
    },
    unlockCriteria: { masteredWords: 12, accuracy: 0.80 },
    vowelSound: 'eye'
  },
  
  // Level 3: Magic E with O vowel
  3: {
    name: "Magic E - Letter O",
    description: "Learn how Magic E changes the O sound",
    vowelFocus: 'o',
    words: {
      demo: [
        { cvc: 'hop', cvce: 'hope', emojiCvc: '🐰', emojiCvce: '🙏' },
        { cvc: 'rob', cvce: 'robe', emojiCvc: '🦹', emojiCvce: '👘' },
        { cvc: 'not', cvce: 'note', emojiCvc: '🚫', emojiCvce: '📝' }
      ],
      predict: [
        { cvc: 'mop', cvce: 'mope', emojiCvc: '🧹', emojiCvce: '😔' },
        { cvc: 'cod', cvce: 'code', emojiCvc: '🐟', emojiCvce: '💻' },
        { cvc: 'rod', cvce: 'rode', emojiCvc: '🎣', emojiCvce: '🐎' },
        { cvc: 'ton', cvce: 'tone', emojiCvc: '⚖️', emojiCvce: '🎵' },
        { cvc: 'con', cvce: 'cone', emojiCvc: '🎪', emojiCvce: '🍦' },
        { cvc: 'bon', cvce: 'bone', emojiCvc: '🎀', emojiCvce: '🦴' }
      ],
      sort: {
        cvc: [
          { word: 'hop', emoji: '🐰' },
          { word: 'mop', emoji: '🧹' },
          { word: 'hot', emoji: '🔥' },
          { word: 'pot', emoji: '🍯' },
          { word: 'dog', emoji: '🐕' },
          { word: 'log', emoji: '🪵' },
          { word: 'fog', emoji: '🌫️' },
          { word: 'jog', emoji: '🏃' },
          { word: 'cot', emoji: '🛏️' },
          { word: 'dot', emoji: '⚫' }
        ],
        cvce: [
          { word: 'hope', emoji: '🙏' },
          { word: 'robe', emoji: '👘' },
          { word: 'note', emoji: '📝' },
          { word: 'home', emoji: '🏠' },
          { word: 'bone', emoji: '🦴' },
          { word: 'cone', emoji: '🍦' },
          { word: 'rose', emoji: '🌹' },
          { word: 'nose', emoji: '👃' },
          { word: 'code', emoji: '💻' },
          { word: 'rode', emoji: '🐎' },
          { word: 'tone', emoji: '🎵' },
          { word: 'pole', emoji: '🎿' }
        ]
      }
    },
    unlockCriteria: { masteredWords: 12, accuracy: 0.80 },
    vowelSound: 'oh'
  },
  
  // Level 4: Magic E with U vowel
  4: {
    name: "Magic E - Letter U",
    description: "Learn how Magic E changes the U sound",
    vowelFocus: 'u',
    words: {
      demo: [
        { cvc: 'tub', cvce: 'tube', emojiCvc: '🛁', emojiCvce: '📺' },
        { cvc: 'cub', cvce: 'cube', emojiCvc: '🐻', emojiCvce: '🧊' },
        { cvc: 'cut', cvce: 'cute', emojiCvc: '✂️', emojiCvce: '🥰' }
      ],
      predict: [
        { cvc: 'hug', cvce: 'huge', emojiCvc: '🤗', emojiCvce: '🦣' },
        { cvc: 'us', cvce: 'use', emojiCvc: '👥', emojiCvce: '🔧' },
        { cvc: 'dud', cvce: 'dude', emojiCvc: '💣', emojiCvce: '😎' },
        { cvc: 'rud', cvce: 'rude', emojiCvc: '😤', emojiCvce: '🙄' },
        { cvc: 'fus', cvce: 'fuse', emojiCvc: '😤', emojiCvce: '💥' },
        { cvc: 'mul', cvce: 'mule', emojiCvc: '✖️', emojiCvce: '🫏' }
      ],
      sort: {
        cvc: [
          { word: 'tub', emoji: '🛁' },
          { word: 'cub', emoji: '🐻' },
          { word: 'cut', emoji: '✂️' },
          { word: 'bug', emoji: '🐛' },
          { word: 'rug', emoji: '🟫' },
          { word: 'sun', emoji: '☀️' },
          { word: 'run', emoji: '🏃' },
          { word: 'fun', emoji: '🎉' },
          { word: 'bus', emoji: '🚌' },
          { word: 'hut', emoji: '🛖' }
        ],
        cvce: [
          { word: 'tube', emoji: '📺' },
          { word: 'cube', emoji: '🧊' },
          { word: 'cute', emoji: '🥰' },
          { word: 'huge', emoji: '🦣' },
          { word: 'fuse', emoji: '💥' },
          { word: 'mule', emoji: '🫏' },
          { word: 'dune', emoji: '🏜️' },
          { word: 'tune', emoji: '🎶' },
          { word: 'rule', emoji: '📏' },
          { word: 'June', emoji: '📅' }
        ]
      }
    },
    unlockCriteria: { masteredWords: 10, accuracy: 0.80 },
    vowelSound: 'you'
  },
  
  // Level 5: Mixed Review - All Vowels
  5: {
    name: "Magic E Master",
    description: "Mix all vowels together!",
    vowelFocus: 'mixed',
    words: {
      demo: [
        { cvc: 'cap', cvce: 'cape', emojiCvc: '🧢', emojiCvce: '🦸' },
        { cvc: 'kit', cvce: 'kite', emojiCvc: '🧰', emojiCvce: '🪁' },
        { cvc: 'hop', cvce: 'hope', emojiCvc: '🐰', emojiCvce: '🙏' }
      ],
      predict: [
        // Mix of all vowels
        { cvc: 'mad', cvce: 'made', emojiCvc: '😡', emojiCvce: '🛠️' },
        { cvc: 'bit', cvce: 'bite', emojiCvc: '💾', emojiCvce: '🦷' },
        { cvc: 'not', cvce: 'note', emojiCvc: '🚫', emojiCvce: '📝' },
        { cvc: 'cut', cvce: 'cute', emojiCvc: '✂️', emojiCvce: '🥰' },
        { cvc: 'pin', cvce: 'pine', emojiCvc: '📌', emojiCvce: '🌲' },
        { cvc: 'rob', cvce: 'robe', emojiCvc: '🦹', emojiCvce: '👘' }
      ],
      sort: {
        cvc: [
          // A
          { word: 'cat', emoji: '🐱' },
          { word: 'map', emoji: '🗺️' },
          // I
          { word: 'sit', emoji: '🪑' },
          { word: 'big', emoji: '🐘' },
          // O
          { word: 'hot', emoji: '🔥' },
          { word: 'dog', emoji: '🐕' },
          // U
          { word: 'sun', emoji: '☀️' },
          { word: 'bug', emoji: '🐛' }
        ],
        cvce: [
          // A
          { word: 'cake', emoji: '🎂' },
          { word: 'wave', emoji: '🌊' },
          // I
          { word: 'bike', emoji: '🚲' },
          { word: 'fire', emoji: '🔥' },
          // O
          { word: 'home', emoji: '🏠' },
          { word: 'nose', emoji: '👃' },
          // U
          { word: 'cube', emoji: '🧊' },
          { word: 'tune', emoji: '🎶' }
        ]
      }
    },
    unlockCriteria: { masteredWords: 12, accuracy: 0.85 },
    vowelSound: 'mixed'
  }
};

// ============================================
// GAME STATE
// ============================================
const state = {
  phase: 'discover',
  discoverStep: 0,
  predictIndex: 0,
  sortIndex: 0,
  sortRound: [],
  score: 0,
  totalSortWords: 8,
  isLocked: false,
  currentLevelData: null,
  showingLevelSelect: false
};

// Get current level's word data
function getCurrentLevelWords() {
  return levels[progressTracker.currentLevel]?.words || wordPairs;
}

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
  // Phases
  phaseDiscover: document.getElementById('phaseDiscover'),
  phasePredict: document.getElementById('phasePredict'),
  phaseSort: document.getElementById('phaseSort'),
  phaseEnd: document.getElementById('phaseEnd'),
  
  // Discover phase
  startDiscover: document.getElementById('startDiscover'),
  startPredict: document.getElementById('startPredict'),
  
  // Predict phase
  predictProgress: document.getElementById('predictProgress'),
  predictWord: document.getElementById('predictWord'),
  predictEmoji: document.getElementById('predictEmoji'),
  predictLabel: document.getElementById('predictLabel'),
  predictPrompt: document.getElementById('predictPrompt'),
  predictAddE: document.getElementById('predictAddE'),
  predictResult: document.getElementById('predictResult'),
  resultText: document.getElementById('resultText'),
  predictNext: document.getElementById('predictNext'),
  
  // Sort phase
  starContainer: document.getElementById('starContainer'),
  sortEmoji: document.getElementById('sortEmoji'),
  sortWord: document.getElementById('sortWord'),
  playSortWord: document.getElementById('playSortWord'),
  bucketNo: document.getElementById('bucketNo'),
  bucketYes: document.getElementById('bucketYes'),
  
  // End phase
  endTitle: document.getElementById('endTitle'),
  endMessage: document.getElementById('endMessage'),
  finalStars: document.getElementById('finalStars'),
  playAgain: document.getElementById('playAgain'),
  
  // Modal
  parentModal: document.getElementById('parentModal'),
  infoBtn: document.getElementById('infoBtn'),
  closeModal: document.getElementById('closeModal'),
  modalDone: document.getElementById('modalDone'),
  
  // Feedback
  feedbackOverlay: document.getElementById('feedbackOverlay'),
  feedbackIcon: document.getElementById('feedbackIcon'),
  sparkleContainer: document.getElementById('sparkleContainer')
};

// ============================================
// SPEECH SYNTHESIS
// ============================================
let speechSynth = window.speechSynthesis;

function speak(text, callback) {
  speechSynth.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.75; // Slower for kids
  utterance.pitch = 1.1;
  
  const voices = speechSynth.getVoices();
  const preferredVoice = voices.find(v => 
    v.lang.startsWith('en') && (v.name.includes('Samantha') || v.name.includes('Google US'))
  ) || voices.find(v => v.lang.startsWith('en-US'));
  
  if (preferredVoice) utterance.voice = preferredVoice;
  
  utterance.onend = () => { if (callback) callback(); };
  speechSynth.speak(utterance);
}

function speakSequence(phrases, delayMs = 500, callback) {
  let index = 0;
  function next() {
    if (index >= phrases.length) {
      if (callback) callback();
      return;
    }
    speak(phrases[index], () => {
      index++;
      setTimeout(next, delayMs);
    });
  }
  next();
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function showPhase(phaseName) {
  document.querySelectorAll('.phase-screen').forEach(p => p.classList.add('hidden'));
  document.getElementById(`phase${capitalize(phaseName)}`).classList.remove('hidden');
  state.phase = phaseName;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function createSparkles(element) {
  const rect = element.getBoundingClientRect();
  const container = elements.sparkleContainer;
  
  for (let i = 0; i < 12; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.textContent = '✨';
    sparkle.style.left = `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 100}px`;
    sparkle.style.top = `${rect.top + rect.height / 2 + (Math.random() - 0.5) * 60}px`;
    sparkle.style.animationDelay = `${Math.random() * 0.3}s`;
    container.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 1000);
  }
}

function showFeedback(isCorrect) {
  elements.feedbackIcon.textContent = isCorrect ? '✅' : '🔄';
  elements.feedbackIcon.className = `feedback-icon ${isCorrect ? 'correct' : 'tryagain'}`;
  elements.feedbackOverlay.classList.remove('show');
  void elements.feedbackOverlay.offsetWidth;
  elements.feedbackOverlay.classList.add('show');
}

// ============================================
// PHASE 1: DISCOVER (I Do)
// ============================================
function initDiscover() {
  state.discoverStep = 0;
  showPhase('discover');
  showDiscoverStep('intro');
  
  setTimeout(() => {
    speak("Hi! I'm Finn. Today we learn about the Magic E!");
  }, 500);
}

function showDiscoverStep(stepName) {
  document.querySelectorAll('.discover-step').forEach(s => s.classList.remove('active'));
  document.querySelector(`[data-step="${stepName}"]`).classList.add('active');
}

function runDemoSequence(demoNum) {
  const levelWords = getCurrentLevelWords();
  const pair = levelWords.demo[demoNum - 1];
  const step = document.querySelector(`[data-step="demo${demoNum}"]`);
  const magicE = step.querySelector('.magic-e');
  const wand = document.getElementById(`addMagicE${demoNum}`);
  const nextBtn = document.getElementById(`nextDemo${demoNum}`);
  const instruction = document.getElementById(`demoInstruction${demoNum}`);
  const label = document.getElementById(`demoLabel${demoNum}`);
  const emoji = document.getElementById(`demoEmoji${demoNum}`);
  
  // Reset state
  magicE.classList.add('hidden');
  wand.classList.add('hidden');
  nextBtn.classList.add('hidden');
  
  // Step 1: Say CVC word
  speak(pair.cvc, () => {
    // Step 2: Show wand button
    setTimeout(() => {
      instruction.innerHTML = `Now watch the <strong>Magic E</strong>!`;
      wand.classList.remove('hidden');
      speak("Now watch the Magic E!");
    }, 500);
  });
  
  // Wand button click
  wand.onclick = () => {
    wand.classList.add('hidden');
    
    // Animate Magic E appearing
    magicE.classList.remove('hidden');
    magicE.classList.add('appearing');
    createSparkles(magicE);
    
    // Highlight the vowel
    step.querySelector('.vowel').classList.add('powered');
    
    setTimeout(() => {
      // Update word and emoji
      label.textContent = pair.cvce;
      emoji.textContent = pair.emojiCvce;
      
      // Speak explanation
      const level = levels[progressTracker.currentLevel];
      const vowelSound = level?.vowelSound || 'ay';
      const vowelLetter = level?.vowelFocus?.toUpperCase() || 'A';
      speakSequence([
        pair.cvce,
        `The E made the ${vowelLetter} say its name: ${vowelSound}!`
      ], 400, () => {
        instruction.innerHTML = `<strong>${pair.cvc}</strong> became <strong>${pair.cvce}</strong>!`;
        nextBtn.classList.remove('hidden');
      });
    }, 600);
  };
  
  // Next button
  nextBtn.onclick = () => {
    if (demoNum < 3) {
      showDiscoverStep(`demo${demoNum + 1}`);
      setTimeout(() => runDemoSequence(demoNum + 1), 300);
    } else {
      showDiscoverStep('summary');
      const level = levels[progressTracker.currentLevel];
      const vowelSound = level?.vowelSound || 'ay';
      const vowelLetter = level?.vowelFocus?.toUpperCase() || 'A';
      setTimeout(() => {
        speakSequence([
          "The Magic E Rule!",
          "When we add E to the end,",
          `The ${vowelLetter} says its name: ${vowelSound}!`
        ], 600);
      }, 300);
    }
  };
}

// ============================================
// PHASE 2: PREDICT (We Do)
// ============================================
function initPredict() {
  state.predictIndex = 0;
  showPhase('predict');
  renderPredictProgress();
  showPredictWord();
}

function renderPredictProgress() {
  const levelWords = getCurrentLevelWords();
  const container = elements.predictProgress;
  container.innerHTML = '';
  
  for (let i = 0; i < levelWords.predict.length; i++) {
    const dot = document.createElement('span');
    dot.className = 'progress-dot';
    if (i < state.predictIndex) dot.classList.add('done');
    if (i === state.predictIndex) dot.classList.add('current');
    container.appendChild(dot);
  }
}

function showPredictWord() {
  const levelWords = getCurrentLevelWords();
  if (state.predictIndex >= levelWords.predict.length) {
    // Done with predict phase
    setTimeout(() => {
      speakSequence(["Great job!", "Now let's find the Magic E words!"], 400, () => {
        initSort();
      });
    }, 500);
    return;
  }
  
  const pair = levelWords.predict[state.predictIndex];
  
  // Build word display with individual letters
  elements.predictWord.innerHTML = '';
  for (let i = 0; i < pair.cvc.length; i++) {
    const span = document.createElement('span');
    span.className = 'letter';
    if (i === 1) span.classList.add('vowel'); // Middle vowel
    span.textContent = pair.cvc[i];
    elements.predictWord.appendChild(span);
  }
  
  // Add hidden Magic E
  const magicE = document.createElement('span');
  magicE.className = 'letter magic-e hidden';
  magicE.textContent = 'e';
  elements.predictWord.appendChild(magicE);
  
  elements.predictEmoji.textContent = pair.emojiCvc;
  elements.predictLabel.textContent = pair.cvc;
  elements.predictPrompt.textContent = `What happens when we add Magic E to "${pair.cvc}"?`;
  elements.predictAddE.classList.remove('hidden');
  elements.predictResult.classList.add('hidden');
  
  // Play the CVC word
  setTimeout(() => speak(pair.cvc), 300);
}

function handlePredictAddE() {
  const levelWords = getCurrentLevelWords();
  const pair = levelWords.predict[state.predictIndex];
  const magicE = elements.predictWord.querySelector('.magic-e');
  const vowel = elements.predictWord.querySelector('.vowel');
  
  elements.predictAddE.classList.add('hidden');
  
  // Animate Magic E
  magicE.classList.remove('hidden');
  magicE.classList.add('appearing');
  createSparkles(magicE);
  
  // Power up the vowel
  vowel.classList.add('powered');
  
  setTimeout(() => {
    // Transform word
    elements.predictLabel.textContent = pair.cvce;
    elements.predictEmoji.textContent = pair.emojiCvce;
    
    // Show result
    elements.resultText.textContent = `${pair.cvc} → ${pair.cvce}!`;
    elements.predictResult.classList.remove('hidden');
    
    speakSequence([pair.cvce, "You did it!"], 400);
  }, 600);
}

function handlePredictNext() {
  state.predictIndex++;
  renderPredictProgress();
  
  // Reset vowel state
  const vowel = elements.predictWord.querySelector('.vowel');
  if (vowel) vowel.classList.remove('powered');
  
  showPredictWord();
}

// ============================================
// PHASE 3: SORT (You Do)
// ============================================
function initSort() {
  const levelWords = getCurrentLevelWords();
  state.sortIndex = 0;
  state.score = 0;
  
  // Build mixed round: half CVC, half CVCe
  const halfCount = Math.ceil(state.totalSortWords / 2);
  const cvcWords = shuffle(levelWords.sort.cvc).slice(0, halfCount).map(w => ({ ...w, type: 'cvc' }));
  const cvceWords = shuffle(levelWords.sort.cvce).slice(0, state.totalSortWords - halfCount).map(w => ({ ...w, type: 'cvce' }));
  state.sortRound = shuffle([...cvcWords, ...cvceWords]);
  
  showPhase('sort');
  renderSortStars();
  showSortWord();
}

function renderSortStars() {
  const container = elements.starContainer;
  container.innerHTML = '';
  
  for (let i = 0; i < state.totalSortWords; i++) {
    const star = document.createElement('span');
    star.className = 'progress-star';
    if (i < state.score) {
      star.textContent = '⭐';
      star.classList.add('earned');
    } else if (i < state.sortIndex) {
      star.textContent = '☆';
      star.classList.add('missed');
    } else {
      star.textContent = '☆';
      star.classList.add('pending');
    }
    container.appendChild(star);
  }
}

function showSortWord() {
  if (state.sortIndex >= state.sortRound.length) {
    endGame();
    return;
  }
  
  const word = state.sortRound[state.sortIndex];
  elements.sortWord.textContent = word.word;
  elements.sortEmoji.textContent = word.emoji;
  
  // Reset bucket states
  elements.bucketNo.classList.remove('correct', 'wrong', 'highlight');
  elements.bucketYes.classList.remove('correct', 'wrong', 'highlight');
  
  // Play word
  setTimeout(() => speak(word.word), 300);
}

function handleSortBucket(selectedType) {
  if (state.isLocked) return;
  state.isLocked = true;
  
  const word = state.sortRound[state.sortIndex];
  const isCorrect = (selectedType === 'cvce' && word.type === 'cvce') || 
                   (selectedType === 'cvc' && word.type === 'cvc');
  
  // Track progress
  progressTracker.recordAttempt(word.word, isCorrect);
  
  const selectedBucket = selectedType === 'cvce' ? elements.bucketYes : elements.bucketNo;
  const correctBucket = word.type === 'cvce' ? elements.bucketYes : elements.bucketNo;
  
  if (isCorrect) {
    state.score++;
    renderSortStars();
    selectedBucket.classList.add('correct');
    showFeedback(true);
    
    const praises = ['Yes!', 'Good job!', 'You got it!', 'Awesome!'];
    speak(praises[Math.floor(Math.random() * praises.length)]);
    
    setTimeout(() => {
      state.sortIndex++;
      state.isLocked = false;
      showSortWord();
    }, 2000);
  } else {
    selectedBucket.classList.add('wrong');
    showFeedback(false);
    
    setTimeout(() => {
      correctBucket.classList.add('highlight');
      
      const hasMagicE = word.type === 'cvce';
      const level = levels[progressTracker.currentLevel];
      const vowelSound = level?.vowelSound || 'ay';
      const explanation = hasMagicE 
        ? `${word.word} has Magic E! Hear the ${vowelSound} sound?`
        : `${word.word} doesn't have Magic E.`;
      
      speak(explanation, () => {
        setTimeout(() => {
          state.sortIndex++;
          state.isLocked = false;
          showSortWord();
        }, 1500);
      });
    }, 600);
  }
}

// ============================================
// END GAME
// ============================================
function endGame() {
  showPhase('end');
  
  const percentage = (state.score / state.totalSortWords) * 100;
  const stats = progressTracker.getOverallStats();
  const levelStats = progressTracker.getLevelStats(progressTracker.currentLevel);
  const canAdvance = progressTracker.isLevelComplete(progressTracker.currentLevel);
  const level = levels[progressTracker.currentLevel];
  
  let title, message, voiceMessage;
  
  if (percentage >= 80) {
    title = 'Amazing! 🎉';
    message = canAdvance && levels[progressTracker.currentLevel + 1]
      ? `You're ready for ${levels[progressTracker.currentLevel + 1].name}!`
      : "You're a Magic E expert!";
    voiceMessage = `Amazing! You got ${state.score} out of ${state.totalSortWords}! ${
      canAdvance ? "You're ready for the next level!" : "You're a Magic E expert!"
    }`;
  } else if (percentage >= 60) {
    title = 'Great Job! 🌟';
    message = `Level ${progressTracker.currentLevel}: ${Math.round(levelStats.percentage)}% mastered`;
    voiceMessage = `Great job! You got ${state.score}! Keep practicing!`;
  } else {
    title = 'Good Try! 👍';
    message = "Let's practice more!";
    voiceMessage = `Good try! Let's practice the Magic E more!`;
  }
  
  elements.endTitle.textContent = title;
  elements.endMessage.textContent = message;
  
  // Render final stars
  elements.finalStars.innerHTML = '';
  for (let i = 0; i < state.totalSortWords; i++) {
    const star = document.createElement('span');
    star.className = 'final-star';
    star.textContent = i < state.score ? '⭐' : '☆';
    star.style.animationDelay = `${i * 0.1}s`;
    elements.finalStars.appendChild(star);
  }
  
  // Show level info
  const levelInfo = document.createElement('div');
  levelInfo.className = 'level-info';
  levelInfo.innerHTML = `
    <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">
      📊 Level ${progressTracker.currentLevel}: ${level.name}<br>
      ✅ ${stats.wordsMastered} words mastered overall
    </p>
  `;
  elements.finalStars.after(levelInfo);
  
  // Show next level button if ready
  if (canAdvance && levels[progressTracker.currentLevel + 1]) {
    const nextLevelBtn = document.createElement('button');
    nextLevelBtn.className = 'btn btn-primary';
    nextLevelBtn.style.marginTop = '1rem';
    nextLevelBtn.innerHTML = `🚀 Try ${levels[progressTracker.currentLevel + 1].name}`;
    nextLevelBtn.onclick = () => {
      progressTracker.advanceLevel();
      speak(`Great! Let's learn Magic E with the letter ${levels[progressTracker.currentLevel].vowelFocus.toUpperCase()}!`);
      setTimeout(initDiscover, 500);
    };
    levelInfo.appendChild(nextLevelBtn);
  }
  
  setTimeout(() => speak(voiceMessage), 300);
}

// ============================================
// MODAL
// ============================================
function openModal() {
  elements.parentModal.classList.remove('hidden');
}

function closeModal() {
  elements.parentModal.classList.add('hidden');
}

// ============================================
// EVENT LISTENERS
// ============================================
elements.startDiscover.addEventListener('click', () => {
  showDiscoverStep('demo1');
  setTimeout(() => runDemoSequence(1), 300);
});

elements.startPredict.addEventListener('click', initPredict);

elements.predictAddE.addEventListener('click', handlePredictAddE);
elements.predictNext.addEventListener('click', handlePredictNext);

elements.playSortWord.addEventListener('click', () => {
  if (state.sortIndex < state.sortRound.length) {
    speak(state.sortRound[state.sortIndex].word);
  }
});

elements.bucketNo.addEventListener('click', () => handleSortBucket('cvc'));
elements.bucketYes.addEventListener('click', () => handleSortBucket('cvce'));

elements.playAgain.addEventListener('click', () => {
  // Clean up level info from end screen
  document.querySelectorAll('.level-info').forEach(el => el.remove());
  speak("Let's learn Magic E again!");
  setTimeout(initDiscover, 500);
});

elements.infoBtn?.addEventListener('click', openModal);
elements.closeModal?.addEventListener('click', closeModal);
elements.modalDone?.addEventListener('click', closeModal);
elements.parentModal?.addEventListener('click', (e) => {
  if (e.target === elements.parentModal) closeModal();
});

// Initialize voices
if (speechSynth.onvoiceschanged !== undefined) {
  speechSynth.onvoiceschanged = () => {};
}

// ============================================
// INITIALIZE
// ============================================
// Load saved progress
progressTracker.load();

// Start the game
function startGame() {
  // Remove any lingering level info from previous sessions
  document.querySelectorAll('.level-info').forEach(el => el.remove());
  initDiscover();
}

document.addEventListener('DOMContentLoaded', startGame);
if (document.readyState !== 'loading') startGame();
