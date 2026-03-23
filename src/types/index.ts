export type StudentLevel = 'principiante' | 'intermedio' | 'avanzato';
export type LessonStatus = 'scheduled' | 'completed' | 'cancelled';

export interface Instructor {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
}

export interface Student {
  id: string;
  name: string;
  surname: string;
  birthDate: string;
  phone: string;
  email: string;
  level: StudentLevel;
  status: string;
  createdAt: string;
}

export interface LessonStudent {
  studentId: string;
  notesBefore: string;
  notesAfter: string;
}

export interface Lesson {
  id: string;
  instructorId: string;
  date: string;
  startTime: string;
  endTime: string;
  students: LessonStudent[];
  globalNotesBefore: string;
  globalNotesAfter: string;
  status: LessonStatus;
}
