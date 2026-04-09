import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const num = store.get(params.id);
  if (!num) {
    return NextResponse.json({ success: false, error: 'Number not found or expired' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: num });
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { from, content } = body;
    
    if (!from || !content) {
      return NextResponse.json({ success: false, error: 'From and content are required' }, { status: 400 });
    }

    const message = store.addMessage(params.id, from, content);
    if (!message) {
      return NextResponse.json({ success: false, error: 'Number not found or expired' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const deleted = store.delete(params.id);
  if (!deleted) {
    return NextResponse.json({ success: false, error: 'Number not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: 'Number deleted' });
}
