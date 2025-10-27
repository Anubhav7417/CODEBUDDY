'use client';

import { useState, useEffect } from 'react';
import { BuddyCard } from '../../../components/Dashboard';

export default function DiscoverPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setUsers([
      { _id: '1', name: 'Alex Chen', university: 'Stanford', skills: ['React', 'Node.js', 'Python'] },
      { _id: '2', name: 'Sarah Kim', university: 'MIT', skills: ['ML', 'Python', 'TensorFlow'] },
      { _id: '3', name: 'Mike Johnson', university: 'Harvard', skills: ['Java', 'Spring', 'AWS'] },
    ]);
  }, []);

  const handleConnect = (userId: string) => {
    console.log('Connecting with user:', userId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Discover Buddies</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <BuddyCard key={user._id} user={user} onConnect={handleConnect} />
        ))}
      </div>
    </div>
  );
}
