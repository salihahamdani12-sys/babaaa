import React, { useState } from 'react';
import { QUIZ_QUESTIONS, QuizQuestion } from '../data/quizData';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, Award, ArrowRight, BookOpen } from 'lucide-react';

interface QuizSimulatorProps {
  showArabic: boolean;
}

export const QuizSimulator: React.FC<QuizSimulatorProps> = ({ showArabic }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const filteredQuestions = QUIZ_QUESTIONS.filter((q) => {
    if (selectedFilter === 'all') return true;
    return q.workId === selectedFilter;
  });

  const currentQ: QuizQuestion | undefined = filteredQuestions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ?.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  // Scaled score to 20 (standard Moroccan exam grade out of 20)
  const scoreOutOf20 = filteredQuestions.length > 0 ? ((score / filteredQuestions.length) * 20).toFixed(1) : '0';

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-700 font-semibold mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>Simulateur d’épreuve de langue et compréhension</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 font-literary">
            QCM Examen Régional 1ère Bac <span className="text-slate-400 font-arabic text-xl">(اختبار جهوي تفاعلي)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            تدرب على أسئلة الامتحان الجهوي الحقيقية مع التصحيح الفوري والشرح المنهجي
          </p>
        </div>

        {/* Work Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl overflow-x-auto">
          {[
            { id: 'all', label: 'Toutes les œuvres' },
            { id: 'boite-a-merveilles', label: 'La Boîte' },
            { id: 'antigone', label: 'Antigone' },
            { id: 'dernier-jour', label: 'Le Dernier Jour' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => handleFilterChange(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedFilter === f.id
                  ? 'bg-white text-indigo-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {!quizFinished && currentQ ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          {/* Progress & Badge */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md">
                {currentQ.workTitle}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 font-medium">{currentQ.category}</span>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Question <span className="font-bold text-slate-800">{currentIndex + 1}</span> / {filteredQuestions.length}
              {currentQ.examRegion && (
                <span className="hidden sm:inline text-indigo-600 ml-2 font-normal">
                  ({currentQ.examRegion})
                </span>
              )}
            </div>
          </div>

          {/* Context Quote if applicable */}
          {currentQ.contextText && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 font-literary italic text-base">
              {currentQ.contextText}
            </div>
          )}

          {/* Question Text */}
          <div className="space-y-1">
            <h3 className="text-lg md:text-xl font-bold text-slate-900">
              {currentQ.question}
            </h3>
            {showArabic && (
              <p className="text-sm font-arabic text-emerald-800" dir="rtl">
                {currentQ.questionAr}
              </p>
            )}
          </div>

          {/* Options Grid */}
          <div className="space-y-2.5 pt-2">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let btnStyle = 'border-slate-200 bg-white hover:border-indigo-300 text-slate-800';

              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
                } else if (isSelected) {
                  btnStyle = 'border-rose-500 bg-rose-50 text-rose-900 font-semibold';
                } else {
                  btnStyle = 'border-slate-200 bg-slate-50 opacity-60 text-slate-600';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-xs font-semibold">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </span>

                  {isAnswered && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box on Answer */}
          {isAnswered && (
            <div className={`p-5 rounded-xl border space-y-2 ${
              selectedOption === currentQ.correctIndex ? 'bg-emerald-50/70 border-emerald-200' : 'bg-rose-50/70 border-rose-200'
            }`}>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                {selectedOption === currentQ.correctIndex ? (
                  <span className="text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Réponse correcte !
                  </span>
                ) : (
                  <span className="text-rose-800 flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> Réponse incorrecte
                  </span>
                )}
              </div>
              <p className="text-xs md:text-sm text-slate-800 leading-relaxed">
                {currentQ.explanationFr}
              </p>
              {showArabic && (
                <p className="text-xs md:text-sm font-arabic text-slate-700 leading-relaxed pt-1" dir="rtl">
                  {currentQ.explanationAr}
                </p>
              )}
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-xs"
              >
                <span>{currentIndex < filteredQuestions.length - 1 ? 'Question suivante' : 'Voir mon résultat'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Result Screen */
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs text-center space-y-6">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-slate-900 font-literary">
              Résultat de l’entraînement Régional
            </h3>
            <p className="text-xs text-slate-500 font-arabic mt-1">
              نتيجة الاختبار التفاعلي مع تنقيط مطابق للامتحان الجهوي الرسمي
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-sm mx-auto space-y-2">
            <div className="text-4xl font-extrabold text-indigo-600">
              {scoreOutOf20} <span className="text-lg text-slate-400 font-normal">/ 20</span>
            </div>
            <div className="text-xs text-slate-600 font-medium">
              {score} réponses correctes sur {filteredQuestions.length} questions
            </div>
            <div className="text-xs text-slate-500 font-arabic pt-2">
              {Number(scoreOutOf20) >= 16 ? (
                <span className="text-emerald-600 font-bold">ممتاز جداً! جاهزية عالية للامتحان الجهوي.</span>
              ) : Number(scoreOutOf20) >= 12 ? (
                <span className="text-indigo-600 font-bold">مستوى جيد، واصل مراجعة الفصول والمحسنات البلاغية.</span>
              ) : (
                <span className="text-amber-700 font-bold">تحتاج لمزيد من المراجعة وتكرار الاختبار لضبط المعطيات.</span>
              )}
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Recommencer le test</span>
          </button>
        </div>
      )}
    </div>
  );
};
