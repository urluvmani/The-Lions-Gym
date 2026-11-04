# The Lions Gym - Gym Management System

A production-ready gym management web application built with Next.js 14, MongoDB Atlas, and NextAuth.js.

## Features

### Public Website
- **Hero Section**: High-impact landing with "Unleash Your Inner Beast" tagline
- **About Section**: Gym story, mission, and key statistics
- **Membership Plans**: Clean pricing cards (Monthly, Quarterly, Yearly)
- **Trainers Section**: Showcase certified trainers
- **Contact & Location**: Interactive map, working hours, and contact info

### Admin Dashboard
- **Overview Dashboard**: Real-time stats (members, attendance, revenue)
- **Attendance Management**: Quick-scan/check-in system with member codes
- **Member Management**: Full CRUD operations for members
- **Membership Tracking**: Auto-calculated expiry dates and status badges
- **Secure Authentication**: Admin-only access with credentials

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Database**: MongoDB Atlas
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier)
- Git

### Installation

1. Navigate to the project directory:
```bash
cd gym-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `env.example` to `.env`
   - Fill in your MongoDB Atlas connection string
   - Generate a NextAuth secret: `openssl rand -base64 32`

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/Gym?retryWrites=true&w=majority&appName=Cluster0
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

4. Generate Prisma client:
```bash
npx prisma generate
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## MongoDB Atlas Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 cluster
3. Create a database user with username and password
4. Whitelist your IP address (0.0.0.0/0 for development)
5. Get your connection string and add it to `.env`

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup instructions.

## Default Admin Credentials

- Username: `admin`
- Password: `admin123`

**Important**: Change these in production by updating environment variables.

## Project Structure

```
gym-app/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── admin/            # Admin pages (dashboard, attendance, members)
│   │   ├── api/              # API routes
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   └── lib/
│       ├── mongodb.ts        # MongoDB connection
│       └── prisma.ts         # Prisma client
├── DEPLOYMENT.md             # Deployment guide
└── env.example               # Environment variables template
```

## Deployment

For detailed deployment instructions to Vercel, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Quick Deploy to Vercel

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Features Overview

### Public Pages
- Responsive design with dark theme
- Smooth animations and hover effects
- Membership pricing cards
- Trainer profiles
- Contact information with map placeholder

### Admin Features
- **Dashboard**: Quick stats overview
- **Attendance**: Mark attendance by member code
- **Members**: Add, edit, delete members
- **Membership Status**: Visual badges (Active, Expiring Soon, Expired)
- **Search**: Filter members by name or code

## Design System

- **Primary Color**: Gold/Amber (#f59e0b)
- **Background**: Dark Charcoal (#0f0f0f)
- **Card Background**: Matte Black (#171717)
- **Accent**: Electric Crimson (#dc2626)
- **Typography**: Clean, modern sans-serif

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js](https://next-auth.js.org)

## License

This project is private and proprietary.
