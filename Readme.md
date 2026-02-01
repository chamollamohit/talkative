# Talkative

Talkative is a full-stack, real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js). It features secure user authentication, real-time messaging using Socket.io, and profile customization with Cloudinary.

## 🚀 Features

- **Real-time Messaging**: Instant communication powered by Socket.io, including message delivery and typing indicators.
- **Secure Authentication**: User signup, login, and logout functionality using JWT (JSON Web Tokens) stored in cookies and bcrypt for password hashing.
- **Profile Management**: Users can upload and update their profile pictures, which are hosted on Cloudinary.
- **User Discovery**: A sidebar that lists all registered users for starting conversations.
- **Responsive UI**: A modern interface built with React, Tailwind CSS, and Daisy UI, featuring customizable themes.
- **State Management**: Efficient client-side state handling using Zustand.

## 🛠️ Tech Stack

### Backend

- **Node.js & Express**: Server framework.
- **MongoDB & Mongoose**: Database and object modeling.
- **Socket.io**: Real-time bidirectional event-based communication.
- **JWT & bcryptjs**: Security and authentication.
- **Cloudinary**: Image hosting and management.

### Frontend

- **React**: UI Library.
- **Zustand**: State management (Auth, Chat, and Theme stores).
- **Tailwind CSS & Daisy UI**: Styling and UI components.
- **Axios**: API requests.
- **Lucide React**: Icon library.

## 📂 Project Structure

```text
├── backend/
│   ├── src/
│   │   ├── controller/   # API logic (auth, messages)
│   │   ├── lib/          # Database, Socket, and Cloudinary configs
│   │   ├── middleware/   # Auth protection middleware
│   │   ├── models/       # MongoDB schemas
│   │   ├── routes/       # API endpoints
│   │   └── index.js      # Main entry point
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Application views (Home, Login, Profile, etc.)
│   │   ├── store/        # Zustand state stores
│   │   └── App.tsx       # Main app component
```

## 🔧 Installation & Setup

### 1. Prerequisites

- Node.js installed
- MongoDB account/instance
- Cloudinary account

### 2. Backend Setup

1.  Navigate to the backend directory: `cd backend`.
2.  Install dependencies: `npm install`.
3.  Create a `.env` file in the `backend/` root and add:
    ```env
    MONGODB_URI=your_mongodb_uri
    PORT=5001
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    NODE_ENV=development
    ```
4.  Start the server: `npm run dev`.

### 3. Frontend Setup

1.  Navigate to the frontend directory: `cd frontend`.
2.  Install dependencies: `npm install`.
3.  Start the development server: `npm run dev`.

## 📜 API Endpoints

### Auth

- `POST /api/auth/signup`: Register a new user.
- `POST /api/auth/login`: Login to an existing account.
- `POST /api/auth/logout`: Log out the current user.
- `PUT /api/auth/update-profile`: Update the user's avatar.

### Messages

- `GET /api/messages/users`: Fetch all users for the sidebar.
- `GET /api/messages/:id`: Fetch message history with a specific user.
- `POST /api/messages/send/:id`: Send a text or image message.
