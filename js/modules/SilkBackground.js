/**
 * Silk Background Module
 * @module SilkBackground
 * @description WebGL-powered animated silk background with performance optimizations
 * @version 2.0.0
 */

import { app } from '../core/App.js';

/**
 * SilkBackground class - Shared WebGL background across pages
 * Features: IntersectionObserver pause, visibility state handling, proper cleanup
 */
export class SilkBackground {
    /**
     * Default configuration
     * @static
     */
    static defaults = {
        color: '#7B7481',
        speed: 5,
        scale: 1,
        rotation: 0,
        noiseIntensity: 1.5,
        pixelRatio: 2
    };

    /**
     * Singleton instance
     * @static
     * @type {SilkBackground|null}
     */
    static instance = null;

    /**
     * Get or create singleton instance
     * @static
     * @param {HTMLElement} container
     * @param {Object} options
     * @returns {SilkBackground}
     */
    static getInstance(container, options = {}) {
        if (!SilkBackground.instance) {
            SilkBackground.instance = new SilkBackground(container, options);
        }
        return SilkBackground.instance;
    }

    /**
     * @param {HTMLElement} container - Container element
     * @param {Object} options - Configuration options
     */
    constructor(container, options = {}) {
        // Return existing instance if already created
        if (SilkBackground.instance) {
            return SilkBackground.instance;
        }

        /** @type {HTMLElement} */
        this.container = container;
        
        /** @type {Object} */
        this.config = { ...SilkBackground.defaults, ...options };
        
        /** @type {THREE.Scene|null} */
        this.scene = null;
        
        /** @type {THREE.OrthographicCamera|null} */
        this.camera = null;
        
        /** @type {THREE.WebGLRenderer|null} */
        this.renderer = null;
        
        /** @type {THREE.Mesh|null} */
        this.mesh = null;
        
        /** @type {Object} */
        this.uniforms = null;
        
        /** @type {THREE.Clock} */
        this.clock = new THREE.Clock();
        
        /** @type {boolean} */
        this.isRunning = true;
        
        /** @type {boolean} */
        this.isVisible = true;
        
        /** @type {number|null} */
        this.rafId = null;
        
        /** @type {IntersectionObserver|null} */
        this.observer = null;
        
        /** @type {Function|null} */
        this.cleanupVisibility = null;
        
        /** @type {Function|null} */
        this.cleanupResize = null;

        this._init();
        SilkBackground.instance = this;
    }

    /**
     * Initialize the WebGL scene
     * @private
     */
    _init() {
        this._setupScene();
        this._setupVisibilityObserver();
        this._setupResizeHandler();
        this._startAnimation();
        
        app.eventBus.emit('silkBackground:initialized', { instance: this });
    }

