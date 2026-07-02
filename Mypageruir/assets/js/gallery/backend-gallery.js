// assets/js/gallery/backend-gallery.js
document.addEventListener('DOMContentLoaded', function () {

    // ============================================================
    // 1. داده‌های گالری
    // ============================================================
    const galleryItems = [
        {
            id: 1,
            imgSrc: 'assets/images/gallery/gallery-page-1-6.jpg',
            alt: 'اتاق ابوالفضل شهاب - مدرس زبان روسی',
            instagramLink: 'https://www.instagram.com/p/DaGXj7OjbzR/',
            filter: 'personal',
            size: 3,
        },
        {
            id: 2,
            imgSrc: 'assets/images/gallery/gallery-page-1-8.jpg',
            alt: 'ابوالفضل شهاب - برنامه نویس و مدرس روسی',
            instagramLink: 'https://www.instagram.com/p/DaGXj7OjbzR/',
            filter: 'personal',
            size: 6,
        },
        {
            id: 3,
            imgSrc: 'assets/images/gallery/gallery-page-1-9.jpg',
            alt: 'بورسیه تحصیلی روسیه',
            instagramLink: 'https://www.instagram.com/p/DaSdfpTjQFz/',
            filter: 'company',
            size: 3,
        },
        {
            id: 4,
            imgSrc: 'assets/images/gallery/gallery-page-1-8-1.jpg',
            alt: 'ابوالفضل شهاب - تدریس خصوصی روسی',
            instagramLink: 'https://www.instagram.com/p/DaGXj7OjbzR/',
            filter: 'personal',
            size: 6,
        }
    ];

    // ============================================================
    // 2. تولید اسکیما (JSON-LD) برای گوگل
    // ============================================================
    function generateGallerySchema(items) {
        const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/');
        // اگر مسیر نسبی دارید، آن را با baseUrl ترکیب کنید.
        // بهتر است از آدرس مطلق استفاده شود.
        const fullUrl = (src) => new URL(src, window.location.href).href;

        const imageObjects = items.map(item => ({
            "@type": "ImageObject",
            "contentUrl": fullUrl(item.imgSrc),
            "thumbnail": fullUrl(item.imgSrc), // در صورت وجود تصویر بند‌انگشتی جداگانه، آن را جایگزین کنید
            "caption": item.alt,
            "description": item.alt,
            "author": {
                "@type": "Person",
                "name": "ابوالفضل شهاب"
            }
        }));

        const schema = {
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            "name": "گالری تصاویر ابوالفضل شهاب | بلاگر ایرانی-روسی",
            "description": "گالری تصاویر ابوالفضل شهاب، بلاگر ایرانی-روسی و بنیان‌گذار IVAN OMGRU.",
            "image": imageObjects
        };

        // ساخت اسکریپت JSON-LD
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
    }

    // اجرای تولید اسکیما (بلافاصله پس از تعریف داده‌ها)
    generateGallerySchema(galleryItems);

    // ============================================================
    // 3. عناصر DOM
    // ============================================================
    const galleryContainer = document.querySelector('.masonary-layout');
    const statsEl = document.getElementById('blog-stats');
    const loadMoreBtn = document.getElementById('blog-load-more-btn');

    // ============================================================
    // 4. وضعیت
    // ============================================================
    const itemsPerPage = 9;
    let currentPage = 1;
    const allItems = [...galleryItems];
    let displayedItems = [];
    let allLoaded = false;
    let isLoading = false;
    const viewAllLink = 'https://example.com/more-photos';
    let observer = null;

    // ============================================================
    // 5. رندر گالری
    // ============================================================
    function renderGalleryPage(page, append = false) {
        const start = (page - 1) * itemsPerPage;
        const end = Math.min(start + itemsPerPage, allItems.length);
        const pageItems = allItems.slice(start, end);

        if (!append) {
            galleryContainer.innerHTML = '';
            displayedItems = [];
        }

        pageItems.forEach(item => {
            const col = document.createElement('div');
            const sizeClass = item.size === 6 ? 'col-xl-6' : 'col-xl-3';
            col.className = `${sizeClass} col-lg-6 col-md-6 filter-item`;
            col.setAttribute('data-filter', item.filter);
            col.innerHTML = `
                <div class="gallery-page__single">
                    <div class="gallery-page__img">
                        <div class="gallery-page__img-box">
                            <img src="${item.imgSrc}" loading="lazy" alt="${item.alt}">
                        </div>
                        <div class="gallery-page__icon" style="display: flex; gap: 10px; justify-content: center;">
                            <a class="img-popup" href="${item.imgSrc}"><span class="icon-plus"></span></a>
                            <a href="${item.instagramLink}" target="_blank" rel="noopener noreferrer" style="background: linear-gradient(45deg, #f09433, #d62976);">
                                <span class="fab fa-instagram"></span>
                            </a>
                        </div>
                    </div>
                </div>
            `;
            galleryContainer.appendChild(col);
            displayedItems.push(item);
        });

        updateStats();
        updateLoadMoreButton();

        if (typeof imagesLoaded !== 'undefined') {
            imagesLoaded(galleryContainer, function () {
                refreshIsotope();
            });
        } else {
            setTimeout(refreshIsotope, 400);
        }
    }

    // ============================================================
    // 6. آمار
    // ============================================================
    function updateStats() {
        statsEl.textContent = `نمایش ${displayedItems.length} عکس از ${allItems.length} عکس`;
    }

    // ============================================================
    // 7. وضعیت دکمه بیشتر
    // ============================================================
    function updateLoadMoreButton() {
        const totalItems = allItems.length;
        const shownCount = displayedItems.length;

        if (shownCount >= totalItems) {
            allLoaded = true;
            loadMoreBtn.innerHTML = `<span>مشاهده بیشتر عکس‌ها</span><i class="far fa-angle-double-left"></i>`;
            loadMoreBtn.style.opacity = '1';
            loadMoreBtn.disabled = false;
            if (observer) observer.disconnect();
        } else {
            allLoaded = false;
            loadMoreBtn.innerHTML = `<span>بیشتر</span><i class="far fa-angle-double-left"></i>`;
            loadMoreBtn.style.opacity = '1';
            loadMoreBtn.disabled = false;
        }
    }

    // ============================================================
    // 8. بارگذاری بیشتر
    // ============================================================
    function loadMore() {
        if (isLoading || allLoaded) return;

        const totalPages = Math.ceil(allItems.length / itemsPerPage);
        if (currentPage < totalPages) {
            isLoading = true;
            loadMoreBtn.disabled = true;
            loadMoreBtn.style.opacity = '0.6';

            currentPage++;
            renderGalleryPage(currentPage, true);

            isLoading = false;
            loadMoreBtn.disabled = false;
            loadMoreBtn.style.opacity = '1';
        }
    }

    // ============================================================
    // 9. ایزوتوپ
    // ============================================================
    function refreshIsotope() {
        if (typeof $ === 'undefined' || typeof $.fn.isotope === 'undefined') return;
        const $container = $(galleryContainer);

        if ($container.data('isotope')) {
            $container.isotope('reloadItems');
            $container.isotope('layout');
        } else {
            $container.isotope({
                layoutMode: 'masonry',
                itemSelector: '.col-xl-3, .col-xl-6',
                percentPosition: true,
                masonry: { gutter: 30 }
            });
        }
        $container.isotope({ filter: '*' });
    }

    // ============================================================
    // 10. رویداد کلیک دکمه
    // ============================================================
    loadMoreBtn.addEventListener('click', function () {
        if (allLoaded) {
            window.location.href = viewAllLink;
        } else {
            loadMore();
        }
    });

    // ============================================================
    // 11. بارگذاری اولیه
    // ============================================================
    renderGalleryPage(1, false);

    // ============================================================
    // 12. اسکرول بی‌نهایت
    // ============================================================
    const sentinel = document.createElement('div');
    sentinel.id = 'scroll-sentinel';
    sentinel.style.height = '1px';
    sentinel.style.width = '100%';
    sentinel.style.visibility = 'hidden';
    galleryContainer.parentNode.insertBefore(sentinel, galleryContainer.nextSibling);

    observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !allLoaded && !isLoading) {
            loadMore();
        }
    }, {
        rootMargin: '0px 0px 200px 0px'
    });

    observer.observe(sentinel);

    // ============================================================
    // 13. مدیریت تغییر اندازه و رویدادهای دیگر
    // ============================================================
    function handleResize() {
        refreshIsotope();
    }

    window.addEventListener('load', function () {
        setTimeout(refreshIsotope, 200);
    });

    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 200);
    });

    document.addEventListener('shown.bs.collapse', function () {
        setTimeout(refreshIsotope, 300);
    });

});
