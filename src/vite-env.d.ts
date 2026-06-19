/// <reference types="vite/client" />

// O app roda 100% no NotebookLM (autenticação via ponte/CLI). Sem variáveis de
// ambiente de IA. Mantido para o tipo padrão do Vite e futuras configs.
interface ImportMetaEnv {}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
