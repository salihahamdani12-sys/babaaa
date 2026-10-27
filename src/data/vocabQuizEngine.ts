import { BookId, FlashcardWord, VocabQuizQuestion, VocabQuizType } from '../types';
import { COMPREHENSIVE_CATEGORIZED_VOCAB } from './categorizedVocabData';

/**
 * Rich pedagogical distractor banks categorized by Part of Speech / Semantic Field
 * specifically tailored for Moroccan 1ère Baccalaureate (La Boîte à Merveilles, Antigone, Le Dernier Jour d'un Condamné).
 */

interface LexicalItem {
  french: string;
  arabic: string;
  definition: string;
  category: 'verb' | 'noun_emotion' | 'noun_concept' | 'adjective' | 'expression';
}

const BACCALAUREATE_LEXICON: LexicalItem[] = [
  // --- VERBES (الأفعال الأدبية) ---
  { french: 'Méditer', arabic: 'يَتَأَمَّلُ / يَسْتَغْرِقُ فِي التَّفْكِير', definition: 'Penser profondément et longuement à un sujet.', category: 'verb' },
  { french: 'Supplier', arabic: 'يَتَضَرَّعُ / يَرْجُو بِإِلْحَاح', definition: 'Demander avec une humble et vive insistance.', category: 'verb' },
  { french: 'Se quereller', arabic: 'يَتَشَاجَرُ / يَتَنَازَعُ صَاخِباً', definition: 'Avoir une dispute vive et bruyante.', category: 'verb' },
  { french: 'Somnoler', arabic: 'يَغْفُو / يَنْعَسُ خَفِيفاً', definition: 'Être dans un état de sommeil léger et intermittent.', category: 'verb' },
  { french: 'Épier', arabic: 'يَتَرَبَّصُ / يُرَاقِبُ خُلْسَةً', definition: 'Observer secrètement et avec curiosité.', category: 'verb' },
  { french: 'Dissimuler', arabic: 'يُخْفِي / يَكْتُمُ مَشَاعِرَهُ', definition: 'Cacher volontairement ses pensées ou intentions.', category: 'verb' },
  { french: 'Braver', arabic: 'يَتَحَدَّى / يُجَابِهُ بِجُرْأَة', definition: 'Affronter courageusement un danger ou une autorité.', category: 'verb' },
  { french: 'Gémir', arabic: 'يَئِنُّ / يَتَأَوَّهُ أَلَماً', definition: 'Exprimer sa douleur par des sons plaintifs.', category: 'verb' },
  { french: 'S’enorgueillir', arabic: 'يَتَبَاهَى / يَفْتَخِرُ بِنَفْسِهِ', definition: 'Tirer une vanité orgueilleuse de quelque chose.', category: 'verb' },
  { french: 'Sangloter', arabic: 'يَنْتَحِبُ / يَبْكِي بِحُرْقَة', definition: 'Pleurer convulsivement en étouffant des cris.', category: 'verb' },
  { french: 'Frémir', arabic: 'يَرْتَعِدُ / يَقْشَعِرُّ خَوْفاً', definition: 'Trembler sous le coup d’une vive émotion.', category: 'verb' },
  { french: 'Émerveiller', arabic: 'يُبْهِرُ / يَفْتِنُ بِسِحْرِهِ', definition: 'Frapper d’admiration et d’étonnement émerveillé.', category: 'verb' },
  { french: 'Scruter', arabic: 'يَتَفَحَّصُ / يَدْقُقُ النَّظَرَ', definition: 'Examiner attentivement et en profondeur.', category: 'verb' },
  { french: 'Délibérer', arabic: 'يَتَشَاوَرُ / يُفَكِّرُ قَبْلَ القَرَار', definition: 'Peser le pour et le contre avant de décider.', category: 'verb' },
  { french: 'Exécrer', arabic: 'يَمْقُتُ / يَكْرَهُ بِشِدَّة', definition: 'Haïr violemment avec dégoût et réprobation.', category: 'verb' },
  { french: 'Implorer', arabic: 'يَسْتَعْطِفُ / يَتَوَسَّلُ خَاشِعاً', definition: 'Demander avec ferveur et supplication.', category: 'verb' },
  { french: 'Murmurer', arabic: 'يَهْمِسُ / يَتَحَدَّثُ بِخُفُوت', definition: 'Parler à voix très basse et confidentielle.', category: 'verb' },
  { french: 'Trébucher', arabic: 'يَتَعَثَّرُ / يَزِلُّ فِي مَشْيِهِ', definition: 'Perdre l’équilibre en heurtant un obstacle.', category: 'verb' },
  { french: 'Échafauder', arabic: 'يَحْبِكُ / يَنْسُجُ خَيَالَاتٍ', definition: 'Construire mentalement des plans complexes.', category: 'verb' },
  { french: 'Exhorter', arabic: 'يَحُثُّ / يُشَجِّعُ بِحَمَاسَة', definition: 'Inciter vivement quelqu’un à agir.', category: 'verb' },

  // --- NOMS & ÉTATS D’ÂME (المشاعر والحالات النفسية) ---
  { french: 'La Solitude', arabic: 'العُزْلَةُ / الانْفِرَادُ بِالنَّفْس', definition: 'État d’une personne seule et isolée du monde.', category: 'noun_emotion' },
  { french: 'La Mélancolie', arabic: 'الكآبةُ الشَّاعِرِيَّةُ الحَزِينَة', definition: 'Tristesse douce, rêveuse et indéfinissable.', category: 'noun_emotion' },
  { french: 'L’Angoisse', arabic: 'القَلَقُ وَالهَلَعُ الشَّدِيد', definition: 'Grande inquiétude oppressante née de l’incertitude.', category: 'noun_emotion' },
  { french: 'La Rancœur', arabic: 'الضَّغِينَةُ / الحِقْدُ الدَّفِين', definition: 'Ressentiment amer et durable envers quelqu’un.', category: 'noun_emotion' },
  { french: 'L’Exaltation', arabic: 'الفَرَحُ الغَامِرُ وَالنَّشْوَة', definition: 'État d’enthousiasme fébrile et d’excitation intense.', category: 'noun_emotion' },
  { french: 'L’Effroi', arabic: 'الرُّعْبُ الشَّدِيدُ وَالفَزَع', definition: 'Peur soudaine, violente et paralysante.', category: 'noun_emotion' },
  { french: 'La Ferveur', arabic: 'الخُشُوعُ وَالتَّفَانِي الرُّوحِيّ', definition: 'Ardeur et piété passionnée dans la foi.', category: 'noun_emotion' },
  { french: 'Le Tourment', arabic: 'العَذَابُ وَالمُعَانَاةُ النَّفْسِيَّة', definition: 'Souffrance morale ou physique prolongée.', category: 'noun_emotion' },
  { french: 'La Sérénité', arabic: 'السَّكِينَةُ وَطُمَأْنِينَةُ البَال', definition: 'Calme paisible de l’esprit libre de trouble.', category: 'noun_emotion' },
  { french: 'La Nostalgie', arabic: 'الحَنِينُ المُمِضُّ إِلَى المَاضِي', definition: 'Regret mélancolique d’une époque révolue.', category: 'noun_emotion' },
  { french: 'L’Indignation', arabic: 'السَّخَطُ وَالاسْتِنْكَارُ الغَاضِب', definition: 'Sentiment de colère face à une injustice flagrante.', category: 'noun_emotion' },
  { french: 'La Résignation', arabic: 'الاسْتِسْلَامُ وَالرِّضَا بِالقَدَر', definition: 'Acceptation passive et soumise du sort.', category: 'noun_emotion' },
  { french: 'L’Obstination', arabic: 'العِنَادُ وَالتَّشَبُّثُ الصَّلْب', definition: 'Attachement inébranlable à une idée ou décision.', category: 'noun_emotion' },
  { french: 'Le Désarroi', arabic: 'الحَيْرَةُ وَالارْتِبَاكُ الشَّدِيد', definition: 'Trouble profond causé par la perte de repères.', category: 'noun_emotion' },

  // --- NOMS & CONCEPTS DU PROGRAMME (المصطلحات والمفاهيم الأدبية) ---
  { french: 'Le Destin', arabic: 'القَدَرُ المَحْتُومُ وَالمَصِير', definition: 'Puissance supérieure fixant irrévocablement le cours des vies.', category: 'noun_concept' },
  { french: 'Le Supplice', arabic: 'العِقَابُ الشَّدِيدُ وَالعَذَاب', definition: 'Peine corporelle atroce ou torture morale insoutenable.', category: 'noun_concept' },
  { french: 'L’Échafaud', arabic: 'مِنَصَّةُ الإِعْدَامِ المَرْهُوبَة', definition: 'Estrade où s’exécute la peine de mort par décapitation.', category: 'noun_concept' },
  { french: 'La Fatalité', arabic: 'الحَتْمِيَّةُ التَّرَاجِيدِيَّةُ القَاهِرَة', definition: 'Force irrésistible conduisant inévitablement au drame.', category: 'noun_concept' },
  { french: 'Le Cachot', arabic: 'الزِّنْزَانَةُ المُظْلِمَةُ الضَّيِّقَة', definition: 'Cellule de prison obscure, étroite et humide.', category: 'noun_concept' },
  { french: 'La Bénédiction', arabic: 'البَرَكَةُ وَالنِّعْمَةُ الرُّوحِيَّة', definition: 'Faveur divine ou spirituelle accordée par un saint.', category: 'noun_concept' },
  { french: 'L’Injustice', arabic: 'الجَوْرُ وَالظُّلْمُ المَرْفُوض', definition: 'Violation des droits élémentaires et de l’équité.', category: 'noun_concept' },
  { french: 'Le Sortilège', arabic: 'السِّحْرُ وَالتَّعْوِيذَةُ الغَامِضَة', definition: 'Pratique occulte destinée à influencer les événements.', category: 'noun_concept' },

  // --- ADJECTIFS & QUALIFICATIFS (النعوت والصفات الأدبية) ---
  { french: 'Sombre', arabic: 'قَاتِمٌ / مُظْلِمٌ وَمُكْتَئِب', definition: 'Obscur, triste et chargé de noirceur.', category: 'adjective' },
  { french: 'Éphémère', arabic: 'زَائِلٌ / عَابِرٌ قَصِيرُ الأَمَد', definition: 'Qui dure très peu de temps ; passager.', category: 'adjective' },
  { french: 'Lugubre', arabic: 'جَنَائِزِيٌّ / كَئِيبٌ يُثِيرُ الحُزْن', definition: 'Qui évoque la mort et inspire une tristesse noire.', category: 'adjective' },
  { french: 'Inflexible', arabic: 'صَلْبٌ / عَنِيدٌ لَا يَلِينُ أَبَداً', definition: 'Qui ne se laisse fléchir par aucune pitié ni prière.', category: 'adjective' },
  { french: 'Taciturne', arabic: 'كَتُومٌ / قَلِيلُ الكَلَامِ وَمُنْطَوٍ', definition: 'Qui parle peu et garde un silence réservé.', category: 'adjective' },
  { french: 'Candide', arabic: 'سَاذَجٌ / بَرِيءُ النِّيَّةِ طَاهِر', definition: 'D’une pureté ingénue, exempt de toute malice.', category: 'adjective' },
  { french: 'Sinistre', arabic: 'مَشْؤُومٌ / مُثِيرٌ لِلرَّهْبَةِ وَالشَّرّ', definition: 'Qui annonce le malheur et inspire l’effroi.', category: 'adjective' },
  { french: 'Somptueux', arabic: 'بَاذِخٌ / فَاخِرٌ وَمُتْرَفٌ جِدّاً', definition: 'D’une magnificence éclatante et coûteuse.', category: 'adjective' },
  { french: 'Pitoyable', arabic: 'مُثِيرٌ لِلشَّفَقَةِ وَالبُؤْس', definition: 'Qui inspire la pitié par son état misérable.', category: 'adjective' },
  { french: 'Furtif', arabic: 'خَاطِفٌ / خَفِيٌّ يَمُرُّ دُونَ انْتِبَاه', definition: 'Qui se fait à la dérobée et très discrètement.', category: 'adjective' },
  { french: 'Hostile', arabic: 'مُعَادٍ / مُنَاهِضٌ يَكِنُّ العَدَاوَة', definition: 'Qui manifeste une opposition agressive ou de l’inimitié.', category: 'adjective' },
  { french: 'Impitoyable', arabic: 'قَاسٍ / لَا يَعْرِفُ الرَّحْمَة', definition: 'Qui fait preuve d’une dureté inflexible sans merci.', category: 'adjective' }
];

