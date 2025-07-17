/*===== NAVIGATION MENU =====*/
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');

// Menu show
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

// Menu hidden
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

// Remove menu mobile
const navLinks = document.querySelectorAll('.nav__link');

function linkAction() {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.remove('show-menu');
}
navLinks.forEach(n => n.addEventListener('click', linkAction));

/*===== GALLERY FILTERING =====*/
class GalleryFilter {
    constructor() {
        this.tabs = document.querySelectorAll('.gallery__tab');
        this.items = document.querySelectorAll('.gallery__item');
        this.init();
    }
    
    init() {
        if (this.tabs.length === 0) return;
        
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.filterItems(tab.dataset.tab));
        });
    }
    
    filterItems(category) {
        // Update active tab
        this.tabs.forEach(tab => tab.classList.remove('active'));
        document.querySelector(`[data-tab="${category}"]`).classList.add('active');
        
        // Filter items
        this.items.forEach(item => {
            const categories = item.dataset.category.split(' ');
            
            if (category === 'all' || categories.includes(category)) {
                item.classList.remove('hidden');
                item.style.display = 'block';
            } else {
                item.classList.add('hidden');
                setTimeout(() => {
                    if (item.classList.contains('hidden')) {
                        item.style.display = 'none';
                    }
                }, 300);
            }
        });
    }
}

/*===== CAROUSEL FUNCTIONALITY =====*/
class Carousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.carousel__slide');
        this.indicators = document.querySelectorAll('.carousel__indicator');
        this.prevBtn = document.querySelector('.carousel__btn--prev');
        this.nextBtn = document.querySelector('.carousel__btn--next');
        this.autoPlayInterval = null;
        this.init();
    }
    
    init() {
        if (this.slides.length === 0) return;
        
        // Set up event listeners
        this.prevBtn?.addEventListener('click', () => this.previousSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());
        
        // Set up indicator clicks
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Start autoplay
        this.startAutoPlay();
        
        // Pause autoplay on hover
        const carousel = document.querySelector('.home__carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
            carousel.addEventListener('mouseleave', () => this.startAutoPlay());
        }
        
        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    }
    
    goToSlide(slideIndex) {
        // Remove active class from current slide and indicator
        this.slides[this.currentSlide]?.classList.remove('active');
        this.indicators[this.currentSlide]?.classList.remove('active');
        
        // Update current slide
        this.currentSlide = slideIndex;
        
        // Add active class to new slide and indicator
        this.slides[this.currentSlide]?.classList.add('active');
        this.indicators[this.currentSlide]?.classList.add('active');
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }
    
    previousSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }
    
    startAutoPlay() {
        this.stopAutoPlay(); // Clear any existing interval
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // Change slide every 5 seconds
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

/*===== SCROLL SECTIONS ACTIVE LINK =====*/
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 58;
        const sectionId = current.getAttribute('id');
        const navLink = document.querySelector('.nav__menu a[href*=' + sectionId + ']');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active-link');
        } else {
            navLink?.classList.remove('active-link');
        }
    });
}


/*===== SMOOTH SCROLLING =====*/
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/*===== FORM VALIDATION AND SUBMISSION =====*/
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation and progress tracking
        const inputs = this.form.querySelectorAll('.form__input');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => {
                this.clearErrors(input);
                this.updateFormProgress();
            });
        });
        
        // Initialize progress
        this.updateFormProgress();
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        if (this.validateForm()) {
            this.submitForm();
        }
    }
    
    validateForm() {
        const inputs = this.form.querySelectorAll('.form__input[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(input) {
        const value = input.value.trim();
        const type = input.type;
        const name = input.name;
        
        // Clear previous errors
        this.clearErrors(input);
        
        // Required field validation
        if (input.hasAttribute('required') && !value) {
            this.showError(input, `${this.getFieldLabel(name)} is required`);
            return false;
        }
        
        // Email validation
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showError(input, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Phone validation
        if (type === 'tel' && value) {
            const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                this.showError(input, 'Please enter a valid phone number');
                return false;
            }
        }
        
        // Name validation
        if (name === 'name' && value) {
            if (value.length < 2) {
                this.showError(input, 'Name must be at least 2 characters long');
                return false;
            }
        }
        
        return true;
    }
    
    showError(input, message) {
        input.style.borderColor = '#ef4444';
        
        // Remove existing error message
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        errorDiv.textContent = message;
        
        input.parentNode.appendChild(errorDiv);
    }
    
    clearErrors(input) {
        input.style.borderColor = '';
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    getFieldLabel(name) {
        const labels = {
            name: 'Name',
            email: 'Email',
            phone: 'Phone',
            course: 'Course',
            message: 'Message'
        };
        return labels[name] || name;
    }
    
    async submitForm() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            // Simulate form submission (replace with actual endpoint)
            await this.simulateSubmission();
            
            // Show success message
            this.showSuccessMessage();
            this.form.reset();
            
        } catch (error) {
            // Show error message
            this.showErrorMessage('Failed to send message. Please try again.');
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
    
    simulateSubmission() {
        return new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
    }
    
    showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'form-message success-message';
        message.style.cssText = `
            background: #10b981;
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-top: 1rem;
            text-align: center;
            animation: fadeInUp 0.5s ease;
        `;
        message.textContent = 'Thank you! Your message has been sent successfully. We will contact you soon.';
        
        this.form.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
    
    showErrorMessage(text) {
        const message = document.createElement('div');
        message.className = 'form-message error-message';
        message.style.cssText = `
            background: #ef4444;
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-top: 1rem;
            text-align: center;
            animation: fadeInUp 0.5s ease;
        `;
        message.textContent = text;
        
        this.form.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
    
    updateFormProgress() {
        const requiredInputs = this.form.querySelectorAll('.form__input[required]');
        const filledInputs = Array.from(requiredInputs).filter(input => input.value.trim() !== '');
        const progress = (filledInputs.length / requiredInputs.length) * 100;
        
        const progressBar = document.getElementById('form-progress-bar');
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
    }
}

/*===== INTERSECTION OBSERVER FOR ANIMATIONS =====*/
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

/*===== ENHANCED LANDING PAGE ANIMATIONS =====*/
function setupLandingPageAnimations() {
    // Certificate logos animation on scroll
    const certLogos = document.querySelectorAll('.cert__logo');
    
    const certObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                certObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });
    
    certLogos.forEach(logo => {
        logo.style.animationPlayState = 'paused';
        certObserver.observe(logo);
    });
    
    // Number counting animation for stats
    const statNumbers = document.querySelectorAll('.stat__item h3');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                const isPercentage = finalValue.includes('%');
                const isPlus = finalValue.includes('+');
                let numValue = parseInt(finalValue.replace(/[^\d]/g, ''));
                
                if (numValue) {
                    animateCount(target, 0, numValue, isPercentage, isPlus);
                }
                
                statsObserver.unobserve(target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
}

function animateCount(element, start, end, isPercentage, isPlus) {
    const duration = 2000;
    const startTime = performance.now();
    
    function updateCount(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (end - start) * easeOutQuart);
        
        let displayValue = current.toString();
        if (isPercentage) displayValue += '%';
        if (isPlus) displayValue += '+';
        
        element.textContent = displayValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateCount);
        }
    }
    
    requestAnimationFrame(updateCount);
}

