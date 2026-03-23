import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import type { Lesson } from '../../types';
import { StatusBadge } from '../ui/Badge';
import dayjs from '../../lib/dayjs';

interface Props {
  lessons: Lesson[];
  studentId: string;
}

export function StudentLessonHistory({ lessons, studentId }: Props) {
  const navigate = useNavigate();

  if (lessons.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-400 text-sm">Nessuna lezione registrata</p>
      </div>
    );
  }

  const sorted = [...lessons].sort((a, b) => (b.date > a.date ? 1 : -1));

  return (
    <div className="flex flex-col gap-3">
      {sorted.map((lesson) => {
        const studentData = lesson.students.find((s) => s.studentId === studentId);

        return (
          <div
            key={lesson.id}
            className="border border-gray-100 rounded-xl overflow-hidden cursor-pointer active:bg-gray-50 transition-colors"
            onClick={() => navigate(`/calendar/lesson/${lesson.id}`)}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2.5 bg-gray-50 border-b border-gray-100">
              <div>
                <p className="text-sm font-semibold text-gray-800 capitalize">
                  {dayjs(lesson.date).format('dddd D MMMM YYYY')}
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                  <Clock size={11} />
                  <span>{lesson.startTime} – {lesson.endTime}</span>
                </div>
              </div>
              <StatusBadge status={lesson.status} />
            </div>

            {/* Notes */}
            <div className="px-3 py-2.5 flex flex-col gap-2">
              {lesson.globalNotesBefore && (
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Note lezione — Prima</p>
                  <p className="text-xs text-gray-600">{lesson.globalNotesBefore}</p>
                </div>
              )}
              {lesson.globalNotesAfter && (
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Note lezione — Dopo</p>
                  <p className="text-xs text-gray-600">{lesson.globalNotesAfter}</p>
                </div>
              )}
              {studentData?.notesBefore && (
                <div>
                  <p className="text-[10px] font-semibold text-court-green uppercase tracking-wide mb-0.5">Note personali — Prima</p>
                  <p className="text-xs text-gray-600">{studentData.notesBefore}</p>
                </div>
              )}
              {studentData?.notesAfter && (
                <div>
                  <p className="text-[10px] font-semibold text-court-green uppercase tracking-wide mb-0.5">Note personali — Dopo</p>
                  <p className="text-xs text-gray-600">{studentData.notesAfter}</p>
                </div>
              )}
              {!lesson.globalNotesBefore && !lesson.globalNotesAfter && !studentData?.notesBefore && !studentData?.notesAfter && (
                <p className="text-xs text-gray-300 italic">Nessuna nota per questa lezione</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
