export interface Character {
  name: string;
  role: string;
  roleAr: string;
  description: string;
  descriptionAr: string;
  quote?: string;
  badge?: string;
}

export interface ChapterData {
  number: number;
  title: string;
  titleAr: string;
  summaryFr: string;
  summaryAr: string;
  keyEvents: string[];
  keyEventsAr: string[];
  excerptFr: string;
  excerptAr: string;
  culturalNotes?: { term: string; termAr: string; explanation: string }[];
  figuresDeStyle?: { phrase: string; figure: string; explanation: string }[];
}

export interface Novel {
  id: 'boite-a-merveilles' | 'antigone' | 'dernier-jour';
  title: string;
  titleAr: string;
  author: string;
  authorAr: string;
  authorDates: string;
  yearWritten: string;
  yearPublished: string;
  genre: string;
  genreAr: string;
  epoch: string;
  epochAr: string;
  narrator: string;
  narratorAr: string;
  focalization: string;
  focalizationAr: string;
  registers: string[];
  registersAr: string[];
  themes: string[];
  themesAr: string[];
  historicalContext: string;
  historicalContextAr: string;
  characters: Character[];
  chapters: ChapterData[];
}

export const NOVELS: Record<string, Novel> = {
  'boite-a-merveilles': {
    id: 'boite-a-merveilles',
    title: 'La Boîte à Merveilles',
    titleAr: 'علبة العجائب',
    author: 'Ahmed Sefrioui',
    authorAr: 'أحمد الصفريوي',
    authorDates: '1915 - 2004',
    yearWritten: '1952',
    yearPublished: '1954',
    genre: 'Roman autobiographique',
    genreAr: 'رواية سيرة ذاتية',
    epoch: 'XXe siècle (années 1920, Maroc sous protectorat)',
    epochAr: 'القرن العشرون (عشرينات القرن الماضي، المغرب إبان الحماية)',
    narrator: 'Sidi Mohammed (adulte qui se souvient de l’enfant de 6 ans)',
    narratorAr: 'سيدي محمد (الراوي الراشد مستحضراً طفولته وهو في سن السادسة)',
    focalization: 'Interne (la vision du monde à travers les yeux de l’enfant)',
    focalizationAr: 'رؤية داخلية (Focalisation interne) عبر عين وخيال الطفل الصغير',
    registers: ['Lyrique', 'Pathétique', 'Comique / Satirique', 'Réaliste'],
    registersAr: ['غنائي (Lyrique)', 'مأساوي حزين (Pathétique)', 'هزلي ساخر (Comique)', 'واقعي (Réaliste)'],
    themes: ['La solitude', 'L’enfance', 'La superstition et les marabouts', 'La solidarité traditionnelle', 'L’amitié et la famille'],
    themesAr: ['الوحدة والعزلة', 'عالم الطفولة والخيال', 'الشعوذة وزيارة الأضرحة', 'التكافل الاجتماعي بالأحياء العتيقة', 'الأسرة وعلاقات الجوار'],
    historicalContext: "Premier roman de la littérature marocaine d'expression française, écrit dans le contexte du protectorat français, reflétant avec tendresse et lucidité la vie quotidienne de la médina de Fès.",
    historicalContextAr: "تعتبر أول رواية مغربية مكتوبة باللغة الفرنسية، ألفت سنة 1952 ونشرت 1954، وتصور بدقة ودفء نبض الحياة اليومية والأزقة العتيقة لمدينة فاس العريقة.",
    characters: [
      {
        name: 'Sidi Mohammed',
        role: 'Le narrateur enfant',
        roleAr: 'البطل والراوي الطفل (6 سنوات)',
        description: 'Enfant de six ans, rêveur, solitaire, fragile et observateur. Il cherche refuge dans son monde imaginaire grâce à sa Boîte à Merveilles.',
        descriptionAr: 'طفل في سن السادسة يتميز بوحدته وخياله الخصب ونظرته العميقة لما حوله، يجد سلوته وملاذه الوحيد في صندوقه السحري المليء بالخردوات والأزرار الزجاجية.',
        quote: "Moi, je ne voulais rien apprendre, je voulais seulement rêver.",
        badge: 'Héros principal'
      },
      {
        name: 'Lalla Zoubida',
        role: 'La mère du narrateur',
        roleAr: 'أم سيدي محمد',
        description: 'Femme au foyer de 22 ans, pieuse mais superstitieuse, bavarde et fière de ses origines chérifiennes. Très liée à son fils.',
        descriptionAr: 'أم حنون في الثانية والعشرين من عمرها، تفتخر بنسبها الشريف، تحب الحكي والحديث مع الجارات، وتميل إلى زيارة الأولياء والتبرك بهم عند المحن.',
        quote: "Elle croyait aux démons, aux sorciers et aux amulettes protectrices."
      },
      {
        name: 'Maâlem Abdeslam',
        role: 'Le père',
        roleAr: 'المعلم عبد السلام (الأب)',
        description: 'Tisserand respecté, homme calme, taciturne, intègre et dévoué à sa famille. Lorsqu’il perd son capital au souk, il part travailler aux champs.',
        descriptionAr: 'نساج محترم في سوق الحايك، رجل قليل الكلام، شريف، صبور وذو وقار وهيبة. جسد التضحية حينما خسر ماله وعمل حصاداً في نواحي فاس لرد ديونه.',
        quote: "Il parlait peu, priait beaucoup et ne mentait jamais."
      },
      {
        name: 'Lalla Kénza (La Chouafa)',
        role: 'La voyante (propriétaire)',
        roleAr: 'الشوافة (صاحبة دار الشوافة)',
        description: 'Occupe le rez-de-chaussée de Dar Chouafa. Voyante réputée qui organise des rituels de transe avec les Gnaoua chaque mois.',
        descriptionAr: 'صاحبة الدار التي تقطن بها العائلات، تقيم في الطابق الأرضي وتمارس العرافة والشعوذة وطقوس كناوة في أول كل شهر قمري.',
        quote: "Une fois par mois, elle offrait une fête aux démons de la nuit."
      },
      {
        name: 'Lalla Aïcha',
        role: 'L’amie intime de la mère',
        roleAr: 'لالة عائشة (الصديقة الوفية)',
        description: 'Ancienne voisine, généreuse et malchanceuse. Son mari Moulay Larbi la trahit en épousant une seconde femme beaucoup plus jeune.',
        descriptionAr: 'صديقة لالة زبيدة الحميمة وجارتها السابقة، باعت كل مجوهراتها لإنقاذ زوجها الصانع مولاي العربي، لكنه كافأها بالزواج من فتاة شابة.',
        quote: "Une femme digne et patiente devant les épreuves du destin."
      },
      {
        name: 'Rahma & Zineb',
        role: 'Les voisines du 1er étage',
        roleAr: 'رحمة وابنتها زينب (جيران الطابق الأول)',
        description: 'Rahma est mariée à Driss El Aouad. Sa fille Zineb (7 ans) est détestée par Sidi Mohammed qui la trouve insupportable et laiteuse.',
        descriptionAr: 'رحمة جارة الطابق الأول، دخلت في شجار عنيف مع أم سيدي محمد بسبب نوبة الغسيل، وابنتها زينب كانت تثير نفور الراوي ويصفها بالبكاء والغباء.',
        quote: "Zineb pleurait pour un rien ; je la détestais cordialement."
      },
      {
        name: 'Le Fqih du Msid',
        role: 'Le maître d’école coranique',
        roleAr: 'فقيه المسيد (معلم القرآن)',
        description: 'Maître austère, souvent endormi ou menaçant avec sa baguette de cognassier, craint par tous les élèves.',
        descriptionAr: 'فقيه المسيد ذو النظرات الصارمة وعصا السفرجل المرعبة، يخشاه الصغار ويتحول إلى رجل بشوش فقط عند حلول مناسبة عاشوراء.',
        quote: "Sa baguette de cognassier distribuait les punitions sans pitié."
      },
      {
        name: 'Sidi El Arafi',
        role: 'Le voyant aveugle',
        roleAr: 'سيدي العرافي (العرّاف الأعمى)',
        description: 'Voyant aveugle et sage de Seffarine, consulté par Lalla Zoubida et Lalla Aïcha pour apaiser leurs tourments intérieurs.',
        descriptionAr: 'شيخ بصير القلب، أعمى العينين، يسكن حياً بعيداً بفاس، بعث الطمأنينة والأمل في قلبي لالة زبيدة ولالة عائشة بكلماته الحكيمة وسلته الرمزية.',
        quote: "Il voyait avec les yeux de l'âme ce que les yeux de chair ne discernent point."
      }
    ],
    chapters: [
      {
        number: 1,
        title: 'Chapitre 1 : Dar Chouafa et la solitude de l’enfant',
        titleAr: 'الفصل 1: دار الشوافة، عوالم الوحدة وأسرار الصندوق',
        summaryFr: "Le narrateur adulte évoque sa solitude tenace depuis l'enfance. Présentation détaillée des locataires de Dar Chouafa (La Chouafa au rez-de-chaussée, Rahma au premier étage, la famille du narrateur et Fatma Bziouya au deuxième). Évocation du bain maure (le hammam) vécu comme un véritable enfer par le petit Sidi Mohammed, puis de la violente querelle du lundi entre sa mère et Rahma pour l'espace de la lessive sur la terrasse.",
        summaryAr: "يفتتح الراوي الرواية بنبرة حزينة تستعرض شعوره المزمن بالوحدة منذ الطفولة. يقدم سكان 'دار الشوافة': الشوافة في الطابق الأرضي، رحمة وزوجها وابنتها في الطابق الأول، وأسرة الراوي وفاطمة البزيوية في الطابق الثاني. يصف الصدمة النفسية للطفل في 'الحمام الشعبي' الذي شبهه بالجحيم، ثم الشجار الصاخب يوم الاثنين بين أمه ورحمة حول أحقية نشر الغسيل على السطح.",
        keyEvents: [
          'Évocation de la solitude existentielle du narrateur',
          'Description vivante de Dar Chouafa et ses habitants',
          'Le cauchemar du bain maure (le Hammam)',
          'La dispute mémorable entre Lalla Zoubida et Rahma',
          'Ouverture de la Boîte à Merveilles pour consoler l’enfant'
        ],
        keyEventsAr: [
          'الحديث عن الوحدة والعزلة النفسية للطفل',
          'وصف تفصيلي لسكان دار الشوافة وطباعهم',
          'تجربة الحمام المغربي ووصفه كأنه الجحيم',
          'الخصام العنيف وتبادل الشتائم بين لالة زبيدة ورحمة',
          'فتح علبة العجائب للهروب من قسوة الواقع إلى عالم الأحلام'
        ],
        excerptFr: "Le soir, quand tous dorment, les riches dans leurs chauds burnous et les pauvres sur les nattes râpées, moi, je ne dors pas. Je songe à ma solitude et j’en sens tout le poids. Ma solitude ne date pas d’hier. J’avais peut-être six ans. J’étais seul, j’avais envie de me détacher de la terre, d’aller rejoindre mes amis invisibles.",
        excerptAr: "في المساء، حين ينام الجميع، الأغنياء في برانيسهم الدافئة والفقراء على الحصائر البالية، أنا لا أنام. أفكر في وحدتي وأشعر بكل ثقلها ووطأتها. إن وحدتي لا تعود إلى الأمس القريب، بل ربما كنت حينها في السادسة من عمري. كنت وحيداً، وكانت تراودني رغبة في الانفصال عن الأرض والالتحاق بأصدقائي الخفيين الذين لا يراهم أحد غيري.",
        culturalNotes: [
          { term: 'Dar Chouafa', termAr: 'دار الشوافة', explanation: "Maison traditionnelle de la médina habitée par plusieurs familles (locataires) avec cour intérieure." },
          { term: 'Bain maure', termAr: 'الحمام التقليدي', explanation: "Lieu social incontournable pour les femmes de l'époque, perçu par l'enfant comme un enfer humide et bruyant." },
          { term: 'Msid', termAr: 'المسيد / الكُتّاب', explanation: "L'école coranique traditionnelle où les enfants apprennent le Coran par cœur sous la férule du Fqih." }
        ],
        figuresDeStyle: [
          { phrase: "Ma solitude ne date pas d'hier.", figure: "Litote", explanation: "Atténuation pour signifier que cette solitude dure depuis très longtemps." },
          { phrase: "Le bain maure était un véritable enfer.", figure: "Métaphore", explanation: "Assimilation directe du hammam à l'enfer pour exprimer la suffocation et la panique de l'enfant." },
          { phrase: "Les riches dans leurs chauds burnous et les pauvres sur les nattes râpées.", figure: "Antithèse", explanation: "Opposition forte entre riches et pauvres pour souligner les inégalités sociales." }
        ]
      },
      {
        number: 2,
        title: 'Chapitre 2 : La visite au marabout Sidi Ali Boughaleb',
        titleAr: 'الفصل 2: عذاب المسيد، وزيارة ضريح سيدي علي بوغالب',
        summaryFr: "Mardi, jour noir et redouté au Msid : récitation des versets coraniques sous la menace de la baguette du Fqih. Sidi Mohammed rentre chez lui épuisé et fiévreux. Sa mère reçoit la visite de son amie intime Lalla Aïcha. Devant la pâleur de l'enfant, elles décident de l'emmener au sanctuaire de Sidi Ali Boughaleb pour le purifier et boire de son eau bénite. Là-bas, l'enfant se fait griffer par un matou bagarreur. Le lendemain, il a droit à deux jours de repos bien mérités.",
        summaryAr: "يوم الثلاثاء يوم أسود ومرعب في المسيد مخصص لاستظهار القرآن تحت تهديد عصا الفقيه. يعود سيدي محمد منهكاً ومحموم الرأس. تأتي لالة عائشة لزيارة لالة زبيدة، فتقترحان اصطحاب الطفل المريض للتبرك بضريح الولي 'سيدي علي بوغالب'. في باحة الضريح، يشرب الطفل من الماء المبارك ويتعرض لخدش مباغت من قط شرس، فيكافأ بعطلة يومين في البيت بعيداً عن كابوس المسيد.",
        keyEvents: [
          'Le mardi au Msid : récitation sous tension',
          'Visite de Lalla Aïcha et complainte des femmes',
          'Pèlerinage au sanctuaire de Sidi Ali Boughaleb',
          'La griffure du chat et le retour mouvementé',
          'Deux jours de repos et de convalescence à la maison'
        ],
        keyEventsAr: [
          'يوم الثلاثاء الكئيب في المسيد ورعب الاستظهار',
          'زيارة لالة عائشة وتبادل الأحاديث والشكاوى',
          'الذهاب لضريح سيدي علي بوغالب للتداوي والتبرك',
          'هجوم القط على الطفل في الضريح وتضميد جراحه',
          'الاستفادة من يومين راحة في البيت والنوم براحة'
        ],
        excerptFr: "Le mardi est un jour néfaste pour les élèves du Msid. C'est le jour des révisions. Dès l'aube, le maître armé de sa verge de cognassier nous attendait. Mon cœur battait à se rompre. Je me sentais faible, incapable de retenir une seule sourate.",
        excerptAr: "الثلاثاء يوم شؤم ونحس على تلاميذ المسيد، فهو يوم المراجعة الكبرى. منذ بزوغ الفجر، كان المعلم المسلح بعصا السفرجل ينتظرنا في مقعده، بينما قلبي يخفق بشدة تكاد تقتلني، شاعراً بالضعف وعاجزاً عن استذكار سورة واحدة.",
        culturalNotes: [
          { term: 'Marabout (Sanctuaire)', termAr: 'الضريح / الولي الصالح', explanation: "Lieu saint où repose un saint personnage (Wali), visité pour chercher la baraka ou la guérison." },
          { term: 'Eau bénite du marabout', termAr: 'ماء المزارة', explanation: "Eau puisée au mausolée réputée guérir les fièvres et chasser le mauvais œil." }
        ],
        figuresDeStyle: [
          { phrase: "Le mardi est un jour néfaste.", figure: "Hyperbole", explanation: "Exagération soulignant la terreur absolue ressentie par les écoliers envers le jour de révision." },
          { phrase: "Mon cœur battait à se rompre.", figure: "Hyperbole", explanation: "Formulation hyperbolique traduisant une angoisse physique extrême." }
        ]
      },
      {
        number: 3,
        title: 'Chapitre 3 : La lampe à pétrole et la disparition de Zineb',
        titleAr: 'الفصل 3: قنديل البترول، وضياع زينب ومأدبة الصدقة',
        summaryFr: "Fatma Bziouya achète une nouvelle lampe à pétrole qui illumine sa chambre. Jalouse et séduite, Lalla Zoubida exige de son mari la même lampe le soir même. Un jour, Rahma perd sa fille Zineb dans la foule immense des ruelles de Fès. Cris et lamentations dans tout le quartier. Lalla Zoubida oublie l'ancienne dispute et accompagne Rahma pour chercher la fillette, qu'on retrouve finalement au sanctuaire de Moulay Idriss. Pour remercier Dieu, Rahma organise un grand repas de charité pour les mendiants aveugles.",
        summaryAr: "تشتري فاطمة البزيوية قنديلاً عصرياً يشتغل بالبترول، فتشتعل الغيرة في قلب لالة زبيدة وتطالب زوجها بإحضار مثله. بعد أيام، تفقد رحمة ابنتها زينب في زحمة أزقة فاس، فتعلو الصرخات والنواح. تنسى لالة زبيدة شجارهما القديم وتهب لمساندة جارتها في البحث، حتى عثرتا على زينب تائهة في مزارة مولاي إدريس. احتفالاً بعودة ابنتها، تقيم رحمة صدقة ومأدبة كسكس كبرى للمتسولين المكفوفين.",
        keyEvents: [
          'L’achat de la lampe à pétrole et la fierté féminine',
          'La disparition dramatique de la petite Zineb',
          'La solidarité spontanée des voisines de Dar Chouafa',
          'Les retrouvailles émouvantes à Moulay Idriss',
          'Le grand banquet de charité (couscous aux mendiants)'
        ],
        keyEventsAr: [
          'شراء قنديل البترول والتنافس بين الجارات',
          'اختفاء الطفلة زينب وسط صدمة أمها وأهل الدرب',
          'تجلي قيم التضامن والتآزر ونسيان الخلافات',
          'العثور على زينب في رحاب ضريح مولاي إدريس',
          'إعداد قصاع الكسكس الكبيرة وتوزيعها صدقة على المساكين'
        ],
        excerptFr: "Une clameur monta du premier étage. C’était Rahma qui pleurait, poussait des cris déchirants en s’arrachant les cheveux : Zineb s’était perdue ! En un instant, toutes les querelles furent oubliées. Les femmes descendirent l’entourer, prêtes à braver toute la ville pour retrouver l’enfant égarée.",
        excerptAr: "ارتفعت صرخة مدوية من الطابق الأول؛ كانت رحمة تنتحب وتطلق عويلاً يمزق القلوب وتنتف شعرها بهستيريا: لقد ضاعت زينب! في لحظة واحدة، تلاشت كل الخصومات القديمة، وهبطت نساء الدار يلتففن حولها مستعدات لتمشيط المدينة شبراً شبراً لإنقاذ الطفلة التائهة.",
        figuresDeStyle: [
          { phrase: "Une clameur monta du premier étage.", figure: "Métonymie", explanation: "Le bruit (clameur) est employé pour désigner les cris désespérés de Rahma." },
          { phrase: "Des cris déchirants.", figure: "Métaphore", explanation: "Image assimilant le son aigu à une déchirure physique pour souligner la douleur." }
        ]
      },
      {
        number: 4,
        title: 'Chapitre 4 : La visite chez Lalla Aïcha et l’affaire Moulay Larbi',
        titleAr: 'الفصل 4: زيارة لالة عائشة، وبداية محنة مولاي العربي',
        summaryFr: "Au début du printemps, Lalla Zoubida et son fils se rendent chez Lalla Aïcha au quartier Zankat Hjamen. Les deux amies se livrent à d'interminables commérages sur leurs voisines. Soudain, le mari de Lalla Aïcha, Moulay Larbi, arrive troublé : son associé Abdelkader l'a escroqué en lui réclamant de l'argent qu'il ne lui devait pas et l'a traîné devant les juges coraniques (le Pacha). Le pauvre homme perd son atelier.",
        summaryAr: "مع إطلالة الربيع، تزور لالة زبيدة رفقة ابنها صديقتها لالة عائشة في زنقة الحجامين. تمضي الصديقتان الوقت في الثرثرة وتناول شاي النعناع وتفاصيل حياة معارفهن. فجأة يدخل مولاي العربي شاحب الوجه ومكسور الخاطر، ليعلن تعرضه لغدر شريكه عبد القادر الذي ادعى باطلاً شراكة في رأس المال، واشتكاه لإنكار دينه أمام الباشا فخسر دكانه ومصدر رزقه.",
        keyEvents: [
          'Balade printanière vers le quartier de Lalla Aïcha',
          'Séance de commérages féminins et jeux sur la terrasse',
          'L’arrivée dramatique de Moulay Larbi ruiné',
          'La trahison d’Abdelkader et le sentiment d’injustice'
        ],
        keyEventsAr: [
          'نزهة ربيعية عبر دروب فاس نحو بيت لالة عائشة',
          'جلسة النميمة اللذيذة ولعب الطفل على السطوح',
          'دخول مولاي العربي منهاراً بعد صدمة المحكمة',
          'خيانة الشريك عبد القادر وضياع رأس مال الورشة'
        ],
        excerptFr: "Moulay Larbi entra, la tête basse, les épaules voûtées. Il ne répondit pas à nos salutations. Son visage était couleur de cendre. Il venait d’être trahi par celui qu’il avait nourri, logé et formé comme son propre fils.",
        excerptAr: "دخل مولاي العربي مطأطئ الرأس ومنحني المنكبين، ولم يرد على تحيتنا. كان لون وجهه بلون الرماد؛ لقد تعرض للغدر للتو من الشخص الذي أطعمه وآواه وعلمه الصنعة كما لو كان ابنه من صلبه.",
        figuresDeStyle: [
          { phrase: "Son visage était couleur de cendre.", figure: "Comparaison / Métaphore", explanation: "Évoque la pâleur morbide et l'anéantissement moral de l'homme trahi." }
        ]
      },
      {
        number: 5,
        title: 'Chapitre 5 : Le sacrifice de Lalla Aïcha et l’oiseau mort',
        titleAr: 'الفصل 5: تضحية لالة عائشة بذهبها، وجنازة طائر الحسون',
        summaryFr: "Lalla Aïcha vend tous ses bijoux et son mobilier pour acheter un nouvel atelier à son mari Moulay Larbi et l'aider à rebondir. Au Msid, le Fqih annonce que la fête de l'Achoura approche et que les élèves auront quinze jours pour nettoyer et repeindre l'école. En rentrant, Sidi Mohammed assiste aux funérailles tragiques de Sidi Mohammed Ben Tahar, le coiffeur du quartier. Plus tard, Sidi Mohammed trouve un petit oiseau mort et lui organise un enterrement secret.",
        summaryAr: "تضحي لالة عائشة بكل مصوغاتها وأثاثها الثمين لتوفير رأس مال جديد لزوجها مولاي العربي كي يستعيد كرامته. في المسيد، يزف الفقيه للتلاميذ خبر الاستعداد لعيد عاشوراء بتبييض جدران المدرسة وتزيينها. يشهد الطفل مرور موكب جنازة الحلاق بن طاهر وسط عويل النساء، مما يثير في نفسه هاجس الموت، ثم يعثر على طائر حسون ميت فيدفنه بسرية وتأثر.",
        keyEvents: [
          'La noblesse de Lalla Aïcha qui sacrifie ses parures en or',
          'L’annonce de la fête de l’Achoura au Msid',
          'La mort et les funérailles impressionnantes du coiffeur Ben Tahar',
          'L’enterrement de l’oiseau par Sidi Mohammed'
        ],
        keyEventsAr: [
          'شهامة لالة عائشة وتنازلها عن ذهبها لإنقاذ زوجها',
          'الإعلان عن التحضير لاحتفالات عاشوراء في المسيد',
          'مشهد جنازة الحلاق بن طاهر ورعب الموت في نفس الصبي',
          'دفن طائر ميت في طقس طفولي مهيب'
        ],
        excerptFr: "La mort rodait autour de nous. Les lamentations des femmes déchiraient l'air lourd de l'après-midi. J’avais peur que la mort n’entrât dans notre maison, qu’elle ne vînt m’arracher à mes trésors de verre et de fer-blanc.",
        excerptAr: "كان الموت يحوم حولنا؛ نواح النساء كان يمزق سكون الظهيرة الخانقة. تسلل إلي رعب جارف من أن يدخل الموت بيتنا وينتزعني من وسط كنوزي الحبيبة من الزجاج وصفائح القصدير.",
        figuresDeStyle: [
          { phrase: "La mort rodait autour de nous.", figure: "Personnification", explanation: "Le narrateur personnifie la mort en prédateur qui rode pour intensifier l'angoisse." }
        ]
      },
      {
        number: 6,
        title: 'Chapitre 6 : Les préparatifs de l’Achoura et les habits neufs',
        titleAr: 'الفصل 6: تنظيف المسيد، وشراء ملابس عاشوراء في القيصرية',
        summaryFr: "Au Msid, les écoliers s'activent avec joie : corvée d'eau, brossage des nattes, blanchiment des murs à la chaux sous la supervision du Fqih devenu soudain souriant. Sidi Mohammed est nommé chef des frotteurs. Le lendemain, sa mère l'emmène à la Kissaria pour lui acheter de superbes habits neufs (gilet, djellaba blanche, babouches). En chemin, le narrateur écoute avec délectation les récits hauts en couleur de Rahma sur le ménage et les disputes du souk.",
        summaryAr: "ينقلب المسيد إلى ورشة عمل حماسية: جلب الماء، غسل الحصائر، وتبييض الجدران بالجير الأبيض تحت إشراف الفقيه الذي تخلص من قسوته المعهودة. يُعيّن سيدي محمد رئيساً لفرقة الفرك والتنظيف. في اليوم التالي، تصطحبه أمه إلى 'القيسارية' لشراء ثياب العيد الفاخرة (سترة مطرزة، جلباب أبيض ناصع، وبلغة جديدة)، مستمتعاً بحكايات رحمة الطريفة عن صخب الأسواق.",
        keyEvents: [
          'Le grand nettoyage rituel du Msid avant l’Achoura',
          'Sidi Mohammed promu chef de corvée',
          'L’expédition d’achats vestimentaires à la Kissaria',
          'L’achat du gilet brodé et des babouches neuves'
        ],
        keyEventsAr: [
          'حملة تنظيف المسيد الكبرى والتبييض بالجير',
          'فرحة الصبي بتعيينه رئيساً لمجموعة الفرك',
          'رحلة التسوق الممتعة في قيسارية فاس',
          'اقتناء الجلباب والسترة والبلغة للاحتفال بالعيد'
        ],
        excerptFr: "Le Msid s'illuminait de chaux fraîche. Chacun de nous frottait, lavait, rinçait avec ardeur. Pour une fois, le maître ne tenait plus sa verge menaçante : il souriait, nous encourageait, et nous nous sentions de fiers bâtisseurs d’un palais de lumière.",
        excerptAr: "أشرق المسيد بنقاء الجير الأبيض الناصع، وكان كل واحد منا يفرك ويغسل ويشطف بحماسة منقطعة النظير. ولأول مرة، غابت عصا الفقيه التهديدية عن يديه؛ بل كان يبتسم ويشجعنا، فشعرنا وكأننا بناة فخورون يشيدون قصراً من النور.",
        culturalNotes: [
          { term: 'Kissaria', termAr: 'القيسارية', explanation: "Grand marché couvert traditionnel de tissus, vêtements fins et babouches de luxe à Fès." },
          { term: 'Achoura', termAr: 'عاشوراء', explanation: "Fête populaire marocaine marquant le début de l'année hégirienne, fêtée avec des jouets, des tambours (taârija) et des habits neufs." }
        ],
        figuresDeStyle: [
          { phrase: "Bâtisseurs d’un palais de lumière.", figure: "Métaphore", explanation: "Désigne la salle du Msid repeinte en blanc pour magnifier l'enthousiasme enfantin." }
        ]
      },
      {
        number: 7,
        title: 'Chapitre 7 : La nuit magique de l’Achoura',
        titleAr: 'الفصل 7: فجر عاشوراء المشهود، وأنغام الطبول والاحتفال',
        summaryFr: "Le jour de l’Achoura est enfin là ! Réveil à trois heures du matin. Sidi Mohammed enfile ses beaux habits neufs et part avec son père au Msid étincelant de centaines de bougies. Les élèves chantent des cantiques sacrés jusqu’à l’aube. Après cette cérémonie mystique, le petit garçon rentre fêter l’Achoura à la maison : tambours, beignets, fruits secs. Mais l’après-midi, une nouvelle ombre tombe : Lalla Aïcha est malade de chagrin car son mari Moulay Larbi a épousé en secret la jeune fille du coiffeur Si Abderrahmane.",
        summaryAr: "يحل يوم عاشوراء العظيم! يستيقظ الصبي في الثالثة فجراً، يرتدي ملابسه الجديدة الفاخرة ويتوجه برفقة والده نحو المسيد الذي يتلألأ بمئات الشموع المضاءة. يتلو الأطفال المدائح والأناشيد حتى مطلع الشمس في جو من الخشوع والسعادة. يعود للبيت ليحتفل بالدفوف والفواكه الجافة، لكن فرحة العيد تنكسر بعد الزوال حين تزورهم لالة عائشة منهارة بالبكاء: زوجها مولاي العربي تزوج سراً بابنة الحلاق سي عبد الرحمان الشابة.",
        keyEvents: [
          'Le réveil nocturne et la ferveur mystique au Msid',
          'L’océan de bougies et les chants religieux des écoliers',
          'Les cadeaux, pétards et tambours de fête',
          'Le drame conjugal : la seconde noce secrète de Moulay Larbi'
        ],
        keyEventsAr: [
          'الاستيقاظ في عتمة الفجر والمسير نحو المسيد',
          'مشهد مئات الشموع وأصوات ترتيل الأطفال في الفجر',
          'الهدايا والحلويات وفرحة الطبول في الدار',
          'صدمة لالة عائشة: زواج زوجها بضرة شابة من ابنة الحلاق'
        ],
        excerptFr: "Le Msid brillait de mille feux. Les flammes des bougies dansaient sur les murs blancs. Nos voix s’élevaient pures dans l’air matinal. Mais le bonheur dans ce bas monde est une eau fugitive : avant le crépuscule, les sanglots de Lalla Aïcha venaient éteindre l’éclat de la fête.",
        excerptAr: "تلألأ المسيد بألف شعلة ونور، ورقصت ألسنة لهب الشموع فوق الجدران البيضاء، فيما تعالت أصواتنا نقية في هواء الفجر العليل. بيد أن السعادة في هذه الدنيا ماء هارب وزائل: فقبل مغيب الشمس، جاءت شهقات لالة عائشة الباكية لتطفئ بريق العيد وبهجته.",
        figuresDeStyle: [
          { phrase: "Le bonheur est une eau fugitive.", figure: "Métaphore", explanation: "Assimile le bonheur éphémère à de l'eau qui s'écoule entre les doigts." }
        ]
      },
      {
        number: 8,
        title: 'Chapitre 8 : Les chaleurs d’été et la dispute du souk des bijoux',
        titleAr: 'الفصل 8: حرارة الصيف الخانقة، وشجار سوق المجوهرات بالدمليج',
        summaryFr: "L'été arrive avec ses chaleurs écrasantes. Le Msid déménage vers un sanctuaire plus frais. Sidi Mohammed observe les progrès de la seconde épouse de Moulay Larbi qui tourne au désastre. Un jour, le père Maâlem Abdeslam emmène sa femme et son fils au souk des bijoutiers pour acheter des bracelets en argent (les fameux dmeljs). Le courtier (dellal) tente de gonfler les prix ; une bagarre violente éclate entre le père et le dellal sous les yeux effrayés de la famille. Lalla Zoubida refuse de porter ces bracelets qu'elle considère comme maudits.",
        summaryAr: "يحل فصل الصيف بحرارته الخانقة، فينتقل المسيد لمكان أكثر برودة في ضريح مجاور. يقرر المعلم عبد السلام شراء أساور فضية (دبالج) لزوجته تكريماً لها. في سوق الصاغة، يبالغ السمسار (الدلال) في الثمن ويستفز الأب بنعوت جارحة، فتنشب معركة دامية بالأيدي بين المعلم عبد السلام والدلال أسالت الدماء. ترفض لالة زبيدة ارتداء تلك الأساور معتبرة إياها نذير شؤم وبلاء.",
        keyEvents: [
          'Le transfert du Msid vers un mausolée plus aéré',
          'La visite mouvementée au souk des bijoutiers',
          'L’altercation physique violente entre le père et le dellal',
          'Le retour bredouille et la superstition des bracelets maudits'
        ],
        keyEventsAr: [
          'نقل حلقة المسيد لمزارة باردة هرباً من حر الصيف',
          'الذهاب لسوق الصاغة لشراء أساور الفضة',
          'المضاربة والعراك الدامي بين الأب والدلال المحتال',
          'رفض الأم ارتداء الأساور لاعتبارها فأل سوء'
        ],
        excerptFr: "Mon père bondit sur le dellal. Les deux hommes roulèrent dans la poussière du souk. Le sang coula, les cris fusèrent de toutes parts. Ma mère me serrait contre elle en récitant des prières tremblantes. Ces bracelets n'apportèrent que le malheur.",
        excerptAr: "انقض أبي على الدلال، وتدحرج الرجلان في غبار السوق المتطاير. سالت الدماء وتعالت الصرخات من كل حدب وصوب، بينما كانت أمي تشدني إليها بقوة وهي تتمتم بآيات وأدعية مرتجفة. لم تجلب تلك الأساور لبيتنا إلا البؤس والشؤم.",
        figuresDeStyle: [
          { phrase: "Les deux hommes roulèrent dans la poussière du souk.", figure: "Hyperbole réaliste", explanation: "Peint la violence soudaine et la rupture du calme habituel du père." }
        ]
      },
      {
        number: 9,
        title: 'Chapitre 9 : La ruine du père et le départ aux moissons',
        titleAr: 'الفصل 9: الفاجعة الكبرى: ضياع رأس المال، ورحيل الأب للعمل في الحصاد',
        summaryFr: "Le coup de tonnerre s'abat sur la famille : Maâlem Abdeslam rentre les mains vides. Il a perdu tout son argent (son capital) dans la cohue du souk. Il n'a plus un sou pour acheter du fil de tissage ou nourrir les siens. Digne et courageux, il annonce qu'il part travailler comme moissonneur dans les champs aux environs de Fès pour rembourser ses dettes et reconstituer son pécule. Lalla Zoubida pleure en silence. Le départ du père laisse la maison vide et sans protection.",
        summaryAr: "تحل الفاجعة الكبرى التي تقلب موازين الرواية: يعود المعلم عبد السلام منهاراً بعد أن سقطت صرة ماله كاملة في زحام السوق وضاع كل رأس ماله. أصبح عاجزاً عن شراء خيوط الصوف أو تأمين قوت أسرته. بكل رجولة وعزة نفس، يقرر مغادرة فاس للعمل كحصاد في الحقول لجمع المال وسداد الديون. يخيم الحزن القاتم على البيت بغياب السند والمعيل.",
        keyEvents: [
          'L’annonce déchirante de la perte du capital familial',
          'La décision héroïque du père de partir aux champs moissonner',
          'Les adieux larmoyants au petit matin',
          'Le sentiment aigu de dépossession et d’abandon chez l’enfant'
        ],
        keyEventsAr: [
          'إعلان الأب الصادم عن فقدان كل مدخراته ورأس مال حانوت النسيج',
          'عزيمة المعلم عبد السلام على العمل كحصاد في البادية',
          'لحظة الوداع المؤلمة فجراً وبكاء الأم والابن',
          'إحساس الصبي باليتم المؤقت والوحشة القاتلة في غياب الأب'
        ],
        excerptFr: "Notre protecteur partait. La maison perdait son âme. Mon père prit sa besace et son bâton d’olivier. Il nous embrassa avec une gravité qui me glaça le sang. Après son départ, la pièce sembla se rétrécir, envahie d’un silence d’agonie.",
        excerptAr: "سندنا وحامينا يغادر الدار، ففقد البيت روحه ونبضه. حمل أبي جرابه الخيشي وعصا الزيتون، وعانقنا بوقار هادئ جمد الدماء في عروقي. وما إن أغلق الباب وراءه حتى خيل إلي أن الغرفة ضاقت وتقلصت، وغمرها صمت يفيض بلوعة الاحتضار.",
        figuresDeStyle: [
          { phrase: "La maison perdait son âme.", figure: "Personnification / Métaphore", explanation: "Assimile le père à l'âme même de la maison pour montrer le vide sidéral créé par son départ." },
          { phrase: "Un silence d’agonie.", figure: "Métaphore", explanation: "Désigne la lourdeur mortifère qui règne dans la demeure." }
        ]
      },
      {
        number: 10,
        title: 'Chapitre 10 : La visite au voyant aveugle Sidi El Arafi',
        titleAr: 'الفصل 10: زيارة العراف الأعمى سيدي العرافي، واستعادة الأمل',
        summaryFr: "Sans le père, les journées sont mornes et tristes. Lalla Zoubida, rongée par l'angoisse de l'absence, décide de consulter avec son amie Lalla Aïcha le voyant aveugle Sidi El Arafi dans un quartier lointain. Grâce à son panier rempli d'objets symboliques (coquillages, perles, cailloux), le vieil aveugle lit dans les cœurs, réconforte les deux femmes et leur prédit la fin prochaine de leurs tourments et le retour de l'absent. Ragaillardie, la mère décide de garder son fils auprès d'elle.",
        summaryAr: "تمسي الأيام كئيبة وبطيئة بدون الأب. تأخذ لالة زبيدة، رفقة رفيقة دربها لالة عائشة، ابنها في رحلة طويلة نحو حي قاصٍ لاستشارة العرّاف الكفيف الحكيم 'سيدي العرافي'. يستعمل الشيخ سلته العجيبة التي تضم صدفات وخرزاً وأحجاراً صغيرة، ويبعث بكلماته الرقيقة سكينة عميقة في نفس المرأتين مبشراً إياهما بقرب الفرج وعودة الغائب واندحار الأزمات.",
        keyEvents: [
          'Le quotidien pesant et la détresse de la mère',
          'Le pèlerinage chez le devin aveugle Sidi El Arafi',
          'La séance divinatoire pleine de bienveillance et de mystère',
          'Le regain d’espoir et l’apaisement des cœurs'
        ],
        keyEventsAr: [
          'الحياة القاسية تحت وطأة الفقر وانتظار رسائل الأب',
          'المسير نحو خلوة العراف الأعمى سيدي العرافي',
          'جلسة التكهن الإيماني واستخراج الصدفات والرموز المبشرة',
          'انتعاش الأمل والعودة بنفوس مطمئنة بقرب الفرج'
        ],
        excerptFr: "L'aveugle plongea ses doigts noueux dans un panier d'osier. Il en tira des coquillages nacrés, des perles de verre, des amulettes usées. Ses yeux morts semblaient scruter l'invisible. 'Ayez foi, mes filles, disait-il d’une voix douce, la nuit la plus sombre enfante toujours l’aurore.'",
        excerptAr: "غمس الأعمى أصابعه المعروقة في سلة من الخيزران، وأخرج منها أصدافاً لؤلؤية وخرزاً زجاجياً وتمائم قديمة. كانت عيناه المطفأتان تبدوان وكأنهما تبصران ما لا يراه المبصرون. وقال بصوت دافئ يقطر رحمة: 'ثقن بالله يا بناتي، فإن أشد الليالي حلكة وظلمة هي التي تلد الفجر المنير.'",
        figuresDeStyle: [
          { phrase: "Ses yeux morts semblaient scruter l'invisible.", figure: "Oxymore", explanation: "Opposition entre 'yeux morts' et la capacité de voir 'l'invisible' (clairvoyance spirituelle)." }
        ]
      },
      {
        number: 11,
        title: 'Chapitre 11 : Le dénouement des malheurs de Lalla Aïcha',
        titleAr: 'الفصل 11: الفرج يدنو: طلاق مولاي العربي من الضرة الشابة',
        summaryFr: "Lalla Zoubida passe l'après-midi chez Lalla Aïcha. Les deux femmes discutent des événements récents. Soudain, Salama, la marieuse professionnelle qui avait arrangé le remariage de Moulay Larbi avec la fille du coiffeur, arrive toute confuse et repentante. Elle raconte la vie infernale que la jeune épouse capricieuse et sa mère acariâtre font subir à Moulay Larbi. Elle annonce que le divorce est inévitable et imminent, et que Moulay Larbi va revenir définitivement auprès de sa première épouse fidèle.",
        summaryAr: "تقضي لالة زبيدة العشية في دار لالة عائشة لمواساتها. فجأة تدق الباب 'سلامة' الخاطبة الشهيرة التي كانت وسيطاً في تزويج مولاي العربي من ابنة الحلاق. تدخل خجولة وتطلب الصفح، كاشفة عن الجحيم الذي يعيشه مولاي العربي بسبب جشع الزوجة الشابة وتدخل حماتها الفظة ومطالبها التي لا تنتهي. تعلن أن إجراءات الطلاق باتت وشيكة ومسألة أيام فقط، ليعود الزوج نادماً إلى حضن لالة عائشة الوفية.",
        keyEvents: [
          'Les confidences des deux amies sur les épreuves de la vie',
          'L’entrée en scène théâtrale de Salama la marieuse',
          'Le récit croustillant des disputes de Moulay Larbi avec sa jeune épouse',
          'L’annonce du divorce libérateur et la victoire morale de Lalla Aïcha'
        ],
        keyEventsAr: [
          'جلسة البوح والدعاء بين الصديقتين الوفيتين',
          'دخول الخاطبة سلامة واعترافها بالخطأ في تزويج الزوج',
          'وصف الخلافات العائلية الصاخبة في بيت الزوجة الثانية',
          'البشارة بطلاق مولاي العربي وعودته لزوجته الأولى لالة عائشة'
        ],
        excerptFr: "Salama battait sa poitrine en implorant le pardon : 'Cette fille est une vipère ! Elle a ruiné le pauvre homme en parures et en caprices ! Mais réjouis-toi, Lalla Aïcha, les papiers du divorce sont rédigés, le captif brise ses chaînes !'",
        excerptAr: "كانت سلامة تلطم صدرها مستعطفة العفو والغفران: 'إن تلك الفتاة أفعى سامة! لقد استنزفت أموال الرجل المسكين في الحلي والنزوات الفارغة! لكن أبشري يا لالة عائشة، فإن وثيقة الطلاق كُتبت، والأسير كسر أغلاله ليعود إليكِ!'",
        figuresDeStyle: [
          { phrase: "Cette fille est une vipère !", figure: "Métaphore", explanation: "Assimilation péjorative de la seconde épouse à un serpent venimeux." }
        ]
      },
      {
        number: 12,
        title: 'Chapitre 12 : Le retour triomphal du père et la Boîte à Merveilles',
        titleAr: 'الفصل 12: عودة الأب المظفرة، واحتضان علبة العجائب مجدداً',
        summaryFr: "Toutes les prédictions se réalisent enfin : Driss El Aouad arrive essoufflé annonçant une merveilleuse nouvelle : Maâlem Abdeslam est de retour ! Le père revient avec son pécule, des provisions abondantes et deux beaux poulets. Joie immense dans toute Dar Chouafa : voisins et amis viennent le féliciter chaudement. Les femmes préparent un festin et célèbrent le dénouement heureux des épreuves. Resté seul dans son coin au milieu de l'effervescence des adultes, Sidi Mohammed rouvre sa chère Boîte à Merveilles pour retrouver ses chers amis inanimés.",
        summaryAr: "تتحقق بشارات الفرج أخيراً: يهرع دريس العواد بأنفاس لاهثة ليزف الخبر السعيد: المعلم عبد السلام عاد إلى فاس! يدخل الأب شامخاً محملاً بمدخرات عمل الحصاد ومؤونة وفيرة ودجاجتين سمينتين. تعم الفرحة والزغاريد دار الشوافة، ويهب الجيران لتهنئته واقتسام طعام الاحتفال. وفي غمرة انشغال الكبار بالحديث والضحك، ينسحب سيدي محمد بهدوء نحو زاويته المعهودة، ليفتح علبته السحرية ويعانق أصدقاءه الزجاجيين الخياليين من جديد في دورة أبدية للوحدة.",
        keyEvents: [
          'L’annonce festive du retour de Maâlem Abdeslam',
          'L’accueil triomphal et la liesse collective à Dar Chouafa',
          'Le récit du travail aux champs et les retrouvailles familiales',
          'Le dénouement parallèle : réconciliation de Moulay Larbi et Lalla Aïcha',
          'La clôture poétique : réouverture de la Boîte à Merveilles'
        ],
        keyEventsAr: [
          'البشارة بعودة الأب بعد غياب شاق وطويل',
          'استقبال حافل بالزغاريد وتبادل التهاني بين الجيران',
          'سرد الأب لتجربة الحصاد وفرحة استرجاع المكانة والكرامة',
          'الاطمئنان على عودة الاستقرار لبيت لالة عائشة أيضاً',
          'المشهد الختامي المؤثر: فتح علبة العجائب واحتضان الوحدة الأبدية'
        ],
        excerptFr: "Mon père était là, assis sur le matelas, entouré de ses amis. La maison bruissait de rires et de louanges à Dieu. Moi, j’étais oublié dans mon coin. Je tirai de sous le lit ma Boîte à Merveilles. Je l’ouvris. Mes trésors étaient là, fidèles, immobiles : mes boutons de porcelaine, mes clous dorés, mes cabochons de verre. Je leur parlais tout bas. J’étais de nouveau seul, mais avec eux, je n’avais plus peur de la nuit.",
        excerptAr: "كان أبي هناك، جالساً في صدارة الفراش، محاطاً بأصدقائه وجيرانه، بينما كان البيت يضج بالضحكات والدعوات والشكر لله. أما أنا، فكنت منسياً في زاويتي الصامتة. مددت يدي تحت السرير وسحبت علبة عجائبي، وفتحت غطاءها؛ كانت كنوزي هناك وفية وساكنة في انتظاري: أزرار الخزف، المسامير المذهبة، وقطع الزجاج البراقة. تحدثت إليها همساً؛ كنت وحيداً من جديد، لكن برفقتها لم أعد أخشى ظلمة الليل.",
        figuresDeStyle: [
          { phrase: "La maison bruissait de rires.", figure: "Métaphore", explanation: "Assimile les rires joyeux à un bruissement vivant qui anime la maison." }
        ]
      }
    ]
  },
  'antigone': {
    id: 'antigone',
    title: 'Antigone',
    titleAr: 'أنتيجون',
    author: 'Jean Anouilh',
    authorAr: 'جان أنوي',
    authorDates: '1910 - 1987',
    yearWritten: '1942',
    yearPublished: '1944',
    genre: 'Tragédie moderne (en prose, sans division en actes)',
    genreAr: 'تراجيديا حديثة (مسرحية نثرية بدون تقسيم إلى فصول كلاسيكية)',
    epoch: 'XXe siècle (pendant l’Occupation allemande et la Résistance)',
    epochAr: 'القرن العشرون (كتبت وعُرضت بباريس إبان الاحتلال النازي والمقاومة الفرنسية 1944)',
    narrator: 'Le Prologue / Le Chœur',
    narratorAr: 'المقدّم (Le Prologue) وجوقة الكورس (Le Chœur)',
    focalization: 'Spectaculaire / Théâtrale (dialogues directs)',
    focalizationAr: 'رؤية مسرحية درامية مباشرة',
    registers: ['Tragique', 'Pathétique', 'Ironique / Polémique'],
    registersAr: ['مأساوي (Tragique)', 'مثير للشفقة والأسى (Pathétique)', 'سجالي وجدلي (Polémique)'],
    themes: ['Le devoir moral vs la loi de l’État', 'Le refus du compromis et du faux bonheur', 'La révolte de la jeunesse', 'La fatalité et le destin', 'La solitude du pouvoir'],
    themesAr: ['الواجب الأخلاقي والديني في مواجهة قانون الدولة الصارم', 'رفض التنازل والأنصاف والحلول الوسطى', 'تمرد الشباب ونقاء المثالية', 'الحتمية والقدر التراجيدي المحتوم', 'عزلة الحاكم وثقل المسؤولية السياسية'],
    historicalContext: "Créée à Paris en 1944 sous l'Occupation, la pièce réactualise le mythe grec de Sophocle. Antigone incarne la résistance intransigeante au pouvoir autoritaire de Créon, métaphore de la résistance face à la collaboration.",
    historicalContextAr: "قُدمت المسرحية لأول مرة بباريس عام 1944 زمن الاحتلال النازي لفرنسا، مستلهمة الأسطورة الإغريقية لسوفوكليس، حيث ترمز أنتيجون إلى المقاومة ورفض الركوع أمام سلطة كريون الاستبدادية.",
    characters: [
      {
        name: 'Antigone',
        role: 'L’héroïne tragique',
        roleAr: 'البطلة التراجيدية المتمردة',
        description: 'Fille cadette d’Œdipe, petite, maigre et noiraude. Elle refuse tous les compromis et choisit délibérément de mourir pour enterrer son frère Polynice.',
        descriptionAr: 'ابنة أوديب الصغرى، نحيلة وسمراء وهادئة، ترفض كل تنازلات الحياة وتصر بكل شجاعة على دفن جثة أخيها بولينيس وفاءً لضميرها الأخلاقي رغم علمها بأن العقاب هو الموت رادماً بالحجارة.',
        quote: "Moi, je veux tout, tout de suite, et que ce soit entier, sinon je refuse !",
        badge: 'Héroïne'
      },
      {
        name: 'Créon',
        role: 'Le Roi de Thèbes (l’oncle)',
        roleAr: 'ملك طيبة (الخال الحاكم)',
        description: 'Homme mûr, pragmatique et fatigué. Il a accepté la lourde tâche de gouverner Thèbes après la guerre civile et applique la loi d’État coûte que coûte.',
        descriptionAr: 'خال أنتيجون وحاكم طيبة الصارم بعد مقتل ابني أوديب، يمثل رجل الدولة البراغماتي الذي يضحي بالمشاعر من أجل استتباب الأمن والاستقرار السياسي.',
        quote: "Gouverner, c'est dire oui à la besogne sale."
      },
      {
        name: 'Ismène',
        role: 'La sœur aînée',
        roleAr: 'إسمين (الأخت الكبرى الجميلة)',
        description: 'Belle, blonde, sensuelle et raisonnable. Elle aime la vie et craint la mort et la colère de la foule, refusant d’abord d’aider Antigone.',
        descriptionAr: 'أخت أنتيجون الكبرى، شقراء وفاتنة وتعشق مباهج الحياة، تتردد في البداية خوفاً من عذاب الموت وتفضل الانصياع لأوامر الملك ثم تحاول اللحاق بأختها متأخرة.',
        quote: "Il est le roi, Antigone ! Ils sont trop forts pour nous !"
      },
      {
        name: 'Hémon',
        role: 'Le fiancé d’Antigone (fils de Créon)',
        roleAr: 'هيمون (خطيب أنتيجون وابن الملك كريون)',
        description: 'Jeune prince éperdument amoureux d’Antigone. Il supplie son père de l’épargner, puis se suicide sur le corps de sa bien-aimée.',
        descriptionAr: 'ابن الملك كريون الشاب وخطيب أنتيجون، يعشقها حد الجنون ويدافع عنها أمام والده، ولما عجز عن إنقاذها طعن نفسه بسيفه ليموت معانقاً جثتها في القبر.',
        quote: "Père, ne me laisse pas seul dans ce monde sans elle !"
      },
      {
        name: 'La Nourrice (Nounou)',
        role: 'La gardienne d’enfance',
        roleAr: 'الدادة / المربية العجوز',
        description: 'Femme simple et chaleureuse qui a élevé Antigone et Ismène, s’inquiétant de voir Antigone sortir à l’aube.',
        descriptionAr: 'المربية البسيطة الحنون التي احتضنت البنتين بعد موت والدتهما جوكاستا، تجسد دفء الأمومة وحرصها الساذج على تغذية الصغيرتين ودفئهما.',
        quote: "D'où viens-tu, mon poussin, si tôt ce matin ?"
      },
      {
        name: 'Le Chœur & Le Prologue',
        role: 'Les voix du destin et du théâtre',
        roleAr: 'الراوي المقدّم وجوقة الكورس',
        description: 'Le Prologue présente les personnages et le fatal dénouement. Le Chœur commente l’action et définit la tragédie comme une machine bien huilée.',
        descriptionAr: 'المقدم يفتتح المسرحية كاشفاً مصائر الأبطال، بينما الجوقة تشرح الفارق الفلسفي بين الدراما العادية والتراجيديا الحتمية الصارمة.',
        quote: "C'est propre, la tragédie. Ça roule tout seul."
      },
      {
        name: 'Les Gardes (Jonas)',
        role: 'Les exécutants du pouvoir',
        roleAr: 'الحراس (جوناس ورفاقه)',
        description: 'Soldats médiocres, indifférents aux enjeux nobles, préoccupés par leur solde, leurs cartes et leur avancement.',
        descriptionAr: 'جنود بسطاء يمثلون أداة السلطة العمياء، لا يهمهم العدل أو الظلم، بل كل ما يشغل بالهم هو استلام الراتب ولعب الورق وتجنب العقوبات.',
        quote: "Nous, on obéit aux ordres, chef !"
      }
    ],
    chapters: [
      {
        number: 1,
        title: 'Le Prologue : Présentation des personnages et de la tragédie',
        titleAr: 'المقدمة (Prologue): تقديم الشخصيات وإعلان القدر المحتوم',
        summaryFr: "Le Prologue entre en scène et présente les personnages immobiles. Il désigne d'abord Antigone la petite maigre qui va mourir, Ismène la belle blonde épanouie, Hémon le jeune fiancé, Créon le roi fatigué aux cheveux blancs, la Nourrice et les Gardes. Il rappelle les règles implacables de la tragédie où tout est joué d'avance.",
        summaryAr: "يصعد المقدّم إلى خشبة المسرح ليقدم الشخصيات الجالسة في سكون. يبدأ بأنتيجون الفتاة النحيلة السمراء التي اختارت مصيرها المحتوم بالموت، وأختها إسمين الفاتنة المحبة للحياة، وهيمون الخطيب العاشق، وكريون الملك المرهق ذي الشعر الأبيض، والدادة والحراس. يوضح أن التراجيديا آلة محكمة لا مفر من دوران تروسها حتى النهاية.",
        keyEvents: [
          'Entrée en scène du Prologue et présentation physique des protagonistes',
          'Rappel de la tragédie familiale des Labdacides (Œdipe, Polynice, Étéocle)',
          'Annonce officielle du sort inéluctable d’Antigone : elle va mourir',
          'Définition de la tragédie moderne par opposition au mélodrame'
        ],
        keyEventsAr: [
          'دخول المقدم وكسر الإيهام المسرحي لتقديم الأبطال',
          'التذكير بأسطورة عائلة أوديب والحرب الأهلية بين الأخوين',
          'إعلان مصير أنتيجون الصادم مسبقاً: إنها ستموت الليلة',
          'بيان الفارق بين التراجيديا الحتمية والدراما المؤقتة'
        ],
        excerptFr: "Voilà. Ces personnages vont vous jouer l’histoire d’Antigone. Antigone, c’est la petite maigre qui est assise là-bas, et qui ne dit rien. Elle regarde droit devant elle. Elle pense qu’elle va être Antigone tout à l’heure, qu’elle va surgir soudain de la jeune fille noire et secrète que personne ne prenait au sérieux dans la famille et se dresser seule en face du monde, seule en face de Créon, son oncle, qui est le roi. Elle pense qu’elle va mourir.",
        excerptAr: "ها هم أولاء؛ هؤلاء الممثلون سيعرضون عليكم قصة أنتيجون. أنتيجون هي تلك الفتاة النحيلة الجالسة هناك في صمت مطبق، ترنو ببصرها إلى الأمام. إنها تفكر في أنها ستصبح 'أنتيجون' بعد قليل، وأنها ستنبثق فجأة من تلك الفتاة السمراء الكتومة التي لم يكن أحد يعبأ بها في الأسرة، لتقف وحيدة في وجه العالم، وحيدة في مواجهة خالها الملك كريون. إنها تفكر في أنها ستموت.",
        figuresDeStyle: [
          { phrase: "Antigone, c’est la petite maigre qui ne dit rien.", figure: "Caractérisation réaliste", explanation: "Dépouille l'héroïne de tout apparat mythologique pour la rendre humaine et vulnérable." }
        ]
      },
      {
        number: 2,
        title: 'Antigone et la Nourrice : Le retour de l’aube',
        titleAr: 'أنتيجون والمربية: العودة عند الفجر الباكر',
        summaryFr: "Il est quatre heures du matin. Antigone rentre pieds nus, ses souliers à la main. La Nourrice la surprend et l'accuse d'avoir un amoureux secret. Antigone la rassure avec tendresse, loue la beauté du monde au petit matin alors qu'il n'appartient encore à personne, et lui confie sa chienne Douce en lui demandant de ne jamais la gronder.",
        summaryAr: "في الرابعة فجراً، تعود أنتيجون حافية القدمين مبللة بالندى. تفاجئها المربية العجوز وتتهمها بالخروج سراً للقاء عشيق. تطمئنها أنتيجون بدفء، وتصف لها جمال الطبيعة العذراء وقت الفجر، ثم توصيها بكل ألم بكلبتها الوفية 'دوس' وتطلب منها أن تطعمها بيديها وألا توبخها أبداً لأنها لن تعود.",
        keyEvents: [
          'La rentrée clandestine d’Antigone après sa première tentative d’enterrement',
          'L’interrogatoire naïf de la Nourrice jalouse de son devoir',
          'L’éloge poétique du silence de l’aube et de la rosée',
          'Le testament secret d’Antigone : confier sa chienne Douce'
        ],
        keyEventsAr: [
          'تسلل أنتيجون فجراً بعد محاولتها الأولى لدفن جثة أخيها',
          'استجواب المربية الخائفة وظنها أن الفتاة ذهبت لموعد غرامي',
          'الوصف الشاعري للفجر الباكر وجمال الطبيعة الهادئة',
          'وصية أنتيجون المؤثرة للمربية بالعناية بكلبتها'
        ],
        excerptFr: "Le jardin dormait encore. C’est beau, un jardin qui ne pense pas encore aux hommes. C’était gris. Tout était gris, et c’était merveilleux. Nourrice, promets-moi que tu ne crieras jamais après Douce si elle salit les tapis.",
        excerptAr: "كانت الحديقة لا تزال نائمة؛ ما أجمل الحديقة حين لا تفكر بعد في بني البشر! كان كل شيء رمادياً ندياً، وكان ذلك ساحراً بديعاً. عديني يا دادة ألا تصرخي أبداً في وجه كلبتي 'دوس' إن هي لوثت السجاد يوماً ما.",
        figuresDeStyle: [
          { phrase: "Un jardin qui ne pense pas encore aux hommes.", figure: "Personnification", explanation: "Donne à la nature une pureté innocente épargnée par la laideur des conflits humains." }
        ]
      },
      {
        number: 3,
        title: 'Le face-à-face des deux sœurs : Antigone et Ismène',
        titleAr: 'المواجهة بين الأختين: عقلانية إسمين في مواجهة إصرار أنتيجون',
        summaryFr: "Ismène tente désespérément de dissuader Antigone. Elle invoque la force de Créon, la férocité de la foule thébaine qui crachera sur elles, et le devoir de réfléchir avant d'agir. Mais Antigone réplique qu'elle a déjà réfléchi toute sa vie et qu'il y a des choses qu'on doit faire simplement parce qu'on les doit.",
        summaryAr: "تدخل إسمين محاولة بكل قواها إثناء أنتيجون عن عزمها. تحتج بقوة الملك كريون وجبروته، وبشاعة الموت رمياً بالحجارة وسط بصاق وسباب الجماهير. لكن أنتيجون ترفض منطق الخوف والحسابات، مؤكدة أنها شبعت من التفكير وأن واجب دفن أخيها قضية كرامة لا تقبل التراجع.",
        keyEvents: [
          'L’opposition morale et psychologique entre les deux sœurs',
          'L’argumentation prudente et pragmatique d’Ismène',
          'Le rejet absolu d’Antigone : "Moi, je ne veux pas comprendre"',
          'L’aveu fatal : Antigone révèle qu’elle a déjà recouvert le cadavre'
        ],
        keyEventsAr: [
          'التناقض الصارخ بين فلسفة الأختين في فهم الحياة والموت',
          'حجج إسمين الواقعية القائمة على الخوف من الألم والبطش',
          'رد أنتيجون الشهير: "أنا لا أريد أن أفهم الحسابات الصغيرة"',
          'المفاجأة الصادمة: أنتيجون تعترف بأنها دفنت الجثة بالفعل هذا الصباح'
        ],
        excerptFr: "Ismène : Il est plus fort que nous, Antigone ! Il est le roi ! Et tout le monde dans la ville pense comme lui !\nAntigone : Moi, je ne suis pas le roi. Je n’ai pas à faire ce qu’il faut. Ce matin, j'y suis allée. J'ai recouvert Polynice d'un peu de terre avec ma petite pelle d'enfant.",
        excerptAr: "إسمين: إنه أقوى منا يا أنتيجون! إنه الملك! وكل أهل المدينة يؤيدونه ويفكرون مثله!\nأنتيجون: أما أنا فلست الملكة، ولست ملزمة بما يرونه واجباً وصحيحاً. لقد ذهبت إلى هناك هذا الصباح، وغطيت جثة بولينيس بحفنة من التراب بواسطة مجرفتي الصغيرة التي كنت ألعب بها في طفولتي.",
        figuresDeStyle: [
          { phrase: "Il est le roi ! Il est plus fort que nous !", figure: "Répétition / Argument d'autorité", explanation: "Souligne la soumission d'Ismène face à l'autorité politique." }
        ]
      },
      {
        number: 4,
        title: 'Le grand affrontement : Antigone et Créon',
        titleAr: 'المناظرة الكبرى بين أنتيجون وكريون: صراع المبادئ والسياسة',
        summaryFr: "Arrêtée par les gardes alors qu'elle grattait la terre sur le cadavre pour la seconde fois, Antigone est amenée devant Créon. Le roi tente d'abord d'étouffer l'affaire pour sauver sa nièce et future belle-fille en faisant exécuter les gardes témoins. Mais Antigone refuse le sauvetage et promet de recommencer. Créon lui démontre alors la débauche de ses deux frères et la comédie politique du cadavre. Ébranlée mais révoltée par le concept de 'bonheur médiocre' vanté par Créon, Antigone s'insurge et crie son refus.",
        summaryAr: "يضبط الحراس أنتيجون وهي تهيل التراب ثانية، فيسوقونها إلى قصر الملك. يحاول كريون جاهداً التستر على الجريمة وإنقاذ حياة ابنة أخته وخطيبة ابنه بإعدام الحراس ودفن السر. لكن أنتيجون ترفض الشفقة والصفقة وتعلن أنها ستكرر الدفن علناً. يكشف لها كريون حقيقة أخويها الماجنين اللذين حاولا قتله وقتل بعضهما دون ذرة شرف، مما يصدمها، لكن عندما يدعوها كريون للقبول بـ 'السعادة المتواضعة' والحياة السهلة، تنفجر غضباً وترفض بيع مبادئها بثمن بخس.",
        keyEvents: [
          'L’arrestation d’Antigone en flagrant délit',
          'La tentative secrète de Créon de sauver Antigone en famille',
          'La désillusion : la vérité cruelle sur Polynice et Étéocle',
          'Le déclencheur : le mot "bonheur" prononcé par Créon qui réveille la fureur d’Antigone'
        ],
        keyEventsAr: [
          'القبض على أنتيجون متلبسة بإهالة التراب على الجثة',
          'محاولة كريون التستر عليها لحمايتها من الموت وإنقاذ خطيبة ابنه',
          'صدمة أنتيجون باكتشاف انحطاط أخويها وخيانتهما لطيبة',
          'الشرارة القاتلة: كلمة "السعادة" التي أطلقها كريون ففجرت ثورة أنتيجون الرافضة للحلول الوسط'
        ],
        excerptFr: "Créon : La vie n’est pas ce que tu crois. C’est une eau que les jeunes gens laissent couler sans le savoir, entre leurs doigts ouverts. Ferme tes mains, presse-la ! Sois heureuse !\nAntigone : Quel sera-t-il, mon bonheur ? Quelle pauvre femme deviendrai-je, moi aussi, pour qui on dira qu'elle a bien mérité son petit lopin de bonheur ? Dites, à qui devra-t-elle mentir, à qui sourire, à qui se vendre ? Moi, je veux tout, tout de suite, et que ce soit entier, sinon je refuse !",
        excerptAr: "كريون: ليست الحياة كما تظنين يا فتاة؛ إنها ماء يتركه الشباب ينساب بين أصابعهم المفتوحة دون أن يشعروا بقيمته. أطبقي كفيكِ، واقبضي عليه، وعيشي سعيدة!\nأنتيجون: وأي سعادة هذه التي تعدني بها؟! أي امرأة بائسة سأصبح أنا أيضاً، يُقال عنها إنها نالت قطعتها الصغيرة من السعادة الهزيلة؟ أخبرني: على من سيتعين عليها أن تكذب؟ ولمن ستبتسم نفاقاً؟ ولمن ستبيع كرامتها؟ أنا أريد كل شيء كاملاً ناصعاً على الفور، وإلا فإني أرفض كل شيء!",
        figuresDeStyle: [
          { phrase: "La vie c’est une eau qui coule entre les doigts.", figure: "Métaphore", explanation: "Exprime la fuite irréversible du temps et la fragilité de l'existence." },
          { phrase: "À qui devra-t-elle mentir, à qui sourire, à qui se vendre ?", figure: "Gradation descendante / Anaphore", explanation: "Dénonce les compromissions dégradantes de la vie adulte." }
        ]
      },
      {
        number: 5,
        title: 'Le dénouement tragique : La mort d’Antigone et la solitude de Créon',
        titleAr: 'النهاية المأساوية: موت أنتيجون، انتحار هيمون، وعزلة كريون الأبدية',
        summaryFr: "Condamnée à être emmurée vivante dans un tombeau scellé, Antigone dicte sa dernière lettre à un garde grossier et indifférent, avouant son trouble ('Je ne sais plus pourquoi je meurs'). Le Messager arrive au palais pour annoncer le massacre : Antigone s'est pendue avec les fils de sa ceinture ; Hémon a craché au visage de son père Créon avant de se plonger son épée dans le ventre. En apprenant la mort de son fils, la reine Eurydice se tranche la gorge. Créon reste seul sur scène, vieilli et brisé, prêt pour sa prochaine réunion de conseil.",
        summaryAr: "يُحكم على أنتيجون بالدفن حية داخل سرداب صخري مغلق. وفي لحظاتها الأخيرة تملي رسالتها الأخيرة على حارس غليظ القلب يبحث فقط عن سجائره، معترفة بلحظة شك إنساني: 'لم أعد أعلم لمَ أموت!'. يصل الرسول إلى القصر لينقل الفاجعة: أنتيجون شنقت نفسها بخيوط حزامها؛ ولما وجدها هيمون بصق في وجه أبيه وطعن نفسه بسيفه فوق جثتها. وبمجرد سماع النبأ، انتحرت الملكة أوريديس بقطع حنجرتها. يبقى الملك كريون وحيداً ومكسوراً على الخشبة، مستسلماً لمصيره التعس في إدارة شؤون الدولة.",
        keyEvents: [
          'La dernière lettre pathétique dictée par Antigone au garde indifférent',
          'L’ensevelissement vivant dans le tombeau de pierre',
          'Le récit du Messager : le suicide d’Antigone et d’Hémon',
          'Le suicide d’Eurydice et l’anéantissement total de la famille royale',
          'Créon seul avec ses gardes qui continuent de jouer aux cartes'
        ],
        keyEventsAr: [
          'إملاء الرسالة الأخيرة على حارس بليد المشاعر لا يكترث إلا بمصالحه',
          'إغلاق القبر الصخري على أنتيجون حية',
          'رواية الرسول المفجعة: انتحار أنتيجون وهيمون معاً في القبر',
          'انتحار الملكة أوريديس حزناً على ولدها الوحيد',
          'بقاء كريون وحيداً كشبح، بينما يستمر الحراس في لعب الورق ببرود تام'
        ],
        excerptFr: "Le Chœur : Et voilà. Sans la petite Antigone, c'est vrai, ils auraient tous été bien tranquilles. Mais maintenant, c'est fini. Ils sont tous calmes. Tous ceux qui avaient à mourir sont morts. Créon commence à attendre la mort. Il ne reste plus que les gardes. Tout cela leur est bien égal ; c'est leur métier. Ils continuent à jouer aux cartes.",
        excerptAr: "الجوقة: وهكذا انتهى كل شيء. لولا الصغيرة أنتيجون، لكانوا جميعاً قد عاشوا في هدوء وسلام. لكن الأمر انقضى الآن، وعم السكون أرجاء القصر. كل الذين كان عليهم أن يموتوا قد ماتوا، وبات كريون ينتظر الموت بدوره. لم يبق على المسرح إلا الحراس، وكل تلك المآسي لا تعنيهم في قليل أو كثير؛ فتلك مهنتهم، وها هم يواصلون لعب الورق دون اكتراث.",
        figuresDeStyle: [
          { phrase: "Tous ceux qui avaient à mourir sont morts.", figure: "Euphémisme tragique", explanation: "Constate la fin inéluctable du cycle tragique avec une froideur saisissante." }
        ]
      }
    ]
  },
  'dernier-jour': {
    id: 'dernier-jour',
    title: 'Le Dernier Jour d’un Condamné',
    titleAr: 'آخر يوم لمحكوم عليه بالإعدام',
    author: 'Victor Hugo',
    authorAr: 'فيكتور هوغو',
    authorDates: '1802 - 1885',
    yearWritten: '1828',
    yearPublished: '1829 (sans nom d’auteur), 1832 (avec préface)',
    genre: 'Roman à thèse (Monologue intérieur)',
    genreAr: 'رواية ذات أطروحة / حجاجية (مناجاة داخلية Monologue intérieur)',
    epoch: 'XIXe siècle (Restauration monarchique en France)',
    epochAr: 'القرن التاسع عشر (1829، عهد استعادة الملكية بفرنسا)',
    narrator: 'Le condamné à mort (anonyme, pour universaliser le combat)',
    narratorAr: 'المحكوم عليه بالإعدام (مجهول الاسم والهوية لتجسيد المعاناة الإنسانية الشاملة)',
    focalization: 'Interne absolue (journal des angoisses et pensées du condamné)',
    focalizationAr: 'رؤية داخلية مطلقة (يوميات المعاناة النفسية والجسدية للسجين)',
    registers: ['Pathétique', 'Tragique', 'Lyrique', 'Polémique / Réquisitoire'],
    registersAr: ['مأساوي حزين (Pathétique)', 'تراجيدي (Tragique)', 'وجداني (Lyrique)', 'سجالي حجاجي ضد المقصلة (Polémique)'],
    themes: ['L’abolition de la peine de mort', 'La torture morale de l’attente', 'La cruauté du spectacle judiciaire', 'L’amour filial (la petite Marie)', 'La dignité humaine face au bourreau'],
    themesAr: ['المطالبة بإلغاء عقوبة الإعدام بالمقصلة', 'العذاب النفسي لانتظار ساعة القتل', 'وحشية الفرجة العمومية على الإعدام في الميادين', 'عاطفة الأبوة والمأساة الأسرية (الطفلة ماري)', 'الكرامة الإنسانية المسلوبة في غياهب السجون'],
    historicalContext: "Manifeste littéraire contre la peine de mort, écrit par Victor Hugo à 26 ans après avoir vu l'échafaud dressé en place de Grève. Il démontre que la guillotine est une barbarie inutile qui torture l'esprit avant de trancher la chair.",
    historicalContextAr: "بيان إنساني وأدبي خالد ضد عقوبة الإعدام، ألفه هوغو في سن 26 عاماً إثر صدمته برؤية المقصلة منصوبة في ساحة الإعدام بباريس، مؤكداً أن قتل الإنسان باسم القانون بربرية ووحشية.",
    characters: [
      {
        name: 'Le Condamné à mort',
        role: 'Le narrateur et victime',
        roleAr: 'السجين المحكوم بالإعدام (البطل)',
        description: 'Homme jeune, instruit, raffiné, coupable d’un crime de sang dont les détails sont tus. Il tient le journal de ses souffrances pour plaider contre l’échafaud.',
        descriptionAr: 'شاب مثقف ومتعلم من طبقة ميسورة ارتكب جريمة قتل دافعها غامض، يكتب مذكراته في زنزانته الضيقة كشهادة حية تفضح التعذيب النفسي للانتظار.',
        quote: "Condamné à mort ! Voilà cinq semaines que j'habite avec cette pensée !",
        badge: 'Narrateur'
      },
      {
        name: 'Marie',
        role: 'La fille du condamné (3 ans)',
        roleAr: 'ماري (الطفلة البريئة ابنة السجين)',
        description: 'Enfant de trois ans innocente et joyeuse. Lors de son ultime visite, elle ne reconnaît pas son père décharné et l’appelle "Monsieur".',
        descriptionAr: 'طفلة صغيرة في ربيعها الثالث، تزور والدها في يومه الأخير بالسجن، لكنها تعجز عن التعرف عليه وتناديه بـ "سيدي"، مما مثل أقصى درجات العذاب النفسي لوالدها.',
        quote: "Monsieur, vous me faites mal ! Mon père est au ciel !"
      },
      {
        name: 'Le Prêtre',
        role: 'L’aumônier de prison',
        roleAr: 'رجل الدين (قسيس السجن)',
        description: 'Fonctionnaire froid qui récite des prières mécaniques par habitude professionnelle sans toucher le cœur du condamné.',
        descriptionAr: 'قس يؤدي مهمته كأي موظف حكومي ببرود وروتين، يكرر صلوات محفوظة دون أن يفيض بكلمة رحمة أو تعاطف حقيقي مع المحتضر.',
        quote: "Il parlait de Dieu comme d’une corvée de routine."
      },
      {
        name: 'Le Friauche',
        role: 'L’autre condamné (le successeur)',
        roleAr: 'السجين العجوز البديل',
        description: 'Vieux criminel endurci qui prend la cellule du narrateur à Bicêtre en attendant à son tour la guillotine. Il lui prend sa belle redingote.',
        descriptionAr: 'مجرم عتيق قضى حياته في السجون وأشغال شاقة، يدخل زنزانة الراوي خلفاً له ويتبادل معه معطفه، مجسداً دورة الجريمة والفقر في المجتمع.',
        quote: "Chacun son tour, mon cadet !"
      },
      {
        name: 'Les Geôliers et le Bourreau',
        role: 'Les instruments de la justice',
        roleAr: 'الحراس والسياف',
        description: 'Hommes impassibles qui préparent la toilette du condamné (coupe des cheveux, col rabattu, liens aux mains).',
        descriptionAr: 'أدوات التنفيذ الآلية التي تقص شعر السجين وتمزق ياقة قميصه وتوثق يديه بالحبال استعداداً لشفرة المقصلة.',
        quote: "La toilette du condamné commence."
      }
    ],
    chapters: [
      {
        number: 1,
        title: 'Chapitre 1 : L’obsession fatale : "Condamné à mort !"',
        titleAr: 'الفصل 1: الفكرة القاتلة المهيمنة: "محكوم عليّ بالإعدام!"',
        summaryFr: "Le narrateur est enfermé dans sa cellule à Bicêtre. Il compare son passé libre et lumineux, plein de désirs et de fantaisies, avec son présent d'homme captif. Une seule idée fixe et obsédante domine son esprit : 'Condamné à mort !'. Cette pensée le suit partout comme un spectre impitoyable, se mêle à ses rêves et le paralyse d'effroi.",
        summaryAr: "يجلس الراوي في زنزانته الباردة بسجن بيسيتر، مستحضراً أيامه الخوالي حين كان حراً طليقاً ينعم بالشباب والخيالات والأمنيات، مقارناً ذلك بحاضره المظلم. فكرة واحدة قاتلة ومستبدة تجثم على صدره كالكابوس ولا تفارقه ليل نهار: 'محكوم عليّ بالإعدام!'. تحاصره في يقظته ومنامه ولا يرى في كل ما حوله إلا شبح تلك العبارة الرهيبة.",
        keyEvents: [
          'La rupture violente entre la liberté passée et la captivité présente',
          'L’omniprésence étouffante de l’idée fixe de la mort',
          'La personnification de la pensée morbide sous les traits d’un spectre',
          'La terreur de la sentence prononcée par les juges'
        ],
        keyEventsAr: [
          'المقارنة الصارخة بين حرية الماضي وشبابه وقسوة زنزانة الحاضر',
          'هيمنة فكرة الموت المستبدة على كل مدارك السجين وعقله',
          'تشخيص الفكرة كشبح قاهر يجثم على أنفاسه ويسكن نومه',
          'استحضار لحظة النطق بالحكم القاسي في قاعة المحكمة'
        ],
        excerptFr: "Condamné à mort ! Voilà cinq semaines que j’habite avec cette pensée, toujours seul avec elle, toujours glacé de sa présence, toujours courbé sous son poids ! Autrefois, mon esprit était plein de fantaisies ; maintenant je suis captif. Mon corps est aux fers dans un cachot, mon esprit est en prison dans une idée. Une horrible, une sanglante, une implacable idée ! Je n'ai plus qu'une pensée, qu'une conviction, qu'une certitude : condamné à mort !",
        excerptAr: "محكوم عليّ بالإعدام! ها هي ذي خمسة أسابيع تمضي وأنا أتعايش مع هذه الفكرة وحدها، وحيداً معها على الدوام، متجمداً من فرط حضورها المرعب، ومنحنياً تحت وطأة ثقلها الخانق! في ما مضى، كان عقلي زاخراً بالخيالات والأحلام؛ أما الآن فأنا أسير. جسدي مقيد بالأصفاد داخل زنزانة، وعقلي مسجون داخل فكرة واحدة؛ فكرة مروعة، دامية، لا ترحم! لم تعد لدي سوى فكرة واحدة، ويقين واحد، ومصير واحد: محكوم عليّ بالإعدام!",
        figuresDeStyle: [
          { phrase: "Mon corps est aux fers dans un cachot, mon esprit est en prison dans une idée.", figure: "Parallélisme / Antithèse", explanation: "Double captivité : celle physique du corps et celle mentale de la pensée obsédante." },
          { phrase: "Une horrible, une sanglante, une implacable idée !", figure: "Gradation / Accumulation", explanation: "Amplification de l'horreur psychologique du condamné." }
        ]
      },
      {
        number: 13,
        title: 'Chapitre 13 : Le ferrage des forçats pour le bagne',
        titleAr: 'الفصل 13: مشهد تقييد المحكومين بالأشغال الشاقة في الأصفاد',
        summaryFr: "Depuis la fenêtre grillagée de son cachot, le condamné assiste au ferrage des forçats destinés au bagne de Toulon dans la cour de Bicêtre. Il décrit avec effroi la dégradation humaine de ces hommes enchaînés par le cou deux à deux, battus par les gardes sous une pluie battante, riant d'un rire dément et sinistre. Face à ce spectacle dégradant, le condamné s'évanouit d'horreur.",
        summaryAr: "من وراء قضبان نافذة زنزانته، يتابع السجين مشهد تثبيت الأطواق الحديدية في أعناق المدانين بالأشغال الشاقة المتجهين نحو معسكر تولون. يصور هذا المشهد الوحشي لرجال يُربطون كالحيوانات زوجاً زوجاً تحت وابل المطر وضرب السياط، وهم يطلقون ضحكات هستيرية تدل على ضياع إنسانيتهم، مما أصاب الراوي بصدمة عنيفة وسقط مغشياً عليه.",
        keyEvents: [
          'Le spectacle barbare du ferrage dans la boue de la cour',
          'La perte de toute dignité humaine chez les forçats',
          'Le rire démoniaque et désespéré des bagnards',
          'L’évanouissement du narrateur terrifié par cette inhumanité'
        ],
        keyEventsAr: [
          'مشهد دق المسامير في أطواق الحديد حول رقاب المساجين',
          'تجريد السجناء من كل مظهر للكرامة الإنسانية في الوحل',
          'الضحكات الشيطانية اليائسة التي هزت وجدان الراوي',
          'إغماء البطل من فرط الفظاعة وهول ما رأت عيناه'
        ],
        excerptFr: "Ces hommes n'étaient plus des créatures humaines. Le marteau frappait sur l'enclume à quelques pouces de leur crâne. Quand ils furent tous ferrés, ils entonnèrent une chanson affreuse, une clameur de damnés. La pluie tombait à verse. La fumée montait de leurs corps mouillés. Mes yeux se voilèrent, et je tombai comme mort.",
        excerptAr: "لم يعد هؤلاء الرجال كائنات تنتمي إلى البشرية؛ كانت المطارق تهوي بقسوة فوق السندان على بعد بوصات قليلة من جماجمهم. وحين طُوقت أعناقهم جميعاً بالحديد، انطلقوا ينشدون أهزوجة مرعبة أشبه بعويل الملاعين في الجحيم، بينما كان المطر ينهمر بغزارة والبخار يتصاعد من أجسادهم المبتلة. غامت الرؤية أمام عيني، وهويت ساقطاً على الأرض كالميت.",
        figuresDeStyle: [
          { phrase: "Une clameur de damnés.", figure: "Métaphore", explanation: "Assimile les bagnards aux damnés de l'enfer de Dante." }
        ]
      },
      {
        number: 26,
        title: 'Chapitre 26 : La lettre déchirante à sa fille Marie',
        titleAr: 'الفصل 26: رسالة الأب الباكي لابنته الصغيرة ماري',
        summaryFr: "Le condamné pense avec une infinie tendresse à sa mère, à sa femme, mais surtout à sa petite fille Marie, âgée de trois ans. Il s'effondre en pensant au déshonneur et à la honte qui pèseront sur cette enfant innocente toute sa vie à cause de l'échafaud de son père : 'Fille d'un guillotiné !'. Il crie son désespoir face à l'injustice du jugement social qui punit les enfants des coupables.",
        summaryAr: "تستحوذ صورة العائلة على وجدان السجين: أمه العجوز وزوجته المريضة، وقبل كل شيء طفلته المدللة 'ماري' ذات السنوات الثلاث. يبكي بحرقة حين يتخيل العار والنبذ الاجتماعي الذي سيطارد هذه الطفلة البريئة طوال حياتها، والوصمة التي ستلاحقها: 'ابنة مقطوع الرأس بالمقصلة!'. يصرخ مديناً قسوة المجتمع الذي يمد العقاب ليدمر الأبرياء.",
        keyEvents: [
          'L’évocation douloureuse des trois femmes de sa vie',
          'La certitude de la mort prochaine de sa mère et de sa femme brisées',
          'La malédiction sociale qui frappera la petite Marie orpheline',
          'La dénonciation de la peine de mort qui punit injustement les enfants'
        ],
        keyEventsAr: [
          'استحضار النساء الثلاث في حياته: الأم والزوجة والابنة',
          'يقينه بأن أمه وزوجته ستموتان كمداً بعد إعدامه',
          'اللعنة الاجتماعية والازدراء الذي سينتظر ابنته الصغيرة',
          'إدانة عقوبة الإعدام التي تذبح أرواح أطفال المحكومين بلا ذنب'
        ],
        excerptFr: "Ma fille ! Ma pauvre petite Marie qui joue, qui rit, qui ne sait rien ! C'est pour elle que je pleure le plus. Quand elle aura grandi, quand elle demandera : 'Où est mon père ?', que lui répondra-t-on ? On lui dira que son père est mort sous le couteau de la guillotine. Elle rougira de moi et de son nom. Ô mon enfant ! C'est cela qu'ils appellent faire justice !",
        excerptAr: "ابنتي! طفلتي المسكينة ماري التي تلعب وتضحك الآن في براءة دون أن تدري شيئاً! من أجلها وحدها أذرف أحر دموعي. وحين تكبر وتسأل في لهفة: 'أين أبي؟'، بمَ سيجيبونها؟ سيقولون لها إن أباها مات ذبيحاً تحت شفرة المقصلة! ستخجل مني ومن اسم عائلتها. يا طفلتي الحبيبة! أهذا هو ما يسمونه إقامة العدل في الأرض؟!",
        figuresDeStyle: [
          { phrase: "C'est cela qu'ils appellent faire justice !", figure: "Antiphrase / Ironie tragique", explanation: "Dénonciation véhémente de la barbarie masquée sous le mot de justice." }
        ]
      },
      {
        number: 43,
        title: 'Chapitre 43 : La visite tragique de la petite Marie',
        titleAr: 'الفصل 43: اللقاء الأخير الممزق: الطفلة ماري تتبرأ من أبيها دون قصد',
        summaryFr: "À quelques heures de l'exécution, on accorde au condamné l'ultime faveur de voir sa petite fille Marie. Il l'embrasse avec passion, mais l'enfant le regarde avec méfiance et recule. Elle ne reconnaît pas cet homme aux joues creuses, mal rasé et vêtu de guenilles. Quand il lui dit 'Je suis ton père', la fillette répond : 'Non, mon père est mort, et vous me faites mal, monsieur !'. Ce refus involontaire assène le coup de grâce au condamné : son cœur est brisé avant même que le couperet ne tombe.",
        summaryAr: "قبل ساعات قليلة من موعد المقصلة، يُمنح السجين إذناً برؤية ابنته ماري لوداعها. يضمها إلى صدره بشوق جارف ويغمرها بالقبلات، لكن الطفلة تنفر منه وترتجف خوفاً، عاجزة عن التعرف على ذلك الرجل الشاحب ذي اللحية الكثة والثياب الممزقة. وحين يقول لها متوسلاً: 'أنا أبوكِ يا ماري'، تجيبه ببراءة جارحة: 'كلا، أبي قد مات، وأنت تؤلمني يا سيدي!'. مثلت تلك الكلمة ذبحاً حقيقياً لقلب الأب قبل أن تسقط شفرة الجلاد.",
        keyEvents: [
          'La dernière visite espérée comme une consolation',
          'Le contraste poignant entre la joie innocente de l’enfant et l’agonie du père',
          'La non-reconnaissance tragique : "Vous me faites mal, monsieur !"',
          'La mort morale du condamné avant sa mort physique'
        ],
        keyEventsAr: [
          'الزيارة الأخيرة التي كان السجين يترجاها كبلسم لجراحه',
          'المفارقة المؤلمة بين حيوية الطفلة وبراءتها وبين احتضار الأب',
          'الكلمة القاضية التي فجرت قلبه: "لست أبي، بل أنت تؤلمني يا سيدي!"',
          'الموت النفسي المحقق للأب قبل حلول موعد الموت الجسدي'
        ],
        excerptFr: "Elle m'a regardé d’un air étonné, puis effrayé. 'Monsieur, me dit-elle, ne me serrez pas si fort !' Je criai : 'Marie ! Mais je suis ton papa !' Elle secoua la tête : 'Non, mon papa est bien plus beau que vous, et maman m'a dit qu'il était au ciel.' J'ai laissé retomber mes bras. Tout est fini. La guillotine n'a plus rien à tuer en moi.",
        excerptAr: "نظرت إليّ بدهشة سرعان ما تحولت إلى ذعر؛ وقالت لي: 'يا سيدي، لا تعانقني بقوة هكذا!' فصرخت بقلب مذبوح: 'ماري! أنا أبوكِ الحبيب!' فهزت رأسها رافضة: 'كلا، إن أبي أجمل منك بكثير، وماما أخبرتني أنه ذهب إلى السماء.' أرخيت ذراعي في استسلام؛ لقد انتهى كل شيء، ولم يعد في جسدي شيء للمقصلة كي تقتله.",
        figuresDeStyle: [
          { phrase: "La guillotine n'a plus rien à tuer en moi.", figure: "Métaphore / Hyperbole", explanation: "L'anéantissement affectif a précédé la mort corporelle." }
        ]
      },
      {
        number: 49,
        title: 'Chapitre 49 : Les quatre heures fatales et l’ultime appel',
        titleAr: 'الفصل 49: دقات الساعة الرابعة: اللحظات الأخيرة والرجاء الأخير',
        summaryFr: "Il est quatre heures de l'après-midi à l'Hôtel de Ville. La foule immense hurle sur la place de Grève en attendant le spectacle sanglant. Le bourreau et ses aides ont terminé la sinistre 'toilette du condamné' (cheveux tondus, mains attachées derrière le dos). Dans un ultime sursaut d'instinct de survie, le condamné supplie qu'on lui accorde cinq minutes de répit dans l'espoir illusoire d'une grâce royale. Le pas des gendarmes résonne dans l'escalier. Le roman s'interrompt brusquement sur ce cri d'angoisse suspendu.",
        summaryAr: "الساعة تشير إلى الرابعة بعد الزوال بمقر بلدية باريس؛ الحشود الغفيرة تملأ ساحة الإعدام وتطلق هتافات متعطشة للدم. أتم الجلاد ومساعدوه 'طقوس التزيين' القاتمة بقص الشعر وتمزيق الياقة وربط اليدين خلف الظهر. في ومضة غريزية أخيرة للتشبث بالحياة، يتوسل السجين للحصول على مهلة خمس دقائق لعل عفواً ملكياً يصدر في اللحظة الأخيرة. لكن وقع أقدام الحراس يرن على الدرج، وتنتهي الرواية فجأة عند صرخة معلقة في وجه الموت.",
        keyEvents: [
          'La cloche de l’Hôtel de Ville qui sonne quatre heures',
          'La clameur sauvage de la populace massée sur la place de Grève',
          'La préparation physique du supplicié (la toilette)',
          'La supplication désespérée pour obtenir un sursis de cinq minutes',
          'La fin abrupte et magistrale du plaidoyer hugolien'
        ],
        keyEventsAr: [
          'دقات جرس بلدية باريس معلنة بلوغ الساعة الرابعة تماماً',
          'صيحات الجماهير الغفيرة في ساحة الإعدام بانتظار الفرجة',
          'استكمال طقوس إعداد المحكوم وقص شعره وتقييده بالحبال',
          'الرجاء الأخير المستميت لطلب خمس دقائق عفو وتأجيل',
          'النهاية المفتوحة المدوية للمرافعة الأدبية الخالدة'
        ],
        excerptFr: "Quatre heures ! On est venu me chercher. Ils m’ont coupé les cheveux, ils m’ont lié les mains derrière le dos avec une corde serrée. En bas, sur la place, j’entends le peuple qui trépigne et qui rit. Une grâce ! Par pitié, une grâce ! Cinq minutes encore ! On attend peut-être le courrier du roi !... Voici des pas qui montent l’escalier...",
        excerptAr: "الرابعة تماماً! لقد أتوا لاقتيادي إلى الموت. قصوا شعري وأوثقوا يدي وراء ظهري بحبل مشدود. وفي الأسفل، في الساحة، أسمع الجماهير تقرع الأرض بأقدامها وتضحك صاخبة. عفواً ملكياً! بربكم وبحق الرحمة، التمسوا لي عفواً! خمس دقائق فقط بعد! لعل رسول الملك في الطريق حاملاً الصفح!... ها هي ذي خطوات تصعد الدرج...",
        figuresDeStyle: [
          { phrase: "Voici des pas qui montent l’escalier...", figure: "Suspension / Point de suspension", explanation: "Laisse le lecteur face au vide tragique de la mort imminente." }
        ]
      }
    ]
  }
};
