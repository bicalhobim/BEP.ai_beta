import React from 'react';
import { BlockData, useBEPStore } from '../../store/bepStore';
import { Plus, Trash2 } from 'lucide-react';
import { AiSuggestionButton } from '../ui/AiSuggestionButton';

interface Props {
  block: BlockData;
}

export function ScopeBlock({ block }: Props) {
  const { updateBlockContent } = useBEPStore();
  const goals = block.content.goals || [];

  const handleAiSuggest = (suggestions: any[]) => {
    if (!Array.isArray(suggestions)) return;
    
    // Map suggestions to match our structure if needed, or assume AI follows instructions
    const newGoals = suggestions.map(s => ({
      priority: s.priority || '2',
      objective: s.objective || '',
      uses: s.uses || ''
    }));

    updateBlockContent(block.id, { 
      goals: [...goals, ...newGoals] 
    });
  };

  const addGoal = () => {
    updateBlockContent(block.id, { 
      goals: [...goals, { priority: '1', objective: '', uses: '' }] 
    });
  };

  const removeGoal = (index: number) => {
    const newGoals = [...goals];
    newGoals.splice(index, 1);
    updateBlockContent(block.id, { goals: newGoals });
  };

  const updateGoal = (index: number, field: string, value: string) => {
    const newGoals = [...goals];
    newGoals[index] = { ...newGoals[index], [field]: value };
    updateBlockContent(block.id, { goals: newGoals });
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-slate-800">Tabela 5 - Usos BIM (Objetivos Organizacionais)</h3>
        <div className="flex gap-2">
          <AiSuggestionButton 
            prompt="Liste 3 a 5 objetivos organizacionais BIM prioritários com base no edital, retornando um array de objetos JSON com as chaves: priority (string '1', '2' ou '3'), objective (string), uses (string)."
            onSuggest={handleAiSuggest}
            json={true}
          />
          <button onClick={addGoal} className="text-xs flex items-center gap-1 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-md hover:bg-orange-100">
            <Plus className="w-3 h-3" /> Adicionar Objetivo
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600 border border-slate-200 rounded-lg">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
            <tr>
              <th className="px-4 py-3 border-b w-24">Prioridade (1-3)</th>
              <th className="px-4 py-3 border-b">Descrição do Objetivo</th>
              <th className="px-4 py-3 border-b">Usos BIM Associados (Messner, 2023)</th>
              <th className="px-4 py-3 border-b w-10"></th>
            </tr>
          </thead>
          <tbody>
            {goals.map((row: any, index: number) => (
              <tr key={index} className="border-b last:border-0 hover:bg-slate-50/50">
                <td className="px-4 py-2">
                  <select
                    value={row.priority}
                    onChange={(e) => updateGoal(index, 'priority', e.target.value)}
                    className="w-full bg-transparent outline-none border-b border-transparent focus:border-orange-300"
                  >
                    <option value="1">1 (Alta)</option>
                    <option value="2">2 (Média)</option>
                    <option value="3">3 (Baixa)</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={row.objective}
                    onChange={(e) => updateGoal(index, 'objective', e.target.value)}
                    className="w-full bg-transparent outline-none border-b border-transparent focus:border-orange-300"
                    placeholder="Objetivo..."
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={row.uses}
                    onChange={(e) => updateGoal(index, 'uses', e.target.value)}
                    className="w-full bg-transparent outline-none border-b border-transparent focus:border-orange-300"
                    placeholder="Usos BIM..."
                  />
                </td>
                <td className="px-4 py-2 text-center">
                  <button onClick={() => removeGoal(index)} className="text-slate-400 hover:text-red-500">
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

