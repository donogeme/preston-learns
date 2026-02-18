// 嫲嫲's Fruit Stand - Story Data and Logic
// Bilingual: Preston learns Cantonese, Grandparents learn English

const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode') || 'preston';
const isGrandparents = mode === 'grandparents';

const vocab = {
  apple: { english: 'Apple', chinese: '蘋果', jyutping: 'ping4 gwo2', emoji: '🍎' },
  grapes: { english: 'Grapes', chinese: '提子', jyutping: 'tai4 zi2', emoji: '🍇' },
  banana: { english: 'Banana', chinese: '香蕉', jyutping: 'hoeng1 ziu1', emoji: '🍌' },
  blueberry: { english: 'Blueberry', chinese: '藍莓', jyutping: 'laam4 mui2', emoji: '🫐' },
  strawberry: { english: 'Strawberry', chinese: '士多啤梨', jyutping: 'si6 do1 be1 lei2', emoji: '🍓' },
  watermelon: { english: 'Watermelon', chinese: '西瓜', jyutping: 'sai1 gwaa1', emoji: '🍉' },
  grandma: { english: 'Grandma', chinese: '嫲嫲', jyutping: 'maa4 maa4', emoji: '👵' },
  thankyou: { english: 'Thank you', chinese: '多謝', jyutping: 'do1 ze6', emoji: '🙏' },
  goodboy: { english: 'Good job', chinese: '叻仔', jyutping: 'lek1 zai2', emoji: '⭐' },
};

const numbers = {
  1: { english: 'One', chinese: '一', jyutping: 'jat1', file: 'one' },
  2: { english: 'Two', chinese: '二', jyutping: 'ji6', file: 'two' },
  3: { english: 'Three', chinese: '三', jyutping: 'saam1', file: 'three' },
  4: { english: 'Four', chinese: '四', jyutping: 'sei3', file: 'four' },
  5: { english: 'Five', chinese: '五', jyutping: 'ng5', file: 'five' },
};

// Generic speak function with callback
function speakText(text, lang, callback) {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.8;
    if (callback) utterance.onend = callback;
    speechSynthesis.speak(utterance);
  }
}

// Speak a number - speaks BOTH languages for Preston
function speakNumber(n) {
  const num = numbers[n];
  if (!num) return;
  
  if (isGrandparents) {
    speakText(num.english, 'en-US');
  } else {
    speakText(num.chinese, 'zh-HK', () => {
      setTimeout(() => speakText(num.english, 'en-US'), 300);
    });
  }
}

// Read full page aloud (for kids who can't read)
function readPageAloud() {
  const page = pages[currentPage];
  let textToRead = '';
  
  if (page.type === 'story' || page.type === 'finale') {
    textToRead = page.readAloud || '';
  } else if (page.type === 'counting') {
    textToRead = page.readAloud || page.question.replace(/<br>/g, '. ');
  }
  
  if (textToRead) {
    const btn = document.getElementById('read-aloud-btn');
    if (btn) btn.classList.add('speaking');
    
    const lang = isGrandparents ? 'zh-HK' : 'en-US';
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
    howMany: 'How many',
    next: 'Next ➡️',
    back: '⬅️ Back',
    finish: '🎉 Finish!',
    home: '🏠 Home',
    celebration: '🎉 叻仔! Good job!',
    celebrationText: 'You learned fruits with 嫲嫲!'
  },
  grandparents: {
    tapHint: '撳個字聽發音!',
    howMany: '幾多',
    next: '下一頁 ➡️',
    back: '⬅️ 返回',
    finish: '🎉 完成!',
    home: '🏠 主頁',
    celebration: '🎉 Good job! 好叻!',
    celebrationText: '你學識咗生果嘅英文!'
  }
};

const t = ui[mode] || ui.preston;

