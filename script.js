// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Reduced motion check
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============================
// Noise -> Signal canvas
// ============================
const canvas = document.getElementById('noise-canvas');
const ctx = canvas.getContext('2d');
let W, H;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const COUNT = 160;
const particles = [];

function sineTarget(i, t) {
  const x = (i / COUNT) * W;
  const y = H * 0.5 + Math.sin((x / W) * Math.PI * 2.4 + t) * (H * 0.09);
  return { x, y };
}

for (let i = 0; i < COUNT; i++) {
  particles.push({
    x: Math.random() * W,
    y: Math.random() * H,
    startX: Math.random() * W,
    startY: Math.random() * H,
    r: Math.random() * 1.6 + 0.6,
  });
}

let progress = 0; // 0 = noise, 1 = signal
const settleDuration = prefersReducedMotion ? 1 : 2600; // ms
let startTime = null;

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

function draw(now) {
  if (startTime === null) startTime = now;
  const elapsed = now - startTime;
  progress = Math.min(1, elapsed / settleDuration);
  const eased = easeOutCubic(progress);

  ctx.clearRect(0, 0, W, H);

  const t = now / 1800;

  particles.forEach((p, i) => {
    const target = sineTarget(i, t);
    const idleJitterX = Math.sin(now / 900 + i) * 2;
    const idleJitterY = Math.cos(now / 1100 + i) * 2;

    const x = p.startX + (target.x + idleJitterX - p.startX) * eased;
    const y = p.startY + (target.y + idleJitterY - p.startY) * eased;

    ctx.beginPath();
    ctx.arc(x, y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(94, 234, 212, ${0.25 + eased * 0.5})`;
    ctx.fill();
  });

  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);

// ============================
// About page photo carousel
// ============================
const carousel = document.getElementById('about-carousel');

if (carousel) {
  // Edit this list to add/remove/reorder your own photos.
  // Put the image files in assets/photos/ using these filenames (or update the paths below).
  const photos = [
    { src: 'assets/photos/Photo_website_3.jpg', alt: 'Photo 1' },
    { src: 'assets/photos/Victor_S_Website_p1.jpeg', alt: 'Photo 2' },
  ];

  const img = document.getElementById('carousel-img');
  const dotsWrap = document.getElementById('carousel-dots');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  let index = 0;

  photos.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'photo-carousel__dot';
    dot.setAttribute('aria-label', `Go to photo ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  const dots = dotsWrap.querySelectorAll('.photo-carousel__dot');

  function render() {
    const photo = photos[index];
    img.src = photo.src;
    img.alt = `${photo.alt} (${index + 1} of ${photos.length})`;
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
  }

  function goTo(i) {
    index = (i + photos.length) % photos.length;
    render();
  }

  prevBtn.addEventListener('click', () => goTo(index - 1));
  nextBtn.addEventListener('click', () => goTo(index + 1));

  carousel.setAttribute('tabindex', '0');
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goTo(index - 1);
    if (e.key === 'ArrowRight') goTo(index + 1);
  });

  render();
}

