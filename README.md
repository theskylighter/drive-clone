# DRIVE_clone Project Guide

Welcome to the DRIVE_clone project! This guide will walk you through the project in simple terms, making it easy for beginners to set up, understand, and contribute.

## 1. Overview
DRIVE_clone (Cloud9) is a web application built using Node.js, Express, and MongoDB. It uses EJS for server-side rendering along with Tailwind CSS and Flowbite for styling. Key features include:
- User registration and login with secure authentication
- Modern, responsive UI with dark mode support
- File uploads with Firebase cloud storage integration
- File download functionality with signed URLs
- Branded as "Cloud9" with custom logo and styling

## 2. Technologies Used

### Backend
- **Node.js & Express:** Server and API development.
- **JWT & bcrypt:** Secure authentication and password encryption.

### Frontend
- **EJS:** Templating engine for rendering HTML pages.
- **Tailwind CSS & Flowbite:** Tools for designing and styling the user interface.

### Database
- **MongoDB & Mongoose:** Managing the database and interacting with data.

### File Handling & Cloud Storage
- **Multer:** Handling file uploads.
- **Firebase:** Cloud storage solution for uploaded files.


## 3. Project Structure
```
/DRIVE_clone
│
├── app.js                # Main entry point of the application.
├── package.json          # Project dependencies and scripts.
├── .env                  # Environment variables (MongoDB URI, JWT secret).
├── .gitignore            # Files and folders to ignore in version control.
│
├── config/               # Configuration files
│   ├── db.js           # Database connection setup.
│   ├── firebase.config.js  # Firebase configuration details.
│   └── multer.config.js    # File upload configurations.
│
├── models/               # Mongoose schemas for MongoDB.
│   ├── user.model.js   # Schema for users.
│   └── files.model.js  # Schema for uploaded files.
│
├── middlewares/          # Express middlewares.
│   └── auth.js         # JWT authentication middleware.
│
├── routes/               # Express route definitions.
│   ├── index.routes.js # Routes for home, file uploads, etc.
│   └── user.routes.js  # Routes for user registration and login.
│
└── views/                # EJS templates.
    ├── index.ejs       # Homepage template.
    ├── home.ejs        # Home view after logging in.
    ├── login.ejs       # Login page template.
    └── register.ejs    # Registration page template.
└── public/               # Static assets
    └── logo.svg         # Application logo
```

## 4. UI Features
- **Branding:** Consistent "Cloud9" branding across all pages with custom cloud logo
- **Dark Mode:** Full dark mode support across all pages
- **Responsive Design:** Works on mobile and desktop devices
- **Modern Interface:** 
  - Clean card-based file layout
  - Drag-and-drop file upload support
  - Modal-based upload interface
  - Intuitive navigation

## 5. Authentication Flow
1. **Registration:**
   - User fills out registration form
   - Data is validated
   - Password is hashed
   - User is redirected to login page
   
2. **Login:**
   - User enters credentials
   - JWT token is generated
   - Token is stored in cookies
   - User is redirected to home page

## 6. File Management
- **Upload:**
  - Modal interface for file selection
  - Progress indication
  - Direct upload to Firebase storage
  
- **Download:**
  - Secure download links using Firebase signed URLs
  - 15-minute expiration on download links
  - Original filename preserved

## 7. Setup Instructions

### Prerequisites
- Make sure you have Node.js and npm installed.
- MongoDB should be installed and running on your local machine (or update MONGO_URI in `.env` accordingly).
- A Firebase project configured with Cloud Storage if you plan to use file uploads.

### Installation
1. **Clone the Repository**
   - If not already cloned, download the project files to your computer.

2. **Install Dependencies**
   - Open your terminal in the project directory and run:
     ```
     yarn install
     ```

3. **Environment Variables**
   - Copy `.env.example` to create your own `.env` file:
     ```bash
     cp .env.example .env
     ```
   - Update the values in `.env` with your actual credentials:
     ```
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_secure_random_string
     ```

4. **Set Up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Generate a new private key from Project Settings > Service Accounts
   - Save the downloaded JSON as `firebase-credentials.json` in project root
   - Update `config/firebase.config.js` with your Firebase bucket name

## Security Notes
- Never commit `.env` or Firebase credential files to version control
- Keep your JWT secret secure and randomly generated
- Regularly rotate Firebase credentials in production
- Use environment-specific configuration files

## 8. Running the Project

### Start the Server
- Use the following command to start the server:
  ```
  yarn start
  ```
- The server will run on `http://localhost:3000`.

### Accessing the Application
- **Registration:** Visit `http://localhost:3000/user/register` to create a new account.
- **Login:** Visit `http://localhost:3000/user/login` to log in.
- **Home & File Uploads:** After login, navigate to `http://localhost:3000/home` for the homepage and file upload functionality.

## 9. Development Tips
- **Error Handling:** Ensure environment variables are set correctly, especially `MONGO_URI` and `JWT_SECRET`.
- **File Uploads:** The Firebase bucket is set in `config/multer.config.js`. Verify your Firebase credentials if you encounter issues.
- **Code Editing:** Follow the naming conventions in the project (e.g., use lower case for usernames) to avoid common errors.

## 10. Further Reading
- Learn more about [Express.js](https://expressjs.com/).
- Explore [Mongoose documentation](https://mongoosejs.com/).
- Access [Tailwind CSS docs](https://tailwindcss.com/docs) for styling tips.
- Visit [Firebase documentation](https://firebase.google.com/docs) for cloud storage and authentication details.

Enjoy exploring and developing your project!
