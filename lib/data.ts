// eslint-disable-next-line import/namespace
import { MuseumImage } from "@/types";


export const museumImages: MuseumImage[] = [
    {
        title: "Ancient Statue",
        description: "A marble statue from the Roman Empire period.",
        src: require("@/assets/images/welcome/welcome1.jpg"),
    },
    {
        title: "Historical Map",
        description: "A map detailing 18th-century trade routes.",
        src: require("@/assets/images/welcome/welcome2.jpg"),
    },
    {
        title: "Art Gallery",
        description: "A collection of impressionist paintings.",
        src: require("@/assets/images/welcome/welcome3.jpg"),
    },
    {
        title: "Museum Exterior",
        description: "The museum building at sunset.",
        src: require("@/assets/images/welcome/welcome4.jpg"),
    },
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
  hours: "Tuesday - Sunday: 10:00 AM - 6:00 PM, Closed on Mondays",
  admission: "Adults: $15, Students & Seniors: $10, Children under 12: Free",
  specialFeatures: "Interactive exhibits, guided tours, art workshops, and a café with panoramic views of the city.",
}

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


export const FIRST_MESSAGE = `Hello! I'm your AMUSE museum guide. I can help you discover exhibits and answer questions about our collections.What are you interested in seeing today?`;



