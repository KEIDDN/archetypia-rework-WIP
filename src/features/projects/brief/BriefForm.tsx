import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Textarea, FieldLabel } from '../../../components/ui/Input';
import type { CreativeBrief } from './types';

type CoreField = 'context' | 'objective' | 'audience' | 'personality';
type OptionalField = 'positioning' | 'constraints';

const CORE_FIELDS: { key: CoreField; label: string; placeholder: string }[] = [
  {
    key: 'context',
    label: 'Project context',
    placeholder: 'What is this project, and who is it for at a glance?'
  },
  {
    key: 'objective',
    label: 'Objective',
    placeholder: 'What is this project trying to achieve?'
  },
  {
    key: 'audience',
    label: 'Audience',
    placeholder: 'Who is this brand speaking to?'
  },
  {
    key: 'personality',
    label: 'Personality & tone',
    placeholder: '3–5 words that capture the tone — warm, precise, playful…'
  }
];

const OPTIONAL_FIELDS: { key: OptionalField; label: string; placeholder: string }[] = [
  {
    key: 'positioning',
    label: 'Desired positioning',
    placeholder: 'How should this stand apart from alternatives?'
  },
  {
    key: 'constraints',
    label: 'Constraints or requirements',
    placeholder: 'Anything the work should avoid or work within?'
  }
];

export function BriefForm({
  brief,
  onChange,
  onFieldBlur
}: {
  brief: CreativeBrief;
  onChange: (next: CreativeBrief) => void;
  onFieldBlur?: () => void;
}) {
  const [showOptional, setShowOptional] = useState(
    () => brief.positioning.trim().length > 0 || brief.constraints.trim().length > 0
  );

  const setField = (key: keyof CreativeBrief) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ ...brief, [key]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CORE_FIELDS.map((field) => (
          <div key={field.key}>
            <FieldLabel>{field.label}</FieldLabel>
            <Textarea
              rows={2}
              value={brief[field.key]}
              onChange={setField(field.key)}
              onBlur={onFieldBlur}
              placeholder={field.placeholder}
            />
          </div>
        ))}
      </div>

      {!showOptional && (
        <button
          type="button"
          onClick={() => setShowOptional(true)}
          className="inline-flex items-center gap-1.5 text-[12px] text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
        >
          <ChevronDown size={12} />
          Add positioning & constraints
        </button>
      )}

      {showOptional && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {OPTIONAL_FIELDS.map((field) => (
            <div key={field.key}>
              <FieldLabel>{field.label}</FieldLabel>
              <Textarea
                rows={2}
                value={brief[field.key]}
                onChange={setField(field.key)}
                onBlur={onFieldBlur}
                placeholder={field.placeholder}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
