 /* ======= All-in-one: language switcher, about animations, counters, parallax, universal video players ======= */
(function(){
  'use strict';

  // کاربران با reduced motion -> انیمیشن‌ها بسته به این مقدار تغییر می‌کنند
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --------------------- زبان با افکت Fade --------------------- */
  function setLanguage(lang) {
    try {
      if(!lang) return;
      localStorage.setItem('siteLanguage', lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = (lang === 'fa') ? 'rtl' : 'ltr';

      document.querySelectorAll('[data-fa]').forEach(el => {
        const fa = el.getAttribute('data-fa') || '';
        const ru = el.getAttribute('data-ru') || fa;
        const en = el.getAttribute('data-en') || fa;
        const newText = (lang === 'ru') ? ru : (lang === 'en' ? en : fa);

        if(reduceMotion){
          el.textContent = newText;
          return;
        }

        el.style.transition = 'opacity 0.35s ease-in-out, transform 0.35s ease-in-out';
        el.style.opacity = '0';
        el.style.transform = 'translateY(6px)';
        setTimeout(() => {
          el.textContent = newText;
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, 180);
      });

      const titleEl = document.querySelector('title');
      if(titleEl && titleEl.dataset){
        titleEl.textContent = titleEl.dataset[lang] || titleEl.textContent;
      }
      const metaDescription = document.querySelector('meta[name="description"]');
      if(metaDescription && metaDescription.dataset){
        metaDescription.setAttribute('content', metaDescription.dataset[lang] || metaDescription.content);
      }

      // رویداد عمومی
      try {
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
      } catch(e){ /* ignore */ }

      if(typeof window.onLanguageChange === 'function') {
        try { window.onLanguageChange(lang); } catch(e){ console.warn(e); }
      }
    } catch(err) {
      console.error('setLanguage error:', err);
    }
  }

  /* --------------------- helper: formatNumber --------------------- */
  function formatNumber(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /* --------------------- DOMContentLoaded: init everything --------------------- */
  document.addEventListener('DOMContentLoaded', function(){

    /* ======= بارگذاری زبان پیش‌فرض هوشمند ======= */
    try {
      let savedLang = localStorage.getItem('siteLanguage');
      if(!savedLang){
        const userLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
        if(userLang.startsWith('ru')) savedLang = 'ru';
        else if(userLang.startsWith('en')) savedLang = 'en';
        else savedLang = 'fa';
      }
      setLanguage(savedLang);
    } catch(e){ console.warn('language init error', e); }

    /* ======= انیمیشن ورود بلوک‌های درباره (.about-block) ======= */
    try {
      const aboutBlocks = document.querySelectorAll('.about-block');
      if(aboutBlocks.length && !reduceMotion){
        const observerAbout = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if(entry.isIntersecting){
              entry.target.classList.add('show');
              obs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.18 });
        aboutBlocks.forEach(b => observerAbout.observe(b));
      } else {
        aboutBlocks.forEach(b => b.classList.add('show'));
      }
    } catch(e){ console.warn('about-block observer error', e); }

    /* ======= شمارنده حرفه‌ای با requestAnimationFrame ======= */
    (function setupCounters(){
      try {
        const counters = document.querySelectorAll('.counter');
        if(!counters.length) return;

        const io = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            const el = entry.target;
            if(entry.isIntersecting && !el.dataset.counted){
              el.dataset.counted = 'true';
              animateCounter(el);
              obs.unobserve(el);
            }
          });
        }, { threshold: 0.6 });

        counters.forEach(c => io.observe(c));

        function animateCounter(el){
          const raw = el.getAttribute('data-count') || el.dataset.count || el.innerText || '0';
          const target = Math.max(0, parseInt(String(raw).replace(/,/g,''), 10) || 0);
          if(target === 0){
            el.textContent = '0';
            return;
          }
          const duration = 2000;
          const startTime = performance.now();
          function easeOutQuart(t){ return 1 - Math.pow(1 - t, 4); }
          function frame(now){
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const value = Math.floor((target) * easeOutQuart(progress));
            el.textContent = formatNumber(value);
            if(progress < 1) requestAnimationFrame(frame);
            else el.textContent = formatNumber(target);
          }
          requestAnimationFrame(frame);
        }
      } catch(e){ console.warn('counters init error', e); }
    })();

    /* ======= پارالاکس و 3D برای تصاویر .about-img ======= */
    try {
      const imgWrappers = document.querySelectorAll('.about-img');
      imgWrappers.forEach(wrapper => {
        const img = wrapper.querySelector('img');
        if(!img) return;

        if(reduceMotion){
          wrapper.addEventListener('mouseenter', ()=> img.style.transform = 'scale(1.02)');
          wrapper.addEventListener('mouseleave', ()=> img.style.transform = 'scale(1)');
          return;
        }

        let raf = null;
        function onPointerMove(e){
          if(raf) return;
          raf = requestAnimationFrame(()=> {
            raf = null;
            const rect = img.getBoundingClientRect();
            const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] && e.touches[0].clientX) || (rect.left + rect.width/2);
            const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] && e.touches[0].clientY) || (rect.top + rect.height/2);
            const x = clientX - rect.left;
            const y = clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * 6;
            const rotateY = ((x - centerX) / centerX) * 6;
            img.style.transform = `rotateX(${ -rotateX }deg) rotateY(${ rotateY }deg) scale(1.04)`;
            img.style.boxShadow = `${-rotateY * 1.5}px ${rotateX * 1.5}px 30px rgba(0,0,0,0.25)`;
          });
        }
        wrapper.style.perspective = wrapper.style.perspective || '1000px';
        wrapper.addEventListener('pointermove', onPointerMove, { passive: true });
        wrapper.addEventListener('pointerleave', () => {
          if(raf){ cancelAnimationFrame(raf); raf = null; }
          img.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
          img.style.boxShadow = '0 0 85px 0 rgba(0,0,0,0.14)';
        }, { passive: true });
      });
    } catch(e){ console.warn('parallax init error', e); }

    /* ======= Video Player Initializer ======= */
    (function initVideoPlayers(){
      if (!document.querySelector('.video-player')) {
        console.log('Video player not found — skipping init.');
        return;
      }
      
      try {
        function videoFormatTime(sec){
          if(isNaN(sec) || !isFinite(sec)) return '0:00';
          const m = Math.floor(sec/60);
          const s = Math.floor(sec%60);
          return `${m}:${s < 10 ? '0'+s : s}`;
        }

        // اضافه کردن انیمیشن ripple
        if (!document.querySelector('#rippleStyles')) {
          const style = document.createElement('style');
          style.id = 'rippleStyles';
          style.textContent = `
            @keyframes ripple {
              70% { box-shadow: 0 0 0 40px rgba(223, 65, 255, 0); }
              100% { box-shadow: 0 0 0 0 rgba(223, 65, 255, 0); }
            }
          `;
          document.head.appendChild(style);
        }

        const players = Array.from(document.querySelectorAll('.video-player'));
        
        if(players.length === 0) {
          console.warn('No video players found on page.');
          return;
        }

        players.forEach((player) => {
          try {
            const video = player.querySelector('video');
            if(!video){
              console.warn('video not found in .video-player', player);
              return;
            }

            // کنترل آیکون پلی مرکزی
            const topVideoIcon = player.querySelector('.video-one__video-icon');
            const topVideoLink = player.querySelector('.video-one__video-link');
            
            if(topVideoIcon) {
              topVideoIcon.addEventListener('click', function(e) {
                e.stopPropagation();
                if(video.paused) {
                  video.play().catch(()=>{});
                  this.querySelector('.fa-play').style.display = 'none';
                } else {
                  video.pause();
                  this.querySelector('.fa-play').style.display = 'inline-block';
                }
              });
              
              if(topVideoLink) {
                topVideoLink.addEventListener('click', function(e) {
                  e.stopPropagation();
                  if(video.paused) {
                    video.play().catch(()=>{});
                    if(topVideoIcon.querySelector('.fa-play')) {
                      topVideoIcon.querySelector('.fa-play').style.display = 'none';
                    }
                  } else {
                    video.pause();
                    if(topVideoIcon.querySelector('.fa-play')) {
                      topVideoIcon.querySelector('.fa-play').style.display = 'inline-block';
                    }
                  }
                });
              }
            }

            // ---------- lazy-load setup ----------
            let lazyLoaded = false;
            function lazyLoadVideo() {
              if(!lazyLoaded){
                const source = video.querySelector('source');
                if(source && !source.src && source.dataset.src){
                  source.src = source.dataset.src;
                  video.load();
                  lazyLoaded = true;
                }
              }
            }

            // Get control elements
            const playPauseBtn = document.getElementById('playPauseBtn');
            const muteBtn = document.getElementById('muteBtn');
            const backBtn = document.getElementById('backBtn');
            const forwardBtn = document.getElementById('forwardBtn');
            const progressBar = document.getElementById('progressBar');
            const currentTimeEl = document.getElementById('currentTime');
            const durationEl = document.getElementById('duration');
            const fullscreenBtn = document.getElementById('fullscreenBtn');
            const speedSelect = document.getElementById('speedSelect');
            const qualitySelect = document.getElementById('qualitySelect');
            const subtitleSelect = document.getElementById('subtitleSelect');

            function safeAdd(el, ev, fn){ if(el) el.addEventListener(ev, fn); }

            // Initialize video metadata
            video.addEventListener('loadedmetadata', ()=>{
              if(progressBar) {
                progressBar.max = Math.floor(video.duration) || 0;
                progressBar.value = 0;
              }
              if(durationEl) durationEl.textContent = videoFormatTime(video.duration);
              if(currentTimeEl) currentTimeEl.textContent = videoFormatTime(0);
            });

            video.addEventListener('loadeddata', () => {
              if(video.readyState >= 1){
                if(progressBar) progressBar.max = Math.floor(video.duration) || 0;
                if(durationEl) durationEl.textContent = videoFormatTime(video.duration);
              }
            });

            // Play/Pause functionality
            safeAdd(playPauseBtn, 'click', ()=>{
              lazyLoadVideo();
              if(video.paused){ 
                video.play().catch(()=>{}); 
                if(playPauseBtn) playPauseBtn.textContent = '⏸️';
              }
              else { 
                video.pause(); 
                if(playPauseBtn) playPauseBtn.textContent = '▶️'; 
              }
            });

            // Video events to sync UI
            video.addEventListener('play', ()=> {
              if (playPauseBtn) playPauseBtn.textContent = '⏸️';
              if (topVideoIcon && topVideoIcon.querySelector('.fa-play')) {
                topVideoIcon.querySelector('.fa-play').style.display = 'none';
              }
            });
            
            video.addEventListener('pause', ()=> {
              if (playPauseBtn) playPauseBtn.textContent = '▶️';
              if (topVideoIcon && topVideoIcon.querySelector('.fa-play')) {
                topVideoIcon.querySelector('.fa-play').style.display = 'inline-block';
              }
            });
            
            video.addEventListener('ended', ()=> {
              if (playPauseBtn) playPauseBtn.textContent = '▶️';
              if (topVideoIcon && topVideoIcon.querySelector('.fa-play')) {
                topVideoIcon.querySelector('.fa-play').style.display = 'inline-block';
              }
            });

            // Mute functionality
            safeAdd(muteBtn, 'click', ()=>{
              video.muted = !video.muted;
              if(muteBtn) muteBtn.textContent = video.muted ? '🔇' : '🔊';
            });

            // Skip forward/backward
            safeAdd(backBtn, 'click', ()=> {
              video.currentTime = Math.max(0, video.currentTime - 10);
              flashOverlay('backward');
            });
            
            safeAdd(forwardBtn, 'click', ()=> {
              video.currentTime = Math.min(video.duration || Infinity, video.currentTime + 10);
              flashOverlay('forward');
            });

            // Progress bar updates
            video.addEventListener('timeupdate', ()=>{
              if(progressBar) progressBar.value = Math.floor(video.currentTime);
              if(currentTimeEl) currentTimeEl.textContent = videoFormatTime(video.currentTime);
            });

            safeAdd(progressBar, 'input', ()=> {
              const v = parseInt(progressBar.value, 10);
              if(!isNaN(v)) video.currentTime = v;
            });

            // Fullscreen
            safeAdd(fullscreenBtn, 'click', ()=>{
              if(!document.fullscreenElement){
                if(player.requestFullscreen) player.requestFullscreen();
                else if(player.webkitRequestFullscreen) player.webkitRequestFullscreen();
              } else {
                if(document.exitFullscreen) document.exitFullscreen();
                else if(document.webkitExitFullscreen) document.webkitExitFullscreen();
              }
            });

            // Update fullscreen button
            document.addEventListener('fullscreenchange', updateFullscreenButton);
            document.addEventListener('webkitfullscreenchange', updateFullscreenButton);
            
            function updateFullscreenButton() {
              if(fullscreenBtn) {
                fullscreenBtn.textContent = document.fullscreenElement ? '✕' : '⛶';
              }
            }

            // Playback speed
            safeAdd(speedSelect, 'change', ()=> {
              const rate = parseFloat(speedSelect.value) || 1;
              video.playbackRate = rate;
            });

            // Quality selection
            safeAdd(qualitySelect, 'change', ()=> {
              try {
                const selected = qualitySelect.value;
                const sources = Array.from(video.querySelectorAll('source'));
                const matched = sources.find(s => (s.dataset && s.dataset.quality === selected) || (s.getAttribute('data-quality') === selected));
                if(matched && matched.src){
                  const currentTime = video.currentTime;
                  const wasPlaying = !video.paused && !video.ended;
                  video.pause();
                  video.src = matched.src;
                  video.load();
                  video.currentTime = currentTime;
                  if(wasPlaying) video.play().catch(()=>{});
                }
              } catch(e){ console.warn('quality change error', e); }
            });
            // Subtitles
            safeAdd(subtitleSelect, 'change', ()=> {
              const val = subtitleSelect.value;
              try {
                const tracks = video.textTracks || [];
                for(let i=0;i<tracks.length;i++) tracks[i].mode = 'disabled';
                if(val !== 'off'){
                  const trEls = Array.from(video.querySelectorAll('track'));
                  for(let i=0;i<trEls.length;i++){
                    const tr = trEls[i];
                    const srclang = (tr.getAttribute('srclang') || '').toLowerCase();
                    if(srclang && srclang.startsWith(val)){
                      if(tracks[i]) tracks[i].mode = 'showing';
                    }
                  }
                }
              } catch(e){ console.warn('subtitle change error', e); }
            });
            
            // ======= بخش بهبود یافته برای dropdownهای بالا‌رونده =======
            const videoSelects = [qualitySelect, speedSelect, subtitleSelect];
            
            // تابع برای بررسی موقعیت dropdown
            function checkDropdownPosition(select) {
              if (!select) return;
              
              const rect = select.getBoundingClientRect();
              const windowHeight = window.innerHeight;
              const estimatedDropdownHeight = 150; // ارتفاع تخمینی dropdown
              
              // اگر فاصله تا پایین صفحه کمتر از ارتفاع dropdown باشد
              if (windowHeight - rect.bottom < estimatedDropdownHeight) {
                select.dataset.dropup = 'true';
              } else {
                delete select.dataset.dropup;
              }
            }
            
            // تنظیم event listenerها برای dropdownها
            videoSelects.forEach(select => {
              if (select) {
                // هنگام کلیک، موقعیت را بررسی کن
                select.addEventListener('mousedown', function() {
                  checkDropdownPosition(this);
                });
                
                // هنگام focus، موقعیت را بررسی کن
                select.addEventListener('focus', function() {
                  checkDropdownPosition(this);
                  
                  // در موبایل، برای dropdownهای بالارونده margin اضافه کن
                  if (window.innerWidth <= 768 && this.dataset.dropup === 'true') {
                    this.style.marginBottom = '150px';
                  }
                });
                
                // هنگام از دست دادن focus، استایل‌ها را پاک کن
                select.addEventListener('blur', function() {
                  setTimeout(() => {
                    delete this.dataset.dropup;
                    this.style.marginBottom = '';
                  }, 300);
                });
                
                // همچنین هنگام تغییر اندازه پنجره هم بررسی کن
                window.addEventListener('resize', function() {
                  if (document.activeElement !== select) {
                    delete select.dataset.dropup;
                    select.style.marginBottom = '';
                  } else {
                    checkDropdownPosition(select);
                  }
                });
              }
            });
            // ======= پایان بخش بهبود یافته =======
            
            // Click on video to play/pause
            const videoImgBox = player.querySelector('.video-one__img-box');

            if(videoImgBox) {
              videoImgBox.addEventListener('click', function(e) {
                if(e.target === video || e.target === topVideoIcon || e.target.closest('.video-one__video-icon')) {
                  return;
                }
                
                if(video.paused) {
                  video.play().catch(()=>{});
                } else {
                  video.pause();
                }
              });
            }

            // Double click for fullscreen
            video.addEventListener('dblclick', (e)=>{
              e.stopPropagation();
              if(!document.fullscreenElement){
                if(player.requestFullscreen) player.requestFullscreen();
                else if(player.webkitRequestFullscreen) player.webkitRequestFullscreen();
              } else {
                if(document.exitFullscreen) document.exitFullscreen();
                else if(document.webkitExitFullscreen) document.webkitExitFullscreen();
              }
            });

            // Flash overlay for feedback
            function flashOverlay(type) {
              let overlay = player.querySelector('.flash-overlay');
              if(!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'flash-overlay';
                Object.assign(overlay.style, {
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#fff',
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  textShadow: '0 0 8px rgba(0,0,0,0.7)',
                  opacity: '0',
                  transition: 'opacity 0.3s ease',
                  zIndex: '5'
                });
                player.appendChild(overlay);
              }
              
              overlay.textContent = type === 'forward' ? '⏩' : 
                                  type === 'backward' ? '⏪' : 
                                  '▶️';
              overlay.style.opacity = '1';
              setTimeout(() => overlay.style.opacity = '0', 400);
            }

            // Initialize button states
            if(playPauseBtn) playPauseBtn.textContent = video.paused ? '▶️' : '⏸️';
            if(muteBtn) muteBtn.textContent = video.muted ? '🔇' : '🔊';
            
            // Live timer simulation
            const liveText = player.querySelector('.video-one__live-text');
            if(liveText) {
              let liveSeconds = 0;
              setInterval(() => {
                if(!video.paused) {
                  liveSeconds++;
                  const hours = Math.floor(liveSeconds / 3600);
                  const minutes = Math.floor((liveSeconds % 3600) / 60);
                  const seconds = liveSeconds % 60;
                  liveText.textContent = `زنده - ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                }
              }, 1000);
            }

            // Load video
            video.load();

          } catch(err){
            console.error('Error initializing video player', err);
          }
        });
      } catch(e){ console.warn('video players init error', e); }
    })(); // initVideoPlayers end

  }); // DOMContentLoaded end

  // expose setLanguage globally
  window.setLanguage = setLanguage;

})(); // IIFE end