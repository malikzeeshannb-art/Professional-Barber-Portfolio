/* ============================================
   MALIK SUFYAN BARBER PORTFOLIO - VANILLA JS
   ============================================ */

/* ============================================
   INITIALIZATION & DOM READY
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    initializeAllFeatures();
    fixHeroButtonsSize();
});

/* ============================================
   1. MOBILE NAVIGATION TOGGLE
   ============================================ */
function initializeMobileNavigation() {
    const header = document.querySelector('header');
    const headerContainer = document.querySelector('.header-container');
    const navList = document.querySelector('.nav-list');

    if (!header || !headerContainer || !navList) return;

    let overlay = document.querySelector('.mobile-menu-overlay');

    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'mobile-menu-overlay';
        header.appendChild(overlay);
    }

    const closeMobileMenu = () => {
        navList.classList.remove('mobile-open');

        const toggle = document.querySelector('.mobile-menu-toggle');
        if (toggle) toggle.classList.remove('active');

        overlay.classList.remove('is-visible');
        document.body.classList.remove('menu-lock');
        document.body.style.overflow = '';
    };

    const openMobileMenu = () => {
        navList.classList.add('mobile-open');

        const toggle = document.querySelector('.mobile-menu-toggle');
        if (toggle) toggle.classList.add('active');

        overlay.classList.add('is-visible');
        document.body.classList.add('menu-lock');
        document.body.style.overflow = 'hidden';
    };

    const ensureCloseButton = () => {
        if (navList.querySelector('.mobile-menu-close')) return;

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'mobile-menu-close';
        closeBtn.setAttribute('aria-label', 'Close navigation menu');
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', closeMobileMenu);

        navList.prepend(closeBtn);
    };

    const createMobileMenuButton = () => {
        if (document.querySelector('.mobile-menu-toggle')) return;

        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'mobile-menu-toggle';
        toggle.setAttribute('aria-label', 'Toggle navigation menu');
        toggle.innerHTML = '<span></span><span></span><span></span>';

        headerContainer.appendChild(toggle);

        toggle.addEventListener('click', function () {
            if (navList.classList.contains('mobile-open')) {
                closeMobileMenu();
            } else {
                ensureCloseButton();
                openMobileMenu();
            }
        });
    };

    const removeMobileMenuButton = () => {
        const toggle = document.querySelector('.mobile-menu-toggle');
        if (toggle) toggle.remove();

        const closeBtn = navList.querySelector('.mobile-menu-close');
        if (closeBtn) closeBtn.remove();
    };

    if (window.innerWidth <= 768) {
        createMobileMenuButton();
        ensureCloseButton();
    } else {
        removeMobileMenuButton();
        closeMobileMenu();
    }

    window.addEventListener('resize', function () {
        if (window.innerWidth <= 768) {
            createMobileMenuButton();
        } else {
            removeMobileMenuButton();
            closeMobileMenu();
        }
    });

    document.addEventListener('click', function (e) {
        const navLink = e.target.closest('.nav-link');
        if (navLink && navList.classList.contains('mobile-open')) {
            closeMobileMenu();
        }

        if (e.target === overlay && navList.classList.contains('mobile-open')) {
            closeMobileMenu();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navList.classList.contains('mobile-open')) {
            closeMobileMenu();
        }
    });
}

/* ============================================
   2. STICKY HEADER BEHAVIOR
   ============================================ */

