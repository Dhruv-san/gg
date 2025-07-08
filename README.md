# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Deploying to Firebase App Hosting

This application is ready to be deployed to Firebase App Hosting. Follow these steps:

### Prerequisites

1.  **Install the Firebase CLI:** If you haven't already, install the Firebase command-line tools.
    ```bash
    npm install -g firebase-tools
    ```

### Deployment Steps

1.  **Login to Firebase:**
    ```bash
    firebase login
    ```

2.  **Initialize App Hosting:** In your project's root directory, run the initialization command. This will connect your local code to a Firebase project.
    ```bash
    firebase init apphosting
    ```
    Follow the prompts to select your Firebase project and create a new App Hosting backend.

3.  **Deploy the application:**
    ```bash
    firebase deploy
    ```

### Post-Deployment Configuration

After your first deployment, you must configure your environment variables and Supabase settings for your live app.

1.  **Set Environment Variables:**
    *   Go to the [Firebase Console](https://console.firebase.google.com).
    *   Navigate to your project's **App Hosting** page.
    *   Select your backend and go to the **Settings** tab.
    *   In the **Environment variables** section, you will be prompted to create and set the values for the secrets `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Use the same values from your `.env` file.

2.  **Update Supabase URL Configuration:**
    *   Go to your **Supabase Dashboard**.
    *   Navigate to **Authentication** > **URL Configuration**.
    *   Update the **Site URL** from `http://localhost:9002` to your new production URL provided by Firebase App Hosting (e.g., `https://your-app-name--backend.web.app`).

Your application is now live!
