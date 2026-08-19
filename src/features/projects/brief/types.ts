export interface CreativeBrief {
  context: string;
  objective: string;
  audience: string;
  personality: string;
  positioning: string;
  constraints: string;
}

export const emptyCreativeBrief: CreativeBrief = {
  context: '',
  objective: '',
  audience: '',
  personality: '',
  positioning: '',
  constraints: ''
};

export function normalizeBrief(raw: unknown): CreativeBrief {
  if (!raw || typeof raw !== 'object') return { ...emptyCreativeBrief };
  return { ...emptyCreativeBrief, ...(raw as Partial<CreativeBrief>) };
}

export function isBriefEmpty(brief: CreativeBrief): boolean {
  return Object.values(brief).every((value) => value.trim().length === 0);
}
