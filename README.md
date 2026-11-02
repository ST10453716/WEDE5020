# Tshinakaho Haven Website

## Project Overview

Tshinakaho Haven is a proposed non-profit children's home in Gauteng, South Africa. The website provides information about the organisation, its proposed services, the children it aims to support and ways the public can get involved.

**Tagline:** A place where every child feels loved, safe and at home.

## Project Information

- **Student Name:** Katlego Muofhe
- **Project:** Tshinakaho Haven Website
- **Technology:** HTML5, CSS3, JavaScript, Python and SQLite
- **Current Part:** Part 3 – Website Functionality, SEO and Testing
- **Status:** Part 3 development and testing

## Website Pages

The website consists of six main pages:

- `index.html` – Home
- `about.html` – About Us
- `services.html` – Services
- `beneficiaries.html` – Who We Help
- `enquiry.html` – Enquiry
- `contact.html` – Contact Us

## Project Structure

```text
tshinakaho-haven/
│
├── index.html
├── about.html
├── services.html
├── beneficiaries.html
├── enquiry.html
├── contact.html
├── README.md
├── server.py
├── robots.txt
├── sitemap.xml
│
├── css/
│   └── style.css
│
├── js/
│   └── script.js
│
└── images/
```

The SQLite database is created and used locally by the Python backend. It should not be committed to the public repository.

---

# Part 1 – Website Foundation

**Status:** Completed  
**Date:** August 2026

Part 1 focused on planning and developing the basic structure of the Tshinakaho Haven website.

Six HTML pages were created with navigation links and initial content describing the proposed organisation, its services, beneficiaries and contact information.

## Changes Based on Part 1 Feedback

**Status:** Completed  
**Date:** 17 September 2026

The feedback received for Part 1 highlighted missing images and the need to update the contact information.

The following changes were made:

- Added images to the Home, About Us, Services and Who We Help pages.
- Updated the contact number to +27 84 563 0982.
- Added the proposed address, 56 Mozart Lane, Sagewood, South Africa.
- Updated contact and location information across the website.
- Added Google Maps functionality.

The address is used for the proposed website and has not been verified as an operational children's home location.

---

# Part 2 – CSS Styling and Responsive Design

**Status:** Completed  
**Started:** 18 September 2026

Part 2 focused on improving the website's appearance, layout and responsiveness using CSS3.

The following improvements were implemented:

- Created an external `css/style.css` stylesheet.
- Applied a consistent colour scheme and typography.
- Used CSS Grid and Flexbox to organise page layouts.
- Styled navigation, buttons, cards, images and forms.
- Added hover, focus and active states.
- Improved the appearance of all six pages.
- Added responsive layouts for desktop, tablet and mobile devices.
- Improved the contact and Google Maps sections.
- Linked the homepage Get Involved section to the enquiry form.

## Responsive Design

CSS media queries were used to support different screen sizes:

- **Desktop:** Default layout.
- **Tablet:** 899px and below.
- **Mobile:** 600px and below.

The website adjusts its layout to improve readability and navigation on different devices.

---

# Part 3 – Website Functionality, SEO and Testing

**Status:** Development and local testing  
**Date:** October–November 2026

Part 3 focused on adding interactive features, improving form functionality, implementing search engine optimisation and testing the website.

## JavaScript Functionality

JavaScript was added to improve the website's interactivity and user experience.

The implemented features include:

- Interactive FAQ accordion.
- Image gallery lightbox.
- Services search and sorting functionality.
- WhatsApp and Facebook sharing buttons.
- Interactive Google Maps loading.
- Form validation and submission handling.

The JavaScript functionality is maintained in `js/script.js`, with page-specific functionality where required.

## Forms and Database

The enquiry and contact forms were connected to a Python backend.

The implementation includes:

- Form validation.
- Submission of form information using JavaScript.
- Python endpoints for processing enquiries and contact messages.
- SQLite database storage.
- Feedback messages to inform visitors about form submission results.

The backend uses `server.py` and runs locally during development and testing.

## Search Engine Optimisation (SEO)

SEO improvements were introduced to make the website easier for search engines to understand and improve its readiness for publication.

### On-Page SEO

- Added relevant page titles and meta descriptions.
- Used headings to organise website content.
- Added descriptive alternative text to images.
- Used meaningful HTML page names.
- Improved internal linking between pages.
- Maintained mobile-friendly layouts.

### Off-Page SEO

