import { BookId, FlashcardWord, TranslationResponse, VocabQuizQuestion, VocabQuizType, VocabCategory } from '../types';
import { COMPREHENSIVE_CATEGORIZED_VOCAB } from './categorizedVocabData';
import { generateInstantTranslation } from './translationsDict';
import { cleanDirectArabicTranslation } from './translationCache';

const STORAGE_KEY = 'moroccan_1bac_flashcards_v1';
const VOCAB_UPDATE_EVENT = 'moroccan_1bac_vocab_updated';

// Helper to infer grammatical / study category from part of speech
export function inferCategory(card: Partial<FlashcardWord>): 'verb' | 'adverb' | 'term' | 'character' | string {
  if (card.category) return card.category;
  const pos = (card.partOfSpeech || '').toLowerCase();
  const word = (card.frenchWord || '').toLowerCase();

  if (pos.includes('verbe') || pos.includes('verb') || pos.includes('فعل')) {
    return 'verb';
  }
  if (pos.includes('adverbe') || pos.includes('adverb') || pos.includes('ظرف') || pos.includes('locution adverbiale')) {
    return 'adverb';
  }
  if (
    pos.includes('personnage') ||
    pos.includes('nom propre') ||
    pos.includes('héro') ||
    pos.includes('شخصية') ||
    card.characterRoleArabic ||
    ['sidi mohammed', 'lalla zoubida', 'maâlem abdeslem', 'maalem abdeslem', 'rahma', 'zineb', 'antigone', 'créon', 'creon', 'ismène', 'ismene', 'hémon', 'hemon', 'le condamné', 'le friauche', 'marie'].some((c) => word.includes(c))
  ) {
    return 'character';
  }
  return 'term';
}

// Known French synonym database for 1st Bac works
const KNOWN_SYNONYMS: Record<string, string[]> = {
  // La Boîte à Merveilles
  solitude: ['isolement', 'retrait', 'abandon', 'solitude morale'],
  boîte: ['coffret', 'écrin', 'boîtier', 'cassette'],
  merveilles: ['prodiges', 'splendeurs', 'miracles', 'enchantements'],
  chouafa: ['voyante', 'devineresse', 'sorcière', 'médium'],
  msid: ['école coranique', 'kuttab', 'médersa traditionnelle'],
  fqih: ["maître d'école", 'instructeur', 'érudit coranique'],
  tisserand: ['artisan textile', 'filateur', 'tisseur'],
  haïk: ['voile traditionnel', 'drapé blanc', 'manteau ample'],
  somnoler: ['sommeiller', 'dormiter', "s'assoupir", 'roupiller'],
  babouches: ['pantoufles en cuir', 'chaussures traditionnelles'],
  achoura: ['fête religieuse', 'célébration du 10e jour de Muharram'],
  délice: ['plaisir intense', 'volupté', 'joie profonde', 'extase'],
  angoisse: ['anxiété', 'tourment', 'détresse', 'terreur'],
  moisson: ['récolte', 'fauchaison', 'moissonnage'],
  bijoux: ['joyaux', 'parures', 'joyaux précieux', 'bracelets'],
  ruelle: ['venelle', 'derb', 'impasse', 'sentier'],
  foule: ['multitude', 'cohue', 'rassemblement', 'affluence'],
  trésor: ['richesse secrète', 'butin précieux', 'relique'],
  driss: ['apprenti', 'aide-artisan', 'compagnon'],
  querelle: ['dispute', 'altercation', 'brouille', 'conflit'],
  baquet: ['cuvette', 'récipient', 'bassine'],
  terrasse: ['toit-terrasse', 'plateforme', 'esplanade'],
  amitié: ['camaraderie', 'fraternité', 'affection', 'sympathie'],
  souvenir: ['réminiscence', 'mémoire', 'rappel', 'évocation'],

  // Antigone
  tragédie: ['drame fatal', 'catastrophe inéluctable', 'malheur suprême'],
  créon: ['roi de Thèbes', 'souverain autoritaire', 'monarque'],
  antigone: ['héroïne rebelle', 'insoumise', 'résistante'],
  hémon: ['fiancé loyal', 'prince héritier', 'amant dévoué'],
  ismène: ['sœur aînée', 'timorée', 'prudente'],
  cadavre: ['dépouille', 'corps sans vie', 'macchabée'],
  édit: ['décret royal', 'loi suprême', 'ordonnance'],
  devoir: ['obligation morale', 'impératif sacré', 'engagement'],
  bonheur: ['quiétude ordinaire', 'félicité bourgeoise', 'bien-être'],
  chœur: ['voix du destin', 'narrateur omniscient', 'commentateur'],
  châtiment: ['punition capitale', 'supplice', 'peine infligée'],
  orgueil: ['fierté inflexible', 'dignité absolue', 'arrogance'],
  dilemme: ['choix déchirant', 'impasse tragique', 'alternative'],
  sépulture: ['inhumation', 'enterrement', 'tombe sacrée'],
  loi: ['règle', 'commandement', 'législation', 'décret'],
  destin: ['fatalité', 'sort inévitable', 'fortune'],
  révolte: ['insoumission', 'rébellion', 'contestation', 'sédition'],
  enfance: ['jeunesse innocente', 'âge tendre', 'premières années'],

  // Le Dernier Jour d'un Condamné
  échafaud: ['guillotine', 'bois de justice', 'estrade fatale'],
  cachot: ['cellule obscure', 'geôle', 'oubliette', 'prison'],
  grâce: ['pardon royal', 'clémence suprême', 'amnistie'],
  pourvoi: ['recours juridique', 'appel en cassation', 'requête'],
  supplice: ['martyre', 'torture', 'calvaire', 'agonie'],
  argot: ['jargon des forçats', 'langue verte', 'parler des bagnards'],
  bourreau: ['exécuteur des hautes œuvres', 'tortionnaire', 'exécuteur'],
  fatalité: ['destinée implacable', 'sort inéluctable', 'inéluctabilité'],
  rédemption: ['salut spirituel', 'rachat moral', 'repentir'],
  bagnard: ['forçat', 'galérien', 'prisonnier de Bicêtre'],
  monologue: ['soliloque', 'discours intérieur', 'pensée intime'],
  terreur: ['effroi glaçant', 'épouvante', 'panique'],
  honte: ['ignominie', 'opprobre', 'déshonneur', 'infamie'],
  grève: ["place de l'Hôtel de Ville", 'lieu du supplice public'],
  bicêtre: ['prison des condamnés', 'maison de force', 'hospice-prison']
};

