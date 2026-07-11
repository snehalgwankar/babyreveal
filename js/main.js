/* ============================================================
   Baby Announcement — main.js
   Sections: config → sky (stars/clouds/particles) → confetti
   → characters → scene flow → audio controls
   All vanilla JS, no dependencies.
   ============================================================ */

"use strict";

const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    s.style.top = Math.random() * 55 + "%"; // upper sky only
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
    c.style.setProperty("--co", (0.55 + Math.random() * 0.35).toFixed(2));
    c.style.setProperty("--cd", (45 + Math.random() * 50) + "s");
    c.style.setProperty("--cdel", (-Math.random() * 60) + "s"); // start mid-drift
    c.style.top = (4 + Math.random() * 45) + "%";
    frag.appendChild(c);
  }
  wrap.appendChild(frag);
}

/* ------------------------------------------------------------
   2. Ambient glowing particles (canvas, very light)
   ------------------------------------------------------------ */

function startParticles() {
  if (REDUCED_MOTION) return;
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");
  let w, h, dots = [];

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const COUNT = Math.min(30, Math.floor(window.innerWidth / 30));
  for (let i = 0; i < COUNT; i++) {
    dots.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 1 + Math.random() * 2.4,
      vy: -(0.12 + Math.random() * 0.3),
      vx: (Math.random() - 0.5) * 0.15,
      a: 0.2 + Math.random() * 0.5,
      hue: Math.random() < 0.5 ? "255,236,190" : "255,255,255"
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
   3. Confetti + floating hearts (single canvas)
   ------------------------------------------------------------ */

const COLORS = ["#F7C6D0", "#BFDCF0", "#F2B44C", "#CDBBEA", "#F9DFA8", "#E89AAB"];

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
    const heart = Math.random() < 0.22;
    pieces.push({
      heart,
      x: Math.random() * w,
      y: -20 - Math.random() * h * 0.6,
      size: heart ? 10 + Math.random() * 10 : 5 + Math.random() * 8,
      vy: 1.2 + Math.random() * 2.4,
      vx: (Math.random() - 0.5) * 1.4,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.14,
      color: COLORS[(Math.random() * COLORS.length) | 0],
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
      if (p.heart) {
        drawHeart(ctx, p.size);
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
      }
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

/* ------------------------------------------------------------
   4. Balloons for the celebration scene
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
   5. Cartoon characters — one reusable SVG builder,
      varied by a config array. Edit CAST to change the crowd.
   ------------------------------------------------------------ */

const CAST = [
  { label: "Grandpa", skin: "#F2C9A4", outfit: "#7E9BC0", hair: "#E8E4DC", glasses: true,  wave: true  },
  { label: "Grandma", skin: "#EFC0A0", outfit: "#D98BA4", hair: "#EDEAE3", bun: true,      wave: true  },
  { label: "Uncle",   skin: "#D9A06B", outfit: "#6FAF8F", hair: "#4A3628", dance: true               },
  { label: "Aunt",    skin: "#E8B58C", outfit: "#C9A6E8", hair: "#3D2B20", bun: true,      dance: true },
  { label: "Cousin",  skin: "#F0C79E", outfit: "#F2B44C", hair: "#5A4632", wave: true               },
  { label: "Little one", skin: "#F5D3AE", outfit: "#F7A8BC", hair: "#6B5138", small: true, dance: true },
  { label: "Little one", skin: "#E3B084", outfit: "#9FD0EA", hair: "#3F2E22", small: true, wave: true  },
  { label: "Dear friend", skin: "#DFA878", outfit: "#EE9E7A", hair: "#2E2119", dance: true            }
];

function personSVG(c) {
  const scale = c.small ? 0.78 : 1;
  const hairShape = c.bun
    ? `<circle cx="50" cy="16" r="9" fill="${c.hair}"/>
       <path d="M30 34 Q30 14 50 14 Q70 14 70 34 L70 40 Q50 30 30 40 Z" fill="${c.hair}"/>`
    : `<path d="M30 36 Q28 14 50 14 Q72 14 70 36 L66 30 Q50 22 34 30 Z" fill="${c.hair}"/>`;
  const glasses = c.glasses
    ? `<g stroke="#5C4A5E" stroke-width="1.6" fill="none">
         <circle cx="43" cy="38" r="5"/><circle cx="57" cy="38" r="5"/>
         <line x1="48" y1="38" x2="52" y2="38"/></g>`
    : "";
  // Waving arm is a separate group so CSS can rotate it from the shoulder.
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
      <!-- static arm -->
      <rect x="25" y="54" width="9" height="24" rx="4.5" fill="${c.outfit}" transform="rotate(18 30 56)"/>
      <circle cx="24" cy="78" r="4.5" fill="${c.skin}"/>
      <!-- body -->
      <path d="M32 56 Q50 48 68 56 L66 100 Q50 106 34 100 Z" fill="${c.outfit}"/>
      <!-- legs -->
      <rect x="38" y="98" width="9" height="22" rx="4.5" fill="#8A7690"/>
      <rect x="53" y="98" width="9" height="22" rx="4.5" fill="#8A7690"/>
      <ellipse cx="42" cy="122" rx="7" ry="4" fill="#5C4A5E"/>
      <ellipse cx="58" cy="122" rx="7" ry="4" fill="#5C4A5E"/>
      <!-- head -->
      <circle cx="50" cy="38" r="20" fill="${c.skin}"/>
      ${hairShape}
      ${glasses}
      <!-- happy face -->
      <circle cx="43" cy="38" r="1.9" fill="#3A2B3C"/>
      <circle cx="57" cy="38" r="1.9" fill="#3A2B3C"/>
      <path d="M43 45 Q50 51 57 45" stroke="#3A2B3C" stroke-width="2" fill="none" stroke-linecap="round"/>
      <circle cx="38" cy="43" r="3" fill="rgba(232,154,171,.55)"/>
      <circle cx="62" cy="43" r="3" fill="rgba(232,154,171,.55)"/>
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
    // Staggered entrance
    setTimeout(() => el.classList.add("in"), 350 + i * 220);
  });
}

/* ------------------------------------------------------------
   6. Scene flow
   ------------------------------------------------------------ */

const scenes = {
  intro: document.getElementById("scene-intro"),
  celebration: document.getElementById("scene-celebration"),
  finale: document.getElementById("scene-finale")
};

function showScene(name) {
  Object.values(scenes).forEach(s => {
    s.classList.remove("is-active");
    s.hidden = true;
  });
  const s = scenes[name];
  s.hidden = false;
  // Next frame so the transition runs
  requestAnimationFrame(() => requestAnimationFrame(() => s.classList.add("is-active")));
  window.scrollTo({ top: 0 });
}

let revealed = false;

function reveal() {
  if (revealed) return;
  revealed = true;

  startMusic();
  document.getElementById("sky").classList.add("golden");
  launchCelebration(7000);

  showScene("celebration");
  buildBalloons();
  buildCrowd();

  // A second confetti wave mid-celebration, then the finale.
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
}

/* ------------------------------------------------------------
   7. Audio — starts only on first user tap (autoplay-safe)
   ------------------------------------------------------------ */

const music = document.getElementById("music");
const dock = document.getElementById("music-dock");
const btnPlay = document.getElementById("btn-play");
const btnMute = document.getElementById("btn-mute");
const volume = document.getElementById("volume");
let musicAvailable = true;

function startMusic() {
  music.volume = parseFloat(volume.value);
  music.play().then(() => {
    dock.hidden = false;
    requestAnimationFrame(() => dock.classList.add("show"));
  }).catch(() => {
    // Missing/blocked audio file — the experience continues silently.
    musicAvailable = false;
    console.info("Music not available. Add assets/audio/music.mp3 to enable it.");
  });
}

btnPlay.addEventListener("click", () => {
  if (music.paused) {
    music.play();
    btnPlay.textContent = "⏸";
    btnPlay.setAttribute("aria-label", "Pause music");
    btnPlay.setAttribute("aria-pressed", "true");
  } else {
    music.pause();
    btnPlay.textContent = "▶";
    btnPlay.setAttribute("aria-label", "Play music");
    btnPlay.setAttribute("aria-pressed", "false");
  }
});

btnMute.addEventListener("click", () => {
  music.muted = !music.muted;
  btnMute.textContent = music.muted ? "🔇" : "🔊";
  btnMute.setAttribute("aria-label", music.muted ? "Unmute music" : "Mute music");
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

/* ------------------------------------------------------------
   8. Boot
   ------------------------------------------------------------ */

document.getElementById("reveal-btn").addEventListener("click", reveal);
document.getElementById("replay-btn").addEventListener("click", replay);

// If a custom raster image replaces baby.svg but 404s, fall back to the SVG.
document.getElementById("baby-img").addEventListener("error", function () {
  if (!this.src.endsWith("baby.svg")) this.src = "assets/images/baby.svg";
});

buildStars();
buildClouds();
startParticles();
