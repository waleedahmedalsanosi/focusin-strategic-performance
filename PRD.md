# Product Requirements Document (PRD) - FocusIn

## 1. Executive Summary
**Product Name:** FocusIn
**Vision:** Transitioning organizations from manual, fragmented performance management (Excel/Manual Reports) to a unified, automated digital ecosystem that drives data-driven decision-making.
**Current Status:** V1.0 Core UI & Strategic Framework Implemented.
**Target Audience:** Medium to large enterprises and government entities in Saudi Arabia and the region.

## 2. Problem Statement
Current organizations suffer from:
- **Governance Gaps:** Lack of centralized control over strategic initiatives.
- **Data Silos:** Performance data is scattered across Excel sheets and manual reports.
- **Delayed Insights:** Difficulty in obtaining real-time visibility into organizational achievement.
- **Complexity:** Existing solutions are often over-engineered and expensive.

## 3. Proposed Solution
A centralized web platform that:
- Documents strategic goals and links them directly to KPIs.
- Automates progress tracking and reporting.
- Provides a "Strategy-to-Department" cascade for clear alignment.
- Offers a simple, intuitive UI at an economical price point.
- **Modern UI/UX:** Utilizes a "Bento Card" design system for high information density and scannability.

## 4. Competitive Analysis & Differentiation
### Competitors:
- **NeXera (Empower)** & **Strategy S+ (Master Works)**.
### Our Edge:
- **Simplicity First:** A UI that doesn't require extensive training, built with modern React patterns.
- **Direct Alignment:** Visual "Strategy Maps" that show how every department contributes to the top-level vision.
- **Economic Value:** Subscription models tailored for scalability without the "Enterprise Tax".
- **Localization:** Full RTL support for Arabic business contexts and government reporting standards.

## 5. Current Implementation (V1.0)

### 5.1 Dashboard & Navigation
- **Responsive Sidebar:** Collapsible navigation with mobile-first overlay support.
- **Bento Card System:** Consistent card-based layout for all dashboard widgets.
- **Theme Support:** Native Light and Dark mode integration.
- **Localization:** Full English and Arabic (RTL) translation system.

### 5.2 Strategic Frameworks
- **Strategic Map:** Interactive visualization of Vision, Mission, and Pillars with expandable objectives.
- **Balanced Scorecard (BSC):** Management of objectives across Financial, Customer, Internal, and Learning perspectives.
- **KPI Management:** Full CRUD interface for tracking key performance indicators (Baseline, Target, Actual).
- **Strategy House:** Organizational hierarchy visualization with parent-child department relationships.
- **Organization Structure:** Executive-level reporting lines visualization.

### 5.3 Management Modules
- **Initiatives Management:** Tracking of strategic projects with progress bars and budget monitoring.
- **Strategy Management:** High-level overview of active organizational strategies and their periods.

## 6. Technical Stack
- **Frontend:** React 18+, TypeScript, Vite.
- **Styling:** Tailwind CSS (Utility-first, Bento-card system).
- **Animations:** Motion (Framer Motion) for smooth transitions and interactive elements.
- **Icons:** Lucide-React for a consistent, professional icon set.
- **Charts:** Recharts for responsive data visualization.

## 7. Future Roadmap

### Phase 2: Backend & Real-time Data
- **API Integration:** Connect frontend to a Node.js/Express backend.
- **Database Persistence:** Move from mock data to PostgreSQL/SQLite storage.
- **Authentication:** Secure login and Role-Based Access Control (RBAC).

### Phase 3: Advanced Governance
- **Automated Reporting:** PDF/Excel export for executive summaries.
- **Notification Engine:** Real-time alerts for KPI deviations.
- **Risk Management:** Dedicated module for identifying and monitoring strategic risks.

## 8. Success Metrics
- **Onboarding Time:** Reducing the time to set up a full strategic map to under 2 hours.
- **User Adoption:** High daily/weekly active users among department heads.
- **Reporting Efficiency:** Reducing report generation time from days to seconds.

## 9. User Stories
To ensure the product addresses real needs, we capture key user personas and their journeys:

