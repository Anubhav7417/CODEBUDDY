'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context';
import { Card, Button } from '../../components/UI';
import { ProjectCard, BuddyCard } from '../../components/Dashboard';
import Link from 'next/link';
import { Rocket, Users, TrendingUp, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetch('/api/projects')
        .then(res => res.json())
        .then(setProjects);
      
      fetch('/api/ai', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(setRecommendations);
    }
  }, [user]);

  if (!user) return <div>Loading...</div>;

  const stats = [
    { label: 'Projects', value: user.stats.completedProjects, icon: Rocket },
    { label: 'Connections', value: user.stats.connections, icon: Users },
    { label: 'XP Points', value: user.stats.xp, icon: TrendingUp },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}! 👋</h1>
      <p className="text-gray-600 mb-8">Ready to build something amazing?</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <stat.icon className="h-6 w-6 text-blue-500" />
            </div>
          </Card>
        ))}
      </div>

      {recommendations && (
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <h2 className="text-xl font-semibold">AI Project Recommendations</h2>
            </div>
            <div className="space-y-4">
              {recommendations.projectRecommendations?.slice(0, 2).map((rec: any) => (
                <ProjectCard key={rec.projectId} project={projects.find(p => p._id === rec.projectId)} />
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <h2 className="text-xl font-semibold">AI Buddy Recommendations</h2>
            </div>
            <div className="space-y-4">
              {recommendations.userRecommendations?.slice(0, 2).map((rec: any) => (
                <BuddyCard key={rec.userId} user={{ _id: rec.userId, name: 'User', skills: [] }} />
              ))}
            </div>
          </Card>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/dashboard/projects/new">
          <Card hover className="p-6 text-center">
            <div className="bg-blue-500 w-12 h-12 rounded-lg flex items-center justify-center text-white mx-auto mb-3">
              <Rocket className="h-6 w-6" />
            </div>
            <h3 className="font-semibold mb-2">Start New Project</h3>
            <p className="text-gray-600 text-sm">Share your idea and find teammates</p>
          </Card>
        </Link>

        <Link href="/dashboard/discover">
          <Card hover className="p-6 text-center">
            <div className="bg-purple-500 w-12 h-12 rounded-lg flex items-center justify-center text-white mx-auto mb-3">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-semibold mb-2">Find Buddies</h3>
            <p className="text-gray-600 text-sm">Discover students to collaborate with</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
