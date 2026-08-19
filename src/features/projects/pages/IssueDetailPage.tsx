import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, RefreshCcw, Trash2 } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Textarea } from '../../../components/ui/Input';
import { StatusSelect } from '../../issues/components/StatusSelect';
import { PrioritySelect } from '../../issues/components/PrioritySelect';
import { LabelPicker } from '../../issues/components/LabelPicker';
import { DueDatePicker } from '../../issues/components/DueDatePicker';
import {
  deleteIssue,
  updateIssueDescription,
  updateIssueDueDate,
  updateIssueLabel,
  updateIssuePriority,
  updateIssueStatus,
  updateIssueTitle
} from '../../issues/issueService';
import type { IssuePriority, IssueStatus } from '../../issues/types';
import { useCurrentProject } from '../CurrentProjectContext';

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-[12px] text-text-muted">{label}</span>
      {children}
    </div>
  );
}

export function IssueDetailPage() {
  const { projectId, issueId } = useParams<{ projectId: string; issueId: string }>();
  const navigate = useNavigate();
  const { project, status, issues, setIssues, labels, setLabels, reload } = useCurrentProject();

  const issue = issues?.find((i) => i.id === issueId) ?? null;

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');
  const [editingDescription, setEditingDescription] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (issue) {
      setTitleDraft(issue.title);
      setDescriptionDraft(issue.description ?? '');
    }
  }, [issue?.id]);

  useEffect(() => {
    if (editingTitle) titleInputRef.current?.focus();
  }, [editingTitle]);

  useEffect(() => {
    setConfirmDelete(false);
  }, [issueId]);

  if (status === 'idle' || status === 'loading' || issues === null) {
    return (
      <PageContainer>
        <div className="py-20 flex justify-center">
          <RefreshCcw size={16} className="animate-spin text-text-muted" />
        </div>
      </PageContainer>
    );
  }

  if (!project || !issue) {
    return (
      <PageContainer>
        <EmptyState title="Work item not found" description="This item doesn't exist or you don't have access to it." />
      </PageContainer>
    );
  }

  const patchIssue = (patch: Partial<typeof issue>) => {
    setIssues((prev) => prev?.map((i) => (i.id === issue.id ? { ...i, ...patch } : i)) ?? null);
  };

  const commitTitle = () => {
    const trimmed = titleDraft.trim();
    setEditingTitle(false);
    if (!trimmed || trimmed === issue.title) {
      setTitleDraft(issue.title);
      return;
    }
    patchIssue({ title: trimmed });
    updateIssueTitle(issue.id, trimmed).catch(reload);
  };

  const commitDescription = () => {
    setEditingDescription(false);
    const value = descriptionDraft.trim() || null;
    if (value === issue.description) return;
    patchIssue({ description: value });
    updateIssueDescription(issue.id, value).catch(reload);
  };

  const handleStatusChange = (s: IssueStatus) => {
    patchIssue({ status: s });
    updateIssueStatus(issue.id, s).catch(reload);
  };

  const handlePriorityChange = (p: IssuePriority) => {
    patchIssue({ priority: p });
    updateIssuePriority(issue.id, p).catch(reload);
  };

  const handleDueDateChange = (date: string | null) => {
    patchIssue({ due_date: date });
    updateIssueDueDate(issue.id, date).catch(reload);
  };

  const handleLabelChange = (labelId: string | null) => {
    patchIssue({ label_id: labelId });
    updateIssueLabel(issue.id, labelId).catch(reload);
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    navigate(`/projects/${projectId}/issues`);
    setIssues((prev) => prev?.filter((i) => i.id !== issue.id) ?? null);
    deleteIssue(issue.id).catch(reload);
  };

  return (
    <PageContainer>
      <div className="flex items-center gap-1.5 text-[12px] text-text-muted mb-6">
        <Link to={`/projects/${projectId}`} className="hover:text-text-secondary transition-colors truncate max-w-[200px]">
          {project.name}
        </Link>
        <ChevronRight size={11} />
        <Link to={`/projects/${projectId}/issues`} className="hover:text-text-secondary transition-colors">
          Work
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-10">
        <div className="min-w-0 space-y-6">
          {editingTitle ? (
            <input
              ref={titleInputRef}
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={commitTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitTitle();
                if (e.key === 'Escape') {
                  setTitleDraft(issue.title);
                  setEditingTitle(false);
                }
              }}
              className="w-full bg-transparent text-xl font-semibold text-text-primary focus:outline-none border-b border-transparent focus:border-border pb-1"
            />
          ) : (
            <h1
              onClick={() => setEditingTitle(true)}
              className="text-xl font-semibold text-text-primary cursor-text hover:bg-surface -mx-2 px-2 py-1 -my-1 rounded-md transition-colors"
            >
              {issue.title}
            </h1>
          )}

          {editingDescription ? (
            <Textarea
              autoFocus
              variant="ghost"
              rows={6}
              value={descriptionDraft}
              onChange={(e) => setDescriptionDraft(e.target.value)}
              onBlur={commitDescription}
              placeholder="What needs to happen?"
              className="-mx-2.5"
            />
          ) : (
            <div
              onClick={() => setEditingDescription(true)}
              className="cursor-text hover:bg-surface -mx-2.5 px-2.5 py-2 rounded-md transition-colors min-h-[80px]"
            >
              {issue.description ? (
                <p className="text-[13px] text-text-secondary leading-relaxed whitespace-pre-wrap">{issue.description}</p>
              ) : (
                <p className="text-[13px] text-text-muted">What needs to happen?</p>
              )}
            </div>
          )}
        </div>

        <div className="space-y-0.5 lg:border-l lg:border-border lg:pl-6">
          <MetaRow label="Status">
            <StatusSelect value={issue.status} onChange={handleStatusChange} />
          </MetaRow>
          <MetaRow label="Priority">
            <PrioritySelect value={issue.priority} onChange={handlePriorityChange} />
          </MetaRow>
          <MetaRow label="Label">
            <LabelPicker
              projectId={project.id}
              labels={labels}
              value={issue.label_id}
              onCreate={(label) => setLabels((prev) => [...prev, label])}
              onChange={handleLabelChange}
            />
          </MetaRow>
          <MetaRow label="Due date">
            <DueDatePicker value={issue.due_date} status={issue.status} onChange={handleDueDateChange} />
          </MetaRow>
          <MetaRow label="Project">
            <Link
              to={`/projects/${projectId}`}
              className="text-[12px] text-text-secondary hover:text-text-primary transition-colors truncate max-w-[140px]"
            >
              {project.name}
            </Link>
          </MetaRow>

          <div className="pt-4 mt-2 border-t border-border">
            <button
              type="button"
              onClick={handleDelete}
              onBlur={() => setConfirmDelete(false)}
              className={`flex items-center gap-1.5 text-[12px] transition-colors cursor-pointer ${
                confirmDelete ? 'text-danger font-medium' : 'text-text-muted hover:text-danger'
              }`}
            >
              <Trash2 size={12} />
              {confirmDelete ? 'Confirm delete' : 'Delete work item'}
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
