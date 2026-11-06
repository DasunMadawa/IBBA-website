import { currentIbaaForms } from "@shared/currentIbaaForms";

export const media = {
  wordmark: "/manus-storage/ibaa-wordmark_3b38a5b1.webp",
  whiteHouse2026: "/manus-storage/white-house-faith-office-2026-optimized_233c8ff0.webp",
  whiteHouseVesak2026: "/manus-storage/white-house-vesak-june-11-2026_ed4417f7.webp",
  whiteHouse2024: "/manus-storage/white-house-vesak-2024_273bb982.webp",
  studyCircle2026: "/manus-storage/study-circle-aug-2026-fixed_8f9f529d.webp",
  watLaoSeptember2026: "/manus-storage/ibaa-wat-lao-2026-09-12-group_bef364aa.webp",
  hsiLaiSeptember2026: "/manus-storage/ibaa-hsi-lai-2026-09-26-group_f78b7132.webp",
  dhammaVijayaOctober2026: "/manus-storage/ibaa-dhamma-vijaya-2026-10-10-group_5c421399.webp",
  gwuOctober2026: "/manus-storage/ibaa-gwu-2026-10-17-group_62992065.webp",
  theravadaThailand: "/manus-storage/theravada-wat-khung-taphao-2009_f4447fee.webp",
  mahayanaChionIn: "/manus-storage/mahayana-chion-in-new-year-2019_c0f0f072.jpg",
} as const;

export type TraditionWorld = {
  id: string;
  label: string;
  title: string;
  summary: string;
  contexts: string[];
  sourceIds: number[];
};

export const traditionWorlds: TraditionWorld[] = [
  {
    id: "theravada-worlds",
    label: "Theravada worlds",
    title: "Pali traditions across South and Southeast Asia",
    summary: "Theravada is a living family shaped by monastic and lay communities, scripture and commentary, generosity, precepts, ritual, devotion, meditation, festivals, and local histories.",
    contexts: ["Sri Lankan", "Burmese / Myanmar", "Thai", "Cambodian", "Lao", "South Asian and diasporic communities"],
    sourceIds: [1, 3],
  },
  {
    id: "east-asian-worlds",
    label: "East Asian Mahayana worlds",
    title: "Many lineages, languages, practices, and institutions",
    summary: "Mahayana includes numerous Chinese, Korean, Japanese, Vietnamese, and transnational traditions. Zen is one important family among many, not a synonym for East Asian Buddhism.",
    contexts: ["Chan · Seon · Zen · Thiền", "Pure Land traditions", "Tiantai · Tendai", "Huayan · Kegon", "Nichiren lineages", "Vinaya, doctrinal, devotional, and humanistic traditions"],
    sourceIds: [1, 3],
  },
  {
    id: "vajrayana-worlds",
    label: "Vajrayana and esoteric worlds",
    title: "Lineage traditions within a wider Mahayana history",
    summary: "Vajrayana developed within Mahayana histories and is especially prominent in Tibetan and Himalayan traditions. Related esoteric traditions also developed beyond Tibet.",
    contexts: ["Nyingma · Kagyu · Sakya · Gelug", "Jonang and other Tibetan traditions", "Bhutanese and Himalayan lineages", "Mongolian Buddhism", "Newar Vajrayana", "Chinese esoteric histories · Japanese Shingon"],
    sourceIds: [1, 2, 7],
  },
  {
    id: "south-asian-continuities",
    label: "South Asian continuities and renewal",
    title: "Living traditions, revivals, and movements for dignity",
    summary: "Buddhist life in South Asia includes long-standing Newar Mahayana-Vajrayana traditions, Theravada communities and revival movements, sacred places, and Ambedkarite or Navayana communities.",
    contexts: ["Newar Buddhism", "Nepalese Theravada", "Sri Lankan continuities", "Indian revival movements", "Ambedkarite / Navayana Buddhism", "Pilgrimage and transnational networks"],
    sourceIds: [5, 8, 9],
  },
  {
    id: "modern-movements",
    label: "Modern and reform movements",
    title: "Multiple Buddhist modernities—not one modern Buddhism",
    summary: "Asian reform, migration, translation, new institutions, social engagement, and digital communication have created many modern Buddhist forms rather than one linear move from tradition to modernity.",
    contexts: ["Humanistic Buddhism", "Engaged Buddhism", "Wŏn Buddhism", "Soka Gakkai and other lay movements", "Insight and vipassana networks", "Secular and digital communities"],
    sourceIds: [5, 6, 10],
  },
  {
    id: "diasporic-worlds",
    label: "Global and diasporic Buddhisms",
    title: "Communities carried through migration, refuge, translation, and encounter",
    summary: "Buddhist communities outside Asia include temples founded by immigrant and refugee communities, transnational monasteries, mixed-heritage sanghas, convert communities, chaplaincy, and culturally specific practice groups.",
    contexts: ["Asian and Asian American temples", "Immigrant and refugee communities", "Black Buddhist communities", "Multiracial and mixed-heritage sanghas", "Chaplaincy and prison Dharma", "Online and transnational communities"],
    sourceIds: [4, 5, 10],
  },
];

