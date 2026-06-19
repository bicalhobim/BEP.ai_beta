import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { refineText } from '../../lib/gemini';
import { motion } from 'motion/react';

interface Props {
  text: string;
  onRefine: (newText: string) => void;
  className?: string;
}

export function RefineButton({ text, onRefine, className }: Props) {
  const [loading, setLoading] = useState(false);

  const handleRefine = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const refined = await refineText(text);
      onRefine(refined);
    } catch (error) {
      console.error("Refinement failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleRefine}
      disabled={loading || !text}
      className={`p-1.5 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-md transition-colors disabled:opacity-50 ${className}`}
      title="Refinar texto para linguagem técnica (ISO 19650)"
    >
      {loading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <Sparkles className="w-3 h-3" />
      )}
    </motion.button>
  );
}
