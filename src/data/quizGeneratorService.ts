import { BookId, NovelPage, QuizCategoryFilter, QuizQuestion, QuizRequest } from '../types';
import { getPage, getBookInfo } from './bookService';

// Known literary devices and figures of style per book chapters & classic quotes
interface PageFigureRule {
  keywords: string[];
  quote: string;
  figure: string;
  explanationFr: string;
  explanationAr: string;
  distractors: string[];
}

const FIGURE_RULES_MAP: Record<string, PageFigureRule[]> = {
  la_boite_a_merveilles: [
    {
      keywords: ['solitude', 'date pas d’hier', 'ne date pas'],
      quote: "Ma solitude ne date pas d'hier.",
      figure: "Une litote",
      explanationFr: "C'est une litote qui atténue l'expression pour faire entendre que cette solitude est très ancienne et permanente.",
      explanationAr: "أسلوب إقلال (Litote): التعبير بالنفي للإيحاء بأن عزلته متجذرة وقديمة جداً منذ بواكير طفولته الأولى.",
      distractors: ['Une métaphore', 'Une hyperbole', 'Une antiphrase'],
    },
    {
      keywords: ['volaient', 'moineaux', 'piège'],
      quote: "Les moineaux... venaient picorer les grains puis s'envolaient.",
      figure: "Une description imagée à valeur symbolique",
      explanationFr: "L'image du moineau captif reflète métaphoriquement l'isolement du petit enfant.",
      explanationAr: "صورة رمزية تعكس شعور الطفل بالعزلة ومقارنته للعصافير الطليقة بحالته النفسية.",
      distractors: ['Une anaphore', 'Un oxymore', 'Une gradation'],
    },
    {
      keywords: ['dar chouafa', 'chouafa', 'kenza', 'voyante', 'démons'],
      quote: "Les démons et les génies de la nuit... dans la pénombre de Dar Chouafa.",
      figure: "Une personnification et métaphore mystique",
      explanationFr: "Le narrateur personnifie les rituels et utilise un lexique surnaturel pour décrire l'atmosphère mystique.",
      explanationAr: "تشخيص واستعارة لغوية تجسد الطقوس الروحية وتضفي هالة من الغموض الشعبي الفاسي.",
      distractors: ['Une comparaison', 'Une litote', 'Une antiphrase'],
    },
    {
      keywords: ['bagarre', 'injures', 'hurlements', 'rahma', 'zoubida'],
      quote: "Des flots d'injures jaillissaient de leurs bouches comme un torrent.",
      figure: "Une comparaison et hyperbole",
      explanationFr: "L'utilisation de 'comme' marque la comparaison, amplifiée par l'hyperbole pour traduire la violence verbale.",
      explanationAr: "تشبيه صريح ومبالغة (Hyperbole & Comparaison) لتجسيد حدة الصراخ والشتائم المتبادلة في شجار الغسيل.",
      distractors: ['Un oxymore', 'Une litote', 'Une métonymie'],
    },
    {
      keywords: ['boîte à merveilles', 'bijoux', 'verre', 'boutons'],
      quote: "Ma Boîte à Merveilles contenait des objets hétéroclites qui me parlaient.",
      figure: "Une personnification",
      explanationFr: "Attribuer la parole à des objets inanimés (boutons, perles) constitue une personnification poétique.",
      explanationAr: "تشخيص (Personnification): إضفاء صفة الكلام والحياة على الأشياء الجامدة (الأزرار والخرز) في مخيلة الطفل.",
      distractors: ['Une litote', 'Une anaphore', 'Un pléonasme'],
    },
    {
      keywords: ['yeux', 'fqih', 'baguette', 'sommeil', 'msid'],
      quote: "Le Fqih sommeillait, sa baguette de cognassier prête à s'abattre.",
      figure: "Une métonymie (la baguette pour l'autorité)",
      explanationFr: "La baguette de cognassier désigne par métonymie l'autorité sévère et la discipline du maître d'école.",
      explanationAr: "مجاز مرسل (Métonymie): عصا السفرجل تمثل سلطة الفقيه الصارمة ورهبة المسيد في نفوس الصغار.",
      distractors: ['Une hyperbole', 'Une antiphrase', 'Une anaphore'],
    },
  ],
  antigone: [
    {
      keywords: ['prologue', 'antigone', 'maigre', 'noire', 'isole'],
      quote: "Antigone, c'est la petite maigre qui est assise là-bas et qui ne dit rien.",
      figure: "Une antithèse implicite et portrait tragique",
      explanationFr: "Le contraste physique et moral entre Antigone (maigre, sombre) et Ismène (blonde, éblouissante).",
      explanationAr: "تقابل وتناقض (Antithèse): يبرز التناقض بين هيئة أنتيجون النحيفة الصامتة وجمال أختها إسمين الفاتن.",
      distractors: ['Une hyperbole', 'Une gradation ascendante', 'Une métaphore filée'],
    },
    {
      keywords: ['sale espoir', 'drame', 'tragédie', 'propre'],
      quote: "La tragédie, c'est propre. C'est reposant, parce qu'on sait qu'il n'y a plus d'espoir.",
      figure: "Une antithèse et oxymore moral",
      explanationFr: "Le Chœur oppose la propreté inéluctable de la tragédie au 'sale espoir' désordonné du drame.",
      explanationAr: "تضاد (Antithèse): الموازنة الفلسفية بين نقاء التراجيديا الحتمية وبشاعة الأمل المبتذل في الدراما.",
      distractors: ['Une comparaison', 'Une litote', 'Une anaphore'],
    },
    {
      keywords: ['dire non', 'créon', 'roi', 'cuisinier'],
      quote: "Moi, je peux dire non encore à tout ce que je n'aime pas !",
      figure: "Une anaphore et affirmation péremptoire",
      explanationFr: "La répétition et l'insistance marquent le refus catégorique et la pureté intraitable d'Antigone.",
      explanationAr: "توكيد ورفض قاطع يجسد تمسك أنتيجون بالحرية المطلقة وقول كلمة 'لا' أمام سلطة كريون.",
      distractors: ['Une litote', 'Une antiphrase', 'Une métonymie'],
    },
    {
      keywords: ['jardin', 'rosée', 'nourrice', 'matin'],
      quote: "Le jardin dormait encore... C'était beau, tout était gris.",
      figure: "Une personnification du jardin",
      explanationFr: "Le verbe 'dormait' personnifie le jardin dans la fraîcheur de l'aube.",
      explanationAr: "تشخيص (Personnification): إسناد فعل النوم إلى الحديقة في سكون الصباح الباكر.",
      distractors: ['Une hyperbole', 'Une litote', 'Un oxymore'],
    },
  ],
  le_dernier_jour_dun_condamne: [
    {
      keywords: ['condamné à mort', 'idée', 'glace', 'plomb'],
      quote: "Cette idée est là, toujours avec moi, comme un spectre de plomb.",
      figure: "Une comparaison et personnification de l'idée fixe",
      explanationFr: "L'emploi de 'comme' introduit la comparaison qui matérialise l'angoisse sous la forme d'un spectre écrasant.",
      explanationAr: "تشبيه صريح (Comparaison): تشبيه فكرة الإعدام القاتمة بشبح رصاصي ثقيل لا يفارقه أبداً.",
      distractors: ['Une antiphrase', 'Une litote', 'Un euphémisme'],
    },
    {
      keywords: ['bave', 'limace', 'rose', 'chanson'],
      quote: "C'était comme la bave d'une limace sur une rose.",
      figure: "Une métaphore et antithèse saisissante",
      explanationFr: "Antithèse violente entre la délicatesse pure de la fillette (la rose) et l'ignominie de l'argot (la limace).",
      explanationAr: "استعارة وتضاد بليغ (Métaphore & Antithèse) بين براءة الفتاة وعذوبة صوتها وقذارة كلمات الأرغو.",
      distractors: ['Une litote', 'Une anaphore', 'Une gradation'],
    },
    {
      keywords: ['cellule', 'mur', 'morts', 'bicêtre'],
      quote: "Ces murs suent le crime et le désespoir.",
      figure: "Une personnification et métaphore",
      explanationFr: "Les murs de la prison sont personnifiés comme un corps qui exsude le désespoir et la mort.",
      explanationAr: "تشخيص واستعارة (Personnification): تصوير جدران زنزانة بيسيتر كجسد يتصبب عرقاً من الجريمة واليأس.",
      distractors: ['Une litote', 'Une antiphrase', 'Une comparaison'],
    },
  ],
};

