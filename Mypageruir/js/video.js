document.addEventListener("DOMContentLoaded", function() {
    // ==================== اسکریپت لایو کلاس (اصلاح شده برای دو زبان) ====================
    function getLangText(faText, ruText) {
        const currentLang = document.documentElement.lang || 'fa';
        if (currentLang === 'ru') return ruText;
        return faText;
    }
    
    const liveClasses = {
        "class1": {
            startTime: new Date("2025-05-03T15:00:00"),
            teacherFa: "استاد - ivan_omgru",
            teacherRu: "Преподаватель - ivan_omgru",
            imgFa: "Mypageruir/assets/images/resources/live-class-1-1.jpg",
            imgRu: "/Mypageruir/assets/images/resources/live-class-1-1.jpg",
            liveLink: "https://www.aparat.com/video/video/embed/videohash/knq8lfb/vt/frame"
        }
    };
    let liveStarted = false;
    function updateLive() {
        const now = new Date();
        const cls = liveClasses["class1"];
        const currentLang = document.documentElement.lang || 'fa';
    
        function getClassImage() {
            if (currentLang === 'ru' && cls.imgRu) {
                return cls.imgRu;
            }
            return cls.imgFa;
        }
    
        document.querySelectorAll(".live-class-one__carousel .item").forEach(item => {
            const btnBox = item.querySelector(".live-class-one__btn-box");
            const timeText = item.querySelector(".live-class-one__class-time-text");
            const titleLink = item.querySelector(".live-class-one__title a");
            const img = item.querySelector(".live-class-one__img img");
            const currentImgSrc = getClassImage();
    
            if(!cls.liveLink) {
                timeText.textContent = getLangText("زنده - 00:00:00", "Живой - 00:00:00");
                titleLink.textContent = getLangText("استاد - ویدیو زنده ای یافت نشد !", "Преподаватель - живое видео не найдено!");
                titleLink.href = "#";
                btnBox.innerHTML = `<a href="#" class="thm-btn">${getLangText("عضو کلاس", "Присоединиться к классу")}</a>`;
                if(img && img.getAttribute('src') !== currentImgSrc) {
                    img.src = currentImgSrc;
                }
                return;
            }
    
            if(now < cls.startTime) {
                const diff = cls.startTime - now;
                const h = Math.floor(diff / 1000 / 60 / 60);
                const m = Math.floor((diff / 1000 / 60) % 60);
                const s = Math.floor((diff / 1000) % 60);
                const countdown = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
                timeText.textContent = getLangText(`شروع کلاس در: ${countdown}`, `Класс начинается через: ${countdown}`);
                titleLink.textContent = getLangText("کلاس آنلاین به زودی", "Онлайн класс скоро");
                titleLink.href = "#";
                btnBox.innerHTML = `<a href="#" class="thm-btn">${getLangText("عضو کلاس شوید", "Стать участником класса")}</a>`;
                if(img && img.getAttribute('src') !== currentImgSrc) {
                    img.src = currentImgSrc;
                }
            } else {
                timeText.textContent = getLangText("کلاس در حال اجرا - زنده", "Класс идет - живой");
                const teacherText = currentLang === 'ru' ? cls.teacherRu : cls.teacherFa;
                titleLink.textContent = teacherText;
                titleLink.href = cls.liveLink;
                titleLink.target = "_blank";
                // تعویض img با iframe فقط در حالت زنده
                if(img && img.tagName === 'IMG') {
                    const iframe = document.createElement('iframe');
                    iframe.className = 'live-class-one__img';
                    iframe.style.width = '100%';
                    iframe.style.height = '200px';
                    iframe.src = cls.liveLink;
                    iframe.frameBorder = '0';
                    iframe.allowFullscreen = true;
                    img.parentNode.replaceChild(iframe, img);
                }
                btnBox.innerHTML = `<a href="${cls.liveLink}" target="_blank" class="thm-btn">${getLangText("وارد کلاس زنده شوید", "Войти в живой класс")}</a>`;
            }
        });
    
        // ادامه کد مربوط به video-one__img-box
        const videoBox = document.querySelector(".video-one__img-box");
        const liveText = document.querySelector(".video-one__live-text");

        if(now < cls.startTime) {
            const diff = cls.startTime - now;
            const h = Math.floor(diff / 1000 / 60 / 60);
            const m = Math.floor((diff / 1000 / 60) % 60);
            const s = Math.floor((diff / 1000) % 60);
            const countdown = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
            if(liveText) liveText.textContent = getLangText(`شروع کلاس در: ${countdown}`, `Класс начинается через: ${countdown}`);
        } else {
            if(!liveStarted && videoBox) {
                videoBox.innerHTML = `<iframe width="100%" height="400" src="${cls.liveLink}" frameborder="0" allowfullscreen></iframe>`;
                liveStarted = true;
            }
            if(liveText) liveText.textContent = getLangText("کلاس در حال اجرا - زنده", "Класс идет - живой");
        }
    }

    updateLive();
    setInterval(updateLive, 1000);
    
    window.addEventListener('languageChanged', function() {
        updateLive();
    });


    // ==================== اسکریپت پلیر ویدیو (بدون تغییر) ====================
    (function(){
        'use strict';
    
        function initVideoPlayers() {
            const players = Array.from(document.querySelectorAll('.video-player'));
            if (players.length === 0) return;
    
            function videoFormatTime(sec) {
                if (isNaN(sec) || !isFinite(sec)) return '0:00';
                const m = Math.floor(sec / 60);
                const s = Math.floor(sec % 60);
                return `${m}:${s < 10 ? '0' + s : s}`;
            }
    
            if (!document.querySelector('#rippleStyles')) {
                const style = document.createElement('style');
                style.id = 'rippleStyles';
                style.textContent = `
                    @keyframes ripple {
                        70% { box-shadow: 0 0 0 40px rgba(223, 65, 255, 0.08); }
                        100% { box-shadow: 0 0 0 0 rgba(223, 65, 255, 0.28); }
                    }
                `;
                document.head.appendChild(style);
            }
    
            players.forEach((player) => {
                const video = player.querySelector('video');
                if (!video) return;
    
                const sources = Array.from(video.querySelectorAll('source'));
                sources.forEach(source => {
                    if (source.src && !source.dataset.src) {
                        source.dataset.src = source.src;
                        source.removeAttribute('src');
                    }
                });
                if (video.src && !video.dataset.src) {
                    video.dataset.src = video.src;
                    video.removeAttribute('src');
                }
                video.preload = 'none';
    
                let lazyLoaded = false;
                let currentQuality = '1080p';
    
                function loadSelectedQuality() {
                    const qualitySelect = document.getElementById('qualitySelect');
                    const selected = qualitySelect ? qualitySelect.value : currentQuality;
                    currentQuality = selected;
                    const allSources = Array.from(video.querySelectorAll('source'));
                    const targetSource = allSources.find(s => s.getAttribute('data-quality') === currentQuality);
                    if (!targetSource || !targetSource.dataset.src) {
                        console.warn('No source found for quality:', currentQuality);
                        return false;
                    }
                    video.src = targetSource.dataset.src;
                    video.load();
                    lazyLoaded = true;
                    return true;
                }
    
                function ensureLoaded() {
                    if (!lazyLoaded) {
                        return loadSelectedQuality();
                    }
                    return true;
                }
    
                const topVideoIcon = player.querySelector('.video-one__video-icon');
                const topVideoLink = player.querySelector('.video-one__video-link');
                const videoControls = player.querySelector('.video-controls');
    
                function hideBigPlayButton() {
                    if (topVideoLink) {
                        topVideoLink.style.display = 'none';
                        topVideoLink.style.pointerEvents = 'none';
                    }
                }
                function showBigPlayButton() {
                    if (topVideoLink && (video.paused || video.ended)) {
                        topVideoLink.style.display = 'flex';
                        topVideoLink.style.pointerEvents = 'auto';
                    }
                }
    
                function handleBigPlayClick(e) {
                    e.stopPropagation();
                    if (ensureLoaded()) {
                        video.play().then(() => {
                            // پس از شروع پخش، در موبایل تمام‌صفحه می‌کنیم
                            if (window.innerWidth <= 768) {
                                // درخواست تمام‌صفحه برای کانتینر پلیر
                                if (player.requestFullscreen) {
                                    player.requestFullscreen().catch(err => console.warn('Fullscreen failed:', err));
                                } 
                                // پشتیبانی از iOS (Safari)
                                else if (video.webkitEnterFullscreen) {
                                    video.webkitEnterFullscreen();
                                }
                            }
                        }).catch(err => console.warn('Play failed:', err));
                        
                        hideBigPlayButton();
                        if (videoControls && window.innerWidth <= 768 && !document.fullscreenElement) {
                            videoControls.style.display = 'flex';
                        }
                    }
                }
                
                if (topVideoIcon) {
                    topVideoIcon.removeEventListener('click', handleBigPlayClick);
                    topVideoIcon.addEventListener('click', handleBigPlayClick);
                    if (topVideoLink) {
                        topVideoLink.removeEventListener('click', handleBigPlayClick);
                        topVideoLink.addEventListener('click', handleBigPlayClick);
                    }
                }
    
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
    
                function safeAdd(el, ev, fn) { if (el) el.addEventListener(ev, fn); }
    
                safeAdd(playPauseBtn, 'click', () => {
                    if (ensureLoaded()) {
                        if (video.paused) {
                            video.play().catch(() => {});
                            playPauseBtn.textContent = '⏸️';
                            hideBigPlayButton();
                        } else {
                            video.pause();
                            playPauseBtn.textContent = '▶️';
                            if (video.currentTime === 0 || video.ended) showBigPlayButton();
                        }
                    }
                });
    
                if (qualitySelect) {
                    qualitySelect.addEventListener('change', () => {
                        const newQuality = qualitySelect.value;
                        currentQuality = newQuality;
                        if (lazyLoaded) {
                            const allSources = Array.from(video.querySelectorAll('source'));
                            const newSource = allSources.find(s => s.getAttribute('data-quality') === newQuality);
                            if (newSource && newSource.dataset.src) {
                                const currentTime = video.currentTime;
                                const wasPlaying = !video.paused && !video.ended;
                                video.pause();
                                video.src = newSource.dataset.src;
                                video.load();
                                video.currentTime = currentTime;
                                if (wasPlaying) video.play().catch(() => {});
                            }
                        }
                    });
                }
    
                safeAdd(backBtn, 'click', () => {
                    if (ensureLoaded()) {
                        video.currentTime = Math.max(0, video.currentTime - 10);
                        flashOverlay('backward');
                    }
                });
    
                safeAdd(forwardBtn, 'click', () => {
                    if (ensureLoaded()) {
                        video.currentTime = Math.min(video.duration || Infinity, video.currentTime + 10);
                        flashOverlay('forward');
                    }
                });
    
                video.addEventListener('dblclick', (e) => {
                    e.stopPropagation();
                    if (!ensureLoaded()) return;
                    const rect = video.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const videoWidth = rect.width;
                    if (clickX < videoWidth / 3) {
                        video.currentTime = Math.min(video.duration || Infinity, video.currentTime + 10);
                        flashOverlay('forward');
                    } else if (clickX > (videoWidth * 2) / 3) {
                        video.currentTime = Math.max(0, video.currentTime - 10);
                        flashOverlay('backward');
                    } else {
                        if (!document.fullscreenElement) {
                            player.requestFullscreen?.();
                        } else {
                            document.exitFullscreen?.();
                        }
                    }
                });
    
                const videoImgBox = player.querySelector('.video-one__img-box');
                if (videoImgBox) {
                    videoImgBox.addEventListener('click', function(e) {
                        if (e.target === topVideoIcon || e.target.closest('.video-one__video-icon')) return;
                        if (e.target === video) {
                            if (ensureLoaded()) {
                                if (video.paused) video.play().catch(() => {});
                                else video.pause();
                            }
                        }
                    });
                }
    
                video.addEventListener('loadedmetadata', () => {
                    if (progressBar) progressBar.max = Math.floor(video.duration) || 0;
                    if (durationEl) durationEl.textContent = videoFormatTime(video.duration);
                });
    
                video.addEventListener('timeupdate', () => {
                    if (progressBar && !isNaN(video.currentTime)) progressBar.value = Math.floor(video.currentTime);
                    if (currentTimeEl) currentTimeEl.textContent = videoFormatTime(video.currentTime);
                });
    
                safeAdd(progressBar, 'input', () => {
                    if (!lazyLoaded) return;
                    const v = parseInt(progressBar.value, 10);
                    if (!isNaN(v)) video.currentTime = v;
                });
    
                safeAdd(muteBtn, 'click', () => {
                    if (!lazyLoaded) return;
                    video.muted = !video.muted;
                    muteBtn.textContent = video.muted ? '🔇' : '🔊';
                });
    
                safeAdd(fullscreenBtn, 'click', () => {
                    if (!document.fullscreenElement) {
                        player.requestFullscreen?.();
                    } else {
                        document.exitFullscreen?.();
                    }
                });
    
                safeAdd(speedSelect, 'change', () => {
                    if (!lazyLoaded) return;
                    video.playbackRate = parseFloat(speedSelect.value) || 1;
                });
    
                safeAdd(subtitleSelect, 'change', () => {
                    if (!lazyLoaded) return;
                    const val = subtitleSelect.value;
                    try {
                        const tracks = video.textTracks || [];
                        for (let i = 0; i < tracks.length; i++) tracks[i].mode = 'disabled';
                        if (val !== 'off') {
                            const trEls = Array.from(video.querySelectorAll('track'));
                            for (let i = 0; i < trEls.length; i++) {
                                const tr = trEls[i];
                                const srclang = (tr.getAttribute('srclang') || '').toLowerCase();
                                if (srclang && srclang.startsWith(val)) {
                                    if (tracks[i]) tracks[i].mode = 'showing';
                                }
                            }
                        }
                    } catch (e) { console.warn(e); }
                });
    
                video.addEventListener('play', () => {
                    if (playPauseBtn) playPauseBtn.textContent = '⏸️';
                    hideBigPlayButton();
                });
                video.addEventListener('pause', () => {
                    if (playPauseBtn) playPauseBtn.textContent = '▶️';
                    if (!video.ended) hideBigPlayButton();
                    else showBigPlayButton();
                });
                video.addEventListener('ended', () => {
                    if (playPauseBtn) playPauseBtn.textContent = '▶️';
                    showBigPlayButton();
                });
    
                if (playPauseBtn) playPauseBtn.textContent = '▶️';
                if (muteBtn) muteBtn.textContent = '🔊';
                if (video.paused && (video.currentTime === 0 || video.ended)) showBigPlayButton();
                else hideBigPlayButton();
    
                function updateControlsVisibility() {
                    const isMobile = window.innerWidth <= 768;
                    if (isMobile && !document.fullscreenElement) {
                        if (videoControls) videoControls.style.display = 'none';
                    } else {
                        if (videoControls) videoControls.style.display = 'flex';
                    }
                }
                document.addEventListener('fullscreenchange', updateControlsVisibility);
                updateControlsVisibility();
    
                function flashOverlay(type) {
                    let overlay = player.querySelector('.flash-overlay');
                    if (!overlay) {
                        overlay = document.createElement('div');
                        overlay.className = 'flash-overlay';
                        Object.assign(overlay.style, {
                            position: 'absolute', top: '0', left: '0', width: '100%', height: '100%',
                            pointerEvents: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center',
                            color: '#fff', fontSize: '3rem', fontWeight: 'bold', textShadow: '0 0 8px rgba(0,0,0,0.7)',
                            opacity: '0', transition: 'opacity 0.3s ease', zIndex: '5'
                        });
                        player.appendChild(overlay);
                    }
                    overlay.textContent = type === 'forward' ? '⏩' : type === 'backward' ? '⏪' : '▶️';
                    overlay.style.opacity = '1';
                    setTimeout(() => overlay.style.opacity = '0', 400);
                }
    
                const liveText = player.querySelector('.video-one__live-text');
                if (liveText) {
                    let liveSeconds = 0;
                    setInterval(() => {
                        if (lazyLoaded && !video.paused) {
                            liveSeconds++;
                            const hours = Math.floor(liveSeconds / 3600);
                            const minutes = Math.floor((liveSeconds % 3600) / 60);
                            const seconds = liveSeconds % 60;
                            liveText.textContent = `زنده - ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                        }
                    }, 1000);
                }
            });
        }
    
        initVideoPlayers();
    })();
});