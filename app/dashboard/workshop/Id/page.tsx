'use client';

import { useParams } from 'next/navigation';
import { Chat, TaskBoard } from '../../../../components/Workspace';

export default function WorkspacePage() {
  const params = useParams();
  const projectId = params.id as string;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Workspace</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Team Chat</h2>
          <Chat projectId={projectId} />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Tasks</h2>
          <TaskBoard projectId={projectId} />
        </div>
      </div>
    </div>
  );
}
