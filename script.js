// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();
    
    // Initialize navigation
    initNavigation();
    
    // Initialize animations
    initAnimations();
    
    // Initialize form handling
    initContactForm();
    
    // Initialize CV download
    initCVDownload();
    
    // Initialize scroll effects
    initScrollEffects();
    
    // Mark page as loaded
    document.body.classList.add('loaded');
});

// Theme Management
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Get saved theme or use system preference
    const savedTheme = localStorage.getItem('theme') || (prefersDark.matches ? 'dark' : 'light');
    
    // Apply initial theme
    setTheme(savedTheme);
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
    
    // Listen for system theme changes
    prefersDark.addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
        icon.className = 'fas fa-moon';
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
}

// Navigation Management
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Update aria-expanded for accessibility
        const isExpanded = navMenu.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isExpanded);
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation highlighting on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Animation Management
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.section-header, .about-text, .skills-grid, .education-grid, .project-card, .interests-grid, .contact-content'
    );
    animateElements.forEach(el => observer.observe(el));

    // Skills animation with stagger effect
    const skillItems = document.querySelectorAll('.skill-item');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const skillsGrid = entry.target;
                const skills = skillsGrid.querySelectorAll('.skill-item');
                
                skills.forEach((skill, index) => {
                    setTimeout(() => {
                        skill.style.opacity = '1';
                        skill.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, { threshold: 0.1 });

    const skillsGrid = document.querySelector('.skills-grid');
    if (skillsGrid) {
        skillItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'all 0.6s ease';
        });
        skillObserver.observe(skillsGrid);
    }
}

// Contact Form Management
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous errors
        clearErrors();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            message: document.getElementById('message').value.trim()
        };

        // Validate form
        let isValid = validateForm(formData);

        if (isValid) {
            submitForm(formData);
        }
    });
}

function validateForm(formData) {
    let isValid = true;

    // Name validation
    if (!formData.name) {
        showError('nameError', 'Name is required');
        isValid = false;
    } else if (formData.name.length < 2) {
        showError('nameError', 'Name must be at least 2 characters');
        isValid = false;
    }

    // Email validation
    if (!formData.email) {
        showError('emailError', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(formData.email)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    }

    // Message validation
    if (!formData.message) {
        showError('messageError', 'Message is required');
        isValid = false;
    } else if (formData.message.length < 10) {
        showError('messageError', 'Message must be at least 10 characters');
        isValid = false;
    }

    return isValid;
}

function submitForm(formData) {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Show success message
        showSuccessMessage('Thank you for your message! I\'ll get back to you soon.');
        
        // Reset form
        contactForm.reset();
        
        // Reset button
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            hideSuccessMessage();
        }, 5000);
    }, 2000);
}

// Form utility functions
function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => el.textContent = '');
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showSuccessMessage(message) {
    const successElement = document.getElementById('successMessage');
    if (successElement) {
        successElement.textContent = message;
        successElement.style.display = 'block';
    }
}

function hideSuccessMessage() {
    const successElement = document.getElementById('successMessage');
    if (successElement) {
        successElement.style.display = 'none';
    }
}

