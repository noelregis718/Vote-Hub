# 🗳️ VoteHub | Premium Voting & eAuction Ecosystem

VoteHub is a high-fidelity, secure, and aesthetically stunning platform designed for community governance and premium asset auctions. Built with a focus on **security**, **viral growth**, and **visual excellence**, it delivers a seamless cross-platform experience.

![VoteHub Banner](https://img.shields.io/badge/VoteHub-Fullstack-black?style=for-the-badge)
![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite 8](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind 4](https://img.shields.io/badge/Tailwind_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

---

## ✨ Key Modules

### 🗳️ Secure Voting & Polls
- **🛡️ Integrity First**: JWT-based session management and bcrypt password hashing ensure every vote counts and is secure.
- **📊 Real-time Analytics**: Immediate results with glassmorphic, percentage-based visualizations.
- **📝 Launch in Seconds**: A minimalist interface for creating complex polls with multiple candidates.

### 🔨 Premium eAuction Platform
- **💎 High-Fidelity Bidding**: A custom, real-time bidding interface with ownership verification.
- **🖼️ Asset Management**: Launch auctions with high-resolution image uploads (up to 50MB) and detailed descriptions.
- **📅 Advanced Scheduling**: Precise auction end-date selection using a custom premium calendar system.
- **🔍 Smart Discovery**: Robust search and multi-criteria sorting (Newest, Price, Popularity).

### 🚀 Viral Sharing & Deep Linking
- **📲 Cross-Platform Reach**: Integrated sharing for **WhatsApp**, **Email**, and Social Media.
- **🔗 Deep Linking**: Shared links automatically highlight and focus on the specific poll or auction, ensuring a perfect landing experience on mobile devices.

---

## 🎨 Design Philosophy
VoteHub follows a **Premium Monochrome** design system:
- **Glassmorphism**: Translucent card layouts with backdrop-blur and subtle borders.
- **Sharp Aesthetics**: Standardized sharp corner radii (8px) for an enterprise-grade feel.
- **Inter Typography**: Clean, sans-serif typography (Inter) used globally for maximum readability.
- **Sentence-Case UI**: Approachable and modern button/header casing throughout the app.

---

## 🛠️ Modern Tech Stack

### Frontend
- **Framework**: [React 19](https://reactjs.org/) (Latest)
- **Bundler**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide Icons](https://lucide.dev/)

### Backend
- **Server**: [Node.js](https://nodejs.org/) (Express 4)
- **Infrastructure**: [Prisma ORM](https://www.prisma.io/) with **PostgreSQL**
- **Payload Capacity**: Configured for high-res asset uploads (50MB Body Limits)
- **Security**: Stateless JWT Authentication

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL Instance

### Quick Setup

1. **Environment Config**:
   Create a `.env` in the `backend/` directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/votehub"
   JWT_SECRET="your_secure_hash"
   PORT=5000
   ```

2. **Install & Launch Everything**:
   Run the following in the root directory:
   ```bash
   npm run install:all
   npm run dev
   ```

---

### Available Scripts

- `npm run dev`: Starts both frontend and backend concurrently.
- `npm run install:all`: Installs all dependencies for root, backend, and frontend.
- `npm run db:generate`: Runs Prisma generate in the backend.
- `npm run db:migrate`: Runs Prisma migrations in the backend.

---

## 📂 Architecture
```text
VoteHub/
├── backend/                # Node.js + Prisma Infrastructure
│   ├── prisma/             # Schema & Migrations
│   └── src/                # Authentication & Business Logic
└── frontend/               # React 19 Powerhouse
    ├── src/
    │   ├── components/     # UI Design System (Glassmorphic)
    │   ├── context/        # Global Auth & State
    │   └── pages/          # EAuction & Dashboard Modules
```

Built with visual excellence and security.
