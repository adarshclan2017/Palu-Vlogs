# 🥦 Palu Vlogs — Official YouTube Vlogger Web Portal

> **Full-Stack Cinematic Web Application for Palu Vlogs** (Next.js 16 + MongoDB Atlas + Serverless API Handlers + Email Notifications).

---

## 🌟 Features

- **Cinematic Homepage**: Custom hero section, episode spotlight, fan-favorite vlogs, photo polaroids reel, and travel destination cards.
- **YouTube Vlog Archive**: Complete searchable directory with category filters, dynamic slug routing, and embedded modal video stream.
- **Photo Gallery**: Grid gallery with category/album filter and full-screen keyboard-navigable Lightbox.
- **Adventures / Destinations**: Interactive travel pins with location details, GPS coordinates, and cover photos.
- **Contact Us with Email Alerts**: Instant message submissions saved to **MongoDB Atlas** and dispatched via automatic email notifications.
- **Secure Admin Portal**:
  - Full CRUD management for Vlogs (auto YouTube thumbnail extraction).
  - Photo Gallery manager with album assignment.
  - Travel Destinations & Routes manager.
  - Contact Inquiries viewer with read/unread toggle and direct reply links.
- **Cloud Database**: Powered by **MongoDB Atlas** with automatic schema indexing and fallback memory caching.
- **Vercel Ready**: Full unified structure ready to deploy in 60 seconds with serverless API route handlers.

---

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router + Turbopack) & React 19
- **Styling**: Vanilla CSS Cinematic Dark Theme (Anton & Work Sans typography)
- **Database**: MongoDB Atlas via Mongoose
- **Authentication**: JWT & HTTP-only cookies
- **Deployment Target**: Vercel

---

## 🚀 Getting Started Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/adarshclan2017/Palu-Vlogs.git
   cd Palu-Vlogs/nextjs
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your environment variables in `nextjs/.env.local`:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret
   NOTIFICATION_EMAIL=your_email@gmail.com
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Deploying to Vercel

1. Import this repository in **[Vercel](https://vercel.com/new)**.
2. Set **Root Directory** to `nextjs`.
3. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NOTIFICATION_EMAIL`
4. Click **Deploy**!

---

## 👤 Admin Access

- **Login URL**: `/admin/login`
- **Default Email**: `admin@paluvlogs.com`
- **Default Password**: `Admin@123`
