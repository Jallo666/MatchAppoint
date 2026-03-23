import { useNavigate } from 'react-router-dom';
import { LogOut, Mail } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { currentInstructor, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!currentInstructor) return null;

  return (
    <AppLayout title="Profilo">
      {/* Avatar section */}
      <div className="flex flex-col items-center gap-3 px-4 pt-8 pb-6 border-b border-gray-100">
        <div className="w-24 h-24 rounded-full bg-court-green text-white text-3xl font-bold flex items-center justify-center shadow-lg">
          {currentInstructor.avatar}
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">{currentInstructor.name}</h2>
          <div className="flex items-center justify-center gap-1.5 mt-1 text-sm text-gray-500">
            <Mail size={14} />
            <span>{currentInstructor.email}</span>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-court-green text-white text-xs font-medium">
          Istruttore
        </span>
      </div>

      {/* Info card */}
      <div className="px-4 py-5">
        <div className="bg-tennis-yellow-light border border-tennis-yellow rounded-xl p-4 mb-6">
          <p className="text-sm font-medium text-gray-700 mb-1">🎾 MatchAppoint</p>
          <p className="text-xs text-gray-600">
            Gestisci i tuoi allievi e organizza le lezioni di tennis in modo semplice.
            I dati sono condivisi tra tutti gli istruttori del circolo.
          </p>
        </div>

        <Button
          variant="danger"
          size="lg"
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Esci dall'account
        </Button>
      </div>
    </AppLayout>
  );
}
