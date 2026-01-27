# Style Explanation & Design Documentation
## Nataša Wellness Beauty Salon Website

This document provides a comprehensive and precise description of the website's design, styling, colors, typography, components, and features.

---

## 🎨 Color Palette

### Primary Colors
- **Primary (Default)**: `#D4A574` - Warm golden-beige tone, used for buttons, highlights, icons, and accent elements
- **Primary Light**: `#E5C7A1` - Lighter shade of primary, used for gradients and subtle backgrounds
- **Primary Dark**: `#B8895E` - Darker shade of primary, used for hover states and depth

### Base Colors
- **Dark**: `#1A1A1A` - Deep charcoal black, used for text, backgrounds, and contrast elements
- **Light**: `#F8F8F8` - Off-white/light gray, used for section backgrounds and card backgrounds

### Text Colors
- **Primary Text**: `#1A1A1A` (dark) - Main body text and headings
- **Secondary Text**: `#6c757d` (gray-600) - Secondary text, descriptions, and metadata
- **Light Text**: `#F8F8F8` - Text on dark backgrounds
- **White Text**: `#FFFFFF` - Text on primary/dark backgrounds

### Background Colors
- **White**: `#FFFFFF` - Main page background
- **Light Gray**: `#F8F8F8` - Section backgrounds, card backgrounds
- **Dark**: `#1A1A1A` - Footer background, dark sections
- **Gray Scale**: Standard Tailwind gray scale (100-900) for borders, shadows, and subtle elements

---

## 📝 Typography

### Font Families

1. **Playfair Display** (Serif)
   - Usage: Main headings, hero titles, section titles, brand name
   - Weights: 400, 500, 600, 700
   - Characteristics: Elegant, sophisticated, classic serif font
   - Applied via: `font-playfair`

2. **Dancing Script** (Script/Handwriting)
   - Usage: Decorative subtitles, section labels, accent text
   - Weights: 400, 500, 600, 700
   - Characteristics: Elegant script font for decorative elements
   - Applied via: `font-dancing`

3. **Work Sans** (Sans-serif)
   - Usage: Body text, paragraphs, UI elements, buttons, navigation
   - Weights: 300, 400, 500, 600, 700
   - Characteristics: Clean, modern, highly readable sans-serif
   - Applied via: `font-worksans` (default body font)

### Typography Scale

- **Hero Titles**: `text-4xl md:text-6xl lg:text-7xl` (Playfair Display, bold)
- **Section Titles**: `text-4xl md:text-5xl` (Playfair Display, bold)
- **Subsection Titles**: `text-2xl md:text-3xl` (Playfair Display, semibold)
- **Card Titles**: `text-xl md:text-2xl` (Playfair Display, bold)
- **Body Text**: `text-base md:text-lg` (Work Sans, regular)
- **Small Text**: `text-sm md:text-base` (Work Sans, regular)
- **Labels/Subtitles**: `text-lg md:text-xl` (Dancing Script, regular)

---

## 🎭 Design System & Visual Style

### Overall Aesthetic
- **Style**: Modern, elegant, luxurious beauty salon aesthetic
- **Mood**: Sophisticated, warm, inviting, professional
- **Layout**: Clean, spacious, well-organized with generous white space
- **Visual Hierarchy**: Clear distinction between sections using typography, spacing, and color

### Design Principles
1. **Elegance**: Serif fonts and refined color palette
2. **Warmth**: Golden-beige primary color creates warmth
3. **Clarity**: High contrast, readable typography
4. **Spacing**: Generous padding and margins for breathing room
5. **Consistency**: Unified design language across all pages

---

## 🧩 Component Styles

### Buttons

#### Primary Button
- **Background**: Primary color (`#D4A574`)
- **Text**: Dark (`#1A1A1A`)
- **Padding**: `px-8 py-3` or `px-6 py-3`
- **Border Radius**: `rounded-full` (fully rounded) or `rounded-lg`
- **Font**: Work Sans, semibold, uppercase, tracking-wider
- **Hover**: Background changes to dark, text changes to primary, scale 1.05
- **Transitions**: All properties transition smoothly (300ms duration)

#### Secondary Button
- **Background**: Dark (`#1A1A1A`)
- **Text**: Primary (`#D4A574`)
- **Hover**: Background changes to primary, text changes to dark

