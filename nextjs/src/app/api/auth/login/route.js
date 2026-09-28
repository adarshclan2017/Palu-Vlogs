import { NextResponse } from 'next/server';
import { connectDB, getStatus } from '@/lib/db';
import { signToken } from '@/lib/auth';
import dataStore from '@/lib/dataStore';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = body.email || '';
    const password = body.password || '';

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      return NextResponse.json({ success: false, message: 'Email and password required' }, { status: 400 });
    }

    // Connect with a fast 2-second timeout to avoid serverless hangs
    await connectDB(2000).catch(() => {});

    // Guaranteed admin bypass: instantly log in without hanging on database
    const isAdminDefault = cleanEmail === 'admin@paluvlogs.com' && cleanPassword === 'Admin@123';

    if (isAdminDefault) {
      // Async update Atlas password if connected (doesn't block login if it fails)
      if (getStatus()) {
        try {
          const { default: UserModel } = await import('@/models/User.js');
          const hash = await bcrypt.hash('Admin@123', 10);
          await UserModel.updateOne(
            { email: 'admin@paluvlogs.com' },
            { $set: { password: hash, role: 'admin', name: 'Palu Vlogs Admin' } },
            { upsert: true }
          );
        } catch (e) {
          console.warn('[login] Atlas sync skipped:', e.message);
        }
      }

      const adminUser = {
        id: 'user_admin_1',
        name: 'Palu Vlogs Admin',
        email: 'admin@paluvlogs.com',
        role: 'admin',
        avatar: '/assets/images/logo.jpg'
      };

      const token = signToken({ id: adminUser.id, email: adminUser.email, role: 'admin' });

      const response = NextResponse.json({
        success: true,
        token,
        user: adminUser
      });

      response.cookies.set('palu_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30
      });

      return response;
    }

    // Standard login flow for other accounts or changed passwords
    let user = null;
    try {
      user = await dataStore.getUserByEmail(cleanEmail);
    } catch (e) {
      console.warn('[login] dataStore error:', e.message);
    }

    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(cleanPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 });
    }

    const token = signToken({ id: user._id, email: user.email, role: user.role });

    const response = NextResponse.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
    });

    response.cookies.set('palu_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30
    });

    return response;

  } catch (err) {
    console.error('[login] Unhandled error:', err);
    return NextResponse.json({ success: false, message: err.message || 'Login failed' }, { status: 500 });
  }
}
