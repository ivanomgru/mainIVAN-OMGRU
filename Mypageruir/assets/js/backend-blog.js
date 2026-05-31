const blogPosts = [
  // {
  //   title: "",
  //   category: "",
  //   date: "",
  //   readingTime: "",
  //   authorName: "ابوالفضل شهاب",
  //   authorImage: "assets/images/resources/courses-two-client-img-3.jpg",
  //   authorFollowers: 3420,
  //   image: "/Mypageruir/assets/images/blog/blog-1-1.jpg",
  //   link: "/Mypageruir/blog-detalis/aya-zaban-rusi-sakhte.html",
  //   text: ""
  // }
  {
    title: "اشتباهات رایج فارسی‌زبانان در زبان روسی",
    category: "زبان روسی",
    date: "1 فروردین، 1402",
    readingTime: "مطالعه ۷ دقیقه",
    authorName: "ابوالفضل شهاب",
    authorImage: "assets/images/resources/courses-two-client-img-3.jpg",
    authorFollowers: 3420,
    image: "/Mypageruir/assets/images/blog/blog-1-3.jpg",
    link: "/Mypageruir/blog-detalis/common-mistakes-persian-russian.html",
    text: "بررسی اشتباهات متداول در تلفظ و گرامر زبان روسی و راهکارهایی که به یادگیری دقیق‌تر کمک می‌کند. از حروف سیریلیک و تلفظ غلط تا حالت‌های شش‌گانه و افعال."
  },
  {
    title: "فرهنگ مردم روسیه؛ نکاتی که دانستن آن‌ها مهم است",
    category: "فرهنگ روسیه",
    date: "۱۸ خرداد، ۱۴۰۲",
    readingTime: "مطالعه ۸ دقیقه",
    authorName: "ابوالفضل شهاب",
    authorImage: "assets/images/resources/courses-two-client-img-3.jpg",
    authorFollowers: 3420,
    image: "/Mypageruir/assets/images/blog/blog-1-2.jpg",
    link: "/Mypageruir/blog-detalis/culture-of-russia.html",
    text: "آشنایی با رفتارهای اجتماعی، سبک زندگی و تفاوت‌های فرهنگی در روسیه که برای مهاجران کاربردی است. "
  },
  {
    title: "آیا زبان روسی سخته؟ تحلیل جامع چالش‌ها و شیرینی‌های یادگیری روسی",
    category: "زبان روسی",
    date: "۲۲ اردیبهشت، ۱۴۰۴",
    readingTime: "۱۵ دقیقه مطالعه",
    authorName: "ابوالفضل شهاب",
    authorImage: "assets/images/resources/courses-two-client-img-3.jpg",
    authorFollowers: 3420,
    image: "/Mypageruir/assets/images/blog/blog-1-2 -.jpg",
    link: "/Mypageruir/blog-detalis/aya-zaban-rusi-sakhte.html",
    text: "آیا زبان روسی سخته؟ روسی به دلیل الفبای سیریلیک، دستور زبان پیچیده و تلفظ خاص خود شهرت «سخت بودن» را دارد."
  },
  {
    title: "آیا مهاجرت به روسیه خوبه؟ واقعیت‌های اقتصاد، کار و زندگی برای یک مهاجر",
    category: "مهاجرت و اقتصاد",
    date: "۳۰ اردیبهشت ۱۴۰۴",
    readingTime: "۶ دقیقه",
    authorName: "ابوالفضل شهاب",
    authorImage: "/Mypageruir/assets/images/blog/blog-details-client-img-1.jpg",
    authorFollowers: 3420,
    image: "/Mypageruir/assets/images/blog/blog-1-1.jpg",
    link: "/Mypageruir/blog-detalis/emigrate-to-russia-work-opportunities.html",
    text: "تحلیل صفرتاصد مهاجرت کاری به روسیه: فرصت‌های شغلی، درآمد ماهیانه، هزینه‌ها و چالش‌های تحریم. بروزرسانی ۲۰۲۵"
  },
  {
    title: "کلمات عاشقانه به سه زبان روسی، انگلیسی و فارسی؛ راهنمای جامع ابراز احساسات",
    category: "زبان و فرهنگ",
    date: "۳۱ اردیبهشت، ۱۴۰۴",
    readingTime: "۸ دقیقه",
    authorName: "ابوالفضل شهاب",
    authorImage: "/Mypageruir/assets/images/blog/blog-details-client-img-1.jpg",
    authorFollowers: 3420,
    image: "/Mypageruir/assets/images/blog/blog-1-1-2.jpg",
    link: "/Mypageruir/blog-detalis/story-love.html",
    text: "راهنمای جامع کلمات و جملات عاشقانه به سه زبان روسی، انگلیسی و فارسی از ابراز علاقه تا عشق ابدی."
  },
  {
    title: "همکاری ایران و روسیه؛ فرصت‌ها، چالش‌ها و چشم‌انداز آینده (تحلیل جامع روابط راهبردی)",
    category: "ژئوپلیتیک",
    date: "۲ خرداد، ۱۴۰۴",
    readingTime: "۸ دقیقه",
    authorName: "ابوالفضل شهاب",
    authorImage: "/Mypageruir/assets/images/blog/blog-details-client-img-1.jpg",
    authorFollowers: 3420,
    image: "/Mypageruir/assets/images/blog/blog-1-3-3.jpg",
    link: "/Mypageruir/blog-detalis/hamkari-iran-va-rusye.html",
    text: "تحلیل جامع همکاری ایران و روسیه در حوزه‌های اقتصادی، نظامی، سیاسی و انرژی. بررسی"
  }
];

