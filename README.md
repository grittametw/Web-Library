# Web-Library 📚

A full-stack web application built as an **E-Commerce / Digital Library platform**.  
This project demonstrates my ability to design, develop, and deploy a modern web application using **Next.js**, **Node.js**, and **PostgreSQL**, with a strong focus on clean UI, scalable architecture, and real-world problem solving.

---

## 🌐 Live Demo

🔗 https://web-library-grittametwilai.vercel.app

---

## 📌 About This Project

Web-Library is a web-based platform that allows users to browse digital products, manage favorites, and interact with a complete shopping flow.  
The project was developed as part of my portfolio to showcase **frontend, backend, and database integration skills** in a production-like environment.

This application includes both user-facing features and admin-oriented functionality, simulating a real-world e-commerce system.

---

## 🛠 Tech Stack

### Frontend
- Next.js (App Router)
- React
- TypeScript
- Bootstrap
- MUI (Material UI)

### Backend
- Node.js
- REST API Architecture
- Server-side data fetching

### Database
- PostgreSQL (Managed Database)

### Tools & Deployment
- Git & GitHub
- Vercel (Deployment)
- VS Code

---

## ✨ Key Features

- 🔹 **Product Browsing**
  - View products with detailed information

- 🔹 **Favorites System**
  - Users can add and remove items from their favorites list

- 🔹 **Shopping Cart**
  - Add, update, and remove items
  - Real-time cart state management

- 🔹 **Admin Dashboard**
  - Manage product data
  - Control application content

- 🔹 **Modern UI & UX**
  - Clean layout with Tailwind CSS and MUI components
  - Optimized for performance and usability

---

## 🧩 Project Structure

```bash
src/
├─ app/ # Next.js App Router pages & layouts
│  ├─ api/ # API routes
│  ├─ layout.tsx # Global layout
│  └─ page.tsx # Home page
├─ config/ # Database
├─ context/ # React Context providers for global state
├─ hooks/ # Custom React hooks
├─ lib/ # Database & utility functions
├─ styles/ # CSS files
├─ types/ # Shared TypeScript types
├─ components/ # Reusable UI components
└─ middleware.ts # Route protection & request handling
```

---

## ⚙️ Installation & Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/grittametw/Web-Library.git
cd Web-Library
```
### 2. Install dependencies
```bash
npm install
```
### 3. Configure environment variables
Create a .env.local file:
```bash
POSTGRES_URL=your_database_url
```
### 4. Run the development server
```bash
npm run dev
```

---

## 🔧 Environment & Security Notes

During deployment, the application connects to a managed PostgreSQL database that uses a self-signed SSL certificate.

For demo and portfolio purposes, SSL certificate verification is disabled in the production environment by setting the following environment variable on Vercel:
```bash
NODE_TLS_REJECT_UNAUTHORIZED=0
```
This configuration prevents the SELF_SIGNED_CERT_IN_CHAIN error when establishing database connections.


## ⚠️ Important:
This setup is intended only for demonstration and portfolio purposes.
In a real production environment, SSL verification should always be enabled using a trusted Certificate Authority (CA) to ensure secure and encrypted communication.

---

## 👤 Author

Grittamet Wilai

📧 w.grittamet@gmail.com

💻 https://github.com/grittametw

---

© 2026 Grittamet Wilai. All rights reserved.