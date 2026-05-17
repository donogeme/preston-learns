// Garbage Truck Day - Story Data and Logic
// Bilingual: Preston learns Cantonese, Grandparents learn English

const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode') || 'preston';
const isGrandparents = mode === 'grandparents';

const vocab = {
  garbagetruck: { english: 'Garbage truck', chinese: '垃圾車', jyutping: 'laap6 saap3 ce1', emoji: '🚛' },
  trash: { english: 'Trash', chinese: '垃圾', jyutping: 'laap6 saap3', emoji: '🗑️' },
  bag: { english: 'Bag', chinese: '袋', jyutping: 'doi2', emoji: '💰' },
  house: { english: 'House', chinese: '屋', jyutping: 'uk1', emoji: '🏠' },
  recycle: { english: 'Recycle', chinese: '回收', jyutping: 'wui4 sau1', emoji: '♻️' },
  clean: { english: 'Clean', chinese: '乾淨', jyutping: 'gon1 zeng6', emoji: '✨' },
  help: { english: 'Help', chinese: '幫手', jyutping: 'bong1 sau2', emoji: '🤝' },
  goodboy: { english: 'Good job', chinese: '叻仔', jyutping: 'lek1 zai2', emoji: '⭐' },
  thankyou: { english: 'Thank you', chinese: '多謝', jyutping: 'do1 ze6', emoji: '🙏' },
};

const numbers = {
  1: { english: 'One', chinese: '一', jyutping: 'jat1', file: 'one' },
  2: { english: 'Two', chinese: '二', jyutping: 'ji6', file: 'two' },
  3: { english: 'Three', chinese: '三', jyutping: 'saam1', file: 'three' },
  4: { english: 'Four', chinese: '四', jyutping: 'sei3', file: 'four' },
  5: { english: 'Five', chinese: '五', jyutping: 'ng5', file: 'five' },
  6: { english: 'Six', chinese: '六', jyutping: 'luk6', file: 'six' },
  7: { english: 'Seven', chinese: '七', jyutping: 'cat1', file: 'seven' },
};

// Speak a number - now speaks BOTH languages for Preston
function speakNumber(n) {
  const num = numbers[n];
  if (!num) return;
  
  if (isGrandparents) {
    // Grandparents: English only
    speakText(num.english, 'en-US');
  } else {
    // Preston: Cantonese first, then English
    speakText(num.chinese, 'zh-HK', () => {
      setTimeout(() => speakText(num.english, 'en-US'), 300);
    });
  }
}

// Audio cache — reuse Audio objects instead of creating new ones on every tap
const audioCache = {};
function getCachedAudio(src) {
  if (!audioCache[src]) audioCache[src] = new Audio(src);
  return audioCache[src];
}

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

// Read full page aloud (for kids who can't read)
function readPageAloud() {
  const page = pages[currentPage];
  let textToRead = '';
  
  if (page.type === 'story' || page.type === 'finale') {
    textToRead = page.readAloud || page.plainText || '';
  } else if (page.type === 'counting' || page.type === 'math') {
    textToRead = page.readAloud || page.question.replace(/<br>/g, '. ');
  }
  
  if (textToRead) {
    const btn = document.getElementById('read-aloud-btn');
    if (btn) {
      btn.classList.add('speaking');
    }
    
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
    next: 'Next ➡️',
    back: '⬅️ Back',
    finish: '🎉 Finish!',
    home: '🏠 Home',
    celebration: '🎉 叻仔! Good job!',
    celebrationText: 'You helped Gary collect all the trash!'
  },
  grandparents: {
    tapHint: '撳個字聽發音!',
    next: '下一頁 ➡️',
    back: '⬅️ 返回',
    finish: '🎉 完成!',
    home: '🏠 主頁',
    celebration: '🎉 Good job! 好叻!',
    celebrationText: '你學識咗垃圾車嘅英文!'
  }
};

const t = ui[mode] || ui.preston;

