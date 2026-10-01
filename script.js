// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// ============================
// About page photo carousel
// ============================
const carousel = document.getElementById('about-carousel');

if (carousel) {
  // Edit this list to add/remove/reorder your own photos.
  // Put the image files in assets/photos/ using these filenames (or update the paths below).
  const photos = [
    { src: 'assets/photos/Victor_S_Website_p1.jpeg', alt: 'Photo 1' },
    { src: 'assets/photos/Zambia_plane.png', alt: 'Photo 2' },
    { src: 'assets/photos/Giza_photo.jpeg', alt: 'Photo 3' },
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

