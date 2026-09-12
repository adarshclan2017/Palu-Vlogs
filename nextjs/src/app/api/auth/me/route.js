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
    const user = await dataStore.getUserById(decoded.id);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
