# 🎉 Festify - Local Event Aggregator

Festify is a **local event aggregator app** that allows users to **discover, create, and manage events** with ease. It features **secure authentication, event ticketing with QR codes, and an organizer panel for check-in management**.

---

## 🚀 Features

- 🔑 **User Authentication** (JWT-based)
- 🎟 **Event Ticketing** with **QR Code Check-in**
- 📅 **Event Management** (Create, Update, Delete Events)
- 📸 **Image Uploads** for Event Banners
- 🔍 **Search & Filter Events**
- 📍 **Location-Based Event Discovery**
- 📊 **Organizer Dashboard** for Check-ins

---

## 🏗️ Tech Stack

| Technology  | Purpose |
|-------------|---------|
| **React.js** | Frontend UI |
| **Node.js & Express.js** | Backend API |
| **MongoDB** | Database |
| **JWT & Bcrypt.js** | Authentication & Security |
| **Multer** | Image Uploads |
| **QR Code Generator & Scanner** | Ticket Check-in |

---

## 📦 Installation & Setup

```sh
# 1️⃣ Clone the repository
git clone https://github.com/your-username/festify.git
cd festify

# 2️⃣ Install backend dependencies
cd backend
npm install

# 3️⃣ Install frontend dependencies
cd ../frontend
npm install

# 4️⃣ Set up environment variables
# Create a `.env` file in the `backend` directory with:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# 5️⃣ Run the application
# Start backend server
cd backend
npm start

# Start frontend
cd ../frontend
npm start
