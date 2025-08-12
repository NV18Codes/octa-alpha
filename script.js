// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initThemeToggle();
    initCarousel();
    initMobileMenu();
    initSmoothScrolling();
    initScrollAnimations();
    initDropdowns();
    initHeaderScroll();
    initActiveNavigation();
    initScrollProgress();
    initScrollTriggeredEffects();
    initCookieConsent();
});

// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const icon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Add theme transition class
        document.body.classList.add('theme-transitioning');
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 300);
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#themeToggle i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Carousel functionality
function initCarousel() {
    const carouselContainer = document.querySelector('.carousel-container');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const indicators = document.querySelectorAll('.carousel-indicators .indicator');
    let currentIndex = 0;
    let intervalId;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            indicators[i].classList.remove('active');
        });

        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        currentIndex = index;
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
    }

    function startAutoSlide() {
        intervalId = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    function stopAutoSlide() {
        clearInterval(intervalId);
    }

    prevBtn.addEventListener('click', () => {
        stopAutoSlide();
        prevSlide();
        startAutoSlide();
    });

    nextBtn.addEventListener('click', () => {
        stopAutoSlide();
        nextSlide();
        startAutoSlide();
    });

    indicators.forEach(indicator => {
        indicator.addEventListener('click', (e) => {
            stopAutoSlide();
            const slideIndex = parseInt(e.target.dataset.slide);
            showSlide(slideIndex);
            startAutoSlide();
        });
    });

    showSlide(currentIndex);
    startAutoSlide();
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuBtn.querySelector('i').classList.toggle('fa-bars');
        mobileMenuBtn.querySelector('i').classList.toggle('fa-times');
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-list a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            }
        });
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

// Scroll progress bar
function initScrollProgress() {
    const scrollProgress = document.getElementById('scrollProgress');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        scrollProgress.style.width = scrollPercent + '%';
    });
}

// Scroll-triggered effects
function initScrollTriggeredEffects() {
    const sections = document.querySelectorAll('section');
    const cards = document.querySelectorAll('.capability-card, .news-card, .industry-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-in');
            }
        });
    }, observerOptions);
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-in');
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -100px 0px' });
    
    sections.forEach(section => sectionObserver.observe(section));
    cards.forEach(card => cardObserver.observe(card));
}

// Scroll animations using Intersection Observer
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.section-header, .hero-content, .contact-form, .contact-info');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(element => {
        element.classList.add('animate-on-scroll');
        observer.observe(element);
    });
}

// Dropdown menu functionality
function initDropdowns() {
    const navItemsWithDropdown = document.querySelectorAll('.nav-item.has-dropdown');

    navItemsWithDropdown.forEach(item => {
        const dropdownToggle = item.querySelector('.nav-link');
        const dropdownMenu = item.querySelector('.dropdown-menu');

        // For desktop: hover to open/close
        item.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) {
                dropdownMenu.classList.add('active');
            }
        });

        item.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768) {
                dropdownMenu.classList.remove('active');
            }
        });

        // For mobile: click to toggle
        dropdownToggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdownMenu.classList.toggle('active');
            }
        });
    });
}

// Header scroll effect with enhanced animations
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    let scrollDirection = 'down';

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Determine scroll direction
        if (currentScrollY > lastScrollY) {
            scrollDirection = 'down';
        } else {
            scrollDirection = 'up';
        }
        
        // Add scrolled class for enhanced effects
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header based on scroll direction
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }
        
        lastScrollY = currentScrollY;
    });
}

// Active navigation link highlighting
function initActiveNavigation() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-list .nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current) && current !== '') {
                link.classList.add('active');
            }
        });
    });
}

// Cookie Consent functions
function initCookieConsent() {
    const cookieConsent = document.getElementById('cookieConsent');
    if (!cookieConsent) return;
    
    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem('cookieConsent');
    if (cookieChoice) {
        cookieConsent.style.display = 'none';
    }
}

