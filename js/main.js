/* ============================================================
   गोड बातमी — main.js
   Sections: sky → toran/rangoli/diyas → particles → confetti
   → characters → scene flow → audio (autostart with retry)
   Vanilla JS, no dependencies.
   ============================================================ */

"use strict";

const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Festival palette for confetti, petals and balloons */
const COLORS = ["#F5B93F", "#C2504B", "#2E8B8B", "#E08BA8", "#E9A83A", "#FBDD9A"];

/* ------------------------------------------------------------
   1. SKY — stars & clouds
   ------------------------------------------------------------ */

function buildStars(count = 42) {
  const wrap = document.getElementById("stars");
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.className = "star";
    const size = 1.5 + Math.random() * 2.5;
    s.style.width = s.style.height = size + "px";
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 55 + "%";
    s.style.setProperty("--tw", (2.2 + Math.random() * 3) + "s");
    s.style.setProperty("--td", (Math.random() * 4) + "s");
    frag.appendChild(s);
  }
  wrap.appendChild(frag);
}

function buildClouds(count = 6) {
  const wrap = document.getElementById("clouds");
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const c = document.createElement("span");
    c.className = "cloud";
    c.style.setProperty("--cw", (110 + Math.random() * 160) + "px");
    c.style.setProperty("--co", (0.5 + Math.random() * 0.35).toFixed(2));
    c.style.setProperty("--cd", (45 + Math.random() * 50) + "s");
    c.style.setProperty("--cdel", (-Math.random() * 60) + "s");
    c.style.top = (6 + Math.random() * 42) + "%";
    frag.appendChild(c);
  }
  wrap.appendChild(frag);
}

/* ------------------------------------------------------------
   2. TORAN — mango-leaf & marigold garland across the top
   ------------------------------------------------------------ */

function buildToran() {
  const units = Math.ceil(window.innerWidth / 56);
  let inner = "";
  for (let i = 0; i < units; i++) {
    const x = i * 56 + 28;
    const marigold = i % 2 === 0;
    inner += `
      <g class="leaf-g" transform="translate(${x} 0)">
        <line x1="0" y1="0" x2="0" y2="10" stroke="#8E3B42" stroke-width="2"/>
        <path d="M0 10 C -13 22 -11 44 0 54 C 11 44 13 22 0 10 Z"
              fill="${marigold ? "#3E7C4F" : "#2F6B41"}"/>
        <line x1="0" y1="14" x2="0" y2="48" stroke="rgba(255,246,232,.45)" stroke-width="1.4"/>
        ${marigold ? `
        <circle cx="0" cy="60" r="9" fill="#F5B93F"/>
        <circle cx="0" cy="60" r="6" fill="#E9A83A"/>
        <circle cx="0" cy="60" r="3" fill="#C2504B"/>` : ``}
      </g>`;
  }
  // Scalloped string the garland hangs from
  document.getElementById("toran").innerHTML =
    `<svg viewBox="0 0 ${units * 56} 74" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
       <rect x="0" y="0" width="${units * 56}" height="5" fill="#8E3B42"/>
       ${inner}
     </svg>`;
}

/* ------------------------------------------------------------
   3. RANGOLI — radial petal motif (used behind banner & finale)
   ------------------------------------------------------------ */

