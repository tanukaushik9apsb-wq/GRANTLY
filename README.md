# GRANTLY — Unified Indian Scholarship Discovery & Management Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.4-646CFF.svg)](https://vitejs.dev/)

> **GRANTLY** is an editorial-grade, unified scholarship discovery, eligibility calculation, and application management ecosystem designed specifically for higher education students across India. It aggregates opportunities across Central Government schemes (National Scholarship Portal), State Welfare Portals (UP, MahaDBT, SSP Karnataka, SVMCM West Bengal), and premier Corporate Social Responsibility (CSR) Foundations.

---

## 🌟 Visual Identity & Design System

GRANTLY features a signature cinematic, editorial aesthetic built around warm ivory typography, deep charcoal night backgrounds, muted golden accents, and atmospheric artwork.

### Global Dual-Theme Architecture

| Design Token | Cinematic Dark Theme (Default) | Warm Ivory Light Theme |
| :--- | :--- | :--- |
| **Canvas Background** | `#10120F` | `#F4F1E8` |
| **Card / Surface** | `#191B17` | `#FFFFFF` |
| **Elevated Surface** | `#23251F` | `#EBE7DC` |
| **Primary Typography** | `#E9E6D7` (Warm Ivory) | `#25251F` (Deep Charcoal) |
| **Secondary Typography** | `#D4D0BE` | `#3D3D32` |
| **Muted Text** | `#A5A397` | `#77756B` |
| **Accent Gold** | `#D6C69A` | `#A58A56` |
| **Subtle Borders** | `rgba(233, 230, 215, 0.14)` | `rgba(37, 37, 31, 0.12)` |

- **Cinematic Intro Animation:** Full-screen initial-visit prelude featuring film grain texture, ambient golden glow, letter-by-letter reveal of the `GRANTLY*` wordmark, and tagline *"Every opportunity deserves to be discovered."* with instant `Skip` / `Escape` key options.
- **Persistent Theme Switcher:** Animated `Sun`/`Moon` toggle embedded in the landing page floating navbar, student dashboard header, admin console, explorer, and profile settings. Syncs with `localStorage` and respects system `prefers-color-scheme`.
- **Anti-FOUC:** Instant zero-flash inline script pre-loaded in `<head>`.

---

## 🚀 Key Modules & Capabilities

### 1. Landing Page & Cinematic Hero
- Adapted from the 21st.dev `PrismaHero` component, completely purged of all demo text, watermarks, and branding.
- Responsive CSS `clamp(50px, 8.2vw, 136px)` typography with a proportionate 2-column desktop grid and mobile vertical stack.
- Real-time Quick Eligibility Calculator widget on the homepage.
- Interactive metrics strip, feature cards, 3-step roadmap, student testimonials, and official portal directory.

### 2. Comprehensive Scholarship Explorer (`/explore`)
- Search by scheme title, authority, state, course, or category.
- Multi-dimensional filters: Scheme Category (Central, State, CSR, Institutional, Women in STEM), Domicile State, Education Level (Class 10 to PhD).
- Sorting by Award Amount (INR), Application Deadline, or Popularity.
- **1-Click Student Match Filter:** "Only Eligible for Aarav Sharma" filters instantly to qualifying opportunities.
- **Side-by-Side Comparison Matrix:** Compare up to 3 schemes across quotas, criteria, funding amounts, and documents.

### 3. Transparent Algorithmic Eligibility Checker
- Criterion-by-criterion explanation engine that transparently explains *why* a student qualifies or does not qualify (level, domicile, score, income ceiling, quota category).
- **Zero Misleading Guarantees:** Emphasizes that platform eligibility checks are preparatory and require official portal verification.

### 4. Application Tracker (`/applications`)
- Visual stage pipeline: `1. Preparing Documents` -> `2. Applied` -> `3. Under Review` -> `4. Disbursed`.
- Interactive stage transitions with timeline notes and portal reference numbers.
- **Statutory Notice:** Explicitly reminds students that saving or tracking an application in GRANTLY does *not* submit forms externally to official government portals.

### 5. Digital Document Locker (`/documents`)
- Categorized vault for Class 10/12 Marksheets, Tehsildar Income Certificates, Domicile Certificates, Bonafide Certificates, Caste/EWS Certificates, and Bank Passbooks.
- Interactive document upload simulator with scan preview, file size calculation, and verification status indicators.

### 6. Student Profile Calibration (`/profile`)
- Domicile state, course, score (CGPA/percentage), family income slider (INR), and social category reservations.
- Dynamic scheme counter that updates live as profile parameters are adjusted.
- Dedicated Visual Atmosphere & Theme Preferences section with color swatches.

### 7. Administrative Verification Desk (`/admin`)
- Protected by `AdminRoute` role-based access control.
- Metric indicators: Total Schemes, Official Verified, Pending Review, Real Listings, Demo Records.
- Scheme Verification Toggle: 1-click verification of official schemes vs pending verification.
- Complete Scheme Publishing Modal: Full CRUD with official portal links, official gazette sources, and clear separation between verified schemes and demo records.

---

## 🧑‍🎓 Seeded Demonstration Profiles

For rapid evaluation and paired testing, GRANTLY includes seeded demo identities:

