document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('schools-container');
    const nav = document.getElementById('year-nav');

    if (container) {
        fetch('../data/research-schools.json')
            .then(response => response.json())
            .then(data => {
                // Render Navigation
                renderNavigation(data);
                // Render Content
                renderSchools(data);
            })
            .catch(error => console.error('Error loading research schools:', error));
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
            // Offset for sticky header
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });

            // Update active nav state (simple implementation)
            const buttons = nav.querySelectorAll('button');
            buttons.forEach(btn => {
                btn.classList.remove('text-teal-700', 'border-teal-700');
                btn.classList.add('text-gray-500', 'border-transparent');
                // Basic text check, could be more robust
                if (btn.textContent.trim() === id.replace('school-', '') /* logic gap here, better to trust user scroll or generic highlight */) {
                    // Keep simple for click-to-scroll
                }
            });
        }
    };

    function isRegistrationOpen(deadlineStr) {
        if (!deadlineStr) return false;
        // Clean date string: remove st, nd, rd, th from day numbers
        // e.g., "May 3rd, 2025" -> "May 3, 2025"
        const cleanDateStr = deadlineStr.replace(/(\d+)(st|nd|rd|th)/, '$1');
        const deadline = new Date(cleanDateStr);
        const now = new Date();

        // Reset hours to compare just dates roughly, or accurate time if needed. 
        // Deadline passed if now > deadline (end of day usually implied, so verify logic)
        // Let's assume deadline is end of that day.
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
                <div class="text-xs text-center text-gray-400">
                    Deadline: ${school.registrationDeadline}
                </div>
            `;
        } else {
            return `
                <button disabled class="block w-full text-center px-4 py-2 bg-gray-100 text-gray-400 text-sm font-bold rounded-lg cursor-not-allowed mb-2">
                    Registration Closed
                </button>
                <div class="text-xs text-center text-gray-400">
                    Deadline: ${school.registrationDeadline}
                </div>
            `;
        }
    }

    function renderSchools(schools) {
        container.innerHTML = schools.map((school, index) => `
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

                        <!-- Schedule (Simplified) -->
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
        `).join('');
    }
});
