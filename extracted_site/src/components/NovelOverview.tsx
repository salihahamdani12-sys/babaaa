import React, { useState } from 'react';
import { Novel, Character } from '../data/novelsData';
import { Award, User, Clock, Compass, Layers, Check, Copy } from 'lucide-react';

interface NovelOverviewProps {
  novel: Novel;
  showArabic: boolean;
}

export const NovelOverview: React.FC<NovelOverviewProps> = ({ novel, showArabic }) => {
  const [copiedFiche, setCopiedFiche] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(novel.characters[0] || null);

  const copyFiche = () => {
    const text = `FICHE DE LECTURE OFFICIELLE - 1ÈRE BAC
Titre : ${novel.title} (${novel.titleAr})
Auteur : ${novel.author} (${novel.authorDates})
Genre : ${novel.genre}
Écriture : ${novel.yearWritten} | Publication : ${novel.yearPublished}
Époque : ${novel.epoch}
Narrateur : ${novel.narrator}
Focalisation : ${novel.focalization}
Registres : ${novel.registers.join(', ')}
Thèmes : ${novel.themes.join(', ')}
Contexte : ${novel.historicalContext}`;

    navigator.clipboard.writeText(text);
    setCopiedFiche(true);
    setTimeout(() => setCopiedFiche(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Top Banner and Quick Copy */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-700 font-semibold mb-1">
            <Award className="w-4 h-4" />
            <span>Fiche de lecture officielle pour l’examen régional</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 font-literary">
            {novel.title} · <span className="font-arabic font-normal text-slate-500 text-xl">{novel.titleAr}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            بطاقة تقنية شاملة مطابقة للأطر المرجعية لوزارة التربية الوطنية بالمغرب
          </p>
        </div>

        <button
          onClick={copyFiche}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs md:text-sm font-medium transition-colors shadow-xs self-start md:self-auto"
        >
          {copiedFiche ? (
            <>
              <Check className="w-4 h-4" />
              <span>Fiche copiée !</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copier la fiche de révision</span>
            </>
          )}
        </button>
      </div>

      {/* Grid of Key Technical Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Author & Dates */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-indigo-600 mb-2">
            <User className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Auteur</span>
          </div>
          <div className="text-base font-bold text-slate-900">{novel.author}</div>
          <div className="text-xs text-slate-500 mt-0.5">{novel.authorDates}</div>
          {showArabic && <div className="text-xs font-arabic text-indigo-700 mt-1">{novel.authorAr}</div>}
        </div>

        {/* Card 2: Genre & Courant */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <Compass className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Genre littéraire</span>
          </div>
          <div className="text-base font-bold text-slate-900">{novel.genre}</div>
          <div className="text-xs text-slate-500 mt-0.5">Écrit en {novel.yearWritten} · Paru en {novel.yearPublished}</div>
          {showArabic && <div className="text-xs font-arabic text-emerald-700 mt-1">{novel.genreAr}</div>}
        </div>

        {/* Card 3: Narrateur & Focalisation */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-amber-600 mb-2">
            <Layers className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Point de vue</span>
          </div>
          <div className="text-sm font-bold text-slate-900">{novel.focalization}</div>
          <div className="text-xs text-slate-500 mt-0.5">{novel.narrator}</div>
          {showArabic && <div className="text-xs font-arabic text-amber-800 mt-1">{novel.focalizationAr}</div>}
        </div>

        {/* Card 4: Siècle & Époque */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-rose-600 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Époque & Cadre</span>
          </div>
          <div className="text-sm font-bold text-slate-900">{novel.epoch}</div>
          {showArabic && <div className="text-xs font-arabic text-rose-800 mt-1">{novel.epochAr}</div>}
        </div>
      </div>

      {/* Registers & Major Themes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Registres littéraires */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center justify-between">
            <span>Registres littéraires dominants</span>
            <span className="text-xs font-arabic text-slate-400">السجلات والأساليب</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {novel.registers.map((reg, idx) => (
              <span
                key={idx}
                className="bg-indigo-50 border border-indigo-100 text-indigo-900 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                <span>{reg}</span>
                {showArabic && (
                  <span className="text-[11px] font-arabic text-indigo-600 opacity-80">
                    ({novel.registersAr[idx]})
                  </span>
                )}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4 leading-relaxed">
            Très demandé dans la question 5 ou 6 de l’examen régional : justifiez toujours votre réponse en citant des indices textuels (champs lexicaux de la mort, de la plainte ou de l’ironie).
          </p>
        </div>

        {/* Thèmes majeurs */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center justify-between">
            <span>Thèmes majeurs & Sujets de Production</span>
            <span className="text-xs font-arabic text-slate-400">أبرز المحاور والمواضيع</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {novel.themes.map((thm, idx) => (
              <span
                key={idx}
                className="bg-emerald-50 border border-emerald-100 text-emerald-900 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>{thm}</span>
                {showArabic && (
                  <span className="text-[11px] font-arabic text-emerald-700 opacity-80">
                    ({novel.themesAr[idx]})
                  </span>
                )}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4 leading-relaxed">
            Ces thématiques constituent la base des sujets de production écrite à l'examen régional. Entraînez-vous à développer des arguments pour et contre chacun d’eux.
          </p>
        </div>
      </div>

      {/* Characters Gallery / Mosaïque des Personnages */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-literary">
              Galerie des Personnages & Citations Clés
            </h3>
            <p className="text-xs text-slate-500 font-arabic">
              الشخصيات الرئيسية وعلاقاتها ومواقفها في الأحداث
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Characters List Selector */}
          <div className="space-y-2">
            {novel.characters.map((char) => {
              const isSelected = selectedCharacter?.name === char.name;
              return (
                <button
                  key={char.name}
                  onClick={() => setSelectedCharacter(char)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div>
                    <div className="text-sm font-semibold">{char.name}</div>
                    <div className={`text-xs ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                      {char.role}
                    </div>
                  </div>
                  {char.badge && (
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-indigo-800 text-indigo-100' : 'bg-indigo-50 text-indigo-700'}`}>
                      {char.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Character Detail Card */}
          {selectedCharacter && (
            <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 font-literary">
                      {selectedCharacter.name}
                    </h4>
                    <div className="text-xs text-indigo-600 font-medium">
                      {selectedCharacter.role} {showArabic && `· ${selectedCharacter.roleAr}`}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Description & Analyse psychologique :
                    </h5>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {selectedCharacter.description}
                    </p>
                    {showArabic && (
                      <p className="text-xs text-slate-600 font-arabic mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {selectedCharacter.descriptionAr}
                      </p>
                    )}
                  </div>

                  {selectedCharacter.quote && (
                    <div className="bg-amber-50/70 border-l-4 border-amber-500 p-4 rounded-r-xl">
                      <div className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                        Citation clé à retenir :
                      </div>
                      <div className="text-sm font-literary italic text-amber-950">
                        « {selectedCharacter.quote} »
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
                <span>Rôle clé dans le dénouement</span>
                <span className="text-indigo-600 font-medium">Préparation Régional 1ère Bac</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
