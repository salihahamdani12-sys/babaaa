import React, { useState } from 'react';
import { Sparkles, BookOpen, Layers, ChevronRight, ChevronLeft, Volume2, MessageSquare, Star, ArrowRight } from 'lucide-react';
// @ts-ignore
import confetti from 'canvas-confetti';

export interface ComicPanel {
  id: string;
  chapterNumber: number;
  chapterTitle: string;
  titleAr: string;
  sceneDescriptionFr: string;
  sceneDescriptionAr: string;
  characters: string[];
  dialogueFr?: string;
  dialogueAr?: string;
  settingFr: string;
  settingAr: string;
  mood: string;
  visualPrompt: string; // Used to generate placeholder illustration or SVG artwork
}

export const BOITE_COMIC_PANELS: ComicPanel[] = [
  {
    id: 'boite-c1-1',
    chapterNumber: 1,
    chapterTitle: 'Chapitre I',
    titleAr: 'الفصل الأول: العزلة ودار الشوافة',
    sceneDescriptionFr: "Le soir, Sidi Mohammed contemple sa solitude au fond de l'impasse, serrant son piège à moineau. Au rez-de-chaussée, Lalla Kanza la voyante orchestre une séance de rituels Gnaouas dans les fumées de benjoin.",
    sceneDescriptionAr: 'في المساء، يسترجع سيدي محمد عزلته وحزنه في الدرب المظلم بينما تضج دار الشوافة أسفل بيته بطقوس البخور وأصوات كناوة.',
    characters: ['Sidi Mohammed', 'Lalla Kanza (La Chouafa)'],
    dialogueFr: "Moi, je ne voulais rien apprendre, je voulais seulement rêver...",
    dialogueAr: "أنا لم أكن أريد أن أتعلم شيئاً، كنت أريد فقط أن أحلم...",
    settingFr: 'Dar Chouafa, Fès (Rez-de-chaussée et patio)',
    settingAr: 'دار الشوافة، فاس (الطابق الأرضي والباحة)',
    mood: 'Mystérieux / Mélancolique',
    visualPrompt: 'dar_chouafa_night'
  },
  {
    id: 'boite-c1-2',
    chapterNumber: 1,
    chapterTitle: 'Chapitre I',
    titleAr: 'الفصل الأول: شجار يوم الغسيل',
    sceneDescriptionFr: "Sur le palier, Lalla Zoubida et Rahma s'affrontent violemment à cause du jour de lessive, échangeant des cris et des insultes qui ébranlent toute la maison.",
    sceneDescriptionAr: 'على سُلم الدار، تنشب معركة كلامية حامية وطاحنة بين لالة زبيدة ورحمة بسبب نوبة الغسيل، وسط ذهول الجارات.',
    characters: ['Lalla Zoubida', 'Rahma', 'Fatma Bziouya'],
    dialogueFr: "Ce jour-là m'appartenait exclusivement ! Tu n'as aucun droit de faire ta lessive un lundi !",
    dialogueAr: "هذا اليوم كان يخصني وحدك! ليس من حقك نشر غسيلك في يوم الاثنين!",
    settingFr: 'Le palier de Dar Chouafa',
    settingAr: 'ممر وفناء دار الشوافة',
    mood: 'Bruit / Colère',
    visualPrompt: 'laundry_fight'
  },
  {
    id: 'boite-c2-1',
    chapterNumber: 2,
    chapterTitle: 'Chapitre II',
    titleAr: 'الفصل الثاني: شؤم يوم الثلاثاء في المسيد',
    sceneDescriptionFr: "Au Msid, le Fqih brandit sa baguette de cognassier. C'est mardi, jour maudit des révisions coraniques où les enfants tremblent de peur.",
    sceneDescriptionAr: 'في الكتّاب القرآني (المسيد)، يلوح الفقيه بعصا السفرجل وسط رعب الأطفال في يوم الثلاثاء النحس.',
    characters: ['Le Fqih', 'Sidi Mohammed'],
    dialogueFr: "Le mardi est un jour néfaste pour les élèves du Msid...",
    dialogueAr: "الثلاثاء يوم شؤم ونحس على تلاميذ المسيد...",
    settingFr: 'L’école coranique (Msid)',
    settingAr: 'المسيد العتيق',
    mood: 'Terreur / Discipline',
    visualPrompt: 'msid_school'
  },
  {
    id: 'boite-c2-2',
    chapterNumber: 2,
    chapterTitle: 'Chapitre II',
    titleAr: 'الفصل الثاني: زيارة ضريح سيدي علي بوغالب',
    sceneDescriptionFr: "Lalla Zoubida et Lalla Aïcha emmènent Sidi Mohammed au marabout de Sidi Ali Boughaleb. Un chat vicieux griffe soudainement le front de l'enfant.",
    sceneDescriptionAr: 'لالة زبيدة ولالة عائشة تصطحبان الصبي لضريح سيدي علي بوغالب للتبرك، وفجأة يهجم قط مشاكس ليخمش وجه الطفل.',
    characters: ['Sidi Mohammed', 'Lalla Zoubida', 'Lalla Aïcha'],
    dialogueFr: "Cet enfant a besoin de la baraka de notre saint patron !",
    dialogueAr: "هذا الطفل يحتاج لبركة سيدنا ومولانا علي بوغالب!",
    settingFr: 'Sanctuaire de Sidi Ali Boughaleb',
    settingAr: 'ضريح سيدي علي بوغالب',
    mood: 'Spirituel / Surprise',
    visualPrompt: 'marabout_shrine'
  },
  {
    id: 'boite-c3-1',
    chapterNumber: 3,
    chapterTitle: 'Chapitre III',
    titleAr: 'الفصل الثالث: ضياع زينب ووليمة الصدقة',
    sceneDescriptionFr: "Panique générale à la médina ! Zineb, la fille de Rahma, s'est perdue dans la foule. Les femmes se mobilisent pour la retrouver avant de fêter son retour avec un grand couscous.",
    sceneDescriptionAr: 'هلع وهستيريا في زنقة فاس! زينب ابنة رحمة تضيع في الزحام، ونساء الحي يمشطن الأسواق قبل العثور عليها وإعداد وليمة للفقراء.',
    characters: ['Rahma', 'Zineb', 'Lalla Zoubida'],
    dialogueFr: "Zineb s'est perdue ! Ma fille n'est plus là !",
    dialogueAr: "ابنتي ضاعت يا ناس! زينب لم تعد في الدار!",
    settingFr: 'Rues animées de Fès',
    settingAr: 'أسواق وأزقة مدينة فاس',
    mood: 'Panique / Solidarité',
    visualPrompt: 'lost_child'
  },
  {
    id: 'boite-c4-1',
    chapterNumber: 4,
    chapterTitle: 'Chapitre IV',
    titleAr: 'الفصل الرابع: محنة مولاي العربي وحكاية عبد الله البقال',
    sceneDescriptionFr: "Moulay Larbi arrive effondré chez Lalla Aïcha : son associé Abdelkader l'a trahi et ruiné. Pour apaiser les cœurs, Maâlem Abdeslem raconte la légende d'Abdallah l'épicier.",
    sceneDescriptionAr: 'مولاي العربي يدخل منهاراً لبيت لالة عائشة بعد خيانة شريكه. ولتهدئة الأجواء، يروي المعلم عبد السلام حكاية عبد الله البقال العجيب.',
    characters: ['Moulay Larbi', 'Maâlem Abdeslem', 'Lalla Aïcha'],
    dialogueFr: "L'affaire a été portée devant le prévôt des marchands... Il n'y a plus de justice !",
    dialogueAr: "لقد حكم أمين الحرفة لصالح الغريم.. لم يعد هناك عدل في الدنيا!",
    settingFr: 'Maison de Lalla Aïcha',
    settingAr: 'بيت لالة عائشة',
    mood: 'Tristesse / Sagesse',
    visualPrompt: 'moulay_larbi_ruin'
  },
  {
    id: 'boite-c5-1',
    chapterNumber: 5,
    chapterTitle: 'Chapitre V',
    titleAr: 'الفصل الخامس: جنازة الحلاق ومحنة المرض',
    sceneDescriptionFr: "Le deuil s'abat sur le quartier avec la mort de Sidi Mohammed Ben Tahar le coiffeur. Sidi Mohammed, terrifié par la mort, tombe gravement malade et délire de fièvre.",
    sceneDescriptionAr: 'الموت يطرق الحي بوفاة الحلاق سيدي محمد بن الطاهر. الطفل يصاب بحمى شديدة وكوابيس مرعبة تلاحقه في الفراش.',
    characters: ['Sidi Mohammed', 'Lalla Zoubida', 'Maâlem Abdeslem'],
    dialogueFr: "La mort rodait autour de nous... J'avais peur qu'elle ne vînt m'arracher à mes trésors.",
    dialogueAr: 'كان الموت يحوم حولنا.. وكنت خائفاً من أن ينتزعني من بين كنوزي السحرية.',
    settingFr: 'La chambre de Sidi Mohammed',
    settingAr: 'غرفة سيدي محمد في دار الشوافة',
    mood: 'Angoisse / Maladie',
    visualPrompt: 'fever_bed'
  },
  {
    id: 'boite-c6-1',
    chapterNumber: 6,
    chapterTitle: 'Chapitre VI',
    titleAr: 'الفصل السادس: التسوق في القيسارية وملابس عاشوراء',
    sceneDescriptionFr: "Grand préparatif pour l'Achoura ! Sidi Mohammed est nommé chef des frotteurs au Msid, puis part avec sa mère à la somptueuse Kissaria pour acheter sa djellaba et son gilet brodé.",
    sceneDescriptionAr: 'استعدادات عاشوراء الكبرى! سيدي محمد يُعيّن رئيساً لفرك أرضية المسيد، ثم يرافق أمه للقيسارية لشراء الجلباب والسترة المزركشة.',
    characters: ['Sidi Mohammed', 'Lalla Zoubida', 'Le marchand de tissus'],
    dialogueFr: "Regarde cet habit magnifique ! Il te ira comme un prince pour l'Achoura.",
    dialogueAr: "انظر إلى هذا القماش الجميل! ستبدو كأمير صغير يوم عاشوراء.",
    settingFr: 'Marché de la Kissaria',
    settingAr: 'سواق القيسارية الشهيرة',
    mood: 'Joie / Fête',
    visualPrompt: 'kissaria_market'
  },
  {
    id: 'boite-c7-1',
    chapterNumber: 7,
    chapterTitle: 'Chapitre VII',
    titleAr: 'الفصل السابع: ليلة عاشوراء الباهرة',
    sceneDescriptionFr: "Les tambours, les bendirs et les bougies illuminent le Msid et les terrasses de Fès. C'est l'apothéose de la fête de l'Achoura et de la joie enfantine.",
    sceneDescriptionAr: 'الطبول والتعريجات والشموع تضيء أسطح فاس ومسيدها. إنها ليلة عاشوراء الساحرة وفرحة الأطفال بالبنادير.',
    characters: ['Sidi Mohammed', 'Le Fqih', 'Les écoliers'],
    dialogueFr: "Les bruits des tambourins nous parvenaient de toutes les terrasses !",
    dialogueAr: "أصداء الدفوف والطبول كانت ترد من كل السطوح والدروب!",
    settingFr: 'Le Msid illuminé',
    settingAr: 'المسيد المزهر بالأنوار',
    mood: 'Festif / Éblouissant',
    visualPrompt: 'achoura_festival'
  }
];

