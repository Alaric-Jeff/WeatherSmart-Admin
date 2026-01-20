# Backend Website API

Express + TypeScript backend for the public website (react-frontend) with Firebase authentication.

## Endpoints
- `POST /api/auth/login`: Login with Firebase user credentials `{ email, password }`. Returns custom token and user data.
- `POST /api/contact`: Submit an inquiry `{ name, email, type, message }`. Stores to file.
- `GET /api/contact`: List all inquiries.
- `GET /api/health`: Health check.
- `GET /public/manuals/...`: Serves static manual PDFs placed in `public/manuals`.

## Firebase Setup

### 1. Get Firebase Credentials
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** (gear icon) > **Service Accounts**
4. Click **Generate new private key**
5. Save the JSON file

### 2. Configure Environment Variables
Create a `.env` file in `backend-website/` with these values from your service account JSON:

```env
PORT=4000
CORS_ORIGIN=http://localhost:5174
DB_PATH=website.db

# From your service account JSON file:
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour\nPrivate\nKey\nHere\n-----END PRIVATE KEY-----\n"
```

**Important:** Keep the quotes around `FIREBASE_PRIVATE_KEY` and preserve the `\n` characters.

## Dev
```bash
npm install
npm run dev
```

## Build & Run
```bash
npm run build
npm run start
```

## Login Flow
1. User enters email/password on login page
2. Backend queries Firestore `users` collection for matching email
3. If found, generates a Firebase custom token
4. Frontend stores token in localStorage
5. Token can be used for authenticated requests

**Note:** Current implementation accepts any password for demo purposes. In production, add password hashing with bcrypt.
