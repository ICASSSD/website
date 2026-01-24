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
        card.className = 'bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col md:flex-row transform hover:-translate-y-1 transition-all duration-300 cursor-pointer group';
        card.innerHTML = `
            <div class="md:w-1/3 h-64 md:h-auto relative">
                <img src="${talk.speakerImage}" alt="${talk.speaker}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <div>
                        <span class="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded mb-2">Upcoming</span>
                        <h3 class="text-white font-bold text-lg">${talk.speaker}</h3>
                    </div>
                </div>
            </div>
            <div class="p-8 md:w-2/3 flex flex-col justify-center">
                <div class="flex items-center text-sm text-gray-500 mb-4">
                    <i class="far fa-calendar-alt mr-2 text-primary"></i> ${talk.date}
                </div>
                <h2 class="text-2xl font-bold text-dark mb-4 group-hover:text-primary transition-colors">${talk.title}</h2>
                <p class="text-gray-600 mb-6 line-clamp-3">${talk.summary || talk.abstract}</p> 
                
                <div class="mt-auto flex items-center text-primary font-bold text-sm uppercase tracking-wide">
                    Read More <i class="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                </div>
            </div>
        `;

        card.addEventListener('click', () => openModal(talk));
        return card;
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
                <p class="text-sm text-primary font-medium mb-3">${talk.speaker}</p>
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
        modalImg.src = talk.speakerImage;
        modalSpeaker.textContent = talk.speaker;
        modalDate.textContent = talk.date;
        modalTitle.textContent = talk.title;
        modalAbstract.textContent = talk.abstract;
        modalBio.textContent = talk.bio;

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

        // Placeholder logic if neither are present
        if (!talk.videoLink && !talk.posterLink) {
            modalVideoPlaceholder.classList.remove('hidden');
            modalVideoPlaceholder.textContent = 'Resources not yet available.';
        } else if (!talk.videoLink && talk.posterLink) {
            // If only poster is available, maybe hide placeholder or say "Recording not available"?
            // Let's just hide placeholder if at least one resource is there.
            modalVideoPlaceholder.classList.add('hidden');
        } else {
            modalVideoPlaceholder.classList.add('hidden');
        }


        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

});
