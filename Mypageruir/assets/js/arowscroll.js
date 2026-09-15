(function ($) {
    "use strict";

    // ================= ScrollIt =================
    $.scrollIt = function (options) {
        const settings = $.extend({
            upKey: 38,
            downKey: 40,
            easing: 'swing',
            scrollTime: 600,
            activeClass: 'active',
            topOffset: 0
        }, options);

        const sections = $('[data-scroll-index]');
        const scrollLinks = $('[data-scroll-nav]');

        scrollLinks.on('click', function (e) {
            e.preventDefault();
            const index = $(this).data('scroll-nav');
            const target = $('[data-scroll-index="' + index + '"]');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - settings.topOffset
                }, settings.scrollTime, settings.easing);
            }
        });

        $(window).on('scroll', function () {
            const position = $(this).scrollTop();
            sections.each(function () {
                const top = $(this).offset().top - settings.topOffset - 10;
                const bottom = top + $(this).outerHeight();
                if (position >= top && position <= bottom) {
                    const index = $(this).data('scroll-index');
                    scrollLinks.removeClass(settings.activeClass);
                    $('[data-scroll-nav="' + index + '"]').addClass(settings.activeClass);
                }
            });
        });
    };

    // ================= Document Ready =================
    $(document).ready(function () {
        $.scrollIt({ easing: "swing", scrollTime: 800, topOffset: 0 });

        // غیرفعال کردن ذخیره عکس
        document.querySelectorAll("img").forEach(img => {
            img.addEventListener("contextmenu", e => e.preventDefault());
        });
        document.addEventListener("dragstart", function (e) {
            if (e.target.tagName === "IMG") e.preventDefault();
        });

        initTypingAnimation();
    });

})(jQuery);


// ================= Language Helpers =================
function getCurrentLangText(faText, ruText) {
    const currentLang = document.documentElement.lang || 'fa';
    if (currentLang === 'ru') return ruText;
    return faText;
}

function getTextFromElement(element) {
    const currentLang = document.documentElement.lang || 'fa';
    if (currentLang === 'ru') {
        return element.getAttribute('data-ru') || element.getAttribute('data-fa') || element.textContent;
    } else {
        return element.getAttribute('data-fa') || element.textContent;
    }
}


// ================= Typing Animation (Safe Multi-Lang) =================
let typingInterval = null;
let typingTimeout = null;
let currentTypingIndex = 0;
let currentCharIndex = 0;
let typingWords = [];
let typingWrapper = null;

// شمارنده نسل: هر بار init یا stop، این عدد زیاد می‌شود.
// callbackهای قدیمی با چک کردن این عدد، خودشان را باطل می‌کنند.
let typingGeneration = 0;

// فاز فعلی: 'idle' | 'typing' | 'waiting' | 'deleting'
let typingPhase = 'idle';

const TYPING_TYPE_SPEED   = 100;
const TYPING_DELETE_SPEED = 50;
const TYPING_HOLD_MS      = 1500;
const TYPING_GAP_MS       = 300;
const TYPING_START_DELAY  = 500;

function clearTypingTimers() {
    if (typingInterval) { clearInterval(typingInterval); typingInterval = null; }
    if (typingTimeout)  { clearTimeout(typingTimeout);  typingTimeout  = null; }
}

function stopTypingAnimation() {
    // نسل جدید → هر callback قدیمی خودش را باطل می‌بیند
    typingGeneration++;
    clearTypingTimers();
    typingPhase = 'idle';
}

function isGenerationValid(gen) {
    return gen === typingGeneration;
}

function typeWordMultiLang(gen) {
    if (!isGenerationValid(gen)) return;
    if (typingPhase !== 'idle') return;
    if (!typingWrapper || !typingWords.length) return;

    const w = typingWords[currentTypingIndex];
    if (!w) { typingPhase = 'idle'; return; }

    const fullText = getTextFromElement(w);
    if (!fullText) { typingPhase = 'idle'; return; }

    typingPhase = 'typing';
    currentCharIndex = 0;

    // پنهان‌کردن بقیه بدون دست‌زدن به متن نهایی آن‌ها
    typingWords.forEach((word, idx) => {
        if (idx !== currentTypingIndex) {
            word.classList.remove('is-visible');
            word.style.opacity = '0';
            word.textContent = '';
        }
    });

    w.classList.add('is-visible');
    w.style.opacity = '1';
    w.textContent = '';

    typingInterval = setInterval(() => {
        if (!isGenerationValid(gen)) {
            clearInterval(typingInterval);
            typingInterval = null;
            return;
        }
        if (currentCharIndex < fullText.length) {
            w.textContent = fullText.slice(0, currentCharIndex + 1);
            currentCharIndex++;
        } else {
            clearInterval(typingInterval);
            typingInterval = null;
            typingPhase = 'waiting';
            typingTimeout = setTimeout(() => deleteWordMultiLang(gen), TYPING_HOLD_MS);
        }
    }, TYPING_TYPE_SPEED);
}

