document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('schools-container');
    const nav = document.getElementById('year-nav');

    // Modal Elements
    const pubModal = document.getElementById('publications-modal');
    const closePubBtn = document.getElementById('close-pub-modal');
    const pubOverlay = document.getElementById('pub-modal-overlay');
    const pubImage = document.getElementById('pub-image');
    const pubTitle = document.getElementById('pub-title');
    const pubAuthors = document.getElementById('pub-authors');
    const pubAbstract = document.getElementById('pub-abstract');
    const pubLink = document.getElementById('pub-link');
    const pubCounter = document.getElementById('pub-counter');
    const nextBtns = [document.getElementById('pub-next-btn'), document.getElementById('pub-next-btn-mobile')];
    const prevBtns = [document.getElementById('pub-prev-btn'), document.getElementById('pub-prev-btn-mobile')];

    // State
    let currentPublications = [];
    let currentIndex = 0;

    if (container) {
        Promise.all([
            fetch('../data/research-schools.json').then(res => res.json()),
            fetch('../data/publications.json').then(res => res.json())
        ])
            .then(([schoolsData, publicationsData]) => {
                // Render Navigation
                renderNavigation(schoolsData);
                // Render Content
                renderSchools(schoolsData, publicationsData);
            })
            .catch(error => console.error('Error loading data:', error));
    }

    function renderNavigation(schools) {
        nav.innerHTML = schools.map((school, index) => `
            <button onclick="scrollToSchool('${school.id}')" 
                class="px-4 py-2 font-bold text-gray-500 hover:text-teal-600 transition-colors border-b-2 border-transparent hover:border-teal-600 focus:outline-none whitespace-nowrap ${index === 0 ? 'text-teal-700 border-teal-700' : ''}">
                ${school.year}
            </button>
        `).join('');
    }

    // Expose scroll function globally
    window.scrollToSchool = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });

            // Note: Active state updating logic omitted for brevity
        }
    };

    function isRegistrationOpen(deadlineStr) {
        if (!deadlineStr) return false;
        const cleanDateStr = deadlineStr.replace(/(\d+)(st|nd|rd|th)/, '$1');
        const deadline = new Date(cleanDateStr);
        const now = new Date();
        deadline.setHours(23, 59, 59, 999);
        return !isNaN(deadline) && now <= deadline;
    }

    function renderApplyButton(school) {
        const isOpen = isRegistrationOpen(school.registrationDeadline);

        if (school.applyLink && isOpen) {
            return `
                <a href="${school.applyLink}" target="_blank" class="block w-full text-center px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-dark transition-colors mb-2">
                    Apply Now
                </a>
                <div class="text-xs text-center text-gray-400 mb-4">
                    Deadline: ${school.registrationDeadline}
                </div>
            `;
        } else {
            return `
                <button disabled class="block w-full text-center px-4 py-2 bg-gray-100 text-gray-400 text-sm font-bold rounded-lg cursor-not-allowed mb-2">
                    Registration Closed
                </button>
                <div class="text-xs text-center text-gray-400 mb-4">
                    Deadline: ${school.registrationDeadline}
                </div>
            `;
        }
    }

    function renderSchools(schools, publicationsMap) {
        container.innerHTML = schools.map((school, index) => {
            const hasPublications = publicationsMap[school.id] && publicationsMap[school.id].length > 0;

            // We need to pass the school ID to the global scope or handle the click here. 
            // Since innerHTML clears listeners, we'll use onclick attribute or delegate.
            // But strict CSP might block onclick. Ideally use delegation. 
            // For now, attaching the data to a data-attribute and using a global handler or delegation.
            // Let's use a global handler for simplicity in this context.
            window.openPubs = (schoolId) => {
                if (publicationsMap[schoolId]) {
                    currentPublications = publicationsMap[schoolId];
                    currentIndex = 0;
                    updateModalContent();
                    pubModal.classList.remove('hidden');
                    document.body.style.overflow = 'hidden';
                }
            };

            return `
            <section id="${school.id}" class="scroll-mt-32">
                <div class="lg:grid lg:grid-cols-12 gap-12 items-start">
                    <!-- Sidebar: Year & Quick Info -->
                    <div class="lg:col-span-3 lg:sticky lg:top-32 mb-8 lg:mb-0">
                        <div class="text-6xl font-black text-gray-100 mb-4 select-none -ml-4">${school.year}</div>
                        <div class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                             <div class="mb-4">
                                <span class="block text-xs font-bold text-gray-400 uppercase tracking-wider">Duration</span>
                                <span class="text-sm font-semibold text-teal-600">${school.date}</span>
                            </div>
                            <div class="mb-4">
                                <span class="block text-xs font-bold text-gray-400 uppercase tracking-wider">Theme</span>
                                <span class="text-sm font-semibold text-dark">${school.theme}</span>
                            </div>
                            
                            ${school.flyer ? `
                                <a href="${school.flyer}" target="_blank" class="flex items-center justify-center w-full px-4 py-2 bg-teal-50 text-teal-700 text-sm font-bold rounded-lg hover:bg-teal-100 transition-colors mb-4 border border-teal-200">
                                    <i class="fas fa-file-pdf mr-2"></i> Download Flyer
                                </a>
                            ` : ''}

                            ${renderApplyButton(school)}

                            ${hasPublications ? `
                                <button onclick="openPubs('${school.id}')" class="flex items-center justify-center w-full px-4 py-2 bg-white text-dark text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors border-2 border-gray-200">
                                    <i class="fas fa-book-open mr-2 text-teal-500"></i> Publications
                                </button>
                            ` : ''}
                        </div>
                    </div>

                    <!-- Main Content -->
                    <div class="lg:col-span-9">
                        <h2 class="text-3xl md:text-4xl font-bold text-dark mb-6">${school.title}</h2>
                        <p class="text-xl text-gray-600 mb-10 leading-relaxed font-light border-l-4 border-teal-200 pl-6">
                            ${school.description}
                        </p>

                        <div class="grid md:grid-cols-2 gap-8 mb-12">
                            <!-- Objectives -->
                            <div class="bg-gray-50 rounded-2xl p-8">
                                <h3 class="text-lg font-bold text-dark mb-4 flex items-center">
                                    <i class="fas fa-bullseye text-teal-500 mr-3"></i> Objectives
                                </h3>
                                <ul class="space-y-3">
                                    ${school.objectives.map(obj => `
                                        <li class="flex items-start text-gray-600 text-sm">
                                            <i class="fas fa-check text-teal-400 mt-1 mr-2 text-xs"></i>
                                            ${obj}
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>

                            <!-- Topics -->
                            <div class="bg-gray-50 rounded-2xl p-8">
                                <h3 class="text-lg font-bold text-dark mb-4 flex items-center">
                                    <i class="fas fa-lightbulb text-amber-500 mr-3"></i> Key Topics
                                </h3>
                                <div class="flex flex-wrap gap-2">
                                    ${school.topics.map(topic => `
                                        <span class="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600">
                                            ${topic}
                                        </span>
                                    `).join('')}
                                </div>
                            </div>
                        </div>

                        <!-- Schedule Highlights -->
                        <div class="mb-8">
                             <h3 class="text-xl font-bold text-dark mb-6">Schedule Highlights</h3>
                             <div class="relative border-l-2 border-gray-200 ml-3 space-y-8">
                                ${school.schedule.map(item => `
                                    <div class="relative pl-8">
                                        <div class="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-teal-200"></div>
                                        <div class="text-sm font-bold text-teal-600 mb-1">${item.date}</div>
                                        <div class="text-gray-700 font-medium">${item.event}</div>
                                    </div>
                                `).join('')}
                             </div>
                        </div>
                    </div>
                </div>
                ${index !== schools.length - 1 ? '<hr class="border-gray-100 my-16">' : ''}
            </section>
            `;
        }).join('');
    }

    // Modal Navigation Logic
    function updateModalContent() {
        if (currentPublications.length === 0) return;
        const pub = currentPublications[currentIndex];

        pubImage.src = pub.image || 'https://via.placeholder.com/600x400?text=No+Image';
        pubTitle.textContent = pub.title;
        pubAuthors.textContent = pub.authors;
        pubAbstract.textContent = pub.abstract;
        pubLink.href = pub.link;

        // Update Counter
        if (pubCounter) {
            pubCounter.textContent = `Publication ${currentIndex + 1} of ${currentPublications.length}`;
        }

        // Button visibility (optional: could just loop indefinitely or disable at ends)
        // Let's loop indefinitely for smooth carousel feel
    }

    function nextPub() {
        if (currentPublications.length <= 1) return;
        currentIndex = (currentIndex + 1) % currentPublications.length;
        updateModalContent();
    }

    function prevPub() {
        if (currentPublications.length <= 1) return;
        currentIndex = (currentIndex - 1 + currentPublications.length) % currentPublications.length;
        updateModalContent();
    }

    const closeModal = () => {
        pubModal.classList.add('hidden');
        document.body.style.overflow = '';
    };

    // Event Listeners
    if (closePubBtn) closePubBtn.addEventListener('click', closeModal);
    if (pubOverlay) pubOverlay.addEventListener('click', closeModal);

    nextBtns.forEach(btn => {
        if (btn) btn.addEventListener('click', (e) => {
            e.stopPropagation();
            nextPub();
        });
    });

    prevBtns.forEach(btn => {
        if (btn) btn.addEventListener('click', (e) => {
            e.stopPropagation();
            prevPub();
        });
    });

    document.addEventListener('keydown', (e) => {
        if (pubModal && !pubModal.classList.contains('hidden')) {
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowRight') nextPub();
            if (e.key === 'ArrowLeft') prevPub();
        }
    });

});
