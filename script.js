lucide.createIcons();
gsap.registerPlugin(ScrollTrigger);

function getHeaderOffset() {
  const navbar = document.getElementById('navbar');
  return (navbar ? navbar.offsetHeight : 80) + 8;
}

function setMenuIcon(isOpen) {
  const btn = document.getElementById('menuToggle');
  if (!btn) return;
  btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  btn.innerHTML = isOpen
    ? '<i data-lucide="x" id="menuIcon" class="w-4 h-4"></i>'
    : '<i data-lucide="menu" id="menuIcon" class="w-4 h-4"></i>';
  lucide.createIcons();
}

function closeMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (!menu) return;
  menu.classList.remove('open');
  menu.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('menu-open');
  setMenuIcon(false);
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (!menu) return;
  const isOpen = !menu.classList.contains('open');
  menu.classList.toggle('open', isOpen);
  menu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  document.body.classList.toggle('menu-open', isOpen);
  setMenuIcon(isOpen);
}

window.addEventListener('DOMContentLoaded', () => {
  // Varsayılan tema kontrolü (Hafızada yoksa açık modla başla)
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
    updateThemeIcon(true);
  } else {
    document.documentElement.classList.remove('dark');
    updateThemeIcon(false);
  }

  // Hero Giriş Animasyonu
  const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } });
  tl.from('#navbar', { y: -80, opacity: 0 })
    .from('#hero h1', { y: 35, opacity: 0 }, '-=0.4')
    .from('#hero p', { y: 20, opacity: 0 }, '-=0.5')
    .from('#hero .btn-magnetic', { scale: 0.92, opacity: 0, stagger: 0.12 }, '-=0.5')
    .from('#heroImageBlock', { y: 30, opacity: 0, duration: 1 }, '-=0.7');

  // Kartların Kayarken Süzülmesi
  gsap.utils.toArray('.luxury-card').forEach((card) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
      y: 20,
      opacity: 0,
      duration: 0.55,
      ease: 'power2.out',
    });
  });

  // İpeksi Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        closeMobileMenu();
        const headerOffset = getHeaderOffset();
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  document.querySelectorAll('#mobileMenu a[href^="https://"]').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) closeMobileMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });
});

// Karanlık Mod
function toggleDarkMode() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
  const icon = document.getElementById('themeIcon');
  if (!icon) return;
  icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
  lucide.createIcons();
}

// 3 Dilli Dil Değiştirici (Class çakışması sıfırlandı)
function setLanguage(lang) {
  if (!translations[lang]) return;

  const html = document.documentElement;
  html.setAttribute('lang', lang);
  html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

  ['tr', 'en', 'ar'].forEach((l) => {
    const btn = document.getElementById(`btn-${l}`);
    if (btn) {
      if (l === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
  });

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  const nameInput = document.getElementById('custName');
  const phoneInput = document.getElementById('custPhone');
  const noteInput = document.getElementById('custNote');
  if (nameInput) nameInput.placeholder = translations[lang].placeholder_name;
  if (phoneInput) phoneInput.placeholder = translations[lang].placeholder_phone;
  if (noteInput) noteInput.placeholder = translations[lang].placeholder_note;

  lucide.createIcons();
}

// WhatsApp Yönlendirme (Yeni Şirket Numarası: 0553 533 33 70)
function sendToWhatsApp(e) {
  e.preventDefault();
  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const note = document.getElementById('custNote').value.trim() || 'Projeleriniz hakkında bilgi almak istiyorum.';

  const message = `Merhaba,\n\nMaktabi İnşaat projeleriniz hakkında bilgi almak istiyorum.\n\n👤 İsim: ${name}\n📞 Telefon: ${phone}\n📝 Not: ${note}`;
  window.open(`https://wa.me/905535333370?text=${encodeURIComponent(message)}`, '_blank');
}