export const practicePaths = [
  { title: "Ethics and generosity", text: "Precepts, giving, service, mutual care, and the cultivation of skillful conduct." },
  { title: "Study and teaching", text: "Sutras and suttas, commentaries, oral instruction, liturgy, languages, and lineage education." },
  { title: "Devotion and ritual", text: "Chanting, offerings, refuge, repentance, memorials, sacred objects, and community ceremonies." },
  { title: "Meditation and cultivation", text: "A wide range of contemplative disciplines, often practiced within ethical, devotional, and communal settings." },
  { title: "Pilgrimage and festival", text: "Sacred places, seasonal observances, Vesak, lineage commemorations, and local calendars." },
  { title: "Compassion in public life", text: "Humanitarian service, peacebuilding, chaplaincy, ecological care, and responses to injustice." },
] as const;

export const traditionSources = [
  { id: 1, title: "The major systems and their literature", publisher: "Encyclopaedia Britannica", url: "https://www.britannica.com/topic/Buddhism/The-major-systems-and-their-literature" },
  { id: 2, title: "Mantranaya / Vajrayana: Tantric Buddhism in India", publisher: "Paul Williams with Anthony Tribe", url: "https://sisu.ut.ee/wp-content/uploads/sites/93/tribe_a._mantranaya_vajrayana_-_tantric_buddhism_in_india.pdf" },
  { id: 3, title: "What Is Buddhism?", publisher: "Tricycle Foundation", url: "https://tricycle.org/what-is-buddhism/" },
  { id: 4, title: "Encountering the Buddha: Art and Practice Across Asia", publisher: "Smithsonian National Museum of Asian Art", url: "https://asia-archive.si.edu/exhibition/encountering-the-buddha-art-and-practice-across-asia/" },
  { id: 5, title: "Modern Buddhism", publisher: "Tricycle Foundation", url: "https://tricycle.org/modern-buddhism/" },
  { id: 6, title: "A Future Task for Won Buddhism in America", publisher: "Grace Song, Buddhistdoor Global", url: "https://www.buddhistdoor.net/features/a-future-task-for-won-buddhism-in-america/" },
  { id: 7, title: "The Four Schools of Tibetan Buddhism", publisher: "Namchak", url: "https://www.namchak.org/community/blog/four-schools-of-tibetan-buddhism/" },
  { id: 8, title: "Reconfiguration and Revival: Newar Buddhist Traditions", publisher: "Harvard Mittal Institute", url: "https://mittalsouthasiainstitute.harvard.edu/event/reconfiguration-and-revival-newar-buddhist-traditions-in-the-kathmandu-valley-and-beyond-2/" },
  { id: 9, title: "Online Rituals in Newar Buddhism", publisher: "Tricycle Foundation", url: "https://tricycle.org/article/newar-buddhists/" },
  { id: 10, title: "Introduction: Alternate Buddhist Modernities", publisher: "Journal of Global Buddhism", url: "https://www.globalbuddhism.org/article/download/1273/1110/2435" },
] as const;

