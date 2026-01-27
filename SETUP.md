# 🚀 Quick Setup Guide

## For Developers

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Access the Application
- **Website**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
- **Credentials**: admin@salone.com / password

## For Production (Hostinger)

### Step 1: Prepare Your Files
```bash
npm run build
```

### Step 2: Upload to Hostinger
1. Connect via FTP or File Manager
2. Upload all files to `public_html` or your domain folder
3. Ensure `.next`, `node_modules`, and all source files are uploaded

### Step 3: Configure Node.js
1. Go to Hostinger Control Panel
2. Navigate to "Advanced" → "Node.js"
3. Create Node.js application:
   - **Node.js version**: 18.x or higher
   - **Application mode**: Production
   - **Application root**: `/public_html` (or your folder)
   - **Application startup file**: `npm start`

### Step 4: Install Dependencies
In Hostinger's terminal or SSH:
```bash
cd public_html
npm install --production
```

### Step 5: Set Environment Variables
In Hostinger Node.js settings, add:
```
JWT_SECRET=your-production-secret-key-here
NODE_ENV=production
```

### Step 6: Start Application
```bash
npm start
```

Or use PM2 for auto-restart:
```bash
npm install -g pm2
pm2 start npm --name "salone" -- start
pm2 save
```

## 🔒 Security Checklist

- [ ] Change default admin password
- [ ] Set strong JWT_SECRET in environment variables
- [ ] Use HTTPS for production
- [ ] Enable firewall rules
- [ ] Regular backups of JSON data files

## 📧 Email Setup (Optional)

To enable contact form emails:

1. Add to `.env.local`:
```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=your-email@yourdomain.com
SMTP_PASSWORD=your-email-password
EMAIL_FROM=noreply@yourdomain.com
```

2. The contact form will automatically send emails

## 🎨 Customization Quick Links

- **Colors**: `tailwind.config.js`
- **Site Info**: `src/data/site-config.json`
- **Services**: `src/data/services.json`
- **Team**: `src/data/team.json`
- **Gallery**: `src/data/gallery.json` + add images to `public/img/`

## 🆘 Need Help?

Common issues:
- Port 3000 in use: Change port with `npm run dev -- -p 3001`
- Build errors: Delete `.next` folder and rebuild
- Auth not working: Check JWT_SECRET is set
- Images not showing: Ensure images are in `public/img/` folder

## 📞 Support

For technical support, contact your hosting provider or check the main README.md file.

