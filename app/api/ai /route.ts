import { NextRequest, NextResponse } from 'next/server';
import { connectDB, User, Project, generateRecommendations, verifyToken } from '../../../lib';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    const user = await User.findById(payload.userId);
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    const projects = await Project.find({ 
      university: user.university,
      status: 'recruiting',
      ownerId: { $ne: user._id }
    }).limit(5);

    const users = await User.find({ 
      university: user.university,
      _id: { $ne: user._id }
    }).limit(5);

    const recommendations = await generateRecommendations(user, projects, users);
    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('AI recommendations error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
