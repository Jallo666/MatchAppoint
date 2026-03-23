import { useNavigate } from 'react-router-dom';
import { Clock, Users } from 'lucide-react';
import type { Lesson } from '../../types';
import { StatusBadge } from '../ui/Badge';

interface Props {
  lesson: Lesson;
  compact?: boolean;
}

const statusColors: Record<string, string> = {
  scheduled: 'bg-court-green',
  completed: 'bg-gray-500',
  cancelled: 'bg-red-400',
};

export function LessonCard({ lesson, compact = false }: Props) {
  const navigate = useNavigate();

  if (compact) {
    return (
      <div
        className={`absolute inset-x-0.5 rounded-md px-1.5 py-0.5 cursor-pointer text-white overflow-hidden ${statusColors[lesson.status]}`}
        onClick={() => navigate(`/calendar/lesson/${lesson.id}`)}
      >
        <p className="text-[10px] font-semibold leading-tight truncate">
          {lesson.startTime}
        </p>
        <p className="text-[10px] leading-tight truncate opacity-90">
          {lesson.students.length} all.
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-white active:bg-gray-50 cursor-pointer transition-colors"
      onClick={() => navigate(`/calendar/lesson/${lesson.id}`)}
    >
      <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${statusColors[lesson.status]}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock size={12} />
            <span>{lesson.startTime} – {lesson.endTime}</span>
          </div>
          <StatusBadge status={lesson.status} />
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <Users size={12} />
          <span>{lesson.students.length} {lesson.students.length === 1 ? 'allievo' : 'allievi'}</span>
        </div>
        {lesson.globalNotesBefore && (
          <p className="text-xs text-gray-400 mt-1 truncate">{lesson.globalNotesBefore}</p>
        )}
      </div>
    </div>
  );
}
