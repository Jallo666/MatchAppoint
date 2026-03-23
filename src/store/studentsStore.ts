import { create } from 'zustand';
import type { Student, StudentLevel } from '../types';
import studentsData from '../data/students.json';

const initialStudents = studentsData as Student[];

interface StudentsState {
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'createdAt'>) => void;
  updateStudent: (id: string, updates: Partial<Omit<Student, 'id'>>) => void;
  deleteStudent: (id: string) => void;
  getStudentById: (id: string) => Student | undefined;
}

export const useStudentsStore = create<StudentsState>((set, get) => ({
  students: initialStudents,

  addStudent: (student) => {
    const newStudent: Student = {
      ...student,
      level: student.level as StudentLevel,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    set((s) => ({ students: [...s.students, newStudent] }));
  },

  updateStudent: (id, updates) => {
    set((s) => ({
      students: s.students.map((stu) =>
        stu.id === id ? { ...stu, ...updates } : stu
      ),
    }));
  },

  deleteStudent: (id) => {
    set((s) => ({ students: s.students.filter((stu) => stu.id !== id) }));
  },

  getStudentById: (id) => get().students.find((stu) => stu.id === id),
}));
