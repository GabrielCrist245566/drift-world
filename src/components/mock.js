// Mock data for the 2D Drift Game
// Enhanced with JDM car collection

export const gameSettings = {
  physics: {
    maxSpeed: 8,
    acceleration: 0.3,
    friction: 0.95,
    turnSpeed: 0.05,
    driftThreshold: 0.3
  },
  scoring: {
    driftMultiplier: 10,
    speedBonus: 2,
    streakBonus: 5
  },
  canvas: {
    width: 800,
    height: 600
  }
};

export const carTypes = [
  {
    id: 1,
    name: "Mazda RX-7 FD",
    description: "Lenda rotativa do drift",
    shape: "rx7",
    category: "JDM Legend",
    maxSpeed: 9.5,
    acceleration: 0.32,
    friction: 0.94,
    handling: 0.055,
    driftMultiplier: 18,
    speedRating: 4,
    accelRating: 4,
    handlingRating: 5,
    driftRating: 5
  },
  {
    id: 2,
    name: "Nissan Skyline R34 GT-R",
    description: "Godzilla do asfalto",
    shape: "r34",
    category: "JDM Legend",
    maxSpeed: 10,
    acceleration: 0.38,
    friction: 0.96,
    handling: 0.048,
    driftMultiplier: 15,
    speedRating: 5,
    accelRating: 5,
    handlingRating: 4,
    driftRating: 4
  },
  {
    id: 3,
    name: "Toyota Supra MK4",
    description: "2JZ, no shit!",
    shape: "supra",
    category: "JDM Legend",
    maxSpeed: 10.5,
    acceleration: 0.35,
    friction: 0.95,
    handling: 0.045,
    driftMultiplier: 16,
    speedRating: 5,
    accelRating: 4,
    handlingRating: 4,
    driftRating: 4
  },
  {
    id: 4,
    name: "Mitsubishi Lancer Evo IX",
    description: "Rally beast das ruas",
    shape: "evo",
    category: "JDM Rally",
    maxSpeed: 8.5,
    acceleration: 0.4,
    friction: 0.97,
    handling: 0.06,
    driftMultiplier: 14,
    speedRating: 3,
    accelRating: 5,
    handlingRating: 5,
    driftRating: 4
  },
  {
    id: 5,
    name: "Subaru Impreza WRX STI",
    description: "Boxer turbo sensation",
    shape: "sti",
    category: "JDM Rally",
    maxSpeed: 8.8,
    acceleration: 0.38,
    friction: 0.96,
    handling: 0.058,
    driftMultiplier: 13,
    speedRating: 4,
    accelRating: 5,
    handlingRating: 5,
    driftRating: 3
  },
  {
    id: 6,
    name: "Honda NSX",
    description: "Precisão japonesa pura",
    shape: "nsx",
    category: "JDM Supercar",
    maxSpeed: 9.8,
    acceleration: 0.33,
    friction: 0.97,
    handling: 0.052,
    driftMultiplier: 12,
    speedRating: 5,
    accelRating: 4,
    handlingRating: 5,
    driftRating: 3
  },
  {
    id: 7,
    name: "Mitsubishi Eclipse GSX",
    description: "Turbinado 4G63",
    shape: "eclipse",
    category: "JDM Sport",
    maxSpeed: 8.2,
    acceleration: 0.34,
    friction: 0.94,
    handling: 0.05,
    driftMultiplier: 16,
    speedRating: 3,
    accelRating: 4,
    handlingRating: 4,
    driftRating: 4
  },
  {
    id: 8,
    name: "Nissan 240SX (S13)",
    description: "Drift machine clássica",
    shape: "s13",
    category: "JDM Drift",
    maxSpeed: 7.8,
    acceleration: 0.3,
    friction: 0.92,
    handling: 0.055,
    driftMultiplier: 20,
    speedRating: 2,
    accelRating: 3,
    handlingRating: 4,
    driftRating: 5
  },
  {
    id: 9,
    name: "Toyota AE86 Corolla",
    description: "Hachiroku drift king",
    shape: "ae86",
    category: "JDM Classic",
    maxSpeed: 7.2,
    acceleration: 0.28,
    friction: 0.91,
    handling: 0.06,
    driftMultiplier: 22,
    speedRating: 2,
    accelRating: 2,
    handlingRating: 5,
    driftRating: 5
  },
  {
    id: 10,
    name: "Honda Civic Type R",
    description: "VTEC kicked in yo!",
    shape: "civic",
    category: "JDM Hot Hatch",
    maxSpeed: 8.0,
    acceleration: 0.36,
    friction: 0.95,
    handling: 0.055,
    driftMultiplier: 11,
    speedRating: 3,
    accelRating: 4,
    handlingRating: 5,
    driftRating: 3
  },
  {
    id: 11,
    name: "Mazda MX-5 Miata",
    description: "Lightweight roadster",
    shape: "miata",
    category: "JDM Roadster",
    maxSpeed: 7.5,
    acceleration: 0.32,
    friction: 0.93,
    handling: 0.065,
    driftMultiplier: 17,
    speedRating: 2,
    accelRating: 3,
    handlingRating: 5,
    driftRating: 4
  },
  {
    id: 12,
    name: "Nissan 350Z",
    description: "VQ35 power",
    shape: "350z",
    category: "JDM Modern",
    maxSpeed: 9.0,
    acceleration: 0.35,
    friction: 0.94,
    handling: 0.05,
    driftMultiplier: 15,
    speedRating: 4,
    accelRating: 4,
    handlingRating: 4,
    driftRating: 4
  }
];