export const PRESET_VOCABULARY: FlashcardWord[] = [
  // 1. La Boîte à Merveilles
  {
    id: 'lbm-solitude',
    bookId: 'la_boite_a_merveilles',
    frenchWord: 'Solitude',
    arabicMeaning: 'عُزْلَة / وَحْدَة',
    partOfSpeech: 'Nom féminin',
    contextualMeaning: 'التيمة الوجودية الكبرى التي يفتتح ويختتم بها سيدي محمد روايته («Moi, je ne dors pas. Je songe à ma solitude»).',
    synonyms: ['Isolement', 'Retrait', 'Abandon intime', 'Solitude morale'],
    dictionaryDefinitions: [
      'État d’une personne qui est seule ou isolée du monde extérieur.',
      'Sentiment intime d’incompréhension face au monde des adultes.'
    ],
    alternativeMeanings: ['انفراد باطني', 'وحشة نفسية', 'اغتراب عن عالم الكبار'],
    exampleContextFrench: 'Le soir, quand tous dorment, les riches dans leurs chaudes couvertures... moi, je ne dors pas. Je songe à ma solitude.',
    exampleContextArabic: 'في المساء، حين ينام الجميع، يخلد الأغنياء إلى أغطيتهم الدافئة... أما أنا فلا يغشاني النوم، بل أفكر في عزلتي.',
    pageNumber: 1,
    addedAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    masteryLevel: 'mastered',
    reviewCount: 6,
    correctCount: 6,
    incorrectCount: 0,
    lastReviewedAt: Date.now() - 1000 * 60 * 60 * 12
  },
  {
    id: 'lbm-boite',
    bookId: 'la_boite_a_merveilles',
    frenchWord: 'Boîte à merveilles',
    arabicMeaning: 'عُلْبَة العَجَائِب',
    partOfSpeech: 'Nom composé',
    contextualMeaning: 'العلبة القصديرية السحرية التي يودع فيها الطفل أزراره ومساميره وحبات زجاجه لتصبح أصدقاءه الأوفياء.',
    synonyms: ['Coffret enchanté', 'Écrin secret', 'Boîtier magique'],
    dictionaryDefinitions: [
      'Petit contenant en fer-blanc servant à conserver des objets hétéroclites.',
      'Symbole du refuge poétique et de l’imaginaire de l’enfant narrateur.'
    ],
    alternativeMeanings: ['صندوق الأسرار', 'مستودع الكنوز الخيالية'],
    exampleContextFrench: 'Ma boîte à merveilles me sauvait de la détresse ; elle contenait des boules de verre, des boutons de cuivre et des cabochons.',
    exampleContextArabic: 'كانت علبة عجائبي تنقذني من الضياع؛ احتوت على كريات زجاجية وأزرار نحاسية ومسامير مصقولة.',
    pageNumber: 2,
    addedAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
    masteryLevel: 'mastered',
    reviewCount: 4,
    correctCount: 4,
    incorrectCount: 0,
    lastReviewedAt: Date.now() - 1000 * 60 * 60 * 20
  },
  {
    id: 'lbm-chouafa',
    bookId: 'la_boite_a_merveilles',
    frenchWord: 'Chouafa',
    arabicMeaning: 'الشَّوَّافَة (العرافة)',
    partOfSpeech: 'Nom féminin',
    contextualMeaning: 'كنزة، العرافة التي تسكن الطابق الأرضي لدار الشوافة وتقيم طقوس الزار واستحضار الجان شهرياً.',
    synonyms: ['Voyante', 'Devineresse', 'Sorcière populaire', 'Médium'],
    dictionaryDefinitions: [
      'Femme prétendant prédire l’avenir par des pratiques occultes ou de la divination.',
      'Figure emblématique des croyances populaires dans le Fès traditionnel.'
    ],
    alternativeMeanings: ['الكاهنة الشعبية', 'الوسيطة الروحية'],
    exampleContextFrench: 'Au rez-de-chaussée habitait une voyante de grand renom : la Chouafa, tante Kanza.',
    exampleContextArabic: 'في الطابق الأرضي كانت تقطن عرافة ذات صيت ذائع: الشوافة، العمة كنزة.',
    pageNumber: 3,
    addedAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    masteryLevel: 'learning',
    reviewCount: 3,
    correctCount: 2,
    incorrectCount: 1
  },
  {
    id: 'lbm-msid',
    bookId: 'la_boite_a_merveilles',
    frenchWord: 'Msid',
    arabicMeaning: 'المَسِيد (الكُتَّاب القرآني)',
    partOfSpeech: 'Nom masculin',
    contextualMeaning: 'المدرسة القرآنية التقليدية بحومة القلقليين حيث يعاني الطفل قسوة الحفظ وعصا الفقيه.',
    synonyms: ['École coranique', 'Kuttab', 'Médersa pour enfants'],
    dictionaryDefinitions: [
      'Lieu traditionnel d’enseignement coranique et d’apprentissage de l’alphabet arabe.',
      'Espace de discipline rigide et de récitation collective.'
    ],
    alternativeMeanings: ['كُتّاب تحفيظ القرآن', 'المدرسة العتيقة'],
    exampleContextFrench: 'Le Msid était une salle étouffante où résonnaient les voix suraiguës des écoliers sous le regard sévère du maître.',
    exampleContextArabic: 'كان المسيد قاعة خانقة تتردد فيها أصوات التلاميذ الحادة تحت النظرات الصارمة للمعلم.',
    pageNumber: 5,
    addedAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    masteryLevel: 'learning',
    reviewCount: 2,
    correctCount: 2,
    incorrectCount: 0
  },
  {
    id: 'lbm-délice',
    bookId: 'la_boite_a_merveilles',
    frenchWord: 'Délice',
    arabicMeaning: 'لَذَّة / مَبْعَث غِبْطَة',
    partOfSpeech: 'Nom masculin',
    contextualMeaning: 'الفرحة الباطنية الطافحة التي يختبرها سيدي محمد عند خلوته مع أشيائه الخاصة وتخيل عوالمه الأسطورية.',
    synonyms: ['Plaisir extrême', 'Volupté', 'Joie profonde', 'Enchantement'],
    dictionaryDefinitions: [
      'Plaisir très vif, sensualité ou satisfaction spirituelle raffinée.',
      'Sensation de bonheur pur et transcendant.'
    ],
    alternativeMeanings: ['غبطة نقية', 'نعيم روحي'],
    exampleContextFrench: 'C’était pour moi un délice indicible de contempler ces perles de verre à la lumière de la chandelle.',
    exampleContextArabic: 'كان بالنسبة لي متعة وغبطة لا توصف أن أتأمل حبات الزجاج تلك على ضوء الشمعة.',
    pageNumber: 9,
    addedAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    masteryLevel: 'new',
    reviewCount: 0,
    correctCount: 0,
    incorrectCount: 0
  },

  // 2. Antigone
  {
    id: 'ant-tragedie',
    bookId: 'antigone',
    frenchWord: 'Tragédie',
    arabicMeaning: 'تَرَاجِيدْيَا / مَأْسَاة',
    partOfSpeech: 'Nom féminin',
    contextualMeaning: 'الجنس المسرحي المأساوي الحتمي الذي لا أمل فيه للنجاة وتدور تروسه بدقة نظيفة («C’est propre, la tragédie. C’est reposant»).',
    synonyms: ['Drame fatal', 'Catastrophe inéluctable', 'Destin implacable'],
    dictionaryDefinitions: [
      'Pièce de théâtre où les héros luttent vainement contre une destinée fatale.',
      'Action dramatique marquée par la dignité du héros et l’absence totale de compromis.'
    ],
    alternativeMeanings: ['فاجعة قدرية', 'عمل مسرحي مأساوي حتمي'],
    exampleContextFrench: 'C’est propre, la tragédie. Ça roule tout seul depuis le commencement des temps. C’est reposant.',
    exampleContextArabic: 'التراجيديا نظيفة ومريحة، تدور تروسها من تلقاء نفسها منذ فجر التاريخ.',
    pageNumber: 45,
    addedAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
    masteryLevel: 'mastered',
    reviewCount: 5,
    correctCount: 5,
    incorrectCount: 0,
    lastReviewedAt: Date.now() - 1000 * 60 * 60 * 18
  },
  {
    id: 'ant-edit',
    bookId: 'antigone',
    frenchWord: 'Édit',
    arabicMeaning: 'مَرْسُوم مَلَكِيّ / قَرَار',
    partOfSpeech: 'Nom masculin',
    contextualMeaning: 'قانون الملك كريون الصارم بمنع دفن جثة بولينيس وتركه فريسة للجوارح والكلاب تحت طائلة الموت.',
    synonyms: ['Décret royal', 'Ordonnance souveraine', 'Loi politique'],
    dictionaryDefinitions: [
      'Acte législatif émanant de l’autorité royale qui s’impose à tous.',
      'Symbole de la loi des hommes et de la raison d’État.'
    ],
    alternativeMeanings: ['أمر ملكي واجب النفاذ', 'قانون وضعي'],
    exampleContextFrench: 'Créon a fait afficher son édit : quiconque osera rendre les devoirs funèbres au traître sera puni de mort.',
    exampleContextArabic: 'أصدر كريون مرسومه الملكي: كل من يجرؤ على أداء طقوس الدفن للخائن سيعاقب بالإعدام.',
    pageNumber: 12,
    addedAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    masteryLevel: 'learning',
    reviewCount: 3,
    correctCount: 3,
    incorrectCount: 0
  },
  {
    id: 'ant-sepulture',
    bookId: 'antigone',
    frenchWord: 'Sépulture',
    arabicMeaning: 'مَثْوَى / مَرَاسِم دَفْن',
    partOfSpeech: 'Nom féminin',
    contextualMeaning: 'الواجب الديني والأخلاقي المقدس بمواراة جثمان الأخ التراب، وهو الدافع المحرك لتمرد أنتيجون.',
    synonyms: ['Inhumation', 'Enterrement sacré', 'Tombe', 'Funérailles'],
    dictionaryDefinitions: [
      'Action d’ensevelir un mort selon les rites sacrés.',
      'Lieu où repose un défunt honoré par sa famille.'
    ],
    alternativeMeanings: ['مواراة الثرى', 'دفن شرعي مقدس'],
    exampleContextFrench: 'Mon frère Polynice a droit à une sépulture décente, et je le recouvrirai de terre de mes propres mains.',
    exampleContextArabic: 'أخي بولينيس له الحق في مدفن كريم، وسأغطيه بالتراب بيدي هاتين.',
    pageNumber: 18,
    addedAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    masteryLevel: 'learning',
    reviewCount: 2,
    correctCount: 1,
    incorrectCount: 1
  },
  {
    id: 'ant-bonheur',
    bookId: 'antigone',
    frenchWord: 'Bonheur (sale petit)',
    arabicMeaning: 'سَعَادَة (مُبْتَذَلَة ورَتِيبَة)',
    partOfSpeech: 'Expression / Nom masculin',
    contextualMeaning: 'مفهوم السعادة الرتيبة القائمة على الخضوع والتنازلات التي عرضها كريون ورفضتها أنتيجون بازدراء.',
    synonyms: ['Félicité médiocre', 'Conformisme', 'Compromis bourgeois'],
    dictionaryDefinitions: [
      'État de satisfaction matérielle et tranquille fondé sur l’acceptation de la réalité.',
      'Dans Antigone : symbole du renoncement à l’idéal et de la soumission à la vieillesse.'
    ],
    alternativeMeanings: ['عيش رتيب قائم على المساومة', 'سعادة مستسلمة'],
    exampleContextFrench: 'Quel sera-t-il, mon bonheur ? Quelle pauvre fille serai-je, après avoir dit oui à toutes vos bassesses ?',
    exampleContextArabic: 'كيف ستكون سعادتي تلك؟ وأي فتاة بائسة سأكون بعد أن أقول نعم لكل دناءاتكم؟',
    pageNumber: 82,
    addedAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
    masteryLevel: 'new',
    reviewCount: 1,
    correctCount: 1,
    incorrectCount: 0
  },

  // 3. Le Dernier Jour d'un Condamné
  {
    id: 'cnd-echafaud',
    bookId: 'le_dernier_jour_dun_condamne',
    frenchWord: 'Échafaud',
    arabicMeaning: 'مِنَصَّة الإِعْدَام (المِقْصَلَة)',
    partOfSpeech: 'Nom masculin',
    contextualMeaning: 'المنصة الخشبية التي تنصب في ساحة الإعدام بباريس (Place de Grève) لقطع رؤوس المحكومين.',
    synonyms: ['Guillotine', 'Estrade fatale', 'Bois de justice', 'Potence'],
    dictionaryDefinitions: [
      'Estrade en charpente dressée pour l’exécution publique des condamnés à mort.',
      'Symbole suprême de la barbarie judiciaire dénoncée par Victor Hugo.'
    ],
    alternativeMeanings: ['مقصلة الجزاء البشري', 'منصة النحر القانوني'],
    exampleContextFrench: 'À quatre heures, ils m’amèneront sur l’échafaud dressé au milieu de la place de Grève devant la foule avide.',
    exampleContextArabic: 'في تمام الرابعة، سيقتادونني إلى منصة الإعدام المنصوبة وسط ساحة الإعدام أمام الحشود المتعطشة.',
    pageNumber: 48,
    addedAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
    masteryLevel: 'mastered',
    reviewCount: 4,
    correctCount: 4,
    incorrectCount: 0,
    lastReviewedAt: Date.now() - 1000 * 60 * 60 * 16
  },
  {
    id: 'cnd-cachot',
    bookId: 'le_dernier_jour_dun_condamne',
    frenchWord: 'Cachot',
    arabicMeaning: 'زِنْزَانَة مُظْلِمَة / سِجْن ضَيِّق',
    partOfSpeech: 'Nom masculin',
    contextualMeaning: 'الخلية الضيقة الرطبة في سجن بيسيتر حيث يعاني المحكوم عذابات العزلة وهلاوس الموت الوشيك.',
    synonyms: ['Cellule obscure', 'Geôle', 'Oubliette', 'Bagne individuel'],
    dictionaryDefinitions: [
      'Cellule étroite et obscure d’une prison réservée aux peines sévères.',
      'Espace d’étouffement psychologique et de supplice moral.'
    ],
    alternativeMeanings: ['مطبق سري', 'غرفة الحبس الانفرادي'],
    exampleContextFrench: 'Dans ce cachot humide de Bicêtre, les murs suintent la détresse et les inscriptions laissées par d’anciens suppliciés.',
    exampleContextArabic: 'في هذه الزنزانة الرطبة بسجن بيسيتر، ترشح الجدران بالبؤس والنقوش التي خطها محكومون سابقون.',
    pageNumber: 6,
    addedAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    masteryLevel: 'learning',
    reviewCount: 2,
    correctCount: 2,
    incorrectCount: 0
  },
  {
    id: 'cnd-pourvoi',
    bookId: 'le_dernier_jour_dun_condamne',
    frenchWord: 'Pourvoi en cassation',
    arabicMeaning: 'طَعْنٌ بالنَّقْض / اسْتِئْنَاف قَانُونِيّ',
    partOfSpeech: 'Terme juridique',
    contextualMeaning: 'المحاولة القانونية الأخيرة لتعليق حكم الإعدام والتشبث ببريق أمل زائف قبل رفضه الحتمي.',
    synonyms: ['Recours juridique', 'Appel en cassation', 'Requête judiciaire'],
    dictionaryDefinitions: [
      'Recours devant la juridiction suprême pour faire annuler un jugement non conforme au droit.',
      'Période d’angoisse suspendue où le condamné compte les jours de sursis.'
    ],
    alternativeMeanings: ['التماس نقض الحكم', 'دعوى الاستئناف النهائي'],
    exampleContextFrench: 'Mon pourvoi a été rejeté ; il n’y a plus d’illusion ni de répit entre la prison et la mort.',
    exampleContextArabic: 'تم رفض طعني بالنقض؛ لم يعد هناك وهم ولا مهلة بين أسوار السجن ومقصلة الموت.',
    pageNumber: 22,
    addedAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
    masteryLevel: 'new',
    reviewCount: 1,
    correctCount: 1,
    incorrectCount: 0
  },
  {
    id: 'cnd-argot',
    bookId: 'le_dernier_jour_dun_condamne',
    frenchWord: 'Argot',
    arabicMeaning: 'لُغَة الأَرْغُو (لُغَة السُّجُون والمُجْرِمِينَ)',
    partOfSpeech: 'Nom masculin',
    contextualMeaning: 'لغة السجون واللصوص الخاصة التي وصفها هوغو بأنها تشبه «لعاب حلزون على وردة».',
    synonyms: ['Jargon des forçats', 'Langue secrète', 'Parler des bagnards'],
    dictionaryDefinitions: [
      'Vocabulaire particulier aux malfaiteurs et prisonniers pour dissimuler leur pensée.',
      'Langage difforme né de la misère et de la promiscuité carcérale.'
    ],
    alternativeMeanings: ['رطانة المساجين', 'لسان المحكومين السري'],
    exampleContextFrench: 'Cette langue hideuse, l’argot des prisons, ressemble à une hideuse excroissance née dans l’ombre des cachots.',
    exampleContextArabic: 'تلك اللغة البشعة، أرغو السجون، تشبه نتوءاً قبيحاً نما في عتمة الزنازين.',
    pageNumber: 19,
    addedAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
    masteryLevel: 'new',
    reviewCount: 0,
    correctCount: 0,
    incorrectCount: 0
  }
];