function getPages() {
  return [
    {
      type: 'story',
      imagePlaceholder: '🏪🍎🍇🍌<br><small>' + (isGrandparents ? '嫲嫲嘅生果檔' : "Grandma's fruit stand") + '</small>',
      readAloud: isGrandparents ? '有一日，Preston 嚟到嫲嫲嘅生果檔!' : "One sunny day, Preston visited Grandma's fruit stand! Tap the words to hear them in Cantonese.",
      content: isGrandparents ? `
        <p>有一日，<strong>Preston</strong> 嚟到</p>
        ${cantoneseWord('grandma')}嘅生果檔!
        <p class="tap-hint">${t.tapHint}</p>
      ` : `
        <p>One sunny day, <strong>Preston</strong> visited</p>
        ${cantoneseWord('grandma')}'s fruit stand!
        <p class="tap-hint">${t.tapHint}</p>
      `
    },
    {
      type: 'story',
      imagePlaceholder: '🍎🍎🍎',
      readAloud: isGrandparents ? '嫲嫲畀 Preston 睇蘋果。呢個係 apple!' : 'Grandma shows Preston some apples. This is apple in Cantonese!',
      content: isGrandparents ? `
        <p>嫲嫲畀 Preston 睇蘋果。</p>
        <p>"呢個係 ${cantoneseWord('apple')}!"</p>
        <p class="tap-hint">${t.tapHint}</p>
      ` : `
        <p>嫲嫲 shows Preston some apples.</p>
        <p>"This is ${cantoneseWord('apple')}!"</p>
        <p class="tap-hint">${t.tapHint}</p>
      `
    },
    {
      type: 'counting',
      fruit: 'apple',
      count: 3,
      question: isGrandparents ? '幾多個 apples?' : 'How many apples? 幾多蘋果?',
      readAloud: isGrandparents ? '幾多個 apples? 數一數!' : 'How many apples? Count them!',
      options: [2, 3, 4],
      correct: 3
    },
    {
      type: 'story',
      imagePlaceholder: '🍌🍌',
      readAloud: isGrandparents ? '跟住，嫲嫲畀佢睇香蕉。呢個係 banana!' : 'Next, Grandma shows Preston bananas. This is banana in Cantonese!',
      content: isGrandparents ? `
        <p>跟住，嫲嫲畀佢睇香蕉。</p>
        <p>"呢個係 ${cantoneseWord('banana')}!"</p>
        <p class="tap-hint">${t.tapHint}</p>
      ` : `
        <p>Next, 嫲嫲 shows Preston bananas.</p>
        <p>"This is ${cantoneseWord('banana')}!"</p>
        <p class="tap-hint">${t.tapHint}</p>
      `
    },
    {
      type: 'counting',
      fruit: 'banana',
      count: 2,
      question: isGrandparents ? '幾多條 bananas?' : 'How many bananas? 幾多香蕉?',
      readAloud: isGrandparents ? '幾多條 bananas? 數一數!' : 'How many bananas? Count them!',
      options: [1, 2, 3],
      correct: 2
    },
    {
      type: 'story',
      imagePlaceholder: '🍇🍇🍇🍇🍇',
      readAloud: isGrandparents ? '睇下呢度! 嫲嫲話。呢啲係 grapes!' : 'Look Preston! says Grandma. These are grapes in Cantonese!',
      content: isGrandparents ? `
        <p>"睇下呢度!" 嫲嫲話。</p>
        <p>"呢啲係 ${cantoneseWord('grapes')}!"</p>
        <p class="tap-hint">${t.tapHint}</p>
      ` : `
        <p>"Look Preston!" says 嫲嫲.</p>
        <p>"These are ${cantoneseWord('grapes')}!"</p>
        <p class="tap-hint">${t.tapHint}</p>
      `
    },
    {
      type: 'counting',
      fruit: 'grapes',
      count: 5,
      question: isGrandparents ? '幾多串 grapes?' : 'How many grape bunches? 幾多提子?',
      readAloud: isGrandparents ? '幾多串 grapes? 數一數!' : 'How many grape bunches? Count them!',
      options: [4, 5, 6],
      correct: 5
    },
    {
      type: 'story',
      imagePlaceholder: '🍓🍓🍓🍓',
      readAloud: isGrandparents ? '好好味! 嫲嫲有士多啤梨! 呢個係 strawberry!' : 'Yummy! Grandma has strawberries! This is strawberry in Cantonese!',
      content: isGrandparents ? `
        <p>好好味! 嫲嫲有士多啤梨!</p>
        <p>"呢個係 ${cantoneseWord('strawberry')}!"</p>
        <p class="tap-hint">${t.tapHint}</p>
      ` : `
        <p>Yummy! 嫲嫲 has strawberries!</p>
        <p>"This is ${cantoneseWord('strawberry')}!"</p>
        <p class="tap-hint">${t.tapHint}</p>
      `
    },
    {
      type: 'counting',
      fruit: 'strawberry',
      count: 4,
      question: isGrandparents ? '幾多粒 strawberries?' : 'How many strawberries? 幾多士多啤梨?',
      readAloud: isGrandparents ? '幾多粒 strawberries? 數一數!' : 'How many strawberries? Count them!',
      options: [3, 4, 5],
      correct: 4
    },
    {
      type: 'story',
      imagePlaceholder: '👦🙏👵',
      readAloud: isGrandparents ? 'Preston 同嫲嫲講: Thank you 嫲嫲!' : 'Preston says to Grandma: Thank you Grandma in Cantonese!',
      content: isGrandparents ? `
        <p>Preston 同嫲嫲講:</p>
        <p style="font-size: 2rem;">${cantoneseWord('thankyou')} 嫲嫲!</p>
        <p class="tap-hint">${t.tapHint}</p>
      ` : `
        <p>Preston says to 嫲嫲:</p>
        <p style="font-size: 2rem;">${cantoneseWord('thankyou')} 嫲嫲!</p>
        <p class="tap-hint">${t.tapHint}</p>
      `
    },
    {
      type: 'finale',
      imagePlaceholder: '🎉⭐🎉',
      readAloud: isGrandparents ? '嫲嫲話: Good job! 做得好!' : 'Grandma says: Good job Preston!',
      content: isGrandparents ? `
        <p>嫲嫲話:</p>
        <p style="font-size: 2rem;">${cantoneseWord('goodboy')}!</p>
        <p>做得好!</p>
      ` : `
        <p>嫲嫲 says:</p>
        <p style="font-size: 2rem;">${cantoneseWord('goodboy')}!</p>
        <p>Good job Preston!</p>
      `
    }
  ];
}

