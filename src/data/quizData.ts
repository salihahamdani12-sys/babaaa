export interface QuizQuestion {
  id: number;
  workId: 'boite-a-merveilles' | 'antigone' | 'dernier-jour';
  workTitle: string;
  category: 'Situation du passage' | 'Figure de style' | 'Compréhension' | 'Registre & Focalisation';
  question: string;
  questionAr: string;
  contextText?: string;
  options: string[];
  correctIndex: number;
  explanationFr: string;
  explanationAr: string;
  examRegion?: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    workId: 'boite-a-merveilles',
    workTitle: 'La Boîte à Merveilles',
    category: 'Compréhension',
    question: "À quel genre littéraire appartient 'La Boîte à Merveilles' d'Ahmed Sefrioui ?",
    questionAr: "إلى أي جنس أدبي تنتمي رواية 'علبة العجائب' لأحمد الصفريوي؟",
    options: [
      "Une pièce de théâtre tragique",
      "Un roman autobiographique",
      "Un roman de science-fiction",
      "Un conte philosophique"
    ],
    correctIndex: 1,
    explanationFr: "La Boîte à Merveilles est un roman autobiographique où l'auteur/narrateur adulte Sidi Mohammed raconte sa jeunesse et son enfance à l'âge de 6 ans à Fès.",
    explanationAr: "علبة العجائب هي رواية سيرة ذاتية (Roman autobiographique) يسترجع فيها الكاتب/الراوي الراشد ذكريات طفولته بفاس العتيقة في سن السادسة.",
    examRegion: "Régional Casablanca-Settat"
  },
  {
    id: 2,
    workId: 'boite-a-merveilles',
    workTitle: 'La Boîte à Merveilles',
    category: 'Situation du passage',
    question: "Pourquoi le père de Sidi Mohammed (Maâlem Abdeslam) quitte-t-il sa famille au chapitre 9 ?",
    questionAr: "لماذا غادر المعلم عبد السلام أسرته وبيته في الفصل التاسع من الرواية؟",
    options: [
      "Pour aller accomplir le pèlerinage à La Mecque",
      "Pour fuir une querelle violente avec la Chouafa",
      "Pour travailler comme moissonneur après avoir perdu son capital au souk",
      "Pour épouser une seconde femme à Meknès"
    ],
    correctIndex: 2,
    explanationFr: "Après avoir perdu tout son argent (son capital) dans la cohue du souk des haïks, Maâlem Abdeslam part travailler comme moissonneur dans les champs près de Fès pour rembourser ses dettes.",
    explanationAr: "إثر فقدانه لكل مدخراته ورأس ماله في زحام سوق الحايك، يضطر الأب الشريف للعمل كحصاد في حقول نواحي فاس لجمع المال ورد الديون والإنفاق على عائلته.",
    examRegion: "Régional Rabat-Salé-Kénitra"
  },
  {
    id: 3,
    workId: 'boite-a-merveilles',
    workTitle: 'La Boîte à Merveilles',
    category: 'Figure de style',
    contextText: "'Les flammes des bougies dansaient sur les murs blanchis à la chaux.'",
    question: "Quelle est la figure de style contenue dans cette phrase ?",
    questionAr: "ما هي الصورة البلاغية (Figure de style) الواردة في هذه الجملة؟",
    options: [
      "Une métaphore",
      "Une personnification",
      "Une litote",
      "Un oxymore"
    ],
    correctIndex: 1,
    explanationFr: "C'est une personnification car le verbe 'danser' (action réservée aux humains) est attribué aux flammes inanimées des bougies.",
    explanationAr: "إنها استعارة تشخيصية (Personnification) لإسناد فعل الرقص البشري إلى لهب الشموع الجمادية.",
    examRegion: "Régional Fès-Meknès"
  },
  {
    id: 4,
    workId: 'boite-a-merveilles',
    workTitle: 'La Boîte à Merveilles',
    category: 'Registre & Focalisation',
    question: "Quelle est la focalisation dominante dans 'La Boîte à Merveilles' ?",
    questionAr: "ما هي زاوية الرؤية التبئيرية المهيمنة (Focalisation) في رواية علبة العجائب؟",
    options: [
      "Focalisation externe (témoin neutre)",
      "Focalisation zéro (narrateur omniscient)",
      "Focalisation interne (vision à travers le regard de l'enfant)",
      "Focalisation multiple"
    ],
    correctIndex: 2,
    explanationFr: "La focalisation est interne : les événements, les personnages et les lieux sont décrits à travers les émotions et le regard subjectif du jeune narrateur Sidi Mohammed.",
    explanationAr: "الرؤية داخلية (Focalisation interne): حيث تُروى وتُفسر كل المشاهد والأحداث عبر مشاعر وعين وخيال الطفل سيدي محمد.",
    examRegion: "Régional Marrakech-Safi"
  },
  {
    id: 5,
    workId: 'antigone',
    workTitle: 'Antigone',
    category: 'Compréhension',
    question: "Pour quel motif Antigone désobéit-elle à l'édit du roi Créon ?",
    questionAr: "ما هو الدافع الذي جعل أنتيجون تعصي أوامر وقانون خالها الملك كريون؟",
    options: [
      "Pour s'emparer du trône royal de Thèbes",
      "Pour venger la mort d'Hémon",
      "Pour donner une sépulture digne à son frère Polynice et accomplir son devoir moral",
      "Pour s'enfuir avec les gardes de la cité"
    ],
    correctIndex: 2,
    explanationFr: "Antigone refuse de laisser le cadavre de son frère Polynice pourrir au soleil dévoré par les chiens et les vautours. Elle accomplit son devoir fraternel et moral malgré la peine de mort.",
    explanationAr: "رفضت أنتيجون أن تترك جثة أخيها بولينيس نهباً للكلاب والجوارح في العراء، وأصرت على مواراتها الثرى وفاءً للواجب الديني والأخلاقي رغم علمها بعقوبة الإعدام.",
    examRegion: "Régional Tanger-Tétouan-Al Hoceïma"
  },
  {
    id: 6,
    workId: 'antigone',
    workTitle: 'Antigone',
    category: 'Figure de style',
    contextText: "'Ismène est faite pour vivre, moi je suis faite pour mourir.'",
    question: "Quelle figure de style oppose ici les deux sœurs ?",
    questionAr: "ما هي الصورة البلاغية التي تبرز التباين الحاد بين مصيري الأختين؟",
    options: [
      "Une antithèse",
      "Un euphémisme",
      "Une hyperbole",
      "Une métonymie"
    ],
    correctIndex: 0,
    explanationFr: "Une antithèse qui met en contraste direct les verbes contraires 'vivre' et 'mourir' pour souligner l'irréconciliable divergence de leurs destins.",
    explanationAr: "طباق ومقابلة (Antithèse) تجمع بين كلمتين متضادتين: الحياة (vivre) والموت (mourir) لإبراز التباين الحاد بين مساري الشخصيتين.",
    examRegion: "Régional Oriental"
  },
  {
    id: 7,
    workId: 'antigone',
    workTitle: 'Antigone',
    category: 'Registre & Focalisation',
    question: "Quel est le registre littéraire dominant dans le dénouement d'Antigone ?",
    questionAr: "ما هو السجل الأدبي الغالب (Registre littéraire) في الخاتمة المفجعة لمسرحية أنتيجون؟",
    options: [
      "Le registre comique",
      "Le registre tragique",
      "Le registre épique",
      "Le registre didactique"
    ],
    correctIndex: 1,
    explanationFr: "Le registre tragique, caractérisé par la fatalité inéluctable, la mort des innocents (Antigone, Hémon, Eurydice) et l'effondrement moral du héros impuissant face au destin.",
    explanationAr: "السجل التراجيدي المأساوي (Registre tragique)، حيث تنتصر الحتمية والقدر المحتوم بالموت المؤلم لجميع الأطراف وعزلة الملك المدمرة.",
    examRegion: "Régional Souss-Massa"
  },
  {
    id: 8,
    workId: 'dernier-jour',
    workTitle: 'Le Dernier Jour d’un Condamné',
    category: 'Compréhension',
    question: "Quel est le but philosophique et politique de Victor Hugo en écrivant ce roman ?",
    questionAr: "ما هي الغاية الفلسفية والإنسانية التي توخاها فيكتور هوغو من تأليف هذه الرواية؟",
    options: [
      "Faire l'apologie des crimes passionnels",
      "Plaider pour l'abolition universelle de la peine de mort",
      "Défendre l'institution des bagnes coloniaux",
      "Raconter l'histoire véridique de la Révolution française"
    ],
    correctIndex: 1,
    explanationFr: "C'est un roman à thèse dont l'objectif premier est de démontrer l'inutilité barbare de la peine de mort et d'en réclamer l'abolition immédiate.",
    explanationAr: "إنها رواية أطروحة وحجاج (Roman à thèse) تهدف جوهرياً إلى فضح همجية الإعدام بالمقصلة والمطالبة بإلغاء هذه العقوبة اللاإنسانية.",
    examRegion: "Régional Beni Mellal-Khénifra"
  },
  {
    id: 9,
    workId: 'dernier-jour',
    workTitle: 'Le Dernier Jour d’un Condamné',
    category: 'Situation du passage',
    question: "Dans le chapitre 43, quelle phrase innocente de sa fille Marie brise définitivement le cœur du condamné ?",
    questionAr: "في الفصل 43، ما هي الجملة البريئة التي نطقت بها الطفلة ماري وحطمت قلب والدها المحكوم؟",
    options: [
      "'Je veux un cadeau pour mon anniversaire'",
      "'Mon père est au ciel, et vous me faites mal, monsieur !'",
      "'Le roi a signé votre grâce royale'",
      "'Venez vite à la maison maman pleure'"
    ],
    correctIndex: 1,
    explanationFr: "L'enfant ne le reconnaît pas à cause de son visage ravagé par la prison et l'appelle 'Monsieur', croyant que son père est déjà au ciel. C'est la mort morale du condamné.",
    explanationAr: "عجزت الطفلة ذات الثلاث سنوات عن التعرف على أبيها بسبب هيئته البائسة، ونادته بـ 'يا سيدي' مؤكدة أن أباها في السماء، مما شكل إعداماً نفسياً له قبل المقصلة.",
    examRegion: "Régional Draa-Tafilalet"
  },
  {
    id: 10,
    workId: 'dernier-jour',
    workTitle: 'Le Dernier Jour d’un Condamné',
    category: 'Figure de style',
    contextText: "'Mon corps est aux fers dans un cachot, mon esprit est en prison dans une idée.'",
    question: "Quelle construction stylistique structure cette célèbre phrase de Victor Hugo ?",
    questionAr: "ما هي البنية الأسلوبية البلاغية التي تنظم هذه الجملة الشهيرة لفيكتور هوغو؟",
    options: [
      "Un parallélisme avec métaphore",
      "Une antiphrase",
      "Une hyperbole comique",
      "Un oxymore simple"
    ],
    correctIndex: 0,
    explanationFr: "C'est un parallélisme rigoureux (corps aux fers dans un cachot / esprit en prison dans une idée) doublé d'une métaphore assimilant l'obsession de la mort à un cachot.",
    explanationAr: "موازنة وتناظر تركيبي (Parallélisme) مصحوب باستعارة بليغة تصور الفكرة القاتلة بالزنزانة التي تعتقل العقل كما تقيد الأصفاد الجسد.",
    examRegion: "Régional Guelmim-Oued Noun"
  }
];
