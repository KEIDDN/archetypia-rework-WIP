import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AppShell } from './components/layout/AppShell';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { ProjectsListPage } from './features/projects/ProjectsListPage';
import { ProjectLayout } from './features/projects/ProjectLayout';
import { ProjectOverviewPage } from './features/projects/pages/ProjectOverviewPage';
import { ProjectIssuesPage } from './features/projects/pages/ProjectIssuesPage';
import { ProjectBriefPage } from './features/projects/pages/ProjectBriefPage';
import { ProjectReferencesPage } from './features/projects/pages/ProjectReferencesPage';
import { IssueDetailPage } from './features/projects/pages/IssueDetailPage';
import CreativeDirectionApp from './legacy/CreativeDirectionApp';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/legacy" element={<CreativeDirectionApp />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/projects" element={<AppShell />}>
              <Route index element={<ProjectsListPage />} />
              <Route path=":projectId" element={<ProjectLayout />}>
                <Route index element={<ProjectOverviewPage />} />
                <Route path="issues" element={<ProjectIssuesPage />} />
                <Route path="brief" element={<ProjectBriefPage />} />
                <Route path="references" element={<ProjectReferencesPage />} />
              </Route>
              <Route path=":projectId/issues/:issueId" element={<IssueDetailPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
