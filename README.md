# 🛡️ AI Nexus Insight — Premium Clinic SaaS

**AI Nexus Insight** is a state-of-the-art, multi-tenant SaaS platform designed to modernize clinic management and eliminate patient no-shows through advanced AI analytics and automated communication.

![Demo](demo_walkthrough.gif)

## ✨ Features

- **🚀 Kiosk-Style Booking:** A friction-less, step-by-step patient booking interface designed for speed and high conversion.
- **📱 Automated SMS Confirmations:** Instant text messages sent to patients via Twilio when appointments are confirmed.
- **📊 AI Analytics Dashboard:** Deep insights into patient patterns, identifying riskiest no-show days and times.
- **🎨 Premium "Apple-Style" UI:** A clean, glassmorphic white theme with smooth animations and mesh gradients.
- **🏢 Multi-Tenant Architecture:** Unique booking slugs for every clinic (e.g., `/book/your-clinic`).
- **🛡️ Data Security:** Robust authentication and tenant isolation.

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS, Recharts, Framer Motion (Glassmorphic Design).
- **Backend:** Node.js, Express, MongoDB (Mongoose).
- **Automation:** Twilio API for SMS notifications.
- **Deployment:** Vercel (Frontend & Serverless Backend).

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- Twilio Account

### Installation

1. **Clone the repo:**
   ```bash
       git clone https://github.com/mhassannaseerahmed-arch/insightnexus.git
   cd insightnexus
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   # Create a .env file with:
   # PORT=5000
   # MONGODB_URI=your_mongo_uri
   # TWILIO_ACCOUNT_SID=your_sid
   # TWILIO_AUTH_TOKEN=your_token
   # TWILIO_PHONE_NUMBER=your_number
   npm run dev
   ```

3. **Setup Frontend:**
   ```bash
   cd ../frontend
   npm install
   # Create a .env file with:
   # VITE_API_URL=http://localhost:5000
   npm run dev
   ```

## 📈 Roadmap
- [x] Multi-tenant Slugs
- [x] Automated SMS Confirmations
- [x] Premium White Theme Redesign
- [ ] WhatsApp Integration
- [ ] Patient Reply-to-Confirm (SMS Webhooks)
- [ ] Multi-provider Calendar Sync

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ❤️ by [Your Name/Clinic Name]
