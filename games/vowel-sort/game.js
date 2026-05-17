/**
 * Vowel Sound Sort - Game Logic v2.0
 * Complete rewrite with all UX fixes:
 * - P0-A: Onboarding tutorial
 * - P0-B: Tap-to-hear buckets
 * - P0-C: Better wrong-answer feedback with sound comparison
 * - P0-D: Hint after 2 wrong taps
 * - P0-E: First session = 5 words
 * - P1-A: Emoji-first, minimized text
 * - P1-B: Visual star progress
 * - P1-C: Slower timing (2.5s correct, 4s wrong)
 * - P1-D: Voice-narrated end screen
 * - P1-E: Pulsing speaker button
 * - P2-F: Idle prompt after 5s
 */

// ============================================
// WORD BANKS
// ============================================
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

// ============================================
// GAME STATE
// ============================================
let currentRound = [];
let currentIndex = 0;
let score = 0;
let totalWords = 5; // P0-E: Start with 5 words for first session
let isLocked = false;
let wrongAttempts = 0; // P0-D: Track wrong attempts per word
let idleTimer = null; // P2-F: Idle prompt timer
let bucketTapMode = false; // Track if bucket was tapped (not selected)
let hasSeenTutorial = false;

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
  // Tutorial
  tutorialOverlay: document.getElementById('tutorialOverlay'),
  tutorialSkip: document.getElementById('tutorialSkip'),
  demoApple: document.getElementById('demoApple'),
  demoCake: document.getElementById('demoCake'),
  
  // Parent modal
  parentModal: document.getElementById('parentModal'),
  parentClose: document.getElementById('parentClose'),
  parentDone: document.getElementById('parentDone'),
  infoBtn: document.getElementById('infoBtn'),
  
  // Game
  gameArea: document.getElementById('gameArea'),
  playWordBtn: document.getElementById('playWordBtn'),
  currentWord: document.getElementById('currentWord'),
  currentEmoji: document.getElementById('currentEmoji'),
  shortBucket: document.getElementById('shortBucket'),
  longBucket: document.getElementById('longBucket'),
  bucketPrompt: document.getElementById('bucketPrompt'),
  
  // Score
  scoreDisplay: document.getElementById('scoreDisplay'),
  starContainer: document.getElementById('starContainer'),
  
  // End screen
  endScreen: document.getElementById('endScreen'),
  endTitle: document.getElementById('endTitle'),
  finalStars: document.getElementById('finalStars'),
  endMessage: document.getElementById('endMessage'),
  playAgainBtn: document.getElementById('playAgainBtn'),
  
  // Feedback
  feedbackOverlay: document.getElementById('feedbackOverlay'),
  feedbackIcon: document.getElementById('feedbackIcon'),
  
  // Idle prompt
  idlePrompt: document.getElementById('idlePrompt')
};

// ============================================
// SPEECH SYNTHESIS
// ============================================
let speechSynth = window.speechSynthesis;

function speak(text, callback) {
  speechSynth.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.8; // Slower for kids
  utterance.pitch = 1.1; // Slightly higher for friendliness
  
  const voices = speechSynth.getVoices();
  const preferredVoice = voices.find(v => 
    v.lang.startsWith('en') && (v.name.includes('Samantha') || v.name.includes('Google US'))
  ) || voices.find(v => v.lang.startsWith('en-US'));
  
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }
  
  // Visual feedback during speech
  elements.playWordBtn.classList.add('speaking');
  elements.playWordBtn.classList.remove('pulsing');
  
  utterance.onend = () => {
    elements.playWordBtn.classList.remove('speaking');
    elements.playWordBtn.classList.add('pulsing');
    if (callback) callback();
  };
  
  utterance.onerror = () => {
    elements.playWordBtn.classList.remove('speaking');
    elements.playWordBtn.classList.add('pulsing');
  };
  
  speechSynth.speak(utterance);
}