// Helper to shuffle question options and update correctIndex so answer is randomly placed (A, B, C, or D)
export function shuffleQuestionOptions(q: QuizQuestion): QuizQuestion {
  if (!q.options || q.options.length <= 1) return q;

  const originalCorrectAnswer = q.options[q.correctIndex] ?? q.options[0];
  
  // Clone options
  const shuffled = [...q.options];
  
  // Fisher-Yates shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }

  const newCorrectIndex = shuffled.indexOf(originalCorrectAnswer);

  return {
    ...q,
    options: shuffled,
    correctIndex: newCorrectIndex !== -1 ? newCorrectIndex : 0,
  };
}

// Realistic regional exam distractors pool per novel
const REALISTIC_DISTRACTORS = {
  la_boite_a_merveilles: {
    interlocutors: [
      "Entre Sidi Mohammed et sa mère Lalla Zoubida à la maison",
      "Entre Lalla Zoubida et sa voisine Rahma lors des tâches quotidiennes",
      "Entre Lalla Zoubida et son amie Lalla Aïcha lors de leurs confidences",
      "Entre Maâlem Abdeslam et son apprenti Driss le teigneux à l'atelier",
      "Entre le jeune narrateur et les élèves sous la surveillance du Fqih au Msid",
      "Entre Lalla Zoubida et Fatma Bziouya au sujet des affaires de la maison",
    ],
    causes: [
      "Pour accompagner Lalla Zoubida lors de la visite pieuse au sanctuaire de Sidi Ali Boughaleb",
      "Parce que le narrateur cherche refuge dans le monde imaginaire de sa Boîte à Merveilles",
      "En réaction à la dispute violente survenue entre les deux voisines sur la terrasse",
      "Pour préparer activement les festivités et illuminations de la fête de l'Achoura",
      "Suite à la ruine financière de Maâlem Abdeslam après la perte de son capital aux souks",
      "Pour consulter le voyant aveugle Si El Arafi et chercher des paroles réconfortantes",
    ],
    situations: [
      "Au début de l'œuvre, lors de l'évocation de la solitude d'enfance et des habitants de Dar Chouafa",
      "Au lendemain de la dispute mouvementée pour la lessive entre Lalla Zoubida et Rahma",
      "Pendant les préparatifs du nettoyage et de la rénovation du Msid pour l'Achoura",
      "Après le départ forcé du père parti travailler aux moissons pour rembourser ses dettes",
      "Au dénouement de l'histoire, lors du retour du père et de la réouverture de la Boîte à Merveilles",
    ],
    themes: [
      "Un registre réaliste et lyrique marqué par la nostalgie de l'enfance et la solitude",
      "Un registre pathétique exprimant la souffrance et la précarité de la famille",
      "Un registre tragique fondé sur la fatalité et le conflit de pouvoir",
      "Un registre polémique contestant directement les institutions judiciaires",
    ],
  },
  antigone: {
    interlocutors: [
      "Entre Antigone et sa sœur Ismène au petit matin",
      "Entre Antigone et sa vieille nourrice au retour du jardin",
      "Entre Antigone et son fiancé Hémon lors de leurs adieux voilés",
      "Entre le roi Créon et Antigone lors du grand face-à-face tragique",
      "Entre Créon et les gardes après l'arrestation d'Antigone",
      "Entre Créon et le Chœur représentant la voix de Thèbes",
    ],
    causes: [
      "Par devoir fraternel et piété sacrée pour offrir une sépulture décente à son frère Polynice",
      "Pour affirmer son refus catégorique des compromis et de la fausse félicité terrestre",
      "Parce que Créon doit faire respecter la loi de Thèbes et l'autorité souveraine de l'État",
      "Par peur du châtiment public et par attachement au bonheur selon la position d'Ismène",
      "Pour tenter de sauver Antigone en étouffant l'affaire avant qu'elle ne s'ébruite",
    ],
    situations: [
      "À l'aube, au retour d'Antigone de sa première tentative nocturne d'ensevelissement",
      "Après l'arrestation d'Antigone prise en flagrant délit près du cadavre de Polynice",
      "Au cœur de la confrontation décisive entre l'idéal d'Antigone et la raison d'État de Créon",
      "Dans la cellule où Antigone attend son exécution et dicte sa lettre au garde",
      "Au dénouement tragique, après l'annonce des suicides successifs d'Antigone, Hémon et Eurydice",
    ],
    themes: [
      "Un registre tragique où s'affrontent la fatalité du destin et le refus de tout compromis",
      "Un registre pathétique traduisant la douleur des amants condamnés à la séparation",
      "Un registre réaliste et documentaire décrivant la vie quotidienne d'une cité",
      "Un registre satirique et comique tournant en dérision la noblesse du pouvoir",
    ],
  },
  le_dernier_jour_dun_condamne: {
    interlocutors: [
      "Dans le monologue intérieur du condamné conversant avec sa propre angoisse",
      "Entre le condamné et l'avocat lors de la proclamation du verdict au tribunal",
      "Entre le condamné et le prêtre venu lui apporter les secours de la religion",
      "Entre le condamné et le geôlier de Bicêtre lors des formalités d'écrou",
      "Entre le condamné et sa petite fille Marie lors de leur dernière visite",
      "Entre le narrateur et l'autre condamné (le friauche) qui lui parle en argot",
    ],
    causes: [
      "Pour exprimer son angoisse et rédiger un plaidoyer humaniste contre la peine de mort",
      "Parce que sa fille Marie ne le reconnaît plus et le prend pour un étranger",
      "En réaction au spectacle dégradant et cruel du ferrage des forçats dans la cour",
      "Dans l'espoir désespéré d'obtenir un recours en grâce avant l'heure fatale",
      "Parce que la société condamne l'homme sans chercher à comprendre son humanité",
    ],
    situations: [
      "Pendant les premières semaines d'enfermement à Bicêtre, obsédé par l'idée fixe du supplice",
      "Le matin du transfert du condamné de la prison de Bicêtre à la Conciergerie de Paris",
      "Dans la cellule de l'Hôtel de Ville pendant la toilette funèbre faite par les bourreaux",
      "Dans les ultimes minutes précédant l'embarquement pour la place de Grève à quatre heures",
      "Au moment où le narrateur entend les clameurs de la foule avide de spectacle",
    ],
    themes: [
      "Un registre pathétique et polémique dénonçant la barbarie de l'échafaud",
      "Un registre tragique soulignant l'impossibilité d'échapper au compte à rebours de la mort",
      "Un registre lyrique et mélancolique évoquant les souvenirs heureux de jeunesse",
      "Un registre épique célébrant les victoires héroïques de la justice moderne",
    ],
  },
};

