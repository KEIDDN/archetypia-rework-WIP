import type { CreativeBrief } from './brief/types';

export interface Project {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  brief: CreativeBrief;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
}
