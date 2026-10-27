import { BookId } from '../types';

export interface ChapterEventItem {
  id: string;
  bookId: BookId;
  chapterNumber: number;
  eventOrder: number;
  title: string;
  titleArabic: string;
  frenchExcerpt: string;
  arabicDescription: string;
  characters: string[];
  location: string;
  pageNumber: number;
  isKeyTurningPoint?: boolean;
}

export interface ChapterFullSummary {
  chapterNumber: number;
  chapterTitle: string;
  chapterTitleArabic: string;
  startPage: number;
  endPage: number;
  globalSummaryArabic: string;
  globalSummaryFrench: string;
  events: ChapterEventItem[];
}

export const CHAPTER_EVENTS_DATA: Record<BookId, ChapterFullSummary[]> = {
  la_boite_a_merveilles: [
    // ==========================================
    // CHAPITRE 1
    // ==========================================
    {
      chapterNumber: 1,
      chapterTitle: "Chapitre I",
      chapterTitleArabic: "الفصل الأول: العزلة، دار الشوافة، الحمام الشعبي، وشجار الغسيل",
      startPage: 1,
      endPage: 6,
      globalSummaryArabic: "استرجاع الراوي لعزلته، استعراض سكان دار الشوافة وطقوس كناوة، عالم الطفل الخيالي، عذاب الحمام الشعبي، وشجار الغسيل العنيف بين لالة زبيدة ورحمة.",
      globalSummaryFrench: "Le narrateur évoque sa solitude d'enfant, décrit Dar Chouafa et ses habitants, raconte son supplice au bain maure et la violente dispute entre sa mère et Rahma.",
      events: [
        {
          id: 'lbm-ch1-ev1',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 1,
          eventOrder: 1,
          title: "Le problème du narrateur adulte : la solitude",
          titleArabic: "1. مشكلة الراوي الراشد: العزلة والوحدة القاتلة",
          frenchExcerpt: "Le soir, quand tous dorment, les riches dans leurs chauds burnous... moi, je ne dors pas. Je songe à ma solitude...",
          arabicDescription: "استرجاع الراوي البالغ لمعاناته مع العزلة منذ سن السادسة، ومحاولته صيد عصفور صغير لم يؤنس وحدته.",
          characters: ["Sidi Mohamed (narrateur adulte)"],
          location: "Dar Chouafa à Fès",
          pageNumber: 1,
          isKeyTurningPoint: false
        },
        {
          id: 'lbm-ch1-ev2',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 1,
          eventOrder: 2,
          title: "Les habitants de Dar Chouafa",
          titleArabic: "2. سكان دار الشوافة وتوزيع الطوابق",
          frenchExcerpt: "Au rez-de-chaussée habitait une voyante très estimée... Au premier étage, Driss El Aouad, sa femme Rahma et Zineb. Au deuxième, Fatma Bziouya et ma famille.",
          arabicDescription: "وصف طوابق الدار وسكانها: الشوافة كنزة في السفلي، إدريس العواد وزوجته رحمة وابنتهما زينب في الأول، وفاطمة البزيوية والراوي وأسرته في الثاني.",
          characters: ["Lalla Kenza (La Chouafa)", "Driss El Aouad", "Rahma", "Zineb", "Fatma Bziouya", "Lalla Zoubida", "Maâlem Abdeslem"],
          location: "Dar Chouafa (زنقة النوايل)",
          pageNumber: 2,
          isKeyTurningPoint: false
        },
        {
          id: 'lbm-ch1-ev3',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 1,
          eventOrder: 3,
          title: "La voyante et ses rites mensuels de Gnaoua",
          titleArabic: "3. الشوافة وطقوس ليلة كناوة الشهرية مع الشياطين",
          frenchExcerpt: "Une fois par mois, la voyante offrait une fête aux démons noirs... La fumée de benjoin montait jusqu'à notre étage dans un vacarme de tambours.",
          arabicDescription: "إقامة الشوافة كنزة لطقوس ليلة كناوة الشهرية بالبخور وقراقب الحديد والموسيقى لإرضاء ملوك الجان.",
          characters: ["Lalla Kenza", "Les Gnaouas", "Les adeptes"],
          location: "Rez-de-chaussée de Dar Chouafa",
          pageNumber: 2,
          isKeyTurningPoint: false
        },
        {
          id: 'lbm-ch1-ev4',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 1,
          eventOrder: 4,
          title: "L'univers du narrateur enfant : histoires d'Abdellah l'épicier et discours du père",
          titleArabic: "4. عالم الطفل الخيالي: حكايات عبد الله البقال وأحاديث الأب",
          frenchExcerpt: "Mon univers était nourri par les histoires fabuleuses d'Abdellah l'épicier et les récits graves de mon père sur l'au-delà.",
          arabicDescription: "تغذية مخيلة سيدي محمد الواسعة بقصص عبد الله البقال العجيبة ومواعظ والده المعلم عبد السلام عن الجنة والنار والغيبيات.",
          characters: ["Sidi Mohamed", "Abdellah l'épicier", "Maâlem Abdeslem"],
          location: "La boutique d'Abdellah et Dar Chouafa",
          pageNumber: 3,
          isKeyTurningPoint: false
        },
        {
          id: 'lbm-ch1-ev5',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 1,
          eventOrder: 5,
          title: "Le Bain maure : lieu de supplice pour l'enfant",
          titleArabic: "5. الحمام الشعبي: مكان العذاب والبخار والصراخ",
          frenchExcerpt: "Le lendemain, ma mère me réveilla pour aller au bain maure. C'était pour moi un lieu de supplice. Je croyais y voir des démons gesticuler dans la vapeur tiède.",
          arabicDescription: "أخذ لالة زبيدة لابنها سيدي محمد للحمام الشعبي، وتشبيهه المكان بالجحيم والشياطين بسبب الحرارة والضجيج والازدحام.",
          characters: ["Sidi Mohamed", "Lalla Zoubida", "Les baigneuses"],
          location: "Le bain maure à Fès",
          pageNumber: 3,
          isKeyTurningPoint: true
        },
        {
          id: 'lbm-ch1-ev6',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 1,
          eventOrder: 6,
          title: "La Boîte à Merveilles et son rôle magique dans la vie du narrateur",
          titleArabic: "6. علبة العجائب ودورها السحري في حياة الطفل وتفريج عزلته",
          frenchExcerpt: "Ma boîte à merveilles contenait des objets hétéroclites : des boutons de verre, des perles, des clous sans tête... C'était mon trésor et mon unique refuge.",
          arabicDescription: "لجوء الطفل إلى علبته الحديدية المليئة بالأزرار والخرز والمسامير للهروب من قسوة الواقع وصنع عالمه الخيالي المضيء.",
          characters: ["Sidi Mohamed"],
          location: "Chambre de Dar Chouafa",
          pageNumber: 4,
          isKeyTurningPoint: true
        },
        {
          id: 'lbm-ch1-ev7',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 1,
          eventOrder: 7,
          title: "Le lendemain du bain : récits aux voisines et violente dispute avec Rahma",
          titleArabic: "7. اليوم الموالي للحمام: حكاية الأم للجارات وشجار الغسيل العنيف مع رحمة",
          frenchExcerpt: "Le lundi, ma mère racontait à toutes les voisines ses souffrances... Soudain, une dispute sauvage éclata avec Rahma à propos de la lessive.",
          arabicDescription: "سرد لالة زبيدة لمعاناتها في الحمام لجاراتها، ثم اندلاع مشادة كلامية عنيفة وتبادل الشتائم مع رحمة على السطح بسبب حبل الغسيل.",
          characters: ["Lalla Zoubida", "Rahma", "Sidi Mohamed", "Maâlem Abdeslem", "Fatma Bziouya"],
          location: "Terrasse de Dar Chouafa",
          pageNumber: 5,
          isKeyTurningPoint: true
        }
      ]
    },

    // ==========================================
    // CHAPITRE 2
    // ==========================================
    {
      chapterNumber: 2,
      chapterTitle: "Chapitre II",
      chapterTitleArabic: "الفصل الثاني: كآبة الثلاثاء بالمسيد، وزيارة ضريح سيدي علي بوغالب",
      startPage: 7,
      endPage: 14,
      globalSummaryArabic: "يوم الثلاثاء الكئيب في المسيد وعصا الفقيه، زيارة لالة عائشة، الذهاب لضريح سيدي علي بوغالب، حادثة خمش القط، وإهداء رحمة كابوشون الزجاج للطفل.",
      globalSummaryFrench: "Le triste mardi au Msid, la visite de Lalla Aïcha, le pèlerinage au sanctuaire de Sidi Ali Boughaleb, l'agression du chat roux et le cabochon de verre offert par Rahma.",
      events: [
        {
          id: 'lbm-ch2-ev1',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 2,
          eventOrder: 1,
          title: "Le triste mardi au Msid sous la sévérité du Fqih",
          titleArabic: "1. يوم الثلاثاء الكئيب في المسيد وقسوة الفقيه",
          frenchExcerpt: "Le mardi était pour moi un jour néfaste. Le Fqih distribuait les coups de baguette avec une régularité de métronome.",
          arabicDescription: "خوف ورهبة الأطفال من يوم الثلاثاء المخصص لاستظهار القرآن أمام الفقيه الصارم بعصا السفرجل.",
          characters: ["Sidi Mohamed", "Le Fqih"],
          location: "Le Msid (المسيد)",
          pageNumber: 7,
          isKeyTurningPoint: false
        },
        {
          id: 'lbm-ch2-ev2',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 2,
          eventOrder: 2,
          title: "La visite de Lalla Aïcha à son amie intime Lalla Zoubida",
          titleArabic: "2. زيارة لالة عائشة واقتراح زيارة الولي الصالح للتبرك",
          frenchExcerpt: "Lalla Aïcha, ancienne voisine et amie intime de ma mère, vint nous rendre visite et la trouva malade du mauvais œil.",
          arabicDescription: "قدوم لالة عائشة لتجد صديقتها لالة زبيدة مريضة بالصداع والعين، واقتراحها زيارة ضريح سيدي علي بوغالب للتبرك والاستشفاء.",
          characters: ["Lalla Zoubida", "Lalla Aïcha", "Sidi Mohamed"],
          location: "Chambre de Lalla Zoubida",
          pageNumber: 9,
          isKeyTurningPoint: false
        },
        {
          id: 'lbm-ch2-ev3',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 2,
          eventOrder: 3,
          title: "Le pèlerinage au sanctuaire de Sidi Ali Boughaleb",
          titleArabic: "3. زيارة ضريح سيدي علي بوغالب والدعاء والشرب من مائه المبارك",
          frenchExcerpt: "Nous arrivâmes au sanctuaire de Sidi Ali Boughaleb. Ma mère et Lalla Aïcha baisèrent le seuil avec dévotion.",
          arabicDescription: "النساء يشربن من ماء الضريح المقدس ويغسلن وجه الطفل تبركاً وطلباً للحفظ والشفاء.",
          characters: ["Lalla Zoubida", "Lalla Aïcha", "Sidi Mohamed", "Le Moqaddem"],
          location: "Sanctuaire de Sidi Ali Boughaleb",
          pageNumber: 10,
          isKeyTurningPoint: false
        },
        {
          id: 'lbm-ch2-ev4',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 2,
          eventOrder: 4,
          title: "L'attaque soudaine du gros chat roux et la blessure de l'enfant",
          titleArabic: "4. هجوم القط الأصهب على سيدي محمد وخمش خده بالدماء",
          frenchExcerpt: "Soudain, un gros chat roux m'attaqua et me griffa la joue. Mes cris alertèrent toute l'assemblée.",
          arabicDescription: "هجوم قط الضريح على الطفل بعد مداعبته، وإصابته بجرح نازف استدعى غسله بالماء المقدس وتلطيخه بالحناء.",
          characters: ["Sidi Mohamed", "Lalla Zoubida", "Lalla Aïcha"],
          location: "Cour du sanctuaire",
          pageNumber: 11,
          isKeyTurningPoint: true
        },
        {
          id: 'lbm-ch2-ev5',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 2,
          eventOrder: 5,
          title: "Deux jours de repos et le cadeau du cabochon de verre offert par Rahma",
          titleArabic: "5. عطلة يومين في البيت وإهداء رحمة كابوشون الزجاج كعربون صلح",
          frenchExcerpt: "Rahma me donna un cabochon de verre à facettes. Je le glissai avec ravissement dans ma Boîte à Merveilles.",
          arabicDescription: "مكوث الطفل في الفراش للراحة بعد الحادثة، وتقديم الجارة رحمة فص زجاجي ثمين له كبادرة صلح مع والدته لالة زبيدة.",
          characters: ["Sidi Mohamed", "Rahma", "Lalla Zoubida"],
          location: "Dar Chouafa",
          pageNumber: 13,
          isKeyTurningPoint: false
        }
      ]
    },

    // ==========================================
    // CHAPITRE 3
    // ==========================================
    {
      chapterNumber: 3,
      chapterTitle: "Chapitre III",
      chapterTitleArabic: "الفصل الثالث: مصباح البترول، ضياع زينب، ووليمة الصدقة",
      startPage: 15,
      endPage: 20,
      globalSummaryArabic: "شراء مصباح البترول، اختفاء زينب في زحام موكب الرصيف، تضامن نساء الدار والعثور عليها بدار قيطون، وإقامة صدقة الكسكس للفقراء.",
      globalSummaryFrench: "L'achat de la lampe à pétrole, la disparition dramatique de Zineb au R'cif, la délivrance à Dar Qitoun et le grand repas de charité.",
      events: [
        {
          id: 'lbm-ch3-ev1',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 3,
          eventOrder: 1,
          title: "L'achat de la nouvelle lampe à pétrole par Maâlem Abdeslem",
          titleArabic: "1. إعجاب الأم بمصباح فاطمة وشراء الأب لمصباح بترول جديد",
          frenchExcerpt: "Fatma Bziouya alluma sa nouvelle lampe à pétrole... Mon père nous en rapporta une pareille le soir même.",
          arabicDescription: "انبهار لالة زبيدة بمصباح جارتها فاطمة البزيوية، وسرعة المعلم عبد السلام في شراء مصباح نحاسي مماثل لإنارة غرفتهم وإدخال البهجة على أسرته.",
          characters: ["Lalla Zoubida", "Maâlem Abdeslem", "Fatma Bziouya", "Sidi Mohamed"],
          location: "Dar Chouafa",
          pageNumber: 15,
          isKeyTurningPoint: false
        },
        {
          id: 'lbm-ch3-ev2',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 3,
          eventOrder: 2,
          title: "La disparition dramatique de Zineb dans la foule du R'cif",
          titleArabic: "2. اختفاء وضياع الطفلة زينب في زحام موكب العقيقة بالرصيف",
          frenchExcerpt: "Rahma montait l'escalier en pleurant et criant : « Zineb est perdue ! Elle a disparu dans la foule ! »",
          arabicDescription: "ضياع الطفلة زينب في زحام الرصيف، وانهيار رحمة بالصراخ والبكاء، وتضامن لالة زبيدة ونساء الدار معها بالبكاء والبحث.",
          characters: ["Rahma", "Lalla Zoubida", "Fatma Bziouya", "Zineb"],
          location: "Quartier R'cif à Fès",
          pageNumber: 17,
          isKeyTurningPoint: true
        },
        {
          id: 'lbm-ch3-ev3',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 3,
          eventOrder: 3,
          title: "Les retrouvailles heureuses de Zineb à Dar Qitoun",
          titleArabic: "3. العثور على زينب في مأوى الأطفال التائهين بدار قيطون",
          frenchExcerpt: "À Dar Qitoun, asile des orphelins et enfants trouvés, nous retrouvâmes Zineb dévorant un morceau de pain.",
          arabicDescription: "العثور على زينب سالمة في مأوى الأطفال الضائعين بدار قيطون وعودتها إلى أحضان أمها رحمة وسط دموع الفرح.",
          characters: ["Lalla Zoubida", "Rahma", "Zineb", "Sidi Mohamed"],
          location: "Dar Qitoun à Fès",
          pageNumber: 18,
          isKeyTurningPoint: true
        },
        {
          id: 'lbm-ch3-ev4',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 3,
          eventOrder: 4,
          title: "Le grand repas de charité (couscous) offert aux mendiants aveugles",
          titleArabic: "4. وليمة صدقة الكسكس وإطعام فقراء ومكفوفي فاس شكراً لله",
          frenchExcerpt: "Rahma organisa un grand repas de charité. Les mendiants aveugles mangèrent à satiété et bénirent la maison.",
          arabicDescription: "إعداد رحمة لقصاع الكسكس بلحم البقر وتوزيعها على فقراء الحي ومكفوفي فاس شكراً لله على نجاة ابنتها.",
          characters: ["Rahma", "Les mendiants aveugles", "Sidi Mohamed", "Lalla Zoubida"],
          location: "Dar Chouafa",
          pageNumber: 19,
          isKeyTurningPoint: false
        }
      ]
    },

    // ==========================================
    // CHAPITRE 4
    // ==========================================
    {
      chapterNumber: 4,
      chapterTitle: "Chapitre IV",
      chapterTitleArabic: "الفصل الرابع: ثرثرة السطح، زيارة لالة عائشة، وأزمة مولاي العربي",
      startPage: 21,
      endPage: 28,
      globalSummaryArabic: "ثرثرة النساء على السطح في أول الربيع، زيارة لالة عائشة في زنقة الحجامين، لعب الأطفال، وقدوم مولاي العربي مهموماً بخيانة شريكه عبد القادر.",
      globalSummaryFrench: "Le bavardage matinal des femmes sur la terrasse, la visite chez Lalla Aïcha à Zankat Hjamen, et l'annonce de la ruine de Moulay Larbi trompé par Abdelkader.",
      events: [
        {
          id: 'lbm-ch4-ev1',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 4,
          eventOrder: 1,
          title: "Les commérages matinaux des femmes sur la terrasse",
          titleArabic: "1. ثرثرة النساء وتبادل الأخبار على سطح دار الشوافة في الربيع",
          frenchExcerpt: "Au début du printemps, les femmes se rencontraient sur la terrasse pour bavarder et faire sécher la laine.",
          arabicDescription: "اجتماع نساء الدار على السطح لغسل الصوف وتبادل أخبار ومعارف دروب فاس القديمة.",
          characters: ["Lalla Zoubida", "Rahma", "Fatma Bziouya"],
          location: "Terrasse de Dar Chouafa",
          pageNumber: 21,
          isKeyTurningPoint: false
        },
        {
          id: 'lbm-ch4-ev2',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 4,
          eventOrder: 2,
          title: "La visite de Lalla Zoubida chez Lalla Aïcha à Zankat Hjamen",
          titleArabic: "2. زيارة لالة زبيدة وابنها لصديقتها لالة عائشة في زنقة الحجامين",
          frenchExcerpt: "Nous partîmes rendre visite à Lalla Aïcha dans son quartier paisible de Zankat Hjamen.",
          arabicDescription: "ذهاب لالة زبيدة رفقة سيدي محمد لزيارة لالة عائشة واستقبالها لهما بحفاوة وكرم كبير.",
          characters: ["Lalla Zoubida", "Lalla Aïcha", "Sidi Mohamed"],
          location: "Maison de Lalla Aïcha (Zankat Hjamen)",
          pageNumber: 23,
          isKeyTurningPoint: false
        },
        {
          id: 'lbm-ch4-ev3',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 4,
          eventOrder: 3,
          title: "Les jeux d'enfants et la querelle avec les gamins du quartier",
          titleArabic: "3. ألعاب الأطفال وشجار سيدي محمد مع أطفال الحي",
          frenchExcerpt: "Sur la terrasse de Lalla Aïcha, nous jouions à la mariée, puis une dispute éclata avec les enfants voisins.",
          arabicDescription: "لعب سيدي محمد مع أطفال الحي لعبة العرس ثم وقوع مشادة بسبب حساسية الطفل وانطوائيته.",
          characters: ["Sidi Mohamed", "Les enfants du quartier"],
          location: "Terrasse de Lalla Aïcha",
          pageNumber: 25,
          isKeyTurningPoint: false
        },
        {
          id: 'lbm-ch4-ev4',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 4,
          eventOrder: 4,
          title: "L'arrivée de Moulay Larbi et l'annonce de l'escroquerie d'Abdelkader",
          titleArabic: "4. قدوم مولاي العربي مهموماً بسبب خيانة ونكران شريكه عبد القادر",
          frenchExcerpt: "Moulay Larbi entra, le visage défait. Son ouvrier et associé Abdelkader l'avait trahi et traîné devant le Pacha.",
          arabicDescription: "دخول مولاي العربي منهاراً بعد أن أنكر شريكه وصانعه عبد القادر ديونه واستولى على ورشته بمساعدة شهود زور.",
          characters: ["Moulay Larbi", "Lalla Aïcha", "Lalla Zoubida"],
          location: "Maison de Lalla Aïcha",
          pageNumber: 27,
          isKeyTurningPoint: true
        }
      ]
    },

    // ==========================================
    // CHAPITRE 5
    // ==========================================
    {
      chapterNumber: 5,
      chapterTitle: "Chapitre V",
      chapterTitleArabic: "الفصل الخامس: جنازة الحلاق، حكايات عبد الله البقال، وشجار قط زينب",
      startPage: 29,
      endPage: 38,
      globalSummaryArabic: "وفاة الحلاق سيدي محمد بن الطاهر ونواح النساء في الجنازة، سرد حكايات عبد الله البقال، وحادثة العصفور الجريح وشجار سيدي محمد مع زينب بسبب قطها.",
      globalSummaryFrench: "La mort et les obsèques du coiffeur Sidi Mohamed Ben Taher, les récits fascinants d'Abdellah l'épicier et la querelle sanglante avec Zineb.",
      events: [
        {
          id: 'lbm-ch5-ev1',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 5,
          eventOrder: 1,
          title: "La mort et les funérailles de Sidi Mohamed Ben Taher le coiffeur",
          titleArabic: "1. وفاة الحلاق سيدي محمد بن الطاهر ونواح النساء في الجنازة",
          frenchExcerpt: "Des hurlements montèrent de la ruelle : Sidi Mohamed Ben Taher, le coiffeur, venait de rendre l'âme.",
          arabicDescription: "سماع صراخ النادبات لوفاة الحلاق المجاور، ومشاركة لالة زبيدة في العزاء، وتأثر سيدي محمد بمشاهد الموت والنعش.",
          characters: ["Sidi Mohamed Ben Taher (défunt)", "Lalla Zoubida", "Sidi Mohamed", "Les pleureuses"],
          location: "Ruelle et maison du coiffeur",
          pageNumber: 29,
          isKeyTurningPoint: true
        },
        {
          id: 'lbm-ch5-ev2',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 5,
          eventOrder: 2,
          title: "Les récits légendaires autour d'Abdellah l'épicier",
          titleArabic: "2. استحضار شخصية وحكايات عبد الله البقال الراوي الأسطوري",
          frenchExcerpt: "Abdellah l'épicier racontait des histoires magiques que mon père me répétait le soir.",
          arabicDescription: "حديث المعلم عبد السلام عن عبد الله البقال الذي يحكي قصص الملوك والأولياء في دكانه الصغير بفاس.",
          characters: ["Abdellah l'épicier", "Maâlem Abdeslem", "Sidi Mohamed"],
          location: "Boutique d'Abdellah",
          pageNumber: 33,
          isKeyTurningPoint: false
        },
        {
          id: 'lbm-ch5-ev3',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 5,
          eventOrder: 3,
          title: "L'incident de l'oisillon blessé et la querelle avec Zineb et son chat",
          titleArabic: "3. حادثة العصفور الجريح وشجار سيدي محمد الدامي مع زينب بسبب قطها",
          frenchExcerpt: "Le chat de Zineb s'empara de mon petit moineau blessé. Furieux, je me jetai sur Zineb et nous nous battîmes violemment.",
          arabicDescription: "سرقة قط زينب لعصفور سيدي محمد الصغير واندلاع شجار عنيف بالخدش والعض بين سيدي محمد وزينب.",
          characters: ["Sidi Mohamed", "Zineb", "Le chat"],
          location: "Patio de Dar Chouafa",
          pageNumber: 36,
          isKeyTurningPoint: false
        }
      ]
    },

    // ==========================================
    // CHAPITRE 6
    // ==========================================
    {
      chapterNumber: 6,
      chapterTitle: "Chapitre VI",
      chapterTitleArabic: "الفصل السادس: تنظيف المسيد، شراء ملابس عاشوراء، وقصة الحلاق عبد الرحمان",
      startPage: 39,
      endPage: 48,
      globalSummaryArabic: "تنظيف وتبييض المسيد لعاشوراء وتعيين سيدي محمد رئيساً للحكاكين، الذهاب للقيسارية لشراء كسوة العيد، وقصة الحلاق سي عبد الرحمان الحجام.",
      globalSummaryFrench: "Le grand nettoyage du Msid pour l'Achoura, l'achat des vêtements neufs à la Kissaria et la mésaventure du coiffeur Si Abderrahmane.",
      events: [
        {
          id: 'lbm-ch6-ev1',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 6,
          eventOrder: 1,
          title: "Le grand nettoyage du Msid et désignation de Sidi Mohamed chef des frotteurs",
          titleArabic: "1. تنظيف وتبييض المسيد وتعيين سيدي محمد رئيساً لفريق الحكاكين",
          frenchExcerpt: "Le Fqih nous divisa en équipes pour blanchir les murs et frotter les nattes. Il me nomma chef des frotteurs.",
          arabicDescription: "حماس وبهجة الأطفال في غسل حصر المسيد وتبييض جدرانه استعداداً لعيد عاشوراء برئاسة سيدي محمد.",
          characters: ["Le Fqih", "Sidi Mohamed", "Les écoliers du Msid"],
          location: "Le Msid",
          pageNumber: 39,
          isKeyTurningPoint: false
        },
        {
          id: 'lbm-ch6-ev2',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 6,
          eventOrder: 2,
          title: "La sortie à la Kissaria et l'achat des vêtements neufs de l'Achoura",
          titleArabic: "2. الخروج للقيسارية وشراء ملابس عاشوراء الجديدة والمساومة",
          frenchExcerpt: "Ma mère m'emmena à la Kissaria pour m'acheter une djellaba blanche, un gilet brodé et une sacoche rouge.",
          arabicDescription: "مساومة لالة زبيدة للتجار في القيسارية وشراء جلباب أبيض وسترة وحقيبة جلدية حمراء للعيد للطفل.",
          characters: ["Lalla Zoubida", "Sidi Mohamed", "Les marchands de tissus"],
          location: "La Kissaria à Fès",
          pageNumber: 42,
          isKeyTurningPoint: false
        },
        {
          id: 'lbm-ch6-ev3',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 6,
          eventOrder: 3,
          title: "L'histoire et la peur de Si Abderrahmane le coiffeur et saigneur",
          titleArabic: "3. حكاية وخوف سيدي محمد من الحلاق سي عبد الرحمان الحجام",
          frenchExcerpt: "Je tremblais à l'idée d'aller chez Si Abderrahmane le coiffeur, car il rasait les têtes et coupait les amygdales.",
          arabicDescription: "خوف الطفل الشديد من الذهاب لدكان الحلاق عبد الرحمان الذي كان يقوم بالحلاقة والحجامة واستئصال اللوزتين للأطفال.",
          characters: ["Sidi Mohamed", "Si Abderrahmane (le coiffeur)", "Maâlem Abdeslem"],
          location: "Boutique du coiffeur",
          pageNumber: 46,
          isKeyTurningPoint: false
        }
      ]
    },

    // ==========================================
    // CHAPITRE 7
    // ==========================================
    {
      chapterNumber: 7,
      chapterTitle: "Chapitre VII",
      chapterTitleArabic: "الفصل السابع: صباح عاشوراء، احتفال المسيد، وزيارة لالة عائشة",
      startPage: 49,
      endPage: 58,
      globalSummaryArabic: "الاستيقاظ الباكر في صباح عاشوراء، لبس الثياب الجديدة، إنارة المسيد بالشموع وأمداح الأطفال، والاحتفال بالطبول وزيارة لالة عائشة بعد الزوال.",
      globalSummaryFrench: "La fête de l'Achoura : réveil joyeux, chants au Msid illuminé de bougies, repas de fête et visite de l'après-midi chez Lalla Aïcha.",
      events: [
        {
          id: 'lbm-ch7-ev1',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 7,
          eventOrder: 1,
          title: "Le réveil joyeux et l'habillage avec les vêtements neufs de l'Achoura",
          titleArabic: "1. الاستيقاظ الباكر وارتداء الجلباب والسترة الجديدة لصباح عاشوراء",
          frenchExcerpt: "Je me réveillai avant l'aube. Ma mère m'habilla de mes beaux vêtements neufs et me donna ma sacoche rouge.",
          arabicDescription: "فرحة سيدي محمد بارتداء ثياب العيد الفاخرة ورائحة البخور الزكية في الدار قبل بزوغ الفجر.",
          characters: ["Sidi Mohamed", "Lalla Zoubida", "Maâlem Abdeslem"],
          location: "Dar Chouafa",
          pageNumber: 49,
          isKeyTurningPoint: false
        },
        {
          id: 'lbm-ch7-ev2',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 7,
          eventOrder: 2,
          title: "La célébration au Msid illuminé de cierges et les chants sacrés",
          titleArabic: "2. احتفال المسيد المضاء بالشموع وترديد الأمداح الدينية مع الفقيه",
          frenchExcerpt: "Le Msid resplendissait de mille bougies. Nous chantions les louanges du Prophète sous le regard bienveillant du Fqih.",
          arabicDescription: "أجواء روحانية مبهجة في المسيد بإنارة الشموع وابتسامة الفقيه غير المعهودة وتوزيع الفواكه الجافة.",
          characters: ["Le Fqih", "Sidi Mohamed", "Les camarades du Msid"],
          location: "Le Msid",
          pageNumber: 52,
          isKeyTurningPoint: true
        },
        {
          id: 'lbm-ch7-ev3',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 7,
          eventOrder: 3,
          title: "Le repas de fête et la visite de l'après-midi chez Lalla Aïcha",
          titleArabic: "3. طعام العيد وزيارة لالة عائشة في المساء وسط طبول الشارع",
          frenchExcerpt: "L'après-midi, nous rendîmes visite à Lalla Aïcha. Les rues résonnaient des tambourins et des trompettes des enfants.",
          arabicDescription: "تناول وجبة العيد اللذيذة والذهاب لتهنئة لالة عائشة بالعيد وسط بهجة ألعاب الأطفال وطبولهم في أزقة المدينة.",
          characters: ["Lalla Zoubida", "Lalla Aïcha", "Sidi Mohamed"],
          location: "Zankat Hjamen",
          pageNumber: 56,
          isKeyTurningPoint: false
        }
      ]
    },

    // ==========================================
    // CHAPITRE 8
    // ==========================================
    {
      chapterNumber: 8,
      chapterTitle: "Chapitre VIII",
      chapterTitleArabic: "الفصل الثامن: حر الصيف، سوق الصياغ، وعراك الأساور المشؤومة",
      startPage: 59,
      endPage: 66,
      globalSummaryArabic: "انتقال المسيد إلى الضريح البارد اتقاءً للحر، اصطحاب الأب لأسرته لسوق الصياغ، شجار عنيف مع الدلال، ورفض الأم للأساور واعتبارها فأل شؤم.",
      globalSummaryFrench: "Le transfert du Msid au sanctuaire frais, l'achat des bracelets au Souk des bijoutiers, la violente bagarre avec le dellal et le refus superstitieux des bijoux.",
      events: [
        {
          id: 'lbm-ch8-ev1',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 8,
          eventOrder: 1,
          title: "Le transfert du Msid au sanctuaire frais à cause de la chaleur de l'été",
          titleArabic: "1. نقل المسيد مؤقتاً إلى ضريح بارد اتقاءً لحرارة الصيف الشديدة",
          frenchExcerpt: "Avec les chaleurs étouffantes de l'été, le Fqih décida de déménager le Msid dans un sanctuaire voisin bien aéré.",
          arabicDescription: "تحسن وتيرة الحفظ والنشاط مع نسيم الضريح البارد وشعور التلاميذ بالراحة بعيداً عن ضيق قاعة المسيد.",
          characters: ["Le Fqih", "Sidi Mohamed"],
          location: "Sanctuaire frais à Fès",
          pageNumber: 59,
          isKeyTurningPoint: false
        },
        {
          id: 'lbm-ch8-ev2',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 8,
          eventOrder: 2,
          title: "La violente bagarre au Souk des Bijoutiers entre le père et le Dellal",
          titleArabic: "2. عراك دامٍ في سوق الصياغ بين المعلم عبد السلام والسمسار (الدلال)",
          frenchExcerpt: "Une bagarre sanglante éclata aussitôt entre mon père et le courtier malhonnête qui l'avait insulté.",
          arabicDescription: "شجار المعلم عبد السلام مع الدلال في سوق الحلي دفاعاً عن كرامته وتورم وجهه وثيابه الممزقة بعد الخصام.",
          characters: ["Maâlem Abdeslem", "Le Dellal", "Lalla Zoubida", "Sidi Mohamed"],
          location: "Souk des Bijoutiers à Fès",
          pageNumber: 62,
          isKeyTurningPoint: true
        },
        {
          id: 'lbm-ch8-ev3',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 8,
          eventOrder: 3,
          title: "Le refus superstitieux des bracelets et la maladie fébrile de l'enfant",
          titleArabic: "3. رفض الأم للأساور واعتبارها مجلوبة بالدم والشؤم وإصابة الطفل بالحمى",
          frenchExcerpt: "Ma mère refusa de toucher aux bracelets. Elle affirmait qu'ils étaient trempés de sang et portaient malheur.",
          arabicDescription: "تطير لالة زبيدة من أساور الشمس والقمر معتبرة إياها مجلوبة بالدم والشؤم، وإصابة سيدي محمد بالحمى ومرض شديد.",
          characters: ["Lalla Zoubida", "Maâlem Abdeslem", "Sidi Mohamed"],
          location: "Dar Chouafa",
          pageNumber: 64,
          isKeyTurningPoint: true
        }
      ]
    },

    // ==========================================
    // CHAPITRE 9
    // ==========================================
    {
      chapterNumber: 9,
      chapterTitle: "Chapitre IX",
      chapterTitleArabic: "الفصل التاسع: إفلاس الأب ومغادرته فاس للعمل حصاداً",
      startPage: 67,
      endPage: 78,
      globalSummaryArabic: "فقدان المعلم عبد السلام لرأس ماله في سوق الثياب، قراره بالسفر للعمل في الحصاد، رحيله فجراً، وحزن ووحشة الأسرة وإغلاق العلبة.",
      globalSummaryFrench: "La ruine de Maâlem Abdeslem au souk des tissus, sa décision courageuse de partir aux moissons et la tristesse de la famille esseulée.",
      events: [
        {
          id: 'lbm-ch9-ev1',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 9,
          eventOrder: 1,
          title: "La catastrophe financière : perte du capital de Maâlem Abdeslem au souk",
          titleArabic: "1. الكارثة المالية: ضياع رأس مال المعلم عبد السلام في زحام السوق",
          frenchExcerpt: "Mon père entra le soir, pâle et défait. Il avait perdu tout son argent dans la cohue du souk des tissus.",
          arabicDescription: "دخول الأب شاحباً منكسراً وإعلانه فقدان كل مدخراته ورأس مال ورشته في زحام سوق الأقمشة، وسقوط الأسرة في فقر مدقع.",
          characters: ["Maâlem Abdeslem", "Lalla Zoubida"],
          location: "Dar Chouafa",
          pageNumber: 68,
          isKeyTurningPoint: true
        },
        {
          id: 'lbm-ch9-ev2',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 9,
          eventOrder: 2,
          title: "La décision courageuse du père de partir travailler comme moissonneur",
          titleArabic: "2. قرار الأب الشجاع بالسفر للعمل كحصاد في حقول القمح خارج فاس",
          frenchExcerpt: "Il nous annonça calmement qu'il partait travailler comme moissonneur aux environs de Fès pour reconstituer son capital.",
          arabicDescription: "عزم الأب على العمل في الحصاد الشاق بعرق جبينه لإعادة تأسيس ورشته وإعالة أسرته بعزة نفس وكبرياء دون طلب المساعدة.",
          characters: ["Maâlem Abdeslem", "Lalla Zoubida", "Sidi Mohamed"],
          location: "Dar Chouafa",
          pageNumber: 70,
          isKeyTurningPoint: true
        },
        {
          id: 'lbm-ch9-ev3',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 9,
          eventOrder: 3,
          title: "Le départ du père à l'aube et le vide glacial dans la maison",
          titleArabic: "3. مغادرة الأب مع فجر الصباح وشعور اليتم والحزن وإغلاق العلبة",
          frenchExcerpt: "Mon père partit à l'aube naissante. La maison devint un désert glacé sans sa présence protectrice.",
          arabicDescription: "وداع حزين للأب في الصباح الباكر، وانغماس الأم والابن في الحزن والتقشف والزيارات الروحية وإغلاق علبة العجائب.",
          characters: ["Maâlem Abdeslem", "Lalla Zoubida", "Sidi Mohamed"],
          location: "Porte de Dar Chouafa",
          pageNumber: 72,
          isKeyTurningPoint: true
        }
      ]
    },

    // ==========================================
    // CHAPITRE 10
    // ==========================================
    {
      chapterNumber: 10,
      chapterTitle: "Chapitre X",
      chapterTitleArabic: "الفصل العاشر: زيارة سيدي العرافي الأعمى، ورسالة الأب، وزواج مولاي العربي",
      startPage: 79,
      endPage: 88,
      globalSummaryArabic: "زيارة لالة زبيدة ولالة عائشة للشواف الأعمى سيدي العرافي وبشاراته، وصول مرسول الأب بالمال، واكتشاف زواج مولاي العربي سراً من شابة صغيرة.",
      globalSummaryFrench: "La consultation chez le voyant aveugle Sidi El Arafi, l'arrivée du messager du père apportant de l'argent et la découverte du remariage secret de Moulay Larbi.",
      events: [
        {
          id: 'lbm-ch10-ev1',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 10,
          eventOrder: 1,
          title: "La consultation chez le voyant aveugle Sidi El Arafi",
          titleArabic: "1. زيارة الشواف الأعمى سيدي العرافي وبشاراته المطمئنة",
          frenchExcerpt: "Sidi El Arafi, le voyant aveugle, nous reçut avec douceur. Il consulta ses corbeilles de coquillages et nous prédit la fin des épreuves.",
          arabicDescription: "ذهاب المرأتين لسيدي العرافي الذي تلمس يد الطفل وطمأنهما بقرب الفرج وزوال المحنة وعودة الغائب.",
          characters: ["Sidi El Arafi", "Lalla Zoubida", "Lalla Aïcha", "Sidi Mohamed"],
          location: "Maison de Sidi El Arafi à Seffarine",
          pageNumber: 79,
          isKeyTurningPoint: false
        },
        {
          id: 'lbm-ch10-ev2',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 10,
          eventOrder: 2,
          title: "L'arrivée d'un messager apportant des nouvelles et de l'argent du père",
          titleArabic: "2. وصول مرسول يحمل المال والبيض ورسالة اطمئنان من المعلم عبد السلام",
          frenchExcerpt: "Un homme envoyé par mon père frappa à la porte et nous remit un sac de vivres et une bourse d'argent.",
          arabicDescription: "استلام الأم لمؤونة ومال أرسله المعلم عبد السلام من البادية وتأكيده أنه بصحة جيدة وسيعود قريباً.",
          characters: ["L'émissaire", "Lalla Zoubida", "Sidi Mohamed"],
          location: "Dar Chouafa",
          pageNumber: 84,
          isKeyTurningPoint: false
        },
        {
          id: 'lbm-ch10-ev3',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 10,
          eventOrder: 3,
          title: "La découverte du remariage secret de Moulay Larbi avec la fille du coiffeur",
          titleArabic: "3. الصدمة: اكتشاف زواج مولاي العربي السري من ابنة الحلاق الشابة",
          frenchExcerpt: "Lalla Aïcha apprit la terrible nouvelle : Moulay Larbi venait d'épouser en secondes noces la jeune fille du coiffeur Si Abderrahmane.",
          arabicDescription: "صدمة لالة عائشة وحزنها العميق بعد تضحيتها بذهبها من أجل زوجها ليجازيها بالزواج من فتاة صغيرة مدللة.",
          characters: ["Lalla Aïcha", "Lalla Zoubida", "Moulay Larbi"],
          location: "Dar Chouafa",
          pageNumber: 86,
          isKeyTurningPoint: true
        }
      ]
    },

    // ==========================================
    // CHAPITRE 11
    // ==========================================
    {
      chapterNumber: 11,
      chapterTitle: "Chapitre XI",
      chapterTitleArabic: "الفصل الحادي عشر: اعتذار الخاطبة سلامة، وشكايات الزوجة الشابة",
      startPage: 89,
      endPage: 95,
      globalSummaryArabic: "قدوم الخاطبة سلامة للاعتذار عن وساطتها في الزواج الثاني، وسردها الساخر للمشاكل والنزاعات بين مولاي العربي وزوجته الشابة وأمها.",
      globalSummaryFrench: "La visite et les excuses de Salama la marieuse, et le récit savoureux des déboires conjugaux de Moulay Larbi avec sa jeune épouse.",
      events: [
        {
          id: 'lbm-ch11-ev1',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 11,
          eventOrder: 1,
          title: "La visite de Salama la marieuse venue présenter ses excuses",
          titleArabic: "1. قدوم الخاطبة سلامة لبيت لالة عائشة للاعتذار وطلب المسامحة",
          frenchExcerpt: "Salama, la marieuse professionnelle à la voix d'homme, vint demander pardon à Lalla Aïcha pour avoir arrangé ce funeste mariage.",
          arabicDescription: "اعتراف سلامة بخطئها وتأكيدها أنها ندمت على تزويج مولاي العربي من ابنة الحلاق سي عبد الرحمان المتغطرسة.",
          characters: ["Salama (la marieuse)", "Lalla Aïcha", "Lalla Zoubida", "Zhor"],
          location: "Maison de Lalla Aïcha",
          pageNumber: 89,
          isKeyTurningPoint: false
        },
        {
          id: 'lbm-ch11-ev2',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 11,
          eventOrder: 2,
          title: "Le récit tragi-comique des caprices et disputes de la jeune épouse",
          titleArabic: "2. السرد الهزلي لخلافات مولاي العربي مع زوجته الصغيرة وحماته المتسلطة",
          frenchExcerpt: "Salama raconta les caprices insupportables de la jeune mariée et les scènes de ménage quotidiennes qui poussaient Moulay Larbi au divorce.",
          arabicDescription: "وصف معانات مولاي العربي مع طلبات الفتاة المبالغ فيها وتهديدات حماتها، واقتراب وقوع الطلاق الحتمي.",
          characters: ["Salama", "Moulay Larbi", "La jeune épouse", "Lalla Aïcha"],
          location: "Maison de Lalla Aïcha",
          pageNumber: 92,
          isKeyTurningPoint: false
        }
      ]
    },

    // ==========================================
    // CHAPITRE 12
    // ==========================================
    {
      chapterNumber: 12,
      chapterTitle: "Chapitre XII",
      chapterTitleArabic: "الفصل الثاني عشر: عودة الأب واكتمال الفرحة وإعادة فتح العلبة",
      startPage: 96,
      endPage: 99,
      globalSummaryArabic: "بشرى عودة المعلم عبد السلام، طلاق مولاي العربي، احتفال نساء الدار، واستئناس سيدي محمد بأصدقائه الصامتين في علبة العجائب.",
      globalSummaryFrench: "Le retour triomphal de Maâlem Abdeslem chargé de provisions, la fête à Dar Chouafa, le divorce de Moulay Larbi et la réouverture de la Boîte à Merveilles.",
      events: [
        {
          id: 'lbm-ch12-ev1',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 12,
          eventOrder: 1,
          title: "L'annonce joyeuse de Zineb et le retour triomphal de Maâlem Abdeslem",
          titleArabic: "1. زغاريد الدار وبشارة زينب بعودة المعلم عبد السلام ممتلئ الجيوب",
          frenchExcerpt: "Zineb monta quatre à quatre les marches en criant : « Maâlem Abdeslem est revenu ! »",
          arabicDescription: "صعود زينب تبشر بعودة الأب ممتلئ الجيوب ومحملاً بالدجاج والمؤونة والمال، وانطلاق الزغاريد والتهاني من كل نساء الدار.",
          characters: ["Zineb", "Lalla Zoubida", "Maâlem Abdeslem", "Driss El Aouad"],
          location: "Escalier et chambre de Dar Chouafa",
          pageNumber: 97,
          isKeyTurningPoint: true
        },
        {
          id: 'lbm-ch12-ev2',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 12,
          eventOrder: 2,
          title: "La nouvelle du divorce de Moulay Larbi d'avec la fille du coiffeur",
          titleArabic: "2. خبر طلاق مولاي العربي النهائي وعودته لزوجته الأولى لالة عائشة",
          frenchExcerpt: "Driss El Aouad nous apprit que Moulay Larbi venait de répudier définitivement la fille du coiffeur pour retrouver Lalla Aïcha.",
          arabicDescription: "استعادة لالة عائشة لزوجها واستقرار بيتها بعد طلاق الزوجة الثانية، واكتمال الفرحة في دروب الحي.",
          characters: ["Driss El Aouad", "Maâlem Abdeslem", "Moulay Larbi", "Lalla Aïcha"],
          location: "Chambre de Maâlem Abdeslem",
          pageNumber: 98,
          isKeyTurningPoint: false
        },
        {
          id: 'lbm-ch12-ev3',
          bookId: 'la_boite_a_merveilles',
          chapterNumber: 12,
          eventOrder: 3,
          title: "La réouverture finale de la Boîte à Merveilles dans la douce solitude de l'enfant",
          titleArabic: "3. خاتمة الرواية: سيدي محمد يفتح علبة عجائبه مستأنساً بأصدقائه الخالدين",
          frenchExcerpt: "Seul dans mon coin, je rouvris ma Boîte à Merveilles... Mes vieux amis m'attendaient, fidèles et silencieux.",
          arabicDescription: "عودة السكينة والأمان للأسرة، وانعزال سيدي محمد في ركنه الهادئ فاتحاً علبة عجائبه ليحلم مع أزراره وخرزه.",
          characters: ["Sidi Mohamed"],
          location: "Chambre de Dar Chouafa",
          pageNumber: 99,
          isKeyTurningPoint: true
        }
      ]
    }
  ],

  antigone: [
    {
      chapterNumber: 1,
      chapterTitle: "Scène 1 (Prologue & Aube)",
      chapterTitleArabic: "المشهد 1: البرولوغ وعودة أنتيجون عند الفجر",
      startPage: 1,
      endPage: 20,
      globalSummaryArabic: "تقديم الشخوص ومصير أنتيجون المأساوي، عودتها خلسة عند الفجر ومواجهة المربية العجوز.",
      globalSummaryFrench: "Présentation des personnages par le Prologue, retour clandestin d'Antigone à l'aube après avoir tenté d'enterrer son frère.",
      events: [
        {
          id: 'ant-sc1-ev1',
          bookId: 'antigone',
          chapterNumber: 1,
          eventOrder: 1,
          title: "Le Prologue présente les personnages et la fatalité tragique",
          titleArabic: "1. البرولوغ يستعرض الشخصيات ويعلن موت أنتيجون المحتوم",
          frenchExcerpt: "Voilà. Ces personnages vont vous jouer l'histoire d'Antigone. Elle pense qu'elle va mourir...",
          arabicDescription: "تقديم البرولوغ لأنتيجون، أختها إسمين، خطيبها هيمون، الملك كريون، وإخباره الجمهور بالمصير التراجيدي الحتمي.",
          characters: ["Le Prologue", "Antigone", "Créon", "Hémon", "Ismène"],
          location: "Palais de Thèbes",
          pageNumber: 1,
          isKeyTurningPoint: true
        },
        {
          id: 'ant-sc1-ev2',
          bookId: 'antigone',
          chapterNumber: 1,
          eventOrder: 2,
          title: "Antigone rentre à l'aube et affronte les soupçons de la Nourrice",
          titleArabic: "2. دخول أنتيجون حافية عند الفجر واستجواب المربية العجوز",
          frenchExcerpt: "La Nourrice : « D'où viens-tu, mauvaise ? » Antigone : « Du jardin, nounou. C'était beau, tout était gris. »",
          arabicDescription: "رجوع أنتيجون بعد محاولتها الأولى لدفن جثة أخيها بولينيس، وظن المربية أنها كانت تلتقي عشيقاً سراً.",
          characters: ["Antigone", "La Nourrice"],
          location: "Palais de Thèbes",
          pageNumber: 8,
          isKeyTurningPoint: false
        }
      ]
    },
    {
      chapterNumber: 2,
      chapterTitle: "Scènes 2 à 4 (Ismène & Hémon)",
      chapterTitleArabic: "المشاهد 2 إلى 4: حوار الأختين ووداع هيمون",
      startPage: 21,
      endPage: 45,
      globalSummaryArabic: "رفض إسمين لدفن الأخ بدافع الخوف، وأنتيجون تودع خطيبها هيمون دون أن تكشف له سر موتها الوشيك.",
      globalSummaryFrench: "Le dialogue tragique entre Antigone et Ismène, suivi de la scène d'adieu énigmatique avec son fiancé Hémon.",
      events: [
        {
          id: 'ant-sc2-ev1',
          bookId: 'antigone',
          chapterNumber: 2,
          eventOrder: 1,
          title: "Le désaccord tragique entre Antigone et Ismène",
          titleArabic: "1. الخلاف بين أنتيجون المتمردة وإسمين الخائفة من الموت",
          frenchExcerpt: "Ismène : « Il est plus fort que nous, Antigone ! » Antigone : « Je ne veux pas comprendre un peu ! »",
          arabicDescription: "محاولة إسمين إقناع أختها بالعدول عن دفن جثة بولينيس خوفاً من بطش كريون، وتمسك أنتيجون بالواجب المطلق.",
          characters: ["Antigone", "Ismène"],
          location: "Palais de Thèbes",
          pageNumber: 22,
          isKeyTurningPoint: true
        },
        {
          id: 'ant-sc2-ev2',
          bookId: 'antigone',
          chapterNumber: 2,
          eventOrder: 2,
          title: "L'adieu secret d'Antigone à son fiancé Hémon",
          titleArabic: "2. وداع أنتيجون لخطيبها هيمون ومطالبته بمسامحتها دون أسئلة",
          frenchExcerpt: "Antigone : « Hémon, jure-moi que tu ne me poseras pas de question... Je ne pourrai jamais t'épouser. »",
          arabicDescription: "أنتيجون تجعل هيمون يقسم بحبه لها، ثم تطلب منه المغادرة دون أسئلة معلنة أنها لن تكون زوجته أبداً.",
          characters: ["Antigone", "Hémon"],
          location: "Palais de Thèbes",
          pageNumber: 35,
          isKeyTurningPoint: false
        }
      ]
    },
    {
      chapterNumber: 3,
      chapterTitle: "Scènes 5 à 9 (L'Arrestation & Le Face-à-Face)",
      chapterTitleArabic: "المشاهد 5 إلى 9: اعتقال أنتيجون والمواجهة الكبرى مع كريون",
      startPage: 46,
      endPage: 85,
      globalSummaryArabic: "القبض على أنتيجون متلبسة بدفن الجثة بالمجرفة، والمواجهة الفلسفية والسياسية العاصفة بين أنتيجون وعمها الملك كريون.",
      globalSummaryFrench: "L'arrestation d'Antigone par les gardes et le grand face-à-face idéologique entre Créon et sa nièce révoltée.",
      events: [
        {
          id: 'ant-sc3-ev1',
          bookId: 'antigone',
          chapterNumber: 3,
          eventOrder: 1,
          title: "L'arrestation d'Antigone en flagrant délit par les gardes",
          titleArabic: "1. القبض على أنتيجون متلبسة بحفر التراب على جثة أخيها",
          frenchExcerpt: "Le garde Jonas : « On l'a surprise en train de gratter la terre avec sa petite pelle d'enfant ! »",
          arabicDescription: "اقتياد الحراس لأنتيجون مقيدة ومثولها أمام الملك كريون واعترافها الصريح الكامل دون خوف.",
          characters: ["Antigone", "Le Garde Jonas", "Créon"],
          location: "Palais de Thèbes",
          pageNumber: 50,
          isKeyTurningPoint: true
        },
        {
          id: 'ant-sc3-ev2',
          bookId: 'antigone',
          chapterNumber: 3,
          eventOrder: 2,
          title: "Le grand face-à-face tragique entre Antigone et Créon",
          titleArabic: "2. المواجهة الكبرى: صراع الواجب المثالي ضد سياسة الدولة والواقعية",
          frenchExcerpt: "Créon : « La vie est un bonheur ! » Antigone : « Quel sera-t-il, mon bonheur ? Petite ou grande, je veux tout, tout de suite ! »",
          arabicDescription: "محاولة كريون التستر عليها وإنقاذها، ورفض أنتيجون لكل مساومة واختيارها الموت بشرف وعزة.",
          characters: ["Antigone", "Créon"],
          location: "Salle du trône",
          pageNumber: 65,
          isKeyTurningPoint: true
        }
      ]
    },
    {
      chapterNumber: 4,
      chapterTitle: "Scènes 10 à 14 (Le Dénouement)",
      chapterTitleArabic: "المشاهد 10 إلى 14: رسالة الوداع، موت أنتيجون، هيمون، ويوريديس",
      startPage: 86,
      endPage: 110,
      globalSummaryArabic: "كتابة أنتيجون لرسالتها الأخيرة للحارس، موتها شنقاً في القبر، انتحار هيمون فوق جثتها، وانتحار الملكة يوريديس وبقاء كريون وحيداً.",
      globalSummaryFrench: "La dernière lettre d'Antigone dictée au garde, son supplice dans le tombeau, et les suicides en chaîne d'Hémon et d'Eurydice.",
      events: [
        {
          id: 'ant-sc4-ev1',
          bookId: 'antigone',
          chapterNumber: 4,
          eventOrder: 1,
          title: "La dernière lettre dictée au garde Jonas",
          titleArabic: "1. إملاء أنتيجون لرسالتها الوداعية الأخيرة لهيمون للحارس الفضولي",
          frenchExcerpt: "Antigone : « Écris : Mon chéri, j'ai voulu mourir et tu ne vas peut-être plus m'aimer... Je ne sais plus pourquoi je meurs. »",
          arabicDescription: "إحساس أنتيجون بالوحدة والندم في لحظاتها الأخيرة وإعطاؤها خاتمها الذهبي للحارس مقابل إيصال الرسالة.",
          characters: ["Antigone", "Le Garde Jonas"],
          location: "Cellule du Palais",
          pageNumber: 95,
          isKeyTurningPoint: false
        },
        {
          id: 'ant-sc4-ev2',
          bookId: 'antigone',
          chapterNumber: 4,
          eventOrder: 2,
          title: "Le récit du messager : suicides d'Antigone, d'Hémon et d'Eurydice",
          titleArabic: "2. خبر الكارثة: موت أنتيجون شنقاً، انتحار هيمون بالسيف، وانتحار الملكة",
          frenchExcerpt: "Le Messager : « Antigone s'est pendue aux fils de sa ceinture... Hémon s'est enfoncé son épée dans le ventre. »",
          arabicDescription: "إخبار المرسول بموت الأبطال وسقوط العائلة الملكية وبقاء كريون وحيداً يحكم المدينة في خلوة حزينة.",
          characters: ["Le Messager", "Le Chœur", "Créon", "Eurydice"],
          location: "Palais de Thèbes",
          pageNumber: 105,
          isKeyTurningPoint: true
        }
      ]
    }
  ],

  le_dernier_jour_dun_condamne: [
    {
      chapterNumber: 1,
      chapterTitle: "Chapitres 1 à 7 (Bicêtre & Le Choc)",
      chapterTitleArabic: "الفصول 1 إلى 7: هاجس فكرة الموت في بيسيتر والذكريات الجميلة",
      startPage: 1,
      endPage: 25,
      globalSummaryArabic: "هوس فكرة الإعدام التي تطارد المحكوم ليل نهار في زنزانة بيسيتر، استرجاع حريته السابقة وقصة حبه لبيبيا.",
      globalSummaryFrench: "L'obsession de la mort qui hante le condamné dans son cachot à Bicêtre, le contraste avec sa jeunesse libre et le souvenir de Pepa.",
      events: [
        {
          id: 'ldj-ch1-ev1',
          bookId: 'le_dernier_jour_dun_condamne',
          chapterNumber: 1,
          eventOrder: 1,
          title: "L'obsession fatale : Condamné à mort !",
          titleArabic: "1. هاجس فكرة الموت المفزعة: محكوم بالإعدام!",
          frenchExcerpt: "Condamné à mort ! Voilà cinq semaines que j'habite avec cette pensée, toujours seul avec elle, toujours glacé de sa présence...",
          arabicDescription: "افتتاح الرواية بالصرخة المدوية والهاجس النفسي العنيف الذي يطارد السجين في زنزانته الضيقة.",
          characters: ["Le Condamné"],
          location: "Prison de Bicêtre",
          pageNumber: 1,
          isKeyTurningPoint: true
        },
        {
          id: 'ldj-ch1-ev2',
          bookId: 'le_dernier_jour_dun_condamne',
          chapterNumber: 1,
          eventOrder: 2,
          title: "Le souvenir de Pepa et de la jeunesse libre et ensoleillée",
          titleArabic: "2. استرجاع ذكريات الحرية وقصة الحب الجميلة مع بيبيا في الصيف",
          frenchExcerpt: "Autrefois, j'étais un homme comme un autre. Je songeais à Pepa, à mes belles après-midi d'été sous les grands arbres...",
          arabicDescription: "استحضار المحكوم لماضيه السعيد حين كان شاباً حراً مثقفاً يعيش قصة حب دافئة قبل ارتكاب جريمته.",
          characters: ["Le Condamné", "Pepa"],
          location: "Bicêtre / Souvenirs d'Andalousie",
          pageNumber: 14,
          isKeyTurningPoint: false
        }
      ]
    },
    {
      chapterNumber: 2,
      chapterTitle: "Chapitres 8 à 22 (Le Ferrage des Forçats & Le Friauche)",
      chapterTitleArabic: "الفصول 8 إلى 22: تصفيد المحكومين بالأشغال الشاقة وزنزانة الموت",
      startPage: 26,
      endPage: 60,
      globalSummaryArabic: "مشهد تصفيد المحكومين بالأشغال الشاقة في ساحة بيسيتر، نقل المحكوم لزنزانة جديدة ولقاؤه بالمحكوم السابق (الفريوش).",
      globalSummaryFrench: "Le spectacle hideux du ferrage des forçats partant pour Toulon et la rencontre brutale avec le vieux forçat d'argot (le Friauche).",
      events: [
        {
          id: 'ldj-ch2-ev1',
          bookId: 'le_dernier_jour_dun_condamne',
          chapterNumber: 2,
          eventOrder: 1,
          title: "Le spectacle hideux du ferrage des forçats sous la pluie",
          titleArabic: "1. المشهد المرعب لتصفيد المحكومين بالأشغال الشاقة بالمطارق والأغلال",
          frenchExcerpt: "On fit asseoir les condamnés dans la boue. Les forgerons riverent à coups de massue les colliers de fer autour de leurs cous.",
          arabicDescription: "وصف قسوة تصفيد السجناء المرحلين لطولون وسط هتاف الجماهير القاسية وإغماء السجين رعباً.",
          characters: ["Le Condamné", "Les Forçats", "Les Gardiens", "Les Forgerons"],
          location: "Cour de Bicêtre",
          pageNumber: 30,
          isKeyTurningPoint: true
        },
        {
          id: 'ldj-ch2-ev2',
          bookId: 'le_dernier_jour_dun_condamne',
          chapterNumber: 2,
          eventOrder: 2,
          title: "La rencontre avec le vieux forçat (Le Friauche) et sa redingote",
          titleArabic: "2. لقاء السجين العجوز وتنازل المحكوم عن معطفه له",
          frenchExcerpt: "Un vieux forçat entra dans mon cachot. Il parlait l'argot des voleurs et me prit ma redingote en échange de son vieux haillon.",
          arabicDescription: "حوار السجين مع محكوم قديم سرد له قصة حياته الإجرامية بلغة الأرغو وكيف ورطه الفقر في الإجرام.",
          characters: ["Le Condamné", "Le Friauche"],
          location: "Cachot de Bicêtre",
          pageNumber: 48,
          isKeyTurningPoint: false
        }
      ]
    },
    {
      chapterNumber: 3,
      chapterTitle: "Chapitres 23 à 49 (La Conciergerie, Marie & L'Échafaud)",
      chapterTitleArabic: "الفصول 23 إلى 49: الرحلة للكونسيرجيري، زيارة ابنته ماري، ولحظة المقصلة",
      startPage: 61,
      endPage: 95,
      globalSummaryArabic: "نقل السجين للكونسيرجيري، زيارة ابنته الصغيرة ماري التي لم تتعرف عليه، قص شعره وثيابه في التواليت، واقتياده للمقصلة في ساحة الإضراب.",
      globalSummaryFrench: "Le transfert à la Conciergerie, la visite déchirante de sa fille Marie qui ne le reconnaît pas, la toilette du condamné et la marche vers l'échafaud.",
      events: [
        {
          id: 'ldj-ch3-ev1',
          bookId: 'le_dernier_jour_dun_condamne',
          chapterNumber: 3,
          eventOrder: 1,
          title: "La visite déchirante de sa petite fille Marie qui ne le reconnaît pas",
          titleArabic: "1. الزيارة المؤلمة لابنته الصغيرة ماري وعدم تعرفها على أبيها",
          frenchExcerpt: "Elle me regarda avec de grands yeux innocents : « Ah non ! Monsieur, mon père est mort, il est en prison ! »",
          arabicDescription: "لحظة قاسية جداً حين تخبره طفلته البالغة ثلاث سنوات أن والدها مات، فيتحطم قلبه ويطلب التعجيل بإعدامه.",
          characters: ["Le Condamné", "Marie (sa fille de 3 ans)"],
          location: "Parloir de la Conciergerie",
          pageNumber: 75,
          isKeyTurningPoint: true
        },
        {
          id: 'ldj-ch3-ev2',
          bookId: 'le_dernier_jour_dun_condamne',
          chapterNumber: 3,
          eventOrder: 2,
          title: "La sinistre toilette du condamné et la marche vers l'échafaud",
          titleArabic: "2. طقوس التواليت المشؤومة: قص الشعر والقميص والتوجه نحو المقصلة",
          frenchExcerpt: "Le bourreau me coupa les cheveux sur la nuque et fendit le col de ma chemise... On m'attacha les mains derrière le dos.",
          arabicDescription: "تجهيز السجين للمقصلة بحلق عنقه وتقييده ووضعه في العربة المكشوفة وسط حشود المتفرجين في باريس.",
          characters: ["Le Condamné", "Le Bourreau", "Le Prêtre", "La Foule"],
          location: "La Conciergerie / Place de Grève",
          pageNumber: 88,
          isKeyTurningPoint: true
        },
        {
          id: 'ldj-ch3-ev3',
          bookId: 'le_dernier_jour_dun_condamne',
          chapterNumber: 3,
          eventOrder: 3,
          title: "Les quatre heures fatidiques : l'ultime supplication pour la grâce",
          titleArabic: "3. دقات الساعة الرابعة: آخر رجاء في العفو الملكي وسقوط المقصلة",
          frenchExcerpt: "QUATRE HEURES ! Une grâce ! Pour pitié, une grâce ! On monte l'escalier...",
          arabicDescription: "السطور الأخيرة من الرواية: حلول الساعة الرابعة بعد الزوال، توسل السجين للحصول على عفو، ودخول الحراس لتنفيذ الحكم.",
          characters: ["Le Condamné", "Les Gardes"],
          location: "Hôtel de Ville (Place de Grève)",
          pageNumber: 95,
          isKeyTurningPoint: true
        }
      ]
    }
  ]
};

export function getChapterEvents(bookId: BookId, chapterNumber: number): ChapterEventItem[] {
  const chapters = CHAPTER_EVENTS_DATA[bookId] || [];
  const found = chapters.find((c) => c.chapterNumber === chapterNumber);
  return found ? found.events : [];
}

export function getChapterSummary(bookId: BookId, chapterNumber: number): ChapterFullSummary | undefined {
  const chapters = CHAPTER_EVENTS_DATA[bookId] || [];
  return chapters.find((c) => c.chapterNumber === chapterNumber);
}

export function getAllEventsForBook(bookId: BookId): ChapterEventItem[] {
  const chapters = CHAPTER_EVENTS_DATA[bookId] || [];
  return chapters.flatMap((c) => c.events);
}
