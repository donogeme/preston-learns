// Preston Feeds Mittens - Story Data and Logic
// Bilingual: Preston learns Cantonese, Grandparents learn English

const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode') || 'preston';
const isGrandparents = mode === 'grandparents';

const vocab = {
  cat: { english: 'Cat', chinese: '貓', jyutping: 'maau1', emoji: '🐱' },
  mittens: { english: 'Mittens', chinese: 'Mittens', jyutping: 'Mittens', emoji: '🐱' },
  hungry: { english: 'Hungry', chinese: '肚餓', jyutping: 'tou5 ngo6', emoji: '😋' },
  food: { english: 'Food', chinese: '食物', jyutping: 'sik6 mat6', emoji: '🍽️' },
  fish: { english: 'Fish', chinese: '魚', jyutping: 'jyu4', emoji: '🐟' },
  chicken: { english: 'Chicken', chinese: '雞', jyutping: 'gai1', emoji: '🍗' },
  milk: { english: 'Milk', chinese: '奶', jyutping: 'naai5', emoji: '🥛' },
  water: { english: 'Water', chinese: '水', jyutping: 'seoi2', emoji: '💧' },
  good: { english: 'Good', chinese: '好', jyutping: 'hou2', emoji: '✅' },
  bad: { english: 'Bad', chinese: '唔好', jyutping: 'm4 hou2', emoji: '❌' },
  healthy: { english: 'Healthy', chinese: '健康', jyutping: 'gin6 hong1', emoji: '💪' },
  yummy: { english: 'Yummy', chinese: '好食', jyutping: 'hou2 sik6', emoji: '😋' },
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
  }
};

let currentPage = 0;
let selectedFood = null;

const pages = [
  {
    type: 'story',
    image: 'pages/mittens-intro.png',
    text: isGrandparents 
      ? 'Preston has a cat. <word key="cat">Her name is Mittens</word>. Mittens is <word key="hungry">hungry</word>!'
      : 'Preston has a <word key="cat">cat</word> (貓). Her name is Mittens. Mittens is <word key="hungry">hungry</word> (肚餓)!',
    readAloud: isGrandparents
      ? 'Preston has a cat. Her name is Mittens. Mittens is hungry!'
      : 'Preston has a cat. Her name is Mittens. Mittens is hungry!'
  },
  {
    type: 'choice',
    image: 'pages/food-choices.png',
    question: isGrandparents
      ? 'What should Preston feed Mittens?'
      : 'Preston should feed Mittens what?',
    readAloud: isGrandparents
      ? 'What should Preston feed Mittens? Look at the food choices'
      : 'Preston 應該餵 Mittens 食咩? Look at the food choices',
    choices: [
      { 
        id: 'fish',
        emoji: '🐟',
        label: isGrandparents ? 'Fish / 魚' : '魚 / Fish',
        correct: true,
        feedback: isGrandparents
          ? 'Good choice! Cats love fish! 好食!'
          : '叻仔! Cats love 魚!'
      },
      {
        id: 'chocolate',
        emoji: '🍫', 
        label: isGrandparents ? 'Chocolate / 朱古力' : '朱古力 / Chocolate',
        correct: false,
        feedback: isGrandparents
          ? 'No! Chocolate is dangerous for cats! 唔好!'
          : '唔好! Chocolate is dangerous for cats!'
      },
      {
        id: 'milk',
        emoji: '🥛',
        label: isGrandparents ? 'Milk / 奶' : '奶 / Milk',
        correct: false,
        feedback: isGrandparents
          ? 'Milk can upset cat tummies. Water is better!'
          : '奶 can upset cat tummies. 水 is better!'
      },
      {
        id: 'pizza',
        emoji: '🍕',
        label: isGrandparents ? 'Pizza / 薄餅' : '薄餅 / Pizza',
        correct: false,
        feedback: isGrandparents
          ? 'Pizza is not for cats! 唔係貓嘅食物!'
          : '薄餅 is not for cats! 唔係貓嘅食物!'
      }
    ]
  },
  {
    type: 'story',
    image: 'pages/mittens-eats-fish.png',
    text: isGrandparents
      ? 'Mittens eats the <word key="fish">fish</word>. <word key="yummy">Yummy</word>! Meow meow!'
      : 'Mittens eats the <word key="fish">fish</word> (魚). <word key="yummy">Yummy</word> (好食)! Meow meow!',
    readAloud: isGrandparents
      ? 'Mittens eats the fish. Yummy! Meow meow!'
      : 'Mittens eats the fish. Yummy! Meow meow!'
  },
  {
    type: 'choice',
    image: 'pages/lunch-time.png',
    question: isGrandparents
      ? 'It\'s lunchtime! What else can cats eat?'
      : 'Lunchtime! Cats can eat what else?',
    readAloud: isGrandparents
      ? 'It\'s lunchtime! What else can cats eat?'
      : 'Lunchtime! Cats 可以食咩?',
    choices: [
      {
        id: 'chicken',
        emoji: '🍗',
        label: isGrandparents ? 'Chicken / 雞' : '雞 / Chicken',
        correct: true,
        feedback: isGrandparents
          ? 'Perfect! Cooked chicken is healthy! 健康!'
          : '好叻! Cooked 雞 is 健康!'
      },
      {
        id: 'cookies',
        emoji: '🍪',
        label: isGrandparents ? 'Cookies / 曲奇' : '曲奇 / Cookies',
        correct: false,
        feedback: isGrandparents
          ? 'Cookies are for people, not cats!'
          : '曲奇 are for people, not cats!'
      },
      {
        id: 'cheese',
        emoji: '🧀',
        label: isGrandparents ? 'Cheese / 芝士' : '芝士 / Cheese',
        correct: false,
        feedback: isGrandparents
          ? 'A tiny bit is okay, but not too much!'
          : 'A tiny bit is okay, but not too much!'
      },
      {
        id: 'ice-cream',
        emoji: '🍦',
        label: isGrandparents ? 'Ice Cream / 雪糕' : '雪糕 / Ice Cream',
        correct: false,
        feedback: isGrandparents
          ? 'Too cold and sweet for cats!'
          : 'Too cold and sweet for cats!'
      }
    ]
  },
  {
    type: 'story',
    image: 'pages/mittens-happy.png',
    text: isGrandparents
      ? 'Mittens is <word key="good">happy</word> and <word key="healthy">healthy</word>! 好開心!'
      : 'Mittens is <word key="good">happy</word> (好) and <word key="healthy">healthy</word> (健康)! 好開心!',
    readAloud: isGrandparents
      ? 'Mittens is happy and healthy! Good job Preston!'
      : 'Mittens is happy and healthy! Good job Preston!'
  },
  {
    type: 'finale',
    image: 'pages/celebration.png',
    title: isGrandparents ? '🎉 Well Done!' : '🎉 Good Job! 叻仔!',
    text: isGrandparents
      ? 'Preston learned what foods are good for cats!'
      : 'Preston learned what foods are good for cats! (學識咗咩食物好俾貓食)',
    readAloud: isGrandparents
      ? 'Well done! Preston learned what foods are good for cats! Good job!'
      : 'Well done! Preston learned what foods are good for cats! Good job!',
    facts: isGrandparents ? [
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
          if (isGrandparents) {
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
      window.location.href = '../../index.html';
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