function rangoliSVG() {
  let petals = "";
  for (let i = 0; i < 12; i++) {
    const a = i * 30;
    petals += `
      <g transform="rotate(${a} 100 100)">
        <path d="M100 22 C 90 44 90 62 100 74 C 110 62 110 44 100 22 Z"
              fill="none" stroke="#C2504B" stroke-width="1.6" opacity=".8"/>
        <circle cx="100" cy="16" r="2.6" fill="#F5B93F"/>
        <path d="M100 78 C 95 88 95 94 100 98 C 105 94 105 88 100 78 Z"
              fill="#2E8B8B" opacity=".55"/>
      </g>`;
  }
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      ${petals}
      <circle cx="100" cy="100" r="10" fill="none" stroke="#E9A83A" stroke-width="1.6"/>
      <circle cx="100" cy="100" r="4" fill="#C2504B"/>
    </svg>`;
}

function buildRangolis() {
  document.querySelectorAll(".rangoli").forEach(el => { el.innerHTML = rangoliSVG(); });
}

/* ------------------------------------------------------------
   4. DIYAS — flickering lamps
   ------------------------------------------------------------ */

function diyaSVG() {
  return `<svg viewBox="0 0 60 54" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g class="flame">
        <path d="M30 4 C 24 14 23 20 30 26 C 37 20 36 14 30 4 Z" fill="#F5B93F"/>
        <path d="M30 10 C 27 15 27 19 30 22 C 33 19 33 15 30 10 Z" fill="#FFF1C9"/>
      </g>
      <path d="M8 30 Q30 24 52 30 Q48 46 30 46 Q12 46 8 30 Z" fill="#8E3B42"/>
      <path d="M8 30 Q30 36 52 30 Q30 40 8 30 Z" fill="#C2504B"/>
    </svg>`;
}

function buildDiyas(perRow = 5) {
  document.querySelectorAll(".diya-row").forEach(row => {
    row.innerHTML = "";
    const n = window.innerWidth > 700 ? perRow + 2 : perRow;
    for (let i = 0; i < n; i++) {
      const d = document.createElement("span");
      d.className = "diya";
      d.style.setProperty("--fd", (Math.random() * 1.1).toFixed(2) + "s");
      d.innerHTML = diyaSVG();
      row.appendChild(d);
    }
  });
}

/* ------------------------------------------------------------
   5. Ambient glowing particles
   ------------------------------------------------------------ */

function startParticles() {
  if (REDUCED_MOTION) return;
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");
  let w, h;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const COUNT = Math.min(30, Math.floor(window.innerWidth / 30));
  const dots = [];
  for (let i = 0; i < COUNT; i++) {
    dots.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 1 + Math.random() * 2.4,
      vy: -(0.12 + Math.random() * 0.3),
      vx: (Math.random() - 0.5) * 0.15,
      a: 0.2 + Math.random() * 0.5,
      hue: Math.random() < 0.5 ? "251,221,154" : "255,255,255"
    });
  }

  (function tick() {
    ctx.clearRect(0, 0, w, h);
    for (const d of dots) {
      d.x += d.vx; d.y += d.vy;
      if (d.y < -8) { d.y = h + 8; d.x = Math.random() * w; }
      ctx.beginPath();
      ctx.fillStyle = `rgba(${d.hue},${d.a})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(${d.hue},.9)`;
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    requestAnimationFrame(tick);
  })();
}

/* ------------------------------------------------------------
   6. Confetti + hearts + marigold petals (single canvas)
   ------------------------------------------------------------ */

function launchCelebration(durationMs = 6500) {
  if (REDUCED_MOTION) return;
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  const w = canvas.width, h = canvas.height;

  const pieces = [];
  const N = Math.min(160, Math.floor(w / 6));
  for (let i = 0; i < N; i++) {
    const roll = Math.random();
    const kind = roll < 0.2 ? "heart" : roll < 0.5 ? "petal" : "confetti";
    pieces.push({
      kind,
      x: Math.random() * w,
      y: -20 - Math.random() * h * 0.6,
      size: kind === "heart" ? 10 + Math.random() * 10 : 5 + Math.random() * 8,
      vy: 1.2 + Math.random() * 2.4,
      vx: (Math.random() - 0.5) * 1.4,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.14,
      color: kind === "petal"
        ? (Math.random() < 0.5 ? "#F5B93F" : "#E9A83A")
        : COLORS[(Math.random() * COLORS.length) | 0],
      sway: Math.random() * Math.PI * 2
    });
  }

  const start = performance.now();
  (function tick(now) {
    const t = now - start;
    ctx.clearRect(0, 0, w, h);
    let alive = false;
    for (const p of pieces) {
      p.sway += 0.04;
      p.x += p.vx + Math.sin(p.sway) * 0.6;
      p.y += p.vy;
      p.rot += p.vr;
      if (p.y < h + 30) alive = true;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.kind === "heart") drawHeart(ctx, p.size);
      else if (p.kind === "petal") drawPetal(ctx, p.size);
      else ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
      ctx.restore();
    }
    if (alive && t < durationMs) requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, w, h);
  })(start);
}

function drawHeart(ctx, s) {
  ctx.beginPath();
  ctx.moveTo(0, s * 0.3);
  ctx.bezierCurveTo(-s * 0.5, -s * 0.25, -s * 0.16, -s * 0.55, 0, -s * 0.2);
  ctx.bezierCurveTo(s * 0.16, -s * 0.55, s * 0.5, -s * 0.25, 0, s * 0.3);
  ctx.fill();
}

function drawPetal(ctx, s) {
  ctx.beginPath();
  ctx.ellipse(0, 0, s * 0.35, s * 0.7, 0, 0, Math.PI * 2);
  ctx.fill();
}

/* ------------------------------------------------------------
   7. Balloons
   ------------------------------------------------------------ */

function buildBalloons(count = 9) {
  const wrap = document.getElementById("balloons");
  wrap.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const b = document.createElement("span");
    b.className = "balloon";
    b.style.setProperty("--bw", (36 + Math.random() * 34) + "px");
    b.style.setProperty("--bc", COLORS[i % COLORS.length]);
    b.style.setProperty("--bd", (10 + Math.random() * 9) + "s");
    b.style.setProperty("--bdel", (Math.random() * 8) + "s");
    b.style.left = (4 + Math.random() * 92) + "%";
    wrap.appendChild(b);
  }
}

/* ------------------------------------------------------------
   8. Cartoon characters — Marathi cast.
      Flags: wave, dance, small, glasses, bun, bindi, topi.
   ------------------------------------------------------------ */

const CAST = [
  { label: "आजोबा",       skin: "#F2C9A4", outfit: "#EDE6D6", hair: "#E8E4DC", glasses: true, topi: true,  wave: true  },
  { label: "आजी",         skin: "#EFC0A0", outfit: "#C2504B", hair: "#EDEAE3", bun: true,  bindi: true,   wave: true  },
  { label: "काका",        skin: "#D9A06B", outfit: "#2E8B8B", hair: "#4A3628", dance: true                            },
  { label: "मावशी",       skin: "#E8B58C", outfit: "#E08BA8", hair: "#3D2B20", bun: true,  bindi: true,   dance: true },
  { label: "ताई",         skin: "#F0C79E", outfit: "#F5B93F", hair: "#5A4632", bindi: true, wave: true                },
  { label: "छोटू",        skin: "#F5D3AE", outfit: "#2E8B8B", hair: "#6B5138", small: true, dance: true              },
  { label: "चिमुकली",     skin: "#E3B084", outfit: "#E08BA8", hair: "#3F2E22", small: true, bindi: true, wave: true  },
  { label: "जिवलग मित्र", skin: "#DFA878", outfit: "#E9A83A", hair: "#2E2119", dance: true                            }
];

function personSVG(c) {
  const scale = c.small ? 0.78 : 1;
  const hairShape = c.bun
    ? `<circle cx="50" cy="16" r="9" fill="${c.hair}"/>
       <path d="M30 34 Q30 14 50 14 Q70 14 70 34 L70 40 Q50 30 30 40 Z" fill="${c.hair}"/>`
    : `<path d="M30 36 Q28 14 50 14 Q72 14 70 36 L66 30 Q50 22 34 30 Z" fill="${c.hair}"/>`;
  const topi = c.topi
    ? `<path d="M31 28 Q50 12 69 28 L67 22 Q50 8 33 22 Z" fill="#F5F1E6" stroke="#C2504B" stroke-width="1.2"/>`
    : "";
  const glasses = c.glasses
    ? `<g stroke="#4A2E33" stroke-width="1.6" fill="none">
         <circle cx="43" cy="38" r="5"/><circle cx="57" cy="38" r="5"/>
         <line x1="48" y1="38" x2="52" y2="38"/></g>`
    : "";
  const bindi = c.bindi ? `<circle cx="50" cy="30" r="2" fill="#C2504B"/>` : "";
  const wavingArm = c.wave
    ? `<g class="arm-wave">
         <rect x="66" y="52" width="9" height="26" rx="4.5" fill="${c.outfit}"
               transform="rotate(-130 70 56)"/>
         <circle cx="88" cy="43" r="5" fill="${c.skin}"/>
       </g>`
    : `<rect x="66" y="54" width="9" height="24" rx="4.5" fill="${c.outfit}" transform="rotate(-18 70 56)"/>
       <circle cx="76" cy="78" r="4.5" fill="${c.skin}"/>`;

  return `
  <svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g class="body-g" transform="scale(${scale}) translate(${c.small ? 14 : 0} ${c.small ? 36 : 0})">
      <rect x="25" y="54" width="9" height="24" rx="4.5" fill="${c.outfit}" transform="rotate(18 30 56)"/>
      <circle cx="24" cy="78" r="4.5" fill="${c.skin}"/>
      <path d="M32 56 Q50 48 68 56 L66 100 Q50 106 34 100 Z" fill="${c.outfit}"/>
      <rect x="38" y="98" width="9" height="22" rx="4.5" fill="#8A6258"/>
      <rect x="53" y="98" width="9" height="22" rx="4.5" fill="#8A6258"/>
      <ellipse cx="42" cy="122" rx="7" ry="4" fill="#4A2E33"/>
      <ellipse cx="58" cy="122" rx="7" ry="4" fill="#4A2E33"/>
      <circle cx="50" cy="38" r="20" fill="${c.skin}"/>
      ${hairShape}
      ${topi}
      ${glasses}
      ${bindi}
      <circle cx="43" cy="38" r="1.9" fill="#3A2226"/>
      <circle cx="57" cy="38" r="1.9" fill="#3A2226"/>
      <path d="M43 45 Q50 51 57 45" stroke="#3A2226" stroke-width="2" fill="none" stroke-linecap="round"/>
      <circle cx="38" cy="43" r="3" fill="rgba(224,139,168,.55)"/>
      <circle cx="62" cy="43" r="3" fill="rgba(224,139,168,.55)"/>
      ${wavingArm}
    </g>
  </svg>`;
}

function buildCrowd() {
  const crowd = document.getElementById("crowd");
  crowd.innerHTML = "";
  CAST.forEach((c, i) => {
    const el = document.createElement("div");
    el.className = "person" + (c.dance ? " dancer" : "");
    el.style.setProperty("--pb", (1.3 + (i % 4) * 0.18) + "s");
    el.innerHTML = personSVG(c) + `<div class="label">${c.label}</div>`;
    crowd.appendChild(el);
    setTimeout(() => el.classList.add("in"), 350 + i * 220);
  });
}

/* ------------------------------------------------------------
   9. Scene flow — lift-away exit, then crossfade in
   ------------------------------------------------------------ */

const scenes = {
  gift: document.getElementById("scene-gift"),
  intro: document.getElementById("scene-intro"),
  celebration: document.getElementById("scene-celebration"),
  finale: document.getElementById("scene-finale")
};

function showScene(name) {
  const current = Object.values(scenes).find(s => s.classList.contains("is-active"));
  const next = scenes[name];

  const enter = () => {
    Object.values(scenes).forEach(s => {
      s.classList.remove("is-active", "is-leaving");
      s.hidden = true;
    });
    next.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => next.classList.add("is-active")));
    window.scrollTo({ top: 0 });
  };

  if (current && current !== next) {
    current.classList.add("is-leaving");
    setTimeout(enter, REDUCED_MOTION ? 100 : 900);
  } else {
    enter();
  }
}

let revealed = false;
let introTimer = null;

function reveal() {
  if (revealed) return;
  revealed = true;

  tryStartMusic(); // harmless if already playing
  document.getElementById("sky").classList.add("golden");
  launchCelebration(7000);

  showScene("celebration");
  buildBalloons();
  buildCrowd();

  const celebrationLength = REDUCED_MOTION ? 1500 : 11000;
  if (!REDUCED_MOTION) setTimeout(() => launchCelebration(4000), 5500);
  setTimeout(() => {
    showScene("finale");
    if (!REDUCED_MOTION) setTimeout(() => launchCelebration(3500), 800);
  }, celebrationLength);
}

function replay() {
  revealed = false;
  document.getElementById("sky").classList.remove("golden");
  showScene("intro");
  clearTimeout(introTimer);
  introTimer = setTimeout(reveal, INTRO_DURATION);
}

/* ------------------------------------------------------------
   10. Audio — autostart attempt + retry on every interaction
       until it succeeds. Toast guides the visitor if blocked.
   ------------------------------------------------------------ */

const music = document.getElementById("music");
const dock = document.getElementById("music-dock");
const toast = document.getElementById("sound-toast");
const btnPlay = document.getElementById("btn-play");
const btnMute = document.getElementById("btn-mute");
const volume = document.getElementById("volume");

let musicStarted = false;

function tryStartMusic() {
  if (musicStarted) return;
  music.volume = parseFloat(volume.value);
  music.play().then(() => {
    musicStarted = true;
    toast.hidden = true;
    dock.hidden = false;
    requestAnimationFrame(() => dock.classList.add("show"));
  }).catch(() => {
    // Autoplay blocked (or file missing) — show the tap-for-sound hint.
    // Listeners below keep retrying on every interaction until success.
    if (music.error) {
      console.info("Music file not found: assets/audio/music.mp3");
    } else {
      toast.hidden = false;
    }
  });
}

// Retry on ANY interaction until music starts (covers all browsers).
["pointerdown", "touchstart", "keydown", "scroll"].forEach(evt =>
  document.addEventListener(evt, tryStartMusic, { passive: true })
);

btnPlay.addEventListener("click", (e) => {
  e.stopPropagation();
  if (music.paused) {
    music.play();
    btnPlay.textContent = "⏸";
    btnPlay.setAttribute("aria-label", "संगीत थांबवा");
    btnPlay.setAttribute("aria-pressed", "true");
  } else {
    music.pause();
    btnPlay.textContent = "▶";
    btnPlay.setAttribute("aria-label", "संगीत सुरू करा");
    btnPlay.setAttribute("aria-pressed", "false");
  }
});

btnMute.addEventListener("click", (e) => {
  e.stopPropagation();
  music.muted = !music.muted;
  btnMute.textContent = music.muted ? "🔇" : "🔊";
  btnMute.setAttribute("aria-label", music.muted ? "आवाज सुरू करा" : "आवाज बंद करा");
  btnMute.setAttribute("aria-pressed", String(music.muted));
});

volume.addEventListener("input", () => {
  music.volume = parseFloat(volume.value);
  if (music.volume > 0 && music.muted) {
    music.muted = false;
    btnMute.textContent = "🔊";
    btnMute.setAttribute("aria-pressed", "false");
  }
});

// Pause button state must never desync if playback is toggled elsewhere.
music.addEventListener("pause", () => { btnPlay.textContent = "▶"; });
music.addEventListener("play",  () => { btnPlay.textContent = "⏸"; });

/* ------------------------------------------------------------
   11. Boot
   ------------------------------------------------------------ */
let giftOpened = false;
document.getElementById("gift-btn").addEventListener("click", function () {
  if (giftOpened) return;
  giftOpened = true;
  tryStartMusic();                          // real tap → music starts reliably
  this.classList.add("opening");
  if (!REDUCED_MOTION) launchCelebration(2500);   // little burst from the box
  setTimeout(() => {
    showScene("intro");
    introTimer = setTimeout(reveal, INTRO_DURATION);
  }, REDUCED_MOTION ? 200 : 1100);          // let the lid swing open first
});


const INTRO_DURATION = 6000; // intro plays this long, then auto-reveals

document.getElementById("replay-btn").addEventListener("click", (e) => {
  e.stopPropagation();
  replay();
});

document.getElementById("baby-img").addEventListener("error", function () {
  if (!this.src.endsWith("baby.svg")) this.src = "assets/images/baby.svg";
});

buildStars();
buildClouds();
buildToran();
buildRangolis();
buildDiyas();
startParticles();

window.addEventListener("resize", () => { buildToran(); });
