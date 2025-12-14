// Araç markaları ve modelleri
export const vehicleBrands = [
  'Audi',
  'BMW',
  'Chevrolet',
  'Citroen',
  'Dacia',
  'Fiat',
  'Ford',
  'Honda',
  'Hyundai',
  'Kia',
  'Mazda',
  'Mercedes',
  'Nissan',
  'Opel',
  'Peugeot',
  'Renault',
  'Seat',
  'Skoda',
  'Suzuki',
  'Toyota',
  'Volkswagen',
  'Volvo'
];

export const vehicleModels: Record<string, string[]> = {
  'Audi': ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q2', 'Q3', 'Q5', 'Q7', 'Q8', 'TT'],
  'BMW': ['1 Serisi', '2 Serisi', '3 Serisi', '4 Serisi', '5 Serisi', '6 Serisi', '7 Serisi', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7'],
  'Chevrolet': ['Aveo', 'Cruze', 'Captiva', 'Spark', 'Trax'],
  'Citroen': ['C1', 'C3', 'C4', 'C4 Cactus', 'C5', 'Berlingo', 'C-Elysee'],
  'Dacia': ['Duster', 'Logan', 'Sandero', 'Lodgy', 'Dokker', 'Spring'],
  'Fiat': ['500', '500X', 'Egea', 'Linea', 'Punto', 'Tipo', 'Doblo', 'Fiorino'],
  'Ford': ['Fiesta', 'Focus', 'Mondeo', 'Kuga', 'EcoSport', 'Puma', 'Ranger', 'Transit', 'Tourneo'],
  'Honda': ['Civic', 'Accord', 'CR-V', 'HR-V', 'Jazz'],
  'Hyundai': ['i10', 'i20', 'i30', 'Elantra', 'Tucson', 'Kona', 'Santa Fe', 'Accent'],
  'Kia': ['Picanto', 'Rio', 'Ceed', 'Sportage', 'Sorento', 'Stonic', 'Niro'],
  'Mazda': ['2', '3', '6', 'CX-3', 'CX-5', 'CX-30', 'MX-5'],
  'Mercedes': ['A Serisi', 'B Serisi', 'C Serisi', 'E Serisi', 'S Serisi', 'CLA', 'CLS', 'GLA', 'GLC', 'GLE', 'GLS', 'Vito'],
  'Nissan': ['Micra', 'Juke', 'Qashqai', 'X-Trail', 'Navara', 'Leaf'],
  'Opel': ['Corsa', 'Astra', 'Insignia', 'Mokka', 'Crossland', 'Grandland'],
  'Peugeot': ['108', '208', '308', '508', '2008', '3008', '5008', 'Partner', 'Rifter'],
  'Renault': ['Clio', 'Megane', 'Talisman', 'Captur', 'Kadjar', 'Koleos', 'Kangoo', 'Fluence', 'Symbol'],
  'Seat': ['Ibiza', 'Leon', 'Arona', 'Ateca', 'Tarraco'],
  'Skoda': ['Fabia', 'Octavia', 'Superb', 'Kamiq', 'Karoq', 'Kodiaq', 'Scala'],
  'Suzuki': ['Swift', 'Vitara', 'S-Cross', 'Jimny', 'Ignis'],
  'Toyota': ['Yaris', 'Corolla', 'Camry', 'C-HR', 'RAV4', 'Land Cruiser', 'Hilux'],
  'Volkswagen': ['Polo', 'Golf', 'Passat', 'Jetta', 'Arteon', 'T-Roc', 'Tiguan', 'Touareg', 'Caddy', 'Transporter'],
  'Volvo': ['S60', 'S90', 'V40', 'V60', 'V90', 'XC40', 'XC60', 'XC90']
};

// Yıl aralığı
export const vehicleYears: number[] = Array.from(
  { length: 30 },
  (_, i) => new Date().getFullYear() - i
);

export function getModelsByBrand(brand: string): string[] {
  return vehicleModels[brand] || [];
}
