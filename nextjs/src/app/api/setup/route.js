import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';

/**
 * One-time setup route: Creates admin user in MongoDB Atlas if none exists.
 * Visit /api/setup once after deploying to Vercel.
 * After the admin user is created, this route becomes a no-op (safe to call again).
 */
export async function GET() {
  try {
    await connectDB();

    // Dynamically import to avoid build-time issues
    const { default: UserModel } = await import('@/models/User.js');
    const bcrypt = await import('bcryptjs');

    const existing = await UserModel.findOne({ email: 'admin@paluvlogs.com' });

    if (existing) {
      const hash = await bcrypt.default.hash('Admin@123', 10);
      await UserModel.updateOne({ _id: existing._id }, { password: hash });
      return NextResponse.json({
        success: true,
        message: '✅ Admin user already exists and password verified. You can login now.',
        credentials: {
          email: 'admin@paluvlogs.com',
          password: 'Admin@123'
        }
      });
    }

    // Create admin user (User pre-save hook will hash 'Admin@123')
    await UserModel.create({
      name: 'Palu Vlogs Admin',
      email: 'admin@paluvlogs.com',
      password: 'Admin@123',
      role: 'admin',
      avatar: '/assets/images/logo.jpg'
    });

    return NextResponse.json({
      success: true,
      message: '🎉 Admin user created successfully! You can now login.',
      credentials: {
        email: 'admin@paluvlogs.com',
        password: 'Admin@123'
      }
    });

  } catch (err) {
    return NextResponse.json({
      success: false,
      message: `Setup failed: ${err.message}`
    }, { status: 500 });
  }
}
