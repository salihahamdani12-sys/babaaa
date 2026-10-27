import React, { useState } from 'react';
import { 
  BookOpen, Users, FileText, Sparkles, X, ChevronRight, 
  Share2, Lightbulb, CheckCircle2, ArrowRight, HelpCircle, Compass, Target, Layers, Clock
} from 'lucide-react';
import { BookId } from '../types';
import { BOOKS } from '../data/books';

interface MindMapStudioProps {
  currentBookId: BookId;
  onClose: () => void;
  onSelectBook: (id: BookId) => void;
}

interface MindMapNode {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  category: 'protagonist' | 'antagonist' | 'secondary' | 'theme' | 'event';
  description: string;
  details: string[];
  connections: string[];
}

interface ChapterTimelineItem {
  chapterNum: number;
  title: string;
  summary: string;
  keyEvents: string[];
  characters: string[];
  examFocus: string;
}

interface MindMapData {
  bookId: BookId;
  title: string;
  author: string;
  genre: string;
  centralNode: MindMapNode;
  nodes: MindMapNode[];
  chapters: ChapterTimelineItem[];
}

const VISUAL_MIND_MAPS: Record<BookId, MindMapData> = {
  la_boite_a_merveilles: {
    bookId: 'la_boite_a_merveilles',
    title: 'La Boîte à Merveilles',
    author: 'Ahmed Sefrioui (1954)',
    genre: 'Roman autobiographique',
    centralNode: {
      id: 'narrateur',
      title: 'Sidi Mohammed (L’Enfant)',
      subtitle: '6 ans · Narrateur & Rêveur',
      emoji: '👦',
      category: 'protagonist',
      description: 'Le pivot de toute l’histoire. Enfant solitaire, sensible et imaginatif qui grandit à Fès.',
      details: [
        'Vit au 2ème étage de Dar Chouafa',
        'Possède une boîte magique (boutons, clous, cabochons de verre)',
        'Fréquente le M’cid avec le Fkih rigoureux',
        'Observe les drames des adultes avec un regard naïf et poétique'
      ],
      connections: ['parents', 'boite', 'lalla_aicha', 'driss_rahma', 'mfik']
    },
    nodes: [
      {
        id: 'parents',
        title: 'Les Parents (Abdeslam & Zoubida)',
        subtitle: 'Dignité & Tradition',
        emoji: '👨‍👩‍👦',
        category: 'protagonist',
        description: 'Maalem Abdeslam (tisserand fier qui perd son capital) et Lalla Zoubida (mère noble, superstitieuse).',
        details: [
          'Crise financière suite à la perte de l’argent au souk des haïks',
          'Voyage du père aux moissons',
          'Visites des saints et voyantes (Sidi Ali Boughaleb, Sidi El Arafi)'
        ],
        connections: ['narrateur', 'boite']
      },
      {
        id: 'boite',
        title: 'La Boîte à Merveilles',
        subtitle: 'Refuge magique et secret',
        emoji: '📦',
        category: 'theme',
        description: 'Le symbole ultime de l’évasion contre la solitude et la rudesse de la réalité.',
        details: [
          'Contient des objets hétéroclites sans valeur marchande mais dotés d’une âme',
          'Permet à l’enfant de se créer un univers protecteur',
          'Source de réconfort psychologique'
        ],
        connections: ['narrateur']
      },
      {
        id: 'lalla_aicha',
        title: 'Lalla Aicha',
        subtitle: 'Amie intime & Tragédie',
        emoji: '👵',
        category: 'secondary',
        description: 'Voisine et amie de Lalla Zoubida, victime de la trahison de son mari Abdelkader.',
        details: [
          'Subit la faillite et le mépris de l’associé Larbi',
          'Incarne la solidarité féminine dans les épreuves'
        ],
        connections: ['narrateur', 'parents']
      },
      {
        id: 'driss_rahma',
        title: 'Driss El Aouad & Rahma',
        subtitle: 'Voisins solidaires',
        emoji: '🏘️',
        category: 'secondary',
        description: 'Fabricant de charrues et sa femme Rahma. Perte et retrouvaille de leur fille Zineb.',
        details: [
          'Épisode de la disparition de Zineb',
          'Représentent la chaleur humaine de Dar Chouafa'
        ],
        connections: ['narrateur']
      },
      {
        id: 'mfik',
        title: 'Le Fkih (Abdellah)',
        subtitle: 'L’autorité coranique',
        emoji: '📖',
        category: 'secondary',
        description: 'Enseignant austère du M’cid muni de sa baguette de cognassier.',
        details: [
          'Exerce une discipline de fer sur les enfants',
          'Incarne la tradition éducative marocaine d’époque'
        ],
        connections: ['narrateur']
      }
    ],
    chapters: [
      {
        chapterNum: 1,
        title: "الفصل الأول: العزلة، دار الشوافة، وشجار النوبة",
        summary: "تقديم الراوي سيدي محمد وعزلته، وصف دار الشوافة وسكانها، زيارة طقوس كناوة، والشجار الحاد بين لالة زبيدة ورحمة بسبب يوم الغسيل.",
        keyEvents: [
          "إعلان الراوي عن وحدته وعزلته في سن السادسة",
          "وصف دقيق لدار الشوافة وعادات سكانها العجيبة",
          "حفل طائفة كنوة بالدور الأرضي وأثره المرعب على الطفل",
          "شجار صاخب بين لالة زبيدة ورحمة حول توزيع نوبة الغسيل"
        ],
        characters: ["سيدي محمد", "لالة زبيدة", "رحمة"],
        examFocus: "موقع المقطع في الرواية: غالباً ما يمتحن في بدايات الرواية لتقديم العالم الروائي وفضاء دار الشوافة."
      },
      {
        chapterNum: 2,
        title: "الفصل الثاني: يوم الثلاثاء، المسيد، وزيارة ضريح سيدي علي بوغالب",
        summary: "شؤم يوم الثلاثاء في المسيد، صداع لالة زبيدة، زيارة لالة عائشة واقتراح الذهاب إلى ضريح سيدي علي بوغالب للتبرك، ثم خمش القط للطفل وإهداء رحمة كابوشون الزجاج.",
        keyEvents: [
          "معاناة الطفل يوم الثلاثاء في المدرسة القرآنية (المسيد)",
          "زيارة لالة عائشة لصديقتها لالة زبيدة وعرضها الذهاب للضريح",
          "رحلة التبرك إلى ضريح سيدي علي بوغالب وخمش القط لسيدي محمد",
          "هدية رحمة (كابوشون الزجاج) التي أنست الطفل ألمه"
        ],
        characters: ["سيدي محمد", "لالة زبيدة", "لالة عائشة", "رحمة"],
        examFocus: "استكشاف المعتقدات الشعبية (التبرك بالولي الصالح) وعلاقته بثقافة المجتمع الفاسي."
      },
      {
        chapterNum: 3,
        title: "الفصل الثالث: مصباح البترول وفقدان زينب وإطعام الفقراء",
        summary: "اقتناء مصباح البترول، ضياع زينب في زحام الرصيف، حزن رحمة وتضامن نساء الحي، والعثور عليها في دار قيطون، وتنظيم وليمة صدقة.",
        keyEvents: [
          "اقتناء مصباح بترولي جديد يجلب الفخر والسرور لدار الشوافة",
          "اختفاء الطفلة زينب في زحام زنقة الرصيف واستنفار الحي بأكمله",
          "العثور على زينب سالمة بدار قيطون",
          "إقامة وليمة صدقة للفقراء والعميان شكراً لله"
        ],
        characters: ["زينب", "رحمة", "المعلم عبد السلام", "لالة زبيدة"],
        examFocus: "إبراز قيمة التضامن الاجتماعي والأسري بين جيران الحي الشعبي."
      },
      {
        chapterNum: 4,
        title: "الفصل الرابع: زيارة لالة عائشة ومشكلة مولاي العربي مع عبد القادر",
        summary: "زيارة سيدي محمد وأمه لبيت لالة عائشة، لعب الأطفال فوق السطح، وصول مولاي العربي وخبر خيانة شريكه عبد القادر.",
        keyEvents: [
          "الذهاب في زيارة استثنائية لبيت لالة عائشة",
          "لعب الأطفال بلعبة العروس فوق السطح",
          "قدوم مولاي العربي منهاراً بعد استيلاء شريكه الخائن عبد القادر على ورشته",
          "حكاية عبد الله البقال الخارق كقصة استباقية"
        ],
        characters: ["لالة عائشة", "مولاي العربي", "سيدي محمد", "عبد القادر"],
        examFocus: "بداية الأزمات المالية والاجتماعية للشخصيات وانعكاسها على نفسية الراوي."
      },
      {
        chapterNum: 5,
        title: "الفصل الخامس: الاستعداد لعاشوراء وموت سيدي محمد بن الطاهر",
        summary: "التحضير لعاشوراء، بيع لالة عائشة لحليها لمساعدة زوجها، وفاة مصفف الشعر سيدي محمد بن الطاهر وحمى الراوي.",
        keyEvents: [
          "التحضيرات المدرسية والمجتمعية لاستقبال شهر عاشوراء وتبييض المسيد",
          "لالة عائشة تضحي بحليها لتسوية أزمة زوجها مولاي العربي",
          "وفاة مصفف الشعر وجنازته المؤثرة",
          "إصابة سيدي محمد بحمى قوية وهواجس الموت والخوف"
        ],
        characters: ["سيدي محمد بن الطاهر", "الفقيه", "سيدي محمد", "لالة عائشة"],
        examFocus: "ثيمة الموت والخوف الإنساني في عالم الطفولة."
      },
      {
        chapterNum: 6,
        title: "الفصل السادس: تنظيف المسيد وشراء ملابس عاشوراء",
        summary: "تعيين سيدي محمد رئيساً لفرك أرضية المسيد، الذهاب للقيسارية لشراء ملابس العيد وحكاية العم عثمان وخديجة.",
        keyEvents: [
          "اختيار سيدي محمد لتنظيف المسيد بمعية زملائه",
          "رحلة التسوق إلى القيسارية لشراء الملابس الجديدة",
          "شجار عابر مع زينب في الطريق",
          "حكاية العم عثمان المتقاعد والزواج بخديجة التي روتها رحمة"
        ],
        characters: ["سيدي محمد", "الفقيه", "العم عثمان", "خديجة", "رحمة"],
        examFocus: "مظاهر الاحتفال الشعبي وتقاليد الاستعداد لعاشوراء في مدينة فès."
      },
      {
        chapterNum: 7,
        title: "الفصل السابع: احتفال عاشوراء في المسيد والبيت",
        summary: "شراء الألعاب والدفوف، ليلة ويوم عاشوراء المبهر في المسيد بالأنوار والصلوات، وزيارة لالة عائشة بأخبار مقلقة.",
        keyEvents: [
          "شراء البندير والآلات الموسيقية للأطفال",
          "الاحتفال الصاخب والبهيج بليلة عاشوراء في المسيد وتلاوة القرآن",
          "زيارة لالة عائشة للمساء والجلب أخبار غير سارة عن مولاي العربي"
        ],
        characters: ["سيدي محمد", "المعلم عبد السلام", "لالة عائشة"],
        examFocus: "ذروة الفرح والبهجة في الرواية تليها مباشرة نذير الشؤم."
      },
      {
        chapterNum: 8,
        title: "الفصل الثامن: سيدي العرافي، الطلاق، وصدمة السوق",
        summary: "استشارة العراف الضرير سيدي العرافي، طلاق مولاي العربي لزوجته ثم ندمه، وكارثة خسارة رأس مال الأب.",
        keyEvents: [
          "زيارة العراف الضرير سيدي العرافي بمعية الأم ولالة عائشة",
          "مولاي العربي يطلق زوجته تحت تأثير الغضب ثم يندم مرضاً",
          "الكارثة الكبرى: المعلم عبد السلام يفقد كل رأسماله في سوق الحايك"
        ],
        characters: ["سيدي العرافي", "مولاي العربي", "المعلم عبد السلام"],
        examFocus: "لحظة التحول المأساوي وسقوط العائلتين في أتون الفقر."
      },
      {
        chapterNum: 9,
        title: "الفصل التاسع: رحيل الأب إلى Moissons (الموissons)",
        summary: "سفر الأب للعمل كحاصد في البوادي لتوفير المال، شعور باليتم والوحدة لدى الزوجة والابن.",
        keyEvents: [
          "وداع مؤثر للمعلم عبد السلام قبيل سفره للبوادي",
          "دخول البيت في مرحلة تقشف وقحط معنوي ومادي",
          "انتقال الأم والابن للإقامة المؤقتة مع لالة عائشة مواساةً"
        ],
        characters: ["المعلم عبد السلام", "لالة زبيدة", "سيدي محمد", "لالة عائشة"],
        examFocus: "ثيمة الغياب والفراق وتأثيره النفسي على الطفل."
      },
      {
        chapterNum: 10,
        title: "الفصل العاشر: عودة الأب وفرحة العائلة",
        summary: "عودة المعلم عبد السلام سالماً محملاً بالمال والهدايا، استعادة الاستقرار العائلي.",
        keyEvents: [
          "مفاجأة عودة الأب من الموissons بصحة جيدة",
          "فرحة عارمة للالة زبيدة والطفل سيدي محمد",
          "استئناف الحياة العادية وسعادة العودة للبيت الأصلي"
        ],
        characters: ["المعلم عبد السلام", "لالة زبيدة", "سيدي محمد"],
        examFocus: "عودة الاستقرار وانهيار المخاوف."
      },
      {
        chapterNum: 11,
        title: "الفصل الحادي عشر: أخبار زواج مولاي العربي الثاني",
        summary: "مولاي العربي يتزوج فتاة صغيراً ابنة الحداد، صدمة لالة عائشة وانهيارها.",
        keyEvents: [
          "انتشار خبر زواج مولاي العربي من ابنة الحداد الشابة",
          "خيبة أمل لالة عائشة وصدمتها بعد كل التضحيات",
          "وقوف لالة زبيدة سنداً لرفيقتها في محنتها"
        ],
        characters: ["مولاي العربي", "لالة عائشة", "ابنة الحداد"],
        examFocus: "موضوع تعدد الزوجات وتنكّر الرجال للتضحيات النسائية."
      },
      {
        chapterNum: 12,
        title: "الفصل الثاني عشر: النهاية السعيدة والعودة للصندوق السحري",
        summary: "فشل زواج مولاي العربي الثاني وطلاقه، عودة الألفة والاطمئنان، وعودة الطفل إلى صندوقه السحري.",
        keyEvents: [
          "فشل زواج مولاي العربي الجديد وطلاقه السريع",
          "عودة الزوج لبيت لالة عائشة نادماً",
          "استرجاع سيدي محمد لصندوقه السحري واستغراقه في أحلامه الوردية"
        ],
        characters: ["سيدي محمد", "مولاي العربي", "لالة عائشة"],
        examFocus: "نهاية دائرية للرواية (التوازن والعودة للواقع التخيلي)."
      }
    ]
  },
  antigone: {
    bookId: 'antigone',
    title: 'Antigone',
    author: 'Jean Anouilh (1944)',
    genre: 'Tragédie moderne',
    centralNode: {
      id: 'antigone',
      title: 'Antigone',
      subtitle: 'L’héroïne rebelle & absolue',
      emoji: '👸',
      category: 'protagonist',
      description: 'Princesse de Thèbes, fragile d’apparence mais prête à mourir pour ensevelir son frère Polynice.',
      details: [
        'S’oppose frontalement au décret de Créon',
        'Refuse le bonheur bourgeois et lâche',
        'Incarne la liberté, la pureté et le refus du compromis'
      ],
      connections: ['creon', 'haemon', 'ismene', 'polynice', 'prologue']
    },
    nodes: [
      {
        id: 'creon',
        title: 'Créon',
        subtitle: 'Roi de Thèbes & Tyran pragmatique',
        emoji: '👑',
        category: 'antagonist',
        description: 'Oncle d’Antigone, dirigeant qui a accepté le pouvoir par sens du devoir politique.',
        details: [
          'Défend l’ordre, l’État et la raison d’État',
          'Tente par tous les moyens de sauver sa nièce'
        ],
        connections: ['antigone', 'haemon']
      },
      {
        id: 'haemon',
        title: 'Hémon',
        subtitle: 'Fiancé d’Antigone & Fils de Créon',
        emoji: '❤️',
        category: 'secondary',
        description: 'Jeune homme passionné, premier à se dresser contre son père.',
        details: [
          'Se suicide désespéré dans le tombeau aux côtés d’Antigone'
        ],
        connections: ['antigone', 'creon']
      },
      {
        id: 'ismene',
        title: 'Ismène',
        subtitle: 'La sœur raisonnable & soumise',
        emoji: '👥',
        category: 'secondary',
        description: 'Sœur d’Antigone, belle, féminine, amatrice de danse et de fêtes.',
        details: [
          'Refuse d’enterrer Polynice par peur de la mort'
        ],
        connections: ['antigone']
      }
    ],
    chapters: [
      {
        chapterNum: 1,
        title: "المشهد 1-3: Prologue وتقديم الشخصيات",
        summary: "البرولوغ (المقدمة) يكسر الجدار الرابع ويقدم جميع شخصيات المأساة كدمى ستلعب أدوارها المحددة مسبقاً.",
        keyEvents: [
          "تقديم الشخصيات وعلاقاتها المشحونة",
          "التلميح المسبق بنهاية الموت المحتومة"
        ],
        characters: ["المقدمة (Le Prologue)", "جميع الشخصيات"],
        examFocus: "كسر الجدار الرابع وإبراز طابع المأساة الحديثة."
      },
      {
        chapterNum: 2,
        title: "المشهد 4-7: عودة أنتيجون ليلاً واكتشاف السر",
        summary: "أنتيجون تعود بخفية إلى القصر عند الفجر بعد محاولتها الأولى لدفن جثة أخيها Polynice.",
        keyEvents: [
          "المربية تظن أن أنتيجون كانت في موعد غرامي",
          "مواجهة بين أنتيجون وأختها إيسمين حول خطورة العصيان"
        ],
        characters: ["أنتيجون", "إيسمين", "المربية"],
        examFocus: "إبراز الصراع بين الواجب المطلق والخوف البشري المبرر."
      },
      {
        chapterNum: 3,
        title: "المشهد 8-12: مواجهة كريون الكبرى والمساومة",
        summary: "الحراس يقبضون على أنتيجون متلبسة ويحضرونها أمام الملك كريون الذي يحاول إنقاذها سراً.",
        keyEvents: [
          "كريون يشرح لها حقائق السلطة وبؤس الحياة مقابل الموت المجاني",
          "أنتيجون تصر على موقفها وترفض مساومة السعادة البورجوازية البسيطة"
        ],
        characters: ["أنتيجون", "كريون", "الحراس"],
        examFocus: "ذروة الصراع الفكري والفلسفي بين العقلانية السياسية والتضحية المطلقة."
      },
      {
        chapterNum: 4,
        title: "المشهد 13-الخاتمة: الانتحار والمأساة الشاملة",
        summary: "أنتيجون تكتب رسالتها الأخيرة وتُدفن حية، يتبعها انتحار هémon ثم انتحار الملكة Eurydice.",
        keyEvents: [
          "اكتشاف انتحار أنتيجون في المغارة",
          "طعن هémon نفسه أمام أبيه العاجز",
          "انتحار الملكة حزناً على ابنها وبقاء كريون وحيداً"
        ],
        characters: ["أنتيجون", "هémon", "كريون", "الرسول"],
        examFocus: "النهاية التراجيدية الكاملة وانهيار الجبروت السياسي."
      }
    ]
  },
  le_dernier_jour_dun_condamne: {
    bookId: 'le_dernier_jour_dun_condamne',
    title: 'Le Dernier Jour d’un Condamné',
    author: 'Victor Hugo (1829)',
    genre: 'Roman à thèse',
    centralNode: {
      id: 'condamne',
      title: 'Le Condamné (Anonyme)',
      subtitle: 'Victime de la guillotine à Bicêtre',
      emoji: '⛓️',
      category: 'protagonist',
      description: 'Personnage sans nom, intelligent et sensible, consignant ses 6 dernières semaines d’angoisse.',
      details: [
        'Condamné à mort dans les geôles de Bicêtre',
        'Plaidoyer implacable contre la peine de mort'
      ],
      connections: ['petite_fille', 'aumonier', 'geolier', 'forgats']
    },
    nodes: [
      {
        id: 'petite_fille',
        title: 'Marie (La Petite Fille)',
        subtitle: 'Sa fille de 3 ans',
        emoji: '👧',
        category: 'secondary',
        description: 'Innocente, elle ne reconnait plus son père.',
        details: ['Appelle son père "Monsieur"'],
        connections: []
      },
      {
        id: 'aumonier',
        title: 'L’Aumônier & Le Prêtre',
        subtitle: 'L’institution religieuse',
        emoji: '⛪',
        category: 'secondary',
        description: 'Représentants offrant des consolations stéréotypées.',
        details: ['Manquent d’empathie réelle'],
        connections: []
      }
    ],
    chapters: [
      {
        chapterNum: 1,
        title: "الفصول 1-10: السجن في بيسيتر وهواجس الموت",
        summary: "الأسابيع الأولى في سجن Bicêtre، استرجاع محاكمة الرعب، ووصف الجدران المحفورة بأسماء المحكومين السابقين.",
        keyEvents: [
          "تأمل الجدران والزنزانة المظلمة",
          "تذكر الحكم بالموت في قاعة المحكمة الباردة"
        ],
        characters: ["المحكوم", "السجانين"],
        examFocus: "التعذيب النفسي والتأمل في حتمية الموت."
      },
      {
        chapterNum: 2,
        title: "الفصول 11-30: نقل السجين ووداع الابنة ماري",
        summary: "التحضير للنقل إلى Conciergerie، وزيارة ابنته الصغرى ماري التي لم تكن تعرفه.",
        keyEvents: [
          "زيارة الابنة المؤثرة ورفضها التعرف عليه",
          "إدراك مدى قسوة العقوبة على الأبرياء من حوله"
        ],
        characters: ["المحكوم", "الابنة ماري"],
        examFocus: "أثر عقوبة الإعدام على العائلة والأطفال الأبرياء."
      },
      {
        chapterNum: 3,
        title: "الفصول 31-49: الساعات الأخيرة وصعود المقصلة",
        summary: "الساعات الحاسمة، كتابة المذكرات كوصية للإنسانية، والانتقال إلى ساحة دي غريف لتنفيذ الإعدام.",
        keyEvents: [
          "انتظار اللحظة الأخيرة بفارغ الصبر والرعب",
          "الصرخة الأخيرة طلباً للعفو: 'حطوا لي حياتي!'"
        ],
        characters: ["المحكوم", "الجلاد", "الجمهور المحتشد"],
        examFocus: "الذروة الحجاجية للرواية وإدانة همجية الإعدام العلني."
      }
    ]
  }
};