function deleteWordMultiLang(gen) {
    if (!isGenerationValid(gen)) return;
    if (typingPhase !== 'waiting') return;

    const w = typingWords[currentTypingIndex];
    if (!w) { typingPhase = 'idle'; return; }

    typingPhase = 'deleting';

    typingInterval = setInterval(() => {
        if (!isGenerationValid(gen)) {
            clearInterval(typingInterval);
            typingInterval = null;
            return;
        }
        const current = w.textContent || '';
        if (current.length > 0) {
            w.textContent = current.slice(0, -1);
        } else {
            clearInterval(typingInterval);
            typingInterval = null;
            typingPhase = 'idle';
            currentTypingIndex = (currentTypingIndex + 1) % typingWords.length;
            typingTimeout = setTimeout(() => typeWordMultiLang(gen), TYPING_GAP_MS);
        }
    }, TYPING_DELETE_SPEED);
}

// اندازه‌گیری عرض فقط زمانی صدا زده می‌شود که انیمیشن متوقف باشد.
// این تابع دیگر هیچ‌وقت وسط تایپ اجرا نمی‌شود.
function measureTypingWidth() {
    if (!typingWrapper || !typingWords.length) return;

    const states = typingWords.map(w => ({
        text: w.textContent,
        isVisible: w.classList.contains('is-visible'),
        opacity: w.style.opacity,
        position: w.style.position
    }));

    // موقتاً همه را کامل و visible کن تا عرض واقعی به دست بیاید
    typingWords.forEach((w) => {
        w.style.position = 'static';
        w.style.opacity = '1';
        w.classList.add('is-visible');
        w.textContent = getTextFromElement(w);
    });

    let maxWidth = 0;
    typingWords.forEach(w => { maxWidth = Math.max(maxWidth, w.offsetWidth); });

    // بازگرداندن دقیق حالت قبلی
    typingWords.forEach((w, i) => {
        w.style.position = states[i].position;
        w.style.opacity = states[i].opacity;
        w.textContent = states[i].text;
        if (states[i].isVisible) w.classList.add('is-visible');
        else w.classList.remove('is-visible');
    });

    typingWrapper.style.width = (maxWidth + 15) + 'px';
    typingWrapper.style.display = 'inline-block';
}

function initTypingAnimation() {
    typingWrapper = document.querySelector('.cd-words-wrapper');
    if (!typingWrapper) return;

    const words = Array.from(typingWrapper.querySelectorAll('b'));
    if (words.length === 0) return;

    // توقف کامل قبل از هر تغییری → همه callbackهای قدیمی باطل می‌شوند
    stopTypingAnimation();

    typingWords = words;
    currentTypingIndex = 0;
    currentCharIndex = 0;

    // ریست ظاهر همه کلمات
    typingWords.forEach(word => {
        word.classList.remove('is-visible');
        word.style.opacity = '0';
        word.textContent = '';
    });

    // اندازه‌گیری عرض در حالت امن (انیمیشن خاموش است)
    measureTypingWidth();

    // شروع با نسل جدید
    const gen = typingGeneration;
    typingTimeout = setTimeout(() => typeWordMultiLang(gen), TYPING_START_DELAY);
}

// تغییر زبان → ریستارت کامل و امن
if (typeof window !== 'undefined') {
    window.addEventListener('languageChanged', function () {
        setTimeout(function () {
            if (typingWrapper && typingWords.length) initTypingAnimation();
        }, 200);
    });
}

// تغییر اندازه صفحه → ریستارت کامل به‌جای دست‌زدن وسط انیمیشن
let resizeTimerGlobal;
window.addEventListener('resize', function () {
    clearTimeout(resizeTimerGlobal);
    resizeTimerGlobal = setTimeout(function () {
        if (typingWrapper && typingWords.length) initTypingAnimation();
    }, 250);
});


