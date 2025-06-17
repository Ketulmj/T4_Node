# 🕒 TimeFourthe

**TimeFourthe** is a web-based platform designed for educational institutions to **generate & manage weekly timetables** efficiently. It simplifies the timetable creation process, ensures secure user access, and provides real-time notifications through email services.

## 📌 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [User Roles](#-user-roles)
- [Mailing Services](#-mailing-services)

## ✨ Features

- Role-based access for Organizations, Teachers, and Students
- Secure JWT-based authentication
- Dynamic timetable generation & management
- Absence tracking and real-time email notifications
- Admin approval flow for organization onboarding
- SMTP-powered mailing services
- Clean and Modern UI

## 🛠️ Tech Stack

|    Layer          | Technology          |
|-------------------|---------------------|
|    Frontend       | React.js (Vite)     |
|    Backend        | Express.js & Node.js|
|    Database       | MongoDB             |
|    Mailing        | Nodemailer (SMTP)   |
|    Hosting        | Vercel (Frontend)   |

## 👥 User Roles
### 🏢 Organization
- Create/manage weekly timetables
- Share signup links for Teachers & Students

### 👨‍🏫 Teacher
- Views personal weekly schedule
- Mark absences (triggers email to students)

### 🎓 Student
- View class-specific timetable
- Receive real-time email absence notifications

## 📧 Mailing Services
- Authorization – for pending organizations
- Authorization approval – for pending organizations
- Authorization Success – mail for approval/rejection status
- Password Reset – triggered on forgot password
- Absence Notification – to respective class students when a teacher is absent
- 
