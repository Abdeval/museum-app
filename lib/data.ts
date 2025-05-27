// eslint-disable-next-line import/namespace
import { MuseumImage } from "@/types";


export const museumImagesEn: MuseumImage[] = [
  {
    title: "Scan & Discover",
    description: "Point your camera at any QR code next to an exhibit to instantly unlock detailed information, history, and multimedia content right on your device.",
    src: require("@/assets/images/welcome/scan-page.png"),
  },
  {
    title: "Your Multilingual Assistant",
    description: "Have a question? Our smart chatbot is here to help! Ask about exhibits, museum services, or history in multiple languages including English, French, and Arabic.",
    src: require("@/assets/images/welcome/chat-page.jpg"),
  },
  {
    title: "Find Your Favorites",
    description: "Easily search our entire collection, filter by category, period, or interest, and save your favorite exhibits to plan your visit or revisit them later.",
    src: require("@/assets/images/welcome/search-page.jpg"),
  },
  {
    title: "Welcome to the Museum Experience",
    description: "Your personalized journey through art and history begins now. Explore interactive features, get personalized recommendations, and make the most of your visit with our app.",
    src: require("@/assets/images/welcome/welcome4.jpg"),
  }
]


export const museumImagesFr: MuseumImage[] = [
  {
    title: "Scannez & Découvrez",
    description: "Pointez votre appareil photo vers n'importe quel code QR à côté d'une œuvre pour débloquer instantanément des informations détaillées, son histoire et du contenu multimédia directement sur votre appareil.",
    src: require("@/assets/images/welcome/scan-page.png"),
  },
  {
    title: "Votre Assistant Multilingue",
    description: "Une question ? Notre chatbot intelligent est là pour vous aider ! Renseignez-vous sur les œuvres, les services du musée ou l'histoire en plusieurs langues, dont l'anglais, le français et l'arabe.",
    src: require("@/assets/images/welcome/chat-page.jpg"),
  },
  {
    title: "Trouvez Vos Favoris",
    description: "Recherchez facilement dans toute notre collection, filtrez par catégorie, période ou intérêt, et sauvegardez vos œuvres préférées pour planifier votre visite ou les revoir plus tard.",
    src: require("@/assets/images/welcome/search-page.jpg"),
  },
  {
    title: "Bienvenue dans l'Expérience Musée",
    description: "Votre voyage personnalisé à travers l'art et l'histoire commence maintenant. Explorez des fonctionnalités interactives, obtenez des recommandations personnalisées et profitez au maximum de votre visite grâce à notre application.",
    src: require("@/assets/images/welcome/welcome4.jpg"),
  }
]

export const museumImagesAr: MuseumImage[] = [
  {
    title: "امسح واكتشف",
    description: "وجّه كاميرا جهازك نحو أي رمز QR بجانب قطعة معروضة لفتح معلومات مفصلة وتاريخها ومحتوى وسائط متعددة على الفور على جهازك.",
    src: require("@/assets/images/welcome/scan-page.png"),
  },
  {
    title: "مساعدك متعدد اللغات",
    description: "هل لديك سؤال؟ روبوت المحادثة الذكي الخاص بنا هنا لمساعدتك! اسأل عن المعروضات أو خدمات المتحف أو التاريخ بلغات متعددة بما في ذلك الإنجليزية والفرنسية والعربية.",
    src: require("@/assets/images/welcome/chat-page.jpg"),
  },
  {
    title: "اعثر على مفضلاتك",
    description: "ابحث بسهولة في مجموعتنا الكاملة، وقم بالتصفية حسب الفئة أو الفترة أو الاهتمام، واحفظ معروضاتك المفضلة لتخطيط زيارتك أو الرجوع إليها لاحقًا.",
    src: require("@/assets/images/welcome/search-page.jpg"),
  },
  {
    title: "مرحباً بك في تجربة المتحف",
    description: "رحلتك الشخصية عبر الفن والتاريخ تبدأ الآن. استكشف الميزات التفاعلية، واحصل على توصيات مخصصة، واستفد إلى أقصى حد من زيارتك من خلال تطبيقنا.",
    src: require("@/assets/images/welcome/welcome4.jpg"),
  }
];

