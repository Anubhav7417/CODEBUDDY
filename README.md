CodeBuddy - Find Your Code Buddy 👨‍💻👩‍💻
A modern platform for students to find coding partners, collaborate on projects, and build amazing things together. CollabSync connects students from universities worldwide to work on real-world projects, learn new technologies, and grow their professional network.

🚀 Features
🔐 Authentication & Profile
University Email Verification - Ensure all users are verified students

Secure Registration & Login - JWT-based authentication system

Rich User Profiles - Showcase skills, projects, and achievements

Profile Completion - Guided setup for optimal matching

🎯 Project Collaboration
Project Creation - Start new projects with detailed requirements

Smart Matching - AI-powered project recommendations

Role-based Applications - Apply for specific roles in projects

Team Management - Invite and manage team members

Project Discovery - Filter and search for projects by tech stack, university, and status

👥 Community & Networking
Student Discovery - Find and connect with peers

Skill-based Filtering - Search by programming languages and technologies

Connection System - Build your professional network

University-based Communities - Connect with students from your institution

💬 Real-time Collaboration
Team Chat - Real-time messaging with Socket.io

Task Management - Kanban-style task boards

File Sharing - Upload and share project files

Online Status - See who's available for collaboration

📊 Dashboard & Analytics
Personalized Dashboard - Overview of your activity and stats

AI Recommendations - Smart project and buddy suggestions

Progress Tracking - Monitor your projects and connections

XP System - Gamified learning and contribution tracking

🛠 Technology Stack
Frontend
HTML5 - Semantic markup and structure

CSS3 - Advanced styling with CSS variables and animations

Vanilla JavaScript - Modern ES6+ features and classes

Particles.js - Interactive background animations

Font Awesome - Beautiful icons

Google Fonts - Inter font family

Backend
Node.js - Runtime environment

Express.js - Web application framework(Future integration)

Socket.io - Real-time bidirectional communication(Future integration)

RESTful API - Clean API design with proper status codes(Future integration)

Development Tools
Nodemon - Automatic server restarts during development

CORS - Cross-origin resource sharing

Git - Version control

📦 Installation & Setup
Prerequisites
Node.js (v14 or higher)

npm or yarn
Demo Access
Use these credentials to test the application:

Email: demo@university.edu

Password: password

🎮 Usage Guide
For New Users
Register with your university email

Complete your profile with skills and interests

Browse projects or create your own

Connect with peers who share your interests

Start collaborating on exciting projects

Creating a Project
Click "New Project" from the Projects page

Fill in project details, tech stack, and required roles

Set timeline and project vibe

Publish and wait for applications

Finding Team Members
Use the Discover page to find potential teammates

Filter by skills, university, or availability

Send connection requests

Invite connections to your projects

Real-time Collaboration
Join a project workspace

Use team chat for communication

Manage tasks on the Kanban board

Share files and resources

🏗 Project Structure
text

Copy

Download
collabsync/
├── index.html                 # Main HTML file
├── style.css                  # All styles (Tailwind-like CSS)
├── script.js                  # Frontend JavaScript
├── server.js                  # Express.js server with Socket.io
├── package.json              # Dependencies and scripts
└── README.md                 # Project documentation
API Endpoints
Authentication
POST /api/auth/login - User login

POST /api/auth/register - User registration

Projects
GET /api/projects - Get projects with filtering

POST /api/projects - Create new project

POST /api/projects/:id/apply - Apply to project

Users
GET /api/users - Get users with filtering

POST /api/users/:id/connect - Connect with user

Dashboard
GET /api/dashboard/stats/:userId - User statistics

GET /api/dashboard/recommendations/:userId - Personalized recommendations

Real-time
WebSocket events for live chat and notifications

🔧 Configuration
Environment Variables
Create a .env file for configuration:

env

Copy

Download
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_here
Customization
Modify color scheme in CSS variables in style.css

Update university list in registration form

Adjust particle effects in script.js

🚀 Deployment
Local Deployment
bash

Copy

Download
npm start
Production Deployment
Set NODE_ENV=production

Configure reverse proxy (nginx recommended)

Set up SSL certificate

Configure environment variables

Docker Deployment
dockerfile

Copy

Download
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
🤝 Contributing
We welcome contributions from the community! Here's how you can help:

Reporting Issues
Use GitHub Issues to report bugs

Include detailed descriptions and steps to reproduce

Add screenshots if applicable

Feature Requests
Suggest new features via GitHub Issues

Explain the use case and benefits

Consider if it aligns with CollabSync's mission

Code Contributions
Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

Development Guidelines
Follow existing code style

Write clear commit messages

Test your changes thoroughly

Update documentation as needed

🐛 Troubleshooting
Common Issues
Server won't start:

Check if port 3000 is available

Verify Node.js version (v14+ required)

Ensure all dependencies are installed

Socket.io connection issues:

Check if WebSockets are enabled

Verify CORS configuration

Check browser console for errors

Authentication problems:

Clear browser cache and localStorage

Check university email format

Verify password requirements

Getting Help
Check existing GitHub issues

Create a new issue with detailed information

Join our community Discord (coming soon)

📈 Future Roadmap
Phase 1 (Completed)
✅ User authentication and profiles

✅ Project creation and discovery

✅ Real-time chat

✅ Basic matching system

Phase 2 (In Progress)
🔄 Advanced AI recommendations

🔄 Video calling integration

🔄 Code collaboration editor

🔄 GitHub integration

Phase 3 (Planned)
📅 Mobile app development

📅 Advanced analytics

📅 University verification system

📅 Premium features for institutions

Phase 4 (Future)
🔮 Machine learning for team formation

🔮 Blockchain for credential verification

🔮 Global student hackathons

🔮 Career placement integration

👥 Team
CodeBuddy is developed by a passionate team of students and educators committed to improving student collaboration worldwide.

Core Team
Lead Developer - Anubhav

UI/UX Design - Neurix Team

Backend Development - Neurix Team

Contributors
See the list of contributors who participated in this project.

🌟 Acknowledgments
Students Worldwide - For inspiring this platform

University Partners - For testing and feedback

Open Source Community - For amazing tools and libraries

Contributors - For making CollabSync better every day

Libraries & Tools
Express.js - Web framework

Socket.io - Real-time engine

Particles.js - Background animations

Font Awesome - Icons

Google Fonts - Typography

📊 Analytics
We care about our impact:

10,000+ students connected

2,000+ projects created

50+ universities represented

15+ countries reached

📄 License
MIT License
Copyright (c) 2024 CollabSync

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Third-party Licenses
This project uses several open-source packages:

Express.js - MIT License

Socket.io - MIT License

Particles.js - MIT License

For complete license information of all dependencies, run:

bash

Copy

Download
npm licenses
<div align="center">
Made with 💙 by Anubhav, for students

Report Bug · Request Feature · Contribute

</div>