// ================= Newsletter Popup (both forms) =================
document.addEventListener("DOMContentLoaded", () => {

    // --- کنفتی سبک ---
    function launchSimpleConfetti(count) {
        const colors = ['#ff4081', '#ff8a5c', '#ffd93d', '#6c5ce7'];
        for (let i = 0; i < count; i++) {
            const c = document.createElement("div");
            c.style.cssText = `
                position: fixed; z-index:9997; left:${Math.random() * 100}%;
                top:-10px; width:7px; height:7px; border-radius:50%;
                background:${colors[Math.floor(Math.random() * colors.length)]};
                opacity:0.8; pointer-events:none;
                transition: transform ${1 + Math.random()}s linear, opacity ${1 + Math.random()}s linear;
                transform: translateY(0);
            `;
            document.body.appendChild(c);
            requestAnimationFrame(() => c.style.transform = `translateY(${window.innerHeight + 20}px)`);
            setTimeout(() => c.remove(), 2000);
        }
    }

    // --- ایموجی‌های شناور ---
    function launchSimpleFloating(count) {
        const emojis = ["❤️", "🎉", "✨", "🔥"];
        for (let i = 0; i < count; i++) {
            const e = document.createElement("div");
            e.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
            e.style.cssText = `
                position: fixed; font-size:18px; left:${Math.random() * 100}%;
                bottom:-20px; opacity:0.7; z-index:9996; pointer-events:none;
                transition: transform 1.8s ease-out, opacity 1.8s ease-out;
            `;
            document.body.appendChild(e);
            requestAnimationFrame(() => {
                e.style.transform = `translateY(-${window.innerHeight + 40}px)`;
                e.style.opacity = "0";
            });
            setTimeout(() => e.remove(), 1800);
        }
    }

    // --- نمایش پاپ‌آپ خوش‌آمد ---
    function showWelcomePopup(name) {
        const overlay = document.createElement("div");
        overlay.style.cssText = `
            position: fixed; top:0; left:0;
            width:100%; height:100%;
            background: rgba(0,0,0,0.15);
            z-index: 9998; opacity:0;
            transition: opacity 0.4s ease;
        `;
        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.style.opacity = "1");

        const popup = document.createElement("div");
        popup.style.cssText = `
            position: fixed; top: 50%; left: 50%;
            transform: translate(-50%, -50%) scale(0);
            background: rgb(255, 255, 255);
            padding: 25px 20px; border-radius: 25px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            text-align: center; z-index: 9999;
            max-width: 85%; width: 320px;
            border: 2px solid #ff4081;
            font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
            transition: transform 0.4s cubic-bezier(0.68,-0.55,0.265,1.55);
        `;

        const welcomeText = getCurrentLangText(`${name} عزیز!`, `Дорогой ${name}!`);
        const messageText = getCurrentLangText(
            `به جمع خانواده <strong style="color:#ff4081;">IVAN OMGRU</strong> خوش آمدی!<br>با دنبال کردن ما در اینستاگرام، از آموزش‌ها استفاده کن 🌟`,
            `Добро пожаловать в семью <strong style="color:#ff4081;">IVAN OMGRU</strong>!<br>Следите за нами в Instagram и пользуйтесь обучением 🌟`
        );

        popup.innerHTML = `
            <div style="margin-bottom: 12px;">
                <span style="background: #ff4081; padding: 8px 16px; border-radius: 40px;
                    color:white; font-weight:600; font-size:16px; display:inline-block;">
                    🚀 IVAN OMGRU
                </span>
            </div>
            <div style="font-size: 42px; margin:10px 0;">🎉✨</div>
            <h2 style="color:#ff4081; font-size:22px; font-weight:700; margin:8px 0;">
                ${welcomeText}
            </h2>
            <p style="font-size:20px; color: #1a1a1a; line-height:1.5; margin:12px 0;">
                ${messageText}
            </p>
            <div style="display:flex; justify-content:center; gap:10px; font-size:20px; margin:12px 0;">
                <span>❤️</span><span>🔥</span><span>✨</span><span>💫</span>
            </div>
        `;
        document.body.appendChild(popup);
        requestAnimationFrame(() => popup.style.transform = "translate(-50%, -50%) scale(1)");

        launchSimpleConfetti(25);
        launchSimpleFloating(12);

        setTimeout(() => {
            popup.style.transform = "translate(-50%, -50%) scale(0)";
            overlay.style.opacity = "0";
            setTimeout(() => { popup.remove(); overlay.remove(); }, 400);
            window.location.href = "https://www.instagram.com/ivan.omgru/";
        }, 3500);
    }

    // --- اتصال هر فرم ---
    function setupNewsletterForm(formId, usernameId) {
        const form = document.getElementById(formId);
        const usernameInput = document.getElementById(usernameId);
        if (!form || !usernameInput) return;

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = usernameInput.value.trim();
            if (!name) {
                alert(getCurrentLangText("لطفاً نام خود را وارد کنید!", "Пожалуйста, введите ваше имя!"));
                return;
            }
            showWelcomePopup(name);
        });
    }

    // فرم فوتر + فرم newsletter-one
    setupNewsletterForm("footerNewsletterForm", "footerUsername");
    setupNewsletterForm("newsletterOneForm", "newsletterOneUsername");
});


// ================= Search =================
function goToGoogleSearch(query) {
    const googleUrl = "https://www.google.com/search?q=" + encodeURIComponent(query + " ivan omgru ");
    window.location.href = googleUrl;
}

// دسکتاپ
const desktopForm = document.getElementById("searchForm");
if (desktopForm) {
    desktopForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const value = document.getElementById("searchInput").value.trim();
        if (value) goToGoogleSearch(value);
    });
}

// موبایل
const mobileForm = document.getElementById("mobileSearchForm");
if (mobileForm) {
    mobileForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const value = document.getElementById("mobileSearchInput").value.trim();
        if (value) goToGoogleSearch(value);
    });
}

// بنر دوره‌ها
const bannerForm = document.querySelector(".banner-one__category-form");
if (bannerForm) {
    bannerForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const input = bannerForm.querySelector("input[type='search']");
        const value = input.value.trim();
        if (value) goToGoogleSearch(value);
    });
}