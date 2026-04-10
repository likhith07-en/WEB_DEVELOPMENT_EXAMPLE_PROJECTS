# College of Engineering Website (Static)

A complete multi-page static college website built with HTML, CSS, and JavaScript.

This project includes a responsive homepage, department pages, placement page, and newly added feature pages for Academics, Campus Life, and Resources.

## Project Summary

The website is designed to look modern, work on mobile and desktop, and provide useful static functionality without a backend.

### Main goals achieved

- Responsive layout for desktop and mobile
- Multi-page structure with consistent header and footer
- Reusable shared CSS and JavaScript across pages
- Interactive features (modals, smooth scroll, active nav states, download cards, fee estimator, toasts)
- Improved static-link behavior for placeholder links

## Live Entry Point

Open the homepage:

- [College.html](College.html)

## Pages Included

### Core pages

- [College.html](College.html) - Main homepage
- [Placement.html](Placement.html) - Training and placement information

### Department pages

- [BME.html](BME.html) - Biomedical Engineering
- [CIVIL.html](CIVIL.html) - Civil Engineering
- [CSE.html](CSE.html) - Computer Science Engineering
- [ECE.html](ECE.html) - Electronics and Communication Engineering
- [EEE.html](EEE.html) - Electrical and Electronics Engineering
- [MECH.html](MECH.html) - Mechanical Engineering
- [MIN.html](MIN.html) - Mining Engineering
- [MCA.html](MCA.html) - Master of Computer Applications

### Newly added feature pages

- [Academics.html](Academics.html) - Programs, exam flow, scholarship section, fee estimator
- [CampusLife.html](CampusLife.html) - Clubs, events, facilities, gallery, alumni section
- [Resources.html](Resources.html) - Searchable resource cards with file downloads

## Key Features

### Shared UI/UX features

- Responsive top navigation with mobile menu toggle
- Department dropdown support on desktop and mobile
- Headlines ticker section
- Smooth scroll for in-page anchors
- Active navigation highlighting
- Back-to-top button
- Auto-updated year in footer

### Modal features

- Student login modal (static validation)
- Staff login modal (static validation)
- Admission enquiry modal (static form)
- Policy/notice preview modals
- Toast notifications for user feedback

### Smart static link handling

Placeholder links are automatically upgraded where possible:

- Email text to mailto links
- Phone text to tel links
- Social labels to external profile roots
- Campus map/location labels to Google Maps
- Internal academic/resource labels to relevant project pages

### Academics page features

- Program overview blocks
- Examination flow timeline
- Scholarship section
- Fee estimator with:
  - Program type
  - Scholarship percentage slider
  - Optional hostel/mess estimate

### Resources page features

- Search/filter resources in real time
- Download buttons generate text files client-side
- Resource count updates based on filter
- FAQ section

### Campus Life page features

- Clubs and student activities sections
- Facilities and library section
- Image gallery
- Annual event timeline
- Alumni call-to-action section

## Project Structure

```text
College_project/
|-- College.html
|-- Placement.html
|-- Academics.html
|-- CampusLife.html
|-- Resources.html
|-- BME.html
|-- CIVIL.html
|-- CSE.html
|-- ECE.html
|-- EEE.html
|-- MECH.html
|-- MIN.html
|-- MCA.html
|-- college_css/
|   |-- college.css
|   |-- header.css
|   |-- headlines.css
|   |-- footer.css
|   |-- bme.css
|-- college_js/
|   |-- main.js
|-- college_img/
```

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES6)
- Browser localStorage (for static form submission logs)

## How to Run

### Option 1: Open directly

1. Open [College.html](College.html) in a browser.

### Option 2: Run with local server (recommended)

1. Open terminal in project folder.
2. Run a local server, for example:

```bash
python -m http.server 5500
```

3. Open:

```text
http://localhost:5500/College.html
```

Using a local server gives cleaner behavior for navigation and assets.

## Shared Files and Responsibilities

### Styles

- [college_css/header.css](college_css/header.css) - Header, nav, dropdown, mobile menu styles
- [college_css/headlines.css](college_css/headlines.css) - Ticker/headline styles
- [college_css/footer.css](college_css/footer.css) - Footer layout/styles
- [college_css/college.css](college_css/college.css) - Core global layout and all new reusable components
- [college_css/bme.css](college_css/bme.css) - Department page specific styling blocks

### Script

- [college_js/main.js](college_js/main.js) handles:
  - Navigation and dropdown behavior
  - Smooth scrolling and active states
  - Modal and toast system
  - Placeholder link enhancements
  - Fee estimator logic
  - Resource filtering and file download behavior
  - Footer year update and back-to-top

## Local Storage Keys Used

- collegeSiteLogins
- collegeSiteEnquiries

You can clear these from browser storage tools if needed.

## Customization Guide

### Update content

- Edit page text directly in each HTML file.
- Replace images in [college_img/](college_img/) and update image paths in HTML.

### Add a new page

1. Create a new HTML file in root.
2. Link shared styles and [college_js/main.js](college_js/main.js).
3. Add navigation links from existing pages.
4. Reuse existing component classes from [college_css/college.css](college_css/college.css).

### Add resource download cards

In [Resources.html](Resources.html), each card button can use:

- data-download-name
- data-download-content

The shared JavaScript already handles download behavior.

## Browser Compatibility

Tested for modern browsers:

- Google Chrome
- Microsoft Edge
- Firefox

## Known Notes

- This is a static site, so no real server authentication is implemented.
- Forms are demo/static and stored locally in the browser.
- External social/map links are generic placeholders and can be replaced with official links.

## Future Improvements (Optional)

- Add an events registration page
- Add multilingual support
- Add static sitemap and robots files
- Add downloadable PDF brochures

## Author

College Website Project

## License

This project is for educational use.