export const MindMapStudio: React.FC<MindMapStudioProps> = ({
  currentBookId,
  onClose,
  onSelectBook
}) => {
  const [selectedBook, setSelectedBook] = useState<BookId>(currentBookId);
  const [activeNodeId, setActiveNodeId] = useState<string>('central');
  const [activeTab, setActiveTab] = useState<'flowchart' | 'timeline' | 'relations' | 'method'>('flowchart');
  const [selectedChapterNum, setSelectedChapterNum] = useState<number>(1);

  const mapData = VISUAL_MIND_MAPS[selectedBook] || VISUAL_MIND_MAPS.la_boite_a_merveilles;
  const centralNode = mapData?.centralNode || {
    id: 'central',
    title: 'المحور',
    subtitle: '',
    emoji: '📖',
    category: 'protagonist',
    description: '',
    details: [],
    connections: []
  };
  
  const nodes = mapData?.nodes || [];
  const chapters = mapData?.chapters || [];

  const activeNode = activeNodeId === 'central' 
    ? centralNode 
    : nodes.find((n) => n.id === activeNodeId) || centralNode;

  const currentChapter = chapters.find((c) => c.chapterNum === selectedChapterNum) || chapters[0] || {
    chapterNum: 1,
    title: 'الفصل الأول',
    summary: '',
    keyEvents: [],
    characters: [],
    examFocus: ''
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-6xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[94vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 text-white shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm text-white flex items-center justify-center shadow-inner text-2xl">
              🧠
            </div>
            <div>
              <h2 className="text-xl font-extrabold flex items-center gap-2">
                الخطاطة البصرية وتطور الأحداث حسب الفصول
                <span className="text-xs bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full font-bold shadow-xs">
                  الجهوي 1 Bac
                </span>
              </h2>
              <p className="text-xs text-indigo-100 font-medium">
                {mapData?.title || ''} · {mapData?.author || ''} · الخريطة التفاعلية والزمنية للرواية
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 rounded-2xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Book Selector & Navigation Tabs */}
        <div className="bg-slate-100 dark:bg-slate-850 px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">
              اختر الرواية:
            </span>
            {(Object.keys(VISUAL_MIND_MAPS) as BookId[]).map((bId) => {
              const bData = VISUAL_MIND_MAPS[bId];
              const isSelected = selectedBook === bId;
              return (
                <button
                  key={bId}
                  onClick={() => {
                    setSelectedBook(bId);
                    onSelectBook(bId);
                    setActiveNodeId('central');
                    setSelectedChapterNum(1);
                  }}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs ${
                    isSelected 
                      ? 'bg-indigo-600 text-white shadow-indigo-500/30 scale-105' 
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span className="text-base">
                    {bId === 'la_boite_a_merveilles' ? '📦' : bId === 'antigone' ? '👑' : '⛓️'}
                  </span>
                  {bData.title}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 flex-wrap">
            <button
              onClick={() => setActiveTab('flowchart')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'flowchart' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              الخطاطة البصرية
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'timeline' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              تطور الأحداث والفصول 📖
            </button>
            <button
              onClick={() => setActiveTab('relations')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'relations' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              شبكة العلاقات
            </button>
            <button
              onClick={() => setActiveTab('method')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'method' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              منهجية الجهوي
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950">
          
          {/* TAB 1: FLOWCHART */}
          {activeTab === 'flowchart' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl relative flex flex-col items-center justify-center min-h-[460px]">
                <div className="absolute top-4 right-4 text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                  اضغط على أي شخصية أو رمز لرؤية تفاصيلها 🔍
                </div>

                <div className="w-full flex justify-center mb-6">
                  <button
                    onClick={() => setActiveNodeId('central')}
                    className={`relative p-5 rounded-3xl transition-all flex flex-col items-center text-center max-w-[280px] group ${
                      activeNodeId === 'central'
                        ? 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-2xl shadow-indigo-500/40 ring-4 ring-indigo-400/50 scale-105'
                        : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-950 dark:text-indigo-200 border-2 border-indigo-300 dark:border-indigo-800 hover:scale-102'
                    }`}
                  >
                    <span className="absolute -top-3 -right-2 text-2xl bg-white dark:bg-slate-800 rounded-full p-1 shadow-md">
                      {centralNode.emoji}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-80 mb-1">
                      المحور الرئيسي (Protagoniste)
                    </span>
                    <h3 className="text-base font-extrabold mb-0.5">
                      {centralNode.title}
                    </h3>
                    <p className="text-xs opacity-90 font-medium">
                      {centralNode.subtitle}
                    </p>
                  </button>
                </div>

                <div className="w-full flex items-center justify-center my-2">
                  <div className="h-8 w-0.5 bg-indigo-300 dark:bg-indigo-700"></div>
                </div>

                <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                  {nodes.map((node) => {
                    const isSelected = activeNodeId === node.id;
                    return (
                      <button
                        key={node.id}
                        onClick={() => setActiveNodeId(node.id)}
                        className={`p-4 rounded-2xl transition-all flex flex-col items-center text-center relative group ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-400 scale-105'
                            : 'bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <span className="text-2xl mb-1.5 p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs group-hover:scale-110 transition-transform">
                          {node.emoji}
                        </span>
                        <h4 className="text-xs font-bold line-clamp-1 mb-0.5">
                          {node.title}
                        </h4>
                        <span className={`text-[10px] line-clamp-1 opacity-75 ${isSelected ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
                          {node.subtitle}
                        </span>
                      </button>
                    );
                  })}
                </div>

              </div>

              <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2.5 bg-indigo-50 dark:bg-indigo-950 rounded-2xl shadow-inner">
                        {activeNode.emoji}
                      </span>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                          {activeNode.category === 'protagonist' ? 'شخصية رئيسية' : activeNode.category === 'antagonist' ? 'شخصية محورية' : activeNode.category === 'theme' ? 'موضوع أساسي' : 'حدث / شخصية ثانوية'}
                        </span>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                          {activeNode.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-3">
                    {activeNode.subtitle}
                  </p>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 mb-5">
                    {activeNode.description}
                  </p>

                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    النقاط الأساسية للامتحان الجهوي:
                  </h4>
                  <ul className="space-y-2.5 mb-6">
                    {(activeNode.details || []).map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-200 bg-indigo-50/40 dark:bg-slate-800/50 p-3 rounded-2xl border border-indigo-100/60 dark:border-slate-800">
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] flex items-center justify-center shrink-0 font-bold">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-2">
                    الروابط والعلاقات في الرواية:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(activeNode.connections || []).map((cId) => {
                      const tgt = cId === centralNode.id ? centralNode : nodes.find((n) => n.id === cId);
                      if (!tgt) return null;
                      return (
                        <button
                          key={cId}
                          onClick={() => setActiveNodeId(tgt.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-xs font-bold text-slate-700 dark:text-slate-300 transition-all flex items-center gap-1.5 shadow-2xs"
                        >
                          <span>{tgt.emoji}</span>
                          {tgt.title}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: CHAPTER TIMELINE & EVENT EVOLUTION */}
          {activeTab === 'timeline' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Chapter Selector List */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    فصول وأجزاء الرواية ({chapters.length})
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">اختر فصلاً</span>
                </div>

                <div className="space-y-2 overflow-y-auto max-h-[480px] pr-1">
                  {chapters.map((ch) => {
                    const isSelected = ch.chapterNum === selectedChapterNum;
                    return (
                      <button
                        key={ch.chapterNum}
                        onClick={() => setSelectedChapterNum(ch.chapterNum)}
                        className={`w-full text-right p-3.5 rounded-2xl transition-all flex items-center justify-between group ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                            : 'bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isSelected ? 'bg-white text-indigo-600 shadow-xs' : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                          }`}>
                            {ch.chapterNum}
                          </span>
                          <div className="text-xs font-bold line-clamp-1">
                            {ch.title}
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-white translate-x-1' : 'text-slate-400'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Detailed Chapter Evolution & Events */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                      {currentChapter.chapterNum}
                    </span>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                        {currentChapter.title}
                      </h3>
                      <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                        تطور الأحداث والمقاطع في الامتحان الجهوي
                      </span>
                    </div>
                  </div>
                  <span className="text-xs bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full font-bold">
                    {mapData?.title}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      ملخص الفصل العام:
                    </h4>
                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                      {currentChapter.summary}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-indigo-600" />
                      تسلسل الأحداث الرئيسية (Événements clés):
                    </h4>
                    <ul className="space-y-2.5">
                      {(currentChapter.keyEvents || []).map((ev, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-200 bg-indigo-50/40 dark:bg-slate-800/50 p-3 rounded-2xl border border-indigo-100/60 dark:border-slate-800">
                          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] flex items-center justify-center shrink-0 font-bold">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{ev}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="bg-indigo-50/60 dark:bg-indigo-950/40 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900">
                      <h5 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        الشخصيات الفاعلة:
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {(currentChapter.characters || []).map((charName, i) => (
                          <span key={i} className="text-[11px] bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-xl font-bold shadow-2xs border border-indigo-200 dark:border-indigo-900">
                            {charName}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-amber-50/60 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200 dark:border-amber-900">
                      <h5 className="text-xs font-bold text-amber-900 dark:text-amber-300 mb-1.5 flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                        نصيحة الامتحان الجهوي:
                      </h5>
                      <p className="text-[11px] text-amber-800 dark:text-amber-200 leading-relaxed">
                        {currentChapter.examFocus}
                      </p>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 3: RELATIONS */}
          {activeTab === 'relations' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  شبكة العلاقات الكاملة - {mapData?.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  دليل العلاقات بين جميع الشخصيات الرئيسية والثانوية لتأطير أي مقطع في الامتحان الجهوي.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[centralNode, ...nodes].map((node) => (
                  <div key={node.id} className="bg-slate-50 dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{node.emoji}</span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                          {node.title}
                        </h4>
                      </div>
                      <span className="text-[10px] px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold">
                        {node.subtitle}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {node.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: METHOD */}
          {activeTab === 'method' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  المنهجية الذهبية للتعامل مع نصوص الامتحان الجهوي
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  خطوات عملية لضمان الحصول على نقطة ممتازة في سؤال "وضع المقطع" (Situation du passage).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 space-y-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                    1
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    تحديد وضعية المقطع
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    ابدأ بذكر اسم المؤلف والعنوان ورقم الفصل، ثم اربط الحدث بما يسبقه وما يليه مستعيناً بالخطاطة البصرية.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 space-y-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                    2
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    ضبط الشخصيات والأدوار
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    استخدم أسماء الشخصيات بدقة وصفاتها الرئيسية التي تعلمتها من الخريطة وشبكة الفصول.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 space-y-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                    3
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    التركيز على المضامين
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    لخص الأفكار بأسلوبك الخاص مع تفادي الأخطاء الإملائية والتركيز على الروابط المنطقية للأحداث.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-100 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            منصة مراجعة الأولى باكالوريا بالمغرب · الخطاطة البصرية وتطور الأحداث حسب الفصول
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-lg shadow-indigo-500/30"
          >
            إغلاق العودة للقراءة
          </button>
        </div>

      </div>
    </div>
  );
};
