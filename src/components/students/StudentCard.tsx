import { useNavigate } from 'react-router-dom';
import { Phone } from 'lucide-react';
import type { Student } from '../../types';
import { LevelBadge } from '../ui/Badge';

interface Props {
  student: Student;
}

export function StudentCard({ student }: Props) {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-100 active:bg-gray-50 cursor-pointer transition-colors"
      onClick={() => navigate(`/students/${student.id}`)}
    >
      {/* Avatar */}
      <div className="w-11 h-11 rounded-full bg-court-green text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
        {student.name[0]}{student.surname[0]}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-900">
            {student.name} {student.surname}
          </span>
          <LevelBadge level={student.level} />
        </div>
        {student.phone && (
          <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-400">
            <Phone size={11} />
            <span>{student.phone}</span>
          </div>
        )}
        {student.status && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{student.status}</p>
        )}
      </div>
    </div>
  );
}