function acceptCookies() {
    document.getElementById('cookieConsent').style.display = 'none';
    localStorage.setItem('cookieConsent', 'accepted');
}

function declineCookies() {
    document.getElementById('cookieConsent').style.display = 'none';
    localStorage.setItem('cookieConsent', 'declined');
}

// Check cookie consent on load
if (localStorage.getItem('cookieConsent') === 'accepted') {
    document.getElementById('cookieConsent').style.display = 'none';
} else if (localStorage.getItem('cookieConsent') === 'declined') {
    document.getElementById('cookieConsent').style.display = 'none';
} else {
    document.getElementById('cookieConsent').style.display = 'block';
}

// Industries carousel functionality
function initIndustriesCarousel() {
    const carousel = document.querySelector('.industries-carousel');
    if (!carousel) return;
    
    // Add carousel controls if needed
    const controls = document.createElement('div');
    controls.className = 'carousel-controls';
    controls.innerHTML = `
        <button class="carousel-btn prev"><i class="fas fa-chevron-left"></i></button>
        <button class="carousel-btn next"><i class="fas fa-chevron-right"></i></button>
    `;
    carousel.appendChild(controls);
}

// Case studies carousel functionality
function initCaseStudiesCarousel() {
    const carousel = document.querySelector('.case-studies-carousel');
    if (!carousel) return;
    
    // Add carousel controls if needed
    const controls = document.createElement('div');
    controls.className = 'carousel-controls';
    controls.innerHTML = `
        <button class="carousel-btn prev"><i class="fas fa-chevron-left"></i></button>
        <button class="carousel-btn next"><i class="fas fa-chevron-right"></i></button>
    `;
    carousel.appendChild(controls);
}

// Explore section carousel functionality
function initExploreCarousel() {
    const carousel = document.querySelector('.explore-grid');
    if (!carousel) return;
    
    // Add carousel controls if needed
    const controls = document.createElement('div');
    controls.className = 'carousel-controls';
    controls.innerHTML = `
        <button class="carousel-btn prev"><i class="fas fa-chevron-left"></i></button>
        <button class="carousel-btn next"><i class="fas fa-chevron-right"></i></button>
    `;
    carousel.appendChild(controls);
}

// Loading states for buttons
function initButtonLoadingStates() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.type === 'submit') {
                const originalText = this.textContent;
                this.textContent = 'Loading...';
                this.disabled = true;
                
                // Simulate loading (remove in production)
                setTimeout(() => {
                    this.textContent = originalText;
                    this.disabled = false;
                }, 2000);
            }
        });
    });
}

// Parallax effect for hero section
function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    });
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Keyboard navigation support
function initKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Tab navigation
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
        
        // Escape key for modals and overlays
        if (e.key === 'Escape') {
            const activeOverlays = document.querySelectorAll('.search-overlay, .modal');
            activeOverlays.forEach(overlay => {
                if (overlay.style.display !== 'none') {
                    overlay.style.display = 'none';
                }
            });
        }
    });
    
    // Remove keyboard navigation class on mouse use
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
}

// Scroll event throttling
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(function() {
    // Scroll-based animations and effects
}, 16)); // 60fps

// Image error handling
function initImageErrorHandling() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'https://via.placeholder.com/400x300/cccccc/666666?text=Image+Not+Found';
            this.alt = 'Image not available';
        });
    });
}

// Skip link functionality
function initSkipLinks() {
    const skipLink = document.querySelector('.skip-main');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const mainContent = document.querySelector('main') || document.querySelector('.hero');
            if (mainContent) {
                mainContent.focus();
                mainContent.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// Initialize additional functionality
document.addEventListener('DOMContentLoaded', function() {
    initIndustriesCarousel();
    initCaseStudiesCarousel();
    initExploreCarousel();
    initButtonLoadingStates();
    initParallax();
    initLazyLoading();
    initKeyboardNavigation();
    initImageErrorHandling();
    initSkipLinks();
});
