import { NextRequest, NextResponse } from 'next/server'

// POST contact form submission
export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Here you would typically send an email using nodemailer
    // For now, we'll just log it
    console.log('Contact form submission:', { name, email, subject, message })

    // Simulate email sending
    // You can implement nodemailer here if needed

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!'
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

