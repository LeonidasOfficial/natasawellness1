import fs from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'src', 'data')

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
    return readJSONFile('services.json')
  },
  async updateServices(services: any[]) {
    return writeJSONFile('services.json', services)
  },

  // Team
  async getTeam() {
    return readJSONFile('team.json')
  },
  async updateTeam(team: any[]) {
    return writeJSONFile('team.json', team)
  },

  // Testimonials
  async getTestimonials() {
    return readJSONFile('testimonials.json')
  },
  async updateTestimonials(testimonials: any[]) {
    return writeJSONFile('testimonials.json', testimonials)
  },

  // Gallery
  async getGallery() {
    return readJSONFile('gallery.json')
  },
  async updateGallery(gallery: any[]) {
    return writeJSONFile('gallery.json', gallery)
  },

  // Blog
  async getBlog() {
    return readJSONFile('blog.json')
  },
  async updateBlog(blog: any[]) {
    return writeJSONFile('blog.json', blog)
  },

  // Bookings
  async getBookings() {
    return readJSONFile('bookings.json')
  },
  async updateBookings(bookings: any[]) {
    return writeJSONFile('bookings.json', bookings)
  },

  // Site Config
  async getSiteConfig() {
    return readJSONFile('site-config.json')
  },
  async updateSiteConfig(config: any) {
    return writeJSONFile('site-config.json', config)
  },

  // Admin
  async getAdmin() {
    return readJSONFile('admin.json')
  },
  async updateAdmin(admin: any) {
    return writeJSONFile('admin.json', admin)
  },
}

// Generic read/write functions for dynamic file access
export async function readData(filename: string) {
  return readJSONFile(`${filename}.json`)
}

export async function writeData(filename: string, data: any) {
  return writeJSONFile(`${filename}.json`, data)
}

