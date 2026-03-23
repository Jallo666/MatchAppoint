import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import type { Lesson } from '../../types';
import dayjs from '../../lib/dayjs';
import { LessonCard } from './LessonCard';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface Props {
  currentDate: ReturnType<typeof dayjs>;
  lessonsByDate: Record<string, Lesson[]>;
}

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

export function CalendarMonthView({ currentDate, lessonsByDate }: Props) {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const today = dayjs().format('YYYY-MM-DD');

  const startOfMonth = currentDate.startOf('month');
  const daysInMonth = currentDate.daysInMonth();

  // Monday-first: dayjs day() returns 0=Sun, so we shift
  const firstDayOfWeek = startOfMonth.day(); // 0=Sun,1=Mon,...
  const paddingDays = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  const cells: Array<{ date: string; isCurrentMonth: boolean }> = [];

  // Padding from prev month
  for (let i = paddingDays - 1; i >= 0; i--) {
    cells.push({
      date: startOfMonth.subtract(i + 1, 'day').format('YYYY-MM-DD'),
      isCurrentMonth: false,
    });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      date: currentDate.date(d).format('YYYY-MM-DD'),
      isCurrentMonth: true,
    });
  }

  // Pad to complete last week
  const remaining = cells.length % 7 === 0 ? 0 : 7 - (cells.length % 7);
  for (let i = 1; i <= remaining; i++) {
    cells.push({
      date: currentDate.endOf('month').add(i, 'day').format('YYYY-MM-DD'),
      isCurrentMonth: false,
    });
  }

  const selectedLessons = selectedDate ? (lessonsByDate[selectedDate] ?? []) : [];

  return (
    <>
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-gray-100">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-2 text-center text-xs font-medium text-gray-400">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7">
        {cells.map(({ date, isCurrentMonth }) => {
          const lessons = lessonsByDate[date] ?? [];
          const isToday = date === today;
          const dotsToShow = lessons.slice(0, 3);
          const extra = lessons.length - 3;

          return (
            <button
              key={date}
              onClick={() => { if (isCurrentMonth) setSelectedDate(date); }}
              className={`min-h-[52px] p-1 flex flex-col items-center border-b border-r border-gray-50 transition-colors
                ${isCurrentMonth ? 'active:bg-gray-50' : ''}
                ${!isCurrentMonth ? 'opacity-30' : ''}`}
            >
              <span
                className={`w-7 h-7 flex items-center justify-center text-sm font-medium rounded-full mb-0.5
                  ${isToday ? 'bg-tennis-yellow text-gray-900 font-bold' : 'text-gray-700'}`}
              >
                {dayjs(date).date()}
              </span>
              {lessons.length > 0 && (
                <div className="flex gap-0.5 flex-wrap justify-center">
                  {dotsToShow.map((l) => (
                    <span
                      key={l.id}
                      className={`w-1.5 h-1.5 rounded-full ${
                        l.status === 'completed' ? 'bg-gray-400' :
                        l.status === 'cancelled' ? 'bg-red-400' :
                        'bg-court-green'
                      }`}
                    />
                  ))}
                  {extra > 0 && (
                    <span className="text-[8px] text-gray-400">+{extra}</span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Day detail modal */}
      <Modal
        isOpen={selectedDate !== null}
        onClose={() => setSelectedDate(null)}
        title={selectedDate ? dayjs(selectedDate).format('dddd D MMMM') : ''}
      >
        <div className="flex flex-col gap-3">
          {selectedLessons.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Nessuna lezione in questo giorno</p>
          ) : (
            selectedLessons.map((l) => <LessonCard key={l.id} lesson={l} />)
          )}
          <Button
            variant="primary"
            className="w-full mt-2"
            onClick={() => {
              setSelectedDate(null);
              navigate(`/calendar/new?date=${selectedDate}`);
            }}
          >
            <Plus size={16} />
            Nuova lezione
          </Button>
        </div>
      </Modal>
    </>
  );
}
