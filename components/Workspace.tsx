'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context';
import { Card, Button } from './UI';
import { Send, Paperclip, Code } from 'lucide-react';

export function Chat({ projectId }: { projectId: string }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:3001');
    setSocket(newSocket);

    newSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);
    };

    fetch(`/api/chat?projectId=${projectId}`)
      .then(res => res.json())
      .then(setMessages);

    return () => newSocket.close();
  }, [projectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !user || !socket) return;

    const messageData = {
      projectId,
      userId: user._id,
      content: newMessage,
      type: 'text'
    };

    socket.send(JSON.stringify(messageData));
    setNewMessage('');
  };

  return (
    <Card className="h-96 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div key={message._id} className="flex space-x-3">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-semibold text-sm">
                  {message.userId === user?._id ? 'You' : 'User'}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-gray-700 text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-3">
        <div className="flex space-x-2">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Button onClick={sendMessage} className="flex items-center space-x-1">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function TaskBoard({ projectId }: { projectId: string }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    // In a real app, fetch tasks from API
    setTasks([
      { _id: '1', title: 'Setup project structure', status: 'done' },
      { _id: '2', title: 'Design database schema', status: 'in-progress' },
      { _id: '3', title: 'Implement authentication', status: 'todo' },
    ]);
  }, [projectId]);

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, {
      _id: Date.now().toString(),
      title: newTask,
      status: 'todo'
    }]);
    setNewTask('');
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Project Tasks</h3>
      <div className="space-y-2 mb-4">
        {tasks.map(task => (
          <div key={task._id} className="flex items-center space-x-3 p-2 border rounded-lg">
            <div className={`w-3 h-3 rounded-full ${
              task.status === 'done' ? 'bg-green-500' : 
              task.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-300'
            }`} />
            <span className="flex-1 text-sm">{task.title}</span>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add new task..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
        <Button onClick={addTask} size="sm">Add</Button>
      </div>
    </Card>
  );
}
