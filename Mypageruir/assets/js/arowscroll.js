(function($) {
    "use strict";

    // ===== کدهای قبلی شما (ScrollIt و Disable Save Image) =====
    
    $.scrollIt = function(options) {
    
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
    
        // کلیک روی لینک‌ها
        scrollLinks.on('click', function(e) {
            e.preventDefault();
    
            const index = $(this).data('scroll-nav');
            const target = $('[data-scroll-index="' + index + '"]');
    
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - settings.topOffset
                }, settings.scrollTime, settings.easing);
            }
        });
    
        // آپدیت کلاس active هنگام اسکرول
        $(window).on('scroll', function() {
            const position = $(this).scrollTop();
    
            sections.each(function() {
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
    
    $(document).ready(function() { 
        $.scrollIt({easing:"swing",scrollTime:800,topOffset:0}); 

        document.querySelectorAll("img").forEach(img => {
            img.addEventListener("contextmenu", e => e.preventDefault());
        });

        document.addEventListener("dragstart", function(e){
            if(e.target.tagName === "IMG") e.preventDefault();
        });
        
        // ===== راه‌حل جدید برای رفع مشکل لرزش در موبایل =====
        initTypingAnimation();
    });

})(jQuery);

// ===== تابع دریافت متن بر اساس زبان فعلی (فقط فارسی و روسی) =====
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

// ===== انیمیشن تایپ چندزبانه (فقط فارسی و روسی) =====
let typingInterval = null;
let typingTimeout = null;
let currentTypingIndex = 0;
let currentCharIndex = 0;
let isTypingAnimating = false;
let typingWords = [];
let typingWrapper = null;

function stopTypingAnimation() {
    if (typingInterval) {
        clearInterval(typingInterval);
        typingInterval = null;
    }
    if (typingTimeout) {
        clearTimeout(typingTimeout);
        typingTimeout = null;
    }
    isTypingAnimating = false;
}

function typeWordMultiLang() {
    if (isTypingAnimating) return;
    isTypingAnimating = true;
    
    const w = typingWords[currentTypingIndex];
    const fullText = getTextFromElement(w);
    
    if (!fullText) {
        isTypingAnimating = false;
        return;
    }
    
    // حذف کلاس is-visible از همه کلمات
    typingWords.forEach(word => word.classList.remove('is-visible'));
    
    // نمایش کلمه فعلی
    w.classList.add('is-visible');
    w.style.opacity = '1';
    w.textContent = '';
    currentCharIndex = 0;

    typingInterval = setInterval(() => {
        if (currentCharIndex < fullText.length) {
            w.textContent += fullText.charAt(currentCharIndex);
            currentCharIndex++;
        } else {
            clearInterval(typingInterval);
            typingInterval = null;
            isTypingAnimating = false;
            typingTimeout = setTimeout(deleteWordMultiLang, 1500);
        }
    }, 100);
}

function deleteWordMultiLang() {
    if (isTypingAnimating) return;
    isTypingAnimating = true;
    
    const w = typingWords[currentTypingIndex];
    let remainingChars = w.textContent.length;

    typingInterval = setInterval(() => {
        if (remainingChars > 0) {
            remainingChars--;
            w.textContent = w.textContent.substring(0, remainingChars);
        } else {
            clearInterval(typingInterval);
            typingInterval = null;
            isTypingAnimating = false;
            
            // رفتن به کلمه بعدی
            currentTypingIndex = (currentTypingIndex + 1) % typingWords.length;
            typingTimeout = setTimeout(typeWordMultiLang, 300);
        }
    }, 50);
}

function setFixedWidthMultiLang() {
    if (!typingWrapper || !typingWords.length) return;
    
    // ذخیره وضعیت فعلی
    const states = typingWords.map(w => ({
        isVisible: w.classList.contains('is-visible'),
        opacity: w.style.opacity,
        position: w.style.position
    }));

    // موقتاً همه کلمات را قابل مشاهده کن
    typingWords.forEach((w) => {
        w.style.position = 'static';
        w.style.opacity = '1';
        w.classList.add('is-visible');
        w.textContent = getTextFromElement(w);
    });

    // پیدا کردن پهن‌ترین کلمه
    let maxWidth = 0;
    typingWords.forEach(w => {
        maxWidth = Math.max(maxWidth, w.offsetWidth);
    });

    // برگرداندن وضعیت قبلی
    typingWords.forEach((w, i) => {
        w.style.position = states[i].position;
        w.style.opacity = states[i].opacity;
        if (!states[i].isVisible) {
            w.classList.remove('is-visible');
            w.textContent = '';
        } else {
            w.textContent = getTextFromElement(w);
        }
    });

    // تنظیم عرض ثابت
    typingWrapper.style.width = (maxWidth + 15) + 'px';
    typingWrapper.style.display = 'inline-block';
}

function initTypingAnimation() {
    typingWrapper = document.querySelector('.cd-words-wrapper');
    if (!typingWrapper) return;
    
    typingWords = Array.from(typingWrapper.querySelectorAll('b'));
    if (typingWords.length === 0) return;
    
    // توقف انیمیشن قبلی
    stopTypingAnimation();
    
    // تنظیم عرض ثابت
    setFixedWidthMultiLang();
    
    // ریست متغیرها
    currentTypingIndex = 0;
    currentCharIndex = 0;
    isTypingAnimating = false;
    
    // آماده‌سازی اولیه: فقط اولین کلمه قابل مشاهده باشد
    typingWords.forEach((word, idx) => {
        word.style.opacity = '0';
        word.classList.remove('is-visible');
        if (idx === 0) {
            word.classList.add('is-visible');
            word.style.opacity = '1';
            word.textContent = getTextFromElement(word);
        } else {
            word.textContent = '';
        }
    });
    
    // شروع انیمیشن
    setTimeout(() => {
        typeWordMultiLang();
    }, 500);
}

// وقتی زبان تغییر کرد، انیمیشن رو ریستارت کن
if (typeof window !== 'undefined') {
    window.addEventListener('languageChanged', function() {
        setTimeout(function() {
            if (typingWrapper && typingWords.length) {
                initTypingAnimation();
            }
        }, 200);
    });
}

// آپدیت هنگام تغییر سایز صفحه
let resizeTimerGlobal;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimerGlobal);
    resizeTimerGlobal = setTimeout(function() {
        if (typingWrapper) setFixedWidthMultiLang();
    }, 150);
});

