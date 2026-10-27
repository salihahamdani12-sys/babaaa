import React, { useState } from 'react';
import { PRODUCTION_TOPICS, CONNECTEURS_LOGIQUES, ProductionTopic } from '../data/productionEcriteData';
import { FileText, Copy, Check, Sparkles, BookOpen, Layers, ArrowRight } from 'lucide-react';

interface ProductionEcriteStudioProps {
  showArabic: boolean;
}

export const ProductionEcriteStudio: React.FC<ProductionEcriteStudioProps> = ({ showArabic }) => {
  const [selectedTopic, setSelectedTopic] = useState<ProductionTopic>(PRODUCTION_TOPICS[0]);
  const [activeTab, setActiveTab] = useState<'modeles' | 'connecteurs' | 'methodologie'>('modeles');
  const [copiedEssay, setCopiedEssay] = useState(false);
  const [userDraft, setUserDraft] = useState('');

  const wordCount = userDraft.trim() ? userDraft.trim().split(/\s+/).length : 0;

  const handleCopyEssay = () => {
    navigator.clipboard.writeText(selectedTopic.modelEssay);
    setCopiedEssay(true);
    setTimeout(() => setCopiedEssay(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-700 font-semibold mb-1">
            <FileText className="w-4 h-4" />
            <span>Masterclass Production Écrite (10 / 20 points à l’Examen Régional)</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 font-literary">
            La Production Écrite Argumentative <span className="text-slate-400 font-arabic text-xl">(منهجية ومواضيع الإنشاء)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            نصف نقطة الامتحان الجهوي (10 نقط): المنهجية الرسمية، الروابط المنطقية، ومواضيع نموذجية مصححة
          </p>
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('modeles')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'modeles' ? 'bg-white text-indigo-700 font-bold shadow-xs' : 'text-slate-600'
            }`}
          >
            Sujets & Modèles
          </button>
          <button
            onClick={() => setActiveTab('connecteurs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'connecteurs' ? 'bg-white text-indigo-700 font-bold shadow-xs' : 'text-slate-600'
            }`}
          >
            Connecteurs Logiques
          </button>
          <button
            onClick={() => setActiveTab('methodologie')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'methodologie' ? 'bg-white text-indigo-700 font-bold shadow-xs' : 'text-slate-600'
            }`}
          >
            Méthodologie des Plans
          </button>
        </div>
      </div>

      {activeTab === 'modeles' && (
        <div className="space-y-6">
          {/* Topic Selector Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRODUCTION_TOPICS.map((topic) => {
              const isSelected = selectedTopic.id === topic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-500 shadow-xs ring-1 ring-indigo-500'
                      : 'bg-white border-slate-200 hover:border-indigo-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-indigo-700">{topic.relatedNovel}</span>
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium text-[11px]">
                      {topic.recommendedPlan}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{topic.title}</h4>
                  {showArabic && <div className="text-xs font-arabic text-slate-500 mt-1">{topic.titleAr}</div>}
                </button>
              );
            })}
          </div>

          {/* Topic Detail View */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            {/* Prompt Banner */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Sujet officiel tel que formulé à l'examen :</span>
              </span>
              <p className="text-sm text-slate-900 font-medium leading-relaxed">
                « {selectedTopic.promptFr} »
              </p>
              {showArabic && (
                <p className="text-xs font-arabic text-emerald-800 pt-1" dir="rtl">
                  {selectedTopic.promptAr}
                </p>
              )}
            </div>

            {/* Structured Outline: Arguments Pour & Contre */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Arguments Pour */}
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Arguments Pour / Thèse (أفكار وحجج التأييد) :</span>
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {selectedTopic.argumentsPour.map((arg, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{arg}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Arguments Contre */}
              <div className="bg-rose-50/50 border border-rose-200 rounded-xl p-4 space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>Arguments Contre / Antithèse (أفكار وحجج المعارضة) :</span>
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {selectedTopic.argumentsContre.map((arg, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold">•</span>
                      <span>{arg}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Model Essay */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Production rédigée modèle (Note visée : 10/10)</span>
                </h4>
                <button
                  onClick={handleCopyEssay}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                >
                  {copiedEssay ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copier le modèle</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-sm text-slate-800 leading-relaxed font-literary bg-slate-50/80 p-5 rounded-xl border border-slate-100 whitespace-pre-line selection:bg-amber-100">
                {selectedTopic.modelEssay}
              </div>
            </div>

            {/* Interactive Draft Space */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Espace d’entraînement personnel (حرر موضوعك هنا للتمرن) :
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    Recommandé pour l'examen : entre 130 et 180 mots structurés en 4 paragraphes.
                  </p>
                </div>
                <div className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-md text-slate-700">
                  {wordCount} mots
                </div>
              </div>

              <textarea
                rows={5}
                value={userDraft}
                onChange={(e) => setUserDraft(e.target.value)}
                placeholder="Rédigez votre introduction avec accroche, problématique et annonce du plan..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'connecteurs' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 font-literary mb-1">
              Dictionnaire des Connecteurs Logiques Indispensables
            </h3>
            <p className="text-xs text-slate-500 font-arabic mb-6">
              أدوات الربط المنطقي التي تمنح موضوعك تماسكاً وتضمن لك نقطة التعبير والأسلوب
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CONNECTEURS_LOGIQUES.map((grp, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3">
                  <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                      {grp.purpose}
                    </span>
                    <span className="text-xs font-arabic text-emerald-800">{grp.purposeAr}</span>
                  </div>

                  <div className="space-y-2">
                    {grp.items.map((item, i) => (
                      <div key={i} className="bg-white p-3 rounded-lg border border-slate-100 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span>{item.word}</span>
                          <span className="font-arabic font-normal text-slate-600">{item.translationAr}</span>
                        </div>
                        <p className="text-slate-500 text-[11px]">{item.usageNote}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'methodologie' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <h3 className="text-lg font-bold text-slate-900 font-literary">
            La Méthodologie du Plan Dialectique & du Plan Simple
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plan Dialectique */}
            <div className="bg-indigo-50/50 border border-indigo-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-700" />
                <h4 className="text-sm font-bold text-indigo-950 uppercase tracking-wider">
                  1. Le Plan Dialectique (Sujet d'opinion / Controverse)
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Utilisé lorsque la consigne pose une question ouverte ou demande si vous partagez une opinion controversée (ex: "Partagez-vous ce point de vue ?").
              </p>

              <div className="space-y-2 text-xs text-slate-800">
                <div className="bg-white p-3 rounded-lg border border-indigo-100">
                  <span className="font-bold text-indigo-900">Paragraphe 1 (Introduction) :</span>
                  <div className="text-slate-600 mt-1">Accroche générale + Présentation du sujet + Problématique + Annonce des deux axes.</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-indigo-100">
                  <span className="font-bold text-indigo-900">Paragraphe 2 (Thèse - Pour) :</span>
                  <div className="text-slate-600 mt-1">D'abord les arguments qui soutiennent la première idée avec exemples.</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-indigo-100">
                  <span className="font-bold text-indigo-900">Paragraphe 3 (Antithèse - Contre) :</span>
                  <div className="text-slate-600 mt-1">Transition (Cependant...), puis arguments réfutant la première thèse avec exemples.</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-indigo-100">
                  <span className="font-bold text-indigo-900">Paragraphe 4 (Conclusion & Prise de position) :</span>
                  <div className="text-slate-600 mt-1">Bilan équilibré + Votre point de vue personnel argumenté.</div>
                </div>
              </div>
            </div>

            {/* Plan Simple / Thématique */}
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-700" />
                <h4 className="text-sm font-bold text-emerald-950 uppercase tracking-wider">
                  2. Le Plan Thématique (Démonstration d'une thèse)
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Utilisé lorsque la consigne vous demande d'illustrer une idée unanime ou d'analyser les causes et conséquences d'un phénomène (ex: "Quels sont les bienfaits de la lecture ?").
              </p>

              <div className="space-y-2 text-xs text-slate-800">
                <div className="bg-white p-3 rounded-lg border border-emerald-100">
                  <span className="font-bold text-emerald-900">Paragraphe 1 (Introduction) :</span>
                  <div className="text-slate-600 mt-1">Accroche + Définition du concept + Problématique + Annonce des axes d'analyse.</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-100">
                  <span className="font-bold text-emerald-900">Paragraphe 2 (Axe 1 - Dimension individuelle) :</span>
                  <div className="text-slate-600 mt-1">Premier faisceau d'arguments avec connecteurs (En premier lieu...).</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-100">
                  <span className="font-bold text-emerald-900">Paragraphe 3 (Axe 2 - Dimension collective / sociale) :</span>
                  <div className="text-slate-600 mt-1">Second faisceau d'arguments (De surcroît, sur le plan social...).</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-100">
                  <span className="font-bold text-emerald-900">Paragraphe 4 (Conclusion) :</span>
                  <div className="text-slate-600 mt-1">Synthèse générale + Recommandation ou ouverture philosophique.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
