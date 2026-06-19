import type { AIProvider } from './types';
import { ACTIVE_PROVIDER } from './config';
import { deepseekProvider } from './providers/deepseek';
import { geminiProvider } from './providers/gemini';
import { groqProvider } from './providers/groq';
import { notebooklmProvider } from './providers/notebooklm';

export type { AIProvider, GenerateRequest, ModelTier } from './types';

// Registry of available providers. To add Claude (or any other), implement
// ./providers/claude.ts and register it here.
const PROVIDERS: Record<string, AIProvider> = {
  deepseek: deepseekProvider,
  groq: groqProvider,
  gemini: geminiProvider,
  notebooklm: notebooklmProvider,
};

// Provider ativo selecionável em RUNTIME (toggle na UI), persistido em
// localStorage. ACTIVE_PROVIDER (config) é só o padrão inicial.
const PROVIDER_KEY = 'bep-ai:ai-provider';
let activeId: string =
  (typeof localStorage !== 'undefined' && localStorage.getItem(PROVIDER_KEY)) || ACTIVE_PROVIDER;

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