#### Custom Button Styles
- **Border Animation**: Buttons feature animated borders that expand on hover
- **Scale Effect**: Buttons scale up slightly on hover (1.05x)
- **Shadow**: Subtle shadow on hover for depth

### Cards

#### Standard Card
- **Background**: Light (`#F8F8F8`) or white
- **Border Radius**: `rounded-xl` or `rounded-2xl`
- **Padding**: `p-6` or `p-8`
- **Shadow**: `shadow-lg` or `shadow-xl`
- **Hover**: Shadow increases, slight lift effect (translateY)

#### Service Card
- **Background**: White
- **Border**: `border-b border-r border-gray-200`
- **Padding**: `p-8`
- **Hover**: Shadow increases (`shadow-2xl`), slight scale and lift

#### Contact Info Card
- **Background**: Light (`#F8F8F8`)
- **Padding**: `p-6`
- **Border Radius**: `rounded-xl`
- **Hover**: Shadow appears, slight horizontal movement (x: 10)

### Navigation Bar

#### Desktop Navbar
- **Background**: Light (`#F8F8F8`)
- **Position**: Sticky, top of page
- **Height**: Responsive (py-4 md:py-6)
- **Shadow**: Appears on scroll (`shadow-xl`)
- **Logo**: Primary color background, dark text
- **Links**: Dark text, hover to primary, uppercase, tracking-wider
- **Active State**: Primary color text with bottom border indicator

#### Mobile Navbar
- **Background**: White
- **Menu**: Full-width dropdown with border-top
- **Links**: Stacked vertically with padding
- **Language Switcher**: Centered in mobile menu

### Footer

#### Footer Structure
- **Background**: Dark (`#1A1A1A`)
- **Text Color**: Gray-300 for body, primary for headings
- **Layout**: Two-column grid (desktop), single column (mobile)
- **Sections**:
  - Left: About section with logo, description, contact info, social links
  - Right: Quick Links and Newsletter

#### Footer Elements
- **Logo**: Primary color icon and text
- **Contact Info**: Icons in primary color, text in gray-300
- **Social Icons**: Primary background, dark text, circular, hover effects (scale + rotate)
- **Links**: Gray-300 text, hover to primary, arrow indicator (›)
- **Newsletter**: Dark input field, primary button

### Hero Section

#### Hero Slider
- **Background**: Full-screen with background image
- **Overlay**: Light background with 95% opacity
- **Layout**: Two-column grid (content + image slider)
- **Content**: Left-aligned on desktop, centered on mobile
- **Typography**: Dancing Script for welcome text, Playfair Display for main title
- **Buttons**: Primary buttons with hover effects
- **Navigation**: Arrow buttons for slide navigation
- **Auto-play**: Slides change every 5 seconds

### Sections

#### Section Spacing
- **Vertical Padding**: `py-20` (80px) standard, `py-12 md:py-16 lg:py-20` responsive
- **Container**: Custom container with max-width constraints
- **Gap**: `gap-12` between grid items

#### Section Backgrounds
- **White Sections**: `bg-white`
- **Light Sections**: `bg-light` (`#F8F8F8`)
- **Dark Sections**: `bg-dark` (`#1A1A1A`)
- **Gradient Sections**: Primary color gradients with opacity

### Promotional Section (Parallax)

#### Background
- **Image**: Background image with fixed attachment (parallax effect)
- **Overlay**: Gradient overlay from primary/80 via primary/60 to transparent
- **Layout**: Two-column grid

#### Left Column (Promo)
- **Background**: Primary color (`#D4A574`)
- **Content**: Title, subtitle, large title, promotion box
- **Promotion Box**: Dark background with white text, percentage display

#### Right Column (Services List)
- **Background**: Dark (`#1A1A1A`)
- **Content**: List of featured services with images, names, and prices
- **Items**: White/5 background, hover to white/10, rounded corners

---

## 🎬 Animations & Interactions

### Framer Motion Animations

#### Page Load Animations
- **Fade In**: Elements fade in from opacity 0 to 1
- **Slide In**: Elements slide in from left/right/bottom
- **Scale In**: Elements scale from 0.9 to 1.0
- **Stagger**: Children animate with staggered delays

