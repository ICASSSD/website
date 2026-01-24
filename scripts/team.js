document.addEventListener('DOMContentLoaded', () => {
    const advisorsContainer = document.getElementById('advisors-container');
    const leadsContainer = document.getElementById('leads-container');

    fetch('data/team.json')
        .then(response => response.json())
        .then(data => {
            renderMembers(data.advisors, advisorsContainer);
            renderMembers(data.leads, leadsContainer);
        })
        .catch(error => console.error('Error loading team data:', error));

    function renderMembers(members, container) {
        if (!container) return;

        container.innerHTML = members.map(member => `
            <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100 text-center group">
                <div class="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    ${member.image ? `<img src="${member.image}" alt="${member.name}" class="w-full h-full rounded-full object-cover">` : '<i class="fas fa-user text-3xl"></i>'}
                </div>
                <h3 class="text-xl font-bold text-dark mb-2">${member.name}</h3>
                <p class="text-primary font-medium text-sm mb-1">${member.role}</p>
                ${member.department ? `<p class="text-gray-500 text-xs">${member.department}</p>` : ''}
                ${member.institution ? `<p class="text-gray-500 text-xs">${member.institution}</p>` : ''}
            </div>
        `).join('');
    }
});
