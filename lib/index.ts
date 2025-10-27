import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import OpenAI from 'openai';

// Database
const MONGODB_URI = process.env.MONGODB_URI!;
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then(mongoose => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Schemas
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  avatar: String,
  university: { type: String, required: true },
  branch: { type: String, required: true },
  year: { type: Number, required: true },
  skills: [String],
  interests: [String],
  bio: String,
  verification: {
    status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    universityDomain: { type: String, required: true }
  },
  stats: {
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    completedProjects: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    connections: { type: Number, default: 0 }
  },
  badges: [String],
  availability: { type: String, enum: ['available', 'busy', 'away'], default: 'available' },
  github: String
}, { timestamps: true });

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  ownerId: { type: String, required: true },
  requiredRoles: [{
    role: { type: String, required: true },
    count: { type: Number, required: true },
    skills: [String]
  }],
  techStack: [String],
  status: { type: String, enum: ['recruiting', 'active', 'completed', 'cancelled'], default: 'recruiting' },
  teamMembers: [String],
  applications: [String],
  collaborationType: { type: String, enum: ['remote', 'hybrid', 'in-person'], required: true },
  timeline: {
    start: { type: Date, required: true },
    end: { type: Date, required: true }
  },
  vibe: { type: String, enum: ['serious', 'casual', 'learning'], required: true },
  university: { type: String, required: true },
  githubRepo: String
}, { timestamps: true });

const MessageSchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  userId: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['text', 'code', 'file'], default: 'text' },
  codeSnippet: { language: String, code: String },
  file: { name: String, url: String, size: Number }
}, { timestamps: true });

export const User = mongoose.models?.User || mongoose.model('User', UserSchema);
export const Project = mongoose.models?.Project || mongoose.model('Project', ProjectSchema);
export const Message = mongoose.models?.Message || mongoose.model('Message', MessageSchema);

// Auth
const JWT_SECRET = process.env.JWT_SECRET!;
export function generateToken(payload: any) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}
export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as any;
}
export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}
export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}
export function validateUniversityEmail(email: string) {
  const domain = email.split('@')[1];
  const isValid = domain.includes('.edu') || domain.endsWith('.ac.uk');
  return { isValid, domain };
}

// Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export async function uploadFile(buffer: Buffer) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'collabsync', resource_type: 'auto' },
      (error, result) => error ? reject(error) : resolve(result)
    );
    uploadStream.end(buffer);
  });
}

// AI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
export async function generateRecommendations(user: any, projects: any[], users: any[]) {
  const prompt = `User: ${user.skills.join(', ')} skills, ${user.interests.join(', ')} interests. 
  Projects: ${projects.map(p => `${p.title} (${p.techStack.join(', ')})`).join(', ')}
  Users: ${users.map(u => `${u.name} (${u.skills.join(', ')})`).join(', ')}
  Provide JSON with projectRecommendations and userRecommendations with scores and reasons.`;
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });
    return JSON.parse(completion.choices[0]?.message?.content || '{}');
  } catch (error) {
    console.error('AI error:', error);
    return { projectRecommendations: [], userRecommendations: [] };
  }
}
