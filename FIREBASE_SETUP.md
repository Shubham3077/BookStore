# Firebase Setup Guide

Step-by-step instructions to integrate Firebase with the Mudita Book Store app.

---

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project** (or **Create a project**)
3. Enter a project name (e.g. `mudita-bookstore`) → **Continue**
4. Disable Google Analytics if not needed → **Create project**
5. Click **Continue** when the project is ready

---

## Step 2: Register Your App

1. On the project overview, click the **Web** icon (`</>`)
2. Enter an app nickname (e.g. `Mudita Book Store`)
3. **Optional**: Check "Firebase Hosting" if you plan to deploy there
4. Click **Register app**
5. Copy the `firebaseConfig` object shown (you’ll use this in the next step)
6. Click **Continue to console**

---

## Step 3: Enable Authentication

1. In the left sidebar, go to **Build** → **Authentication**
2. Click **Get started**
3. Go to the **Sign-in method** tab
4. Enable these providers:
   - **Email/Password** → Enable → Save
   - **Google** → Enable → Add support email → Save
   - **Facebook** → Enable → Add App ID & Secret (from [Facebook Developers](https://developers.facebook.com/)) → Save
   - **Phone** → Enable → Save (uses reCAPTCHA by default)

---

## Step 4: Enable Firestore Database

1. In the left sidebar, go to **Build** → **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** for development (or production rules for production)
4. Select a Firestore location (e.g. `us-central1`) → **Enable**

---

## Step 5: Add Environment Variables

1. In your project root, copy the example env file:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and add your Firebase config:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

3. You can copy these from:
   - Firebase Console → Project settings (gear icon) → Your apps → SDK setup and configuration

---

## Step 6: Prepare Images & Seed Firestore

1. Images are already copied to `public/images/`. If not:
   ```bash
   mkdir -p public/images
   cp assets/book-cover-*.jpg assets/blog-*.jpg assets/hero-bookstore.jpg public/images/
   ```

2. Seed Firestore with initial data:
   ```bash
   npm run db:seed
   ```

---

## Step 7: (Optional) Configure OAuth Providers

### Google

- Firebase automatically configures Google Sign-In
- In Firebase Console → Authentication → Sign-in method → Google: add a support email

### Facebook

1. Go to [Facebook Developers](https://developers.facebook.com/apps/)
2. Create an app → **Consumer** type
3. Add **Facebook Login** → **Web**
4. Add site URL (e.g. `http://localhost:3000`)
5. Copy **App ID** and **App Secret**
6. In Firebase Console → Authentication → Sign-in method → Facebook → paste App ID & Secret
7. Add `https://your_project.firebaseapp.com/__/auth/handler` to Valid OAuth Redirect URIs in Facebook

---

## Step 8: Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You should see:

- Hero, New Collection, Discount, Recommended, Blog sections loaded from Firestore
- Login page with Google, Facebook, Email, and Phone auth

---

## Firestore Collections

| Collection  | Purpose                          |
|------------|-----------------------------------|
| `config/hero`     | Hero section content              |
| `config/discount` | Discount banner content           |
| `books`           | New Collection books              |
| `recommended`     | Recommended books with reviews    |
| `blogs`           | Blog posts                        |
| `users`           | Auth users (uid, email, displayName, photoURL) |

## User Persistence (POST /api/users)

After login/signup, user data is stored in Firestore `users` collection (create only, no updates).

**Option A – API route (recommended for production):**
1. Firebase Console → Project Settings → Service Accounts → Generate new private key
2. Add to `.env.local`: `FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'` (full JSON as string)

**Option B – Client fallback:** If the API is not configured (503), the app writes directly to Firestore. Add this rule:

```javascript
match /users/{userId} {
  allow create: if request.auth != null && request.auth.uid == userId;
  allow read: if request.auth != null && request.auth.uid == userId;
  allow update, delete: if false;
}
```

---

## Troubleshooting

- **"Firebase: Error (auth/configuration-not-found)"**  
  Check that all `NEXT_PUBLIC_FIREBASE_*` env vars are set in `.env.local`.

- **"Missing or insufficient permissions"**  
  For development, Firestore rules can be:
  ```javascript
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /{document=**} {
        allow read: if true;
        allow write: if request.auth != null;
      }
    }
  }
  ```

- **Phone auth fails**  
  Ensure reCAPTCHA can load (no ad blockers on localhost).
