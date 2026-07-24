// Preston Feeds Mittens - Story Data and Logic
// Bilingual: Preston learns Cantonese, Grandparents learn English, Spanish speakers learn Cantonese

const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode') || 'preston';
const isGrandparents = mode === 'grandparents';
const isSpanish = mode === 'spanish';

const vocab = {
  cat: { english: 'Cat', chinese: '貓', jyutping: 'maau1', emoji: '🐱', spanish: 'Gato' },
  mittens: { english: 'Mittens', chinese: 'Mittens', jyutping: 'Mittens', emoji: '🐱', spanish: 'Mittens' },
  hungry: { english: 'Hungry', chinese: '肚餓', jyutping: 'tou5 ngo6', emoji: '😋', spanish: 'Hambriento' },
  food: { english: 'Food', chinese: '食物', jyutping: 'sik6 mat6', emoji: '🍽️', spanish: 'Comida' },
  fish: { english: 'Fish', chinese: '魚', jyutping: 'jyu4', emoji: '🐟', spanish: 'Pescado' },
  chicken: { english: 'Chicken', chinese: '雞', jyutping: 'gai1', emoji: '🍗', spanish: 'Pollo' },
  milk: { english: 'Milk', chinese: '奶', jyutping: 'naai5', emoji: '🥛', spanish: 'Leche' },
  water: { english: 'Water', chinese: '水', jyutping: 'seoi2', emoji: '💧', spanish: 'Agua' },
  good: { english: 'Good', chinese: '好', jyutping: 'hou2', emoji: '✅', spanish: 'Bueno' },
  bad: { english: 'Bad', chinese: '唔好', jyutping: 'm4 hou2', emoji: '❌', spanish: 'Malo' },
  healthy: { english: 'Healthy', chinese: '健康', jyutping: 'gin6 hong1', emoji: '💪', spanish: 'Saludable' },
  yummy: { english: 'Yummy', chinese: '好食', jyutping: 'hou2 sik6', emoji: '😋', spanish: '¡Delicioso!' },
};

// Generic speak function with callback
function speakText(text, lang, callback) {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.8;
    if (callback) {
      utterance.onend = callback;
    }
    speechSynthesis.speak(utterance);
  }
}

// Read full page aloud
function readPageAloud() {
  const page = pages[currentPage];
  let textToRead = page.readAloud || '';
  
  if (textToRead) {
    const btn = document.getElementById('read-aloud-btn');
    if (btn) btn.classList.add('speaking');
    
    // Always use English for TTS (Preston's mode - learning Cantonese)
    const lang = 'en-US';
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = lang;
    utterance.rate = 0.85;
    utterance.onend = () => {
      if (btn) btn.classList.remove('speaking');
    };
    speechSynthesis.speak(utterance);
  }
}

const ui = {
  preston: {
    tapHint: 'Tap the word to hear it!',
    next: 'Next ➡️',
    back: '⬅️ Back',
    finish: '🎉 Finish!',
    home: '🏠 Home',
    celebration: '🎉 Good job!',
    celebrationText: 'You learned how to feed Mittens!'
  },
  grandparents: {
    tapHint: '撳個字聽發音!',
    next: '下一頁 ➡️',
    back: '⬅️ 返回',
    finish: '🎉 完成!',
    home: '🏠 主頁',
    celebration: '🎉 做得好!',
    celebrationText: '你學識點樣餵貓!'
  },
  spanish: {
    tapHint: '¡Toca la palabra para oírla!',
    next: 'Siguiente ➡️',
    back: '⬅️ Atrás',
    finish: '🎉 ¡Terminar!',
    home: '🏠 Inicio',
    celebration: '🎉 ¡Buen trabajo!',
    celebrationText: '¡Aprendiste cómo alimentar a Mittens!'
  }
};

let currentPage = 0;
let selectedFood = null;

