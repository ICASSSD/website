document.addEventListener('DOMContentLoaded', () => {
    const blogGrid = document.getElementById('blog-grid');
    const homeBlogGrid = document.getElementById('home-blog-grid');

    if (blogGrid || homeBlogGrid) {
        fetch('data/blog.json')
            .then(response => response.json())
            .then(data => {
                if (blogGrid) {
                    renderBlogs(data, blogGrid);
                }
                if (homeBlogGrid) {
                    // Sort by date descending if needed, or just take first 3 assuming sorted
                    // For now, take first 3
                    const recentBlogs = data.slice(0, 3);
                    renderBlogs(recentBlogs, homeBlogGrid);
                }
            })
            .catch(error => console.error('Error loading blog data:', error));
    }

    function renderBlogs(blogs, container) {
        container.innerHTML = blogs.map(blog => `
            <a href="${blog.link}" class="block group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col h-full">
                <div class="h-48 overflow-hidden relative">
                    <img src="${blog.image}" alt="${blog.title}" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500">
                    <div class="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                </div>
                <div class="p-6 flex flex-col flex-grow">
                    <span class="text-xs font-bold text-primary mb-2 uppercase tracking-wide">${blog.date}</span>
                    <h3 class="text-xl font-bold text-dark mb-3 group-hover:text-primary transition-colors line-clamp-2">${blog.title}</h3>
                    <p class="text-gray-600 text-sm mb-4 line-clamp-3">${blog.excerpt}</p>
                    <div class="mt-auto flex items-center text-primary font-medium text-sm">
                        Read More <i class="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                    </div>
                </div>
            </a>
        `).join('');
    }
});
