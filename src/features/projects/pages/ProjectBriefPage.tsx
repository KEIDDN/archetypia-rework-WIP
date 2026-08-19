import { useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { BriefForm } from '../brief/BriefForm';
import { updateProjectBrief } from '../projectService';
import type { CreativeBrief } from '../brief/types';
import type { ProjectOutletContext } from '../ProjectLayout';

type SaveState = 'idle' | 'saving' | 'saved';

export function ProjectBriefPage() {
  const { project, setProject } = useOutletContext<ProjectOutletContext>();
  const [brief, setBrief] = useState<CreativeBrief>(project.brief);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const briefRef = useRef(brief);
  briefRef.current = brief;
  const queueRef = useRef<Promise<void>>(Promise.resolve());

  const handleBlurSave = () => {
    const snapshot = briefRef.current;
    setSaveState('saving');
    queueRef.current = queueRef.current
      .catch(() => {})
      .then(() => updateProjectBrief(project.id, snapshot))
      .then(() => {
        setProject({ ...project, brief: snapshot });
        setSaveState('saved');
      })
      .catch(() => setSaveState('idle'));
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-text-secondary leading-relaxed max-w-lg">
          The context this project carries — read it, edit it, keep it current as the work evolves.
        </p>
        <span className="text-[11px] text-text-muted flex-shrink-0">
          {saveState === 'saving' ? 'Saving…' : saveState === 'saved' ? 'Saved' : ''}
        </span>
      </div>
      <BriefForm brief={brief} onChange={setBrief} onFieldBlur={handleBlurSave} />
    </div>
  );
}
