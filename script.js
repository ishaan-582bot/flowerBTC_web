// Initialize GSAP ScrollTrigger and ScrollToPlugin
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// DOM Elements (defensive)
const cursor = document.querySelector('.custom-cursor');
const loadingScreen = document.querySelector('.loading-screen');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const sections = document.querySelectorAll('section');
const dots = document.querySelectorAll('.dot');
const horizontalSections = document.querySelectorAll('.horizontal-scroll .section');
const verticalSections = document.querySelectorAll('.vertical-scroll .section');
const videoBackground = document.querySelector('.video-background');
const particlesContainer = document.getElementById('particles-js');
const memberCount = document.getElementById('member-count');

// Community Counter
let currentCount = 1;
const maxCount = 1000000000; // 1 billion
const countInterval = 10000; // 10 seconds

function updateMemberCount() {
    if (!memberCount) return;
    if (currentCount <= maxCount) {
        memberCount.textContent = currentCount.toLocaleString();
        currentCount++;
        setTimeout(updateMemberCount, countInterval);
    }
}

// Cursor tracking for parallax effect
let mouseX = 0;
let mouseY = 0;
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

// Track mouse movement for parallax
document.addEventListener('mousemove', (e) => {
    // Update cursor position
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
    
    // Calculate mouse position relative to center of screen
    mouseX = e.clientX - windowWidth / 2;
    mouseY = e.clientY - windowHeight / 2;
    
    // Apply parallax effect directly
    if (videoBackground) {
        videoBackground.style.transform = `translate(${mouseX * 0.05}px, ${mouseY * 0.05}px)`;
    }
    
    if (particlesContainer) {
        particlesContainer.style.transform = `translate(${mouseX * -0.03}px, ${mouseY * -0.03}px)`;
    }
});

// Update on window resize
window.addEventListener('resize', () => {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
});

// Custom Cursor
document.addEventListener('mousedown', () => cursor && cursor.classList.add('active'));
document.addEventListener('mouseup', () => cursor && cursor.classList.remove('active'));

document.querySelectorAll('a, button, .interactive').forEach(element => {
    element.addEventListener('mouseenter', () => cursor && cursor.classList.add('hover'));
    element.addEventListener('mouseleave', () => cursor && cursor.classList.remove('hover'));
});

// Loading Screen
window.addEventListener('load', () => {
    setTimeout(() => {
        if (loadingScreen) loadingScreen.style.opacity = '0';
        setTimeout(() => {
            if (loadingScreen) loadingScreen.style.display = 'none';
            updateMemberCount(); // Start the counter after loading screen
        }, 500);
    }, 1000);
});