const pages = [
  {
    type: 'story',
    image: 'pages/mittens-intro.png',
    text: isSpanish
      ? 'Preston tiene un <word key="cat">gato</word>. <word key="cat">Se llama Mittens</word>. Mittens tiene <word key="hungry">hambre</word>!'
      : isGrandparents
      ? 'Preston has a cat. <word key="cat">Her name is Mittens</word>. Mittens is <word key="hungry">hungry</word>!'
      : 'Preston has a <word key="cat">cat</word> (貓). Her name is Mittens. Mittens is <word key="hungry">hungry</word> (肚餓)!',
    readAloud: 'Preston has a cat. Her name is Mittens. Mittens is hungry!'
  },
  {
    type: 'choice',
    image: 'pages/food-choices.png',
    question: isSpanish
      ? '¿Qué debería darle Preston de comer a Mittens?'
      : isGrandparents
      ? 'What should Preston feed Mittens?'
      : 'Preston should feed Mittens what?',
    readAloud: isSpanish
      ? '¿Qué debería darle Preston de comer a Mittens? Mira las opciones de comida'
      : isGrandparents
      ? 'What should Preston feed Mittens? Look at the food choices'
      : 'Preston 應該餵 Mittens 食咩? Look at the food choices',
    choices: [
      { 
        id: 'fish',
        emoji: '🐟',
        label: isSpanish ? 'Pescado / 魚' : isGrandparents ? 'Fish / 魚' : '魚 / Fish',
        correct: true,
        feedback: isSpanish
          ? '¡Buena elección! ¡A los gatos les encanta el pescado! ¡Delicioso!'
          : isGrandparents
          ? 'Good choice! Cats love fish! 好食!'
          : '叻仔! Cats love 魚!'
      },
      {
        id: 'chocolate',
        emoji: '🍫', 
        label: isSpanish ? 'Chocolate / 朱古力' : isGrandparents ? 'Chocolate / 朱古力' : '朱古力 / Chocolate',
        correct: false,
        feedback: isSpanish
          ? '¡No! ¡El chocolate es peligroso para los gatos! ¡Malo!'
          : isGrandparents
          ? 'No! Chocolate is dangerous for cats! 唔好!'
          : '唔好! Chocolate is dangerous for cats!'
      },
      {
        id: 'milk',
        emoji: '🥛',
        label: isSpanish ? 'Leche / 奶' : isGrandparents ? 'Milk / 奶' : '奶 / Milk',
        correct: false,
        feedback: isSpanish
          ? 'La leche puede molestar el estómago del gato. ¡El agua es mejor!'
          : isGrandparents
          ? 'Milk can upset cat tummies. Water is better!'
          : '奶 can upset cat tummies. 水 is better!'
      },
      {
        id: 'pizza',
        emoji: '🍕',
        label: isSpanish ? 'Pizza / 薄餅' : isGrandparents ? 'Pizza / 薄餅' : '薄餅 / Pizza',
        correct: false,
        feedback: isSpanish
          ? '¡La pizza no es para gatos! ¡No es comida de gato!'
          : isGrandparents
          ? 'Pizza is not for cats! 唔係貓嘅食物!'
          : '薄餅 is not for cats! 唔係貓嘅食物!'
      }
    ]
  },
  {
    type: 'story',
    image: 'pages/mittens-eats-fish.png',
    text: isSpanish
      ? 'Mittens se come el <word key="fish">pescado</word>. <word key="yummy">¡Delicioso!</word> ¡Miau miau!'
      : isGrandparents
      ? 'Mittens eats the <word key="fish">fish</word>. <word key="yummy">Yummy</word>! Meow meow!'
      : 'Mittens eats the <word key="fish">fish</word> (魚). <word key="yummy">Yummy</word> (好食)! Meow meow!',
    readAloud: 'Mittens eats the fish. Yummy! Meow meow!'
  },
  {
    type: 'choice',
    image: 'pages/lunch-time.png',
    question: isSpanish
      ? '¡Hora del almuerzo! ¿Qué más pueden comer los gatos?'
      : isGrandparents
      ? 'It\'s lunchtime! What else can cats eat?'
      : 'Lunchtime! Cats can eat what else?',
    readAloud: isSpanish
      ? '¡Hora del almuerzo! ¿Qué más pueden comer los gatos?'
      : isGrandparents
      ? 'It\'s lunchtime! What else can cats eat?'
      : 'Lunchtime! Cats 可以食咩?',
    choices: [
      {
        id: 'chicken',
        emoji: '🍗',
        label: isSpanish ? 'Pollo / 雞' : isGrandparents ? 'Chicken / 雞' : '雞 / Chicken',
        correct: true,
        feedback: isSpanish
          ? '¡Perfecto! ¡El pollo cocido es saludable! ¡Saludable!'
          : isGrandparents
          ? 'Perfect! Cooked chicken is healthy! 健康!'
          : '好叻! Cooked 雞 is 健康!'
      },
      {
        id: 'cookies',
        emoji: '🍪',
        label: isSpanish ? 'Galletas / 曲奇' : isGrandparents ? 'Cookies / 曲奇' : '曲奇 / Cookies',
        correct: false,
        feedback: isSpanish
          ? '¡Las galletas son para personas, no para gatos!'
          : isGrandparents
          ? 'Cookies are for people, not cats!'
          : '曲奇 are for people, not cats!'
      },
      {
        id: 'cheese',
        emoji: '🧀',
        label: isSpanish ? 'Queso / 芝士' : isGrandparents ? 'Cheese / 芝士' : '芝士 / Cheese',
        correct: false,
        feedback: isSpanish
          ? 'Un poquito está bien, pero no demasiado!'
          : isGrandparents
          ? 'A tiny bit is okay, but not too much!'
          : 'A tiny bit is okay, but not too much!'
      },
      {
        id: 'ice-cream',
        emoji: '🍦',
        label: isSpanish ? 'Helado / 雪糕' : isGrandparents ? 'Ice Cream / 雪糕' : '雪糕 / Ice Cream',
        correct: false,
        feedback: isSpanish
          ? '¡Demasiado frío y dulce para los gatos!'
          : isGrandparents
          ? 'Too cold and sweet for cats!'
          : 'Too cold and sweet for cats!'
      }
    ]
  },
  {
    type: 'story',
    image: 'pages/mittens-happy.png',
    text: isSpanish
      ? 'Mittens está <word key="good">feliz</word> y <word key="healthy">saludable</word>! ¡Muy feliz!'
      : isGrandparents
      ? 'Mittens is <word key="good">happy</word> and <word key="healthy">healthy</word>! 好開心!'
      : 'Mittens is <word key="good">happy</word> (好) and <word key="healthy">healthy</word> (健康)! 好開心!',
    readAloud: 'Mittens is happy and healthy! Good job Preston!'
  },
  {
    type: 'finale',
    image: 'pages/celebration.png',
    title: isSpanish ? '🎉 ¡Bien Hecho!' : isGrandparents ? '🎉 Well Done!' : '🎉 Good Job! 叻仔!',
    text: isSpanish
      ? 'Preston aprendió qué alimentos son buenos para los gatos!'
      : isGrandparents
      ? 'Preston learned what foods are good for cats!'
      : 'Preston learned what foods are good for cats! (學識咗咩食物好俾貓食)',
    readAloud: isSpanish
      ? '¡Bien hecho! Preston aprendió qué alimentos son buenos para los gatos! ¡Buen trabajo!'
      : isGrandparents
      ? 'Well done! Preston learned what foods are good for cats! Good job!'
      : 'Well done! Preston learned what foods are good for cats! Good job!',
    facts: isSpanish ? [
      '✅ El pescado (魚) y el pollo (雞) son buenos',
      '✅ La comida para gatos (貓糧) es la mejor',
      '✅ Agua fresca (新鮮水) todos los días',
      '❌ No chocolate (朱古力) - ¡peligroso!',
      '❌ No comida chatarra para humanos (垃圾食物)'
    ] : isGrandparents ? [
      '✅ Fish and chicken are good',
      '✅ Cat food is best',
      '✅ Fresh water every day',
      '❌ No chocolate - dangerous!',
      '❌ No human junk food'
    ] : [
      '✅ Fish (魚) and chicken (雞) are good',
      '✅ Cat food (貓糧) is best',
      '✅ Fresh water (新鮮水) every day',
      '❌ No chocolate (朱古力) - dangerous!',
      '❌ No human junk food (垃圾食物)'
    ]
  }
];