export const MUSEUM_EXHIBITS = [
  {
    id: 1,
    title: "The Starry Night",
    year: "1889",
    thematic_category: "Painting",
    description:
      "This famous painting depicts the view from the east-facing window of Van Gogh's asylum room at Saint-Rémy-de-Provence, just before sunrise, with the addition of an imaginary village.",
    url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1200px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
  },
  {
    id: 2,
    title: "Ancient Egyptian Mummy",
    year: "1200 BCE",
    thematic_category: "Artifact",
    description:
      "This well-preserved mummy from the New Kingdom period showcases the advanced mummification techniques of ancient Egypt. The sarcophagus features intricate hieroglyphics describing the journey to the afterlife.",
    url: "https://images.unsplash.com/photo-1608372761017-2e9e15cf5c2f?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "T-Rex Skeleton",
    year: "Late Cretaceous",
    thematic_category: "Fossil",
    description:
      "This nearly complete Tyrannosaurus Rex skeleton stands over 12 feet tall and 40 feet long. Discovered in Montana in 1988, it represents one of the best-preserved T-Rex specimens in the world.",
    url: "https://images.unsplash.com/photo-1601055903647-ddf1ee9701b7?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "The Persistence of Memory",
    year: "1931",
    thematic_category: "Painting",
    description:
      "One of the most recognizable works of Surrealism, this painting features melting watches in a dreamlike landscape, exploring concepts of time and memory.",
    url: "https://uploads6.wikiart.org/images/salvador-dali/the-persistence-of-memory-1931.jpg",
  },
  {
    id: 5,
    title: "Apollo 11 Command Module",
    year: "1969",
    thematic_category: "Space Artifact",
    description:
      "The actual command module that carried Neil Armstrong, Buzz Aldrin, and Michael Collins to the Moon and back during the historic Apollo 11 mission.",
    url: "https://airandspace.si.edu/sites/default/files/styles/slideshow_lg/public/2006-25387h.jpg",
  },
  {
    id: 6,
    title: "Rosetta Stone",
    year: "196 BCE",
    thematic_category: "Ancient Artifact",
    description:
      "This granodiorite stele inscribed with three versions of a decree was instrumental in deciphering Egyptian hieroglyphs, revolutionizing our understanding of ancient Egyptian civilization.",
    url:
      "https://media.britishmuseum.org/media/Repository/Documents/2017_8/17_15/970e9f2c_ce6c_4183_a60d_a803f0d7fa39/mid_00096945_001.jpg",
  },
  {
    id: 7,
    title: "Girl with a Pearl Earring",
    year: "1665",
    description:
      "Often called the 'Dutch Mona Lisa,' this portrait of a girl wearing an exotic dress and a large pearl earring is one of Vermeer's most famous works.",
    url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/800px-1665_Girl_with_a_Pearl_Earring.jpg",
  },
  {
    id: 8,
    title: "Hope Diamond",
    year: "1668",
    description:
      "This 45.52-carat deep-blue diamond has a long and allegedly cursed history. It is one of the most famous diamonds in the world and is renowned for its size, color, and clarity.",
    url: "https://www.si.edu/sites/default/files/newsdesk/fact_sheets/nhb2013-02879.jpg",
  },
]


