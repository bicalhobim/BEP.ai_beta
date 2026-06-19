import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import {
  listProjectsMeta,
  readProjectData,
  writeProjectData,
  deleteProjectData,
  type ProjectMeta,
} from '../lib/projects';
import { getActiveProviderId, setActiveProvider } from '../lib/ai';
import { getNotebookId, setNotebookId } from '../lib/ai/providers/notebooklm';

export type BlockType =
  | 'general_project'
  | 'general_team'
  | 'responsibility_matrix'
  | 'deliverables_matrix'
  | 'bim_uses_goals'
  | 'bim_uses_infra'
  | 'project_requirements'
  | 'schedule'
  | 'roles_responsibilities'
  | 'references'
  | 'attachments';

export interface BlockData {
  id: string;
  type: BlockType;
  title: string;
  content: any; // Flexible content structure depending on block type
  isExpanded: boolean;
}

export interface Milestone {
  id: string;
  item: string;
  description: string;
  duration: string;
  start: string;
  end: string;
  status: 'todo' | 'in_progress' | 'done';
}

/** Blocos padrão de um BEP novo (cópia fresca a cada chamada). */
export function createDefaultBlocks(): BlockData[] {
  return [
    {
      id: '1',
      type: 'general_project',
      title: '1. INFORMAÇÕES GERAIS DO PROJETO',
      content: {
        project_name: '',
        address: '',
        neighborhood: '',
        municipality: '',
        contract_number: '',
        client_name: '',
        modality: '',
        intended_use: '',
        target_audience: '',
        project_deadline: '',
        construction_deadline: '',
        standard: '',
        sustainability_indicators: '',
        lot_area: '',
        construction_area: '',
        floors_count: '',
        population_forecast: '',
        oir_description: '',
        eir_description: '',
        bidder_company: '',
        bidder_representatives: ['', ''],
        proposal_date: '',
      },
      isExpanded: true,
    },
    {
      id: '2',
      type: 'general_team',
      title: '2. INFORMAÇÕES GERAIS – EQUIPE DO PROJETO',
      content: {
        contractor_team: [
          { role: 'CONTRATANTE', name: '', education: '', email: '', phone: '' },
          { role: 'GESTOR (CONTRATO)', name: '', education: '', email: '', phone: '' },
          { role: 'GESTOR (SUBSTITUTO)', name: '', education: '', email: '', phone: '' },
        ],
        bidder_team: [
          { role: 'EMPRESA OU CONSÓRCIO', name: '', education: '', email: '', phone: '' },
          { role: 'REPRESENTANTE', name: '', education: '', email: '', phone: '' },
          { role: 'RESPONSÁVEL TÉCNICO (ARQ.)', name: '', education: '', email: '', phone: '' },
          { role: 'RESPONSÁVEL TÉCNICO (INF.)', name: '', education: '', email: '', phone: '' },
          { role: 'RESPONSÁVEL TÉCNICO (MEP.)', name: '', education: '', email: '', phone: '' },
          { role: 'OUTRAS DISCIPLINAS', name: '', education: '', email: '', phone: '' },
        ],
      },
      isExpanded: false,
    },
    {
      id: '3',
      type: 'responsibility_matrix',
      title: '3. MATRIZ DE RESPONSABILIDADES',
      content: {
        technical_team: [
          { role: 'COORDENADOR BIM (BIM MANAGER)', name: '', registry: '', email: '', phone: '' },
          { role: 'RESPONSÁVEL TÉCNICO (ARQ.)', name: '', registry: '', email: '', phone: '' },
          { role: 'RESPONSÁVEL TÉCNICO (ENG.)', name: '', registry: '', email: '', phone: '' },
          { role: 'RESPONSÁVEL TÉCNICO (ENG.)', name: '', registry: '', email: '', phone: '' },
          { role: 'RESPONSÁVEL TÉCNICO (ENG.)', name: '', registry: '', email: '', phone: '' },
          { role: 'OUTRAS DISCIPLINAS', name: '', registry: '', email: '', phone: '' },
        ],
      },
      isExpanded: false,
    },
    {
      id: '4',
      type: 'deliverables_matrix',
      title: '4. MATRIZ DE ENTREGÁVEIS',
      content: {
        deliverables: [{ phase: '', discipline: '', deliverable: '', formats: '', responsible: '' }],
      },
      isExpanded: false,
    },
    {
      id: '5',
      type: 'bim_uses_goals',
      title: '5. USOS BIM (OBJETIVOS ORGANIZACIONAIS)',
      content: {
        goals: [{ priority: '', objective: '', uses: '' }],
      },
      isExpanded: false,
    },
    {
      id: '6',
      type: 'bim_uses_infra',
      title: '6. USOS BIM (INFRAESTRUTURA TECNOLÓGICA)',
      content: {
        software_tools: [{ use: '', platform: '', version: '', extension: '' }],
        hardware_requirements: [{ purpose: '', cpu: '', ram: '', gpu: '', os: '', hd: '' }],
      },
      isExpanded: false,
    },
    {
      id: '7',
      type: 'project_requirements',
      title: '7. REQUISITOS DO PROJETO (LOIN / LOD)',
      content: {
        requirements: [{ phase: '', lod: '', loin: '' }],
      },
      isExpanded: false,
    },
    {
      id: '8',
      type: 'schedule',
      title: '8. PRINCIPAIS MARCOS DO PROJETO',
      content: {
        milestones: [
          { id: uuidv4(), item: '1.0', description: 'Início do Projeto', duration: '1 dia', start: '', end: '', status: 'todo' },
        ],
      },
      isExpanded: false,
    },
    {
      id: '9',
      type: 'roles_responsibilities',
      title: '9. PAPÉIS E RESPONSABILIDADES',
      content: {
        roles: [{ role: '', responsibility: '' }],
      },
      isExpanded: false,
    },
    {
      id: '10',
      type: 'references',
      title: '10. REFERÊNCIAS',
      content: { references: [] },
      isExpanded: false,
    },
    {
      id: '11',
      type: 'attachments',
      title: '11. ANEXOS',
      content: { attachments: [] },
      isExpanded: false,
    },
  ];
}