// Helper to normalize French words for matching
export function normalizeFrenchWord(word: string): string {
  return word
    .toLowerCase()
    .trim()
    .replace(/^[«"'\s]+|[»"'\s.,;!?:()]+$/g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Resolves accurate Arabic translation, rich literary context, and synonyms
 * for ANY highlighted text from the novels.
 */
export function resolveHighlightTranslationAndContext(
  text: string,
  pageNumber: number = 1,
  bookId: BookId = 'la_boite_a_merveilles'
): {
  arabicMeaning: string;
  contextualMeaning: string;
  definitionArabic: string;
  synonyms: string[];
  partOfSpeech: string;
} {
  const clean = text.trim();
  const lower = clean.toLowerCase().replace(/^[«"'\s]+|[»"'\s.,;!?:()]+$/g, '');

  // 1. Check known contextual expressions from La Boîte à Merveilles
  if (lower.includes('ces deux jours et demi') || lower === 'deux jours et demi' || lower.includes('deux jours et demi')) {
    return {
      arabicMeaning: 'هَذَيْنِ اليَوْمَيْنِ وَالنِّصْف',
      contextualMeaning: `إشارة إلى الأيام التي قضاها الطفل سيدي محمد مستريحاً بالبيت بعد وعكته الصحية وزيارة ضريح سيدي علي بوغالب معفياً من مشاق المسيد (أو مدة غياب والده المعلم عبد السلام للعمل في الحصاد).`,
      definitionArabic: `المدة الزمنية التي استمتع فيها الطفل بالهدوء والراحة في كنف أمه وملاذ علبته السحرية.`,
      synonyms: ['Une période de répit', 'Un court délai', 'Un intervalle de repos'],
      partOfSpeech: 'تعبير زمني سياقي (Locution temporelle)'
    };
  }

  if (lower.includes('moi, je ne dors pas') || lower.includes('moi je ne dors pas') || lower === 'je ne dors pas') {
    return {
      arabicMeaning: 'أَمَّا أَنَا فَلَا يَنَالُنِي النَّوْم',
      contextualMeaning: `الجملة الافتتاحية الشهيرة للرواية الدالة على يقظة سيدي محمد وتأمله الباطني في عزلته بينما يستغرق الأغنياء والفقراء في النوم.`,
      definitionArabic: `تعبير عن اليقظة الوجدانية والسهر في عتمة الليل للتأمل في شؤون الذات والذكريات.`,
      synonyms: ['Veiller la nuit', 'Rester éveillé', 'Méditer dans l’insomnie'],
      partOfSpeech: 'جملة سردية افتتاحية'
    };
  }

  if (lower.includes('je songe à ma solitude') || lower.includes('songe à ma solitude')) {
    return {
      arabicMeaning: 'أَسْتَغْرِقُ فِي تَأَمُّلِ عُزْلَتِي وَوَحْدَتِي',
      contextualMeaning: `المفتتح الرمزي للرواية الذي يجسد العزلة النفسية والروحية العميقة للطفل الراوي سيدي محمد وإحساسه بثقلها الرازح.`,
      definitionArabic: `التأمل الشاعري الحزين في الانفراد عن الآخرين والاغتراب عن عالم الكبار.`,
      synonyms: ['Méditer sur son isolement', 'Penser à sa solitude', 'Éprouver sa solitude'],
      partOfSpeech: 'تعبير أدبي رمزي'
    };
  }

  if (lower.includes('ma solitude ne date pas') || lower.includes('ne date pas d’hier') || lower.includes('ne date pas d\'hier')) {
    return {
      arabicMeaning: 'عُزْلَتِي لَيْسَتْ وَلِيدَةَ الأَمْس',
      contextualMeaning: `تأكيد السارد على أن شعوره بالغربة والانفراد النفسي ليس طارئاً بل هو إحساس وجودي متجذر منذ بواكير طفولته الأولى.`,
      definitionArabic: `الدلالة على قدم الشعور بالوحدة واستمراريته كسمة أساسية لهوية الطفل وسلوكه.`,
      synonyms: ['Une solitude ancienne', 'Un isolement enraciné'],
      partOfSpeech: 'تعبير استرجاعي (Récit rétrospectif)'
    };
  }

  if (lower.includes('la boîte à merveilles') || lower.includes('ma boîte à merveilles') || lower.includes('boite a merveilles')) {
    return {
      arabicMeaning: 'عُلْبَةُ العَجَائِبِ وَسِحْرِ الأَسْرَار',
      contextualMeaning: `الملاذ السحري والرمزي للطفل سيدي محمد؛ صندوق القصدير الذي يضم أزراراً ومسامير وزجاجاً ملوناً يحاوره ليطرد وحشة العزلة ورتابة الواقع.`,
      definitionArabic: `الوعاء الرمزي للطفولة والخيال الخصب المستقل عن عالم الكبار.`,
      synonyms: ['Le coffret enchanté', 'Le refuge secret', 'L’asile imaginaire'],
      partOfSpeech: 'اسم مركب رمزي (Symbole central)'
    };
  }

  if (lower.includes('dar chouafa') || lower.includes('maison de la voyante') || lower === 'chouafa') {
    return {
      arabicMeaning: 'دَارُ الشَّوَّافَة (بَيْتُ العَرَّافَة)',
      contextualMeaning: `المنزل العتيق بحومة القلقليين بفاس حيث تسكن العرافة كنزة في الطابق الأرضي وتجري طقوس الزار واستحضار الجان بحضور البخور وموسيقى گناوة.`,
      definitionArabic: `الفضاء السكني التراثي المشترك الذي تدور فيه أحداث الرواية وتتشابك فيه علاقات الجيران.`,
      synonyms: ['La demeure de la voyante', 'L’espace habité', 'La maison collective'],
      partOfSpeech: 'اسم مكان تراثي'
    };
  }

  if (lower.includes('bain maure') || lower === 'le bain maure') {
    return {
      arabicMeaning: 'الحَمَّامُ المَغْرِبِيُّ التَّقْلِيدِيّ',
      contextualMeaning: `الفضاء الشعبي الرطب والصاخب الذي كانت تعتبره الأم لالة زبيدة متنفساً للثرثرة بينما رآه الطفل كابوساً مخيفاً يشبه جحيم جهنم.`,
      definitionArabic: `الحمام الشعبي التقليدي الذي كان يثير اشمئزاز وخوف سيدي محمد في طفولته.`,
      synonyms: ['Le hammam traditionnel', 'L’étuve publique'],
      partOfSpeech: 'اسم فضاء تقليدي'
    };
  }

  if (lower.includes('msid') || lower.includes('école coranique') || lower === 'le msid') {
    return {
      arabicMeaning: 'المَسِيد (الكُتَّابُ القُرْآنِيّ)',
      contextualMeaning: `المدرسة القرآنية التقليدية بفاس حيث يحفظ الأطفال القرآن تحت وطأة الصرامة وعصا الفقيه.`,
      definitionArabic: `الفضاء التعليمي التقليدي والتربوي الذي كان يمثل كابوساً يومياً للطفل سيدي محمد.`,
      synonyms: ['L’école coranique', 'Le kuttab', 'La médersa'],
      partOfSpeech: 'اسم مكان ديني تعليمي'
    };
  }

  if (lower.includes('fqih') || lower.includes('le fqih') || lower.includes('baguette de cognassier')) {
    return {
      arabicMeaning: 'الفَقِيه (مُعَلِّمُ المَسِيد)',
      contextualMeaning: `المعلم الصارم ذو اللحية الكثة وعصا السفرجل الذي يرهب التلاميذ ويشرف على تلاوة الألواح.`,
      definitionArabic: `رمز السلطة التربوية التقليدية والمهابة في فاس القديمة.`,
      synonyms: ['Le maître d’école', 'L’instructeur coranique', 'Le précepteur'],
      partOfSpeech: 'شخصية ودور تربوي'
    };
  }

  if (lower.includes('tisserand') || lower.includes('maâlem abdeslem') || lower.includes('maalem abdeslem')) {
    return {
      arabicMeaning: 'المُعَلِّمُ عَبْدُ السَّلَام (الحَائِكُ النَّسَّاج)',
      contextualMeaning: `والد سيدي محمد؛ رجل صامت ووقور وشريف يشتغل حائكاً للأقمشة والجلاليب، يمثل الأب المثالي وركيزة الأسرة.`,
      definitionArabic: `رمز الكدح والشرف الأسري في الرواية.`,
      synonyms: ['L’artisan textile', 'Le tisseur de haïks', 'Le père vertueux'],
      partOfSpeech: 'شخصية رئيسية'
    };
  }

  if (lower.includes('lalla zoubida') || lower === 'zoubida') {
    return {
      arabicMeaning: 'لَالَّة زُبَيْدَة (أُمُّ السَّارِد)',
      contextualMeaning: `والدة سيدي محمد؛ شريفة حسيبة تتميز بفصاحة اللسان ورواية الحكايات والثرثرة مع الجارات والشكوى من نوائب الدهر.`,
      definitionArabic: `الأم الفاسية التقليدية ومحور الحياة الأسرية والاجتماعية في دار الشوافة.`,
      synonyms: ['La mère de Sidi Mohammed', 'La conteuse vive', 'La maîtresse de maison'],
      partOfSpeech: 'شخصية رئيسية'
    };
  }

  if (lower.includes('lalla aïcha') || lower.includes('lalla aicha')) {
    return {
      arabicMeaning: 'لَالَّة عَائِشَة (الصَّدِيقَةُ الحَمِيمَة)',
      contextualMeaning: `الصديقة الوفية للأم وزوجة مولاي العربي؛ امرأة صابرة ضحت بذهبها وأثاثها لإنقاذ ورشة زوجها بعد خيانة شريكه عبد القادر.`,
      definitionArabic: `رمز الوفاء والتضحية الأنثوية وصدمة الزواج الثاني.`,
      synonyms: ['L’amie fidèle', 'L’ancienne voisine dévouée'],
      partOfSpeech: 'شخصية مساعدة'
    };
  }

  if (lower.includes('sidi el arafi') || lower.includes('el arafi')) {
    return {
      arabicMeaning: 'سِيدِي العَرَافِي (الشَّيْخُ الضَّرِيرُ الحَكِيم)',
      contextualMeaning: `الولي الصالح والشيخ الكفيف الحكيم الذي زارته لالة زبيدة ولالة عائشة طلباً للبشارة والتخفيف من كربتهما.`,
      definitionArabic: `رمز الحكمة الروحية والصفاء النفسي في الرواية.`,
      synonyms: ['Le sage aveugle', 'Le voyant pieux', 'Le devin spirituel'],
      partOfSpeech: 'شخصية روحية'
    };
  }

  if (lower.includes('achoura') || lower.includes('fête d’achoura') || lower.includes('fete d\'achoura')) {
    return {
      arabicMeaning: 'عِيدُ عَاشُورَاء (يَوْمُ البَهْجَةِ وَالاحْتِفَال)',
      contextualMeaning: `مناسبة الفرح الكبرى وسراج النور والملابس الجديدة وممارسة الألعاب وقرع الطبول ومراجعة القرآن في أجواء استثنائية.`,
      definitionArabic: `العيد الديني التراثي البهيج الذي كسر رتابة حياة الطفل سيدي محمد.`,
      synonyms: ['La grande fête religieuse', 'Le jour des réjouissances'],
      partOfSpeech: 'مناسبة دينية تراثية'
    };
  }

  // 2. Check Antigone contextual expressions
  if (lower.includes('antigone') || lower === 'antigone') {
    return {
      arabicMeaning: 'أَنْتِيجُون (البَطَلَةُ التَّرَاجِيدِيَّةُ الثَّائِرَة)',
      contextualMeaning: `الفتاة الشابة المتمردة التي ترفض المساومة على مبادئها وتصر على دفن جثة أخيها بولينيس احتراماً للواجب الديني والأخوي متحدية مرسوم خالها الملك كريون حتى الموت.`,
      definitionArabic: `تجسيد الشجاعة المطلقة والنقاء الطفولي الرافض لنفاق الكبار وقوانينهم البشعة.`,
      synonyms: ['L’héroïne révoltée', 'L’insoumise tragique', 'La rebelle absolue'],
      partOfSpeech: 'البطلة التراجيدية المحورية'
    };
  }

  if (lower.includes('créon') || lower === 'creon') {
    return {
      arabicMeaning: 'كِرْيُون (مَلِكُ طِيبَةَ وَصَوْتُ سُلْطَةِ الدَّوْلَة)',
      contextualMeaning: `خال أنتيجون والحاكم العملي الصارم الذي قبل تولي الحكم كواجب إداري ويحاول عبثاً إقناع أنتيجون بالتراجع لإنقاذها من الإعدام.`,
      definitionArabic: `رمز سلطة الدولة الصارمة، البراغماتية، والمسؤولية السياسية التي تضحي بالعواطف من أجل استقرار النظام.`,
      synonyms: ['Le roi de Thèbes', 'Le souverain autoritaire', 'L’homme d’État pragmatique'],
      partOfSpeech: 'الشخصية المقابلة (Antagoniste)'
    };
  }

  if (lower.includes('ismène') || lower === 'ismene') {
    return {
      arabicMeaning: 'إِسْمِين (الأُخْتُ الكُبْرَى الحَذِرَة)',
      contextualMeaning: `أخت أنتيجون الجميلة والمترددة التي تدرك واجب الدفن لكنها تخاف من الموت وبطش الحراس والقانون في بداية المسرحية.`,
      definitionArabic: `رمز الصوت العقلاني الخائف والطبيعة البشرية المترددة أمام الموت.`,
      synonyms: ['La sœur aînée', 'La prudente', 'La timorée'],
      partOfSpeech: 'شخصية ثانوية معارضة'
    };
  }

  if (lower.includes('hémon') || lower === 'hemon') {
    return {
      arabicMeaning: 'هِيمُون (ابْنُ المَلِكِ وَخَطِيبُ أَنْتِيجُون الوَفِيّ)',
      contextualMeaning: `ابن كريون وخطيب أنتيجون الذي يعشقها بإخلاص ويدافع عن موقفها أمام والده ثم ينهي حياته منتحراً إلى جانب جثتها في المقبرة الصخرية.`,
      definitionArabic: `رمز الحب الصادق والولاء المطلق ورفض الحياة بدون الحبيبة.`,
      synonyms: ['Le fiancé loyal', 'Le prince dévoué', 'L’amant tragique'],
      partOfSpeech: 'شخصية رئيسية'
    };
  }

  if (lower.includes('sépulture') || lower.includes('enterrer') || lower.includes('cadavre de polynice')) {
    return {
      arabicMeaning: 'دَفْنُ الجُثْمَانِ وَإِكْرَامُ المَيِّت',
      contextualMeaning: `الواجب الديني والأخلاقي المقدس الذي تضحي أنتيجون بحياتها من أجله، لستر جسد أخيها بولينيس المتروك للوحوش بقرار من كريون.`,
      definitionArabic: `الطقس الديني الجنائزي المفروض في الشرائع الإلهية لإكرام الموتى وتأمين راحة أرواحهم.`,
      synonyms: ['L’inhumation sacrée', 'L’enterrement rituel', 'Le devoir funèbre'],
      partOfSpeech: 'مفهوم وقضية تراجيدية مركزية'
    };
  }

  // 3. Check Le Dernier Jour d'un Condamné contextual expressions
  if (lower.includes('condamné à mort') || lower.includes('condamne a mort')) {
    return {
      arabicMeaning: 'مَحْكُومٌ عَلَيْهِ بِالإِعْدَام (المُعَانَاةُ وَصَوْتُ المَظْلُوم)',
      contextualMeaning: `الفكرة الرهيبة الثابتة التي تسكن ذهن السجين في زنزانة بيسيتر وتسيطر على كل دقيقة من حياته المتبقية قبل المقصلة، وتجسد نداء فيكتور هوغو لإلغاء عقوبة الإعدام.`,
      definitionArabic: `الوضع التراجيدي للإنسان المحكوم عليه بالموت المنتظر تنفيذ العقوبة وسط رعب الانتظار.`,
      synonyms: ['Le supplicié en sursis', 'Le prisonnier fatal', 'La victime de l’échafaud'],
      partOfSpeech: 'نعت وصفي ومركب قانوني'
    };
  }

  if (lower.includes('échafaud') || lower.includes('echafaud') || lower.includes('guillotine') || lower.includes('couperet')) {
    return {
      arabicMeaning: 'مِنَصَّةُ الإِعْدَام / المِقْصَلَة',
      contextualMeaning: `الآلة الخشبية الدموية المنتصبة في ساحة الإعدام (Place de Grève) لقطع رؤوس المحكومين، والتي يصفها الكاتب كرمز للبربرية والهمجية القضائية.`,
      definitionArabic: `أداة الإعدام الآلية التي تحصد أرواح البشر باسم القانون.`,
      synonyms: ['Le bois de justice', 'La guillotine', 'La machine fatale'],
      partOfSpeech: 'اسم أداة وفضاء عقابي'
    };
  }

  if (lower.includes('pourvoi') || lower.includes('pourvoi en cassation')) {
    return {
      arabicMeaning: 'طَعْنٌ بِالنَّقْض / اسْتِئْنَافٌ قَانُونِيّ',
      contextualMeaning: `الرجاء القانوني الأخير الذي كان يتعلق به المحكوم عليه كخيط أمل واهٍ قبل أن يتم رفضه نهائياً ليواجه مصيره المحتوم.`,
      definitionArabic: `المسار القضائي للطعن في صحة الحكم القضائي أمام المحكمة العليا.`,
      synonyms: ['Le recours suprême', 'L’appel juridique', 'La requête en cassation'],
      partOfSpeech: 'مصطلح قانوني قضائي'
    };
  }

  if (lower.includes('bicêtre') || lower.includes('bicetre')) {
    return {
      arabicMeaning: 'سِجْنُ بِيسِيتْر (مَعْقِلُ البُؤْسِ وَالزَّنَازِين)',
      contextualMeaning: `السجن العتيق الرهيب بضواحي باريس حيث يحتجز المحكومون بالإعدام والمقيدون بالأصفاد في رطوبة العتمة وقسوة الحراس.`,
      definitionArabic: `الفضاء السجني القاتم الذي تنطلق منه مذكرات المحكوم عليه وأفكاره الحميمة.`,
      synonyms: ['La maison de force', 'La prison des condamnés', 'Le cachot sombre'],
      partOfSpeech: 'اسم مكان وفضاء روائي'
    };
  }

  if (lower.includes('place de grève') || lower.includes('place de greve') || lower === 'la grève') {
    return {
      arabicMeaning: 'سَاحَةُ الإِعْدَام (سَاحَةُ لَاگْرِيف بِبَارِيس)',
      contextualMeaning: `الساحة العامة الشهيرة أمام مبنى بلدية باريس حيث تنصب المقصلة ويحتشد الجمهور المتعطش للفرجة على إزهاق الأرواح.`,
      definitionArabic: `مسرح التنفيذ العلني لحكم الإعدام في فرنسا القرن التاسع عشر.`,
      synonyms: ['La place du supplice', 'Le lieu de l’exécution publique'],
      partOfSpeech: 'اسم فضاء تاريخي'
    };
  }

  // 4. Check matched comprehensive preset dictionary
  const matchedPreset = COMPREHENSIVE_CATEGORIZED_VOCAB.find(
    (c) => normalizeFrenchWord(c.frenchWord) === normalizeFrenchWord(clean) || clean.toLowerCase().includes(c.frenchWord.toLowerCase())
  );
  if (matchedPreset) {
    return {
      arabicMeaning: matchedPreset.arabicMeaning,
      contextualMeaning: matchedPreset.contextualMeaning || `المعنى والدلالة في سياق أحداث الصفحة ${pageNumber}: ${matchedPreset.arabicMeaning}.`,
      definitionArabic: matchedPreset.definitionArabic || matchedPreset.arabicMeaning,
      synonyms: matchedPreset.synonyms || findSynonymsForWord(clean),
      partOfSpeech: matchedPreset.partOfSpeech || 'مفردة لغوية سياقية'
    };
  }

  // 5. Fallback to instant translation engine with contextual synthesis
  const instant = generateInstantTranslation(clean, '', pageNumber);
  const cleanAr = cleanDirectArabicTranslation(instant.arabicTranslation);
  const directArabic = (cleanAr && cleanAr !== clean && !/[a-zA-Z]/.test(cleanAr) && !cleanAr.includes('نص روائي بالفرنسية'))
    ? cleanAr
    : (instant.wordDetails?.primaryArabic || `« ${clean} »`);

  const contextualNote = instant.wordDetails?.contextualMeaning ||
    `المعنى والدلالة في سياق أحداث الصفحة ${pageNumber}: ${directArabic}.`;

  const dictDef = (instant.wordDetails?.dictionaryDefinitions && instant.wordDetails.dictionaryDefinitions[0]) ||
    `الشرح المعجمي والسياقي لمقطع: « ${clean} » في الرواية المقررة.`;

  return {
    arabicMeaning: directArabic,
    contextualMeaning: contextualNote,
    definitionArabic: dictDef,
    synonyms: findSynonymsForWord(clean, instant.wordDetails?.alternativeMeanings?.filter((m) => /[a-zA-Z]/.test(m))),
    partOfSpeech: instant.wordDetails?.partOfSpeech || (clean.split(/\s+/).length > 2 ? 'مقتطف وسياق نصي (Extrait littéraire)' : 'مفردة لغوية (Terme)')
  };
}

// Get all flashcards from localStorage or initialize with comprehensive presets
export function getStoredFlashcards(): FlashcardWord[] {
  const combinedDefaults: FlashcardWord[] = [...PRESET_VOCABULARY];
  for (const item of COMPREHENSIVE_CATEGORIZED_VOCAB) {
    if (!combinedDefaults.some((c) => c.id === item.id || normalizeFrenchWord(c.frenchWord) === normalizeFrenchWord(item.frenchWord))) {
      combinedDefaults.push(item);
    }
  }

  if (typeof window === 'undefined') {
    return combinedDefaults.map((c) => ({ ...c, category: inferCategory(c) }));
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const enriched = combinedDefaults.map((c) => ({ ...c, category: inferCategory(c) }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(enriched));
      return enriched;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      let updated = false;
      const currentList: FlashcardWord[] = parsed.map((c) => {
        const cat = c.category || inferCategory(c);
        let updatedCard = { ...c, category: cat };

        // Auto-fix any stale highlight cards that have generic placeholder text
        const isHighlightCard = c.id && (c.id.startsWith('hl-card-') || c.id.startsWith('custom-'));
        const hasPlaceholder = !c.arabicMeaning ||
          c.arabicMeaning.includes('مقطع مظلل') ||
          c.arabicMeaning.includes('تضليل بارز') ||
          c.arabicMeaning.includes('نص روائي بالفرنسية') ||
          c.arabicMeaning.includes('ترجمة سياقية لـ') ||
          c.arabicMeaning === c.frenchWord;

        if (isHighlightCard && hasPlaceholder) {
          const resolved = resolveHighlightTranslationAndContext(c.frenchWord, c.pageNumber || 1, c.bookId || 'la_boite_a_merveilles');
          updatedCard.arabicMeaning = resolved.arabicMeaning;
          updatedCard.contextualMeaning = resolved.contextualMeaning;
          updatedCard.definitionArabic = resolved.definitionArabic;
          updatedCard.synonyms = resolved.synonyms.length > 0 ? resolved.synonyms : c.synonyms;
          updatedCard.partOfSpeech = resolved.partOfSpeech || c.partOfSpeech;
          updated = true;
        }

        if (cat !== c.category) updated = true;
        return updatedCard;
      });

      for (const item of COMPREHENSIVE_CATEGORIZED_VOCAB) {
        const exists = currentList.some(
          (c) => c.id === item.id || normalizeFrenchWord(c.frenchWord) === normalizeFrenchWord(item.frenchWord)
        );
        if (!exists) {
          currentList.push({ ...item, category: inferCategory(item) });
          updated = true;
        }
      }

      // Automatically sync and merge user highlights from all three novels
      const books: BookId[] = ['la_boite_a_merveilles', 'antigone', 'le_dernier_jour_dun_condamne'];
      books.forEach((bookId) => {
        try {
          const rawHl = localStorage.getItem(`novel_highlights_${bookId}`);
          if (!rawHl) return;
          const highlights: any[] = JSON.parse(rawHl);
          if (!Array.isArray(highlights)) return;

          highlights.forEach((hl) => {
            const text = (hl.text || '').trim();
            if (!text || text.length < 2) return;
            const normalized = normalizeFrenchWord(text);

            const existsIdx = currentList.findIndex(
              (c) =>
                (c.id === `hl-card-${bookId}-${normalized}` ||
                 c.id.startsWith(`hl-card-${bookId}-${normalized}`) ||
                 normalizeFrenchWord(c.frenchWord) === normalized) &&
                c.bookId === bookId
            );

            if (existsIdx === -1) {
              const resolved = resolveHighlightTranslationAndContext(text, hl.pageNumber || 1, bookId);
              const newCard: FlashcardWord = {
                id: `hl-card-${bookId}-${normalized}-${Date.now()}`,
                bookId,
                frenchWord: text,
                arabicMeaning: resolved.arabicMeaning,
                partOfSpeech: resolved.partOfSpeech || 'مقتطف مظلل',
                contextualMeaning: hl.note ? `ملاحظة القارئ: ${hl.note} | ${resolved.contextualMeaning}` : resolved.contextualMeaning,
                definitionArabic: resolved.definitionArabic,
                definitionFrench: `Extrait de l'œuvre (Page ${hl.pageNumber || 1}) : « ${text} »`,
                synonyms: resolved.synonyms,
                dictionaryDefinitions: [
                  `مقتطف أدبي أصيل تم تظليله أثناء القراءة من أحداث الصفحة ${hl.pageNumber || 1}.`,
                  'عبارة سياقية تم حفظها للمراجعة والتأمل.'
                ],
                alternativeMeanings: ['تظليل قرائي سياقي'],
                exampleContextFrench: `« ${text} »`,
                exampleContextArabic: hl.note ? `ملاحظة: ${hl.note}` : resolved.contextualMeaning,
                pageNumber: hl.pageNumber || 1,
                addedAt: hl.createdAt || Date.now(),
                masteryLevel: 'new',
                reviewCount: 0,
                correctCount: 0,
                incorrectCount: 0,
                category: 'term',
                isHighlight: true
              };
              currentList.unshift(newCard);
              updated = true;
            } else if (!currentList[existsIdx].isHighlight) {
              currentList[existsIdx].isHighlight = true;
              updated = true;
            }
          });
        } catch {
          // ignore
        }
      });

      if (updated) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentList));
      }
      return currentList;
    }
    const enriched = combinedDefaults.map((c) => ({ ...c, category: inferCategory(c) }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(enriched));
    return enriched;
  } catch (err) {
    console.warn('Failed to parse stored flashcards, restoring presets:', err);
    return combinedDefaults.map((c) => ({ ...c, category: inferCategory(c) }));
  }
}

export function getWordsFilteredByScopeAndCategory(params: {
  cards?: FlashcardWord[];
  bookId?: BookId | 'all';
  scope?: 'all' | 'reached' | 'page' | 'chapter' | 'range';
  maxPageReached?: number;
  selectedPage?: number;
  chapterStartPage?: number;
  chapterEndPage?: number;
  rangeStart?: number;
  rangeEnd?: number;
  category?: VocabCategory;
  searchQuery?: string;
  masteryFilter?: 'all' | 'new' | 'learning' | 'mastered';
}): FlashcardWord[] {
  const allCards = params.cards || getStoredFlashcards();
  const {
    bookId = 'all',
    scope = 'all',
    maxPageReached = 1,
    selectedPage = 1,
    chapterStartPage = 1,
    chapterEndPage = 1,
    rangeStart = 1,
    rangeEnd = 1,
    category = 'all',
    searchQuery = '',
    masteryFilter = 'all'
  } = params;

  return allCards.filter((card) => {
    // Book filter
    if (bookId !== 'all' && card.bookId !== bookId) return false;

    // Mastery filter
    if (masteryFilter !== 'all' && card.masteryLevel !== masteryFilter) return false;

    // Category filter
    const cardCat = card.category || inferCategory(card);
    if (category !== 'all' && cardCat !== category) return false;

    // Scope filter
    const p = card.pageNumber || 1;
    if (scope === 'reached') {
      if (p > maxPageReached) return false;
    } else if (scope === 'page') {
      if (p !== selectedPage) return false;
    } else if (scope === 'chapter') {
      const s = Math.min(chapterStartPage, chapterEndPage);
      const e = Math.max(chapterStartPage, chapterEndPage);
      if (p < s || p > e) return false;
    } else if (scope === 'range') {
      const s = Math.min(rangeStart, rangeEnd);
      const e = Math.max(rangeStart, rangeEnd);
      if (p < s || p > e) return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchWord = card.frenchWord.toLowerCase().includes(q);
      const matchAr = card.arabicMeaning.toLowerCase().includes(q);
      const matchSyn = card.synonyms && card.synonyms.some((s) => s.toLowerCase().includes(q));
      const matchDef = card.contextualMeaning && card.contextualMeaning.toLowerCase().includes(q);
      if (!matchWord && !matchAr && !matchSyn && !matchDef) return false;
    }

    return true;
  });
}

// Save all flashcards back to localStorage
function persistFlashcards(cards: FlashcardWord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    window.dispatchEvent(new CustomEvent(VOCAB_UPDATE_EVENT, { detail: { count: cards.length } }));
  } catch (err) {
    console.error('Failed to persist flashcards to localStorage:', err);
  }
}

// Find known synonyms or generate sensible defaults
export function findSynonymsForWord(frenchWord: string, providedSynonyms?: string[]): string[] {
  if (providedSynonyms && providedSynonyms.length > 0) {
    return providedSynonyms;
  }
  const normalized = normalizeFrenchWord(frenchWord);
  if (KNOWN_SYNONYMS[normalized]) {
    return KNOWN_SYNONYMS[normalized];
  }
  // Check substrings or parts
  for (const [key, syns] of Object.entries(KNOWN_SYNONYMS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return syns;
    }
  }
  return ['Terme littéraire équivalent', 'Synonyme contextuel'];
}

// Automatically save a word translation from TranslationSidePanel or reader selection
export function autoSaveWordTranslation(
  translation: TranslationResponse,
  pageNumber: number = 1,
  bookId: BookId = 'la_boite_a_merveilles'
): { card: FlashcardWord; isNew: boolean } {
  const currentCards = getStoredFlashcards();
  const rawFrench = translation.originalText.trim();
  const normalizedNew = normalizeFrenchWord(rawFrench);

  // Check if card already exists
  const existingIdx = currentCards.findIndex(
    (c) => normalizeFrenchWord(c.frenchWord) === normalizedNew && (c.bookId === bookId || !bookId)
  );

  const synonyms = findSynonymsForWord(
    rawFrench,
    translation.wordDetails?.alternativeMeanings?.filter((m) => /[a-zA-Z]/.test(m))
  );

  const primaryArabic = translation.wordDetails?.primaryArabic || translation.arabicTranslation;
  const pos = translation.wordDetails?.partOfSpeech || 'مفردة لغوية (Terme)';
  const contextualMeaning = translation.wordDetails?.contextualMeaning || translation.arabicTranslation;
  const dictDefs = translation.wordDetails?.dictionaryDefinitions || [
    'المعنى المعجمي في قواميس اللغة الفرنسية الكبرى (Larousse / Le Robert)',
    'الاستعمال الدلالي الخاص بالأدب المقرّر للأولى باكالوريا'
  ];
  const altMeanings = translation.wordDetails?.alternativeMeanings || ['مرادف سياقي معتمد'];

  if (existingIdx !== -1) {
    // Update existing card with latest context and page
    const existing = currentCards[existingIdx];
    const updated: FlashcardWord = {
      ...existing,
      arabicMeaning: primaryArabic || existing.arabicMeaning,
      contextualMeaning: contextualMeaning || existing.contextualMeaning,
      pageNumber: pageNumber || existing.pageNumber,
      partOfSpeech: pos || existing.partOfSpeech,
      synonyms: synonyms.length > 0 ? synonyms : existing.synonyms,
      dictionaryDefinitions: dictDefs.length > 0 ? dictDefs : existing.dictionaryDefinitions,
      alternativeMeanings: altMeanings.length > 0 ? altMeanings : existing.alternativeMeanings,
      exampleContextFrench: translation.wordDetails?.exampleContextFrench || existing.exampleContextFrench,
      exampleContextArabic: translation.wordDetails?.exampleContextArabic || existing.exampleContextArabic,
      lastReviewedAt: Date.now()
    };
    currentCards[existingIdx] = updated;
    persistFlashcards(currentCards);
    return { card: updated, isNew: false };
  }

  // Create new flashcard
  const newCard: FlashcardWord = {
    id: `card-${bookId}-${normalizedNew}-${Date.now()}`,
    bookId,
    frenchWord: rawFrench,
    arabicMeaning: primaryArabic,
    partOfSpeech: pos,
    contextualMeaning,
    synonyms,
    dictionaryDefinitions: dictDefs,
    alternativeMeanings: altMeanings,
    exampleContextFrench: translation.wordDetails?.exampleContextFrench || `Extrait : « ${rawFrench} » (Page ${pageNumber})`,
    exampleContextArabic: translation.wordDetails?.exampleContextArabic || `سياق المفردة في أحداث الصفحة ${pageNumber}.`,
    pageNumber,
    addedAt: Date.now(),
    masteryLevel: 'new',
    reviewCount: 0,
    correctCount: 0,
    incorrectCount: 0
  };

  currentCards.unshift(newCard);
  persistFlashcards(currentCards);
  return { card: newCard, isNew: true };
}

// Update card mastery after quiz or flashcard flip
export function updateCardMastery(
  cardId: string,
  result: 'correct' | 'incorrect' | 'mastered' | 'learning'
): FlashcardWord | null {
  const currentCards = getStoredFlashcards();
  const index = currentCards.findIndex((c) => c.id === cardId);
  if (index === -1) return null;

  const card = { ...currentCards[index] };
  card.reviewCount += 1;
  card.lastReviewedAt = Date.now();

  if (result === 'correct') {
    card.correctCount += 1;
    if (card.correctCount >= 3) {
      card.masteryLevel = 'mastered';
    } else {
      card.masteryLevel = 'learning';
    }
  } else if (result === 'incorrect') {
    card.incorrectCount += 1;
    card.masteryLevel = 'learning';
  } else if (result === 'mastered') {
    card.masteryLevel = 'mastered';
    card.correctCount += 2;
  } else if (result === 'learning') {
    card.masteryLevel = 'learning';
  }

  currentCards[index] = card;
  persistFlashcards(currentCards);
  return card;
}

// Update specific details of any card (e.g. AI translation, contextual meaning, synonyms)
export function updateCardDetails(
  cardId: string,
  updates: Partial<FlashcardWord>
): FlashcardWord | null {
  const currentCards = getStoredFlashcards();
  const index = currentCards.findIndex((c) => c.id === cardId);
  if (index === -1) return null;

  const updatedCard: FlashcardWord = {
    ...currentCards[index],
    ...updates,
    lastReviewedAt: Date.now()
  };

  currentCards[index] = updatedCard;
  persistFlashcards(currentCards);
  return updatedCard;
}

/**
 * Checks whether a card has a missing, unverified, or placeholder translation
 */
export function isCardUntranslated(card: FlashcardWord): boolean {
  if (!card.arabicMeaning) return true;
  const ar = card.arabicMeaning.trim().toLowerCase();
  const fr = card.frenchWord.trim().toLowerCase();
  if (ar === fr) return true;
  if (
    ar.includes('مقطع مظلل') ||
    ar.includes('تضليل بارز') ||
    ar.includes('نص روائي بالفرنسية') ||
    ar.includes('بانتظار الترجمة') ||
    ar.includes('ترجمة سياقية لـ')
  ) {
    return true;
  }
  const arabicRegex = /[\u0600-\u06FF]/;
  if (!arabicRegex.test(ar)) {
    return true;
  }
  return false;
}

/**
 * Uses Gemini AI to analyze, translate, and explain any vocabulary card in deep literary context
 */
export async function translateFlashcardWithAI(card: FlashcardWord): Promise<FlashcardWord> {
  const booksMap: Record<BookId, string> = {
    la_boite_a_merveilles: 'La Boîte à Merveilles (Ahmed Sefrioui)',
    antigone: 'Antigone (Jean Anouilh)',
    le_dernier_jour_dun_condamne: "Le Dernier Jour d'un Condamné (Victor Hugo)"
  };

  const novelTitle = booksMap[card.bookId] || 'Roman 1ère Bac';
  const cleanWord = card.frenchWord.trim();
  const isSingleWord = cleanWord.split(/\s+/).length <= 2;

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: cleanWord,
        context: card.exampleContextFrench || card.contextualMeaning || cleanWord,
        pageNumber: card.pageNumber || 1,
        bookId: card.bookId,
        novelTitle,
        translationMode: 'strict',
        type: isSingleWord ? 'WORD' : 'SENTENCE'
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const wd = data.wordDetails;

      const directArabic = wd?.primaryArabic || cleanDirectArabicTranslation(data.arabicTranslation) || data.arabicTranslation;
      const contextual = wd?.contextualMeaning || data.literaryAnalysis || card.contextualMeaning || `المعنى السياقي لمفردة «${cleanWord}» في أحداث الرواية`;
      const defAr = wd?.dictionaryDefinitions?.[0] || contextual;
      const synonyms = (wd?.alternativeMeanings && wd.alternativeMeanings.length > 0)
        ? wd.alternativeMeanings
        : (card.synonyms && card.synonyms.length > 0 ? card.synonyms : findSynonymsForWord(cleanWord));

      const partOfSpeech = wd?.partOfSpeech || card.partOfSpeech || (isSingleWord ? 'مفردة لغوية' : 'عبارة سياقية');
      const exampleArabic = wd?.exampleContextArabic || card.exampleContextArabic;

      const updates: Partial<FlashcardWord> = {
        arabicMeaning: directArabic,
        contextualMeaning: contextual,
        definitionArabic: defAr,
        definitionFrench: card.definitionFrench || `Extrait : « ${cleanWord} »`,
        synonyms,
        partOfSpeech,
        exampleContextArabic: exampleArabic,
        isAiTranslated: true,
        lastAiTranslatedAt: Date.now()
      };

      const updated = updateCardDetails(card.id, updates);
      return updated || { ...card, ...updates };
    }
  } catch (err) {
    console.warn('Failed to translate flashcard with AI:', err);
  }

  // Fallback to local dictionary / resolver
  const resolved = resolveHighlightTranslationAndContext(cleanWord, card.pageNumber || 1, card.bookId);
  const fallbackUpdates: Partial<FlashcardWord> = {
    arabicMeaning: card.arabicMeaning && card.arabicMeaning !== card.frenchWord ? card.arabicMeaning : resolved.arabicMeaning,
    contextualMeaning: card.contextualMeaning || resolved.contextualMeaning,
    definitionArabic: card.definitionArabic || resolved.definitionArabic,
    synonyms: card.synonyms && card.synonyms.length > 0 ? card.synonyms : resolved.synonyms,
    partOfSpeech: card.partOfSpeech || resolved.partOfSpeech,
    isAiTranslated: true,
    lastAiTranslatedAt: Date.now()
  };
  const updated = updateCardDetails(card.id, fallbackUpdates);
  return updated || { ...card, ...fallbackUpdates };
}

