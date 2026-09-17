import suv from "@/assets/car-suv.jpg";
import sedan from "@/assets/car-sedan.jpg";
import coupe from "@/assets/car-coupe.jpg";
import convertible from "@/assets/car-convertible.jpg";
import showroom from "@/assets/showroom.jpg";
import hero from "@/assets/hero-car.jpg";

export type Vehicle = {
  id: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  price: number;
  monthly: number;
  mileage: number;
  transmission: "Automatic" | "Manual";
  fuel: "Petrol" | "Diesel" | "Hybrid" | "Electric";
  bodyType: string;
  colour: string;
  driveType: "FWD" | "RWD" | "AWD";
  engine: string;
  doors: number;
  vin: string;
  registration: string;
  status: "Available" | "Reserved" | "Sold";
  featured: boolean;
  image: string;
  gallery: string[];
  features: string[];
  description: string;
  addedDaysAgo: number;
  /** When false, online purchase/checkout is disabled and the card shows "Enquire". */
  onlinePurchase?: boolean;
  /** Interior colour, when the record provides one. */
  interiorColour?: string;
  /** Optional walkaround video URL. */
  videoUrl?: string;
};

export const MAKES = [
  "BMW",
  "Audi",
  "Mercedes",
  "Tesla",
  "Toyota",
  "Honda",
  "Ford",
  "Nissan",
  "Volkswagen",
  "Land Rover",
] as const;

export const MODELS: Record<string, string[]> = {
  BMW: ["M4 Competition", "X5 xDrive40i", "530e M Sport", "i4 eDrive40"],
  Audi: ["RS6 Avant", "Q7 S Line", "A5 Sportback", "e-tron GT"],
  Mercedes: ["C300 AMG Line", "GLE 400d", "S500 L", "EQE 350+"],
  Tesla: ["Model 3 Long Range", "Model Y Performance", "Model S Plaid", "Model X"],
  Toyota: ["Supra GR", "RAV4 Hybrid", "Camry Excel", "C-HR Design"],
  Honda: ["Civic Type R", "CR-V Hybrid", "Accord Sport", "HR-V Advance"],
  Ford: ["Mustang GT", "Ranger Wildtrak", "Puma ST", "Focus ST"],
  Nissan: ["GT-R Premium", "Qashqai Tekna", "Juke N-Connecta", "Ariya Evolve"],
  Volkswagen: ["Golf R", "Tiguan R-Line", "Arteon Elegance", "ID.5 GTX"],
  "Land Rover": ["Range Rover Sport", "Defender 110", "Velar R-Dynamic", "Discovery HSE"],
};

export const BODY_TYPES = [
  "SUV",
  "Sedan",
  "Coupe",
  "Convertible",
  "Pickup",
  "Hatchback",
  "Electric",
  "Hybrid",
];

export const FUELS = ["Petrol", "Diesel", "Hybrid", "Electric"] as const;
export const TRANSMISSIONS = ["Automatic", "Manual"] as const;
export const COLOURS = ["Black", "White", "Silver", "Grey", "Blue", "Red", "Green"];
export const DRIVE_TYPES = ["FWD", "RWD", "AWD"] as const;

const IMAGES = [suv, sedan, coupe, convertible];
export const LIFESTYLE_IMAGES = [showroom, hero];

const FEATURE_POOL = [
  "Panoramic Sunroof",
  "Heated Leather Seats",
  "360° Camera",
  "Adaptive Cruise Control",
  "Head-Up Display",
  "Harman Kardon Audio",
  "Wireless Apple CarPlay",
  "Matrix LED Headlights",
  "Electric Tailgate",
  "Ventilated Seats",
  "Adaptive Suspension",
  "Keyless Entry",
  "Lane Keep Assist",
  "Ambient Lighting",
  "21\" Alloy Wheels",
];

// Deterministic pseudo-random so the catalogue is stable across renders/SSR.
function rng(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const at = <T,>(arr: readonly T[], i: number): T => arr[((i % arr.length) + arr.length) % arr.length] as T;

function buildCatalogue(): Vehicle[] {
  const list: Vehicle[] = [];
  for (let i = 0; i < 108; i++) {
    const r = rng(i + 7);
    const make = at(MAKES, i);
    const models = MODELS[make] as string[];
    const model = at(models, Math.floor(r() * models.length));
    const bodyType = at(BODY_TYPES, Math.floor(r() * BODY_TYPES.length));
    const fuel =
      bodyType === "Electric"
        ? "Electric"
        : bodyType === "Hybrid"
          ? "Hybrid"
          : at(FUELS, Math.floor(r() * FUELS.length));
    const year = 2018 + Math.floor(r() * 8);
    const price = Math.round((18000 + r() * 122000) / 250) * 250;
    const mileage = Math.round((1200 + r() * 78000) / 100) * 100;
    const statusRoll = r();
    const status: Vehicle["status"] =
      statusRoll > 0.94 ? "Sold" : statusRoll > 0.84 ? "Reserved" : "Available";
    const image = at(IMAGES, i);
    const featureCount = 6 + Math.floor(r() * 5);
    const features: string[] = [];
    for (let f = 0; f < featureCount; f++) {
      const item = at(FEATURE_POOL, i * 3 + f * 5);
      if (!features.includes(item)) features.push(item);
    }

    list.push({
      id: `${make.toLowerCase().replace(/\s+/g, "-")}-${model.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${1000 + i}`,
      make,
      model,
      variant: fuel === "Electric" ? "Long Range" : `${(1.6 + r() * 2.4).toFixed(1)} ${fuel}`,
      year,
      price,
      monthly: Math.round((price * 0.0135 + 89) / 1) ,
      mileage,
      transmission: r() > 0.22 ? "Automatic" : "Manual",
      fuel,
      bodyType,
      colour: at(COLOURS, Math.floor(r() * COLOURS.length)),
      driveType: at(DRIVE_TYPES, Math.floor(r() * DRIVE_TYPES.length)),
      engine: fuel === "Electric" ? "Dual Motor" : `${(1.4 + r() * 2.6).toFixed(1)}L`,
      doors: r() > 0.3 ? 5 : 3,
      vin: `WVX${(100000 + i * 787).toString(36).toUpperCase()}LX${9000 + i}`,
      registration: `${at(["LM", "KX", "PN", "RD", "TY"], i)}${20 + (i % 5)} ${at(["AXV", "JHT", "MRB", "ZCP", "QWD"], i)}`,
      status,
      featured: i % 9 === 0,
      image,
      gallery: [image, ...IMAGES.filter((g) => g !== image)],
      features,
      description: `A meticulously prepared ${year} ${make} ${model} finished in a striking specification. Supplied with a full service history, comprehensive multi-point inspection and our 12-month warranty as standard. Nationwide delivery and flexible finance available on every vehicle in our collection.`,
      addedDaysAgo: Math.floor(r() * 60),
    });
  }
  return list;
}

export const VEHICLES: Vehicle[] = buildCatalogue();

export const getVehicle = (id: string) => VEHICLES.find((v) => v.id === id);

export const featuredVehicles = VEHICLES.filter((v) => v.featured).slice(0, 6);
export const latestArrivals = [...VEHICLES]
  .sort((a, b) => a.addedDaysAgo - b.addedDaysAgo)
  .slice(0, 8);

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(n);

export const formatMiles = (n: number) => `${new Intl.NumberFormat("en-GB").format(n)} mi`;
