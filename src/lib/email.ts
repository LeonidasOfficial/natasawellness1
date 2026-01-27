// Email template helpers
// TODO: Integrate with actual email service (e.g., Resend, SendGrid, Nodemailer)

interface BookingData {
  name: string
  email: string
  phone: string
  service: string
  date: string
  time: string
  message?: string
}

/**
 * Generates HTML email template for customer booking confirmation
 */
export function generateCustomerEmail(booking: BookingData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
          }
          .header {
            background: linear-gradient(135deg, #D4A574, #C4956A);
            color: #1A1A1A;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: white;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .booking-details {
            background: #f5f5f5;
            padding: 20px;
            border-left: 4px solid #D4A574;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 12px;
          }
          .button {
            display: inline-block;
            background: #D4A574;
            color: #1A1A1A;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✨ Nataša Wellness</h1>
            <p>Booking Confirmation</p>
          </div>
          <div class="content">
            <h2>Hello ${booking.name}! 👋</h2>
            <p>Thank you for booking with Nataša Wellness. Your appointment has been successfully scheduled!</p>
            
            <div class="booking-details">
              <h3>📋 Appointment Details</h3>
              <p><strong>Service:</strong> ${booking.service}</p>
              <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong>Time:</strong> ${booking.time}</p>
              <p><strong>Phone:</strong> ${booking.phone}</p>
              ${booking.message ? `<p><strong>Special Requests:</strong> ${booking.message}</p>` : ''}
            </div>

            <p>We're looking forward to seeing you! If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
            
            <center>
              <a href="https://wa.me/381631020305" class="button">Contact Us on WhatsApp</a>
            </center>
          </div>
          <div class="footer">
            <p>Nataša Wellness</p>
            <p>12 Mileta Arčića Pačinog, Velika Plana</p>
            <p>Phone: 063 1020 305 | Email: info@natasawellness.com</p>
          </div>
        </div>
      </body>
    </html>
  `
}

/**
 * Generates HTML email template for admin notification
 */
export function generateAdminEmail(booking: BookingData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: #1A1A1A;
            color: #D4A574;
            padding: 20px;
            border-radius: 5px 5px 0 0;
          }
          .content {
            background: white;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 0 0 5px 5px;
          }
          .booking-info {
            background: #f9f9f9;
            padding: 15px;
            margin: 15px 0;
            border-left: 3px solid #D4A574;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🔔 New Booking Received</h2>
          </div>
          <div class="content">
            <p>A new appointment has been booked through the website.</p>
            
            <div class="booking-info">
              <h3>Customer Information</h3>
              <p><strong>Name:</strong> ${booking.name}</p>
              <p><strong>Email:</strong> ${booking.email}</p>
              <p><strong>Phone:</strong> ${booking.phone}</p>
            </div>

            <div class="booking-info">
              <h3>Appointment Details</h3>
              <p><strong>Service:</strong> ${booking.service}</p>
              <p><strong>Date:</strong> ${booking.date}</p>
              <p><strong>Time:</strong> ${booking.time}</p>
              ${booking.message ? `<p><strong>Special Requests:</strong> ${booking.message}</p>` : ''}
            </div>

            <p><strong>Action Required:</strong> Please confirm this appointment with the customer.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

/**
 * Plain text email template for customer (fallback)
 */
export function generateCustomerTextEmail(booking: BookingData): string {
  return `
Hello ${booking.name}!

Thank you for booking with Nataša Wellness. Your appointment has been successfully scheduled.

APPOINTMENT DETAILS:
- Service: ${booking.service}
- Date: ${booking.date}
- Time: ${booking.time}
- Phone: ${booking.phone}
${booking.message ? `- Special Requests: ${booking.message}` : ''}

We're looking forward to seeing you! If you need to reschedule or cancel, please contact us at least 24 hours in advance.

Contact us: 063 1020 305
WhatsApp: https://wa.me/381631020305

Best regards,
Nataša Wellness Team
12 Mileta Arčića Pačinog, Velika Plana
  `.trim()
}

/**
 * Send booking confirmation emails
 * TODO: Integrate with actual email service provider
 */
export async function sendBookingNotification(booking: BookingData): Promise<{ success: boolean; message: string }> {
  // TODO: Replace with actual email sending logic
  // Example providers:
  // - Resend: https://resend.com/docs/send-with-nodejs
  // - SendGrid: https://github.com/sendgrid/sendgrid-nodejs
  // - Nodemailer: https://nodemailer.com/

  console.log('📧 Email notification would be sent to:', {
    customer: booking.email,
    admin: 'info@natasawellness.com',
    subject: `Booking Confirmation - ${booking.service}`,
  })

  // Simulate email sending
  return {
    success: true,
    message: 'Email notification structure ready. Integrate with email provider to enable sending.',
  }
}

