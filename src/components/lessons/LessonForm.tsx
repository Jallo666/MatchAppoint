import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Search } from 'lucide-react';
import type { Lesson, LessonStudent, LessonStatus } from '../../types';
import { useStudentsStore } from '../../store/studentsStore';
import { useLessonsStore } from '../../store/lessonsStore';
import { useAuthStore } from '../../store/authStore';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { LevelBadge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { NoteSection } from './NoteSection';
import dayjs from '../../lib/dayjs';

interface Props {
  lesson?: Lesson;
  defaultDate?: string;
}

export function LessonForm({ lesson, defaultDate }: Props) {
  const navigate = useNavigate();
  const instructor = useAuthStore((s) => s.currentInstructor)!;
  const { students } = useStudentsStore();
  const { addLesson, updateLesson } = useLessonsStore();

  const [date, setDate] = useState(lesson?.date ?? defaultDate ?? dayjs().format('YYYY-MM-DD'));
  const [startTime, setStartTime] = useState(lesson?.startTime ?? '09:00');
  const [endTime, setEndTime] = useState(lesson?.endTime ?? '10:00');
  const [status, setStatus] = useState<LessonStatus>(lesson?.status ?? 'scheduled');
  const [globalNotesBefore, setGlobalNotesBefore] = useState(lesson?.globalNotesBefore ?? '');
  const [globalNotesAfter, setGlobalNotesAfter] = useState(lesson?.globalNotesAfter ?? '');
  const [lessonStudents, setLessonStudents] = useState<LessonStudent[]>(
    lesson?.students ?? []
  );
  const [studentSearch, setStudentSearch] = useState('');
  const [showStudentPicker, setShowStudentPicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEdit = !!lesson;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!date) e.date = 'Campo obbligatorio';
    if (!startTime) e.startTime = 'Campo obbligatorio';
    if (!endTime) e.endTime = 'Campo obbligatorio';
    if (startTime && endTime && startTime >= endTime) e.endTime = "L'orario di fine deve essere dopo l'inizio";
    if (lessonStudents.length === 0) e.students = 'Aggiungi almeno un allievo';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const payload = {
      instructorId: instructor.id,
      date,
      startTime,
      endTime,
      status,
      students: lessonStudents,
      globalNotesBefore,
      globalNotesAfter,
    };

    if (isEdit) {
      updateLesson(lesson.id, payload);
    } else {
      addLesson(payload);
    }
    navigate('/calendar');
  };

  const addStudent = (studentId: string) => {
    if (lessonStudents.find((s) => s.studentId === studentId)) return;
    setLessonStudents((prev) => [...prev, { studentId, notesBefore: '', notesAfter: '' }]);
    setErrors((e) => ({ ...e, students: '' }));
  };

  const removeStudent = (studentId: string) => {
    setLessonStudents((prev) => prev.filter((s) => s.studentId !== studentId));
  };

  const updateStudentNote = (studentId: string, field: 'notesBefore' | 'notesAfter', val: string) => {
    setLessonStudents((prev) =>
      prev.map((s) => s.studentId === studentId ? { ...s, [field]: val } : s)
    );
  };

  const filteredStudents = students.filter((s) => {
    const q = studentSearch.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.surname.toLowerCase().includes(q)
    );
  });

  const getStudent = (id: string) => students.find((s) => s.id === id);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-4">
      {/* Date & time */}
      <div className="flex flex-col gap-3">
        <Input
          label="Data"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          error={errors.date}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Inizio"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            error={errors.startTime}
          />
          <Input
            label="Fine"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            error={errors.endTime}
          />
        </div>
      </div>

      {/* Status */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Stato</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as LessonStatus)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-court-green focus:ring-2 focus:ring-green-100"
        >
          <option value="scheduled">Programmata</option>
          <option value="completed">Completata</option>
          <option value="cancelled">Annullata</option>
        </select>
      </div>

      {/* Students */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Allievi</label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowStudentPicker(true)}
          >
            <Plus size={14} />
            Aggiungi
          </Button>
        </div>

        {errors.students && <p className="text-xs text-red-500">{errors.students}</p>}

        {lessonStudents.length === 0 && (
          <p className="text-sm text-gray-400 py-2 text-center border border-dashed border-gray-200 rounded-lg">
            Nessun allievo selezionato
          </p>
        )}

        <div className="flex flex-col gap-2">
          {lessonStudents.map((ls) => {
            const stu = getStudent(ls.studentId);
            return (
              <div key={ls.studentId} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-court-green text-white text-xs font-bold flex items-center justify-center">
                      {stu ? `${stu.name[0]}${stu.surname[0]}` : '?'}
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {stu ? `${stu.name} ${stu.surname}` : '[Allievo rimosso]'}
                    </span>
                    {stu && <LevelBadge level={stu.level} />}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeStudent(ls.studentId)}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <X size={14} className="text-gray-400" />
                  </button>
                </div>
                <div className="p-3">
                  <NoteSection
                    notesBefore={ls.notesBefore}
                    notesAfter={ls.notesAfter}
                    onChangeBefore={(v) => updateStudentNote(ls.studentId, 'notesBefore', v)}
                    onChangeAfter={(v) => updateStudentNote(ls.studentId, 'notesAfter', v)}
                    collapsible
                    title="Note per questo allievo"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Global notes */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Note lezione</label>
        <NoteSection
          notesBefore={globalNotesBefore}
          notesAfter={globalNotesAfter}
          onChangeBefore={setGlobalNotesBefore}
          onChangeAfter={setGlobalNotesAfter}
        />
      </div>

      {/* Submit */}
      <Button type="submit" size="lg" className="w-full">
        {isEdit ? 'Salva modifiche' : 'Crea lezione'}
      </Button>

      {/* Student picker modal */}
      <Modal
        isOpen={showStudentPicker}
        onClose={() => { setShowStudentPicker(false); setStudentSearch(''); }}
        title="Seleziona allievo"
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Cerca per nome..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="flex-1 text-sm outline-none"
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
            {filteredStudents.map((stu) => {
              const already = lessonStudents.some((ls) => ls.studentId === stu.id);
              return (
                <button
                  key={stu.id}
                  type="button"
                  onClick={() => { addStudent(stu.id); }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left
                    ${already ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 active:bg-gray-100'}`}
                  disabled={already}
                >
                  <div className="w-8 h-8 rounded-full bg-court-green text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {stu.name[0]}{stu.surname[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{stu.name} {stu.surname}</p>
                  </div>
                  <LevelBadge level={stu.level} />
                  {already && <span className="text-xs text-gray-400">già aggiunto</span>}
                </button>
              );
            })}
            {filteredStudents.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">Nessun risultato</p>
            )}
          </div>
        </div>
      </Modal>
    </form>
  );
}
