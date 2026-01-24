document.addEventListener('DOMContentLoaded', () => {
    // const eventsContainer = document.getElementById('events-container'); // Moved to local scope
    const modal = document.getElementById('event-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDate = document.getElementById('modal-date');
    const modalImage = document.getElementById('modal-image');
    const modalCategory = document.getElementById('modal-category');
    const modalDescription = document.getElementById('modal-description');
    const closeModalBtn = document.getElementById('close-modal');
    const modalOverlay = document.getElementById('modal-overlay');

    const modalActionBtn = document.getElementById('modal-action-btn');

    // Fetch Events Data
    fetch('data/events.json')
        .then(response => response.json())
        .then(data => {
            // Sort events by sortDate descending (newest first)
            const sortedEvents = data.sort((a, b) => new Date(b.sortDate) - new Date(a.sortDate));
            renderEvents(sortedEvents);
        })
        .catch(error => console.error('Error loading events:', error));

    // Default Images by Category
    const categoryDefaults = {
        'Education': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'Community': 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'News': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'Policy': 'https://images.unsplash.com/photo-1526304640152-d4619684e484?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'Conference': 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'Project': 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'default': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' // Generic fallback
    };

    function renderEvents(events) {
        // Try getting both containers
        const homeContainer = document.getElementById('events-container');
        const allEventsContainer = document.getElementById('all-events-container');

        // Determine which container to use and what classes to apply
        let targetContainer = null;
        let cardClasses = '';

        if (homeContainer) {
            targetContainer = homeContainer;
            cardClasses = 'min-w-[85vw] md:min-w-[400px] lg:min-w-[450px] snap-center flex-shrink-0 group relative overflow-hidden rounded-2xl shadow-md cursor-pointer transition-transform duration-300 hover:-translate-y-1';
            targetContainer.innerHTML = '';
        } else if (allEventsContainer) {
            targetContainer = allEventsContainer;
            // distinct classes for grid layout
            cardClasses = 'group relative overflow-hidden rounded-2xl shadow-md cursor-pointer transition-transform duration-300 hover:-translate-y-1';
            targetContainer.innerHTML = '';
        } else {
            return; // No container found
        }

        events.forEach(event => {
            const card = document.createElement('div');
            card.className = cardClasses;

            // Determine initial image URL
            let imageUrl = event.image;
            const defaultUrl = categoryDefaults[event.category] || categoryDefaults['default'];

            if (!imageUrl) {
                imageUrl = defaultUrl;
            }

            // Generate unique ID for the background div to update it if image fails
            const bgDivId = `event-bg-${event.id}`;

            card.innerHTML = `
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>
                
                <div id="${bgDivId}" class="h-96 bg-gray-300 w-full group-hover:scale-105 transition-transform duration-700 bg-cover bg-center"
                    style="background-image: url('${imageUrl}');">
                </div>
                
                <div class="absolute bottom-0 left-0 p-6 z-20 text-white w-full">
                    <div class="flex justify-between items-end mb-2">
                        <span class="inline-block px-3 py-1 bg-accent/90 text-white text-xs font-bold rounded shadow-lg backdrop-blur-sm">
                            ${event.date}
                        </span>
                        <span class="text-xs font-medium bg-white/20 backdrop-blur-md px-2 py-1 rounded text-white/90">
                            ${event.category}
                        </span>
                    </div>
                    
                    <h3 class="text-2xl font-bold mb-2 group-hover:text-accent transition-colors leading-tight">
                        ${event.title}
                    </h3>
                    
                    <p class="text-gray-200 text-sm line-clamp-2 opacity-90 mb-4">
                        ${event.shortDescription}
                    </p>
                    
                    <div class="flex items-center text-accent text-sm font-bold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        Read More <i class="fas fa-arrow-right ml-2"></i>
                    </div>
                </div>
            `;

            // Validate Image Load
            if (imageUrl !== defaultUrl) {
                const imgTester = new Image();
                imgTester.src = imageUrl;
                imgTester.onerror = () => {
                    // If provided image fails, fallback to default
                    const bgElement = card.querySelector(`#${bgDivId}`);
                    if (bgElement) {
                        bgElement.style.backgroundImage = `url('${defaultUrl}')`;
                        // Also update string so modal uses correct one
                        event.image = defaultUrl;
                    }
                };
            }


            // Click event to open modal
            card.addEventListener('click', () => openModal(event));

            targetContainer.appendChild(card);
        });
    }

    function openModal(event) {
        modalTitle.textContent = event.title;
        modalDate.textContent = event.date;
        modalCategory.textContent = event.category;
        modalImage.src = event.image;
        modalDescription.innerHTML = event.longDescription; // Using innerHTML for rich text

        // Handle Action Button
        if (modalActionBtn) {
            if (event.pageLink) {
                modalActionBtn.classList.remove('hidden');
                // Remove previous event listeners by cloning logic or just setting onclick
                // Simple onclick is safest here to avoid stacking listeners
                modalActionBtn.onclick = () => {
                    window.location.href = event.pageLink;
                };
            } else {
                modalActionBtn.classList.add('hidden');
            }
        }

        modal.classList.remove('hidden');
        // Small delay to allow display:block to apply before opacity transition if we were to animate it
        // For now just toggle hidden
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // Scroll Buttons Logic
    const scrollLeftBtn = document.getElementById('scroll-left');
    const scrollRightBtn = document.getElementById('scroll-right');

    if (scrollLeftBtn && scrollRightBtn && document.getElementById('events-container')) {
        const eventsContainer = document.getElementById('events-container');
        scrollLeftBtn.addEventListener('click', () => {
            eventsContainer.scrollBy({
                left: -400,
                behavior: 'smooth'
            });
        });

        scrollRightBtn.addEventListener('click', () => {
            eventsContainer.scrollBy({
                left: 400,
                behavior: 'smooth'
            });
        });
    }
});
