export interface ConnecteurGroup {
  purpose: string;
  purposeAr: string;
  items: { word: string; translationAr: string; usageNote: string }[];
}

export interface ProductionTopic {
  id: string;
  relatedNovel: string;
  relatedNovelAr: string;
  title: string;
  titleAr: string;
  promptFr: string;
  promptAr: string;
  recommendedPlan: 'Plan Dialectique' | 'Plan Thématique (Simple)';
  recommendedPlanAr: string;
  introOutline: {
    accroche: string;
    definitionOuContexte: string;
    problematique: string;
    annonceDuPlan: string;
  };
  argumentsPour: string[];
  argumentsPourAr: string[];
  argumentsContre: string[];
  argumentsContreAr: string[];
  modelEssay: string;
  modelEssayAr: string;
}

export const CONNECTEURS_LOGIQUES: ConnecteurGroup[] = [
  {
    purpose: "Pour introduire & amorcer",
    purposeAr: "للاستهلال وبداية الفكرة",
    items: [
      { word: "En premier lieu / Tout d'abord", translationAr: "بادئ ذي بدء / في المقام الأول", usageNote: "Idéal pour ouvrir le premier paragraphe de développement." },
      { word: "Il est indéniable que...", translationAr: "مما لا شك فيه أن...", usageNote: "Permet de poser un constat partagé avec assurance." },
      { word: "De prime abord", translationAr: "للوهلة الأولى", usageNote: "Utile pour nuancer une première impression." }
    ]
  },
  {
    purpose: "Pour ajouter & enrichir (Addition)",
    purposeAr: "للإضافة وتدعيم الحجج",
    items: [
      { word: "En outre / De surcroît", translationAr: "علاوة على ذلك / فضلاً عن ذلك", usageNote: "Élève le niveau de langue pour ajouter un second argument fort." },
      { word: "Par ailleurs", translationAr: "من جهة أخرى", usageNote: "Permet d'aborder un aspect complémentaire du sujet." },
      { word: "Non seulement... mais aussi...", translationAr: "ليس فقط... بل أيضاً...", usageNote: "Structure élégante pour combiner deux arguments percutants." }
    ]
  },
  {
    purpose: "Pour opposer & nuancer (Opposition / Concession)",
    purposeAr: "للتعارض والمقابلة والاستدراك",
    items: [
      { word: "Cependant / Néanmoins", translationAr: "غير أن / مع ذلك", usageNote: "Parfait pour la transition entre la thèse et l'antithèse." },
      { word: "En revanche / Par contre", translationAr: "في المقابل", usageNote: "Souligne une différence d'approche ou de conséquence." },
      { word: "Certes... mais...", translationAr: "صحيح أن... غير أن...", usageNote: "La concession classique : reconnaître une part de vérité avant d'opposer." }
    ]
  },
  {
    purpose: "Pour illustrer par un exemple",
    purposeAr: "لإعطاء أمثلة وشواهد من الواقع أو المؤلفات",
    items: [
      { word: "À titre d'exemple / Ainsi", translationAr: "على سبيل المثال / هكذا", usageNote: "À placer impérativement après l'énoncé de l'argument." },
      { word: "C'est notamment le cas de...", translationAr: "ويتجلى ذلك بالخصوص في حالة...", usageNote: "Très efficace pour citer une œuvre du programme (ex: Sidi Mohammed, Antigone)." },
      { word: "L'histoire littéraire nous offre l'exemple de...", translationAr: "ويزخر التاريخ الأدبي بمثال...", usageNote: "Valorise la culture générale de l'élève." }
    ]
  },
  {
    purpose: "Pour conclure & clore (Conclusion)",
    purposeAr: "للخاتمة وإبداء الرأي الشخصي",
    items: [
      { word: "En définitive / En guise de conclusion", translationAr: "صفوة القول / في الختام", usageNote: "Marque clairement le début du paragraphe final." },
      { word: "À mon humble avis / En ce qui me concerne", translationAr: "في رأيي المتواضع / فيما يخصني", usageNote: "Pour exprimer sa prise de position personnelle équilibrée." },
      { word: "Il convient donc d'affirmer que...", translationAr: "يتعين إذن التأكيد على أن...", usageNote: "Pour formuler une synthèse mature et ouverte." }
    ]
  }
];

