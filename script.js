document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    // Form submissions are handled via EmailJS; no PHP backend is used.
    emailjs.init('mvReO2CQdqDBzwptK');
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    console.log('Mobile nav elements:', { navToggle, navMenu });

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            console.log('Nav toggle clicked');
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            console.log('Nav menu classes:', navMenu.className);
            console.log('Nav toggle classes:', navToggle.className);
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                console.log('Nav link clicked, closing menu');
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    } else {
        console.log('Mobile navigation elements not found!');
    }
    
    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header Background Change on Scroll
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        
        if (scrollTop > 100) {
            if (isDarkMode) {
                header.style.background = 'rgba(15, 20, 25, 0.98)';
                header.style.borderBottom = '1px solid rgba(45, 55, 72, 0.8)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.borderBottom = '1px solid rgba(226, 232, 240, 0.8)';
            }
            header.style.backdropFilter = 'blur(15px)';
        } else {
            if (isDarkMode) {
                header.style.background = 'rgba(15, 20, 25, 0.95)';
                header.style.borderBottom = '1px solid rgba(45, 55, 72, 0.6)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.borderBottom = '1px solid #e2e8f0';
            }
            header.style.backdropFilter = 'blur(10px)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Active Navigation Link Highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function highlightActiveSection() {
        const scrollY = window.pageYOffset;
        const headerHeight = document.querySelector('.header').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionBottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightActiveSection);
    
    // Inject dynamic styles for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes slideUp {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(-10px);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.service-card, .feature, .testimonial-card, .highlight').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Counter Animation for Stats
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = counter.textContent;
            const isNumber = !isNaN(target);
            
            if (isNumber) {
                const increment = parseInt(target) / 50;
                let current = 0;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= parseInt(target)) {
                        counter.textContent = target;
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current);
                    }
                }, 30);
            }
        });
    }
    
    // Trigger counter animation when stats section is visible
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }
    
    // Loading Animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
    
    // Add loading styles
    const loadingStyle = document.createElement('style');
    loadingStyle.textContent = `
        body {
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        body.loaded {
            opacity: 1;
        }
        
        .floating-card {
            opacity: 0;
            animation: fadeInFloat 1s ease forwards;
        }
        
        .card-1 {
            animation-delay: 0.2s;
        }
        
        .card-2 {
            animation-delay: 0.4s;
        }
        
        .card-3 {
            animation-delay: 0.6s;
        }
        
        @keyframes fadeInFloat {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(loadingStyle);

    // Removed trusted-by modal and click handler per request
    
    // Enhance button interactions
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            if (!this.classList.contains('btn-secondary')) {
                this.style.transform = 'translateY(-2px)';
            } else {
                this.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Service card hover effects
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Amazing Logo Effects and Functionality
    const logoLink = document.getElementById('logoLink');
    const logo = document.querySelector('.logo');
    const logoGlow = document.querySelector('.logo-glow');
    const logoParticles = document.querySelectorAll('.particle');
    
    if (logoLink) {
        // Enhanced smooth scroll to top with amazing effects
        logoLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Trigger amazing click effect
            triggerLogoClickEffect();
            
            // Smooth scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Add special glow effect during scroll
            logoLink.classList.add('scrolling');
            
            // Remove scrolling class when scroll completes
            setTimeout(() => {
                logoLink.classList.remove('scrolling');
            }, 1000);
        });
        
        // Logo hover effects
        logoLink.addEventListener('mouseenter', function() {
            this.classList.add('logo-hover');
            logo.style.transform = 'scale(1.1) rotate(5deg)';
            logoGlow.style.opacity = '0.8';
            
            // Animate particles
            logoParticles.forEach((particle, index) => {
                particle.style.animationPlayState = 'running';
                particle.style.opacity = '1';
            });
        });
        
        logoLink.addEventListener('mouseleave', function() {
            this.classList.remove('logo-hover');
            logo.style.transform = 'scale(1) rotate(0deg)';
            logoGlow.style.opacity = '0';
            
            // Reset particles
            logoParticles.forEach(particle => {
                particle.style.animationPlayState = 'paused';
                particle.style.opacity = '0.6';
            });
        });
        
        // Dynamic effects based on scroll position
        window.addEventListener('scroll', function() {
            const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            const hue = scrollPercent * 60; // Change color from green to teal based on scroll
            
            logoGlow.style.filter = `hue-rotate(${hue}deg)`;
            
            // Subtle logo rotation based on scroll
            if (!logoLink.classList.contains('logo-hover')) {
                logo.style.transform = `scale(1) rotate(${scrollPercent * 10}deg)`;
            }
        });
    }
    
    // Amazing click effect function
    function triggerLogoClickEffect() {
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'logo-ripple';
        logoLink.appendChild(ripple);
        
        // Burst of energy particles
        for (let i = 0; i < 12; i++) {
            const energyParticle = document.createElement('div');
            energyParticle.className = 'energy-particle';
            energyParticle.style.setProperty('--angle', `${i * 30}deg`);
            logoLink.appendChild(energyParticle);
            
            // Remove particle after animation
            setTimeout(() => {
                if (energyParticle.parentNode) {
                    energyParticle.remove();
                }
            }, 1000);
        }
        
        // Flash effect
        logoLink.classList.add('logo-flash');
        
        // Remove ripple and flash after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.remove();
            }
            logoLink.classList.remove('logo-flash');
        }, 600);
    }
    
    // Logo breathing effect when page is idle
    let idleTimer;
    let isIdle = false;
    
    function startIdleAnimation() {
        if (!isIdle && logoLink) {
            isIdle = true;
            logoLink.classList.add('logo-breathing');
        }
    }
    
    function stopIdleAnimation() {
        if (isIdle && logoLink) {
            isIdle = false;
            logoLink.classList.remove('logo-breathing');
        }
        clearTimeout(idleTimer);
        idleTimer = setTimeout(startIdleAnimation, 5000); // Start breathing after 5 seconds of inactivity
    }
    
    // Listen for user activity
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
        window.addEventListener(event, stopIdleAnimation, true);
    });
    
    // Start idle timer
    stopIdleAnimation();

    // Contact Form Handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Check CAPTCHA first
            const turnstileResponse = document.querySelector('[name="cf-turnstile-response"]');
            if (!turnstileResponse || !turnstileResponse.value) {
                showMessage('error', 'Please complete the security verification (CAPTCHA).');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                return;
            }

            // Get form data
            const formData = new FormData(contactForm);
            const templateParams = {
                title: formData.get('practice_name'),
                contact_name: formData.get('contact_name'),
                email: formData.get('email'),
                practice_name: formData.get('practice_name'),
                role: formData.get('role'),
                phone: formData.get('phone'),
                practice_size: formData.get('practice_size'),
                services_needed: formData.get('services_needed')
            };
            
            // Send email via EmailJS
            emailjs.send('service_raxh3oz', 'template_8m3ojxz', templateParams)
                .then(function(response) {
                    console.log('SUCCESS:', response);
                    showMessage('success', 'Thank you! Your consultation request has been sent successfully.');
                    contactForm.reset();
                })
                .catch(function(error) {
                    console.error('DETAILED ERROR:', error);
                    console.log('Service ID: service_raxh3oz');
                    console.log('Template ID: template_8m3ojxz');
                    console.log('Template Params:', templateParams);
                    showMessage('error', 'Sorry, there was an error sending your message. Please check the console for details or call us directly.');
                })
                .finally(function() {
                    // Reset button
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        });
    }

    // Show form messages
    function showMessage(type, text) {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = 'form-message';
        messageDiv.textContent = text;
        messageDiv.style.cssText = `
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-weight: 600;
            text-align: center;
            ${type === 'success' ? 
                'background: #f0f9f6; color: #0d5c3b; border: 1px solid #10a37f;' : 
                'background: #fef2f2; color: #7f1d1d; border: 1px solid #ef4444;'
            }
        `;
        
        // Insert at top of form
        contactForm.insertBefore(messageDiv, contactForm.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv) {
                messageDiv.remove();
            }
        }, 5000);
    }
});