const BLOCK_TITLES: Record<BlockType, string> = {
  general_project: '1. INFORMAÇÕES GERAIS DO PROJETO',
  general_team: '2. INFORMAÇÕES GERAIS – EQUIPE DO PROJETO',
  responsibility_matrix: '3. MATRIZ DE RESPONSABILIDADES',
  deliverables_matrix: '4. MATRIZ DE ENTREGÁVEIS',
  bim_uses_goals: '5. USOS BIM (OBJETIVOS ORGANIZACIONAIS)',
  bim_uses_infra: '6. USOS BIM (INFRAESTRUTURA TECNOLÓGICA)',
  project_requirements: '7. REQUISITOS DO PROJETO (LOIN / LOD)',
  schedule: '8. PRINCIPAIS MARCOS DO PROJETO',
  roles_responsibilities: '9. PAPÉIS E RESPONSABILIDADES',
  references: '10. REFERÊNCIAS',
  attachments: '11. ANEXOS',
};

interface BEPState {
  blocks: BlockData[];
  activeView: 'home' | 'editor' | 'kanban' | 'ifc';
  currentProjectId: string | null;
  currentProjectName: string;
  projects: ProjectMeta[];
  setActiveView: (view: 'home' | 'editor' | 'kanban' | 'ifc') => void;
  // Provedor de IA + projeto NotebookLM
  aiProviderId: string;
  notebookId: string;
  setAiProvider: (id: string) => void;
  setNotebookId: (id: string) => void;
  // Projetos
  refreshProjects: () => void;
  createProject: (name: string) => void;
  openProject: (id: string) => void;
  deleteProject: (id: string) => void;
  importProject: (data: { blocks: BlockData[] }, name: string) => void;
  // Blocos
  addBlock: (type: BlockType) => void;
  removeBlock: (id: string) => void;
  updateBlock: (id: string, data: Partial<BlockData>) => void;
  updateBlockContent: (id: string, content: any) => void;
  reorderBlocks: (oldIndex: number, newIndex: number) => void;
  toggleBlock: (id: string) => void;
  expandAllBlocks: () => void;
}

