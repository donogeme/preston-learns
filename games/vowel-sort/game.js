/**
 * Vowel Sound Sort - Game Logic
 * Preston Learns to distinguish short vs long vowel sounds
 */

// Word banks with emojis for visual support
const wordBanks = {
  shortA: [
    { word: 'cat', emoji: '🐱' },
    { word: 'hat', emoji: '🎩' },
    { word: 'bat', emoji: '🦇' },
    { word: 'map', emoji: '🗺️' },
    { word: 'cap', emoji: '🧢' },
    { word: 'tap', emoji: '🚰' },
    { word: 'nap', emoji: '😴' },
    { word: 'bag', emoji: '👜' },
    { word: 'tag', emoji: '🏷️' },
    { word: 'sad', emoji: '😢' },
    { word: 'dad', emoji: '👨' },
    { word: 'mad', emoji: '😠' },
    { word: 'pan', emoji: '🍳' },
    { word: 'can', emoji: '🥫' },
    { word: 'man', emoji: '🧑' },
    { word: 'fan', emoji: '🪭' },
    { word: 'rat', emoji: '🐀' },
    { word: 'jam', emoji: '🍯' },
    { word: 'ham', emoji: '🍖' },
    { word: 'van', emoji: '🚐' }
  ],
  longA: [
    { word: 'cake', emoji: '🎂' },
    { word: 'make', emoji: '🔨' },
    { word: 'lake', emoji: '🏞️' },
    { word: 'bake', emoji: '🧁' },
    { word: 'name', emoji: '📛' },
    { word: 'game', emoji: '🎮' },
    { word: 'same', emoji: '♊' },
    { word: 'tape', emoji: '📼' },
    { word: 'cape', emoji: '🦸' },
    { word: 'grape', emoji: '🍇' },
    { word: 'plane', emoji: '✈️' },
    { word: 'rain', emoji: '🌧️' },
    { word: 'train', emoji: '🚂' },
    { word: 'tail', emoji: '🐕' },
    { word: 'mail', emoji: '📬' },
    { word: 'sail', emoji: '⛵' },
    { word: 'day', emoji: '☀️' },
    { word: 'play', emoji: '🎈' },
    { word: 'say', emoji: '💬' },
    { word: 'way', emoji: '🛤️' }
  ]
};

// Game state
let currentRound = [];
let currentIndex = 0;
let score = 0;
let totalWords = 10;
let isLocked = false; // Prevent rapid taps

// DOM elements
const elements = {
  playWordBtn: document.getElementById('playWordBtn'),
  currentWord: document.getElementById('currentWord'),
  currentEmoji: document.getElementById('currentEmoji'),
  shortBucket: document.getElementById('shortBucket'),
  longBucket: document.getElementById('longBucket'),
  scoreDisplay: document.getElementById('score'),
  totalDisplay: document.getElementById('total'),
  endScreen: document.getElementById('endScreen'),
  endTitle: document.getElementById('endTitle'),
  finalScore: document.getElementById('finalScore'),
  starsEarned: document.getElementById('starsEarned'),
  endMessage: document.getElementById('endMessage'),
  playAgainBtn: document.getElementById('playAgainBtn'),
  feedbackOverlay: document.getElementById('feedbackOverlay'),
  feedbackIcon: document.getElementById('feedbackIcon')
};

// Speech synthesis setup
let speechSynth = window.speechSynthesis;
let currentUtterance = null;

/**
 * Speak a word using Web Speech API
 */