// Initialize page
function showPage(pageNum) {
  currentPage = pageNum;
  const page = pages[pageNum];
  const storyDiv = document.getElementById('story-content');
  const navDiv = document.getElementById('nav-buttons');
  
  storyDiv.innerHTML = '';
  navDiv.innerHTML = '';
  
  // Home button (always visible)
  const homeBtn = document.createElement('button');
  homeBtn.textContent = '🏠 Home';
  homeBtn.style.cssText = 'background:#f0f0f0;border:none;font-size:1rem;padding:6px 16px;border-radius:20px;cursor:pointer;font-family:inherit;margin-bottom:10px;display:inline-block;';
  homeBtn.onclick = () => { window.location.href = `../../index.html?mode=${mode}`; };
  storyDiv.appendChild(homeBtn);
  
  // Page indicator
  const pageIndicator = document.createElement('div');
  pageIndicator.className = 'page-indicator';
  pageIndicator.textContent = `Page ${pageNum + 1} of ${pages.length}`;
  storyDiv.appendChild(pageIndicator);
  
  if (page.type === 'story' || page.type === 'finale') {
    // Image
    if (page.image) {
      const img = document.createElement('img');
      img.src = page.image;
      img.alt = 'Story illustration';
      img.className = 'story-image';
      img.onerror = function() { this.style.display = 'none'; };
      storyDiv.appendChild(img);
    }
    
    // Title for finale
    if (page.title) {
      const title = document.createElement('h2');
      title.textContent = page.title;
      storyDiv.appendChild(title);
    }
    
    // Main text
    const textDiv = document.createElement('div');
    textDiv.className = 'story-text';
    textDiv.innerHTML = page.text;
    storyDiv.appendChild(textDiv);
    
    // Facts list for finale
    if (page.facts) {
      const factsList = document.createElement('div');
      factsList.className = 'facts-list';
      page.facts.forEach(fact => {
        const factItem = document.createElement('div');
        factItem.className = 'fact-item';
        factItem.textContent = fact;
        factsList.appendChild(factItem);
      });
      storyDiv.appendChild(factsList);
    }
    
    // Hint
    const hint = document.createElement('div');
    hint.className = 'hint';
    hint.textContent = ui[mode].tapHint;
    storyDiv.appendChild(hint);
    
    // Make words clickable
    document.querySelectorAll('word').forEach(word => {
      word.style.cursor = 'pointer';
      word.style.textDecoration = 'underline';
      word.style.color = '#007bff';
      word.onclick = function() {
        const key = this.getAttribute('key');
        const v = vocab[key];
        if (v) {
          if (isSpanish) {
            speakText(v.chinese, 'zh-HK', () => {
              setTimeout(() => speakText(v.spanish, 'es-ES'), 300);
            });
          } else if (isGrandparents) {
            speakText(v.english, 'en-US');
          } else {
            speakText(v.chinese, 'zh-HK', () => {
              setTimeout(() => speakText(v.english, 'en-US'), 300);
            });
          }
        }
      };
    });
    
  } else if (page.type === 'choice') {
    // Image
    if (page.image) {
      const img = document.createElement('img');
      img.src = page.image;
      img.alt = 'Food choices';
      img.className = 'story-image';
      img.onerror = function() { this.style.display = 'none'; };
      storyDiv.appendChild(img);
    }
    
    // Question
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';
    questionDiv.textContent = page.question;
    storyDiv.appendChild(questionDiv);
    
    // Choices
    const choicesDiv = document.createElement('div');
    choicesDiv.className = 'choices-grid';
    
    page.choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'choice-button';
      btn.innerHTML = `<span class="choice-emoji">${choice.emoji}</span><br>${choice.label}`;
      btn.onclick = function() {
        selectedFood = choice.id;
        
        // Show feedback
        document.querySelectorAll('.choice-button').forEach(b => {
          b.disabled = true;
          if (b === btn) {
            b.classList.add(choice.correct ? 'correct' : 'incorrect');
          }
        });
        
        const feedback = document.createElement('div');
        feedback.className = `feedback ${choice.correct ? 'correct' : 'incorrect'}`;
        feedback.textContent = choice.feedback;
        storyDiv.appendChild(feedback);
        
        // Speak feedback in English
        speakText(choice.feedback, 'en-US');
        
        // Enable next button after a moment
        setTimeout(() => {
          document.getElementById('next-btn').disabled = false;
        }, 1500);
      };
      choicesDiv.appendChild(btn);
    });
    
    storyDiv.appendChild(choicesDiv);
  }
  
  // Navigation buttons
  if (pageNum > 0) {
    const backBtn = document.createElement('button');
    backBtn.id = 'back-btn';
    backBtn.className = 'nav-button';
    backBtn.textContent = ui[mode].back;
    backBtn.onclick = () => showPage(pageNum - 1);
    navDiv.appendChild(backBtn);
  }
  
  if (pageNum < pages.length - 1) {
    const nextBtn = document.createElement('button');
    nextBtn.id = 'next-btn';
    nextBtn.className = 'nav-button primary';
    nextBtn.textContent = ui[mode].next;
    nextBtn.disabled = page.type === 'choice';
    nextBtn.onclick = () => showPage(pageNum + 1);
    navDiv.appendChild(nextBtn);
  } else {
    const finishBtn = document.createElement('button');
    finishBtn.className = 'nav-button primary';
    finishBtn.textContent = ui[mode].finish;
    finishBtn.onclick = () => {
      window.location.href = `../../index.html?mode=${mode}`;
    };
    navDiv.appendChild(finishBtn);
  }
  
  // Read aloud button
  const readBtn = document.createElement('button');
  readBtn.id = 'read-aloud-btn';
  readBtn.className = 'read-aloud-button';
  readBtn.innerHTML = '🔊';
  readBtn.setAttribute('aria-label', 'Read page aloud');
  readBtn.onclick = readPageAloud;
  navDiv.appendChild(readBtn);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  showPage(0);
});