/*===== HEADER SCROLL EFFECT =====*/
function setupHeaderScroll() {
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY >= 80) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
            header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'var(--white-color)';
            header.style.backdropFilter = 'none';
            header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }
    });
}

/*===== PERFORMANCE OPTIMIZATIONS =====*/
function setupPerformanceOptimizations() {
    // Lazy loading for images
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Preload critical images
    const criticalImages = [
        'Images/carousel-1.jpg',
        'Images/carousel-2.jpg',
        'Images/about.png'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

/*===== ACCESSIBILITY ENHANCEMENTS =====*/
function setupAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main landmark
    const mainElement = document.querySelector('.main');
    if (mainElement) {
        mainElement.id = 'main';
        mainElement.setAttribute('role', 'main');
    }
    
    // Keyboard navigation for carousel
    const carouselButtons = document.querySelectorAll('.carousel__btn, .indicator');
    carouselButtons.forEach(button => {
        button.setAttribute('tabindex', '0');
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });
}

/*===== UTILITIES =====*/
function debounce(func, wait) {
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

/*===== INITIALIZATION =====*/
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    new GalleryFilter();
    new Carousel();
    new ContactForm();
    
    // Setup scroll-based features
    setupSmoothScrolling();
    setupScrollAnimations();
    setupLandingPageAnimations();
    setupHeaderScroll();
    setupPerformanceOptimizations();
    setupAccessibility();
    
    // Add scroll event listeners with throttling
    const throttledScrollActive = throttle(scrollActive, 100);
    
    window.addEventListener('scroll', throttledScrollActive);
    
    // Handle form reset button
    const contactForm = document.getElementById('contact-form');
    const submitButton = contactForm?.querySelector('button[type="submit"]');
    
    if (submitButton && contactForm) {
        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'form__button-group';
        
        // Create reset button
        const resetButton = document.createElement('button');
        resetButton.type = 'button';
        resetButton.innerHTML = '<i class="fas fa-undo"></i> RESET';
        resetButton.className = 'btn btn--secondary btn--form-action';
        
        resetButton.addEventListener('click', () => {
            contactForm.reset();
            const errorMessages = contactForm.querySelectorAll('.error-message');
            errorMessages.forEach(msg => msg.remove());
            const inputs = contactForm.querySelectorAll('.form__input');
            inputs.forEach(input => {
                input.style.borderColor = '';
            });
        });
        
        // Update submit button class and text
        submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> SEND MESSAGE';
        submitButton.className = 'btn btn--primary btn--form-action';
        
        // Wrap buttons in container
        submitButton.parentNode.insertBefore(buttonContainer, submitButton);
        buttonContainer.appendChild(submitButton);
        buttonContainer.appendChild(resetButton);
    }
    
    // Console welcome message
    console.log('%c🏆 KK Computers - The Career Solution', 'color: #d32f2f; font-size: 18px; font-weight: bold;');
    console.log('%cHack The Web Contest Submission - Built with HTML5, CSS3, JavaScript', 'color: #1976d2;');
});

/*===== WINDOW LOAD OPTIMIZATIONS =====*/
window.addEventListener('load', function() {
    // Remove loading states
    document.body.classList.add('loaded');
    
    // Initialize any heavy components after load
    console.log('🚀 Website fully loaded and optimized!');
});

/*===== ERROR HANDLING =====*/
window.addEventListener('error', function(e) {
    console.error('JavaScript error occurred:', e.error);
    
    // Gracefully handle errors in production
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            'description': e.error?.message || 'Unknown error',
            'fatal': false
        });
    }
});

/*===== EXPORT FOR TESTING =====*/
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GalleryFilter,
        ContactForm,
        setupSmoothScrolling,
        setupScrollAnimations
    };
}