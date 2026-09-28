/**
 * Palu Vlogs Initial Seed Data
 */

const categories = [
  { name: 'Road Trips', slug: 'road-trips', description: 'Scooter rides, scenic highways, and unplanned detours across Kerala.', icon: '🛵' },
  { name: 'Pranks & Comedy', slug: 'pranks-comedy', description: 'Vegetable costume bits, public challenges, and unscripted laughs.', icon: '🎭' },
  { name: 'Street Food', slug: 'street-food', description: 'Midnight thatte kada runs, spicy beef fry, and local culinary adventures.', icon: '🍲' },
  { name: 'Backwater Adventures', slug: 'backwaters', description: 'Kayaking, houseboats, and village river escapades.', icon: '🛶' },
  { name: 'Behind the Scenes', slug: 'behind-the-scenes', description: 'Outtakes, costume fittings, and candid campfires.', icon: '🎬' }
];

const tags = [
  { name: 'Vegetable Gang', slug: 'vegetable-gang' },
  { name: 'Kerala', slug: 'kerala' },
  { name: 'Munnar', slug: 'munnar' },
  { name: 'Food Challenge', slug: 'food-challenge' },
  { name: 'Road Trip', slug: 'road-trip' },
  { name: 'Kochi', slug: 'kochi' },
  { name: 'Alleppey', slug: 'alleppey' }
];

const albums = [
  { title: 'Season 2 Road Trips', slug: 'season-2-road-trips', description: 'Scenic highlights and travel moments from our 2026 highway runs.', coverImage: '/assets/images/about_roadtrip.jpg' },
  { title: 'Vegetable Gang Squad', slug: 'vegetable-gang-squad', description: 'Portraits and iconic moments of all 11 vegetable stars in full costume.', coverImage: '/assets/images/hero_team.jpg' },
  { title: 'Behind the Scenes', slug: 'behind-the-scenes', description: 'The unscripted chaos between takes, camera setups, and chai breaks.', coverImage: '/assets/images/reel_4.jpg' },
  { title: 'Street Food & Feasts', slug: 'street-food-feasts', description: 'Thatte kada stops, porotta mountains, and spicy curry reactions.', coverImage: '/assets/images/reel_7.jpg' }
];

const locations = [
  {
    name: 'Munnar Tea Hills',
    state: 'Kerala',
    country: 'India',
    description: 'Foggy hairpins, endless tea plantations, and chilly mountain winds. The location where Drumstick Star lost his costume in the fog.',
    coverImage: '/assets/images/reel_2.jpg',
    coordinates: { lat: 10.0889, lng: 77.0595 },
    visitedDate: 'February 2026'
  },
  {
    name: 'Fort Kochi & Mattancherry',
    state: 'Kerala',
    country: 'India',
    description: 'Colonial lanes, antique spice markets, Chinese fishing nets, and the infamous vegetable market negotiation scene.',
    coverImage: '/assets/images/reel_4.jpg',
    coordinates: { lat: 9.9658, lng: 76.2421 },
    visitedDate: 'January 2026'
  },
  {
    name: 'Alleppey Backwaters',
    state: 'Kerala',
    country: 'India',
    description: 'Serene canals, coconut palm shores, and Coconut Star claiming the best deck chair for 7 straight hours.',
    coverImage: '/assets/images/reel_5.jpg',
    coordinates: { lat: 9.4981, lng: 76.3388 },
    visitedDate: 'March 2026'
  },
  {
    name: 'Wayanad Forest Pass',
    state: 'Kerala',
    country: 'India',
    description: 'Nine hairpins of Thamarassery Churam, wild waterfalls, and a daring midnight tea run in pouring rain.',
    coverImage: '/assets/images/about_roadtrip.jpg',
    coordinates: { lat: 11.6854, lng: 76.1320 },
    visitedDate: 'August 2025'
  }
];

