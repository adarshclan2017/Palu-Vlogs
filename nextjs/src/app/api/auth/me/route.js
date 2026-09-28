import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import dataStore from '@/lib/dataStore';

export async function GET(request) {
  try {
    await connectDB().catch(() => {});
    const decoded = getUserFromRequest(request);
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }
    let user = await dataStore.getUserById(decoded.id);
    if (!user && decoded.email === 'admin@paluvlogs.com') {
      user = { _id: decoded.id || 'user_admin_1', name: 'Palu Vlogs Admin', email: 'admin@paluvlogs.com', role: 'admin', avatar: '/assets/images/logo.jpg' };
    }
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