// Speak with a pause between phrases (for comparison)
function speakSequence(phrases, delayMs = 600, finalCallback) {
  let index = 0;
  
  function speakNext() {
    if (index >= phrases.length) {
      if (finalCallback) finalCallback();
      return;
    }
    
    speak(phrases[index], () => {
      index++;
      setTimeout(speakNext, delayMs);
    });
  }
  
  speakNext();
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

function generateRound() {
  const halfWords = Math.ceil(totalWords / 2);
  const shortWords = shuffle(wordBanks.shortA).slice(0, halfWords);
  const longWords = shuffle(wordBanks.longA).slice(0, totalWords - halfWords);
  
  const tagged = [
    ...shortWords.map(w => ({ ...w, type: 'short' })),
    ...longWords.map(w => ({ ...w, type: 'long' }))
  ];
  
  return shuffle(tagged);
}

// ============================================
// VISUAL STAR PROGRESS (P1-B)
// ============================================
function renderStars() {
  const container = elements.starContainer;
  container.innerHTML = '';
  
  for (let i = 0; i < totalWords; i++) {
    const star = document.createElement('span');
    star.className = 'progress-star';
    if (i < score) {
      star.textContent = '⭐';
      star.classList.add('earned');
    } else if (i < currentIndex) {
      star.textContent = '☆';
      star.classList.add('missed');
    } else {
      star.textContent = '☆';
      star.classList.add('pending');
    }
    container.appendChild(star);
  }
}

// ============================================
// IDLE PROMPT (P2-F)
// ============================================
function startIdleTimer() {
  clearIdleTimer();
  idleTimer = setTimeout(() => {
    elements.idlePrompt.classList.add('show');
    speak("Tap the bucket that sounds the same!");
  }, 5000);
}

function clearIdleTimer() {
  if (idleTimer) {
    clearTimeout(idleTimer);
    idleTimer = null;
  }
  elements.idlePrompt.classList.remove('show');
}

// ============================================
// TUTORIAL SYSTEM (P0-A)
// ============================================
function initTutorial() {
  // Check if returning player
  const progress = JSON.parse(localStorage.getItem('vowelSort_progress') || '{}');
  hasSeenTutorial = progress.hasSeenTutorial || false;
  
  // Determine word count (P0-E: 5 for first few sessions, then 10)
  const attempts = progress.a?.attempts || 0;
  totalWords = attempts < 3 ? 5 : 10;
  
  if (hasSeenTutorial) {
    // Skip tutorial for returning players
    elements.tutorialOverlay.style.display = 'none';
    startGame();
    return;
  }
  
  // Show tutorial
  elements.tutorialOverlay.style.display = 'flex';
  
  // Tutorial screen 1: Welcome
  document.getElementById('tutorialNext1').addEventListener('click', () => {
    speak("Hi! I'm Finn the Fox. Let's play a listening game!", () => {
      goToTutorialScreen(2);
    });
  });
  
  // Tutorial screen 2: Short A demo
  document.getElementById('tutorialNext2').addEventListener('click', () => {
    goToTutorialScreen(3);
  });
  
  // Tutorial screen 3: Long A demo
  document.getElementById('tutorialNext3').addEventListener('click', () => {
    goToTutorialScreen(4);
  });
  
  // Tutorial screen 4: Start game
  document.getElementById('tutorialStart').addEventListener('click', () => {
    completeTutorial();
  });
  
  // Skip button
  elements.tutorialSkip.addEventListener('click', () => {
    completeTutorial();
  });
  
  // Demo bucket taps
  elements.demoApple?.addEventListener('click', () => {
    elements.demoApple.classList.add('demo-active');
    speakSequence(['apple', 'aaa'], 400, () => {
      elements.demoApple.classList.remove('demo-active');
    });
  });
  
  elements.demoCake?.addEventListener('click', () => {
    elements.demoCake.classList.add('demo-active');
    speakSequence(['cake', 'ay'], 400, () => {
      elements.demoCake.classList.remove('demo-active');
    });
  });
  
  // Auto-play first screen
  setTimeout(() => {
    speak("Hi! I'm Finn the Fox. Let's play a listening game!");
  }, 500);
}

function goToTutorialScreen(screenNum) {
  document.querySelectorAll('.tutorial-screen').forEach(s => s.classList.remove('active'));
  document.querySelector(`[data-screen="${screenNum}"]`).classList.add('active');
  
  // Auto-play audio for each screen
  if (screenNum === 2) {
    setTimeout(() => {
      speakSequence(['This is apple', 'Listen: aaa, like in cat'], 500);
    }, 300);
  } else if (screenNum === 3) {
    setTimeout(() => {
      speakSequence(['This is cake', 'Listen: ay, like in rain'], 500);
    }, 300);
  } else if (screenNum === 4) {
    setTimeout(() => {
      speak("Now you pick! Which bucket sounds the same?");
    }, 300);
  }
}

function completeTutorial() {
  // Save that tutorial was seen
  const progress = JSON.parse(localStorage.getItem('vowelSort_progress') || '{}');
  progress.hasSeenTutorial = true;
  localStorage.setItem('vowelSort_progress', JSON.stringify(progress));
  
  // Hide tutorial with fade
  elements.tutorialOverlay.classList.add('fade-out');
  setTimeout(() => {
    elements.tutorialOverlay.style.display = 'none';
    startGame();
  }, 400);
}

// ============================================
// PARENT INFO MODAL (P1-F)
// ============================================
function initParentModal() {
  elements.infoBtn.addEventListener('click', () => {
    elements.parentModal.classList.add('show');
  });
  
  elements.parentClose.addEventListener('click', closeParentModal);
  elements.parentDone.addEventListener('click', closeParentModal);
  
  // Close on backdrop click
  elements.parentModal.addEventListener('click', (e) => {
    if (e.target === elements.parentModal) {
      closeParentModal();
    }
  });
}

function closeParentModal() {
  elements.parentModal.classList.remove('show');
}

// ============================================
// GAME LOGIC
// ============================================
function startGame() {
  currentRound = generateRound();
  currentIndex = 0;
  score = 0;
  wrongAttempts = 0;
  isLocked = false;
  
  renderStars();
  elements.endScreen.classList.remove('show');
  elements.gameArea.classList.remove('hidden');
  
  // Hide bucket tap hints after first word
  elements.shortBucket.querySelector('.tap-hint-icon').style.display = 'block';
  elements.longBucket.querySelector('.tap-hint-icon').style.display = 'block';
  
  showCurrentWord();
}

function showCurrentWord() {
  if (currentIndex >= currentRound.length) {
    endGame();
    return;
  }
  
  const current = currentRound[currentIndex];
  elements.currentWord.textContent = current.word;
  elements.currentEmoji.textContent = current.emoji;
  wrongAttempts = 0;
  
  // Reset bucket states
  elements.shortBucket.classList.remove('correct', 'wrong', 'highlight', 'hint-glow');
  elements.longBucket.classList.remove('correct', 'wrong', 'highlight', 'hint-glow');
  elements.bucketPrompt.textContent = 'Which one sounds the same?';
  
  // Hide tap hints after first word
  if (currentIndex > 0) {
    elements.shortBucket.querySelector('.tap-hint-icon').style.display = 'none';
    elements.longBucket.querySelector('.tap-hint-icon').style.display = 'none';
  }
  
  // Auto-play word and start idle timer
  setTimeout(() => {
    speak(current.word, () => {
      startIdleTimer();
    });
  }, 300);
}

// ============================================
// BUCKET TAP-TO-HEAR (P0-B)
// ============================================
function handleBucketTap(type, event) {
  if (isLocked) return;
  
  clearIdleTimer();
  
  // Check if it's a "preview" tap or a "selection" tap
  // First tap = preview (play anchor word), second tap within 2s = select
  const bucket = type === 'short' ? elements.shortBucket : elements.longBucket;
  
  if (bucket.dataset.previewing === 'true') {
    // Second tap - make selection
    bucket.dataset.previewing = 'false';
    makeSelection(type);
  } else {
    // First tap - play anchor word
    bucket.dataset.previewing = 'true';
    const anchorWord = type === 'short' ? 'apple' : 'cake';
    speak(anchorWord);
    bucket.classList.add('previewing');
    
    // Reset preview state after 2 seconds
    setTimeout(() => {
      bucket.dataset.previewing = 'false';
      bucket.classList.remove('previewing');
    }, 2000);
    
    // Restart idle timer
    startIdleTimer();
  }
}

function makeSelection(selectedType) {
  isLocked = true;
  clearIdleTimer();
  
  // Clear preview states
  elements.shortBucket.dataset.previewing = 'false';
  elements.longBucket.dataset.previewing = 'false';
  elements.shortBucket.classList.remove('previewing');
  elements.longBucket.classList.remove('previewing');
  
  const current = currentRound[currentIndex];
  const isCorrect = current.type === selectedType;
  
  const selectedBucket = selectedType === 'short' ? elements.shortBucket : elements.longBucket;
  const correctBucket = current.type === 'short' ? elements.shortBucket : elements.longBucket;
  
  if (isCorrect) {
    handleCorrectAnswer(selectedBucket);
  } else {
    wrongAttempts++;
    handleWrongAnswer(selectedBucket, correctBucket, current);
  }
}

function handleCorrectAnswer(selectedBucket) {
  score++;
  renderStars();
  
  selectedBucket.classList.add('correct');
  showFeedback(true);
  
  // Varied praise
  const praises = ['Yes!', 'Good job!', 'Great!', 'Awesome!', 'Nice!', 'You got it!'];
  const praise = praises[Math.floor(Math.random() * praises.length)];
  setTimeout(() => speak(praise), 400);
  
  // P1-C: Slower timing (2.5s for correct)
  setTimeout(() => {
    currentIndex++;
    isLocked = false;
    showCurrentWord();
  }, 2500);
}

function handleWrongAnswer(selectedBucket, correctBucket, current) {
  selectedBucket.classList.add('wrong');
  showFeedback(false);
  
  const anchorWord = current.type === 'short' ? 'apple' : 'cake';
  
  // P0-D: After 2 wrong attempts, give stronger hint
  if (wrongAttempts >= 2) {
    // Strong hint: highlight correct bucket and give explicit teaching
    setTimeout(() => {
      correctBucket.classList.add('hint-glow');
      elements.bucketPrompt.textContent = `Try the ${anchorWord} bucket! 👆`;
      
      // P0-C: Better feedback - play sound comparison
      speakSequence([
        current.word,
        anchorWord,
        'They sound the same!'
      ], 500, () => {
        // Auto-advance after teaching moment
        setTimeout(() => {
          currentIndex++;
          isLocked = false;
          showCurrentWord();
        }, 1500);
      });
    }, 600);
  } else {
    // P0-C: Play sound comparison
    setTimeout(() => {
      correctBucket.classList.add('highlight');
      speakSequence([
        current.word,
        anchorWord, 
        'Same sound!'
      ], 500);
    }, 600);
    
    // P1-C: Slower timing (4s for wrong)
    setTimeout(() => {
      currentIndex++;
      isLocked = false;
      showCurrentWord();
    }, 4000);
  }
}

function showFeedback(isCorrect) {
  elements.feedbackIcon.textContent = isCorrect ? '✅' : '🔄';
  elements.feedbackIcon.className = `feedback-icon ${isCorrect ? 'correct' : 'wrong'}`;
  elements.feedbackOverlay.classList.remove('show');
  
  void elements.feedbackOverlay.offsetWidth;
  elements.feedbackOverlay.classList.add('show');
}

// ============================================
// END GAME (P1-D: Voice-narrated)
// ============================================
function endGame() {
  clearIdleTimer();
  
  const percentage = (score / totalWords) * 100;
  
  // Determine result
  let title, message, voiceMessage;
  if (percentage >= 80) {
    title = '🎉 Amazing!';
    message = "You're a sound superstar!";
    voiceMessage = `Amazing! You got ${score} out of ${totalWords}! You're a superstar!`;
  } else if (percentage >= 60) {
    title = '🌟 Great Job!';
    message = "You're learning your sounds!";
    voiceMessage = `Great job! You got ${score} out of ${totalWords}!`;
  } else if (percentage >= 40) {
    title = '👍 Good Try!';
    message = "Keep practicing!";
    voiceMessage = `Good try! You got ${score}. Let's practice more!`;
  } else {
    title = '💪 Nice Effort!';
    message = "Let's try again!";
    voiceMessage = `Nice try! Let's play again and listen carefully!`;
  }
  
  elements.endTitle.textContent = title;
  elements.endMessage.textContent = message;
  
  // Render final stars
  elements.finalStars.innerHTML = '';
  for (let i = 0; i < totalWords; i++) {
    const star = document.createElement('span');
    star.className = 'final-star';
    star.textContent = i < score ? '⭐' : '☆';
    star.style.animationDelay = `${i * 0.1}s`;
    elements.finalStars.appendChild(star);
  }
  
  // Save progress
  saveProgress();
  
  // Show end screen
  elements.endScreen.classList.add('show');
  
  // P1-D: Voice narration
  setTimeout(() => speak(voiceMessage), 300);
}

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
  
  // Check mastery (3 rounds of 80%+)
  const recentScores = progress.a.scores.slice(-5);
  const highScores = recentScores.filter(s => (s.score / s.total) >= 0.8);
  if (highScores.length >= 3) {
    progress.a.mastered = true;
  }
  
  progress.hasSeenTutorial = true;
  
  localStorage.setItem(key, JSON.stringify(progress));
}

// ============================================
// EVENT LISTENERS
// ============================================
elements.playWordBtn.addEventListener('click', () => {
  clearIdleTimer();
  if (currentIndex < currentRound.length) {
    speak(currentRound[currentIndex].word, () => {
      startIdleTimer();
    });
  }
});

// Bucket tap-to-hear (P0-B)
elements.shortBucket.addEventListener('click', (e) => handleBucketTap('short', e));
elements.longBucket.addEventListener('click', (e) => handleBucketTap('long', e));

elements.playAgainBtn.addEventListener('click', () => {
  speak("Let's play again!");
  setTimeout(startGame, 500);
});

// Initialize speech synthesis voices
if (speechSynth.onvoiceschanged !== undefined) {
  speechSynth.onvoiceschanged = () => {};
}

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initParentModal();
  initTutorial();
});

if (document.readyState !== 'loading') {
  initParentModal();
  initTutorial();
}
