import { BookId } from '../types';

export interface PassageQuizQuestion {
  questionFrench: string;
  questionArabic: string;
  type: 'chapter' | 'before' | 'after' | 'characters' | 'significance';
  options: string[];
  correctIndex: number;
  explanationArabic: string;
  explanationFrench: string;
}

export interface NovelPassage {
  id: string;
  bookId: BookId;
  chapterNumber: number;
  chapterTitle: string;
  chapterTitleArabic: string;
  pageNumber: number;
  title: string;
  titleArabic: string;
  frenchExcerpt: string;
  arabicTranslation: string;
  characters: string[];
  location: string;
  locationArabic: string;
  // Situation du passage - Eléments clés pour l'examen régional
  whatPrecededFrench: string;
  whatPrecededArabic: string;
  whatFollowsFrench: string;
  whatFollowsArabic: string;
  regionalExamModelSituationFrench: string;
  regionalExamModelSituationArabic: string;
  keyThemes: string[];
  questions: PassageQuizQuestion[];
}

export const NOVEL_PASSAGES: NovelPassage[] = [
  // ==========================================
  // LA BOÎTE À MERVEILLES
  // ==========================================
  {
    id: 'lbm-ch1-bain-maure',
    bookId: 'la_boite_a_merveilles',
    chapterNumber: 1,
    chapterTitle: 'Chapitre I',
    chapterTitleArabic: 'الفصل الأول',
    pageNumber: 3,
    title: 'Le Bain Maure (الحمام الشعبي)',
    titleArabic: 'طقوس الحمام الشعبي وعذاب سيدي محمد',
    frenchExcerpt: 'Le lendemain, ma mère me réveilla de bonne heure pour aller au bain maure. C’était pour moi un lieu de supplice. Je croyais y voir des démons gesticuler dans la vapeur tiède. Les femmes criaient, s’invectivaient, faisaient un vacarme d’enfer...',
    arabicTranslation: 'في الغداة، أيقظتني أمي باكراً للذهاب إلى الحمام الشعبي. كان بالنسبة لي مكاناً للعذاب الشديد. كنت أحسب أنني أرى شياطين تلوح وسط البخار الفاتر. كانت النساء يصرخن ويتشاتمن ويحدثن جلبة جهنمية...',
    characters: ['Sidi Mohamed', 'Lalla Zoubida (sa mère)', 'Les femmes du quartier'],
    location: 'Le bain maure à Fès',
    locationArabic: 'الحمام الشعبي بفاس',
    whatPrecededFrench: "Le narrateur adulte se souvient de sa solitude d'enfant de six ans à Dar Chouafa et de son monde imaginaire avec la boîte à merveilles.",
    whatPrecededArabic: 'تذكر الراوي الراشد لعزلته وطفولته في سن السادسة بدار الشوافة وعالمه الخيالي مع علبة العجائب وسكان الدار.',
    whatFollowsFrench: "Le retour à la maison et l'éclatement d'une violente dispute entre Lalla Zoubida et sa voisine Rahma le lendemain au sujet de la lessive.",
    whatFollowsArabic: 'العودة إلى المنزل واندلاع شجار عنيف بالشتائم بين لالة زبيدة وجارتها رحمة بسبب يوم الغسيل على السطح.',
    regionalExamModelSituationFrench: "Ce passage se situe au début du premier chapitre de 'La Boîte à Merveilles' d'Ahmed Sefrioui. Après avoir présenté Dar Chouafa et évoqué sa solitude d'enfant, le narrateur raconte sa pénible visite au bain maure avec sa mère Lalla Zoubida, avant que n'éclate le lendemain la dispute entre sa mère et Rahma.",
    regionalExamModelSituationArabic: "يقع هذا المقطع في مستهل الفصل الأول من رواية 'علبة العجائب' لأحمد الصفريوي. بعد تقديم دار الشوافة واستحضار عزلته، يصف الراوي تجربته المؤلمة في الحمام الشعبي رفقة أمه لالة زبيدة، وذلك قبل اندلاع الشجار العنيف بين أمه وجارتها رحمة في الغداة.",
    keyThemes: ['Solitude', 'Regard d’enfant', 'Traditions'],
    questions: [
      {
        questionFrench: "À quel chapitre de l'œuvre appartient ce passage sur le bain maure ?",
        questionArabic: "إلى أي فصل من الرواية ينتمي هذا المقطع الخاص بالحمام الشعبي؟",
        type: 'chapter',
        options: ['Chapitre I (الفصل الأول)', 'Chapitre III (الفصل الثالث)', 'Chapitre V (الفصل الخامس)', 'Chapitre VII (الفصل السابع)'],
        correctIndex: 0,
        explanationArabic: "يقع هذا المقطع في الفصل الأول عندما أخذت لالة زبيدة ابنها سيدي محمد إلى الحمام الشعبي.",
        explanationFrench: "Ce passage appartient au Chapitre I de La Boîte à Merveilles."
      },
      {
        questionFrench: "Quel événement important s'est produit juste AVANT ce passage ?",
        questionArabic: "ما هو الحدث الذي سبق هذا المقطع مباشرة؟",
        type: 'before',
        options: [
          'تقديم الراوي لدار الشوافة ووصف عزلته وعلبة عجائبه',
          'شجار لالة زبيدة مع رحمة حول يوم الغسيل',
          'ضياع زينب في زحام الشوارع',
          'سفر المعلم عبد السلام إلى الحصاد'
        ],
        correctIndex: 0,
        explanationArabic: "افتتح أحمد الصفريوي الرواية بتقديم الراوي سيدي محمد وعزلته ووصف دار الشوافة وسكانها.",
        explanationFrench: "Le narrateur a d'abord présenté Dar Chouafa, les locataires et son sentiment de solitude."
      },
      {
        questionFrench: "Quel événement majeur se déroule juste APRÈS ce passage ?",
        questionArabic: "ما هو الحدث الرئيسي الذي وقع بعد هذا المقطع مباشرة؟",
        type: 'after',
        options: [
          'اندلاع شجار حاد وعنيف بين لالة زبيدة ورحمة في يوم الاثنين بسبب حبل الغسيل',
          'زيارة ضريح سيدي علي بوغالب',
          'وفاة سيدي محمد بن الطاهر مصفف الشعر',
          'شراء مصباح البترول'
        ],
        correctIndex: 0,
        explanationArabic: "بعد عودتهما من الحمام، اندلع شجار عنيف يوم الاثنين بين لالة زبيدة ورحمة بسبب نشر الغسيل على السطح.",
        explanationFrench: "Le lendemain (lundi), une violente dispute éclate entre Lalla Zoubida et Rahma à propos de la lessive."
      }
    ]
  },
  {
    id: 'lbm-ch2-sidi-ali-boughaleb',
    bookId: 'la_boite_a_merveilles',
    chapterNumber: 2,
    chapterTitle: 'Chapitre II',
    chapterTitleArabic: 'الفصل الثاني',
    pageNumber: 10,
    title: 'Visite à Sidi Ali Boughaleb (زيارة ضريح سيدي علي بوغالب)',
    titleArabic: 'زيارة ضريح سيدي علي بوغالب وخمش القط للطفل',
    frenchExcerpt: 'Nous arrivâmes au sanctuaire de Sidi Ali Boughaleb. Ma mère et Lalla Aïcha baisèrent le seuil avec dévotion. Les femmes buvaient de l’eau tiède de la fontaine sacrée. Soudain, un gros chat roux m’attaqua et me griffa la joue. Mes cris alertèrent toute l’assemblée...',
    arabicTranslation: 'وصلنا إلى روضة سيدي علي بوغالب. قبلت أمي ولالة عائشة العتبة بخشوع. كانت النساء يشربن من ماء النافورة المقدسة الفاتر. فجأة، هاجمني قط أصهب ضخم وخمش خدي، فملأت صرخاتي المكان واستنفرت كل الحاضرين...',
    characters: ['Sidi Mohamed', 'Lalla Zoubida', 'Lalla Aïcha', 'Le Moqaddem'],
    location: 'Sanctuaire de Sidi Ali Boughaleb à Fès',
    locationArabic: 'ضريح سيدي علي بوغالب بفاس',
    whatPrecededFrench: "Le triste mardi au Msid où le Fqih était particulièrement sévère, puis la visite de Lalla Aïcha venue trouver Lalla Zoubida souffrante.",
    whatPrecededArabic: 'يوم الثلاثاء الكئيب في المسيد وقسوة الفقيه، ثم زيارة لالة عائشة لصديقتها لالة زبيدة واقتراحها زيارة الضريح للتبرك والتداوي.',
    whatFollowsFrench: "Le narrateur reste alité deux jours pour se reposer, et Rahma lui offre un cabochon de verre pour se réconcilier.",
    whatFollowsArabic: 'مكوث سيدي محمد في الفراش يومين للراحة بعد حادثة القط، وإهداء رحمة كابوشون الزجاج له كعربون صلح ومودة.',
    regionalExamModelSituationFrench: "Ce passage extrait du Chapitre II de 'La Boîte à Merveilles' relate la visite au sanctuaire de Sidi Ali Boughaleb. Après un pénible mardi au Msid et la visite de Lalla Aïcha, les deux femmes emmènent l'enfant au sanctuaire où il est griffé par un chat, ce qui lui vaudra deux jours de repos à la maison.",
    regionalExamModelSituationArabic: "يقع هذا المقطع ضمن الفصل الثاني من رواية 'علبة العجائب'. بعد يوم الثلاثاء الشاق بالمسيد واقتراح لالة عائشة زيارة الولي الصالح للتبرك، رافقها سيدي محمد وأمه إلى ضريح سيدي علي بوغالب حيث خمش القط وجهه، مما منحه يومين من العطلة بالبيت.",
    keyThemes: ['Superstition', 'Rituels', 'Maladie'],
    questions: [
      {
        questionFrench: "Dans quel chapitre se déroule la visite au sanctuaire de Sidi Ali Boughaleb ?",
        questionArabic: "في أي فصل تجري أحداث زيارة ضريح سيدي علي بوغالب؟",
        type: 'chapter',
        options: ['Chapitre II (الفصل الثاني)', 'Chapitre IV (الفصل الرابع)', 'Chapitre VI (الفصل السادس)', 'Chapitre VIII (الفصل الثامن)'],
        correctIndex: 0,
        explanationArabic: "زيارة سيدي علي بوغالب تقع في الفصل الثاني بعد تعب المسيد واقتراح لالة عائشة.",
        explanationFrench: "La visite au sanctuaire de Sidi Ali Boughaleb a lieu au Chapitre II."
      },
      {
        questionFrench: "Quelle était la cause de cette visite au sanctuaire ?",
        questionArabic: "ما هو الدافع والسبب وراء هذه الزيارة للضريح؟",
        type: 'before',
        options: [
          'علاج صداع ووعكة لالة زبيدة وتعب سيدي محمد باقتراح من لالة عائشة',
          'البحث عن زينب المفقودة',
          'شراء أساور الذهب للشمس والقمر',
          'الاحتفال بيوم عاشوراء'
        ],
        correctIndex: 0,
        explanationArabic: "جاءت الزيارة للتبرك وعلاج الصداع وسوء الحظ الذي أصاب لالة زبيدة وابنها.",
        explanationFrench: "Lalla Aïcha a conseillé la visite pour soigner Lalla Zoubida et son fils fatigués."
      },
      {
        questionFrench: "Quel cadeau Rahma offre-t-elle à Sidi Mohamed après son rétablissement ?",
        questionArabic: "ما هي الهدية التي قدمتها رحمة لسيدي محمد بعد تعافيه من خمش القط؟",
        type: 'after',
        options: [
          'كابوشون من الزجاج الشفاف (Un cabochon de verre)',
          'سلسلة نحاسية جميلة',
          'مصباح بترول جديد',
          'بندير لعاشوراء'
        ],
        correctIndex: 0,
        explanationArabic: "أهدت رحمة سيدي محمد كابوشون زجاجي وضعه مباشرة داخل علبة عجائبه.",
        explanationFrench: "Rahma lui a offert un cabochon de verre facetté qui a rejoint sa boîte à merveilles."
      }
    ]
  },
  {
    id: 'lbm-ch3-perte-zineb',
    bookId: 'la_boite_a_merveilles',
    chapterNumber: 3,
    chapterTitle: 'Chapitre III',
    chapterTitleArabic: 'الفصل الثالث',
    pageNumber: 18,
    title: 'La disparition de Zineb et la charité (ضياع زينب والصدقة)',
    titleArabic: 'اختفاء زينب في زحام الرصيف وتضامن نساء الحي',
    frenchExcerpt: 'Soudain, des cris déchirèrent le crépuscule. Rahma montait les escaliers en hurlant : « Zineb est perdue ! Ma fille a disparu dans la foule ! » Toutes les femmes se mirent à pleurer et à se lamenter par solidarité...',
    arabicTranslation: 'فجأة، مزقت صرخات مرعبة سكون المساء. كانت رحمة تصعد الدرج وهي تولول: «لقد ضاعت زينب! ابنتي اختفت في الزحام!» فانخرطت جميع نساء الدار في البكاء والنواح تضامناً معها...',
    characters: ['Rahma', 'Zineb', 'Lalla Zoubida', 'Fatma Bziouiya', 'Sidi Mohamed'],
    location: 'Dar Chouafa & Quartier R’cif à Fès',
    locationArabic: 'دار الشوافة وحي الرصيف بفاس',
    whatPrecededFrench: "Lalla Zoubida admire la nouvelle lampe à pétrole de Fatma Bziouya, ce qui pousse Maâlem Abdeslem à en acheter une pour leur chambre.",
    whatPrecededArabic: 'إعجاب لالة زبيدة بمصباح البترول لدى فاطمة البزيوية واقتناء المعلم عبد السلام لمصباح مماثل لغرفتهما.',
    whatFollowsFrench: "Zineb est retrouvée à Dar Qitoun (asile d'orphelins). En signe de gratitude, Rahma organise un grand repas de charité pour les pauvres et les mendiants aveugles.",
    whatFollowsArabic: 'العثور على زينب بدار قيطون وإقامة رحمة وليمة صدقة كبرى للفقراء والعميان شكراً لله.',
    regionalExamModelSituationFrench: "Cet extrait se situe au Chapitre III de 'La Boîte à Merveilles'. Après l'achat de la lampe à pétrole, Rahma perd sa fille Zineb lors d'un baptême. Lalla Zoubida oublie leur ancienne querelle et part à sa recherche. Après avoir retrouvé l'enfant à Dar Qitoun, Rahma prépare un grand repas pour les mendiants.",
    regionalExamModelSituationArabic: "يقع هذا المقطع في الفصل الثالث من 'علبة العجائب'. بعد شراء مصباح البترول، تفقد رحمة ابنتها زينب فتتضامن معها لالة زبيدة وتنسى خلافهما. بعد العثور على الطفلة بدار قيطون، تقيم رحمة صدقة للفقراء.",
    keyThemes: ['Solidarité marocaine', 'Charité', 'Réconciliation'],
    questions: [
      {
        questionFrench: "Où a-t-on finalement retrouvé la petite Zineb ?",
        questionArabic: "أين تم العثور في النهاية على الطفلة زينب المفقودة؟",
        type: 'after',
        options: [
          'À Dar Qitoun (دار قيطون - مأوى الأطفال)',
          'Au sanctuaire de Sidi Ali Boughaleb',
          'Dans la boutique du coiffeur',
          'Au sanctuaire de Moulay Idriss'
        ],
        correctIndex: 0,
        explanationArabic: "وجدت لالة زبيدة ونساء الحي الطفلة زينب في دار قيطون الخاصة بالأطفال الضائعين.",
        explanationFrench: "Zineb a été retrouvée saine et sauve à Dar Qitoun."
      },
      {
        questionFrench: "Que fait Rahma pour remercier Dieu d'avoir retrouvé sa fille ?",
        questionArabic: "ماذا فعلت رحمة شكراً لله بعد عودة ابنتها سالمة؟",
        type: 'after',
        options: [
          'نظمت وليمة صدقة كبرى وإطعاماً للفقراء والمكفوفين (Repas de charité)',
          'اشترت دجاجتين للفقيه',
          'باعت حليها الذهبية',
          'سافرت إلى البادية'
        ],
        correctIndex: 0,
        explanationArabic: "أعدت رحمة وجبة كسكس بلحم البقر وأطعمت جمعاً كبيراً من فقراء ومكفوفي فاس.",
        explanationFrench: "Rahma a organisé une grande distribution de couscous aux mendiants aveugles."
      }
    ]
  },
  {
    id: 'lbm-ch8-souk-bijoux',
    bookId: 'la_boite_a_merveilles',
    chapterNumber: 8,
    chapterTitle: 'Chapitre VIII',
    chapterTitleArabic: 'الفصل الثامن',
    pageNumber: 62,
    title: 'La dispute au Souk des Bijoutiers (عراك سوق الصياغ)',
    titleArabic: 'شجار المعلم عبد السلام مع الدلال في سوق الحلي',
    frenchExcerpt: 'Au Souk des Bijoutiers, mon père marchanda les bracelets soleil et lune. Le courtier voulut le duper et l’insulta. Une bagarre sanglante éclata aussitôt. Mon père revint le visage tuméfié avec les bracelets, mais ma mère les refusa, disant qu’ils portaient malheur...',
    arabicTranslation: 'في سوق الصياغ، ساوم والدي على أساور الشمس والقمر. حاول السمسار خداعه وشتمه، فاندلعت معركة دامية سالت فيها الدماء. عاد أبي بوجه متورم ومعه الأساور، لكن أمي رفضت لمسها معتبرة إياها فأل شؤم...',
    characters: ['Maâlem Abdeslem', 'Lalla Zoubida', 'Sidi Mohamed', 'Le Courtier (Dellal)'],
    location: 'Le Souk des Bijoutiers (Souk des Joailliers) à Fès',
    locationArabic: 'سوق الصياغ بفاس',
    whatPrecededFrench: "Le début de la chaleur estivale et le transfert temporaire du Msid dans un sanctuaire plus frais.",
    whatPrecededArabic: 'بداية حر الصيف وانتقال المسيد مؤقتاً إلى ضريح بارد، ورغبة الأب في إهداء زوجته أساور ذهبية.',
    whatFollowsFrench: "Lalla Zoubida refuse de porter les bracelets maudits, et Sidi Mohamed tombe gravement malade.",
    whatFollowsArabic: 'رفض لالة زبيدة للأساور معتبرة إياها نذير شؤم، وإصابة سيدي محمد بحمى ومرض شديد.',
    regionalExamModelSituationFrench: "Cet extrait se situe au Chapitre VIII de 'La Boîte à Merveilles'. Maâlem Abdeslem emmène sa femme et son fils au Souk des Bijoutiers pour acheter des bracelets. Une violente bagarre éclate avec un dellal malhonnête. Cet incident annonce les malheurs à venir du Chapitre IX (la ruine du père).",
    regionalExamModelSituationArabic: "يقع هذا المقطع في الفصل الثامن. رافق المعلم عبد السلام أسرته لشراء أساور الشمس والقمر فوقع شجار عنيف مع الدلال. اعتبرت الأم تلك الحلي نذير شؤم ينبئ بالنكسات التي ستعصف بالأسرة في الفصل التاسع.",
    keyThemes: ['Superstition', 'Fierté', 'Présage du malheur'],
    questions: [
      {
        questionFrench: "Pourquoi Lalla Zoubida refuse-t-elle de porter les bracelets achetés par son mari ?",
        questionArabic: "لماذا رفضت لالة زبيدة ارتداء الأساور التي جلبها زوجها؟",
        type: 'significance',
        options: [
          'لأنها اعتبرتها مجلوبة بالشجار ونذير شؤم ودمار للأسرة (Porte-malheur)',
          'لأنها لم تكن مصنوعة من الذهب الخالص',
          'لأن مقاسها كان ضيقاً جداً',
          'لأنها أرادت بيعها لمساعدة لالة عائشة'
        ],
        correctIndex: 0,
        explanationArabic: "خافت لالة زبيدة من الأساور لأنها جاءت بعد عراك وسيلان دماء، واعتبرتها فأل شؤم.",
        explanationFrench: "Elle les croyait porteuses de mauvais œil et de malheur car elles avaient coûté du sang."
      }
    ]
  },
  {
    id: 'lbm-ch9-ruine-depart',
    bookId: 'la_boite_a_merveilles',
    chapterNumber: 9,
    chapterTitle: 'Chapitre IX',
    chapterTitleArabic: 'الفصل التاسع',
    pageNumber: 70,
    title: 'La ruine du père et son départ aux moissons (إفلاس الأب والرحيل للحصاد)',
    titleArabic: 'فقدان المعلم عبد السلام لرأس ماله وقرار السفر الشاق',
    frenchExcerpt: 'Mon père avait perdu tout son capital dans le souk des tissus. Il entra le soir pâle et brisé. Il nous annonça calmement qu’il devait partir travailler comme moissonneur aux environs de Fès pour reconstituer son atelier. Ce fut le début d’une longue nuit d’angoisse...',
    arabicTranslation: 'فقد والدي كل رأس ماله في سوق الحايك. دخل في المساء شاحباً منكسراً. وأخبرنا بهدوء أنه مضطر للسفر للعمل كحصاد في نواحي فاس لجمع مال يعيد به فتح ورشته. وكانت تلك بداية ليلة طويلة من الحزن والوحشة...',
    characters: ['Maâlem Abdeslem', 'Lalla Zoubida', 'Sidi Mohamed'],
    location: 'La chambre familiale à Dar Chouafa',
    locationArabic: 'غرفة الأسرة بدار الشوافة',
    whatPrecededFrench: "La maladie de Sidi Mohamed et les tensions provoquées par les bracelets achetés au Souk.",
    whatPrecededArabic: 'مرض سيدي محمد بالحمى ورفض الأم للأساور المشؤومة.',
    whatFollowsFrench: "Le départ du père à l'aube, la solitude accablante de la mère et du fils, et les visites de sanctuaires avec Lalla Aïcha.",
    whatFollowsArabic: 'مغادرة الأب مع بزوغ الفجر، شعور الطفل وأمه باليتم والفقر، وبداية زيارة الأولياء بحثاً عن الفرج.',
    regionalExamModelSituationFrench: "Ce passage capital constitue le nœud tragique du Chapitre IX de 'La Boîte à Merveilles'. Après la perte de son argent au souk, Maâlem Abdeslem décide de partir travailler aux moissons pour rembourser ses dettes, laissant sa famille dans un dénuement et une solitude totale.",
    regionalExamModelSituationArabic: "يمثل هذا المقطع العقدة الرئيسية في الفصل التاسع من الرواية. بعد ضياع رأس ماله في سوق الثياب، قرر المعلم عبد السلام السفر للعمل في الحصاد لتوفير رأس مال جديد، تاركاً أسرته في عزلة وضيق مادي خانق.",
    keyThemes: ['Ruine', 'Séparation familiale', 'Dignité et courage'],
    questions: [
      {
        questionFrench: "Quel travail Maâlem Abdeslem part-il accomplir hors de Fès ?",
        questionArabic: "ما هو العمل الذي غادر المعلم عبد السلام فاس من أجله؟",
        type: 'after',
        options: [
          'Moissonneur dans les champs aux environs de Fès (حصاد في الحقول)',
          'Tisserand dans une autre ville',
          'Négociant au port de Tanger',
          'Maître d’école coranique'
        ],
        correctIndex: 0,
        explanationArabic: "اختار المعلم عبد السلام العمل كحصاد في حقول القمح بنواحي فاس لجمع المال بعرق جبينه.",
        explanationFrench: "Il est parti travailler péniblement comme moissonneur dans les campagnes."
      }
    ]
  },
  {
    id: 'lbm-ch12-retour-pere',
    bookId: 'la_boite_a_merveilles',
    chapterNumber: 12,
    chapterTitle: 'Chapitre XII',
    chapterTitleArabic: 'الفصل الثاني عشر',
    pageNumber: 97,
    title: 'Le retour triomphal du père et la fin (عودة الأب وخاتمة الرواية)',
    titleArabic: 'عودة المعلم عبد السلام واكتمال الفرحة وإعادة فتح العلبة',
    frenchExcerpt: 'Zineb monta l’escalier en criant : « Maâlem Abdeslem est de retour ! » Les femmes poussèrent des youyous. Mon père franchit le seuil chargé de provisions. Les voisins affluèrent pour le féliciter. Seul dans mon coin, je rouvris ma boîte à merveilles pour retrouver mes vieux amis...',
    arabicTranslation: 'صعدت زينب الدرج وهي تهتف: «المعلم عبد السلام قد عاد!» فأطلقت النساء الزغاريد. دخل والدي العتبة محملاً بالمؤونة والدجاج. توافد الجيران للمباركة والتهنئة. وفي ركني المنعزل، أعدت فتح علبة عجائبي لأستأنس بأصدقائي الخالدين...',
    characters: ['Maâlem Abdeslem', 'Lalla Zoubida', 'Sidi Mohamed', 'Zineb', 'Allal El Yacoubi'],
    location: 'Dar Chouafa à Fès',
    locationArabic: 'دار الشوافة بفاس',
    whatPrecededFrench: "La visite de Salama la marieuse annonçant le divorce imminent de Moulay Larbi d'avec la fille du coiffeur.",
    whatPrecededArabic: 'زيارة الخاطبة سلامة وبشرى طلاق مولاي العربي من ابنة الحلاق الشرسة وعودته لزوجته لالة عائشة.',
    whatFollowsFrench: "Le dénouement heureux du roman et le retour du narrateur à sa solitude poétique avec sa boîte à merveilles.",
    whatFollowsArabic: 'خاتمة الرواية السعيدة وانعزال سيدي محمد مع أصدقائه الرمزيين في علبة العجائب.',
    regionalExamModelSituationFrench: "Ce passage clôture le roman 'La Boîte à Merveilles' (Chapitre XII). Après un mois d'absence, Maâlem Abdeslem revient avec de l'argent et des vivres. La maison célèbre ce retour et la réconciliation de Moulay Larbi avec Lalla Aïcha. Sidi Mohamed retrouve le bonheur de sa boîte à merveilles.",
    regionalExamModelSituationArabic: "يمثل هذا المقطع خاتمة رواية 'علبة العجائب' (الفصل 12). بعد شهر من الغياب الشاق، عاد المعلم عبد السلام بالمال والمؤونة. عمت الفرحة الدار تزامناً مع استقرار لالة عائشة وزوجها، وعاد سيدي محمد لعزلته الحالمة مع علبته.",
    keyThemes: ['Dénouement heureux', 'Retour à l’ordre', 'Boîte à merveilles'],
    questions: [
      {
        questionFrench: "Par quel geste symbolique se termine le roman 'La Boîte à Merveilles' ?",
        questionArabic: "بأي تصرف رمزي تنتهي رواية 'علبة العجائب' لأحمد الصفريوي؟",
        type: 'after',
        options: [
          'إعادة سيدي محمد فتح علبة عجائبه والاستئناس بأشيائه الصامتة',
          'بيعه لعلبة العجائب وشراء كتب المسيد',
          'سفره مع والده إلى الحصاد',
          'التحاقه بمدرسة عصرية'
        ],
        correctIndex: 0,
        explanationArabic: "تختتم الرواية بفتح الطفل لعلبة عجائبه والشعور بالأنس رفقة أزراره وزجاجه وسلسلته.",
        explanationFrench: "Le roman se clôt sur Sidi Mohamed qui rouvre sa boîte à merveilles, symbole de son monde intime."
      }
    ]
  },

  // ==========================================
  // ANTIGONE (Jean Anouilh)
  // ==========================================
  {
    id: 'ant-prologue',
    bookId: 'antigone',
    chapterNumber: 1,
    chapterTitle: 'Scène 1 (Le Prologue)',
    chapterTitleArabic: 'المشهد الأول: الإستفتاح (Le Prologue)',
    pageNumber: 1,
    title: 'Le Prologue et la présentation des personnages (تقديم الشخوص والمصير)',
    titleArabic: 'افتتاح المسرحية وتقديم الشخوص ومصائرهم التراجيدية',
    frenchExcerpt: 'Le Prologue s’avance : « Voilà. Ces personnages vont vous jouer l’histoire d’Antigone. Antigone, c’est la petite maigre qui est assise là-bas, et qui ne dit rien. Elle regarde droit devant elle. Elle pense. Elle pense qu’elle va être Antigone tout à l’heure, qu’elle va mourir... »',
    arabicTranslation: 'يتقدم البرولوغ: «ها هم. هذه الشخصيات ستؤدي أمامكم قصة أنتيجون. أنتيجون هي تلك الفتاة النحيفة الجالسة هناك، التي لا تنبس ببنت شفة. تنظر للأمام وتفكر. تفكر أنها ستكون أنتيجون بعد قليل، وأنها ستموت...»',
    characters: ['Le Prologue', 'Antigone', 'Créon', 'Hémon', 'Ismène', 'Eurydice', 'Le Messager', 'Les Gardes'],
    location: 'Le palais royal de Thèbes',
    locationArabic: 'القصر الملكي بطيبة',
    whatPrecededFrench: "La guerre fratricide entre Étéocle et Polynice pour le trône de Thèbes, se soldant par leur mort réciproque, suivie de la prise de pouvoir par Créon.",
    whatPrecededArabic: 'الحرب الطاحنة بين الأخوين إيتيوكل وبولينيس من أجل عرش طيبة ومقتلهما معاً، واستيلاء خالهما كريون على الحكم وإصداره مرسوم منع دفن بولينيس.',
    whatFollowsFrench: "La rentrée à l'aube d'Antigone après avoir tenté clandestinement d'enterrer le cadavre de son frère Polynice.",
    whatFollowsArabic: 'دخول أنتيجون خلسة عند الفجر بعد محاولتها الأولى لدفن جثة أخيها بولينيس وتفاجؤ المربية بها.',
    regionalExamModelSituationFrench: "Ce texte constitue la scène d'exposition (Le Prologue) de la tragédie moderne 'Antigone' de Jean Anouilh. Le Prologue brise l'illusion théâtrale et présente chaque personnage, ses traits de caractère et son destin fatal, annonçant d'emblée la mort inéluctable d'Antigone.",
    regionalExamModelSituationArabic: "يمثل هذا النص استهلال مسرحية 'أنتيجون' لجان أنوي. يقدم البرولوغ شخوص المسرحية وطباعهم ومصائرهم التراجيدية الحتمية، معلناً منذ الوهلة الأولى عن موت أنتيجون المحتوم.",
    keyThemes: ['Fatalité tragique', 'Théâtre moderne', 'Destin'],
    questions: [
      {
        questionFrench: "Quel est le rôle principal du Prologue dans cette scène d'exposition ?",
        questionArabic: "ما هو الدور الأساسي لشخصية البرولوغ في هذا المشهد الاستهلالي؟",
        type: 'significance',
        options: [
          'تقديم الشخوص، تلخيص السياق، والإعلان عن المصير المأساوي لأنتيجون مسبقاً',
          'القبض على أنتيجون عند القبر',
          'منع كريون من إصدار حكم الإعدام',
          'تزويج أنتيجون من هيمون'
        ],
        correctIndex: 0,
        explanationArabic: "يقوم البرولوغ بكسر الإيهام المسرحي وتقديم الشخوص وإخبار الجمهور بموت أنتيجون الحتمي.",
        explanationFrench: "Le Prologue présente les personnages et annonce d'emblée la fatalité tragique."
      }
    ]
  },
  {
    id: 'ant-face-a-face-creon',
    bookId: 'antigone',
    chapterNumber: 8,
    chapterTitle: 'Scène 8 (Le Face-à-face)',
    chapterTitleArabic: 'المشهد الثامن: المواجهة الكبرى بين أنتيجون وكريون',
    pageNumber: 58,
    title: 'Le grand affrontement Créon - Antigone (المواجهة الحاسمة)',
    titleArabic: 'صراع الواجب والحرية المطلقة ضد براغماتية السلطة',
    frenchExcerpt: 'Antigone : « Je ne veux pas comprendre ! Moi, je veux tout, tout de suite, et que ce soit entier, ou alors je refuse ! Je ne veux pas être modeste, moi, et me contenter d’un petit morceau si j’ai été bien sage ! » Créon : « Tais-toi ! Tu vas te faire tuer ! »',
    arabicTranslation: 'أنتيجون: «أنا لا أريد أن أفهم! أنا أريد كل شيء، حالاً وبشكل كامل وتام، وإلا فإنني أرفض! لا أريد أن أكون متواضعة وأقنع بقطعة صغيرة لأنني كنت مطيعة!» كريون: «اصمتي! إنك تسوقين نفسك إلى الهلاك!»',
    characters: ['Antigone', 'Créon'],
    location: 'Le palais de Créon à Thèbes',
    locationArabic: 'قصر كريون بطيبة',
    whatPrecededFrench: "L'arrestation d'Antigone par les gardes alors qu'elle recouvrait de terre le corps de Polynice pour la seconde fois.",
    whatPrecededArabic: 'إلقاء الحراس القبض على أنتيجون متلبسة وهي تحفر التراب للمرة الثانية فوق جثة أخيها بولينيس واقتيادها أمام كريون.',
    whatFollowsFrench: "Créon, poussé à bout par l'intransigeance d'Antigone, appelle les gardes et ordonne son emmurement vivant.",
    whatFollowsArabic: 'عجز كريون عن إقناعها بالصمت وإنقاذ حياتها، واضطراره لإصدار أمره بدفنها حية في مغارة صخرية.',
    regionalExamModelSituationFrench: "Cet extrait se situe au cœur de la pièce 'Antigone' de Jean Anouilh. Créon tente d'abord de sauver sa nièce et future belle-fille en étouffant l'affaire. Mais Antigone refuse tous les compromis sur le bonheur bourgeois et revendique son geste au nom de la liberté absolue, ce qui condamne Créon à exécuter la loi.",
    regionalExamModelSituationArabic: "يمثل هذا المشهد ذروة الصراع التراجيدي في المسرحية. حاول الملك كريون التستر على أنتيجون لحمايتها، لكنها رفضت التنازل وتمسكت برفضها للحلول الوسطى والسعادة الزائفة، مجبرة إياه على تطبيق القانون بإعدامها.",
    keyThemes: ['Révolte', 'Refus du compromis', 'Pouvoir vs Idéalisme'],
    questions: [
      {
        questionFrench: "Pourquoi Créon voulait-il au départ étouffer l'affaire et sauver Antigone ?",
        questionArabic: "لماذا أراد كريون في البداية التستر على فعلة أنتيجون وإنقاذ حياتها؟",
        type: 'before',
        options: [
          'لأنها ابنة أخته أوديب وخطيبة ابنه هيمون الذي يحبها بجنون',
          'لأنه خائف من تمرد الشعب',
          'لأنه يحب بولينيس سراً',
          'لأن الحراس لم يروها ترتكب الجرم'
        ],
        correctIndex: 0,
        explanationArabic: "كريون خال أنتيجون، وهي خطيبة ابنه الوحيد هيمون، لذلك حاول التستر عليها والتخلص من الحراس.",
        explanationFrench: "Antigone est sa nièce et la fiancée de son fils Hémon."
      }
    ]
  },

  // ==========================================
  // LE DERNIER JOUR D'UN CONDAMNÉ (Victor Hugo)
  // ==========================================
  {
    id: 'cnd-ch1-condamne-a-mort',
    bookId: 'le_dernier_jour_dun_condamne',
    chapterNumber: 1,
    chapterTitle: 'Chapitre I',
    chapterTitleArabic: 'الفصل الأول: محكوم بالإعدام',
    pageNumber: 1,
    title: 'L’Idée fixe de la Mort (الفكرة المهيمنة: محكوم بالإعدام)',
    titleArabic: 'الفكرة الثابتة التي تطارد السجين: محكوم بالإعدام!',
    frenchExcerpt: '« Condamné à mort ! Voilà cinq semaines que j’habite avec cette pensée, toujours seul avec elle, toujours glacé de sa présence, toujours courbé sous son poids ! Autrefois, mon esprit était plein de fantaisies... Maintenant, je suis captif. Mon corps est aux fers dans un cachot... »',
    arabicTranslation: '«محكوم بالإعدام! ها قد مرت خمسة أسابيع وأنا أساكن هذه الفكرة، وحيداً معها دائماً، متجمداً من وطأة حضورها، منحنياً تحت ثقلها! قديماً، كان عقلي زاخراً بالخيالات والحرية... أما الآن، فأنا أسير. جسدي مقيد بالأصفاد داخل زنزانة...»',
    characters: ['Le Condamné à mort'],
    location: 'Prison de Bicêtre à Paris',
    locationArabic: 'سجن بيسيتر بباريس',
    whatPrecededFrench: "Le procès aux assises et le verdict de la condamnation à mort prononcé contre le narrateur pour un crime de sang.",
    whatPrecededArabic: 'محاكمة الراوي في محكمة الجنايات وصدور حكم الإعدام بالمقصلة في حقه بسبب جريمة ارتكبها في الماضي.',
    whatFollowsFrench: "Le condamné décrit son cachot à Bicêtre, la nourriture infâme et les inscriptions gravées sur les murs par d'anciens détenus.",
    whatFollowsArabic: 'وصف السجين لزنزانته الضيقة ببيسيتر، والكتابات الجدارية التي تركها المحكومون السابقون فوق الجدران.',
    regionalExamModelSituationFrench: "Cet extrait ouvre le plaidoyer humaniste de Victor Hugo 'Le Dernier Jour d'un Condamné' (Chapitre I). Cinq semaines après sa sentence, le narrateur exprime la torture psychologique causée par l'obsession de la mort qui ne le quitte plus jour et nuit dans sa cellule de Bicêtre.",
    regionalExamModelSituationArabic: "يفتتح هذا المقطع رواية فيكتور هوغو المناهضة لعقوبة الإعدام. بعد خمسة أسابيع من نطق الحكم، يصف السجين العذاب النفسي الشديد الناتج عن الفكرة المهيمنة 'محكوم بالإعدام' التي تجثم على صدره داخل زنزانته بسجن بيسيتر.",
    keyThemes: ['Obsession de la mort', 'Torture morale', 'Plaidoyer abolitionniste'],
    questions: [
      {
        questionFrench: "Dans quelle prison parisienne le condamné se trouve-t-il au Chapitre I ?",
        questionArabic: "في أي سجن باريسي يتواجد المحكوم عليه بالإعدام في الفصل الأول؟",
        type: 'chapter',
        options: ['Prison de Bicêtre (سجن بيسيتر)', 'La Conciergerie (الكونسيرجيري)', 'Prison de La Roquette', 'L’Hôtel de Ville'],
        correctIndex: 0,
        explanationArabic: "يبدأ السجين مذكراته من سجن بيسيتر حيث يقضي فترة الاستئناف والنقض.",
        explanationFrench: "Le narrateur commence son journal à la prison de Bicêtre."
      },
      {
        questionFrench: "Quel est l'objectif philosophique et politique majeur de Victor Hugo à travers ce texte ?",
        questionArabic: "ما هو الهدف الفكري والسياسي الرئيسي لفيكتور هيغو من وراء هذه الرواية؟",
        type: 'significance',
        options: [
          'المطالبة بإلغاء عقوبة الإعدام وإظهار وحشيتها النفسية والجسدية (Abolition de la peine de mort)',
          'تمجيد العدالة القضائية الفرنسية',
          'الدفاع عن القتلة والمجرمين',
          'وصف المعالم السياحية لمدينة باريس'
        ],
        correctIndex: 0,
        explanationArabic: "كتب فيكتور هيغو الرواية كمرافعة إنسانية ضد عقوبة الإعدام والمطالبة بإلغائها نهائياً.",
        explanationFrench: "Victor Hugo a écrit cette œuvre pour abolir la peine de mort en montrant la torture morale du condamné."
      }
    ]
  },
  {
    id: 'cnd-ch43-visite-fille-marie',
    bookId: 'le_dernier_jour_dun_condamne',
    chapterNumber: 43,
    chapterTitle: 'Chapitre XLIII',
    chapterTitleArabic: 'الفصل الثالث والأربعون: زيارة ابنته ماري',
    pageNumber: 48,
    title: 'La visite de la petite Marie (زيارة الابنة ماري وعدم تعرفها على أبيها)',
    titleArabic: 'صدمة الأب عندما لم تتعرف عليه ابنته الصغيرة ماري',
    frenchExcerpt: 'Marie est entrée. Elle est fraîche, rose, avec de grands yeux innocents. Je l’ai prise dans mes bras : « Marie ! Reconnais-tu ton papa ? » Elle m’a regardé avec effroi et m’a dit : « Ah non ! Mon papa est mort ! » Mon cœur s’est brisé...',
    arabicTranslation: 'دخلت ماري. كانت نضرة وموردة الخدين بعينين بريئتين واسعتين. حملتها بين ذراعي: «ماري! ألا تعرفين أباكِ؟» فنظرت إليّ برعب وقالت: «كلا! أبي قد مات!» فتحطم قلبي أشلاء...',
    characters: ['Le Condamné', 'Sa fille Marie (3 ans)'],
    location: 'Une cellule de la Conciergerie / Mairie de Paris',
    locationArabic: 'مبنى بلدية باريس / قاعة الكونسيرجيري',
    whatPrecededFrench: "Le transfert du condamné de Bicêtre à la Conciergerie, puis à l'Hôtel de Ville à quelques heures de l'échafaud.",
    whatPrecededArabic: 'نقل السجين من بيسيتر إلى الكونسيرجيري ثم إلى مبنى بلدية باريس قبل ساعات معدودة من تنفيذ الإعدام بساحة الغريف.',
    whatFollowsFrench: "Le départ désespéré de l'enfant et les derniers préparatifs du bourreau pour la toilette du condamné avant la guillotine.",
    whatFollowsArabic: 'خروج الطفلة تاركة والدها محطم الفؤاد، وبدء الجلاد في قص شعر رقبته وتجريده من ملابسه تمهيداً للمقصلة.',
    regionalExamModelSituationFrench: "Ce passage pathétique du Chapitre XLIII représente le comble de la tragédie intime du condamné. À quelques heures de son exécution en place de Grève, il reçoit la visite de sa fille de trois ans, mais celle-ci ne le reconnaît plus et affirme que son père est mort, ce qui lui ôte son dernier espoir.",
    regionalExamModelSituationArabic: "يمثل هذا المقطع المؤثر من الفصل 43 ذروة المأساة الإنسانية للمحكوم. قبل ساعات من إعدامه بساحة الغريف، زارته طفلته ماري ذات الثلاث سنوات، لكنها لم تتعرف عليه وأخبرته أن أباها قد مات، مما حطم آخر خيط أمل وتعلق بالحياة.",
    keyThemes: ['Paternité brisée', 'Pathétique', 'Désespoir absolu'],
    questions: [
      {
        questionFrench: "Quel âge a la petite fille du condamné, Marie ?",
        questionArabic: "كم كان عمر الطفلة ماري ابنة المحكوم عليه بالإعدام؟",
        type: 'characters',
        options: ['3 ans (ثلاث سنوات)', '6 ans (ست سنوات)', '10 ans (عشر سنوات)', '14 ans (أربعة عشر سنة)'],
        correctIndex: 0,
        explanationArabic: "كان عمر ماري ثلاث سنوات، ولهذا لم تتذكر ملامح والدها المحبوس منذ أشهر.",
        explanationFrench: "Marie est âgée de trois ans."
      },
      {
        questionFrench: "Quelle réplique de Marie brise définitivement le cœur de son père ?",
        questionArabic: "ما هي الجملة التي نطقت بها ماري فحطمت فؤاد والدها نهائياً؟",
        type: 'significance',
        options: [
          '«كلا، لست أبي، فأبي قد مات!» («Non ! Mon papa est mort !»)',
          '«أريد أن أذهب معك إلى البيت!»',
          '«أين هي أمي وجدتي؟»',
          '«لماذا أنت مكبل بالحديد؟»'
        ],
        correctIndex: 0,
        explanationArabic: "أخبرته ماري ببراءة طفولية أن أباها قد مات، مما جعله يشعر بأنه ميت في عيون أحبائه حتى قبل قطع رأسه.",
        explanationFrench: "Elle lui dit froidement que son père est déjà mort, anéantissant sa dernière raison de vivre."
      }
    ]
  }
];

export function getPassagesForBook(bookId: BookId): NovelPassage[] {
  return NOVEL_PASSAGES.filter((p) => p.bookId === bookId);
}

export function getPassagesForChapter(bookId: BookId, chapterNumber: number): NovelPassage[] {
  return NOVEL_PASSAGES.filter((p) => p.bookId === bookId && p.chapterNumber === chapterNumber);
}

export function getPassageById(passageId: string): NovelPassage | undefined {
  return NOVEL_PASSAGES.find((p) => p.id === passageId);
}