// Generate strictly page-grounded questions dynamically from page content
export function generateLocalPageGroundedQuestions(
  page: NovelPage,
  bookId: BookId,
  categoryFilter: QuizCategoryFilter = 'ALL',
  count: number = 4,
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' = 'MEDIUM'
): QuizQuestion[] {
  const pageNumber = page.pageNumber;
  const rawText = page.text || '';
  const textLower = rawText.toLowerCase();
  const paragraphs = rawText
    .split('\n\n')
    .map((p) => p.trim())
    .filter((p) => p.length > 20 && !p.startsWith('[Page'));

  const questions: QuizQuestion[] = [];
  const bookRules = FIGURE_RULES_MAP[bookId] || FIGURE_RULES_MAP.la_boite_a_merveilles;
  const distractorsBank = REALISTIC_DISTRACTORS[bookId] || REALISTIC_DISTRACTORS.la_boite_a_merveilles;

  const characters = page.mainCharacters && page.mainCharacters.length > 0 ? page.mainCharacters : ['الشخصيات الرئيسية'];
  const primaryChar = characters[0] || 'Le narrateur';
  const secondaryChar = characters[1] || 'Son entourage';

  // 1. Causes & Motivations Question ("علاش دار هاد الفعل؟ / Pourquoi ?")
  if (
    categoryFilter === 'ALL' ||
    categoryFilter === 'EVENTS' ||
    categoryFilter === 'EVENTS_CAUSES'
  ) {
    if (page.keyEventsArabic && page.keyEventsArabic.length > 0) {
      const primaryEvent = page.keyEventsArabic[0];
      const correctCause = primaryEvent.length > 95 ? primaryEvent.substring(0, 95) + '...' : primaryEvent;
      
      // Select 3 plausible distractors from the bank that don't match the correct cause
      const plausibleDistractors = distractorsBank.causes
        .filter((c) => !c.toLowerCase().includes(primaryChar.toLowerCase()))
        .slice(0, 3);

      const causeQ: QuizQuestion = {
        id: `local-cause-${pageNumber}-${Date.now()}-${Math.random()}`,
        pageNumber,
        questionFrench: `Dans cet extrait (Page ${pageNumber}), pour quelle raison précise le personnage réagit-il ainsi face aux événements ?`,
        questionArabic: `في هذا المقطع (ص ${pageNumber})، ما هو الدافع والسبب المباشر (Pourquoi) وراء تصرف وموقف الشخصية؟`,
        options: [
          `En raison du fait marquant : ${correctCause}`,
          plausibleDistractors[0] || distractorsBank.causes[0],
          plausibleDistractors[1] || distractorsBank.causes[1],
          plausibleDistractors[2] || distractorsBank.causes[2],
        ],
        correctIndex: 0,
        explanationFrench: `D'après le texte de la page ${pageNumber}, la cause exacte de cette réaction est : ${correctCause}.`,
        explanationArabic: `السبب والدافع المباشر كما ورد في الصفحة ${pageNumber}: «${correctCause}»، وهو ما يعلل التصرف في سياق الرواية.`,
        category: 'Causes & Motivations',
        difficulty,
        quoteExcerpt: paragraphs[0] ? paragraphs[0].substring(0, 110) + '...' : undefined,
        targetConcept: 'الأسباب والدوافع النفسية والسردية (Causes & Motivations)',
        reasoningBreakdown: {
          whyCorrectArabic: `هذا الخيار يمثل التعليل الحقيقي المستمد من معطيات الصفحة ${pageNumber}.`,
          whyIncorrectArabic: 'الخيارات الأخرى تشير إلى وقائع ودوافع في فصول ومواقف أخرى من الرواية.',
        },
      };

      questions.push(shuffleQuestionOptions(causeQ));
    }
  }

  // 2. Interlocutors & Dialogues ("مع من كان كايدوي؟ / Qui parle à qui ?")
  if (
    categoryFilter === 'ALL' ||
    categoryFilter === 'EVENTS' ||
    categoryFilter === 'EVENTS_DIALOGUE'
  ) {
    const dialogQuote = paragraphs.find((p) => p.includes('—') || p.includes('«') || p.includes('"')) || paragraphs[0];
    const snippetQuote = dialogQuote ? dialogQuote.substring(0, 95) : `Passage de dialogue (Page ${pageNumber})`;

    const correctInterlocutor = `Entre ${primaryChar} et ${secondaryChar} dans le cadre de cette scène`;
    const plausibleDistractors = distractorsBank.interlocutors
      .filter((inter) => !inter.includes(primaryChar) || !inter.includes(secondaryChar))
      .slice(0, 3);

    const dialogQ: QuizQuestion = {
      id: `local-dialogue-${pageNumber}-${Date.now()}-${Math.random()}`,
      pageNumber,
      questionFrench: `Dans le contexte de cette page, entre qui se déroule principalement l'échange (ou à qui s'adresse le discours) ?`,
      questionArabic: `في سياق أحداث هذه الصفحة، بين من يدور الحوار أو إلى من يوجه المتحدث خطابه (Qui parle à qui)؟`,
      options: [
        correctInterlocutor,
        plausibleDistractors[0] || distractorsBank.interlocutors[0],
        plausibleDistractors[1] || distractorsBank.interlocutors[1],
        plausibleDistractors[2] || distractorsBank.interlocutors[2],
      ],
      correctIndex: 0,
      explanationFrench: `La scène met en relation directe ${primaryChar} et ${secondaryChar} conformément au texte de la page ${pageNumber}.`,
      explanationArabic: `التفاعل الحواري والسردي يدور في هذه الصفحة بين (${primaryChar}) و(${secondaryChar}).`,
      category: 'Dialogues & Interlocuteurs',
      difficulty,
      quoteExcerpt: snippetQuote,
      targetConcept: 'تحديد أطراف الحوار والمتحدث والمخاطب (Situation d\'énonciation)',
    };

    questions.push(shuffleQuestionOptions(dialogQ));
  }

  // 3. Chronology & Situation du passage ("إمتى طرا هاد الحدث؟ / Situation du passage")
  if (
    categoryFilter === 'ALL' ||
    categoryFilter === 'EVENTS' ||
    categoryFilter === 'EVENTS_CHRONO'
  ) {
    const chTitle = page.chapterTitle || `Chapitre de la page ${pageNumber}`;
    const correctSituation = `Dans le cadre de : ${chTitle} (${page.arabicSummary ? page.arabicSummary.substring(0, 75) + '...' : 'أحداث هذا المقطع'})`;
    
    const plausibleSituations = distractorsBank.situations.slice(0, 3);

    const chronoQ: QuizQuestion = {
      id: `local-chrono-${pageNumber}-${Date.now()}-${Math.random()}`,
      pageNumber,
      questionFrench: `À quel moment ou étape de l'œuvre se situe précisément l'événement relaté dans cette page (${pageNumber}) ?`,
      questionArabic: `في أي سياق زمني أو مرحلة من تسلسل الأحداث يقع ما جاء في هذه الصفحة (Situation du passage)؟`,
      options: [
        correctSituation,
        plausibleSituations[0] || distractorsBank.situations[0],
        plausibleSituations[1] || distractorsBank.situations[1],
        plausibleSituations[2] || distractorsBank.situations[2],
      ],
      correctIndex: 0,
      explanationFrench: `Cet extrait se situe exactement dans l'étape de : ${chTitle}.`,
      explanationArabic: `يتموقع المقطع زمنياً وسردياً ضمن: ${chTitle}، وهو السياق المعتمد في أسئلة الامتحان الجهوي.`,
      category: 'Chronologie & Contexte',
      difficulty,
      targetConcept: 'تأطير المقطع والسياق الزمني (Situation du passage)',
    };

    questions.push(shuffleQuestionOptions(chronoQ));
  }

  // 4. Figures de style
  const matchedRule = bookRules.find((rule) =>
    rule.keywords.some((kw) => textLower.includes(kw.toLowerCase()))
  );

  if (
    (categoryFilter === 'ALL' || categoryFilter === 'FIGURES_DE_STYLE') &&
    matchedRule
  ) {
    const figQ: QuizQuestion = {
      id: `local-fig-${pageNumber}-${Date.now()}-${Math.random()}`,
      pageNumber,
      questionFrench: `Quelle figure de style reconnaît-on dans l'énoncé suivant extrait du texte : « ${matchedRule.quote} » ?`,
      questionArabic: `ما هو المحسن البديعي (Figure de style) الموظف في عبارة: « ${matchedRule.quote} »؟`,
      options: [
        matchedRule.figure,
        matchedRule.distractors[0] || 'Une anaphore',
        matchedRule.distractors[1] || 'Une antithèse',
        matchedRule.distractors[2] || 'Une métaphore',
      ],
      correctIndex: 0,
      explanationFrench: matchedRule.explanationFr,
      explanationArabic: matchedRule.explanationAr,
      category: 'Figures de style',
      difficulty,
      quoteExcerpt: matchedRule.quote,
      targetConcept: `Figure de style: ${matchedRule.figure}`,
      reasoningBreakdown: {
        whyCorrectArabic: `الخيار الصحيح هو (${matchedRule.figure}) نظراً للتركيب البلاغي للجملة والدلالة التي يقصدها الكاتب.`,
        whyIncorrectArabic: 'الخيارات الأخرى تمثل أساليب بلاغية مختلفة لم ترد في هذه العبارة.',
      },
    };

    questions.push(shuffleQuestionOptions(figQ));
  }

  // 5. Comprehension & Literary Register (Tonalité)
  if (categoryFilter === 'ALL' || categoryFilter === 'COMPREHENSION' || categoryFilter === 'CHARACTERS_THEMES') {
    const themeOptions = [...distractorsBank.themes];
    const correctTheme = themeOptions[0];

    const regQ: QuizQuestion = {
      id: `local-reg-${pageNumber}-${Date.now()}-${Math.random()}`,
      pageNumber,
      questionFrench: `Quelle tonalité (registre littéraire) domine principalement ce passage de la page ${pageNumber} ?`,
      questionArabic: `ما هو السجل الأدبي أو النبرة (Tonalité / Registre) المهيمنة على هذا المقطع في الصفحة ${pageNumber}؟`,
      options: themeOptions,
      correctIndex: 0,
      explanationFrench: `Ce passage s'inscrit dans la tonalité dominante de l'œuvre conforme au cadre de l'examen régional.`,
      explanationArabic: `النبرة والسجل الأدبي يعبران عن الطابع الفني العام المعتمد في أسئلة الامتحان الجهوي لهذا العمل.`,
      category: 'Analyse & Citations',
      difficulty,
      targetConcept: 'السجل الأدبي وتيمات النص (Registre littéraire)',
    };

    questions.push(shuffleQuestionOptions(regQ));
  }

  return questions.slice(0, count);
}