/**
 * Knowledge Base: Authentic Antonyms for 1ère Bac literature
 */
interface AntonymEntry {
  wordKey: string;
  correctAntonym: string;
  distractors: string[];
  explanation: string;
}

const BACCALAUREATE_ANTONYMS: AntonymEntry[] = [
  { wordKey: 'braver', correctAntonym: 'Se soumettre / Capituler', distractors: ['Affronter', 'Défier', 'Menacer'], explanation: '« Braver » signifie défier avec audace ; son contraire exact est « se soumettre » ou « capituler ».' },
  { wordKey: 'inflexible', correctAntonym: 'Souple / Indulgent', distractors: ['Rigide', 'Obstiné', 'Intransigeant'], explanation: '« Inflexible » qualifie une personne intraitable ; son opposé est « souple » ou « indulgent ».' },
  { wordKey: 'sombre', correctAntonym: 'Lumineux / Radieux', distractors: ['Obscur', 'Lugubre', 'Ténébreux'], explanation: '« Sombre » connote l’obscurité et la tristesse ; son antonyme est « lumineux » ou « radieux ».' },
  { wordKey: 'solitude', correctAntonym: 'La Compagnie / La Société', distractors: ['L’Isolement', 'Le Silence', 'L’Exil'], explanation: '« La solitude » désigne le fait d’être seul ; son contraire est « la compagnie ».' },
  { wordKey: 'melancolie', correctAntonym: 'L’Allégresse / La Gaieté', distractors: ['La Tristesse', 'Le Tourment', 'Le Spleen'], explanation: '« La mélancolie » est une tristesse vague ; son contraire est « l’allégresse ».' },
  { wordKey: 'angoisse', correctAntonym: 'La Sérénité / La Quiétude', distractors: ['L’Effroi', 'La Terreur', 'L’Inquiétude'], explanation: '« L’angoisse » est une peur oppressante ; son opposé est « la sérénité ».' },
  { wordKey: 'candide', correctAntonym: 'Malicieux / Sournois', distractors: ['Ingénu', 'Naïf', 'Innocent'], explanation: '« Candide » signifie pur et sans ruse ; son contraire est « sournois » ou « malicieux ».' },
  { wordKey: 'execrer', correctAntonym: 'Chérir / Adorer', distractors: ['Haïr', 'Dédaigner', 'Maudire'], explanation: '« Exécrer » signifie détester profondément ; son opposé est « chérir ».' },
  { wordKey: 'sinistre', correctAntonym: 'Rassurant / Réjouissant', distractors: ['Funèbre', 'Effrayant', 'Mené'], explanation: '« Sinistre » inspire l’effroi et le mauvais présage ; son antonyme est « rassurant ».' },
  { wordKey: 'rancoeur', correctAntonym: 'Le Pardon / La Bienveillance', distractors: ['Le Ressentiment', 'L’Amertume', 'La Vengeance'], explanation: '« La rancœur » est un ressentiment amer ; son contraire est « le pardon ».' },
  { wordKey: 'supplice', correctAntonym: 'Le Soulagement / La Délivrance', distractors: ['Le Martyre', 'La Torture', 'L’Agonie'], explanation: '« Le supplice » est une souffrance extrême ; son opposé est « le soulagement ».' },
  { wordKey: 'gemir', correctAntonym: 'Jubiler / Rire aux éclats', distractors: ['Pleurnicher', 'Se plaindre', 'Sangloter'], explanation: '« Gémir » exprime la douleur ; son contraire est « jubiler ».' },
  { wordKey: 'taciturne', correctAntonym: 'Bavard / Loquace', distractors: ['Silencieux', 'Réservé', 'Sombre'], explanation: '« Taciturne » est quelqu’un qui parle peu ; son antonyme est « bavard » ou « loquace ».' },
  { wordKey: 'somptueux', correctAntonym: 'Misérable / Modeste', distractors: ['Magnifique', 'Fastueux', 'Éclatant'], explanation: '« Somptueux » qualifie le luxe et la splendeur ; son contraire est « misérable ».' },
  { wordKey: 'implorer', correctAntonym: 'Exiger / Ordonner', distractors: ['Supplier', 'Prier', 'Invoquer'], explanation: '« Implorer » est demander avec humilité ; son opposé autoritaire est « exiger » ou « ordonner ».' },
  { wordKey: 'obstination', correctAntonym: 'La Docilité / La Soumission', distractors: ['L’Entêtement', 'La Fermeté', 'La Ténacité'], explanation: '« L’obstination » est le refus de céder ; son contraire est « la docilité ».' },
  { wordKey: 'indignation', correctAntonym: 'L’Approbation / La Satisfaction', distractors: ['La Colère', 'Le Dégoût', 'La Révolte'], explanation: '« L’indignation » est le mécontentement face à l’injustice ; son contraire est « l’approbation ».' },
  { wordKey: 'ferveur', correctAntonym: 'L’Indifférence / L’Apathie', distractors: ['La Piété', 'L’Ardeur', 'La Passion'], explanation: '« La ferveur » est un dévouement chaleureux ; son opposé est « l’indifférence ».' },
  { wordKey: 'resignation', correctAntonym: 'La Révolte / L’Insoumission', distractors: ['L’Acceptation', 'Le Fatalisme', 'La Passivité'], explanation: '« La résignation » est l’abandon passif ; son contraire est « la révolte ».' },
  { wordKey: 'ephemere', correctAntonym: 'Éternel / Durable / Perpétuel', distractors: ['Passager', 'Fugace', 'Bref'], explanation: '« Éphémère » dure peu de temps ; son antonyme est « éternel ».' },
  { wordKey: 'hostile', correctAntonym: 'Amical / Bienveillant', distractors: ['Agressif', 'Ennemi', 'Défavorable'], explanation: '« Hostile » traduit l’animosité ; son opposé est « bienveillant » ou « amical ».' },
  { wordKey: 'impitoyable', correctAntonym: 'Clément / Miséricordieux', distractors: ['Sévère', 'Inflexible', 'Cruel'], explanation: '« Impitoyable » n’accorde aucune grâce ; son contraire est « clément ».' },
  { wordKey: 'dissimuler', correctAntonym: 'Dévoiler / Révéler', distractors: ['Cacher', 'Masquer', 'Taire'], explanation: '« Dissimuler » signifie masquer ; son opposé est « dévoiler ».' }
];

