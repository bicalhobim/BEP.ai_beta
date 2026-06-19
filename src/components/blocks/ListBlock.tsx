import React from 'react';
import { BlockData, useBEPStore } from '../../store/bepStore';
import { Plus, Trash2, Users } from 'lucide-react';

interface Props {
  block: BlockData;
  title: string;
  itemLabel: string;
  fieldKey: string;
}

export function ListBlock({ block, title, itemLabel, fieldKey }: Props) {
  const { updateBlockContent } = useBEPStore();
  const items = block.content[fieldKey] || [];

  const addItem = () => {
    updateBlockContent(block.id, { 
      [fieldKey]: [...items, { id: Date.now(), text: '' }] 
    });
  };

  const updateItem = (index: number, text: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], text };
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
        <button onClick={addItem} className="text-xs flex items-center gap-1 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-md hover:bg-orange-100">
          <Plus className="w-3 h-3" /> Adicionar {itemLabel}
        </button>
      </div>
      
      {items.map((item: any, i: number) => (
        <div key={item.id} className="flex gap-2">
          <input
            type="text"
            value={item.text}
            onChange={(e) => updateItem(i, e.target.value)}
            className="flex-1 p-2 text-sm border border-slate-300 rounded-md"
            placeholder={`Descreva o ${itemLabel.toLowerCase()}...`}
          />
          <button onClick={() => removeItem(i)} className="p-2 text-slate-400 hover:text-red-500">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
