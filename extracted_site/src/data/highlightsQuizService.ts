import { BookId, TextHighlight } from '../types';
import { cleanDirectArabicTranslation } from './translationCache';
import { generateInstantTranslation } from './translationsDict';

export interface HighlightQuizItem {
  id: string;
  highlightId: string;
  bookId: BookId;
  pageNumber: number;
  highlightedText: string;
  userNote?: string;
  colorId: string;
  // Quiz question
  questionFrench: string;
  questionArabic: string;
  category: 'meaning' | 'style' | 'context' | 'grammar';
  categoryLabelArabic: string;
  options: string[];
  correctIndex: number;
  explanationArabic: string;
  explanationFrench: string;
  contextualTranslation: string;
  synonyms: string[];
  contextualExplanation: string;
}

// Preset intelligent figure of style and thematic rules to detect in highlighted excerpts
interface ExcerptRule {
  keywords: string[];
  meaningAr: string;
  figureOfStyle?: string;
  figureExplanationFr?: string;
  figureExplanationAr?: string;
  themeAr: string;
  themeFr: string;
}

const EXCERPT_RULES: ExcerptRule[] = [
  {
    keywords: ['solitude', 'seul', 'isolement'],
    meaningAr: 'الشعور بالعزلة والوحدة الوجودية التي رافقت الراوي منذ طفولته المبكرة',
    figureOfStyle: 'Litote / Thème de la solitude',
    figureExplanationFr: "Ce passage illustre le sentiment d'isolement et la solitude du narrateur enfant.",
    figureExplanationAr: "يعبر هذا المقطع عن عزلة الراوي وانطوائه في عالمه الخيالي الخاص.",
    themeAr: 'عزلة الطفولة والعالم الباطني',
    themeFr: "La solitude de l'enfance"
  },
  {
    keywords: ['boîte à merveilles', 'merveilles', 'bijoux', 'boutons', 'verre'],
    meaningAr: 'علبة العجائب كملاذ رمزي للأشياء الجامدة التي تكتسب حياة وسحراً في مخيلة الطفل',
    figureOfStyle: 'Personnification & Métaphore',
    figureExplanationFr: "Les objets inanimés sont personnifiés et deviennent les amis intimes du petit garçon.",
    figureExplanationAr: "تشخيص الأشياء الجامدة (الأزرار والخرز) وتحويلها إلى أصدقاء كائنات حية في خيال سيدي محمد.",
    themeAr: 'سحر الطفولة وعالم الخيال',
    themeFr: "L'imaginaire enfantin et la boîte"
  },
  {
    keywords: ['msid', 'fqih', 'baguette', 'sourate', 'coran'],
    meaningAr: 'أجواء المسيد الصارمة وسلطة الفقيه وهيبة حفظ القرآن وعصا السفرجل',
    figureOfStyle: 'Métonymie (la baguette = l’autorité)',
    figureExplanationFr: "La baguette de cognassier représente métonymiquement la discipline et l'autorité redoutée du maître.",
    figureExplanationAr: "مجاز مرسل: عصا السفرجل ترمز إلى سلطة الفقيه ورهبة التعليم التقليدي في نفوس الصغار.",
    themeAr: 'التعليم العتيق والمسيد',
    themeFr: "L'école coranique (Le Msid)"
  },
  {
    keywords: ['bain maure', 'bain', 'vapeur', 'supplice', 'enfer'],
    meaningAr: 'المعاناة النفسية والجسدية لسيدي محمد في الحمام الشعبي وتشبيهه بالجحيم',
    figureOfStyle: 'Hyperbole & Comparaison',
    figureExplanationFr: "L'exagération et les images sombres assimilent le bain maure à un enfer pour l'enfant.",
    figureExplanationAr: "مبالغة وتشبيه بلاغي: تصوير الحمام الشعبي كفضاء جهنمي مليء بالشياطين والبخار الخانق.",
    themeAr: 'التقاليد والطقوس الشعبية',
    themeFr: "Les rituels et traditions"
  },
  {
    keywords: ['condamné à mort', 'échafaud', 'guillotine', 'bicêtre', 'bourreau'],
    meaningAr: 'العذاب النفسي الشديد لفكرة الإعدام والمرافعة الإنسانية ضد المقصلة',
    figureOfStyle: 'Personnification de l’idée fixe',
    figureExplanationFr: "L'idée de la mort est personnifiée comme un bourreau intérieur qui torture l'esprit du condamné.",
    figureExplanationAr: "تشخيص واستعارة: فكرة الموت تجثم كشبح ثقيل يعذب السجين دون انقطاع.",
    themeAr: 'مناهضة عقوبة الإعدام والعذاب النفسي',
    themeFr: "Le plaidoyer contre la peine de mort"
  },
  {
    keywords: ['antigone', 'créon', 'non', 'polynice', 'enterrer'],
    meaningAr: 'رفض الحلول الوسطى والتمسك بالواجب الأخلاقي ودفن الأخ رغم مرسوم الملك',
    figureOfStyle: 'Anaphore & Antithèse tragique',
    figureExplanationFr: "L'opposition farouche entre l'idéalisme intransigeant d'Antigone et le réalisme politique de Créon.",
    figureExplanationAr: "تضاد تراجيدي: التمسك بالحرية والواجب الفطري وقول 'لا' أمام براغماتية السلطة الملكية.",
    themeAr: 'التمرد والواجب والحرية التراجيدية',
    themeFr: "Le refus du compromis et la révolte"
  }
];