### 9.1 Persona: Strategy Director
- As a Strategy Director, I want to define organizational vision, mission and strategic pillars so that every department aligns with top-level goals.
- As a Strategy Director, I need to assign KPIs to objectives and track their progress automatically so I can report to the executive committee with confidence.
- As a Strategy Director, I want to export a quarterly strategic scorecard (PDF/Excel) so I can circulate it to stakeholders.

### 9.2 Persona: Department Head
- As a Department Head, I want to see how my team’s KPIs contribute to the company vision so I understand our impact.
- As a Department Head, I need to submit monthly KPI updates easily, either manually or via API integration with existing systems.
- As a Department Head, I want real-time alerts when a KPI is off‑track so I can take corrective action.

### 9.3 Persona: Data Analyst
- As a Data Analyst, I want access to raw KPI datasets and trends so I can build additional reports or dashboards.
- As a Data Analyst, I need API endpoints and a simple query interface so I can integrate with BI tools (PowerBI, Tableau).

### 9.4 Persona: Executive Sponsor
- As an Executive Sponsor, I want a high‑level dashboard that shows organizational health at a glance.
- As an Executive Sponsor, I need mobile access to key metrics and the ability to notify teams through the platform.

## 10. Design System
The UI/UX is built on a lightweight, flexible design system that emphasizes clarity, scannability, and localization.

- **Bento Card Layout:** Reusable card component with consistent padding, rounded corners and subtle shadows. Used throughout dashboards, forms, and lists. CSS classes `.bento-card` and `.glass-card` are defined in `index.css`.
- **Color Palette:** Brand greens (emerald) for positive states and blues/purples for informational elements; support for light/dark themes through custom CSS variables and Tailwind modifiers.
- **Typography:** Inter for Latin and Noto Sans Arabic for Arabic text; JetBrains Mono for code/monospaced elements. Font stacks configured via Tailwind theme.
- **RTL Support:** Entire design flips direction via `.rtl`/`.ltr` classes; text alignment and spacing utilities respect RTL.
- **Iconography:** Lucide-React SVG icon set ensures consistent strokes and sizing. Icons are passed as components for easy theming.
- **Animation:** Motion (Framer Motion) used for modals, collapsible sections, and micro‑interactions to make the experience feel responsive.
- **Form Elements:** Standardized input fields with rounded edges, focus rings matching the theme, and accessible labels. Validation feedback appears inline.

A living style guide will be maintained alongside code (e.g. Storybook or dedicated `/design` folder) in future iterations.

## 11. Technical Architecture
The initial version is frontend‑only with mock data, but the architecture is designed for rapid backend integration:

1. **Frontend (React + Vite):** Single-page application served by Vite during development, compiled for production with code splitting.
2. **Backend (Future Phase):** Node.js/Express API with PostgreSQL or SQLite (better-sqlite3 dependency already in package). Authentication via JWT and role‑based ACL. Endpoints will include `/kpis`, `/objectives`, `/strategymap`, `/users`, etc.
3. **Data Flow:** Frontend will fetch and mutate data via REST or GraphQL. Real-time updates delivered using WebSockets (Socket.io) for alerts.
4. **Deployment:** Static frontend can be hosted on Vercel/Netlify; backend containerized with Docker and orchestrated via Kubernetes or Docker Compose. Environment variables managed via `.env` files.
5. **CI/CD:** Linting (`npm run lint`), unit tests (Jest/React Testing Library), and e2e tests (Cypress) will run on each pull request. Semantic versioning and automated changelogs.

## 12. Future Enhancements
- **Mobile App:** Native iOS/Android using React Native or Flutter focusing on reporting and alerts.
- **Integrations:** Connectors for Excel, Google Sheets, ERP systems, and Slack/Teams notifications.
- **AI Insights:** Use the Gemini API (key placeholder in config) to provide trend predictions and anomaly detection.
- **Multi‑tenant Architecture:** Support multiple organizations with isolated data sets and custom branding.
- **Compliance:** SOC2, ISO27001 certifications for enterprise customers.

---

*Last updated: March 1, 2026*