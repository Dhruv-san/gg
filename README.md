# CoFound Waitlist

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Deploying to Vercel

This application is ready to be deployed to Vercel. Follow these steps:

### Prerequisites

1.  **Create a Vercel Account:** If you don't have one, sign up at [vercel.com](https://vercel.com).
2.  **Push to GitHub:** Ensure your code has been pushed to a GitHub repository.

### Deployment Steps

1.  **Import Project on Vercel:**
    *   Go to your [Vercel Dashboard](https://vercel.com/dashboard).
    *   Click the **Add New...** button and select **Project**.
    *   Find your GitHub repository and click **Import**.

2.  **Configure Your Project:**
    *   Vercel will automatically detect that this is a Next.js project and configure the build settings. You don't need to change anything here.
    *   Expand the **Environment Variables** section.
    *   Add the following two variables, using the same values from your `.env` file:
        *   `NEXT_PUBLIC_SUPABASE_URL`
        *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3.  **Deploy:**
    *   Click the **Deploy** button. Vercel will now build and deploy your application.

### Post-Deployment Configuration

After your first deployment, you must update your Supabase settings for your live app.

1.  **Update Supabase URL Configuration:**
    *   Once the deployment is complete, Vercel will give you a production URL (e.g., `https-your-app.vercel.app`).
    *   Go to your **Supabase Dashboard**.
    *   Navigate to **Authentication** > **URL Configuration**.
    *   Update the **Site URL** from `http://localhost:9002` to your new production URL provided by Vercel.

Your application is now live!
