import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(async () => {
      // Fallback for form-data (Twilio format)
      const formData = await request.formData();
      return {
        to: formData.get('To') || formData.get('to'),
        from: formData.get('From') || formData.get('from'),
        message: formData.get('Body') || formData.get('text') || formData.get('message')
      };
    });

    const to = body.to || body.number;
    const from = body.from || body.sender;
    const message = body.message || body.text || body.content || body.body;

    if (!to || !from || !message) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing fields: need to, from, message' 
      }, { status: 400 });
    }

    // Find or create the number
    const numbers = store.getAll();
    let num = numbers.find(n => n.number === to);
    
    if (!num) {
      num = store.create(to, 'US', 60);
    }

    const msg = store.addMessage(num.id, from, message);
    
    return NextResponse.json({ 
      success: true, 
      data: { numberId: num.id, message: msg } 
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Invalid request' 
    }, { status: 400 });
  }
}

// For testing: GET shows recent SMS endpoint info
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/sms',
    methods: ['POST'],
    formats: ['JSON', 'Form-data (Twilio style)'],
    example: {
      to: '+15551234567',
      from: '+19998887777',
      message: 'Hello world'
    }
  });
}