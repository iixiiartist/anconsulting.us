
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Functionality
    function initMobileMenu() {
        console.log('🔧 Initializing mobile menu...');
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        
        console.log('Mobile menu button found:', !!mobileMenuButton);
        console.log('Mobile menu found:', !!mobileMenu);
        
        if (mobileMenuButton && mobileMenu) {
            console.log('✅ Setting up mobile menu event listeners');
            mobileMenuButton.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🎯 Mobile menu button clicked');
                const isHidden = mobileMenu.classList.contains('hidden');
                console.log('Menu currently hidden:', isHidden);
                
                if (isHidden) {
                    mobileMenu.classList.remove('hidden');
                    console.log('📱 Opening mobile menu');
                    // Change icon to X
                    const icon = mobileMenuButton.querySelector('[data-lucide]');
                    if (icon) {
                        icon.setAttribute('data-lucide', 'x');
                        if (typeof lucide !== 'undefined') {
                            lucide.createIcons();
                        }
                    }
                } else {
                    mobileMenu.classList.add('hidden');
                    console.log('❌ Closing mobile menu');
                    // Change icon back to menu
                    const icon = mobileMenuButton.querySelector('[data-lucide]');
                    if (icon) {
                        icon.setAttribute('data-lucide', 'menu');
                        if (typeof lucide !== 'undefined') {
                            lucide.createIcons();
                        }
                    }
                }
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
                    if (!mobileMenu.classList.contains('hidden')) {
                        mobileMenu.classList.add('hidden');
                        const icon = mobileMenuButton.querySelector('[data-lucide]');
                        if (icon) {
                            icon.setAttribute('data-lucide', 'menu');
                            if (typeof lucide !== 'undefined') {
                                lucide.createIcons();
                            }
                        }
                    }
                }
            });
        } else {
            console.log('❌ Mobile menu elements not found');
        }
    }

    function initAnimations() {
        // Ensure Lucide icons are created on all pages
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        const canvas = document.getElementById('constellation-bg');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = document.body.scrollHeight; // Use scrollHeight to cover the whole page
        let particles = [];
        const numberOfParticles = Math.min(150, Math.floor(canvas.width * canvas.height / 20000));

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5 + 1;
                this.speedX = Math.random() * 0.4 - 0.2;
                this.speedY = Math.random() * 0.4 - 0.2;
                this.color = `rgba(59, 130, 246, ${Math.random() * 0.5 + 0.2})`;
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
                if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
                this.x += this.speedX;
                this.y += this.speedY;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle());
            }
        }

        let animationFrameId;
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            animationFrameId = requestAnimationFrame(animateParticles);
        }
        
        initParticles();
        animateParticles();

        // Debounce resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                cancelAnimationFrame(animationFrameId);
                canvas.width = window.innerWidth;
                canvas.height = document.body.scrollHeight;
                initParticles();
                animateParticles();
            }, 250);
        });
    }

    // --- Logic for Use Case Library Page ---
    const cardGrid = document.getElementById('card-grid');
    if (cardGrid && typeof window.useCaseData !== 'undefined' && window.useCaseData.useCases) {
        const masterUseCases = window.useCaseData.useCases;
        let currentIndustry = 'Sales Teams';
        let currentPhase = 'All';

        const industryContainer = document.getElementById('industry-filter-container');
        const phaseContainer = document.getElementById('phase-filter-container');

        function slugify(text) {
            return text.toString().toLowerCase()
                .replace(/&/g, '-and-')  // Replace & with -and-
                .replace(/\s+/g, '-')    // Replace spaces with -
                .replace(/[^\w\-]+/g, '') // Remove all non-word chars
                .replace(/\-\-+/g, '-')   // Replace multiple - with single -
                .replace(/^-+/, '')       // Trim - from start of text
                .replace(/-+$/, '');      // Trim - from end of text
        }

        function renderCards() {
            cardGrid.innerHTML = '';
            let filtered = masterUseCases.filter(uc => uc.industry === currentIndustry);
            if (currentPhase !== 'All') {
                filtered = filtered.filter(uc => uc.phase === currentPhase);
            }

            if (filtered.length === 0) {
                 cardGrid.innerHTML = `<p class="text-slate-400 col-span-full text-center">No use cases match the current filter.</p>`;
                 return;
            }

            filtered.forEach(uc => {
                const slug = slugify(uc.title);
                const card = document.createElement('a');
                card.href = `/use-cases/${slug}.html`;
                card.className = 'glass-card p-6 flex flex-col hover:border-blue-500/50 no-underline';
                card.innerHTML = `
                    <h3 class="text-lg font-bold text-white mb-2 flex-grow">${uc.title}</h3>
                    <span class="text-xs font-semibold text-blue-400 bg-blue-500/10 rounded-full px-2 py-0.5 self-start">${uc.phase}</span>
                `;
                cardGrid.appendChild(card);
            });
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        function renderPhaseFilters() {
            phaseContainer.innerHTML = '';
            const phases = ['All', ...new Set(masterUseCases.filter(uc => uc.industry === currentIndustry).map(uc => uc.phase))];
            phases.forEach(phase => {
                const button = document.createElement('button');
                button.className = `secondary-cta text-sm py-1 px-3 rounded-md transition-colors ${currentPhase === phase ? 'bg-blue-600 text-white border-blue-600' : ''}`;
                button.textContent = phase;
                button.onclick = () => {
                    currentPhase = phase;
                    renderPhaseFilters();
                    renderCards();
                };
                phaseContainer.appendChild(button);
            });
        }

        function renderIndustryFilters() {
            industryContainer.innerHTML = '';
            const industries = [...new Set(masterUseCases.map(uc => uc.industry))];
            industries.forEach(industry => {
                const button = document.createElement('button');
                button.className = `cta-button py-2 px-4 rounded-lg transition-opacity ${currentIndustry === industry ? '' : 'opacity-50 hover:opacity-100'}`;
                button.textContent = industry;
                button.onclick = () => {
                    currentIndustry = industry;
                    currentPhase = 'All';
                    renderIndustryFilters();
                    renderPhaseFilters();
                    renderCards();
                };
                industryContainer.appendChild(button);
            });
        }
        
        renderIndustryFilters();
        renderPhaseFilters();
        renderCards();
    }

    // Initialize mobile menu and animations on all pages
    initMobileMenu();
    initAnimations();
});