export const carColors = [
  {
    id: 1,
    name: "Championship White",
    primary: "#f8f8ff",
    secondary: "#e6e6fa",
    accent: "#d3d3d3",
    glass: "#87ceeb",
    lights: "#ffff99",
    rims: "#2c3e50"
  },
  {
    id: 2,
    name: "Bayside Blue",
    primary: "#4169e1",
    secondary: "#0000cd",
    accent: "#191970",
    glass: "#87ceeb",
    lights: "#ffff99",
    rims: "#c0c0c0"
  },
  {
    id: 3,
    name: "Sonic Yellow",
    primary: "#ffff00",
    secondary: "#ffd700",
    accent: "#daa520",
    glass: "#87ceeb",
    lights: "#fff700",
    rims: "#2c3e50"
  },
  {
    id: 4,
    name: "Rally Red",
    primary: "#dc143c",
    secondary: "#b22222",
    accent: "#8b0000",
    glass: "#87ceeb",
    lights: "#ffff99",
    rims: "#000000"
  },
  {
    id: 5,
    name: "Midnight Purple",
    primary: "#4b0082",
    secondary: "#663399",
    accent: "#301934",
    glass: "#dda0dd",
    lights: "#da70d6",
    rims: "#c0c0c0"
  },
  {
    id: 6,
    name: "Tokyo Orange",
    primary: "#ff4500",
    secondary: "#ff6347",
    accent: "#cd5c5c",
    glass: "#87ceeb",
    lights: "#ffaa00",
    rims: "#2c3e50"
  },
  {
    id: 7,
    name: "Initial D Silver",
    primary: "#c0c0c0",
    secondary: "#a9a9a9",
    accent: "#696969",
    glass: "#b0c4de",
    lights: "#f0f8ff",
    rims: "#000000"
  },
  {
    id: 8,
    name: "Gunmetal Grey",
    primary: "#2f4f4f",
    secondary: "#708090",
    accent: "#36454f",
    glass: "#708090",
    lights: "#ffffff",
    rims: "#c0c0c0"
  },
  {
    id: 9,
    name: "Neon Green",
    primary: "#39ff14",
    secondary: "#32cd32",
    accent: "#228b22",
    glass: "#87ceeb",
    lights: "#00ff00",
    rims: "#000000"
  },
  {
    id: 10,
    name: "Deep Blue Pearl",
    primary: "#003366",
    secondary: "#4682b4",
    accent: "#1e3a8a",
    glass: "#87ceeb",
    lights: "#87cefa",
    rims: "#c0c0c0"
  },
  {
    id: 11,
    name: "Sunset Orange",
    primary: "#ff8c00",
    secondary: "#ff7f50",
    accent: "#ff4500",
    glass: "#87ceeb",
    lights: "#ffa500",
    rims: "#2c3e50"
  },
  {
    id: 12,
    name: "Matte Black",
    primary: "#1c1c1c",
    secondary: "#2f2f2f",
    accent: "#0f0f0f",
    glass: "#696969",
    lights: "#ffffff",
    rims: "#ff0000"
  },
  {
    id: 13,
    name: "Electric Cyan",
    primary: "#00ffff",
    secondary: "#1e90ff",
    accent: "#0080ff",
    glass: "#87ceeb",
    lights: "#00bfff",
    rims: "#000000"
  },
  {
    id: 14,
    name: "Spoon Yellow",
    primary: "#fff700",
    secondary: "#ffff00",
    accent: "#f0e68c",
    glass: "#87ceeb",
    lights: "#ffff99",
    rims: "#0000ff"
  },
  {
    id: 15,
    name: "Mugen White",
    primary: "#ffffff",
    secondary: "#f5f5f5",
    accent: "#e5e5e5",
    glass: "#87ceeb",
    lights: "#ffff99",
    rims: "#ff0000"
  }
];