export type ArticleRecord = {
  slug: string;
  title: string;
  date: string;
  author: string;
  categories: string[];
  image: string;
  imageAlt: string;
  caption: string;
  credit?: string;
  excerpt: string;
  body: string[];
  legacyUrl: string;
  recordLabel?: string;
  sourceTitle?: string;
  sourceDescription?: string;
  sourceLinkLabel?: string;
  participatingOrganizations?: string[];
};

export const articles: ArticleRecord[] = [
  {
    slug: "white-house-vesak-2026",
    title: "Fifth Annual White House Vesak Lamp Lighting Ceremony",
    date: "2026-06-11",
    author: "IBAA",
    categories: ["Featured", "Festival", "National leadership"],
    image: media.whiteHouseVesak2026,
    imageAlt: "Buddhist delegates from Theravada, Mahayana, and Vajrayana traditions gathered indoors at the Eisenhower Executive Office Building for the 2026 White House Vesak ceremony.",
    caption: "About 26 Buddhist delegates gathered in the Eisenhower Executive Office Building for the Fifth Annual White House Vesak Lamp Lighting Ceremony on June 11, 2026.",
    credit: "Photo published by Honpa Hongwanji Mission of Hawaii, a participating organization",
    excerpt: "IBAA and the White House Faith Office convened Buddhist delegates for the fifth annual Vesak lamp lighting ceremony.",
    body: [
      "On June 11, 2026, the International Buddhist Association of America held the Fifth Annual White House Vesak Lamp Lighting Ceremony in the Eisenhower Executive Office Building on the White House grounds. IBAA President Wangmo Dixey organized the observance with the White House Faith Office. About 26 Buddhist delegates participated, representing Theravada, Mahayana, and Vajrayana traditions.",
      "Delegates came from Thai, Myanmar, Taiwanese, Tibetan, Cambodian, Sri Lankan, Korean, Japanese, and Vietnamese Buddhist communities. The program included Faith Office remarks, lamp lighting by tradition, chanting and prayers for peace, and commemorative photographs. Bishop Marvin Harada lit the Mahayana lamp. Venerable Katugasthota Uparatana and Venerable Heenbunne Kondanna represented Theravada and Sri Lankan communities. Bishop Toshiyuki Umitani and Reverend Kiyonobu Kuwahara also attended with Bishop Harada.",
    ],
    legacyUrl: "https://hongwanjihawaii.com/blog/2026/06/25/hhmh-at-white-house-vesak/",
    recordLabel: "White House Vesak 2026",
    sourceTitle: "Verified 2026 source context",
    sourceDescription: "The group photograph was published by Honpa Hongwanji Mission of Hawaii, one of the participating organizations. This June 11 ceremony is documented separately from IBAA’s April 16 White House Faith Office meeting.",
    sourceLinkLabel: "View the participating organization’s report",
    participatingOrganizations: [
      "IBAA / Dharma College / LBDFI",
      "Odiyana Institute",
      "Tzu Chi Foundation",
      "TDSA / Sitagu, Austin, TX",
      "Buddhist Churches of America",
      "Jodo Shinshu International Office",
      "Honpa Hongwanji Mission of Hawaii",
      "Chùa Điều Ngự (Dieu Ngu Temple)",
      "Ambedkar Association of North America",
      "United Vietnamese Buddhist Congregation of the U.S.",
      "Watt Munisotaram",
      "Sakya",
      "Staten Island Buddhist Vihara",
      "CTU",
      "Sakya Phuntsok Ling",
      "Ragya",
    ],
  },
  {
    slug: "ibaa-white-house-faith-office",
    title: "IBAA leaders meet with the White House Faith Office",
    date: "2026-04-27",
    author: "Allen Tsaur",
    categories: ["Featured", "National leadership"],
    image: media.whiteHouse2026,
    imageAlt: "IBAA monastic and lay leaders gathered on the steps of the Eisenhower Executive Office Building in Washington, DC.",
    caption: "IBAA monastic and lay leaders with White House Faith Office official Jennifer Korn in the White House complex on April 16, 2026.",
    credit: "Official White House photo by Patrick B. Ruddy",
    excerpt: "IBAA monastic and lay leaders met White House Faith Office representatives in Washington, DC.",
    body: [
      "IBAA monastic and lay leaders met with representatives of the White House Faith Office in Washington, DC, on April 16, 2026.",
      "This archive preserves the verified caption, publication date, and official-photo credit from the original IBAA article. Additional editorial context will be added only after review by IBAA leadership.",
    ],
    legacyUrl: "https://www.ibaa.org/index.php/2026/04/27/ibaa-white-house-faith-office/",
  },
  {
    slug: "white-house-vesak-2024",
    title: "Fourth White House Vesak celebration",
    date: "2024-05-23",
    author: "Allen Tsaur",
    categories: ["Featured", "Festival"],
    image: media.whiteHouse2024,
    imageAlt: "Buddhist representatives and Second Gentleman Douglas Emhoff gathered around a Vesak altar at the White House in 2024.",
    caption: "Buddhist representatives gathered for the fourth annual White House Vesak observance in 2024.",
    excerpt: "The legacy IBAA archive records the fourth annual White House Vesak observance.",
    body: [
      "This article preserves the date, featured photograph, and institutional context of IBAA’s legacy record of the 2024 White House Vesak celebration.",
      "The rebuilt archive separates verified source context from new editorial presentation so historical records remain clear and accountable.",
    ],
    legacyUrl: "https://www.ibaa.org/index.php/2024/05/23/white-house-vesak-2024/",
  },
  {
    slug: "ibaa-study-circles",
    title: "IBAA Dharma Study Circles",
    date: "2026-08-20",
    author: "Allen Tsaur",
    categories: ["Study"],
    image: media.studyCircle2026,
    imageAlt: "Participants in an IBAA Dharma Study Circle seated together inside Drikung Kagyu Temple.",
    caption: "Dharma Study Circle at Drikung Kagyu Temple on August 15, 2026.",
    excerpt: "IBAA’s recurring Dharma Study Circles bring Buddhist communities together for learning and fellowship.",
    body: [
      "The legacy IBAA archive records that routine Dharma Study Circles resumed in the greater Washington, DC area in May 2024. The program brings communities together for Dharma teaching, discussion, and fellowship.",
      "The legacy article documents gatherings across Japanese, Tibetan, Vietnamese, Thai, Korean, Sri Lankan, Burmese, Laotian, Taiwanese, and other Buddhist communities. Written meeting records remain the preferred archive for recurring meetings, with video reserved for selected special events.",
    ],
    legacyUrl: "https://www.ibaa.org/index.php/2026/08/20/ibaa-study-circles/",
  },
];