function speak(text, callback) {
  // Cancel any ongoing speech
  speechSynth.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.85; // Slightly slower for clarity
  utterance.pitch = 1.0;
  
  // Try to get a good voice
  const voices = speechSynth.getVoices();
  const preferredVoice = voices.find(v => 
    v.lang.startsWith('en') && (v.name.includes('Samantha') || v.name.includes('Google US'))
  ) || voices.find(v => v.lang.startsWith('en-US'));
  
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }
  
  // Visual feedback during speech
  elements.playWordBtn.classList.add('speaking');
  
  utterance.onend = () => {
    elements.playWordBtn.classList.remove('speaking');
    if (callback) callback();
  };
  
  utterance.onerror = () => {
    elements.playWordBtn.classList.remove('speaking');
  };
  
  currentUtterance = utterance;
  speechSynth.speak(utterance);
}

/**
 * Shuffle array (Fisher-Yates)
 */
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generate a round of words (balanced short/long)
 */
function generateRound() {
  const shortWords = shuffle(wordBanks.shortA).slice(0, 5);
  const longWords = shuffle(wordBanks.longA).slice(0, 5);
  
  // Tag each word with its type
  const tagged = [
    ...shortWords.map(w => ({ ...w, type: 'short' })),
    ...longWords.map(w => ({ ...w, type: 'long' }))
  ];
  
  return shuffle(tagged);
}

/**
 * Start a new game
 */
function startGame() {
  currentRound = generateRound();
  currentIndex = 0;
  score = 0;
  isLocked = false;
  
  elements.scoreDisplay.textContent = score;
  elements.totalDisplay.textContent = totalWords;
  elements.endScreen.classList.remove('show');
  
  showCurrentWord();
}

/**
 * Display the current word
 */
function showCurrentWord() {
  if (currentIndex >= currentRound.length) {
    endGame();
    return;
  }
  
  const current = currentRound[currentIndex];
  elements.currentWord.textContent = current.word;
  elements.currentEmoji.textContent = current.emoji;
  
  // Clear bucket states
  elements.shortBucket.classList.remove('correct', 'wrong', 'highlight');
  elements.longBucket.classList.remove('correct', 'wrong', 'highlight');
  
  // Auto-play the word after a short delay
  setTimeout(() => speak(current.word), 300);
}

/**
 * Handle bucket tap
 */
function handleBucketTap(selectedType) {
  if (isLocked) return;
  isLocked = true;
  
  const current = currentRound[currentIndex];
  const isCorrect = current.type === selectedType;
  
  const selectedBucket = selectedType === 'short' ? elements.shortBucket : elements.longBucket;
  const correctBucket = current.type === 'short' ? elements.shortBucket : elements.longBucket;
  
  if (isCorrect) {
    // Correct answer
    score++;
    elements.scoreDisplay.textContent = score;
    
    selectedBucket.classList.add('correct');
    showFeedback(true);
    
    // Speak encouragement
    const praises = ['Yes!', 'Good job!', 'Great!', 'Awesome!', 'Nice!'];
    const praise = praises[Math.floor(Math.random() * praises.length)];
    setTimeout(() => speak(praise), 400);
    
    // Move to next word
    setTimeout(() => {
      currentIndex++;
      isLocked = false;
      showCurrentWord();
    }, 1500);
    
  } else {
    // Wrong answer
    selectedBucket.classList.add('wrong');
    showFeedback(false);
    
    // Highlight correct bucket
    setTimeout(() => {
      correctBucket.classList.add('highlight');
      // Speak the anchor word of the correct bucket
      const anchorWord = current.type === 'short' ? 'apple' : 'cake';
      speak(`This one goes with ${anchorWord}`);
    }, 600);
    
    // Move to next word after showing correct answer
    setTimeout(() => {
      currentIndex++;
      isLocked = false;
      showCurrentWord();
    }, 2500);
  }
}

/**
 * Show visual feedback overlay
 */
function showFeedback(isCorrect) {
  elements.feedbackIcon.textContent = isCorrect ? '✅' : '❌';
  elements.feedbackIcon.className = `feedback-icon ${isCorrect ? 'correct' : 'wrong'}`;
  elements.feedbackOverlay.classList.remove('show');
  
  // Force reflow to restart animation
  void elements.feedbackOverlay.offsetWidth;
  elements.feedbackOverlay.classList.add('show');
}

