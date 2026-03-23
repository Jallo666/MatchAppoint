import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { StudentCard } from '../components/students/StudentCard';
import { StudentForm } from '../components/students/StudentForm';
import { Modal } from '../components/ui/Modal';
import { useStudentsStore } from '../store/studentsStore';
import type { StudentLevel } from '../types';

type LevelFilter = StudentLevel | 'tutti';

const LEVEL_FILTERS: { label: string; value: LevelFilter }[] = [
  { label: 'Tutti', value: 'tutti' },
  { label: 'Principiante', value: 'principiante' },
  { label: 'Intermedio', value: 'intermedio' },
  { label: 'Avanzato', value: 'avanzato' },
];

export default function StudentsPage() {
  const { students } = useStudentsStore();
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('tutti');
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.surname.toLowerCase().includes(q);
    const matchLevel = levelFilter === 'tutti' || s.level === levelFilter;
    return matchSearch && matchLevel;
  });

  return (
    <AppLayout
      title="Allievi"
      rightAction={
        <button
          onClick={() => setShowAddModal(true)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-tennis-yellow text-gray-900 hover:bg-tennis-yellow-dark transition-colors"
        >
          <Plus size={18} />
        </button>
      }
    >
      {/* Search */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50">
          <Search size={16} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Cerca allievo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm outline-none bg-transparent text-gray-800 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Level filter */}
      <div className="flex gap-2 px-4 py-2 overflow-x-auto">
        {LEVEL_FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setLevelFilter(value)}
            className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              levelFilter === value
                ? 'bg-court-green text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex flex-col gap-2 px-4 pb-4">
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-400 text-sm">
              {search || levelFilter !== 'tutti' ? 'Nessun risultato trovato' : 'Nessun allievo ancora'}
            </p>
          </div>
        ) : (
          filtered.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))
        )}
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Nuovo allievo">
        <StudentForm onClose={() => setShowAddModal(false)} />
      </Modal>
    </AppLayout>
  );
}
