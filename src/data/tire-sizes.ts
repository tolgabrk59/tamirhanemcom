// Comprehensive tire size database for Turkish market vehicles
// Data compiled from manufacturer specifications and common OEM sizes

export interface TireSize {
  brand: string;
  model: string;
  tire_size: string;
  alternative_sizes?: string[];
}

export const tireSizes: TireSize[] = [
  // Opel
  { brand: "Opel", model: "Astra", tire_size: "205/55R16", alternative_sizes: ["215/50R17", "225/45R18"] },
  { brand: "Opel", model: "Corsa", tire_size: "185/65R15", alternative_sizes: ["195/55R16", "205/45R17"] },
  { brand: "Opel", model: "Insignia", tire_size: "225/55R17", alternative_sizes: ["245/45R18", "245/40R19"] },
  { brand: "Opel", model: "Mokka", tire_size: "215/60R17", alternative_sizes: ["215/55R18"] },
  
  // Ford
  { brand: "Ford", model: "Focus", tire_size: "205/55R16", alternative_sizes: ["215/50R17", "225/40R18"] },
  { brand: "Ford", model: "Fiesta", tire_size: "195/60R15", alternative_sizes: ["195/55R16", "205/45R17"] },
  { brand: "Ford", model: "Mondeo", tire_size: "215/55R17", alternative_sizes: ["235/45R18", "235/40R19"] },
  { brand: "Ford", model: "Kuga", tire_size: "235/55R17", alternative_sizes: ["235/50R18", "235/45R19"] },
  { brand: "Ford", model: "Puma", tire_size: "215/55R17", alternative_sizes: ["215/50R18"] },
  
  // Renault
  { brand: "Renault", model: "Megane", tire_size: "205/55R16", alternative_sizes: ["215/50R17", "225/45R18"] },
  { brand: "Renault", model: "Clio", tire_size: "185/65R15", alternative_sizes: ["195/55R16", "205/45R17"] },
  { brand: "Renault", model: "Fluence", tire_size: "205/55R16", alternative_sizes: ["215/50R17"] },
  { brand: "Renault", model: "Kadjar", tire_size: "215/60R17", alternative_sizes: ["215/55R18"] },
  { brand: "Renault", model: "Captur", tire_size: "205/60R16", alternative_sizes: ["215/55R17"] },
  
  // Fiat
  { brand: "Fiat", model: "Egea", tire_size: "195/65R15", alternative_sizes: ["205/55R16"] },
  { brand: "Fiat", model: "Linea", tire_size: "195/65R15", alternative_sizes: ["205/55R16"] },
  { brand: "Fiat", model: "Punto", tire_size: "185/65R15", alternative_sizes: ["195/55R16"] },
  { brand: "Fiat", model: "500", tire_size: "185/55R15", alternative_sizes: ["195/45R16"] },
  { brand: "Fiat", model: "500X", tire_size: "215/55R17", alternative_sizes: ["225/45R18"] },
  
  // Volkswagen
  { brand: "Volkswagen", model: "Golf", tire_size: "205/55R16", alternative_sizes: ["225/45R17", "225/40R18"] },
  { brand: "Volkswagen", model: "Passat", tire_size: "215/55R17", alternative_sizes: ["235/45R18", "245/40R19"] },
  { brand: "Volkswagen", model: "Polo", tire_size: "185/65R15", alternative_sizes: ["195/55R16", "215/45R17"] },
  { brand: "Volkswagen", model: "Jetta", tire_size: "205/55R16", alternative_sizes: ["225/45R17"] },
  { brand: "Volkswagen", model: "Tiguan", tire_size: "215/65R17", alternative_sizes: ["235/55R18", "255/45R19"] },
  
  // Toyota
  { brand: "Toyota", model: "Corolla", tire_size: "195/65R15", alternative_sizes: ["205/55R16", "225/45R17"] },
  { brand: "Toyota", model: "Yaris", tire_size: "175/65R15", alternative_sizes: ["185/60R15", "195/50R16"] },
  { brand: "Toyota", model: "Auris", tire_size: "195/65R15", alternative_sizes: ["205/55R16", "225/45R17"] },
  { brand: "Toyota", model: "C-HR", tire_size: "215/60R17", alternative_sizes: ["225/50R18"] },
  { brand: "Toyota", model: "RAV4", tire_size: "225/65R17", alternative_sizes: ["235/55R18", "235/55R19"] },
  
  // Honda
  { brand: "Honda", model: "Civic", tire_size: "205/55R16", alternative_sizes: ["215/50R17", "235/40R18"] },
  { brand: "Honda", model: "CR-V", tire_size: "225/65R17", alternative_sizes: ["235/60R18", "235/55R19"] },
  { brand: "Honda", model: "Jazz", tire_size: "175/65R15", alternative_sizes: ["185/55R16"] },
  
  // Hyundai
  { brand: "Hyundai", model: "i20", tire_size: "185/65R15", alternative_sizes: ["195/55R16", "205/45R17"] },
  { brand: "Hyundai", model: "i30", tire_size: "205/55R16", alternative_sizes: ["215/50R17", "225/45R18"] },
  { brand: "Hyundai", model: "Tucson", tire_size: "225/60R17", alternative_sizes: ["235/55R18", "235/45R19"] },
  { brand: "Hyundai", model: "Kona", tire_size: "215/55R17", alternative_sizes: ["235/45R18"] },
  { brand: "Hyundai", model: "Elantra", tire_size: "205/55R16", alternative_sizes: ["225/45R17"] },
  
  // Peugeot
  { brand: "Peugeot", model: "308", tire_size: "205/55R16", alternative_sizes: ["215/50R17", "225/45R18"] },
  { brand: "Peugeot", model: "3008", tire_size: "215/60R17", alternative_sizes: ["225/55R18", "235/50R19"] },
  { brand: "Peugeot", model: "208", tire_size: "185/65R15", alternative_sizes: ["195/55R16", "205/45R17"] },
  { brand: "Peugeot", model: "2008", tire_size: "205/55R16", alternative_sizes: ["215/50R17"] },
  
  // Citroen
  { brand: "Citroen", model: "C4", tire_size: "205/55R16", alternative_sizes: ["215/50R17", "225/45R18"] },
  { brand: "Citroen", model: "C3", tire_size: "185/65R15", alternative_sizes: ["195/55R16", "205/45R17"] },
  { brand: "Citroen", model: "C5", tire_size: "215/55R17", alternative_sizes: ["225/50R18"] },
  { brand: "Citroen", model: "C3 Aircross", tire_size: "205/55R17", alternative_sizes: ["215/50R18"] },
  
  // Nissan
  { brand: "Nissan", model: "Qashqai", tire_size: "215/60R17", alternative_sizes: ["215/55R18", "225/45R19"] },
  { brand: "Nissan", model: "Juke", tire_size: "215/55R17", alternative_sizes: ["215/50R18"] },
  { brand: "Nissan", model: "Micra", tire_size: "185/65R15", alternative_sizes: ["195/55R16"] },
  { brand: "Nissan", model: "X-Trail", tire_size: "225/65R17", alternative_sizes: ["225/60R18"] },
  
  // Dacia
  { brand: "Dacia", model: "Duster", tire_size: "215/65R16", alternative_sizes: ["215/60R17"] },
  { brand: "Dacia", model: "Sandero", tire_size: "185/65R15", alternative_sizes: ["195/55R16"] },
  { brand: "Dacia", model: "Logan", tire_size: "185/65R15", alternative_sizes: ["195/55R16"] },
  
  // Skoda
  { brand: "Skoda", model: "Octavia", tire_size: "205/55R16", alternative_sizes: ["215/50R17", "225/45R18"] },
  { brand: "Skoda", model: "Fabia", tire_size: "185/65R15", alternative_sizes: ["195/55R16"] },
  { brand: "Skoda", model: "Superb", tire_size: "215/55R17", alternative_sizes: ["235/45R18", "245/40R19"] },
  { brand: "Skoda", model: "Kodiaq", tire_size: "215/65R17", alternative_sizes: ["235/55R18", "235/50R19"] },
  
  // Seat
  { brand: "Seat", model: "Leon", tire_size: "205/55R16", alternative_sizes: ["225/45R17", "225/40R18"] },
  { brand: "Seat", model: "Ibiza", tire_size: "185/65R15", alternative_sizes: ["195/55R16", "215/45R17"] },
  { brand: "Seat", model: "Ateca", tire_size: "215/60R17", alternative_sizes: ["215/55R18"] },
  
  // Kia
  { brand: "Kia", model: "Sportage", tire_size: "225/60R17", alternative_sizes: ["235/55R18", "235/45R19"] },
  { brand: "Kia", model: "Ceed", tire_size: "205/55R16", alternative_sizes: ["215/50R17", "225/45R18"] },
  { brand: "Kia", model: "Rio", tire_size: "185/65R15", alternative_sizes: ["195/55R16"] },
  { brand: "Kia", model: "Stonic", tire_size: "205/55R16", alternative_sizes: ["215/50R17"] },
  
  // Mazda
  { brand: "Mazda", model: "3", tire_size: "205/60R16", alternative_sizes: ["215/45R18"] },
  { brand: "Mazda", model: "CX-5", tire_size: "225/65R17", alternative_sizes: ["225/55R19"] },
  { brand: "Mazda", model: "6", tire_size: "225/55R17", alternative_sizes: ["225/45R19"] },
  
  // BMW
  { brand: "BMW", model: "3 Serisi", tire_size: "225/50R17", alternative_sizes: ["225/45R18", "225/40R19"] },
  { brand: "BMW", model: "5 Serisi", tire_size: "245/45R18", alternative_sizes: ["245/40R19", "275/35R20"] },
  { brand: "BMW", model: "X3", tire_size: "245/50R18", alternative_sizes: ["245/45R19"] },
  { brand: "BMW", model: "X5", tire_size: "255/55R18", alternative_sizes: ["275/45R19", "285/40R20"] },
  
  // Mercedes
  { brand: "Mercedes-Benz", model: "C-Class", tire_size: "225/50R17", alternative_sizes: ["225/45R18", "225/40R19"] },
  { brand: "Mercedes-Benz", model: "E-Class", tire_size: "245/45R18", alternative_sizes: ["245/40R19"] },
  { brand: "Mercedes-Benz", model: "GLC", tire_size: "235/60R18", alternative_sizes: ["235/55R19"] },
  
  // Audi
  { brand: "Audi", model: "A3", tire_size: "205/55R16", alternative_sizes: ["225/45R17", "225/40R18"] },
  { brand: "Audi", model: "A4", tire_size: "225/50R17", alternative_sizes: ["245/45R18", "245/40R19"] },
  { brand: "Audi", model: "Q3", tire_size: "215/60R17", alternative_sizes: ["235/55R18", "235/50R19"] },
  { brand: "Audi", model: "Q5", tire_size: "235/60R18", alternative_sizes: ["255/45R20"] },
];

// Helper function to find tire size by brand and model
export function findTireSize(brand: string, model: string): TireSize | undefined {
  return tireSizes.find(
    (tire) => 
      tire.brand.toLowerCase() === brand.toLowerCase() && 
      tire.model.toLowerCase() === model.toLowerCase()
  );
}

// Get all unique brands
export function getAllBrands(): string[] {
  const brands = new Set(tireSizes.map(t => t.brand));
  return Array.from(brands).sort();
}

// Get models for a specific brand
export function getModelsByBrand(brand: string): string[] {
  return tireSizes
    .filter(t => t.brand.toLowerCase() === brand.toLowerCase())
    .map(t => t.model)
    .sort();
}
