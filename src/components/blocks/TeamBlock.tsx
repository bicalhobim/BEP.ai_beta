import React from 'react';
import { BlockData, useBEPStore } from '../../store/bepStore';
import { Users, Plus, Trash2 } from 'lucide-react';

interface Props {
  block: BlockData;
}

export function TeamBlock({ block }: Props) {
  const { updateBlockContent } = useBEPStore();

  const handleContractorChange = (index: number, field: string, value: string) => {
    const newTeam = [...(block.content.contractor_team || [])];
    newTeam[index] = { ...newTeam[index], [field]: value };
    updateBlockContent(block.id, { contractor_team: newTeam });
  };

  const addContractor = () => {
    const newTeam = [...(block.content.contractor_team || []), { role: '', name: '', education: '', email: '', phone: '' }];
    updateBlockContent(block.id, { contractor_team: newTeam });
  };

  const removeContractor = (index: number) => {
    const newTeam = [...(block.content.contractor_team || [])];
    newTeam.splice(index, 1);
    updateBlockContent(block.id, { contractor_team: newTeam });
  };

  const handleBidderChange = (index: number, field: string, value: string) => {
    const newTeam = [...(block.content.bidder_team || [])];
    newTeam[index] = { ...newTeam[index], [field]: value };
    updateBlockContent(block.id, { bidder_team: newTeam });
  };

  const addBidder = () => {
    const newTeam = [...(block.content.bidder_team || []), { role: '', name: '', education: '', email: '', phone: '' }];
    updateBlockContent(block.id, { bidder_team: newTeam });
  };

  const removeBidder = (index: number) => {
    const newTeam = [...(block.content.bidder_team || [])];
    newTeam.splice(index, 1);
    updateBlockContent(block.id, { bidder_team: newTeam });
  };

  const renderTable = (
    data: any[], 
    onChange: (index: number, field: string, value: string) => void,
    onRemove: (index: number) => void
  ) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-600 border border-slate-200 rounded-lg">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
          <tr>
            <th className="px-4 py-3 border-b">Papel</th>
            <th className="px-4 py-3 border-b">Nome</th>
            <th className="px-4 py-3 border-b">Formação</th>
            <th className="px-4 py-3 border-b">E-mail</th>
            <th className="px-4 py-3 border-b">Telefone</th>
            <th className="px-4 py-3 border-b w-10"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-b last:border-0 hover:bg-slate-50/50">
              <td className="px-4 py-2 font-medium text-slate-700">
                <input
                  type="text"
                  value={row.role}
                  onChange={(e) => onChange(index, 'role', e.target.value)}
                  className="w-full bg-transparent outline-none border-b border-transparent focus:border-orange-300 font-medium"
                  placeholder="Papel..."
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="text"
                  value={row.name}
                  onChange={(e) => onChange(index, 'name', e.target.value)}
                  className="w-full bg-transparent outline-none border-b border-transparent focus:border-orange-300"
                  placeholder="Nome..."
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="text"
                  value={row.education}
                  onChange={(e) => onChange(index, 'education', e.target.value)}
                  className="w-full bg-transparent outline-none border-b border-transparent focus:border-orange-300"
                  placeholder="Formação..."
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="email"
                  value={row.email}
                  onChange={(e) => onChange(index, 'email', e.target.value)}
                  className="w-full bg-transparent outline-none border-b border-transparent focus:border-orange-300"
                  placeholder="E-mail..."
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="text"
                  value={row.phone}
                  onChange={(e) => onChange(index, 'phone', e.target.value)}
                  className="w-full bg-transparent outline-none border-b border-transparent focus:border-orange-300"
                  placeholder="Tel..."
                />
              </td>
              <td className="px-4 py-2 text-center">
                <button onClick={() => onRemove(index)} className="text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-4 h-4 text-orange-600" />
            Dados do Contratante
          </h3>
          <button onClick={addContractor} className="text-xs flex items-center gap-1 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-md hover:bg-orange-100">
            <Plus className="w-3 h-3" /> Adicionar Membro
          </button>
        </div>
        {renderTable(block.content.contractor_team || [], handleContractorChange, removeContractor)}
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-4 h-4 text-orange-600" />
            Dados do Licitante
          </h3>
          <button onClick={addBidder} className="text-xs flex items-center gap-1 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-md hover:bg-orange-100">
            <Plus className="w-3 h-3" /> Adicionar Membro
          </button>
        </div>
        {renderTable(block.content.bidder_team || [], handleBidderChange, removeBidder)}
      </div>
    </div>
  );
}
