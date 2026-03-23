// ===== CGPA PLANNER ELEMENTS =====
const addSemesterBtn = document.getElementById('add-semester');
const calculateCgpaBtn = document.getElementById('calculate-cgpa');
const semesterInputs = document.getElementById('semester-inputs');
const currentCgpaDisplay = document.getElementById('current-cgpa');
const totalCreditsDisplay = document.getElementById('total-credits');
const gradeClassDisplay = document.getElementById('grade-class');

let semesterCount = 1;

// ===== CGPA PLANNER FUNCTIONALITY =====
function addSemester() {
    semesterCount++;
    const semesterCard = document.createElement('div');
    semesterCard.className = 'semester-card';
    semesterCard.innerHTML = `
        <h4>Semester ${semesterCount}</h4>
        <div class="grade-inputs">
            <div class="input-group">
                <label for="sem${semesterCount}-gpa">GPA:</label>
                <input type="number" id="sem${semesterCount}-gpa" step="0.01" min="0" max="4.0" placeholder="3.5">
            </div>
            <div class="input-group">
                <label for="sem${semesterCount}-credits">Credits:</label>
                <input type="number" id="sem${semesterCount}-credits" min="1" placeholder="18">
            </div>
        </div>
    `;

    semesterInputs.appendChild(semesterCard);

    // Add fade-in animation
    setTimeout(() => {
        semesterCard.classList.add('fade-in-up');
    }, 10);
}

function calculateCGPA() {
    let totalGradePoints = 0;
    let totalCredits = 0;
    let validSemesters = 0;

    for (let i = 1; i <= semesterCount; i++) {
        const gpaInput = document.getElementById(`sem${i}-gpa`);
        const creditsInput = document.getElementById(`sem${i}-credits`);

        const gpa = parseFloat(gpaInput.value);
        const credits = parseInt(creditsInput.value);

        if (!isNaN(gpa) && !isNaN(credits) && gpa >= 0 && gpa <= 4.0 && credits > 0) {
            totalGradePoints += gpa * credits;
            totalCredits += credits;
            validSemesters++;
        }
    }

    if (validSemesters === 0) {
        showNotification('Please enter valid GPA and credits for at least one semester', 'error');
        return;
    }

    const cgpa = totalGradePoints / totalCredits;
    const gradeClass = getGradeClass(cgpa);

    // Animate the results
    animateValue(currentCgpaDisplay, 0, cgpa, 1000, 2);
    animateValue(totalCreditsDisplay, 0, totalCredits, 500, 0);
    gradeClassDisplay.textContent = gradeClass;

    // Add success animation
    currentCgpaDisplay.parentElement.style.animation = 'pulse 0.5s ease-in-out';
    setTimeout(() => {
        currentCgpaDisplay.parentElement.style.animation = '';
    }, 500);

    showNotification('CGPA calculated successfully!', 'success');
}

function getGradeClass(cgpa) {
    if (cgpa >= 3.5) return 'First Class';
    if (cgpa >= 3.0) return 'Second Class Upper';
    if (cgpa >= 2.5) return 'Second Class Lower';
    if (cgpa >= 2.0) return 'Third Class';
    return 'Pass';
}

function animateValue(element, start, end, duration, decimals = 0) {
    const startTime = performance.now();
    const endValue = typeof end === 'number' ? end : parseFloat(end);

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = start + (endValue - start) * easeOut;

        element.textContent = currentValue.toFixed(decimals);

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ===== EVENT LISTENERS FOR CGPA PLANNER =====
if (addSemesterBtn) {
    addSemesterBtn.addEventListener('click', addSemester);
}

if (calculateCgpaBtn) {
    calculateCgpaBtn.addEventListener('click', calculateCGPA);
}

// Add keyboard support for CGPA calculation
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter' && document.activeElement.closest('.cgpa-planner-section')) {
        calculateCGPA();
    }
});

// ===== MOBILE MENU TOGGLE =====
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    navToggle.innerHTML = navMenu.classList.contains('active')
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
}

navToggle.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// ===== SMOOTH SCROLLING =====
function smoothScrollToSection(targetId) {
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        const headerHeight = header.offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight - 20;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Add smooth scrolling to navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        smoothScrollToSection(targetId);
    });
});

// ===== ACTIVE NAVIGATION HIGHLIGHTING =====
function updateActiveNavLink() {
    const scrollPosition = window.scrollY + header.offsetHeight + 100;

    navLinks.forEach(link => {
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            const sectionTop = targetSection.offsetTop;
            const sectionBottom = sectionTop + targetSection.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
}

// ===== HEADER BACKGROUND ON SCROLL =====
function updateHeaderBackground() {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.action-card, .course-card, .lecturer-card').forEach(card => {
    observer.observe(card);
});

// ===== ACTION CARDS INTERACTIVITY =====
actionCards.forEach(card => {
    card.addEventListener('click', () => {
        const action = card.dataset.action;
        smoothScrollToSection(action);

        // Add click animation
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    });
});

// ===== TYPING ANIMATION FOR HERO TITLE =====
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

// ===== PARTICLE ANIMATION BACKGROUND =====
function createParticles() {
    const hero = document.querySelector('.hero');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            pointer-events: none;
            animation: float ${Math.random() * 10 + 10}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 10}s;
        `;

        hero.appendChild(particle);
    }
}

// ===== SCROLL PROGRESS INDICATOR =====
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
        z-index: 1001;
        transition: width 0.25s ease;
    `;

    document.body.appendChild(progressBar);

    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    }

    window.addEventListener('scroll', updateScrollProgress);
}

// ===== LAZY LOADING IMAGES =====
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ===== THEME TOGGLE (BONUS FEATURE) =====
function createThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.id = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        transition: all var(--transition-normal);
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    document.body.appendChild(themeToggle);

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');

        if (document.body.classList.contains('dark-theme')) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        }
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    createParticles();
    createScrollProgress();
    createThemeToggle();
    lazyLoadImages();

    // Add loading animation to hero title
    const heroTitle = document.querySelector('.hero-title-main');
    if (heroTitle) {
        setTimeout(() => {
            typeWriter(heroTitle, 'Computer Science');
        }, 500);
    }

    // Add stagger animation to action cards
    actionCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
});

// ===== SCROLL EVENT LISTENERS =====
window.addEventListener('scroll', () => {
    updateActiveNavLink();
    updateHeaderBackground();
});

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
});

// ===== PERFORMANCE OPTIMIZATION =====
let scrollTimeout;
function throttledScroll() {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
            updateActiveNavLink();
            updateHeaderBackground();
            scrollTimeout = null;
        }, 16); // ~60fps
    }
}

window.addEventListener('scroll', throttledScroll);

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // Could send error to analytics service here
});

// ===== ACCESSIBILITY =====
function enhanceAccessibility() {
    // Add ARIA labels
    navToggle.setAttribute('aria-label', 'Toggle navigation menu');
    navToggle.setAttribute('aria-expanded', 'false');

    navToggle.addEventListener('click', () => {
        const isExpanded = navMenu.classList.contains('active');
        navToggle.setAttribute('aria-expanded', isExpanded.toString());
    });

    // Add focus management for mobile menu
    const focusableElements = navMenu.querySelectorAll('a, button');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    navMenu.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
}

enhanceAccessibility();