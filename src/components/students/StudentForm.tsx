import { useState } from 'react';
import type { Student, StudentLevel } from '../../types';
import { useStudentsStore } from '../../store/studentsStore';
import { Input, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';

interface Props {
  student?: Student;
  onClose: () => void;
}

export function StudentForm({ student, onClose }: Props) {
  const { addStudent, updateStudent } = useStudentsStore();
  const isEdit = !!student;

  const [name, setName] = useState(student?.name ?? '');
  const [surname, setSurname] = useState(student?.surname ?? '');
  const [birthDate, setBirthDate] = useState(student?.birthDate ?? '');
  const [phone, setPhone] = useState(student?.phone ?? '');
  const [email, setEmail] = useState(student?.email ?? '');
  const [level, setLevel] = useState<StudentLevel>(student?.level ?? 'principiante');
  const [status, setStatus] = useState(student?.status ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Campo obbligatorio';
    if (!surname.trim()) e.surname = 'Campo obbligatorio';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const payload = { name: name.trim(), surname: surname.trim(), birthDate, phone, email, level, status };

    if (isEdit) {
      updateStudent(student.id, payload);
    } else {
      addStudent(payload);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Input label="Nome" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} placeholder="Mario" />
        <Input label="Cognome" value={surname} onChange={(e) => setSurname(e.target.value)} error={errors.surname} placeholder="Rossi" />
      </div>
      <Input label="Data di nascita" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
      <Input label="Telefono" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+39 333 1234567" />
      <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="mario@gmail.com" />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Livello</label>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value as StudentLevel)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-court-green focus:ring-2 focus:ring-green-100"
        >
          <option value="principiante">Principiante</option>
          <option value="intermedio">Intermedio</option>
          <option value="avanzato">Avanzato</option>
        </select>
      </div>

      <Textarea
        label="Stato / Note condivise"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        placeholder="Informazioni condivise tra istruttori..."
        rows={3}
      />

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
          Annulla
        </Button>
        <Button type="submit" className="flex-1">
          {isEdit ? 'Salva' : 'Aggiungi'}
        </Button>
      </div>
    </form>
  );
}