export function generateHighlightQuizQuestions(
  highlights: TextHighlight[],
  bookInfo: { id: BookId; titleFrench: string; titleArabic: string }
): HighlightQuizItem[] {
  if (!highlights || highlights.length === 0) return [];

  return highlights.map((h, idx) => {
    const textLower = h.text.toLowerCase();
    const matchedRule = EXCERPT_RULES.find((r) =>
      r.keywords.some((kw) => textLower.includes(kw))
    );

    // Dynamic translation estimation
    const instantTrans = generateInstantTranslation(h.text, '', h.pageNumber);
    const cleanAr = cleanDirectArabicTranslation(instantTrans.arabicTranslation);

    // Alternate distractors
    const words = h.text.trim().split(/\s+/).length;

    const contextualTrans = cleanAr || matchedRule?.meaningAr || `معنى سياقي في الصفحة ${h.pageNumber}`;
    const excerptSynonyms = matchedRule 
      ? ['expression narrative', 'énoncé thématique', 'passage clé', 'figure stylistique']
      : ['terme littéraire', 'formulation explicative', 'énoncé contextuel'];
    const contextualExp = matchedRule?.figureExplanationAr || matchedRule?.meaningAr || `يمثل هذا المقطع جزءاً محورياً من أحداث صفحة ${h.pageNumber}.`;
    const expFr = matchedRule?.figureExplanationFr || `La signification contextuelle et littéraire de l'extrait (Page ${h.pageNumber}).`;

    if (matchedRule && matchedRule.figureOfStyle) {
      // Question Type 1: Stylistic & Literary Comprehension
      const options = [
        matchedRule.figureOfStyle,
        'Une litote sans valeur expressive',
        'Une antiphrase comique',
        'Un euphémisme atténuateur'
      ];
      // Randomize options order
      const correctOption = matchedRule.figureOfStyle;
      const shuffled = [...options].sort(() => 0.5 - Math.random());
      const correctIdx = shuffled.indexOf(correctOption);

      return {
        id: `hq-${h.id}-${idx}`,
        highlightId: h.id,
        bookId: bookInfo.id,
        pageNumber: h.pageNumber,
        highlightedText: h.text,
        userNote: h.note,
        colorId: h.colorId,
        questionFrench: `Quelle est la figure de style ou la portée littéraire dominante dans cet extrait surligné (Page ${h.pageNumber}) ?`,
        questionArabic: `ما هو المحسن البديعي أو البعد الأدبي المهيمن في هذه العبارة المظللة (الصفحة ${h.pageNumber})؟`,
        category: 'style',
        categoryLabelArabic: 'التحليل البلاغي والمحسنات',
        options: shuffled,
        correctIndex: correctIdx !== -1 ? correctIdx : 0,
        explanationArabic: matchedRule.figureExplanationAr || `تعبر هذه العبارة المظللة عن: ${matchedRule.meaningAr}.`,
        explanationFrench: expFr,
        contextualTranslation: contextualTrans,
        synonyms: excerptSynonyms,
        contextualExplanation: contextualExp
      };
    }

    // Question Type 2: Meaning & Context
    const correctMeaning = cleanAr || `المعنى الدقيق المرتبط بسياق الصفحة ${h.pageNumber}`;
    const distractor1 = 'وصف مشهد طبيعي خارجي لا علاقة له بأحداث الرواية';
    const distractor2 = 'حوار هزلي بين شخصيات ثانوية عابرة';
    const distractor3 = 'نقد تاريخي لعادات القرن التاسع عشر';

    const meaningOptions = [correctMeaning, distractor1, distractor2, distractor3];
    const shuffledMeaning = [...meaningOptions].sort(() => 0.5 - Math.random());
    const correctMeaningIdx = shuffledMeaning.indexOf(correctMeaning);

    return {
      id: `hq-${h.id}-${idx}`,
      highlightId: h.id,
      bookId: bookInfo.id,
      pageNumber: h.pageNumber,
      highlightedText: h.text,
      userNote: h.note,
      colorId: h.colorId,
      questionFrench: `Quel est le sens exact et la signification de cette phrase surlignée (Page ${h.pageNumber}) ?`,
      questionArabic: `ما هو المعنى الدقيق والدلالة المعجمية لهذه الجملة المظللة (الصفحة ${h.pageNumber})؟`,
      category: 'meaning',
      categoryLabelArabic: 'الفهم والمعنى الدقيق',
      options: shuffledMeaning,
      correctIndex: correctMeaningIdx !== -1 ? correctMeaningIdx : 0,
      explanationArabic: `المعنى الفصيح للجملة المظللة: «${cleanAr}» (الصفحة ${h.pageNumber} من مؤلف ${bookInfo.titleArabic}).`,
      explanationFrench: `La traduction et le sens contextuel sont : « ${cleanAr} » (Extrait de ${bookInfo.titleFrench}).`,
      contextualTranslation: contextualTrans,
      synonyms: excerptSynonyms,
      contextualExplanation: contextualExp
    };
  });
}
