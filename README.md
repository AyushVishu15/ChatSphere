ChatSphere Application
ChatSphere is a full-stack web application designed for seamless real-time communication. It allows users to sign up, log in, manage friends, and chat instantly with a clean, modern, and responsive interface. Built with a React frontend and a Node.js/Express backend, it uses Neon PostgreSQL for cloud-based data storage and Socket.IO for real-time messaging. JWT-based authentication ensures secure user access, while Tailwind CSS provides a sleek, responsive design.
Features

User Authentication: Secure signup and login using JWT-based authentication.
Friend Management: Search for users, send/accept friend requests, block users, and manage friend lists.
Real-Time Messaging: Send and receive messages instantly with Socket.IO, with timestamps stored in the database.
Responsive Design: Modern UI with Tailwind CSS, optimized for desktop and mobile devices.
Navigation: Seamless routing with React Router, including login, signup, and chat pages.
Visual Elements:
Landing page with a gradient-styled "Connect, Chat, Collaborate" hero section.
"Chat, Vibe, Unite" slogan in a cursive Dancing Script font.
Preview image (A.jpeg) and favicon (PP (2).jpeg) for branding.


Database Persistence: Store users, friends, friend requests, blocked users, and messages in Neon PostgreSQL.

Tech Stack
Frontend

React: JavaScript library for building a dynamic, component-based UI.
React Router: Handles client-side routing for navigation between login, signup, and chat pages.
Tailwind CSS: Utility-first CSS framework for responsive, gradient-based styling (e.g., bg-gradient-to-r, font-['Dancing_Script']).
Vite: Fast build tool for development and production builds.
Axios: For making HTTP requests to the backend API.
Socket.IO-Client: Enables real-time communication with the backend for messaging.

Backend

Node.js: JavaScript runtime for the server-side application.
Express.js: Web framework for building RESTful APIs (e.g., /api/auth/register, /api/messages/:friend).
PostgreSQL (Neon): Serverless cloud database for storing user data, friend lists, and messages.
Socket.IO: Facilitates real-time, bidirectional communication for instant messaging.
JWT (JSON Web Tokens): Secures API endpoints with token-based authentication.
Bcryptjs: Hashes passwords for secure storage.

Database

Neon PostgreSQL: Cloud-based, serverless PostgreSQL database for scalable data storage. Configured with sslmode=require for secure connections.
Tables:
users: Stores id, username, password, friends, friend_requests, blocked (as arrays).
messages: Stores id, sender, receiver, content, timestamp.





Tools

Git: Version control for managing the codebase.
npm: Package manager for installing dependencies.
Vercel: Platform for deploying the frontend (https://chat-sphere-ecru.vercel.app).
Render: Platform for deploying the backend (https://chatsphere-4nyh.onrender.com).
Neon Dashboard: For managing and querying the PostgreSQL database.

Prerequisites

Node.js (>= 18.x): Required for running the frontend and backend.
Git: For cloning the repository.
Neon PostgreSQL Account: For database access (https://neon.tech).
Vercel Account: For frontend deployment (https://vercel.com).
Render Account: For backend deployment (https://render.com).

Installation
Follow these steps to set up and run ChatSphere locally.

Clone the Repository:
git clone https://github.com/AyushVishu15/ChatSphere.git


Set Up Backend:

Navigate to the backend directory:cd backend


Install dependencies:npm install


Create a .env file in backend/ with the following:DATABASE_URL=postgresql://neondb_owner:npg_IUs7Ty8mFXaD@ep-jolly-voice-a10qlrqi-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173


Replace npg_IUs7Ty8mFXaD with your Neon PostgreSQL password.
Generate JWT_SECRET:node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"




Start the backend:npm start

The backend runs on http://localhost:3000.


Set Up Frontend:

Navigate to the frontend directory:cd ../frontend-modern


Install dependencies:npm install


Create a .env file in frontend-modern/:REACT_APP_API_URL=http://localhost:3000


Start the frontend:npm run dev

The frontend runs on http://localhost:5173.


Access the Application:

Open http://localhost:5173 in your browser.
Sign up at /signup or log in at /login (e.g., username: ayush1, password: test1234).



Deployment
Frontend (Vercel)

Push the repository to GitHub:git push origin main


Log in to https://vercel.com with GitHub (AyushVishu15).
Create a new project:
Import AyushVishu15/ChatSphere.
Set Root Directory: frontend-modern.
Set Framework Preset: Vite.
Set Build Command: npm run build.
Set Output Directory: dist.
Add environment variable: REACT_APP_API_URL=https://chatsphere-4nyh.onrender.com.


Deploy and access at https://chat-sphere-ecru.vercel.app.

Backend (Render)

Log in to https://render.com with GitHub.
Create a new web service:
Connect AyushVishu15/ChatSphere.
Set Root Directory: backend.
Set Runtime: Node.
Set Start Command: npm start.
Add environment variables:DATABASE_URL=postgresql://neondb_owner:npg_IUs7Ty8mFXaD@ep-jolly-voice-a10qlrqi-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
FRONTEND_URL=https://chat-sphere-ecru.vercel.app




Deploy and access at https://chatsphere-4nyh.onrender.com.

Testing

Backend API:curl -X POST https://chatsphere-4nyh.onrender.com/api/auth/register -H "Content-Type: application/json" -d '{"username":"ayush1","password":"test1234"}'
curl -X POST https://chatsphere-4nyh.onrender.com/api/auth/login -H "Content-Type: application/json" -d '{"username":"ayush1","password":"test1234"}'


Frontend:
Open https://chat-sphere-ecru.vercel.app.
Verify:
Landing Page: “Connect, Chat, Collaborate” with gradient styling, A.jpeg preview, “Chat, Vibe, Unite” in cursive font.
Favicon: PP (2).jpeg.
Signup/Login: Use ayush1/test1234.
Chat Page: Check banner, sidebar, search (ayu), friend requests, real-time messaging via Socket.IO.


Check browser console (F12 > Console) for errors.



Screenshots
Below are placeholders for screenshots of the ChatSphere application (replace with actual images):

Landing PageDisplays the hero section with “Connect, Chat, Collaborate” and a preview image.

Login PageAllows users to log in securely with username and password.

Chat PageShows the chat interface with real-time messaging, friend list, and search functionality.


Troubleshooting

Network Error on Signup:
Check browser console (F12 > Console) for CORS or “Failed to fetch” errors.
Ensure backend/server.js has CORS set to https://chat-sphere-ecru.vercel.app.
Test backend API with curl (see Testing).


Database Connection:
Run SELECT NOW(); in Neon’s SQL Editor (https://neon.tech) to wake the database.
Verify DATABASE_URL in Render environment variables.


Real-Time Messaging:
Ensure Socket.IO CORS allows https://chat-sphere-ecru.vercel.app.
Test messaging in /chat page.



Neon Usage Metrics
To check usage since August 5, 2025:

Log in to https://neon.tech with GitHub (AyushVishu15).
Navigate to neondb > “Billing” or “Usage”.
Check:
Storage: Free Plan limit: 0.5 GB-month.
Compute: Free Plan limit: 191.9 hours/month.
Data Transfer: Free Plan limit: 5 GB/month.


Run a test query in Neon’s SQL Editor:SELECT * FROM users;



Built By
Ayush Vishwakarma (AyushVishu15)
