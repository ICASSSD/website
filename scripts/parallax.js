document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('parallax-video');

    if (!video) return;

    // Wait for metadata to know duration
    video.addEventListener('loadedmetadata', () => {
        // Initialize
        updateVideoScroll();
    });


    // Configuration for final zoom out level (0.8 = 80% size)
    const FINAL_ZOOM_OUT_LEVEL = 0.8;

    function updateVideoScroll() {
        if (!video.duration) return;

        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        // Clamp between 0 and 1
        const scrollPercent = Math.max(0, Math.min(1, scrollTop / docHeight));

        // Calculate time
        const targetTime = scrollPercent * video.duration;

        // Update video (using fastSeek if available for performance, else currentTime)
        if (Number.isFinite(targetTime)) {
            video.currentTime = targetTime;
        }

        // Zoom out logic: Start zooming out after 50% scroll
        // Scale goes from 1.0 -> FINAL_ZOOM_OUT_LEVEL
        let scale = 1.0;
        let x = 0.3;
        if (scrollPercent > x) {
            // Normalize progress from 0.5->1.0 to 0->1
            const zoomProgress = (scrollPercent - x) / (1 - x);
            scale = 1.0 - (zoomProgress * (1.0 - FINAL_ZOOM_OUT_LEVEL));
        }

        // Apply visual transform (preserving centering)
        video.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }

    // Use requestAnimationFrame for smoother visual updates during scroll
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateVideoScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
});
