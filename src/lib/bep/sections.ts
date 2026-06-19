import { v4 as uuidv4 } from 'uuid';
import { aiProvider, parseJSON } from '../ai';
import type { BlockType } from '../../store/bepStore';

// Geração por SEÇÃO: em vez de um único JSON gigante (que variava muito), cada
// seção do BEP tem um prompt focado e uma estrutura JSON própria. Combinado com
// temperatura baixa + seed fixo no provider, o mesmo documento gera resultados
// consistentes.

const SYSTEM = `
Você é o "BEP.ai", especialista em BIM (ISO 19650 e NBR 15965). Sua tarefa é preencher
UMA seção específica de um Plano de Execução BIM a partir dos documentos fornecidos
(edital, EIR, ata de reunião). Seja técnico e normativo.
NÃO invente dados que não constem nos documentos: se faltar, deixe o campo vazio.
`;

interface SectionSpec {
  label: string;
  instruction: string;
  /** Exemplo da estrutura JSON esperada (embutido no prompt; modo json_object). */
  shape: string;
  /** Pós-processamento opcional (ex.: adicionar id/status em itens). */
  transform?: (parsed: any) => any;
}

const SECTION_SPECS: Partial<Record<BlockType, SectionSpec>> = {
  general_project: {
    label: 'Informações Gerais do Projeto',
    instruction: 'Extraia os dados gerais do projeto e da empresa licitante.',
    shape: `{
  "project_name": "", "address": "", "neighborhood": "", "municipality": "",
  "contract_number": "", "client_name": "", "modality": "", "intended_use": "",
  "target_audience": "", "project_deadline": "", "construction_deadline": "",
  "standard": "", "sustainability_indicators": "", "lot_area": "", "construction_area": "",
  "floors_count": "", "population_forecast": "", "oir_description": "", "eir_description": "",
  "bidder_company": "", "bidder_representatives": ["", ""], "proposal_date": ""
}`,
  },
  general_team: {
    label: 'Equipe do Projeto',
    instruction: 'Liste a equipe da contratante e da licitante mencionadas nos documentos.',
    shape: `{
  "contractor_team": [{ "role": "", "name": "", "education": "", "email": "", "phone": "" }],
  "bidder_team": [{ "role": "", "name": "", "education": "", "email": "", "phone": "" }]
}`,
  },
  responsibility_matrix: {
    label: 'Matriz de Responsabilidades',
    instruction: 'Liste a equipe técnica responsável e suas funções (BIM Manager, RTs etc.).',
    shape: `{
  "technical_team": [{ "role": "", "name": "", "registry": "", "email": "", "phone": "" }]
}`,
  },
  deliverables_matrix: {
    label: 'Matriz de Entregáveis',
    instruction: 'Liste os entregáveis exigidos por fase e disciplina, com formatos e responsáveis.',
    shape: `{
  "deliverables": [{ "phase": "", "discipline": "", "deliverable": "", "formats": "", "responsible": "" }]
}`,
  },
  bim_uses_goals: {
    label: 'Usos BIM (Objetivos)',
    instruction:
      'Liste os objetivos organizacionais BIM e os Usos BIM aplicáveis, ordenados por prioridade. ' +
      '"priority" deve ser uma STRING numérica ("1" = mais alta, "2", "3"...). ' +
      '"objective" e "uses" devem ser STRINGS de texto corrido (não use arrays nem números soltos); ' +
      'se houver vários usos, junte-os numa única string separada por vírgulas.',
    shape: `{
  "goals": [{ "priority": "1", "objective": "", "uses": "" }]
}`,
  },
  bim_uses_infra: {
    label: 'Usos BIM (Infraestrutura)',
    instruction: 'Liste softwares de autoria/plataformas e os requisitos de hardware exigidos.',
    shape: `{
  "software_tools": [{ "use": "", "platform": "", "version": "", "extension": "" }],
  "hardware_requirements": [{ "purpose": "", "cpu": "", "ram": "", "gpu": "", "os": "", "hd": "" }]
}`,
  },
  project_requirements: {
    label: 'Requisitos (LOD/LOIN)',
    instruction: 'Liste os requisitos de LOD e LOIN por fase do projeto.',
    shape: `{
  "requirements": [{ "phase": "", "lod": "", "loin": "" }]
}`,
  },
  schedule: {
    label: 'Marcos do Projeto',
    instruction: 'Liste os principais marcos/etapas do projeto com prazos e datas, se houver.',
    shape: `{
  "milestones": [{ "item": "1.0", "description": "", "duration": "", "start": "", "end": "" }]
}`,
    transform: (parsed) => ({
      milestones: (parsed?.milestones ?? []).map((m: any) => ({
        id: uuidv4(),
        item: m.item ?? '',
        description: m.description ?? '',
        duration: m.duration ?? '',
        start: m.start ?? '',
        end: m.end ?? '',
        status: 'todo' as const,
      })),
    }),
  },
  roles_responsibilities: {
    label: 'Papéis e Responsabilidades',
    instruction: 'Liste os papéis e suas responsabilidades descritas nos documentos.',
    shape: `{
  "roles": [{ "role": "", "responsibility": "" }]
}`,
  },
};

export function isGeneratable(type: BlockType): boolean {
  return type in SECTION_SPECS;
}

export function sectionLabel(type: BlockType): string | undefined {
  return SECTION_SPECS[type]?.label;
}

/** Gera o conteúdo de UMA seção do BEP a partir do contexto (documentos). */
// Máximo de caracteres do documento enviados por seção. DeepSeek v4 tem contexto
// amplo; 60k cortava editais grandes (100+ págs) e deixava campos vazios.
const CONTEXT_CHAR_LIMIT = 120000;

export async function generateSection(type: BlockType, context: string): Promise<any> {
  const spec = SECTION_SPECS[type];
  if (!spec) throw new Error(`Seção não suporta geração por IA: ${type}`);

  if (context.length > CONTEXT_CHAR_LIMIT) {
    console.warn(
      `[generateSection] Documento truncado de ${context.length} para ${CONTEXT_CHAR_LIMIT} caracteres na seção "${type}". Dados após o corte ficam invisíveis para a IA.`
    );
  }

  const prompt = `
Documentos de referência:
"""
${context.substring(0, CONTEXT_CHAR_LIMIT)}
"""

Tarefa: ${spec.instruction}

Retorne APENAS um JSON válido (sem blocos de código), exatamente nesta estrutura:
${spec.shape}

Regras: preencha com base SOMENTE nos documentos acima. Se um campo não constar, use ""
(string vazia) ou [] (array vazio). Não invente nomes, números, normas ou datas.
`;

  const raw = await aiProvider.generate({ prompt, system: SYSTEM, json: true, tier: 'pro' });
  const parsed = parseJSON(raw);
  return spec.transform ? spec.transform(parsed) : parsed;
}
