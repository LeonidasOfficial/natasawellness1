import fs from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'src', 'data')

// Type definitions for data structures
interface Service {
  id: string
  name: string
  description: string
  image: string
  price: number
  duration: string
  featured?: boolean
}

interface TeamMember {
  id: string
  name: string
  role: string
  image: string
  bio: string
}

interface Testimonial {
  id: string
  name: string
  role: string
  text: string
  rating: number
  image: string
}

interface GalleryItem {
  id: string
  image: string
  title: string
  category: string
}

interface BlogPost {
  id: string
  title: string
  excerpt: string
  image: string
  date: string
  author: string
  category: string
}

interface SiteConfig {
  siteName: string
  tagline: string
  contact: {
    phone: string
    email: string
    address: string
  }
  social: {
    facebook: string
    instagram: string
    tiktok: string
    linkedin: string
    twitter: string
  }
  businessHours: {
    weekdays: string
    saturday: string
    sunday: string
  }
  announcement: {
    active: boolean
    message: string
    link: string
  }
}

interface AdminUser {
  email: string
  passwordHash: string
}

export async function readJSONFile<T>(filename: string): Promise<T> {
  try {
    const filePath = path.join(DATA_DIR, filename)
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error(`Error reading ${filename}:`, error)
    throw error
  }
}

export async function writeJSONFile<T>(filename: string, data: T): Promise<void> {
  try {
    const filePath = path.join(DATA_DIR, filename)
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error(`Error writing ${filename}:`, error)
    throw error
  }
}

// Specific data functions
export const db = {
  // Services
  async getServices() {
    return readJSONFile<Service[]>('services.json')
  },
  async updateServices(services: Service[]) {
    return writeJSONFile('services.json', services)
  },

  // Team
  async getTeam() {
    return readJSONFile<TeamMember[]>('team.json')
  },
  async updateTeam(team: TeamMember[]) {
    return writeJSONFile('team.json', team)
  },

  // Testimonials
  async getTestimonials() {
    return readJSONFile<Testimonial[]>('testimonials.json')
  },
  async updateTestimonials(testimonials: Testimonial[]) {
    return writeJSONFile('testimonials.json', testimonials)
  },

  // Gallery
  async getGallery() {
    return readJSONFile<GalleryItem[]>('gallery.json')
  },
  async updateGallery(gallery: GalleryItem[]) {
    return writeJSONFile('gallery.json', gallery)
  },

  // Blog
  async getBlog() {
    return readJSONFile<BlogPost[]>('blog.json')
  },
  async updateBlog(blog: BlogPost[]) {
    return writeJSONFile('blog.json', blog)
  },

  // Bookings (kept for potential future use)
  async getBookings() {
    return readJSONFile<unknown[]>('bookings.json')
  },
  async updateBookings(bookings: unknown[]) {
    return writeJSONFile('bookings.json', bookings)
  },

  // Site Config
  async getSiteConfig() {
    return readJSONFile<SiteConfig>('site-config.json')
  },
  async updateSiteConfig(config: SiteConfig) {
    return writeJSONFile('site-config.json', config)
  },

  // Admin
  async getAdmin() {
    return readJSONFile<AdminUser>('admin.json')
  },
  async updateAdmin(admin: AdminUser) {
    return writeJSONFile('admin.json', admin)
  },
}

// Generic read/write functions for dynamic file access
export async function readData<T = unknown>(filename: string): Promise<T> {
  return readJSONFile<T>(`${filename}.json`)
}

export async function writeData<T = unknown>(filename: string, data: T): Promise<void> {
  return writeJSONFile(`${filename}.json`, data)
}

