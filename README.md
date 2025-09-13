# BaliBaBa

A simple **E-commerce web application** built with **Firebase (Auth + Firestore)** and **Node.js/Express** for routing.  
Users can register/login, browse products, add items to cart, place orders, add products, and all updates are synced in real-time from Firestore.

---

## ✨ Features
- 🔐 User authentication (Firebase Auth)
- 🛒 Shopping cart with local storage
- 📦 Order checkout with customer details
- 📡 Real-time product updates from Firestore
- 🚪 Secure login/logout with redirects
- 🌐 Node.js/Express server for serving pages

---

## 📂 Project Structure
```
├── server.js          # Express server
├── .env               # Environment variables
├── package.json       
├── public/
│   ├── index.html     # Shop page
│   ├── login.html     # Login page
│   ├── register.html  # Registration page
│   ├── js/
│   │   ├── app.js     # Shop logic
│   │   ├── login.js   # Login logic
│   │   ├── register.js# Register logic
│   │   └── config.js  # Firebase config (loads from .env in production)
│   └── css/           # Styles
```

---

## ⚙️ Setup & Installation

### 1. Clone repository
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env` file
Create a `.env` file in the project root with your Firebase config:
```env
FIREBASE_API_KEY="your_api_key"
FIREBASE_AUTH_DOMAIN="your_auth_domain"
FIREBASE_PROJECT_ID="your_project_id"
FIREBASE_STORAGE_BUCKET="your_storage_bucket"
FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
FIREBASE_APP_ID="your_app_id"
```

> ⚠️ `.env` is included in `.gitignore` so your secrets won’t be exposed.

### 4. Run the server
```bash
node server.js
```

App will be available at:  
👉 `http://localhost:5500/`