# PEB.AI - Gerador Inteligente de Plano de Execução BIM

O **PEB.AI** é uma plataforma e assistente inteligente (IA) especializado em BIM (Building Information Modeling). Sua principal função é auxiliar profissionais, engenheiros e arquitetos na criação ágil e precisa de **Planos de Execução BIM (BEP/PEB)**, garantindo total alinhamento às normas **ISO 19650** e **NBR 15965**.

---

## 🚀 Como Funciona

A plataforma foi desenhada para automatizar tarefas repetitivas e garantir a qualidade técnica do seu documento. O fluxo de trabalho principal consiste em:

1. **Página Inicial (Home)**: Um ponto de partida contendo um tutorial em vídeo prático para apresentar os conceitos e a utilização da ferramenta.
2. **Importação Inteligente de EIR (PDF)**: Você pode enviar o PDF de um Edital ou EIR (Exchange Information Requirements). A IA do Gemini lê o documento e auto-preenche as principais informações do projeto (dados do cliente, equipe, prazos, etc).
3. **Editor de BEP Modular**: O documento é gerado em blocos modulares. Você pode reorganizá-los livremente arrastando e soltando.
   - **Geração por IA**: Dentro de diversos blocos (como Objetivos BIM, LOD/LOIN, Entregáveis), há botões de "Sugestão com IA" que geram tabelas e conteúdos baseados no contexto do projeto.
   - **Refinamento Técnico**: Botões de refinamento reescrevem textos informais utilizando o jargão técnico contratual exigido pela ISO.
   - **Validação de Over-modeling**: O bloco de LOD permite que a IA avalie se o Nível de Desenvolvimento exigido está condizente com a fase do projeto.
4. **Gerenciamento Ágil (Kanban)**: Uma tela dedicada no formato Kanban permite gerenciar visualmente os "Principais Marcos do Projeto" definidos no escopo (A Fazer, Em Progresso, Concluído).
5. **Exportação**: Com um clique, você exporta o documento finalizado para HTML/PDF, pronto para assinatura ou anexação em contratos.

---

## ✨ Funcionalidades Principais

- **Extração de Dados via PDF**: Leitura local do PDF e extração estruturada de dados do Edital usando IA generativa.
- **Sugestões Contextuais (Gemini)**: Geração de matrizes de responsabilidade, listas de softwares/hardwares e usos BIM aplicáveis.
- **Gestão de Prazos Visual (Kanban)**: Quadro Kanban com drag-and-drop integrado automaticamente à tabela do documento BEP.
- **Design Moderno e Responsivo**: Interface limpa (Clean UI) utilizando Tailwind CSS e animações fluidas com Framer Motion.
- **Validação de Infraestrutura**: Verificador baseado em IA que confere se o hardware especificado "roda" o software BIM escolhido.
- **Nenhuma Perda de Estado Local**: Uso avançado de Zustand para gerenciar milhares de propriedades do documento em tempo real na memória.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18, TypeScript, Vite
- **Estilização**: Tailwind CSS, Lucide React (Ícones)
- **Animações**: Framer Motion
- **Gerenciamento de Estado**: Zustand
- **Interações Drag-and-Drop**: `@dnd-kit` (Listas de blocos e Quadro Kanban)
- **Inteligência Artificial**: Google Gen AI SDK (`@google/genai`) com o modelo `gemini-3.1-pro` / `flash`.
- **Processamento de Arquivos**: `pdf.js` para parsing seguro de PDF no lado do cliente.

---

## 🏁 Como Executar Localmente

Siga os passos abaixo para rodar o projeto localmente:

1. **Clone o repositório** e entre na pasta:
   ```bash
   cd react-example
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configuração de Variáveis de Ambiente**:
   Crie um arquivo `.env` na raiz do projeto com a chave da API do Gemini (necessária para que o gerador de texto/PDF funcione):
   ```env
   GEMINI_API_KEY=sua_chave_de_api_aqui
   ```

4. **Inicie o Servidor de Desenvolvimento**:
   ```bash
   npm run dev
   ```

5. O aplicativo estará disponível em `http://localhost:3000`.

---

## 📄 Notas Adicionais sobre a Arquitetura

- A lógica de inteligência artificial está isolada em `/src/lib/gemini.ts`. Todo o "prompt engineering" (papel do *BIM Specialist*, formatações em JSON) acontece nesse arquivo.
- O controle global dos campos do BEP habita em `/src/store/bepStore.ts`, projetado de modo flexível onde cada "bloco" define seu próprio esquema dinâmico em `block.content`.
- Os blocos da interface encontram-se em `/src/components/blocks/` e são orquestrados por `Editor.tsx`.

Desenvolvido para revolucionar a documentação técnica no ambiente BIM!