/**
 * Knowledge Base: Authentic Semantic Fields (Champs Lexicaux) for 1ère Bac
 */
interface ChampEntry {
  fieldTitle: string;
  fieldArabic: string;
  keywords: string[];
  explanation: string;
}

const BACCALAUREATE_CHAMPS: ChampEntry[] = [
  {
    fieldTitle: 'Le champ lexical de la mort, du châtiment et de l’échafaud',
    fieldArabic: 'حقل الموت، العقاب، ومنصة الإعدام (Le châtiment et la mort)',
    keywords: ['échafaud', 'supplice', 'condamné', 'bourreau', 'guillotine', 'mort', 'cadavre', 'tombeau', 'agonie', 'sang', 'cercueil', 'sinistre', 'lugubre', 'expiation'],
    explanation: 'مفردات ترتبط بلحظات القصاص والرهبة من الموت في رواية Victor Hugo.'
  },
  {
    fieldTitle: 'Le champ lexical de l’enfermement, de la captivité et de la prison',
    fieldArabic: 'حقل السجن، الأسر، والاحتجاز (La réclusion et la prison)',
    keywords: ['cachot', 'cellule', 'verrou', 'barreaux', 'geôlier', 'fers', 'chaîne', 'bicêtre', 'bagne', 'prison', 'détention', 'grièche', 'claustration'],
    explanation: 'تعبير عن ضيق الزنزانة والتقييد الجسدي والنفسي للحرية.'
  },
  {
    fieldTitle: 'Le champ lexical de la solitude, de l’isolement et du repli sur soi',
    fieldArabic: 'حقل العزلة، الانطواء، والوحدة الذاتية (La solitude et l’isolement)',
    keywords: ['solitude', 'isolement', 'silence', 'abandon', 'délaissé', 'solitaire', 'mélancolie', 'taciturne', 'désarroi', 'rêverie', 'seul'],
    explanation: 'يصور انفصال الشخصية عن العالم الخارجي واللجوء لعالمها الباطني (سيدي محمد).'
  },
  {
    fieldTitle: 'Le champ lexical du mysticisme, des croyances populaires et de la dévotion',
    fieldArabic: 'حقل التصوف، الطقوس، والمعتقدات الشعبية (Le mysticisme et la foi)',
    keywords: ['voyante', 'sanctuaire', 'zaouïa', 'chérif', 'talisman', 'amulette', 'jnouns', 'sortilège', 'ferveur', 'bénédiction', 'marabout', 'moussem', 'prière', 'chouafa'],
    explanation: 'يعكس الموروث الثقافي والروحاني لمدينة فاس في La Boîte à Merveilles.'
  },
  {
    fieldTitle: 'Le champ lexical de la fatalité tragique, du devoir et du pouvoir royal',
    fieldArabic: 'حقل الحتمية التراجيدية، الواجب، والسلطة (La fatalité et le pouvoir)',
    keywords: ['destin', 'fatalité', 'braver', 'créon', 'antigone', 'trône', 'couronne', 'loi', 'décret', 'obstination', 'inflexible', 'devoir', 'souverain', 'tombe'],
    explanation: 'يمثل جوهر الصراع التراجيدي بين قانون الآلهة وسطوة الملك كريون في مسرحية أنتيغون.'
  },
  {
    fieldTitle: 'Le champ lexical de l’enfance, de l’imaginaire et de l’émerveillement',
    fieldArabic: 'حقل الطفولة، الخيال، والافتتان العجائبي (L’imaginaire enfantin)',
    keywords: ['boîte', 'merveilles', 'boutons', 'perles', 'verre', 'trésor', 'émerveiller', 'candide', 'féerie', 'songe', 'naïveté', 'imagination'],
    explanation: 'يرصد نظرة الطفل السحرية للأشياء اليومية البسيطة التي تحميه من وحشة العالم.'
  },
  {
    fieldTitle: 'Le champ lexical de la souffrance pathétique, des larmes et de la détresse',
    fieldArabic: 'حقل الحزن، الدموع، والاستعطاف (La souffrance pathétique)',
    keywords: ['gémir', 'sangloter', 'tourment', 'angoisse', 'larmes', 'pleurer', 'pitoyable', 'effroi', 'misère', 'détresse', 'rancœur', 'douleur'],
    explanation: 'عبارات موجهة لتحريك مشاعر الشفقة والتعاطف الإنساني العميق.'
  }
];