interface ComicsStudioProps {
  onBackToReader: () => void;
}

export const ComicsStudio: React.FC<ComicsStudioProps> = ({ onBackToReader }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const panel = BOITE_COMIC_PANELS[currentIndex];

  const handleNext = () => {
    if (currentIndex < BOITE_COMIC_PANELS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Helper to generate dynamic retro-comic illustration styles via SVG gradients & patterns
  const renderComicIllustration = (prompt: string) => {
    return (
      <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-900 via-stone-900 to-amber-950 border-4 border-amber-500/80 shadow-2xl flex items-center justify-center p-6 group">
        {/* Retro halftone dots pattern overlay */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Atmospheric lighting */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-orange-600/20 rounded-full blur-3xl" />

        {/* Central Artistic Representation */}
        <div className="relative z-10 text-center space-y-3">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-4xl shadow-inner animate-pulse">
            {prompt === 'dar_chouafa_night' ? '🕯️' :
             prompt === 'laundry_fight' ? '🧺' :
             prompt === 'msid_school' ? '📖' :
             prompt === 'marabout_shrine' ? '⛩️' :
             prompt === 'lost_child' ? '🔍' :
             prompt === 'moulay_larbi_ruin' ? '📜' :
             prompt === 'fever_bed' ? '🌙' :
             prompt === 'kissaria_market' ? '🧵' : '🥁'}
          </div>
          <div className="bg-stone-950/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-amber-500/40 inline-block text-amber-300 font-mono text-xs font-bold tracking-wider">
            لوحة فنية رقمية #{currentIndex + 1} من {BOITE_COMIC_PANELS.length}
          </div>
          <h4 className="text-white font-arabic font-extrabold text-lg sm:text-xl drop-shadow-md">
            {panel.titleAr}
          </h4>
        </div>

        {/* Comic Action Badge */}
        <div className="absolute top-3 left-3 bg-amber-500 text-stone-950 px-3 py-1 rounded-lg font-black font-mono text-xs uppercase tracking-widest shadow-lg border-2 border-white rotate-[-3deg]">
          B.D. SCÈNE
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in zoom-in-95 duration-300 font-arabic">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-amber-950/90 text-amber-100 px-6 py-4 rounded-2xl border-2 border-amber-500/50 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-xl shadow">
            🎨
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              <span>استوديو الكوميكس والقصص المصورة (B.D.)</span>
              <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full border border-amber-400/40 font-mono">
                مطابق للأصل 100%
              </span>
            </h2>
            <p className="text-xs text-amber-200/80">
              أحداث رواية «علبة العجائب» مجسدة في لوحات بصرية وإطارات تفاعلية دقيقة
            </p>
          </div>
        </div>

        <button
          onClick={onBackToReader}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 transition-all border border-white/20 cursor-pointer shadow"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للقراءة النصية</span>
        </button>
      </div>

      {/* Main Comic Reader Card */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl border-4 border-amber-600/60 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 relative">
        {/* Chapter & Scene Info Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-stone-950 font-black px-3 py-1 rounded-lg text-xs font-mono">
              {panel.chapterTitle}
            </span>
            <span className="text-stone-300 text-xs font-bold">
              {panel.settingAr}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono bg-stone-950 px-3 py-1 rounded-full border border-stone-800">
            <span>التصنيف النفسي والدرامي:</span>
            <span className="font-bold text-white">{panel.mood}</span>
          </div>
        </div>

        {/* Comic Illustration Box */}
        {renderComicIllustration(panel.visualPrompt)}

        {/* Comic Speech Bubble (Dialogue) */}
        {panel.dialogueFr && (
          <div className="relative bg-amber-100 text-stone-950 p-5 rounded-2xl border-3 border-stone-900 shadow-xl space-y-2 mt-4 transform hover:scale-[1.01] transition-transform">
            {/* Speech bubble tail pointer */}
            <div className="absolute -top-3 right-8 w-6 h-6 bg-amber-100 border-t-3 border-r-3 border-stone-900 transform rotate-[-45deg]" />
            
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold bg-stone-900 text-amber-300 px-2.5 py-0.5 rounded-full">
                💬 الحوار الأصلي (Français)
              </span>
              <span className="text-xs font-extrabold text-amber-900">
                الشخصيات: {panel.characters.join(' & ')}
              </span>
            </div>
            <p className="font-serif italic text-base sm:text-lg font-bold text-amber-950">
              « {panel.dialogueFr} »
            </p>
            <p className="text-xs sm:text-sm font-arabic font-bold text-stone-800 border-t border-amber-300/80 pt-2">
              العربية: « {panel.dialogueAr} »
            </p>
          </div>
        )}

        {/* Scene Description Box (Narration Caption Box) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-950/80 p-5 rounded-2xl border border-stone-800 shadow-inner">
          <div className="space-y-1.5 border-b md:border-b-0 md:border-l border-stone-800 pb-3 md:pb-0 md:pl-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
              Description narrative (Français)
            </span>
            <p className="text-xs sm:text-sm text-stone-300 font-serif leading-relaxed">
              {panel.sceneDescriptionFr}
            </p>
          </div>
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
              الوصف السردي والسياق (العربية)
            </span>
            <p className="text-xs sm:text-sm text-stone-200 font-arabic leading-relaxed">
              {panel.sceneDescriptionAr}
            </p>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-800">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-arabic flex items-center gap-2 transition-all ${
              currentIndex === 0
                ? 'opacity-40 cursor-not-allowed bg-stone-800 text-stone-500'
                : 'bg-stone-800 hover:bg-stone-700 text-white cursor-pointer shadow'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
            <span>المشهد السابق</span>
          </button>

          <div className="flex items-center gap-1 font-mono text-xs font-bold text-amber-400">
            <span>{currentIndex + 1}</span>
            <span className="text-stone-500">/</span>
            <span>{BOITE_COMIC_PANELS.length}</span>
          </div>

          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-extrabold font-arabic flex items-center gap-2 transition-all shadow-lg cursor-pointer hover:scale-105 active:scale-95"
          >
            <span>{currentIndex === BOITE_COMIC_PANELS.length - 1 ? 'إكمال القصة 🎉' : 'المشهد الموالي'}</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
