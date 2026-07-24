// Firetruck Rescue - Story Data and Logic
// Bilingual: Preston learns Cantonese, Grandparents learn English, Spanish speakers learn Cantonese

const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode') || 'preston';
const isGrandparents = mode === 'grandparents';
const isSpanish = mode === 'spanish';

const vocab = {
  firetruck: { english: 'Firetruck', chinese: '消防車', jyutping: 'siu1 fong4 ce1', emoji: '🚒', spanish: 'Camión de bomberos' },
  ladder: { english: 'Ladder', chinese: '梯', jyutping: 'tai1', emoji: '🪜', spanish: 'Escalera' },
  cat: { english: 'Cat', chinese: '貓', jyutping: 'maau1', emoji: '🐱', spanish: 'Gato' },
  tree: { english: 'Tree', chinese: '樹', jyutping: 'syu6', emoji: '🌳', spanish: 'Árbol' },
  water: { english: 'Water', chinese: '水', jyutping: 'seoi2', emoji: '💧', spanish: 'Agua' },
  fire: { english: 'Fire', chinese: '火', jyutping: 'fo2', emoji: '🔥', spanish: 'Fuego' },
  hero: { english: 'Hero', chinese: '英雄', jyutping: 'jing1 hung4', emoji: '🦸', spanish: 'Héroe' },
  letsgo: { english: "Let's go", chinese: '加油', jyutping: 'gaa1 jau2', emoji: '💪', spanish: '¡Vamos!' },
  welldone: { english: 'Well done', chinese: '好叻', jyutping: 'hou2 lek1', emoji: '👏', spanish: '¡Bien hecho!' },
  goodboy: { english: 'Good job', chinese: '叻仔', jyutping: 'lek1 zai2', emoji: '⭐', spanish: '¡Buen trabajo!' },
};

const numbers = {
  1: { english: 'One', chinese: '一', jyutping: 'jat1', file: 'one', spanish: 'Uno' },
  2: { english: 'Two', chinese: '二', jyutping: 'ji6', file: 'two', spanish: 'Dos' },
  3: { english: 'Three', chinese: '三', jyutping: 'saam1', file: 'three', spanish: 'Tres' },
  4: { english: 'Four', chinese: '四', jyutping: 'sei3', file: 'four', spanish: 'Cuatro' },
  5: { english: 'Five', chinese: '五', jyutping: 'ng5', file: 'five', spanish: 'Cinco' },
  6: { english: 'Six', chinese: '六', jyutping: 'luk6', file: 'six', spanish: 'Seis' },
};

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

// Speak a number
function speakNumber(n) {
  const num = numbers[n];
  if (!num) return;
  
  if (isSpanish) {
    speakText(num.spanish, 'es-ES', () => {
      setTimeout(() => speakText(num.chinese, 'zh-HK'), 300);
    });
  } else if (isGrandparents) {
    speakText(num.english, 'en-US');
  } else {
    // Preston: Cantonese first, then English
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
  } else if (page.type === 'counting' || page.type === 'math') {
    textToRead = page.readAloud || page.question.replace(/<br>/g, '. ');
  }
  
  if (textToRead) {
    const btn = document.getElementById('read-aloud-btn');
    if (btn) btn.classList.add('speaking');
    
    const lang = isGrandparents ? 'zh-HK' : isSpanish ? 'es-ES' : 'en-US';
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
    celebrationText: 'You helped the firetruck save the day!'
  },
  grandparents: {
    tapHint: '撳個字聽發音!',
    next: '下一頁 ➡️',
    back: '⬅️ 返回',
    finish: '🎉 完成!',
    home: '🏠 主頁',
    celebration: '🎉 Good job! 好叻!',
    celebrationText: '你學識咗消防車嘅英文!'
  },
  spanish: {
    tapHint: '¡Toca la palabra para oírla!',
    next: 'Siguiente ➡️',
    back: '⬅️ Atrás',
    finish: '🎉 ¡Terminar!',
    home: '🏠 Inicio',
    celebration: '🎉 ¡Buen trabajo! 叻仔!',
    celebrationText: '¡Ayudaste al camión de bomberos a salvar el día!'
  }
};

