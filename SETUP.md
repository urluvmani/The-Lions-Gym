# Quick Setup Guide

## Step 1: Create .env File

Since `.env` is in `.gitignore` for security, you need to create it manually:

1. Copy the contents of `env.example`
2. Create a new file named `.env` in the root directory
3. Paste the contents and fill in your values

Your `.env` file should look like:

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://arweb:ahmad0704@cluster0.3dbpyxw.mongodb.net/Gym?retryWrites=true&w=majority&appName=Cluster0

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=the-lions-gym-secret-key-2024-very-secure-random-string

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

## Step 2: Generate Prisma Client

```bash
npx prisma generate
```

## Step 3: Run Development Server

```bash
npm run dev
```

## Step 4: Access the Application

- **Public Site**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
- **Admin Dashboard**: http://localhost:3000/admin/dashboard

## Default Admin Credentials

- Username: `admin`
- Password: `admin123`

## Troubleshooting

### NextAuth Error
If you see "NO_SECRET" error, ensure:
1. `.env` file exists in the root directory
2. `NEXTAUTH_SECRET` is set in `.env`
3. Restart the dev server after creating `.env`

### MongoDB Connection Error
If you see connection errors:
1. Verify `MONGODB_URI` is correct in `.env`
2. Check your MongoDB Atlas IP whitelist
3. Ensure database user has correct permissions

### Build Error
If build fails:
```bash
rm -rf .next
npm run dev
```

## Next Steps

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).
