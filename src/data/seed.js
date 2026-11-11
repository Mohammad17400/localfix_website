export const AREAS = [
  "Shahr-e Naw",
  "Wazir Akbar Khan",
  "Karte Parwan",
  "Taimani",
  "Karte Se",
];
export const categories = [
  {
    id: "plumbing",
    name: "Plumbing",
    description: "Leaks, taps & everything in between",
    icon: "Droplets",
    color: "#dceef4",
    isActive: true,
  },
  {
    id: "electrical",
    name: "Electrical Work",
    description: "A brighter, safer home",
    icon: "Zap",
    color: "#f9edc9",
    isActive: true,
  },
  {
    id: "cleaning",
    name: "Cleaning",
    description: "A fresh start for your space",
    icon: "Sparkles",
    color: "#e7e6f4",
    isActive: true,
  },
  {
    id: "appliance",
    name: "Appliance Repair",
    description: "Get everyday essentials working",
    icon: "WashingMachine",
    color: "#f4e2d7",
    isActive: true,
  },
];
const names = [
  "Ahmad Rahimi",
  "Farid Azizi",
  "Omar Safi",
  "Bilal Noori",
  "Hamid Ahmadi",
  "Yusuf Karimi",
  "Nadia Amiri",
  "Sahar Rahmani",
  "Maryam Safi",
  "Wahid Hakimi",
  "Zubair Noor",
  "Nasir Habibi",
];
const tasks = [
  "Tap & leak repair",
  "Bathroom plumbing",
  "Pipe maintenance",
  "Lighting installation",
  "Socket & switch repair",
  "Home electrical check",
  "Home deep cleaning",
  "Kitchen & bathroom clean",
  "Apartment cleaning",
  "Washing machine repair",
  "Refrigerator diagnosis",
  "Oven & cooker repair",
];
const bios = [
  "Careful repairs and clear explanations. I help households resolve leaks and keep their plumbing working smoothly.",
  "From a dripping tap to a bathroom refresh, I take time to understand the problem and leave a tidy workspace.",
  "Practical maintenance for the pipes you depend on every day. I explain the work before getting started.",
  "Thoughtful lighting and electrical maintenance for comfortable homes. A neat finish is part of every visit.",
  "Friendly help with everyday electrical problems, including sockets, switches and household lighting.",
  "I help identify common household electrical issues and explain the next steps in plain language.",
  "A detail-focused approach to fresh, comfortable homes. Choose a cleaning service that fits your space.",
  "Careful cleaning for the busiest rooms in your home, with an emphasis on the details that make a difference.",
  "Reliable apartment cleaning, from routine tidying to a thorough refresh before guests arrive.",
  "Patient diagnosis and practical appliance repairs. I explain the issue and discuss parts before proceeding.",
  "Helping households understand refrigerator faults and choose a sensible repair approach.",
  "Bringing everyday kitchen appliances back into use with clear explanations and careful work.",
];
export function localDate(offset = 0) {
  const d = new Date(Date.now() + offset * 86400000);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kabul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}
export function createSeed() {
  const users = [
    {
      id: "customer-1",
      name: "Mohammad Abdali",
      email: "mohammad@example.test",
      role: "customer",
      area: AREAS[0],
    },
    {
      id: "customer-2",
      name: "Laila Hamidi",
      email: "laila@example.test",
      role: "customer",
      area: AREAS[1],
    },
    {
      id: "admin-1",
      name: "LocalFix Admin",
      email: "admin@example.test",
      role: "admin",
      area: AREAS[0],
    },
    ...names.map((name, i) => ({
      id: `user-${i + 1}`,
      name,
      email: `provider${i + 1}@example.test`,
      role: "provider",
      area: AREAS[i % 5],
    })),
  ];
  const providers = names.map((name, i) => ({
    id: `provider-${i + 1}`,
    userId: `user-${i + 1}`,
    name,
    bio: bios[i],
    experienceYears: 3 + ((i * 3) % 10),
    serviceAreas: [AREAS[i % 5], AREAS[(i + 1) % 5], AREAS[0]].filter(
      (x, n, a) => a.indexOf(x) === n,
    ),
    photo: `assets/avatar-${i >= 6 && i <= 8 ? i + 1 : (i % 6) + 1}.svg`,
    isActive: true,
  }));
  const services = names.map((_, i) => ({
    id: `service-${i + 1}`,
    providerId: `provider-${i + 1}`,
    categoryId: categories[Math.floor(i / 3)].id,
    title: tasks[i],
    description: `${tasks[i]} with a clear explanation of the work. Please describe your needs when requesting a visit. Any additional parts or work will be discussed before proceeding.`,
    price: [650, 950, 800, 700, 500, 1000, 1500, 900, 1200, 1100, 850, 900][i],
    pricingBasis: i >= 9 ? "starting from" : i >= 6 ? "fixed" : "starting from",
    estimatedDuration: "1–2 hours",
    isActive: true,
  }));
  const requests = [],
    reviews = [];
  providers.forEach((p, i) => {
    for (let j = 0; j < 2; j++) {
      const s = services[i],
        id = `seed-${i + 1}-${j}`,
        customerId = j ? "customer-2" : "customer-1",
        createdAt = new Date(Date.now() - (8 + j) * 86400000).toISOString();
      requests.push({
        id,
        customerId,
        providerId: p.id,
        serviceId: s.id,
        serviceSnapshot: {
          title: s.title,
          price: s.price,
          pricingBasis: s.pricingBasis,
          providerName: p.name,
        },
        problem: "Home maintenance visit completed as requested.",
        area: p.serviceAreas[0],
        address: "Example Street, House 12",
        preferredDate: localDate(-7 - j),
        preferredTime: "10:00",
        status: "completed",
        createdAt,
        updatedAt: createdAt,
        statusHistory: [
          { status: "pending", at: createdAt, actor: customerId },
          { status: "accepted", at: createdAt, actor: p.userId },
          { status: "in_progress", at: createdAt, actor: p.userId },
          { status: "completed", at: createdAt, actor: p.userId },
        ],
      });
      reviews.push({
        id: `review-${i}-${j}`,
        requestId: id,
        customerId,
        providerId: p.id,
        rating: (i + j) % 4 === 0 ? 4 : 5,
        comment: j
          ? "Clear communication and a tidy finish. A helpful experience."
          : "The work was explained clearly and completed with care.",
        createdAt,
      });
    }
  });
  const s = services[0],
    createdAt = new Date().toISOString();
  requests.unshift({
    id: "REQ-1001",
    customerId: "customer-1",
    providerId: "provider-1",
    serviceId: s.id,
    serviceSnapshot: {
      title: s.title,
      price: s.price,
      pricingBasis: s.pricingBasis,
      providerName: providers[0].name,
    },
    problem: "The kitchen tap keeps dripping after it is switched off.",
    area: AREAS[0],
    address: "Example Street, House 12",
    preferredDate: localDate(2),
    preferredTime: "10:00",
    status: "pending",
    createdAt,
    updatedAt: createdAt,
    statusHistory: [{ status: "pending", at: createdAt, actor: "customer-1" }],
  });
  return {
    version: 1,
    users,
    categories: structuredClone(categories),
    providers,
    services,
    requests,
    reviews,
    favorites: [],
    sessionId: null,
  };
}
