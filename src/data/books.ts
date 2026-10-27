import { BookInfo } from '../types';

export const BOOKS: BookInfo[] = [
  {
    id: 'la_boite_a_merveilles',
    title: 'La Boîte à Merveilles',
    titleFrench: 'La Boîte à Merveilles',
    titleArabic: 'علبة العجائب',
    author: 'Ahmed Sefrioui',
    authorArabic: 'أحمد الصفريوي',
    genre: 'Roman Autobiographique',
    genreArabic: 'سيرة ذاتية وروائية',
    year: '1954',
    totalPages: 99,
    descriptionFrench: 'La vie quotidienne dans la médina de Fès à travers le regard intime et poétique du petit Sidi Mohammed, 6 ans, et sa boîte magique en fer-blanc.',
    descriptionArabic: 'سيرة ذاتية تستحضر طفولة الصبي سيدي محمد ذي الست سنوات في فاس العتيقة، مع رصد دقيق لطقوس دار الشوافة، عوالم المسيد، وشخصيات المجتمع الفاسي.',
    badge: 'مقرر 1ère Bac',
    theme: {
      themeName: 'أصالة فاس العتيقة (Médina de Fès)',
      themeTagline: 'دفء خشب الأرز، زليج فاس، وسحر علبة العجائب النحاسية',
      eraBadge: 'فاس 1921 · تراث وأصالة مغربية',
      bgLight: '#faf6ee',
      bgDark: '#120f0d',
      primaryBrand: 'amber',
      accentHex: '#d97706',
      cardBgLight: 'bg-[#fffdf9]',
      cardBgDark: 'dark:bg-[#191410]',
      navbarBorderLight: 'border-amber-200/90',
      navbarBorderDark: 'dark:border-amber-950/80',
      readerPageBgLight: 'bg-[#fffefb]',
      readerPageBgDark: 'dark:bg-[#181310]',
      borderLight: 'border-amber-200/80',
      borderDark: 'dark:border-[#2e231c]',
      accentBtn: 'bg-amber-800 hover:bg-amber-900 text-amber-50',
      accentBadge: 'bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-800',
      bannerGradient: 'from-amber-950 via-stone-900 to-amber-900',
      motifStyle: 'zellij',
      quote: {
        french: '« Ma boîte à merveilles contenait des boules de verre, des anneaux de cuivre, un minuscule cadenas sans clef... »',
        arabic: '«كانت علبتي العجيبة تحتوي على كرات زجاجية، حلقات نحاسية، وقفل صغير دون مفتاح...»',
        speaker: 'Sidi Mohammed (Chapitre 1)'
      }
    },
    colorScheme: {
      primary: 'amber',
      secondary: 'stone',
      border: 'border-amber-800/60',
      gradient: 'from-amber-950 via-stone-900 to-amber-900',
      accentText: 'text-amber-300'
    }
  },
  {
    id: 'antigone',
    title: 'Antigone',
    titleFrench: 'Antigone',
    titleArabic: 'أنتيجون',
    author: 'Jean Anouilh',
    authorArabic: 'جان أنوي',
    genre: 'Tragédie Moderne',
    genreArabic: 'تراجيديا حديثة',
    year: '1944',
    totalPages: 115,
    descriptionFrench: 'La confrontation mythique et poignante entre le devoir moral et familial d\'Antigone et la raison d\'État implacable incarnée par Créon.',
    descriptionArabic: 'مواجهة مسرحية تراجيدية خالدة بين الواجب الأخلاقي والضمير الإنساني الفردي المتمثل في أنتيجون، وبين سلطة وقوانين الدولة الصارمة الممثلة في خالها كريون.',
    badge: 'مقرر 1ère Bac',
    theme: {
      themeName: 'المسرح التراجيدي وطيبة (Théâtre & Pourpre Royal)',
      themeTagline: 'رخام قصر طيبة، مخمل تراجيدي أرجواني، وشموخ الضمير الإنساني',
      eraBadge: 'طيبة الإغريقية · دراما الالتزام والحرية',
      bgLight: '#faf5f6',
      bgDark: '#12080d',
      primaryBrand: 'rose',
      accentHex: '#e11d48',
      cardBgLight: 'bg-[#fffafb]',
      cardBgDark: 'dark:bg-[#1c0c14]',
      navbarBorderLight: 'border-rose-200/90',
      navbarBorderDark: 'dark:border-rose-950/80',
      readerPageBgLight: 'bg-[#fffcfd]',
      readerPageBgDark: 'dark:bg-[#180a11]',
      borderLight: 'border-rose-200/80',
      borderDark: 'dark:border-[#3d1a27]',
      accentBtn: 'bg-rose-900 hover:bg-rose-950 text-rose-50',
      accentBadge: 'bg-rose-100 text-rose-950 border-rose-300 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-800',
      bannerGradient: 'from-rose-950 via-slate-950 to-rose-900',
      motifStyle: 'theban_stage',
      quote: {
        french: '« C\'est propre, la tragédie. C\'est reposant, parce qu\'on sait qu\'il n\'y a plus d\'espoir... »',
        arabic: '«التراجيديا نقية ومريحة، لأننا نعلم أنه لم يعد هناك أدنى أمل...»',
        speaker: 'Le Chœur'
      }
    },
    colorScheme: {
      primary: 'rose',
      secondary: 'slate',
      border: 'border-rose-800/60',
      gradient: 'from-rose-950 via-slate-900 to-rose-900',
      accentText: 'text-rose-300'
    }
  },
  {
    id: 'le_dernier_jour_dun_condamne',
    title: 'Le Dernier Jour d\'un Condamné',
    titleFrench: 'Le Dernier Jour d\'un Condamné',
    titleArabic: 'آخر يوم لمحكوم عليه بالإعدام',
    author: 'Victor Hugo',
    authorArabic: 'فيكتور هوغو',
    genre: 'Roman à Thèse',
    genreArabic: 'رواية أطروحة',
    year: '1829',
    totalPages: 55,
    descriptionFrench: 'Un réquisitoire vibrant contre la peine de mort, explorant les angoisses psychologiques, les souvenirs et les dernières heures d\'un condamné.',
    descriptionArabic: 'مونولوج نفسي مكثف ومرافعة أدبية وإنسانية قوية ضد عقوبة الإعدام، تنقل مشاعر، مخاوف، ولحظات المعاناة النفسية لسجين ينتظر تنفيذ حكم الإعدام.',
    badge: 'مقرر 1ère Bac',
    theme: {
      themeName: 'زنزانة بيسيتر ومداد هيغو (Bicêtre & Encre Romantique)',
      themeTagline: 'حجر سجن بيسيتر البارد، مداد المخطوطة الرومانسية، وصوت الحرية والعدالة',
      eraBadge: 'باريس 1829 · صرخة أدبية ضد عقوبة الإعدام',
      bgLight: '#f1f5f9',
      bgDark: '#0a0e17',
      primaryBrand: 'blue',
      accentHex: '#2563eb',
      cardBgLight: 'bg-[#f8fafc]',
      cardBgDark: 'dark:bg-[#0f172a]',
      navbarBorderLight: 'border-slate-300/80',
      navbarBorderDark: 'dark:border-slate-800',
      readerPageBgLight: 'bg-[#ffffff]',
      readerPageBgDark: 'dark:bg-[#0b1320]',
      borderLight: 'border-slate-300/80',
      borderDark: 'dark:border-[#1e293b]',
      accentBtn: 'bg-slate-900 hover:bg-slate-950 text-slate-50',
      accentBadge: 'bg-slate-200 text-slate-950 border-slate-300 dark:bg-slate-900 dark:text-blue-300 dark:border-slate-700',
      bannerGradient: 'from-slate-950 via-blue-950 to-slate-900',
      motifStyle: 'gothic_iron',
      quote: {
        french: '« Condamné à mort ! Voilà cinq semaines que j\'habite avec cette pensée, toujours seul avec elle... »',
        arabic: '«محكوم بالإعدام! ها قد مرت خمسة أسابيع وأنا أعيش مع هذه الفكرة، وحيداً معها دوماً...»',
        speaker: 'Le Condamné (Chapitre 1)'
      }
    },
    colorScheme: {
      primary: 'blue',
      secondary: 'slate',
      border: 'border-blue-800/60',
      gradient: 'from-slate-950 via-blue-950 to-slate-900',
      accentText: 'text-blue-300'
    }
  }
];

export function getBookById(id: string): BookInfo {
  return BOOKS.find((b) => b.id === id) || BOOKS[0];
}
