/**
 * FlowerBTC Main Entry Point
 * @description Application bootstrap and module initialization
 * @version 2.0.0
 */

import { app } from './core/App.js';
import { PerformanceMonitor } from './core/PerformanceMonitor.js';
import { SilkBackground } from './modules/SilkBackground.js';
import { DockNavigation } from './modules/DockNavigation.js';
import { GrowthCarousel } from './modules/GrowthCarousel.js';

/**
 * Initialize all modules when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Register performance monitor
    const perfMonitor = new PerformanceMonitor();
    app.registerModule('performance', perfMonitor);

    // Initialize Silk Background (singleton)
    const silkContainer = document.getElementById('silk-background');
    if (silkContainer && typeof THREE !== 'undefined') {
        const silkBackground = SilkBackground.getInstance(silkContainer, {
            color: '#7B7481',
            speed: 5,
            scale: 1,
            noiseIntensity: 1.5
        });
        app.registerModule('silkBackground', silkBackground);
    }

    // Initialize Dock Navigation
    const dockNav = new DockNavigation({
        showDelay: 4500,
        maxScale: 1.4,
        maxDistance: 150
    });
    app.registerModule('dockNavigation', dockNav);

    // Initialize Growth Carousel if present
    const growthMarquee = document.getElementById('growthMarquee');
    const growthTrack = document.getElementById('growthTrack');
    if (growthMarquee && growthTrack) {
        const growthCarousel = new GrowthCarousel(growthMarquee, {
            folder: 'sunflower-levels',
            count: 10,
            speedPxPerSec: 80,
            resumeDelayMs: 200
        });
        app.registerModule('growthCarousel', growthCarousel);
    }

    // Initialize loading screen
    initLoadingScreen();

    // Initialize scroll animations
    initScrollAnimations();

    // Initialize navigation dots
    initNavigationDots();

    // Initialize custom cursor (desktop only)
    initCustomCursor();

    // Initialize community counter
    initCommunityCounter();

    // Initialize particles if present
    initParticles();

    // Initialize legal modals
    initLegalModals();

    // Announce page load for screen readers
    app.accessibility.announce('FlowerBTC page loaded successfully');

    app._log('All modules initialized');
});

/**
 * Initialize loading screen
 */
function initLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (!loadingScreen) return;

    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1000);
    });
}

/**
 * Initialize scroll-triggered animations
 */
function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    document.querySelectorAll('.eco-card, .stat-card, .mechanic-card, .social-link').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

/**
 * Initialize navigation dots
 */
function initNavigationDots() {
    const dots = document.querySelectorAll('.nav-dots .dot');
    const sections = document.querySelectorAll('section[id]');

    if (!dots.length || !sections.length) return;

    // Click handlers
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const targetId = dot.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Update active dot on scroll
    const updateActiveDot = () => {
        const scrollPosition = window.scrollY + window.innerHeight / 2;

        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                dots.forEach(d => d.classList.remove('active'));
                if (dots[index]) {
                    dots[index].classList.add('active');
                }
            }
        });
    };

    const perfMonitor = app.getModule('performance');
    const throttledUpdate = perfMonitor 
        ? perfMonitor.throttle(updateActiveDot, 100)
        : updateActiveDot;

    window.addEventListener('scroll', throttledUpdate, { passive: true });
}

/**
 * Initialize custom cursor (desktop only)
 */
function initCustomCursor() {
    // Skip on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, { passive: true });

    // Smooth cursor animation
    const animateCursor = () => {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        
        requestAnimationFrame(animateCursor);
    };
    
    animateCursor();

    // Hover effects
    document.querySelectorAll('a, button, .interactive').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

/**
 * Initialize community member counter
 */
function initCommunityCounter() {
    const counter = document.getElementById('memberCount');
    if (!counter) return;

    const target = 5000;
    let current = 0;
    const duration = 2000;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        current = Math.floor(easeOutQuart * target);
        
        counter.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    };

    // Start when element is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                requestAnimationFrame(updateCounter);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(counter);
}

/**
 * Initialize particles.js if present
 */
function initParticles() {
    const particlesContainer = document.getElementById('particles-js');
    if (!particlesContainer || typeof particlesJS === 'undefined') return;

    particlesJS('particles-js', {
        particles: {
            number: { value: 60, density: { enable: true, value_area: 800 } },
            color: { value: '#ffffff' },
            shape: { type: 'circle' },
            opacity: { value: 0.3, random: true },
            size: { value: 2, random: true },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#ffffff',
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 1,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out'
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: { enable: true, mode: 'grab' },
                onclick: { enable: true, mode: 'push' },
                resize: true
            },
            modes: {
                grab: { distance: 140, line_linked: { opacity: 0.5 } },
                push: { particles_nb: 3 }
            }
        },
        retina_detect: true
    });
}

/**
 * Initialize legal modals
 */
function initLegalModals() {
    // Expose global functions for onclick handlers
    window.openLegalModal = (type) => {
        const modal = document.getElementById(`${type}Modal`);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Trap focus
            app.accessibility.trapFocus(modal);
        }
    };

    window.closeLegalModal = (type) => {
        const modal = document.getElementById(`${type}Modal`);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    };

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('legal-modal')) {
            e.target.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.legal-modal').forEach(modal => {
                modal.style.display = 'none';
            });
            document.body.style.overflow = '';
        }
    });
}

// Expose app for debugging (development only)
if (process?.env?.NODE_ENV === 'development') {
    window.FlowerBTC = { app };
}