- Added WhatsApp and Facebook sharing functionality.
- Included contact and proposed location information.
- Added an interactive Google Map showing the broader Sagewood and Midrand area.
- Identified potential backlink opportunities through relevant community organisations and non-profit directories.

External backlinks and public social media promotion have not yet been established.

### Technical SEO

- Created `robots.txt` for search engine crawler instructions.
- Created `sitemap.xml` listing the six website pages.
- Improved image loading and responsive image presentation.
- Used Lighthouse to assess website performance, accessibility, best practices and SEO.

The sitemap currently contains placeholder domain URLs, which must be updated when the website is published.

## Testing

Testing was conducted locally to check the website's functionality and appearance.

The following areas were checked:

- Navigation between all six pages.
- Image loading.
- CSS styling and responsive layouts.
- JavaScript interactive features.
- Enquiry and contact form functionality.
- Python backend and SQLite database integration.
- Social sharing buttons.
- Google Maps functionality.
- SEO-related page structure.
- Lighthouse performance and accessibility checks.

Further testing will be required after deployment to confirm that the public website works correctly.

---

# How to Run the Website Locally

## Option 1 – Frontend Only

Open a terminal in the project folder and run:

```bash
python3 -m http.server 8000
```

Open:

`http://localhost:8000`

This method allows the HTML, CSS, images and client-side JavaScript features to be tested.

The Python API endpoints and SQLite form processing will not work using this method.

## Option 2 – Full Website with Backend

To run the website with the Python backend and database functionality, open the project folder in a terminal and run:

```bash
python3 server.py
```

Open:

`http://localhost:8000`

This method supports testing the enquiry and contact forms with the backend, provided the required Python dependencies are installed.

## Stop the Server

Return to the terminal and press `Ctrl + C`.

---

# Deployment

The project is maintained using Git and GitHub.

GitHub Pages is being considered for publishing the website so that it can be accessed through a public URL.

GitHub Pages supports HTML, CSS, JavaScript and images, but it does not execute the Python backend or host the SQLite database.

If GitHub Pages is used, the existing form submission functionality will require a separate backend or a compatible form service.

The published URL will also need to be added to `sitemap.xml`.

---

# Changelog

## August 2026 – Part 1

**Status:** Completed

- Created the initial website structure.
- Developed six HTML pages.
- Added website content and navigation.

## 17 September 2026 – Part 1 Feedback Updates

**Status:** Completed

- Added missing website images.
- Updated contact information and proposed address.
- Added Google Maps functionality.
- Improved location information.

## September–October 2026 – Part 2

**Status:** Completed

- Added external CSS styling.
- Improved website typography and colours.
- Implemented CSS Grid and Flexbox.
- Added responsive desktop, tablet and mobile layouts.
- Styled buttons, forms, cards and navigation.
- Improved page layouts and spacing.

## October–November 2026 – Part 3

**Status:** Development and testing

- Added JavaScript interactive features.
- Implemented form validation and submission handling.
- Connected the enquiry and contact forms to Python endpoints.
- Added SQLite database storage.
- Implemented social sharing functionality.
- Improved Google Maps loading.
- Added on-page and technical SEO improvements.
- Created `robots.txt` and `sitemap.xml`.
- Conducted Lighthouse testing.
- Prepared the website for deployment.

---

# References and Resources

The following resources were used as development references:

- **MDN Web Docs:** HTML, CSS and JavaScript documentation – https://developer.mozilla.org/
- **Python Documentation:** Python programming and standard library – https://docs.python.org/3/
- **SQLite Documentation:** Database reference – https://www.sqlite.org/docs.html
- **Google Maps:** Map embedding and location functionality – https://developers.google.com/maps
- **Google Search Central:** SEO and sitemap guidance – https://developers.google.com/search
- **Google Lighthouse:** Website performance and accessibility auditing – https://developer.chrome.com/docs/lighthouse/
- **GitHub Docs:** Repository management and GitHub Pages – https://docs.github.com/

---

# Project Status

| Project Stage | Status | Date |
|---|---|---|
| Part 1 – Website Foundation | Completed | August 2026 |
| Part 1 Feedback Updates | Completed | 17 September 2026 |
| Part 2 – CSS and Responsive Design | Completed | September–October 2026 |
| Part 3 – Functionality and SEO | Development and testing | October–November 2026 |
| Website Deployment | Planned | November 2026 |

The website's frontend and backend features have been developed and tested locally. Public deployment and testing of the published website are the remaining activities.