import React, { useState } from 'react';
import { BlockData, useBEPStore } from '../../store/bepStore';
import { optimizeLOD } from '../../lib/gemini';
import { Loader2, AlertTriangle, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { AiSuggestionButton } from '../ui/AiSuggestionButton';

interface Props {
  block: BlockData;
}

export function LODBlock({ block }: Props) {
  const { updateBlockContent } = useBEPStore();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const requirements = block.content.requirements || [];

  const phases = ["LV", "EP", "AP / PL", "PB", "PE", "As-Built"];
  const lods = ["100", "200", "300", "350", "400", "500"];

  const handleAiSuggest = (suggestions: any[]) => {
    if (!Array.isArray(suggestions)) return;
    const newReqs = suggestions.map(s => ({
      phase: s.phase || '',
      lod: s.lod || '',
      loin: s.loin || ''
    }));
    updateBlockContent(block.id, { 
      requirements: [...requirements, ...newReqs] 
    });
  };

  const handleAnalyze = async () => {
    // Analyze the last added requirement or specific one?
    // For now, let's analyze the last one or provide a specific button per row.
    // Let's analyze the highest LOD to check for over-modeling overall.
    const highestLODReq = requirements.reduce((prev: any, current: any) => {
      return (parseInt(prev.lod) > parseInt(current.lod)) ? prev : current;
    }, requirements[0]);

    if (!highestLODReq) return;

    setLoading(true);
    setAnalysis(null);
    try {
      const result = await optimizeLOD("Modelo Geral", highestLODReq.phase, `LOD ${highestLODReq.lod}`);
      setAnalysis(JSON.parse(result));
    } catch (error) {
      console.error("LOD Analysis failed", error);
    } finally {
      setLoading(false);
    }
  };

  const addRequirement = () => {
    updateBlockContent(block.id, { 
      requirements: [...requirements, { phase: '', lod: '', loin: '' }] 
    });
  };

  const removeRequirement = (index: number) => {
    const newReqs = [...requirements];
    newReqs.splice(index, 1);
    updateBlockContent(block.id, { requirements: newReqs });
  };

  const updateRequirement = (index: number, field: string, value: string) => {
    const newReqs = [...requirements];
    newReqs[index] = { ...newReqs[index], [field]: value };
    updateBlockContent(block.id, { requirements: newReqs });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-slate-800">Tabela 8 - Requisitos de Informação do Projeto</h3>
        <div className="flex gap-2">
          <AiSuggestionButton 
            prompt="Liste os requisitos de LOD e LOIN por fase para este projeto, retornando um array de objetos JSON com as chaves: phase, lod, loin."
            onSuggest={handleAiSuggest}
            json={true}
          />
          <button onClick={addRequirement} className="text-xs flex items-center gap-1 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-md hover:bg-orange-100">
            <Plus className="w-3 h-3" /> Adicionar Fase
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600 border border-slate-200 rounded-lg">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
            <tr>
              <th className="px-4 py-3 border-b">Fase</th>
              <th className="px-4 py-3 border-b">Nível de Desenvolvimento (LOD)</th>
              <th className="px-4 py-3 border-b">Nível de Informação (LOIN)</th>
              <th className="px-4 py-3 border-b w-10"></th>
            </tr>
          </thead>
          <tbody>
            {requirements.map((row: any, index: number) => (
              <tr key={index} className="border-b last:border-0 hover:bg-slate-50/50">
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={row.phase}
                    onChange={(e) => updateRequirement(index, 'phase', e.target.value)}
                    className="w-full bg-transparent outline-none border-b border-transparent focus:border-orange-300"
                    placeholder="Fase..."
                  />
                </td>
                <td className="px-4 py-2">
                  <select
                    value={row.lod}
                    onChange={(e) => updateRequirement(index, 'lod', e.target.value)}
                    className="w-full bg-transparent outline-none border-b border-transparent focus:border-orange-300"
                  >
                    <option value="">Selecione...</option>
                    {lods.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={row.loin}
                    onChange={(e) => updateRequirement(index, 'loin', e.target.value)}
                    className="w-full bg-transparent outline-none border-b border-transparent focus:border-orange-300"
                    placeholder="1, 2, 3..."
                  />
                </td>
                <td className="px-4 py-2 text-center">
                  <button onClick={() => removeRequirement(index)} className="text-slate-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <button
          onClick={handleAnalyze}
          disabled={loading || requirements.length === 0}
          className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verificar Over-modeling (IA)"}
        </button>
      </div>

      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border ${
            analysis.status === 'Adequado' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}
        >
          <div className="flex items-start gap-3">
            {analysis.status === 'Adequado' ? (
              <CheckCircle className="w-5 h-5 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 mt-0.5" />
            )}
            <div>
              <h4 className="font-bold text-sm mb-1">{analysis.status}</h4>
              <p className="text-sm opacity-90 mb-2">{analysis.reasoning}</p>
              
              {analysis.suggested_lod && (
                <div className="mt-3 flex items-center gap-3 bg-white/50 p-2 rounded-lg">
                  <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded border border-orange-200">
                    Sugestão: {analysis.suggested_lod}
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

