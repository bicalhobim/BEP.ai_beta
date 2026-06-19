import React from 'react';
import { BlockData, useBEPStore } from '../../store/bepStore';
import { Plus, Trash2, Users } from 'lucide-react';
import { AiSuggestionButton } from '../ui/AiSuggestionButton';

interface Props {
  block: BlockData;
  title: string;
  itemLabel: string;
  fieldKey: string;
}

export function RolesBlock({ block, title, itemLabel, fieldKey }: Props) {
  const { updateBlockContent } = useBEPStore();
  const items = block.content[fieldKey] || [];

  const handleAiSuggest = (suggestions: any[]) => {
    if (!Array.isArray(suggestions)) return;
    const newItems = suggestions.map(s => ({
      role: s.role || '',
      responsibility: s.responsibility || ''
    }));
    updateBlockContent(block.id, { 
      [fieldKey]: [...items, ...newItems] 
    });
  };

  const addItem = () => {
    updateBlockContent(block.id, { 
      [fieldKey]: [...items, { role: '', responsibility: '' }] 
    });
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    updateBlockContent(block.id, { [fieldKey]: newItems });
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    updateBlockContent(block.id, { [fieldKey]: newItems });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium text-slate-700">{title}</h4>
        <div className="flex gap-2">
          <AiSuggestionButton 
            prompt="Liste os principais papéis e responsabilidades BIM para este projeto, retornando um array de objetos JSON com as chaves: role, responsibility."
            onSuggest={handleAiSuggest}
            json={true}
          />
          <button onClick={addItem} className="text-xs flex items-center gap-1 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-md hover:bg-orange-100">
            <Plus className="w-3 h-3" /> Adicionar {itemLabel}
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600 border border-slate-200 rounded-lg">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
            <tr>
              <th className="px-4 py-3 border-b w-1/3">Papéis</th>
              <th className="px-4 py-3 border-b">Responsabilidades</th>
              <th className="px-4 py-3 border-b w-10"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: any, index: number) => (
              <tr key={index} className="border-b last:border-0 hover:bg-slate-50/50">
                <td className="px-4 py-2 align-top">
                  <textarea
                    value={item.role}
                    onChange={(e) => updateItem(index, 'role', e.target.value)}
                    className="w-full bg-transparent outline-none border border-transparent focus:border-orange-300 rounded p-1 resize-y min-h-[60px]"
                    placeholder="Papel..."
                  />
                </td>
                <td className="px-4 py-2 align-top">
                  <textarea
                    value={item.responsibility}
                    onChange={(e) => updateItem(index, 'responsibility', e.target.value)}
                    className="w-full bg-transparent outline-none border border-transparent focus:border-orange-300 rounded p-1 resize-y min-h-[60px]"
                    placeholder="Responsabilidades..."
                  />
                </td>
                <td className="px-4 py-2 text-center align-top pt-3">
                  <button onClick={() => removeItem(index)} className="text-slate-400 hover:text-red-500">
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