const vlogs = [
  {
    title: 'The Great Eggplant Market Heist',
    slug: 'great-eggplant-market-heist',
    description: 'Brinjal Star decides to test public reactions by walking into a bustling Ernakulam vegetable market in full purple eggplant attire to purchase fresh brinjals from unsuspecting vendors. Pure Malayalam comedy and chaotic bystander interviews!',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnailUrl: '/assets/images/reel_4.jpg',
    duration: '19:24',
    category: 'Pranks & Comedy',
    tags: ['Vegetable Gang', 'Kochi', 'Comedy', 'Prank'],
    locationName: 'Fort Kochi & Mattancherry',
    views: 284500,
    isFeatured: true,
    isPopular: true,
    episodeNumber: 44,
    season: 2,
    publishedAt: new Date('2026-03-01')
  },
  {
    title: 'Munnar Fog & The Lost Drumstick Suit',
    slug: 'munnar-fog-lost-drumstick-suit',
    description: 'Four friends pack onto two scooters for an impromptu weekend road trip up the winding Munnar ghats. Between pouring rain, steaming cups of cardamom chai, and heavy fog at Top Station, Drumstick Star misplaces his costume.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnailUrl: '/assets/images/reel_2.jpg',
    duration: '24:10',
    category: 'Road Trips',
    tags: ['Road Trip', 'Munnar', 'Kerala', 'Vegetable Gang'],
    locationName: 'Munnar Tea Hills',
    views: 412000,
    isFeatured: true,
    isPopular: true,
    episodeNumber: 43,
    season: 2,
    publishedAt: new Date('2026-02-22')
  },
  {
    title: 'Midnight Thatte Kadai Spicy Food Run',
    slug: 'midnight-thatte-kadai-spicy-food-run',
    description: 'Watermelon Star issues a dare: who can finish Kerala double-beef fry with 6 hot layered porottas without taking a single sip of lime soda? Potato Star accepts, and hilarity ensues.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnailUrl: '/assets/images/reel_7.jpg',
    duration: '16:45',
    category: 'Street Food',
    tags: ['Food Challenge', 'Street Food', 'Kerala'],
    locationName: 'Fort Kochi & Mattancherry',
    views: 350200,
    isFeatured: false,
    isPopular: true,
    episodeNumber: 42,
    season: 2,
    publishedAt: new Date('2026-02-15')
  },
  {
    title: 'Alleppey Shikkara Boat Escape with Coconut Star',
    slug: 'alleppey-shikkara-boat-escape',
    description: 'A peaceful boat cruise through the winding backwaters turns into a hilarious debate when Coconut Star decides the canal water is warm enough for an impromptu swim in full coconut gear.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnailUrl: '/assets/images/reel_5.jpg',
    duration: '18:15',
    category: 'Backwater Adventures',
    tags: ['Alleppey', 'Road Trip', 'Vegetable Gang'],
    locationName: 'Alleppey Backwaters',
    views: 198000,
    isFeatured: false,
    isPopular: false,
    episodeNumber: 41,
    season: 2,
    publishedAt: new Date('2026-02-08')
  },
  {
    title: 'Ladies Finger Security Check at the Beach',
    slug: 'ladies-finger-security-check-beach',
    description: 'Cherai beach sunset turns into an official security inspection as Ladies Finger Star establishes an exclusive VIP perimeter for our camp chairs and snack boxes.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnailUrl: '/assets/images/reel_3.jpg',
    duration: '14:32',
    category: 'Pranks & Comedy',
    tags: ['Comedy', 'Kochi', 'Vegetable Gang'],
    locationName: 'Fort Kochi & Mattancherry',
    views: 220000,
    isFeatured: false,
    isPopular: false,
    episodeNumber: 40,
    season: 2,
    publishedAt: new Date('2026-02-01')
  },
  {
    title: 'Cauliflower Star Spiritual Blessing for 100K Subs',
    slug: 'cauliflower-star-blessing-100k-subs',
    description: 'Celebrating 100,000 subscribers on YouTube with a special sunrise prayer, thank-you messages to our viewers, and a retrospective of how one silly vegetable suit became a lifestyle.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnailUrl: '/assets/images/reel_6.jpg',
    duration: '21:05',
    category: 'Behind the Scenes',
    tags: ['Kerala', 'Vegetable Gang', 'Behind the Scenes'],
    locationName: 'Munnar Tea Hills',
    views: 520000,
    isFeatured: false,
    isPopular: true,
    episodeNumber: 39,
    season: 2,
    publishedAt: new Date('2026-01-25')
  }
];

