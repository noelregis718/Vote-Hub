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
- **📈 Dashboard KPIs**: Instant oversight with real-time tiles for Total Polls, Active Votes, and Completion statuses.
- **💾 Drafting Workspace**: Persistent, database-backed drafting system with full "Continue Editing" support.

### 🔨 Premium eAuction Platform
- **💎 High-Fidelity Bidding**: A custom, real-time bidding interface with ownership verification.
- **🖼️ Asset Management**: Launch auctions with high-resolution image uploads and detailed descriptions.
- **📅 Advanced Scheduling**: Precise auction and poll end-date selection using a custom premium calendar system.

### 📈 Market Intelligence (Trending)
- **🧠 Sentiment Analysis**: Real-time global market trends powered by **Alpha Vantage**.
- **📊 Sentiment Badges**: Instant visual feedback on whether a story is **Bullish**, **Bearish**, or **Neutral**.
- **🔒 Secure Proxy**: High-performance backend news proxy ensuring API keys remain private and CORS-free.

### 🚀 Viral Sharing & Deep Linking
- **📲 Cross-Platform Reach**: Integrated sharing for **WhatsApp**, **Email**, and Social Media.
- **🔗 Deep Linking**: Shared links automatically highlight specific polls or auctions on any device.

---

## 🎨 Design Philosophy
VoteHub follows a **Premium Monochrome** design system:
- **Glassmorphism**: Translucent card layouts with backdrop-blur and subtle borders.
- **Sharp Aesthetics**: Standardized sharp corner radii (8px) for an enterprise-grade feel.
- **Inter Typography**: Clean, sans-serif typography (Inter) used globally.
- **Minimalist Feedback**: Integrated, glassmorphic success modals that replace invasive browser alerts.

---

## 🛠️ Modern Tech Stack

### Frontend
- **Framework**: [React 19](https://reactjs.org/)
- **Bundler**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide Icons](https://lucide.dev/)

### Backend
- **Server**: [Node.js](https://nodejs.org/) (Express 5)
- **Infrastructure**: [Prisma ORM](https://www.prisma.io/) with **PostgreSQL**
- **Security**: Stateless JWT & Passport.js Google OAuth 2.0 Integration

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- PostgreSQL Instance
- Alpha Vantage API Key (for Market Intelligence)

### Quick Setup

1. **Environment Config**:
   Create a `.env` in the `backend/` directory:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://user:password@localhost:5432/votehub"
   JWT_SECRET="your_secure_hash"
   SESSION_SECRET="your_session_secret"
   
   # Social Login
   GOOGLE_CLIENT_ID="your_google_client_id"
   GOOGLE_CLIENT_SECRET="your_google_client_secret"
   
   # Market Intelligence
   ALPHAVANTAGE_KEY="your_alphavantage_api_key"
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
│   └── src/                # Auth, Market Intelligence & Logic
└── frontend/               # React 19 Powerhouse
    ├── src/
    │   ├── components/     # UI Design System (Glassmorphic)
    │   ├── context/        # Global Auth & State
    │   └── pages/          # EAuction, Trending & Dashboard
```

Built with visual excellence and security.