export const translateFlashcardWithAi = translateFlashcardWithAI;

/**
 * Automatically synchronizes all user highlights from all three 1ère Bac novels
 * directly into the Flashcards vocabulary collection.
 */
export function syncAllHighlightsToVocabulary(): FlashcardWord[] {
  if (typeof window === 'undefined') return getStoredFlashcards();

  const books: BookId[] = ['la_boite_a_merveilles', 'antigone', 'le_dernier_jour_dun_condamne'];
  const currentCards = getStoredFlashcards();
  let modified = false;

  books.forEach((bookId) => {
    try {
      const raw = localStorage.getItem(`novel_highlights_${bookId}`);
      if (!raw) return;
      const highlights: any[] = JSON.parse(raw);
      if (!Array.isArray(highlights)) return;

      highlights.forEach((hl) => {
        const text = (hl.text || '').trim();
        if (!text || text.length < 2) return;
        const normalized = normalizeFrenchWord(text);

        const existsIdx = currentCards.findIndex(
          (c) =>
            (c.id === `hl-card-${bookId}-${normalized}` ||
             c.id.startsWith(`hl-card-${bookId}-${normalized}`) ||
             normalizeFrenchWord(c.frenchWord) === normalized) &&
            c.bookId === bookId
        );

        if (existsIdx === -1) {
          const resolved = resolveHighlightTranslationAndContext(text, hl.pageNumber || 1, bookId);
          const newCard: FlashcardWord = {
            id: `hl-card-${bookId}-${normalized}-${Date.now()}`,
            bookId,
            frenchWord: text,
            arabicMeaning: resolved.arabicMeaning,
            partOfSpeech: resolved.partOfSpeech || 'مقتطف مظلل',
            contextualMeaning: hl.note ? `ملاحظة القارئ: ${hl.note} | ${resolved.contextualMeaning}` : resolved.contextualMeaning,
            definitionArabic: resolved.definitionArabic,
            definitionFrench: `Extrait de l'œuvre (Page ${hl.pageNumber || 1}) : « ${text} »`,
            synonyms: resolved.synonyms,
            dictionaryDefinitions: [
              `مقتطف أدبي أصيل تم تظليله أثناء القراءة من أحداث الصفحة ${hl.pageNumber || 1}.`,
              'عبارة سياقية تم حفظها للمراجعة والتأمل.'
            ],
            alternativeMeanings: ['تظليل قرائي سياقي'],
            exampleContextFrench: `« ${text} »`,
            exampleContextArabic: hl.note ? `ملاحظة: ${hl.note}` : resolved.contextualMeaning,
            pageNumber: hl.pageNumber || 1,
            addedAt: hl.createdAt || Date.now(),
            masteryLevel: 'new',
            reviewCount: 0,
            correctCount: 0,
            incorrectCount: 0,
            category: 'term',
            isHighlight: true
          };
          currentCards.unshift(newCard);
          modified = true;
        } else {
          // Tag as highlight if not already tagged
          if (!currentCards[existsIdx].isHighlight) {
            currentCards[existsIdx].isHighlight = true;
            modified = true;
          }
        }
      });
    } catch (err) {
      console.warn('Error syncing highlights for book:', bookId, err);
    }
  });

  if (modified) {
    persistFlashcards(currentCards);
  }
  return currentCards;
}