// CV Download Management
function initCVDownload() {
    const downloadBtn = document.getElementById('downloadCV');
    if (!downloadBtn) return;

    downloadBtn.addEventListener('click', function() {
        const cvContent = createCVContent();
        
        // Create and download file
        const blob = new Blob([cvContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'PHILIP_BARONGO_ONDIEKI_CV.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        // Show success feedback
        showDownloadFeedback(downloadBtn);
    });
}

function createCVContent() {
    return `PHILIP BARONGO ONDIEKI
Full-Stack Developer

CONTACT INFORMATION
Phone: +254 703 141 296
Email: philipbarongo30@gmail.com
GitHub: https://github.com/PhilipOndieki
LinkedIn: https://www.linkedin.com/in/philip-barongo-8b215028a
Twitter: https://x.com/philoloke

PROFESSIONAL PROFILE
Dynamic and driven tech enthusiast with a background in real estate and a growing portfolio of software development projects. Experienced in property management and valuation, now transitioning into full-stack development with a strong command of Python, JavaScript, Flask, React, and the MERN stack. Known for a hands-on approach to problem-solving, a passion for building systems that solve real-world problems, and a proactive mindset that bridges business and technology.

TECHNICAL SKILLS
Languages: Python, JavaScript, HTML, CSS, SQL
Frameworks: Flask, React, Express.js, Node.js
Databases: MongoDB, SQLite
Tools: Git, VS Code, Postman
Concepts: Object-Oriented Programming, REST APIs, Authentication, UI/UX principles

FEATURED PROJECT
Instadev - MERN Stack Developer Platform
• Full-stack platform connecting developers in real time
• Implemented authentication, real-time online status, and profile matching
• Built using MongoDB, Express, React, and Node.js
• Features responsive design and user-friendly interface
• Live at: https://instadev00.netlify.app/

EDUCATION
Bachelor of Real Estate and Property Management
Technical University of Kenya - Graduated: 2024

CS50's Introduction to Computer Science
Harvard University (via edX) - 2024

Software Development Program
PLP Academy - 2024

PROFESSIONAL EXPERIENCE
Asset Valuer - KenVal Realtors EA Ltd (May 2025 – June 2025)
• Conducted fair market value assessments
• Verified asset inventory using Excel models

Property Manager - Wabunifu Realtors (Jan 2024 – Dec 2024)
• Supervised operations, tenant relations, and lease negotiations
• Managed monthly reporting and client communications

Marketing Specialist - Danan Tech Electronics (Mar 2023 – Nov 2023)
• Led marketing campaigns, increasing sales by 25%
• Enhanced brand loyalty through strategic marketing initiatives

Property Management Assistant - Ministry of Lands (Jan 2022 – Feb 2023)
• Supported lease processing and registration
• Provided client services for real estate operations

INTERESTS
• Web Development and modern frameworks
• Tech Innovations, AI, and machine learning
• Open Source contribution and community collaboration
• Real estate innovation through technology

REFERENCES AVAILABLE UPON REQUEST

Generated from: ${window.location.href}
Date: ${new Date().toLocaleDateString()}`;
}

function showDownloadFeedback(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
    button.style.background = '#27ae60';
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '';
    }, 2000);
}

// Scroll Effects Management
function initScrollEffects() {
    let ticking = false;

    function updateScrollEffects() {
        updateNavbarBackground();
        updateParallaxEffect();
        ticking = false;
    }

    function requestScrollUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestScrollUpdate);
}

function updateNavbarBackground() {
    const navbar = document.querySelector('.navbar');
    const scrollY = window.scrollY;
    
    if (scrollY > 50) {
        navbar.style.boxShadow = '0 2px 20px var(--shadow)';
    } else {
        navbar.style.boxShadow = 'none';
    }
}

function updateParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    // Only apply parallax on larger screens to avoid performance issues
    if (window.innerWidth > 768) {
        hero.style.transform = `translateY(${rate}px)`;
    }
}

// Enhanced Project Card Interactions
document.addEventListener('DOMContentLoaded', function() {
    const projectCard = document.querySelector('.project-card');
    if (projectCard) {
        projectCard.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        projectCard.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }
});

// Keyboard Navigation Support
document.addEventListener('keydown', function(e) {
    // ESC key to close mobile menu
    if (e.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    }
    
    // Theme toggle with keyboard shortcut (Ctrl/Cmd + Shift + T)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        document.getElementById('themeToggle').click();
    }
});

// Performance Optimization
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

// Debounced scroll handler for better performance
const debouncedUpdateActiveNavLink = debounce(updateActiveNavLink, 10);
window.addEventListener('scroll', debouncedUpdateActiveNavLink);

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Could integrate with error reporting service here
});

// Analytics and Performance Monitoring
function trackUserInteraction(action, element) {
    // This could integrate with analytics services
    console.log(`User interaction: ${action} on ${element}`);
}

// Add interaction tracking to important elements
document.addEventListener('DOMContentLoaded', function() {
    // Track theme toggle usage
    document.getElementById('themeToggle').addEventListener('click', () => {
        trackUserInteraction('theme_toggle', 'navigation');
    });
    
    // Track CV downloads
    const downloadBtn = document.getElementById('downloadCV');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            trackUserInteraction('cv_download', 'about_section');
        });
    }
    
    // Track form submissions
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            trackUserInteraction('form_submit', 'contact_section');
        });
    }
});

// Service Worker Registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when you have a service worker file
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(registrationError => console.log('SW registration failed'));
    });
}