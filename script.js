// ========================================
// MULTIPAGE WEBSITE - NAVIGATION & INTERACTIVITY
// ========================================

document.addEventListener('DOMContentLoaded', function () {
    
    // ===== HIGHLIGHT ACTIVE NAV LINK =====
    // Update active nav link based on current page
    
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            
            // Check if link matches current page
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Set active link on page load
    setActiveNavLink();
    
    // ===== MOBILE MENU TOGGLE =====
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function () {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks) {
                navLinks.classList.remove('active');
            }
            if (menuToggle) {
                menuToggle.classList.remove('active');
            }
            
            // Close any open dropdown
            document.querySelectorAll('.nav-item.has-dropdown').forEach(item => {
                item.classList.remove('mobile-open');
            });
        });
    });
    
    // ===== MOBILE DROPDOWN MENU =====
    const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');
    
    dropdownItems.forEach(item => {
        const link = item.querySelector('a');
        
        if (link) {
            link.addEventListener('click', function (e) {
                // On mobile, toggle dropdown instead of navigating
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    item.classList.toggle('mobile-open');
                }
            });
        }
    });
    
    function closeAllMenus() {
        if (navLinks) {
            navLinks.classList.remove('active');
        }
        if (menuToggle) {
            menuToggle.classList.remove('active');
        }
        document.querySelectorAll('.nav-item.has-dropdown').forEach(item => {
            item.classList.remove('mobile-open');
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
        if (!e.target.closest('nav')) {
            closeAllMenus();
        }
    });
    
    // ===== HERO SLIDER (on home page) =====
    let currentSlide = 0;
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    const totalSlides = slides.length;
    
    function showSlide(n) {
        if (slides.length === 0) return;
        
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Calculate slide index with wraparound
        currentSlide = (n + totalSlides) % totalSlides;
        
        // Add active class to current slide and dot
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) {
            dots[currentSlide].classList.add('active');
        }
    }
    
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    // Auto-advance slides every 5 seconds (only if slides exist)
    if (slides.length > 0) {
        setInterval(nextSlide, 5000);
    }
    
    // Handle dot clicks
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });
    
    // ===== HEADER SCROLL EFFECT =====
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function () {
        if (header) {
            if (window.scrollY > 100) {
                header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.15)';
            } else {
                header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            }
        }
    });
    
    // ===== CONTACT FORM HANDLING =====
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            
            // Get form inputs
            const nameInput = this.querySelector('input[name="name"]');
            const emailInput = this.querySelector('input[name="email"]');
            const messageInput = this.querySelector('textarea[name="message"]');
            
            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';
            
            // Validate and show message
            if (name && email && message) {
                alert('Thank you for your message, ' + name + '! We will get back to you soon at ' + email);
                this.reset();
            } else {
                alert('Please fill in all required fields.');
            }
        });
    }
    
    // ===== SCROLL ANIMATIONS =====
    // Animate elements as they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Apply observer to animatable elements
    const animatedElements = document.querySelectorAll(
        '.service-card, .menu-category, .package-card, .testimonial-card, .reason-card, .feature'
    );
    
    animatedElements.forEach(function (element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
    
    // ===== BACK TO TOP BUTTON =====
    // Create back to top button dynamically
    let backToTopBtn = document.querySelector('.back-to-top');
    
    if (!backToTopBtn) {
        backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '↑';
        backToTopBtn.setAttribute('aria-label', 'Back to top');
        backToTopBtn.setAttribute('title', 'Back to top');
        document.body.appendChild(backToTopBtn);
    }
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ===== SMOOTH SCROLL TO SECTION ANCHOR =====
    // Handle anchor links (e.g., services.html#wedding)
    document.querySelectorAll('a[href*="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const hashIndex = href.indexOf('#');
            
            // If hash exists and we're on the same page
            if (hashIndex !== -1) {
                const hash = href.substring(hashIndex);
                const targetId = hash.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Handle anchor on page load (e.g., page loads with #wedding)
    if (window.location.hash) {
        setTimeout(() => {
            const targetId = window.location.hash.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }
    
    // ===== ADAPTIVE HEADER TEXT =====
    // Adjust header visibility on small screens
    function handleWindowResize() {
        const screenWidth = window.innerWidth;
        
        // Close mobile menu on large screens
        if (screenWidth > 768) {
            closeAllMenus();
        }
    }
    
    window.addEventListener('resize', handleWindowResize);
    
    // ===== PAGE FADE-IN ANIMATION =====
    // Fade in the page on first load
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.3s ease';
    }, 50);
});

// ===== PAGE LOADING INDICATOR =====
// Show loading state during page transitions
window.addEventListener('beforeunload', function() {
    document.body.style.opacity = '0.7';
});

window.addEventListener('load', function() {
    document.body.style.opacity = '1';
});
// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// Header shadow on scroll - DISABLED
// const header = document.querySelector('header');
// window.addEventListener('scroll', () => {
//     if (window.scrollY > 100) {
//         header.classList.add('scrolled');
//     } else {
//         header.classList.remove('scrolled');
//     }
// });

// Hero Slider
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;

function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = (n + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

// Auto-advance slides
let slideInterval = setInterval(nextSlide, 5000);

// Dot navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    });
});

// Initialize first slide
showSlide(0);

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});


