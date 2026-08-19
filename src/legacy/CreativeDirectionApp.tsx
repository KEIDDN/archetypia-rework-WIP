import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  ArrowRight, 
  Sparkles, 
  Target, 
  Palette, 
  Type as TypeIcon, 
  ShieldCheck, 
  Info,
  ChevronRight,
  RefreshCcw,
  X,
  FileText,
  Sun,
  Moon,
  User,
  CreditCard,
  Lock,
  Settings,
  Mail,
  LogOut
} from 'lucide-react';
import { analyzeBrandIdentity, generateRefinementQuestions, BrandDirection } from '../services/aiService';
import { ArchetypiaLogo } from '../components/ArchetypiaLogo';

// --- Types ---
type AppState = 'landing' | 'workspace' | 'pre-analysis' | 'analyzing' | 'result' | 'profile' | 'method';

interface ImageFile {
  id: string;
  url: string;
  base64: string;
  mimeType: string;
}

// --- Components ---

const ArchetypePositioning = ({ positioning, primaryDefault, secondaryDefault }: { positioning?: any; primaryDefault?: string; secondaryDefault?: string }) => {
  const primaryName = positioning?.primary?.name || primaryDefault || "Primary Archetype";
  const primaryDescriptor = positioning?.primary?.descriptor || "The visual essence defining this brand routing.";
  const primaryJustification = positioning?.primary?.justification || "Detailed strategic rationale on how this identity structure addresses the briefing.";

  const secondaryName = positioning?.secondary?.name || secondaryDefault || "Secondary Archetype";
  const secondaryDescriptor = positioning?.secondary?.descriptor || "The nuanced counterweight shaping the identity.";
  const secondaryJustification = positioning?.secondary?.justification || "Elaborated creative integration details balancing the primary direction.";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-brand-fg/5">
      {/* Primary Archetype Card */}
      <div className="bg-brand-dark border border-brand-fg/10 p-8 rounded-sm space-y-6 text-brand-fg hover:border-brand-fg/30 transition-all duration-300">
        <div className="space-y-2">
          <p className="text-[9px] font-sans uppercase tracking-widest text-brand-fg/40">Primary Archetype</p>
          <h3 className="text-4xl font-sans font-bold tracking-tight text-brand-fg">
            {primaryName}
          </h3>
          <p className="text-xs font-sans italic text-brand-fg/60 leading-relaxed">
            {primaryDescriptor}
          </p>
        </div>
        <p className="text-sm font-sans leading-relaxed text-brand-fg/80">
          {primaryJustification}
        </p>
      </div>

      {/* Secondary Archetype Card */}
      <div className="bg-brand-dark border border-brand-fg/10 p-8 rounded-sm space-y-6 text-brand-fg hover:border-brand-fg/30 transition-all duration-300">
        <div className="space-y-2">
          <p className="text-[9px] font-sans uppercase tracking-widest text-brand-fg/40">Secondary Archetype</p>
          <h3 className="text-4xl font-sans font-bold tracking-tight text-brand-fg">
            {secondaryName}
          </h3>
          <p className="text-xs font-sans italic text-brand-fg/60 leading-relaxed">
            {secondaryDescriptor}
          </p>
        </div>
        <p className="text-sm font-sans leading-relaxed text-brand-fg/80">
          {secondaryJustification}
        </p>
      </div>
    </div>
  );
};

const Navbar = ({ onReset, onProfile, isDark, toggleTheme, onMethod }: { onReset: () => void; onProfile: () => void; isDark: boolean; toggleTheme: () => void; onMethod: () => void }) => (
  <nav className="fixed top-0 left-0 w-full z-50 px-10 py-6 flex justify-between items-center bg-brand-bg/85 backdrop-blur-md border-b border-brand-fg/10 transition-colors duration-500">
    <div 
      className="flex items-center gap-4 cursor-pointer group"
      onClick={onReset}
    >
      <ArchetypiaLogo variant="full" size="sm" symbolClassName="text-brand-fg" textClassName="text-brand-fg font-sans text-xl font-extrabold tracking-[-0.05em] antialiased" dotClassName="fill-brand-fg" className="transform group-hover:scale-[1.02] transition-all duration-300" />
      <div className="h-4 w-[1px] bg-brand-fg/20 hidden md:block"></div>
      <span className="font-sans text-[10px] tracking-[0.2em] uppercase opacity-80 hidden md:block text-brand-fg">BETA VERSION [BUILD V.0.3]</span>
    </div>
    <div className="flex gap-8 items-center text-[10px] font-sans uppercase tracking-widest">
      <div 
        onClick={toggleTheme}
        className="p-2 border border-brand-fg/10 rounded-sm hover:bg-brand-fg/5 transition-colors cursor-pointer text-brand-fg"
        title={isDark ? "Switch to Brand Theme" : "Switch to Neutral Dark"}
      >
        {isDark ? <Sun size={14} /> : <Moon size={14} />}
      </div>
      <span 
        onClick={onMethod}
        className="hover:text-brand-dark cursor-pointer transition-colors text-brand-fg opacity-60"
      >
        The Method
      </span>
      <span 
        onClick={onProfile}
        className="hover:text-brand-dark cursor-pointer transition-colors text-brand-fg opacity-60"
      >
        Profile
      </span>
      <div className="px-4 py-2 border border-brand-fg/10 rounded-sm hover:bg-brand-fg/5 transition-colors cursor-pointer text-brand-fg">
        Export Blueprint
      </div>
    </div>
  </nav>
);

const Landing = ({ onStart }: { onStart: () => void; key?: string }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
  >
    <div className="max-w-5xl text-center space-y-8">
      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="flex justify-center mb-10"
      >
        <ArchetypiaLogo variant="symbol" size="xl" symbolClassName="text-brand-fg" dotClassName="fill-brand-fg" />
      </motion.div>

      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-7xl md:text-[120px] font-sans font-bold text-brand-fg leading-[0.9] tracking-tight"
      >
        Latent<br />
        <span className="opacity-50">Identity.</span>
      </motion.h1>

      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-lg md:text-xl text-[#ffffff] font-sans italic max-w-xl mx-auto leading-relaxed"
      >
        "Bridging the gap between chaotic inspiration and actionable design decisions through refined multimodal intelligence."
      </motion.p>

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onStart}
        className="group relative inline-flex items-center gap-6 bg-brand-dark text-brand-fg px-12 py-5 rounded-sm overflow-hidden text-[11px] font-bold uppercase tracking-[0.3em] transition-all hover:bg-brand-fg hover:text-brand-dark"
      >
        <span>Begin Synthesis</span>
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </motion.button>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-12 left-0 w-full flex justify-center gap-12 text-[9px] font-sans uppercase tracking-[0.4em]"
      >
        <span style={{ color: '#f7f7f7' }}>Strategic Core Mapping</span>
        <span className="text-brand-dark">/</span>
        <span style={{ color: '#fefefe' }}>Architectural Reasoning</span>
        <span className="text-brand-dark">/</span>
        <span style={{ color: '#ffffff' }}>Zero Content Generation</span>
      </motion.div>
    </div>
  </motion.div>
);

