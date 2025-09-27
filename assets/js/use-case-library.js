// Use Case Library Page JavaScript
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

    // Initialize animations
    function initAnimations() {
        // Ensure Lucide icons are created
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        const canvas = document.getElementById('constellation-bg');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = document.body.scrollHeight;
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
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }

            draw() {
                ctx.globalAlpha = 0.8;
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
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

        function drawConnections() {
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
            ctx.lineWidth = 1;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 100) {
                        ctx.globalAlpha = (100 - distance) / 100 * 0.3;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            drawConnections();
            requestAnimationFrame(animate);
        }

        initParticles();
        animate();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = document.body.scrollHeight;
            initParticles();
        });
    }

    // Use Case Library Logic
    const cardGrid = document.getElementById('card-grid');
    const industryFilter = document.getElementById('industry-filter');
    const searchInput = document.getElementById('search-input');
    const clearFilters = document.getElementById('clear-filters');
    const resultsCount = document.getElementById('results-count');

    if (cardGrid && typeof window.useCaseData !== 'undefined' && window.useCaseData.useCases) {
        console.log('✅ Use case library: Data loaded successfully with', window.useCaseData.useCases.length, 'use cases');
        const allUseCases = window.useCaseData.useCases;
        let filteredUseCases = [...allUseCases];

        // Check URL parameters for industry filter
        const urlParams = new URLSearchParams(window.location.search);
        const industryParam = urlParams.get('industry');
        
        // Set the industry filter if provided in URL
        if (industryParam && industryFilter) {
            industryFilter.value = industryParam;
        }

        function slugify(text) {
            return text.toString().toLowerCase()
                .replace(/&/g, '-and-')
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/\-\-+/g, '-')
                .replace(/^-+/, '')
                .replace(/-+$/, '');
        }

        function getUseCaseIcon(useCase) {
            // Industry-based icons
            const industryIcons = {
                'Sales Teams': 'target'
            };
            
            // Category-based icons as fallback
            const categoryIcons = {
                'productivity': 'zap',
                'compliance': 'shield-check',
                'risk management': 'alert-triangle',
                'sales': 'target',
                'analysis': 'bar-chart',
                'communication': 'message-circle',
                'automation': 'cpu',
                'training': 'graduation-cap',
                'strategy': 'brain-circuit'
            };
            
            // First try industry, then category, then default
            return industryIcons[useCase.industry] || 
                   categoryIcons[useCase.category] || 
                   'lightbulb';
        }

        function renderUseCases(useCases) {
            cardGrid.innerHTML = '';

            if (useCases.length === 0) {
                cardGrid.innerHTML = `
                    <div class="col-span-full text-center py-12">
                        <p class="text-slate-400 text-lg mb-4">No use cases match your filters</p>
                        <button onclick="clearAllFilters()" class="secondary-cta px-4 py-2 rounded-lg">Clear All Filters</button>
                    </div>
                `;
                return;
            }

            useCases.forEach(useCase => {
                const slug = slugify(useCase.title);
                const icon = getUseCaseIcon(useCase);
                const card = document.createElement('div');
                card.className = 'glass-card p-6 flex flex-col hover:border-blue-500/50 cursor-pointer transition-all duration-300 group';
                card.innerHTML = `
                    <div class="mb-4">
                        <i class="w-10 h-10 text-blue-400 icon-glow group-hover:scale-110 transition-transform duration-300" data-lucide="${icon}"></i>
                    </div>
                    <h3 class="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">${useCase.title}</h3>
                    <p class="text-slate-400 text-sm mb-4 flex-grow leading-relaxed">${useCase.description}</p>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-slate-500 font-medium">${useCase.industry}</span>
                        <div class="flex gap-1">
                            ${useCase.tags.slice(0, 2).map(tag => 
                                `<span class="text-xs bg-slate-800/70 text-slate-300 px-2 py-1 rounded-full">${tag}</span>`
                            ).join('')}
                        </div>
                    </div>
                    <div class="mt-4 pt-4 border-t border-slate-700/50">
                        <span class="text-blue-400 text-sm font-medium group-hover:text-blue-300 transition-colors flex items-center">
                            View Implementation Details
                            <i class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" data-lucide="arrow-right"></i>
                        </span>
                    </div>
                `;
                
                // Add click handler for modal or detail view
                card.addEventListener('click', () => showUseCaseModal(useCase));
                cardGrid.appendChild(card);
            });

            // Re-initialize Lucide icons for the new cards
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }

            // Update results count
            resultsCount.textContent = `Showing ${useCases.length} of ${allUseCases.length} use cases`;
        }

        function filterUseCases() {
            let filtered = [...allUseCases];

            // Filter by industry
            const selectedIndustry = industryFilter.value;
            if (selectedIndustry) {
                filtered = filtered.filter(uc => uc.industry === selectedIndustry);
            }

            // Filter by search term
            const searchTerm = searchInput.value.toLowerCase();
            if (searchTerm) {
                filtered = filtered.filter(uc => 
                    uc.title.toLowerCase().includes(searchTerm) ||
                    uc.description.toLowerCase().includes(searchTerm) ||
                    uc.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
                    uc.industry.toLowerCase().includes(searchTerm)
                );
            }

            filteredUseCases = filtered;
            renderUseCases(filteredUseCases);
        }

        function getRequiredSourcesList(useCase) {
            // Extract sources from the implementation guide text
            const sources = [];
            const guide = useCase.implementationGuide.toLowerCase();
            
            // Common source patterns to look for
            const sourcePatterns = {
                'training manuals': 'Training manuals and documentation',
                'employee handbook': 'Employee handbook and HR policies',

                'compliance documents': 'Regulatory compliance documents',
                'onboarding materials': 'Employee onboarding materials and checklists',
                'regulatory bulletins': 'State regulatory bulletins and updates',



                'websites': 'Company websites and online presence',
                'linkedin profiles': 'LinkedIn profiles and professional networks',
                'news articles': 'Industry news articles and press releases',
                'industry reports': 'Market research and industry analysis reports',
                'call recordings': 'Sales call recordings and transcripts',
                'email': 'Email communications and correspondence',


                'meeting notes': 'Meeting notes and internal communications',
                'presentations': 'Sales presentations and pitch materials',
                'product documentation': 'Product catalogs and specifications',
                'financial reports': 'Financial statements and reports',
                'customer feedback': 'Customer surveys and feedback forms',
                'social media': 'Social media profiles and content'
            };
            
            // Check for each pattern and add relevant sources
            Object.entries(sourcePatterns).forEach(([pattern, source]) => {
                if (guide.includes(pattern)) {
                    sources.push(source);
                }
            });
            
            // If no specific sources found, provide generic ones based on industry
            if (sources.length === 0) {
                switch (useCase.industry) {
                    case 'Sales Teams':
                        sources.push(
                            'CRM data and customer records',
                            'Sales call recordings and notes',
                            'Product documentation and pricing'
                        );
                        break;
                    default:
                        sources.push(
                            'Internal documentation and procedures',
                            'Industry-specific data and reports',
                            'Communication records and files'
                        );
                }
            }
            
            // Remove duplicates and return as array
            return [...new Set(sources)];
        }

        function clearAllFilters() {
            industryFilter.value = '';
            searchInput.value = '';
            filteredUseCases = [...allUseCases];
            renderUseCases(filteredUseCases);
        }

        function showUseCaseModal(useCase) {
            const icon = getUseCaseIcon(useCase);
            
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4';
            modal.innerHTML = `
                <div class="glass-card max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                    <div class="p-8">
                        <div class="flex items-start justify-between mb-6">
                            <div class="flex items-center gap-4">
                                <div class="flex-shrink-0">
                                    <i class="w-12 h-12 text-blue-400 icon-glow" data-lucide="${icon}"></i>
                                </div>
                                <div>
                                    <h2 class="text-2xl font-bold text-white mb-2">${useCase.title}</h2>
                                    <p class="text-blue-400 font-medium">${useCase.industry}</p>
                                </div>
                            </div>
                            <button id="close-modal" class="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-lg transition-all">
                                <i data-lucide="x" class="w-6 h-6"></i>
                            </button>
                        </div>

                        <div class="mb-8">
                            <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <i class="w-5 h-5 text-blue-400" data-lucide="file-text"></i>
                                Overview
                            </h3>
                            <p class="text-slate-300 leading-relaxed">${useCase.description}</p>
                        </div>

                        <div class="mb-8">
                            <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <i class="w-5 h-5 text-blue-400" data-lucide="database"></i>
                                Sources Required
                            </h3>
                            <div class="bg-slate-800/30 rounded-lg p-6">
                                <div class="space-y-2">
                                    ${getRequiredSourcesList(useCase).map(source => 
                                        `<div class="flex items-start gap-3">
                                            <i class="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" data-lucide="file"></i>
                                            <span class="text-slate-300">${source}</span>
                                        </div>`
                                    ).join('')}
                                </div>
                            </div>
                        </div>

                        <div class="mb-8">
                            <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <i class="w-5 h-5 text-blue-400" data-lucide="trending-up"></i>
                                Key Benefits
                            </h3>
                            <div class="grid md:grid-cols-2 gap-3">
                                ${useCase.benefits.map(benefit => 
                                    `<div class="flex items-start gap-3 bg-slate-800/30 rounded-lg p-4">
                                        <i class="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" data-lucide="check-circle"></i>
                                        <span class="text-slate-300">${benefit}</span>
                                    </div>`
                                ).join('')}
                            </div>
                        </div>

                        <div class="border-t border-slate-700 pt-6">
                            <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <i class="w-5 h-5 text-blue-400" data-lucide="tags"></i>
                                Related Tags
                            </h3>
                            <div class="flex flex-wrap gap-2">
                                ${useCase.tags.map(tag => 
                                    `<span class="bg-blue-500/10 text-blue-400 px-3 py-2 rounded-full text-sm border border-blue-500/20">${tag}</span>`
                                ).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);
            
            // Initialize Lucide icons in the modal
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            // Close modal handlers
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                }
            });

            modal.querySelector('#close-modal').addEventListener('click', () => {
                document.body.removeChild(modal);
            });

            // Initialize Lucide icons in modal
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        // Event listeners
        industryFilter.addEventListener('change', filterUseCases);
        searchInput.addEventListener('input', filterUseCases);
        clearFilters.addEventListener('click', clearAllFilters);

        // Make clearAllFilters globally available
        window.clearAllFilters = clearAllFilters;

        // Initial render - apply URL filter if present
        if (industryParam) {
            filterUseCases(); // This will apply the URL filter
        } else {
            renderUseCases(allUseCases);
        }
    } else {
        // Show error if data not loaded
        console.log('❌ Use case library: Data not loaded');
        console.log('cardGrid:', cardGrid);
        console.log('window.useCaseData:', typeof window.useCaseData);
        if (typeof window.useCaseData !== 'undefined') {
            console.log('useCaseData.useCases:', window.useCaseData.useCases);
        }
        
        if (cardGrid) {
            cardGrid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-red-400 text-lg mb-4">Error: Use case data could not be loaded</p>
                    <p class="text-slate-400">Please check that the data file is properly loaded.</p>
                </div>
            `;
        }
    }

    // Initialize mobile menu and animations
    initMobileMenu();
    initAnimations();
});
