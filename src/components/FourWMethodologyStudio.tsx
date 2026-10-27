import React, { useState } from 'react';
import {
  Compass, BookOpen, Sparkles, CheckCircle2, Copy, Check, Volume2,
  Users, MapPin, Clock, FileText, ArrowRight, ArrowLeft, Lightbulb,
  ExternalLink, Layers, Award, ShieldAlert, BookmarkCheck, ChevronDown
} from 'lucide-react';
import { BookId, BookInfo } from '../types';
import {
  FOUR_W_GUIDE,
  FOUR_W_PASSAGES,
  FourWEntry,
  getFourWEntriesForBook,
  generateCustomFourWFormula
} from '../data/fourWService';
import { BOOKS } from '../data/books';

interface FourWMethodologyStudioProps {
  selectedBookId: BookId;
  onSelectBookId?: (id: BookId) => void;
  onJumpToPage?: (pageNumber: number) => void;
  onClose?: () => void;
}

export const FourWMethodologyStudio: React.FC<FourWMethodologyStudioProps> = ({
  selectedBookId,
  onSelectBookId,
  onJumpToPage,
  onClose,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'builder' | 'guide'>('matrix');
  const [selectedPassageId, setSelectedPassageId] = useState<string>(() => {
    const passages = getFourWEntriesForBook(selectedBookId);
    return passages[0]?.id || FOUR_W_PASSAGES[0].id;
  });
  const [activeFormulaType, setActiveFormulaType] = useState<'evenementielle' | 'globale'>('evenementielle');
  const [copiedFormula, setCopiedFormula] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Custom Interactive Builder State
  const [builderBook, setBuilderBook] = useState<BookId>(selectedBookId);
  const [builderWho, setBuilderWho] = useState<string>('');
  const [builderWhat, setBuilderWhat] = useState<string>('');
  const [builderWhere, setBuilderWhere] = useState<string>('');
  const [builderPreceded, setBuilderPreceded] = useState<string>('');
  const [builderFollows, setBuilderFollows] = useState<string>('');
  const [builderFormulaType, setBuilderFormulaType] = useState<'evenementielle' | 'globale'>('evenementielle');
  const [copiedBuilder, setCopiedBuilder] = useState(false);

  const availablePassages = getFourWEntriesForBook(selectedBookId);
  const currentPassage =
    FOUR_W_PASSAGES.find((p) => p.id === selectedPassageId) ||
    availablePassages[0] ||
    FOUR_W_PASSAGES[0];

  const handleSpeakFrench = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopyText = (text: string, isBuilder = false) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      if (isBuilder) {
        setCopiedBuilder(true);
        setTimeout(() => setCopiedBuilder(false), 2000);
      } else {
        setCopiedFormula(true);
        setTimeout(() => setCopiedFormula(false), 2000);
      }
    }
  };

  // Preload builder fields from a passage
  const handleLoadPassageIntoBuilder = (p: FourWEntry) => {
    setBuilderBook(p.bookId);
    setBuilderWho(p.who.quiParle);
    setBuilderWhat(p.what.actionFr);
    setBuilderWhere(p.where.lieuFr);
    setBuilderPreceded(p.when.evenementPrecedentFr);
    setBuilderFollows(p.when.evenementSuivantFr);
    setActiveSubTab('builder');
  };

  const currentBookInfo = BOOKS.find((b) => b.id === selectedBookId) || BOOKS[0];
  const builderBookInfo = BOOKS.find((b) => b.id === builderBook) || BOOKS[0];

  const generatedCustomText = generateCustomFourWFormula({
    workTitleFr: builderBookInfo.title,
    authorFr: builderBookInfo.author,
    publicationYear: builderBookInfo.year || '1954',
    whoFr: builderWho,
    whatFr: builderWhat,
    whereFr: builderWhere,
    whenPrecededFr: builderPreceded,
    whenFollowsFr: builderFollows,
    formulaType: builderFormulaType,
  });

  return (
    <div className="space-y-6 text-stone-800 dark:text-stone-100 font-sans" dir="rtl">
      {/* HERO BANNER: The 4W Concept */}
      <div className="p-5 sm:p-6 rounded-3xl bg-linear-to-r from-amber-900 via-amber-950 to-stone-900 text-white shadow-xl border border-amber-700/60 relative overflow-hidden">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold font-arabic">
              <Compass className="w-3.5 h-3.5" />
              <span>السؤال الأول في الامتحان الجهوي: تأطير النص (10/10)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-arabic tracking-tight text-white flex items-center gap-2.5">
              <span>قاعدة 4W (WWWW) لتأطير أي نص روائي أو مسرحي</span>
              <span className="font-mono text-xs px-2.5 py-1 rounded-xl bg-amber-500 text-amber-950 font-black">
                4W Formula
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-amber-200/90 font-serif leading-relaxed max-w-2xl">
              منهجية معتمدة ومضمونة للإجابة عن السؤال 1 (Situer le passage) من خلال الإجابة عن أربعة أسئلة مرجعية:
              <strong className="text-white mx-1">Who (Qui ?)</strong> · 
              <strong className="text-white mx-1">What (Quoi ?)</strong> · 
              <strong className="text-white mx-1">Where (Où ?)</strong> · 
              <strong className="text-white mx-1">When (Quand ?)</strong>
            </p>
          </div>

          {/* Quick Stats or Sub-Navigation */}
          <div className="flex items-center gap-2 bg-amber-950/70 p-1.5 rounded-2xl border border-amber-800 shrink-0 self-stretch md:self-auto justify-center">
            <button
              onClick={() => setActiveSubTab('matrix')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold font-arabic transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'matrix'
                  ? 'bg-amber-500 text-amber-950 shadow-md scale-102'
                  : 'text-amber-200 hover:bg-amber-900/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>المقاطع والتحليل 4W</span>
            </button>
            <button
              onClick={() => setActiveSubTab('builder')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold font-arabic transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'builder'
                  ? 'bg-amber-500 text-amber-950 shadow-md scale-102'
                  : 'text-amber-200 hover:bg-amber-900/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>صانع التأطير الذكي ✍️</span>
            </button>
            <button
              onClick={() => setActiveSubTab('guide')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold font-arabic transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'guide'
                  ? 'bg-amber-500 text-amber-950 shadow-md scale-102'
                  : 'text-amber-200 hover:bg-amber-900/60'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>الدليل النظري 💡</span>
            </button>
          </div>
        </div>

        {/* 4 Pillars Mini Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 mt-4 border-t border-amber-800/60">
          {FOUR_W_GUIDE.fourPillars.map((p) => (
            <div
              key={p.letter}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-right"
            >
              <span className="w-7 h-7 rounded-lg bg-amber-400 text-amber-950 font-mono font-black text-xs flex items-center justify-center shrink-0">
                {p.letter}
              </span>
              <div className="space-y-0.5 overflow-hidden">
                <div className="font-bold text-[11px] text-white truncate font-arabic">{p.nameAr}</div>
                <div className="text-[10px] text-amber-300 font-mono truncate">{p.nameFr}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: 4W MATRIX & PASSAGE ANALYSIS                                   */}
      {/* ========================================================================= */}
      {activeSubTab === 'matrix' && (
        <div className="space-y-6">
          {/* Passage Selector Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-amber-200 dark:border-stone-700 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span>اختر مقطعاً لتحليله وتوليد تأطيره بالصيغة المعتمدة (Formule d’or):</span>
              </span>
              <span className="text-[11px] font-mono text-stone-500">
                {availablePassages.length} مقاطع نموذجية جاهزة للمؤلف
              </span>
            </div>

            {/* Passage Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {availablePassages.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPassageId(p.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-arabic shrink-0 transition-all cursor-pointer flex items-center gap-1.5 border ${
                    selectedPassageId === p.id
                      ? 'bg-amber-900 text-white border-amber-900 shadow-xs'
                      : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-amber-200/70 dark:border-stone-700 hover:bg-amber-100/70'
                  }`}
                >
                  <span className="font-bold">{p.chapterTitleArabic}</span>
                  <span className="opacity-75 font-serif text-[11px]">({p.passageTitleArabic})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Current Passage Card Header */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 dark:bg-stone-800/90 border border-amber-200 dark:border-stone-700 space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-800 text-white font-mono font-bold text-xs">
                    {currentPassage.chapterTitle} · p. {currentPassage.pageNumber}
                  </span>
                  <h4 className="font-bold text-base text-amber-950 dark:text-white font-arabic">
                    {currentPassage.passageTitleArabic}
                  </h4>
                </div>
                <p className="text-xs font-serif text-stone-600 dark:text-stone-300">
                  {currentPassage.passageTitle}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {onJumpToPage && (
                  <button
                    onClick={() => {
                      onJumpToPage(currentPassage.pageNumber);
                      if (onClose) onClose();
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-stone-700 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-stone-600 text-xs font-bold hover:bg-amber-100 flex items-center gap-1 cursor-pointer"
                  >
                    <span>فتح بالرواية (ص {currentPassage.pageNumber})</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}

                <button
                  onClick={() => handleLoadPassageIntoBuilder(currentPassage)}
                  className="px-2.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3 h-3 text-emerald-300" />
                  <span>تعديل في الصانع الذكي</span>
                </button>
              </div>
            </div>

            {/* Excerpt Box */}
            <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-200/80 dark:border-stone-750 space-y-2">
              <div className="flex items-center justify-between text-stone-400 text-[11px]">
                <span className="font-serif italic">Extrait original du roman</span>
                <button
                  onClick={() => handleSpeakFrench(currentPassage.frenchExcerpt)}
                  className="hover:text-amber-800 dark:hover:text-amber-300 flex items-center gap-1 cursor-pointer text-stone-600 dark:text-stone-300"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>استمع للمقطع بالفرنسية</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm font-serif italic text-stone-800 dark:text-stone-200 text-left leading-relaxed">
                « {currentPassage.frenchExcerpt} »
              </p>
              <p className="text-xs font-arabic text-stone-600 dark:text-stone-300 text-right pt-1 border-t border-stone-100 dark:border-stone-800">
                {currentPassage.arabicExcerpt}
              </p>
            </div>
          </div>

          {/* THE 4 PILLARS (WWWW) DETAILED CARDS GRID */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* W1: WHO / QUI ? */}
            <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-900/60 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-blue-200/80 dark:border-blue-900/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-blue-700 text-white font-mono font-black text-xs flex items-center justify-center">
                    W1
                  </span>
                  <div>
                    <h5 className="font-bold text-sm text-blue-950 dark:text-blue-100 font-arabic">
                      مَن؟ الشخصيات (WHO / Qui ?)
                    </h5>
                    <p className="text-[10px] text-blue-700 dark:text-blue-300 font-mono">
                      Qui parle ? À qui ? Qui est présent ?
                    </p>
                  </div>
                </div>
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[11px] font-bold text-blue-900 dark:text-blue-300 block">المتكلم والمخاطب:</span>
                  <p className="font-serif text-stone-800 dark:text-stone-200 text-left font-semibold">
                    {currentPassage.who.quiParle} → {currentPassage.who.aQui}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-blue-900 dark:text-blue-300 block">الشخصيات الحاضرة:</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {currentPassage.who.personnagesPresents.map((char, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-white dark:bg-blue-900/50 border border-blue-300 dark:border-blue-700 text-blue-950 dark:text-blue-200 font-mono text-[11px]"
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-1 border-t border-blue-200/50 dark:border-blue-900/40">
                  <p className="text-stone-700 dark:text-stone-300 font-arabic text-[11.5px] leading-relaxed">
                    💡 <strong className="text-blue-950 dark:text-blue-200">الدور والصفة:</strong> {currentPassage.who.roleEtStatut}
                  </p>
                </div>
              </div>
            </div>

            {/* W2: WHAT / QUOI ? */}
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border-2 border-emerald-200 dark:border-emerald-900/60 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-200/80 dark:border-emerald-900/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-700 text-white font-mono font-black text-xs flex items-center justify-center">
                    W2
                  </span>
                  <div>
                    <h5 className="font-bold text-sm text-emerald-950 dark:text-emerald-100 font-arabic">
                      ماذا؟ الحدث والموضوع (WHAT / Quoi ?)
                    </h5>
                    <p className="text-[10px] text-emerald-700 dark:text-emerald-300 font-mono">
                      De quoi s’agit-il ? Que se passe-t-il ?
                    </p>
                  </div>
                </div>
                <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[11px] font-bold text-emerald-900 dark:text-emerald-300 block">جوهر الحدث (بالفرنسية):</span>
                  <p className="font-serif text-stone-800 dark:text-stone-200 text-left font-semibold">
                    {currentPassage.what.actionFr}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-emerald-900 dark:text-emerald-300 block">شرح الحدث (بالعربية):</span>
                  <p className="font-arabic text-stone-700 dark:text-stone-300 text-right leading-relaxed">
                    {currentPassage.what.actionAr}
                  </p>
                </div>

                <div className="pt-1 border-t border-emerald-200/50 dark:border-emerald-900/40">
                  <p className="text-stone-700 dark:text-stone-300 font-arabic text-[11.5px] leading-relaxed">
                    🎯 <strong className="text-emerald-950 dark:text-emerald-200">الموضوع والرهان:</strong> {currentPassage.what.themeCleFr}
                  </p>
                </div>
              </div>
            </div>

            {/* W3: WHERE / OÙ ? */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-900/60 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-amber-200/80 dark:border-amber-900/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-amber-700 text-white font-mono font-black text-xs flex items-center justify-center">
                    W3
                  </span>
                  <div>
                    <h5 className="font-bold text-sm text-amber-950 dark:text-amber-100 font-arabic">
                      أين؟ الإطار المكاني (WHERE / Où ?)
                    </h5>
                    <p className="text-[10px] text-amber-700 dark:text-amber-300 font-mono">
                      Où se déroule la scène ? Lieu précis
                    </p>
                  </div>
                </div>
                <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 block">المكان الدقيق:</span>
                  <p className="font-serif text-stone-800 dark:text-stone-200 text-left font-semibold">
                    {currentPassage.where.lieuFr}
                  </p>
                  <p className="font-arabic text-stone-600 dark:text-stone-300 text-right text-[11px]">
                    ({currentPassage.where.lieuAr})
                  </p>
                </div>

                <div className="pt-1 border-t border-amber-200/50 dark:border-amber-900/40">
                  <p className="text-stone-700 dark:text-stone-300 font-arabic text-[11.5px] leading-relaxed">
                    🏰 <strong className="text-amber-950 dark:text-amber-200">القيمة الرمزية للمكان:</strong> {currentPassage.where.valeurSymbolique}
                  </p>
                </div>
              </div>
            </div>

            {/* W4: WHEN / QUAND ? */}
            <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border-2 border-purple-200 dark:border-purple-900/60 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-purple-200/80 dark:border-purple-900/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-purple-700 text-white font-mono font-black text-xs flex items-center justify-center">
                    W4
                  </span>
                  <div>
                    <h5 className="font-bold text-sm text-purple-950 dark:text-purple-100 font-arabic">
                      متى؟ الزمان والترتيب (WHEN / Quand ?)
                    </h5>
                    <p className="text-[10px] text-purple-700 dark:text-purple-300 font-mono">
                      Ce qui s’est passé AVANT et APRÈS
                    </p>
                  </div>
                </div>
                <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-purple-100/60 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800">
                  <span className="text-[10.5px] font-bold text-purple-950 dark:text-purple-200 block">
                    ⏮️ ما حدث قبل المقطع مباشرة (Ce qui précède) :
                  </span>
                  <p className="font-serif text-stone-800 dark:text-stone-200 text-left text-[11px] pt-0.5">
                    {currentPassage.when.evenementPrecedentFr}
                  </p>
                  <p className="font-arabic text-stone-600 dark:text-stone-300 text-right text-[10.5px] pt-0.5">
                    {currentPassage.when.evenementPrecedentAr}
                  </p>
                </div>

                <div className="p-2 rounded-lg bg-white dark:bg-stone-900 border border-purple-100 dark:border-purple-900/50">
                  <span className="text-[10.5px] font-bold text-purple-900 dark:text-purple-300 block">
                    ⏭️ ما حدث بعد المقطع مباشرة (Ce qui suit) :
                  </span>
                  <p className="font-serif text-stone-800 dark:text-stone-200 text-left text-[11px] pt-0.5">
                    {currentPassage.when.evenementSuivantFr}
                  </p>
                  <p className="font-arabic text-stone-600 dark:text-stone-300 text-right text-[10.5px] pt-0.5">
                    {currentPassage.when.evenementSuivantAr}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* THE GOLDEN FORMULA SYNTHESIZER BOX (Formule d’or 20/20)                    */}
          {/* ========================================================================= */}
          <div className="p-5 sm:p-6 rounded-3xl bg-linear-to-br from-amber-900 via-stone-900 to-amber-950 text-white shadow-xl border-2 border-amber-400 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-800/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 font-bold flex items-center justify-center text-sm shadow-md">
                  ★
                </div>
                <div>
                  <h4 className="font-bold text-base text-amber-200 font-arabic">
                    الصيغة النموذجية الكاملة للامتحان الجهوي (Réponse Modèle 20/20)
                  </h4>
                  <p className="text-[11px] text-amber-300/80 font-serif">
                    صياغة تجمع العناصر الأربعة (WWWW) بأعلى درجات الدقة اللغوية والمنهجية
                  </p>
                </div>
              </div>

              {/* Formula Type Toggle */}
              <div className="flex items-center gap-1.5 p-1 bg-amber-950 rounded-xl border border-amber-800">
                <button
                  onClick={() => setActiveFormulaType('evenementielle')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-arabic transition-all cursor-pointer ${
                    activeFormulaType === 'evenementielle'
                      ? 'bg-amber-400 text-amber-950 shadow-xs'
                      : 'text-amber-200 hover:bg-amber-900'
                  }`}
                >
                  الصيغة 1: قبل وبعد (Événementielle) 🎯
                </button>
                <button
                  onClick={() => setActiveFormulaType('globale')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-arabic transition-all cursor-pointer ${
                    activeFormulaType === 'globale'
                      ? 'bg-amber-400 text-amber-950 shadow-xs'
                      : 'text-amber-200 hover:bg-amber-900'
                  }`}
                >
                  الصيغة 2: بنيوية عامة (Globale) 📜
                </button>
              </div>
            </div>

            {/* Formulated Answer */}
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/40 relative">
                <p className="text-sm sm:text-base font-serif text-amber-100 text-left leading-relaxed">
                  {activeFormulaType === 'evenementielle'
                    ? currentPassage.modelAnswers.methodeEvenementielleFr
                    : currentPassage.modelAnswers.methodeGlobaleFr}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-800/60">
                <p className="text-xs sm:text-sm font-arabic text-amber-200/90 text-right leading-relaxed">
                  {activeFormulaType === 'evenementielle'
                    ? currentPassage.modelAnswers.methodeEvenementielleAr
                    : currentPassage.modelAnswers.methodeGlobaleAr}
                </p>
              </div>
            </div>

            {/* Action Buttons: Listen & Copy */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amber-800/60">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const text =
                      activeFormulaType === 'evenementielle'
                        ? currentPassage.modelAnswers.methodeEvenementielleFr
                        : currentPassage.modelAnswers.methodeGlobaleFr;
                    handleSpeakFrench(text);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                    isSpeaking
                      ? 'bg-amber-400 text-amber-950 animate-pulse'
                      : 'bg-amber-900/80 hover:bg-amber-800 text-amber-200 border border-amber-700'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isSpeaking ? 'جاري القراءة بالفرنسية...' : 'استمع للنطق النموذجي (Audio)'}</span>
                </button>
              </div>

              <button
                onClick={() => {
                  const fr =
                    activeFormulaType === 'evenementielle'
                      ? currentPassage.modelAnswers.methodeEvenementielleFr
                      : currentPassage.modelAnswers.methodeGlobaleFr;
                  const ar =
                    activeFormulaType === 'evenementielle'
                      ? currentPassage.modelAnswers.methodeEvenementielleAr
                      : currentPassage.modelAnswers.methodeGlobaleAr;
                  handleCopyText(`${fr}\n\n${ar}`);
                }}
                className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
              >
                {copiedFormula ? <Check className="w-4 h-4 text-emerald-900" /> : <Copy className="w-4 h-4" />}
                <span>{copiedFormula ? 'تم النسخ إلى الحافظة! ✓' : 'نسخ الصياغة لدفتر المراجعة 📋'}</span>
              </button>
            </div>

            {/* Exam Tips Pill Bar */}
            {currentPassage.examTips.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-950/90 border border-amber-600/40 text-xs space-y-1 text-right">
                <span className="font-bold text-amber-300 font-arabic flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>تنبيهات المصحح في الامتحان الجهوي:</span>
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-amber-100/90 font-arabic text-[11.5px]">
                  {currentPassage.examTips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: INTERACTIVE 4W ANSWER BUILDER (صانع التأطير الذكي)               */}
      {/* ========================================================================= */}
      {activeSubTab === 'builder' && (
        <div className="space-y-6">
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-850 border border-amber-200 dark:border-stone-700 shadow-xs space-y-4">
            <div className="border-b border-amber-100 dark:border-stone-750 pb-3 space-y-1 text-right">
              <h4 className="font-bold text-base text-amber-950 dark:text-white font-arabic flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>صانع التأطير التفاعلي بقاعدة 4W (Générateur Personnalisé)</span>
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-400 font-serif">
                املأ أو عدّل بطاقات الـ 4W ليقوم النظام بتركيب جملة تأطير متكاملة مطابقة لمعايير الامتحان الجهوي تلقائياً.
              </p>
            </div>

            {/* Book Selector */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-amber-50/60 dark:bg-stone-800 rounded-xl border border-amber-200/80 dark:border-stone-700">
              <span className="text-xs font-bold text-amber-950 dark:text-amber-200 font-arabic">
                المؤلف المستهدف:
              </span>
              <div className="flex items-center gap-2">
                {BOOKS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBuilderBook(b.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-arabic transition-all cursor-pointer ${
                      builderBook === b.id
                        ? 'bg-amber-900 text-white shadow-xs'
                        : 'bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-amber-100'
                    }`}
                  >
                    {b.title}
                  </button>
                ))}
              </div>
            </div>

            {/* 4 Interactive Input Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Field 1: Who */}
              <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60 space-y-1.5">
                <label className="text-xs font-bold text-blue-950 dark:text-blue-200 font-arabic flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-blue-700 text-white font-mono text-[10px] flex items-center justify-center">
                    W1
                  </span>
                  <span>Who (Qui parle ? À qui ?) — الشخصيات:</span>
                </label>
                <input
                  type="text"
                  value={builderWho}
                  onChange={(e) => setBuilderWho(e.target.value)}
                  placeholder="Ex: Le narrateur Sidi Mohamed et sa mère Lalla Zoubida"
                  className="w-full text-xs font-serif p-2.5 rounded-lg border border-blue-300 dark:border-blue-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white"
                  dir="ltr"
                />
              </div>

              {/* Field 2: What */}
              <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 space-y-1.5">
                <label className="text-xs font-bold text-emerald-950 dark:text-emerald-200 font-arabic flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-emerald-700 text-white font-mono text-[10px] flex items-center justify-center">
                    W2
                  </span>
                  <span>What (De quoi s'agit-il ?) — الحدث الرئيسي:</span>
                </label>
                <input
                  type="text"
                  value={builderWhat}
                  onChange={(e) => setBuilderWhat(e.target.value)}
                  placeholder="Ex: raconte son supplice au bain maure et son angoisse"
                  className="w-full text-xs font-serif p-2.5 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white"
                  dir="ltr"
                />
              </div>

              {/* Field 3: Where */}
              <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 space-y-1.5">
                <label className="text-xs font-bold text-amber-950 dark:text-amber-200 font-arabic flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-amber-700 text-white font-mono text-[10px] flex items-center justify-center">
                    W3
                  </span>
                  <span>Where (Où se déroule la scène ?) — المكان الدقيق:</span>
                </label>
                <input
                  type="text"
                  value={builderWhere}
                  onChange={(e) => setBuilderWhere(e.target.value)}
                  placeholder="Ex: au bain maure traditionnel de la médina de Fès"
                  className="w-full text-xs font-serif p-2.5 rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white"
                  dir="ltr"
                />
              </div>

              {/* Field 4: When (Preceded) */}
              <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/60 space-y-1.5">
                <label className="text-xs font-bold text-purple-950 dark:text-purple-200 font-arabic flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-purple-700 text-white font-mono text-[10px] flex items-center justify-center">
                    W4
                  </span>
                  <span>When (Ce qui s'est passé juste AVANT) — الحدث السابق:</span>
                </label>
                <input
                  type="text"
                  value={builderPreceded}
                  onChange={(e) => setBuilderPreceded(e.target.value)}
                  placeholder="Ex: la présentation de Dar Chouafa et l'évocation de la solitude"
                  className="w-full text-xs font-serif p-2.5 rounded-lg border border-purple-300 dark:border-purple-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white"
                  dir="ltr"
                />
              </div>

              {/* Field 5: When (Follows) */}
              <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/60 space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-purple-950 dark:text-purple-200 font-arabic flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-purple-700 text-white font-mono text-[10px] flex items-center justify-center">
                    W4
                  </span>
                  <span>When (Ce qui va se passer juste APRÈS) — الحدث اللاحق:</span>
                </label>
                <input
                  type="text"
                  value={builderFollows}
                  onChange={(e) => setBuilderFollows(e.target.value)}
                  placeholder="Ex: la violente dispute de lessive entre Lalla Zoubida et Rahma"
                  className="w-full text-xs font-serif p-2.5 rounded-lg border border-purple-300 dark:border-purple-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Generated Preview Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-950 text-white border-2 border-amber-400 space-y-3">
              <div className="flex items-center justify-between border-b border-amber-800 pb-2">
                <span className="text-xs font-bold text-amber-300 font-arabic">
                  معاينة النتيجة التلقائية (Génération en direct) :
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setBuilderFormulaType('evenementielle')}
                    className={`px-2 py-1 rounded text-[11px] font-bold ${
                      builderFormulaType === 'evenementielle'
                        ? 'bg-amber-400 text-amber-950'
                        : 'text-amber-200 hover:bg-amber-900'
                    }`}
                  >
                    صيغة الأحداث
                  </button>
                  <button
                    onClick={() => setBuilderFormulaType('globale')}
                    className={`px-2 py-1 rounded text-[11px] font-bold ${
                      builderFormulaType === 'globale'
                        ? 'bg-amber-400 text-amber-950'
                        : 'text-amber-200 hover:bg-amber-900'
                    }`}
                  >
                    صيغة شاملة
                  </button>
                </div>
              </div>

              <p className="text-sm font-serif text-amber-100 text-left leading-relaxed bg-black/40 p-3.5 rounded-xl border border-amber-500/30">
                « {generatedCustomText} »
              </p>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => handleSpeakFrench(generatedCustomText)}
                  className="px-3 py-1.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>استماع</span>
                </button>
                <button
                  onClick={() => handleCopyText(generatedCustomText, true)}
                  className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  {copiedBuilder ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedBuilder ? 'تم النسخ بنجاح! ✓' : 'نسخ الصياغة'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: THEORETICAL GUIDE & EXAM GOLDEN RULES                          */}
      {/* ========================================================================= */}
      {activeSubTab === 'guide' && (
        <div className="space-y-6">
          {/* Detailed Pillars Description */}
          <div className="grid sm:grid-cols-2 gap-4">
            {FOUR_W_GUIDE.fourPillars.map((p) => (
              <div
                key={p.letter}
                className={`p-4 sm:p-5 rounded-2xl ${p.bgLight} border ${p.border} space-y-2.5 shadow-2xs`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-8 h-8 rounded-xl bg-linear-to-r ${p.color} text-white font-mono font-black text-sm flex items-center justify-center shadow-xs`}>
                    {p.letter}
                  </span>
                  <div>
                    <h5 className="font-bold text-sm text-stone-900 dark:text-stone-100 font-arabic">
                      {p.nameAr}
                    </h5>
                    <p className="text-[11px] font-mono text-stone-500">{p.nameFr}</p>
                  </div>
                </div>

                <p className="text-xs font-serif italic text-stone-700 dark:text-stone-300 text-left bg-white/70 dark:bg-stone-900/60 p-2 rounded-lg border border-stone-200/60 dark:border-stone-800">
                  {p.descriptionFr}
                </p>

                <p className="text-xs font-arabic text-stone-700 dark:text-stone-300 leading-relaxed text-right">
                  {p.descriptionAr}
                </p>
              </div>
            ))}
          </div>

          {/* Standard Templates Breakdown */}
          <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-amber-200 dark:border-stone-700 space-y-4 shadow-xs">
            <h4 className="font-bold text-base text-amber-950 dark:text-amber-200 font-arabic flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>هياكل الإجابة القياسية المقبولة لدى لجان التصحيح:</span>
            </h4>

            <div className="space-y-3">
              {FOUR_W_GUIDE.standardFormulas.map((f) => (
                <div
                  key={f.id}
                  className="p-4 rounded-xl bg-amber-50/60 dark:bg-stone-800 border border-amber-200 dark:border-stone-700 space-y-2 text-right"
                >
                  <h5 className="font-bold text-xs text-amber-950 dark:text-amber-200 font-arabic">
                    {f.titleAr}
                  </h5>
                  <p className="text-xs font-serif text-stone-800 dark:text-stone-200 text-left bg-white dark:bg-stone-900 p-2.5 rounded-lg border border-stone-200 dark:border-stone-750 leading-relaxed">
                    {f.structureFr}
                  </p>
                  <p className="text-xs font-arabic text-stone-600 dark:text-stone-400 leading-relaxed">
                    {f.structureAr}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Golden Rules */}
          <div className="p-5 rounded-2xl bg-amber-900 text-amber-100 border border-amber-700 space-y-3">
            <h4 className="font-bold text-sm text-white font-arabic flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>القواعد الذهبية لتفادي ضياع النقاط في السؤال الأول:</span>
            </h4>
            <ul className="space-y-2 text-xs font-arabic">
              {FOUR_W_GUIDE.goldenRules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-amber-950 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