const t = ui[mode] || ui.preston;

function getPages() {
  return [
    {
      type: 'story',
      imagePlaceholder: '🚒✨<br><small>' + (isSpanish ? 'Un brillante camión de bomberos rojo' : isGrandparents ? '一架紅色消防車' : 'A shiny red firetruck') + '</small>',
      readAloud: isSpanish ? 'Preston ve un gran camión de bomberos rojo. ¡Toca la palabra para oírla en cantonés!' : isGrandparents ? 'Preston 見到一架大消防車!' : 'Preston sees a big red firetruck! Tap the word to hear it in Cantonese.',
      content: isSpanish ? `
        <p><strong>Preston</strong> ve un gran</p>
        ${cantoneseWord('firetruck')}!
        <p class="tap-hint">${t.tapHint}</p>
      ` : isGrandparents ? `
        <p><strong>Preston</strong> 見到一架大</p>
        ${cantoneseWord('firetruck')}!
        <p class="tap-hint">${t.tapHint}</p>
      ` : `
        <p><strong>Preston</strong> sees a big red</p>
        ${cantoneseWord('firetruck')}!
        <p class="tap-hint">${t.tapHint}</p>
      `
    },
    {
      type: 'story',
      imagePlaceholder: '🔔🚨🔔',
      readAloud: isSpanish ? '¡Ring ring! ¡Suena la alarma! ¡Un gatito está atrapado en un árbol! ¡Vamos!' : isGrandparents ? '鈴鈴鈴! 警鐘響咗! 有隻貓咪困咗喺樹上!' : 'Ring ring! The alarm goes off! A kitty is stuck in a tree! Let\'s go!',
      content: isSpanish ? `
        <p>¡RING RING! ¡Suena la alarma!</p>
        <p>¡Un gatito está atrapado en un árbol!</p>
        <p>${cantoneseWord('letsgo')}</p>
        <p class="tap-hint">${t.tapHint}</p>
      ` : isGrandparents ? `
        <p>鈴鈴鈴! 警鐘響咗!</p>
        <p>有隻貓咪困咗喺樹上!</p>
        <p>${cantoneseWord('letsgo')}</p>
        <p class="tap-hint">${t.tapHint}</p>
      ` : `
        <p>RING RING! The alarm goes off!</p>
        <p>A kitty is stuck in a tree!</p>
        <p>${cantoneseWord('letsgo')}</p>
        <p class="tap-hint">${t.tapHint}</p>
      `
    },
    {
      type: 'counting',
      item: '🛞',
      count: 4,
      question: isSpanish ? '¿Cuántas ruedas tiene el camión de bomberos?' : isGrandparents ? '消防車有幾多個 wheels?' : 'How many wheels on the firetruck?',
      readAloud: isSpanish ? '¿Cuántas ruedas tiene el camión de bomberos? ¡Cuéntalas!' : isGrandparents ? '消防車有幾多個 wheels? 數一數!' : 'How many wheels on the firetruck? Count them!',
      options: [3, 4, 5],
      correct: 4
    },
    {
      type: 'story',
      imagePlaceholder: '🪜🪜🪜',
      readAloud: isSpanish ? '¡El camión de bomberos tiene escaleras! Esto es escalera.' : isGrandparents ? '消防車有梯! 呢個係梯。' : 'The firetruck has ladders! This is ladder.',
      content: isSpanish ? `
        <p>¡El camión de bomberos tiene escaleras!</p>
        <p>Esto es ${cantoneseWord('ladder')}</p>
        <p class="tap-hint">${t.tapHint}</p>
      ` : isGrandparents ? `
        <p>消防車有梯!</p>
        <p>呢個係 ${cantoneseWord('ladder')}</p>
        <p class="tap-hint">${t.tapHint}</p>
      ` : `
        <p>The firetruck has ladders!</p>
        <p>This is ${cantoneseWord('ladder')}</p>
        <p class="tap-hint">${t.tapHint}</p>
      `
    },
    {
      type: 'counting',
      item: '🪜',
      count: 3,
      question: isSpanish ? '¿Cuántas escaleras? 幾多梯?' : isGrandparents ? '幾多條 ladders?' : 'How many ladders? 幾多梯?',
      readAloud: isSpanish ? '¿Cuántas escaleras? ¡Cuéntalas!' : isGrandparents ? '幾多條 ladders? 數一數!' : 'How many ladders? Count them!',
      options: [2, 3, 4],
      correct: 3
    },
    {
      type: 'story',
      imagePlaceholder: '🌳<br>🐱<br><small>' + (isSpanish ? 'Gato atrapado en un árbol' : isGrandparents ? '貓咪困咗喺樹上' : 'Cat stuck in tree') + '</small>',
      readAloud: isSpanish ? '¡Ahí está el gatito! Un gato en el árbol!' : isGrandparents ? '搵到隻貓啦! 一隻貓喺樹上面!' : 'There\'s the kitty! A cat in the tree!',
      content: isSpanish ? `
        <p>¡Ahí está el gatito!</p>
        <p>Un ${cantoneseWord('cat')} en el ${cantoneseWord('tree')}!</p>
        <p class="tap-hint">${t.tapHint}</p>
      ` : isGrandparents ? `
        <p>搵到隻貓啦!</p>
        <p>一隻 ${cantoneseWord('cat')} 喺 ${cantoneseWord('tree')} 上面!</p>
        <p class="tap-hint">${t.tapHint}</p>
      ` : `
        <p>There's the kitty!</p>
        <p>A ${cantoneseWord('cat')} in the ${cantoneseWord('tree')}!</p>
        <p class="tap-hint">${t.tapHint}</p>
      `
    },
    {
      type: 'counting',
      item: '🐱',
      count: 2,
      question: isSpanish ? '¿Cuántos gatos rescatar? 幾多貓?' : isGrandparents ? '要救幾多隻 cats?' : 'How many cats to rescue? 幾多貓?',
      readAloud: isSpanish ? '¿Cuántos gatos rescatar? ¡Cuéntalos!' : isGrandparents ? '要救幾多隻 cats? 數一數!' : 'How many cats to rescue? Count them!',
      options: [1, 2, 3],
      correct: 2
    },
    {
      type: 'story',
      imagePlaceholder: '🚒🪜🌳🐱',
      readAloud: isSpanish ? '¡Preston sube la escalera! ¡Rescata a los dos gatitos! ¡Bien hecho!' : isGrandparents ? 'Preston 爬上梯! 佢救咗兩隻貓! 好叻!' : 'Preston climbs up the ladder! He rescues both kitties! Well done!',
      content: isSpanish ? `
        <p>Preston sube la escalera!</p>
        <p>¡Rescata a los dos gatitos!</p>
        <p>${cantoneseWord('welldone')}</p>
      ` : isGrandparents ? `
        <p>Preston 爬上梯!</p>
        <p>佢救咗兩隻貓!</p>
        <p>${cantoneseWord('welldone')}</p>
      ` : `
        <p>Preston climbs up the ladder!</p>
        <p>He rescues both kitties!</p>
        <p>${cantoneseWord('welldone')}</p>
      `
    },
    {
      type: 'math',
      question: isSpanish ? 'Preston rescató 1 gato, y luego 1 gato más.<br>1 + 1 = ?' : isGrandparents ? 'Preston 救咗 1 隻貓，再救多 1 隻。<br>1 + 1 = ?' : 'Preston saved 1 cat, then 1 more cat.<br>1 + 1 = ?',
      readAloud: isSpanish ? 'Preston rescató 1 gato, y luego 1 gato más. 1 más 1 es igual a cuánto?' : isGrandparents ? 'Preston 救咗 1 隻貓，再救多 1 隻。1 加 1 等於幾多?' : 'Preston saved 1 cat, then 1 more cat. 1 plus 1 equals what?',
      visual: '🐱 + 🐱 = ?',
      options: [1, 2, 3],
      correct: 2
    },
    {
      type: 'story',
      imagePlaceholder: '🦸‍♂️🐱🐱',
      readAloud: isSpanish ? '¡Preston es un héroe! ¡Los gatitos están a salvo! ¡Gracias Preston!' : isGrandparents ? 'Preston 係英雄! 貓咪安全啦! 多謝 Preston!' : 'Preston is a hero! The kitties are safe! Thank you Preston!',
      content: isSpanish ? `
        <p>Preston es un ${cantoneseWord('hero')}!</p>
        <p>¡Los gatitos están a salvo!</p>
        <p>¡Gracias Preston!</p>
      ` : isGrandparents ? `
        <p>Preston 係 ${cantoneseWord('hero')}!</p>
        <p>貓咪安全啦!</p>
        <p>多謝 Preston!</p>
      ` : `
        <p>Preston is a ${cantoneseWord('hero')}!</p>
        <p>The kitties are safe!</p>
        <p>Thank you Preston!</p>
      `
    },
    {
      type: 'finale',
      imagePlaceholder: '🎉🚒⭐',
      readAloud: isSpanish ? 'Los bomberos dicen: ¡Buen trabajo! ¡Gran trabajo Preston!' : isGrandparents ? '消防員話: 叻仔! 做得好 Preston!' : 'The firefighters say: Good job! Great job Preston!',
      content: isSpanish ? `
        <p>Los bomberos dicen:</p>
        <p style="font-size: 2rem;">${cantoneseWord('goodboy')}!</p>
        <p>¡Gran trabajo Preston!</p>
      ` : isGrandparents ? `
        <p>消防員話:</p>
        <p style="font-size: 2rem;">${cantoneseWord('goodboy')}!</p>
        <p>做得好 Preston!</p>
      ` : `
        <p>The firefighters say:</p>
        <p style="font-size: 2rem;">${cantoneseWord('goodboy')}!</p>
        <p>Great job Preston!</p>
      `
    }
  ];
}

