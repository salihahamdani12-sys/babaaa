import { BookId } from '../types';

export interface FourWEntry {
  id: string;
  bookId: BookId;
  chapterNumber: number;
  chapterTitle: string;
  chapterTitleArabic: string;
  passageTitle: string;
  passageTitleArabic: string;
  pageNumber: number;
  frenchExcerpt: string;
  arabicExcerpt: string;
  // W1: WHO / QUI ?
  who: {
    quiParle: string;
    aQui: string;
    personnagesPresents: string[];
    roleEtStatut: string;
    explicationAr: string;
  };
  // W2: WHAT / QUOI ?
  what: {
    actionFr: string;
    actionAr: string;
    themeCleFr: string;
    themeCleAr: string;
    enjeuDramatique: string;
  };
  // W3: WHERE / OÙ ?
  where: {
    lieuFr: string;
    lieuAr: string;
    valeurSymbolique: string;
  };
  // W4: WHEN / QUAND ?
  when: {
    momentOeuvreFr: string;
    momentOeuvreAr: string;
    evenementPrecedentFr: string;
    evenementPrecedentAr: string;
    evenementSuivantFr: string;
    evenementSuivantAr: string;
  };
  // Exam Model Answers
  modelAnswers: {
    methodeEvenementielleFr: string;
    methodeEvenementielleAr: string;
    methodeGlobaleFr: string;
    methodeGlobaleAr: string;
  };
  examTips: string[];
}

export const FOUR_W_GUIDE = {
  titleAr: "قاعدة 4W (WWWW) لتأطير أي نص في الامتحان الجهوي للأولى باكالوريا",
  titleFr: "La Règle des 4W (WWWW) pour Situer le Passage à l'Examen Régional",
  subtitleAr: "السؤال الأول (Question 1) في مكون القراءة (Compréhension) - مضمون 100% بنقاط كاملة",
  definitionFr: "Situer le passage consiste à préciser la place exacte qu'occupe l'extrait proposé dans le déroulement chronologique et dramatique de l'œuvre.",
  definitionAr: "تأطير النص يعني تحديد الموضع الدقيق للمقطع المقتطف داخل البناء الدرامي والزمني للرواية أو المسرحية، والإجابة عن الأسئلة المرجعية الأربعة.",
  fourPillars: [
    {
      letter: "W1",
      nameFr: "WHO? (Qui ?)",
      nameAr: "مَن؟ (الشخصيات)",
      descriptionFr: "Qui parle ? À qui ? Qui sont les personnages en présence ?",
      descriptionAr: "تحديد الراوي أو المتحدث، المخاطب، والشخصيات الحاضرة في المشهد وطبيعة العلاقة بينهم.",
      color: "from-blue-600 to-indigo-700",
      textColor: "text-blue-700 dark:text-blue-300",
      bgLight: "bg-blue-50 dark:bg-blue-950/40",
      border: "border-blue-300 dark:border-blue-800",
    },
    {
      letter: "W2",
      nameFr: "WHAT? (Quoi ?)",
      nameAr: "ماذا؟ (الحدث والموضوع)",
      descriptionFr: "De quoi s'agit-il ? Quelle est l'action ou le sujet de la discussion ?",
      descriptionAr: "جوهر الحدث الذي يعالجه المقطع: نقاش، صراع، وصف، قرار مصيري، أو بوح داخلي.",
      color: "from-emerald-600 to-teal-700",
      textColor: "text-emerald-700 dark:text-emerald-300",
      bgLight: "bg-emerald-50 dark:bg-emerald-950/40",
      border: "border-emerald-300 dark:border-emerald-800",
    },
    {
      letter: "W3",
      nameFr: "WHERE? (Où ?)",
      nameAr: "أين؟ (الإطار المكاني)",
      descriptionFr: "Où se déroule la scène ? Quel est le lieu précis et sa portée ?",
      descriptionAr: "المكان الدقيق للحدث (دار الشوافة، قصر طيبة، سجن بيسيتر...) وقيمته الرمزية في الرواية.",
      color: "from-amber-600 to-orange-700",
      textColor: "text-amber-700 dark:text-amber-300",
      bgLight: "bg-amber-50 dark:bg-amber-950/40",
      border: "border-amber-300 dark:border-amber-800",
    },
    {
      letter: "W4",
      nameFr: "WHEN? (Quand ?)",
      nameAr: "متى؟ (الزمان وما قبله وما بعده)",
      descriptionFr: "À quel moment de l'œuvre ? Qu'est-ce qui s'est passé juste AVANT et juste APRÈS ?",
      descriptionAr: "موقع المقطع في حبكة العمل: الحدث السابق الذي أدى إليه، والحدث اللاحق المترتب عنه.",
      color: "from-purple-600 to-fuchsia-700",
      textColor: "text-purple-700 dark:text-purple-300",
      bgLight: "bg-purple-50 dark:bg-purple-950/40",
      border: "border-purple-300 dark:border-purple-800",
    },
  ],
  standardFormulas: [
    {
      id: "formule-evenementielle",
      titleFr: "Formule 1 : Méthode événementielle (Avant / Après) - La plus recommandée",
      titleAr: "الصيغة 1: الطريقة السببية الحدثية (ما قبل المقطع وما بعده) - الأكثر حصداً للنقاط",
      structureFr: "« Ce passage est extrait de l'œuvre [TITRE] écrite par [AUTEUR] en [DATE]. Il se situe juste après que [ÉVÉNEMENT PRÉCÉDENT / W4-AVANT], et avant que [ÉVÉNEMENT SUIVANT / W4-APRÈS]. Dans cet extrait, [QUI / W1] se trouve à [OÙ / W3] et [QUOI / W2]. »",
      structureAr: "« يقع هذا المقطع ضمن مؤلف [العنوان] للكاتب [المؤلف] الصادر سنة [التاريخ]. ويتموضع مباشرة بعد [الحدث السابق] وقبل [الحدث اللاحق]. وفي هذا المقتطف، يتواجد [مَن] بـ [أين] حيث [ماذا]. »",
    },
    {
      id: "formule-globale",
      titleFr: "Formule 2 : Méthode globale / interne (Situation par rapport à la structure)",
      titleAr: "الصيغة 2: الطريقة البنيوية الشاملة (تأطير المقطع داخل فصول ومحاور العمل)",
      structureFr: "« Cet extrait se situe au [CHAPITRE / SCÈNE] de [TITRE], un [GENRE] de [AUTEUR]. Suite à [ÉVÉNEMENT DÉCLENCHEUR / W4], [QUI / W1] se trouve à [OÙ / W3] où [QUOI / W2]. »",
      structureAr: "« ينتمي هذا النص إلى [الفصل / المشهد] من [العنوان]، وهو [الجنس الأدبي] لـ [المؤلف]. وإثر [الحدث الممهد]، يتواجد [مَن] في [أين] حيث يدور [ماذا]. »",
    },
  ],
  goldenRules: [
    "لا تكتفِ بذكر عنوان المؤلف واسم الكاتب فقط، لأن ذلك يجيب عن ثلث السؤال فقط.",
    "حدد دائماً الحدث الذي سبق المقطع مباشرة (Ce qui s'est passé juste avant) فهو مفتاح العلامة الكاملة.",
    "احرص على الإيجاز والدقة وتجنب حرق أحداث الرواية بأكملها (Résumez en 3 à 4 lignes).",
    "استعمل أفعال الربط المنهجية: Ce passage se situe après que... / Il prend place suite à... / Cet extrait fait suite à...",
  ],
};

