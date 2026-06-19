# BEP.ai — Plano de Execução BIM + Análise de IFC

Protótipo web educacional que faz três coisas:

1. **Cria Planos de Execução BIM (BEP/PEB)** alinhados à ISO 19650 e NBR 15965, com auxílio de IA.
2. **Visualiza modelos IFC em 3D** no navegador.
3. **Analisa a consistência** entre o modelo IFC e o BEP (disciplinas, LOD etc.).

> ⚠️ Protótipo para ensino. A IA roda no **NotebookLM** via ponte local do dev server. **Não há chave de API** — a autenticação é o login Google do NotebookLM. Uso local/aula.

---

## ⬇️ Downloads (Windows 64-bit)

| Programa | Para quê | Link |
|---|---|---|
| **OpenCode** | assistente que roda os comandos por você | https://opencode.ai/br/download/stable/windows-x64-nsis |
| **Node.js 24** | roda o app | https://nodejs.org/dist/v24.17.0/node-v24.17.0-x64.msi |
| **Python 3.12** | parte do NotebookLM | https://www.python.org/ftp/python/3.12.10/python-3.12.10-amd64.exe |

> ⚠️ No instalador do **Python**, marque ☑️ **"Add python.exe to PATH"** na primeira tela.

---

## 📖 Guia do aluno

Instalação e uso completos (como rodar, preencher o BEP, importar EIR, carregar IFC, gerar a análise): veja **[GUIA_DE_USO.md](GUIA_DE_USO.md)**.

---

## 🗂️ Pastas do repositório

```
BEP.ai_beta/
├─ public/                     # arquivos servidos na raiz (WASM do web-ifc, exemplo.ifc)
├─ src/
│  ├─ main.tsx                 # ponto de entrada (React + ErrorBoundary)
│  ├─ App.tsx                  # layout, troca de telas, salvar/carregar projeto
│  ├─ store/                   # estado global (Zustand + persist)
│  ├─ lib/
│  │  ├─ ai/                   # camada de IA agnóstica (provedor NotebookLM)
│  │  ├─ ifc/                  # visualizador 3D + extração de dados do IFC
│  │  ├─ analysis.ts           # análise de consistência IFC × BEP
│  │  ├─ pdf.ts / export.ts    # leitura de PDF e exportação
│  │  └─ gemini.ts             # prompts do BEP
│  └─ components/              # telas, blocos do BEP e botões de IA
├─ scripts/                    # CLI notebooklm.mjs
├─ docs/                       # documentação interna (PLANO.md)
├─ dist/                       # build de produção (gerado)
├─ vite-plugin-notebooklm.mjs  # ponte local /api/notebooklm
├─ vite.config.ts             # config do Vite
├─ package.json               # dependências e scripts
├─ GUIA_DE_USO.md             # guia do aluno
└─ NOTEBOOKLM.md              # notas sobre a integração NotebookLM
```

> As bibliotecas (ThatOpen, web-ifc, three.js, React…) são dependências npm — ficam em `node_modules/` após `npm install`, controladas pelo `package.json`.

---

## 🛠️ Stack

- **Frontend:** React 19 + TypeScript + Vite 6 · Tailwind CSS
- **Estado:** Zustand (persist em localStorage)
- **IA:** camada própria em `src/lib/ai/` — provedor NotebookLM via ponte local
- **IFC / 3D:** ThatOpen Engine + web-ifc (WASM) + three.js
- **PDF:** pdf.js (leitura) · jsPDF / html-to-image (exportação)
