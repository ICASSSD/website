document.addEventListener('DOMContentLoaded', () => {
    // Determine base path for assets/links based on current location
    // Check for both 'blogs' and 'events' directories
    const isNested = window.location.pathname.includes('/blogs/') || window.location.pathname.includes('/events/');
    const basePath = isNested ? '../' : '';

    // --- Dynamic Favicon ---
    // Remove any existing favicons to force update
    const existingIcons = document.querySelectorAll("link[rel*='icon']");
    existingIcons.forEach(el => el.remove());

    const link = document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    // Add timestamp to force cache clear
    link.href = `${basePath}images/logo2_white.png?v=${new Date().getTime()}`;
    document.head.appendChild(link);

    // Add <!-- <link rel="stylesheet" href="styles/style.css"> -->
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = `${basePath}styles/style.css?v=${new Date().getTime()}`;
    document.head.appendChild(style);

    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    if (navbarPlaceholder) {
        // Active Tab Logic
        const currentPath = window.location.pathname;

        // Indicator Style
        const getIndicatorClass = (path) => {
            const base = "font-medium transition-colors border-b-2 pb-1";
            const activeClass = "text-primary border-primary";
            const inactiveClass = "text-gray-600 hover:text-primary border-transparent hover:border-gray-200";

            if (path === 'home' && (currentPath.endsWith('index.html') || currentPath === '/' || currentPath.endsWith('/'))) return `${activeClass} ${base}`;
            if (path === 'events' && currentPath.includes('events')) return `${activeClass} ${base}`;
            if (path === 'team' && currentPath.includes('team.html')) return `${activeClass} ${base}`;
            if (path === 'partnership' && currentPath.includes('partnership.html')) return `${activeClass} ${base}`;
            if (path === 'blog' && currentPath.includes('blog.html')) return `${activeClass} ${base}`;
            if (path === 'publications' && currentPath.includes('publications.html')) return `${activeClass} ${base}`;

            return `${inactiveClass} ${base}`;
        };

        navbarPlaceholder.innerHTML = `
        <nav class="fixed w-full z-50 glass-nav transition-all duration-300" id="navbar">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-20">
                    <div class="flex-shrink-0 flex items-center">
                        <a href="${basePath}index.html"
                            class="flex items-center gap-3 text-2xl font-bold tracking-tighter text-dark hover:text-primary transition-colors">
                            <img src="${basePath}images/logo2.png" alt="ICASSSD Logo" class="h-10 w-auto">
                            <span>ICASSSD</span>
                        </a>
                    </div>
                    <div class="hidden md:flex space-x-6 lg:space-x-8 items-center">
                        <a href="${basePath}index.html" class="${getIndicatorClass('home')}">Home</a>
                        <a href="${basePath}events.html" class="${getIndicatorClass('events')}">Events</a>
                        <a href="${basePath}team.html" class="${getIndicatorClass('team')}">Team</a>
                        <a href="${basePath}partnership.html" class="${getIndicatorClass('partnership')}">Partnership</a>
                        <a href="${basePath}blog.html" class="${getIndicatorClass('blog')}">Blog</a>
                        <a href="${basePath}publications.html" class="${getIndicatorClass('publications')}">Publications</a>
                        
                        <!-- Options Dropdown -->
                        <div class="relative ml-2 group">
                            <button id="more-options-btn" class="text-gray-600 hover:text-primary focus:outline-none p-2 rounded-full hover:bg-gray-100 transition-colors">
                                <i class="fas fa-bars text-lg"></i>
                            </button>
                            <!-- Dropdown Menu -->
                            <div id="more-options-menu" class="hidden absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 transform origin-top-right transition-all">
                                <div class="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Events</div>
                                <a href="${basePath}events/aisg.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-primary">
                                    <i class="fas fa-robot w-5 mr-1"></i> AI for Social Good
                                </a>
                                <a href="${basePath}events/research-school.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-primary">
                                    <i class="fas fa-graduation-cap w-5 mr-1"></i> Research Schools
                                </a>
                                <div class="border-t border-gray-100 my-1"></div>
                                <a href="${basePath}about.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-primary">
                                    <i class="fas fa-info-circle w-5"></i> About Us
                                </a>
                                <a href="https://forms.gle/D2Ueua9ELjv7ebzN6" target="_blank" class="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-primary">
                                    <i class="fas fa-user-plus w-5"></i> Member Sign Up
                                </a>
                            </div>
                        </div>
                    </div>
                    <!-- Mobile menu button -->
                    <div class="md:hidden flex items-center">
                        <button id="mobile-menu-btn" class="text-gray-600 hover:text-primary focus:outline-none">
                            <i class="fas fa-bars text-2xl"></i>
                        </button>
                    </div>
                </div>
            </div>
            <!-- Mobile Menu (Hidden by default) -->
            <div id="mobile-menu" class="hidden md:hidden bg-white/95 backdrop-blur-md absolute w-full left-0 top-20 border-b border-gray-100 shadow-lg max-h-[80vh] overflow-y-auto">
                <div class="px-4 pt-2 pb-4 space-y-2">
                    <a href="${basePath}index.html" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-teal-50">Home</a>
                    <a href="${basePath}events.html" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-teal-50">All Events</a>
                    <a href="${basePath}team.html" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-teal-50">Team</a>
                    <a href="${basePath}partnership.html" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-teal-50">Partnership</a>
                    <a href="${basePath}blog.html" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-teal-50">Blog</a>
                    <a href="${basePath}publications.html" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-teal-50">Publications</a>
                    
                    <div class="border-t border-gray-100 my-1"></div>
                    <div class="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">More Events</div>
                    <a href="${basePath}events/aisg.html" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-teal-50 pl-6">AI for Social Good</a>
                    <a href="${basePath}events/research-school.html" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-teal-50 pl-6">Research Schools</a>
                    
                    <div class="border-t border-gray-100 my-1"></div>
                    <a href="${basePath}about.html" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-teal-50">About Us</a>
                    <a href="https://forms.gle/D2Ueua9ELjv7ebzN6" target="_blank" class="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-teal-50 font-bold">Member Sign Up</a>
                </div>
            </div>
        </nav>
        `;

        // Mobile Menu Logic
        const btn = document.getElementById('mobile-menu-btn');
        const menu = document.getElementById('mobile-menu');

        if (btn && menu) {
            btn.addEventListener('click', () => {
                menu.classList.toggle('hidden');
            });
        }

        // More Options Dropdown Logic
        const optionsBtn = document.getElementById('more-options-btn');
        const optionsMenu = document.getElementById('more-options-menu');

        if (optionsBtn && optionsMenu) {
            optionsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                optionsMenu.classList.toggle('hidden');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!optionsBtn.contains(e.target) && !optionsMenu.contains(e.target)) {
                    optionsMenu.classList.add('hidden');
                }
            });
        }
    }



    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = `
        <footer id="contact" class="bg-dark text-white pt-20 pb-10">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <!-- Brand -->
                    <div class="col-span-1 lg:col-span-1">
                        <h2 class="text-2xl font-bold mb-6">ICASSSD</h2>
                        <p class="text-gray-400 text-sm leading-relaxed mb-6">
                            International Centre for Applied System Science for Sustainable Development.
                        </p>
                        <div class="flex space-x-4">
                            <!-- LinkedIn -->
                            <a href="https://www.linkedin.com/company/icasssd/" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                <i class="fab fa-linkedin-in"></i>
                            </a>
                        </div>
                    </div>

                    <!-- Links -->
                    <div>
                        <h3 class="text-lg font-bold mb-6">Quick Links</h3>
                        <ul class="space-y-3 text-sm text-gray-400">
                            <li><a href="${basePath}index.html" class="hover:text-white transition-colors">Home</a></li>
                            <li><a href="${basePath}events.html" class="hover:text-white transition-colors">All Events</a></li>
                            <li><a href="${basePath}team.html" class="hover:text-white transition-colors">Team</a></li>
                            <li><a href="${basePath}partnership.html" class="hover:text-white transition-colors">Partnership</a></li>
                            <li><a href="${basePath}blog.html" class="hover:text-white transition-colors">Blog</a></li>
                            <li><a href="https://forms.gle/D2Ueua9ELjv7ebzN6" target="_blank" class="hover:text-white transition-colors">Member Sign Up</a></li>
                        </ul>
                    </div>

                    <!-- Events -->
                    <div>
                        <h3 class="text-lg font-bold mb-6">Events</h3>
                        <ul class="space-y-3 text-sm text-gray-400">
                            <li><a href="${basePath}events/research-school.html" class="hover:text-white transition-colors">Research Schools</a></li>
                            <li><a href="${basePath}events/aisg.html" class="hover:text-white transition-colors">AI for Social Good</a></li>
                        </ul>
                    </div>

                    <!-- Contact -->
                    <div>
                        <h3 class="text-lg font-bold mb-6">Connect</h3>
                        <ul class="space-y-4 text-sm text-gray-400">
                            <li class="flex items-start">
                                <i class="fas fa-map-marker-alt mt-1 mr-3 text-secondary"></i>
                                <span>34 Eagle Hill, Cambridge, ON N3C 2C9, Canada</span>
                            </li>
                            <li class="flex items-center">
                                <i class="fas fa-envelope mr-3 text-secondary"></i>
                                <a href="mailto:info@icasssd.org" class="hover:text-white">info@icasssd.org</a>
                            </li>
                            <!-- Work with us CTA -->
                            <li class="pt-4 mt-4 border-t border-gray-800">
                                <span class="block text-gray-500 mb-2 text-xs uppercase tracking-wide">Work with us</span>
                                <a href="mailto:careers@icasssd.org?subject=Interest%20in%20Working%20with%20ICASSSD" class="inline-flex items-center text-secondary hover:text-white transition-colors font-semibold">
                                    Send us an email <i class="fas fa-arrow-right ml-2 text-xs"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
        `;
    }
});
