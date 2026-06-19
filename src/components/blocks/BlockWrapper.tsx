import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BlockData, useBEPStore } from '../../store/bepStore';
import { GripVertical, ChevronDown, ChevronRight, X, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import clsx from 'clsx';
import { isGeneratable, generateSection } from '../../lib/bep/sections';
import { IconButton } from '../ui/IconButton';
import { Button } from '../ui/Button';

interface BlockWrapperProps {
  block: BlockData;
  children: React.ReactNode;
}

export function BlockWrapper({ block, children }: BlockWrapperProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: block.id });

  const { toggleBlock, removeBlock, updateBlockContent, notebookId } = useBEPStore();
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!notebookId) {
      alert('Selecione um projeto do NotebookLM (botão "NotebookLM" no topo) antes de gerar.');
      return;
    }
    setGenerating(true);
    try {
      // A fonte (edital/EIR) vive no notebook conectado; o NotebookLM fundamenta a
      // resposta nas próprias fontes — não enviamos texto local.
      const content = await generateSection(block.type);
      updateBlockContent(block.id, content);
      if (!block.isExpanded) toggleBlock(block.id);
    } catch (e) {
      console.error('Falha ao gerar seção:', e);
      alert('Falha ao gerar a seção. Verifique a conexão com o NotebookLM e tente novamente.');
    } finally {
      setGenerating(false);
    }
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={clsx(
        "bg-white rounded-xl border shadow-sm transition-all",
        isDragging ? "border-orange-400 shadow-lg ring-2 ring-orange-100" : "border-slate-200 hover:border-slate-300"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
        <IconButton
          variant="grip"
          aria-label="Arrastar para reordenar a seção"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4" />
        </IconButton>

        <button
          onClick={() => toggleBlock(block.id)}
          aria-expanded={block.isExpanded}
          aria-controls={`block-content-${block.id}`}
          className="flex items-center gap-2 flex-1 text-left min-h-[44px] px-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        >
          {block.isExpanded ? (
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          )}
          <span className="font-semibold text-slate-700 text-sm">{block.title}</span>
        </button>

        {isGeneratable(block.type) && (
          <Button
            variant="accent"
            size="sm"
            onClick={handleGenerate}
            loading={generating}
            icon={<Sparkles className="w-3.5 h-3.5" />}
            title="Gerar esta seção com IA a partir dos documentos importados"
          >
            {generating ? 'Gerando...' : 'Gerar IA'}
          </Button>
        )}

        <IconButton
          variant="danger"
          aria-label={`Remover seção ${block.title}`}
          onClick={() => removeBlock(block.id)}
        >
          <X className="w-4 h-4" />
        </IconButton>
      </div>

      {/* Content */}
      {block.isExpanded && (
        <div id={`block-content-${block.id}`} className="p-6">
          {children}
        </div>
      )}
    </motion.div>
  );
}
