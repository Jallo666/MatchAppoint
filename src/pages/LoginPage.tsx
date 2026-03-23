import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LoginForm } from '../components/auth/LoginForm';

export default function LoginPage() {
  const currentInstructor = useAuthStore((s) => s.currentInstructor);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentInstructor) navigate('/calendar', { replace: true });
  }, [currentInstructor, navigate]);

  return (
    <div className="min-h-svh bg-court-green flex flex-col items-center justify-center px-6">
      {/* Logo area */}
      <div className="mb-8 text-center">
        <div className="w-20 h-20 rounded-full bg-tennis-yellow flex items-center justify-center text-4xl mb-4 mx-auto shadow-lg">
          🎾
        </div>
        <h1 className="text-white text-3xl font-bold tracking-wide">MatchAppoint</h1>
        <p className="text-green-200 text-sm mt-1">Gestione lezioni di tennis</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-gray-800 text-xl font-semibold mb-5 text-center">Accedi al tuo account</h2>
        <LoginForm />

        {/* Demo hint */}
        <div className="mt-5 p-3 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-xs text-gray-500 font-medium mb-1">Account demo:</p>
          <p className="text-xs text-gray-600">marco@matchappoint.it</p>
          <p className="text-xs text-gray-600">laura@matchappoint.it</p>
          <p className="text-xs text-gray-500 mt-1">Password: <span className="font-mono">tennis123</span></p>
        </div>
      </div>
    </div>
  );
}
