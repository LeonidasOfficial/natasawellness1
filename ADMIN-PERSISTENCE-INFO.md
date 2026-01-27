# Admin Changes Persistence

## ✅ All Changes Are Saved to Project Files

All changes made in the admin dashboard are **automatically saved to your project files** and will persist when you deploy. Here's how it works:

### 📁 Where Changes Are Saved

1. **Images** → Saved to: `public/img/`
   - All uploaded images are saved directly to the project's `public/img` directory
   - Old images are automatically backed up before replacement (e.g., `hero-slider-1.jpg.backup.1704123456789`)
   - Changes persist immediately and are included in your git repository
   - **File System**: Uses Node.js `fs.writeFile` to write directly to disk
   - **Location**: `public/img/[filename]` (accessible via `/img/[filename]` in browser)

2. **Price List** → Saved to: `src/data/price-list.json`
   - All price list changes (categories, treatments, prices, footnotes) are saved here
   - Changes are written immediately when you save
   - **File System**: Uses `writeData()` which writes to `src/data/price-list.json`
   - Supports two prices per treatment and footnotes

3. **Translations** → Saved to: `public/locales/` AND `src/locales/`
   - Translation changes are saved to BOTH locations for compatibility
   - `public/locales/[locale].json` - for browser/client-side access
   - `src/locales/[locale].json` - for server-side access
   - Example: `public/locales/en.json`, `src/locales/en.json`, etc.
   - **File System**: Uses Node.js `fs.writeFile` to write directly to disk

4. **Other Data** → Saved to: `src/data/`
   - Services: `src/data/services.json`
   - Team: `src/data/team.json`
   - Gallery: `src/data/gallery.json`
   - Blog: `src/data/blog.json`
   - Testimonials: `src/data/testimonials.json`
   - Bookings: `src/data/bookings.json`
   - **File System**: All use `writeData()` which writes JSON files to disk

### 🔄 How It Works

- **Immediate Persistence**: All changes are written to disk immediately using Node.js `fs.writeFile` or `fs.writeFileSync`
- **No Database Required**: Everything is stored in JSON files and image files in your project
- **Git-Friendly**: All changes are in files that can be committed to git
- **Deployment Ready**: When you deploy, all your changes come with the codebase
- **Real-time Saving**: Changes are saved the moment you click "Save" - no separate publish step needed

### 🔍 Technical Details

**Image Uploads:**
- API Route: `/api/images/upload`
- Saves to: `public/img/[filename]`
- Method: `fs.writeFile()` - writes directly to project directory
- Backup: Old files are backed up with timestamp before replacement

**Price List:**
- API Routes: `/api/pricelist` (POST, PUT, DELETE)
- Saves to: `src/data/price-list.json`
- Method: `writeData()` → `writeJSONFile()` → `fs.writeFile()`
- Format: Pretty-printed JSON with 2-space indentation

**Translations:**
- API Route: `/api/translations/save`
- Saves to: `public/locales/[locale].json` AND `src/locales/[locale].json`
- Method: `fs.writeFile()` - writes to both locations
- Format: Pretty-printed JSON with 2-space indentation

### 📝 Important Notes

1. **Commit Your Changes**: After making changes in the admin panel, commit the changed files to git:
   ```bash
   # Add all changed files
   git add public/img/ public/locales/ src/data/ src/locales/
   
   # Commit with descriptive message
   git commit -m "Updated images, content, and translations via admin panel"
   
   # Push to repository
   git push
   ```

2. **Backup Files**: When replacing images, old images are automatically backed up with a timestamp:
   - Example: `hero-slider-1.jpg.backup.1704123456789`
   - Backups are kept in the same directory for easy recovery

3. **File Locations**:
   - Images: `public/img/*` (accessible via `/img/*` in the browser)
   - Translations (public): `public/locales/*.json` (for client-side access)
   - Translations (server): `src/locales/*.json` (for server-side access)
   - Data: `src/data/*.json` (used by the application)

4. **Verification**: You can verify changes are saved by:
   - Checking file modification timestamps
   - Viewing files in your file explorer
   - Checking git status: `git status` will show modified files
   - Looking at the success toast messages (they confirm "saved to project files")

### 🚀 Deployment

When you deploy your application:
- All images in `public/img/` are included
- All JSON data files in `src/data/` are included
- Your changes will be live immediately after deployment

### ✅ Verification

You can verify that changes are saved by:
1. Checking the file system after making changes
2. Looking at the file modification timestamps
3. Committing to git and seeing the changes in your repository

All admin changes are **permanent** and **persist across deployments**!
