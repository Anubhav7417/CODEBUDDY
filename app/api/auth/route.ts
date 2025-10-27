import { NextRequest, NextResponse } from 'next/server';
import { connectDB, User, generateToken, verifyPassword, hashPassword, validateUniversityEmail, verifyToken } from '../../../lib';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user || !(await verifyPassword(password, user.password))) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = generateToken({ userId: user._id.toString(), email: user.email, university: user.university });
    const userData = user.toObject();
    delete userData.password;

    return NextResponse.json({ user: userData, token });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const { email, password, name, university, branch, year } = await request.json();

    if (!email || !password || !name || !university || !branch || !year) {
      return NextResponse.json({ message: 'All fields required' }, { status: 400 });
    }

    const { isValid, domain } = validateUniversityEmail(email);
    if (!isValid) {
      return NextResponse.json({ message: 'Valid university email required' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      email, password: hashedPassword, name, university, branch, year,
      verification: { status: 'pending', universityDomain: domain },
      stats: { xp: 0, level: 1, completedProjects: 0, rating: 0, connections: 0 },
    });

    const token = generateToken({ userId: user._id.toString(), email: user.email, university: user.university });
    const userData = user.toObject();
    delete userData.password;

    return NextResponse.json({ user: userData, token });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) return NextResponse.json({ message: 'No token' }, { status: 401 });

    const payload = verifyToken(token);
    const user = await User.findById(payload.userId);
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    const userData = user.toObject();
    delete userData.password;

    return NextResponse.json(userData);
  } catch (error) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}
