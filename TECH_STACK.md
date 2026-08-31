# Gully Fame Tech Stack

This document outlines the technologies and libraries used across the Gully Fame monorepo, which includes the Mobile App, Admin Panel, Video Editor, and Backend.

## 🏗 Overall Architecture
- **Monorepo Management:** Turborepo
- **Package Manager:** Yarn (v4) Workspaces
- **Language:** TypeScript / JavaScript

---

## 📱 Mobile App (`apps/gully-fame-mobile`)
The primary mobile application built with React Native and Expo.

**Core Frameworks & Routing:**
- **Framework:** React Native / Expo (v54)
- **Routing & Navigation:** Expo Router, React Navigation (Stack, Bottom Tabs)

**State Management & Data Fetching:**
- **State Management:** Redux Toolkit, Zustand
- **Data Fetching:** React Query (`@tanstack/react-query`), Axios
- **Real-time Communication:** Socket.io Client

**UI & Styling:**
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **Typography:** Expo Google Fonts (Inter, Playfair Display, Poppins, Rubik)
- **Icons & Graphics:** Expo Vector Icons, React Native SVG
- **Animations:** React Native Reanimated, React Native Gesture Handler, React Native Blur

**Forms & Validation:**
- **Form Handling:** React Hook Form
- **Schema Validation:** Yup

**Media & Camera:**
- **Camera:** Expo Camera, React Native Vision Camera
- **Media Handling:** Expo Video, Expo Image Picker, Expo Media Library, Nitro Image

**Authentication & Services:**
- **Backend as a Service:** Firebase
- **Authentication:** Google Sign-In (`@react-native-google-signin/google-signin`)
- **Payments:** Razorpay (`react-native-razorpay`)
- **Error Tracking:** Sentry (`@sentry/react-native`)

**Storage & Device Features:**
- **Storage:** Async Storage, Expo Secure Store, Expo File System
- **Device Features:** Expo Haptics, Expo Location, Expo Notifications, Expo Clipboard, Expo Speech

---

## 💻 Admin Panel (`apps/gully-fame-admin`)
The web-based administrative dashboard.

**Core Framework:**
- **Framework:** Next.js (React)
- **Language:** TypeScript

**UI & Styling:**
- **Styling:** Tailwind CSS, PostCSS
- **Icons:** Lucide React
- **Data Visualization:** Recharts

---

## 🎬 Video Editor (`apps/videoeditor` & `packages/video-editor-core`)
A dedicated video editing application/module shared across the project.

**Core Video Processing:**
- **Engine:** FFmpeg (`ffmpeg-kit-react-native-community`)
- **Graphics Rendering:** Shopify React Native Skia
- **Filters:** React Native Color Matrix Image Filters

**Framework & Media:**
- **Framework:** Expo / React Native
- **Media Handling:** Expo AV, Expo Camera, Expo Media Library, React Native FS
- **Animations:** React Native Reanimated, React Native Worklets

---

## ⚙️ Backend (`gully-fame-backend`)
The API services supporting the applications.

**Core Technologies:**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database ORM:** Mongoose (MongoDB)
- **Middleware:** CORS, dotenv

---

## 🛠 Development Tools
- **Code Formatting & Linting:** ESLint, Prettier
- **Build Tool:** EAS CLI (Expo Application Services)
- **Testing:** Jest, React Native Testing Library