export const PRODUCTION_TOPICS: ProductionTopic[] = [
  {
    id: 'superstition',
    relatedNovel: 'La Boîte à Merveilles',
    relatedNovelAr: 'علبة العجائب',
    title: 'La superstition et la visite des marabouts',
    titleAr: 'الشعوذة وزيارة الأضرحة والمشعوذين',
    promptFr: "De nos jours, certaines personnes continuent de croire aux voyants, aux marabouts et aux amulettes pour résoudre leurs difficultés, tandis que d'autres estiment que cette pratique est un signe d'ignorance et de recul. Partagez-vous ce constat ? Rédigez un texte argumentatif structuré.",
    promptAr: "في عصرنا الحالي، لا يزال البعض يلجأ إلى العرافين وزيارة الأضرحة والتمائم لحل أزماتهم، بينما يرى آخرون أن ذلك مظهر من مظاهر الجهل والتخلف. ما هو رأيك في الموضوع؟ حرر نصاً حجاجياً متناسقاً.",
    recommendedPlan: 'Plan Dialectique',
    recommendedPlanAr: 'التصميم الجدلي (الأطروحة / نقيض الأطروحة / التركيب والرأي الشخصي)',
    introOutline: {
      accroche: "Depuis la nuit des temps, l'être humain cherche à percer le mystère de son destin et à surmonter les aléas de l'existence.",
      definitionOuContexte: "C'est ainsi que dans les sociétés traditionnelles, à l'instar du Maroc décrit par Ahmed Sefrioui dans 'La Boîte à Merveilles', la visite des sanctuaires était monnaie courante.",
      problematique: "Dès lors, le recours à ces pratiques irrationnelles est-il un refuge psychologique compréhensible ou bien un archaïsme obscurantiste à bannir ?",
      annonceDuPlan: "Dans ce qui suit, nous examinerons d'abord les raisons qui poussent certains vers ce réconfort, avant d'analyser les méfaits flagrants d'un tel égarement."
    },
    argumentsPour: [
      "Un besoin de soulagement psychologique face à la détresse lorsque la médecine moderne est inaccessible ou trop coûteuse.",
      "Un héritage culturel et une tradition ancestrale qui cimentent les liens sociaux entre femmes (comme la solidarité entre Lalla Zoubida et Lalla Aïcha).",
      "L'effet placebo : la foi dans le sanctuaire procure une paix intérieure temporaire qui calme l'anxiété."
    ],
    argumentsPourAr: [
      "الحاجة الملحة للتخفيف النفسي عند اشتداد الأزمات وعجز الإنسان عن إيجاد حلول مادية أو تكلفة الطب الباهظة.",
      "موروث شعبي وطقوس اجتماعية متوارثة توفر فضاء للتفريغ وتبادل الهموم والمواساة النسائية.",
      "أثر نفسي إيجابي مؤقت (Placebo) يمنح الطمأنينة ويخفف حدة التوتر العصبي لدى السذج."
    ],
    argumentsContre: [
      "L'exploitation financière honteuse de la naïveté et de la vulnérabilité des gens par des charlatans sans scrupules.",
      "L'aggravation de maladies graves en retardant une consultation médicale scientifique urgente.",
      "Une régression intellectuelle et morale contraire à la raison, à la science et aux valeurs authentiques de l'Islam qui condamne le charlatanisme."
    ],
    argumentsContreAr: [
      "استغلال المشعوذين والدجالين لبساطة الناس وحاجتهم المادية لابتزاز أموالهم ومدخراتهم دون طائل.",
      "تفاقم الحالات المرضية الحرجة بسبب التأخر في زيارة الطبيب المختص والاعتماد على الخرافة.",
      "تكريس للتخلف والجهل والتعارض الصريح مع العلم والعقل، فضلاً عن تحريم الدين الإسلامي للشعوذة والادعاء بعلم الغيب."
    ],
    modelEssay: `Depuis la nuit des temps, l'être humain cherche à conjurer le mauvais sort et à apaiser ses tourments intérieurs. C'est dans cette perspective que le recours aux marabouts et aux voyants s'est érigé en phénomène social ancré, comme le dépeint avec minutie Ahmed Sefrioui dans « La Boîte à Merveilles ». Cependant, cette pratique suscite de vives controverses : constitue-t-elle un réconfort moral ou une duperie archaïque ?\n\nD'une part, les partisans de ces rituels soutiennent qu'ils offrent un baume salutaire aux âmes en détresse. Face aux coups durs du destin, tels que la faillite ou la maladie, les personnes démunies trouvent dans les mausolées un havre de paix. C'est exactement le cas de Lalla Zoubida et de Lalla Aïcha qui, accablées par l'infortune, puisent auprès du voyant aveugle Sidi El Arafi la force morale d'espérer. De plus, ces lieux représentent souvent des espaces de communion et de solidarité féminine où l'on partage ses peines en toute franchise.\n\nD'autre part, les détracteurs fustigent avec vigueur ces agissements qu'ils qualifient d'obscurantistes. En premier lieu, ils soulignent l'exploitation éhontée de la vulnérabilité d'autrui par des imposteurs cupides qui monnayent de vaines promesses. En second lieu, délaisser la médecine rationnelle au profit d'amulettes peut engendrer des drames sanitaires irréversibles. Enfin, la foi véritable et la raison humaine rejettent formellement l'idée selon laquelle un mortel pourrait détenir les clés du mystère divin.\n\nEn définitive, bien que l'on puisse concevoir la détresse psychologique qui pousse certains individus vers ces pratiques, il n'en demeure pas moins que le développement d'une société repose sur la science, l'éducation et la rationalité. Il est grand temps d'éradiquer ces reliques du passé au profit d'une prise en charge médicale et sociale accessible à tous.`,
    modelEssayAr: `موضوع نموذجي جاهز ومترجم يراعي المنهجية الرسمية للامتحان الجهوي بالمغرب، موظفاً الأمثلة المستقاة من رواية علبة العجائب، ومحترماً علامات الترقيم والروابط المنطقية المناسبة.`
  },
  {
    id: 'peine-de-mort',
    relatedNovel: 'Le Dernier Jour d’un Condamné',
    relatedNovelAr: 'آخر يوم لمحكوم عليه بالإعدام',
    title: 'La peine de mort : justice légitime ou barbarie déguisée ?',
    titleAr: 'عقوبة الإعدام: عدالة مشروعة أم وحشية مقنعة؟',
    promptFr: "La peine de mort fait l'objet d'un débat universel passionné. Certains jugent qu'elle est indispensable pour punir les crimes odieux et protéger la société, alors que d'autres affirment qu'elle est inhumaine et irréversible. Quelle est votre opinion à ce sujet ? Développez votre argumentation.",
    promptAr: "تثير عقوبة الإعدام نقاشاً عالمياً محتدماً. يرى البعض أنها ضرورية للقصاص من الجرائم البشعة وحماية المجتمع، بينما يؤكد آخرون أنها عقوبة همجية ولا إنسانية ولا رجعة فيها. ما هو رأيك الشخصي؟ طور وجهة نظرك بحجج وأمثلة.",
    recommendedPlan: 'Plan Dialectique',
    recommendedPlanAr: 'التصميم الجدلي (مؤيدو القصاص / مناهضو الإعدام / الخلاصة والبدائل)',
    introOutline: {
      accroche: "La justice humaine a pour mission fondamentale de protéger la société et de punir les transgresseurs de la loi.",
      definitionOuContexte: "Néanmoins, l'application du châtiment suprême, à savoir la peine de mort, soulève depuis des siècles d'intenses débats éthiques.",
      problematique: "L'État a-t-il le droit moral d'ôter la vie à un citoyen au nom de la justice, ou la guillotine n'est-elle qu'une forme institutionnalisée de vengeance barbare ?",
      annonceDuPlan: "Pour répondre à cette épineuse question, nous analyserons les thèses des partisans de la sévérité avant de démontrer les fondements humanistes de l'abolitionnisme."
    },
    argumentsPour: [
      "La légitime défense de la société : éliminer définitivement les criminels dangereux et irrécupérables.",
      "L'exemplarité et la dissuasion : décourager les criminels potentiels par la peur de la mort.",
      "Le soulagement des familles des victimes (loi du talion, œil pour œil, justice rétributive)."
    ],
    argumentsPourAr: [
      "حق المجتمع المشروع في الدفاع عن نفسه والتخلص النهائي من المجرمين الخطرين.",
      "الردع العام والخاص: تخويف كل من تسول له نفسه ارتكاب جرائم مروعة بخوف الموت.",
      "إنصاف أهالي الضحايا وتضميد جراحهم بالقصاص العادل والمماثل."
    ],
    argumentsContre: [
      "L'irréversibilité fatale : en cas d'erreur judiciaire (ce qui arrive régulièrement), il est impossible de ressusciter un innocent.",
      "L'absence d'effet dissuasif prouvé : les statistiques mondiales montrent que la criminalité ne diminue pas dans les pays appliquant l'échafaud.",
      "La barbarie morale : comme l'écrivait Victor Hugo, tuer l'homme pour lui apprendre à ne pas tuer est une contradiction grotesque. La justice doit corriger, non exterminer."
    ],
    argumentsContreAr: [
      "استحالة التراجع عند وقوع الخطأ القضائي: إعدام شخص بريء وصمة عار أبدية لا يمكن تصحيحها.",
      "عدم جدوى الإعدام في ردع الجريمة: الإحصائيات تثبت أن وتيرة الجرائم لا تقل في الدول التي تطبق الإعدام لأن القاتل لا يفكر بعقلانية لحظة ارتكاب فعله.",
      "التناقض الأخلاقي: قتل إنسان باسم القانون جريمة مضاعفة، وغايات العدالة الحديثة هي التأهيل والإصلاح لا الانتقام الهمجي."
    ],
    modelEssay: `Depuis l'aube des civilisations, la question de la peine capitale divise profondément les consciences. Tandis que les partisans de la rigueur la considèrent comme un rempart indispensable contre la barbarie, les défenseurs des droits humains, à l'instar de Victor Hugo dans son roman visionnaire « Le Dernier Jour d’un Condamné », la dénoncent comme un assassinat juridique indigne d'un État civilisé.\n\nCertes, il est indéniable que la société a le devoir impérieux de protéger ses membres contre les forfaits les plus ignobles. Pour les partisans de l'exécution, priver un meurtrier sanguinaire de son existence constitue le seul moyen de neutraliser définitivement une menace récurrente. De surcroît, ce verdict suprême permet d'apaiser la douleur des familles éplorées, qui réclament une juste expiation fondée sur le principe du talion. Enfin, certains soutiennent que la perspective de l'échafaud exerce un pouvoir dissuasif capable de refréner les pulsions criminelles.\n\nCependant, une analyse lucide révèle la vacuité de ces arguments. En premier lieu, la justice est une œuvre humaine et, à ce titre, demeure faillible. Or, exécuter un prévenu en cas d'erreur judiciaire est un acte irréversible d'une injustice insoutenable. En second lieu, aucune statistique n'a jamais prouvé l'efficacité préventive de la peine de mort : le criminel agit sous l'empire de la passion ou de la démence sans calculer froidement son sort. Enfin et surtout, l'État commet une contradiction morale intolérable en ôtant la vie pour condamner l'homicide : on ne supprime point le sang par le sang. La torture morale de l'attente, décrite avec tant de déchirement par Hugo, dépasse en cruauté le crime initial.\n\nEn guise de conclusion, je suis intimement convaincu que la grandeur d'une nation se mesure à son respect inconditionnel de la dignité humaine. Substituer à la peine de mort des peines de réclusion perpétuelle assorties d'un accompagnement psychologique est la seule voie digne de notre temps. La justice doit toujours éclairer, réhabiliter et élever l'humanité, et non se faire la complice du bourreau.`,
    modelEssayAr: `نص حجاجي راقٍ وبليغ يستوفي معايير التميز في الامتحان الجهوي للبكالوريا المغربية (الدرجة الكاملة 10/10).`
  }
];
