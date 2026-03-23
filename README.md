# 🎾 MatchAppoint

Gestione appuntamenti e lezioni di tennis per istruttori.

## Descrizione

MatchAppoint è una web app mobile-first pensata per istruttori di tennis che vogliono organizzare le proprie lezioni, gestire gli allievi e tenere traccia delle note prima e dopo ogni sessione.

```
┌─────────────────────────┐
│  🎾 MatchAppoint        │  ← Header verde (court green)
├─────────────────────────┤
│                         │
│   Vista Calendario      │  ← Contenuto principale scrollabile
│   (mensile o           │
│    settimanale)         │
│                         │
├─────────────────────────┤
│  📅 Allievi  👤 Profilo │  ← Bottom dock fisso
└─────────────────────────┘
```

## Funzionalità

- **Login mockato** — selezione istruttore tramite email/password
- **Calendario** — vista mensile (con dot indicator) e settimanale (con blocchi orari)
- **Lezioni CRUD** — crea, modifica, elimina lezioni con orario, allievi e note
- **Note lezione** — note PRIMA e DOPO la lezione, sia globali che per singolo allievo
- **Allievi CRUD** — pool globale condiviso tra istruttori, ricerca e filtro per livello
- **Stato allievo** — nota condivisa tra tutti gli istruttori per ogni allievo
- **Storico lezioni** — cronologia completa delle lezioni per ogni allievo

## Avvio rapido

```bash
npm install
npm run dev
```

L'app si avvia su `http://localhost:5173`

## Account demo

| Nome | Email | Password |
|------|-------|----------|
| Marco Ferretti | marco@matchappoint.it | tennis123 |
| Laura Bianchi | laura@matchappoint.it | tennis123 |
| Stefano Conti | stefano@matchappoint.it | tennis123 |

## Struttura progetto

```
src/
├── AppRoutes.tsx          # Routes + AuthGuard
├── main.tsx               # Entry point
├── style.css              # Tailwind v4 + tema tennis
├── lib/
│   └── dayjs.ts           # dayjs con locale italiano
├── types/
│   └── index.ts           # Interfacce TypeScript
├── data/
│   ├── instructors.json   # 3 istruttori mock
│   ├── students.json      # 12 studenti mock
│   └── lessons.json       # 25+ lezioni su marzo 2026
├── store/
│   ├── authStore.ts       # Login/logout (Zustand + persist)
│   ├── studentsStore.ts   # CRUD studenti
│   └── lessonsStore.ts    # CRUD lezioni + selectors
├── components/
│   ├── layout/            # AppLayout, BottomNav
│   ├── auth/              # LoginForm
│   ├── calendar/          # CalendarMonthView, CalendarWeekView, LessonCard
│   ├── lessons/           # LessonForm, NoteSection
│   ├── students/          # StudentCard, StudentForm, StudentLessonHistory
│   └── ui/                # Button, Input, Badge, Modal
└── pages/
    ├── LoginPage.tsx
    ├── CalendarPage.tsx
    ├── LessonDetailPage.tsx
    ├── NewLessonPage.tsx
    ├── StudentsPage.tsx
    ├── StudentDetailPage.tsx
    └── ProfilePage.tsx
```

## Modelli dati principali

```typescript
Instructor { id, name, email, password, avatar }

Student { id, name, surname, birthDate, phone, email, level, status, createdAt }
//        level: 'principiante' | 'intermedio' | 'avanzato'
//        status: nota condivisa tra istruttori

Lesson { id, instructorId, date, startTime, endTime, students[], globalNotesBefore, globalNotesAfter, status }
//      status: 'scheduled' | 'completed' | 'cancelled'
//      students[]: [{ studentId, notesBefore, notesAfter }]
```

## Integrazione backend futura

I dati sono interamente gestiti da store Zustand inizializzati da file JSON.
Per collegare un backend reale è sufficiente:

1. **Sostituire l'import JSON** con una chiamata API in ogni store:
   ```typescript
   // Prima (mock):
   import lessonsData from '../data/lessons.json';
   const initialLessons = lessonsData as Lesson[];

   // Dopo (API):
   const initialLessons = await fetch('/api/lessons').then(r => r.json());
   ```

2. **Aggiungere side effects** alle azioni CRUD per sincronizzare con il server:
   ```typescript
   addLesson: async (lesson) => {
     const saved = await api.post('/lessons', lesson);
     set((s) => ({ lessons: [...s.lessons, saved] }));
   }
   ```

3. **Sostituire `authStore`** con una vera implementazione JWT/OAuth.

## Tech stack

| Libreria | Versione | Uso |
|----------|----------|-----|
| React | 19 | UI |
| Vite | 8 | Build tool |
| TypeScript | 5.9 | Type safety |
| Tailwind CSS | 4 | Styling |
| React Router | 7 | Navigazione |
| Zustand | 5 | State management |
| dayjs | 1.11 | Date/time |
| Lucide React | latest | Icone |
