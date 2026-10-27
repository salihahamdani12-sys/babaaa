import React, { useState } from 'react';
import { BookId } from '../types';
type NovelId = BookId | 'boite-a-merveilles' | 'antigone' | 'dernier-jour';
import { Sparkles, Send, Loader2, BookOpen, Copy, Check, MessageSquare } from 'lucide-react';

interface AiAssistantProps {
  activeNovel: NovelId;
  showArabic: boolean;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ activeNovel, showArabic }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `مرحباً بك! أنا أستاذك والمساعد التربوي الذكي الخاص بالامتحان الجهوي للأولى باكالوريا في مادة اللغة الفرنسية 🎓.

يمكنك أن تسألني عن أي شيء يتعلق بالمؤلفات الثلاثة:
• تحليل وتحديد أي **محسن بلاغي (Figure de style)** مع الشرح
• منهجية **تأطير أي نص (Situation du passage)** بدقة متناهية
• بناء وتطوير **خطة الإنشاء (Plan de Production écrite)** مع الحجج
• شرح مفردات وسياق أحداث **La Boîte à Merveilles**، **Antigone**، أو **Le Dernier Jour d'un Condamné**.

اختر سؤالاً سريعاً من الأسفل أو اكتب سؤالك مباشرة!`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const quickPrompts = [
    {
      label: 'Figure de style : "Mon esprit est en prison"',
      prompt: 'Quelle est la figure de style dans : "Mon esprit est en prison dans une idée" tirée du Dernier Jour d’un Condamné ? Explique l’effet recherché pour l’examen régional.'
    },
    {
      label: 'Situation du passage : Départ du père',
      prompt: 'Comment situer précisément le passage du chapitre 9 de La Boîte à Merveilles où Maâlem Abdeslam annonce son départ aux champs ?'
    },
    {
      label: 'Conflit Antigone / Créon : Le Bonheur',
      prompt: 'Pourquoi Antigone refuse-t-elle avec violence l’idée du bonheur que lui propose Créon lors de leur face-à-face ?'
    },
    {
      label: 'Plan de production : La solitude',
      prompt: 'Propose-moi un plan dialectique complet avec arguments et connecteurs pour un sujet sur : "La solitude est-elle une source de souffrance ou un espace de liberté et de créativité ?"'
    }
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          novel: activeNovel,
          mode: 'question'
        })
      });

      const data = await response.json();
      const replyText = data.reply || data.error || 'Désolé, une erreur est survenue lors de la réponse.';

      setMessages((prev) => [...prev, { role: 'assistant', content: replyText }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Erreur de connexion au serveur d’assistance. Veuillez réessayer dans un instant.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (content: string, idx: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-700 font-semibold mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Assistant IA Pédagogique Spécialisé 1ère Bac Maroc</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 font-literary">
            Professeur Virtuel 1ère Bac <span className="text-slate-400 font-arabic text-xl">(المساعد الذكي)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            إجابات منهجية دقيقة للأسئلة المباشرة، تحليل الاستعارات، وتأطير النصوص وفق معايير التصحيح الرسمية
          </p>
        </div>
      </div>

      {/* Quick Questions Pills */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
          <span>Questions fréquentes à tester en un clic :</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp.prompt)}
              disabled={isLoading}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 rounded-xl text-xs font-medium transition-colors shadow-2xs text-left"
            >
              {qp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6 shadow-xs flex flex-col h-[520px]">
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={idx}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed whitespace-pre-line ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs font-medium'
                      : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-bl-xs font-arabic'
                  }`}
                  dir={isUser ? 'ltr' : 'auto'}
                >
                  {msg.content}
                </div>

                {!isUser && (
                  <button
                    onClick={() => handleCopyMessage(msg.content, idx)}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-indigo-600 mt-1 ml-2 transition-colors"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Copié</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copier l'explication</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-sm text-xs text-slate-600">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span>Le professeur analyse votre question selon le programme...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-3 border-t border-slate-100 flex items-center gap-2 mt-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Posez votre question (ex: Quelle est la figure dans '...' ?)"
            disabled={isLoading}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs md:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs md:text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span>Envoyer</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