export const trackTemplates = [
  {
    id: 1,
    name: "Circuito Alpha",
    difficulty: "Fácil",
    theme: "classic",
    description: "Pista perfeita para iniciantes com curvas suaves",
    surfaceColor: "#2a2a2a",
    boundaryColor: "#ff4444",
    accentColor: "#666666",
    startPosition: { x: 150, y: 300, angle: 0 },
    boundaries: [
      { x: 50, y: 50, width: 700, height: 20 },
      { x: 50, y: 50, width: 20, height: 500 },
      { x: 50, y: 530, width: 700, height: 20 },
      { x: 730, y: 50, width: 20, height: 500 }
    ],
    curves: [
      { x: 200, y: 150, radius: 80 },
      { x: 600, y: 200, radius: 60 },
      { x: 300, y: 400, radius: 90 },
      { x: 550, y: 450, radius: 70 }
    ],
    startLine: { x: 120, y: 280, width: 60, height: 40 }
  },
  {
    id: 2,
    name: "Velocidade Noturna",
    difficulty: "Médio",
    theme: "night",
    description: "Pista urbana com iluminação neon e curvas desafiadoras",
    surfaceColor: "#1a1a2e",
    boundaryColor: "#00d4ff",
    accentColor: "#ff6b9d",
    startPosition: { x: 100, y: 300, angle: 0 },
    boundaries: [
      { x: 30, y: 30, width: 740, height: 15 },
      { x: 30, y: 30, width: 15, height: 540 },
      { x: 30, y: 555, width: 740, height: 15 },
      { x: 755, y: 30, width: 15, height: 540 }
    ],
    curves: [
      { x: 150, y: 120, radius: 60 },
      { x: 650, y: 150, radius: 80 },
      { x: 200, y: 450, radius: 70 },
      { x: 600, y: 480, radius: 90 },
      { x: 400, y: 300, radius: 100 }
    ],
    startLine: { x: 70, y: 280, width: 60, height: 40 }
  },
  {
    id: 3,
    name: "Pôr do Sol",
    difficulty: "Médio",
    theme: "sunset",
    description: "Ambiente mágico com gradientes quentes e curvas fluidas",
    surfaceColor: "#3a2a4a",
    boundaryColor: "#ff8c42",
    accentColor: "#ffaa77",
    startPosition: { x: 400, y: 550, angle: -Math.PI/2 },
    boundaries: [
      { x: 80, y: 80, width: 640, height: 25 },
      { x: 80, y: 80, width: 25, height: 440 },
      { x: 80, y: 495, width: 640, height: 25 },
      { x: 695, y: 80, width: 25, height: 440 }
    ],
    curves: [
      { x: 250, y: 200, radius: 90 },
      { x: 550, y: 180, radius: 75 },
      { x: 200, y: 380, radius: 65 },
      { x: 600, y: 400, radius: 85 }
    ],
    startLine: { x: 380, y: 520, width: 40, height: 60 }
  },
  {
    id: 4,
    name: "Arena Neon",
    difficulty: "Difícil",
    theme: "neon",
    description: "Pista futurística com obstáculos e curvas apertadas",
    surfaceColor: "#0a0a1a",
    boundaryColor: "#ff00ff",
    accentColor: "#00ffff",
    startPosition: { x: 400, y: 100, angle: Math.PI/2 },
    boundaries: [
      { x: 100, y: 60, width: 600, height: 18 },
      { x: 100, y: 60, width: 18, height: 480 },
      { x: 100, y: 522, width: 600, height: 18 },
      { x: 682, y: 60, width: 18, height: 480 }
    ],
    curves: [
      { x: 200, y: 160, radius: 50 },
      { x: 600, y: 160, radius: 50 },
      { x: 300, y: 300, radius: 40 },
      { x: 500, y: 300, radius: 40 },
      { x: 200, y: 440, radius: 55 },
      { x: 600, y: 440, radius: 55 }
    ],
    startLine: { x: 380, y: 80, width: 40, height: 40 }
  },
  {
    id: 5,
    name: "Circuito Extreme",
    difficulty: "Difícil",
    theme: "industrial",
    description: "Para masters do drift - curvas extremas e alta velocidade",
    surfaceColor: "#2a2a2a",
    boundaryColor: "#ffaa00",
    accentColor: "#ff6600",
    startPosition: { x: 200, y: 500, angle: -Math.PI/4 },
    boundaries: [
      { x: 60, y: 40, width: 680, height: 22 },
      { x: 60, y: 40, width: 22, height: 520 },
      { x: 60, y: 538, width: 680, height: 22 },
      { x: 718, y: 40, width: 22, height: 520 }
    ],
    curves: [
      { x: 180, y: 140, radius: 45 },
      { x: 400, y: 120, radius: 30 },
      { x: 620, y: 140, radius: 45 },
      { x: 650, y: 300, radius: 60 },
      { x: 500, y: 450, radius: 50 },
      { x: 300, y: 480, radius: 40 },
      { x: 150, y: 350, radius: 70 },
      { x: 350, y: 280, radius: 35 }
    ],
    startLine: { x: 180, y: 480, width: 40, height: 40 }
  }
];

