import type { AIProvider } from './types';
import { ACTIVE_PROVIDER } from './config';
import { notebooklmProvider } from './providers/notebooklm';

export type { AIProvider, GenerateRequest, ModelTier } from './types';

// Único provider: NotebookLM. (Para adicionar outro, implemente
// ./providers/<nome>.ts e registre aqui.)
const PROVIDERS: Record<string, AIProvider> = {
  notebooklm: notebooklmProvider,
};

// Provider ativo, persistido em localStorage. Guard: se o valor salvo apontar
// para um provider que não existe mais (ex.: 'deepseek' de versões antigas),
// cai no ACTIVE_PROVIDER.
const PROVIDER_KEY = 'bep-ai:ai-provider';
let activeId: string =
  (typeof localStorage !== 'undefined' && localStorage.getItem(PROVIDER_KEY)) || ACTIVE_PROVIDER;
if (!PROVIDERS[activeId]) activeId = ACTIVE_PROVIDER;

export function getActiveProviderId(): string {
  return activeId;
}

export function setActiveProvider(id: string): void {
  if (!PROVIDERS[id]) return;
  activeId = id;
  try {
    localStorage.setItem(PROVIDER_KEY, id);
  } catch {
    /* ignore */
  }
}

export function listProviderIds(): string[] {
  return Object.keys(PROVIDERS);
}

function current(): AIProvider {
  return PROVIDERS[activeId] ?? PROVIDERS[ACTIVE_PROVIDER];
}

// Proxy: mantém os call sites existentes (`aiProvider.generate(...)`) intactos e
// despacha sempre para o provider ativo no momento da chamada.
export const aiProvider: AIProvider = new Proxy({} as AIProvider, {
  get(_target, prop) {
    const p = current() as any;
    const v = p[prop];
    return typeof v === 'function' ? v.bind(p) : v;
  },
});

/** True when the active provider is ready to make calls. */
export function isAIConfigured(): boolean {
  return current()?.isConfigured() ?? false;
}

/** Strip accidental ```json fences and parse. Throws on invalid JSON. */
export function parseJSON<T = unknown>(raw: string): T {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/, '')
    .trim();
  return JSON.parse(cleaned) as T;
}
