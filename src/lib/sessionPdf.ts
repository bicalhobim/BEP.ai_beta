// Persistência do documento importado (texto extraído do PDF) na sessão do
// navegador. Usa sessionStorage: sobrevive a reloads/F5 e navegação, e some quando
// a aba/navegador é fechada. Guarda só o texto (o que a IA usa), não o binário.

const KEY = 'bep-ai:pdf-context';

export interface SessionPdf {
  text: string;
  fileName: string;
}

export function readSessionPdf(): SessionPdf | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return { text: parsed.text ?? '', fileName: parsed.fileName ?? '' };
  } catch {
    return null;
  }
}

export function writeSessionPdf(text: string, fileName: string): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ text, fileName }));
  } catch (e) {
    // Quota (~5MB) ou storage indisponível: não quebra o fluxo de importação.
    console.error('Falha ao salvar contexto do PDF na sessão:', e);
  }
}

export function clearSessionPdf(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