### 1. Demo Student Workspace
- **Name:** Aarav Sharma
- **Email:** `aarav.demo@grantly.in`
- **Domicile:** Lucknow, Uttar Pradesh
- **Course:** B.Tech Computer Science (Undergraduate, 2nd Year)
- **Academic Score:** 8.2 CGPA
- **Annual Family Income:** ₹2,50,000 / year
- **Category:** OBC (Non-Creamy Layer verified)
- **Dashboard State:** 8 Matching Schemes, 4 Saved, 2 Applied, 3 Urgent Deadlines.

### 2. Demo Admin Console
- **Name:** Dr. Ananya Verma
- **Email:** `admin.verma@grantly.in`
- **Role:** Chief Verification Officer, Higher Education Schemes Council
- **Console Features:** Scheme verification desk, database CRUD, statutory compliance auditor.

*Both profiles can be accessed with a single click using the "1-Click Demo Login" buttons on the `/login` and `/register` pages.*

---

## 🛠️ Tech Stack & Architecture

- **Frontend Core:** React 18, TypeScript, Vite
- **Routing:** React Router DOM v7 (`BrowserRouter`, `ProtectedRoute`, `AdminRoute`)
- **Styling:** Tailwind CSS v3, Custom CSS Variables, SVG Film Grain Noise
- **Animations:** Framer Motion (staggered letter reveals, spring modals, smooth scale transitions)
- **Icons:** Lucide React
- **Database / Backend:** Supabase (PostgreSQL 15, Supabase Auth, Supabase Storage, Row Level Security)
- **Resilience:** Built-in offline-first fallback adapter when Supabase credentials are not provided.

---

## 📦 Installation & Local Setup

### Prerequisites
- Node.js v18+ (tested on Node v20 and v24)
- npm or pnpm or yarn

### 1. Clone & Install
```bash
git clone https://github.com/your-username/grantly.git
cd grantly
npm install
```

### 2. Environment Configuration
Copy the provided environment template:
```bash
cp .env.example .env.local
```

If connecting to a live Supabase project, fill in:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```
*(If left blank, GRANTLY runs automatically in local demo mode with zero external dependencies).*

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🗄️ Database Setup (Supabase PostgreSQL)

If deploying with Supabase as the backend:

1. Create a new project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste and run the complete schema script located in [`supabase/schema.sql`](file:///f:/PROGRAMMING/ANTIGRAVITY/GRANTLY/supabase/schema.sql).
4. The script automatically creates:
   - Custom enums: `user_role`, `verification_status`, `scholarship_type`, `application_stage`, `document_category`.
   - Tables: `profiles`, `scholarships`, `saved_scholarships`, `applications`, `documents`, `notifications`.
   - Automated signup profile trigger: `handle_new_user()`.
   - Storage bucket: `student-documents` (private bucket).
   - Strict Row Level Security (RLS) policies ensuring complete student data isolation.
5. Seed initial data if desired or create official scholarships directly through the Admin Console.

---

## 🔐 Security & Data Privacy Principles

- **Row Level Security (RLS):** Every table is guarded by RLS. Students can only select, insert, update, or delete their own applications, saved bookmarks, and document metadata.
- **Isolated Storage:** Files in the `student-documents` bucket are restricted to `student-documents/{auth.uid()}/*`.
- **Statutory Notice:** Clear disclaimers across the app prevent students from assuming internal tracking constitutes external government submission.
- **Sanitized Demo Records:** All demonstration records are labeled with explicit `isDemoRecord: true` flags and `DEMO DATA` badges to prevent confusion with official government schemes.

---

## 🚢 Production Build & Deployment

### 1. Production Build
```bash
npm run build
```
This compiles TypeScript and outputs optimized production assets into `dist/`.

### 2. Deploy to Vercel
1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Framework Preset: **Vite**.
4. Set Environment Variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
5. In `vercel.json` (or Rewrites), ensure SPA routing:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```
6. Deploy.

### 3. Deploy to Netlify
1. Connect repository in [Netlify](https://netlify.com).
2. Build command: `npm run build`.
3. Publish directory: `dist`.
4. Add a `_redirects` file in `public/`:
   ```text
   /*    /index.html   200
   ```

### 4. Deploy with Docker
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 📋 Quality Assurance Checklist

- [x] **Zero TypeScript Errors:** Verified with `tsc`.
- [x] **Zero Build Warnings/Errors:** Verified with `vite build`.
- [x] **Visual Consistency:** Checked in both Dark (`#10120F`) and Light (`#F4F1E8`) themes across all viewports.
- [x] **Mobile Responsiveness:** Tested on 390px (mobile), 768px (tablet), and 1440px (desktop).
- [x] **Accessible Navigation:** Skip intro button, escape key shortcut, visible keyboard focus rings, and screen-reader ARIA tags.
- [x] **No Broken Routes:** Handled 404 catch-all redirecting to `/`.
- [x] **No Fabricated Real Portals:** Official links point directly to authentic government domains (`scholarships.gov.in`, `scholarship.up.gov.in`, `mahadbt.maharashtra.gov.in`).

---

## 📄 License
This project is licensed under the MIT License — see the LICENSE file for details.
#   G R A N T L Y  
 