// Add a custom card manually
export function addCustomCard(card: Omit<FlashcardWord, 'id' | 'addedAt' | 'reviewCount' | 'correctCount' | 'incorrectCount'>): FlashcardWord {
  const currentCards = getStoredFlashcards();
  const newCard: FlashcardWord = {
    ...card,
    id: `custom-card-${Date.now()}`,
    addedAt: Date.now(),
    reviewCount: 0,
    correctCount: 0,
    incorrectCount: 0
  };
  currentCards.unshift(newCard);
  persistFlashcards(currentCards);
  return newCard;
}

// Delete a card
export function deleteCard(cardId: string): boolean {
  const currentCards = getStoredFlashcards();
  const filtered = currentCards.filter((c) => c.id !== cardId);
  if (filtered.length === currentCards.length) return false;
  persistFlashcards(filtered);
  return true;
}

// Reset collection to defaults
export function resetFlashcardsToDefaults(): FlashcardWord[] {
  persistFlashcards(PRESET_VOCABULARY);
  return PRESET_VOCABULARY;
}

import { generateAdvancedVocabularyQuiz } from './vocabQuizEngine';

// Generate an interactive Vocabulary Quiz on French Synonyms & Arabic Meanings
export function generateVocabularyQuiz(
  selectedBookIdOrCards: BookId | 'all' | FlashcardWord[] = 'all',
  quizType: VocabQuizType = 'ALL',
  questionCount: number = 5
): VocabQuizQuestion[] {
  const allCards = getStoredFlashcards();
  let eligibleCards: FlashcardWord[] = [];

  if (Array.isArray(selectedBookIdOrCards)) {
    eligibleCards = selectedBookIdOrCards;
  } else if (selectedBookIdOrCards === 'all') {
    eligibleCards = allCards;
  } else {
    eligibleCards = allCards.filter((c) => c.bookId === selectedBookIdOrCards);
  }

  return generateAdvancedVocabularyQuiz(eligibleCards, allCards, quizType, questionCount);
}

