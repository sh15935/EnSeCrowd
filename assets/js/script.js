/**
 * EnSeCrowd - Cybersecurity Club Website
 * Main JavaScript File
 * Author: EnSeCrowd Team
 */

'use strict';

// ========================================
// CONFIGURATION
// ========================================
const CONFIG = {
    loadingDuration: 1500,
    particleCount: 50,
    sectionParticleCount: 30,
    scrollThreshold: 100,
    boardCardAnimationDelay: 500,
    boardCardStagger: 100
};

// ========================================
// UTILITY FUNCTIONS
// ========================================
const Utils = {
    /**
     * Wait for DOM to be fully loaded
     */
    onDOMReady(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    },

    /**
     * Debounce function for performance
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// ========================================
// LOADING SCREEN MODULE
// ========================================
const LoadingScreen = {
    init() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loadingScreen = document.getElementById('loading-screen');
                if (loadingScreen) {
                    loadingScreen.classList.add('hidden');
                }
            }, CONFIG.loadingDuration);
        });
    }
};

// ========================================
// NAVIGATION MODULE
// ========================================
const Navigation = {
    navbar: null,
    hamburger: null,
    navLinks: null,

    init() {
        this.navbar = document.getElementById('navbar');
        this.hamburger = document.getElementById('hamburger');
        this.navLinks = document.getElementById('navLinks');

        this.setupScrollEffect();
        this.setupHamburgerMenu();
        this.setupSmoothScroll();
    },

    setupScrollEffect() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > CONFIG.scrollThreshold) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        });
    },

    setupHamburgerMenu() {
        if (!this.hamburger || !this.navLinks) return;

        this.hamburger.addEventListener('click', () => {
            this.hamburger.classList.toggle('active');
            this.navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        const links = this.navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                this.hamburger.classList.remove('active');
                this.navLinks.classList.remove('active');
            });
        });
    },

    setupSmoothScroll() {
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
    }
};

// ========================================
// PARTICLE SYSTEM MODULE
// ========================================
const ParticleSystem = {
    init() {
        this.createHeroParticles();
        this.createSectionParticles('about');
        this.createSectionParticles('events');
        this.createSectionParticles('join');
    },

    createHeroParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;

        for (let i = 0; i < CONFIG.particleCount; i++) {
            const particle = this.createParticle();
            particlesContainer.appendChild(particle);
        }
    },

    createSectionParticles(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        const particlesDiv = document.createElement('div');
        particlesDiv.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        section.style.position = 'relative';
        section.insertBefore(particlesDiv, section.firstChild);

        for (let i = 0; i < CONFIG.sectionParticleCount; i++) {
            const particle = this.createParticle();
            particlesDiv.appendChild(particle);
        }
    },

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
        return particle;
    }
};

// ========================================
// HERO PARALLAX MODULE
// ========================================
const HeroParallax = {
    init() {
        const hero = document.getElementById('hero');
        const heroContent = document.querySelector('.hero-content');

        if (!hero || !heroContent) return;

        hero.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            heroContent.style.transform = `translate(${x}px, ${y}px)`;
        });
    }
};

// ========================================
// SCROLL ANIMATIONS MODULE
// ========================================
const ScrollAnimations = {
    init() {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }
};

// ========================================
// CARD ANIMATIONS MODULE
// ========================================
const CardAnimations = {
    init() {
        this.setupBoardCardAnimation();
        this.setupTiltEffect();
    },

    setupBoardCardAnimation() {
        setTimeout(() => {
            const boardCards = document.querySelectorAll('.board-card');
            boardCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(50px)';

                setTimeout(() => {
                    card.style.transition = 'all 0.6s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * CONFIG.boardCardStagger);
            });
        }, CONFIG.boardCardAnimationDelay);
    },

    setupTiltEffect() {
        const cards = document.querySelectorAll('.mission-card, .vision-card, .event-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }
};

// ========================================
// FORM VALIDATION MODULE
// ========================================
const FormValidation = {
    form: null,
    nameInput: null,
    emailInput: null,
    messageInput: null,
    successMessage: null,

    init() {
        this.form = document.getElementById('joinForm');
        this.nameInput = document.getElementById('name');
        this.emailInput = document.getElementById('email');
        this.messageInput = document.getElementById('message');
        this.successMessage = document.getElementById('successMessage');

        if (!this.form) return;

        this.setupEventListeners();
    },

    setupEventListeners() {
        this.nameInput.addEventListener('input', () => {
            this.clearError(this.nameInput, 'nameError');
        });

        this.emailInput.addEventListener('input', () => {
            this.clearError(this.emailInput, 'emailError');
        });

        this.messageInput.addEventListener('input', () => {
            this.clearError(this.messageInput, 'messageError');
        });

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    },

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    showError(input, errorId, message) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            input.style.borderColor = '#ff6b6b';
        }
    },

    clearError(input, errorId) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.style.display = 'none';
            input.style.borderColor = '#3B0066';
        }
    },

    handleSubmit() {
        let isValid = true;

        // Validate name
        if (this.nameInput.value.trim().length < 3) {
            this.showError(this.nameInput, 'nameError', 'Name must be at least 3 characters');
            isValid = false;
        }

        // Validate email
        if (!this.validateEmail(this.emailInput.value)) {
            this.showError(this.emailInput, 'emailError', 'Please enter a valid email address');
            isValid = false;
        }

        // Validate message
        if (this.messageInput.value.trim().length < 10) {
            this.showError(this.messageInput, 'messageError', 'Message must be at least 10 characters');
            isValid = false;
        }

        if (isValid) {
            this.form.submit();
            this.showSuccess();
        }
    },

    showSuccess() {
        this.successMessage.style.display = 'block';
        this.form.reset();

        setTimeout(() => {
            this.successMessage.style.display = 'none';
        }, 5000);
    }
};

// ========================================
// SCROLL PROGRESS INDICATOR MODULE
// ========================================
const ScrollProgress = {
    init() {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 4px;
            background: linear-gradient(90deg, #3B0066, #b366ff);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }
};

// ========================================
// FOOTER MODULE
// ========================================
const Footer = {
    init() {
        const currentYear = new Date().getFullYear();
        const footerText = document.querySelector('.footer-text');

        if (footerText) {
            footerText.innerHTML = `&copy; ${currentYear} EnSeCrowd. All rights reserved. Empowering Cybersecurity Innovation.`;
        }
    }
};

// ========================================
// CONSOLE BRANDING MODULE
// ========================================
const ConsoleBranding = {
    init() {
        console.log('%c🔐 EnSeCrowd 🔐', 'color: #b366ff; font-size: 24px; font-weight: bold;');
        console.log('%cWelcome to EnSeCrowd - Empowering Tomorrow\'s Cybersecurity Leaders', 'color: #3B0066; font-size: 14px;');
        console.log('%cInterested in joining our team? Visit our website and apply!', 'color: #888; font-size: 12px;');
    }
};

// ========================================
// APPLICATION INITIALIZATION
// ========================================
const App = {
    init() {
        LoadingScreen.init();
        Navigation.init();
        ParticleSystem.init();
        HeroParallax.init();
        ScrollAnimations.init();
        CardAnimations.init();
        FormValidation.init();
        ScrollProgress.init();
        Footer.init();
        ConsoleBranding.init();
    }
};

// Initialize app when DOM is ready
Utils.onDOMReady(() => {
    App.init();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}