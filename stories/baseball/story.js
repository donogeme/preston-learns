// Baseball Adventure - Story Data and Logic
// Bilingual: Preston learns Cantonese, Grandparents learn English, Spanish speakers learn Cantonese

const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode') || 'preston';
const isGrandparents = mode === 'grandparents';
const isSpanish = mode === 'spanish';

const vocab = {
  baseball:  { english: 'Baseball',  chinese: '棒球',   jyutping: 'bong3 kau4',       emoji: '⚾',  spanish: 'Béisbol' },
  bat:       { english: 'Bat',       chinese: '球棒',   jyutping: 'kau4 bong3',       emoji: '🏏',  spanish: 'Bate' },
  ball:      { english: 'Ball',      chinese: '球',     jyutping: 'kau4',             emoji: '⚾',  spanish: 'Pelota' },
  hit:       { english: 'Hit',       chinese: '打',     jyutping: 'da2',              emoji: '💥',  spanish: 'Golpear' },
  run:       { english: 'Run',       chinese: '跑',     jyutping: 'paau2',            emoji: '🏃',  spanish: 'Correr' },
  catch:     { english: 'Catch',     chinese: '接',     jyutping: 'zip3',             emoji: '🤲',  spanish: 'Atrapar' },
  throw:     { english: 'Throw',     chinese: '掟',     jyutping: 'deng3',            emoji: '🤾',  spanish: 'Lanzar' },
  homerun:   { english: 'Home Run',  chinese: '本壘打', jyutping: 'bun2 leoi5 da2',   emoji: '🎉',  spanish: 'Jonrón' },
  base:      { english: 'Base',      chinese: '壘',     jyutping: 'leoi5',            emoji: '🟫',  spanish: 'Base' },
  letsgo:    { english: "Let's go",  chinese: '加油',   jyutping: 'gaa1 jau4',        emoji: '💪',  spanish: '¡Vamos!' },
  welldone:  { english: 'Well done', chinese: '好叻',   jyutping: 'hou2 lek1',        emoji: '👏',  spanish: '¡Bien hecho!' },
  goodboy:   { english: 'Good job',  chinese: '叻仔',   jyutping: 'lek1 zai2',        emoji: '⭐',  spanish: '¡Buen trabajo!' },
};

const numbers = {
  1: { english: 'One',   chinese: '一', jyutping: 'jat1', spanish: 'Uno' },
  2: { english: 'Two',   chinese: '二', jyutping: 'ji6',  spanish: 'Dos' },
  3: { english: 'Three', chinese: '三', jyutping: 'saam1', spanish: 'Tres' },
  4: { english: 'Four',  chinese: '四', jyutping: 'sei3', spanish: 'Cuatro' },
  5: { english: 'Five',  chinese: '五', jyutping: 'ng5',  spanish: 'Cinco' },
};

const audioCache = {};
function getCachedAudio(src) {
  if (!audioCache[src]) audioCache[src] = new Audio(src);
  return audioCache[src];
}

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
    speakText(num.chinese, 'zh-HK', () => {
      setTimeout(() => speakText(num.english, 'en-US'), 300);
    });
  }
}

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
    utterance.onend = () => { if (btn) btn.classList.remove('speaking'); };
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
    celebration: '🎉 叻仔! Home Run!',
    celebrationText: 'You hit a home run and learned baseball words!'
  },
  grandparents: {
    tapHint: '撳個字聽發音!',
    next: '下一頁 ➡️',
    back: '⬅️ 返回',
    finish: '🎉 完成!',
    home: '🏠 主頁',
    celebration: '🎉 Home Run! 好叻!',
    celebrationText: '你學識咗棒球嘅英文!'
  },
  spanish: {
    tapHint: '¡Toca la palabra para oírla!',
    next: 'Siguiente ➡️',
    back: '⬅️ Atrás',
    finish: '🎉 ¡Terminar!',
    home: '🏠 Inicio',
    celebration: '🎉 ¡Jonrón! 叻仔!',
    celebrationText: '¡Bateaste un jonrón y aprendiste palabras de béisbol!'
  }
};