const pages = getPages();
let currentPage = 0;

// Updated: Shows BOTH Chinese and English for Preston mode
function cantoneseWord(key) {
  const word = vocab[key];
  if (isGrandparents) {
    return `
      <span class="cantonese" onclick="speak('${key}')" data-word="${key}">
        <span class="chinese">${word.english}</span>
      </span>
    `;
  } else {
    return `
      <span class="cantonese" onclick="speak('${key}')" data-word="${key}">
        <span class="chinese">${word.chinese}</span>
        <span class="jyutping">${word.jyutping}</span>
        <span class="english-hint">(${word.english})</span>
      </span>
    `;
  }
}

// Updated: Speaks Cantonese THEN English for Preston mode
function speak(key) {
  const word = vocab[key];
  const btn = document.querySelector(`[data-word="${key}"]`);
  
  if (btn) {
    btn.style.transform = 'scale(1.2)';
    setTimeout(() => btn.style.transform = '', 300);
  }
  
  if (isGrandparents) {
    const audio = new Audio(`../../assets/audio/english/${key}.mp3`);
    audio.onerror = () => speakText(word.english, 'en-US');
    audio.play().catch(() => speakText(word.english, 'en-US'));
  } else {
    const audio = new Audio(`../../assets/audio/tts/${key}.mp3`);
    audio.onended = () => {
      setTimeout(() => speakText(word.english, 'en-US'), 400);
    };
    audio.onerror = () => {
      speakText(word.chinese, 'zh-HK', () => {
        setTimeout(() => speakText(word.english, 'en-US'), 400);
      });
    };
    audio.play().catch(() => {
      speakText(word.chinese, 'zh-HK', () => {
        setTimeout(() => speakText(word.english, 'en-US'), 400);
      });
    });
  }
}

