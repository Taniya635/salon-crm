# Luxe Salon CRM

Luxe Salon CRM is a full-stack, elegant, and fully animated Customer Relationship Management application designed for modern beauty professionals. It features an intuitive Admin Dashboard to manage staff, services, appointments, and billing smoothly.

The project is structured as a monorepo containing:
- **`frontend/`**: An Angular 17+ single-page application utilizing reactive state management and a beautiful glassmorphism design system.
- **`backend/`**: A Node.js & Express REST API using MongoDB to store all system records.

---

## Prerequisites
Before running the project locally, ensure you have the following installed on your machine:
- **Node.js** (v18 or higher)
- **MongoDB** (Running locally on `mongodb://127.0.0.1:27017` or configured via a `.env` file)

---

## Running the Application Locally

You will need to open **two separate terminal windows** to run the backend and the frontend simultaneously.

### 1. Start the Backend API
The backend must be running for the frontend to authenticate users and fetch data.

1. Open your first terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Copy the example environment variables file to create your own configuration:
   ```bash
   cp .env.example .env
   ```
4. Start the Node development server:
   ```bash
   npm run dev
   ```
   *The backend server will run on `http://localhost:5001`. It will automatically connect to MongoDB and seed the database with initial data (Admin user, Staff, and Services) if they do not exist.*

### 2. Start the Frontend Application

1. Open your second terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install the necessary Angular dependencies:
   ```bash
   npm install
   ```
3. Start the Angular development server:
   ```bash
   npm start
   ```
   *The frontend will run on `http://localhost:4200`.*

---

## Demo Access
Once both servers are running, open your browser and navigate to `http://localhost:4200`. You can access the Admin portal using the following default seeded credentials:

- **Email:** `admin`
- **Password:** `admin123`

---

## Deployment (Vercel)
This repository is configured to be seamlessly deployed to Vercel as a monorepo. 
- A `vercel.json` file is located at the root to handle API routing to the backend and SPA routing to the frontend.
- **Important:** When deploying to Vercel, ensure the **"Root Directory"** in your Vercel Project Settings is left blank (pointing to the root of the repo) so Vercel can build both the frontend and backend together.