/**
 * Knowledge Base: Authentic Literary Registers (Registres littéraires) for 1ère Bac
 */
interface RegistreEntry {
  registre: string;
  registreArabic: string;
  keywords: string[];
  explanation: string;
}

const BACCALAUREATE_REGISTRES: RegistreEntry[] = [
  {
    registre: 'Le registre tragique (التراجيدي)',
    registreArabic: 'السجل التراجيدي (Le tragique)',
    keywords: ['destin', 'fatalité', 'échafaud', 'inflexible', 'obstination', 'créon', 'antigone', 'mort', 'injustice', 'condamné', 'impitoyable', 'braver'],
    explanation: 'يبرز مواجهة الإنسان الحتمية للموت والمصير المحتوم دون أي بارقة أمل أو فكاك.'
  },
  {
    registre: 'Le registre pathétique (الباثيتيك / المثير للشفقة)',
    registreArabic: 'السجل التأثري المثير للشفقة (Le pathétique)',
    keywords: ['sangloter', 'gémir', 'larmes', 'pitoyable', 'tourment', 'effroi', 'angoisse', 'supplice', 'solitude', 'misère', 'détresse', 'pleurer'],
    explanation: 'يهدف إلى هز وجدان القارئ واستدرار دموعه بالتركيز على عذاب الضحية العاجزة.'
  },
  {
    registre: 'Le registre lyrique (الليريكي / البوح الذاتي والشاعري)',
    registreArabic: 'السجل الغنائي الذاتي (Le lyrique)',
    keywords: ['mélancolie', 'nostalgie', 'rêverie', 'souvenir', 'cœur', 'ferveur', 'sérénité', 'exaltation', 'songe', 'amour', 'enfance'],
    explanation: 'يعبر بصدق وشاعرية عن المشاعر الحميمية، الحنين، والخلجات النفسية الذاتية.'
  },
  {
    registre: 'Le registre polémique et réaliste (الجدالي والواقعي)',
    registreArabic: 'السجل الجدالي والواقعي (Le polémique & réaliste)',
    keywords: ['bourreau', 'guillotine', 'injustice', 'loi', 'société', 'cachot', 'bicêtre', 'délibérer', 'exécrer', 'indignation', 'châtiment'],
    explanation: 'يستعمل للمحاججة الحادة وفضح جور القوانين ومساوئ المجتمع ومؤسساته العقابية.'
  },
  {
    registre: 'Le registre merveilleux et poétique (العجائبي الخيالي)',
    registreArabic: 'السجل العجائبي الخيالي (Le merveilleux)',
    keywords: ['boîte', 'merveilles', 'sortilège', 'talisman', 'émerveiller', 'féerie', 'candide', 'lumière', 'trésor', 'magie'],
    explanation: 'يدمج عناصر السحر والخيال الأسطوري لإضفاء صبغة أسطورية على الواقع المعاش.'
  }
];

