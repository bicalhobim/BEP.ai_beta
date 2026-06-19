import React from 'react';
import { BlockData, useBEPStore } from '../../store/bepStore';
import { ListChecks, Plus, Trash2 } from 'lucide-react';

interface Props {
  block: BlockData;
}

export function ResponsibilityMatrixBlock({ block }: Props) {
  const { updateBlockContent } = useBEPStore();

  const handleChange = (index: number, field: string, value: string) => {
    const newTeam = [...(block.content.technical_team || [])];
    newTeam[index] = { ...newTeam[index], [field]: value };
    updateBlockContent(block.id, { technical_team: newTeam });
  };

  const addMember = () => {
    const newTeam = [...(block.content.technical_team || []), { role: '', name: '', registry: '', email: '', phone: '' }];
    updateBlockContent(block.id, { technical_team: newTeam });
  };

  const removeMember = (index: number) => {
    const newTeam = [...(block.content.technical_team || [])];
    newTeam.splice(index, 1);
    updateBlockContent(block.id, { technical_team: newTeam });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <ListChecks className="w-4 h-4 text-orange-600" />
          Tabela 4 - Contatos da Equipe Técnica
        </h3>
        <button onClick={addMember} className="text-xs flex items-center gap-1 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-md hover:bg-orange-100">
          <Plus className="w-3 h-3" /> Adicionar Membro
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600 border border-slate-200 rounded-lg">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
            <tr>
              <th className="px-4 py-3 border-b">Papel</th>
              <th className="px-4 py-3 border-b">Nome</th>
              <th className="px-4 py-3 border-b">Registro (Conselho)</th>
              <th className="px-4 py-3 border-b">E-mail</th>
              <th className="px-4 py-3 border-b">Contato</th>
              <th className="px-4 py-3 border-b w-10"></th>
            </tr>
          </thead>
          <tbody>
            {block.content.technical_team?.map((row: any, index: number) => (
              <tr key={index} className="border-b last:border-0 hover:bg-slate-50/50">
                <td className="px-4 py-2 font-medium text-slate-700">
                  <input
                    type="text"
                    value={row.role}
                    onChange={(e) => handleChange(index, 'role', e.target.value)}
                    className="w-full bg-transparent outline-none border-b border-transparent focus:border-orange-300 font-medium"
                    placeholder="Papel..."
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={row.name}
                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                    className="w-full bg-transparent outline-none border-b border-transparent focus:border-orange-300"
                    placeholder="Nome..."
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={row.registry}
                    onChange={(e) => handleChange(index, 'registry', e.target.value)}
                    className="w-full bg-transparent outline-none border-b border-transparent focus:border-orange-300"
                    placeholder="CAU/CREA..."
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="email"
                    value={row.email}
                    onChange={(e) => handleChange(index, 'email', e.target.value)}
                    className="w-full bg-transparent outline-none border-b border-transparent focus:border-orange-300"
                    placeholder="E-mail..."
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={row.phone}
                    onChange={(e) => handleChange(index, 'phone', e.target.value)}
                    className="w-full bg-transparent outline-none border-b border-transparent focus:border-orange-300"
                    placeholder="Tel..."
                  />
                </td>
                <td className="px-4 py-2 text-center">
                  <button onClick={() => removeMember(index)} className="text-slate-400 hover:text-red-500 transition-colors">
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
