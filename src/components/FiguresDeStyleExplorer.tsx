import React, { useState } from 'react';
import { FIGURES_DE_STYLE, FigureDeStyleItem } from '../data/figuresDeStyleData';
import { Feather, Search, AlertCircle, Sparkles, BookOpen } from 'lucide-react';

interface FiguresDeStyleExplorerProps {
  showArabic: boolean;
}

export const FiguresDeStyleExplorer: React.FC<FiguresDeStyleExplorerProps> = ({ showArabic }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFigure, setSelectedFigure] = useState<FigureDeStyleItem>(FIGURES_DE_STYLE[0]);

  const categories = [
    { id: 'all', labelFr: 'Toutes les figures', labelAr: 'الكل' },
    { id: 'Images & Analogies', labelFr: 'Images & Analogies', labelAr: 'الصور والتشبيهات' },
    { id: 'Opposition', labelFr: 'Opposition', labelAr: 'التضاد والمفارقة' },
    { id: 'Amplification & Insistance', labelFr: 'Amplification & Insistance', labelAr: 'التضخيم والتوكيد' },
    { id: 'Atténuation & Substitution', labelFr: 'Atténuation & Substitution', labelAr: 'التلطيف والبدائل' }
  ];

  const filteredFigures = FIGURES_DE_STYLE.filter((fig) => {
    const matchesCategory = selectedCategory === 'all' || fig.category === selectedCategory;
    const matchesSearch =
      fig.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fig.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fig.definition.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-700 font-semibold mb-1">
              <Feather className="w-4 h-4" />
              <span>Guide officiel des figures de style pour l’Examen Régional</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 font-literary">
              Les Figures de Style au Programme <span className="text-slate-400 font-arabic text-xl">(المحسنات البلاغية)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              السؤال رقم 5 أو 6 في الامتحان الجهوي (نقطة مضمونة): اكتشف الحيل الذهبية للتعرف عليها مع أمثلة من الروايات الثلاث
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher (ex: oxymore, métaphore)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs md:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{cat.labelFr}</span>
              {showArabic && <span className="opacity-75 text-[11px] font-arabic ml-1.5">({cat.labelAr})</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: List on Left, Deep Dive on Right */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Figures List */}
        <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
          {filteredFigures.map((fig) => {
            const isSelected = selectedFigure.name === fig.name;
            return (
              <button
                key={fig.name}
                onClick={() => setSelectedFigure(fig)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div>
                  <div className="text-sm font-bold flex items-center gap-1.5">
                    <span>{fig.name}</span>
                  </div>
                  <div className={`text-xs mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                    {fig.category}
                  </div>
                  {showArabic && (
                    <div className={`text-xs font-arabic mt-1 ${isSelected ? 'text-indigo-200' : 'text-indigo-700'}`}>
                      {fig.nameAr}
                    </div>
                  )}
                </div>

                <div className={`text-xs px-2 py-1 rounded-md font-medium ${isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {fig.examples.length} ex.
                </div>
              </button>
            );
          })}

          {filteredFigures.length === 0 && (
            <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200 text-xs">
              Aucune figure trouvée pour "{searchQuery}".
            </div>
          )}
        </div>

        {/* Selected Figure Detail Panel */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          {/* Header */}
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                {selectedFigure.category}
              </span>
              <span className="text-xs text-slate-400 font-arabic">
                {selectedFigure.categoryAr}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mt-2 font-literary">
              {selectedFigure.name}
            </h3>
            {showArabic && (
              <div className="text-sm font-arabic font-semibold text-emerald-700 mt-1">
                {selectedFigure.nameAr}
              </div>
            )}
          </div>

          {/* Definition */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Définition claire :
            </h4>
            <p className="text-sm text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {selectedFigure.definition}
            </p>
            {showArabic && (
              <p className="text-xs text-slate-700 font-arabic leading-relaxed bg-emerald-50/50 p-3 rounded-lg border border-emerald-100" dir="rtl">
                {selectedFigure.definitionAr}
              </p>
            )}
          </div>

          {/* Exam Tip Callout (حيلة الامتحان الجهوي) */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Astuce d’Examen Régional (حيلة لاكتشافها بسرعة وتجنب الفخاخ) :</span>
            </div>
            <p className="text-xs text-amber-950 leading-relaxed font-medium">
              {selectedFigure.examTip}
            </p>
            {showArabic && (
              <p className="text-xs text-amber-900 font-arabic leading-relaxed pt-1" dir="rtl">
                {selectedFigure.examTipAr}
              </p>
            )}
          </div>

          {/* Real Work Examples */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Exemples authentiques tirés des 3 œuvres :</span>
            </h4>

            <div className="space-y-3">
              {selectedFigure.examples.map((ex, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-700 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{ex.work}</span>
                    </span>
                    <span className="text-[11px] text-slate-400">Exemple examen</span>
                  </div>

                  <div className="text-sm font-literary italic text-slate-900 bg-white p-3 rounded-lg border border-slate-100">
                    « {ex.quote} »
                  </div>

                  <div className="text-xs text-slate-600 leading-relaxed">
                    <span className="font-semibold text-slate-700">Explication : </span>
                    {ex.explanation}
                  </div>

                  {showArabic && (
                    <div className="text-xs font-arabic text-emerald-800 pt-1" dir="rtl">
                      {ex.explanationAr}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