function getPages() {
  return [
    {
      type: 'story',
      imagePlaceholder: '🚛💨<br><small>' + (isGrandparents ? 'Gary 垃圾車' : 'Gary the Garbage Truck') + '</small>',
      readAloud: isGrandparents ? 'Preston 見到 Gary 垃圾車!' : 'Preston meets Gary the Garbage truck! Tap the word to hear it in Cantonese.',
      content: isGrandparents ? `
        <p><strong>Preston</strong> 見到 Gary</p>
        ${cantoneseWord('garbagetruck')}!
        <p class="tap-hint">${t.tapHint}</p>
      ` : `
        <p><strong>Preston</strong> meets Gary the</p>
        ${cantoneseWord('garbagetruck')}!
        <p class="tap-hint">${t.tapHint}</p>
      `
    },
    {
      type: 'story',
      imagePlaceholder: '🚛🤝👦',
      readAloud: isGrandparents ? 'Gary 需要幫手! 一齊收垃圾袋!' : 'Gary needs help! Let\'s collect trash bags!',
      content: isGrandparents ? `
        <p>Gary 需要 ${cantoneseWord('help')}!</p>
        <p>一齊收垃圾袋!</p>
        <p class="tap-hint">${t.tapHint}</p>
      ` : `
        <p>Gary needs ${cantoneseWord('help')}!</p>
        <p>Let's collect trash bags!</p>
        <p class="tap-hint">${t.tapHint}</p>
      `
    },
    {
      type: 'counting',
      item: '🗑️',
      count: 2,
      question: isGrandparents ? '第一間屋! 幾多個 trash bags?' : 'First house! How many trash bags?',
      readAloud: isGrandparents ? '第一間屋! 幾多個 trash bags? 數一數!' : 'First house! How many trash bags? Count them!',
      options: [1, 2, 3],
      correct: 2
    },
    {
      type: 'story',
      imagePlaceholder: '🏠🗑️🗑️🗑️',
      readAloud: isGrandparents ? '下一間屋! 呢度有更多垃圾袋!' : 'Next house! More trash bags here!',
      content: isGrandparents ? `
        <p>下一間 ${cantoneseWord('house')}!</p>
        <p>呢度有更多垃圾袋!</p>
      ` : `
        <p>Next ${cantoneseWord('house')}!</p>
        <p>More trash bags here!</p>
      `
    },
    {
      type: 'math',
      question: isGrandparents ? 'Gary 有 2 個袋。<br>佢再執多 3 個袋。<br>2 + 3 = ?' : 'Gary had 2 bags.<br>He picked up 3 more bags.<br>2 + 3 = ?',
      readAloud: isGrandparents ? 'Gary 有 2 個袋。佢再執多 3 個袋。2 加 3 等於幾多?' : 'Gary had 2 bags. He picked up 3 more bags. 2 plus 3 equals what?',
      visual: '🗑️🗑️ + 🗑️🗑️🗑️ = ?',
      options: [4, 5, 6],
      correct: 5
    },
    {
      type: 'story',
      imagePlaceholder: '🚛<br>🗑️🗑️🗑️🗑️🗑️',
      readAloud: isGrandparents ? 'Gary 有 5 個袋啦! 垃圾越嚟越多!' : 'Gary has 5 bags now! The trash is piling up!',
      content: isGrandparents ? `
        <p>Gary 有 5 個袋啦!</p>
        <p>${cantoneseWord('trash')} 越嚟越多!</p>
      ` : `
        <p>Gary has 5 bags now!</p>
        <p>The ${cantoneseWord('trash')} is piling up!</p>
      `
    },
    {
      type: 'story',
      imagePlaceholder: '🚛➡️🏭<br><small>' + (isGrandparents ? '回收中心' : 'Recycling center') + '</small>',
      readAloud: isGrandparents ? '去回收啦! Gary 倒咗 2 個袋。' : 'Time to recycle! Gary dumps 2 bags.',
      content: isGrandparents ? `
        <p>去 ${cantoneseWord('recycle')} 啦!</p>
        <p>Gary 倒咗 2 個袋。</p>
      ` : `
        <p>Time to ${cantoneseWord('recycle')}!</p>
        <p>Gary dumps 2 bags.</p>
      `
    },
    {
      type: 'math',
      question: isGrandparents ? 'Gary 有 5 個袋。<br>佢倒咗 2 個袋。<br>5 - 2 = ?' : 'Gary had 5 bags.<br>He dumped 2 bags.<br>5 - 2 = ?',
      readAloud: isGrandparents ? 'Gary 有 5 個袋。佢倒咗 2 個袋。5 減 2 等於幾多?' : 'Gary had 5 bags. He dumped 2 bags. 5 minus 2 equals what?',
      visual: '🗑️🗑️🗑️🗑️🗑️ - 🗑️🗑️ = ?',
      options: [2, 3, 4],
      correct: 3
    },
    {
      type: 'counting',
      item: '🏠',
      count: 4,
      question: isGrandparents ? '仲有幾多間 houses 要去?' : 'How many houses left to visit?',
      readAloud: isGrandparents ? '仲有幾多間 houses 要去? 數一數!' : 'How many houses left to visit? Count them!',
      options: [3, 4, 5],
      correct: 4
    },
    {
      type: 'math',
      question: isGrandparents ? 'Gary 有 3 個袋。<br>佢再執多 1 個。<br>3 + 1 = ?' : 'Gary has 3 bags.<br>He picks up 1 more.<br>3 + 1 = ?',
      readAloud: isGrandparents ? 'Gary 有 3 個袋。佢再執多 1 個。3 加 1 等於幾多?' : 'Gary has 3 bags. He picks up 1 more. 3 plus 1 equals what?',
      visual: '🗑️🗑️🗑️ + 🗑️ = ?',
      options: [3, 4, 5],
      correct: 4
    },
    {
      type: 'story',
      imagePlaceholder: '✨🏘️✨<br><small>' + (isGrandparents ? '乾淨嘅街道' : 'Clean neighborhood') + '</small>',
      readAloud: isGrandparents ? '條街好乾淨! Gary 話多謝 Preston!' : 'The street is clean! Gary says thank you Preston!',
      content: isGrandparents ? `
        <p>條街好 ${cantoneseWord('clean')}!</p>
        <p>Gary 話 ${cantoneseWord('thankyou')} Preston!</p>
      ` : `
        <p>The street is ${cantoneseWord('clean')}!</p>
        <p>Gary says ${cantoneseWord('thankyou')} Preston!</p>
      `
    },
    {
      type: 'finale',
      imagePlaceholder: '🎉🚛⭐',
      readAloud: isGrandparents ? 'Gary 響號角! 叻仔! 好幫手 Preston!' : 'Gary honks his horn! Good job! Great helper Preston!',
      content: isGrandparents ? `
        <p>Gary 響號角!</p>
        <p style="font-size: 2rem;">${cantoneseWord('goodboy')}!</p>
        <p>好幫手 Preston!</p>
      ` : `
        <p>Gary honks his horn!</p>
        <p style="font-size: 2rem;">${cantoneseWord('goodboy')}!</p>
        <p>Great helper Preston!</p>
      `
    }
  ];
}

