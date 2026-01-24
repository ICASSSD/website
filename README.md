# ICASSSD Website

The official website for the **International Centre for Applied Systems Science for Sustainable Development (ICASSSD)**.

## Overview
ICASSSD is an independent international not-for-profit organization envisioning the advancement of research in Systems Science and Sustainability. This website serves as a hub for its initiatives, events, and community engagement.

## Project Structure

- **root**: Main HTML pages (`index.html`, `about.html`, `partnership.html`, etc.)
- **styles/**: CSS stylesheets and Tailwind configuration.
- **scripts/**: JavaScript logic for interactivity, layout, and page rendering.
- **data/**: JSON data files storing dynamic content (Events, Team Members, Blog Posts, Talks).
- **images/**: Static image assets.
- **videos/**: Video assets for backgrounds and content.
- **blogs/**: Individual blog post pages.
- **events/**: Specific event pages (e.g., `aisg.html` for "AI for Social Good").

## Key Features

- **Modern Design**: Responsive layout using Tailwind CSS.
- **Dynamic Content**: Events, Team, and Blog sections rendered from JSON data.
- **Interactivity**: Smooth scrolling, parallax effects, and modal interactions.
- **Componentized Layout**: Shared Navbar and Footer injected via `scripts/layout.js`.

## Setup & Running

This is a static website. You can view it by opening `index.html` directly in a browser, or better yet, by running a local development server.

### Using Python (if installed)
```bash
python3 -m http.server
```
Then visit `http://localhost:8000`.

### Using Live Server (VS Code Extension)
Open the project in VS Code and click "Go Live".

## Recent Updates
- Added **AI for Social Good** seminar page with details modal.
- Implemented **Blog** section with specific post pages and image carousels.
- Restructured data storage by moving JSON files to `data/`.
