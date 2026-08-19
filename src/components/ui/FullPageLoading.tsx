import { motion } from 'motion/react';
import { ArchetypiaLogo } from '../ArchetypiaLogo';

export function FullPageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ArchetypiaLogo variant="symbol" size="md" symbolClassName="text-text-primary" dotClassName="fill-text-primary" />
      </motion.div>
    </div>
  );
}
