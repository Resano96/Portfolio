document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initMobileInteractions();
    initMobileNavigation();
    initApp();
    updateFooterYear();
});

let contentData = {};
let currentLang = 'es';
let currentMode = 'programmer';

function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.pageYOffset - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.section-title, .about-content, .timeline-item, .flip-card, .project-card, .contact-content').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

function initMobileInteractions() {
    const cards = document.querySelectorAll('.flip-card');
    cards.forEach(card => {
        card.addEventListener('click', function () {
            const isMobile = window.innerWidth <= 968 || !window.matchMedia('(hover: hover)').matches;
            if (isMobile) {
                this.classList.toggle('flipped');
                cards.forEach(other => {
                    if (other !== this) other.classList.remove('flipped');
                });
            }
        });
    });
}

function initMobileNavigation() {
    const mobileNav = document.getElementById('mobile-bottom-nav');
    const heroSection = document.getElementById('home');
    const navItems = document.querySelectorAll('.mobile-nav-item');
    const sections = document.querySelectorAll('section');

    if (!mobileNav || !heroSection) return;

    new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            mobileNav.classList.toggle('visible', !entry.isIntersecting);
        });
    }, { root: null, threshold: 0.1 }).observe(heroSection);

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            if (pageYOffset >= section.offsetTop - 300) {
                current = section.getAttribute('id');
            }
        });
        navItems.forEach(item => {
            item.classList.toggle('active', item.getAttribute('href').includes(current));
        });
    });

    navItems.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                navItems.forEach(item => item.classList.remove('active'));
                this.classList.add('active');
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.pageYOffset - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

async function initApp() {
    try {
        const response = await fetch('content_data.json');
        contentData = await response.json();
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

    updateLanguage(currentLang);
    langText.textContent = currentLang === 'es' ? 'EN' : 'ES';

    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'es' ? 'en' : 'es';
        localStorage.setItem('portfolioLang', currentLang);
        langText.textContent = currentLang === 'es' ? 'EN' : 'ES';
        updateLanguage(currentLang);
        updateContent(currentMode);
    });
}

function updateLanguage(lang) {
    const translations = contentData.general && contentData.general[lang];
    if (!translations) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[key]) {
            if (['P', 'SPAN', 'H1', 'H2', 'H3'].includes(el.tagName)) {
                el.innerHTML = translations[key];
            } else {
                el.textContent = translations[key];
            }
        }
    });
}

function initMode() {
    const modeToggle = document.getElementById('mode-toggle');
    const modeLabel = modeToggle.querySelector('.mode-label');
    currentMode = localStorage.getItem('portfolioMode') || 'programmer';

    applyMode(currentMode, modeToggle, modeLabel);
    updateContent(currentMode);

    modeToggle.addEventListener('click', () => {
        currentMode = currentMode === 'programmer' ? 'construction' : 'programmer';
        localStorage.setItem('portfolioMode', currentMode);
        applyMode(currentMode, modeToggle, modeLabel);
        updateContent(currentMode);
    });
}

function applyMode(mode, toggle, label) {
    const html = document.documentElement;
    html.setAttribute('data-mode', mode);
    toggle.classList.toggle('active', mode === 'construction');
    label.textContent = mode === 'programmer' ? 'BIM' : 'DEV';
}

function updateContent(mode) {
    const data = contentData[mode] && contentData[mode][currentLang];
    if (!data) return;

    if (data.header) renderHeader(data.header);
    if (data.education) renderEducation(data.education);
    if (data.skills) renderSkills(data.skills);
    if (data.projects) renderProjects(data.projects);

    initAnimations();
    initMobileInteractions();
}

function renderHeader(h) {
    const role = document.getElementById('hero-role');
    const stack = document.getElementById('hero-tech-stack');
    const desc = document.getElementById('hero-description');
    if (role) role.textContent = h.role;
    if (stack) stack.textContent = h.techStack;
    if (desc) desc.textContent = h.description;
}

function renderEducation(items) {
    const container = document.querySelector('.timeline');
    if (!container) return;
    container.innerHTML = items.map(item => `
        <div class="timeline-item" id="${item.id}">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
                <span class="timeline-date">${item.date}</span>
                <h3 class="timeline-title">${item.title}</h3>
                <p class="timeline-subtitle">${item.subtitle}</p>
                <p class="timeline-desc">${item.description}</p>
            </div>
        </div>
    `).join('');
}

function renderSkills(items) {
    const container = document.querySelector('.skills-grid');
    if (!container) return;
    container.innerHTML = items.map(item => `
        <div class="flip-card" tabindex="0">
            <div class="flip-card-inner">
                <div class="flip-card-front">
                    <div class="skill-logo">
                        <svg viewBox="${item.viewBox || '0 0 24 24'}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            ${item.icon}
                        </svg>
                    </div>
                    <h3>${item.title}</h3>
                </div>
                <div class="flip-card-back" id="${item.id}">
                    <h3>${item.backTitle || item.title}</h3>
                    <p class="experience">${item.experience}</p>
                    <div class="frameworks">
                        ${item.frameworks.map(fw => `<span>${fw}</span>`).join('')}
                    </div>
                    <div class="skill-bar">
                        <div class="skill-progress" style="width: ${item.progress}%"></div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderProjects(items) {
    const container = document.querySelector('.projects-grid');
    if (!container) return;

    const labelKey = currentLang === 'es' ? 'projectFeatured' : 'projectFeatured';
    const inDevKey = currentLang === 'es' ? 'projectInDev' : 'projectInDev';
    const translations = contentData.general && contentData.general[currentLang];
    const featuredLabel = translations ? translations[labelKey] : 'Featured';
    const inDevLabel = translations ? translations[inDevKey] : 'In Development';

    container.innerHTML = items.map(item => {
        const isInDev = item.status === 'in-dev';
        const label = isInDev ? inDevLabel : featuredLabel;
        const labelClass = isInDev ? 'project-label in-dev' : 'project-label';
        const tags = item.tags ? item.tags.map(t => `<span class="tech-badge">${t}</span>`).join('') : '';

        let links = '';
        if (item.links) {
            const codeLink = item.links.code && item.links.code !== '#'
                ? `<a href="${item.links.code}" target="_blank" class="project-link" aria-label="Code">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                    <span>Code</span>
                  </a>`
                : '';
            if (codeLink) {
                links = `<div class="project-links">${codeLink}</div>`;
            }
        }

        return `
            <article class="project-card" id="${item.id}">
                <div class="project-image">
                    <div class="project-overlay"></div>
                    <div class="project-tech-stack">${tags}</div>
                </div>
                <div class="project-content">
                    <span class="${labelClass}">${label}</span>
                    <h3 class="project-title">${item.title}</h3>
                    <p class="project-description">${item.description}</p>
                    ${links}
                </div>
            </article>
        `;
    }).join('');
}

function updateFooterYear() {
    document.getElementById('year').textContent = new Date().getFullYear();
}
