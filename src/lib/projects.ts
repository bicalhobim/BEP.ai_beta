import type { BlockData } from '../store/bepStore';

// Armazenamento de projetos no navegador (localStorage). Cada projeto é um JSON
// próprio; um índice lista os projetos existentes. Isso substitui a persistência
// global única (que fazia o app recarregar sempre o mesmo BEP).

export interface ProjectMeta {
  id: string;
  name: string;
  updatedAt: number;
}

export interface ProjectData extends ProjectMeta {
  blocks: BlockData[];
  isoContext: string;
}

const INDEX_KEY = 'bep-ai:projects';
const dataKey = (id: string) => `bep-ai:project:${id}`;

export function listProjectsMeta(): ProjectMeta[] {
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    const list: ProjectMeta[] = raw ? JSON.parse(raw) : [];
    return list.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

function writeIndex(list: ProjectMeta[]): void {
  try {
    localStorage.setItem(INDEX_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Falha ao salvar índice de projetos:', e);
  }
}

export function readProjectData(id: string): ProjectData | null {
  try {
    const raw = localStorage.getItem(dataKey(id));
    return raw ? (JSON.parse(raw) as ProjectData) : null;
  } catch {
    return null;
  }
}

/** Grava os dados do projeto e atualiza (upsert) o índice. */
export function writeProjectData(p: ProjectData): void {
  try {
    localStorage.setItem(dataKey(p.id), JSON.stringify(p));
    const meta: ProjectMeta = { id: p.id, name: p.name, updatedAt: p.updatedAt };
    const list = listProjectsMeta().filter((m) => m.id !== p.id);
    list.push(meta);
    writeIndex(list);
  } catch (e) {
    console.error('Falha ao salvar projeto:', e);
  }
}

export function deleteProjectData(id: string): void {
  try {
    localStorage.removeItem(dataKey(id));
    writeIndex(listProjectsMeta().filter((m) => m.id !== id));
  } catch (e) {
    console.error('Falha ao excluir projeto:', e);
  }
}
