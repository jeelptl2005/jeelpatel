// ========================================
// THEME TOGGLE FUNCTIONALITY
// ========================================
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference or default to dark
const currentTheme = localStorage.getItem('theme') || 'dark';
if (currentTheme === 'light') {
    body.classList.add('light-mode');
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    
    // Update icon
    if (body.classList.contains('light-mode')) {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    } else {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    }
});

// ========================================
// MOBILE MENU TOGGLE
// ========================================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const sidebar = document.getElementById('sidebar');
const mobileOverlay = document.getElementById('mobileOverlay');

function toggleMobileMenu() {
    mobileMenuToggle.classList.toggle('active');
    sidebar.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (sidebar.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

mobileMenuToggle.addEventListener('click', toggleMobileMenu);
mobileOverlay.addEventListener('click', toggleMobileMenu);

// ========================================
// SMOOTH SCROLLING & ACTIVE NAV
// ========================================
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

// Smooth scroll to section when clicking nav link
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            // Close mobile menu if open
            if (sidebar.classList.contains('active')) {
                toggleMobileMenu();
            }
            
            // Scroll to section
            const offsetTop = targetSection.offsetTop;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Update active state
            updateActiveNav(link);
        }
    });
});

// Update active navigation on scroll
function updateActiveNav(activeLink = null) {
    navLinks.forEach(link => link.classList.remove('active'));
    
    if (activeLink) {
        activeLink.classList.add('active');
    } else {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    }
}

// Update active nav on scroll
window.addEventListener('scroll', () => {
    updateActiveNav();
});

// ========================================
// ANIMATED COUNTERS
// ========================================
const statNumbers = document.querySelectorAll('.stat-number');
let hasAnimated = false;

function animateCounters() {
    if (hasAnimated) return;
    
    const aboutSection = document.getElementById('about');
    const aboutPosition = aboutSection.getBoundingClientRect().top;
    const screenPosition = window.innerHeight;
    
    if (aboutPosition < screenPosition) {
        hasAnimated = true;
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const increment = target / 50;
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                
                if (current < target) {
                    stat.textContent = Math.ceil(current);
                    setTimeout(updateCounter, 30);
                } else {
                    stat.textContent = target;
                }
            };
            
            updateCounter();
        });
    }
}

window.addEventListener('scroll', animateCounters);

// ========================================
// SKILL BARS ANIMATION
// ========================================
const skillBars = document.querySelectorAll('.skill-progress');
let skillsAnimated = false;

function animateSkillBars() {
    if (skillsAnimated) return;
    
    const skillsSection = document.getElementById('skills');
    const skillsPosition = skillsSection.getBoundingClientRect().top;
    const screenPosition = window.innerHeight;
    
    if (skillsPosition < screenPosition) {
        skillsAnimated = true;
        
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const progress = bar.getAttribute('data-progress');
                bar.style.width = progress + '%';
            }, index * 100);
        });
    }
}

window.addEventListener('scroll', animateSkillBars);

// ========================================
// CONTACT FORM SUBMISSION
// ========================================
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        subject: document.getElementById('subject').value.trim(),
        message: document.getElementById('message').value.trim()
    };
    
    // Validate form
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        showFormMessage('Please fill in all fields.', 'error');
        return;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    // Disable submit button
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    try {
        // Send form data to Flask backend
        const response = await fetch('/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showFormMessage(result.message, 'success');
            contactForm.reset();
        } else {
            showFormMessage(result.message || 'Failed to send message. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showFormMessage('An error occurred. Please try again later.', 'error');
    } finally {
        // Re-enable submit button
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
});

function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    
    // Auto-hide success message after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}

// ========================================
// SCROLL ANIMATIONS
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe all sections
sections.forEach(section => {
    observer.observe(section);
});

// Observe expertise items
const expertiseItems = document.querySelectorAll('.expertise-item');
expertiseItems.forEach(item => {
    observer.observe(item);
});

// Observe project cards
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    observer.observe(card);
});

// ========================================
// SCROLL TO TOP ON LOGO CLICK
// ========================================
const brand = document.querySelector('.brand');
if (brand) {
    brand.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Update active nav to home
        navLinks.forEach(link => link.classList.remove('active'));
        navLinks[0].classList.add('active');
        
        // Close mobile menu if open
        if (sidebar.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
}

// ========================================
// PARALLAX EFFECT FOR HOME SECTION
// ========================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const homeContent = document.querySelector('.home-content');
    
    if (homeContent && scrolled < window.innerHeight) {
        homeContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        homeContent.style.opacity = 1 - (scrolled / 800);
    }
});

// ========================================
// HOVER EFFECTS FOR PROJECT CARDS
// ========================================
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateX(10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateX(0) scale(1)';
    });
});

// ========================================
// TYPING EFFECT FOR NAME (OPTIONAL)
// ========================================
const nameElement = document.querySelector('.first-name');
if (nameElement) {
    const nameText = nameElement.textContent;
    let charIndex = 0;
    
    // Uncomment below to enable typing effect
    /*
    nameElement.textContent = '';
    
    function typeWriter() {
        if (charIndex < nameText.length) {
            nameElement.textContent += nameText.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 150);
        }
    }
    
    // Start typing after page load
    setTimeout(typeWriter, 500);
    */
}

// ========================================
// PERFORMANCE: LAZY LOADING IMAGES
// ========================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ========================================
// PREVENT FORM RESUBMISSION ON REFRESH
// ========================================
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// ========================================
// ADD LOADING CLASS TO BODY WHEN PAGE LOADS
// ========================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger initial animations
    setTimeout(() => {
        animateCounters();
        animateSkillBars();
    }, 500);
});

// ========================================
// CONSOLE MESSAGE (OPTIONAL)
// ========================================
console.log('%c👋 Welcome to Jeel\'s Portfolio!', 'color: #00d4ff; font-size: 20px; font-weight: bold;');
console.log('%cInterested in the code? Check out the source!', 'color: #b8b8b8; font-size: 14px;');

// ========================================
// EASTER EGG: KONAMI CODE
// ========================================
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode.splice(-konamiPattern.length - 1, konamiCode.length - konamiPattern.length);
    
    if (konamiCode.join('').includes(konamiPattern.join(''))) {
        document.body.style.animation = 'rainbow 2s linear infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});

// Rainbow animation CSS (injected dynamically)
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);
