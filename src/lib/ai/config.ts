// ────────────────────────────────────────────────────────────────────────
// Central AI configuration.
//
// O app roda 100% no NotebookLM: a fonte (edital/EIR/normas) vive dentro do
// notebook conectado e a ponte local (plugin do Vite em /api/notebooklm)
// consulta esse notebook. Não há chave de IA por env — a autenticação é feita
// pelo CLI/ponte do NotebookLM.
// ────────────────────────────────────────────────────────────────────────

/** Único provider ativo. */
export const ACTIVE_PROVIDER = 'notebooklm' as const;