const Workspace = ({ onAnalyze }: { onAnalyze: (brief: string, images: ImageFile[]) => void; key?: string }) => {
  const [form, setForm] = useState({
    projectName: '',
    industry: '',
    brandValues: '',
    tone: '',
    audience: '',
    vision: ''
  });
  const [images, setImages] = useState<ImageFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file: File) => {
      const reader = new FileReader();
      const currentFile = file;
      reader.onloadend = () => {
        setImages(prev => [
          ...prev, 
          { 
            id: Math.random().toString(36).substr(2, 9), 
            url: URL.createObjectURL(currentFile), 
            base64: reader.result as string,
            mimeType: currentFile.type
          }
        ]);
      };
      reader.readAsDataURL(currentFile);
    });
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleAnalyze = () => {
    const combinedBrief = `PROJECT: ${form.projectName}\nINDUSTRY: ${form.industry}\nVALUES: ${form.brandValues}\nTONE: ${form.tone}\nAUDIENCE: ${form.audience}\nVISION: ${form.vision}`;
    onAnalyze(combinedBrief, images);
  };

  const isFormValid = Object.values(form).every(val => (val as string).trim().length > 0);
  const isReady = isFormValid && images.length >= 3;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen pt-40 pb-20 px-8 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16"
    >
      <div className="lg:col-span-8 space-y-16">
        <section>
          <h2 className="text-[10px] font-sans uppercase tracking-[0.3em] text-white mb-8 flex items-center gap-3">
            <span className="w-1 h-1 rounded-full bg-brand-dark" />
            01. Visual References
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <AnimatePresence>
              {images.map((img) => (
                <motion.div 
                  key={img.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="aspect-square relative group bg-brand-dark/20 border border-brand-dark/30 rounded-sm overflow-hidden"
                >
                  <img src={img.url} alt="Reference" className="w-full h-full object-cover transition-all duration-700 contrast-125 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => removeImage(img.id)}
                      className="p-3 bg-brand-dark text-brand-fg border border-brand-fg/20 rounded-full hover:bg-brand-fg hover:text-brand-dark transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square border border-dashed border-brand-fg/30 bg-brand-fg/[0.03] hover:bg-brand-fg/[0.05] rounded-sm flex flex-col items-center justify-center gap-4 text-brand-fg hover:border-brand-fg/60 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-10 h-10 flex items-center justify-center border border-brand-fg/20 rounded-full group-hover:border-brand-fg/60 transition-colors duration-300">
                <Upload size={18} className="group-hover:-translate-y-1 transition-transform duration-300" />
              </div>
              <span className="text-[9px] font-sans uppercase tracking-[0.2em]">Add Insight ({images.length}/3+)</span>
            </button>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            multiple 
            accept="image/*" 
            className="hidden" 
          />
        </section>

        <section className="space-y-12">
          <h2 className="text-[10px] font-sans uppercase tracking-[0.3em] text-white flex items-center gap-3">
            <span className="w-1 h-1 rounded-full bg-brand-dark" />
            02. Identity Briefing
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-sans uppercase tracking-widest text-[#fbf5e8] font-bold block ml-1">Project Name</label>
              <input
                type="text"
                value={form.projectName}
                onChange={handleInputChange('projectName')}
                placeholder="Lumen Studio"
                className="w-full p-6 bg-[#171717] border border-[#fbf5e8]/25 hover:border-[#fbf5e8]/50 rounded-sm focus:outline-none focus:border-[#fbf5e8] focus:ring-1 focus:ring-[#fbf5e8] font-sans italic text-xl placeholder:text-[#fbf5e8]/50 text-[#fbf5e8] transition-all"
              />
            </div>
            
            <div className="space-y-4">
              <label className="text-[10px] font-sans uppercase tracking-widest text-[#fbf5e8] font-bold block ml-1">Industry</label>
              <input
                type="text"
                value={form.industry}
                onChange={handleInputChange('industry')}
                placeholder="Fashion · tech · gastronomy..."
                className="w-full p-6 bg-[#171717] border border-[#fbf5e8]/25 hover:border-[#fbf5e8]/50 rounded-sm focus:outline-none focus:border-[#fbf5e8] focus:ring-1 focus:ring-[#fbf5e8] font-sans italic text-xl placeholder:text-[#fbf5e8]/50 text-[#fbf5e8] transition-all"
              />
            </div>

            <div className="md:col-span-2 space-y-4">
              <label className="text-[10px] font-sans uppercase tracking-widest text-[#fbf5e8] font-bold block ml-1">Brand Values</label>
              <input
                type="text"
                value={form.brandValues}
                onChange={handleInputChange('brandValues')}
                placeholder="3-5 values, comma separated"
                className="w-full p-6 bg-[#171717] border border-[#fbf5e8]/25 hover:border-[#fbf5e8]/50 rounded-sm focus:outline-none focus:border-[#fbf5e8] focus:ring-1 focus:ring-[#fbf5e8] font-sans italic text-xl placeholder:text-[#fbf5e8]/50 text-[#fbf5e8] transition-all"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-sans uppercase tracking-widest text-[#fbf5e8] font-bold block ml-1">Tone</label>
              <input
                type="text"
                value={form.tone}
                onChange={handleInputChange('tone')}
                placeholder="3-5 adjectives: bold, warm, editorial..."
                className="w-full p-6 bg-[#171717] border border-[#fbf5e8]/25 hover:border-[#fbf5e8]/50 rounded-sm focus:outline-none focus:border-[#fbf5e8] focus:ring-1 focus:ring-[#fbf5e8] font-sans italic text-xl placeholder:text-[#fbf5e8]/50 text-[#fbf5e8] transition-all"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-sans uppercase tracking-widest text-[#fbf5e8] font-bold block ml-1">Audience</label>
              <textarea
                value={form.audience}
                onChange={(e) => {
                  handleInputChange('audience')(e);
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
                rows={3}
                placeholder="Who is this brand for?"
                className="w-full p-6 bg-[#171717] border border-[#fbf5e8]/25 hover:border-[#fbf5e8]/50 rounded-sm focus:outline-none focus:border-[#fbf5e8] focus:ring-1 focus:ring-[#fbf5e8] font-sans italic text-xl placeholder:text-[#fbf5e8]/50 text-[#fbf5e8] transition-all resize-none overflow-hidden"
              />
            </div>

            <div className="md:col-span-2 space-y-4">
              <label className="text-[10px] font-sans uppercase tracking-widest text-[#fbf5e8] font-bold block ml-1">Strategic Vision</label>
              <textarea
                value={form.vision}
                onChange={(e) => {
                  handleInputChange('vision')(e);
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
                rows={3}
                placeholder="Describe your vision, what you bring to the project, and how you want to execute it..."
                className="w-full p-6 bg-[#171717] border border-[#fbf5e8]/25 hover:border-[#fbf5e8]/50 rounded-sm focus:outline-none focus:border-[#fbf5e8] focus:ring-1 focus:ring-[#fbf5e8] font-sans italic text-xl placeholder:text-[#fbf5e8]/50 text-[#fbf5e8] transition-all resize-none overflow-hidden"
              />
            </div>
          </div>
        </section>
      </div>

      <div className="lg:col-span-4 lg:sticky lg:top-40 h-fit space-y-8">
        <div className="p-10 bg-[#171717] border border-brand-fg/10 rounded-sm space-y-8 text-[#fbf5e8]">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Archetype Neural Core Animation */}
            <div className="relative w-24 h-24">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-brand-fg/20 rounded-full"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 border border-brand-fg/10 rounded-full"
              />
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-6 bg-brand-dark/20 rounded-full flex items-center justify-center border border-brand-fg/20"
              >
                <div className="w-2 h-2 bg-brand-fg rounded-full animate-pulse shadow-[0_0_15px_rgba(var(--brand-fg),0.5)]" />
              </motion.div>
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 3 + i, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  style={{ rotate: i * 90 }}
                  className="absolute top-1/2 left-1/2 w-12 h-[1px] bg-brand-fg/10 origin-left"
                />
              ))}
            </div>

            <div className="space-y-4">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#fbf5e8] block">ARCHETYPE NEURAL CORE</span>
              <p className="text-xs font-sans text-[#fbf5e8]/80 leading-relaxed max-w-sm mx-auto">
                A cross-modal synthesis engine that reads visual references and strategic briefings simultaneously, identifying deep semiotic patterns to construct a coherent brand identity architecture.
              </p>
            </div>
          </div>

          <div className="border-t border-[#fbf5e8]/10 w-full" />

          {/* BUILT ON Section */}
          <div className="space-y-4 text-left w-full">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#fbf5e8]/40 block text-center">BUILT ON</span>
            
            <div className="space-y-3 font-mono text-[11px] w-full">
              <div className="flex justify-between items-center border-b border-[#fbf5e8]/5 pb-2">
                <span className="text-[#fbf5e8]/40 uppercase tracking-widest text-[9px]">MODEL</span>
                <span className="text-[#fbf5e8] font-medium text-right">Gemini Flash 3.5 · Multimodal</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#fbf5e8]/5 pb-2">
                <span className="text-[#fbf5e8]/40 uppercase tracking-widest text-[9px]">METHOD</span>
                <span className="text-[#fbf5e8] font-medium text-right">Constrained Generation</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#fbf5e8]/5 pb-2">
                <span className="text-[#fbf5e8]/40 uppercase tracking-widest text-[9px]">INPUT</span>
                <span className="text-[#fbf5e8] font-medium text-right font-mono">Visual + Semantic · Single Call</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#fbf5e8]/40 uppercase tracking-widest text-[9px]">OUTPUT</span>
                <span className="text-[#fbf5e8] font-medium text-right">Structured JSON · Identity Protocol</span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#fbf5e8]/10 w-full" />

          <p className="text-[10px] font-sans italic text-[#fbf5e8]/50 text-center leading-relaxed w-full">
            No assets are generated. No content is invented.<br />
            Only structure is revealed.
          </p>
          
          <button
            disabled={!isReady}
            onClick={handleAnalyze}
            className="w-full py-5 bg-brand-dark text-brand-fg flex items-center justify-center gap-4 rounded-sm font-bold text-[11px] uppercase tracking-[0.3em] transition-all disabled:opacity-20 hover:bg-brand-fg hover:text-brand-dark group cursor-pointer"
          >
            <span>Execute Synthesis</span>
            <RefreshCcw size={16} className="group-hover:rotate-180 transition-transform duration-1000" />
          </button>
        </div>

        <div className="p-6 border border-brand-fg/5 rounded-sm flex items-center gap-4 text-brand-fg/20">
          <ShieldCheck size={20} className="flex-shrink-0" />
          <p className="text-[9px] font-sans leading-tight uppercase tracking-widest">
            Privacy: Local processing active. Multimodal tokens are discarded post-synthesis.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const LoadingState = ({}: { key?: string }) => {
  const [step, setStep] = useState(0);
  const steps = [
    "Normalizing Multimodal Inputs...",
    "Scanning Visual Semiotics...",
    "Extracting Latent Archetypes...",
    "Constructing Design Rationales...",
    "Finalizing Creative Direction..."
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setStep(s => (s + 1) % steps.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-12 bg-brand-bg relative overflow-hidden text-brand-fg">
      <div className="relative">
        <motion.div 
           animate={{ rotate: 360 }}
           transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
           className="w-64 h-64 border border-brand-fg/10 rounded-full flex flex-wrap"
        >
          <div className="w-1/2 h-1/2 border border-brand-fg/5" />
          <div className="w-1/2 h-1/2 border border-brand-fg/5" />
          <div className="w-1/2 h-1/2 border border-brand-fg/5" />
          <div className="w-1/2 h-1/2 border border-brand-fg/5" />
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [0.95, 1.1, 0.95], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArchetypiaLogo variant="symbol" size="sm" symbolClassName="text-brand-fg" dotClassName="fill-brand-fg" />
          </motion.div>
        </div>
      </div>

      <div className="text-center space-y-6 relative z-10">
        <motion.p 
          key={step}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          className="text-2xl font-sans italic text-brand-fg font-bold"
        >
          {steps[step]}
        </motion.p>
        <div className="w-64 h-[1px] bg-brand-fg/10 mx-auto overflow-hidden">
            <motion.div 
              className="h-full bg-brand-fg"
              animate={{ x: [-256, 256] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            />
        </div>
        <p className="text-[9px] font-sans uppercase tracking-[0.4em] text-brand-fg/20">Synthesis Engine active</p>
      </div>
    </div>
  );
};

const ResultView = ({ dataA, dataB, images, onBack }: { dataA: BrandDirection, dataB: BrandDirection, images: ImageFile[], onBack: () => void; key?: string }) => {
  const [activeDirection, setActiveDirection] = useState<'A' | 'B'>('A');
  const data = activeDirection === 'A' ? dataA : dataB;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-40 pb-20 px-8 bg-brand-bg relative"
    >
      <div className="max-w-[1200px] mx-auto space-y-24">
        {/* Header */}
        <header 
          className={`p-8 md:p-12 rounded-sm transition-all duration-300 ${
            activeDirection === 'A'
              ? 'bg-[#fd3535] border border-[#fd3535] text-[#fbf5e8]'
              : 'bg-[#171717] border-b border-[#fd3535] text-[#fbf5e8]'
          }`}
        >
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="space-y-6 w-full lg:w-auto">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-sm text-[9px] font-sans uppercase tracking-[0.4em] font-bold ${
                activeDirection === 'A'
                  ? 'bg-black/20 text-[#fbf5e8] border border-white/15'
                  : 'bg-[#333333] text-[#fbf5e8] border border-[#fbf5e8]/10'
              }`}>
                Identity Protocol Output
              </div>
              
              {/* Direction Toggle Selector & High Contrast Label */}
              <div className="flex flex-wrap items-center gap-6">
                <div className={`flex p-1 rounded-sm ${activeDirection === 'A' ? 'bg-black/10' : 'bg-black/30'}`}>
                  <button
                    onClick={() => setActiveDirection('A')}
                    className={`px-5 py-3 rounded-sm text-[10px] font-sans font-bold uppercase tracking-[0.3em] transition-all cursor-pointer ${
                      activeDirection === 'A'
                        ? 'bg-[#171717] text-[#fbf5e8]'
                        : 'bg-transparent text-[#fbf5e8]/80 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Direction A
                  </button>
                  <button
                    onClick={() => setActiveDirection('B')}
                    className={`px-5 py-3 rounded-sm text-[10px] font-sans font-bold uppercase tracking-[0.3em] transition-all cursor-pointer ${
                      activeDirection === 'B'
                        ? 'bg-[#171717] text-[#fbf5e8]'
                        : 'bg-transparent text-[#fbf5e8]/80 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Direction B
                  </button>
                </div>

                {/* Big high visibility label */}
                {activeDirection === 'A' ? (
                  <span className="font-mono text-[14px] uppercase tracking-wider px-4 py-2 text-[#fbf5e8] bg-[#fd3535] border border-white/50 rounded-sm font-bold shadow-md">
                    DIRECTION A
                  </span>
                ) : (
                  <span className="font-mono text-[14px] uppercase tracking-wider px-4 py-2 text-[#fd3535] bg-[#171717] border border-[#fd3535] rounded-sm font-bold shadow-md">
                    DIRECTION B
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto justify-end">
              <button 
                onClick={onBack}
                className={`px-6 py-4 rounded-sm transition-all group flex items-center gap-4 text-[10px] font-sans uppercase tracking-widest ${
                  activeDirection === 'A'
                    ? 'bg-[#171717] text-[#fbf5e8] hover:bg-black border border-transparent'
                    : 'bg-transparent text-[#fbf5e8] border border-brand-fg/20 hover:bg-brand-fg/5'
                }`}
              >
                <span>Re-Synthesize</span>
                <RefreshCcw size={14} className="group-hover:rotate-180 transition-transform duration-700" />
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content with fast transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDirection}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-24"
          >
            {/* Title Section */}
            <div className="space-y-12">
              <h1 className="text-7xl md:text-9xl font-sans font-bold leading-none tracking-tight text-brand-fg">
                {data.title}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 text-brand-fg border-t border-brand-fg/5">
                <div className="space-y-2">
                  <p className="text-[9px] font-sans uppercase tracking-widest text-brand-fg/30">Archetypes (Primary & Secondary)</p>
                  <p className="text-xl font-sans font-bold text-brand-fg">
                    <span className="italic">{data.primaryArchetype}</span>
                    <span className="text-[9px] uppercase font-mono px-2 py-0.5 bg-brand-fg/10 rounded-sm ml-2 align-middle font-medium text-brand-fg/70">Primary</span>
                  </p>
                  <p className="text-xl font-sans font-bold text-brand-fg/75">
                    <span className="italic">{data.secondaryArchetype}</span>
                    <span className="text-[9px] uppercase font-mono px-2 py-0.5 bg-brand-fg/5 rounded-sm ml-2 align-middle font-medium text-brand-fg/50">Secondary</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] font-sans uppercase tracking-widest text-brand-fg/30">Strategic Concept</p>
                  <p className="text-xl font-sans text-brand-fg/80">{data.concept}</p>
                </div>
                <div className="space-y-4 border-l border-brand-fg/5 pl-8">
                   <p className="text-[9px] font-sans uppercase tracking-widest text-brand-fg/30">Semantic Core Tags</p>
                   <div className="flex flex-wrap gap-2">
                      {data.semanticKeywords.map(word => (
                        <span key={word} className="px-3 py-1 border border-brand-fg/10 rounded-sm text-[8px] uppercase font-sans tracking-[0.2em] text-brand-fg/60">{word}</span>
                      ))}
                   </div>
                </div>
              </div>
            </div>

            {/* Archetype Positioning */}
            <ArchetypePositioning 
              positioning={data.archetypePositioning} 
              primaryDefault={data.primaryArchetype} 
              secondaryDefault={data.secondaryArchetype} 
            />

            {/* Interpreted Moodboard */}
            {data.moodboardAnalysis && (
              <section className="space-y-12">
                <div className="flex items-center gap-4 text-brand-fg">
                  <Sparkles size={20} className="text-brand-dark" />
                  <h2 className="text-4xl font-sans font-bold italic text-brand-fg">Interpreted Moodboard</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {data.moodboardAnalysis.map((item, i) => (
                    <div 
                      key={i} 
                      className="bg-[#171717] border border-brand-fg/10 rounded-sm overflow-hidden flex flex-col group"
                    >
                      <div className="aspect-video relative overflow-hidden">
                        {images[i] && <img src={images[i].url} alt={`Analysis ${i}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />}
                      </div>
                      <div className="p-8 space-y-6 flex-grow flex flex-col">
                        <p className="text-[#fbf5e8] font-sans text-sm leading-relaxed opacity-80">
                          {item.visualReading}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {item.keyTraits.map((trait, j) => (
                            <span key={j} className="px-3 py-1 border border-[#fbf5e8]/30 rounded-full text-[9px] uppercase tracking-widest text-[#fbf5e8]">
                              {trait}
                            </span>
                          ))}
                        </div>
                        <p className="text-[#fbf5e8] font-sans font-bold italic text-xs mt-auto pt-4 border-t border-[#fbf5e8]/10">
                          {item.contribution}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Content Content Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
              <div className="lg:col-span-7 space-y-16">
                <section className="space-y-8">
                  <div className="flex items-center gap-4 text-brand-fg">
                    <Target size={20} className="text-brand-dark" />
                    <h2 className="text-4xl font-sans font-bold italic">Visual Territory</h2>
                  </div>
                  <p className="text-3xl text-brand-fg/90 font-sans leading-relaxed italic">
                    {data.visualTerritory.description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                    {data.visualTerritory.keyTraits.map((trait, i) => (
                      <div key={i} className="p-8 bg-brand-dark border border-brand-fg/5 rounded-sm hover:border-brand-fg/30 transition-all group">
                        <span className="block text-[10px] font-sans text-brand-fg mb-4 tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">PILLAR_0{i+1}</span>
                        <span className="font-sans text-2xl font-bold text-brand-fg">{trait}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-8 p-12 bg-brand-dark border border-brand-fg/10 rounded-sm relative group overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-fg/5 blur-[100px] rounded-full group-hover:bg-brand-fg/10 transition-all duration-1000" />
                  <div className="flex items-center gap-4 relative z-10 text-brand-fg">
                    <Sparkles size={20} className="text-brand-fg" />
                    <h2 className="text-4xl font-sans font-bold italic">Artistic Justification</h2>
                  </div>
                  <p className="text-xl leading-relaxed text-brand-fg/60 font-sans italic relative z-10">
                    "{data.artisticJustification}"
                  </p>
                </section>
              </div>

              <div className="lg:col-span-5 space-y-16">
                <section className="space-y-8">
                  <div className="flex items-center gap-4 text-brand-fg">
                    <Palette size={20} className="text-brand-dark" />
                    <h3 className="text-[10px] font-sans uppercase tracking-[0.4em] font-bold text-brand-fg/30">Color DNA</h3>
                  </div>
                  <div className="space-y-6">
                    {data.colorPalette.map((color, i) => (
                      <div key={i} className="group p-6 bg-brand-dark border border-brand-fg/5 rounded-sm">
                        <div className="flex items-center gap-6 mb-4">
                           <div className="w-16 h-16 rounded-sm shadow-2xl flex-shrink-0 transition-transform group-hover:scale-105 border border-brand-fg/10" style={{ backgroundColor: color.hex }} />
                           <div className="space-y-1">
                              <p className="font-mono text-[10px] text-brand-fg tracking-widest">{color.hex}</p>
                              <p className="text-lg font-sans font-bold uppercase tracking-[0.1em] text-brand-fg">{color.name}</p>
                           </div>
                        </div>
                        <p className="text-[11px] font-sans text-brand-fg/40 leading-relaxed border-l-2 border-brand-fg/5 pl-6 group-hover:border-brand-fg group-hover:text-brand-fg/80 transition-all">{color.rationale}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-8 pt-16 border-t border-brand-fg/5">
                  <div className="flex items-center gap-4 text-brand-fg">
                    <TypeIcon size={20} className="text-brand-dark" />
                    <h3 className="text-[10px] font-sans uppercase tracking-[0.4em] font-bold text-brand-fg/30">Typography Strategy</h3>
                  </div>
                  <div className="space-y-10">
                    <div className="group p-8 bg-brand-dark border border-brand-fg/5 rounded-sm">
                      <p className="text-[9px] font-sans text-brand-fg/20 uppercase tracking-widest mb-4">Display / Identity</p>
                      <p className="text-5xl font-sans font-bold italic text-brand-fg group-hover:text-brand-fg transition-colors">{data.typographyStrategy.primaryFamily}</p>
                    </div>
                    <div className="group p-8 bg-brand-dark border border-brand-fg/5 rounded-sm">
                      <p className="text-[9px] font-sans text-brand-fg/20 uppercase tracking-widest mb-4">Body / Structural</p>
                      <p className="text-2xl font-sans font-normal tracking-tight text-brand-fg/80">{data.typographyStrategy.secondaryFamily}</p>
                    </div>
                    <div className="bg-brand-dark p-8 border border-brand-fg/5 rounded-sm">
                       <p className="text-[11px] font-sans text-brand-fg/40 italic leading-relaxed">
                        {data.typographyStrategy.justification}
                       </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <footer className="pt-24 border-t border-brand-fg/5 flex flex-col md:flex-row justify-between items-center gap-12">
                <div className="flex items-center gap-6">
                  <div className="flex -space-x-4">
                     <div className="w-16 h-16 rounded-sm border border-brand-fg/30 bg-brand-dark flex items-center justify-center text-brand-fg font-sans text-3xl font-bold italic">{activeDirection}</div>
                     <div className="w-16 h-16 rounded-sm border border-brand-fg/10 bg-brand-dark/20 flex items-center justify-center text-brand-fg/20 font-mono text-xs">2.4</div>
                  </div>
                  <div className="text-[9px] font-sans uppercase tracking-[0.2em] text-brand-fg/30 leading-relaxed">
                      <p>Multimodal Cognitive Synthesis</p>
                      <p className="text-brand-fg font-bold">Identity Lock: Active</p>
                  </div>
                </div>
                <button className="flex items-center gap-4 px-10 py-5 bg-brand-dark text-brand-fg rounded-sm font-bold uppercase tracking-[0.3em] text-[11px] group hover:bg-brand-fg hover:text-brand-dark border border-brand-fg/10 transition-all active:scale-95">
                    <FileText size={18} />
                    <span>Export Blueprint</span>
                </button>
            </footer>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const ProfileView = ({ onBack }: { onBack: () => void; key?: string }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen pt-40 pb-20 px-8 flex justify-center bg-brand-bg transition-colors duration-500"
    >
      <div className="max-w-xl w-full space-y-12">
        {/* Header / Avatar */}
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="flex justify-center mb-2 opacity-80">
            <ArchetypiaLogo variant="symbol" size="sm" symbolClassName="text-brand-fg" dotClassName="fill-brand-fg" />
          </div>
          <div className="w-24 h-24 rounded-full bg-brand-dark border-2 border-brand-fg/20 flex items-center justify-center text-3xl font-sans font-bold text-brand-fg shadow-2xl">
            JD
          </div>
          <div className="space-y-1">
            <h2 className="text-3xl font-sans font-bold text-brand-fg">John Doe</h2>
            <p className="text-brand-fg/40 font-sans text-sm">john.doe@archetypia.ai</p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {/* Plan Section */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-sans uppercase tracking-[0.3em] text-brand-fg opacity-40">Plan</h3>
            <div className="p-6 bg-brand-dark/5 border border-brand-fg/10 rounded-sm flex justify-between items-center">
              <span className="font-sans text-lg text-brand-fg">Current Plan</span>
              <span className="px-3 py-1 bg-brand-dark text-brand-fg text-[10px] font-bold uppercase tracking-widest border border-brand-fg/20 rounded-full">
                Beta Access
              </span>
            </div>
          </section>

          {/* Token Usage Section */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-sans uppercase tracking-[0.3em] text-brand-fg opacity-40">Token Usage</h3>
            <div className="p-6 bg-brand-dark/5 border border-brand-fg/10 rounded-sm space-y-4">
              <div className="flex justify-between items-end">
                <span className="font-sans text-brand-fg text-sm">Syntheses Capacity</span>
                <span className="font-mono text-[10px] text-brand-fg/60">3,200 / 10,000</span>
              </div>
              <div className="h-[2px] w-full bg-brand-fg/10 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "32%" }}
                  className="h-full bg-brand-fg"
                />
              </div>
            </div>
          </section>

          {/* Account Section */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-sans uppercase tracking-[0.3em] text-brand-fg opacity-40">Account</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border border-brand-fg/10 rounded-sm font-sans text-[10px] uppercase tracking-widest text-brand-fg hover:bg-brand-fg/5 transition-colors text-left flex items-center justify-between">
                Edit Profile
                <ChevronRight size={14} className="opacity-40" />
              </button>
              <button className="p-4 border border-brand-fg/10 rounded-sm font-sans text-[10px] uppercase tracking-widest text-brand-fg hover:bg-brand-fg/5 transition-colors text-left flex items-center justify-between">
                Change Password
                <ChevronRight size={14} className="opacity-40" />
              </button>
            </div>
          </section>

          {/* Support Section */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-sans uppercase tracking-[0.3em] text-brand-fg opacity-40">Support</h3>
            <div className="p-6 bg-brand-dark/5 border border-brand-fg/10 rounded-sm flex justify-between items-center">
              <span className="font-sans text-sm text-brand-fg">Need help?</span>
              <a 
                href="mailto:archetypia.support@gmail.com" 
                className="font-sans text-xs text-brand-fg border-b border-brand-fg/20 hover:border-brand-fg transition-colors"
              >
                archetypia.support@gmail.com
              </a>
            </div>
          </section>

          {/* Sign Out */}
          <button className="w-full py-5 bg-brand-dark text-brand-fg rounded-sm font-bold uppercase tracking-[0.3em] text-[11px] hover:bg-brand-fg hover:text-brand-dark transition-all flex items-center justify-center gap-4">
            <LogOut size={16} />
            Sign Out
          </button>

          <button 
            onClick={onBack}
            className="w-full py-4 text-[10px] font-sans uppercase tracking-widest text-brand-fg/40 hover:text-brand-fg transition-colors mt-8"
          >
            ← Return to Hub
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const PreAnalysisView = ({ 
  briefing, 
  onConfirm, 
  onBack 
}: { 
  briefing: string; 
  onConfirm: (finalBrief: string) => void; 
  onBack: () => void; 
  key?: string;
}) => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>(['', '', '']);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  React.useEffect(() => {
    let active = true;
    async function load() {
      try {
        const qList = await generateRefinementQuestions(briefing);
        if (!active) return;
        if (qList && qList.length === 3) {
          setQuestions(qList);
          setIsLoading(false);
        } else {
          setIsError(true);
          setIsLoading(false);
        }
      } catch (err) {
        if (!active) return;
        setIsError(true);
        setIsLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [briefing]);

  const handleAnswerChange = (index: number, val: string) => {
    setAnswers(prev => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const allAnswered = answers.every(a => a.trim().length > 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen pt-40 pb-20 px-8 flex justify-center bg-brand-bg transition-colors duration-500"
    >
      <div className="max-w-xl w-full space-y-12">
        <div className="text-center space-y-4">
          <span className="text-[10px] font-sans uppercase tracking-[0.3em] font-bold text-brand-fg/50 block">REFINEMENT PROTOCOL</span>
          <h2 className="text-3xl font-sans font-bold italic text-white uppercase tracking-wider">Semantic Calibration</h2>
          <p className="text-xs font-sans text-brand-fg/60 max-w-sm mx-auto">
            Our virtual art director requires custom calibration to maximize visual and tactical precision.
          </p>
        </div>

        <div className="space-y-8 p-8 bg-brand-fg/[0.03] border border-brand-fg/10 rounded-sm">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <RefreshCcw className="animate-spin text-brand-fg opacity-60" size={24} />
              <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-brand-fg/60">Decoding briefing semantics...</p>
              <p className="text-[9px] font-sans italic text-brand-fg/30 text-center">Formulating three key refinement questions based on your profile...</p>
            </div>
          ) : isError ? (
            <div className="py-8 text-center space-y-6">
              <p className="text-xs font-sans text-brand-fg/60">The refinement protocol could not be generated at this moment. You may proceed directly to the full synthesis.</p>
              <button
                onClick={() => onConfirm(briefing)}
                className="w-full py-5 bg-brand-dark text-brand-fg rounded-sm font-bold uppercase tracking-[0.3em] text-[11px] hover:bg-brand-fg hover:text-brand-dark transition-all flex items-center justify-center gap-4 border border-brand-fg/10"
              >
                Skip Refinement & Synthesize
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {questions.map((q, i) => (
                <div key={i} className="space-y-3">
                  <label className="text-[11px] font-sans uppercase tracking-wider text-[#fbf5e8] font-bold block">
                    <span className="text-[#fbf5e8]/60 font-mono mr-1">0{i + 1}.</span> {q}
                  </label>
                  <input
                    type="text"
                    value={answers[i]}
                    onChange={(e) => handleAnswerChange(i, e.target.value)}
                    placeholder="Provide refining details..."
                    className="w-full p-4 bg-[#171717] border border-[#fbf5e8]/25 hover:border-[#fbf5e8]/50 rounded-sm focus:outline-none focus:border-[#fbf5e8] focus:ring-1 focus:ring-[#fbf5e8] font-sans text-sm text-[#fbf5e8] transition-all placeholder:text-[#fbf5e8]/50"
                  />
                </div>
              ))}

              <div className="pt-4 space-y-4">
                <button
                  disabled={!allAnswered}
                  onClick={() => {
                    const combined = `${briefing}\n\nREFINEMENT RESPONSES:\n1. Question: ${questions[0]}\nAnswer: ${answers[0]}\n2. Question: ${questions[1]}\nAnswer: ${answers[1]}\n3. Question: ${questions[2]}\nAnswer: ${answers[2]}`;
                    onConfirm(combined);
                  }}
                  className="w-full py-5 bg-brand-dark text-brand-fg rounded-sm font-bold uppercase tracking-[0.3em] text-[11px] hover:bg-brand-fg hover:text-brand-dark transition-all flex items-center justify-center gap-4 disabled:opacity-20 disabled:pointer-events-none"
                >
                  Continue Synthesis
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={onBack}
          className="w-full py-4 text-[10px] font-sans uppercase tracking-widest text-brand-fg/40 hover:text-brand-fg transition-colors text-center block"
        >
          ← Return to Briefing
        </button>
      </div>
    </motion.div>
  );
};

const MethodView = ({ onBack }: { onBack: () => void; key?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-brand-bg text-brand-fg selection:bg-brand-fg selection:text-brand-bg relative overflow-x-hidden pt-32 pb-24 px-6 md:px-12 flex flex-col items-center"
    >
      <div className="max-w-4xl w-full space-y-40">
        
        {/* Section 1: Hero */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="min-h-[80vh] flex flex-col justify-center items-center text-center space-y-12 py-12"
        >
          {/* Animated concentric circles */}
          <div className="relative w-[180px] h-[180px] mx-auto">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border border-brand-fg/20 rounded-full"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-6 border border-dashed border-brand-fg/35 rounded-full"
            />
            <motion.div 
              animate={{ rotate: 180 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute inset-12 border border-brand-fg/50 rounded-full"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArchetypiaLogo variant="symbol" size="sm" symbolClassName="text-brand-fg drop-shadow-[0_0_12px_rgba(251,245,232,0.4)]" dotClassName="fill-brand-fg" />
              </motion.div>
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl md:text-8xl font-sans font-bold leading-none tracking-tight">
              Not magic. <span className="text-brand-dark">Reasoning.</span>
            </h1>
            <p className="text-lg md:text-xl font-sans italic max-w-2xl mx-auto leading-relaxed text-brand-fg/90">
              Archetypia is an AI-powered virtual art director designed to assist in the early stages of branding, not as a replacement for human designers.
            </p>
          </div>

          <div className="pt-4">
            <span className="font-mono text-xs uppercase tracking-[0.3em] bg-brand-dark text-brand-fg px-4 py-2 rounded-sm border border-brand-fg/10">
              MANIFESTO · BUILD v0.3
            </span>
          </div>
        </motion.section>

        {/* Section 2: WHAT IT IS */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="space-y-8 border-t border-brand-fg/10 pt-16"
        >
          <div className="space-y-2">
            <span className="font-mono text-xs text-brand-fg/50 uppercase tracking-[0.3em] block">01. WHAT IT IS</span>
            <h2 className="text-3xl md:text-5xl font-sans font-bold uppercase tracking-wide italic">Structure over Happenstance</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-brand-fg/85 font-sans leading-relaxed text-sm md:text-base">
            <div className="space-y-6">
              <p>
                Archetypia receives direct visual reference files and a structured creative brief. Unifying both contexts into a single conceptual matrix, the system processes the inputs through its identity synthesis engine, named <strong className="text-white">Archetype Neural Core</strong>.
              </p>
              <p>
                As a result of this decoding, the protocol produces an integrated design framework encompassing a justified color palette, cohesive typographic strategies, primary and secondary brand archetypes, a detailed visual territory, a moodboard analysis, and a unified creative rationale.
              </p>
            </div>
            <div className="space-y-6 p-6 bg-brand-dark/30 border border-brand-fg/10 rounded-sm">
              <p className="italic text-brand-fg">
                "Intuition is highly valuable, but identity requires a structured foundation to evolve into a reproducible design system."
              </p>
              <p className="text-xs">
                It is crucial to emphasize that <strong className="text-white">Archetypia does not generate raw graphic assets or final brand files</strong>. Instead, it acts as a cognitive design blueprint to lay the conceptual foundations, structure early creative ideas, and resolve blank-page paralysis for the human creator.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Section 3: FOR WHOM */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="space-y-12 border-t border-brand-fg/10 pt-16"
        >
          <div className="space-y-2">
            <span className="font-mono text-xs text-brand-fg/50 uppercase tracking-[0.3em] block">02. FOR WHOM</span>
            <h2 className="text-3xl md:text-5xl font-sans font-bold uppercase tracking-wide italic">Creative Synergies</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-brand-dark border border-brand-fg/10 rounded-sm hover:border-brand-fg/45 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-6 min-h-[220px]">
              <span className="font-mono text-xs text-brand-bg">01 // JUNIOR/FREE</span>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Juniors & Freelancers</h3>
                <p className="text-xs text-brand-fg/70 leading-relaxed">
                  Independent professionals working solo who require a visual sparring partner to validate design decisions and gain conceptual confidence.
                </p>
              </div>
            </div>

            <div className="p-8 bg-brand-dark border border-brand-fg/10 rounded-sm hover:border-brand-fg/45 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-6 min-h-[220px]">
              <span className="font-mono text-xs text-brand-bg">02 // MULTIDISCIPLINE</span>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Horizontal Creatives</h3>
                <p className="text-xs text-brand-fg/70 leading-relaxed">
                  Multi-hyphenate practitioners operating across creative mediums who need to rapidly distill abstract ideas into organized, logical brand frameworks.
                </p>
              </div>
            </div>

            <div className="p-8 bg-brand-dark border border-brand-fg/10 rounded-sm hover:border-brand-fg/45 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-6 min-h-[220px]">
              <span className="font-mono text-xs text-brand-bg">03 // STARTUPS</span>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Emerging Brands</h3>
                <p className="text-xs text-brand-fg/70 leading-relaxed">
                  Early-stage ventures that need to establish cohesive and rigorous design pillars without the immediate overhead of a legacy design agency.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section 4: HOW IT WORKS */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="space-y-8 border-t border-brand-fg/10 pt-16"
        >
          <div className="space-y-2">
            <span className="font-mono text-xs text-brand-fg/50 uppercase tracking-[0.3em] block">03. HOW IT WORKS</span>
            <h2 className="text-3xl md:text-5xl font-sans font-bold uppercase tracking-wide italic">The Engine Under the Hood</h2>
          </div>

          <div className="bg-brand-dark border border-brand-fg/10 p-8 rounded-sm space-y-8 text-sm md:text-base text-brand-fg/80 leading-relaxed">
            <p>
              Archetypia operates via a hybrid architecture. The core intelligence is systematically curated using structured prompt engineering designed around Google Gemini LLMs through the official SDK integrations.
            </p>
            <p>
              The client application is built on a React and TypeScript architecture. It processes raw visual reference files as base64 strings and synthesizes them with qualitative parameters gathered throughout the conversational calibration steps.
            </p>
            <div className="border-t border-brand-fg/15 pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-brand-fg/40 uppercase block">System Architecture</span>
                <span>Gemini API (Serverless SDK) + Tailwind Core CSS</span>
              </div>
              <div className="space-y-1">
                <span className="text-brand-fg/40 uppercase block">Development Lifecycle</span>
                <span>Iterative Incremental (Current: Build v0.3 / Refinement + Dual Direction Path)</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section 5: Closing & Footer */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8 py-20 border-t border-brand-fg/10"
        >
          <h2 className="text-4xl md:text-6xl font-sans font-bold uppercase tracking-tight italic max-w-2xl mx-auto leading-tight text-white">
            A reasoning layer for visual identity.
          </h2>
          
          <button
            onClick={onBack}
            className="px-8 py-4 bg-brand-dark text-brand-fg border border-brand-fg/10 hover:bg-brand-fg hover:text-brand-dark transition-all rounded-sm text-[10px] font-sans uppercase tracking-[0.3em] font-bold cursor-pointer"
          >
            Back to Start
          </button>

          <p className="text-[10px] font-mono tracking-widest text-brand-fg/40 uppercase pt-12">
            © 2026 ARCHETYPIA · UNDERGRADUATE THESIS PROJECT (TFG). ALL SPECIFICATIONS ACTIVE.
          </p>
        </motion.section>

      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function CreativeDirectionApp() {
  const [state, setState] = useState<AppState>('landing');
  const [resultA, setResultA] = useState<BrandDirection | null>(null);
  const [resultB, setResultB] = useState<BrandDirection | null>(null);
  const [imagesUsed, setImagesUsed] = useState<ImageFile[]>([]);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('archetypia-theme');
    if (saved) return saved === 'dark';
    return false;
  });

  React.useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('archetypia-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const [rawBriefing, setRawBriefing] = useState('');

  const handleStartPreAnalysis = (brief: string, images: ImageFile[]) => {
    setRawBriefing(brief);
    setImagesUsed(images);
    setState('pre-analysis');
  };

  const handleFinishAnalysis = async (finalBrief: string) => {
    setState('analyzing');
    const briefA = `${finalBrief}\n\nGenerate the most coherent and natural creative direction based on the inputs. Call this direction A.`;
    const briefB = `${finalBrief}\n\nGenerate a creative direction that is intentionally opposite to direction A in aesthetic territory while still being faithful to the core briefing. The color palette must occupy a clearly different chromatic family from direction A (if A is warm, B must be cool; if A is muted, B must be saturated; if A is dark, B must be light). The typography pairing must follow a different categorical logic (if A pairs serif with sans, B should pair display with grotesque, or geometric with humanist, or any clearly distinct combination). The brand archetypes (primary and secondary) must be different from A. The visual territory and mood must explore a contrasting emotional register. Both directions must remain coherent and professionally justified, but they must feel like two genuinely different creative routes a designer could take, not two variations of the same idea. Call this direction B.`;
    
    const imagesPayload = imagesUsed.map(img => ({ data: img.base64, mimeType: img.mimeType }));

    try {
      const [resA, resB] = await Promise.all([
        analyzeBrandIdentity(briefA, imagesPayload),
        analyzeBrandIdentity(briefB, imagesPayload)
      ]);
      
      if (resA && resB) {
        setResultA(resA);
        setResultB(resB);
        setState('result');
      } else {
        alert("Synthesis failed. Please try again with different inputs.");
        setState('workspace');
      }
    } catch (error) {
      console.error("Analysis failure:", error);
      alert("Synthesis failed. Please try again with different inputs.");
      setState('workspace');
    }
  };

  return (
    <>
      <Navbar 
        onReset={() => setState('landing')} 
        onProfile={() => setState('profile')}
        isDark={isDark} 
        toggleTheme={toggleTheme} 
        onMethod={() => setState('method')}
      />
      
      <main className="relative z-10 transition-colors duration-500">
        <AnimatePresence mode="wait">
          {state === 'landing' && (
            <Landing key="landing" onStart={() => setState('workspace')} />
          )}

          {state === 'workspace' && (
            <Workspace key="workspace" onAnalyze={handleStartPreAnalysis} />
          )}

          {state === 'pre-analysis' && (
            <PreAnalysisView 
              key="pre-analysis"
              briefing={rawBriefing}
              onConfirm={handleFinishAnalysis}
              onBack={() => setState('workspace')}
            />
          )}

          {state === 'analyzing' && (
            <LoadingState key="analyzing" />
          )}

          {state === 'result' && resultA && resultB && (
            <ResultView key="result" dataA={resultA} dataB={resultB} images={imagesUsed} onBack={() => setState('workspace')} />
          )}

          {state === 'profile' && (
            <ProfileView key="profile" onBack={() => setState('landing')} />
          )}

          {state === 'method' && (
            <MethodView key="method" onBack={() => setState('landing')} />
          )}
        </AnimatePresence>
      </main>

      {/* Aesthetic Accents */}
      <div className="fixed bottom-12 right-0 vertical-text font-sans text-[9px] tracking-[0.5em] text-brand-fg/10 uppercase select-none z-0">
        Structural Core Mapping // ARCHE_CORE_v2.4
      </div>
      <div className="fixed top-1/2 left-4 -translate-y-1/2 flex flex-col gap-8 opacity-10 pointer-events-none z-0">
        <div className="w-[1px] h-32 bg-brand-fg rounded-full" />
        <div className="w-1 h-1 bg-brand-dark rounded-full" />
        <div className="w-[1px] h-32 bg-brand-fg rounded-full" />
      </div>
    </>
  );
}
