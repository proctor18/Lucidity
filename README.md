# Lucidity

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Roles & Permissions](#roles--permissions)
- [Contributing](#contributing)
- [License](#license)

## Introduction
This tutoring scheduling application simplifies the process of scheduling tutoring sessions between students and tutors. The app provides profiles for three main user types: **Sysadmins**, **Tutors**, and **Students**, each with role-specific features.

Sysadmins can manage users, configure system settings, and generate reports. Tutors can manage their availability, view scheduled sessions, and communicate with students. Students can browse tutor profiles, book sessions, and track their learning progress.

Group Members:
Liam Prsa
## Features
- **User Profiles:** Sysadmins, Tutors, and Students with tailored features for each role.
- **Scheduling System:** Easy-to-use session booking system with calendar integration.
- **User Management:** Full control for Sysadmins over user roles, permissions, and activity monitoring.
- **Session Management:** Tutors and students can view, modify, and cancel sessions.
- **Notifications:** Real-time notifications for session updates and reminders.
- **Analytics Dashboard:** Detailed reports on sessions, user activity, and payments.
- **Payment Integration:** Secure payment gateway to handle transactions between students and tutors.
- **Multi-platform Support:** Mobile-first design with support for web and mobile devices.

## Tech Stack
- **Frontend:** React Native
- **Backend:** Node.js (Express)
- **Database:** PostgreSQL
- **Authentication:** Firebas
- **Calendar Integration:** Google Calendar API

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB or PostgreSQL
- Stripe Account (for payment integration)
- Firebase / Auth0 Account (for authentication)

### Steps
1. Clone the repository:
    ```bash
    git clone https://github.com/ayubswrld/tutoring-scheduler.git
    ```
2. Navigate to the project directory:
    ```bash
    cd tutoring-scheduler
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Set up environment variables:
   - Create a `.env` file in the root directory with the following:
     ```
     DB_URI=<your-database-uri>
     STRIPE_SECRET_KEY=<your-stripe-secret-key>
     FIREBASE_API_KEY=<your-firebase-api-key>
     ```
5. Start the development server:
    ```bash
    npm run dev
    ```

6. Access the application at `http://localhost:3000`.

## Usage

### Sysadmin
- **Manage Users**: View and control all student and tutor accounts.
- **Monitor System Health**: Review system logs and performance reports.
- **View Analytics**: Get detailed insights into user engagement and financial reports.
  
### Tutor
- **Manage Availability**: Set available times for students to book sessions.
- **Track Sessions**: View upcoming, completed, and canceled sessions.
- **Communicate with Students**: Send and receive messages directly in the app.

### Student
- **Browse Tutors**: Search for tutors based on subject or availability.
- **Book Sessions**: Schedule one-on-one tutoring sessions with preferred tutors.
- **Track Progress**: View past sessions and follow up on assignments or learning goals.

## Roles & Permissions

### Sysadmin
- **Full access** to manage users, sessions, payments, and system configurations.

### Tutor
- **Limited access** to manage their own sessions, availability, and communication with students.

### Student
- **Access** to browse, schedule, and manage their tutoring sessions.

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