const pages = getPages();
let currentPage = 0;

// Updated: Now shows BOTH Chinese and English for Preston mode
function cantoneseWord(key) {
  const word = vocab[key];
  if (isGrandparents) {
    // Grandparents mode: Show English, learn pronunciation
    return `
      <span class="cantonese" onclick="speak('${key}')" data-word="${key}">
        <span class="chinese">${word.english}</span>
      </span>
    `;
  } else {
    // Preston mode: Show Chinese WITH English underneath so he can relate them
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
    // Grandparents: Just English
    const audio = getCachedAudio(`../../assets/audio/english/${key}.mp3`);
    audio.onerror = () => speakText(word.english, 'en-US');
    audio.play().catch(() => speakText(word.english, 'en-US'));
  } else {
    // Preston: Cantonese first, then English after a short pause
    const audio = getCachedAudio(`../../assets/audio/tts/${key}.mp3`);
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
  
  // Read aloud button HTML
  const readAloudBtn = `<button class="read-aloud-btn" id="read-aloud-btn" onclick="readPageAloud()" aria-label="Read page aloud">🔊</button>`;
  
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
    const items = Array(page.count).fill(page.item).map((e, i) => 
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
          <button class="answer-btn option" data-value="${n}" onclick="checkAnswer(${n}, ${page.correct})">
            ${n} ${isGrandparents ? numbers[n].english : numbers[n].chinese}
          </button>
        `).join('')}
      </div>
    `;
    nextBtn.disabled = true;
    nextBtn.textContent = t.next;
    nextBtn.onclick = nextPage;
  }
  else if (page.type === 'math') {
    content.innerHTML = `
      ${readAloudBtn}
      <div class="story-text">
        <p>${page.question}</p>
        <p style="font-size: 2.5rem; margin: 20px 0;">${page.visual}</p>
      </div>
      <div class="answers">
        ${page.options.map(n => `
          <button class="answer-btn option" data-value="${n}" onclick="checkAnswer(${n}, ${page.correct})">
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
  // Speak the number that was pressed
  speakNumber(selected);
  
  const buttons = document.querySelectorAll('.answer-btn');
  
  buttons.forEach(btn => {
    btn.disabled = true;
    const btnValue = parseInt(btn.getAttribute('data-value') ?? btn.textContent);
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
