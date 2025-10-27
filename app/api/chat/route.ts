import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Message } from '../../../lib';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    
    if (!projectId) {
      return NextResponse.json({ message: 'Project ID required' }, { status: 400 });
    }

    const messages = await Message.find({ projectId }).sort({ createdAt: 1 }).limit(50);
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
