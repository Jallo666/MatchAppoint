import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Inserisci email e password');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const ok = login(email.trim(), password);
      if (ok) {
        navigate('/calendar');
      } else {
        setError('Email o password non corretti');
        setLoading(false);
      }
    }, 400);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Email"
        type="email"
        placeholder="istruttore@matchappoint.it"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />
      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}
      <Button type="submit" size="lg" loading={loading} className="w-full mt-2">
        Accedi
      </Button>
    </form>
  );
}
