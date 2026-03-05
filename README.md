# Smart Event Management Platform

A full-stack web application for managing events, registrations, QR-based attendance, certificate generation, and analytics with role-based access control.

This project was built as part of a full-stack internship assignment to demonstrate secure backend architecture, scalable design, and modern frontend integration.

---

# Live Application

Frontend  
https://smart-event-platform-alpha.vercel.app

Backend API  
https://smart-event-platform-ruu9.onrender.com

---

# Demo Video

https://drive.google.com/file/d/1kEAXHpyoV0xKvmzgdVeGMQlH34tCqAGz/view

---

# Demo Login Credentials

Volunteer (for QR attendance testing)

Email  
hello@gmail.com

Password  
12345678

---

# Problem Statement

Colleges and organizations conduct many events but face challenges such as:

• Managing registrations efficiently  
• Preventing duplicate registrations  
• Tracking attendance reliably  
• Generating certificates manually  
• Monitoring event participation  

This platform solves these problems through a centralized event management system.

---

# Tech Stack

Frontend  
React.js  
Tailwind CSS  
Framer Motion  
Recharts  

Backend  
Node.js  
Express.js  

Database  
MongoDB (Mongoose)

Authentication  
JWT (JSON Web Token)

Libraries Used  

• html5-qrcode  
• PDFKit  
• QRCode  
• bcryptjs  
• nodemailer  
• express-rate-limit  

Deployment  

Frontend → Vercel  
Backend → Render  

---

# System Architecture

Frontend (React)
        |
        | REST API
        v
Backend (Node.js + Express)
        |
        v
Database (MongoDB)

---

# User Roles

The system supports four user roles with different permissions.

### Admin

• View all users  
• View all events  
• View system analytics  

### Organizer

• Create events  
• Edit events  
• Delete events  
• View event registrations  

### Volunteer

• Scan participant QR codes  
• Mark attendance  

### Participant

• Register and login  
• View available events  
• Register for events  
• View registration status  
• Download certificate after attending  

---

# Core Features

## Authentication & Authorization

• Secure login and registration  
• Password hashing using bcrypt  
• JWT authentication  
• Role-based route protection  

---

## Event Management

• Create event  
• Edit event  
• Delete event  
• Capacity validation  
• Registration deadline validation  

---

## Registration System

• One user can register only once per event  
• Unique QR code generated for each registration  

---

## QR Attendance System

Flow:

1. Participant registers for event  
2. System generates unique QR code  
3. Volunteer scans QR code  
4. Backend verifies registration  
5. Attendance marked in database  

---

## Certificate Generation

Certificates are generated dynamically and include:

• Participant name  
• Event name  
• Event date  
• Unique certificate ID  
• QR code verification  

Certificates can only be downloaded if attendance is marked.

---

## Dashboard & Analytics

Admin dashboard shows:

• Total users  
• Total events  
• Total registrations  
• Event-wise attendance percentage  

---

# API Endpoints

## Authentication

POST /api/auth/register  
POST /api/auth/login  

## Events

GET /api/events  
POST /api/events  
PUT /api/events/:id  
DELETE /api/events/:id  

## Registrations

POST /api/registrations/:eventId  
GET /api/registrations/my  

## Attendance

POST /api/attendance  

## Certificates

GET /api/certificate/:eventId  

## Admin

GET /api/admin/stats  

---

# Environment Variables

Backend requires the following environment variables:

PORT=5000  
MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_secret_key  
EMAIL=your_email  
EMAIL_PASS=your_email_password  
FRONTEND_URL=https://smart-event-platform-alpha.vercel.app  

These environment variables are required for database connection, authentication, email notifications, and frontend-backend communication.

---

# Local Installation

Clone the repository

git clone https://github.com/devvarshney45/smart-event-platform.git

Backend setup

cd backend  
npm install  
npm run dev  

Frontend setup

cd frontend  
npm install  
npm run dev  

---

# Security Features

• Password hashing using bcrypt  
• JWT authentication  
• Role-based access control  
• Express rate limiting  
• Server-side validation  

---

# Future Improvements

• Event banner upload  
• Email reminders before events  
• Advanced analytics dashboard  
• CSV attendance export  

---

# Author

Dev Varshney  

Full Stack Developer Project

---

# Demo Flow

1. User registers and logs in  
2. Organizer creates an event  
3. Participant registers for event  
4. QR code generated for registration  
5. Volunteer scans QR code  
6. Attendance marked  
7. Participant downloads certificate