export const mockLeaderboard = [
  {
    id: 1,
    playerName: "DriftKing_RX7",
    score: 35420,
    timeMinutes: 7,
    timeSeconds: 23,
    date: "2025-01-15",
    trackName: "Arena Neon",
    carUsed: "Mazda RX-7 FD",
    colorUsed: "Midnight Purple"
  },
  {
    id: 2,
    playerName: "R34_Godzilla",
    score: 31890,
    timeMinutes: 6,
    timeSeconds: 45,
    date: "2025-01-14",
    trackName: "Circuito Extreme",
    carUsed: "Nissan Skyline R34 GT-R",
    colorUsed: "Bayside Blue"
  },
  {
    id: 3,
    playerName: "2JZ_Power",
    score: 28234,
    timeMinutes: 8,
    timeSeconds: 12,
    date: "2025-01-13",
    trackName: "Velocidade Noturna",
    carUsed: "Toyota Supra MK4",
    colorUsed: "Championship White"
  },
  {
    id: 4,
    playerName: "AE86_Tofu",
    score: 26876,
    timeMinutes: 9,
    timeSeconds: 58,
    date: "2025-01-12",
    trackName: "Pôr do Sol",
    carUsed: "Toyota AE86 Corolla",
    colorUsed: "Initial D Silver"
  },
  {
    id: 5,
    playerName: "EVO_IX_Beast",
    score: 25765,
    timeMinutes: 6,
    timeSeconds: 30,
    date: "2025-01-11",
    trackName: "Circuito Alpha",
    carUsed: "Mitsubishi Lancer Evo IX",
    colorUsed: "Rally Red"
  }
];

export const mockPlayerStats = {
  gamesPlayed: 127,
  totalDriftTime: 856, // seconds
  bestScore: 35420,
  averageScore: 18532,
  totalDistance: 28750, // meters
  favoriteTrack: "Arena Neon",
  favoriteCar: "Mazda RX-7 FD",
  favoriteColor: "Midnight Purple",
  tracksUnlocked: 5,
  carsUnlocked: 12,
  colorsUnlocked: 15,
  achievements: [
    { name: "Primeiro Drift", description: "Complete seu primeiro drift", unlocked: true },
    { name: "JDM Legend", description: "Desbloqueie todos os carros JDM", unlocked: true },
    { name: "Rotary Master", description: "Domine o RX-7", unlocked: true },
    { name: "2JZ Power", description: "Vença com o Supra", unlocked: true },
    { name: "Hachiroku Spirit", description: "Drift como Takumi", unlocked: true },
    { name: "VTEC Warrior", description: "Use carros Honda", unlocked: true },
    { name: "AWD King", description: "Domine STI e EVO", unlocked: false },
    { name: "Drift Legend", description: "Pontue mais de 30,000", unlocked: true }
  ]
};

export const particleEffects = {
  drift: {
    count: 5,
    size: 2,
    color: "#ffffff",
    life: 1.0,
    decay: 0.02
  },
  sparks: {
    count: 3,
    colors: ["#ffaa00", "#ffffff", "#ff6600"],
    size: 2,
    life: 0.5
  },
  speedLines: {
    count: 5,
    color: "#ffffff",
    opacity: 0.6,
    length: 10
  }
};