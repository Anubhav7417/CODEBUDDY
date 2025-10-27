'use client';

import React from 'react';
import { Card, Button } from './UI';
import Link from 'next/link';

export function ProjectCard({ project, onApply }: any) {
  return (
    <Card hover className="p-4">
      <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
      <p className="text-gray-600 text-sm mb-3">{project.description}</p>
      <div className="flex flex-wrap gap-1 mb-3">
        {project.techStack.map((tech: string) => (
          <span key={tech} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {tech}
          </span>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{project.university}</span>
        <Button onClick={() => onApply(project._id)} size="sm">
          Apply
        </Button>
      </div>
    </Card>
  );
}

export function BuddyCard({ user, onConnect }: any) {
  return (
    <Card hover className="p-4">
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
          {user.name.charAt(0)}
        </div>
        <div>
          <h3 className="font-semibold">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.university}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1 mb-3">
        {user.skills.slice(0, 4).map((skill: string) => (
          <span key={skill} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
            {skill}
          </span>
        ))}
      </div>
      <Button onClick={() => onConnect(user._id)} className="w-full" size="sm">
        Connect
      </Button>
    </Card>
  );
}