export const studyCircleHosts = [
  { name: "Drikung Kagyu Temple", tradition: "Vajrayana", city: "Fairfax", state: "Virginia", relationship: "Study Circle host", date: "August 15, 2026" },
  { name: "Ekoji Buddhist Temple", tradition: "Mahayana", city: "Fairfax Station", state: "Virginia", relationship: "Study Circle host", date: "January 10, 2026" },
  { name: "International Buddhist Center", tradition: "Theravada", city: "Silver Spring", state: "Maryland", relationship: "Study Circle host", date: "February 14, 2026" },
  { name: "Wat Yarnna Rangsee", tradition: "Theravada", city: "Sterling", state: "Virginia", relationship: "Study Circle host", date: "May 23, 2026" },
  { name: "Won Buddhist Temple", tradition: "Modern / reform", city: "Alexandria", state: "Virginia", relationship: "Study Circle host", date: "April 11, 2026" },
  { name: "Chua Dieu Phap", tradition: "Mahayana", city: "Los Angeles", state: "California", relationship: "Study Circle host", date: "July 25, 2026" },
] as const;

export const studyCircleRegions = [
  {
    id: "washington-dc",
    name: "Washington DC Metro Area",
    records: [
      { date: "2026-12-12", monthYear: "December 2026", temple: "Drikung Dharma Surya Temple", nationality: "Tibetan", yana: "Yana to be confirmed", detail: "Fairfax, VA · December 12, 2026 · Time to be determined" },
      { date: "2026-11-21", monthYear: "November 2026", temple: "Wat Thai", nationality: "Thai", yana: "Yana to be confirmed", detail: "Glenmont, MD · November 21, 2026 · Time to be determined" },
      { date: "2026-10-17", monthYear: "October 2026", temple: "George Washington University", nationality: "University", yana: "Interdenominational", detail: "Washington, DC · October 17, 2026", image: { url: media.gwuOctober2026, altText: "Monastic and lay participants gathered with a Buddha statue at George Washington University in Washington, DC, for the IBAA Dharma Meeting on October 17, 2026.", caption: "IBAA Dharma Meeting - George Washington University, Washington DC Metro Area, Washington, DC - October 17, 2026", width: 1600, height: 899 } },
      { date: "2026-09-12", monthYear: "September 2026", temple: "Wat Lao Buddhavong", nationality: "Laotian", yana: "Theravada", detail: "Catlett, VA · September 12, 2026", image: { url: media.watLaoSeptember2026, altText: "Monastic and lay participants gathered inside Wat Lao Buddhavong, a Laotian Theravada temple in Catlett, Virginia, for the IBAA Dharma Meeting on September 12, 2026.", caption: "IBAA Dharma Meeting - Wat Lao Buddhavong (Laotian, Theravada), Catlett, VA - September 12, 2026", width: 1600, height: 899 } },
      { date: "2026-08-15", monthYear: "August 2026", temple: "Drikung Kagyu Temple", nationality: "Tibetan", yana: "Vajrayana", detail: "August 15, 2026" },
      { date: "2026-07-25", monthYear: "July 2026", temple: "Chua Dieu Phap", nationality: "Vietnamese", yana: "Mahayana", detail: "July 25, 2026" },
      { date: "2026-07-18", monthYear: "July 2026", temple: "Chua Niet Ban", nationality: "Vietnamese", yana: "Mahayana", detail: "July 18, 2026" },
      { date: "2026-06-13", monthYear: "June 2026", temple: "Chua Giac Son", nationality: "Vietnamese", yana: "Mahayana", detail: "June 13, 2026" },
      { date: "2026-05-23", monthYear: "May 2026", temple: "Wat Yarnna Rangsee", nationality: "Thai", yana: "Theravada", detail: "May 23, 2026" },
      { date: "2026-04-11", monthYear: "April 2026", temple: "Won Buddhist Temple", nationality: "Korean", yana: "Mahayana", detail: "April 11, 2026" },
      { date: "2026-03-14", monthYear: "March 2026", temple: "Residence of the late Mr. Souk", nationality: "Nationality to be confirmed", yana: "Yana to be confirmed", detail: "Annandale, Virginia · March 14, 2026" },
      { date: "2026-02-14", monthYear: "February 2026", temple: "International Buddhist Center", nationality: "Sri Lankan", yana: "Theravada", detail: "February 14, 2026" },
      { date: "2026-01-10", monthYear: "January 2026", temple: "Ekoji Jingu", nationality: "Japanese", yana: "Mahayana", detail: "January 10, 2026" },
    ],
  },
  {
    id: "los-angeles",
    name: "Greater Los Angeles Metro Area",
    records: [
      { date: "2026-12-19", monthYear: "December 2026", temple: "Rosemead Monastery", nationality: "Chinese", yana: "Yana to be confirmed", detail: "Los Angeles · December 19, 2026 · Time to be determined" },
      { date: "2026-11-28", monthYear: "November 2026", temple: "Wat Khemara Buddhikarama", nationality: "Cambodian", yana: "Yana to be confirmed", detail: "Long Beach · November 28, 2026 · Time to be determined" },
      { date: "2026-10-10", monthYear: "October 2026", temple: "Dhamma Vijaya Buddhist Temple", nationality: "Sri Lankan", yana: "Theravada", detail: "Los Angeles, CA · October 10, 2026 · 3:00–5:00 pm PT", image: { url: media.dhammaVijayaOctober2026, altText: "Monastic and lay participants gathered inside Dhamma Vijaya Buddhist Temple, a Sri Lankan Theravada temple in Los Angeles, California, for the IBAA Dharma Meeting on October 10, 2026.", caption: "IBAA Dharma Meeting - Dhamma Vijaya Buddhist Temple (Sri Lankan, Theravada), Greater Los Angeles, Los Angeles, CA - October 10, 2026", width: 1600, height: 1200 } },
      { date: "2026-09-26", monthYear: "September 2026", temple: "Fo Guang Shan Hsi Lai Temple", nationality: "Taiwanese", yana: "Mahayana", detail: "Hsi Lai Buddhist Temple · Hacienda Heights, CA · Conference Room · September 26, 2026 · 3:00–5:00 pm PT", image: { url: media.hsiLaiSeptember2026, altText: "Monastic and lay participants gathered in a conference room at Hsi Lai Buddhist Temple, a Taiwanese Mahayana temple in Hacienda Heights, California, for the IBAA Dharma Meeting on September 26, 2026.", caption: "IBAA Dharma Meeting - Hsi Lai Buddhist Temple (Taiwanese, Mahayana), Hacienda Heights, CA - September 26, 2026", width: 1600, height: 1066 } },
      { date: "2026-08-22", monthYear: "August 2026", temple: "Dhammakaya Meditation Center California", nationality: "Thai", yana: "Theravada", detail: "Main Chapel · August 22, 2026 · 3:00–5:00 pm PT", youtubeUrl: "https://www.youtube.com/watch?v=EYgu9HKe2ac", minutesUrl: "/study-circles/minutes/ibaa-interdenominational-study-circle-dhammakaya-meditation-center-california" },
    ],
  },
  {
    id: "san-francisco",
    name: "San Francisco Bay Area",
    records: [
      { date: "2026-10-03", monthYear: "October 2026", temple: "Dharma College", nationality: "Nationality to be confirmed", yana: "Yana to be confirmed", detail: "October 3, 2026 · In-person only · Time to be determined · No video" },
    ],
  },
] as const;

