/**
 * Ander Resano - Portfolio Script
 * Handles navigation, animations, mobile interactions, and translations.
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initAnimations();
    initMobileInteractions();
    initApp();
    updateFooterYear();
});

// ===========================
// 1. NAVIGATION & SCROLL
// ===========================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky Navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===========================
// 2. ANIMATIONS
// ===========================
function initAnimations() {
    // Fade In on Scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Elements to animate
    const animatedElements = document.querySelectorAll('.section-title, .about-content, .timeline-item, .flip-card, .project-card, .contact-content');

    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// ===========================
// 3. MOBILE INTERACTIONS
// ===========================
function initMobileInteractions() {
    const skillCards = document.querySelectorAll('.flip-card');

    skillCards.forEach(card => {
        card.addEventListener('click', function () {
            // Check if we are in mobile view (<= 968px) OR if the device doesn't support hover
            // This ensures it works on real phones AND when resizing desktop browser
            const isMobile = window.innerWidth <= 968 || !window.matchMedia('(hover: hover)').matches;

            if (isMobile) {
                // Toggle flipped class
                this.classList.toggle('flipped');

                // Close other cards to keep UI clean
                skillCards.forEach(otherCard => {
                    if (otherCard !== this) {
                        otherCard.classList.remove('flipped');
                    }
                });
            }
        });
    });
}

// ===========================
// 4. DATA & LANGUAGE & MODE
// ===========================
let contentData = {};
let currentLang = 'es';
let currentMode = 'programmer';

async function initApp() {
    try {
        const response = await fetch('content_data.json');
        contentData = await response.json();

        // Initialize Language and Mode after data is loaded
        initLanguage();
        initMode();
    } catch (error) {
        console.error('Error loading content data:', error);
    }
}

function initLanguage() {
    const langToggle = document.getElementById('language-toggle');
    const langText = langToggle.querySelector('.lang-text');
    currentLang = localStorage.getItem('portfolioLang') || 'es';

    // Set initial state
    updateLanguage(currentLang);
    langText.textContent = currentLang === 'es' ? 'EN' : 'ES';

    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'es' ? 'en' : 'es';
        localStorage.setItem('portfolioLang', currentLang);
        langText.textContent = currentLang === 'es' ? 'EN' : 'ES';
        updateLanguage(currentLang);
        updateContent(currentMode); // Update content when language changes
    });
}

function updateLanguage(lang) {
    if (contentData.general && contentData.general[lang]) {
        const translations = contentData.general[lang];
        const elements = document.querySelectorAll('[data-i18n]');

        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[key]) {
                if (element.tagName === 'P' || element.tagName === 'SPAN' || element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'H3') {
                    element.innerHTML = translations[key];
                } else {
                    element.textContent = translations[key];
                }
            }
        });
    }
}

function initMode() {
    const modeToggle = document.getElementById('mode-toggle');
    currentMode = localStorage.getItem('portfolioMode') || 'programmer';

    // Set initial state
    updateContent(currentMode);
    modeToggle.classList.toggle('active', currentMode === 'construction');

    modeToggle.addEventListener('click', () => {
        currentMode = currentMode === 'programmer' ? 'construction' : 'programmer';
        localStorage.setItem('portfolioMode', currentMode);
        updateContent(currentMode);

        modeToggle.classList.toggle('active', currentMode === 'construction');
    });
}

function updateContent(mode) {
    if (!contentData[mode] || !contentData[mode][currentLang]) return;

    const data = contentData[mode][currentLang];

    // Render Header
    if (data.header) {
        renderHeader(data.header);
    }

    // Render Education
    if (data.education) {
        renderEducation(data.education);
    }

    // Render Skills
    if (data.skills) {
        renderSkills(data.skills);
    }

    // Render Projects
    if (data.projects) {
        renderProjects(data.projects);
    }

    // Re-initialize animations for new elements
    initAnimations();
    // Re-initialize mobile interactions for new elements
    initMobileInteractions();
}

function renderHeader(headerData) {
    const roleEl = document.getElementById('hero-role');
    const techStackEl = document.getElementById('hero-tech-stack');
    const descEl = document.getElementById('hero-description');

    if (roleEl) roleEl.textContent = headerData.role;
    if (techStackEl) techStackEl.textContent = headerData.techStack;
    if (descEl) descEl.textContent = headerData.description;
}

function renderEducation(items) {
    const container = document.querySelector('.timeline');
    if (!container) return;

    container.innerHTML = ''; // Clear existing content

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'timeline-item';
        div.id = item.id;

        div.innerHTML = `
            <div class="timeline-marker"></div>
            <div class="timeline-content">
                <span class="timeline-date">${item.date}</span>
                <h3 class="timeline-title">${item.title}</h3>
                <p class="timeline-subtitle">${item.subtitle}</p>
                <p class="timeline-desc">${item.description}</p>
            </div>
        `;
        container.appendChild(div);
    });
}

function renderSkills(items) {
    const container = document.querySelector('.skills-grid');
    if (!container) return;

    container.innerHTML = ''; // Clear existing content

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'flip-card';
        div.tabIndex = 0;

        // Generate frameworks HTML
        const frameworksHtml = item.frameworks.map(fw => `<span>${fw}</span>`).join('');

        div.innerHTML = `
            <div class="flip-card-inner">
                <div class="flip-card-front">
                    <div class="skill-logo">
                        <svg viewBox="${item.viewBox || '0 0 24 24'}" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#10b981" stroke-width="1.5" aria-hidden="true">
                            ${item.icon}
                        </svg>
                    </div>
                    <h3>${item.title}</h3>
                </div>
                <div class="flip-card-back" id="${item.id}">
                    <h3>${item.backTitle || item.title}</h3>
                    <p class="experience">${item.experience}</p>
                    <div class="frameworks">
                        ${frameworksHtml}
                    </div>
                    <div class="skill-bar">
                        <div class="skill-progress" style="width: ${item.progress}%"></div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

function renderProjects(items) {
    const container = document.querySelector('.projects-grid');
    if (!container) return;

    container.innerHTML = ''; // Clear existing content

    items.forEach(item => {
        const article = document.createElement('article');
        article.className = 'project-card';
        article.id = item.id;

        // Generate tags HTML
        const tagsHtml = item.tags ? item.tags.map(tag => `<span class="tech-badge">${tag}</span>`).join('') : '';

        // Generate links HTML
        let linksHtml = '';
        if (item.links) {
            linksHtml = `
                <div class="project-links">
                    <a href="${item.links.code}" class="project-link" aria-label="Ver Código">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                        </svg>
                        <span>Code</span>
                    </a>
                </div>
            `;
        }

        article.innerHTML = `
            <div class="project-image">
                <div class="project-overlay"></div>
                <div class="project-tech-stack">
                    ${tagsHtml}
                </div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${item.title}</h3>
                <p class="project-description">${item.description}</p>
                ${linksHtml}
            </div>
        `;
        container.appendChild(article);
    });
}


// ===========================
// 6. UTILS
// ===========================
function updateFooterYear() {
    document.getElementById('year').textContent = new Date().getFullYear();
}