// Hook-like listener for vocabulary updates
export function subscribeToVocabularyUpdates(callback: (cards: FlashcardWord[]) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleUpdate = () => {
    callback(getStoredFlashcards());
  };

  window.addEventListener(VOCAB_UPDATE_EVENT, handleUpdate);
  window.addEventListener('storage', handleUpdate);

  return () => {
    window.removeEventListener(VOCAB_UPDATE_EVENT, handleUpdate);
    window.removeEventListener('storage', handleUpdate);
  };
}

/**
 * Automatically converts user text highlights / annotations into Flashcard words in the vocabulary system
 */
export function addHighlightAsFlashcard(
  bookId: BookId,
  pageNumber: number,
  highlightText: string,
  note?: string
): FlashcardWord {
  const currentCards = getStoredFlashcards();
  const rawText = highlightText.trim();
  const normalized = normalizeFrenchWord(rawText);

  const existingIdx = currentCards.findIndex(
    (c) => normalizeFrenchWord(c.frenchWord) === normalized && c.bookId === bookId
  );

  const resolved = resolveHighlightTranslationAndContext(rawText, pageNumber, bookId);
  const arabicMeaning = resolved.arabicMeaning;
  const contextualMeaning = note ? `ملاحظة القارئ: ${note} | ${resolved.contextualMeaning}` : resolved.contextualMeaning;
  const definitionArabic = resolved.definitionArabic;
  const synonyms = resolved.synonyms;
  const partOfSpeech = resolved.partOfSpeech;

  if (existingIdx !== -1) {
    const existing = currentCards[existingIdx];
    const updated: FlashcardWord = {
      ...existing,
      pageNumber: pageNumber || existing.pageNumber,
      arabicMeaning: arabicMeaning || existing.arabicMeaning,
      contextualMeaning: note ? `${resolved.contextualMeaning} | ملاحظة: ${note}` : resolved.contextualMeaning,
      definitionArabic,
      synonyms: synonyms.length > 0 ? synonyms : existing.synonyms,
      partOfSpeech: partOfSpeech || existing.partOfSpeech,
      lastReviewedAt: Date.now()
    };
    currentCards[existingIdx] = updated;
    persistFlashcards(currentCards);
    return updated;
  }

  const newCard: FlashcardWord = {
    id: `hl-card-${bookId}-${normalized}-${Date.now()}`,
    bookId,
    frenchWord: rawText,
    arabicMeaning,
    partOfSpeech,
    contextualMeaning,
    definitionArabic,
    definitionFrench: `Extrait de l'œuvre (Page ${pageNumber}) : « ${rawText} »`,
    synonyms,
    dictionaryDefinitions: [
      `مقتطف أدبي أصيل تم تظليله وحفظه من أحداث الصفحة ${pageNumber}.`,
      'مفردة أو جملة سياقية مفتاحية لفهم الرواية واجتياز الامتحان الجهوي.'
    ],
    alternativeMeanings: ['شاهد أدبي سياقي', 'عبارة مفتاحية'],
    exampleContextFrench: `Extrait : « ${rawText} » (Page ${pageNumber})`,
    exampleContextArabic: note ? `ملاحظة: ${note} | ${resolved.contextualMeaning}` : resolved.contextualMeaning,
    pageNumber,
    addedAt: Date.now(),
    masteryLevel: 'new',
    reviewCount: 0,
    correctCount: 0,
    incorrectCount: 0
  };

  currentCards.unshift(newCard);
  persistFlashcards(currentCards);
  return newCard;
}