const t = ui[mode] || ui.preston;

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
    return `
      <span class="cantonese" onclick="speak('${key}')" data-word="${key}">
        <span class="chinese">${word.chinese}</span>
        <span class="jyutping">${word.jyutping}</span>
        <span class="english-hint">(${word.english})</span>
      </span>
    `;
  }
}

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
    speakText(word.english, 'en-US');
  } else {
    speakText(word.chinese, 'zh-HK', () => {
      setTimeout(() => speakText(word.english, 'en-US'), 400);
    });
  }
}

function getPages() {
  return [
    // Page 1 — Intro
    {
      type: 'story',
      imagePlaceholder: '⚾🏟️☀️<br><small>' + (isSpanish ? 'En el campo de béisbol' : isGrandparents ? '係棒球場' : 'At the baseball field') + '</small>',
      readAloud: isSpanish
        ? 'Preston juega béisbol hoy! Toca la palabra para oírla en cantonés!'
        : isGrandparents
        ? 'Preston 今日去打棒球! 係棒球場! 撳個字聽發音!'
        : 'Preston is playing baseball today! Tap the word to hear it in Cantonese!',
      content: isSpanish ? `
        <p><strong>Preston</strong> juega</p>
        ${cantoneseWord('baseball')}
        <p>hoy!</p>
        <p class="tap-hint">${t.tapHint}</p>
      ` : isGrandparents ? `
        <p><strong>Preston</strong> 今日去打</p>
        ${cantoneseWord('baseball')}!
        <p class="tap-hint">${t.tapHint}</p>
      ` : `
        <p><strong>Preston</strong> is playing</p>
        ${cantoneseWord('baseball')}
        <p>today!</p>
        <p class="tap-hint">${t.tapHint}</p>
      `
    },

    // Page 2 — Pick up the bat
    {
      type: 'story',
      imagePlaceholder: '🏏💪⭐',
      readAloud: isSpanish
        ? 'Preston agarra el bate! ¡Muy pesado! ¡Vamos!'
        : isGrandparents
        ? 'Preston 拎起個球棒! 好重呀! 加油!'
        : 'Preston picks up the bat! So heavy! Let\'s go!',
      content: isSpanish ? `
        <p>Preston agarra el</p>
        ${cantoneseWord('bat')}!
        <p>¡Muy pesado!</p>
        <p>${cantoneseWord('letsgo')}</p>
        <p class="tap-hint">${t.tapHint}</p>
      ` : isGrandparents ? `
        <p>Preston 拎起個</p>
        ${cantoneseWord('bat')}!
        <p>好重呀!</p>
        <p>${cantoneseWord('letsgo')}</p>
        <p class="tap-hint">${t.tapHint}</p>
      ` : `
        <p>Preston picks up the</p>
        ${cantoneseWord('bat')}!
        <p>So heavy!</p>
        <p>${cantoneseWord('letsgo')}</p>
        <p class="tap-hint">${t.tapHint}</p>
      `
    },

    // Page 3 — The pitcher throws
    {
      type: 'story',
      imagePlaceholder: '🤾⚾💨',
      readAloud: isSpanish
        ? 'El lanzador lanza la pelota! ¡Allá viene!'
        : isGrandparents
        ? '投手掟個球! 個球飛嚟喇!'
        : 'The pitcher throws the ball! Here it comes!',
      content: isSpanish ? `
        <p>El lanzador</p>
        ${cantoneseWord('throw')}
        <p>la</p>
        ${cantoneseWord('ball')}!
        <p>¡Allá viene!</p>
        <p class="tap-hint">${t.tapHint}</p>
      ` : isGrandparents ? `
        <p>投手</p>
        ${cantoneseWord('throw')}
        <p>個</p>
        ${cantoneseWord('ball')}!
        <p>個球飛嚟喇!</p>
        <p class="tap-hint">${t.tapHint}</p>
      ` : `
        <p>The pitcher</p>
        ${cantoneseWord('throw')}
        <p>s the</p>
        ${cantoneseWord('ball')}!
        <p>Here it comes!</p>
        <p class="tap-hint">${t.tapHint}</p>
      `
    },

    // Page 4 — SWING and HIT!
    {
      type: 'story',
      imagePlaceholder: '💥⚾🌟<br><small>' + (isSpanish ? '¡CRACK!' : isGrandparents ? 'CRACK!' : 'CRACK!') + '</small>',
      readAloud: isSpanish
        ? '¡CRACK! Preston golpea la pelota! ¡Lo logró!'
        : isGrandparents
        ? 'CRACK! Preston 打到個球喇! 打到喇!'
        : 'CRACK! Preston hits the ball! He got it!',
      content: isSpanish ? `
        <p>¡CRACK! 💥</p>
        <p>Preston</p>
        ${cantoneseWord('hit')}
        <p>la pelota!</p>
        <p class="tap-hint">${t.tapHint}</p>
      ` : isGrandparents ? `
        <p>CRACK! 💥</p>
        <p>Preston</p>
        ${cantoneseWord('hit')}
        <p>到個球喇!</p>
        <p class="tap-hint">${t.tapHint}</p>
      ` : `
        <p>CRACK! 💥</p>
        <p>Preston</p>
        ${cantoneseWord('hit')}
        <p>s the ball!</p>
        <p class="tap-hint">${t.tapHint}</p>
      `
    },

    // Page 5 — Count the bases
    {
      type: 'counting',
      item: '🟫',
      count: 4,
      question: isSpanish
        ? '¿Cuántas bases hay en el campo? 幾多個壘?'
        : isGrandparents
        ? '棒球場有幾多個 bases?'
        : 'How many bases on the field? 幾多個壘?',
      readAloud: isSpanish
        ? '¿Cuántas bases hay en el campo? ¡Cuéntalas!'
        : isGrandparents
        ? '棒球場有幾多個 bases? 數一數!'
        : 'How many bases are on the field? Count them!',
      options: [3, 4, 5],
      correct: 4
    },

    // Page 6 — Run!
    {
      type: 'story',
      imagePlaceholder: '🏃💨🟫🟫',
      readAloud: isSpanish
        ? 'A correr! Preston corre rápido por cada base!'
        : isGrandparents
        ? '跑呀跑! Preston 快快跑過每個壘!'
        : 'Run run run! Preston runs fast past every base!',
      content: isSpanish ? `
        <p>¡A correr!</p>
        <p>Preston</p>
        ${cantoneseWord('run')}
        <p>rápido!</p>
        <p>Por cada</p>
        ${cantoneseWord('base')}!
        <p class="tap-hint">${t.tapHint}</p>
      ` : isGrandparents ? `
        <p>跑呀跑! Preston</p>
        ${cantoneseWord('run')}
        <p>快快跑過每個</p>
        ${cantoneseWord('base')}!
        <p class="tap-hint">${t.tapHint}</p>
      ` : `
        <p>Run run run!</p>
        <p>Preston</p>
        ${cantoneseWord('run')}
        <p>s fast!</p>
        <p>Past every</p>
        ${cantoneseWord('base')}!
        <p class="tap-hint">${t.tapHint}</p>
      `
    },

    // Page 7 — Math: 2 + 2 = 4 bases = HOME RUN
    {
      type: 'math',
      question: isSpanish
        ? 'Preston corrió 2 bases, luego 2 más.<br>2 + 2 = ?'
        : isGrandparents
        ? 'Preston 跑咗 2 個壘，再跑多 2 個。<br>2 + 2 = ?'
        : 'Preston ran 2 bases, then 2 more.<br>2 + 2 = ?',
      readAloud: isSpanish
        ? 'Preston corrió 2 bases, luego 2 más. 2 más 2 es igual a cuánto?'
        : isGrandparents
        ? 'Preston 跑咗 2 個壘，再跑多 2 個。2 加 2 等於幾多?'
        : 'Preston ran 2 bases, then 2 more. 2 plus 2 equals what?',
      visual: '🟫🟫 + 🟫🟫 = ?',
      options: [3, 4, 5],
      correct: 4
    },

    // Page 8 — HOME RUN!
    {
      type: 'story',
      imagePlaceholder: '🎉🏠⚾✨<br><small>' + (isSpanish ? '¡JONRÓN!' : isGrandparents ? '本壘打!' : 'HOME RUN!') + '</small>',
      readAloud: isSpanish
        ? '¡Jonrón! Preston pisa el plato! ¡El público se vuelve loco!'
        : isGrandparents
        ? '本壘打! Preston 踩到本壘! 全場嘩晒!'
        : 'HOME RUN! Preston steps on home base! The crowd goes wild!',
      content: isSpanish ? `
        <p style="font-size: 2rem;">🎉</p>
        <p>Preston batea un</p>
        ${cantoneseWord('homerun')}!
        <p>¡Corrió las 4 bases!</p>
        <p class="tap-hint">${t.tapHint}</p>
      ` : isGrandparents ? `
        <p style="font-size: 2rem;">🎉</p>
        ${cantoneseWord('homerun')}!
        <p>Preston 踩到本壘!</p>
        <p>全場嘩晒!</p>
        <p class="tap-hint">${t.tapHint}</p>
      ` : `
        <p style="font-size: 2rem;">🎉</p>
        <p>Preston hits a</p>
        ${cantoneseWord('homerun')}!
        <p>He runs all 4 bases!</p>
        <p class="tap-hint">${t.tapHint}</p>
      `
    },

    // Page 9 — Teammate catches the next ball
    {
      type: 'story',
      imagePlaceholder: '🤲⚾😊',
      readAloud: isSpanish
        ? 'El compañero atrapa la pelota! ¡Bien hecho!'
        : isGrandparents
        ? '隊友接住個球! 做得好!'
        : 'The teammate catches the ball! Great teamwork!',
      content: isSpanish ? `
        <p>El compañero</p>
        ${cantoneseWord('catch')}
        <p>la pelota!</p>
        <p>${cantoneseWord('welldone')}!</p>
        <p class="tap-hint">${t.tapHint}</p>
      ` : isGrandparents ? `
        <p>隊友</p>
        ${cantoneseWord('catch')}
        <p>住個球!</p>
        <p>${cantoneseWord('welldone')}!</p>
        <p class="tap-hint">${t.tapHint}</p>
      ` : `
        <p>The teammate</p>
        ${cantoneseWord('catch')}
        <p>es the ball!</p>
        <p>${cantoneseWord('welldone')}!</p>
        <p class="tap-hint">${t.tapHint}</p>
      `
    },

    // Page 10 — Count how many balls Preston hit
    {
      type: 'counting',
      item: '⚾',
      count: 3,
      question: isSpanish
        ? '¿Cuántas pelotas golpeó Preston? 幾多個球?'
        : isGrandparents
        ? 'Preston 打咗幾多個 balls?'
        : 'How many balls did Preston hit? 幾多個球?',
      readAloud: isSpanish
        ? '¿Cuántas pelotas golpeó Preston? ¡Cuéntalas!'
        : isGrandparents
        ? 'Preston 打咗幾多個 balls? 數一數!'
        : 'How many balls did Preston hit? Count them!',
      options: [2, 3, 4],
      correct: 3
    },

    // Page 11 — Finale
    {
      type: 'finale',
      imagePlaceholder: '🏆⚾🎉',
      readAloud: isSpanish
        ? 'Todo el equipo dice: ¡Buen trabajo! Preston es un héroe del béisbol!'
        : isGrandparents
        ? '全隊話: 叻仔! Preston 係棒球英雄!'
        : 'The whole team says: Great job! Preston is a baseball hero!',
      content: isSpanish ? `
        <p>Todo el equipo dice:</p>
        <p style="font-size: 2rem;">${cantoneseWord('goodboy')}!</p>
        <p>Preston es un héroe del béisbol! ⚾🏆</p>
      ` : isGrandparents ? `
        <p>全隊話:</p>
        <p style="font-size: 2rem;">${cantoneseWord('goodboy')}!</p>
        <p>Preston 係棒球英雄! ⚾🏆</p>
      ` : `
        <p>The whole team says:</p>
        <p style="font-size: 2rem;">${cantoneseWord('goodboy')}!</p>
        <p>Preston is a baseball hero! ⚾🏆</p>
      `
    }
  ];
}

const pages = getPages();
let currentPage = 0;

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
  } else if (page.type === 'counting') {
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
  } else if (page.type === 'math') {
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
    setTimeout(() => { document.getElementById('next-btn').disabled = false; }, 500);
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