export const recentMeetingHighlights = [
  { date: "2026-09-12", title: "IBAA Dharma Meeting", temple: "Wat Lao Buddhavong", templeDetail: "Laotian Buddhist Temple · Theravada", location: "Catlett, VA", image: media.watLaoSeptember2026, imageAlt: "IBAA Dharma Meeting, Wat Lao Buddhavong, Catlett VA — Sep 12, 2026", caption: "IBAA Dharma Meeting, Wat Lao Buddhavong, Catlett VA — Sep 12, 2026" },
] as const;

export const archivedEvents = [
  { date: "2026-08-15", title: "Dharma Study Circle", venue: "Drikung Kagyu Temple", type: "Study Circle" },
  { date: "2026-07-25", title: "Dharma Study Circle", venue: "Chua Dieu Phap", type: "Study Circle" },
  { date: "2026-04-16", title: "White House Faith Office meeting", venue: "Washington, DC", type: "National leadership" },
  { date: "2024-05-23", title: "Fourth White House Vesak observance", venue: "The White House", type: "Vesak" },
] as const;

export const upcomingMeetings = [
  {
    date: "2026-09-26",
    time: "3:00–5:00 pm PT",
    region: "Los Angeles area",
    venue: "Fo Guang Shan Hsi Lai Temple",
    locationDetail: "Conference Room",
    speakers: [
      "Ven. Ngim Saosamkhan — Theravada, Khemara Buddhikarama Temple",
      "Ven. Hui Ze — Mahayana, Hsi Lai Temple",
      "Ven. Geshe Tenzin Sherap — Vajrayana, Land of Enlightened Wisdom",
    ],
    websites: [
      { label: "www.ibaa.org", url: "https://www.ibaa.org" },
      { label: "www.hsilai.us", url: "https://www.hsilai.us" },
    ],
    image: "/manus-storage/ibaa-study-circle-hsi-lai-2026-09-26_31b00174.png",
    imageAlt: "IBAA Dharma Study Circle flyer for September 26, 2026 at Fo Guang Shan Hsi Lai Temple, showing the three speakers listed on the flyer.",
  },
  {
    date: "2026-10-03",
    time: "Time to be determined",
    region: "San Francisco Bay Area",
    venue: "Dharma College",
    locationDetail: null,
    speakers: [],
    websites: [],
    image: null,
    imageAlt: null,
  },
  {
    date: "2026-10-10",
    time: "3:00–5:00 pm PT",
    region: "Los Angeles area",
    venue: "Dhamma Vijaya Buddhist Temple",
    locationDetail: "Sri Lankan Buddhist Temple · Los Angeles",
    speakers: [],
    websites: [],
    image: null,
    imageAlt: null,
  },
  {
    date: "2026-10-17",
    time: "",
    region: "Washington DC Metro Area",
    venue: "George Washington University",
    locationDetail: "Washington, DC",
    speakers: [],
    websites: [],
    image: null,
    imageAlt: null,
  },
  {
    date: "2026-11-21",
    time: "Time to be determined",
    region: "Washington DC Metro Area",
    venue: "Wat Thai",
    locationDetail: "Thai Buddhist Temple · Glenmont, MD",
    speakers: [],
    websites: [],
    image: null,
    imageAlt: null,
  },
  {
    date: "2026-11-28",
    time: "Time to be determined",
    region: "Los Angeles area",
    venue: "Wat Khemara Buddhikarama",
    locationDetail: "Cambodian Buddhist Temple · Long Beach",
    speakers: [],
    websites: [],
    image: null,
    imageAlt: null,
  },
  {
    date: "2026-12-12",
    time: "Time to be determined",
    region: "Washington DC Metro Area",
    venue: "Drikung Dharma Surya Temple",
    locationDetail: "Tibetan Buddhist Temple · Fairfax, VA",
    speakers: [],
    websites: [],
    image: null,
    imageAlt: null,
  },
  {
    date: "2026-12-19",
    time: "Time to be determined",
    region: "Los Angeles area",
    venue: "Rosemead Monastery",
    locationDetail: "Chinese Buddhist Temple · Los Angeles",
    speakers: [],
    websites: [],
    image: null,
    imageAlt: null,
  },
] as const;