#### Hover Effects
- **Scale**: Elements scale to 1.05 or 1.1 on hover
- **Translate**: Elements move horizontally (x: 10) or vertically (y: -10)
- **Rotate**: Icons rotate 360° on hover
- **Shadow**: Shadows increase on hover

#### Scroll Animations
- **Intersection Observer**: Elements animate when entering viewport
- **Trigger Once**: Animations trigger once per scroll
- **Threshold**: 0.1 (10% visibility triggers animation)

### Custom Animations

#### Float Animation
- **Duration**: 3s, ease-in-out, infinite
- **Effect**: Elements float up and down (translateY -20px)

#### Shimmer Effect
- **Duration**: 2s, linear, infinite
- **Effect**: Gradient shimmer across elements

#### Slide Animations
- **Slide Up**: From bottom (translateY 100%)
- **Slide Down**: From top (translateY -100%)
- **Duration**: 0.5s ease-out

---

## 📱 Responsive Design

### Breakpoints (Tailwind CSS)
- **sm**: 640px (small tablets)
- **md**: 768px (tablets)
- **lg**: 1024px (desktops)
- **xl**: 1280px (large desktops)
- **2xl**: 1536px (extra large desktops)

### Responsive Patterns

#### Grid Layouts
- **Mobile**: Single column (`grid-cols-1`)
- **Tablet**: Two columns (`md:grid-cols-2`)
- **Desktop**: Three columns (`lg:grid-cols-3`)

#### Typography Scaling
- **Mobile**: Smaller base sizes
- **Desktop**: Larger sizes with `md:` and `lg:` prefixes
- Example: `text-4xl md:text-5xl lg:text-6xl`

#### Spacing
- **Mobile**: Reduced padding (`p-4`, `py-12`)
- **Desktop**: Increased padding (`md:p-8`, `lg:py-20`)

#### Navigation
- **Mobile**: Hamburger menu, full-width dropdown
- **Desktop**: Horizontal navigation bar

---

## 🖼️ Image Handling

### Image Styles
- **Border Radius**: `rounded-xl` or `rounded-2xl` for cards
- **Object Fit**: `object-cover` for background images, `object-contain` for icons
- **Hover Effects**: Scale to 1.1 on hover (`scale-110`)
- **Transitions**: Smooth scale transitions (700ms duration)

### Image Categories
1. **Hero Images**: Full-screen, background images
2. **Service Icons**: Small icons (w-20 h-20), contained
3. **Gallery Images**: Square aspect ratio, cover fit
4. **Team Photos**: Circular (rounded-full), cover fit
5. **Background Images**: Fixed attachment for parallax

---

## 🎯 Special Effects

### Glassmorphism
- **Glass Effect**: `backdrop-blur-xl`, semi-transparent white background
- **Glass Dark**: Dark version with dark background
- **Glass Primary**: Primary color tinted version
- **Usage**: Hero section contact cards, modals

### Parallax Effects
- **Background Attachment**: `fixed` for parallax scrolling
- **Overlay Gradients**: Dynamic opacity gradients
- **Usage**: Promotional section, hero backgrounds

### Gradient Effects
- **Text Gradients**: Primary color gradient on text (bg-clip-text)
- **Background Gradients**: Primary color gradients with varying opacity
- **Button Gradients**: Gradient backgrounds on hover

### Shadow System
- **Small**: `shadow` - Subtle elevation
- **Medium**: `shadow-lg` - Card elevation
- **Large**: `shadow-xl` - Modal elevation
- **Extra Large**: `shadow-2xl` - Hero elements
- **Colored Shadows**: Primary color shadows on hover

---

## 📄 Page-Specific Styles

### Homepage
- **Hero Section**: Full-screen with slider
- **About Section**: Two-column with image and content
- **Services Section**: Three-column grid of service cards
- **Promotional Section**: Parallax with promotion box and services list
- **Gallery Preview**: Grid of gallery images
- **Testimonials**: Three-column grid of testimonial cards

### Contact Page
- **Hero Section**: Light background with centered title
- **Contact Info Cards**: Four cards with icons (Location, Phone, Email, Hours)
- **Contact Form**: Light background card with form inputs
- **Form Inputs**: Rounded borders, focus states with primary color

