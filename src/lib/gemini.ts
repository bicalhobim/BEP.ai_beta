// BEP-specific AI tasks. Prompt engineering lives here; the provider/model
// plumbing lives in ./ai (swap providers there, not here).
import { aiProvider } from './ai';

// System instruction for BEP.ai
const SYSTEM_INSTRUCTION = `
Você é o "BEP.ai", um agente de Inteligência Artificial especializado em BIM (Building Information Modeling).
Sua função é auxiliar na criação de Planos de Execução BIM (BEP/PEB) alinhados à ISO 19650 e NBR 15965.

Diretrizes:
- Seja técnico, preciso e normativo.
- Use terminologia correta (CDE, EIR, OIR, IFC, BCF, LOD, LOIN).
- Não invente normas.
- Se faltar dados, faça perguntas curtas para esclarecer.
- Formate a saída em Markdown limpo ou JSON quando solicitado.
`;

export async function suggestContent(prompt: string, json: boolean = false) {
  const fullPrompt = `
  Baseie-se nas fontes (edital/EIR/normas) deste notebook do NotebookLM.

  Tarefa:
  ${prompt}

  ${json
    ? 'Formato de Resposta: APENAS um JSON válido (sem blocos de código ```). Retorne um OBJETO contendo uma única propriedade cujo valor é o array de itens solicitado (ex.: {"items": [ ... ]}). Todos os valores de campo devem ser strings simples — nunca números soltos nem arrays aninhados.'
    : 'Responda apenas com o conteúdo solicitado, de forma direta e técnica (ISO 19650).'}
  `;

  return aiProvider.generate({ prompt: fullPrompt, system: SYSTEM_INSTRUCTION, json, tier: 'pro' });
}

export async function optimizeLOD(element: string, phase: string, requestedLOD: string) {
  const prompt = `
  Analise o seguinte requisito de LOD/LOIN:
  Elemento: "${element}"
  Fase do Projeto: "${phase}"
  LOD Solicitado: "${requestedLOD}"

  Verifique se há "over-modeling" (modelagem excessiva desnecessária).
  Se o LOD for muito alto para a fase (ex: LOD 400 em Estudo Preliminar), sugira um rebaixamento justificado (ex: LOD 200 ou 300).
  Se estiver adequado, confirme.

  Saída esperada (JSON):
  {
    "status": "Adequado" | "Over-modeling Detectado",
    "suggested_lod": "LOD Sugerido",
    "reasoning": "Explicação técnica baseada no BIM Fórum ou práticas de mercado"
  }
  `;

  return aiProvider.generate({ prompt, system: SYSTEM_INSTRUCTION, json: true, tier: 'fast' });
}

export async function validateInfrastructure(software: string, hardware: string) {
  const prompt = `
  Valide a compatibilidade de hardware para o software BIM.
  Software de Autoria: "${software}"
  Hardware Disponível: "${hardware}"

  Verifique requisitos de CPU, RAM e GPU.

  Saída esperada (JSON):
  {
    "compatible": boolean,
    "warnings": ["Lista de alertas se houver gargalos (ex: RAM insuficiente)"],
    "recommendation": "Recomendação de upgrade se necessário"
  }
  `;

  return aiProvider.generate({ prompt, system: SYSTEM_INSTRUCTION, json: true, tier: 'fast' });
}

export async function refineText(text: string) {
  const prompt = `
  Reescreva o seguinte texto informal para um jargão técnico de engenharia/BIM, alinhado à ISO 19650.
  Mantenha o sentido original, mas torne-o profissional e contratual.

  Texto Original: "${text}"

  Saída: Apenas o texto reescrito.
  `;

  return aiProvider.generate({ prompt, system: SYSTEM_INSTRUCTION, tier: 'fast' });
}

export async function askISO(question: string) {
  const prompt = `
  Você é um especialista em normas BIM (ISO 19650 e NBR 15965).
  Use as fontes (normas/documentos de referência) deste notebook do NotebookLM para
  responder à pergunta do usuário.

  Pergunta:
  "${question}"

  Responda de forma técnica, citando a norma quando possível.
  `;

  return aiProvider.generate({ prompt, system: SYSTEM_INSTRUCTION, tier: 'fast' });
}
