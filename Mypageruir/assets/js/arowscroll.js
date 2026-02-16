(function($){
    "use strict";

    /* ===== ScrollIt ===== */
    $.scrollIt = function(o){
        var s = $.extend({
            upKey:38, downKey:40, easing:"swing", scrollTime:800,
            activeClass:"active", onPageChange:null, topOffset:0
        }, o), c=0, l=$("[data-scroll-index]:last").attr("data-scroll-index");

        var f = function(i){
            if(i<0||i>l) return;
            $("html,body").animate({scrollTop:$("[data-scroll-index="+i+"]").offset().top+s.topOffset},s.scrollTime,s.easing);
        };

        var k = function(e){
            var i=$(e.target).closest("[data-scroll-nav]").attr("data-scroll-nav")||
                  $(e.target).closest("[data-scroll-goto]").attr("data-scroll-goto");
            f(parseInt(i));
        };

        var h = function(e){
            var i=e.which;
            if($("html,body").is(":animated")&&(i==s.upKey||i==s.downKey)) return !1;
            if(i==s.upKey&&c>0){ f(c-1); return !1; }
            if(i==s.downKey&&c<l){ f(c+1); return !1; }
            return !0;
        };

        var a = function(i){
            s.onPageChange&&i&&c!=i&&s.onPageChange(i);
            c=i;
            $("[data-scroll-nav]").removeClass(s.activeClass);
            $("[data-scroll-nav="+i+"]").addClass(s.activeClass);
        };

        var r = function(){
            var t=$(window).scrollTop();
            var i=$("[data-scroll-index]").filter(function(i,e){
                return t>=$(e).offset().top+s.topOffset&&t<$(e).offset().top+s.topOffset+$(e).outerHeight();
            });
            var n=i.first().attr("data-scroll-index");
            a(n);
        };

        $(window).on("scroll",r).scroll();
        $(window).on("keydown",h);
        $("body").on("click","[data-scroll-nav],[data-scroll-goto]",function(e){ e.preventDefault(); k(e); });
    };

    $(document).ready(function(){ 
        $.scrollIt({easing:"swing",scrollTime:800,topOffset:0}); 

        /* ===== Disable Save Image (Only Images) ===== */
        document.querySelectorAll("img").forEach(img => {
            img.addEventListener("contextmenu", e => e.preventDefault());
        });

        document.addEventListener("dragstart", function(e){
            if(e.target.tagName === "IMG"){
                e.preventDefault();
            }
        });
    });

})(jQuery);


/* ===== Animated Headline Typing ===== */
const words = Array.from(document.querySelectorAll('.cd-words-wrapper b')),
      typingSpeed = 100, pauseBetweenWords = 1500;
let current=0, charIndex=0;

function typeWord(){
    const w = words[current];
    w.style.display = 'inline';
    w.classList.add('is-visible');
    charIndex = 0;
    w.textContent = '';
    const t = setInterval(()=>{
        w.textContent += w.dataset.fa.charAt(charIndex);
        charIndex++;
        if(charIndex >= w.dataset.fa.length){
            clearInterval(t);
            setTimeout(deleteWord,pauseBetweenWords);
        }
    }, typingSpeed);
}

function deleteWord(){
    const w = words[current];
    let d = w.textContent.length;
    const del = setInterval(()=>{
        d--;
        w.textContent = w.dataset.fa.substring(0,d);
        if(d<=0){
            clearInterval(del);
            w.classList.remove('is-visible');
            current = (current+1) % words.length;
            setTimeout(typeWord,500);
        }
    }, typingSpeed/2);
}

typeWord();