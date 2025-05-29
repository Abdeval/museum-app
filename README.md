Markdown

# Welcome to Your Expo App 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

This project includes both a frontend Expo application and a backend NestJS server located in the `server` directory.

## 🚀 Get Started

Follow these steps to get your development environment up and running:

### 1. Setup and Run the Backend Server ⚙️

The backend server uses NestJS and Docker for the database.

```bash
# Navigate to the server directory
cd server

# Install backend dependencies
npm install

# Reset and restart the database Docker container
# This command uses docker-compose to manage the database.
npm run db:dev:restart

# Return to the root project directory
cd ..
2. Install Frontend Dependencies 📱
Now, let's install the packages for the Expo frontend.

Bash

# Ensure you are in the root project directory
npm install
3. Start Both Frontend and Backend Development Servers ▶️
You'll need two terminal windows or tabs for this:

Terminal 1: Start the Expo App (Frontend)

Bash

# Ensure you are in the root project directory
npx expo start
In the output, you'll find options to open the app in a:

Development build
Android emulator
iOS simulator
Expo Go, a limited sandbox for trying out app development with Expo
Terminal 2: Start the NestJS Server (Backend)

Bash

# Navigate to the server directory
cd server

# Start the backend server in development mode
npm run start:dev
4. Connect Expo Go and Start Developing ✨
Once the Expo development server (npx expo start) is running, it will display a QR code.
Open the Expo Go app on your physical Android or iOS device.
Scan the QR code using the Expo Go app.
Your app should now load on your device.
You can start developing by editing the files inside the app directory. This project uses file-based routing.
🧹 Get a Fresh Project (Optional)
If you want to reset the frontend starter code and begin with a blank app directory:

Bash

# Ensure you are in the root project directory
npm run reset-project
This command will move the existing starter code from the app directory to app-example and create a new, empty app directory.

📚 Learn More
To learn more about developing your project with Expo, check out these resources:

Expo Documentation: https://docs.expo.dev/ - Learn fundamentals or explore advanced topics with official guides.
Learn Expo Tutorial: https://docs.expo.dev/tutorial/introduction/ - A step-by-step guide to creating a project that runs on Android, iOS, and the web.
🤝 Join the Community
Connect with other developers creating universal apps:

Expo on GitHub: https://github.com/expo/expo - View the open-source platform and contribute.
Discord Community: https://chat.expo.dev - Chat with Expo users and ask questions.
<!-- end list -->