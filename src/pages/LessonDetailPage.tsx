import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { LessonForm } from '../components/lessons/LessonForm';
import { useLessonsStore } from '../store/lessonsStore';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';

export default function LessonDetailPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { getLessonById, deleteLesson } = useLessonsStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const lesson = getLessonById(lessonId ?? '');

  if (!lesson) {
    return (
      <AppLayout title="Lezione non trovata">
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <p className="text-gray-400 text-sm">Questa lezione non esiste più.</p>
          <Button onClick={() => navigate('/calendar')}>Torna al calendario</Button>
        </div>
      </AppLayout>
    );
  }

  const handleDelete = () => {
    deleteLesson(lesson.id);
    navigate('/calendar');
  };

  return (
    <AppLayout
      title="Dettaglio lezione"
      leftAction={
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-green-700 transition-colors"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
      }
      rightAction={
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-600 transition-colors"
        >
          <Trash2 size={18} className="text-white" />
        </button>
      }
    >
      <LessonForm lesson={lesson} />

      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Elimina lezione"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            Sei sicuro di voler eliminare questa lezione? L'operazione non può essere annullata.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setShowDeleteConfirm(false)}>
              Annulla
            </Button>
            <Button variant="danger" className="flex-1" onClick={handleDelete}>
              Elimina
            </Button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}