export const useBEPStore = create<BEPState>((set) => ({
  blocks: createDefaultBlocks(),
  activeView: 'home',
  currentProjectId: null,
  currentProjectName: '',
  projects: listProjectsMeta(),

  setActiveView: (view) => set({ activeView: view }),

  aiProviderId: getActiveProviderId(),
  notebookId: getNotebookId(),
  setAiProvider: (id) => {
    setActiveProvider(id);
    set({ aiProviderId: getActiveProviderId() });
  },
  setNotebookId: (id) => {
    setNotebookId(id);
    set({ notebookId: id });
  },

  refreshProjects: () => set({ projects: listProjectsMeta() }),

  createProject: (name) => {
    const id = uuidv4();
    const projectName = name?.trim() || 'Novo Projeto';
    const blocks = createDefaultBlocks();
    writeProjectData({ id, name: projectName, blocks, updatedAt: Date.now() });
    set({
      currentProjectId: id,
      currentProjectName: projectName,
      blocks,
      activeView: 'editor',
      projects: listProjectsMeta(),
    });
  },

  openProject: (id) => {
    const data = readProjectData(id);
    if (!data) return;
    set({
      currentProjectId: data.id,
      currentProjectName: data.name,
      blocks: data.blocks,
      activeView: 'editor',
    });
  },

  deleteProject: (id) =>
    set((state) => {
      deleteProjectData(id);
      const projects = listProjectsMeta();
      if (state.currentProjectId === id) {
        return {
          projects,
          currentProjectId: null,
          currentProjectName: '',
          blocks: createDefaultBlocks(),
          activeView: 'home' as const,
        };
      }
      return { projects };
    }),

  importProject: (data, name) => {
    const id = uuidv4();
    const projectName = name?.trim() || 'Projeto importado';
    const blocks = data.blocks;
    writeProjectData({ id, name: projectName, blocks, updatedAt: Date.now() });
    set({
      currentProjectId: id,
      currentProjectName: projectName,
      blocks,
      activeView: 'editor',
      projects: listProjectsMeta(),
    });
  },

  addBlock: (type) =>
    set((state) => ({
      blocks: [
        ...state.blocks,
        { id: uuidv4(), type, title: BLOCK_TITLES[type], content: {}, isExpanded: true },
      ],
    })),
  removeBlock: (id) => set((state) => ({ blocks: state.blocks.filter((b) => b.id !== id) })),
  updateBlock: (id, data) =>
    set((state) => ({ blocks: state.blocks.map((b) => (b.id === id ? { ...b, ...data } : b)) })),
  updateBlockContent: (id, content) =>
    set((state) => ({
      blocks: state.blocks.map((b) => (b.id === id ? { ...b, content: { ...b.content, ...content } } : b)),
    })),
  reorderBlocks: (oldIndex, newIndex) =>
    set((state) => {
      const newBlocks = [...state.blocks];
      const [moved] = newBlocks.splice(oldIndex, 1);
      newBlocks.splice(newIndex, 0, moved);
      return { blocks: newBlocks };
    }),
  toggleBlock: (id) =>
    set((state) => ({
      blocks: state.blocks.map((b) => (b.id === id ? { ...b, isExpanded: !b.isExpanded } : b)),
    })),
  expandAllBlocks: () =>
    set((state) => ({ blocks: state.blocks.map((b) => ({ ...b, isExpanded: true })) })),
}));

// Auto-save: grava o projeto ativo (debounced) sempre que os blocos mudam.
let saveTimer: ReturnType<typeof setTimeout> | undefined;
useBEPStore.subscribe((state, prev) => {
  if (!state.currentProjectId) return;
  if (state.blocks === prev.blocks) return;
  clearTimeout(saveTimer);
  const { currentProjectId, currentProjectName, blocks } = state;
  saveTimer = setTimeout(() => {
    writeProjectData({
      id: currentProjectId,
      name: currentProjectName,
      blocks,
      updatedAt: Date.now(),
    });
    useBEPStore.setState({ projects: listProjectsMeta() });
  }, 500);
});