export const FOUR_W_PASSAGES: FourWEntry[] = [
  // =========================================================================
  // LA BOÎTE À MERVEILLES (Ahmed Sefrioui)
  // =========================================================================
  {
    id: '4w-lbm-ch1-bain',
    bookId: 'la_boite_a_merveilles',
    chapterNumber: 1,
    chapterTitle: 'Chapitre I',
    chapterTitleArabic: 'الفصل الأول',
    passageTitle: 'Le Bain Maure (الحمام الشعبي)',
    passageTitleArabic: 'محنة الحمام الشعبي وعذاب سيدي محمد',
    pageNumber: 3,
    frenchExcerpt: 'Le lendemain, ma mère me réveilla de bonne heure pour aller au bain maure. C’était pour moi un lieu de supplice. Je croyais y voir des démons gesticuler dans la vapeur tiède...',
    arabicExcerpt: 'في الغداة، أيقظتني أمي باكراً للذهاب إلى الحمام الشعبي. كان بالنسبة لي مكاناً للعذاب الشديد. كنت أحسب أنني أرى شياطين تلوح وسط البخار الفاتر...',
    who: {
      quiParle: 'Sidi Mohamed (le narrateur adulte qui se remémore son enfance de 6 ans)',
      aQui: 'Le lecteur / Destinataire',
      personnagesPresents: ['Sidi Mohamed (l’enfant)', 'Lalla Zoubida (sa mère)', 'Les femmes et enfants du quartier'],
      roleEtStatut: 'Narrateur-personnage principal, enfant solitaire et rêveur',
      explicationAr: 'الراوي المتكلم سيدي محمد يستحضر طفولته رفقة أمه لالة زبيدة ونساء الحي الفاسيات داخل الحمام.',
    },
    what: {
      actionFr: 'Récit du supplice terrifiant éprouvé par l’enfant lors de sa visite au bain maure avec sa mère.',
      actionAr: 'وصف المعاناة والهلع النفسي الذي عاشه الطفل سيدي محمد في الحمام الشعبي وتخيله للنساء كشياطين.',
      themeCleFr: 'La solitude enfantine, la peur, le malaise social, le monde imaginaire.',
      themeCleAr: 'عزلة الطفولة، الخوف، الغربة النفسية، وعالم التخييل.',
      enjeuDramatique: 'Opposition entre le regard poétique et intime du petit garçon et la promiscuité bruyante du monde des adultes.',
    },
    where: {
      lieuFr: 'Le bain maure (Hammam traditionnel) dans la médina de Fès',
      lieuAr: 'الحمام الشعبي التقليدي بالمدينة القديمة بفاس',
      valeurSymbolique: 'Lieu de purification pour les femmes, mais enfer suffocant et espace de terreur pour le jeune narrateur.',
    },
    when: {
      momentOeuvreFr: 'Au tout début du roman (Chapitre I, deuxième séquence)',
      momentOeuvreAr: 'في مطلع الرواية (الفصل الأول، المقطع الثاني)',
      evenementPrecedentFr: "Le narrateur a présenté sa solitude d'enfant de six ans et la composition des locataires de Dar Chouafa.",
      evenementPrecedentAr: 'تقديم الراوي لعزلته وهو في سن السادسة ووصفه لدار الشوافة وسكانها ومنازلهم.',
      evenementSuivantFr: "Le lendemain (lundi), une dispute d'une violence inouïe éclate entre Lalla Zoubida et sa voisine Rahma au sujet de la lessive.",
      evenementSuivantAr: 'اندلاع شجار حاد وعنيف في الغداة بين لالة زبيدة وجارتها رحمة بسبب غسيل الملابس على السطح.',
    },
    modelAnswers: {
      methodeEvenementielleFr: "Ce passage est extrait du premier chapitre du roman autobiographique 'La Boîte à Merveilles' d'Ahmed Sefrioui, publié en 1954. Il se situe juste après la présentation de Dar Chouafa et l'évocation de la solitude de l'enfant, et avant que n'éclate la violente dispute de lessive entre Lalla Zoubida et Rahma. Dans cet extrait, le narrateur Sidi Mohamed raconte le calvaire de sa visite au bain maure en compagnie de sa mère.",
      methodeEvenementielleAr: "يقع هذا المقطع ضمن الفصل الأول من الرواية السير-ذاتية 'علبة العجائب' لأحمد الصفريوي الصادرة سنة 1954. ويتموضع مباشرة بعد تقديم دار الشوافة واستحضار عزلة الطفل، وقبل نشوب شجار الغسيل العنيف بين لالة زبيدة وجارتها رحمة. يصف فيه الراوي سيدي محمد معاناته النفسية أثناء مرافقته لأمه إلى الحمام الشعبي.",
      methodeGlobaleFr: "Cet extrait se situe au Chapitre I de 'La Boîte à Merveilles' d'Ahmed Sefrioui. Sidi Mohamed, le narrateur-enfant âgé de six ans, se trouve avec sa mère au bain maure de Fès. Il exprime son aversion pour cet endroit bruyant et étouffant qu'il assimile à un enfer.",
      methodeGlobaleAr: "ينتمي هذا النص إلى الفصل الأول من رواية 'علبة العجائب' لأحمد الصفريوي. حيث يتواجد الراوي الطفل سيدي محمد ذو الست سنوات مع والدته في حمام شعبي بفاس، معبراً عن نفوره الشديد من هذا المكان الصاخب الذي شبهه بالجحيم.",
    },
    examTips: [
      "في رواية علبة العجائب، تأكد دائماً من ذكر سن الطفل (six ans) واسم الدار (Dar Chouafa).",
      "أبرز الحدث الموالي: شجار يوم الغسيل (La dispute de la lessive) فهو حدث محوري في الفصل الأول.",
    ],
  },
  {
    id: '4w-lbm-ch2-sidi-ali',
    bookId: 'la_boite_a_merveilles',
    chapterNumber: 2,
    chapterTitle: 'Chapitre II',
    chapterTitleArabic: 'الفصل الثاني',
    passageTitle: 'Visite à Sidi Ali Boughaleb (زيارة سيدي علي بوغالب)',
    passageTitleArabic: 'التبرك بضريح سيدي علي بوغالب وخمش القط للطفل',
    pageNumber: 10,
    frenchExcerpt: 'Nous arrivâmes au sanctuaire de Sidi Ali Boughaleb. Ma mère et Lalla Aïcha baisèrent le seuil avec dévotion. Les femmes buvaient de l’eau tiède de la fontaine sacrée. Soudain, un gros chat roux m’attaqua...',
    arabicExcerpt: 'وصلنا إلى روضة سيدي علي بوغالب. قبلت أمي ولالة عائشة العتبة بخشوع. كانت النساء يشربن من ماء النافورة المقدسة الفاتر. فجأة، هاجمني قط أصهب ضخم وخمش خدي...',
    who: {
      quiParle: 'Sidi Mohamed (narrateur)',
      aQui: 'Le lecteur',
      personnagesPresents: ['Sidi Mohamed', 'Lalla Zoubida', 'Lalla Aïcha', 'Le Moqaddem du sanctuaire'],
      roleEtStatut: 'Lalla Aïcha est l’amie intime de Lalla Zoubida, ancienne voisine respectée',
      explicationAr: 'سيدي محمد وأمه لالة زبيدة وصديقتها لالة عائشة في رحلة استشفائية وتبرك بالولي الصالح.',
    },
    what: {
      actionFr: 'Pèlerinage au sanctuaire pour soigner la mauvaise santé et le mauvais œil, interrompu par l’attaque imprévue d’un chat roux.',
      actionAr: 'زيارة ضريح الولي الصالح لطلب الشفاء ودفع العين، تخللها هجوم مباغت لقط أصهب خمش خد سيدي محمد.',
      themeCleFr: 'Les superstitions populaires, la dévotion maraboutique, la maladie.',
      themeCleAr: 'المعتقدات الشعبية، تقديس الأولياء والأضرحة، المرض والعلاج التقليدي.',
      enjeuDramatique: 'La tentative des mères de conjurer le sort face à la fragilité de l’enfant.',
    },
    where: {
      lieuFr: 'Le sanctuaire de Sidi Ali Boughaleb (Zaouïa / Marabout) à Fès',
      lieuAr: 'روضة وضريح سيدي علي بوغالب بمدينة فاس',
      valeurSymbolique: 'Lieu de dévotion mystique et de refuge féminin contre l’angoisse quotidienne.',
    },
    when: {
      momentOeuvreFr: 'Au Chapitre II de l’œuvre',
      momentOeuvreAr: 'في الفصل الثاني من الرواية',
      evenementPrecedentFr: "Le narrateur a passé un mardi sombre et angoissant au Msid avec un Fqih sévère, puis Lalla Aïcha a rendu visite à sa mère souffrante.",
      evenementPrecedentAr: 'قضاء سيدي محمد ليوم ثلاثاء كئيب بالمسيد مع قسوة الفقيه، وزيارة لالة عائشة لصديقتها لالة زبيدة المريضة واقتراحها الزيارة.',
      evenementSuivantFr: "L'enfant bénéficie de deux jours de repos convalescent à la maison, et Rahma lui offre un précieux cabochon de verre pour sa boîte.",
      evenementSuivantAr: 'حصول سيدي محمد على يومين من الراحة في البيت وإهداء الجارة رحمة له كابوشون زجاجي وضعه في علبته.',
    },
    modelAnswers: {
      methodeEvenementielleFr: "Ce passage est extrait du Chapitre II de 'La Boîte à Merveilles' d'Ahmed Sefrioui. Il se situe juste après la visite de Lalla Aïcha venue réconforter Lalla Zoubida après le pénible mardi au Msid, et avant les deux jours de convalescence où Rahma offre un cabochon à l'enfant. Dans cet extrait, Sidi Mohamed accompagne les deux femmes au sanctuaire de Sidi Ali Boughaleb où il est griffé par un chat.",
      methodeEvenementielleAr: "يقع هذا المقطع في الفصل الثاني من 'علبة العجائب' لأحمد الصفريوي. ويأتي مباشرة بعد زيارة لالة عائشة للالة زبيدة بعد يوم الثلاثاء المرهق في المسيد، وقبل تمتع سيدي محمد بيومي عطلة بالبيت وإهداء رحمة كابوشون زجاجي له. يوثق المقطع زيارة الضريح وحادثة خمش القط للطفل.",
      methodeGlobaleFr: "Cet extrait appartient au Chapitre II de 'La Boîte à Merveilles'. Sidi Mohamed se rend avec sa mère et Lalla Aïcha au mausolée de Sidi Ali Boughaleb à Fès pour chercher la guérison et chasser les mauvais esprits.",
      methodeGlobaleAr: "ينتمي هذا النص إلى الفصل الثاني من رواية 'علبة العجائب'. حيث يتوجه سيدي محمد مع أمه ولالة عائشة إلى ضريح سيدي علي بوغالب بفاس طلباً للشفاء ودفعاً للعين وسوء الطالع.",
    },
    examTips: [
      "اذكر اسم الولي الصالح بدقة: Sidi Ali Boughaleb.",
      "أشر إلى الهدية التي نالها سيدي محمد بعد هذا الحادث: un cabochon de verre facetté.",
    ],
  },
  {
    id: '4w-lbm-ch3-perte-zineb',
    bookId: 'la_boite_a_merveilles',
    chapterNumber: 3,
    chapterTitle: 'Chapitre III',
    chapterTitleArabic: 'الفصل الثالث',
    passageTitle: 'La disparition de Zineb (ضياع زينب)',
    passageTitleArabic: 'فقدان زينب وتضامن نساء دار الشوافة',
    pageNumber: 18,
    frenchExcerpt: 'Soudain, des cris déchirèrent le crépuscule. Rahma montait les escaliers en hurlant : « Zineb est perdue ! Ma fille a disparu dans la foule ! » Toutes les femmes se mirent à pleurer par solidarité...',
    arabicExcerpt: 'فجأة، مزقت صرخات مرعبة سكون المساء. كانت رحمة تصعد الدرج وهي تولول: «لقد ضاعت زينب! ابنتي اختفت في الزحام!» فانخرطت جميع نساء الدار في البكاء تضامناً معها...',
    who: {
      quiParle: 'Rahma (en détresse) relayée par le narrateur',
      aQui: 'Les voisines de Dar Chouafa et l’entourage',
      personnagesPresents: ['Rahma', 'Lalla Zoubida', 'Fatma Bziouiya', 'Sidi Mohamed'],
      roleEtStatut: 'Voisines de Dar Chouafa réconciliées dans l’épreuve',
      explicationAr: 'صراخ رحمة الثكلى وتضامن نساء الدار معها رغم الخلافات السابقة.',
    },
    what: {
      actionFr: 'Annonce tragique de la perte de la fillette Zineb lors d’une fête de baptême et mobilisation générale pour la retrouver.',
      actionAr: 'إعلان رحمة المفجع عن ضياع ابنتها زينب في زحام فاس وتضامن الجميع للبحث عنها.',
      themeCleFr: 'La solidarité marocaine, la fraternité de voisinage, le pardon.',
      themeCleAr: 'التضامن المغربي الأصيل، التكافل بين الجيران، والتسامح.',
      enjeuDramatique: 'Effacement immédiat des rivalités futiles devant le malheur d’autrui.',
    },
    where: {
      lieuFr: 'Dar Chouafa et les ruelles du quartier R’cif à Fès',
      lieuAr: 'دار الشوافة وأزقة حي الرصيف بفاس',
      valeurSymbolique: 'La maison commune devient un lieu d’union sacrée et d’empathie collective.',
    },
    when: {
      momentOeuvreFr: 'Au Chapitre III du roman',
      momentOeuvreAr: 'في الفصل الثالث من الرواية',
      evenementPrecedentFr: "L'achat d'une lampe à pétrole par Maâlem Abdeslem pour imiter Fatma Bziouya.",
      evenementPrecedentAr: 'اقتناء المعلم عبد السلام لمصباح البترول بعد إعجاب لالة زبيدة بمصباح فاطمة البزيوية.',
      evenementSuivantFr: "Zineb est retrouvée à Dar Qitoun, et Rahma organise un grand repas de charité pour les pauvres aveugles.",
      evenementSuivantAr: 'العثور على زينب سالمة بدار قيطون وإقامة رحمة وليمة صدقة كبرى للفقراء والعميان.',
    },
    modelAnswers: {
      methodeEvenementielleFr: "Ce passage est tiré du Chapitre III de 'La Boîte à Merveilles' d'Ahmed Sefrioui. Il se situe juste après l'achat de la lampe à pétrole par Maâlem Abdeslem, et avant que Zineb ne soit retrouvée à Dar Qitoun suivie du grand repas de charité. Dans cet extrait, Rahma annonce avec désespoir la disparition de sa fille Zineb, suscitant la compassion immédiate de Lalla Zoubida.",
      methodeEvenementielleAr: "يقتطف هذا النص من الفصل الثالث من 'علبة العجائب' لأحمد الصفريوي. ويأتي مباشرة إثر شراء مصباح البترول من طرف المعلم عبد السلام، وقبل العثور على زينب بدار قيطون وإعداد وليمة الصدقة. يصور المقطع فاجعة ضياع الطفلة زينب وهبة نساء الدار لمؤازرة أمها.",
      methodeGlobaleFr: "Cet extrait se situe au Chapitre III de 'La Boîte à Merveilles'. Dans la cour de Dar Chouafa à Fès, Rahma crie sa douleur suite à la perte de sa fille Zineb dans la foule, ce qui réunit les voisines dans un élan de solidarité sincère.",
      methodeGlobaleAr: "يتموقع هذا النص بالفصل الثالث من 'علبة العجائب'. في فناء دار الشوافة بفاس، تعلن رحمة بحرقة اختفاء ابنتها زينب وسط الزحام، مما يوحد الجارات في مشهد تكافلي إنساني نبيل.",
    },
    examTips: [
      "ركز على قيمة التضامن (la solidarité) ومكان العثور على زينب (Dar Qitoun).",
      "بين كيف نسيت لالة زبيدة شجار الغسيل لتساعد جارتها رحمة بكل صدق.",
    ],
  },
  {
    id: '4w-lbm-ch9-ruine-depart',
    bookId: 'la_boite_a_merveilles',
    chapterNumber: 9,
    chapterTitle: 'Chapitre IX',
    chapterTitleArabic: 'الفصل التاسع',
    passageTitle: 'La ruine et le départ du père (إفلاس الأب ورحيله)',
    passageTitleArabic: 'ضياع رأس مال المعلم عبد السلام وقرار السفر للحصاد',
    pageNumber: 70,
    frenchExcerpt: 'Mon père avait perdu tout son capital dans le souk des tissus. Il entra le soir pâle et brisé. Il nous annonça calmement qu’il devait partir travailler comme moissonneur aux environs de Fès pour reconstituer son atelier...',
    arabicExcerpt: 'فقد والدي كل رأس ماله في سوق الحايك. دخل في المساء شاحباً منكسراً. وأخبرنا بهدوء أنه مضطر للسفر للعمل كحصاد في نواحي فاس لجمع مال يعيد به فتح ورشته...',
    who: {
      quiParle: 'Maâlem Abdeslem relayé par Sidi Mohamed',
      aQui: 'Lalla Zoubida et son fils',
      personnagesPresents: ['Maâlem Abdeslem (le père)', 'Lalla Zoubida (la mère)', 'Sidi Mohamed (l’enfant)'],
      roleEtStatut: 'Le chef de famille, homme digne et travailleur accablé par la fatalité',
      explicationAr: 'رب الأسرة المعلم عبد السلام يبلغ زوجته وابنه بالنبأ الصاعم لضياع نقوده وعزمه على السفر الشاق.',
    },
    what: {
      actionFr: 'Annonce de la ruine financière totale du père suite à la perte de son sac d’argent et décision héroïque de partir moissonner.',
      actionAr: 'إعلان الأب عن إفلاسه التام بعد سقوط صرة ماله بالسوق وقراره الشجاع بالذهاب للعمل كحصاد.',
      themeCleFr: 'L’adversité, la dignité ouvrière, l’éclatement temporaire du foyer, la tristesse.',
      themeCleAr: 'المحنة والابتلاء، عزة النفس وكرامة العامل، تشتت الأسرة المؤقت، والأسى.',
      enjeuDramatique: 'Le tournant tragique majeur (le nœud du roman) privant la famille de son protecteur.',
    },
    where: {
      lieuFr: 'La chambre familiale au deuxième étage de Dar Chouafa à Fès',
      lieuAr: 'غرفة الأسرة بالطابق الثاني بدار الشوافة بفاس',
      valeurSymbolique: 'Le cocon familial chaleureux plongé dans l’obscurité et le deuil métaphorique.',
    },
    when: {
      momentOeuvreFr: 'Au Chapitre IX (Le nœud dramatique du roman)',
      momentOeuvreAr: 'في الفصل التاسع (عقدة الرواية وذروة الأزمة)',
      evenementPrecedentFr: "La maladie grave de Sidi Mohamed et la violente dispute au Souk des Bijoutiers où le père s'est battu pour des bracelets jugés maudits.",
      evenementPrecedentAr: 'مرض سيدي محمد بالحمى وشجار الأب مع الدلال في سوق الصياغ لشراء أساور اعتبرتها الأم فأل شؤم.',
      evenementSuivantFr: "Le départ du père à l'aube, la solitude accablante de la mère et du fils, et leurs visites successives des marabouts avec Lalla Aïcha.",
      evenementSuivantAr: 'رحيل الأب فجراً، معاناة الأم والطفل من الفقر والوحشة، وبدء زياراتهما للأولياء ومقابلة سيدي العرافي.',
    },
    modelAnswers: {
      methodeEvenementielleFr: "Ce passage capital constitue le nœud dramatique du Chapitre IX de 'La Boîte à Merveilles' d'Ahmed Sefrioui. Il se situe juste après la maladie de l'enfant et l'achat funeste des bracelets au Souk des Bijoutiers, et avant le départ du père à l'aube vers la campagne fassie. Dans cet extrait, Maâlem Abdeslem annonce à sa famille la perte de son capital et son obligation de partir travailler comme moissonneur.",
      methodeEvenementielleAr: "يمثل هذا المقطع المفصلي عقدة الفصل التاسع من 'علبة العجائب' لأحمد الصفريوي. ويتموقع مباشرة بعد مرض الطفل وشجار سوق الصياغ لشراء الأساور المشؤومة، وقبل مغادرة الأب فجراً نحو الحقول. يخبر فيه المعلم عبد السلام أسرته بضياع ماله واضطراره للعمل كحصاد لإعادة فتح ورشته.",
      methodeGlobaleFr: "Cet extrait se situe au cœur du Chapitre IX de 'La Boîte à Merveilles'. À Dar Chouafa, Maâlem Abdeslem informe avec dignité sa femme et son fils de sa ruine financière, les préparant à une séparation douloureuse de plusieurs semaines.",
      methodeGlobaleAr: "ينتمي هذا النص إلى صميم الفصل التاسع من 'علبة العجائب'. ففي غرفة دار الشوافة، يصارح المعلم عبد السلام زوجته وابنه بضياع ماله بعزة نفس، ممهداً لفراق مؤلم يدوم شهراً كاملاً.",
    },
    examTips: [
      "هذا الفصل هو 'عقدة الرواية' (Le nœud du roman) - احرص دائماً على كتابة هذه الكلمة المفتاحية في ورقة الامتحان.",
      "حدد وظيفة الأب الجديدة بدقة: moissonneur (حصاد).",
    ],
  },

  // =========================================================================
  // ANTIGONE (Jean Anouilh)
  // =========================================================================
  {
    id: '4w-ant-sc1-prologue',
    bookId: 'antigone',
    chapterNumber: 1,
    chapterTitle: 'Scène 1 (Le Prologue)',
    chapterTitleArabic: 'المشهد الأول: الإستفتاح',
    passageTitle: 'Le Prologue et la fatalité tragique (البرولوغ)',
    passageTitleArabic: 'استهلال المسرحية وتقديم الشخوص ومصائرهم التراجيدية',
    pageNumber: 1,
    frenchExcerpt: 'Le Prologue s’avance : « Voilà. Ces personnages vont vous jouer l’histoire d’Antigone. Antigone, c’est la petite maigre qui est assise là-bas, et qui ne dit rien. Elle regarde droit devant elle. Elle pense. Elle pense qu’elle va mourir... »',
    arabicExcerpt: 'يتقدم البرولوغ: «ها هم. هذه الشخصيات ستؤدي أمامكم قصة أنتيجون. أنتيجون هي تلك الفتاة النحيفة الجالسة هناك، التي لا تنبس ببنت شفة. تنظر للأمام وتفكر. تفكر أنها ستموت...»',
    who: {
      quiParle: 'Le Prologue (personnage hors-diégétique inspiré du chœur grec antique)',
      aQui: 'Le public / Les spectateurs dans la salle',
      personnagesPresents: ['Antigone', 'Créon', 'Hémon', 'Ismène', 'Eurydice', 'La Nourrice', 'Le Messager', 'Les Gardes'],
      roleEtStatut: 'Narrateur neutre et omniscient qui brise l’illusion théâtrale',
      explicationAr: 'البرولوغ يكسر الجدار الرابع ويخاطب الجمهور مباشرة كاشفاً عن هوية كل شخصية ومصيرها المحتوم.',
    },
    what: {
      actionFr: 'Présentation exhaustive des protagonistes, de leurs liens de parenté, de leurs tempéraments et de leur destin inéluctable.',
      actionAr: 'تقديم شامل لشخوص المسرحية، قرابتهم، سماتهم النفسية، وإعلان موعد موت أنتيجون المحتوم.',
      themeCleFr: 'La fatalité tragique, le théâtre dans le théâtre, le déterminisme.',
      themeCleAr: 'الحتمية التراجيدية، كسر الإيهام المسرحي، والقدر المحتوم.',
      enjeuDramatique: 'Démystifier le suspense pour concentrer l’attention du spectateur sur le mécanisme tragique.',
    },
    where: {
      lieuFr: 'Le palais royal de Thèbes (Scène neutre sans décor réaliste)',
      lieuAr: 'القصر الملكي بطيبة (ركح مسرحي محايد)',
      valeurSymbolique: 'Lieu clos de l’enfermement tragique où le pouvoir et le sang royal s’affrontent.',
    },
    when: {
      momentOeuvreFr: 'La scène d’exposition inaugurale de la tragédie moderne',
      momentOeuvreAr: 'مشهد الاستهلال الافتتاحي للمأساة المعاصرة',
      evenementPrecedentFr: "La guerre civile entre Étéocle et Polynice s'achevant par leur mort mutuelle, et l'édit de Créon interdisant la sépulture de Polynice.",
      evenementPrecedentAr: 'الحرب الأهلية بين الأخوين إيتيوكل وبولينيس ومقتلهما معاً، وصدور مرسوم الملك كريون الصارم بمنع دفن بولينيس.',
      evenementSuivantFr: "L'entrée clandestine d'Antigone au petit matin, surprise par la Nourrice après sa première tentative d'ensevelissement.",
      evenementSuivantAr: 'عودة أنتيجون متسللة عند الفجر بعد محاولتها الأولى لدفن أخيها، وتفاجؤ المربية بها واستجوابها.',
    },
    modelAnswers: {
      methodeEvenementielleFr: "Ce passage ouvre la tragédie moderne 'Antigone' de Jean Anouilh, représentée en 1944. Il prend place après la mort mutuelle des deux frères Étéocle et Polynice suivie de la proclamation du décret de Créon, et juste avant la rentrée matinale d'Antigone interrogée par la Nourrice. Dans cette scène d'exposition, le Prologue présente les protagonistes au public et annonce d'emblée la mort inéluctable d'Antigone.",
      methodeEvenementielleAr: "يفتتح هذا النص مسرحية 'أنتيجون' لجان أنوي المعروضة سنة 1944. ويقع بعد مقتل الأخوين إيتيوكل وبولينيس وإصدار كريون لمرسوم حظر الدفن، وقبل رجوع أنتيجون متسللة عند الفجر واستجواب المربية لها. في هذا المشهد الاستهلالي، يقدم البرولوغ أبطال المسرحية للجمهور معلناً سلفاً عن موت أنتيجون الحتمي.",
      methodeGlobaleFr: "Cet extrait constitue le Prologue initial de la pièce 'Antigone' de Jean Anouilh. Sur la scène du palais de Thèbes, le Prologue s'adresse directement aux spectateurs pour exposer la situation tragique et décrire le destin fatal de chaque personnage.",
      methodeGlobaleAr: "يمثل هذا المقتطف استهلال مسرحية 'أنتيجون' لجان أنوي. فوق خشبة مسرح قصر طيبة، يتوجه البرولوغ للجمهور مباشرة ليعرض المأزق التراجيدي والمصير المحتوم لكل شخصية من الشخوص الحاضرة.",
    },
    examTips: [
      "في مسرحية أنتيجون، لا توجد فصول تقليدية بل مشاهد متتابعة (Scènes).",
      "بين دائماً وظيفة البرولوغ: كسر الإيهام المسرحي (briser l'illusion théâtrale) وإعلان الحتمية التراجيدية (la fatalité).",
    ],
  },
  {
    id: '4w-ant-sc8-face-a-face',
    bookId: 'antigone',
    chapterNumber: 8,
    chapterTitle: 'Scène 8 (Le Face-à-face)',
    chapterTitleArabic: 'المشهد الثامن: المواجهة الكبرى',
    passageTitle: 'Le grand face-à-face Créon - Antigone (المواجهة الحاسمة)',
    passageTitleArabic: 'صراع الواجب والحرية المطلقة ضد براغماتية السلطة',
    pageNumber: 58,
    frenchExcerpt: 'Antigone : « Je ne veux pas comprendre ! Moi, je veux tout, tout de suite, et que ce soit entier, ou alors je refuse ! Je ne veux pas être modeste, moi, et me contenter d’un petit morceau si j’ai été bien sage ! » Créon : « Tais-toi ! Tu vas te faire tuer ! »',
    arabicExcerpt: 'أنتيجون: «أنا لا أريد أن أفهم! أنا أريد كل شيء، حالاً وبشكل كامل وتام، وإلا فإنني أرفض! لا أريد أن أكون متواضعة وأقنع بقطعة صغيرة لأنني كنت مطيعة!» كريون: «اصمتي! إنك تسوقين نفسك إلى الهلاك!»',
    who: {
      quiParle: 'Antigone et le Roi Créon (dialogue d’affrontement passionné)',
      aQui: 'Créon s’adresse à sa nièce, Antigone défie son oncle et roi',
      personnagesPresents: ['Antigone (l’héroïne révoltée)', 'Créon (le roi pragmatique)'],
      roleEtStatut: 'Antigone est la nièce de Créon et la fiancée de son fils Hémon',
      explicationAr: 'مواجهة ثنائية محتدمة بين الملك كريون رمز السلطة والواقعية، وأنتيجون رمز التمرد والحرية المطلقة.',
    },
    what: {
      actionFr: 'Le point culminant de la tragédie : échec des tentatives de Créon pour sauver sa nièce et refus absolu d’Antigone face au bonheur médiocre.',
      actionAr: 'ذروة الصراع المأساوي: فشل محاولات كريون للتستر على أنتيجون، ورفضها القطعي لتقديم أي تنازل عن مبادئها.',
      themeCleFr: 'La révolte, le refus du compromis, l’idéalisme intransigeant contre la raison d’État.',
      themeCleAr: 'التمرد على السلطة، رفض المساومة، صراع المثالية النقية ضد مصلحة الدولة والبراغماتية.',
      enjeuDramatique: 'Le point de non-retour scellant la condamnation à mort d’Antigone.',
    },
    where: {
      lieuFr: 'La salle du trône au palais de Thèbes',
      lieuAr: 'قاعة العرش بالقصر الملكي بطيبة',
      valeurSymbolique: 'L’arène politique où la loi des hommes (Créon) se heurte à la loi du cœur et de la conscience (Antigone).',
    },
    when: {
      momentOeuvreFr: 'Au cœur de la pièce (Scène 8, acmé dramatique)',
      momentOeuvreAr: 'في قلب المسرحية (المشهد الثامن، ذروة التأزم التراجيدي)',
      evenementPrecedentFr: "L'arrestation d'Antigone par les trois gardes alors qu'elle recouvrait pour la seconde fois le cadavre de Polynice.",
      evenementPrecedentAr: 'إلقاء القبض على أنتيجون متلبسة من طرف الحراس الثلاثة وهي تحثو التراب للمرة الثانية على جثة أخيها.',
      evenementSuivantFr: "Créon capitule devant son entêtement et appelle les gardes pour l'emmener au cachot avant son emmurement vivant.",
      evenementSuivantAr: 'استسلام كريون أمام إصرارها واستدعاؤه للحراس لاقتيادها إلى السجن تمهيداً لدفنها حية في المغارة.',
    },
    modelAnswers: {
      methodeEvenementielleFr: "Cet extrait se situe au cœur de la tragédie moderne 'Antigone' de Jean Anouilh (1944). Il prend place immédiatement après l'arrestation d'Antigone par les gardes au pied du cadavre de Polynice, et juste avant que Créon n'ordonne aux gardes de l'emmener pour être emmurée vivante. Dans ce face-à-face crucial, Antigone rejette violemment le compromis et le petit bonheur bourgeois que lui propose son oncle Créon.",
      methodeEvenementielleAr: "يقع هذا النص في صميم تراجيديا 'أنتيجون' لجان أنوي (1944). ويتموضع مباشرة بعد إلقاء الحراس القبض على أنتيجون عند جثة بولينيس، وقبل استدعاء كريون للحراس لإعدامها عبر دفنها حية في المغارة. يجسد هذا المقطع ذروة المواجهة حيث ترفض أنتيجون الحلول الوسطى والسعادة البرجوازية الزائفة.",
      methodeGlobaleFr: "Ce passage constitue le grand face-à-face entre Antigone et Créon dans la pièce éponyme de Jean Anouilh. Dans le palais de Thèbes, l'héroïne tragique s'oppose avec véhémence aux arguments réalistes de son souverain et scelle son propre destin.",
      methodeGlobaleAr: "يمثل هذا المقتطف المواجهة الكبرى بين أنتيجون والملك كريون في مسرحية جان أنوي. داخل قصر طيبة، تتصدى البطلة التراجيدية بضراوة لذرائع خالها البراغماتية، معلنة موتها بمحض إرادتها دفاعاً عن نقائها.",
    },
    examTips: [
      "بين الدوافع العائلية لكريون: أراد إنقاذها لأنها ابنة أخته وخطيبة ابنه هيمون.",
      "استعمل تعبير: 'ذروة التأزم' (Le point culminant / L'acmé tragique).",
    ],
  },

  // =========================================================================
  // LE DERNIER JOUR D'UN CONDAMNÉ (Victor Hugo)
  // =========================================================================
  {
    id: '4w-cnd-ch1-condamne',
    bookId: 'le_dernier_jour_dun_condamne',
    chapterNumber: 1,
    chapterTitle: 'Chapitre I',
    chapterTitleArabic: 'الفصل الأول',
    passageTitle: 'L’Idée fixe de la Mort (محكوم بالإعدام)',
    passageTitleArabic: 'الفكرة الثابتة التي تطارد السجين: محكوم بالإعدام!',
    pageNumber: 1,
    frenchExcerpt: '« Condamné à mort ! Voilà cinq semaines que j’habite avec cette pensée, toujours seul avec elle, toujours glacé de sa présence, toujours courbé sous son poids ! Autrefois... Maintenant, je suis captif... »',
    arabicExcerpt: '«محكوم بالإعدام! ها قد مرت خمسة أسابيع وأنا أساكن هذه الفكرة، وحيداً معها دائماً، متجمداً من وطأة حضورها، منحنياً تحت ثقلها! قديماً... أما الآن، فأنا أسير...»',
    who: {
      quiParle: 'Le Condamné à mort (narrateur anonyme)',
      aQui: 'Lui-même à travers son journal intime / Le lecteur / La société',
      personnagesPresents: ['Le Condamné à mort (seul avec son idée fixe)'],
      roleEtStatut: 'Prisonnier lettré, éduqué, dont Hugo tait volontairement le nom et le crime pour universaliser la cause',
      explicationAr: 'السجين المحكوم بالإعدام يكتب مذكراته في عزلته التامة، ولم يذكر فيكتور هيغو اسمه لجعله رمزاً لكل محكوم.',
    },
    what: {
      actionFr: 'Monologue intérieur et antithèse saisissante entre la liberté lumineuse d’autrefois et la captivité glacée d’aujourd’hui sous l’obsession de la mort.',
      actionAr: 'مونولوج داخلي ومقارنة صادمة بين حرية الماضي البهية وأسر الحاضر المرير تحت وطأة فكرة الإعدام.',
      themeCleFr: 'L’angoisse existentielle, l’obsession de la mort, l’enfermement, le plaidoyer abolitionniste.',
      themeCleAr: 'العذاب النفسي، الفكرة المهيمنة، القيد والزنزانة، والدعوة لإلغاء عقوبة الإعدام.',
      enjeuDramatique: 'Poser les bases de la torture morale, pire que le supplice physique de la guillotine.',
    },
    where: {
      lieuFr: 'Le cachot humide de la prison de Bicêtre à Paris',
      lieuAr: 'زنزانة سجن بيسيتر الرطبة بباريس',
      valeurSymbolique: 'Antichambre de la mort, tombeau vivant où la société séquestre ses coupables.',
    },
    when: {
      momentOeuvreFr: 'Au tout début du roman à thèse (Chapitre I)',
      momentOeuvreAr: 'في مستهل الرواية ذات الأطروحة (الفصل الأول)',
      evenementPrecedentFr: "Le procès aux assises cinq semaines plus tôt, où le verdict de mort a été prononcé contre le narrateur.",
      evenementPrecedentAr: 'محاكمته في محكمة الجنايات قبل خمسة أسابيع ونطق القاضي بحكم الإعدام بالمقصلة في حقه.',
      evenementSuivantFr: "Le condamné décrit son cachot sordide, les gardiens et les inscriptions lapidaires laissées par d'anciens suppliciés sur les murs.",
      evenementSuivantAr: 'وصف السجين لزنزانته البائسة، سلوك الحراس، والنقوش الجدارية التي تركها المحكومون السابقون.',
    },
    modelAnswers: {
      methodeEvenementielleFr: "Ce texte constitue l'incipit du roman à thèse 'Le Dernier Jour d'un Condamné' de Victor Hugo, publié en 1829. Il se situe cinq semaines après le verdict de condamnation à mort rendu par la cour d'assises, et précède la description du cachot de Bicêtre et de ses inscriptions murales. Dans ce monologue intérieur, le narrateur exprime la torture psychologique constante causée par l'obsession de son exécution prochaine.",
      methodeEvenementielleAr: "يمثل هذا النص استهلال الرواية ذات الأطروحة 'آخر يوم لمحكوم عليه بالإعدام' لفيكتور هوغو الصادرة سنة 1829. ويقع بعد خمسة أسابيع من نطق محكمة الجنايات بحكم الإعدام، وقبل وصف زنزانة بيسيتر والكتابات الجدارية للمعدومين. يعبر فيه السجين عن عذابه النفسي القاتل تحت وطأة الفكرة الثابتة التي تطارده ليل نهار.",
      methodeGlobaleFr: "Cet extrait ouvre le roman engagé de Victor Hugo, 'Le Dernier Jour d'un Condamné'. Enfermé dans sa cellule de Bicêtre, le prisonnier anonyme médite sur son sort et dévoile l'emprise destructrice de l'idée de mort sur son esprit.",
      methodeGlobaleAr: "يفتتح هذا المقتطف الرواية الملتزمة لفيكتور هوغو 'آخر يوم لمحكوم عليه بالإعدام'. فمن داخل زنزانته بسجن بيسيتر، يتأمل السجين المجهول الهوية مصيره القاتم كاشفاً عن السطوة المدمرة لفكرة الموت على عقله.",
    },
    examTips: [
      "حدد الجنس الأدبي بدقة: Roman à thèse (رواية أطروحة) تهدف إلى إلغاء عقوبة الإعدام (Abolition de la peine de mort).",
      "أبرز مفهوم 'الفكرة الثابتة' (L'idée fixe) التي تلازمه منذ 5 أسابيع في بيسيتر.",
    ],
  },
  {
    id: '4w-cnd-ch43-fille-marie',
    bookId: 'le_dernier_jour_dun_condamne',
    chapterNumber: 43,
    chapterTitle: 'Chapitre XLIII',
    chapterTitleArabic: 'الفصل الثالث والأربعون',
    passageTitle: 'La visite déchirante de Marie (زيارة ابنته ماري)',
    passageTitleArabic: 'زيارة ماري المأساوية وعدم تعرفها على أبيها',
    pageNumber: 82,
    frenchExcerpt: 'Marie est venue. Elle est fraîche, rose, elle a de grands yeux. Je l’ai prise dans mes bras : « Marie ! Reconnais-tu ton papa ? » Elle m’a regardé avec étonnement et a dit : « Ah non ! Mon papa est mort... » Mon cœur s’est brisé.',
    arabicExcerpt: 'لقد جاءت ماري. كانت نضرة، وردية الخدين، واسعة العينين. ضممتها إلى صدري: «ماري! ألا تعرفين أباك؟» فنظرت إلي باستغراب وقالت: «كلا! أبي قد مات...» فانفطر قلبي أشلاء.',
    who: {
      quiParle: 'Le Condamné et sa petite fille Marie (âgée de trois ans)',
      aQui: 'Dialogue pathétique entre le père captif et sa fille innocente',
      personnagesPresents: ['Le Condamné à mort', 'Sa fille Marie (3 ans)'],
      roleEtStatut: 'Dernier lien affectif du condamné avec la vie sur Terre',
      explicationAr: 'حوار مفجع بين الأب المحكوم بالإعدام وطفلته البريئة ذات السنوات الثلاث التي نسيت ملامحه.',
    },
    what: {
      actionFr: 'L’ultime rencontre entre le père et son enfant, où la petite fille affirme innocemment que son père est déjà mort, brisant le dernier espoir du condamné.',
      actionAr: 'اللقاء الأخير بين الأب وطفلته، حيث أخبرته ببراءة أن والدها قد مات، مما حطم آخر أمل وتشبت له بالحياة.',
      themeCleFr: 'Le pathétique extrême, l’injustice envers les innocents, la déchirure filiale, la mort civile.',
      themeCleAr: 'التراجيديا العاطفية، معاقبة الأبرياء من أسر المحكومين، واليتم المبكر الناتج عن المقصلة.',
      enjeuDramatique: 'Le coup de grâce moral avant le supplice physique de l’échafaud.',
    },
    where: {
      lieuFr: 'Une chambre de la prison de la Conciergerie à Paris',
      lieuAr: 'غرفة احتجاز بسجن الكونسيرجيري بباريس',
      valeurSymbolique: 'Lieu de transition froide avant le transfert final vers la place de Grève.',
    },
    when: {
      momentOeuvreFr: 'À la fin du roman (Chapitre XLIII, quelques heures avant l’exécution)',
      momentOeuvreAr: 'في أواخر الرواية (الفصل 43، ساعات معدودة قبل المقصلة)',
      evenementPrecedentFr: "Le transfert angoissant du condamné de Bicêtre à la Conciergerie et l'annonce de l'exécution fixée à seize heures (4h de l'après-midi).",
      evenementPrecedentAr: 'نقل السجين المرعب من سجن بيسيتر إلى الكونسيرجيري وإبلاغه بتحديد موعد الإعدام في الرابعة بعد الزوال.',
      evenementSuivantFr: "Le condamné renonce à toute compassion humaine, est conduit à l'Hôtel de Ville pour faire sa toilette funèbre avant l'échafaud.",
      evenementSuivantAr: 'يأس السجين من أي رجاء، واقتياده نحو بلدية باريس لإجراء طقوس الإعدام وحلق شعر العنق.',
    },
    modelAnswers: {
      methodeEvenementielleFr: "Ce passage pathétique se situe au Chapitre XLIII du roman 'Le Dernier Jour d'un Condamné' de Victor Hugo. Il prend place après le transfert du prisonnier de Bicêtre à la Conciergerie et l'échec de son pourvoi en grâce, et précède son départ ultime vers l'Hôtel de Ville et la guillotine en place de Grève. Dans cet extrait, le condamné reçoit la visite de sa fillette Marie de trois ans, qui ne le reconnaît pas et déclare que son père est déjà mort.",
      methodeEvenementielleAr: "يقع هذا المقطع المؤثر في الفصل 43 من 'آخر يوم لمحكوم عليه بالإعدام' لفيكتور هوغو. ويتموضع بعد ترحيل السجين من بيسيتر إلى الكونسيرجيري ورفض طلب العفو، وقبل اقتياده الأخير إلى بلدية باريس ومن ثم إلى المقصلة بساحة الغريف. يصور المقطع زيارة طفلته ماري ذات الثلاث سنوات التي أنكرت معرفته معلنة أن أباها قد مات.",
      methodeGlobaleFr: "Cet extrait poignant appartient au Chapitre XLIII de l'œuvre de Victor Hugo. À la prison de la Conciergerie, quelques heures avant son exécution, le condamné voit sa fille Marie pour la dernière fois, subissant la torture suprême d'être déjà mort dans l'esprit de son propre enfant.",
      methodeGlobaleAr: "ينتمي هذا النص المفجع إلى الفصل 43 من مؤلف فيكتور هوغو. ففي سجن الكونسيرجيري وقبل ساعات قليلة من قطع رأسه، يستقبل المحكوم ابنته ماري للمرة الأخيرة ليعيش العذاب الأقصى بموته رمزياً في ذاكرة فلذة كبده.",
    },
    examTips: [
      "بين اسم السجن في هذا الفصل: La Conciergerie (وليس Bicêtre).",
      "أبرز سن الطفلة ماري: 3 ans (trois ans).",
      "بين كيف يستخدم فيكتور هيغو هذه المشهدية لإدانة عقوبة الإعدام التي تصنع اليتامى الأبرياء.",
    ],
  },
];

