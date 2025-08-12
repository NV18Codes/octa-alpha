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

// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu elements
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const body = document.body;

    // Dropdown toggles
    const dropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');

    // Mobile menu open function
    function openMobileMenu() {
        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        body.style.overflow = 'hidden';
        mobileMenuBtn.classList.add('active');
        
        // Add loading state briefly for smooth animation
        mobileMenu.classList.add('loading');
        setTimeout(() => {
            mobileMenu.classList.remove('loading');
        }, 100);
    }

    // Mobile menu close function
    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        body.style.overflow = '';
        mobileMenuBtn.classList.remove('active');
        
        // Close all dropdowns when closing menu
        dropdownToggles.forEach(toggle => {
            const dropdown = toggle.nextElementSibling;
            if (dropdown && dropdown.classList.contains('mobile-dropdown-menu')) {
                dropdown.classList.remove('active');
                toggle.classList.remove('active');
            }
        });
    }

    // Event listeners for mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', openMobileMenu);
    }

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }

    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }

    // Close mobile menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Dropdown toggle functionality
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const dropdown = this.nextElementSibling;
            const isActive = dropdown.classList.contains('active');
            
            // Close all other dropdowns
            dropdownToggles.forEach(otherToggle => {
                if (otherToggle !== toggle) {
                    const otherDropdown = otherToggle.nextElementSibling;
                    if (otherDropdown && otherDropdown.classList.contains('mobile-dropdown-menu')) {
                        otherDropdown.classList.remove('active');
                        otherToggle.classList.remove('active');
                    }
                }
            });
            
            // Toggle current dropdown
            if (dropdown && dropdown.classList.contains('mobile-dropdown-menu')) {
                dropdown.classList.toggle('active');
                toggle.classList.toggle('active');
            }
        });
    });

    // Close mobile menu when clicking on a link (for single page navigation)
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-dropdown-menu a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Don't close if it's a dropdown toggle
            if (!this.classList.contains('mobile-dropdown-toggle')) {
                closeMobileMenu();
            }
        });
    });

    // Responsive behavior
    function handleResize() {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    }

    // Listen for window resize
    window.addEventListener('resize', handleResize);

    // Touch gesture support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
    }

    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;
        
        // Swipe right to open menu (only if menu is closed)
        if (swipeDistance > swipeThreshold && !mobileMenu.classList.contains('active')) {
            openMobileMenu();
        }
        // Swipe left to close menu (only if menu is open)
        else if (swipeDistance < -swipeThreshold && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    }

    // Add touch event listeners
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchend', handleTouchEnd, false);

    // Prevent body scroll when mobile menu is open
    mobileMenu.addEventListener('touchmove', function(e) {
        if (mobileMenu.classList.contains('active')) {
            e.preventDefault();
        }
    }, { passive: false });

    // Enhanced accessibility
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        e.preventDefault();
                        lastFocusableElement.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        e.preventDefault();
                        firstFocusableElement.focus();
                    }
                }
            }
        });
    }

    // Apply focus trap to mobile menu
    if (mobileMenu) {
        trapFocus(mobileMenu);
    }

    // Auto-close mobile menu on orientation change
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            if (window.innerWidth > 768) {
                closeMobileMenu();
            }
        }, 500);
    });

    // Performance optimization: Debounce resize events
    let resizeTimeout;
    function debouncedResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 250);
    }

    window.addEventListener('resize', debouncedResize);

    // Add smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mobileMenu.classList.contains('active')) {
                    closeMobileMenu();
                }
            }
        });
    });

    // Add loading states for better UX
    function addLoadingState(element) {
        element.classList.add('loading');
        setTimeout(() => {
            element.classList.remove('loading');
        }, 1000);
    }

    // Enhanced mobile menu button states
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        mobileMenuBtn.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1)';
        });
        
        mobileMenuBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }

    // Add ripple effect to mobile menu items
    function createRipple(event) {
        const ripple = document.createElement('span');
        const rect = event.currentTarget.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        event.currentTarget.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Add ripple effect to mobile menu items
    const mobileMenuItems = document.querySelectorAll('.mobile-nav-link, .mobile-dropdown-toggle');
    mobileMenuItems.forEach(item => {
        item.addEventListener('click', createRipple);
    });

    // Initialize mobile menu state
    function initMobileMenu() {
        if (window.innerWidth <= 768) {
            mobileMenuBtn.style.display = 'flex';
        } else {
            mobileMenuBtn.style.display = 'none';
        }
    }

    // Call initialization
    initMobileMenu();
});

// Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.carousel-slide');
    const indicators = carousel.querySelectorAll('.indicator');
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    
    let currentSlide = 0;
    let interval;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
        
        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }

    function startAutoPlay() {
        interval = setInterval(nextSlide, 5000);
    }

    function stopAutoPlay() {
        clearInterval(interval);
    }

    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => showSlide(index));
    });

    // Auto-play with pause on hover
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);

    // Touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
    });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;
        
        if (swipeDistance > swipeThreshold) {
            prevSlide();
        } else if (swipeDistance < -swipeThreshold) {
            nextSlide();
        }
        
        startAutoPlay();
    });

    // Start auto-play
    startAutoPlay();
});

// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    if (!themeToggle) return;

    // Check for saved theme preference or default to light
    const currentTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', currentTheme);
    
    // Update toggle button icon
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', function() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Add transition class
        html.classList.add('theme-transitioning');
        
        // Update theme
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update icon
        updateThemeIcon(newTheme);
        
        // Remove transition class after animation
        setTimeout(() => {
            html.classList.remove('theme-transitioning');
        }, 300);
    });

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
});

// Scroll Progress Bar
document.addEventListener('DOMContentLoaded', function() {
    const scrollProgress = document.getElementById('scrollProgress');
    if (!scrollProgress) return;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        scrollProgress.style.width = scrollPercent + '%';
    });
});

// Header Scroll Effects
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});

// Scroll-triggered Animations
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-in');
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.capability-card, .news-card, .industry-card');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
});

// Cookie Consent
function acceptCookies() {
    const cookieConsent = document.getElementById('cookieConsent');
    if (cookieConsent) {
        cookieConsent.style.display = 'none';
        localStorage.setItem('cookiesAccepted', 'true');
    }
}

function declineCookies() {
    const cookieConsent = document.getElementById('cookieConsent');
    if (cookieConsent) {
        cookieConsent.style.display = 'none';
        localStorage.setItem('cookiesAccepted', 'false');
    }
}

// Check cookie consent on page load
document.addEventListener('DOMContentLoaded', function() {
    const cookieConsent = document.getElementById('cookieConsent');
    if (cookieConsent) {
        const cookiesAccepted = localStorage.getItem('cookiesAccepted');
        if (cookiesAccepted === 'true' || cookiesAccepted === 'false') {
            cookieConsent.style.display = 'none';
        }
    }
});

// Form Submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Add loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            submitBtn.textContent = 'Message Sent!';
            submitBtn.style.background = 'var(--accent-color)';
            
            // Reset form
            this.reset();
            
            // Reset button after delay
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 3000);
        }, 2000);
    });
});

// Add CSS for ripple effect
const rippleCSS = `
.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(0, 102, 204, 0.3);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

// Inject ripple CSS
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

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
