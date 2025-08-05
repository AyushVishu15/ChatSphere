# ChatSphere Application

ChatSphere is a full-stack web application designed for seamless real-time communication. It allows users to sign up, log in, manage friends, and chat instantly with a clean, modern, and responsive interface. Built with a **React** frontend and a **Node.js/Express** backend, it uses **Neon PostgreSQL** for cloud-based data storage and **Socket.IO** for real-time messaging. **JWT-based authentication** ensures secure user access, while **Tailwind CSS** provides a sleek, responsive design.

## Features
- **User Authentication**: Secure signup and login using JWT-based authentication.
- **Friend Management**: Search for users, send/accept friend requests, block users, and manage friend lists.
- **Real-Time Messaging**: Send and receive messages instantly with Socket.IO, with timestamps stored in the database.
- **Responsive Design**: Modern UI with Tailwind CSS, optimized for desktop and mobile devices.
- **Navigation**: Seamless routing with React Router, including login, signup, and chat pages.
- **Database Persistence**: Store users, friends, friend requests, blocked users, and messages in Neon PostgreSQL.

## Tech Stack
### Frontend
- **React**: JavaScript library for building a dynamic, component-based UI.
- **React Router**: Handles client-side routing for navigation between login, signup, and chat pages.
- **Tailwind CSS**: Utility-first CSS framework for responsive, gradient-based styling 
- **Vite**: Fast build tool for development and production builds.
- **Axios**: For making HTTP requests to the backend API.
- **Socket.IO-Client**: Enables real-time communication with the backend for messaging.

### Backend
- **Node.js**: JavaScript runtime for the server-side application.
- **Express.js**: Web framework for building RESTful APIs 
- **PostgreSQL (Neon)**: Serverless cloud database for storing user data, friend lists, and messages.
- **Socket.IO**: Facilitates real-time, bidirectional communication for instant messaging.
- **JWT (JSON Web Tokens)**: Secures API endpoints with token-based authentication.
- **Bcryptjs**: Hashes passwords for secure storage.

### Database
- **Neon PostgreSQL**: Cloud-based, serverless PostgreSQL database for scalable data storage. Configured with `sslmode=require` for secure connections.
  - Tables:
    - `users`: Stores `id`, `username`, `password`, `friends`, `friend_requests`, `blocked` (as arrays).
    - `messages`: Stores `id`, `sender`, `receiver`, `content`, `timestamp`.

### Tools
- **Git**: Version control for managing the codebase.
- **npm**: Package manager for installing dependencies.
- **Vercel**: Platform for deploying the frontend (`https://chat-sphere-ecru.vercel.app`).
- **Render**: Platform for deploying the backend (`https://chatsphere-4nyh.onrender.com`).
- **Neon Dashboard**: For managing and querying the PostgreSQL database.

## Prerequisites
- **Node.js** (>= 18.x): Required for running the frontend and backend.
- **Git**: For cloning the repository.
- **Neon PostgreSQL Account**: For database access (`https://neon.tech`).
- **Vercel Account**: For frontend deployment (`https://vercel.com`).
- **Render Account**: For backend deployment (`https://render.com`).

## Installation
Follow these steps to set up and run ChatSphere locally.

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/AyushVishu15/ChatSphere.git

Built By
(AyushVishu15)