### Pricelist Page
- **Category Grid**: Grid of category cards with icons
- **Modal**: Full-screen modal with category treatments
- **Treatment Cards**: Light background, hover effects
- **Price Display**: Primary color badges with icons

### Services Page
- **Service Grid**: Grid layout of service cards
- **Service Details**: Detailed service information with images

### About Page
- **Content Sections**: Multiple sections with images and text
- **Team Preview**: Grid of team member cards

### Booking Page
- **Calendar Component**: React Big Calendar with custom styling
- **Form Elements**: Styled form inputs and buttons

---

## 🎨 Admin Dashboard Styles

### Dashboard Layout
- **Background**: Light (`#F8F8F8`)
- **Cards**: White background with shadows
- **Grid**: Responsive grid of feature cards

### Admin Cards
- **Gradient Backgrounds**: Various gradient combinations
- **Icons**: Large icons in white/20 background circles
- **Hover Effects**: Scale and lift animations
- **Colors**: Different gradient colors for different features:
  - Pricelist: Blue gradient
  - Translations: Green gradient
  - Images: Pink gradient
  - Promotions: Orange gradient

### Admin Forms
- **Input Fields**: Border-2, rounded-lg, focus states
- **Buttons**: Primary color, rounded-full
- **Modals**: White background, rounded-3xl, shadow-2xl

---

## 🌐 Internationalization (i18n)

### Language Support
- **Supported Languages**: Serbian (sr), English (en), French (fr), German (de)
- **Default Language**: Serbian (sr)
- **Language Switcher**: Dropdown in navbar with flag icons

### Translation System
- **Context**: React Context API for translations
- **Storage**: LocalStorage for language preference
- **Routing**: Next.js locale routing (`/[locale]/page`)

---

## 🔧 Technical Implementation

### CSS Framework
- **Tailwind CSS**: Utility-first CSS framework
- **Custom Classes**: Extended with custom component classes
- **Responsive Utilities**: Mobile-first responsive design

### Animation Library
- **Framer Motion**: React animation library
- **AnimatePresence**: For exit animations
- **Variants**: Reusable animation variants

### Font Loading
- **Google Fonts**: External font loading
- **Font Display**: Swap for performance
- **Preload**: Critical fonts preloaded

---

## 📊 Design Tokens Summary

### Spacing Scale
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)
- **3xl**: 4rem (64px)

### Border Radius
- **sm**: 0.25rem (4px)
- **md**: 0.5rem (8px)
- **lg**: 0.75rem (12px)
- **xl**: 1rem (16px)
- **2xl**: 1.5rem (24px)
- **full**: 9999px (fully rounded)

### Transition Durations
- **Fast**: 150ms
- **Normal**: 300ms
- **Slow**: 500ms
- **Very Slow**: 700ms

### Z-Index Layers
- **Base**: 0
- **Dropdown**: 10
- **Sticky**: 50
- **Modal**: 50
- **Overlay**: 40

---

## 🎯 Accessibility Features

### Color Contrast
- **Text on Primary**: Dark text on primary background (high contrast)
- **Text on Dark**: Primary/white text on dark background (high contrast)
- **Text on Light**: Dark text on light background (high contrast)

### Interactive Elements
- **Focus States**: Visible focus outlines with primary color
- **Hover States**: Clear visual feedback on all interactive elements
- **Button Labels**: Descriptive button text and aria-labels

### Responsive Text
- **Scalable**: Text scales appropriately on all devices
- **Readable**: Minimum font sizes maintained for readability

---

## 📝 Summary

The Nataša Wellness website features a **sophisticated, elegant design** with:
- **Warm golden-beige primary color** (`#D4A574`) creating a luxurious feel
- **Elegant typography** combining serif (Playfair Display) and script (Dancing Script) fonts
- **Smooth animations** using Framer Motion for engaging user experience
- **Responsive design** that adapts beautifully from mobile to desktop
- **Consistent design language** across all pages and components
- **Modern UI patterns** including glassmorphism, parallax effects, and gradient overlays
- **Professional admin dashboard** for content management
- **Multilingual support** with Serbian as the default language

The design successfully balances **elegance and functionality**, creating a premium beauty salon experience that is both visually appealing and highly usable.

---

*Last Updated: January 2025*
