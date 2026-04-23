/**
 * Seed Firestore with initial data.
 * Run: npm run db:seed
 *
 * Loads env from .env.local (create from .env.example)
 */
import { config } from "dotenv"
config({ path: ".env.local" })
import { initializeApp } from "firebase/app"
import { getFirestore, setDoc, doc, collection, writeBatch } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

async function seed() {
  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)

  // Hero config
  await setDoc(doc(db, "config", "hero"), {
    title: "The Silent Garden",
    author: "Elena Morales",
    cover: "/images/book-cover-1.jpg",
    ctaText: "Discover the book",
    ctaLink: "#",
  })

  // Discount config
  await setDoc(doc(db, "config", "discount"), {
    title: "Student Discount — Save 20%",
    description: "Verify your student status and enjoy exclusive pricing on every order.",
    ctaText: "Shop Now",
    ctaLink: "#",
  })

  const batch = writeBatch(db)

  // Categories Collection
  const categories = [
    {
      id: 1,
      title: "Knowledge & Facts",
      icon: "BookText",
      description: "Expand your understanding of the world",
    },
    {
      id: 2,
      title: "Environment & Sustainability",
      icon: "Leaf",
      description: "Read for a better, greener planet",
    },
    {
      id: 3,
      title: "Economy & Policy",
      icon: "Landmark",
      description: "Navigate complex systems and ideas",
    },
    {
      id: 4,
      title: "Science & Technology",
      icon: "Microscope",
      description: "Discover innovations shaping tomorrow",
    },
    {
      id: 5,
      title: "Thought & Inspiration",
      icon: "Lightbulb",
      description: "Ignite creativity and reflection",
    },
  ]
  categories.forEach((c) => {
    batch.set(doc(collection(db, "categories"), `category-${c.id}`), c)
  })

  // Books (New Collection) - Updated with numeric prices
  const books = [
    {
      title: "The Essential Green Handbook",
      author: "Editorial Team",
      authorDescription: "Experts in sustainability, ESG, and climate studies.",
      badge: "New",
      bookDescription: "Covers climate change, biodiversity, ESG, and sustainability concepts in an accessible format.",
      bookDetails: { dimensions: "6 x 9 inches", pages: 300, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/green-handbook.jpg",
      price: 900,
      order: 1,
      categoryId: 2,
      whoShouldReadThis: [
        "Environmental enthusiasts and climate-conscious readers",
        "Students studying sustainability and ESG principles",
        "Business professionals focused on corporate governance",
        "Policy makers and governance advisors",
      ],
      whatYouWillLearn: [
        "Fundamental concepts of climate change and global warming",
        "Biodiversity conservation and its importance",
        "ESG (Environmental, Social, Governance) frameworks",
        "Sustainable development goals and their implementation",
        "Green practices for businesses and individuals",
      ],
      recommendedBooks: [
        { id: "book-7", title: "Climate Change: A Human Development Perspective", cover: "/images/climate.jpg", price: 850 },
        { id: "book-11", title: "Sustainable Development: A Human Development Perspective", cover: "/images/sustainable.jpg", price: 950 },
      ],
    },
    {
      title: "The Mega Book of Facts",
      author: "Editorial Team",
      authorDescription: "Knowledge-focused editorial team for competitive exam preparation.",
      badge: "Popular",
      bookDescription: "A vast collection of facts covering history, geography, science, and general awareness.",
      bookDetails: { dimensions: "6 x 9 inches", pages: 500, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/mega-facts.jpg",
      price: 1650,
      order: 2,
      categoryId: 1,
      whoShouldReadThis: [
        "Competitive exam aspirants and students",
        "General knowledge enthusiasts",
        "Professionals seeking quick reference materials",
      ],
      whatYouWillLearn: [
        "Historical events and timelines",
        "Geographic facts and world statistics",
        "Scientific discoveries and breakthroughs",
        "General awareness for competitive exams",
      ],
      recommendedBooks: [
        { id: "book-1", title: "The Essential Green Handbook", cover: "/images/green-handbook.jpg", price: 900 },
      ],
    },
    {
      title: "The Political Science Companion",
      author: "Editorial Team",
      authorDescription: "Specialists in political science and governance.",
      badge: "New",
      bookDescription: "A practical guide to political science concepts including constitution and international relations.",
      bookDetails: { dimensions: "6 x 9 inches", pages: 350, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/political-science.jpg",
      price: 1050,
      order: 3,
      categoryId: 3,
      whoShouldReadThis: [
        "Political science students and researchers",
        "Policy makers and civil servants",
        "Citizens interested in governance",
      ],
      whatYouWillLearn: [
        "Constitutional frameworks and governance structures",
        "Political ideologies and systems",
        "International relations and diplomacy",
        "Government institutions and their functions",
      ],
      recommendedBooks: [
        { id: "book-5", title: "Handbook of Economic Terminology", cover: "/images/economics.jpg", price: 700 },
        { id: "book-6", title: "Handbook on Union Budget", cover: "/images/budget.jpg", price: 400 },
      ],
    },
    {
      title: "A Basic Manual of Freight Forwarding",
      author: "Editorial Team",
      authorDescription: "Industry experts in logistics and supply chain.",
      badge: "Trending",
      bookDescription: "An introduction to freight forwarding, logistics, and international trade practices.",
      bookDetails: { dimensions: "6 x 9 inches", pages: 280, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/freight.jpg",
      price: 950,
      order: 4,
      categoryId: 4,
      whoShouldReadThis: [
        "Logistics and supply chain professionals",
        "International trade practitioners",
        "Customs brokers and freight forwarders",
        "Business students in commerce",
      ],
      whatYouWillLearn: [
        "Freight forwarding processes and procedures",
        "International shipping and logistics",
        "Customs documentation and clearance",
        "Supply chain optimization",
      ],
      recommendedBooks: [],
    },
    {
      title: "Handbook of Economic Terminology",
      author: "Editorial Team",
      authorDescription: "Economics educators simplifying complex topics.",
      badge: "New",
      bookDescription: "Explains key economic, banking, and business terminology for beginners.",
      bookDetails: { dimensions: "6 x 9 inches", pages: 250, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/economics.jpg",
      price: 700,
      order: 5,
      categoryId: 3,
      whoShouldReadThis: [
        "Economics students and learners",
        "Business professionals",
        "Finance enthusiasts",
        "Anyone interested in economic concepts",
      ],
      whatYouWillLearn: [
        "Essential economic terminology",
        "Banking and financial concepts",
        "Business and commerce basics",
        "Market dynamics and economic indicators",
      ],
      recommendedBooks: [
        { id: "book-3", title: "The Political Science Companion", cover: "/images/political-science.jpg", price: 1050 },
        { id: "book-6", title: "Handbook on Union Budget", cover: "/images/budget.jpg", price: 400 },
      ],
    },
    {
      title: "Handbook on Union Budget",
      author: "Editorial Team",
      authorDescription: "Public finance experts.",
      badge: "Recommended",
      bookDescription: "Explains India's budget process, constitutional framework, and financial governance.",
      bookDetails: { dimensions: "6 x 9 inches", pages: 220, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/budget.jpg",
      price: 400,
      order: 6,
      categoryId: 3,
      whoShouldReadThis: [
        "Government employees and civil servants",
        "Economics and public policy students",
        "Indian citizens interested in budget allocation",
        "Finance professionals",
      ],
      whatYouWillLearn: [
        "Indian budget process and timeline",
        "Constitutional financial provisions",
        "Budget allocation and expenditure",
        "Fiscal policy and government finances",
      ],
      recommendedBooks: [
        { id: "book-5", title: "Handbook of Economic Terminology", cover: "/images/economics.jpg", price: 700 },
      ],
    },
    {
      title: "Handbook of Economic Terminology",
      author: "Editorial Team",
      authorDescription: "Economics educators simplifying complex topics.",
      badge: "New",
      bookDescription: "Explains key economic, banking, and business terminology for beginners.",
      bookDetails: { dimensions: "6 x 9 inches", pages: 250, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/economics.jpg",
      price: 700,
      order: 5,
      categoryId: 3,
      whoShouldReadThis: [
        "Economics students and learners",
        "Business professionals",
        "Finance enthusiasts",
        "Anyone interested in economic concepts",
      ],
      whatYouWillLearn: [
        "Essential economic terminology",
        "Banking and financial concepts",
        "Business and commerce basics",
        "Market dynamics and economic indicators",
      ],
      recommendedBooks: [
        { id: "book-3", title: "The Political Science Companion", cover: "/images/political-science.jpg", price: 1050 },
        { id: "book-6", title: "Handbook on Union Budget", cover: "/images/budget.jpg", price: 400 },
      ],
    },
    {
      title: "Handbook on Union Budget",
      author: "Editorial Team",
      authorDescription: "Public finance experts.",
      badge: "Recommended",
      bookDescription: "Explains India's budget process, constitutional framework, and financial governance.",
      bookDetails: { dimensions: "6 x 9 inches", pages: 220, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/budget.jpg",
      price: 400,
      order: 6,
      categoryId: 3,
      whoShouldReadThis: [
        "Government employees and civil servants",
        "Economics and public policy students",
        "Indian citizens interested in budget allocation",
        "Finance professionals",
      ],
      whatYouWillLearn: [
        "Indian budget process and timeline",
        "Constitutional financial provisions",
        "Budget allocation and expenditure",
        "Fiscal policy and government finances",
      ],
      recommendedBooks: [
        { id: "book-5", title: "Handbook of Economic Terminology", cover: "/images/economics.jpg", price: 700 },
      ],
    },
    {
      title: "Climate Change: A Human Development Perspective",
      author: "Editorial Team",
      authorDescription: "Environmental and sustainability researchers.",
      badge: "Hot",
      bookDescription: "Covers global warming, sustainability, and international climate initiatives.",
      bookDetails: { dimensions: "6 x 9 inches", pages: 320, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/climate.jpg",
      price: 850,
      order: 7,
      categoryId: 2,
      whoShouldReadThis: [
        "Climate change advocates and researchers",
        "Development professionals",
        "Policy makers in environmental sectors",
        "Socially conscious readers",
      ],
      whatYouWillLearn: [
        "Climate change impacts on human development",
        "Sustainable development approaches",
        "Global warming mitigation strategies",
        "International climate agreements",
      ],
      recommendedBooks: [
        { id: "book-1", title: "The Essential Green Handbook", cover: "/images/green-handbook.jpg", price: 900 },
        { id: "book-11", title: "Sustainable Development: A Human Development Perspective", cover: "/images/sustainable.jpg", price: 950 },
      ],
    },
    {
      title: "What If I Was a Bird?",
      author: "Darshita",
      authorDescription: "A young writer exploring imagination and philosophy.",
      badge: "Featured",
      bookDescription: "A reflective journey exploring life, emotions, and societal thoughts.",
      bookDetails: { dimensions: "5 x 8 inches", pages: 180, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/bird.jpg",
      price: 550,
      order: 8,
      categoryId: 5,
      whoShouldReadThis: [
        "Philosophy enthusiasts and deep thinkers",
        "Readers seeking introspective narratives",
        "Young adults exploring life's big questions",
        "Literature lovers",
      ],
      whatYouWillLearn: [
        "Perspective shifts through metaphorical storytelling",
        "Philosophical reflections on existence",
        "Emotional intelligence and self-awareness",
        "Creative thinking and imagination",
      ],
      recommendedBooks: [
        { id: "book-14", title: "Daily Inspirations: A Tapestry of Wisdom", cover: "/images/wisdom1.jpg", price: 500 },
        { id: "book-15", title: "Echoes of Insight: A Diverse Collection of Wisdom", cover: "/images/wisdom2.jpg", price: 500 },
      ],
    },
    {
      title: "A Lexicon of Contemporary Existential Issues",
      author: "Editorial Team",
      authorDescription: "Experts in global issues, AI, and sustainability.",
      badge: "New",
      bookDescription: "A glossary of modern topics including AI, climate change, and cryptocurrency.",
      bookDetails: { dimensions: "6 x 9 inches", pages: 400, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/lexicon.jpg",
      price: 1150,
      order: 9,
      categoryId: 4,
      whoShouldReadThis: [
        "Technology enthusiasts and innovators",
        "Students of contemporary issues",
        "Business leaders and entrepreneurs",
        "Anyone interested in modern challenges",
      ],
      whatYouWillLearn: [
        "Artificial intelligence and its implications",
        "Blockchain and cryptocurrency concepts",
        "Climate change and environmental issues",
        "Emerging technologies and their impact",
      ],
      recommendedBooks: [
        { id: "book-10", title: "Handbook of Computer Science, AI, Cryptocurrency & Industry 4.0", cover: "/images/ai.jpg", price: 900 },
      ],
    },
    {
      title: "Handbook of Computer Science, AI, Cryptocurrency & Industry 4.0",
      author: "Editorial Team",
      authorDescription: "Technology educators and researchers.",
      badge: "Trending",
      bookDescription: "Covers computer science, AI, blockchain, and quantum technologies.",
      bookDetails: { dimensions: "6 x 9 inches", pages: 420, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/ai.jpg",
      price: 900,
      order: 10,
      categoryId: 4,
      whoShouldReadThis: [
        "Computer science students and professionals",
        "Tech entrepreneurs and startups",
        "Finance professionals interested in blockchain",
        "Future technologists",
      ],
      whatYouWillLearn: [
        "Fundamentals of computer science",
        "Artificial intelligence and machine learning",
        "Blockchain and cryptocurrency technology",
        "Industry 4.0 and digital transformation",
      ],
      recommendedBooks: [
        { id: "book-9", title: "A Lexicon of Contemporary Existential Issues", cover: "/images/lexicon.jpg", price: 1150 },
        { id: "book-12", title: "Handbook of Biological Science and Genetics", cover: "/images/biology.jpg", price: 600 },
      ],
    },
    {
      title: "Sustainable Development: A Human Development Perspective",
      author: "Editorial Team",
      authorDescription: "Experts in sustainability and global development.",
      badge: "Recommended",
      bookDescription: "Explores sustainability frameworks, SDGs, and global development strategies.",
      bookDetails: { dimensions: "6 x 9 inches", pages: 300, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/sustainable.jpg",
      price: 950,
      order: 11,
      categoryId: 2,
      whoShouldReadThis: [
        "Sustainability professionals and consultants",
        "Development workers and NGO staff",
        "Policy makers and government officials",
        "Students of international development",
      ],
      whatYouWillLearn: [
        "Sustainable Development Goals (SDGs)",
        "Sustainability frameworks and principles",
        "Global development strategies",
        "Environmental and social impact assessment",
      ],
      recommendedBooks: [
        { id: "book-1", title: "The Essential Green Handbook", cover: "/images/green-handbook.jpg", price: 900 },
        { id: "book-7", title: "Climate Change: A Human Development Perspective", cover: "/images/climate.jpg", price: 850 },
      ],
    },
    {
      title: "Handbook of Biological Science and Genetics",
      author: "Editorial Team",
      authorDescription: "Researchers in biology and genetics.",
      badge: "New",
      bookDescription: "Covers biological sciences, genetics, and modern scientific developments.",
      bookDetails: { dimensions: "6 x 9 inches", pages: 280, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/biology.jpg",
      price: 600,
      order: 12,
      categoryId: 4,
      whoShouldReadThis: [
        "Biology students and life sciences researchers",
        "Genetics enthusiasts",
        "Medical and healthcare professionals",
        "Science educators",
      ],
      whatYouWillLearn: [
        "Fundamentals of biological sciences",
        "Genetics and molecular biology",
        "Evolution and biodiversity",
        "Modern scientific developments in life sciences",
      ],
      recommendedBooks: [
        { id: "book-10", title: "Handbook of Computer Science, AI, Cryptocurrency & Industry 4.0", cover: "/images/ai.jpg", price: 900 },
      ],
    },
    {
      title: "A Book of Quiz & Quote",
      author: "Editorial Team",
      authorDescription: "Content creators for knowledge and inspiration.",
      badge: "Fun",
      bookDescription: "A collection of quizzes and quotes for learning and entertainment.",
      bookDetails: { dimensions: "5 x 8 inches", pages: 200, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/quiz.jpg",
      price: 900,
      order: 13,
      categoryId: 1,
      whoShouldReadThis: [
        "Quiz enthusiasts and competitive exam takers",
        "Trivia lovers",
        "Readers seeking bite-sized knowledge",
        "Students of all ages",
      ],
      whatYouWillLearn: [
        "General knowledge and facts",
        "Trivia and interesting information",
        "Learning through questions and answers",
        "Motivational and inspiring quotes",
      ],
      recommendedBooks: [
        { id: "book-2", title: "The Mega Book of Facts", cover: "/images/mega-facts.jpg", price: 1650 },
      ],
    },
    {
      title: "Daily Inspirations: A Tapestry of Wisdom",
      author: "Editorial Team",
      authorDescription: "Curators of motivational and inspirational content.",
      badge: "Popular",
      bookDescription: "A collection of quotes offering motivation, clarity, and wisdom.",
      bookDetails: { dimensions: "5 x 8 inches", pages: 220, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/wisdom1.jpg",
      price: 500,
      order: 14,
      categoryId: 5,
      whoShouldReadThis: [
        "Seekers of daily wisdom and inspiration",
        "Meditation and mindfulness practitioners",
        "Self-help enthusiasts",
        "Readers needing daily motivation",
      ],
      whatYouWillLearn: [
        "Daily wisdom and life lessons",
        "Motivational perspectives on challenges",
        "Personal growth and reflection",
        "Inspiring thoughts from great thinkers",
      ],
      recommendedBooks: [
        { id: "book-15", title: "Echoes of Insight: A Diverse Collection of Wisdom", cover: "/images/wisdom2.jpg", price: 500 },
        { id: "book-16", title: "Reflections on Existence: A Journey Through Life", cover: "/images/wisdom3.jpg", price: 500 },
      ],
    },
    {
      title: "Echoes of Insight: A Diverse Collection of Wisdom",
      author: "Editorial Team",
      authorDescription: "Writers compiling philosophical and societal insights.",
      badge: "New",
      bookDescription: "A curated collection of quotes on life, society, and human experience.",
      bookDetails: { dimensions: "5 x 8 inches", pages: 220, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/wisdom2.jpg",
      price: 500,
      order: 15,
      categoryId: 5,
      whoShouldReadThis: [
        "Philosophy enthusiasts",
        "Reflective readers",
        "Social thinkers and observers",
        "Personal development seekers",
      ],
      whatYouWillLearn: [
        "Philosophical insights on society",
        "Perspectives on human nature",
        "Deep reflections on life",
        "Wisdom from diverse sources",
      ],
      recommendedBooks: [
        { id: "book-14", title: "Daily Inspirations: A Tapestry of Wisdom", cover: "/images/wisdom1.jpg", price: 500 },
        { id: "book-16", title: "Reflections on Existence: A Journey Through Life", cover: "/images/wisdom3.jpg", price: 500 },
      ],
    },
    {
      title: "Reflections on Existence: A Journey Through Life",
      author: "Editorial Team",
      authorDescription: "Philosophical writers and thinkers.",
      badge: "New",
      bookDescription: "Explores life, innovation, society, and human nature through curated quotes.",
      bookDetails: { dimensions: "5 x 8 inches", pages: 220, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/wisdom3.jpg",
      price: 500,
      order: 16,
      categoryId: 5,
      whoShouldReadThis: [
        "Existential thinkers",
        "Philosophy students",
        "Readers exploring life's meaning",
        "Creative and introspective individuals",
      ],
      whatYouWillLearn: [
        "Existential philosophy concepts",
        "Perspectives on human existence",
        "Innovation and societal evolution",
        "Quotes for contemplation",
      ],
      recommendedBooks: [
        { id: "book-14", title: "Daily Inspirations: A Tapestry of Wisdom", cover: "/images/wisdom1.jpg", price: 500 },
        { id: "book-8", title: "What If I Was a Bird?", cover: "/images/bird.jpg", price: 550 },
      ],
    },
    {
      title: "An Introduction to Women Nobel Laureates",
      author: "Editorial Team",
      authorDescription: "Researchers in global history and achievements.",
      badge: "Upcoming",
      bookDescription: "Profiles women Nobel laureates across different fields.",
      bookDetails: { dimensions: "6 x 9 inches", pages: 300, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/nobel-women.jpg",
      price: 900,
      order: 17,
      categoryId: 1,
      whoShouldReadThis: [
        "History enthusiasts and scholars",
        "Students of women's achievements",
        "Science and nobel prize followers",
        "Inspirational biography readers",
      ],
      whatYouWillLearn: [
        "Stories of women Nobel laureates",
        "Their scientific and humanitarian contributions",
        "Women in science and peace",
        "Historical achievements and impact",
      ],
      recommendedBooks: [
        { id: "book-18", title: "An Introduction to Chemistry Nobel Laureates", cover: "/images/nobel-chem.jpg", price: 2850 },
        { id: "book-19", title: "An Introduction to Physics Nobel Laureates", cover: "/images/nobel-physics.jpg", price: 2850 },
      ],
    },
    {
      title: "An Introduction to Chemistry Nobel Laureates",
      author: "Editorial Team",
      authorDescription: "Science historians and researchers.",
      badge: "Upcoming",
      bookDescription: "Covers Nobel Prize winners in chemistry and their contributions.",
      bookDetails: { dimensions: "6 x 9 inches", pages: 400, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/nobel-chem.jpg",
      price: 2850,
      order: 18,
      categoryId: 4,
      whoShouldReadThis: [
        "Chemistry students and researchers",
        "Nobel Prize history enthusiasts",
        "Science educators and academics",
        "History of science readers",
      ],
      whatYouWillLearn: [
        "Chemistry breakthroughs and discoveries",
        "Nobel laureates in chemistry",
        "Development of chemical sciences",
        "Impact on modern chemistry",
      ],
      recommendedBooks: [
        { id: "book-19", title: "An Introduction to Physics Nobel Laureates", cover: "/images/nobel-physics.jpg", price: 2850 },
        { id: "book-12", title: "Handbook of Biological Science and Genetics", cover: "/images/biology.jpg", price: 600 },
      ],
    },
    {
      title: "An Introduction to Physics Nobel Laureates",
      author: "Editorial Team",
      authorDescription: "Physics educators and historians.",
      badge: "Upcoming",
      bookDescription: "Highlights achievements of Nobel laureates in physics.",
      bookDetails: { dimensions: "6 x 9 inches", pages: 400, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/nobel-physics.jpg",
      price: 2850,
      order: 19,
      categoryId: 4,
      whoShouldReadThis: [
        "Physics students and researchers",
        "Science history buffs",
        "Nobel Prize award followers",
        "Scientists and academics",
      ],
      whatYouWillLearn: [
        "Major physics discoveries",
        "Nobel laureates' contributions",
        "Evolution of physics knowledge",
        "Impact on modern science and technology",
      ],
      recommendedBooks: [
        { id: "book-18", title: "An Introduction to Chemistry Nobel Laureates", cover: "/images/nobel-chem.jpg", price: 2850 },
        { id: "book-20", title: "An Introduction to Peace Nobel Laureates", cover: "/images/nobel-peace.jpg", price: 2850 },
      ],
    },
    {
      title: "An Introduction to Peace Nobel Laureates",
      author: "Editorial Team",
      authorDescription: "Experts in global peace and international relations.",
      badge: "Upcoming",
      bookDescription: "Documents Nobel Peace Prize winners and their contributions.",
      bookDetails: { dimensions: "6 x 9 inches", pages: 400, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/nobel-peace.jpg",
      price: 2850,
      order: 20,
      categoryId: 3,
      whoShouldReadThis: [
        "Peace activists and humanitarian workers",
        "International relations students",
        "History and global affairs enthusiasts",
        "Readers inspired by peace builders",
      ],
      whatYouWillLearn: [
        "Nobel Peace Prize winners' stories",
        "Global peace initiatives",
        "Humanitarian contributions",
        "International conflict resolution",
      ],
      recommendedBooks: [
        { id: "book-3", title: "The Political Science Companion", cover: "/images/political-science.jpg", price: 1050 },
        { id: "book-21", title: "An Introduction to Literature Nobel Laureates", cover: "/images/nobel-literature.jpg", price: 1900 },
      ],
    },
    {
      title: "An Introduction to Literature Nobel Laureates",
      author: "Editorial Team",
      authorDescription: "Literature scholars and researchers.",
      badge: "Upcoming",
      bookDescription: "Explores Nobel laureates in literature and their works.",
      bookDetails: { dimensions: "6 x 9 inches", pages: 350, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/nobel-literature.jpg",
      price: 1900,
      order: 21,
      categoryId: 1,
      whoShouldReadThis: [
        "Literature enthusiasts and scholars",
        "Readers of world literature",
        "Creative writers",
        "Nobel Prize followers",
      ],
      whatYouWillLearn: [
        "Nobel Prize-winning literary works",
        "Authors' contributions to literature",
        "Global literary perspectives",
        "Impact of literature on society",
      ],
      recommendedBooks: [
        { id: "book-17", title: "An Introduction to Women Nobel Laureates", cover: "/images/nobel-women.jpg", price: 900 },
        { id: "book-22", title: "An Introduction to Economic Science Nobel Laureates", cover: "/images/nobel-economics.jpg", price: 1450 },
      ],
    },
    {
      title: "An Introduction to Economic Science Nobel Laureates",
      author: "Editorial Team",
      authorDescription: "Economics researchers and analysts.",
      badge: "Upcoming",
      bookDescription: "Covers Nobel laureates in economics and their theories.",
      bookDetails: { dimensions: "6 x 9 inches", pages: 350, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/nobel-economics.jpg",
      price: 1450,
      order: 22,
      categoryId: 3,
      whoShouldReadThis: [
        "Economics students and professionals",
        "Business leaders and entrepreneurs",
        "Policy makers and analysts",
        "Economics Nobel Prize followers",
      ],
      whatYouWillLearn: [
        "Economic theories and frameworks",
        "Nobel laureates' contributions",
        "Modern economic concepts",
        "Impact on global economics",
      ],
      recommendedBooks: [
        { id: "book-5", title: "Handbook of Economic Terminology", cover: "/images/economics.jpg", price: 700 },
        { id: "book-6", title: "Handbook on Union Budget", cover: "/images/budget.jpg", price: 400 },
      ],
    },
  ]
  books.forEach((b) => {
    batch.set(doc(collection(db, "books"), `book-${b.order}`), b)
  })

  // Recommended
  const recommended = [
    { title: "The Silent Garden", author: "Elena Morales", rating: 5, review: "A beautifully written meditation on solitude and growth.", cover: "/images/book-cover-1.jpg" },
    { title: "Letters to Nowhere", author: "James Whitfield", rating: 4, review: "Deeply moving epistolary fiction that lingers long after.", cover: "/images/book-cover-2.jpg" },
    { title: "Verdant Reverie", author: "Ava Chen", rating: 5, review: "Lush prose and vivid imagery — an absolute gem.", cover: "/images/book-cover-3.jpg" },
    { title: "Midnight Folio", author: "Oscar Beaumont", rating: 4, review: "A masterclass in atmospheric storytelling.", cover: "/images/book-cover-4.jpg" },
  ]
  recommended.forEach((r, i) => {
    batch.set(doc(collection(db, "recommended"), `rec-${i + 1}`), { ...r, order: i + 1 })
  })

  // Blogs
  const blogs = [
    { title: "10 Books to Read Before Spring", excerpt: "Our editors share their top picks for the season — from literary fiction to thought-provoking essays.", date: "2026-02-15", image: "/images/blog-1.jpg", link: "#" },
    { title: "Building a Reading Habit That Sticks", excerpt: "Practical tips from avid readers on how to make reading a consistent part of your daily life.", date: "2026-02-08", image: "/images/blog-2.jpg", link: "#" },
    { title: "Why Independent Bookstores Matter", excerpt: "A love letter to the local bookshop and its irreplaceable role in our literary culture.", date: "2026-01-30", image: "/images/blog-3.jpg", link: "#" },
  ]
  blogs.forEach((b, i) => {
    batch.set(doc(collection(db, "blogs"), `blog-${i + 1}`), b)
  })

  await batch.commit()
  console.log("Firestore seeded successfully.")
  process.exit(0)
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
