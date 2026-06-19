import React from 'react';
import { motion } from 'motion/react';
import { useBEPStore } from '../../store/bepStore';
import { ArrowRight, BookOpen, Layers, CheckCircle, Zap } from 'lucide-react';

export function Home() {
  const { setActiveView } = useBEPStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 20 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl w-full z-10"
      >
        <div className="text-center mb-16">
          <motion.div variants={itemVariants} className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-slate-900/20">
            <span className="text-white font-black text-3xl tracking-tighter">B.ai</span>
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            BEP<span className="text-orange-600">.ai</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto font-medium leading-relaxed">
            Plataforma inteligente para automação de Planos de Execução BIM. 
            Construa documentos precisos baseados nas normativas ISO 19650 e NBR 15965.
          </motion.p>
          
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveView('editor')}
            className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-slate-800 transition-colors shadow-xl shadow-slate-900/20"
          >
            Iniciar Novo BEP
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>

        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 text-orange-600">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Preenchimento Acelerado</h3>
            <p className="text-slate-600 leading-relaxed">
              Utilize o assistente de Inteligência Artificial para gerar textos estruturados e sugestões técnicas para cada seção do seu plano de execução.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Conformidade Normativa</h3>
            <p className="text-slate-600 leading-relaxed">
              O assistente garante que as respostas e as estruturas de dados estejam em total alinhamento com a ISO 19650 e referências brasileiras.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-600">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Exportação Profissional</h3>
            <p className="text-slate-600 leading-relaxed">
              Após a estruturação via matrizes e kanbans, exporte o documento final diretamente para um PDF limpo, corporativo e formatado.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