// Master Quiz Generator that calls the backend with full page data or falls back reliably
export async function executePedagogicalQuizGeneration(
  req: QuizRequest
): Promise<QuizQuestion[]> {
  const bookId = req.bookId || 'la_boite_a_merveilles';
  const targetPages = req.selectedPages && req.selectedPages.length > 0 ? req.selectedPages : [1];
  const count = req.numberOfQuestions || 4;
  const categoryFilter = req.categoryFilter || 'ALL';
  const difficulty = req.difficulty || 'MEDIUM';

  // Gather actual page texts to ensure strict grounding
  const pageTexts = targetPages.map((pNum) => {
    const pageObj = getPage(bookId, pNum);
    return {
      pageNumber: pNum,
      text: pageObj.text,
      arabicSummary: pageObj.arabicSummary,
      keyEventsArabic: pageObj.keyEventsArabic,
      chapterTitle: pageObj.chapterTitle,
    };
  });

  try {
    const response = await fetch('/api/quiz/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageNumbers: targetPages,
        pageTexts,
        count,
        bookId,
        categoryFilter,
        difficulty,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        // Ensure every question from API is also shuffled so correctIndex is cleanly randomized
        return data.questions.map((q: QuizQuestion) => shuffleQuestionOptions(q));
      }
    }
  } catch (err) {
    console.warn('Backend quiz API call failed, generating strictly page-grounded local questions:', err);
  }

  // Reliable, high-precision local generator strictly bound to the requested pages
  const generated: QuizQuestion[] = [];
  for (const pNum of targetPages) {
    const pageObj = getPage(bookId, pNum);
    const pageQuestions = generateLocalPageGroundedQuestions(
      pageObj,
      bookId,
      categoryFilter,
      Math.max(2, Math.ceil(count / targetPages.length)),
      difficulty
    );
    generated.push(...pageQuestions);
    if (generated.length >= count) break;
  }

  return generated.slice(0, count);
}
