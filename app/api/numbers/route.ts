import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET() {
  const numbers = store.getAll();
  return NextResponse.json({ success: true, data: numbers, count: numbers.length });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { number, country = 'US', ttlMinutes = 60 } = body;
    
    if (!number) {
      return NextResponse.json({ success: false, error: 'Number is required' }, { status: 400 });
    }

    const tempNumber = store.create(number, country, ttlMinutes);
    return NextResponse.json({ success: true, data: tempNumber }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE() {
  store.clear();
  return NextResponse.json({ success: true, message: 'All numbers cleared' });
}