// Mobile Navigation
if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Function to scroll to a specific section
function scrollToSection(index) {
    const targetSection = sections[index];
    if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Update active states based on scroll position
function updateActiveStates() {
    const scrollPosition = window.scrollY;
    
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            // Update navigation links
            const navAnchors = document.querySelectorAll('.nav-links a');
            navAnchors.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${section.id}`) {
                    link.classList.add('active');
                }
            });
            
            // Update navigation dots
            document.querySelectorAll('.dot').forEach(dot => {
                dot.classList.remove('active');
                if (dot.getAttribute('data-target') === section.id) {
                    dot.classList.add('active');
                }
            });
        }
    });
}

// Scroll event listener to update active states
window.addEventListener('scroll', () => {
    updateActiveStates();
});

// Initial active state
updateActiveStates();

// 3D Coin Animation (defensive)
const coinCanvas = document.getElementById('coin-canvas');
let scene, camera, renderer, coin;
if (coinCanvas && window.THREE) {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 400 / 400, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ 
        canvas: coinCanvas,
        alpha: true,
        antialias: true 
    });
    renderer.setSize(400, 400);
    renderer.setPixelRatio(window.devicePixelRatio);

// Coin Geometry
    const coinGeometry = new THREE.CylinderGeometry(1, 1, 0.1, 64);
    const textureLoader = new THREE.TextureLoader();

// Load textures
    const coinFrontTexture = textureLoader.load('coin-front.png');
    const coinBackTexture = textureLoader.load('coin-back.png');
    const coinEdgeTexture = textureLoader.load('coin-edge.png');

// Materials
    const frontMaterial = new THREE.MeshStandardMaterial({
        map: coinFrontTexture,
        metalness: 0.8,
        roughness: 0.2,
        emissive: new THREE.Color(0x00ff9d),
        emissiveIntensity: 0.2
    });

    const backMaterial = new THREE.MeshStandardMaterial({
        map: coinBackTexture,
        metalness: 0.8,
        roughness: 0.2,
        emissive: new THREE.Color(0x00ff9d),
        emissiveIntensity: 0.2
    });

    const edgeMaterial = new THREE.MeshStandardMaterial({
        map: coinEdgeTexture,
        metalness: 0.8,
        roughness: 0.3
    });

    const materials = [edgeMaterial, frontMaterial, backMaterial];
    coin = new THREE.Mesh(coinGeometry, materials);
    scene.add(coin);

// Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const frontLight = new THREE.DirectionalLight(0x00ff9d, 1);
    frontLight.position.set(5, 5, 5);
    scene.add(frontLight);

    const backLight = new THREE.DirectionalLight(0x00b4ff, 1);
    backLight.position.set(-5, -5, -5);
    scene.add(backLight);

    camera.position.z = 2.5;
    camera.position.y = 0.5;

// Mouse interaction
let targetRotationX = 0;
let targetRotationY = 0;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let rotationSpeed = { x: 0, y: 0 };
const deceleration = 0.95;
const maxSpeed = 0.1;

    coinCanvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = {
        x: e.clientX,
        y: e.clientY
    };
    });

    document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y
    };

    rotationSpeed.x = deltaMove.y * 0.01;
    rotationSpeed.y = deltaMove.x * 0.01;

    previousMousePosition = {
        x: e.clientX,
        y: e.clientY
    };
    });

    document.addEventListener('mouseup', () => {
    isDragging = false;
    });

// Touch events for mobile
    coinCanvas.addEventListener('touchstart', (e) => {
    isDragging = true;
    previousMousePosition = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
    };
    });

    document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;

    const deltaMove = {
        x: e.touches[0].clientX - previousMousePosition.x,
        y: e.touches[0].clientY - previousMousePosition.y
    };

    rotationSpeed.x = deltaMove.y * 0.01;
    rotationSpeed.y = deltaMove.x * 0.01;

    previousMousePosition = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
    };
    });

    document.addEventListener('touchend', () => {
    isDragging = false;
    });

// Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        // Apply rotation speed
        coin.rotation.x += rotationSpeed.x;
        coin.rotation.y += rotationSpeed.y;

        // Decelerate rotation
        rotationSpeed.x *= deceleration;
        rotationSpeed.y *= deceleration;

        // Add slight bounce effect
        coin.position.y = Math.sin(Date.now() * 0.001) * 0.1;

        renderer.render(scene, camera);
    }

    animate();
}

// Resize handling
window.addEventListener('resize', () => {
    if (!scene || !camera || !renderer) return;
    const container = document.querySelector('.coin-left');
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
});

// Particles Background
if (window.particlesJS && document.getElementById('particles-js')) particlesJS('particles-js', {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: '#ffffff' },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: false },
        size: { value: 3, random: true },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#ffffff',
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false,
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: { enable: true, mode: 'repulse' },
            onclick: { enable: true, mode: 'push' },
            resize: true
        },
        modes: {
            repulse: { distance: 100, duration: 0.4 },
            push: { particles_nb: 4 }
        }
    },
    retina_detect: true
});

// Floating Elements Animation
const floatingElements = document.querySelector('.floating-elements');
const emojis = ['🌻', '🌱', '🪙', '💰', '🌿', '🍃'];
const numEmojis = 20;

if (floatingElements) {
    for (let i = 0; i < numEmojis; i++) {
        const emoji = document.createElement('span');
        emoji.className = 'float-item';
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.left = Math.random() * 100 + '%';
        emoji.style.top = Math.random() * 100 + '%';
        emoji.style.animationDelay = Math.random() * 5 + 's';
        floatingElements.appendChild(emoji);
    }
}

// Progress Bars Animation
const progressBars = document.querySelectorAll('.progress-bar');

const observerOptions = {
    threshold: 0.5
};

const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const percentage = target.getAttribute('data-progress');
            gsap.to(target, {
                width: percentage + '%',
                duration: 1.5,
                ease: 'power2.out'
            });
        }
    });
}, observerOptions);

progressBars.forEach(bar => progressObserver.observe(bar));

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Animate sections on scroll
document.querySelectorAll('section').forEach(section => {
    gsap.from(section, {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 20%',
            toggleActions: 'play none none reverse'
        }
    });
});

// Growth System Slider
const stages = document.querySelectorAll('.stage');
const indicators = document.querySelectorAll('.indicator');
const prevButton = document.querySelector('.slider-button.prev');
const nextButton = document.querySelector('.slider-button.next');
let currentStage = 0;

function updateSlider() {
    // Update stages
    stages.forEach((stage, index) => {
        if (index === currentStage) {
            stage.classList.add('active');
        } else {
            stage.classList.remove('active');
        }
    });

    // Update indicators
    indicators.forEach((indicator, index) => {
        if (index === currentStage) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });

    // Update button states
    prevButton.disabled = currentStage === 0;
    nextButton.disabled = currentStage === stages.length - 1;
}

function goToStage(index) {
    if (index >= 0 && index < stages.length) {
        currentStage = index;
        updateSlider();
    }
}

function nextStage() {
    if (currentStage < stages.length - 1) {
        currentStage++;
        updateSlider();
    }
}

function prevStage() {
    if (currentStage > 0) {
        currentStage--;
        updateSlider();
    }
}

// Event Listeners
if (prevButton) prevButton.addEventListener('click', prevStage);
if (nextButton) nextButton.addEventListener('click', nextStage);

indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => goToStage(index));
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevStage();
    } else if (e.key === 'ArrowRight') {
        nextStage();
    }
});

// Initialize slider
updateSlider();

// Affiliate Program Functionality
const joinAffiliateBtn = document.getElementById('joinAffiliate');
const learnMoreBtn = document.getElementById('learnMore');

if (joinAffiliateBtn) joinAffiliateBtn.addEventListener('click', () => {
    // Here you would typically redirect to the affiliate signup page
    // For now, we'll show a modal or alert
    alert('Redirecting to affiliate signup...');
});

if (learnMoreBtn) learnMoreBtn.addEventListener('click', () => {
    // Here you would typically show a detailed modal or redirect to a page
    // For now, we'll show an alert
    alert('Opening detailed information about the affiliate program...');
});

// Animate affiliate cards on scroll
const affiliateCards = document.querySelectorAll('.stat-card, .feature-card');

const affiliateObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

affiliateCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.5s ease';
    affiliateObserver.observe(card);
});

// Add tilt effect to affiliate cards
if (window.VanillaTilt) {
    VanillaTilt.init(document.querySelectorAll('.stat-card, .feature-card'), {
        max: 15,
        speed: 400,
        glare: true,
        'max-glare': 0.2,
        scale: 1.05
    });
}

// Affiliate section animations
document.addEventListener('DOMContentLoaded', () => {
    // Initialize ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Animate affiliate section elements
    const affiliateElements = document.querySelectorAll('.affiliate-animate');
    
    affiliateElements.forEach((element, index) => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            delay: index * 0.2
        });
    });

    // Special animation for the affiliate header
    const affiliateHeader = document.querySelector('.affiliate-header');
    if (affiliateHeader) {
        ScrollTrigger.create({
            trigger: affiliateHeader,
            start: "top center",
            onEnter: () => {
                affiliateHeader.classList.add('visible');
                // Add a subtle parallax effect to the logo
                gsap.to('.affiliate-logo', {
                    y: -20,
                    duration: 1,
                    ease: "power2.out"
                });
            },
            onLeaveBack: () => {
                affiliateHeader.classList.remove('visible');
            }
        });
    }

    // Hover animations for info cards
    const infoCards = document.querySelectorAll('.info-card');
    infoCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.02,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                duration: 0.3,
                ease: "power2.in"
            });
        });
    });

    // Coming Soon fade-up animation
    const comingSoon = document.getElementById('ComingSoonSection');
    if (comingSoon) {
        gsap.from('#ComingSoonSection .coming-board, #ComingSoonSection .device-mockups .mockup', {
            scrollTrigger: {
                trigger: '#ComingSoonSection',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 40,
            duration: 0.9,
            stagger: 0.15,
            ease: 'power2.out'
        });
    }
});

// Smooth scroll to affiliate section after page load
window.addEventListener('load', () => {
    setTimeout(() => {
        const affiliateSection = document.getElementById('affiliate-program');
        const navbar = document.querySelector('.navbar');
        if (affiliateSection && navbar) {
            const headerHeight = navbar.offsetHeight || 0;
            const sectionTop = affiliateSection.offsetTop - headerHeight;
            window.scrollTo({ top: sectionTop, behavior: 'smooth' });
        }
    }, 1000);
});

// Add scroll trigger animation for affiliate section
if (document.querySelector('#affiliate-program')) {
    gsap.from('#affiliate-program .info-card', {
        scrollTrigger: {
            trigger: '#affiliate-program',
            start: 'top center',
            end: 'bottom center',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2
    });
}

// Testimonial Carousel
const testimonialSlides = document.querySelector('.testimonial-slides');
const testimonials = document.querySelectorAll('.testimonial');
const testimonialDots = document.querySelectorAll('.testimonial-dots .dot');
const testimonialPrev = document.querySelector('.testimonial-prev');
const testimonialNext = document.querySelector('.testimonial-next');

let currentTestimonialIndex = 0;
let testimonialInterval;

function showTestimonial(index) {
    testimonials.forEach((testimonial, i) => {
        testimonial.classList.remove('active');
        testimonialDots[i].classList.remove('active');
    });

    testimonials[index].classList.add('active');
    testimonialDots[index].classList.add('active');
    currentTestimonialIndex = index;
}

function nextTestimonial() {
    let nextIndex = (currentTestimonialIndex + 1) % testimonials.length;
    showTestimonial(nextIndex);
}

function prevTestimonial() {
    let prevIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
    showTestimonial(prevIndex);
}

function startAutoTestimonial() {
    testimonialInterval = setInterval(nextTestimonial, 5000);
}

function stopAutoTestimonial() {
    clearInterval(testimonialInterval);
}

// Event Listeners
if (testimonialPrev) testimonialPrev.addEventListener('click', () => {
    stopAutoTestimonial();
    prevTestimonial();
    startAutoTestimonial();
});

if (testimonialNext) testimonialNext.addEventListener('click', () => {
    stopAutoTestimonial();
    nextTestimonial();
    startAutoTestimonial();
});

testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        stopAutoTestimonial();
        showTestimonial(index);
        startAutoTestimonial();
    });
});

// Initialize carousel
if (testimonials.length) {
    showTestimonial(0);
    startAutoTestimonial();
}

// Pause auto-slide on hover
if (testimonialSlides) {
    testimonialSlides.addEventListener('mouseenter', stopAutoTestimonial);
    testimonialSlides.addEventListener('mouseleave', startAutoTestimonial);
}

// Get all sections
const scrollSections = Array.from(document.querySelectorAll('.section'));
let current = 0;

// Set initial state
function showSection(idx) {
  scrollSections.forEach((sec, i) => {
    sec.classList.remove('active', 'prev', 'next');
    if (i === idx) sec.classList.add('active');
    else if (i < idx) sec.classList.add('prev');
    else if (i > idx) sec.classList.add('next');
  });
}
showSection(current);

// Listen for scroll (wheel/touch)
let isThrottled = false;
function onScroll(e) {
  if (isThrottled) return;
  isThrottled = true;
  setTimeout(() => isThrottled = false, 800);

  if (e.deltaY > 0 && current < scrollSections.length - 1) current++;
  else if (e.deltaY < 0 && current > 0) current--;
  showSection(current);
}
window.addEventListener('wheel', onScroll, { passive: false });

// Optional: Keyboard navigation
window.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown' && current < scrollSections.length - 1) { current++; showSection(current);}
  if (e.key === 'ArrowUp' && current > 0) { current--; showSection(current);}
});

