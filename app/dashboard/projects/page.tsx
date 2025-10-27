'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context';
import { Card, Button } from '../../../components/UI';
import { ProjectCard } from '../../../components/Dashboard';
import Link from 'next/link';

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(setProjects);
  }, []);

  const handleApply = (projectId: string) => {
    // Implement apply logic
    console.log('Applying to project:', projectId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        <Link href="/dashboard/projects/new">
          <Button>New Project</Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <ProjectCard key={project._id} project={project} onApply={handleApply} />
        ))}
      </div>
    </div>
  );
}
