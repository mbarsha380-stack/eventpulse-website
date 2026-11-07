# 🎟️ EventPulse — Modern Responsive Event Management Platform

> **K Explore — Web Designing Challenge**  
> **Task Title:** Design and Develop a Responsive Event Management Website  
> **Live Demo:** [Deploy https://eventpulse-website.vercel.app/](https://eventpulse-website.vercel.app/)  
> **Repository:** [https://github.com/mbarsha380-stack/eventpulse-website](https://github.com/mbarsha380-stack/eventpulse-website)
**Developed by Barsha Mahato**

---

## 🌟 Executive Overview

**EventPulse** is a modern, responsive, and visually stunning Event Management & Ticketing platform engineered with **HTML5**, **CSS3**, **Vanilla JavaScript (ES6+)**, and **Tailwind CSS**. It allows users to explore trending events, filter by categories, inspect detailed agendas and keynote speakers, track live countdowns to event start times, and complete instant registrations with client-side form validation.

The platform includes a local-first **LocalStorage engine** that manages ticket bookings, updates real-time seat availability, stores favorite events, and generates printable **Digital Boarding Pass Tickets** with downloadable `.ics` calendar sync files.

---

## ✨ Feature Matrix

### 1. 🎨 Creative & Engaging UI/UX
- **Neo-Glassmorphism Aesthetic:** Translucent navigation and cards with backdrop blur filters, glowing ambient radial gradients, and fluid drop shadows.
- **Micro-Interactions & Hover Dynamics:** Subtle 3D card elevation on hover, pulsating badges for high-demand events, and animated progress bars.
- **Dark & Light Mode:** Seamless theme toggle with smooth CSS transitions, local storage persistence, and automatic system preference detection (`prefers-color-scheme`).
- **Responsive Across All Breakpoints:** Hand-crafted layouts optimized for mobile devices (320px+), tablets (768px+), laptops (1024px+), and ultra-wide displays (1440px+). Includes an accessible slide-out mobile drawer navigation.

### 2. 🔍 Real-Time Search, Filtering & Discovery
- **Hero Quick Search:** Fast-track search bar with instant keyword matching, category selection, and smooth auto-scroll.
- **Category Filter Pills:** 1-click filtering across `Tech & AI`, `Music & Festivals`, `Business & Startups`, `Design & Creative`, `Health & Fitness`, and `Workshops & Learning`.
- **Price Toggle:** Filter effortlessly between `All`, `Free Only`, and `Paid Events`.
- **Dynamic Sorting:** Sort by `Date: Upcoming First`, `Date: Latest First`, `Most Popular (Booked Seats)`, or `Price: Low to High`.
- **Favorites & Bookmarks:** Heart icon on any event to bookmark it; dedicated "Favorites" tab with a live badge counter.
- **Empty State Fallback:** Friendly reset button and custom empty state illustration when no search matches are found.

### 3. ⏱️ Live Event Countdown Timers
- Real-time ticker counting down `Days : Hours : Minutes : Seconds` to each event's scheduled date.
- Dynamically rendered on featured event cards and full event detail modals.
- Auto-updating every 1,000 milliseconds with automatic expiration handling.

### 4. 📄 Interactive Event Details Modal
- High-resolution photographic banners with category and price badges.
- **Schedule & Agenda:** Time-stamped breakdown of keynotes, workshops, and panel sessions.
- **Speakers Showcase:** Speaker portraits, designations, and corporate affiliations.
- **Venue & Location Details:** Venue name, metropolitan hub, and format (In-Person / Hybrid / Outdoor).
- **Live Seat Availability Counter:** Progress bar tracking seats remaining in real time.

### 5. 📝 Smart Registration Form & JavaScript Validation
- **Form Inputs:** Participant Full Name, Email Address, Phone Number, Ticket Tier (`Standard Pass` vs `VIP All-Access`), Ticket Count (1 to 5), Dietary / Special Notes, and Terms Acceptance.
- **Live Regex Validation:**
  - **Full Name:** Minimum 3 characters; alphabetic characters and spaces only.
  - **Email Address:** Strict standard email regex format (`^[^\s@]+@[^\s@]+\.[^\s@]+$`).
  - **Phone Number:** Format validation allowing international country codes and 10–15 digits.
  - **Ticket Count:** Enforces quantity boundaries (1–5) and recalculates pricing in real time.
  - **Terms Checkbox:** Validation on checkbox state before form submission.
- **Instant Visual Feedback:** Green border transitions for valid inputs and clear error messages with red borders for invalid entries.
- **Submission Loading State:** Simulated verification spinner ensuring clean state transitions.

### 6. 🎫 Digital Ticket Generation & LocalStorage Engine
- **Celebration Confetti:** Realistic dual-angle confetti explosion upon successful registration.
- **Boarding Pass Ticket:** Displays Unique Ticket Reference ID (e.g. `#TKT-849201`), Attendee Name, Tier, Date & Time, Venue Address, and simulated Barcode.
- **Print / PDF Export:** Tailored `@media print` CSS stylesheet allowing users to click "Print / Save as PDF" and print only the ticket.
- **Calendar Integration (.ics):** Generates and triggers download of an `.ics` calendar file compatible with Google Calendar, Apple Calendar, and Microsoft Outlook.
- **"My Bookings" Drawer:** View all active bookings in one place; includes option to **Cancel Registration**, which automatically releases seats back to the event!

---

## 🗂️ Project Directory Structure

```text
eventpulse-website/
├── index.html              # Semantic HTML5 layout, accessible navigation & modals
├── css/
│   └── styles.css          # Glassmorphism, animations, digital ticket & print styles
├── js/
│   ├── events-data.js      # Curated dataset of events with dynamic future dates
│   ├── storage.js          # LocalStorage manager for bookings, favorites & theme
│   └── app.js              # Application logic, filters, validation & countdown timers
└── README.md               # Complete project documentation & deployment guide
```

---

## 🚀 Getting Started Locally

### Prerequisites
All you need is a modern web browser (Chrome, Edge, Firefox, Safari) and an editor (VS Code, etc.). No Node.js build process is required!

### Option 1: Direct File Opening
1. Clone or download the repository:
   ```bash
   git clone https://github.com/your-username/eventpulse-website.git
   cd eventpulse-website
   ```
2. Double-click `index.html` or open it with your browser.

### Option 2: Live Server (Recommended)
If using Visual Studio Code:
1. Install the **Live Server** extension.
2. Right-click `index.html` and click **"Open with Live Server"**.
3. The platform will launch at `http://127.0.0.1:5500`.

---

## 🌐 Deployment Guide

### Deploying to GitHub Pages (Recommended)
1. Initialize Git in the project folder and push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Responsive Event Management Platform"
   git branch -M main
   git remote add origin https://github.com/<your-username>/eventpulse-website.git
   git push -u origin main
   ```
2. In your GitHub repository, navigate to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
4. Set branch to `main` and folder to `/ (root)`.
5. Click **Save**. Within 1–2 minutes, your live site will be accessible at:  
   `https://<your-username>.github.io/eventpulse-website/`

### Deploying to Vercel
1. Install Vercel CLI (`npm i -g vercel`) or visit [vercel.com](https://vercel.com).
2. Connect your GitHub repository or run `vercel` in the root directory.
3. Keep default settings (Static Site) and click **Deploy**.

### Deploying to Netlify
1. Go to [netlify.com](https://www.netlify.com/) and log in.
2. Drag and drop the `eventpulse-website` folder directly onto the Netlify Dashboard.
3. Your site will instantly be live on a custom `.netlify.app` domain with SSL enabled.

---

## 📋 Evaluation Criteria Self-Check

| Requirement | Status | Implementation Details |
| :--- | :---: | :--- |
| **Attractive Hero Section** | ✅ 100% | Ambient glowing mesh gradient, search bar, filter dropdown, and live community stats. |
| **Upcoming & Featured Events** | ✅ 100% | Highlighted trending cards with dynamic real-time countdown clocks. |
| **Event Card Details** | ✅ 100% | Title, high-res image, date, venue, price badge, category, short desc, and capacity bar. |
| **Search & Category Filters** | ✅ 100% | Live search input, category filter pills, price selector (Free/Paid), and sorting options. |
| **Detailed Event View** | ✅ 100% | Modal view with complete description, schedule/agenda, keynote speakers, and venue details. |
| **Validated Registration Form** | ✅ 100% | Validates Name, Email, Phone, Ticket tier, and Terms with instant feedback error styling. |
| **Confirmation Message** | ✅ 100% | Canvas confetti celebration and verified Digital Boarding Pass Ticket with barcode. |
| **Full Responsiveness** | ✅ 100% | Fluid layout across mobile (320px+), tablet, and desktop screens with mobile drawer navigation. |
| **Dark / Light Mode (Bonus)** | ✅ 100% | Persistent toggle with system theme detection and smooth transitions. |
| **Event Countdown Timers (Bonus)** | ✅ 100% | Real-time interval timers calculating days, hours, minutes, and seconds. |
| **LocalStorage Management (Bonus)**| ✅ 100% | Bookings stored locally, dynamic seat decrements/increments, and persistent favorites. |
| **Version Control & Documentation**| ✅ 100% | Structured Git commits and comprehensive README instructions. |

---

## 🛡️ License & Credits

- **Author:** Developed for K Explore Web Designing Challenge
- **Images:** Curated royalty-free photography via [Unsplash](https://unsplash.com)
- **Icons:** [Lucide Icons](https://lucide.dev)
- **Effects:** [Canvas Confetti](https://www.kirilv.com/canvas-confetti/)
- **License:** MIT License
