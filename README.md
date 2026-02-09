# 💰 Expense Tracker

A beautiful, modern expense management application built with Next.js, featuring cloud storage with Supabase and local storage fallback.

## ✨ Features

- 💵 **Indian Rupee (₹) Currency** - All amounts in INR
- 🏷️ **Custom Categories** - Create your own expense categories with icons and colors
- 📊 **Dashboard Analytics** - View spending statistics and category breakdowns
- 🔍 **Advanced Filtering** - Search and filter by category, date, and more
- 📈 **Sorting** - Sort expenses by date, amount, or category
- 💾 **Cloud Storage** - Sync your data across devices with Supabase
- 🔐 **Authentication** - Secure user accounts with email/password
- 📱 **Mobile Friendly** - Fully responsive design for all devices
- 💫 **Offline Support** - Works with localStorage when offline
- 📥 **Import/Export** - Backup and restore your data as JSON

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone or download this project**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)

### Using Without Database (LocalStorage Mode)

The app works immediately with localStorage! Just start adding expenses and they'll be saved in your browser.

### Using With Database (Cloud Sync)

For cloud storage and cross-device sync, follow the **[Supabase Setup Guide](./SUPABASE_SETUP.md)**.

Quick steps:
1. Create a free Supabase account
2. Create a new project
3. Run the SQL scripts to create tables
4. Add your credentials to `.env.local`
5. Restart the app

## 📖 Usage

### Adding Expenses
1. Fill in the amount (in ₹)
2. Select a category
3. Choose the date
4. Enter a description
5. Click "Add Expense"

### Managing Categories
1. Click "Show" on the Category Manager
2. Enter category name, select icon and color
3. Click "Add Category"
4. Delete custom categories anytime

### Filtering & Searching
- Use the search box to find specific expenses
- Filter by category using the dropdown
- Click column headers to sort

### Data Management
- **Export**: Download your data as JSON backup
- **Import**: Restore from a previous backup
- **Clear All**: Delete all expenses (with confirmation)

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Vanilla CSS with custom design system
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: React Hooks
- **Storage**: Supabase + localStorage fallback

## 📁 Project Structure

```
expense-tracker/
├── app/
│   ├── globals.css          # Design system & styles
│   ├── layout.tsx            # Root layout with auth
│   └── page.tsx              # Main application
├── components/
│   ├── AuthProvider.tsx      # Authentication context
│   ├── CategoryManager.tsx   # Category CRUD
│   ├── Dashboard.tsx         # Statistics display
│   ├── ExpenseForm.tsx       # Add/edit expenses
│   ├── ExpenseList.tsx       # Expense table
│   └── LoginForm.tsx         # Login/signup UI
├── hooks/
│   ├── useCategories.ts      # Category state
│   └── useExpenses.ts        # Expense state
├── lib/
│   └── supabase/
│       ├── client.ts         # Supabase client
│       └── supabaseStorage.ts # Database operations
├── types/
│   └── types.ts              # TypeScript interfaces
├── utils/
│   ├── calculations.ts       # Statistics & formatting
│   ├── categoryStorage.ts    # Category localStorage
│   └── storage.ts            # Expense localStorage
└── SUPABASE_SETUP.md         # Database setup guide
```

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Secure authentication with Supabase Auth
- Environment variables for API keys

## 📱 Mobile Usage

### On Android/iOS:
1. Deploy the app (see Deployment section)
2. Open in mobile browser
3. Add to home screen for app-like experience
4. Data syncs across all devices when logged in

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

### Other Platforms

- **Netlify**: Similar process to Vercel
- **Railway**: Supports Next.js deployments
- **Self-hosted**: Build with `npm run build` and serve

## 🐛 Troubleshooting

**App shows "Supabase not configured"**
- Create `.env.local` file with your Supabase credentials
- Restart the development server

**Can't sign up/login**
- Check Supabase dashboard for auth errors
- Verify email confirmation settings
- Check browser console for errors

**Data not syncing**
- Verify you're logged in
- Check internet connection
- Verify database tables exist in Supabase

**Browser data cleared and lost expenses**
- This is why cloud storage is recommended!
- Use Export feature regularly for backups
- Set up Supabase for automatic cloud backup

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📞 Support

For issues or questions:
1. Check the [Supabase Setup Guide](./SUPABASE_SETUP.md)
2. Review the troubleshooting section
3. Check browser console for errors

---

Built with ❤️ using Next.js and Supabase
