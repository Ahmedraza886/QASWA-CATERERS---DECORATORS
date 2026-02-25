// ========================================
// MULTIPAGE WEBSITE - NAVIGATION & INTERACTIVITY
// ========================================

document.addEventListener('DOMContentLoaded', function () {

    // ===== ACTIVE NAV LINK =====
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // ===== MOBILE MENU TOGGLE =====
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    function openMenu() {
        navLinks.classList.add('active');
        menuToggle.classList.add('active');
    }

    function closeMenu() {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
    }

    function toggleMenu() {
        if (navLinks.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleMenu();
        });
    }

    // Close when clicking a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close when clicking outside
    document.addEventListener('click', function (e) {
        if (navLinks && navLinks.classList.contains('active')) {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                closeMenu();
            }
        }
    });

    // Close on resize to desktop
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) closeMenu();
    });

    // ===== NAVBAR SCROLL GRADIENT =====
    const header = document.querySelector('header');

    function updateNavbar() {
        if (!header) return;
        const scrollY = window.scrollY;
        const fadeStart = 80;
        const fadeEnd = 300;

        if (scrollY <= fadeStart) {
            // At top — fully solid black
            header.style.background = 'rgba(0,0,0,1)';
            header.style.boxShadow = 'none';
        } else if (scrollY >= fadeEnd) {
            // Fully transparent
            header.style.background = 'rgba(0,0,0,0)';
            header.style.boxShadow = 'none';
        } else {
            // Fading — interpolate opacity from 1 → 0
            const opacity = 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart);
            header.style.background = `rgba(0,0,0,${opacity.toFixed(3)})`;
            header.style.boxShadow = 'none';
        }
    }
    window.addEventListener('scroll', updateNavbar);
    updateNavbar();

    // ===== HERO SLIDER =====
    let currentSlide = 0;
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    const totalSlides = slides.length;

    function showSlide(n) {
        if (!totalSlides) return;
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        currentSlide = (n + totalSlides) % totalSlides;
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    if (totalSlides > 0) {
        showSlide(0);
        let interval = setInterval(() => showSlide(currentSlide + 1), 5000);
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                showSlide(i);
                clearInterval(interval);
                interval = setInterval(() => showSlide(currentSlide + 1), 5000);
            });
        });
    }

    // ===== CONTACT FORM =====
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = (this.querySelector('input[name="name"]') || {}).value?.trim() || '';
            const email = (this.querySelector('input[name="email"]') || {}).value?.trim() || '';
            const message = (this.querySelector('textarea[name="message"]') || {}).value?.trim() || '';
            if (name && email && message) {
                alert('Thank you, ' + name + '! We will get back to you at ' + email);
                this.reset();
            } else {
                alert('Please fill in all required fields.');
            }
        });
    }

    // ===== SCROLL ANIMATIONS =====
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.service-card, .menu-category, .package-card, .testimonial-card, .reason-card, .feature').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ===== BACK TO TOP =====
    let btn = document.querySelector('.back-to-top');
    if (!btn) {
        btn = document.createElement('button');
        btn.className = 'back-to-top';
        btn.innerHTML = '↑';
        btn.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(btn);
    }
    window.addEventListener('scroll', () => btn.classList.toggle('visible', window.pageYOffset > 300));
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href*="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const id = href.substring(href.indexOf('#') + 1);
            const target = document.getElementById(id);
            if (target) {
                e.preventDefault();
                window.scrollTo({ top: target.offsetTop - header.offsetHeight, behavior: 'smooth' });
            }
        });
    });

    if (window.location.hash) {
        setTimeout(() => {
            const target = document.getElementById(window.location.hash.substring(1));
            if (target) window.scrollTo({ top: target.offsetTop - header.offsetHeight, behavior: 'smooth' });
        }, 100);
    }

    // ===== PAGE FADE-IN =====
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.3s ease';
    }, 50);
});

window.addEventListener('beforeunload', () => document.body.style.opacity = '0.7');
window.addEventListener('load', () => document.body.style.opacity = '1');