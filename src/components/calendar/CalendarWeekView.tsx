import { useNavigate } from 'react-router-dom';
import type { Lesson } from '../../types';
import dayjs from '../../lib/dayjs';

interface Props {
  currentDate: ReturnType<typeof dayjs>;
  lessonsByDate: Record<string, Lesson[]>;
}

const HOUR_HEIGHT = 56; // px per hour
const DAY_START = 7;
const DAY_END = 21;
const TOTAL_HOURS = DAY_END - DAY_START;

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function getTopOffset(startTime: string): number {
  const minutes = timeToMinutes(startTime) - DAY_START * 60;
  return (minutes / 60) * HOUR_HEIGHT;
}

function getBlockHeight(startTime: string, endTime: string): number {
  const duration = timeToMinutes(endTime) - timeToMinutes(startTime);
  return Math.max((duration / 60) * HOUR_HEIGHT, 20);
}

const statusColors: Record<string, string> = {
  scheduled: 'bg-court-green text-white',
  completed: 'bg-gray-400 text-white',
  cancelled: 'bg-red-300 text-white',
};

export function CalendarWeekView({ currentDate, lessonsByDate }: Props) {
  const navigate = useNavigate();

  // Build Mon-Sun for current week
  const weekStart = currentDate.startOf('week'); // dayjs locale 'it' starts Mon
  const days = Array.from({ length: 7 }, (_, i) => weekStart.add(i, 'day'));
  const today = dayjs().format('YYYY-MM-DD');

  const hours = Array.from({ length: TOTAL_HOURS }, (_, i) => DAY_START + i);

  return (
    <div className="flex overflow-x-auto">
      {/* Time labels column */}
      <div className="flex-shrink-0 w-12">
        {/* Header spacer */}
        <div className="h-10 border-b border-gray-100" />
        {/* Hour labels */}
        <div className="relative" style={{ height: TOTAL_HOURS * HOUR_HEIGHT }}>
          {hours.map((h) => (
            <div
              key={h}
              className="absolute right-1 text-[10px] text-gray-400 leading-none"
              style={{ top: (h - DAY_START) * HOUR_HEIGHT - 5 }}
            >
              {String(h).padStart(2, '0')}:00
            </div>
          ))}
        </div>
      </div>

      {/* Day columns */}
      {days.map((day) => {
        const dateStr = day.format('YYYY-MM-DD');
        const isToday = dateStr === today;
        const dayLessons = lessonsByDate[dateStr] ?? [];

        return (
          <div key={dateStr} className="flex-1 min-w-[44px] border-l border-gray-100">
            {/* Day header */}
            <div className={`h-10 flex flex-col items-center justify-center border-b border-gray-100 ${isToday ? 'bg-tennis-yellow-light' : ''}`}>
              <span className="text-[9px] text-gray-400 uppercase">{day.format('ddd')}</span>
              <span className={`text-xs font-semibold ${isToday ? 'text-court-green-dark' : 'text-gray-700'}`}>
                {day.date()}
              </span>
            </div>

            {/* Time grid */}
            <div className="relative" style={{ height: TOTAL_HOURS * HOUR_HEIGHT }}>
              {/* Hour lines */}
              {hours.map((h) => (
                <div
                  key={h}
                  className="absolute inset-x-0 border-t border-gray-50"
                  style={{ top: (h - DAY_START) * HOUR_HEIGHT }}
                />
              ))}

              {/* Lesson blocks */}
              {dayLessons.map((lesson, idx) => {
                // Simple collision: if overlaps with previous, offset right
                const prevOverlaps = dayLessons.slice(0, idx).some((prev) => {
                  const prevEnd = timeToMinutes(prev.endTime);
                  const currStart = timeToMinutes(lesson.startTime);
                  return prevEnd > currStart;
                });

                return (
                  <div
                    key={lesson.id}
                    className={`absolute rounded-sm cursor-pointer overflow-hidden px-1 py-0.5 ${statusColors[lesson.status]}`}
                    style={{
                      top: getTopOffset(lesson.startTime),
                      height: getBlockHeight(lesson.startTime, lesson.endTime),
                      left: prevOverlaps ? '50%' : '1px',
                      right: prevOverlaps ? '1px' : '50%',
                      minWidth: 0,
                    }}
                    onClick={() => navigate(`/calendar/lesson/${lesson.id}`)}
                  >
                    <p className="text-[9px] font-semibold leading-tight truncate">{lesson.startTime}</p>
                    <p className="text-[9px] leading-tight truncate opacity-90">{lesson.students.length}👤</p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