export const externalPress = [
  { year: "2024", date: "June 1", title: "White House Celebrates Vesak in Honour of Buddhists Around the World", publisher: "Daily FT, Sri Lanka", url: "https://www.ft.lk/news/White-House-celebrates-Vesak-in-honour-of-Buddhists-around-the-world/56-762459" },
  { year: "2024", date: "May 29", title: "White House Hosts Buddhist Representatives for Fourth Annual Vesak Observance", publisher: "Buddhistdoor Global", url: "https://www.buddhistdoor.net/news/white-house-hosts-buddhist-representatives-for-fourth-annual-vesak-observance/" },
  { year: "2024", date: "May 15", title: "Light Up Peace Event Invites People of All Faiths to Gather at Washington Monument for Vesak", publisher: "Lion’s Roar", url: "https://www.lionsroar.com/light-up-peace-vesak/" },
  { year: "2023", date: "May 9", title: "Buddhists Welcomed to White House to Celebrate Vesak", publisher: "Buddhistdoor Global", url: "https://www.buddhistdoor.net/news/buddhists-welcomed-to-white-house-to-celebrate-vesak/" },
  { year: "2021", date: "May 27", title: "Making History: Vesak Celebrated at the White House with Candle Offerings", publisher: "Buddhistdoor Global", url: "https://www2.buddhistdoor.net/news/making-history-vesak-celebrated-at-the-white-house-with-candle-offerings" },
] as const;

