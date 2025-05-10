// Custom JS for Be Scrumtuous

document.addEventListener('DOMContentLoaded', function () {
  const brand = document.getElementById('brand-animate');
  const annoyances = [
    () => { // Shake
      brand.classList.add('annoy-shake');
      setTimeout(() => brand.classList.remove('annoy-shake'), 700);
    },
    () => { // Color flash
      brand.classList.add('annoy-flash');
      setTimeout(() => brand.classList.remove('annoy-flash'), 700);
    },
    () => { // Bounce
      brand.classList.add('annoy-bounce');
      setTimeout(() => brand.classList.remove('annoy-bounce'), 700);
    }
  ];

  function annoy() {
    const fn = annoyances[Math.floor(Math.random() * annoyances.length)];
    fn();
    const next = 10000 + Math.random() * 5000;
    setTimeout(annoy, next);
  }

  setTimeout(annoy, 10000 + Math.random() * 5000);
});

// Page loader logic
window.addEventListener('load', function () {
  const loader = document.getElementById('page-loader');
  if (loader) {
    loader.classList.add('hidden');
    setTimeout(() => loader.style.display = 'none', 600);
  }
});

// Testimonials fly-in on scroll
function observeTestimonials() {
  const imgs = document.querySelectorAll('.testimonial-img');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    imgs.forEach(img => observer.observe(img));
  } else {
    // Fallback: show all
    imgs.forEach(img => img.classList.add('in-view'));
  }
}
document.addEventListener('DOMContentLoaded', observeTestimonials);

// About image fly-in on scroll
function observeAboutImg() {
  const aboutImg = document.querySelector('.about-img');
  if (!aboutImg) return;
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(aboutImg);
  } else {
    aboutImg.classList.add('in-view');
  }
}
document.addEventListener('DOMContentLoaded', observeAboutImg);

// Stats count-up animation on scroll
function animateStats() {
  const statsSection = document.getElementById('stats');
  const statNumbers = document.querySelectorAll('.stats-number');
  let started = false;
  if (!statsSection || !statNumbers.length) return;
  function countUp(el, target, plus) {
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();
    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(progress * target);
      el.textContent = value + (plus && progress === 1 ? plus : '');
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + (plus ? plus : '');
      }
    }
    requestAnimationFrame(update);
  }
  function trigger() {
    if (started) return;
    started = true;
    statNumbers.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const plus = el.getAttribute('data-plus') || '';
      countUp(el, target, plus);
    });
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          trigger();
          obs.disconnect();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(statsSection);
  } else {
    trigger();
  }
}
document.addEventListener('DOMContentLoaded', animateStats); 