function initializeStickyHeader() {
    const header = document.querySelector('header');
    if (!header) return;

    window.addEventListener('scroll', function() {
        const scrollTop = window.scrollY;
        const threshold = 50;

        if (scrollTop > threshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* ============================================
   3. SMOOTH SCROLLING FOR ANCHOR LINKS
   ============================================ */

document.addEventListener('click', function(e) {
    const link = e.target.closest('a');

    if (!link) return;

    const href = link.getAttribute('href');

    // Check if it's an internal anchor link
    if (href && href.startsWith('#') && href.length > 1) {
        e.preventDefault();

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            const headerHeight = document.querySelector('header')?.offsetHeight || 70;
            const targetPosition = targetElement.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
});

/* ============================================
   4. ACTIVE NAVIGATION HIGHLIGHT
   ============================================ */

function initializeActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length === 0 || navLinks.length === 0) return;

    function updateActiveLink() {
        let currentSection = '';
        const headerHeight = document.querySelector('header')?.offsetHeight || 70;
        const scrollPosition = window.scrollY + headerHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        // Update active state
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href === `#${currentSection}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);
    window.addEventListener('resize', updateActiveLink);

    // Initial call
    updateActiveLink();
}

/* ============================================
   5. SCROLL REVEAL ANIMATIONS
   ============================================ */

function initializeScrollReveal() {
    const revealElements = document.querySelectorAll(
        'section, .service-card, .testimonial-card, .trust-item, .detail-box, .faq-item, .gallery-item'
    );

    if (revealElements.length === 0) return;

    // Add reveal class to elements
    revealElements.forEach(el => {
        el.classList.add('reveal-element');
    });

    // Use IntersectionObserver for efficient scroll detection
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        observer.observe(el);
    });
}

/* ============================================
   6. FAQ ACCORDION INTERACTION
   ============================================ */

function initializeFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    if (faqItems.length === 0) return;

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        if (!question) return;

        question.style.cursor = 'pointer';

        question.addEventListener('click', function() {
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('faq-open')) {
                    otherItem.classList.remove('faq-open');
                }
            });

            // Toggle current item
            item.classList.toggle('faq-open');
        });
    });
}

/* ============================================
   7. TYPEWRITER ANIMATION
   ============================================ */

function initializeTypewriter() {
    const typewriterElement = document.querySelector('.typewriter');
    const cursorElement = document.querySelector('.cursor');

    if (!typewriterElement || !cursorElement) return;

    const roles = [
        'Clean Cuts & Sharp Style',
        'Fade & Grooming Specialist',
        'Precision Style Expert'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseBeforeDelete = 2000;
    const pauseBeforeNext = 500;

    function type() {
        const currentRole = roles[roleIndex];
        const displayText = currentRole.substring(0, charIndex);

        typewriterElement.textContent = displayText;

        if (!isDeleting && charIndex < currentRole.length) {
            // Typing
            charIndex++;
            typingSpeed = 100;
            setTimeout(type, typingSpeed);
        } else if (!isDeleting && charIndex === currentRole.length) {
            // Pause before delete
            isDeleting = true;
            setTimeout(type, pauseBeforeDelete);
        } else if (isDeleting && charIndex > 0) {
            // Deleting
            charIndex--;
            typingSpeed = deletingSpeed;
            setTimeout(type, typingSpeed);
        } else if (isDeleting && charIndex === 0) {
            // Move to next role
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(type, pauseBeforeNext);
        }
    }

    // Start typewriter animation
    type();
}

/* ============================================
   8. SOCIAL LINKS INTEGRATION
   ============================================ */

function initializeSocialLinks() {
    const socialLinks = document.querySelectorAll(
        '.social-icon, .social-link, .header-social a, .footer-social a'
    );

    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Track social link clicks
            trackEvent('social_link_click', {
                platform: determinePlatform(href),
                source: this.closest('.header-social') ? 'header' : 
                        this.closest('.footer-social') ? 'footer' : 'other',
                timestamp: new Date()
            });

            // Open WhatsApp links in new tab
            if (href && href.includes('wa.me')) {
                e.preventDefault();
                window.open(href, '_blank', 'noopener,noreferrer');
            }
        });

        // Keyboard accessibility
        if (link.tagName === 'A') {
            link.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        }
    });
}

function determinePlatform(url) {
    if (url.includes('wa.me')) return 'whatsapp';
    if (url.includes('instagram')) return 'instagram';
    if (url.includes('linkedin')) return 'linkedin';
    if (url.includes('facebook')) return 'facebook';
    return 'unknown';
}

/* ============================================
   9. FLOATING WHATSAPP BUTTON
   ============================================ */
function initializeFloatingWhatsAppButton() {
    const floatingBtn = document.querySelector('.floating-whatsapp-btn');
    const floatingContainer = document.querySelector('.floating-whatsapp-container');

    // If elements don't exist on the page, stop running to prevent errors
    if (!floatingBtn || !floatingContainer) return;

    // Show/hide on scroll
    window.addEventListener('scroll', () => {
        const scrollThreshold = 300;
        
        // If we scrolled past 300px, add the visible class. Otherwise, remove it.
        if (window.scrollY > scrollThreshold) {
            floatingContainer.classList.add('is-visible');
        } else {
            floatingContainer.classList.remove('is-visible');
        }
    });
}

/* ============================================
   10. WHATSAPP BOOKING INTEGRATION
   ============================================ */

function initializeWhatsAppButtons() {
    const whatsappButtons = document.querySelectorAll('[href*="wa.me"]');

    whatsappButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Ensure it opens in a new tab
            this.setAttribute('target', '_blank');
            this.setAttribute('rel', 'noopener noreferrer');
        });
    });

    // Verify WhatsApp links have the correct message
    const expectedMessage = "Hi, I'd like to book an appointment. Please share available time slots.";
    const encodedMessage = encodeURIComponent(expectedMessage);

    whatsappButtons.forEach(button => {
        let href = button.getAttribute('href');

        // Check if the button already has the correct message
        if (href && !href.includes(encodedMessage)) {
            // Update the href to include the correct message
            const phoneNumber = '923430105129';
            href = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
            button.setAttribute('href', href);
        }
    });
}

/* ============================================
   11. EVENT TRACKING UTILITY
   ============================================ */

function trackEvent(eventName, eventData = {}) {
    const trackingData = {
        event: eventName,
        ...eventData,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        page: window.location.pathname
    };

    // Log to console in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('📊 Event:', trackingData);
    }
}

/* ============================================
   12. HERO BUTTONS - PREVENT RESIZING
   ============================================ */

function fixHeroButtonsSize() {
    const buttons = document.querySelectorAll('.btn-fixed');
    
    buttons.forEach(button => {
        button.style.minWidth = '180px';
        button.style.maxWidth = '180px';
        button.style.width = '180px';
        button.style.flexShrink = '0';
    });
}

// Re-apply on resize
window.addEventListener('resize', function() {
    fixHeroButtonsSize();
});

/* ============================================
   13. PERFORMANCE OPTIMIZATION - PREVENT MULTIPLE INITIALIZATIONS
   ============================================ */

let featuresInitialized = false;

function initializeAllFeatures() {
    if (featuresInitialized) return;
    
    featuresInitialized = true;

    initializeMobileNavigation();
    initializeStickyHeader();
    initializeActiveNavHighlight();
    initializeScrollReveal();
    initializeFAQAccordion();
    initializeWhatsAppButtons();
    initializeTypewriter();
    initializeSocialLinks();
    initializeFloatingWhatsAppButton();
}

/* ============================================
   END OF SCRIPT
   ============================================ */
