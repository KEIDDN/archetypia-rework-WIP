import { motion } from 'motion/react';

export const ArchetypiaLogo = ({
  variant = 'full',
  size = 'md',
  className = '',
  symbolClassName = 'text-brand-fg',
  textClassName = 'text-brand-fg',
  dotClassName = 'fill-brand-fg'
}: {
  variant?: 'full' | 'symbol' | 'wordmark';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  className?: string;
  symbolClassName?: string;
  textClassName?: string;
  dotClassName?: string;
}) => {
  const sizeMap = {
    xs: { height: 'h-4', textSize: 'text-xs', spacing: 'gap-2' },
    sm: { height: 'h-6', textSize: 'text-sm', spacing: 'gap-2.5' },
    md: { height: 'h-8', textSize: 'text-lg', spacing: 'gap-3' },
    lg: { height: 'h-12', textSize: 'text-2xl', spacing: 'gap-4' },
    xl: { height: 'h-20', textSize: 'text-4xl', spacing: 'gap-6' },
    custom: { height: '', textSize: '', spacing: 'gap-3' }
  };

  const selectedSize = sizeMap[size] || sizeMap.md;

  const renderSymbol = () => (
    <div className="relative group/logo-symbol inline-block">
      {/* Soft underlying visual field */}
      <div className="absolute -inset-3 bg-brand-fg/[0.03] rounded-full blur-md opacity-0 group-hover/logo-symbol:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <svg
        viewBox="0 0 100 100"
        className={`${selectedSize.height || 'h-full'} w-auto overflow-visible relative z-10`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Typographic "Construct Blueprint Guidelines" - representing objective structure */}
        <g className="opacity-0 group-hover/logo-symbol:opacity-40 transition-opacity duration-300 pointer-events-none">
          {/* Baseline horizontal rule */}
          <line x1="-12" y1="80" x2="112" y2="80" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1.5 2.5" className="text-brand-fg/30" />
          {/* Cap height horizontal rule */}
          <line x1="-12" y1="23" x2="112" y2="23" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1.5 2.5" className="text-brand-fg/30" />
          {/* Technical drafting diagonal alignment ray */}
          <line x1="14" y1="80" x2="90" y2="10" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 3" className="text-brand-fg/20" />
          {/* Dot orbital alignment path */}
          <circle cx="82" cy="72" r="15" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" className="text-brand-fg/20" />
          {/* Alignment tick indicators */}
          <path d="M-5 23 H5 M-5 80 H5 M82 95 V90 M50 15 V10" stroke="currentColor" strokeWidth="0.75" className="text-brand-fg/30" />
        </g>

        {/* Prime structural A-column */}
        <motion.path
          d="M 14 80 L 44 23 H 56 L 70 55 L 61 80 Z"
          className={symbolClassName}
          fill="currentColor"
          whileHover={{ y: -1 }}
          transition={{ type: "spring", stiffness: 450, damping: 25 }}
        />

        {/* Dynamic focus mark (The dot) with delicate physics & breathing pattern */}
        <motion.circle
          cx="82"
          cy="72"
          r="9"
          className={dotClassName}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          whileHover={{
            scale: 1.25,
            x: 2,
            y: -1.5,
            filter: "drop-shadow(0 0 8px rgba(251, 245, 232, 0.6))"
          }}
        />
      </svg>
    </div>
  );

  if (variant === 'symbol') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {renderSymbol()}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center ${selectedSize.spacing} select-none ${className}`}>
      {variant !== 'wordmark' && renderSymbol()}
      <motion.span
        className={`font-sans font-bold tracking-[-0.03em] ${selectedSize.textSize} text-brand-fg leading-none ${textClassName}`}
        initial={{ opacity: 0.95 }}
        whileHover={{ opacity: 1 }}
      >
        Archetypia
      </motion.span>
    </div>
  );
};
