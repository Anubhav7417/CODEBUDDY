import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Project, verifyToken } from '../../../lib';

export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find().limit(20);
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ message: 'No token' }, { status: 401 });

    const payload = verifyToken(token);
    const projectData = await request.json();

    const project = await Project.create({
      ...projectData,
      ownerId: payload.userId,
      university: payload.university,
      status: 'recruiting',
      teamMembers: [payload.userId],
      applications: [],
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
