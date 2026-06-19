import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { useBEPStore } from '../../store/bepStore';
import { suggestContent } from '../../lib/gemini';

interface Props {
  prompt: string;
  onSuggest: (suggestion: any) => void;
  className?: string;
  label?: string;
  json?: boolean;
}

export function AiSuggestionButton({ prompt, onSuggest, className, label = "Sugerir", json = false }: Props) {
  const { isoContext } = useBEPStore();
  const [loading, setLoading] = useState(false);

  const handleSuggest = async () => {
    if (!isoContext) {
      alert("Por favor, importe um PDF (EIR) primeiro para usar a IA.");
      return;
    }

    setLoading(true);
    try {
      const suggestion = await suggestContent(isoContext, prompt, json);
      onSuggest(json ? JSON.parse(suggestion) : suggestion);
    } catch (error) {
      console.error("Suggestion failed", error);
      alert("Falha ao gerar sugestão.");
    } finally {
      setLoading(false);
    }
  };

  if (!isoContext) return null;

  return (
    <button
      onClick={handleSuggest}
      disabled={loading}
      className={`flex items-center gap-1.5 text-xs font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 px-2 py-1 rounded-md transition-colors ${className}`}
      title="Gerar sugestão com base no Edital/EIR"
    >
      {loading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <Sparkles className="w-3 h-3" />
      )}
      {label}
    </button>
  );
}
