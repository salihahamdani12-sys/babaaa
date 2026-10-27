import React, { useState } from 'react';
import { Novel } from '../data/novelsData';
import { Volume2, VolumeX, BookOpen, Sparkles, ChevronLeft, ChevronRight, HelpCircle, Check, Copy } from 'lucide-react';
import { playCustomAIAudio, stopAIAudio } from '../data/aiAudioService';
import { NaturalTTSPlayer } from '../data/ttsService';

interface ChapterReaderProps {
  novel: Novel;
  showArabic: boolean;
}

export const ChapterReader: React.FC<ChapterReaderProps> = ({ novel, showArabic }) => {
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<'fr' | 'ar' | null>(null);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [copiedQuote, setCopiedQuote] = useState(false);

  const currentChapter = novel.chapters[selectedChapterIndex] || novel.chapters[0];

  const handleSpeech = async (text: string, lang: 'fr' | 'ar' = 'fr') => {
    if (isPlayingAudio === lang) {
      stopAIAudio();
      NaturalTTSPlayer.stop();
      setIsPlayingAudio(null);
      return;
    }

    stopAIAudio();
    NaturalTTSPlayer.stop();
    setIsPlayingAudio(lang);

    try {
      await playCustomAIAudio(
        text,
        novel.id,
        currentChapter.number,
        lang,
        lang === 'fr' ? `الفصل ${currentChapter.title}` : `ترجمة ${currentChapter.titleAr}`
      );
    } catch {
      NaturalTTSPlayer.speak(text, lang, {
        onEnd: () => setIsPlayingAudio(null),
        onError: () => setIsPlayingAudio(null),
      });
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2000);
  };

  const fontSizeClasses = {
    normal: 'text-base leading-relaxed',
    large: 'text-lg leading-loose',
    xlarge: 'text-xl leading-loose'
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Novel Header Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-700 font-semibold mb-1">
              <span>{novel.genre}</span>
              <span>·</span>
              <span>{novel.yearPublished}</span>
              <span>·</span>
              <span>{novel.author}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 font-literary">
              {novel.title} <span className="text-slate-400 font-arabic font-normal text-xl">({novel.titleAr})</span>
            </h2>
            {showArabic && (
              <p className="text-xs text-slate-500 font-arabic mt-1">
                {novel.historicalContextAr}
              </p>
            )}
          </div>

          {/* Chapter Selector Dropdown / Carousel */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-600">Sélectionner :</label>
            <select
              value={selectedChapterIndex}
              onChange={(e) => setSelectedChapterIndex(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm font-medium px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              {novel.chapters.map((ch, idx) => (
                <option key={ch.number} value={idx}>
                  {ch.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Chapter Navigation Controls */}
      <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-xl p-3">
        <button
          onClick={() => setSelectedChapterIndex(Math.max(0, selectedChapterIndex - 1))}
          disabled={selectedChapterIndex === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-colors border border-slate-200/50"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Précédent</span>
        </button>

        <div className="text-xs font-semibold text-slate-700 text-center">
          <span>{currentChapter.title}</span>
          {showArabic && (
            <div className="text-[11px] font-arabic text-indigo-700 font-normal">
              {currentChapter.titleAr}
            </div>
          )}
        </div>

        <button
          onClick={() => setSelectedChapterIndex(Math.min(novel.chapters.length - 1, selectedChapterIndex + 1))}
          disabled={selectedChapterIndex === novel.chapters.length - 1}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-colors border border-slate-200/50"
        >
          <span>Suivant</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Dual Reader Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* French Column (Texte original & Extrait majeur posé au Régional) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Texte Original Français
                </h3>
              </div>

              {/* Text Size Controls and Audio Reader */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleSpeech(currentChapter.excerptFr, 'fr')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isPlayingAudio === 'fr'
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  }`}
                  title="Écouter la prononciation avec ElevenLabs / Voix HD"
                >
                  {isPlayingAudio === 'fr' ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Arrêter</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Écouter (Vocal)</span>
                    </>
                  )}
                </button>

                <div className="flex items-center bg-slate-100 rounded-lg p-0.5 ml-2">
                  <button
                    onClick={() => setFontSize('normal')}
                    className={`px-2 py-1 text-xs rounded-md ${fontSize === 'normal' ? 'bg-white shadow-xs font-bold' : 'text-slate-500'}`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize('large')}
                    className={`px-2 py-1 text-sm rounded-md ${fontSize === 'large' ? 'bg-white shadow-xs font-bold' : 'text-slate-500'}`}
                  >
                    A+
                  </button>
                  <button
                    onClick={() => setFontSize('xlarge')}
                    className={`px-2 py-1 text-base rounded-md ${fontSize === 'xlarge' ? 'bg-white shadow-xs font-bold' : 'text-slate-500'}`}
                  >
                    A++
                  </button>
                </div>
              </div>
            </div>

            {/* French Excerpt */}
            <div className={`text-slate-800 font-literary ${fontSizeClasses[fontSize]} bg-slate-50/70 p-5 rounded-xl border border-slate-100 italic selection:bg-amber-100`}>
              « {currentChapter.excerptFr} »
            </div>

            {/* Summary In French */}
            <div className="mt-5 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Résumé du chapitre & Analyse :
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                {currentChapter.summaryFr}
              </p>
            </div>

            {/* Key Events Bullet Points */}
            <div className="mt-4 space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Événements clés :
              </h4>
              <ul className="space-y-1 text-xs text-slate-600">
                {currentChapter.keyEvents.map((evt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">•</span>
                    <span>{evt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <Check className="w-3.5 h-3.5" /> Passage conforme aux examens régionaux
            </span>
            <button
              onClick={() => handleCopy(currentChapter.excerptFr)}
              className="flex items-center gap-1 hover:text-indigo-600 text-xs transition-colors"
            >
              <Copy className="w-3 h-3" />
              <span>{copiedQuote ? 'Copié !' : 'Copier l’extrait'}</span>
            </button>
          </div>
        </div>

        {/* Arabic Column (الترجمة السياقية والشرح بالدارجة والفصحى) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-5" dir="rtl">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 font-arabic">
                  الترجمة السياقية والشرح بالعربية
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSpeech(currentChapter.excerptAr, 'ar')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-arabic transition-all cursor-pointer ${
                    isPlayingAudio === 'ar'
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                  title="الاستماع للشرح والترجمة بالصوت العربي"
                >
                  {isPlayingAudio === 'ar' ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>إيقاف الصوت</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>استماع للترجمة (صوت)</span>
                    </>
                  )}
                </button>
                <span className="text-xs text-slate-400 font-arabic hidden sm:inline">
                  مبسطة للأولى باك
                </span>
              </div>
            </div>

            {/* Arabic Excerpt */}
            <div className={`text-slate-800 font-arabic ${fontSizeClasses[fontSize]} bg-emerald-50/40 p-5 rounded-xl border border-emerald-100 leading-loose selection:bg-emerald-100`}>
              « {currentChapter.excerptAr} »
            </div>

            {/* Summary In Arabic */}
            <div className="mt-5 space-y-2">
              <h4 className="text-xs font-bold font-arabic text-emerald-800">
                الملخص المركز والأحداث المفصلة :
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed font-arabic">
                {currentChapter.summaryAr}
              </p>
            </div>

            {/* Key Events in Arabic */}
            <div className="mt-4 space-y-1.5">
              <h4 className="text-xs font-bold font-arabic text-emerald-800">
                أهم محطات هذا الفصل :
              </h4>
              <ul className="space-y-1 text-xs text-slate-600 font-arabic">
                {currentChapter.keyEventsAr.map((evt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    <span>{evt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-arabic" dir="ltr">
            <span className="text-slate-400">Maroc · Éducation Nationale</span>
            <span className="text-indigo-600 font-medium font-arabic">شرح دقيق وفق الإطار المرجعي</span>
          </div>
        </div>
      </div>

      {/* Cultural Notes & Figures de Style Specific to Chapter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cultural / Vocabulary Notes */}
        {currentChapter.culturalNotes && currentChapter.culturalNotes.length > 0 && (
          <div className="bg-amber-50/50 border border-amber-200/70 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="w-4 h-4 text-amber-700" />
              <h4 className="text-sm font-bold text-amber-900">
                Vocabulaire & Culture de l'ancienne Médina (معجم تراثي)
              </h4>
            </div>
            <div className="space-y-3">
              {currentChapter.culturalNotes.map((note, idx) => (
                <div key={idx} className="bg-white/80 border border-amber-200/50 rounded-xl p-3 text-xs">
                  <div className="flex items-center justify-between font-semibold text-amber-950 mb-1">
                    <span>{note.term}</span>
                    <span className="font-arabic text-amber-800">{note.termAr}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{note.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Figures de Style In This Chapter */}
        {currentChapter.figuresDeStyle && currentChapter.figuresDeStyle.length > 0 && (
          <div className="bg-indigo-50/50 border border-indigo-200/70 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-indigo-700" />
              <h4 className="text-sm font-bold text-indigo-900">
                Figures de style repérées dans ce chapitre (المحسنات البلاغية)
              </h4>
            </div>
            <div className="space-y-3">
              {currentChapter.figuresDeStyle.map((fig, idx) => (
                <div key={idx} className="bg-white/80 border border-indigo-200/50 rounded-xl p-3 text-xs">
                  <div className="flex items-center justify-between font-semibold text-indigo-950 mb-1">
                    <span className="italic text-slate-800">« {fig.phrase} »</span>
                    <span className="bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-md text-[11px]">
                      {fig.figure}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{fig.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
