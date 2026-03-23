// ===== DOM ELEMENTS =====
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const header = document.querySelector('.header');
const actionCards = document.querySelectorAll('.action-card');

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

// ===== SHOW MORE COURSES FUNCTIONALITY =====
const showMoreCoursesBtn = document.getElementById('show-more-courses');
const hiddenCourses = document.querySelectorAll('.course-card.hidden');

if (showMoreCoursesBtn) {
    showMoreCoursesBtn.addEventListener('click', () => {
        const isExpanded = showMoreCoursesBtn.classList.contains('expanded');

        if (isExpanded) {
            // Hide courses
            hiddenCourses.forEach(course => {
                course.style.display = 'none';
            });
            showMoreCoursesBtn.innerHTML = '<i class="fas fa-plus"></i> View All Courses';
            showMoreCoursesBtn.classList.remove('expanded');
        } else {
            // Show courses
            hiddenCourses.forEach(course => {
                course.style.display = 'block';
                setTimeout(() => {
                    course.classList.add('fade-in-up');
                }, 10);
            });
            showMoreCoursesBtn.innerHTML = '<i class="fas fa-minus"></i> Show Less';
            showMoreCoursesBtn.classList.add('expanded');
        }
    });
}

// ===== SHOW MORE LECTURERS FUNCTIONALITY =====
const showMoreLecturersBtn = document.getElementById('show-more-lecturers');
const hiddenLecturers = document.querySelectorAll('.lecturer-card.hidden');

if (showMoreLecturersBtn) {
    showMoreLecturersBtn.addEventListener('click', () => {
        const isExpanded = showMoreLecturersBtn.classList.contains('expanded');

        if (isExpanded) {
            // Hide lecturers
            hiddenLecturers.forEach(lecturer => {
                lecturer.style.display = 'none';
            });
            showMoreLecturersBtn.innerHTML = '<i class="fas fa-plus"></i> View All Lecturers';
            showMoreLecturersBtn.classList.remove('expanded');
        } else {
            // Show lecturers
            hiddenLecturers.forEach(lecturer => {
                lecturer.style.display = 'block';
                setTimeout(() => {
                    lecturer.classList.add('fade-in-up');
                }, 10);
            });
            showMoreLecturersBtn.innerHTML = '<i class="fas fa-minus"></i> Show Less';
            showMoreLecturersBtn.classList.add('expanded');
        }
    });
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
    createScrollProgress();
    createThemeToggle();
    lazyLoadImages();

    // Initially hide additional courses and lecturers
    if (hiddenCourses) {
        hiddenCourses.forEach(course => course.style.display = 'none');
    }
    if (hiddenLecturers) {
        hiddenLecturers.forEach(lecturer => lecturer.style.display = 'none');
    }
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