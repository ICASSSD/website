document.addEventListener('DOMContentLoaded', () => {
    const advisorsContainer = document.getElementById('advisors-container');
    const leadsContainer = document.getElementById('leads-container');

    const teamModal = document.getElementById('team-modal');
    const teamModalOverlay = document.getElementById('team-modal-overlay');
    const closeTeamModalBtn = document.getElementById('close-team-modal');

    // Modal Elements
    const modalImage = document.getElementById('modal-member-image');
    const modalName = document.getElementById('modal-member-name');
    const modalRole = document.getElementById('modal-member-role');
    const modalDept = document.getElementById('modal-member-dept');
    const modalInst = document.getElementById('modal-member-inst');
    const modalBio = document.getElementById('modal-member-bio');

    fetch('data/team.json')
        .then(response => response.json())
        .then(data => {
            renderMembers(data.advisors, advisorsContainer);
            renderMembers(data.leads, leadsContainer);
        })
        .catch(error => console.error('Error loading team data:', error));

    function renderMembers(members, container) {
        if (!container) return;

        container.innerHTML = members.map((member, index) => `
            <div data-member='${JSON.stringify(member).replace(/'/g, "&#39;")}' 
                 class="team-card bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100 text-center group cursor-pointer hover:-translate-y-1">
                <div class="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4 group-hover:bg-primary/10 group-hover:text-primary transition-colors overflow-hidden">
                    ${member.image ? `<img src="${member.image}" alt="${member.name}" class="w-full h-full object-cover">` : '<i class="fas fa-user text-3xl"></i>'}
                </div>
                <h3 class="text-xl font-bold text-dark mb-2">${member.name}</h3>
                <p class="text-primary font-medium text-sm mb-1">${member.role}</p>
                ${member.department ? `<p class="text-gray-500 text-xs">${member.department}</p>` : ''}
                ${member.institution ? `<p class="text-gray-500 text-xs">${member.institution}</p>` : ''}
            </div>
        `).join('');

        // Add click listeners to newly created cards
        const cards = container.querySelectorAll('.team-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const memberData = JSON.parse(card.getAttribute('data-member'));
                openModal(memberData);
            });
        });
    }

    // Chief Advisor Click Logic - Removed (Displayed inline now)

    function openModal(member) {
        modalName.textContent = member.name;
        modalRole.textContent = member.role;
        modalBio.textContent = member.bio || 'Biography not available.';

        // Handle Dept/Inst Tags (Hide if empty)
        if (member.department) {
            modalDept.textContent = member.department;
            modalDept.classList.remove('hidden');
        } else {
            modalDept.classList.add('hidden');
        }

        if (member.institution) {
            modalInst.textContent = member.institution;
            modalInst.classList.remove('hidden');
        } else {
            modalInst.classList.add('hidden');
        }

        if (member.image) {
            modalImage.src = member.image;
            modalImage.alt = member.name;
        } else {
            // Fallback image or icon could be better, but for now simple fallback
            modalImage.src = 'https://via.placeholder.com/400x400?text=No+Image';
        }

        teamModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeModal() {
        teamModal.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Event Listeners for Modal
    if (closeTeamModalBtn) closeTeamModalBtn.addEventListener('click', closeModal);
    if (teamModalOverlay) teamModalOverlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && teamModal && !teamModal.classList.contains('hidden')) {
            closeModal();
        }
    });
});
