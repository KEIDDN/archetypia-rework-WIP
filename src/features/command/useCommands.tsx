import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, FileText, FolderKanban, Image as ImageIcon, ListTodo } from 'lucide-react';
import { listProjects } from '../projects/projectService';
import { useCurrentProject } from '../projects/CurrentProjectContext';
import type { Project } from '../projects/types';
import type { Command } from './types';

export function useCommands(open: boolean): Command[] {
  const navigate = useNavigate();
  const { projectId, project, issues } = useCurrentProject();
  const [projects, setProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    if (open && projects === null) {
      listProjects()
        .then(setProjects)
        .catch(() => setProjects([]));
    }
  }, [open, projects]);

  return useMemo(() => {
    const commands: Command[] = [];

    commands.push({
      id: 'nav:projects',
      label: 'Go to Projects',
      category: 'Navigation',
      icon: <FolderKanban size={14} />,
      action: () => navigate('/projects')
    });

    if (projectId) {
      commands.push(
        {
          id: 'nav:overview',
          label: 'Go to Overview',
          category: 'Navigation',
          icon: <Compass size={14} />,
          action: () => navigate(`/projects/${projectId}`)
        },
        {
          id: 'nav:work',
          label: 'Go to Work',
          category: 'Navigation',
          icon: <ListTodo size={14} />,
          action: () => navigate(`/projects/${projectId}/issues`)
        },
        {
          id: 'nav:brief',
          label: 'Go to Brief',
          category: 'Navigation',
          icon: <FileText size={14} />,
          action: () => navigate(`/projects/${projectId}/brief`)
        },
        {
          id: 'nav:references',
          label: 'Go to References',
          category: 'Navigation',
          icon: <ImageIcon size={14} />,
          action: () => navigate(`/projects/${projectId}/references`)
        }
      );
    }

    (projects ?? []).forEach((p) => {
      if (p.id === projectId) return;
      commands.push({
        id: `project:${p.id}`,
        label: p.name,
        keywords: p.name,
        category: 'Projects',
        icon: <FolderKanban size={14} />,
        action: () => navigate(`/projects/${p.id}`)
      });
    });

    if (project) {
      commands.push({
        id: `project:${project.id}`,
        label: project.name,
        keywords: project.name,
        category: 'Projects',
        icon: <FolderKanban size={14} />,
        action: () => navigate(`/projects/${project.id}`)
      });
    }

    (issues ?? []).forEach((issue) => {
      commands.push({
        id: `issue:${issue.id}`,
        label: issue.title,
        keywords: issue.title,
        category: 'Work',
        icon: <ListTodo size={14} />,
        action: () => navigate(`/projects/${issue.project_id}/issues/${issue.id}`)
      });
    });

    return commands;
  }, [navigate, projectId, project, projects, issues]);
}
