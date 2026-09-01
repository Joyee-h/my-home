/* =============================================================
   이현조 포트폴리오 — 인터랙션
   1) 스크롤 등장 애니메이션  2) 읽기 진행률 바
   3) 네비 상태(그림자/현재 섹션)  4) 모바일 메뉴  5) 아코디언
   ============================================================= */
(function () {
    'use strict';

    // JS 가 동작하므로 no-js 대비 클래스를 제거
    document.documentElement.classList.remove('no-js');

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- 1. 스크롤 등장 애니메이션 ---------- */
    var revealItems = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window) || prefersReduced) {
        // 지원하지 않거나 모션 최소화 설정이면 즉시 표시
        revealItems.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

        revealItems.forEach(function (el, i) {
            // 같은 그리드 안의 카드들이 차례로 나타나도록 약간의 지연
            el.style.transitionDelay = (i % 4) * 70 + 'ms';
            revealObserver.observe(el);
        });
    }

    /* ---------- 2. 읽기 진행률 바 + 네비 그림자 ---------- */
    var progress = document.getElementById('scrollProgress');
    var navbar = document.getElementById('navbar');
    var ticking = false;

    function onScroll() {
        var doc = document.documentElement;
        var scrollable = doc.scrollHeight - window.innerHeight;
        var ratio = scrollable > 0 ? window.scrollY / scrollable : 0;

        if (progress) {
            progress.style.transform = 'scaleX(' + Math.min(Math.max(ratio, 0), 1) + ')';
        }
        if (navbar) {
            navbar.classList.toggle('is-scrolled', window.scrollY > 8);
        }
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(onScroll);
    }, { passive: true });

    onScroll();

    /* ---------- 3. 현재 보고 있는 섹션을 메뉴에 표시 ---------- */
    var navLinks = Array.prototype.slice.call(
        document.querySelectorAll('.nav-menu a[href^="#"]')
    );

    var sections = navLinks
        .map(function (link) { return document.querySelector(link.getAttribute('href')); })
        .filter(Boolean);

    if (sections.length && 'IntersectionObserver' in window) {
        var spyObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                navLinks.forEach(function (link) {
                    link.classList.toggle(
                        'is-active',
                        link.getAttribute('href') === '#' + entry.target.id
                    );
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });

        sections.forEach(function (section) { spyObserver.observe(section); });
    }

    /* ---------- 4. 모바일 메뉴 ---------- */
    var navToggle = document.getElementById('navToggle');
    var navPanel = document.getElementById('navPanel');

    function closeMenu() {
        if (!navToggle || !navPanel) return;
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', '메뉴 열기');
        navPanel.classList.remove('is-open');
    }

    if (navToggle && navPanel) {
        navToggle.addEventListener('click', function () {
            var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', String(!isOpen));
            navToggle.setAttribute('aria-label', isOpen ? '메뉴 열기' : '메뉴 닫기');
            navPanel.classList.toggle('is-open', !isOpen);
        });

        // 메뉴 항목을 고르면 자동으로 닫기
        navPanel.addEventListener('click', function (e) {
            if (e.target.closest('a')) closeMenu();
        });

        // Esc 키로 닫기
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeMenu();
        });

        // 데스크톱 폭으로 넓어지면 패널 상태 초기화
        window.matchMedia('(min-width: 861px)').addEventListener('change', function (e) {
            if (e.matches) closeMenu();
        });
    }

    /* ---------- 5. 아코디언 (My Vision / My Mission) ---------- */
    var accHeads = document.querySelectorAll('.acc-head');

    accHeads.forEach(function (head) {
        head.addEventListener('click', function () {
            var item = head.closest('.acc-item');
            var isOpen = head.getAttribute('aria-expanded') === 'true';

            // 한 번에 하나만 열리도록 나머지는 닫음
            document.querySelectorAll('.acc-item').forEach(function (other) {
                other.classList.remove('is-open');
                var otherHead = other.querySelector('.acc-head');
                if (otherHead) otherHead.setAttribute('aria-expanded', 'false');
            });

            if (!isOpen) {
                item.classList.add('is-open');
                head.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // 첫 번째 항목은 기본으로 열어둠
    var firstAcc = document.querySelector('.acc-item');
    if (firstAcc) {
        firstAcc.classList.add('is-open');
        firstAcc.querySelector('.acc-head').setAttribute('aria-expanded', 'true');
    }
})();
