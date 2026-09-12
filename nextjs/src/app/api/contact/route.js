import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import dataStore from '@/lib/dataStore';

// Helper to send email notification (works on Vercel Serverless)
async function sendNotificationEmail({ name, email, subject, message }) {
  const targetEmail = process.env.NOTIFICATION_EMAIL || process.env.EMAIL_USER || 'admin@paluvlogs.com';

  // 1. If Resend API key is available (preferred on Vercel)
  if (process.env.RESEND_API_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'Palu Vlogs <onboarding@resend.dev>',
          to: [targetEmail],
          subject: `[Palu Vlogs Contact] ${subject} from ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background: #0c0d12; color: #ffffff; border-radius: 8px;">
              <h2 style="color: #ff3b3b; margin-top: 0;">New Message on Palu Vlogs</h2>
              <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <div style="background: #181a24; padding: 16px; border-radius: 6px; border-left: 4px solid #ff3b3b; margin: 20px 0;">
                <p style="white-space: pre-wrap; margin: 0; color: #e1e3ec;">${message}</p>
              </div>
              <p style="color: #8c90a4; font-size: 13px;">Received via Palu Vlogs Contact Form</p>
            </div>
          `,
        }),
      });
      console.log(`[Email] Notification sent via Resend to ${targetEmail}`);
      return;
    } catch (err) {
      console.error('[Email Error - Resend]:', err.message);
    }
  }

  // 2. Fallback: Log notification to console (always succeeds & visible in Vercel logs)
  console.log('========================================================');
  console.log(`📬 NEW CONTACT MESSAGE NOTIFICATION`);
  console.log(`To: ${targetEmail}`);
  console.log(`From: ${name} (${email})`);
  console.log(`Subject: ${subject}`);
  console.log(`Message: ${message}`);
  console.log('========================================================');
}

export async function GET(request) {
  try {
    await connectDB().catch(() => {});
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    const messages = await dataStore.getContactMessages();
    return NextResponse.json({ success: true, count: messages.length, data: messages });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB().catch(() => {});
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, message: 'Name, email and message are required' }, { status: 400 });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, message: 'Please provide a valid email address' }, { status: 400 });
    }

    // Save message to MongoDB Atlas
    const msg = await dataStore.createContactMessage({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: (subject || 'General Inquiry').trim(),
      message: message.trim()
    });

    // Send email notification (non-blocking)
    sendNotificationEmail({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: (subject || 'General Inquiry').trim(),
      message: message.trim()
    }).catch((err) => console.error('[Notification Mail Error]:', err.message));

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon 🎉',
      data: msg
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
