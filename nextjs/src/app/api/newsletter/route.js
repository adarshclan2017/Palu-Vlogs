import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import dataStore from '@/lib/dataStore';

export async function POST(request) {
  try {
    await connectDB().catch(() => {});
    const { email } = await request.json();
    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, message: 'Valid email required' }, { status: 400 });
    }
    await dataStore.addSubscriber(email);
    return NextResponse.json({ success: true, message: 'Subscribed successfully! 🎉' });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
