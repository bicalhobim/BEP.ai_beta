import React, { useState } from 'react';
import { BlockData, useBEPStore } from '../../store/bepStore';
import { askISO } from '../../lib/gemini';
import { MessageSquare, Send, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/Button';

interface Props {
  block: BlockData;
}

// Q&A de normas consultando o notebook conectado no NotebookLM. A fonte (ISO 19650 /
// NBR 15965) deve estar adicionada como fonte DENTRO do notebook — o app só pergunta.
export function ReferencesBlock({ block: _block }: Props) {
  const { notebookId } = useBEPStore();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [asking, setAsking] = useState(false);

  const ready = Boolean(notebookId);

  const handleAsk = async () => {
    if (!question.trim() || !ready) return;

    setAsking(true);
    try {
      const response = await askISO(question);
      setAnswer(response);
    } catch (error) {
      console.error('Ask ISO failed', error);
      alert('Falha ao consultar o NotebookLM.');
    } finally {
      setAsking(false);
    }
  };

  return (
    <div className="space-y-6">
      {!ready ? (
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-sm text-amber-800 flex items-center gap-2">
          <BookOpen className="w-4 h-4 shrink-0" />
          Conecte um projeto do NotebookLM (botão "NotebookLM" no topo) para consultar as normas.
        </div>
      ) : (
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
          <h4 className="text-sm font-bold text-orange-900 mb-2 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Consultar Normas (NotebookLM)
          </h4>
          <p className="text-xs text-orange-800/80 mb-3">
            As normas (ISO 19650 / NBR 15965) devem estar como fonte dentro do notebook conectado.
          </p>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ex: Qual o processo de entrega de informação segundo a ISO 19650?"
              className="flex-1 p-2 text-sm border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
              aria-label="Pergunta sobre as normas do notebook"
            />
            <Button
              variant="primary"
              onClick={handleAsk}
              disabled={asking || !question}
              loading={asking}
              icon={<Send className="w-4 h-4" />}
              aria-label="Enviar pergunta"
            />
          </div>

          <AnimatePresence>
            {answer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-white p-4 rounded-lg border border-orange-100 text-sm text-slate-700 leading-relaxed"
              >
                <div className="markdown-body">
                  {answer.split('\n').map((line, i) => (
                    <p key={i} className="mb-2">{line}</p>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