const photos = [
  { title: 'Onion Star Road Debut', caption: 'The moment Onion Star joined the convoy on NH 66.', imageUrl: '/assets/images/reel_1.jpg', albumSlug: 'season-2-road-trips', location: 'Aluva', date: 'Feb 2026', isFeatured: true },
  { title: 'Cabbage on the Hairpins', caption: 'Taking the curves of Munnar in layered green splendor.', imageUrl: '/assets/images/reel_2.jpg', albumSlug: 'season-2-road-trips', location: 'Munnar', date: 'Feb 2026', isFeatured: true },
  { title: 'Security on High Alert', caption: 'Ladies Finger Star guarding the camera bags.', imageUrl: '/assets/images/reel_3.jpg', albumSlug: 'vegetable-gang-squad', location: 'Cherai Beach', date: 'Feb 2026', isFeatured: false },
  { title: 'The Vegetable Market Raid', caption: 'Brinjal Star inspecting actual eggplants in Kochi.', imageUrl: '/assets/images/reel_4.jpg', albumSlug: 'behind-the-scenes', location: 'Ernakulam', date: 'Feb 2026', isFeatured: true },
  { title: 'Hammock Mode Activated', caption: 'Coconut Star in his natural habitat overlooking the backwaters.', imageUrl: '/assets/images/reel_5.jpg', albumSlug: 'season-2-road-trips', location: 'Alleppey', date: 'Jan 2026', isFeatured: false },
  { title: 'Pre-Trip Blessings', caption: 'Cauliflower Star ensuring the weather holds up for shooting.', imageUrl: '/assets/images/reel_6.jpg', albumSlug: 'vegetable-gang-squad', location: 'Munnar', date: 'Jan 2026', isFeatured: true },
  { title: 'Watermelon Feast Challenge', caption: 'Post-ride thatte kada meal with the squad.', imageUrl: '/assets/images/reel_7.jpg', albumSlug: 'street-food-feasts', location: 'Fort Kochi', date: 'Jan 2026', isFeatured: true },
  { title: 'Cameo at the Toll Booth', caption: 'Tomato Star greeting toll plaza attendants.', imageUrl: '/assets/images/reel_8.jpg', albumSlug: 'behind-the-scenes', location: 'Thrissur', date: 'Jan 2026', isFeatured: false },
  { title: 'Pumpkin Director Cut', caption: 'Pumpkin Star setting up the drone for the sunset timelapse.', imageUrl: '/assets/images/reel_9.jpg', albumSlug: 'behind-the-scenes', location: 'Wayanad', date: 'Dec 2025', isFeatured: false },
  { title: 'Potato Star: The Face of Palu', caption: 'The channel mascot doing what he does best: pure vibes.', imageUrl: '/assets/images/reel_10.jpg', albumSlug: 'vegetable-gang-squad', location: 'Kochi', date: 'Dec 2025', isFeatured: true },
  { title: 'The Highway Squad', caption: 'Four friends with one camera, ready for the next 500 km.', imageUrl: '/assets/images/about_roadtrip.jpg', albumSlug: 'season-2-road-trips', location: 'Wayanad Pass', date: 'Aug 2025', isFeatured: true }
];

const siteSettings = {
  channelName: 'Palu Vlogs',
  tagline: 'Oru Palu Vlogs — Vegetable Gang | Fun · Vibes · Memories · Chaos',
  bio: 'Four friends, one camera, and a running vegetable-costume joke that got completely out of hand. Unscripted Kerala road trips, street food runs, and high-energy laughter.',
  profileImage: '/assets/images/logo.jpg',
  coverImage: '/assets/images/hero_team.jpg',
  youtubeUrl: 'https://www.youtube.com/channel/UCoNA4nItu7DK9ziX2wi7VRg?sub_confirmation=1',
  instagramUrl: 'https://instagram.com/paluvlogs',
  whatsappUrl: 'https://whatsapp.com/channel/paluvlogs',
  email: 'contact@paluvlogs.com',
  subscriberCount: '125K',
  totalViews: '4.8M',
  featuredVlogSlug: 'great-eggplant-market-heist'
};

const initialMessages = [
  {
    name: 'Rahul Menon',
    email: 'rahul.menon@example.com',
    subject: 'Collaboration / Road Trip in Wayanad',
    message: 'Hey Palu Vlogs team! Absolutely loved the Munnar episode. We run a boutique tea estate stay in Wayanad and would love to host the Vegetable Gang for a weekend vlog!',
    isRead: false,
    createdAt: new Date('2026-03-05')
  },
  {
    name: 'Anjali Nair',
    email: 'anjali@example.com',
    subject: 'Love from Dubai!',
    message: 'Watching your videos keeps us connected to Kerala. Brinjal Star is our whole family favourite! Please do an episode in Kozhikode for halwa and biryani.',
    isRead: true,
    createdAt: new Date('2026-03-02')
  }
];

module.exports = {
  categories,
  tags,
  albums,
  locations,
  vlogs,
  photos,
  siteSettings,
  initialMessages
};
