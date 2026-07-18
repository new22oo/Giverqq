/* ---------------- Loading Screen ---------------- */
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('hidden'), 900);
});

/* ---------------- Custom Cursor ---------------- */
const cursorDot = document.getElementById('cursorDot');
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
window.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});
function animateGlow(){
  glowX += (mouseX - glowX) * 0.12;
  glowY += (mouseY - glowY) * 0.12;
  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top = glowY + 'px';
  requestAnimationFrame(animateGlow);
}
animateGlow();

/* ---------------- Ripple on buttons ---------------- */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e){
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });
});

/* ---------------- Progress bar ---------------- */
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  document.getElementById('progress-bar').style.width = scrolled + '%';

  const scrollTopBtn = document.getElementById('scroll-top');
  if (h.scrollTop > 600) scrollTopBtn.classList.add('show');
  else scrollTopBtn.classList.remove('show');
});
document.getElementById('scroll-top').addEventListener('click', () => {
  window.scrollTo({top:0, behavior:'smooth'});
});

/* ---------------- Scroll Reveal (IntersectionObserver) ---------------- */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('in-view');
  });
}, {threshold:0.15});
revealEls.forEach(el => revealObserver.observe(el));

/* ---------------- Staggered line reveal (feelings / truth / closing) ---------------- */
const lineGroups = [document.querySelectorAll('#feelings .reveal-line'),
                     document.querySelectorAll('#truth .reveal-line'),
                     document.querySelectorAll('#closing .reveal-line')];

lineGroups.forEach(group => {
  group.forEach((line, i) => {
    const lineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('in-view'), i * 220);
          lineObserver.unobserve(entry.target);
        }
      });
    }, {threshold:0.4});
    lineObserver.observe(line);
  });
});

/* ---------------- Stars canvas (twinkling) ---------------- */
const starsCanvas = document.getElementById('stars-canvas');
const starsCtx = starsCanvas.getContext('2d');
let stars = [];
function resizeStars(){
  starsCanvas.width = starsCanvas.offsetWidth;
  starsCanvas.height = starsCanvas.offsetHeight;
  const count = Math.floor((starsCanvas.width * starsCanvas.height) / 6000);
  stars = Array.from({length: count}, () => ({
    x: Math.random() * starsCanvas.width,
    y: Math.random() * starsCanvas.height,
    r: Math.random() * 1.4 + 0.3,
    baseAlpha: Math.random() * 0.6 + 0.2,
    twinkleSpeed: Math.random() * 0.02 + 0.005,
    phase: Math.random() * Math.PI * 2
  }));
}
function drawStars(t){
  starsCtx.clearRect(0,0,starsCanvas.width, starsCanvas.height);
  stars.forEach(s => {
    const alpha = s.baseAlpha + Math.sin(t * s.twinkleSpeed + s.phase) * 0.3;
    starsCtx.beginPath();
    starsCtx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    starsCtx.fillStyle = `rgba(255,255,255,${Math.max(0,alpha)})`;
    starsCtx.fill();
  });
  requestAnimationFrame(drawStars);
}
resizeStars();
requestAnimationFrame(drawStars);

/* ---------------- Floating light particles ---------------- */
const partCanvas = document.getElementById('particles-canvas');
const partCtx = partCanvas.getContext('2d');
let particles = [];
const colors = ['#7C5CFF','#00D9FF','#9CFFB8'];
function resizeParticles(){
  partCanvas.width = partCanvas.offsetWidth;
  partCanvas.height = partCanvas.offsetHeight;
  const count = Math.floor(partCanvas.width / 40);
  particles = Array.from({length: count}, () => ({
    x: Math.random() * partCanvas.width,
    y: Math.random() * partCanvas.height,
    r: Math.random() * 2 + 1,
    speedY: Math.random() * 0.4 + 0.1,
    drift: Math.random() * 0.6 - 0.3,
    color: colors[Math.floor(Math.random()*colors.length)],
    alpha: Math.random() * 0.5 + 0.15
  }));
}
function drawParticles(){
  partCtx.clearRect(0,0,partCanvas.width, partCanvas.height);
  particles.forEach(p => {
    p.y -= p.speedY;
    p.x += p.drift;
    if (p.y < -10) { p.y = partCanvas.height + 10; p.x = Math.random()*partCanvas.width; }
    partCtx.beginPath();
    partCtx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    partCtx.fillStyle = p.color;
    partCtx.globalAlpha = p.alpha;
    partCtx.shadowColor = p.color;
    partCtx.shadowBlur = 8;
    partCtx.fill();
    partCtx.globalAlpha = 1;
  });
  requestAnimationFrame(drawParticles);
}
resizeParticles();
requestAnimationFrame(drawParticles);

window.addEventListener('resize', () => { resizeStars(); resizeParticles(); });

/* ---------------- Parallax mouse on hero gradient ---------------- */
const heroGradient = document.querySelector('.hero-bg-gradient');
document.getElementById('hero').addEventListener('mousemove', (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  heroGradient.style.transform = `translate(${x*20}px, ${y*20}px)`;
});

/* ---------------- Background tint shift on scroll ---------------- */
window.addEventListener('scroll', () => {
  const scrollRatio = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
  const hue = 250 + scrollRatio * 60;
  document.body.style.backgroundColor = `hsl(${hue}, 40%, 2%)`;
});
