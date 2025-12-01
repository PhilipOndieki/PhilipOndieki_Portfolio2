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
    
    // Initialize hire me button and clickable image
    initHireMeButton();
    initClickableImage();
    
    // Mark page as loaded
    document.body.classList.add('loaded');
});

// Hire Me Button - Smooth Scroll to Contact
function initHireMeButton() {
    const hireMeBtn = document.querySelector('.hire-me-btn');
    if (hireMeBtn) {
        hireMeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                contactSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

// Clickable Profile Image - Smooth Scroll to Contact
function initClickableImage() {
    const profileImage = document.querySelector('.clickable-image');
    if (profileImage) {
        profileImage.addEventListener('click', function(e) {
            e.preventDefault();
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                contactSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

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
        '.section-header, .about-text, .skills-container, .timeline, .projects-grid, .interests-grid, .contact-content'
    );
    animateElements.forEach(el => observer.observe(el));
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
        a.download = 'Philip_Ondieki_CV.txt';
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
Portfolio: https://philip2.netlify.app/

PROFESSIONAL SUMMARY
Dynamic and driven full-stack developer specializing in MERN stack development with expertise in building real-time applications, RESTful APIs, and responsive web applications. Experienced in creating end-to-end solutions from database design to frontend implementation, with a focus on user experience and modern development practices.

TECHNICAL SKILLS

Frontend Development:
HTML5, CSS3, JavaScript (ES6+), React.js, React 19, Tailwind CSS, CSS Custom Properties, Vite, React Router, Intersection Observer API, Three.js, Responsive Design, UI/UX Design

Backend Development:
Node.js, Express.js, RESTful API Design, Socket.io, JWT (JSON Web Tokens), API Authentication, CORS, Custom Middleware, Real-time Communication

Database & Data Management:
MongoDB, Mongoose, MySQL, SQL, Database Design, Normalization, ERD (Entity Relationship Diagrams), CRUD Operations

Authentication & Security:
Clerk Authentication, JWT, API Key Authentication, Secure Payment Integration

Tools & Integrations:
Git & GitHub, Cloudinary, Paystack (M-Pesa Integration), PayPal SDK, Stripe.js, localStorage, State Management (React Hooks), Python, Flask

Additional Skills:
Version Control, Agile Methodology, Problem Solving, Technical Documentation

FEATURED PROJECTS
1. DualScope Engineering - Industrial Parts Catalog Platform
   Professional industrial engineering e-commerce platform featuring comprehensive product catalog, Firebase backend, and modern UI for industrial parts and equipment.
   Technologies: React, Firebase, Firestore, Tailwind CSS, Vercel
   Live: https://dualscopeengineering.vercel.app/   
   Key Features:
   • Comprehensive product catalog system
   • Firebase backend with Firestore database
   • Category filtering and search functionality
   • Responsive industrial-focused design

2. Mindful Haven - MERN Stack Wellness Blog
   Full-stack wellness and mental health blog platform with user authentication, rich content management, and social engagement features (likes, comments, bookmarks).
   Technologies: MongoDB, Express.js, React.js, Node.js, Clerk Authentication, Tailwind CSS
   Live: https://mindfulhaven2.onrender.com
   GitHub: https://github.com/PhilipOndieki/Mindfulhaven.git
   
   Key Features:
   • User authentication with Clerk
   • Rich content management system
   • Social engagement (likes, comments, bookmarks)
   • Responsive wellness-focused design

3. InstaDev - Developer Social Network Platform
   Modern social networking platform connecting developers worldwide based on skill level, technology stack, and coding journey with glassmorphic UI.
   Technologies: HTML5, CSS3, Vanilla JavaScript, Three.js, Vite
   Live: https://instadev00.netlify.app/
   GitHub: https://github.com/PhilipOndieki/instadev.git
   
   Key Features:
   • User authentication with profile customization
   • Developer discovery and filtering
   • Project showcase with GitHub integration
   • Friend request and networking system
   • Glassmorphic UI with 3D background effects

4. Personal Portfolio Website
   Modern, professional portfolio website with dark/light theme system, smooth scroll animations, responsive design, and functional contact form.
   Technologies: HTML5, CSS3, JavaScript (ES6+), CSS Custom Properties, Intersection Observer API
   Live: https://philip2.netlify.app/
   GitHub: https://github.com/PhilipOndieki/PhilipOndieki_Portfolio2.git
   
   Key Features:
   • Dark/light theme toggle with localStorage persistence
   • Smooth scroll animations using Intersection Observer
   • Fully responsive design
   • Real-time contact form validation

5. Echolia - Real-Time Chat Application
   Feature-rich real-time chat application with Socket.io, private messaging, group chats, typing indicators, message reactions, and file sharing.
   Technologies: Socket.io, React, Node.js, Express, MongoDB, Cloudinary, JWT
   Live: https://echolia2.onrender.com
   GitHub: https://github.com/PhilipOndieki/Echolia.git
   
   Key Features:
   • Real-time messaging with Socket.io
   • Private messaging and group chats
   • Typing indicators and message reactions
   • File sharing with Cloudinary integration
   • Read receipts and browser notifications

6. Product API - RESTful Express.js & MongoDB
   Comprehensive RESTful API with full CRUD operations, API key authentication, custom middleware, and advanced filtering capabilities.
   Technologies: Express.js, MongoDB, Mongoose, Node.js, JWT, CORS
   GitHub: https://github.com/PhilipOndieki/restfulApi.git
   
   Key Features:
   • Complete CRUD operations
   • API key authentication
   • Custom middleware for request processing
   • Advanced filtering and pagination
   • Full-text search capability

7. Kenya National Library System - Database Design
   Complete relational database management system with 9 interconnected tables, all relationship types, and comprehensive constraints.
   Technologies: MySQL, SQL, Database Design, Normalization, ERD
   GitHub: https://github.com/PhilipOndieki/LibraryManagementSystem.git
   
   Key Features:
   • 9 interconnected tables with proper relationships
   • All relationship types (1-1, 1-Many, Many-Many)
   • Comprehensive constraints and data integrity
   • Real-world Kenyan context data

8. Lipa na M-Pesa - Event Ticket Payment Integration
   Responsive event ticket purchasing application with integrated M-Pesa payment processing through Paystack for the Kenyan market.
   Technologies: HTML5, CSS3, Vanilla JavaScript, Paystack, PayPal SDK, Stripe.js, Font Awesome
   GitHub: https://github.com/PhilipOndieki/lipa-na-mpesa.git
   
   Key Features:
   • M-Pesa integration via Paystack
   • Multiple payment gateways (PayPal, Stripe)
   • Mobile-first responsive design
   • Secure KES currency transactions

EDUCATION

Power Learn Project
Advanced Software Development Program
June 2025 - December 2025
Intensive program focusing on modern software development practices and advanced full-stack technologies.

Bachelor of Real Estate and Property Management
Technical University of Kenya
July 2019 - November 2024
Comprehensive degree program combining business fundamentals with real estate expertise.

CS50's Introduction to Computer Science
Harvard University (via edX)
June 2024 - December 2024
Rigorous introduction to computer science covering C, Python, SQL, JavaScript, HTML, CSS, and fundamental CS concepts.

Angela Yu Full Stack Web Development
Complete Full Stack Development Bootcamp
July 2023 - March 2024
Comprehensive bootcamp covering frontend and backend technologies, databases, and deployment.

Python for Data Analysis
Data Analysis and Visualization
August 2022 - June 2023
Advanced Python programming for data manipulation, analysis, and visualization.

Python for Beginners
Python Programming Fundamentals
January 2022 - July 2022
Foundation course covering Python syntax, data structures, and programming fundamentals.

PROFESSIONAL EXPERIENCE

Asset Valuer
KenVal Realtors EA Ltd
May 2025 – June 2025
• Conducted fair market value assessments for various properties
• Verified asset inventory using Excel models
• Prepared detailed valuation reports

Property Manager
Wabunifu Realtors
January 2024 – December 2024
• Supervised daily property operations and tenant relations
• Managed lease negotiations and renewals
• Handled monthly reporting and client communications

Marketing Specialist
Danan Tech Electronics
March 2023 – November 2023
• Led marketing campaigns, increasing sales by 25%
• Enhanced brand loyalty through strategic marketing initiatives
• Managed social media presence and customer engagement

Property Management Assistant
Ministry of Lands
January 2022 – February 2023
• Supported lease processing and property registration
• Provided client services for real estate operations
• Maintained property records and documentation

INTERESTS
• Web Development and Modern Frameworks
• Tech Innovations, AI, and Machine Learning
• Open Source Contribution and Community Collaboration
• Real Estate Innovation Through Technology
• Building Solutions for Real-World Problems

REFERENCES
Available upon request

---
Generated: ${new Date().toLocaleDateString()}
Portfolio: https://philip2.netlify.app/`;
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
});