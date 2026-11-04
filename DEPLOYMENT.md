# The Lions Gym - Deployment Guide

## Project Overview
A production-ready gym management web application built with Next.js 14, MongoDB Atlas, and NextAuth.js for authentication.

## Tech Stack
- **Framework**: Next.js 14 (App Router, TypeScript)
- **Database**: MongoDB Atlas
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier works)
- Vercel account
- Git

## Local Setup

### 1. Clone and Navigate
```bash
cd gym-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/Gym?retryWrites=true&w=majority&appName=Cluster0

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

**Important**: The `.env` file is in `.gitignore` for security. Use the provided `env.example` as a template.

### 4. Generate NextAuth Secret
Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

### 5. Set Up MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Create a database user with username and password
5. Whitelist your IP address (use 0.0.0.0/0 for development)
6. Get your connection string
7. Replace the placeholder in your `.env` file

### 6. Initialize Prisma
```bash
npx prisma generate
```

### 7. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## MongoDB Atlas Setup Instructions

### Step 1: Create Atlas Account
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free"
3. Sign up with Google, GitHub, or email

### Step 2: Create a Cluster
1. After login, click "Build a Database"
2. Select "M0" (Free) shared cluster
3. Choose a region closest to you
4. Name your cluster (e.g., "GymCluster")
5. Click "Create"

### Step 3: Create Database User
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password Authentication"
4. Enter username and password (save these!)
5. Select "Read and write to any database"
6. Click "Add User"

### Step 4: Whitelist IP Address
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development: Select "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add your Vercel deployment IP ranges
5. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select Node.js version
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Add the database name: `/Gym` at the end

Your connection string should look like:
```
mongodb+srv://username:password@cluster0.3dbpyxw.mongodb.net/Gym?retryWrites=true&w=majority&appName=Cluster0
```

## Vercel Deployment

### Step 1: Prepare for Deployment
1. Push your code to GitHub (excluding `.env`)
2. Make sure your `.env.example` is committed

### Step 2: Deploy to Vercel
1. Go to [Vercel](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will automatically detect Next.js

### Step 3: Configure Environment Variables
In Vercel dashboard, add these environment variables:

1. Click "Settings" → "Environment Variables"
2. Add each variable:

```
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/Gym?retryWrites=true&w=majority&appName=Cluster0
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secret-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

**Important**: For `NEXTAUTH_URL`, use your actual Vercel domain after first deployment.

### Step 4: Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Your app will be live at `https://your-app.vercel.app`

### Step 5: Update NEXTAUTH_URL
After first deployment:
1. Copy your Vercel domain
2. Update `NEXTAUTH_URL` in Vercel environment variables
3. Redeploy

## Testing the Application

### Public Pages
- Home page: `/`
- About section: Scroll to "About"
- Membership plans: Scroll to "Membership"
- Trainers: Scroll to "Trainers"
- Contact: Scroll to "Contact"

### Admin Portal
1. Click "Admin Portal" button on home page
2. Login with credentials from `.env` (default: admin/admin123)
3. Dashboard: `/admin/dashboard`
4. Attendance: `/admin/attendance`
5. Members: `/admin/members`

### Features to Test
1. **Dashboard**: View stats (members, attendance, revenue)
2. **Attendance**: Mark attendance by entering member code
3. **Members**: Add, edit, delete members
4. **Membership Status**: Check expiry dates and status badges

## Default Admin Credentials
- Username: `admin`
- Password: `admin123`

**Security Note**: Change these in production by updating environment variables.

## Troubleshooting

### NextAuth Configuration Error
If you see "NO_SECRET" error:
- Ensure `NEXTAUTH_SECRET` is set in `.env`
- Generate a new secret with `openssl rand -base64 32`

### MongoDB Connection Error
If you see connection errors:
- Verify `MONGODB_URI` is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions
- Check if username/password are correct

### Prisma Client Error
If you see Prisma errors:
- Run `npx prisma generate`
- Run `npx prisma db push` (for MongoDB)

### Build Errors
If build fails:
- Ensure all dependencies are installed: `npm install`
- Check TypeScript errors: `npm run build`
- Review error logs in Vercel dashboard

## Project Structure

```
gym-app/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── attendance/    # Attendance management page
│   │   │   ├── dashboard/     # Admin dashboard
│   │   │   ├── login/         # Admin login page
│   │   │   └── members/       # Member management page
│   │   ├── api/
│   │   │   ├── admin/         # API routes for admin operations
│   │   │   └── auth/          # NextAuth configuration
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── providers.tsx      # Session provider
│   └── lib/
│       ├── mongodb.ts         # MongoDB connection
│       └── prisma.ts          # Prisma client
├── .env.example               # Environment variables template
├── package.json
└── next.config.ts
```

## Database Schema

### Member Model
- `id`: Unique identifier
- `name`: Member's full name
- `code`: Unique member code (e.g., TL-101)
- `phone`: Phone number
- `address`: Address
- `dateJoined`: Joining date
- `planType`: Membership plan (1 Month, 3 Months, etc.)
- `feePaid`: Fee amount paid
- `expiryDate`: Membership expiry date
- `isActive`: Active status

### Attendance Model
- `id`: Unique identifier
- `memberId`: Reference to member
- `date`: Attendance date
- `checkIn`: Check-in timestamp

### MembershipPlan Model
- `id`: Unique identifier
- `name`: Plan name
- `duration`: Duration in months
- `price`: Plan price
- `features`: List of features

## Security Best Practices

1. **Environment Variables**: Never commit `.env` file
2. **Strong Passwords**: Use strong admin passwords in production
3. **MongoDB Whitelist**: Use specific IP addresses in production
4. **HTTPS**: Vercel provides HTTPS automatically
5. **Secret Keys**: Generate unique secrets for each environment

## Performance Optimization

- Next.js App Router for optimal performance
- Tailwind CSS for minimal CSS bundle
- Prisma for efficient database queries
- MongoDB Atlas for scalable database

## Support

For issues or questions:
- Check MongoDB Atlas status
- Review Vercel deployment logs
- Check NextAuth.js documentation
- Review Prisma documentation

## License

This project is private and proprietary.
  