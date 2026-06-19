# Conectar o BEP.ai ao NotebookLM (modo consulta)

O app pode usar o **NotebookLM** como motor de IA: cada "Gerar IA"/"Sugerir"
consulta um **projeto (notebook)** seu e preenche as seções do BEP a partir das
fontes (edital/EIR) que estão **dentro** desse notebook.

A ponte é embutida no dev server do Vite (rotas `/api/notebooklm/*`), então
**não há servidor separado** — `npm run dev` já sobe tudo.

## Setup (uma vez por máquina)

```bash
npm run setup            # = npm install && pip install notebooklm-py
```

Requisitos: **Node** e **Python + pip** instalados. **O login é feito pelo app**
(não precisa rodar nada no terminal).

## Uso em aula

```bash
npm run dev              # abre em http://localhost:3000
```

No app (tudo pela tela):
1. Botão **"IA: DeepSeek"** (topo do editor) → troca para **NotebookLM**.
2. **Entrar com Google** → abre o Chromium para login (só na 1ª vez).
3. Escolhe o **projeto/notebook** na lista.
4. Em cada seção, clicar **"Gerar IA"** → consulta o notebook e preenche.

> A fonte (edital) precisa já estar adicionada **dentro** do notebook no
> NotebookLM. O app só pergunta; não envia arquivos.

`npm run notebooklm:login` continua disponível como alternativa pelo terminal.

## Observações

- **Só consulta**: a ponte usa apenas `notebooklm list` e `notebooklm ask`.
  Nunca gera podcasts/vídeos nem apaga nada.
- **Latência**: cada consulta leva ~5-20s (round-trip ao Google).
- **Auth por máquina/conta**: cada aluno roda `notebooklm login` com a própria
  conta Google. Não é compartilhável.
- **Erro "CLI não encontrado"**: rode `pip install notebooklm-py` e confirme que
  o `notebooklm` está no PATH (reabra o terminal após instalar).
- A escolha de motor (DeepSeek/NotebookLM) e o notebook ficam salvos no
  navegador (localStorage).
