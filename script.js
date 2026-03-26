document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    emailjs.init('mvReO2CQdqDBzwptK');

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
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

    // Header scroll effect — transparent to solid dark
    const header = document.querySelector('.header');

    const headerLogo = header.querySelector('.logo');
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 80) {
            header.classList.add('scrolled');
            if (headerLogo) headerLogo.src = 'logo.svg';
        } else {
            header.classList.remove('scrolled');
            if (headerLogo) headerLogo.src = 'logo-white.svg';
        }
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

    document.querySelectorAll('.service-card, .feature, .testimonial-card, .highlight, .gallery-item, .problem-card, .process-step').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
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

    // Page load animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    const loadingStyle = document.createElement('style');
    loadingStyle.textContent = `
        body {
            opacity: 0;
            transition: opacity 0.4s ease;
        }
        body.loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(loadingStyle);

    // Logo — scroll to top
    const logoLink = document.getElementById('logoLink');
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Contact Form Handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Check CAPTCHA
            const turnstileResponse = document.querySelector('[name="cf-turnstile-response"]');
            if (!turnstileResponse || !turnstileResponse.value) {
                showMessage('error', 'Please complete the security verification (CAPTCHA).');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                return;
            }

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

            emailjs.send('service_raxh3oz', 'template_8m3ojxz', templateParams)
                .then(function(response) {
                    console.log('SUCCESS:', response);
                    showMessage('success', 'Thank you! Your consultation request has been sent successfully.');
                    contactForm.reset();
                })
                .catch(function(error) {
                    console.error('DETAILED ERROR:', error);
                    showMessage('error', 'Sorry, there was an error sending your message. Please call us directly.');
                })
                .finally(function() {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        });
    }

    function showMessage(type, text) {
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) existingMessage.remove();

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
                'background: rgba(16, 163, 127, 0.15); color: #10a37f; border: 1px solid rgba(16, 163, 127, 0.3);' :
                'background: rgba(217, 83, 79, 0.15); color: #d9534f; border: 1px solid rgba(217, 83, 79, 0.3);'
            }
        `;

        contactForm.insertBefore(messageDiv, contactForm.firstChild);

        setTimeout(() => {
            if (messageDiv) messageDiv.remove();
        }, 5000);
    }
});
