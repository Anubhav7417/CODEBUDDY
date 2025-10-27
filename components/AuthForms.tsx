'use client';

import React, { useState } from 'react';
import { useAuth } from '../context';
import { Button, Input, Card } from './UI';

export function LoginForm() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(formData.email, formData.password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg">{error}</div>}
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e: any) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          placeholder="your@university.edu"
        />
        <Input
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e: any) => setFormData(prev => ({ ...prev, password: e.target.value }))}
          placeholder="Enter your password"
        />
        <Button type="submit" loading={loading} className="w-full">
          Sign In
        </Button>
      </form>
    </Card>
  );
}

export function RegisterForm() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '', password: '', name: '', university: '', branch: '', year: 2024
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(formData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg">{error}</div>}
        <Input
          label="Full Name"
          value={formData.name}
          onChange={(e: any) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter your full name"
        />
        <Input
          label="University Email"
          type="email"
          value={formData.email}
          onChange={(e: any) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          placeholder="your@university.edu"
        />
        <Input
          label="University"
          value={formData.university}
          onChange={(e: any) => setFormData(prev => ({ ...prev, university: e.target.value }))}
          placeholder="Your university name"
        />
        <Input
          label="Branch"
          value={formData.branch}
          onChange={(e: any) => setFormData(prev => ({ ...prev, branch: e.target.value }))}
          placeholder="Computer Science"
        />
        <Input
          label="Graduation Year"
          type="number"
          value={formData.year}
          onChange={(e: any) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
        />
        <Input
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e: any) => setFormData(prev => ({ ...prev, password: e.target.value }))}
          placeholder="Create a password"
        />
        <Button type="submit" loading={loading} className="w-full">
          Create Account
        </Button>
      </form>
    </Card>
  );
}
