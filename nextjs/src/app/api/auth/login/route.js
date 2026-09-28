import { NextResponse } from 'next/server';
import { connectDB, getStatus } from '@/lib/db';
import { signToken } from '@/lib/auth';
import dataStore from '@/lib/dataStore';
import bcrypt from 'bcryptjs';

/**
 * AUTO-SEED ADMIN:
 * On Vercel (MongoDB connected), if no admin user exists in Atlas yet,
 * we auto-create one on the first login attempt so deployment never breaks.
 */
async function ensureAdminExists() {
  if (!getStatus()) return; // local mode, local_db.json handles it
  try {
    const { default: UserModel } = await import('@/models/User.js');
    const exists = await UserModel.findOne({ role: 'admin' });
    if (!exists) {
      const hashed = await bcrypt.hash('Admin@123', 10);
      await UserModel.create({
        name: 'Palu Vlogs Admin',
        email: 'admin@paluvlogs.com',
        password: hashed,
        role: 'admin',
        avatar: '/assets/images/logo.jpg'
      });
      console.log('[setup] Admin user auto-created in MongoDB Atlas.');
    }
  } catch (e) {
    console.warn('[setup] Could not auto-create admin:', e.message);
  }
}

export async function POST(request) {
  try {
    await connectDB().catch(() => {});

    // Ensure admin exists in MongoDB Atlas on first login
    await ensureAdminExists();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password required' }, { status: 400 });
    }

    const user = await dataStore.getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 });
    }

    const token = signToken({ id: user._id, email: user.email, role: user.role });

    const response = NextResponse.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
    });

    // Also set as httpOnly cookie for middleware auth
    response.cookies.set('palu_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    return response;
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