const pages = getPages();
let currentPage = 0;

// Updated: Shows BOTH Chinese and English for Preston mode
function cantoneseWord(key) {
  const word = vocab[key];
  if (isSpanish) {
    return `
      <span class="cantonese" onclick="speak('${key}')" data-word="${key}">
        <span class="chinese">${word.chinese}</span>
        <span class="jyutping">${word.jyutping}</span>
        <span class="english-hint">(${word.spanish})</span>
      </span>
    `;
  } else if (isGrandparents) {
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
  
  if (isSpanish) {
    const audio = getCachedAudio(`../../assets/audio/tts/${key}.mp3`);
    audio.onended = () => {
      setTimeout(() => speakText(word.spanish, 'es-ES'), 400);
    };
    audio.onerror = () => {
      speakText(word.chinese, 'zh-HK', () => {
        setTimeout(() => speakText(word.spanish, 'es-ES'), 400);
      });
    };
    audio.play().catch(() => {
      speakText(word.chinese, 'zh-HK', () => {
        setTimeout(() => speakText(word.spanish, 'es-ES'), 400);
      });
    });
  } else if (isGrandparents) {
    const audio = getCachedAudio(`../../assets/audio/english/${key}.mp3`);
    audio.onerror = () => speakText(word.english, 'en-US');
    audio.play().catch(() => speakText(word.english, 'en-US'));
  } else {
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
            ${n} ${isSpanish ? numbers[n].spanish : isGrandparents ? numbers[n].english : numbers[n].chinese}
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
        <p style="font-size: 3rem; margin: 20px 0;">${page.visual}</p>
      </div>
      <div class="answers">
        ${page.options.map(n => `
          <button class="answer-btn option" data-value="${n}" onclick="checkAnswer(${n}, ${page.correct})">
            ${n} ${isSpanish ? numbers[n].spanish : isGrandparents ? numbers[n].english : numbers[n].chinese}
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
  window.location.href = `../../index.html?mode=${mode}`;
}

document.addEventListener('DOMContentLoaded', () => {
  renderPage();
});