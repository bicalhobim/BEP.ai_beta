import type { AIProvider, GenerateRequest } from '../types';

// Provider que consulta o NotebookLM através da ponte local (plugin do Vite em
// /api/notebooklm). Mesma origem do app, então é só fetch — sem CORS.
//
// Limitado a CONSULTA: usa apenas `ask`/`list`. A fonte (edital) vive dentro do
// notebook do NotebookLM; o app só pergunta e preenche as seções com a resposta.

const BRIDGE = '/api/notebooklm';
const NB_KEY = 'bep-ai:notebooklm-id';

let notebookId: string =
  (typeof localStorage !== 'undefined' && localStorage.getItem(NB_KEY)) || '';

export function setNotebookId(id: string): void {
  notebookId = id;
  try {
    localStorage.setItem(NB_KEY, id);
  } catch {
    /* ignore */
  }
}

export function getNotebookId(): string {
  return notebookId;
}

export interface NotebookInfo {
  id: string;
  title: string;
}

/** Lista os notebooks da conta autenticada no CLI. */
export async function listNotebooks(): Promise<NotebookInfo[]> {
  const res = await fetch(`${BRIDGE}/notebooks`);
  if (!res.ok) {
    const detail = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(detail.error || 'Falha ao listar notebooks.');
  }
  const data = await res.json();
  return data.notebooks ?? [];
}

/** Verifica se a ponte responde e se o CLI está instalado. */
export async function bridgeHealth(): Promise<{ ok: boolean; cliFound: boolean }> {
  try {
    const res = await fetch(`${BRIDGE}/health`);
    if (!res.ok) return { ok: false, cliFound: false };
    return await res.json();
  } catch {
    return { ok: false, cliFound: false };
  }
}

/** CLI instalado? Já autenticado no Google? */
export async function bridgeStatus(): Promise<{ cliFound: boolean; authenticated: boolean }> {
  try {
    const res = await fetch(`${BRIDGE}/status`);
    if (!res.ok) return { cliFound: false, authenticated: false };
    return await res.json();
  } catch {
    return { cliFound: false, authenticated: false };
  }
}

/** Dispara o login (o CLI abre o Chromium). Resolve quando o OAuth conclui. */
export async function loginNotebookLM(): Promise<void> {
  const res = await fetch(`${BRIDGE}/login`, { method: 'POST' });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(detail.error || 'Falha no login do NotebookLM.');
  }
}

// Remove marcadores de citação ([1], [2]...) que o NotebookLM insere no texto e
// que quebrariam o JSON.parse das seções.
function stripCitations(s: string): string {
  return s.replace(/\s*\[\d+\]/g, '');
}

export const notebooklmProvider: AIProvider = {
  id: 'notebooklm',

  isConfigured() {
    return Boolean(notebookId);
  },

  async generate({ prompt, system, json }: GenerateRequest): Promise<string> {
    if (!notebookId) {
      throw new Error('Nenhum projeto do NotebookLM selecionado. Conecte e escolha um notebook.');
    }
    // NotebookLM não separa "system": concatena a persona ao prompt.
    const fullPrompt = system ? `${system}\n\n${prompt}` : prompt;

    const res = await fetch(`${BRIDGE}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notebookId, prompt: fullPrompt }),
    });

    if (!res.ok) {
      const detail = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(`NotebookLM: ${detail.error || res.status}`);
    }

    const data = await res.json();
    const answer: string = data.answer ?? '';
    return json ? stripCitations(answer) : answer;
  },
};
