import React from 'react';
import { BlockData } from '../../store/bepStore';
import { BlockWrapper } from '../blocks/BlockWrapper';
import { GeneralDataBlock } from '../blocks/GeneralDataBlock';
import { ScopeBlock } from '../blocks/ScopeBlock';
import { LODBlock } from '../blocks/LODBlock';
import { InfraBlock } from '../blocks/InfraBlock';
import { ScheduleBlock } from '../blocks/ScheduleBlock';
import { ReferencesBlock } from '../blocks/ReferencesBlock';
import { ListBlock } from '../blocks/ListBlock';
import { TeamBlock } from '../blocks/TeamBlock';
import { ResponsibilityMatrixBlock } from '../blocks/ResponsibilityMatrixBlock';
import { DeliverablesBlock } from '../blocks/DeliverablesBlock';
import { RolesBlock } from '../blocks/RolesBlock';
import { AnimatePresence } from 'motion/react';

interface EditorProps {
  blocks: BlockData[];
}

export function Editor({ blocks }: EditorProps) {
  const renderBlockContent = (block: BlockData) => {
    switch (block.type) {
      case 'general_project':
        return <GeneralDataBlock block={block} />;
      case 'general_team':
        return <TeamBlock block={block} />;
      case 'responsibility_matrix':
        return <ResponsibilityMatrixBlock block={block} />;
      case 'deliverables_matrix':
        return <DeliverablesBlock block={block} />;
      case 'bim_uses_goals':
        return <ScopeBlock block={block} />;
      case 'bim_uses_infra':
        return <InfraBlock block={block} />;
      case 'project_requirements':
        return <LODBlock block={block} />;
      case 'schedule':
        return <ScheduleBlock block={block} />;
      case 'roles_responsibilities':
        return <RolesBlock block={block} title="Tabela 9 - Papéis e Responsabilidades" itemLabel="Papel" fieldKey="roles" />;
      case 'references':
        return <ReferencesBlock block={block} />;
      case 'attachments':
        return <ListBlock block={block} title="Anexos" itemLabel="Anexo" fieldKey="attachments" />;
      default:
        return (
          <div className="p-4 text-slate-400 italic text-sm border-2 border-dashed border-slate-100 rounded-lg">
            Módulo em desenvolvimento: {block.type}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <AnimatePresence>
        {blocks.map((block) => (
          <div key={block.id} id={`block-${block.id}`}>
            <BlockWrapper block={block}>
              {renderBlockContent(block)}
            </BlockWrapper>
          </div>
        ))}
      </AnimatePresence>
      
      {blocks.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-xl">
          <p className="text-slate-400">Arraste módulos da barra lateral ou clique para adicionar.</p>
        </div>
      )}
    </div>
  );
}
