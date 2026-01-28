# 🔐 Admin Dashboard Access

## Access URL

**Production (Vercel):**
```
https://natasawellness1-o5fe2yqyq-leonidasofficials-projects.vercel.app/admin/login
```

**Local Development:**
```
http://localhost:3000/admin/login
```

## Login Credentials

- **Email:** `admin@natasawellness.com`
- **Password:** You need to check or reset the password (see below)

## Admin Dashboard Features

Once logged in, you'll have access to:

1. **Dashboard** (`/admin/dashboard`)
   - Overview statistics
   - Quick access to all management sections

2. **Price List Management** (`/admin/pricelist`)
   - Add, edit, delete categories and treatments
   - Update prices and descriptions

3. **Image Management** (`/admin/images`)
   - Upload and replace website images
   - Edit image metadata (title, location, description)
   - All changes are saved to the project files

4. **Promotions Management** (`/admin/promotions`)
   - Edit homepage promotional section
   - Update percentage promotions
   - Manage featured services list

5. **Translations Management** (`/admin/translations`)
   - Edit translations for all languages (English, Serbian, French, German)
   - Auto-translate using AI
   - Save translations to JSON files

6. **Reports** (`/admin/reports`)
   - View analytics and reports

## Reset Admin Password

If you need to reset the admin password:

1. **Generate a new password hash:**
   ```bash
   node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your-new-password', 10).then(hash => console.log(hash));"
   ```

2. **Update `src/data/admin.json`:**
   ```json
   {
     "email": "admin@natasawellness.com",
     "passwordHash": "YOUR_NEW_HASH_HERE"
   }
   ```

3. **Commit and push to GitHub:**
   ```bash
   git add src/data/admin.json
   git commit -m "Update admin password"
   git push origin main
   ```

4. **Vercel will automatically redeploy** with the new password.

## Security Notes

- ⚠️ **Important:** Change the default password in production!
- The admin dashboard is protected by authentication
- All admin API routes require valid authentication
- Session cookies expire after 7 days

## Troubleshooting

If you can't log in:
1. Check that the email matches exactly: `admin@natasawellness.com`
2. Verify the password hash in `src/data/admin.json`
3. Check browser console for any errors
4. Try clearing browser cookies and cache
5. Check Vercel deployment logs for any errors
