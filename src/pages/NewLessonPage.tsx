import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { LessonForm } from '../components/lessons/LessonForm';

export default function NewLessonPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultDate = searchParams.get('date') ?? undefined;

  return (
    <AppLayout
      title="Nuova lezione"
      leftAction={
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-green-700 transition-colors"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
      }
    >
      <LessonForm defaultDate={defaultDate} />
    </AppLayout>
  );
}