const BLOG_POSTS_PER_PAGE = 6;
let blogCurrentPage = 1;
let blogFilteredPosts = [...blogPosts];

function createBlogPostCard(post) {
  const hasImage = post.image && post.image.trim() !== "";
  const imageHtml = hasImage 
    ? `<img src="${post.image}" loading="lazy" alt="${post.title}">` 
    : '<div class="glass-placeholder"></div>';
  const noImageClass = hasImage ? "" : "no-image";

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
              <div class="courses-two__client-img"><img src="${post.authorImage}" loading="lazy" alt="${post.authorName}"></div>
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
  const shownPosts = Math.min(BLOG_POSTS_PER_PAGE * blogCurrentPage, totalPosts);
  const statsEl = document.getElementById("blog-stats");
  if (statsEl) {
    statsEl.innerText = `نمایش ${shownPosts} مقاله از ${totalPosts} مقاله`;
  }
}

function toggleBlogLoadMore() {
  const totalPosts = blogFilteredPosts.length;
  const loadMoreBtn = document.getElementById("blog-load-more-btn");

  if (!loadMoreBtn) return;

  if (blogCurrentPage === 2) {
    loadMoreBtn.innerHTML = '<a href="#" class="thm-btn-two"><span>مشاهده بیشتر وبلاگ</span><i class="far fa-angle-double-left"></i></a>';
    loadMoreBtn.style.display = "inline-flex";
    loadMoreBtn.onclick = null;
  } else {
    const shouldShow = (BLOG_POSTS_PER_PAGE * blogCurrentPage) < totalPosts;
    loadMoreBtn.style.display = shouldShow ? "inline-flex" : "none";
    loadMoreBtn.innerHTML = '<span>بیشتر</span><i class="far fa-angle-double-left"></i>';
    loadMoreBtn.removeEventListener("click", blogLoadMoreHandler);
    loadMoreBtn.addEventListener("click", blogLoadMoreHandler);
  }
}

function blogLoadMoreHandler() {
  blogCurrentPage++;
  renderBlogPosts(blogCurrentPage, true);
}

function renderBlogPagination() {
  const totalPages = Math.ceil(blogFilteredPosts.length / BLOG_POSTS_PER_PAGE);
  const paginationUl = document.getElementById("blog-pagination");

  if (!paginationUl) return;

  let html = "";
  html += `<li class="prev"><a href="#" aria-label="prev" data-page="${blogCurrentPage - 1}" ${blogCurrentPage === 1 ? 'style="pointer-events:none;opacity:0.5;"' : ""}><i class="fas fa-arrow-right"></i></a></li>`;

  for (let i = 1; i <= totalPages; i++) {
    const pageStr = i < 10 ? "0" + i : i;
    html += `<li class="count ${i === blogCurrentPage ? "active" : ""}"><a href="#" data-page="${i}">${pageStr}</a></li>`;
  }

  html += `<li class="next"><a href="#" aria-label="Next" data-page="${blogCurrentPage + 1}" ${blogCurrentPage === totalPages ? 'style="pointer-events:none;opacity:0.5;"' : ""}><i class="fas fa-arrow-left"></i></a></li>`;

  paginationUl.innerHTML = html;
}

function renderBlogPosts(page = blogCurrentPage, append = false) {
  const container = document.getElementById("blog-posts-container");
  if (!container) return;

  const start = BLOG_POSTS_PER_PAGE * (page - 1);
  const end = start + BLOG_POSTS_PER_PAGE;
  const postsToShow = blogFilteredPosts.slice(start, end);

  if (!append) {
    container.innerHTML = "";
  }

  postsToShow.forEach(post => {
    container.insertAdjacentHTML("beforeend", createBlogPostCard(post));
  });

  updateBlogStats();
  toggleBlogLoadMore();
  renderBlogPagination();

  if (typeof WOW !== "undefined" && !append) {
    new WOW().init();
  }

  if (typeof Odometer !== "undefined") {
    document.querySelectorAll(".odometer").forEach(el => {
      const count = el.getAttribute("data-count");
      if (count) {
        el.innerText = count;
      }
    });
  }
}

function applyBlogSort(sortBy) {
  blogFilteredPosts = sortBy === "newest" 
    ? [...blogPosts].reverse() 
    : [...blogPosts];
}

document.addEventListener("DOMContentLoaded", function() {
  const blogSortSelect = document.getElementById("blog-sort");

  if (blogSortSelect) {
    let lastBlogSort = blogSortSelect.value;
    applyBlogSort(lastBlogSort);
    renderBlogPosts(1, false);

    blogSortSelect.addEventListener("change", function(e) {
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

  const blogLoadMore = document.getElementById("blog-load-more-btn");
  if (blogLoadMore) {
    blogLoadMore.addEventListener("click", blogLoadMoreHandler);
  }

  const blogPagination = document.getElementById("blog-pagination");
  if (blogPagination) {
    blogPagination.addEventListener("click", function(e) {
      const link = e.target.closest("a[data-page]");
      if (!link) return;

      e.preventDefault();
      const page = parseInt(link.getAttribute("data-page"));
      const totalPages = Math.ceil(blogFilteredPosts.length / BLOG_POSTS_PER_PAGE);

      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        blogCurrentPage = page;
        renderBlogPosts(blogCurrentPage, false);
      }
    });
  }
});
