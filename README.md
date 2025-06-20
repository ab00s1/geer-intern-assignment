# Geer Intern Assignment

A full-stack web application with a Next.js frontend and a Node.js/Express backend for product management and user authentication.

## Table of Contents
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [Tech Stack](#tech-stack)
- [License](#license)

---

## Features
- User registration and authentication
- Product creation, listing, and details
- Image and video upload support
- Responsive UI with reusable components

## Project Structure
```
backend/           # Express backend (API, models, routes, middleware)
frontend/          # Next.js frontend (UI, pages, components, context)
```

### Backend
- `index.js`: Entry point for Express server
- `models/`: Mongoose models for User and Product
- `routes/`: API endpoints for authentication and products
- `middleware/`: Authentication, file upload, and utilities

### Frontend
- `src/app/`: Next.js App Router pages (register, signin, product, etc.)
- `src/components/`: UI and shared components
- `context/`: React context for authentication
- `public/`: Static assets (images, videos, SVGs)

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or cloud)
- Cloudinary account (for media uploads)

---

## Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file for environment variables (e.g., MongoDB URI, JWT secret, Cloudinary secret).
4. Start the backend server:
   ```bash
   npm start
   ```

## Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```

---

## Usage
- Visit `http://localhost:3000` to access the frontend.
- API runs on `http://localhost:5000` (or as configured).
- Register, sign in, create products, and view product details.

## Tech Stack
- **Frontend:** Next.js, React, CSS Modules
- **Backend:** Node.js, Express, MongoDB, Mongoose, Multer

---

## Screenshots

Below are some screenshots of the application:

| Register Page | Product List | Product Details |
|:-------------:|:------------:|:---------------:|
| ![Register](frontend/public/Screenshot%20(790).png) | ![Product List](frontend/public/Screenshot%20(783).png) | ![Product Details](frontend/public/Screenshot%20(788).png) |

Additional screenshots:

![Screenshot 785](frontend/public/Screenshot%20(785).png)
![Screenshot 786](frontend/public/Screenshot%20(786).png)
![Screenshot 787](frontend/public/Screenshot%20(787).png)
![Screenshot 788](frontend/public/Screenshot%20(784).png)
![Screenshot 789](frontend/public/Screenshot%20(789).png)
![Screenshot 791](frontend/public/Screenshot%20(791).png)
![Screenshot 792](frontend/public/Screenshot%20(792).png)