/**
 * Normalizes words and strings for clean matching and deduplication
 */
function cleanText(str: string): string {
  if (!str) return '';
  return str
    .replace(/[«»"“”']/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeKey(str: string): string {
  return cleanText(str).toLowerCase().replace(/^(le|la|les|l'|un|une|des|se|s')\s+/i, '').trim();
}

/**
 * Classifies a flashcard into one of the canonical categories for targeted matching
 */
function getCardCategory(card: FlashcardWord): 'verb' | 'noun_emotion' | 'noun_concept' | 'adjective' | 'expression' {
  const pos = (card.partOfSpeech || '').toLowerCase();
  const word = card.frenchWord.toLowerCase();

  if (pos.includes('verb') || word.startsWith('se ') || word.startsWith("s'") || /^(songer|somnoler|implorer|braver|délibérer|épier|frémir|gémir|regretter|pleurer|penser)/i.test(word)) {
    return 'verb';
  }
  if (pos.includes('adj') || /^(lugubre|sombre|éphémère|inflexible|taciturne|candide|sinistre|somptueux|pitoyable|hostile)/i.test(word)) {
    return 'adjective';
  }
  if (word.includes('solitude') || word.includes('mélancolie') || word.includes('angoisse') || word.includes('rancœur') || word.includes('exaltation') || word.includes('peur') || word.includes('joie')) {
    return 'noun_emotion';
  }
  return 'noun_concept';
}

/**
 * Shuffles an array with Fisher-Yates algorithm
 */
function shuffle<T>(arr: T[]): T[] {
  const res = [...arr];
  for (let i = res.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [res[i], res[j]] = [res[j], res[i]];
  }
  return res;
}

/**
 * State-of-the-Art Moroccan 1ère Bac Vocabulary Quiz Generator
 * Produces diverse, pedagogical questions across Synonyms, Antonyms, Champs Lexicaux,
 * Registres Littéraires, Context Completion, Arabic Translation, and Literary Definitions.
 */
export function generateAdvancedVocabularyQuiz(
  selectedCards: FlashcardWord[],
  allStoredCards: FlashcardWord[],
  quizType: VocabQuizType = 'ALL',
  questionCount: number = 5
): VocabQuizQuestion[] {
  // Use comprehensive pool if available
  const pool = selectedCards.length > 0 ? selectedCards : (allStoredCards.length > 0 ? allStoredCards : COMPREHENSIVE_CATEGORIZED_VOCAB);
  if (pool.length === 0) return [];

  // Filter out empty cards
  const validCards = pool.filter((c) => c && c.frenchWord && c.frenchWord.trim().length > 0);
  if (validCards.length === 0) return [];

  // Pick question candidate cards randomly without replacement
  const shuffledPool = shuffle(validCards);
  const targetCards = shuffledPool.slice(0, Math.min(questionCount, shuffledPool.length));

  // Global distractor memory to avoid repeating the exact same distractor choices across questions
  const globalUsedFrenchDistractors = new Set<string>();
  const globalUsedArabicDistractors = new Set<string>();

  const questions: VocabQuizQuestion[] = [];

  targetCards.forEach((card, qIndex) => {
    const category = getCardCategory(card);
    const frenchWordClean = cleanText(card.frenchWord);
    const normWord = normalizeKey(frenchWordClean);

    // Determine Question Modality based on quizType with intelligent fallback
    let questionFormat: 'FRENCH_SYNONYM' | 'ANTONYM' | 'CHAMP_LEXICAL' | 'REGISTRE' | 'ARABIC_MEANING' | 'CONTEXT_COMPLETION' | 'DEFINITIONS';
    
    if (quizType === 'SYNONYMS') {
      questionFormat = 'FRENCH_SYNONYM';
    } else if (quizType === 'ANTONYMS') {
      questionFormat = 'ANTONYM';
    } else if (quizType === 'CHAMPS_LEXICAUX') {
      questionFormat = 'CHAMP_LEXICAL';
    } else if (quizType === 'REGISTRES') {
      questionFormat = 'REGISTRE';
    } else if (quizType === 'ARABIC_MEANINGS') {
      questionFormat = 'ARABIC_MEANING';
    } else if (quizType === 'CONTEXT_COMPLETION') {
      questionFormat = 'CONTEXT_COMPLETION';
    } else if (quizType === 'DEFINITIONS') {
      questionFormat = 'DEFINITIONS';
    } else {
      // 'ALL' - Intelligent 7-modality pedagogical rotation!
      const modalities: Array<'FRENCH_SYNONYM' | 'ANTONYM' | 'CHAMP_LEXICAL' | 'REGISTRE' | 'CONTEXT_COMPLETION' | 'ARABIC_MEANING' | 'DEFINITIONS'> = [
        'FRENCH_SYNONYM',
        'ANTONYM',
        'CHAMP_LEXICAL',
        'CONTEXT_COMPLETION',
        'REGISTRE',
        'ARABIC_MEANING',
        'DEFINITIONS'
      ];
      questionFormat = modalities[qIndex % modalities.length];
    }

    // =========================================================================
    // 1. FORMAT: ANTONYMES / CONTRAIRES (الأضداد والعكوس الأدبية)
    // =========================================================================
    if (questionFormat === 'ANTONYM') {
      // Match from BACCALAUREATE_ANTONYMS or find antonym rule
      const antonymRule = BACCALAUREATE_ANTONYMS.find(
        (a) => normWord.includes(a.wordKey) || a.wordKey.includes(normWord)
      );

      if (antonymRule) {
        const correctAntonym = antonymRule.correctAntonym;
        const distractors = shuffle(antonymRule.distractors).slice(0, 3);
        const finalOptions = shuffle([correctAntonym, ...distractors]);
        const correctAnswerIndex = finalOptions.indexOf(correctAntonym);

        questions.push({
          id: `quiz-q-antonym-${card.id}-${qIndex}`,
          cardId: card.id,
          type: 'ANTONYM',
          frenchWord: frenchWordClean,
          prompt: `Quel est l'antonyme (contraire) le plus exact pour le terme « ${frenchWordClean} » dans le contexte de l'œuvre ?`,
          promptLanguage: 'fr',
          options: finalOptions,
          correctAnswerIndex,
          categoryLabel: 'الأضداد والعكوس الأدبية (Les Antonymes)',
          explanation: `ضد وعكس كلمة « ${frenchWordClean} » في السياق الروائي هو: « ${correctAntonym} ». ${antonymRule.explanation}`,
          exampleExcerpt: card.exampleContextFrench,
          relatedCard: card,
        });
        return;
      }
      // If not in antonym rule, gracefully fall to FRENCH_SYNONYM
      questionFormat = 'FRENCH_SYNONYM';
    }

    // =========================================================================
    // 2. FORMAT: CHAMPS LEXICAUX (الحقول الدلالية والمعجمية)
    // =========================================================================
    if (questionFormat === 'CHAMP_LEXICAL') {
      // Find matching semantic field
      const matchingChamp = BACCALAUREATE_CHAMPS.find((c) =>
        c.keywords.some((k) => normWord.includes(k) || k.includes(normWord))
      );

      if (matchingChamp) {
        const correctField = matchingChamp.fieldTitle;
        const otherChamps = shuffle(
          BACCALAUREATE_CHAMPS.filter((c) => c.fieldTitle !== correctField)
        ).slice(0, 3);

        const distractors = otherChamps.map((c) => c.fieldTitle);
        const finalOptions = shuffle([correctField, ...distractors]);
        const correctAnswerIndex = finalOptions.indexOf(correctField);

        questions.push({
          id: `quiz-q-champ-${card.id}-${qIndex}`,
          cardId: card.id,
          type: 'CHAMP_LEXICAL',
          frenchWord: frenchWordClean,
          prompt: `À quel champ lexical majeur du roman étudié se rattache le mot « ${frenchWordClean} » ?`,
          promptLanguage: 'fr',
          options: finalOptions,
          correctAnswerIndex,
          categoryLabel: 'الحقول الدلالية والمعجمية (Champs Lexicaux)',
          explanation: `ينتمي مصطلح « ${frenchWordClean} » إلى « ${matchingChamp.fieldArabic} ». ${matchingChamp.explanation}`,
          exampleExcerpt: card.exampleContextFrench,
          relatedCard: card,
        });
        return;
      }
      // Fallback if no specific champ keyword
      questionFormat = 'FRENCH_SYNONYM';
    }

    // =========================================================================
    // 3. FORMAT: REGISTRES LITTÉRAIRES (السجلات والنبرة الأدبية)
    // =========================================================================
    if (questionFormat === 'REGISTRE') {
      const matchingRegistre = BACCALAUREATE_REGISTRES.find((r) =>
        r.keywords.some((k) => normWord.includes(k) || k.includes(normWord))
      );

      if (matchingRegistre) {
        const correctRegistre = matchingRegistre.registre;
        const otherRegistres = shuffle(
          BACCALAUREATE_REGISTRES.filter((r) => r.registre !== correctRegistre)
        ).slice(0, 3);

        const distractors = otherRegistres.map((r) => r.registre);
        const finalOptions = shuffle([correctRegistre, ...distractors]);
        const correctAnswerIndex = finalOptions.indexOf(correctRegistre);

        questions.push({
          id: `quiz-q-registre-${card.id}-${qIndex}`,
          cardId: card.id,
          type: 'REGISTRE',
          frenchWord: frenchWordClean,
          prompt: `Quelle tonalité ou registre littéraire est principalement renforcé par l'emploi de « ${frenchWordClean} » ?`,
          promptLanguage: 'fr',
          options: finalOptions,
          correctAnswerIndex,
          categoryLabel: 'السجل والنبرة الأدبية (Registres littéraires)',
          explanation: `السجل الأدبي المتوافق مع « ${frenchWordClean} » هو « ${matchingRegistre.registreArabic} ». ${matchingRegistre.explanation}`,
          exampleExcerpt: card.exampleContextFrench,
          relatedCard: card,
        });
        return;
      }
      // Fallback
      questionFormat = 'ARABIC_MEANING';
    }

    // =========================================================================
    // 4. FORMAT: FRENCH SYNONYM (مرادفات اللغة الفرنسية الأدبية)
    // =========================================================================
    if (questionFormat === 'FRENCH_SYNONYM') {
      const correctSynonym = card.synonyms && card.synonyms.length > 0
        ? cleanText(card.synonyms[0])
        : `Équivalent contextuel de « ${frenchWordClean} »`;

      const normCorrect = normalizeKey(correctSynonym);
      const distractors: string[] = [];

      // A. Pull matching category distractors from other flashcards first
      const otherCards = shuffle(allStoredCards.filter((c) => normalizeKey(c.frenchWord) !== normWord));
      for (const other of otherCards) {
        if (distractors.length >= 3) break;
        const otherSyn = other.synonyms && other.synonyms[0] ? cleanText(other.synonyms[0]) : cleanText(other.frenchWord);
        const normOther = normalizeKey(otherSyn);

        if (
          normOther !== normWord &&
          normOther !== normCorrect &&
          !distractors.some((d) => normalizeKey(d) === normOther) &&
          !globalUsedFrenchDistractors.has(normOther)
        ) {
          distractors.push(otherSyn);
          globalUsedFrenchDistractors.add(normOther);
        }
      }

      // B. Supplement from categorized BACCALAUREATE_LEXICON if needed
      const matchingLexicon = shuffle(BACCALAUREATE_LEXICON.filter((l) => l.category === category));
      for (const item of matchingLexicon) {
        if (distractors.length >= 3) break;
        const normItem = normalizeKey(item.french);
        if (
          normItem !== normWord &&
          normItem !== normCorrect &&
          !distractors.some((d) => normalizeKey(d) === normItem) &&
          !globalUsedFrenchDistractors.has(normItem)
        ) {
          distractors.push(item.french);
          globalUsedFrenchDistractors.add(normItem);
        }
      }

      // C. Fallback pool
      for (const item of shuffle(BACCALAUREATE_LEXICON)) {
        if (distractors.length >= 3) break;
        const normItem = normalizeKey(item.french);
        if (
          normItem !== normWord &&
          normItem !== normCorrect &&
          !distractors.some((d) => normalizeKey(d) === normItem)
        ) {
          distractors.push(item.french);
        }
      }

      const finalOptions = shuffle([correctSynonym, ...distractors.slice(0, 3)]);
      const correctAnswerIndex = finalOptions.indexOf(correctSynonym);

      questions.push({
        id: `quiz-q-synonym-${card.id}-${qIndex}`,
        cardId: card.id,
        type: 'FRENCH_SYNONYM',
        frenchWord: frenchWordClean,
        prompt: `Quel est le synonyme français contextuel le plus approprié pour le mot « ${frenchWordClean} » dans le texte ?`,
        promptLanguage: 'fr',
        options: finalOptions,
        correctAnswerIndex,
        categoryLabel: 'المرادفات الأدبية (Les Synonymes)',
        explanation: `في المقرر الجهوي، المرادف الدقيق لعبارة « ${frenchWordClean} » هو « ${correctSynonym} ». ${card.definitionFrench || card.contextualMeaning || ''}`,
        exampleExcerpt: card.exampleContextFrench,
        relatedCard: card,
      });
      return;
    }

    // =========================================================================
    // 5. FORMAT: ARABIC MEANING (المعنى الدلالي والسياقي بالعربية الفصحى)
    // =========================================================================
    if (questionFormat === 'ARABIC_MEANING') {
      const cleanArabic = cleanText(card.arabicMeaning).replace(/^ملاحظة:.*$/i, '').trim() || 'المعنى السياقي المعتمد';
      const normCorrectAr = cleanArabic.toLowerCase();
      const distractors: string[] = [];

      const otherCards = shuffle(allStoredCards.filter((c) => normalizeKey(c.frenchWord) !== normWord));
      for (const other of otherCards) {
        if (distractors.length >= 3) break;
        const otherAr = cleanText(other.arabicMeaning);
        const normOtherAr = otherAr.toLowerCase();

        if (
          otherAr.length > 2 &&
          normOtherAr !== normCorrectAr &&
          !distractors.some((d) => d.toLowerCase() === normOtherAr) &&
          !globalUsedArabicDistractors.has(normOtherAr)
        ) {
          distractors.push(otherAr);
          globalUsedArabicDistractors.add(normOtherAr);
        }
      }

      const matchingLexicon = shuffle(BACCALAUREATE_LEXICON.filter((l) => l.category === category));
      for (const item of matchingLexicon) {
        if (distractors.length >= 3) break;
        const normItemAr = item.arabic.toLowerCase();
        if (
          normItemAr !== normCorrectAr &&
          !distractors.some((d) => d.toLowerCase() === normItemAr) &&
          !globalUsedArabicDistractors.has(normItemAr)
        ) {
          distractors.push(item.arabic);
          globalUsedArabicDistractors.add(normItemAr);
        }
      }

      for (const item of shuffle(BACCALAUREATE_LEXICON)) {
        if (distractors.length >= 3) break;
        const normItemAr = item.arabic.toLowerCase();
        if (normItemAr !== normCorrectAr && !distractors.some((d) => d.toLowerCase() === normItemAr)) {
          distractors.push(item.arabic);
        }
      }

      const finalOptions = shuffle([cleanArabic, ...distractors.slice(0, 3)]);
      const correctAnswerIndex = finalOptions.indexOf(cleanArabic);

      questions.push({
        id: `quiz-q-meaning-${card.id}-${qIndex}`,
        cardId: card.id,
        type: 'ARABIC_MEANING',
        frenchWord: frenchWordClean,
        prompt: `ما هو المعنى السياقي الأدق للمفردة « ${frenchWordClean} » كما وردت في الرواية المقررة؟`,
        promptLanguage: 'ar',
        options: finalOptions,
        correctAnswerIndex,
        categoryLabel: 'المعنى والترجمة السياقية (Traduction)',
        explanation: `المعنى السياقي المعتمد لمفردة « ${frenchWordClean} » هو: « ${cleanArabic} ». ${card.contextualMeaning || card.definitionArabic || ''}`,
        exampleExcerpt: card.exampleContextFrench,
        relatedCard: card,
      });
      return;
    }

    // =========================================================================
    // 6. FORMAT: CONTEXT COMPLETION (استكمال الشاهد النصي من الرواية)
    // =========================================================================
    if (questionFormat === 'CONTEXT_COMPLETION') {
      const excerpt = card.exampleContextFrench && card.exampleContextFrench.length > 15
        ? card.exampleContextFrench
        : `Dans ce passage du roman, le narrateur emploie avec grande force le mot « ${frenchWordClean} ».`;

      const regex = new RegExp(`\\b${frenchWordClean}\\b`, 'i');
      const maskedPrompt = excerpt.replace(regex, '« [...] »');

      const correctWord = frenchWordClean;
      const distractors: string[] = [];

      const matchingLexicon = shuffle(BACCALAUREATE_LEXICON.filter((l) => l.category === category));
      for (const item of matchingLexicon) {
        if (distractors.length >= 3) break;
        const normItem = normalizeKey(item.french);
        if (normItem !== normWord && !distractors.some((d) => normalizeKey(d) === normItem)) {
          distractors.push(item.french);
        }
      }

      const finalOptions = shuffle([correctWord, ...distractors.slice(0, 3)]);
      const correctAnswerIndex = finalOptions.indexOf(correctWord);

      questions.push({
        id: `quiz-q-context-${card.id}-${qIndex}`,
        cardId: card.id,
        type: 'CONTEXT_COMPLETION',
        frenchWord: frenchWordClean,
        prompt: `Complétez fidèlement cet extrait littéraire de l'œuvre avec le mot approprié :\n${maskedPrompt}`,
        promptLanguage: 'fr',
        options: finalOptions,
        correctAnswerIndex,
        categoryLabel: 'شواهد الرواية والسياق الأدبي (En contexte)',
        explanation: `الكلمة المناسبة لسياق هذا المقتطف الأدبي هي « ${correctWord} » ومعناها بالعربية: « ${card.arabicMeaning} ».`,
        exampleExcerpt: excerpt,
        relatedCard: card,
      });
      return;
    }

    // =========================================================================
    // 7. FORMAT: DEFINITIONS (التعريفات والمفاهيم الأدبية)
    // =========================================================================
    const correctDef = card.definitionFrench && card.definitionFrench.length > 15
      ? cleanText(card.definitionFrench)
      : `Sens et portée littéraire du mot « ${frenchWordClean} » dans le récit.`;

    const distractors: string[] = [];
    const matchingLexicon = shuffle(BACCALAUREATE_LEXICON.filter((l) => l.category === category));
    for (const item of matchingLexicon) {
      if (distractors.length >= 3) break;
      if (item.definition !== correctDef && !distractors.includes(item.definition)) {
        distractors.push(item.definition);
      }
    }

    const finalOptions = shuffle([correctDef, ...distractors.slice(0, 3)]);
    const correctAnswerIndex = finalOptions.indexOf(correctDef);

    questions.push({
      id: `quiz-q-def-${card.id}-${qIndex}`,
      cardId: card.id,
      type: 'DEFINITIONS',
      frenchWord: frenchWordClean,
      prompt: `Quelle est la définition littéraire exacte du terme « ${frenchWordClean} » ?`,
      promptLanguage: 'fr',
      options: finalOptions,
      correctAnswerIndex,
      categoryLabel: 'التعريف الأدبي والمعجمي (Définitions)',
      explanation: `التعريف الأدبي الدقيق لمصطلح « ${frenchWordClean} » هو: « ${correctDef} ».`,
      exampleExcerpt: card.exampleContextFrench,
      relatedCard: card,
    });
  });

  return questions;
}