function renderPage() {
  const page = pages[currentPage];
  const content = document.getElementById('story-content');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  
  updateProgress();
  
  const readAloudBtn = `<button class="read-aloud-btn" id="read-aloud-btn" onclick="readPageAloud()">🔊</button>`;
  
  if (page.type === 'story' || page.type === 'finale') {
    content.innerHTML = `
      ${readAloudBtn}
      <div class="story-image">
        <div style="font-size: 4rem; line-height: 1.3;">
          ${page.imagePlaceholder}
        </div>
      </div>
      <div class="story-text">
        ${page.content}
      </div>
    `;
    nextBtn.disabled = false;
    
    if (page.type === 'finale') {
      nextBtn.textContent = t.finish;
      nextBtn.onclick = showCelebration;
    } else {
      nextBtn.textContent = t.next;
      nextBtn.onclick = nextPage;
    }
  } 
  else if (page.type === 'counting') {
    const fruit = vocab[page.fruit];
    const items = Array(page.count).fill(fruit.emoji).map((e, i) => 
      `<span class="count-item" style="--i: ${i}" onclick="countItem(this)">${e}</span>`
    ).join('');
    
    content.innerHTML = `
      ${readAloudBtn}
      <div class="story-text">
        <p>${page.question}</p>
      </div>
      <div class="counting-game">
        ${items}
      </div>
      <div class="answers">
        ${page.options.map(n => `
          <button class="answer-btn option" onclick="checkAnswer(${n}, ${page.correct})">
            ${n} ${isGrandparents ? numbers[n].english : numbers[n].chinese}
          </button>
        `).join('')}
      </div>
    `;
    nextBtn.disabled = true;
    nextBtn.textContent = t.next;
    nextBtn.onclick = nextPage;
  }
  
  prevBtn.textContent = t.back;
  prevBtn.disabled = currentPage === 0;
}

function countItem(el) {
  el.style.transform = 'scale(1.3)';
  setTimeout(() => el.style.transform = '', 200);
}

function checkAnswer(selected, correct) {
  speakNumber(selected);
  
  const buttons = document.querySelectorAll('.answer-btn');
  
  buttons.forEach(btn => {
    btn.disabled = true;
    const btnValue = parseInt(btn.textContent);
    if (btnValue === correct) {
      btn.classList.add('selected-correct');
    } else if (btnValue === selected && selected !== correct) {
      btn.classList.add('selected-wrong');
    }
  });
  
  if (selected === correct) {
    setTimeout(() => {
      document.getElementById('next-btn').disabled = false;
    }, 500);
  } else {
    setTimeout(() => {
      buttons.forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('selected-wrong');
      });
    }, 1000);
  }
}

function updateProgress() {
  const progress = document.getElementById('progress');
  progress.innerHTML = pages.map((_, i) => `
    <div class="progress-dot ${i === currentPage ? 'active' : ''} ${i < currentPage ? 'completed' : ''}"></div>
  `).join('');
}

function nextPage() {
  if (currentPage < pages.length - 1) {
    currentPage++;
    renderPage();
  }
}

function prevPage() {
  if (currentPage > 0) {
    currentPage--;
    renderPage();
  }
}

function showCelebration() {
  document.getElementById('celebration').style.display = 'flex';
  document.querySelector('.celebration h2').textContent = t.celebration;
  document.querySelector('.celebration p').textContent = t.celebrationText;
  document.querySelector('.celebration .nav-btn').textContent = t.home;
}

function goHome() {
  window.location.href = '../../index.html';
}

document.addEventListener('DOMContentLoaded', () => {
  renderPage();
});
