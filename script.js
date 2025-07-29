// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll animations
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
    const animateElements = document.querySelectorAll('.section-header, .about-text, .skills-grid, .education-grid, .project-card, .interests-grid, .contact-content');
    animateElements.forEach(el => observer.observe(el));

    // Active navigation highlighting
    window.addEventListener('scroll', function() {
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
    });

    // CV Download functionality
    const downloadBtn = document.getElementById('downloadCV');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            // Create proper DOCX content based on your CV
            const cvContent = createCVDocx();
            
            // Create blob and download
            const blob = new Blob([cvContent], { 
                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'PHILIP_BARONGO_ONDIEKI_CV.docx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            // Show success feedback
            const originalText = downloadBtn.innerHTML;
            downloadBtn.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
            downloadBtn.style.background = '#27ae60';
            
            setTimeout(() => {
                downloadBtn.innerHTML = originalText;
                downloadBtn.style.background = '#4a90e2';
            }, 2000);
        });
    }

    // Function to create DOCX-like content
    function createCVDocx() {
        return `PHILIP BARONGO ONDIEKI

📞 +254 703 141 296 | 📧 philipbarongo30@gmail.com
🌍 GitHub: https://github.com/PhilipOndieki

PROFESSIONAL PROFILE

I am a Dynamic and driven tech enthusiast with a background in real estate and a growing portfolio of software development projects. Experienced in property management and valuation, now transitioning into full-stack development with a strong command of Python, JavaScript, Flask, React, and the MERN stack. Known for a hands-on approach to problem-solving, a passion for building systems that solve real-world problems, and a proactive mindset that bridges business and technology. My eagerness to contribute technical skills, to innovative teams is continuing to grow as a developer and problem-solver.

TECHNICAL PROJECTS

Instadev -- MERN Stack Developer
Full-stack platform to connect developers in real time.

• Designed and built a modern platform that allows developers to connect based on skill levels and stacks.
• Implemented authentication, real-time online status, and profile matching using MongoDB, Express, React, and Node.js.
• Developed a user-friendly interface with responsive modals for login and registration.

Hospital Management System -- Python, Flask, React
A full-stack system to manage hospital operations.

• Created backend routes in Flask to manage patients, admissions, discharges, and doctor assignments.
• Built React frontend for dynamic patient listings, search, and doctor allocation.
• Integrated RESTful APIs and maintained clean UI/UX across both front and back ends.

Elevator Simulation -- Python (OOP)

• Simulated elevator logic using object-oriented programming.
• Handled floor requests, direction logic, and display using a command-line interface.
• Used classes to modularize elevator behavior and testing scenarios.

Traffic Simulation -- Python

• Built a simulation of traffic light control and vehicle flow at intersections.
• Applied basic queueing algorithms and time delays to represent real-world traffic behavior.
• Improved understanding of object interactions and system state transitions.

EDUCATION

Bachelor of Real Estate and Property Management
Technical University of Kenya(Real estate) --- Graduated: 2024

PROFESSIONAL EXPERIENCE

KenVal Realtors EA Ltd
Asset Valuer --- May 2025 – June 2025

• Verified asset inventory and conducted fair market value assessments using Excel models.

Wabunifu Realtors
Property Manager --- Jan 2024 – Dec 2024

• Supervised operations, tenant relations, lease negotiations, and monthly reporting.

Danan Tech Electronics
Marketing Specialist --- Mar 2023 – Nov 2023

• Led marketing campaigns, increasing sales by 25% and enhancing brand loyalty.

Ministry of Lands
Property Management Assistant --- Jan 2022 – Feb 2023

• Supported lease processing, registration, and client services for real estate operations.

TECHNICAL SKILLS

• Languages: Python, JavaScript, HTML, CSS, SQL
• Frameworks: Flask, React, Express.js
• Databases: MongoDB, SQLite
• Tools: Git, VS Code, Node.js, Postman
• Concepts: Object-Oriented Programming, REST APIs, Authentication, UI/UX principles

ACTIVITIES & INTERESTS

• Software prototyping and full-stack app design
• Open-source contribution and learning in developer communities
• Real estate innovation through technology
• Sports: Swimming, football, hockey

REFEREES

Mary Abuya
Director of Property Management, Ministry of Lands
📞 0721 739 983

Adan Adawa
CEO, Detail Specs Limited
📞 0721 997 800`;
    }

    // Contact Form Validation and Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
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

            if (isValid) {
                // Simulate form submission
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                
                // Show loading state
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;

                // Simulate API call delay
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
        });
    }

    // Utility functions
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

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const hero = document.querySelector('.hero');
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });

    // Type writer effect for hero title (optional enhancement)
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // Skills animation on scroll
    const skillItems = document.querySelectorAll('.skill-item');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });

    skillItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.6s ease';
        skillObserver.observe(item);
    });

    // Project card hover effect enhancement
    const projectCard = document.querySelector('.project-card');
    if (projectCard) {
        projectCard.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        projectCard.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }

    // Loading animation for the page
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
});