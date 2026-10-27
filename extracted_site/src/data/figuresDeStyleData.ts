export interface FigureDeStyleItem {
  name: string;
  nameAr: string;
  category: 'Images & Analogies' | 'Opposition' | 'Amplification & Insistance' | 'Atténuation & Substitution';
  categoryAr: string;
  definition: string;
  definitionAr: string;
  examTip: string;
  examTipAr: string;
  examples: {
    work: 'La Boîte à Merveilles' | 'Antigone' | 'Le Dernier Jour d’un Condamné';
    quote: string;
    explanation: string;
    explanationAr: string;
  }[];
}

export const FIGURES_DE_STYLE: FigureDeStyleItem[] = [
  {
    name: 'La Comparaison',
    nameAr: 'التشبيه (Comparaison)',
    category: 'Images & Analogies',
    categoryAr: 'الصور والتشبيهات',
    definition: "Mise en relation de deux éléments (le comparé et le comparant) à l'aide d'un outil de comparaison explicite (comme, tel que, pareil à, semblable à, ainsi que, ressemble à).",
    definitionAr: "الربط بين طرفين (المشبه والمشبه به) بوجود أداة تشبيه واضحة وصريحة (comme, tel, semblable à, pareil à...).",
    examTip: "Cherchez impérativement l'outil de comparaison : 'comme', 'pareil à', 'semblable à', 'ressembler à'. S'il n'y a pas d'outil, c'est une métaphore !",
    examTipAr: "ابحث أولاً عن أداة التشبيه في الجملة (comme, tel, semblable à). إذا غابت الأداة فالأمر يتعلق باستعارة (Métaphore) وليس تشبيهاً!",
    examples: [
      {
        work: 'La Boîte à Merveilles',
        quote: "Mon père était calme comme la nuit.",
        explanation: "Comparé : le père / Outil : comme / Comparant : la nuit.",
        explanationAr: "شبه وقار وهدوء الأب بهدوء الليل مستعملاً أداة التشبيه comme."
      },
      {
        work: 'Antigone',
        quote: "Elle te regarde avec ses yeux noirs comme deux trous.",
        explanation: "Outil 'comme' reliant les yeux d'Antigone à deux trous profonds.",
        explanationAr: "تشبيه عيني أنتيجون الداكنتين بفجوتين غائرتين بواسطة comme."
      },
      {
        work: 'Le Dernier Jour d’un Condamné',
        quote: "Ces cris m'arrivaient comme des coups de poignard.",
        explanation: "Outil 'comme' assimilant la violence des cris à des coups de couteau.",
        explanationAr: "تشبيه وقع صرخات الجماهير بطعنات الخنجر في القلب مستعملاً comme."
      }
    ]
  },
  {
    name: 'La Métaphore',
    nameAr: 'الاستعارة (Métaphore)',
    category: 'Images & Analogies',
    categoryAr: 'الصور والتشبيهات',
    definition: "Comparaison sans outil de comparaison. Elle assimile directement le comparé au comparant en créant une identité poétique totale.",
    definitionAr: "تشبيه بليغ حُذفت منه أداة التشبيه تماماً، حيث يندمج المشبه بالمشبه به مباشرة لخلق صورة شعرية أو دلالية مكثفة.",
    examTip: "Posez-vous la question : Est-ce que cette affirmation est littéralement vraie ? Si non, et s'il n'y a pas d'outil de comparaison, c'est une métaphore.",
    examTipAr: "إذا وجدت تعبيراً مجازياً لا يمكن تصديقه حرفياً في الواقع، ولا يحتوي على أداة تشبيه، فهو استعارة!",
    examples: [
      {
        work: 'La Boîte à Merveilles',
        quote: "Ma Boîte à Merveilles était un palais d'émeraude.",
        explanation: "La boîte est directement assimilée à un palais sans mot de liaison.",
        explanationAr: "تشبيه مباشر للعلبة الخشبية البسيطة بقصر من الزمرد الأخضر بدون أداة."
      },
      {
        work: 'Antigone',
        quote: "La vie est une eau qui coule entre les doigts.",
        explanation: "Créon définit la vie comme une eau fluide et évanescente sans outil.",
        explanationAr: "تصوير الحياة بالماء الجاري بين الأصابع دون استخدام أداة تشبيه."
      },
      {
        work: 'Le Dernier Jour d’un Condamné',
        quote: "Mon esprit est en prison dans une idée.",
        explanation: "Assimile l'obsession de la mort à un cachot mental impénétrable.",
        explanationAr: "تصوير الفكرة القاتلة بالزنزانة التي تعتقل عقل السجين."
      }
    ]
  },
  {
    name: 'La Personnification',
    nameAr: 'التشخيص / الاستعارة المكنية (Personnification)',
    category: 'Images & Analogies',
    categoryAr: 'الصور والتشبيهات',
    definition: "Attribution de traits, de sentiments, de comportements ou d'actions humains à un objet inanimé, un concept abstrait ou un animal.",
    definitionAr: "إعطاء صفات أو مشاعر أو أفعال بشرية لجماد أو حيوان أو معنى مجرد (مثل: بكت السماء، ضحكت الحديقة، رقصت الشموع).",
    examTip: "Regardez le verbe d'action : est-il normalement réservé à un être humain (respirer, pleurer, sourire, murmurer) alors que le sujet est un objet ?",
    examTipAr: "انظر إلى الفعل: هل هو فعل خاص بالبشر (يبتسم، يهمس، يغضب) أسنده الكاتب لشيء ميت أو فكرة مجردة؟ إذاً هو Personnification.",
    examples: [
      {
        work: 'La Boîte à Merveilles',
        quote: "Les flammes des bougies dansaient sur les murs blancs.",
        explanation: "Le verbe 'danser' (action humaine) est attribué aux flammes des bougies.",
        explanationAr: "إسناد فعل الرقص البشري إلى لهب الشموع المضاءة."
      },
      {
        work: 'Antigone',
        quote: "Un jardin qui ne pense pas encore aux hommes.",
        explanation: "Attribution de la faculté de 'penser' au jardin de l'aube.",
        explanationAr: "إعطاء صفة التفكير والتأمل البشري لحديقة القصر وقت السحر."
      },
      {
        work: 'Le Dernier Jour d’un Condamné',
        quote: "La mort rodait autour de mon grabat.",
        explanation: "La mort est représentée comme un être vivant qui rode et guette.",
        explanationAr: "تشخيص الموت ككائن يتربص ويحوم حول فراش المحكوم البالي."
      }
    ]
  },
  {
    name: 'L’Hyperbole',
    nameAr: 'المبالغة والتضخيم (Hyperbole)',
    category: 'Amplification & Insistance',
    categoryAr: 'التضخيم والتوكيد',
    definition: "Figure qui consiste à exagérer très fortement une idée, un sentiment ou une situation pour produire une forte impression sur le lecteur.",
    definitionAr: "أسلوب يقوم على المبالغة الشديدة وتضخيم الأوصاف أو المشاعر لشد انتباه القارئ والتأثير في وجدانه.",
    examTip: "Mots clés révélateurs : 'mille', 'mourir de...', 'océan de...', 'jamais', 'éternellement', 'terrible', 'déchirant'.",
    examTipAr: "ابحث عن صيغ المبالغة والأرقام الضخمة التعبيرية مثل: أمتار من الدموع، ألف سنة، مت من الضحك، بكاء يمزق السماء.",
    examples: [
      {
        work: 'La Boîte à Merveilles',
        quote: "Mon cœur battait à se rompre.",
        explanation: "Exagération évidente de la vitesse des battements du cœur sous la peur.",
        explanationAr: "مبالغة في وصف دقات القلب من شدة الخوف حتى كأنه سينفجر ويتمزق."
      },
      {
        work: 'Antigone',
        quote: "Toute la ville hurle contre moi.",
        explanation: "Exagération collective : la ville entière ne hurle pas physiquement.",
        explanationAr: "المبالغة في تصوير غضب أهل طيبة بجعل المدينة برمتها تصرخ."
      },
      {
        work: 'Le Dernier Jour d’un Condamné',
        quote: "Chaque seconde m'arrache un siècle de vie.",
        explanation: "Hyperbole temporelle opposant la seconde à un siècle de tourment.",
        explanationAr: "مبالغة تقارن مرور ثانية واحدة بقرن كامل من العذاب والانتظار."
      }
    ]
  },
  {
    name: 'L’Antithèse',
    nameAr: 'الطباق والمقابلة (Antithèse)',
    category: 'Opposition',
    categoryAr: 'التضاد والمفارقة',
    definition: "Rapprochement dans une même phrase ou un même paragraphe de deux mots ou idées contraires pour souligner un contraste frappant.",
    definitionAr: "الجمع بين كلمتين أو فكرتين متضادتين داخل نفس السياق أو الجملة لإبراز التباين والتعارض.",
    examTip: "Identifiez les deux antonymes qui se font face dans la phrase (riche/pauvre, jour/nuit, vivre/mourir, noir/blanc).",
    examTipAr: "ابحث عن كلمتين متضادتين في المعنى تفصل بينهما كلمات في الجملة (مثل: الأغنياء والفقراء، الحياة والموت).",
    examples: [
      {
        work: 'La Boîte à Merveilles',
        quote: "Les riches dans leurs chauds burnous et les pauvres sur les nattes râpées.",
        explanation: "Opposition nette entre 'riches / pauvres' et 'chauds / râpées'.",
        explanationAr: "مقابلة صريحة بين الأغنياء بلباسهم الدافئ والفقراء على الحصائر البالية."
      },
      {
        work: 'Antigone',
        quote: "Ismène est faite pour vivre, moi je suis faite pour mourir.",
        explanation: "Opposition directe des verbes 'vivre' et 'mourir' pour opposer les destins.",
        explanationAr: "طباق ومقابلة واضحة بين فعل العيش (vivre) وفعل الموت (mourir)."
      },
      {
        work: 'Le Dernier Jour d’un Condamné',
        quote: "Autrefois j’étais libre, aujourd'hui je suis captif.",
        explanation: "Contraste temporel et existentiel : autrefois/aujourd'hui, libre/captif.",
        explanationAr: "مقابلة بين حرية الماضي في الأمس وأسر الحاضر في السجن."
      }
    ]
  },
  {
    name: 'L’Oxymore',
    nameAr: 'التناقض الظاهري / الجمع بين الضدين (Oxymore)',
    category: 'Opposition',
    categoryAr: 'التضاد والمفارقة',
    definition: "Rapprochement côte à côte de deux mots de sens contraires (souvent nom + adjectif) qui créent une image surprenante et poétique.",
    definitionAr: "جمع كلمتين متضادتين متجاورتين مباشرة وبشكل متلاصق (غالباً اسم + صفة مناقضة له) مثل: نور مظلم، صمت صاخب.",
    examTip: "Différence clé avec l'Antithèse : dans l'Oxymore, les deux mots contraires sont directement collés ensemble !",
    examTipAr: "الفرق الجوهري بين الطباق العادي و Oxymore أن الكلمتين المتضادتين في Oxymore تكونان ملتصقتين جنباً إلى جنب ككتلة واحدة (مثل: Obscure clarté)!",
    examples: [
      {
        work: 'La Boîte à Merveilles',
        quote: "Cette obscure clarté qui tombait des étoiles.",
        explanation: "Accolement direct de 'obscure' et 'clarté'.",
        explanationAr: "التجاور المباشر بين صفة الظلام (obscure) واسم النور (clarté)."
      },
      {
        work: 'Antigone',
        quote: "Un affreux silence.",
        explanation: "Le silence est qualifié d'affreux, suggérant un vide bruyant d'angoisse.",
        explanationAr: "وصف الصمت والسكون بصفة البشاعة والعنف المزعج."
      },
      {
        work: 'Le Dernier Jour d’un Condamné',
        quote: "Un rire sinistre et glacial.",
        explanation: "Le rire, normalement joyeux et chaud, est qualifié de sinistre et glacial.",
        explanationAr: "الجمع بين الضحك الذي يدل على السرور مع برودة الموت والوحشة."
      }
    ]
  },
  {
    name: 'L’Antiphrase (Ironie)',
    nameAr: 'التهكم / الكناية العكسية (Antiphrase)',
    category: 'Atténuation & Substitution',
    categoryAr: 'التلطيف والبدائل',
    definition: "Figure qui consiste à exprimer le contraire de ce que l'on pense réellement, tout en faisant comprendre qu'on pense l'opposé (le fondement de l'ironie).",
    definitionAr: "قول عكس ما يقصده المتكلم تماماً بغرض السخرية والتهكم (مثل قولك لمن رسب: 'أحسنت صنعاً! يا لك من عبقري!').",
    examTip: "Posez-vous la question : Le locuteur admire-t-il vraiment la situation ou s'en moque-t-il amèrement ?",
    examTipAr: "هل يمدح المتكلم الموقف بحق أم أنه يتهكم عليه بحرقة وسخرية لاذعة؟ إذا كان العكس فهو Antiphrase.",
    examples: [
      {
        work: 'Le Dernier Jour d’un Condamné',
        quote: "C'est cela qu'ils appellent faire justice !",
        explanation: "Le narrateur dit 'faire justice' mais dénonce en vérité un assassinat d'État.",
        explanationAr: "يقول 'إقامة العدل' وهو يقصد في الحقيقة ارتكاب جريمة قتل همجية باسم القانون."
      },
      {
        work: 'Antigone',
        quote: "Tu as de la chance, toi, tu vas mourir pour une si belle cause !",
        explanation: "Ismène souligne avec amertume l'absurdité du sacrifice.",
        explanationAr: "التهكم على حظ أنتيجون في الموت من أجل أسطورة وبطولة وهمية."
      },
      {
        work: 'La Boîte à Merveilles',
        quote: "Quel beau spectacle que cette dispute de femmes !",
        explanation: "Désigne ironiquement le pugilat honteux entre les deux voisines.",
        explanationAr: "وصف شجار النساء البشع والصاخب بأنه 'عرض جميل ورائع' على سبيل السخرية."
      }
    ]
  },
  {
    name: 'L’Euphémisme',
    nameAr: 'التلطيف والتخفيف (Euphémisme)',
    category: 'Atténuation & Substitution',
    categoryAr: 'التلطيف والبدائل',
    definition: "Atténuation de l'expression d'une idée déplaisante, choquante, cruelle ou douloureuse (comme la mort, la maladie, la misère).",
    definitionAr: "تلطيف عبارة قاسية أو مؤلمة أو صادمة (كالموت أو المرض) بعبارة مهذبة وهادئة (مثل: 'انتقل إلى جوار ربه' بدلاً من 'مات').",
    examTip: "Très fréquent quand on parle de la mort : 'il nous a quittés', 'il s'est endormi', 'il n'est plus'.",
    examTipAr: "ابحث عن العبارات التي تخفف هول الموت أو المصيبة لتفادي الصدمة المباشرة.",
    examples: [
      {
        work: 'Antigone',
        quote: "Tous ceux qui avaient à mourir sont morts. Ils sont tous calmes maintenant.",
        explanation: "'Sont calmes' atténue la violence des trois suicides sanglants.",
        explanationAr: "تلطيف واقعة انتحار ثلاثة أشخاص بالقول إنهم 'أصبحوا هادئين الآن'."
      },
      {
        work: 'La Boîte à Merveilles',
        quote: "Si Tahar s'est endormi dans la paix du Seigneur.",
        explanation: "Pour dire qu'il est décédé sans brutalité.",
        explanationAr: "استعمال تعبير 'نام في سلام ربه' للتعبير عن وفاة الحلاق بن طاهر."
      },
      {
        work: 'Le Dernier Jour d’un Condamné',
        quote: "Mon père est allé au ciel.",
        explanation: "Formulation innocente de la petite Marie pour désigner la mort de son père.",
        explanationAr: "عبارة الطفلة البريئة ماري: 'أبي ذهب إلى السماء' بدلاً من القول إنه مات."
      }
    ]
  },
  {
    name: 'La Litote',
    nameAr: 'نفي الضد / التعبير بالقليل لإرادة الكثير (Litote)',
    category: 'Atténuation & Substitution',
    categoryAr: 'التلطيف والبدائل',
    definition: "Dire le moins pour suggérer le plus. Souvent formulée par une négation du contraire ('Ce n'est pas mauvais' = C'est excellent).",
    definitionAr: "قول القليل للإيحاء بالكثير وغالباً ما تصاغ بنفي الضد (مثل: 'لست غبياً' تعني 'أنت ذكي جداً'، 'ليس بعيداً' تعني 'قريب جداً').",
    examTip: "Repérez la négation : 'ne pas...', 'ce n'est pas...', qui sert en réalité à affirmer une vérité avec force.",
    examTipAr: "ابحث عن جملة منفية (ne... pas) يقصد صاحبها تأكيد المعنى المعاكس بقوة وحياء.",
    examples: [
      {
        work: 'La Boîte à Merveilles',
        quote: "Ma solitude ne date pas d'hier.",
        explanation: "Signifie qu'elle dure depuis une éternité (depuis toujours).",
        explanationAr: "نفي أن وحدته بدأت بالأمس، ليعني أنه يعاني منها منذ أمد بعيد جداً."
      },
      {
        work: 'Antigone',
        quote: "Je ne suis pas fière de ce que j'ai fait.",
        explanation: "Créon sous-entend qu'il éprouve une honte et un remords profonds.",
        explanationAr: "قول كريون إنه ليس فخوراً بما صنع، ليعبر عن ندم وخزي عميق."
      },
      {
        work: 'Le Dernier Jour d’un Condamné',
        quote: "Ce spectacle n'était pas réjouissant.",
        explanation: "Pour dire que c'était une scène monstrueuse et horrifiante.",
        explanationAr: "نفي أن المشهد كان مفرحاً للتعبير عن كونه كان بشعاً ومرعباً للغاية."
      }
    ]
  },
  {
    name: 'La Métonymie',
    nameAr: 'المجاز المرسل / الكناية بالسبب أو الجزء (Métonymie)',
    category: 'Atténuation & Substitution',
    categoryAr: 'التلطيف والبدائل',
    definition: "Remplacement d'un mot par un autre mot lié par un rapport logique (le contenant pour le contenu, l'instrument pour l'agent, le lieu pour l'institution).",
    definitionAr: "استبدال كلمة بأخرى ترتبط بها بعلاقة منطقية واقعية، مثل إطلاق المحل وإرادة الحال (شربت كأساً = شربت ماءً)، أو الأداة وإرادة صاحبها.",
    examTip: "Exemples types : 'boire un verre', 'écouter Mozart', 'le premier étage pleurait' (les habitants du premier étage).",
    examTipAr: "إذا وجدت تعبيراً مثل: 'ارتجفت الدار' (يقصد أهل الدار)، أو 'سقطت الرقاب تحت المقصلة'، فالأمر يتعلق بـ Métonymie.",
    examples: [
      {
        work: 'La Boîte à Merveilles',
        quote: "Une clameur monta du premier étage.",
        explanation: "Le premier étage (le lieu) désigne en réalité Rahma qui hurle de douleur.",
        explanationAr: "إطلاق الطابق الأول (المكان) للدلالة على الجارة رحمة التي تصرخ لضياع ابنتها."
      },
      {
        work: 'Antigone',
        quote: "Thèbes a besoin d'un chef.",
        explanation: "Thèbes (la ville) est employée pour désigner le peuple thébain.",
        explanationAr: "استعمال اسم مدينة طيبة للإشارة إلى شعبها وسكانها."
      },
      {
        work: 'Le Dernier Jour d’un Condamné',
        quote: "Le fer va trancher sa tête.",
        explanation: "Le fer (la matière) désigne la lame de la guillotine.",
        explanationAr: "استعمال الحديد (المادة) للإشارة إلى شفرة المقصلة الحادة."
      }
    ]
  },
  {
    name: 'L’Énumération & L’Accumulation',
    nameAr: 'التعداد والحشد (Énumération)',
    category: 'Amplification & Insistance',
    categoryAr: 'التضخيم والتوكيد',
    definition: "Succession de mots de même catégorie grammaticale (noms, adjectifs, verbes) pour créer une impression d'abondance, de variété ou de chaos.",
    definitionAr: "سرد متتالٍ لكلمات من نفس الصنف النحوي (أسماء، نعوت، أفعال) مفصولة بفواصل لإعطاء إحساس بالوفرة أو الفوضى أو التراكم.",
    examTip: "Facile à repérer : une suite d'éléments séparés par des virgules !",
    examTipAr: "تتعرف عليها بسهولة: سلسلة طويلة من الكلمات المتتابعة المفصولة بفواصل.",
    examples: [
      {
        work: 'La Boîte à Merveilles',
        quote: "Dans ma boîte il y avait des clous, des boutons de porcelaine, des perles fausses, des coquillages et des bouts de ficelle.",
        explanation: "Énumération des objets hétéroclites qui composent les trésors de l'enfant.",
        explanationAr: "تعداد الخردوات والأشياء البسيطة التي يجمعها الطفل في علبته السحرية."
      },
      {
        work: 'Antigone',
        quote: "Elle aime les fleurs, la musique, les belles robes et les baisers.",
        explanation: "Accumulation des plaisirs simples de la vie désirés par Ismène.",
        explanationAr: "تعداد مباهج الحياة ومسرات الشباب التي تعشقها إسمين."
      }
    ]
  },
  {
    name: 'La Gradation',
    nameAr: 'التدرج التصاعدي أو التنازلي (Gradation)',
    category: 'Amplification & Insistance',
    categoryAr: 'التضخيم والتوكيد',
    definition: "Succession ordonnée de termes de force croissante (gradation ascendante) ou décroissante (gradation descendante).",
    definitionAr: "ترتيب متدرج للكلمات أو الأفعال تصاعدياً نحو الأقوى (Gradation ascendante) أو تنازلياً نحو الأضعف (Gradation descendante).",
    examTip: "Regardez si les termes montent en intensité émotionnelle ou dramatique !",
    examTipAr: "انظر إلى وقع الكلمات المتتالية: هل تتصاعد في القوة والخطورة أم تهبط؟",
    examples: [
      {
        work: 'Le Dernier Jour d’un Condamné',
        quote: "Une pensée horrible, sanglante, implacable !",
        explanation: "Gradation ascendante vers l'horreur absolue.",
        explanationAr: "تدرج تصاعدي في وصف الفكرة القاتلة: مروعة، ثم دامية، ثم لا ترحم!"
      },
      {
        work: 'Antigone',
        quote: "À qui devra-t-elle mentir, à qui sourire, à qui se vendre ?",
        explanation: "Gradation descendante dans l'avilissement moral (mensonge -> faux sourire -> prostitution morale).",
        explanationAr: "تدرج درامي يفضح التنازلات: الكذب، ثم النفاق بالابتسام، ثم بيع الكرامة."
      }
    ]
  },
  {
    name: 'L’Anaphore',
    nameAr: 'التكرار الصدري (Anaphore)',
    category: 'Amplification & Insistance',
    categoryAr: 'التضخيم والتوكيد',
    definition: "Répétition d'un même mot ou d'une même formule au début de phrases ou de propositions consécutives.",
    definitionAr: "تكرار نفس الكلمة أو العبارة في مستهل الجمل أو المقاطع المتتالية لتثبيت الفكرة وإيقاعها في الأذن.",
    examTip: "Vérifiez le premier mot de chaque membre de phrase : est-il identique ?",
    examTipAr: "تأكد من بداية كل جملة: هل تبدأ بنفس الكلمة بالضبط كدقات الطبول؟",
    examples: [
      {
        work: 'Le Dernier Jour d’un Condamné',
        quote: "Toujours seul avec elle, toujours glacé de sa présence, toujours courbé sous son poids !",
        explanation: "Répétition obsédante du mot 'toujours' au début de chaque membre de phrase.",
        explanationAr: "تكرار كلمة 'Toujours' في صدارة العبارات للتأكيد على استبداد الفكرة القاتلة."
      },
      {
        work: 'Antigone',
        quote: "Moi, je veux tout, tout de suite, et que ce soit entier !",
        explanation: "Répétition de 'tout' pour marquer l'intransigeance de l'héroïne.",
        explanationAr: "تكرار كلمة 'Tout' للإشارة إلى مثالية أنتيجون المطلقة ورفضها للتنازل."
      }
    ]
  }
];
