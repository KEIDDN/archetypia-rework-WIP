import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { ArchetypiaLogo } from '../components/ArchetypiaLogo';
import { Button } from '../components/ui/Button';
import { Input, FieldLabel } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';

export function AuthPage() {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signUpMessage, setSignUpMessage] = useState<string | null>(null);

  // No Supabase configured yet — there's no real auth to perform, so go straight in.
  if (!isSupabaseConfigured) return <Navigate to="/projects" replace />;
  if (user) return <Navigate to="/projects" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSignUpMessage(null);

    const result = mode === 'sign-in' ? await signIn(email, password) : await signUp(email, password);

    if (result.error) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    if (mode === 'sign-up') {
      setSignUpMessage('Account created. Check your email to confirm, then sign in.');
      setMode('sign-in');
      setSubmitting(false);
      return;
    }

    navigate('/projects', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 font-ui">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm space-y-8"
      >
        <div className="flex flex-col items-center gap-5 text-center">
          <ArchetypiaLogo variant="symbol" size="md" symbolClassName="text-text-primary" dotClassName="fill-accent" />
          <div className="space-y-1">
            <h1 className="text-lg font-semibold text-text-primary">
              {mode === 'sign-in' ? 'Sign in' : 'Create your account'}
            </h1>
            <p className="text-[13px] text-text-muted">Enter your creative workspace.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <FieldLabel>Email</FieldLabel>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@studio.com"
            />
          </div>

          <div>
            <FieldLabel>Password</FieldLabel>
            <Input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-[13px] text-danger">{error}</p>}
          {signUpMessage && <p className="text-[13px] text-text-secondary">{signUpMessage}</p>}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Please wait…' : mode === 'sign-in' ? 'Sign in' : 'Sign up'}
            {!submitting && <ArrowRight size={14} />}
          </Button>
        </form>

        <button
          onClick={() => {
            setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in');
            setError(null);
            setSignUpMessage(null);
          }}
          className="w-full text-center text-[13px] text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
        >
          {mode === 'sign-in' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </motion.div>
    </div>
  );
}
