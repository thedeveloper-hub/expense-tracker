# Supabase Setup Guide

Follow these steps to set up Supabase for your expense tracker app:

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub, Google, or email

## Step 2: Create a New Project

1. Click "New Project"
2. Choose an organization (or create one)
3. Enter project details:
   - **Name**: expense-tracker (or any name you like)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to you (e.g., Mumbai for India)
4. Click "Create new project"
5. Wait 2-3 minutes for setup to complete

## Step 3: Get Your API Keys

1. In your project dashboard, click the **Settings** icon (⚙️) in the sidebar
2. Click **API** under Project Settings
3. You'll see two important values:
   - **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

## Step 4: Create Database Tables

1. Click **SQL Editor** in the sidebar
2. Click **New query**
3. Copy and paste this SQL code:

```sql
-- Create expenses table
CREATE TABLE expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policies for expenses
CREATE POLICY "Users can view their own expenses"
  ON expenses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own expenses"
  ON expenses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses"
  ON expenses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expenses"
  ON expenses FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for categories
CREATE POLICY "Users can view their own categories"
  ON categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories"
  ON categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories"
  ON categories FOR DELETE
  USING (auth.uid() = user_id);
```

4. Click **Run** (or press Ctrl+Enter)
5. You should see "Success. No rows returned"

## Step 5: Configure Your App

1. In your project folder, create a file named `.env.local`
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Replace `your-project-url-here` with your Project URL from Step 3
4. Replace `your-anon-key-here` with your anon public key from Step 3

**Example:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjE2MTYxNiwiZXhwIjoxOTMxNzM3NjE2fQ.example
```

## Step 6: Restart Your App

1. Stop the development server (Ctrl+C in terminal)
2. Run `npm run dev` again
3. Open http://localhost:3000

## Step 7: Test It Out!

1. You should now see a Sign Up / Sign In form
2. Create an account with your email and password
3. Check your email for confirmation (if required)
4. Log in and start adding expenses!

## ✅ You're Done!

Your expenses are now saved to the cloud and will sync across all your devices!

## Troubleshooting

**Problem: "Supabase not configured" message**
- Make sure `.env.local` file exists in the project root
- Check that the environment variables are correct
- Restart the dev server after creating `.env.local`

**Problem: Can't sign up**
- Check if email confirmation is required in Supabase dashboard
- Go to Authentication > Settings > Email Auth
- You can disable "Confirm email" for testing

**Problem: Can't see expenses after login**
- Make sure you ran the SQL queries to create tables
- Check the browser console for errors

## Step 8: Enable Google Login (Optional)

1.  Go to **Supabase Dashboard** -> **Authentication** -> **Providers**.
2.  Click on **Google** and toggle it **Enable**.
3.  You need a **Client ID** and **Client Secret** from Google Cloud Console.
    *   Go to [Google Cloud Console](https://console.cloud.google.com/).
    *   Create a project -> APIs & Services -> Credentials -> Create Credentials -> OAuth Client ID.
    *   **Application Type**: Web application.
    *   **Authorized JavaScript Origins**: `http://localhost:3000` (and your production URL).
    *   **Authorized Redirect URIs**: Copy the "Callback URL (for OAuth)" from your Supabase Google Provider page (starts with `https://.../auth/v1/callback`).
4.  Copy Client ID and Secret back to Supabase and click **Save**.

**Problem: "Unable to exchange external code" error with Google Login**
- This usually means your **Google Cloud Console** configuration is incorrect.
- Go to [Google Cloud Console](https://console.cloud.google.com/) -> Credentials.
- Check that **Authorized Redirect URIs** EXACTLY matches the URL from Supabase (including `https` and `/auth/v1/callback`).
- Ensure you clicked **SAVE** in the Supabase Dashboard after pasting the Client ID and Secret.
- Wait a few minutes; sometimes Google's changes take time to propagate.

## Need Help?

If you encounter any issues, check:
1. Supabase project dashboard for error logs
2. Browser console (F12) for JavaScript errors
3. Make sure all SQL queries ran successfully