/**
 * End the game and show results
 */
function endGame() {
  const percentage = (score / totalWords) * 100;
  
  // Determine stars and message
  let stars, title, message;
  if (percentage >= 90) {
    stars = '⭐⭐⭐';
    title = 'Amazing! 🎉';
    message = "You're a vowel sound superstar!";
  } else if (percentage >= 70) {
    stars = '⭐⭐';
    title = 'Great Job! 🌟';
    message = "You're learning your vowel sounds!";
  } else if (percentage >= 50) {
    stars = '⭐';
    title = 'Good Try! 👍';
    message = "Keep practicing, you're getting it!";
  } else {
    stars = '🌟';
    title = 'Nice Effort! 💪';
    message = "Let's try again and listen carefully!";
  }
  
  elements.endTitle.textContent = title;
  elements.finalScore.textContent = score;
  elements.starsEarned.textContent = stars;
  elements.endMessage.textContent = message;
  
  // Save progress to localStorage
  saveProgress();
  
  // Show end screen
  elements.endScreen.classList.add('show');
  
  // Speak the result
  speak(`${title.replace(/[^a-zA-Z ]/g, '')} You got ${score} out of ${totalWords}!`);
}

/**
 * Save progress to localStorage
 */
function saveProgress() {
  const key = 'vowelSort_progress';
  let progress = JSON.parse(localStorage.getItem(key) || '{}');
  
  if (!progress.a) {
    progress.a = { attempts: 0, bestScore: 0, scores: [], mastered: false };
  }
  
  progress.a.attempts++;
  progress.a.bestScore = Math.max(progress.a.bestScore, score);
  progress.a.scores.push({
    score: score,
    total: totalWords,
    date: new Date().toISOString()
  });
  
  // Keep only last 20 scores
  if (progress.a.scores.length > 20) {
    progress.a.scores = progress.a.scores.slice(-20);
  }
  
  // Check mastery (3 rounds of 8+/10)
  const recentScores = progress.a.scores.slice(-5);
  const highScores = recentScores.filter(s => s.score >= 8);
  if (highScores.length >= 3) {
    progress.a.mastered = true;
  }
  
  localStorage.setItem(key, JSON.stringify(progress));
}

/**
 * Play bucket anchor word when tapped (without making a selection)
 */
function playBucketAnchor(type) {
  const word = type === 'short' ? 'apple, ah' : 'cake, ay';
  speak(word);
}

// Event Listeners
elements.playWordBtn.addEventListener('click', () => {
  if (currentIndex < currentRound.length) {
    speak(currentRound[currentIndex].word);
  }
});

elements.shortBucket.addEventListener('click', () => handleBucketTap('short'));
elements.longBucket.addEventListener('click', () => handleBucketTap('long'));

elements.playAgainBtn.addEventListener('click', startGame);

// Long press on buckets plays the anchor sound (optional enhancement)
let bucketPressTimer = null;

function handleBucketLongPress(bucket, type) {
  bucket.addEventListener('touchstart', (e) => {
    bucketPressTimer = setTimeout(() => {
      playBucketAnchor(type);
      e.preventDefault();
    }, 500);
  });
  
  bucket.addEventListener('touchend', () => {
    clearTimeout(bucketPressTimer);
  });
  
  bucket.addEventListener('touchmove', () => {
    clearTimeout(bucketPressTimer);
  });
}

handleBucketLongPress(elements.shortBucket, 'short');
handleBucketLongPress(elements.longBucket, 'long');

// Initialize speech synthesis voices (some browsers need this)
if (speechSynth.onvoiceschanged !== undefined) {
  speechSynth.onvoiceschanged = () => {
    // Voices loaded
  };
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', startGame);

// Also start immediately if DOM already ready
if (document.readyState !== 'loading') {
  startGame();
}
