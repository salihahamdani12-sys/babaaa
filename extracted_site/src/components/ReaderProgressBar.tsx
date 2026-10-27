import React, { useState, useRef, useMemo } from 'react';
import { 
  TrendingUp, Trophy, Flag, ChevronLeft, ChevronRight, 
  Compass, Clock, CheckCircle2, BookOpen, Sparkles, MapPin
} from 'lucide-react';
import { BookInfo, ChapterMeta } from '../types';
import { getChapterForBookPage, getBookChapters } from '../data/bookService';

export interface ReaderProgressBarProps {
  bookInfo: BookInfo;
  lastReadPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onOpenChapters?: () => void;
}

export const ReaderProgressBar: React.FC<ReaderProgressBarProps> = ({
  bookInfo,
  lastReadPage,
  totalPages,
  onPageChange,
  onOpenChapters,
}) => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [hoveredPercent, setHoveredPercent] = useState<number | null>(null);
  const [hoveredPage, setHoveredPage] = useState<number | null>(null);
  const [hoveredChapter, setHoveredChapter] = useState<ChapterMeta | null>(null);
  const [hoveredBoundaryChapter, setHoveredBoundaryChapter] = useState<ChapterMeta | null>(null);
  const [tooltipX, setTooltipX] = useState<number>(0);

  // Book identification for theming
  const isAntigone = bookInfo.id === 'antigone';
  const isCondamne = bookInfo.id === 'le_dernier_jour_dun_condamne';

  // Completion calculation based on the last read page
  const clampedPage = Math.max(1, Math.min(lastReadPage, totalPages));
  const completionPercent = totalPages > 0 
    ? Math.min(100, Math.max(1, Math.round((clampedPage / totalPages) * 100))) 
    : 0;
  
  const remainingPages = Math.max(0, totalPages - clampedPage);
  const isCompleted = clampedPage >= totalPages;

  // Chapter milestones
  const chapters = useMemo(() => getBookChapters(bookInfo.id), [bookInfo.id]);
  const currentChapter = useMemo(() => getChapterForBookPage(bookInfo.id, clampedPage), [bookInfo.id, clampedPage]);
  const finalChapter = chapters.length > 0 ? chapters[chapters.length - 1] : null;
  const isAtFinalChapter = finalChapter ? clampedPage >= finalChapter.startPage : false;

  // Active chapter span percentages
  const activeChapterStartPct = useMemo(() => {
    if (!currentChapter || totalPages <= 0) return 0;
    return Math.max(0, ((currentChapter.startPage - 1) / totalPages) * 100);
  }, [currentChapter, totalPages]);

  const activeChapterWidthPct = useMemo(() => {
    if (!currentChapter || totalPages <= 0) return 0;
    const span = Math.max(1, currentChapter.endPage - currentChapter.startPage + 1);
    return Math.min(100, (span / totalPages) * 100);
  }, [currentChapter, totalPages]);

  // Current chapter progress metrics
  const chapterCurrentPageOffset = Math.max(1, clampedPage - currentChapter.startPage + 1);
  const chapterTotalPages = Math.max(1, currentChapter.endPage - currentChapter.startPage + 1);
  const chapterProgressPercent = Math.min(100, Math.round((chapterCurrentPageOffset / chapterTotalPages) * 100));

  // Reading time estimate (~2 minutes per page for deep study with vocabulary)
  const estimatedRemainingMinutes = Math.ceil(remainingPages * 2);

  // Book-specific color schemes
  const barGradient = isAntigone
    ? 'bg-linear-to-r from-rose-700 via-rose-500 to-amber-400'
    : isCondamne
    ? 'bg-linear-to-r from-slate-700 via-sky-500 to-indigo-400'
    : 'bg-linear-to-r from-amber-700 via-amber-500 to-emerald-400';

  const activeZoneBorder = isAntigone
    ? 'border-rose-400/80 bg-rose-500/15'
    : isCondamne
    ? 'border-sky-400/80 bg-sky-500/15'
    : 'border-amber-400/80 bg-amber-500/15';

  const glowShadow = isAntigone
    ? 'shadow-[0_0_14px_rgba(244,63,94,0.5)]'
    : isCondamne
    ? 'shadow-[0_0_14px_rgba(56,189,248,0.5)]'
    : 'shadow-[0_0_14px_rgba(245,158,11,0.5)]';

  const badgeBg = isAntigone
    ? 'bg-rose-100 text-rose-950 border-rose-300 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-800'
    : isCondamne
    ? 'bg-sky-100 text-slate-950 border-sky-300 dark:bg-slate-900/80 dark:text-sky-200 dark:border-slate-700'
    : 'bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-800';

  const containerBg = isAntigone
    ? 'bg-[#faf5f6]/95 dark:bg-[#160910]/95 border-b border-rose-200/80 dark:border-rose-950/70'
    : isCondamne
    ? 'bg-[#f1f5f9]/95 dark:bg-[#0d1420]/95 border-b border-slate-200/90 dark:border-slate-800/80'
    : 'bg-[#faf6ee]/95 dark:bg-[#16120e]/95 border-b border-amber-200/80 dark:border-stone-800/80';

  // Scrubbing & click handling
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || totalPages <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    const targetPage = Math.max(1, Math.min(Math.round((x / rect.width) * totalPages), totalPages));
    
    setTooltipX(x);
    setHoveredPercent(percent);
    setHoveredPage(targetPage);
    const ch = getChapterForBookPage(bookInfo.id, targetPage);
    setHoveredChapter(ch);
  };

  const handleMouseLeave = () => {
    setHoveredPercent(null);
    setHoveredPage(null);
    setHoveredChapter(null);
    setHoveredBoundaryChapter(null);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || totalPages <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const targetPage = Math.max(1, Math.min(Math.round((x / rect.width) * totalPages), totalPages));
    onPageChange(targetPage);
  };

  return (
    <section 
      id="reader-visual-progress-bar"
      aria-label="مؤشر نسبة إنجاز قراءة الرواية وحدود الفصول"
      className={`w-full ${containerBg} backdrop-blur-md shadow-xs transition-colors duration-300 font-arabic text-stone-800 dark:text-stone-100 z-30`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-2.5">
        {/* Top Metric Row: Book & Chapter Context, Percentage, Pages Count, and Quick Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-2">
          {/* Left: Book context and current chapter */}
          <div className="flex items-center gap-2 min-w-0">
            <div className={`p-1.5 rounded-lg ${badgeBg} border shadow-2xs shrink-0`}>
              {isCompleted ? (
                <Trophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : isAtFinalChapter ? (
                <Flag className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-bounce" />
              ) : (
                <TrendingUp className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              )}
            </div>

            <div className="truncate text-right">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                  {bookInfo.titleArabic}
                </span>
                <span className="text-[11px] text-stone-500 dark:text-stone-400 font-serif hidden sm:inline">
                  ({bookInfo.titleFrench})
                </span>
                <span className="text-stone-400 dark:text-stone-600 hidden sm:inline">·</span>
                <span className="text-xs text-stone-700 dark:text-stone-300 font-bold truncate">
                  {isAntigone ? `المشهد ${currentChapter.chapter}:` : `الفصل ${currentChapter.chapter}:`} {currentChapter.title}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-900 dark:text-amber-300 border border-amber-500/30 font-mono font-bold hidden sm:inline-block">
                  ص {currentChapter.startPage} - {currentChapter.endPage} ({chapterCurrentPageOffset}/{chapterTotalPages} ص)
                </span>
              </div>
            </div>
          </div>

          {/* Right: Completion Percentage Badge & Page Details */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 mr-auto sm:mr-0">
            {/* Last read page & Remaining count */}
            <div className="text-left font-sans text-xs hidden md:flex items-center gap-2">
              <span className="text-stone-600 dark:text-stone-400">
                الصفحة: <strong className="text-stone-900 dark:text-stone-100 font-mono font-bold text-sm">{clampedPage}</strong> / {totalPages}
              </span>
              <span className="text-stone-300 dark:text-stone-700">|</span>
              <span className="text-stone-500 dark:text-stone-400 text-[11px] flex items-center gap-1 font-arabic">
                <Clock className="w-3 h-3 text-stone-400" />
                {isCompleted ? 'تمت القراءة' : `متبقي ${remainingPages} ص (~${estimatedRemainingMinutes} د)`}
              </span>
            </div>

            {/* Percentage Completed Pill Badge */}
            <div 
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-xs font-mono font-extrabold text-xs sm:text-sm ${
                isCompleted 
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800'
                  : badgeBg
              }`}
              title={`أكملت ${completionPercent}% من صفحات الرواية`}
            >
              {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
              <span>{completionPercent}%</span>
              <span className="font-arabic font-normal text-[11px] opacity-85 hidden xs:inline">
                {isCompleted ? 'مكتمل' : 'مُنجز'}
              </span>
            </div>

            {/* Quick Page Steppers */}
            <div className="flex items-center bg-black/5 dark:bg-white/5 rounded-lg border border-stone-300/60 dark:border-stone-700 p-0.5">
              <button
                type="button"
                onClick={() => onPageChange(Math.max(1, clampedPage - 1))}
                disabled={clampedPage <= 1}
                className="p-1 rounded text-stone-700 dark:text-stone-300 hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title="الصفحة السابقة"
                aria-label="الصفحة السابقة"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <span className="px-1.5 text-xs font-mono font-bold text-stone-800 dark:text-stone-200 select-none">
                {clampedPage}
              </span>
              <button
                type="button"
                onClick={() => onPageChange(Math.min(totalPages, clampedPage + 1))}
                disabled={clampedPage >= totalPages}
                className="p-1 rounded text-stone-700 dark:text-stone-300 hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title="الصفحة التالية"
                aria-label="الصفحة التالية"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Chapter Directory Launcher */}
            {onOpenChapters && (
              <button
                type="button"
                onClick={onOpenChapters}
                className="p-1.5 rounded-lg border border-stone-300/70 dark:border-stone-700 hover:bg-black/5 dark:hover:bg-white/10 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                title="فتح فهرس الفصول والمشاهد مع حدود الصفحات"
                aria-label="فتح فهرس الفصول والمشاهد"
              >
                <Compass className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="hidden sm:inline">الفهرس</span>
              </button>
            )}
          </div>
        </div>

        {/* ===================================================================== */}
        {/* INTERACTIVE PROGRESS BAR TRACK WITH VISUAL CHAPTER BOUNDARIES         */}
        {/* ===================================================================== */}
        <div className="relative pt-1 pb-1">
          {/* Active Chapter Boundary Range Indicator (Subtle background highlight of current chapter span) */}
          <div
            className={`absolute top-0 bottom-0 pointer-events-none rounded-full border-2 ${activeZoneBorder} transition-all duration-300 z-10`}
            style={{
              left: `${activeChapterStartPct}%`,
              width: `${activeChapterWidthPct}%`,
            }}
            title={`نطاق ${isAntigone ? 'المشهد' : 'الفصل'} الحالي: صفحة ${currentChapter.startPage} إلى ${currentChapter.endPage}`}
          />

          <div
            ref={progressBarRef}
            id="reader-progress-track"
            role="progressbar"
            aria-valuenow={completionPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`نسبة إنجاز قراءة الكتاب: ${completionPercent}%`}
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full h-4 sm:h-4.5 rounded-full bg-stone-200/90 dark:bg-stone-800/90 relative cursor-pointer group shadow-inner overflow-hidden select-none border border-stone-300/70 dark:border-stone-700/80"
          >
            {/* Chapter Segment Background Bands (Alternating subtle shading for effortless boundary distinction) */}
            {chapters.map((ch, idx) => {
              const startPct = ((ch.startPage - 1) / totalPages) * 100;
              const widthPct = ((ch.endPage - ch.startPage + 1) / totalPages) * 100;
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={`bg-ch-${ch.chapter || idx}`}
                  className={`absolute top-0 bottom-0 pointer-events-none transition-colors ${
                    isEven 
                      ? 'bg-black/[0.02] dark:bg-white/[0.02]' 
                      : 'bg-black/[0.06] dark:bg-white/[0.05]'
                  }`}
                  style={{
                    left: `${startPct}%`,
                    width: `${widthPct}%`,
                  }}
                />
              );
            })}

            {/* Fill Bar with dynamic gradient & glow */}
            <div
              className={`h-full ${barGradient} ${glowShadow} rounded-full transition-all duration-300 ease-out relative z-10`}
              style={{ width: `${completionPercent}%` }}
            >
              {/* Shimmer light effect */}
              <div className="absolute inset-0 bg-white/25 animate-pulse pointer-events-none" />

              {/* Glowing Pin Head Indicator at current position */}
              <div 
                className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-amber-600 dark:border-amber-400 shadow-lg transform scale-100 group-hover:scale-125 transition-transform z-30" 
                title={`أنت هنا: صفحة ${clampedPage} (${isAntigone ? 'مشهد' : 'فصل'} ${currentChapter.chapter})`}
              />
            </div>

            {/* Chapter Milestone Boundary Dividers & Notches */}
            {chapters.map((ch, idx) => {
              const chStartPercent = ((ch.startPage - 1) / totalPages) * 100;
              const isPassed = clampedPage >= ch.startPage;
              const isCurrent = currentChapter.chapter === ch.chapter;
              
              // Skip 0% boundary notch to avoid overlapping start
              if (idx === 0) return null;

              return (
                <div
                  key={`notch-ch-${ch.chapter || idx}`}
                  className="absolute top-0 bottom-0 pointer-events-none flex flex-col items-center justify-between z-20"
                  style={{ left: `${chStartPercent}%` }}
                >
                  {/* Top Notch Pip */}
                  <div 
                    className={`w-1 h-1 rounded-full ${
                      isCurrent
                        ? 'bg-amber-400 ring-2 ring-amber-300'
                        : isPassed 
                        ? 'bg-white/80' 
                        : 'bg-stone-500/70 dark:bg-stone-400/70'
                    }`}
                  />

                  {/* Vertical Boundary Line */}
                  <div 
                    className={`w-[1.5px] h-full ${
                      isCurrent
                        ? 'bg-amber-300 shadow-[0_0_6px_rgba(251,191,36,0.9)]'
                        : isPassed 
                        ? 'bg-white/60' 
                        : 'bg-stone-400/80 dark:bg-stone-500/80'
                    }`} 
                  />

                  {/* Bottom Notch Pip */}
                  <div 
                    className={`w-1 h-1 rounded-full ${
                      isCurrent
                        ? 'bg-amber-400 ring-2 ring-amber-300'
                        : isPassed 
                        ? 'bg-white/80' 
                        : 'bg-stone-500/70 dark:bg-stone-400/70'
                    }`}
                  />
                </div>
              );
            })}

            {/* Final Chapter Milestone Marker */}
            {finalChapter && (
              <div 
                className="absolute top-0 bottom-0 pointer-events-none flex items-center z-20"
                style={{ left: `${((finalChapter.startPage - 1) / totalPages) * 100}%` }}
                title={`الفصل الختامي: ${finalChapter.title}`}
              >
                <div className="w-1.5 h-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              </div>
            )}
          </div>

          {/* Interactive Chapter Boundary Interactive Diamonds / Jump Pins (Visible on Hover & for key chapters) */}
          <div className="absolute inset-x-0 -top-1 pointer-events-none flex items-center z-25">
            {chapters.map((ch, idx) => {
              // Show quick jump pins for major chapter transitions (or all if under 15 chapters)
              const showPin = chapters.length <= 15 || idx % 2 === 0 || idx === chapters.length - 1;
              if (!showPin) return null;

              const chStartPercent = ((ch.startPage - 1) / totalPages) * 100;
              const isCurrent = currentChapter.chapter === ch.chapter;
              const isPassed = clampedPage >= ch.startPage;

              return (
                <button
                  key={`pin-ch-${ch.chapter || idx}`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPageChange(ch.startPage);
                  }}
                  onMouseEnter={() => setHoveredBoundaryChapter(ch)}
                  onMouseLeave={() => setHoveredBoundaryChapter(null)}
                  className={`pointer-events-auto absolute -translate-x-1/2 -top-1 w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all transform hover:scale-135 cursor-pointer shadow-xs ${
                    isCurrent
                      ? 'bg-amber-400 text-stone-950 ring-2 ring-amber-500 scale-110 z-30 font-bold'
                      : isPassed
                      ? 'bg-emerald-500 text-white hover:bg-emerald-400 text-[8px] font-mono'
                      : 'bg-stone-400 dark:bg-stone-600 text-stone-900 dark:text-stone-100 hover:bg-amber-500 hover:text-white text-[8px] font-mono opacity-80 group-hover:opacity-100'
                  }`}
                  style={{ left: `${chStartPercent}%` }}
                  title={`انتقال مباشر إلى بداية ${isAntigone ? 'المشهد' : 'الفصل'} ${ch.chapter} (صفحة ${ch.startPage}): ${ch.title}`}
                >
                  <span className="text-[7px] font-mono font-bold leading-none select-none">
                    {ch.chapter}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Interactive Scrubbing Tooltip */}
          {hoveredPercent !== null && hoveredPage !== null && (
            <div
              className="absolute -bottom-11 -translate-x-1/2 bg-stone-950/95 text-white text-[11px] font-arabic font-bold px-3 py-1.5 rounded-xl shadow-2xl pointer-events-none z-50 whitespace-nowrap border border-amber-500/50 animate-in fade-in zoom-in-95 duration-100 flex items-center gap-2 backdrop-blur-md"
              style={{ left: `${tooltipX}px` }}
            >
              <span className="text-amber-400 font-mono font-black">{hoveredPercent}%</span>
              <span className="text-stone-500">·</span>
              <span className="font-mono text-emerald-300">صفحة {hoveredPage}</span>
              {hoveredChapter && (
                <>
                  <span className="text-stone-500">·</span>
                  <div className="flex items-center gap-1">
                    <span className="text-amber-300 font-bold">
                      {isAntigone ? 'مشهد' : 'فصل'} {hoveredChapter.chapter}:
                    </span>
                    <span className="text-stone-200 font-normal max-w-[180px] truncate">
                      {hoveredChapter.title}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      (ص {hoveredChapter.startPage}-{hoveredChapter.endPage})
                    </span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Bottom Chapter Boundaries Map Roadmap (Clear Section Beginnings & Endings) */}
        <div className="flex items-center justify-between text-[11px] text-stone-600 dark:text-stone-300 mt-2 px-1 select-none font-arabic">
          <div className="flex items-center gap-1 font-mono text-[10px] text-stone-500 dark:text-stone-400">
            <span>البداية (ص 1)</span>
          </div>

          {/* Center: Current Section Roadmap Breadcrumb */}
          <div className="flex items-center gap-2 truncate text-center max-w-md">
            <span className="text-stone-400 dark:text-stone-500 text-xs">◀</span>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/30 text-stone-900 dark:text-stone-100 font-bold text-xs truncate">
              <BookOpen className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="truncate">
                {isAntigone ? `المشهد ${currentChapter.chapter}:` : `الفصل ${currentChapter.chapter}:`} {currentChapter.title}
              </span>
              <span className="text-amber-700 dark:text-amber-300 font-mono font-normal text-[10px] shrink-0">
                [ص {currentChapter.startPage} ➔ {currentChapter.endPage}]
              </span>
            </div>
            <span className="text-stone-400 dark:text-stone-500 text-xs">▶</span>
          </div>

          <div className="flex items-center gap-1 font-mono text-[10px] text-stone-500 dark:text-stone-400">
            <span>الختام (ص {totalPages})</span>
          </div>
        </div>
      </div>
    </section>
  );
};
