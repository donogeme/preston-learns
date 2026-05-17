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
  // Demo words (Phase 1)
  demo: [
    { cvc: 'cap', cvce: 'cape', emojiCvc: '🧢', emojiCvce: '🦸' },
    { cvc: 'tap', cvce: 'tape', emojiCvc: '🚰', emojiCvce: '📼' },
    { cvc: 'hat', cvce: 'hate', emojiCvc: '🎩', emojiCvce: '😠' }
  ],
  
  // Predict words (Phase 2) - Child adds the E
  predict: [
    { cvc: 'mat', cvce: 'mate', emojiCvc: '🧘', emojiCvce: '👫' },
    { cvc: 'can', cvce: 'cane', emojiCvc: '🥫', emojiCvce: '🦯' },
    { cvc: 'pan', cvce: 'pane', emojiCvc: '🍳', emojiCvce: '🪟' },
    { cvc: 'man', cvce: 'mane', emojiCvc: '🧑', emojiCvce: '🦁' }
  ],
  
  // Sort words (Phase 3) - Mix of CVC and CVCe
  sort: {
    cvc: [
      { word: 'cat', emoji: '🐱' },
      { word: 'bat', emoji: '🦇' },
      { word: 'map', emoji: '🗺️' },
      { word: 'nap', emoji: '😴' },
      { word: 'bag', emoji: '👜' },
      { word: 'sad', emoji: '😢' },
      { word: 'dad', emoji: '👨' },
      { word: 'van', emoji: '🚐' }
    ],
    cvce: [
      { word: 'cake', emoji: '🎂' },
      { word: 'lake', emoji: '🏞️' },
      { word: 'bake', emoji: '🧁' },
      { word: 'name', emoji: '📛' },
      { word: 'game', emoji: '🎮' },
      { word: 'cape', emoji: '🦸' },
      { word: 'tape', emoji: '📼' },
      { word: 'make', emoji: '🔨' }
    ]
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
  totalSortWords: 6,
  isLocked: false
};

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
  const pair = wordPairs.demo[demoNum - 1];
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
      const vowelSound = "ay";
      speakSequence([
        pair.cvce,
        `The E made the A say its name: ${vowelSound}!`
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
      setTimeout(() => {
        speakSequence([
          "The Magic E Rule!",
          "When we add E to the end,",
          "The A says its name: AY!"
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
  const container = elements.predictProgress;
  container.innerHTML = '';
  
  for (let i = 0; i < wordPairs.predict.length; i++) {
    const dot = document.createElement('span');
    dot.className = 'progress-dot';
    if (i < state.predictIndex) dot.classList.add('done');
    if (i === state.predictIndex) dot.classList.add('current');
    container.appendChild(dot);
  }
}

function showPredictWord() {
  if (state.predictIndex >= wordPairs.predict.length) {
    // Done with predict phase
    setTimeout(() => {
      speakSequence(["Great job!", "Now let's find the Magic E words!"], 400, () => {
        initSort();
      });
    }, 500);
    return;
  }
  
  const pair = wordPairs.predict[state.predictIndex];
  
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
  const pair = wordPairs.predict[state.predictIndex];
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
  state.sortIndex = 0;
  state.score = 0;
  
  // Build mixed round: half CVC, half CVCe
  const halfCount = Math.ceil(state.totalSortWords / 2);
  const cvcWords = shuffle(wordPairs.sort.cvc).slice(0, halfCount).map(w => ({ ...w, type: 'cvc' }));
  const cvceWords = shuffle(wordPairs.sort.cvce).slice(0, state.totalSortWords - halfCount).map(w => ({ ...w, type: 'cvce' }));
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
      const explanation = hasMagicE 
        ? `${word.word} has Magic E! Hear the AY sound?`
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
  let title, message, voiceMessage;
  
  if (percentage >= 80) {
    title = 'Amazing! 🎉';
    message = "You're a Magic E expert!";
    voiceMessage = `Amazing! You got ${state.score} out of ${state.totalSortWords}! You're a Magic E expert!`;
  } else if (percentage >= 60) {
    title = 'Great Job! 🌟';
    message = "You're learning the Magic E!";
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
document.addEventListener('DOMContentLoaded', initDiscover);
if (document.readyState !== 'loading') initDiscover();
