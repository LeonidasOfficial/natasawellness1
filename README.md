# 💇‍♀️ Salone - Modern Beauty Salon Website

A stunning, feature-rich beauty salon website built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**. Includes a complete admin dashboard for content management and booking system.

## ✨ Features

### 🎨 Frontend Features
- **Modern, Responsive Design** - Beautiful UI that works on all devices
- **Advanced Animations** - Smooth transitions, parallax effects, hover animations
- **Hero Slider** - Auto-rotating image slider with controls
- **Service Showcase** - Dynamic services display with pricing
- **Booking System** - Complete appointment booking with calendar
- **Gallery** - Image gallery with lightbox effects
- **Team Section** - Meet our specialists
- **Testimonials** - Customer reviews and ratings
- **Blog** - Beauty tips and articles
- **Contact Form** - Get in touch with the salon
- **Floating Book Button** - Sticky CTA for easy booking
- **Scroll to Top** - Smooth scroll to top button

### 🔐 Admin Panel Features
- **Secure Authentication** - JWT-based admin login
- **Dashboard Analytics** - View bookings, revenue, and statistics
- **Booking Management** - View and manage all appointments
- **Status Updates** - Change booking status (pending, confirmed, completed, cancelled)
- **Content Management** - Update services, prices, team, testimonials, gallery
- **Responsive Admin UI** - Mobile-friendly dashboard

### 🚀 Technical Features
- **Next.js 14** - Latest React framework with App Router
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **JSON File Storage** - Simple data persistence
- **API Routes** - RESTful API endpoints
- **Hot Toast** - Beautiful notifications
- **SEO Optimized** - Meta tags and semantic HTML

## 📋 Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn** package manager

## 🛠️ Installation

1. **Navigate to the project folder**
   ```bash
   cd beauty-salon-website-template
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Create environment file (optional)**
   Create a `.env.local` file in the root directory:
   ```env
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   NEXT_PUBLIC_SITE_NAME=Salone Beauty Salon
   ```

4. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Default Admin Credentials

- **Email**: `admin@salone.com`
- **Password**: `password`

> ⚠️ **Important**: Change these credentials in production!

To change the admin password, you'll need to generate a new bcrypt hash:

```javascript
const bcrypt = require('bcryptjs');
const password = 'your-new-password';
bcrypt.hash(password, 10).then(hash => console.log(hash));
```

Then update `src/data/admin.json` with the new hash.

## 📁 Project Structure

```
beauty-salon-website-template/
├── public/
│   └── img/                    # All images
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── login/          # Admin login page
│   │   │   └── dashboard/      # Admin dashboard
│   │   ├── api/                # API routes
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   ├── bookings/       # Booking management
│   │   │   ├── services/       # Services API
│   │   │   └── contact/        # Contact form
│   │   ├── booking/            # Booking page
│   │   ├── contact/            # Contact page
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Homepage
│   ├── components/
│   │   ├── home/               # Homepage components
│   │   ├── layout/             # Navbar, Footer
│   │   └── ui/                 # Reusable UI components
│   ├── data/                   # JSON data files
│   │   ├── services.json
│   │   ├── team.json
│   │   ├── testimonials.json
│   │   ├── gallery.json
│   │   ├── blog.json
│   │   ├── bookings.json
│   │   ├── site-config.json
│   │   └── admin.json
│   └── lib/
│       ├── auth.ts             # Authentication utilities
│       └── db.ts               # Database utilities
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## 🌐 Deployment to Hostinger

### Method 1: Node.js Hosting

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Upload to Hostinger**
   - Upload all files to your hosting directory
   - Ensure Node.js is enabled on your hosting plan

3. **Install dependencies on server**
   ```bash
   npm install --production
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Configure process manager (PM2)**
   ```bash
   npm install -g pm2
   pm2 start npm --name "salone" -- start
   pm2 save
   pm2 startup
   ```

### Method 2: Static Export (if backend not needed)

1. **Update next.config.js**
   ```javascript
   module.exports = {
     output: 'export',
     images: { unoptimized: true }
   }
   ```

2. **Build**
   ```bash
   npm run build
   ```

3. **Upload `out` folder** to your Hostinger public_html

## 🎨 Customization

### Change Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#D4A574',  // Your primary color
        light: '#E5C7A1',
        dark: '#B8895E',
      },
    },
  },
}
```

### Update Contact Information

Edit `src/data/site-config.json`:

```json
{
  "contact": {
    "phone": "+your-phone-number",
    "email": "your@email.com",
    "address": "Your Address"
  }
}
```

### Add/Edit Services

Edit `src/data/services.json`:

```json
{
  "id": "7",
  "name": "New Service",
  "description": "Service description",
  "image": "/img/service.png",
  "price": 99,
  "duration": "60 min",
  "featured": true
}
```

### Modify Team Members

Edit `src/data/team.json` to add or update team members.

### Update Gallery

Add images to `public/img/` and update `src/data/gallery.json`.

## 🔧 API Endpoints

### Public Endpoints
- `POST /api/bookings` - Create a new booking
- `POST /api/contact` - Submit contact form
- `GET /api/services` - Get all services

### Admin Endpoints (requires authentication)
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/verify` - Verify auth status
- `GET /api/bookings` - Get all bookings
- `PATCH /api/bookings/[id]` - Update booking status
- `DELETE /api/bookings?id=` - Delete booking
- `PUT /api/services` - Update services

## 🎯 Features to Add (Optional)

- [ ] Email notifications using Nodemailer
- [ ] SMS notifications for bookings
- [ ] Payment integration (Stripe/PayPal)
- [ ] Customer accounts
- [ ] Online gift cards
- [ ] Loyalty program
- [ ] Before/after photo gallery
- [ ] Service categories
- [ ] Multiple locations support
- [ ] Staff booking preferences

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill
```

### Build errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### TypeScript errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Support

For issues or questions:
- Email: support@salone.com
- Create an issue in the repository

## 🌟 Credits

Built with modern web technologies:
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Icons](https://react-icons.github.io/react-icons/)

---

**Made with ❤️ for beauty salons worldwide**

