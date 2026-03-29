class SplitText {
    constructor(options = {}) {
        this.options = {
            text: '',
            className: '',
            delay: 100,
            duration: 0.6,
            ease: 'power3.out',
            splitType: 'chars',
            from: { opacity: 0, y: 40 },
            to: { opacity: 1, y: 0 },
            threshold: 0.1,
            rootMargin: '-100px',
            textAlign: 'center',
            onLetterAnimationComplete: null,
            ...options
        };
        
        this.element = null;
        this.chars = [];
        this.init();
    }
    
    init() {
        this.createElement();
        this.splitText();
        this.setupScrollTrigger();
    }
    
    createElement() {
        this.element = document.createElement('h1');
        this.element.className = this.options.className;
        this.element.textContent = this.options.text;
        this.element.style.textAlign = this.options.textAlign;
        this.element.style.opacity = '0'; // Start hidden
    }
    
    splitText() {
        const text = this.options.text;
        this.element.innerHTML = '';
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const charSpan = document.createElement('span');
            charSpan.textContent = char === ' ' ? '\u00A0' : char; // Preserve spaces
            charSpan.style.display = 'inline-block';
            charSpan.style.opacity = '0';
            charSpan.style.transform = `translateY(${this.options.from.y}px)`;
            charSpan.style.transition = 'none';
            
            this.element.appendChild(charSpan);
            this.chars.push(charSpan);
        }
    }
    
    setupScrollTrigger() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animate();
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: this.options.threshold,
            rootMargin: this.options.rootMargin
        });
        
        observer.observe(this.element);
    }
    
    animate() {
        // Show the main element
        gsap.to(this.element, {
            opacity: 1,
            duration: 0.1
        });
        
        // Animate each character
        gsap.to(this.chars, {
            opacity: this.options.to.opacity,
            y: this.options.to.y,
            duration: this.options.duration,
            ease: this.options.ease,
            stagger: this.options.delay / 1000,
            onComplete: () => {
                if (this.options.onLetterAnimationComplete) {
                    this.options.onLetterAnimationComplete();
                }
            }
        });
    }
    
    // Method to get the DOM element
    getElement() {
        return this.element;
    }
    
    // Method to destroy the component
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.chars = [];
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SplitText;
} else if (typeof window !== 'undefined') {
    window.SplitText = SplitText;
}
