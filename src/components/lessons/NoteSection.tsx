import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Textarea } from '../ui/Input';

interface Props {
  labelBefore?: string;
  labelAfter?: string;
  notesBefore: string;
  notesAfter: string;
  onChangeBefore: (val: string) => void;
  onChangeAfter: (val: string) => void;
  collapsible?: boolean;
  title?: string;
}

export function NoteSection({
  labelBefore = 'PRIMA DELLA LEZIONE',
  labelAfter = 'DOPO LA LEZIONE',
  notesBefore,
  notesAfter,
  onChangeBefore,
  onChangeAfter,
  collapsible = false,
  title,
}: Props) {
  const [open, setOpen] = useState(false);

  const content = (
    <div className="flex flex-col gap-3">
      <Textarea
        label={labelBefore}
        placeholder="Note prima della lezione..."
        value={notesBefore}
        onChange={(e) => onChangeBefore(e.target.value)}
        rows={2}
      />
      <Textarea
        label={labelAfter}
        placeholder="Note dopo la lezione..."
        value={notesAfter}
        onChange={(e) => onChangeAfter(e.target.value)}
        rows={2}
      />
    </div>
  );

  if (!collapsible) return content;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="text-sm font-medium text-gray-700">{title}</span>
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      {open && <div className="p-3">{content}</div>}
    </div>
  );
}