    /**
     * Setup Three.js scene
     * @private
     */
    _setupScene() {
        // Scene
        this.scene = new THREE.Scene();
        
        // Camera (orthographic for full-screen quad)
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        
        // Renderer with alpha and antialiasing
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.config.pixelRatio));
        
        this.container.appendChild(this.renderer.domElement);
        
        // Shader uniforms
        this.uniforms = {
            uTime: { value: 0 },
            uColor: { value: new THREE.Color(...this._hexToNormalizedRGB(this.config.color)) },
            uSpeed: { value: this.config.speed },
            uScale: { value: this.config.scale },
            uRotation: { value: this.config.rotation },
            uNoiseIntensity: { value: this.config.noiseIntensity }
        };
        
        // Create mesh with custom shaders
        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: this._getVertexShader(),
            fragmentShader: this._getFragmentShader(),
            transparent: true
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.mesh);
    }

    /**
     * Setup visibility observer for performance
     * @private
     */
    _setupVisibilityObserver() {
        if (!('IntersectionObserver' in window)) return;

        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    this.isVisible = entry.isIntersecting;
                    if (this.isVisible) {
                        this.resume();
                    } else {
                        this.pause();
                    }
                });
            },
            { threshold: 0 }
        );

        this.observer.observe(this.container);
    }

    /**
     * Setup resize handler
     * @private
     */
    _setupResizeHandler() {
        const handleResize = () => {
            if (this.renderer) {
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            }
        };

        window.addEventListener('resize', handleResize, { passive: true });
        this.cleanupResize = () => window.removeEventListener('resize', handleResize);
    }

    /**
     * Start animation loop
     * @private
     */
    _startAnimation() {
        const animate = () => {
            if (!this.isRunning) return;
            
            this.rafId = requestAnimationFrame(animate);
            
            // Only render when visible
            if (!this.isVisible) return;
            
            // Update time uniform
            const delta = this.clock.getDelta();
            this.uniforms.uTime.value += 0.1 * delta;
            
            // Render
            this.renderer.render(this.scene, this.camera);
        };
        
        this.rafId = requestAnimationFrame(animate);
    }

    /**
     * Convert hex color to normalized RGB
     * @private
     * @param {string} hex
     * @returns {Array<number>}
     */
    _hexToNormalizedRGB(hex) {
        const clean = hex.replace('#', '');
        return [
            parseInt(clean.slice(0, 2), 16) / 255,
            parseInt(clean.slice(2, 4), 16) / 255,
            parseInt(clean.slice(4, 6), 16) / 255
        ];
    }

    /**
     * Get vertex shader code
     * @private
     * @returns {string}
     */
    _getVertexShader() {
        return `
            varying vec2 vUv;
            varying vec3 vPosition;

            void main() {
                vPosition = position;
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
    }

    /**
     * Get fragment shader code
     * @private
     * @returns {string}
     */
    _getFragmentShader() {
        return `
            varying vec2 vUv;
            varying vec3 vPosition;

            uniform float uTime;
            uniform vec3 uColor;
            uniform float uSpeed;
            uniform float uScale;
            uniform float uRotation;
            uniform float uNoiseIntensity;

            const float e = 2.71828182845904523536;

            float noise(vec2 texCoord) {
                float G = e;
                vec2 r = (G * sin(G * texCoord));
                return fract(r.x * r.y * (1.0 + texCoord.x));
            }

            vec2 rotateUvs(vec2 uv, float angle) {
                float c = cos(angle);
                float s = sin(angle);
                mat2 rot = mat2(c, -s, s, c);
                return rot * uv;
            }

            void main() {
                float rnd = noise(gl_FragCoord.xy);
                vec2 uv = rotateUvs(vUv * uScale, uRotation);
                vec2 tex = uv * uScale;
                float tOffset = uSpeed * uTime;

                tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

                float pattern = 0.6 +
                    0.4 * sin(5.0 * (tex.x + tex.y +
                        cos(3.0 * tex.x + 5.0 * tex.y) +
                        0.02 * tOffset) +
                    sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

                vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
                col.a = 1.0;
                gl_FragColor = col;
            }
        `;
    }

    /**
     * Update color
     * @param {string} hex - Hex color code
     */
    updateColor(hex) {
        if (this.uniforms) {
            this.uniforms.uColor.value.set(...this._hexToNormalizedRGB(hex));
        }
    }

    /**
     * Update animation speed
     * @param {number} speed
     */
    updateSpeed(speed) {
        if (this.uniforms) {
            this.uniforms.uSpeed.value = speed;
        }
    }

    /**
     * Update scale
     * @param {number} scale
     */
    updateScale(scale) {
        if (this.uniforms) {
            this.uniforms.uScale.value = scale;
        }
    }

    /**
     * Update noise intensity
     * @param {number} intensity
     */
    updateNoiseIntensity(intensity) {
        if (this.uniforms) {
            this.uniforms.uNoiseIntensity.value = intensity;
        }
    }

    /**
     * Update rotation
     * @param {number} rotation
     */
    updateRotation(rotation) {
        if (this.uniforms) {
            this.uniforms.uRotation.value = rotation;
        }
    }

    /**
     * Pause animation
     */
    pause() {
        this.isRunning = false;
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    /**
     * Resume animation
     */
    resume() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.clock.getDelta(); // Reset delta
            this._startAnimation();
        }
    }

    /**
     * Destroy and cleanup
     */
    destroy() {
        this.pause();
        
        if (this.observer) {
            this.observer.disconnect();
        }
        
        if (this.cleanupResize) {
            this.cleanupResize();
        }
        
        if (this.renderer) {
            this.renderer.dispose();
            this.container.removeChild(this.renderer.domElement);
        }
        
        if (this.mesh) {
            this.mesh.geometry.dispose();
            this.mesh.material.dispose();
        }
        
        SilkBackground.instance = null;
        app.eventBus.emit('silkBackground:destroyed');
    }
}
