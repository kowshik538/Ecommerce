# Modern E-commerce Platform 🛒

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Node](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18-blue)

A full-stack e-commerce platform built with modern technologies, featuring a user-friendly storefront, secure admin panel, and robust backend API. Perfect for showcasing products, managing inventory, and processing orders seamlessly.

---

## ✨ Features

### 🛍️ User Frontend
- **Responsive Design:** Mobile-first UI with TailwindCSS  
- **3D Product Visualization:** Built using Three.js + React Three Fiber  
- **Product Catalog:** Browse, search, filter products  
- **User Authentication:** JWT-based secure login/signup  
- **Shopping Cart:** Add/remove items, cart persistence  
- **Stripe Integration:** Secure payment processing  
- **Order Tracking:** Real-time order status  
- **Toast Notifications:** User-friendly alerts  

---

### 🔧 Admin Panel
- Dashboard with analytics (sales, users, inventory)  
- Product management (Add/Edit/Delete with image upload)  
- Order management with status updates  
- User account management  
- Inventory tracking with low-stock alerts  

---

### ⚙️ Backend API
- RESTful Express.js server  
- MongoDB with Mongoose ODM  
- Secure JWT authentication  
- Cloudinary image uploads  
- Nodemailer email notifications  
- Stripe webhooks for order fulfillment  

---

## 🚀 Tech Stack

**Frontend:**  
React 18, Vite, TailwindCSS, React Router, Axios, Swiper, Three.js  

**Admin Panel:**  
React 18, Vite, TailwindCSS, Axios  

**Backend:**  
Node.js, Express.js, MongoDB, Mongoose, JWT, Stripe, Cloudinary, Nodemailer  

**Deployment:**  
Railway, Vercel  

---

## 📦 Installation

### **Prerequisites**
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Git
  
---

## 🚀 Backend Setup

```bash
cd backend
npm install
cp .env.example .env    # Fill your credentials
npm run server
```

---

## 🎨 Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

---

## 🛠️ Admin Panel Setup

```bash
cd ../admin
npm install
npm run dev
```
## 🎯 Access the App

- **Frontend:** http://localhost:5173  
- **Admin Panel:** http://localhost:5174  
- **Backend API:** http://localhost:4000  

---

## 📁 Project Structure

```
Ordan/
├── admin/              # React admin panel
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/            # Node.js API server
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── .env.example
│   └── server.js
├── frontend/           # React user app
│   ├── src/
│   ├── public/
│   └── package.json
├── .gitignore
├── DEPLOYMENT.md
└── README.md
```

---

