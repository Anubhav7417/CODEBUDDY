import { RegisterForm } from '../../../components/AuthForms';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Join CollabSync</h2>
        <p className="text-gray-600">Create your account to get started</p>
      </div>
      <RegisterForm />
    </div>
  );
}