export const newsClippings = [
  { date: "2026-09-02", dateLabel: "September 2, 2026", title: "IBAA Study Circles", source: "IBAA", summary: "IBAA’s legacy homepage highlighted its updated Dharma Study Circles record alongside the organization’s other public programs and archives. The source remains the organization’s own public publication stream.", url: "https://www.ibaa.org/" },
  { date: "2026-06-25", dateLabel: "June 25, 2026", title: "HHMH Represented at White House Vesak", source: "Honpa Hongwanji Mission of Hawaii", summary: "Honpa Hongwanji Mission of Hawaii reported its participation in the Fifth Annual Vesak Lamp Lighting Ceremony on June 11 at the Eisenhower Executive Office Building. The account identifies Bishop Toshiyuki Umitani, Bishop Marvin Harada, and Rev. Kiyonobu Kuwahara among its participating representatives.", url: "https://hongwanjihawaii.com/blog/2026/06/25/hhmh-at-white-house-vesak/" },
  { date: "2026-06-15", dateLabel: "June 15, 2026", title: "White House Hosts Buddhist Representatives for Fifth Official Vesak Observance", source: "Buddhistdoor Global", summary: "Buddhistdoor Global reported that the June 11 observance brought together 26 Buddhist delegates and leaders in partnership with the White House Faith Office. Its account emphasizes participation from Theravada, Mahayana, and Vajrayana communities and the ceremony’s focus on peace and interfaith understanding.", url: "https://www.buddhistdoor.net/news/white-house-hosts-buddhist-representatives-for-fifth-official-vesak-observance/" },
  { date: "2026-06-13", dateLabel: "June 13, 2026", title: "Vesak festival held at White House in conjunction with international Vesak 2026", source: "Daily Mirror", summary: "Daily Mirror reported that Buddhist clergy and lay participants from Theravada, Mahayana, and Vajrayana traditions gathered in Washington, DC, for the Vesak observance. The report described the event as supporting peace, compassion, and interfaith understanding.", url: "https://www.dailymirror.lk/breaking-news/Vesak-festival-held-at-White-House-in-conjunction-with-international-Vesak-2026/108-342820" },
  { date: "2026-04-27", dateLabel: "April 27, 2026", title: "IBAA leaders meeting with the White House Faith Office", source: "IBAA", summary: "IBAA documented a separate April 16 meeting between monastic and lay leaders and White House Faith Office representatives in Washington, DC. The source credits the official White House photographs to Patrick B. Ruddy; this meeting is not presented as the June 11 Vesak observance.", url: "https://www.ibaa.org/index.php/2026/04/27/ibaa-white-house-faith-office/" },
] as const;

export const documents = [
  { title: "What It Means to Be a Buddhist Youth Today", type: "PDF", url: "/wp-content/uploads/2024/06/IBAA-Paper-What-it-means-to-be-a-Buddhist-Youth-Today.pdf", context: "Youth paper, legacy archive" },
  { title: "IBAA Membership Application", type: "PDF", url: currentIbaaForms.membership, context: "Membership registration form; mailing address updated October 27, 2026" },
  { title: "IBAA Donation Form", type: "PDF", url: currentIbaaForms.donation, context: "Donation form; mailing address updated October 27, 2026" },
] as const;