// ! Museum information for the chatbot
export const MUSEUM_INFO = {
  name: "AMUSE",
  description:
    "AMUSE is a modern art museum featuring contemporary works from around the world. Our mission is to inspire and educate visitors through immersive art experiences.",
  location: "123 Art Avenue, Creativity City",

  // Structured hours for easier processing by the LLM
  hours: {
    days_en: "Tuesday - Sunday", // English source
    open_time_en: "10:00 AM",    // English source
    close_time_en: "6:00 PM",   // English source
    closed_on_en: "Mondays",     // English source
    // Optional: keep the original full text for simple English display or LLM fallback
    full_text_en: "Tuesday - Sunday: 10:00 AM - 6:00 PM. Closed on Mondays."
  },

  // Structured admission for easier processing by the LLM
  admission: {
    adults_en: "$15",              // English source
    students_seniors_en: "$10",  // English source
    children_under_12_en: "Free",// English source
    // Optional: keep the original full text for simple English display or LLM fallback
    full_text_en: "Adults: $15, Students & Seniors: $10, Children under 12: Free"
  },

  // Special features can be a string or an array for easier listing by the LLM
  specialFeatures: "Interactive exhibits, guided tours, art workshops, and a café with panoramic views of the city.", // As a single string (LLM will parse/translate)
  // OR, as a list (might be easier for LLM to list in other languages):
  // specialFeatures_list_en: [ // English source
  //   "Interactive exhibits",
  //   "guided tours",
  //   "art workshops",
  //   "a café with panoramic views of the city"
  // ]
};

// ! categories
export const categories = [
  {
    name: "painting",
    icon: "fluent:paint-bucket-brush-20-filled"
  },
  {
    name: "artifact",
    icon: "mdi:fossil-fuel-outline"
  },
  {
    name: "history",
    icon: "fluent:history-20-filled",
  },
  {
    name: "culture",
    icon: "fluent:people-community-20-filled",
  }
]


// ! Sample badges
export const BADGES = [
  {
    id: 1,
    name: "Art Explorer",
    icon: "color-palette",
    count: 5,
    description: "Visited 5 painting exhibits",
  },
  {
    id: 2,
    name: "History Buff",
    icon: "hourglass",
    count: 3,
    description: "Visited 3 historical artifacts",
  },
  {
    id: 3,
    name: "Dino Fan",
    icon: "skull",
    count: 1,
    description: "Visited the T-Rex exhibit",
  },
  {
    id: 4,
    name: "Space Cadet",
    icon: "planet",
    count: 1,
    description: "Visited the Apollo 11 exhibit",
  },
];


export const avatarMap: Record<string, any> = {
  "1.png": require("@/assets/avatars/1.png"),
  "2.png": require("@/assets/avatars/2.png"),
  "3.png": require("@/assets/avatars/3.png"),
  "4.png": require("@/assets/avatars/4.png"),
  "5.png": require("@/assets/avatars/5.png"),
  "6.png": require("@/assets/avatars/6.png"),
  "7.png": require("@/assets/avatars/7.png"),
  // Add all possible options
};

// ! Sample ratings for exhibits (in a real app, these would come from a database)
export const EXHIBIT_RATINGS: Record<number, { rating: number; reviews: number }> = {
  1: { rating: 4.8, reviews: 245 },
  2: { rating: 4.5, reviews: 187 },
  3: { rating: 4.9, reviews: 312 },
  4: { rating: 4.6, reviews: 156 },
  5: { rating: 4.7, reviews: 203 },
  6: { rating: 4.4, reviews: 178 },
  7: { rating: 4.9, reviews: 267 },
  8: { rating: 4.8, reviews: 195 },
};

export const navigationItems = [
  "home",
  "exhibits",
  "chatbot",
  "scanner",
  "profile",
  "history"
]

export const FIRST_MESSAGE_ENGLISH = `Hello! I'm your AMUSE museum guide. I can help you discover exhibits and answer questions about our collections.What are you interested in seeing today?`;
export const FIRST_MESSAGE_FRENCH = `Bonjour ! Je suis votre guide pour le musée AMUSE. Je peux vous aider à découvrir les expositions et à répondre à vos questions sur nos collections. Que souhaitez-vous découvrir aujourd'hui ?`;
export const FIRST_MESSAGE_ARABIC = `مرحباً! أنا مرشدكم في متحف AMUSE. يمكنني مساعدتكم على اكتشاف المعروضات والإجابة على أسئلتكم حول مجموعاتنا. ماذا تودون أن تكتشفوا اليوم؟`;