/**
 * Filter 4W entries by book
 */
export function getFourWEntriesForBook(bookId: BookId): FourWEntry[] {
  return FOUR_W_PASSAGES.filter((p) => p.bookId === bookId);
}

/**
 * Get single 4W entry by ID
 */
export function getFourWEntryById(id: string): FourWEntry | undefined {
  return FOUR_W_PASSAGES.find((p) => p.id === id);
}

/**
 * Dynamic custom formula generator
 */
export function generateCustomFourWFormula(params: {
  workTitleFr: string;
  authorFr: string;
  publicationYear: string;
  whoFr: string;
  whatFr: string;
  whereFr: string;
  whenPrecededFr: string;
  whenFollowsFr: string;
  formulaType: 'evenementielle' | 'globale';
}): string {
  const { workTitleFr, authorFr, publicationYear, whoFr, whatFr, whereFr, whenPrecededFr, whenFollowsFr, formulaType } = params;

  if (formulaType === 'evenementielle') {
    return `Ce passage est extrait de l'œuvre '${workTitleFr}' écrite par ${authorFr} (${publicationYear}). Il se situe juste après que ${whenPrecededFr || '[événement précédent]'}, et avant que ${whenFollowsFr || '[événement suivant]'}. Dans cet extrait, ${whoFr || '[personnage principal]'} se trouve à ${whereFr || '[lieu de la scène]'} et ${whatFr || '[action principale]'}.`;
  } else {
    return `Cet extrait s'insère dans l'œuvre '${workTitleFr}' de ${authorFr}. Après avoir été confronté à ${whenPrecededFr || '[situation initiale]'}, ${whoFr || '[les protagonistes]'} se trouve à ${whereFr || '[lieu]'} où ${whatFr || '[l’action se déroule]'}.`;
  }
}
