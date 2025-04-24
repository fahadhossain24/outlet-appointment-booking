# Salon Booking Backend

A modern, scalable backend application for salon appointment management built with TypeScript, Express.js, and MongoDB. This application provides a robust solution for managing salon bookings, user management, and real-time chatting with socket.io.

## Features

- 📅 Appointment Management
  - Create, update, and cancel appointments
  - Real-time booking availability
  - Automated appointment reminders
  - schedule management
- 📱 User Management
  - Secure user authentication
  - Email verification
  - Profile management
- 🎯 Real-time Updates
  - Socket.IO integration for real-time notifications
  - Instant booking status updates
- Real-time Chat
  - Socket.IO integration for real-time chat
- 📤 File Management
  - AWS S3 integration for file storage
  - Secure document handling
- 🛡️ Security Features
  - JWT-based authentication
  - Rate limiting
  - Input validation
  - Password hashing

## Tech Stack

- **Backend**: Node.js, Express.js
- **Language**: TypeScript
- **Database**: MongoDB, mongoose
- **Authentication**: JWT
- **Real-time**: Socket.IO
- **File Storage**: AWS S3
- **Email Service**: Nodemailer
- **Validation**: Zod
- **Security**: Bcrypt
- **Cloud Compute Service**: AWS-EC2
- **Security**: Helmet, CORS, Rate limiting
- **Performance**: compression middleware
- **Development**: Prettier & ESLint

## Prerequisites

- Node.js (v20 or higher)
- MongoDB
- AWS Account
- Nodemailer SMTP credentials

## Installation

1. Clone the repository:
```bash
git clone https://github.com/fahadhossain24/outlet-appointment-booking.git
cd outlet-appointment-booking
```
### 2. Environment Setup
```bash
cp .env.example .env
```

### 3. Install Depencencies
```bash
yarn install
# or
npm install
```

### 4. Run in Development
```bash
yarn dev
# or
npm run dev
```

### 5. Run in Production
```bash
npm run build
npm start
# or
yarn build
yarn start
```

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add some amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

## 📢 Support
For support, email fahadhossain0503@gmail.com