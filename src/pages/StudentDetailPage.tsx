import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Pencil, Trash2 } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { StudentLessonHistory } from '../components/students/StudentLessonHistory';
import { StudentForm } from '../components/students/StudentForm';
import { LevelBadge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Input';
import { useStudentsStore } from '../store/studentsStore';
import { useLessonsStore } from '../store/lessonsStore';
import dayjs from '../lib/dayjs';

export default function StudentDetailPage() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { getStudentById, updateStudent, deleteStudent } = useStudentsStore();
  const { getLessonsByStudent } = useLessonsStore();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [statusDraft, setStatusDraft] = useState<string | null>(null);

  const student = getStudentById(studentId ?? '');

  if (!student) {
    return (
      <AppLayout title="Allievo non trovato">
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <p className="text-gray-400 text-sm">Questo allievo non esiste più.</p>
          <Button onClick={() => navigate('/students')}>Torna agli allievi</Button>
        </div>
      </AppLayout>
    );
  }

  const lessons = getLessonsByStudent(student.id);
  const handleStatusBlur = () => {
    if (statusDraft !== null && statusDraft !== student.status) {
      updateStudent(student.id, { status: statusDraft });
    }
    setStatusDraft(null);
  };

  const handleDelete = () => {
    deleteStudent(student.id);
    navigate('/students');
  };

  return (
    <AppLayout
      title={`${student.name} ${student.surname}`}
      leftAction={
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-green-700 transition-colors"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
      }
      rightAction={
        <div className="flex gap-1">
          <button
            onClick={() => setShowEditModal(true)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-green-700 transition-colors"
          >
            <Pencil size={16} className="text-white" />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-600 transition-colors"
          >
            <Trash2 size={16} className="text-white" />
          </button>
        </div>
      }
    >
      {/* Profile header */}
      <div className="px-4 py-5 flex flex-col items-center gap-3 border-b border-gray-100">
        <div className="w-20 h-20 rounded-full bg-court-green text-white text-2xl font-bold flex items-center justify-center shadow-md">
          {student.name[0]}{student.surname[0]}
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">{student.name} {student.surname}</h2>
          {student.birthDate && (
            <p className="text-xs text-gray-400 mt-0.5">
              Nato/a il {dayjs(student.birthDate).format('D MMMM YYYY')}
            </p>
          )}
          <div className="mt-2">
            <LevelBadge level={student.level} />
          </div>
        </div>
        <div className="flex flex-col gap-1 w-full max-w-xs">
          {student.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone size={14} className="text-gray-400" />
              <span>{student.phone}</span>
            </div>
          )}
          {student.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail size={14} className="text-gray-400" />
              <span className="truncate">{student.email}</span>
            </div>
          )}
        </div>
      </div>

      {/* Shared status note */}
      <div className="px-4 py-4 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Stato condiviso tra istruttori
        </p>
        <Textarea
          placeholder="Aggiungi note condivise sullo studente..."
          value={statusDraft ?? student.status}
          onChange={(e) => setStatusDraft(e.target.value)}
          onBlur={handleStatusBlur}
          rows={3}
        />
        <p className="text-[10px] text-gray-400 mt-1">Salvato automaticamente</p>
      </div>

      {/* Lesson history */}
      <div className="px-4 py-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Storico lezioni ({lessons.length})
        </p>
        <StudentLessonHistory lessons={lessons} studentId={student.id} />
      </div>

      {/* Edit modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Modifica allievo">
        <StudentForm student={student} onClose={() => setShowEditModal(false)} />
      </Modal>

      {/* Delete confirm */}
      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Elimina allievo">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            Sei sicuro di voler eliminare <strong>{student.name} {student.surname}</strong>? Le lezioni associate non saranno eliminate.
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
