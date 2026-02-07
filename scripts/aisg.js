document.addEventListener('DOMContentLoaded', () => {
    const upcomingContainer = document.getElementById('upcoming-talks-container');
    const pastContainer = document.getElementById('past-talks-container');

    // Modal Elements
    const modal = document.getElementById('talk-modal');
    const closeBtn = document.getElementById('close-talk-modal');
    const overlay = document.getElementById('talk-modal-overlay');

    // Modal Content Elements
    const modalImg = document.getElementById('modal-speaker-image');
    const modalSpeaker = document.getElementById('modal-speaker-name');
    const modalDate = document.getElementById('modal-date');
    const modalTitle = document.getElementById('modal-title');
    const modalAbstract = document.getElementById('modal-abstract');
    const modalBio = document.getElementById('modal-bio');
    const modalVideoBtn = document.getElementById('modal-video-btn');
    const modalPosterBtn = document.getElementById('modal-poster-btn');
    const modalVideoPlaceholder = document.getElementById('modal-video-placeholder');

    // Tab Elements
    const tabAbstract = document.getElementById('tab-abstract');
    const tabBio = document.getElementById('tab-bio');
    const contentAbstract = document.getElementById('content-abstract');
    const contentBio = document.getElementById('content-bio');

    function switchTab(tab) {
        if (tab === 'abstract') {
            tabAbstract.classList.add('border-primary', 'text-primary', 'font-bold');
            tabAbstract.classList.remove('border-transparent', 'text-gray-500', 'font-medium');

            tabBio.classList.remove('border-primary', 'text-primary', 'font-bold');
            tabBio.classList.add('border-transparent', 'text-gray-500', 'font-medium');

            contentAbstract.classList.remove('hidden');
            contentBio.classList.add('hidden');
        } else {
            tabBio.classList.add('border-primary', 'text-primary', 'font-bold');
            tabBio.classList.remove('border-transparent', 'text-gray-500', 'font-medium');

            tabAbstract.classList.remove('border-primary', 'text-primary', 'font-bold');
            tabAbstract.classList.add('border-transparent', 'text-gray-500', 'font-medium');

            contentBio.classList.remove('hidden');
            contentAbstract.classList.add('hidden');
        }
    }

    if (tabAbstract && tabBio) {
        tabAbstract.addEventListener('click', () => switchTab('abstract'));
        tabBio.addEventListener('click', () => switchTab('bio'));
    }

    if (upcomingContainer || pastContainer) {
        fetch('../data/aisg-talks.json')
            .then(response => response.json())
            .then(data => {
                renderTalks(data);
            })
            .catch(error => console.error('Error loading talks:', error));
    }

    function renderTalks(talks) {
        const upcomingTalks = talks.filter(talk => talk.type === 'upcoming');
        const pastTalks = talks.filter(talk => talk.type === 'past');

        if (upcomingContainer) {
            if (upcomingTalks.length === 0) {
                upcomingContainer.innerHTML = '<p class="text-gray-500 text-center italic w-full">No upcoming talks scheduled at the moment.</p>';
            } else {
                upcomingContainer.innerHTML = '';
                upcomingTalks.forEach(talk => {
                    const card = createUpcomingCard(talk);
                    upcomingContainer.appendChild(card);

                    // Initialize carousel if present
                    const carouselEl = card.querySelector('.group\\/carousel');
                    if (carouselEl && carouselEl.id) {
                        initCarousel(carouselEl.id, talk.speakers.length);
                    }
                });
            }
        }

        if (pastContainer) {
            if (pastTalks.length === 0) {
                pastContainer.innerHTML = '<p class="text-gray-500 text-center italic w-full">No past talks available.</p>';
            } else {
                pastContainer.innerHTML = '';
                pastTalks.forEach(talk => {
                    const card = createPastCard(talk);
                    pastContainer.appendChild(card);
                });
            }
        }
    }

    function createUpcomingCard(talk) {
        const card = document.createElement('div');
        // Added md:min-h-[24rem] and md:max-h-[32rem] for size constraints
        card.className = 'bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col md:flex-row transform hover:-translate-y-1 transition-all duration-300 cursor-pointer group md:min-h-[24rem] md:max-h-[32rem]';

        let mediaHtml = '';
        if (talk.speakers && talk.speakers.length > 1) {
            // Create Carousel
            const carouselObj = createWebCarousel(talk.speakers);
            mediaHtml = carouselObj.html;
        } else {
            // Single Speaker
            const speakerName = talk.speakers ? talk.speakers[0].name : talk.speaker;
            const speakerImg = talk.speakers ? talk.speakers[0].image : talk.speakerImage;

            mediaHtml = `
            <div class="relative w-full h-full">
                <img src="${speakerImg}" alt="${speakerName}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <div>
                        <span class="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded mb-2">Upcoming</span>
                        <h3 class="text-white font-bold text-lg">${speakerName}</h3>
                    </div>
                </div>
            </div>`;
        }


        // Updated widths: md:w-1/3 -> md:w-2/5 (40%) and md:w-2/3 -> md:w-3/5 (60%)
        // Increased mobile height: h-64 -> h-72
        card.innerHTML = `
            <div class="md:w-2/5 h-72 md:h-auto relative bg-gray-200 shrink-0">
                ${mediaHtml}
            </div>
            <div class="p-8 md:w-3/5 flex flex-col justify-center h-full">
                <div class="flex items-center text-sm text-gray-500 mb-4">
                    <i class="far fa-calendar-alt mr-2 text-primary"></i> ${talk.date}
                </div>
                <h2 class="text-2xl font-bold text-dark mb-4 group-hover:text-primary transition-colors">${talk.title}</h2>
                <p class="text-gray-600 mb-6 line-clamp-4">${talk.summary || talk.abstract}</p> 
                
                <div class="mt-auto flex items-center text-primary font-bold text-sm uppercase tracking-wide">
                    Read More <i class="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                </div>
            </div>
        `;

        card.addEventListener('click', (e) => {
            // Don't open modal if clicking carousel controls
            if (e.target.closest('.carousel-control')) return;
            openModal(talk);
        });
        return card;
    }

    function createWebCarousel(speakers, isModal = false) {
        const carouselId = `carousel-${Math.random().toString(36).substr(2, 9)}`;
        const slidesHtml = speakers.map((speaker, index) => `
            <div class="absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${index === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}" data-index="${index}">
                <img src="${speaker.image}" alt="${speaker.name}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 md:p-8">
                    <div>
                        ${!isModal ? '<span class="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded mb-2">Upcoming</span>' : ''}
                        <h3 class="text-white ${isModal ? 'text-xl' : 'text-lg'} font-bold leading-tight">${speaker.name}</h3>
                        ${isModal ? '<p class="text-indigo-200 text-sm mt-1">Speaker</p>' : ''}
                    </div>
                </div>
            </div>
        `).join('');

        // Next Button
        const controlsHtml = `
            <button class="carousel-control absolute bottom-4 right-4 z-20 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white flex items-center justify-center transition-all" onclick="(function(e){ e.stopPropagation(); nextSlide('${carouselId}'); })(event)">
                <i class="fas fa-chevron-right text-xs"></i>
            </button>
        `;

        const html = `
            <div id="${carouselId}" class="w-full h-full relative overflow-hidden group/carousel">
                ${slidesHtml}
                ${controlsHtml}
            </div>
        `;

        return { html, id: carouselId };
    }

    // Helper to join speaker names
    function getSpeakerNames(talk) {
        if (talk.speakers) {
            return talk.speakers.map(s => s.name).join(', ');
        }
        return talk.speaker;
    }


    function createPastCard(talk) {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer group';
        card.innerHTML = `
            <div class="aspect-video bg-gray-100 relative">
                <!-- YouTube Thumbnail -->
                ${getYouTubeEmbedOrThumbnail(talk.videoLink, talk.title)}
            </div>
            <div class="p-6">
                <div class="flex justify-between items-start mb-2">
                    <span class="text-xs font-bold text-gray-400 uppercase tracking-wide">${talk.date}</span>
                </div>
                <h3 class="text-lg font-bold text-dark mb-2 group-hover:text-primary transition-colors">${talk.title}</h3>
                <p class="text-sm text-primary font-medium mb-3">${getSpeakerNames(talk)}</p>
                <p class="text-sm text-gray-600 line-clamp-3 mb-4">${talk.summary || talk.abstract}</p>
                <span class="inline-flex items-center text-sm text-gray-400 font-medium group-hover:text-primary transition-colors">
                    View Details <i class="fas fa-info-circle ml-2"></i>
                </span>
            </div>
        `;

        card.addEventListener('click', (e) => {
            openModal(talk);
        });
        return card;
    }

    function getYouTubeEmbedOrThumbnail(url, title) {
        if (!url) return `<div class="w-full h-full flex items-center justify-center text-gray-400"><i class="fas fa-video-slash"></i></div>`;

        let videoId = '';
        try {
            const urlObj = new URL(url);
            videoId = urlObj.searchParams.get("v");
        } catch (e) {
            console.error('Invalid URL:', url);
        }

        if (videoId) {
            return `
                <img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" alt="${title}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div class="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-primary shadow-lg transform group-hover:scale-110 transition-transform">
                        <i class="fas fa-play pl-1"></i>
                    </div>
                </div>
            `;
        }
        return `<div class="w-full h-full bg-gray-200"></div>`;
    }

    // Modal Logic
    function openModal(talk) {
        // Handle Modal Image/Carousel
        // Select the left column dynamically to ensure we get the current valid element
        const leftCol = modal.querySelector('.md\\:col-span-1');

        // Reset left column content
        leftCol.innerHTML = '';

        if (talk.speakers && talk.speakers.length > 1) {
            // Multi-speaker: Inject Carousel
            const carouselObj = createWebCarousel(talk.speakers, true);
            leftCol.innerHTML = carouselObj.html;

            // Initialize immediately
            setTimeout(() => {
                initCarousel(carouselObj.id, talk.speakers.length);
            }, 0);

        } else {
            // Single speaker: Standard Image Layout
            const speakerName = talk.speakers ? talk.speakers[0].name : talk.speaker;
            const speakerImg = talk.speakers ? talk.speakers[0].image : talk.speakerImage;

            leftCol.innerHTML = `
                <img id="modal-speaker-image" src="${speakerImg}" alt="Speaker" class="absolute inset-0 w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-indigo-900/90 to-transparent flex flex-col justify-end p-6 md:p-8">
                    <h3 id="modal-speaker-name" class="text-white text-xl font-bold leading-tight">${speakerName}</h3>
                    <p class="text-indigo-200 text-sm mt-1">Speaker</p>
                </div>
            `;
            // Re-assign references if needed, but we just replaced innerHTML
        }

        modalDate.textContent = talk.date;
        modalTitle.textContent = talk.title;
        modalAbstract.textContent = talk.abstract;

        // Handle Bios
        if (talk.speakers && talk.speakers.length > 0) {
            // Check if we have individual bios
            const hasIndividualBios = talk.speakers.some(s => s.bio);

            if (hasIndividualBios) {
                modalBio.innerHTML = talk.speakers.map(s => `
                    <div class="mb-8 last:mb-0">
                        <div class="flex items-center gap-3 mb-2">
                            <div class="w-1 h-6 bg-primary rounded-full"></div>
                            <h4 class="font-bold text-lg text-dark">${s.name}</h4>
                        </div>
                        <p class="text-gray-600 leading-relaxed">${s.bio || 'Bio not available.'}</p>
                    </div>
                `).join('');
            } else {
                // Fallback to main bio or generic
                modalBio.textContent = talk.bio || "Bio not available.";
            }
        } else {
            modalBio.textContent = talk.bio;
        }


        // Reset to Abstract tab
        switchTab('abstract');

        // Video Button logic
        if (talk.videoLink) {
            modalVideoBtn.href = talk.videoLink;
            modalVideoBtn.classList.remove('hidden');
            modalVideoBtn.classList.add('inline-flex');
        } else {
            modalVideoBtn.classList.add('hidden');
            modalVideoBtn.classList.remove('inline-flex');
        }

        // Poster Button logic
        if (talk.posterLink) {
            modalPosterBtn.href = talk.posterLink;
            modalPosterBtn.classList.remove('hidden');
            modalPosterBtn.classList.add('inline-flex');
        } else {
            modalPosterBtn.classList.add('hidden');
            modalPosterBtn.classList.remove('inline-flex');
        }

        // Placeholder logic
        if (!talk.videoLink && !talk.posterLink) {
            modalVideoPlaceholder.classList.remove('hidden');
            modalVideoPlaceholder.textContent = 'Resources not yet available.';
        } else {
            modalVideoPlaceholder.classList.add('hidden');
        }


        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = '';

        // Stop any running carousels in the modal to save resources
        // We can do this by iterating window.carousels and stopping non-card ones, 
        // or just letting them run (low impact). 
        // For robustness, let's clear all intervals that are not upcoming card ones? 
        // Simpler: just leave it, overhead is low.
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

});

// Global Carousel Functions
window.carousels = {};

function initCarousel(id, count) {
    if (!document.getElementById(id)) return;

    window.carousels[id] = {
        currentIndex: 0,
        count: count,
        interval: null
    };

    startCarousel(id);

    const el = document.getElementById(id);
    el.addEventListener('mouseenter', () => stopCarousel(id));
    el.addEventListener('mouseleave', () => startCarousel(id));
}

function startCarousel(id) {
    if (!window.carousels[id]) return;
    if (window.carousels[id].interval) clearInterval(window.carousels[id].interval);

    window.carousels[id].interval = setInterval(() => {
        nextSlide(id);
    }, 3000); // 3 seconds rotation
}

function stopCarousel(id) {
    if (!window.carousels[id]) return;
    if (window.carousels[id].interval) {
        clearInterval(window.carousels[id].interval);
        window.carousels[id].interval = null;
    }
}

function nextSlide(id) {
    const state = window.carousels[id];
    if (!state) return;

    const nextIndex = (state.currentIndex + 1) % state.count;

    // Update DOM
    const container = document.getElementById(id);
    if (!container) return; // Safety check

    const slides = container.querySelectorAll('[data-index]');

    slides.forEach((slide, idx) => {
        if (idx === nextIndex) {
            slide.classList.remove('opacity-0', 'z-0');
            slide.classList.add('opacity-100', 'z-10');
        } else {
            slide.classList.remove('opacity-100', 'z-10');
            slide.classList.add('opacity-0', 'z-0');
        }
    });

    state.currentIndex = nextIndex;
}