// ===== پاپ‌آپ عضویت چندزبانه (فقط فارسی و روسی) =====
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("nameForm");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("username").value.trim();
      if (!name) {
        alert(getCurrentLangText("لطفاً نام خود را وارد کنید!", "Пожалуйста, введите ваше имя!"));
        return;
      }

      // === Overlay انیمیشنی سبک ===
      const overlay = document.createElement("div");
      overlay.style.cssText = `
        position: fixed;
        top:0; left:0;
        width:100%; height:100%;
        background: rgba(0,0,0,0.15);
        z-index: 9998;
        opacity:0;
        transition: opacity 0.4s ease;
      `;
      document.body.appendChild(overlay);
      requestAnimationFrame(() => overlay.style.opacity = "1");

      // === پاپ‌آپ انیمیشنی سبک ===
      const popup = document.createElement("div");
      popup.style.cssText = `
        position: fixed;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: rgb(255, 255, 255);
        padding: 25px 20px;
        border-radius: 25px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        text-align: center;
        z-index: 9999;
        max-width: 85%;
        width: 320px;
        border: 2px solid #ff4081;
        font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
        transition: transform 0.4s cubic-bezier(0.68,-0.55,0.265,1.55);
      `;

      const welcomeText = getCurrentLangText(
        `${name} عزیز!`,
        `Дорогой ${name}!`
      );
      
      const messageText = getCurrentLangText(
        `به جمع خانواده <strong style="color:#ff4081;">IVAN OMGRU</strong> خوش آمدی!<br>با دنبال کردن ما در اینستاگرام، از آموزش‌ها استفاده کن 🌟`,
        `Добро пожаловать в семью <strong style="color:#ff4081;">IVAN OMGRU</strong>!<br>Следите за нами в Instagram и пользуйтесь обучением 🌟`
      );

      popup.innerHTML = `
        <div style="margin-bottom: 12px;">
          <span style="
            background: #ff4081; padding: 8px 16px; border-radius: 40px; 
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

      // Scale-in انیمیشن
      requestAnimationFrame(() => popup.style.transform = "translate(-50%, -50%) scale(1)");

      // === کنفتی سبک انیمیشنی ===
      launchSimpleConfetti(25);

      // === المان‌های شناور انیمیشنی ===
      launchSimpleFloating(12);

      // === بستن و هدایت ===
      setTimeout(() => {
        popup.style.transform = "translate(-50%, -50%) scale(0)";
        overlay.style.opacity = "0";

        setTimeout(() => {
          popup.remove();
          overlay.remove();
        }, 400);

        window.location.href = "https://www.instagram.com/ivan.omgru/";
      }, 3500);
    });
  }

  // ===== کنفتی انیمیشنی سبک =====
  function launchSimpleConfetti(count) {
    const colors = ['#ff4081','#ff8a5c','#ffd93d','#6c5ce7'];
    for(let i=0;i<count;i++){
      const c=document.createElement("div");
      c.style.cssText=`
        position: fixed; z-index:9997; left:${Math.random()*100}%;
        top:-10px; width:7px; height:7px; border-radius:50%;
        background:${colors[Math.floor(Math.random()*colors.length)]};
        opacity:0.8; pointer-events:none;
        transition: transform ${1+Math.random()}s linear, opacity ${1+Math.random()}s linear;
        transform: translateY(0);
      `;
      document.body.appendChild(c);
      requestAnimationFrame(() => c.style.transform = `translateY(${window.innerHeight + 20}px)`);
      setTimeout(()=>c.remove(),2000);
    }
  }

  // ===== المان‌های شناور انیمیشنی سبک =====
  function launchSimpleFloating(count){
    const emojis=["❤️","🎉","✨","🔥"];
    for(let i=0;i<count;i++){
      const e=document.createElement("div");
      e.innerHTML=emojis[Math.floor(Math.random()*emojis.length)];
      e.style.cssText=`
        position: fixed; font-size:18px; left:${Math.random()*100}%;
        bottom:-20px; opacity:0.7; z-index:9996; pointer-events:none;
        transition: transform 1.8s ease-out, opacity 1.8s ease-out;
      `;
      document.body.appendChild(e);
      requestAnimationFrame(()=>{
        e.style.transform=`translateY(-${window.innerHeight + 40}px)`;
        e.style.opacity="0";
      });
      setTimeout(()=>e.remove(),1800);
    }
  }
}); 

// تابع مشترک برای همه سرچ‌ها
function goToGoogleSearch(query) {
    var finalQuery = query + " ivan omgru site:ivan-omgru.ir";
    var googleUrl = "https://www.google.com/search?q=" + encodeURIComponent(finalQuery);
    window.location.href = googleUrl;
}

// --- سرچ دسکتاپ ---
var desktopForm = document.getElementById("searchForm");
if (desktopForm) {
    desktopForm.addEventListener("submit", function(e) {
        e.preventDefault();
        var value = document.getElementById("searchInput").value.trim();
        if (value) goToGoogleSearch(value);
    });
}

// --- سرچ موبایل ---
var mobileForm = document.getElementById("mobileSearchForm");
if (mobileForm) {
    mobileForm.addEventListener("submit", function(e) {
        e.preventDefault();
        var value = document.getElementById("mobileSearchInput").value.trim();
        if (value) goToGoogleSearch(value);
    });
}

// --- سرچ بنر دوره‌ها ---
var bannerForm = document.querySelector(".banner-one__category-form");
if (bannerForm) {
    bannerForm.addEventListener("submit", function(e) {
        e.preventDefault();
        var input = bannerForm.querySelector("input[type='search']");
        var value = input.value.trim();
        if (value) goToGoogleSearch(value);
    });
}