import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { getProject } from './projectService';
import { listIssues } from '../issues/issueService';
import { listLabels } from '../issues/labels/labelService';
import type { Project } from './types';
import type { Issue } from '../issues/types';
import type { Label } from '../issues/labels/types';
import type { CreativeReference } from './references/types';

export type ProjectLoadStatus = 'idle' | 'loading' | 'not-found' | 'error' | 'ready';

interface CurrentProjectContextValue {
  projectId: string | null;
  project: Project | null;
  setProject: (project: Project) => void;
  status: ProjectLoadStatus;
  error: string | null;
  reload: () => void;
  issues: Issue[] | null;
  setIssues: React.Dispatch<React.SetStateAction<Issue[] | null>>;
  labels: Label[];
  setLabels: React.Dispatch<React.SetStateAction<Label[]>>;
  references: CreativeReference[];
  setReferences: React.Dispatch<React.SetStateAction<CreativeReference[]>>;
}

const CurrentProjectContext = createContext<CurrentProjectContextValue | null>(null);

export function useCurrentProject() {
  const ctx = useContext(CurrentProjectContext);
  if (!ctx) throw new Error('useCurrentProject must be used within CurrentProjectProvider');
  return ctx;
}

function extractProjectId(pathname: string): string | null {
  const match = pathname.match(/^\/projects\/([^/]+)/);
  return match ? match[1] : null;
}

/**
 * Owns the "current project" (project + issues + references) for the whole
 * app shell — not just the routed project pages. Mounted at AppShell level so
 * both the sidebar (persistent chrome) and the project surfaces (routed
 * content) read the same data instead of each fetching independently.
 */
export function CurrentProjectProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const projectId = extractProjectId(location.pathname);

  const [project, setProject] = useState<Project | null>(null);
  const [issues, setIssues] = useState<Issue[] | null>(null);
  const [labels, setLabels] = useState<Label[]>([]);
  const [references, setReferences] = useState<CreativeReference[]>([]);
  const [status, setStatus] = useState<ProjectLoadStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const load = useCallback((id: string) => {
    setStatus('loading');
    setError(null);
    Promise.all([getProject(id), listIssues(id), listLabels(id)])
      .then(([proj, issueList, labelList]) => {
        if (!proj) {
          setStatus('not-found');
          return;
        }
        setProject(proj);
        setIssues(issueList);
        setLabels(labelList);
        setStatus('ready');
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load project.');
        setStatus('error');
      });
  }, []);

  useEffect(() => {
    if (!projectId) {
      setProject(null);
      setIssues(null);
      setLabels([]);
      setReferences([]);
      setStatus('idle');
      return;
    }
    setReferences([]);
    load(projectId);
  }, [projectId, load]);

  const reload = () => {
    if (projectId) load(projectId);
  };

  return (
    <CurrentProjectContext.Provider
      value={{
        projectId,
        project,
        setProject,
        status,
        error,
        reload,
        issues,
        setIssues,
        labels,
        setLabels,
        references,
        setReferences
      }}
    >
      {children}
    </CurrentProjectContext.Provider>
  );
}
