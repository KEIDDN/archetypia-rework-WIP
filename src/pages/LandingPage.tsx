import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { ArchetypiaLogo } from '../components/ArchetypiaLogo';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

export function LandingPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (!loading && user) return <Navigate to="/projects" replace />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background text-text-primary font-ui">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center space-y-8"
      >
        <div className="flex justify-center">
          <ArchetypiaLogo variant="symbol" size="lg" symbolClassName="text-text-primary" dotClassName="fill-accent" />
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
            A creative workspace that understands your work.
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed max-w-sm mx-auto">
            Archetypia is a calm, persistent home for brand projects — from first brief to finished direction.
          </p>
        </div>

        <Button onClick={() => navigate('/auth')} className="mx-auto px-6 py-2.5">
          Enter Archetypia
          <ArrowRight size={14} />
        </Button>
      </motion.div>
    </div>
  );
}
