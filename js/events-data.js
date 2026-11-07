/**
 * EventPulse - Comprehensive Mock Data for Events
 * Includes dynamic dates (relative to current date) so countdown timers are always live and active!
 */

// Helper to generate dynamic future dates relative to execution
function getFutureDate(daysAhead, hours = 10, minutes = 0) {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    d.setHours(hours, minutes, 0, 0);
    return d.toISOString();
}

const INITIAL_EVENTS = [
    {
        id: "evt-global-ai-summit",
        title: "Global AI & NextGen Tech Summit 2026",
        category: "Tech & AI",
        tagline: "Exploring Frontiers of Generative Intelligence & Quantum Computing",
        shortDescription: "Join 3,000+ AI pioneers, researchers, and tech founders for keynotes, live code labs, and deep dives into autonomous systems.",
        fullDescription: "The Global AI & NextGen Tech Summit brings together the world's leading researchers, engineers, and visionaries shaping the future of artificial intelligence. Discover breakthroughs in foundation models, agentic workflows, quantum algorithms, and ethical AI governance. Featuring over 40 speaking sessions, hands-on workshops, startup pitch showcases, and high-impact networking lounges.",
        targetDate: getFutureDate(5, 9, 30),
        time: "09:30 AM - 06:00 PM EST",
        venue: {
            name: "Metro Innovation Pavilion",
            city: "New York, NY",
            address: "450 W 33rd St, Manhattan",
            type: "In-Person & Hybrid"
        },
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
        price: 99,
        featured: true,
        totalSeats: 350,
        registeredCount: 298,
        tags: ["Artificial Intelligence", "LLMs", "Robotics", "Future of Work"],
        speakers: [
            {
                name: "Dr. Elena Rostova",
                role: "Chief AI Scientist",
                company: "NeuralVanguard Lab",
                avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
            },
            {
                name: "Marcus Vance",
                role: "VP of Autonomous Systems",
                company: "Apex Dynamics",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
            },
            {
                name: "Aria Chen",
                role: "Founding Partner",
                company: "Horizon Ventures AI",
                avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80"
            }
        ],
        agenda: [
            { time: "09:30 AM", title: "Registration, Welcome Breakfast & Badge Pickup" },
            { time: "10:30 AM", title: "Keynote: Beyond Transformers - The Next Leap in Reasoning Models" },
            { time: "12:00 PM", title: "Panel Discussion: Autonomous Agents in Enterprise Operations" },
            { time: "01:30 PM", title: "Executive Networking Lunch & AI Demos" },
            { time: "03:00 PM", title: "Interactive Workshop: Building Production Multi-Agent Systems" },
            { time: "05:00 PM", title: "Startup Pitch Showcase & Award Ceremony" }
        ]
    },
    {
        id: "evt-neon-lights-music-fest",
        title: "Neon Horizon Electronic Music Festival",
        category: "Music & Festivals",
        tagline: "3 Stages, 24 International Artists, Immersive Laser Spectacles",
        shortDescription: "Experience an electric weekend under starlit skies featuring premier electronic artists, holographic visual stages, and artisan food trucks.",
        fullDescription: "Immerse your senses at Neon Horizon, the premier celebration of electronic soundscapes and audiovisual arts. With three custom-engineered sound stages, interactive projection tunnels, ambient chillout gardens, and gourmet artisan vendors, this festival offers a euphoric journey for music lovers worldwide.",
        targetDate: getFutureDate(12, 16, 0),
        time: "04:00 PM - 02:00 AM PST",
        venue: {
            name: "Pacific Shore Open Amphitheater",
            city: "San Diego, CA",
            address: "1200 Bayside Drive, Harbor Island",
            type: "Outdoor Festival Grounds"
        },
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
        price: 65,
        featured: true,
        totalSeats: 1200,
        registeredCount: 1045,
        tags: ["Live Music", "EDM", "Audio-Visual", "Festival", "Nightlife"],
        speakers: [
            {
                name: "KAIROS (Live DJ)",
                role: "Headlining Electronic Producer",
                company: "SoundWave Records",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
            },
            {
                name: "Stella Eclipse",
                role: "Synthesist & Vocalist",
                company: "Lunar Beats Collective",
                avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80"
            }
        ],
        agenda: [
            { time: "04:00 PM", title: "Gates Open & Ambient Sunset Chill Session" },
            { time: "06:30 PM", title: "Mainstage Opening Acts & Visual Flow Launch" },
            { time: "09:00 PM", title: "Holographic Laser Symphony & Headline Sets" },
            { time: "12:00 AM", title: "Midnight B2B After-Hours Showcase" }
        ]
    },
    {
        id: "evt-fintech-disrupt-conference",
        title: "FinTech Disrupt & Venture Conclave",
        category: "Business & Startups",
        tagline: "Decentralized Finance, Cross-Border Payments, and Capital Markets",
        shortDescription: "Meet 500+ angel investors, venture capitalists, and fintech disrupters. Discover seed-stage startups reshaping digital transactions.",
        fullDescription: "FinTech Disrupt gathers modern financial architects, compliance leaders, and early-stage entrepreneurs. Dive into discussions on automated risk analysis, tokenized assets, open banking APIs, and frictionless cross-border remittances. Includes curated 1-on-1 investor matchmaking sessions.",
        targetDate: getFutureDate(8, 10, 0),
        time: "10:00 AM - 05:00 PM CST",
        venue: {
            name: "Centennial Financial Center",
            city: "Chicago, IL",
            address: "200 South Wacker Dr, Loop",
            type: "In-Person Executive Summit"
        },
        image: "https://images.unsplash.com/photo-1559223607-a43c990c692c?auto=format&fit=crop&w=1200&q=80",
        price: 149,
        featured: true,
        totalSeats: 250,
        registeredCount: 210,
        tags: ["FinTech", "Venture Capital", "Banking", "Startups", "Investment"],
        speakers: [
            {
                name: "Julian Rivera",
                role: "Managing Director",
                company: "Northbridge Capital",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
            },
            {
                name: "Sophie Lindqvist",
                role: "Chief Compliance Officer",
                company: "Nordic Pay Global",
                avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"
            }
        ],
        agenda: [
            { time: "10:00 AM", title: "Welcome Address & State of Global FinTech" },
            { time: "11:15 AM", title: "Panel: AI-Powered Underwriting and Fraud Prevention" },
            { time: "01:00 PM", title: "Investor Networking Luncheon" },
            { time: "02:30 PM", title: "Fast-Track Startup Pitch Competition" },
            { time: "04:15 PM", title: "Closing Cocktail Mixer & Deal Flow Lounge" }
        ]
    },
    {
        id: "evt-design-systems-masterclass",
        title: "Product Design & Design Systems Masterclass",
        category: "Design & Creative",
        tagline: "From Token Architecture to Micro-Interactions in Modern UI/UX",
        shortDescription: "An intensive interactive workshop for UX/UI designers and front-end engineers building scalable, accessible, design-led digital products.",
        fullDescription: "Step into an immersive, hands-on masterclass led by design directors from world-class product teams. Learn how to architect robust multi-brand design tokens, build frictionless component libraries, conduct rapid prototype usability tests, and elevate your interface craft.",
        targetDate: getFutureDate(3, 11, 0),
        time: "11:00 AM - 04:30 PM PST",
        venue: {
            name: "Studio Chroma Co-Working Lab",
            city: "Seattle, WA",
            address: "800 Pike Street, Downtown",
            type: "Hands-on Workshop"
        },
        image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80",
        price: 0,
        featured: false,
        totalSeats: 80,
        registeredCount: 74,
        tags: ["UI/UX Design", "Figma", "Design Systems", "Web Accessibility"],
        speakers: [
            {
                name: "Maya Lin",
                role: "Principal Product Designer",
                company: "DesignScale Studio",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
            }
        ],
        agenda: [
            { time: "11:00 AM", title: "Design Systems Architecture: Tokens & Variables" },
            { time: "12:30 PM", title: "Accessibility-First Design Audit Session" },
            { time: "01:30 PM", title: "Catered Lunch & Portfolio Reviews" },
            { time: "02:30 PM", title: "Figma to Code: Automated Handoff & Micro-animations" }
        ]
    },
    {
        id: "evt-urban-wellness-marathon",
        title: "Urban Harmony 10K & Mindful Wellness Expo",
        category: "Health & Fitness",
        tagline: "Scenic City Run, Open-Air Yoga, and Holistic Nutrition Fair",
        shortDescription: "Recharge your mind and body with our annual city marathon, post-race sound baths, recovery smoothie bars, and athletic workshops.",
        fullDescription: "Whether you are a seasoned marathoner or a weekend jogger, Urban Harmony welcomes everyone. Start the morning with an invigorating 10K / 5K scenic run along the waterfront, followed by guided outdoor sound bath meditation, hydration recovery bars, and workshops with sports physiologists.",
        targetDate: getFutureDate(18, 7, 0),
        time: "07:00 AM - 01:00 PM EST",
        venue: {
            name: "Riverside Park Esplanade",
            city: "Boston, MA",
            address: "Charles River Promenade",
            type: "Outdoor Athletic Event"
        },
        image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80",
        price: 25,
        featured: false,
        totalSeats: 500,
        registeredCount: 382,
        tags: ["Marathon", "Wellness", "Yoga", "Fitness", "Outdoor"],
        speakers: [
            {
                name: "Coach David O'Connor",
                role: "Olympic Endurance Trainer",
                company: "Peak Condition Academy",
                avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80"
            }
        ],
        agenda: [
            { time: "07:00 AM", title: "Runner Bib Pickup & Dynamic Warmup Drills" },
            { time: "07:45 AM", title: "10K & 5K Wave Starts" },
            { time: "09:30 AM", title: "Finisher Medals & Electrolyte Station" },
            { time: "10:30 AM", title: "Waterfront Sound Healing Meditation & Yoga Session" },
            { time: "11:30 AM", title: "Nutrition Talks & Healthy Food Stalls" }
        ]
    },
    {
        id: "evt-fullstack-dev-bootcamp",
        title: "Modern Fullstack JavaScript & Cloud Architecture",
        category: "Workshops & Learning",
        tagline: "Build, Test, and Deploy Resilient Web Apps in 1 Day",
        shortDescription: "A code-along intensive covering TypeScript, Modern Frameworks, Serverless Backends, Edge Databases, and Automated CI/CD.",
        fullDescription: "Fast-track your development skills with an all-day coding bootcamp. You'll build and deploy a production-ready application with serverless cloud functions, websocket real-time sync, automated unit tests, and seamless multi-region deployment.",
        targetDate: getFutureDate(9, 10, 0),
        time: "10:00 AM - 04:30 PM CST",
        venue: {
            name: "TechHub Austin Incubator",
            city: "Austin, TX",
            address: "501 Congress Ave, Downtown",
            type: "Interactive Workshop"
        },
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
        price: 0,
        featured: false,
        totalSeats: 100,
        registeredCount: 91,
        tags: ["JavaScript", "Cloud", "Web Development", "Node.js", "Free Event"],
        speakers: [
            {
                name: "Kenji Sato",
                role: "Staff Cloud Architect",
                company: "CloudVibe Infrastructure",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
            }
        ],
        agenda: [
            { time: "10:00 AM", title: "Modern Web Tooling & Environment Setup" },
            { time: "11:30 AM", title: "Building Scalable Edge Microservices" },
            { time: "01:00 PM", title: "Lunch Break & Code Clinics" },
            { time: "02:00 PM", title: "Live Deployments to Vercel & Netlify Pipelines" }
        ]
    },
    {
        id: "evt-indie-film-craft-showcase",
        title: "Indie Cinematography & Storytelling Festival",
        category: "Design & Creative",
        tagline: "Celebrating Independent Directors, Colorists, and Sound Engineers",
        shortDescription: "Screening of 18 award-winning short films, accompanied by Q&A panel sessions with acclaimed indie directors and cinematographers.",
        fullDescription: "Immerse yourself in captivating visual narratives. The Indie Cinematography Festival curates groundbreaking cinematic shorts from emerging filmmakers across five continents. Features director commentary panels, camera gear expos, and networking mixers.",
        targetDate: getFutureDate(15, 17, 30),
        time: "05:30 PM - 10:30 PM PST",
        venue: {
            name: "The Grand Cinema Theatre",
            city: "Los Angeles, CA",
            address: "6801 Hollywood Blvd",
            type: "Screening & Gala"
        },
        image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
        price: 40,
        featured: false,
        totalSeats: 220,
        registeredCount: 165,
        tags: ["Cinema", "Film Production", "Screenwriting", "Arts"],
        speakers: [
            {
                name: "Camille Dubois",
                role: "Director of Photography",
                company: "Lumière Indie Films",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
            }
        ],
        agenda: [
            { time: "05:30 PM", title: "Red Carpet Entry & Welcome Reception" },
            { time: "06:45 PM", title: "First Wave Shorts Screenings" },
            { time: "08:15 PM", title: "Director & Cinematographer Q&A Roundtable" },
            { time: "09:30 PM", title: "Awards Presentation & After-Party Mixer" }
        ]
    },
    {
        id: "evt-green-energy-sustainability",
        title: "CleanTech & Green Climate Horizons 2026",
        category: "Business & Startups",
        tagline: "Innovations in Renewable Power, Carbon Capture, and Circular Economy",
        shortDescription: "Discover actionable sustainability tech, circular materials, and renewable energy financing with global industry thought leaders.",
        fullDescription: "Addressing climate change with pragmatic, scalable technology. Join corporate ESG officers, green energy entrepreneurs, municipal leaders, and cleantech researchers discussing battery innovations, offshore wind grids, smart cities, and sustainable supply chains.",
        targetDate: getFutureDate(21, 9, 0),
        time: "09:00 AM - 05:00 PM EST",
        venue: {
            name: "EcoCenter Conference Hall",
            city: "Denver, CO",
            address: "1701 Champa Street, LoDo",
            type: "Symposium & Green Expo"
        },
        image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80",
        price: 80,
        featured: false,
        totalSeats: 300,
        registeredCount: 215,
        tags: ["CleanTech", "Sustainability", "Renewable Energy", "Climate Action"],
        speakers: [
            {
                name: "Dr. Trevor Ross",
                role: "Chair of Sustainable Energy Systems",
                company: "Pacific Climate Institute",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
            }
        ],
        agenda: [
            { time: "09:00 AM", title: "Keynote: The 2030 Net-Zero Roadmap" },
            { time: "11:00 AM", title: "Exhibition: Breakthrough Cleantech Hardware" },
            { time: "01:00 PM", title: "Green Investors Networking Luncheon" },
            { time: "03:00 PM", title: "Panel: Circular Economy in Consumer Electronics" }
        ]
    }
];

// Export to window for vanilla JS access
window.INITIAL_EVENTS = INITIAL_EVENTS;
