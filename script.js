(() => {
  'use strict';

  const root = document.documentElement;
  root.classList.add('js');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  // Progressive reveal: elements remain visible when IntersectionObserver is unavailable.
  const revealItems = $$('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach((item, index) => {
      if (index % 4 !== 0) item.dataset.delay = String(index % 4);
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  // Navigation: one shared underline glides between the active links in reading order.
  const header = $('#site-header');
  const desktopNav = $('.desktop-nav');
  const desktopLinks = $$('.desktop-nav .nav-link');
  const allNavLinks = $$('.desktop-nav .nav-link, .mobile-menu a');
  const sections = $$('main > section[id]');
  const mobileMenu = $('#mobile-menu');
  const menuToggle = $('#menu-toggle');

  const navIndicator = document.createElement('span');
  navIndicator.className = 'nav-indicator';
  navIndicator.setAttribute('aria-hidden', 'true');
  desktopNav?.append(navIndicator);
  let selectedDesktopLink = desktopLinks.find((link) => link.classList.contains('is-active')) || desktopLinks[0] || null;

  function moveNavIndicator(link) {
    if (!link || !navIndicator || !desktopNav) return;
    navIndicator.style.left = `${link.offsetLeft}px`;
    navIndicator.style.width = `${link.offsetWidth}px`;
    navIndicator.classList.add('is-positioned');
  }

  function setActiveLink(id) {
    desktopLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', active);
      if (active) {
        link.setAttribute('aria-current', 'page');
        selectedDesktopLink = link;
      } else {
        link.removeAttribute('aria-current');
      }
    });
    moveNavIndicator(selectedDesktopLink);
  }

  desktopLinks.forEach((link) => {
    link.addEventListener('pointerenter', () => moveNavIndicator(link));
    link.addEventListener('focus', () => moveNavIndicator(link));
    link.addEventListener('pointerleave', () => moveNavIndicator(selectedDesktopLink));
    link.addEventListener('blur', () => moveNavIndicator(selectedDesktopLink));
  });

  function syncActiveSection() {
    if (!sections.length) return;
    const activationLine = Math.min(window.innerHeight * 0.34, 250);
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= activationLine) current = section;
      else break;
    }
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
      current = sections[sections.length - 1];
    }
    const nextDesktopLink = desktopLinks.find((link) => link.getAttribute('href') === `#${current.id}`);
    if (nextDesktopLink && nextDesktopLink !== selectedDesktopLink) setActiveLink(current.id);
  }

  function closeMobileMenu() {
    if (!mobileMenu || !menuToggle) return;
    mobileMenu.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
  }

  menuToggle?.addEventListener('click', () => {
    const opening = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(opening));
    menuToggle.setAttribute('aria-label', opening ? 'Close navigation menu' : 'Open navigation menu');
    mobileMenu.hidden = !opening;
    if (opening) playUiSound('tap');
  });

  allNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const targetId = link.getAttribute('href')?.slice(1);
      if (targetId) setActiveLink(targetId);
      if (link.classList.contains('nav-link')) {
        link.classList.remove('is-clicked');
        void link.offsetWidth;
        link.classList.add('is-clicked');
        window.setTimeout(() => link.classList.remove('is-clicked'), 650);
      }
      closeMobileMenu();
      playUiSound('tap');
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMobileMenu();
  });

  window.addEventListener('resize', () => moveNavIndicator(selectedDesktopLink), { passive: true });
  window.requestAnimationFrame(() => {
    moveNavIndicator(selectedDesktopLink);
    syncActiveSection();
  });

  // Scroll chrome is updated in one animation frame to avoid work on every scroll event.
  const progress = $('#scroll-progress');
  let scrollFrame = 0;
  function updateScrollChrome() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    if (progress) progress.style.width = `${Math.min(100, Math.max(0, pct))}%`;
    header?.classList.toggle('is-scrolled', window.scrollY > 16);
    syncActiveSection();
    scrollFrame = 0;
  }
  window.addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollChrome);
  }, { passive: true });
  updateScrollChrome();

  // Optional generated interface tones. Browsers require a user gesture before audio can start.
  let audioContext = null;
  let soundEnabled = false;
  const soundToggle = $('#sound-toggle');
  const soundLabel = $('.sound-label', soundToggle || document);

  function getAudioContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!audioContext) audioContext = new AudioContextClass();
    if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
    return audioContext;
  }

  function playTone(frequency = 560, duration = .075, wave = 'sine', volume = .025) {
    if (!soundEnabled) return;
    const context = getAudioContext();
    if (!context) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const start = context.currentTime;
    oscillator.type = wave;
    oscillator.frequency.setValueAtTime(frequency, start);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(90, frequency * .68), start + duration);
    gain.gain.setValueAtTime(.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + .012);
    gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + .015);
  }

  function playUiSound(kind) {
    if (!soundEnabled) return;
    if (kind === 'success') {
      playTone(660, .11, 'triangle', .035);
      window.setTimeout(() => playTone(880, .16, 'sine', .026), 95);
    } else {
      playTone(520, .055, 'sine', .016);
    }
  }

  soundToggle?.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundToggle.setAttribute('aria-pressed', String(soundEnabled));
    soundToggle.setAttribute('aria-label', soundEnabled ? 'Disable interface sounds' : 'Enable interface sounds');
    if (soundLabel) soundLabel.textContent = soundEnabled ? 'SOUND ON' : 'SOUND OFF';
    if (soundEnabled) {
      getAudioContext();
      playTone(720, .12, 'triangle', .03);
    }
  });

  // Lightweight card response: no pointer-driven tilt or page zoom.
  if (finePointer && !prefersReducedMotion) {
    $$('.card-tilt').forEach((card) => {
      card.addEventListener('click', (event) => {
        if (event.target.closest('a')) return;
        card.classList.remove('is-tapped');
        void card.offsetWidth;
        card.classList.add('is-tapped');
        window.setTimeout(() => card.classList.remove('is-tapped'), 500);
      });
    });
  }

  // The portrait gets a five-second green digital-rain scan. Canvas work stops
  // completely after approval and is capped at 30fps while the scan is active.
  const portraitStage = $('#portrait-stage');
  const portraitFrame = $('.portrait-frame', portraitStage || document);
  const profileImage = $('#profile-image');
  const scanCanvas = $('#scan-digits');
  const scanStatus = $('#scan-status-text');
  const scanTimer = $('#scan-timer');
  const finalState = $('#scan-final-state');
  const readoutSpinner = $('.readout-spinner');
  let scanRunning = false;
  let scanStartedAt = 0;
  let scanAnimation = 0;
  let scanCtx = null;
  let scanColumns = [];
  let scanWidth = 0;
  let scanHeight = 0;
  let lastDigitsFrame = 0;
  let scanDuration = 5;
  const scanMessages = [
    { progress: 0, text: 'INITIALIZING VISUAL SCAN' },
    { progress: .21, text: 'SAMPLING IMAGE PIXELS' },
    { progress: .42, text: 'CROSS-CHECKING PATTERN' },
    { progress: .64, text: 'RESOLVING PROFILE DATA' },
    { progress: .84, text: 'FINALIZING SIGNATURE' }
  ];
  const scanDurationLabel = $('#scan-duration-label');

  function resizeScanCanvas() {
    if (!scanCanvas) return;
    const rect = scanCanvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    scanWidth = Math.max(1, rect.width);
    scanHeight = Math.max(1, rect.height);
    scanCanvas.width = Math.round(scanWidth * dpr);
    scanCanvas.height = Math.round(scanHeight * dpr);
    scanCtx = scanCanvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!scanCtx) return;
    scanCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const gap = 14;
    scanColumns = Array.from({ length: Math.ceil(scanWidth / gap) }, () => ({
      y: Math.random() * scanHeight,
      speed: 3.5 + Math.random() * 5.5,
      length: 7 + Math.floor(Math.random() * 7),
      offset: Math.floor(Math.random() * 2)
    }));
  }

  function drawScanDigits(now) {
    if (!scanRunning || !scanCtx) return;
    if (now - lastDigitsFrame < 32) return;
    const delta = lastDigitsFrame ? Math.min(2.2, (now - lastDigitsFrame) / 16.67) : 1;
    lastDigitsFrame = now;
    scanCtx.clearRect(0, 0, scanWidth, scanHeight);
    scanCtx.font = 'bold 12px ui-monospace, monospace';
    scanCtx.textBaseline = 'top';
    const gap = 14;
    const chars = '0101011001010011010011001010101100101100101011010010';
    const tick = Math.floor(now / 115);
    scanColumns.forEach((column, index) => {
      const x = 3 + index * gap;
      for (let trail = 0; trail < column.length; trail += 1) {
        const y = column.y - trail * 15;
        if (y < -15 || y > scanHeight + 12) continue;
        const alpha = Math.max(.13, .96 - trail * .105);
        if (trail === 0) scanCtx.fillStyle = `rgba(224,255,231,${alpha})`;
        else scanCtx.fillStyle = `rgba(57,255,136,${alpha})`;
        const charIndex = (tick + index * 13 + trail * 7 + column.offset) % chars.length;
        scanCtx.fillText(chars[charIndex], x, y);
      }
      column.y += column.speed * delta;
      if (column.y - column.length * 15 > scanHeight + 12) {
        column.y = -Math.random() * 90;
        column.speed = 3.5 + Math.random() * 5.5;
        column.length = 7 + Math.floor(Math.random() * 7);
        column.offset = Math.floor(Math.random() * 2);
      }
    });
    // Repeated horizontal bit strings make the digits obvious against a portrait.
    if (tick % 2 === 0) {
      scanCtx.font = 'bold 8px ui-monospace, monospace';
      scanCtx.fillStyle = 'rgba(166,255,191,.82)';
      const strip = '01001101 10110100 01011010 11001001';
      const y = (tick * 17) % Math.max(1, scanHeight - 12);
      scanCtx.fillText(strip, 8, y);
    }
  }

  function finishScan() {
    scanRunning = false;
    if (scanAnimation) cancelAnimationFrame(scanAnimation);
    portraitFrame?.classList.add('approved');
    if (scanStatus) scanStatus.textContent = 'IDENTITY VERIFIED';
    if (scanTimer) scanTimer.textContent = '00.0';
    if (finalState) finalState.textContent = 'APPROVED';
    if (readoutSpinner) readoutSpinner.textContent = '✓';
    scanCanvas?.classList.add('scan-complete');
    playUiSound('success');
  }

  function scanFrame(now) {
    if (!scanRunning) return;
    if (!scanStartedAt) scanStartedAt = now;
    const elapsed = (now - scanStartedAt) / 1000;
    const remaining = Math.max(0, scanDuration - elapsed);
    if (scanTimer) scanTimer.textContent = remaining.toFixed(1).padStart(4, '0');
    let currentMessage = scanMessages[0];
    for (let i = 1; i < scanMessages.length; i += 1) {
      if (elapsed >= scanDuration * scanMessages[i].progress) currentMessage = scanMessages[i];
    }
    if (scanStatus && scanStatus.textContent !== currentMessage.text) scanStatus.textContent = currentMessage.text;
    if (!prefersReducedMotion) drawScanDigits(now);
    if (elapsed >= scanDuration) {
      finishScan();
      return;
    }
    scanAnimation = requestAnimationFrame(scanFrame);
  }

  function startPortraitScan() {
    if (!scanCanvas || !portraitFrame) return;
    resizeScanCanvas();
    scanDuration = window.matchMedia('(max-width: 680px), (pointer: coarse)').matches ? 12 : 5;
    if (scanTimer) scanTimer.textContent = `${scanDuration.toFixed(1)}`;
    if (scanDurationLabel) scanDurationLabel.textContent = `${scanDuration.toFixed(1)} SEC SEQUENCE`;
    scanRunning = true;
    scanStartedAt = 0;
    lastDigitsFrame = 0;
    if (prefersReducedMotion) {
      scanCanvas.style.opacity = '.25';
      const reducedTimer = window.setTimeout(finishScan, scanDuration * 1000);
      return reducedTimer;
    }
    scanAnimation = requestAnimationFrame(scanFrame);
  }

  profileImage?.addEventListener('error', () => portraitFrame?.classList.add('no-image'), { once: true });
  if (profileImage?.complete && profileImage.naturalWidth === 0) portraitFrame?.classList.add('no-image');
  window.addEventListener('resize', () => { if (scanRunning) resizeScanCanvas(); }, { passive: true });
  if (scanCanvas && portraitFrame) {
    if (document.readyState === 'complete') startPortraitScan();
    else window.addEventListener('load', startPortraitScan, { once: true });
  }

  const year = $('#current-year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
