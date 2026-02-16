// ==================== آرایه پست‌های دوره‌ها ====================
    const posts = [
        {
            title: "پستی فعلا وجود ندارد",
            category: "ویدیو",
            subcategory: "اینستاگرام",
            date: "25 مرداد - 1404 تاریخ یافت نشد",
            readingTime: "7 دقیقه مطالعه",
            authorName: "ابوالفضل شهاب (ivan omgru)",
            authorImage: "assets/images/resources/courses-two-client-img-1.jpg",
            authorFollowers: 2595,
            rating: 4.5,
            image: "assets/images/blog/blog-1-3.jpg",
            link: "#"
        }
    ];

    // ==================== آرایه پست‌های وبلاگ ====================
    const blogPosts = [
        {
            title: "پستی فعلا وجود ندارد",
            category: "UI/UX نامشخص دسته",
            date: "5 مهر، 1402 تاریخ یافت نشد !",
            readingTime: "8 دقیقه مطالعه",
            authorName: " نویسنده یافت نشد !",
            authorImage: "assets/images/resources/courses-two-client-img-3.jpg",
            authorFollowers: 3420,
            image: "assets/images/blog/blog-1-3.jpg",
            link: "#",
            text: "متنی وجود ندارد !!."
        }
    ];

    // ==================== تنظیمات مشترک ====================
    const POSTS_PER_PAGE = 6;       // برای دوره‌ها
    const BLOG_POSTS_PER_PAGE = 6;   // برای وبلاگ

    // ==================== متغیرهای دوره‌ها ====================
    let currentPage = 1;
    let filteredPosts = [...posts];

    // ==================== متغیرهای وبلاگ ====================
    let blogCurrentPage = 1;
    let blogFilteredPosts = [...blogPosts];

    // ==================== توابع کمکی دوره‌ها ====================
    function createPostCard(post) {
        const hasImage = post.image && post.image.trim() !== '';
        const imageHtml = hasImage 
            ? `<img src="${post.image}" alt="${post.title}">`
            : `<div class="glass-placeholder"></div>`;
        const noImageClass = !hasImage ? 'no-image' : '';
        return `
            <div class="col-xl-4 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="100ms">
                <div class="blog-two__single ${noImageClass}">
                    <div class="blog-two__img">
                        ${imageHtml}
                        <div class="blog-two__date">
                            <span class="icon-calendar"></span>
                            <p>${post.date}</p>
                        </div>
                    </div>
                    <div class="blog-two__content">
                        <div class="blog-two__meta-box">
                            <ul class="blog-two__meta list-unstyled">
                                <li><a href="${post.link}"><span class="icon-tags"></span>${post.category}</a></li>
                                <li><a href="${post.link}"><span class="icon-clock"></span>${post.readingTime}</a></li>
                            </ul>
                            <div class="courses-two__doller-and-review">
                                <div class="courses-two__doller"><p>${post.subcategory}</p></div>
                                <div class="courses-two__review"><p><i class="icon-star"></i> ${post.rating}</p></div>
                            </div>
                        </div>
                        <h4 class="blog-two__title"><a href="${post.link}">${post.title}</a></h4>
                    </div>
                    <div class="courses-two__content">
                        <div class="courses-two__btn-and-client-box">
                            <div class="courses-two__btn-box">
                                <a href="${post.link}" class="thm-btn-two"><span>مشاهده بیشتر</span><i class="far fa-angle-double-left"></i></a>
                            </div>
                            <div class="courses-two__client-box">
                                <div class="courses-two__client-img"><img src="${post.authorImage}" alt="${post.authorName}"></div>
                                <div class="courses-two__client-content">
                                    <h4>${post.authorName}</h4>
                                    <p><span class="odometer" data-count="${post.authorFollowers}">0</span><i>+</i> دنبال کننده</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function updateStats() {
        const totalPosts = filteredPosts.length;
        const shownPosts = Math.min(currentPage * POSTS_PER_PAGE, totalPosts);
        const statsEl = document.getElementById('post-stats');
        if (statsEl) statsEl.innerText = `نمایش ${shownPosts} دوره از ${totalPosts} دوره`;
    }

    function toggleLoadMore() {
        const totalPosts = filteredPosts.length;
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = currentPage * POSTS_PER_PAGE >= totalPosts ? 'none' : 'inline-flex';
        }
    }

    function renderPagination() {
        const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
        const paginationUl = document.getElementById('pagination');
        if (!paginationUl) return;
        let html = '';
        html += `<li class="prev"><a href="#" aria-label="prev" data-page="${currentPage-1}" ${currentPage===1?'style="pointer-events:none;opacity:0.5;"':''}><i class="fas fa-arrow-right"></i></a></li>`;
        for (let i=1; i<=totalPages; i++) {
            const pageStr = i<10 ? '0'+i : i;
            html += `<li class="count ${i===currentPage?'active':''}"><a href="#" data-page="${i}">${pageStr}</a></li>`;
        }
        html += `<li class="next"><a href="#" aria-label="Next" data-page="${currentPage+1}" ${currentPage===totalPages?'style="pointer-events:none;opacity:0.5;"':''}><i class="fas fa-arrow-left"></i></a></li>`;
        paginationUl.innerHTML = html;
    }

    function renderPosts(page = currentPage, append = false) {
        const container = document.getElementById('posts-container');
        if (!container) return;
        const start = (page - 1) * POSTS_PER_PAGE;
        const end = start + POSTS_PER_PAGE;
        const postsToShow = filteredPosts.slice(start, end);
        if (!append) container.innerHTML = '';
        postsToShow.forEach(post => container.insertAdjacentHTML('beforeend', createPostCard(post)));
        updateStats();
        toggleLoadMore();
        renderPagination();
        if (typeof WOW !== 'undefined' && !append) new WOW().init();
        if (typeof Odometer !== 'undefined') {
            document.querySelectorAll('.odometer').forEach(el => {
                const count = el.getAttribute('data-count');
                if (count) el.innerText = count;
            });
        }
    }

    function applySort(sortBy) {
        filteredPosts = sortBy === 'newest' ? [...posts].reverse() : [...posts];
    }

    // ==================== توابع کمکی وبلاگ ====================
    function createBlogPostCard(post) {
        const hasImage = post.image && post.image.trim() !== '';
        const imageHtml = hasImage 
            ? `<img src="${post.image}" alt="${post.title}">`
            : `<div class="glass-placeholder"></div>`;
        const noImageClass = !hasImage ? 'no-image' : '';
        return `
            <div class="col-xl-4 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="100ms">
                <div class="blog-two__single ${noImageClass}">
                    <div class="blog-two__img">
                        ${imageHtml}
                        <div class="blog-two__date">
                            <span class="icon-calendar"></span>
                            <p>${post.date}</p>
                        </div>
                    </div>
                    <div class="blog-two__content">
                        <div class="blog-two__meta-box">
                            <ul class="blog-two__meta list-unstyled">
                                <li><a href="${post.link}"><span class="icon-tags"></span>${post.category}</a></li>
                                <li><a href="${post.link}"><span class="icon-clock"></span>${post.readingTime}</a></li>
                            </ul>
                        </div>
                        <h4 class="blog-two__title"><a href="${post.link}">${post.title}</a></h4>
                        <p class="blog-two__text">${post.text}</p>
                    </div>
                    <div class="courses-two__content">
                        <div class="courses-two__btn-and-client-box">
                            <div class="courses-two__btn-box">
                                <a href="${post.link}" class="thm-btn-two"><span>مشاهده بیشتر</span><i class="far fa-angle-double-left"></i></a>
                            </div>
                            <div class="courses-two__client-box">
                                <div class="courses-two__client-img"><img src="${post.authorImage}" alt="${post.authorName}"></div>
                                <div class="courses-two__client-content">
                                    <h4>${post.authorName}</h4>
                                    <p><span class="odometer" data-count="${post.authorFollowers}">0</span><i>+</i> دنبال کننده</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function updateBlogStats() {
        const totalPosts = blogFilteredPosts.length;
        const shownPosts = Math.min(blogCurrentPage * BLOG_POSTS_PER_PAGE, totalPosts);
        const statsEl = document.getElementById('blog-stats');
        if (statsEl) statsEl.innerText = `نمایش ${shownPosts} مقاله از ${totalPosts} مقاله`;
    }

    function toggleBlogLoadMore() {
        const totalPosts = blogFilteredPosts.length;
        const loadMoreBtn = document.getElementById('blog-load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = blogCurrentPage * BLOG_POSTS_PER_PAGE >= totalPosts ? 'none' : 'inline-flex';
        }
    }

    function renderBlogPagination() {
        const totalPages = Math.ceil(blogFilteredPosts.length / BLOG_POSTS_PER_PAGE);
        const paginationUl = document.getElementById('blog-pagination');
        if (!paginationUl) return;
        let html = '';
        html += `<li class="prev"><a href="#" aria-label="prev" data-page="${blogCurrentPage-1}" ${blogCurrentPage===1?'style="pointer-events:none;opacity:0.5;"':''}><i class="fas fa-arrow-right"></i></a></li>`;
        for (let i=1; i<=totalPages; i++) {
            const pageStr = i<10 ? '0'+i : i;
            html += `<li class="count ${i===blogCurrentPage?'active':''}"><a href="#" data-page="${i}">${pageStr}</a></li>`;
        }
        html += `<li class="next"><a href="#" aria-label="Next" data-page="${blogCurrentPage+1}" ${blogCurrentPage===totalPages?'style="pointer-events:none;opacity:0.5;"':''}><i class="fas fa-arrow-left"></i></a></li>`;
        paginationUl.innerHTML = html;
    }

    function renderBlogPosts(page = blogCurrentPage, append = false) {
        const container = document.getElementById('blog-posts-container');
        if (!container) return;
        const start = (page - 1) * BLOG_POSTS_PER_PAGE;
        const end = start + BLOG_POSTS_PER_PAGE;
        const postsToShow = blogFilteredPosts.slice(start, end);
        if (!append) container.innerHTML = '';
        postsToShow.forEach(post => container.insertAdjacentHTML('beforeend', createBlogPostCard(post)));
        updateBlogStats();
        toggleBlogLoadMore();
        renderBlogPagination();
        if (typeof WOW !== 'undefined' && !append) new WOW().init();
        if (typeof Odometer !== 'undefined') {
            document.querySelectorAll('.odometer').forEach(el => {
                const count = el.getAttribute('data-count');
                if (count) el.innerText = count;
            });
        }
    }

    function applyBlogSort(sortBy) {
        blogFilteredPosts = sortBy === 'newest' ? [...blogPosts].reverse() : [...blogPosts];
    }

    // ==================== راه‌اندازی همه چیز بعد از لود DOM ====================
    document.addEventListener('DOMContentLoaded', function() {
        // ---------- بخش دوره‌ها ----------
        const sortSelect = document.getElementById('sort-posts');
        if (sortSelect) {
            let lastSortValue = sortSelect.value;
            applySort(lastSortValue);
            renderPosts(1, false);

            sortSelect.addEventListener('change', function(e) {
                const newVal = e.target.value;
                if (newVal !== lastSortValue) {
                    lastSortValue = newVal;
                    applySort(newVal);
                    currentPage = 1;
                    renderPosts(currentPage, false);
                }
            });

            setInterval(function() {
                if (sortSelect.value !== lastSortValue) {
                    lastSortValue = sortSelect.value;
                    applySort(lastSortValue);
                    currentPage = 1;
                    renderPosts(currentPage, false);
                }
            }, 500);
        }

        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', function() {
                currentPage++;
                renderPosts(currentPage, true);
            });
        }

        const pagination = document.getElementById('pagination');
        if (pagination) {
            pagination.addEventListener('click', function(e) {
                const link = e.target.closest('a[data-page]');
                if (!link) return;
                e.preventDefault();
                const page = parseInt(link.getAttribute('data-page'));
                const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
                if (!isNaN(page) && page >= 1 && page <= totalPages) {
                    currentPage = page;
                    renderPosts(currentPage, false);
                }
            });
        }

        // ---------- بخش وبلاگ ----------
        const blogSortSelect = document.getElementById('blog-sort');
        if (blogSortSelect) {
            let lastBlogSort = blogSortSelect.value;
            applyBlogSort(lastBlogSort);
            renderBlogPosts(1, false);

            blogSortSelect.addEventListener('change', function(e) {
                const newVal = e.target.value;
                if (newVal !== lastBlogSort) {
                    lastBlogSort = newVal;
                    applyBlogSort(newVal);
                    blogCurrentPage = 1;
                    renderBlogPosts(blogCurrentPage, false);
                }
            });

            setInterval(function() {
                if (blogSortSelect.value !== lastBlogSort) {
                    lastBlogSort = blogSortSelect.value;
                    applyBlogSort(lastBlogSort);
                    blogCurrentPage = 1;
                    renderBlogPosts(blogCurrentPage, false);
                }
            }, 500);
        }

        const blogLoadMore = document.getElementById('blog-load-more-btn');
        if (blogLoadMore) {
            blogLoadMore.addEventListener('click', function() {
                blogCurrentPage++;
                renderBlogPosts(blogCurrentPage, true);
            });
        }

        const blogPagination = document.getElementById('blog-pagination');
        if (blogPagination) {
            blogPagination.addEventListener('click', function(e) {
                const link = e.target.closest('a[data-page]');
                if (!link) return;
                e.preventDefault();
                const page = parseInt(link.getAttribute('data-page'));
                const totalPages = Math.ceil(blogFilteredPosts.length / BLOG_POSTS_PER_PAGE);
                if (!isNaN(page) && page >= 1 && page <= totalPages) {
                    blogCurrentPage = page;
                    renderBlogPosts(blogCurrentPage, false);
                }
            });
        }
    });