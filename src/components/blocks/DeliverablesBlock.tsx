import React from 'react';
import { BlockData, useBEPStore } from '../../store/bepStore';
import { Layers, Plus, Trash2 } from 'lucide-react';
import { AiSuggestionButton } from '../ui/AiSuggestionButton';

interface Props {
  block: BlockData;
}

export function DeliverablesBlock({ block }: Props) {
  const { updateBlockContent } = useBEPStore();
  const deliverables = block.content.deliverables || [];

  const handleAiSuggest = (suggestions: any[]) => {
    if (!Array.isArray(suggestions)) return;
    const newDeliverables = suggestions.map(s => ({
      phase: s.phase || '',
      discipline: s.discipline || '',
      deliverable: s.deliverable || '',
      formats: s.formats || '',
      responsible: s.responsible || ''
    }));
    updateBlockContent(block.id, { 
      deliverables: [...deliverables, ...newDeliverables] 
    });
  };

  const addRow = () => {
    updateBlockContent(block.id, { 
      deliverables: [...deliverables, { phase: '', discipline: '', deliverable: '', formats: '', responsible: '' }] 
    });
  };

  const removeRow = (index: number) => {
    const newDeliverables = [...deliverables];
    newDeliverables.splice(index, 1);
    updateBlockContent(block.id, { deliverables: newDeliverables });
  };

  const handleChange = (index: number, field: string, value: string) => {
    const newDeliverables = [...deliverables];
    newDeliverables[index] = { ...newDeliverables[index], [field]: value };
    updateBlockContent(block.id, { deliverables: newDeliverables });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Layers className="w-4 h-4 text-orange-600" />
          Matriz de Entregáveis
        </h3>
        <div className="flex gap-2">
          <AiSuggestionButton 
            prompt="Liste os principais entregáveis por fase e disciplina para este projeto, retornando um array de objetos JSON com as chaves: phase, discipline, deliverable, formats, responsible."
            onSuggest={handleAiSuggest}
            json={true}
          />
          <button onClick={addRow} className="text-xs flex items-center gap-1 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-md hover:bg-orange-100">
            <Plus className="w-3 h-3" /> Adicionar Linha
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600 border border-slate-200 rounded-lg">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
            <tr>
              <th className="px-4 py-3 border-b">Fase</th>
              <th className="px-4 py-3 border-b">Disciplina</th>
              <th className="px-4 py-3 border-b">Entregável</th>
              <th className="px-4 py-3 border-b">Formatos</th>
              <th className="px-4 py-3 border-b">Responsável / Função</th>
              <th className="px-4 py-3 border-b w-10"></th>
            </tr>
          </thead>
          <tbody>
            {deliverables.map((row: any, index: number) => (
              <tr key={index} className="border-b last:border-0 hover:bg-slate-50/50">
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={row.phase}
                    onChange={(e) => handleChange(index, 'phase', e.target.value)}
                    className="w-full bg-transparent outline-none border-b border-transparent focus:border-orange-300"
                    placeholder="Fase..."
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={row.discipline}
                    onChange={(e) => handleChange(index, 'discipline', e.target.value)}
                    className="w-full bg-transparent outline-none border-b border-transparent focus:border-orange-300"
                    placeholder="Disciplina..."
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={row.deliverable}
                    onChange={(e) => handleChange(index, 'deliverable', e.target.value)}
                    className="w-full bg-transparent outline-none border-b border-transparent focus:border-orange-300"
                    placeholder="Entregável..."
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={row.formats}
                    onChange={(e) => handleChange(index, 'formats', e.target.value)}
                    className="w-full bg-transparent outline-none border-b border-transparent focus:border-orange-300"
                    placeholder=".ifc / .rvt..."
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={row.responsible}
                    onChange={(e) => handleChange(index, 'responsible', e.target.value)}
                    className="w-full bg-transparent outline-none border-b border-transparent focus:border-orange-300"
                    placeholder="Nome / Função..."
                  />
                </td>
                <td className="px-4 py-2 text-center">
                  <button onClick={() => removeRow(index)} className="text-slate-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
