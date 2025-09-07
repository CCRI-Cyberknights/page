# QR Code Landing Pages

## Project Overview

This repository hosts the official landing pages for the CCRI Cybersecurity Club's various QR code campaigns. The goal is to provide a single, easy-to-manage web platform that delivers targeted information and resources to new and prospective club members. This project is a foundational part of our recruitment and outreach strategy.

## Features

- Multi-page Design: Uses a single `index.html` file with a JavaScript router to display multiple pages, each corresponding to a different QR code. This allows us to use multiple QR codes that direct to a single, easily manageable URL.
- Fully Responsive: The site is built with Tailwind CSS, ensuring a clean and optimal viewing experience on any device, from desktop computers to mobile phones.
- Key Landing Pages:
  - Cybersecurity Club: Provides links to our main club page and the official signup form.
  - CyberKnights Linux: Contains step-by-step instructions for booting the Linux distro from a USB drive, including a list of common one-time boot menu keys.

## Getting Started

To view the site locally, simply open the `index.html` file in your web browser.

To link a QR code to a specific page, use URL parameters. For example:

- To link to the Cybersecurity Club page: `your-site-url.com/?page=cybersecurity`
- To link to the Linux guide: `your-site-url.com/?page=linux`

## Contribution

As this project is a core part of the club's infrastructure, contributions are highly encouraged. Here are a few ways to get involved:

- Content: Help us create new pages for upcoming events, workshops, or competitions.
- Design: Refine the existing look and feel, or propose new design ideas.
- Code: Improve the JavaScript router, add new features, or optimize the code for performance.

If you are a club member, you can fork this repository and submit a pull request with your changes. New to GitHub? We can help you get started with the basics of forking, branching, and submitting your first contribution.

## High-Level Requirements for the GitHub Pages Project

The main goal of this project is to create a flexible, centralized, and easy-to-manage web platform for the CCRI Cybersecurity Club's public-facing information. The site must be hosted on GitHub Pages for free, and it should be accessible and understandable to new and prospective club members, including those with little or no technical background.

Here are the key requirements broken down by category:

### 1. Project Structure & Hosting

- Single-File Architecture: The entire website will be contained within a single `index.html` file. This is crucial for simple hosting on GitHub Pages, as it doesn't require complex build processes or multiple file paths for deployment.
- Router-Based Navigation: The site must handle multiple "pages" within this single file using a simple JavaScript router. This allows different QR codes to direct users to specific content (e.g., the Linux boot guide or the club's main page) while keeping the project contained in one repository.
- Primary Landing Pages:
  - Cybersecurity Club: A page with information about the club and links to key resources, like the main CCRI cybersecurity website and the signup form.
  - CyberKnights Linux: A page with clear, step-by-step instructions for booting the Linux distro from a USB drive, including common boot keys for different computer manufacturers.
- Scalability: The architecture should be simple enough to allow for the easy addition of new content or pages in the future (e.g., a page for a specific event or a CTF guide) by adding a new `div` and updating the JavaScript.

### 2. User Experience & Design

- Responsive Design: The site's layout and content must be fully responsive, ensuring optimal viewing and usability on a variety of devices, from mobile phones to desktop computers. This is critical given that users will be accessing the site via QR codes on their phones.
- Clear & Concise Content: The language used on all pages should be straightforward and easy to understand for the target audience of new and potential club members. The Linux boot guide, in particular, should avoid jargon and focus on practical steps.
- Branding & Aesthetics: The design should be visually appealing and modern, using the club's branding as a guide. The current dark theme and use of Tailwind CSS align with this requirement.
- Call-to-Action: Each page should have a clear call-to-action, whether it's to sign up for the club, get more information, or follow a set of instructions.

### 3. Development & Maintenance

- Version Control: The project will live in a public GitHub repository. This will serve as a single source of truth for the club's web content and allow for collaborative development.
- Easy Updates: The single-file design and direct hosting on GitHub Pages mean that updates can be made by simply editing the `index.html` file and pushing the changes to the repository, which will automatically redeploy the site.
- Institutional Memory: By keeping the project on GitHub and the club's official email and resources, it creates a sustainable, long-term solution that is not dependent on a single individual. This supports the club's goal of maintaining institutional memory.

These requirements ensure the project will be a highly effective and easily maintainable solution for the CyberKnights Club's marketing and resource distribution. The files provided show a clear focus on building a professional club image, and this project directly supports that goal.
