import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { CalendarMonthView } from '../components/calendar/CalendarMonthView';
import { CalendarWeekView } from '../components/calendar/CalendarWeekView';
import { useAuthStore } from '../store/authStore';
import { useLessonsStore } from '../store/lessonsStore';
import dayjs from '../lib/dayjs';
import type { Lesson } from '../types';

type ViewMode = 'month' | 'week';

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(dayjs());
  const navigate = useNavigate();
  const instructor = useAuthStore((s) => s.currentInstructor)!;
  const lessons = useLessonsStore((s) => s.lessons);

  // Pre-compute lessonsByDate for the visible period
  const instructorLessons = lessons.filter((l) => l.instructorId === instructor.id);

  const lessonsByDate = instructorLessons.reduce<Record<string, Lesson[]>>((acc, lesson) => {
    if (!acc[lesson.date]) acc[lesson.date] = [];
    acc[lesson.date].push(lesson);
    return acc;
  }, {});

  const handlePrev = () => {
    setCurrentDate((d) => viewMode === 'month' ? d.subtract(1, 'month') : d.subtract(7, 'day'));
  };

  const handleNext = () => {
    setCurrentDate((d) => viewMode === 'month' ? d.add(1, 'month') : d.add(7, 'day'));
  };

  const periodLabel = viewMode === 'month'
    ? currentDate.format('MMMM YYYY')
    : (() => {
        const start = currentDate.startOf('week');
        const end = start.add(6, 'day');
        return `${start.format('D MMM')} – ${end.format('D MMM YYYY')}`;
      })();

  return (
    <AppLayout
      rightAction={
        <button
          onClick={() => navigate('/calendar/new')}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-tennis-yellow text-gray-900 hover:bg-tennis-yellow-dark transition-colors"
        >
          <Plus size={18} />
        </button>
      }
    >
      {/* Navigation bar */}
      <div className="flex items-center px-4 py-3 border-b border-gray-100">
        <button onClick={handlePrev} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <span className="flex-1 text-center text-sm font-semibold text-gray-800 capitalize">
          {periodLabel}
        </span>
        <button onClick={handleNext} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
          <ChevronRight size={20} className="text-gray-600" />
        </button>
      </div>

      {/* View toggle */}
      <div className="flex gap-1 px-4 py-2 border-b border-gray-100">
        <button
          onClick={() => setViewMode('month')}
          className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            viewMode === 'month' ? 'bg-court-green text-white' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          Mensile
        </button>
        <button
          onClick={() => setViewMode('week')}
          className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            viewMode === 'week' ? 'bg-court-green text-white' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          Settimanale
        </button>
      </div>

      {/* Calendar view */}
      <div className={viewMode === 'week' ? 'overflow-x-auto' : ''}>
        {viewMode === 'month' ? (
          <CalendarMonthView currentDate={currentDate} lessonsByDate={lessonsByDate} />
        ) : (
          <CalendarWeekView currentDate={currentDate} lessonsByDate={lessonsByDate} />
        )}
      </div>
    </AppLayout>
  );
}
