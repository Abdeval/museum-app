# 🚀 Project Setup Guide

This guide helps you set up and run both the frontend (Expo) and backend (NestJS) for development.

---

## 1. Backend Setup 💠

### 1.1 Navigate to the Server Directory

```bash
cd server
```

### 1.2 Install Backend Dependencies

```bash
npm install
```

### 1.3 Reset and Restart the Database (Docker)

```bash
npm run db:dev:restart
```

> Uses `docker-compose` to manage the database container.

### 1.4 Return to the Root Directory

```bash
cd ..
```

---

## 2. Frontend Setup 📱

### 2.1 Install Frontend Dependencies

Ensure you're in the root project directory:

```bash
npm install
```

---

## 3. Start Development Servers ▶️

You’ll need **two terminal windows/tabs**:

### Terminal 1: Start the Expo Frontend

```bash
npx expo start
```

This provides options to open the app via:

- Development build
- Android emulator
- iOS simulator
- Expo Go (limited sandbox)

### Terminal 2: Start the NestJS Backend

```bash
cd server
npm run start:dev
```

---

## 4. Run on a Mobile Device ✨

- After `npx expo start`, scan the QR code using the **Expo Go** app on Android/iOS.
- The app should load on your device.
- Begin developing by editing files in the `app` directory (uses file-based routing).

---

## 🧹 Optional: Reset the Frontend

Start fresh by resetting the frontend:

```bash
npm run reset-project
```

> Moves starter code to `app-example` and creates a new, empty `app` directory.

---

## 📚 Resources to Learn More

- **Expo Documentation**  
  [https://docs.expo.dev/](https://docs.expo.dev/)

- **Learn Expo Tutorial**  
  [https://docs.expo.dev/tutorial/introduction/](https://docs.expo.dev/tutorial/introduction/)

---

## 🤝 Community

- **Expo on GitHub**  
  [https://github.com/expo/expo](https://github.com/expo/expo)

- **Discord Community**  
  [https://chat.expo.dev](https://chat.expo.dev)

---
