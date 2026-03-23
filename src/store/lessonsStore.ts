import { create } from 'zustand';
import type { Lesson } from '../types';
import lessonsData from '../data/lessons.json';
import dayjs from '../lib/dayjs';

const initialLessons = lessonsData as Lesson[];

interface LessonsState {
  lessons: Lesson[];
  addLesson: (lesson: Omit<Lesson, 'id'>) => void;
  updateLesson: (id: string, updates: Partial<Omit<Lesson, 'id'>>) => void;
  deleteLesson: (id: string) => void;
  getLessonById: (id: string) => Lesson | undefined;
  getLessonsByInstructor: (instructorId: string) => Lesson[];
  getLessonsForDay: (instructorId: string, date: string) => Lesson[];
  getLessonsForWeek: (instructorId: string, weekStart: string) => Lesson[];
  getLessonsByStudent: (studentId: string) => Lesson[];
}

export const useLessonsStore = create<LessonsState>((set, get) => ({
  lessons: initialLessons,

  addLesson: (lesson) => {
    const newLesson: Lesson = { ...lesson, id: crypto.randomUUID() };
    set((s) => ({ lessons: [...s.lessons, newLesson] }));
  },

  updateLesson: (id, updates) => {
    set((s) => ({
      lessons: s.lessons.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    }));
  },

  deleteLesson: (id) => {
    set((s) => ({ lessons: s.lessons.filter((l) => l.id !== id) }));
  },

  getLessonById: (id) => get().lessons.find((l) => l.id === id),

  getLessonsByInstructor: (instructorId) =>
    get().lessons.filter((l) => l.instructorId === instructorId),

  getLessonsForDay: (instructorId, date) =>
    get().lessons.filter(
      (l) => l.instructorId === instructorId && l.date === date
    ),

  getLessonsForWeek: (instructorId, weekStart) => {
    const start = dayjs(weekStart);
    const end = start.add(6, 'day');
    return get().lessons.filter((l) => {
      if (l.instructorId !== instructorId) return false;
      const d = dayjs(l.date);
      return !d.isBefore(start, 'day') && !d.isAfter(end, 'day');
    });
  },

  getLessonsByStudent: (studentId) =>
    get().lessons.filter((l) =>
      l.students.some((s) => s.studentId === studentId)
    ),
}));
