import type { StudentLevel, LessonStatus } from '../../types';

interface LevelBadgeProps {
  level: StudentLevel;
}

const levelConfig: Record<StudentLevel, { label: string; classes: string }> = {
  principiante: { label: 'Principiante', classes: 'bg-blue-100 text-blue-700' },
  intermedio: { label: 'Intermedio', classes: 'bg-orange-100 text-orange-700' },
  avanzato: { label: 'Avanzato', classes: 'bg-green-100 text-green-700' },
};

export function LevelBadge({ level }: LevelBadgeProps) {
  const config = levelConfig[level];
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${config.classes}`}>
      {config.label}
    </span>
  );
}

interface StatusBadgeProps {
  status: LessonStatus;
}

const statusConfig: Record<LessonStatus, { label: string; classes: string }> = {
  scheduled: { label: 'Programmata', classes: 'bg-yellow-100 text-yellow-700' },
  completed: { label: 'Completata', classes: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Annullata', classes: 'bg-red-100 text-red-600' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${config.classes}`}>
      {config.label}
    </span>
  );
}
