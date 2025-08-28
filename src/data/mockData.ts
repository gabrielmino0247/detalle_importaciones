import { ImportRecord } from '../types';

// Mock data generator for automotive imports
export const generateMockData = (): ImportRecord[] => {
  const brands = ['Toyota', 'Chevrolet', 'Ford', 'Nissan', 'Hyundai', 'Kia', 'Mazda', 'Mitsubishi', 'Chery', 'BYD'];
  const models = {
    Toyota: ['Hilux', 'RAV4', 'Corolla', 'Camry', 'Prius'],
    Chevrolet: ['Colorado', 'Equinox', 'Cruze', 'Tracker', 'Onix'],
    Ford: ['Ranger', 'EcoSport', 'Focus', 'Mustang', 'Explorer'],
    Nissan: ['Frontier', 'X-Trail', 'Sentra', 'Kicks', 'Versa'],
    Hyundai: ['Tucson', 'Elantra', 'Accent', 'Santa Fe', 'Creta'],
    Kia: ['Sportage', 'Rio', 'Forte', 'Sorento', 'Seltos'],
    Mazda: ['CX-5', 'Mazda3', 'CX-3', 'CX-9', 'MX-5'],
    Mitsubishi: ['L200', 'ASX', 'Outlander', 'Lancer', 'Montero'],
    Chery: ['Tiggo 7', 'Tiggo 4', 'Arrizo 5', 'Tiggo 8', 'QQ'],
    BYD: ['Tang', 'Song', 'Qin', 'Han', 'Atto 3']
  };
  const vehicleTypes = ['SUV', 'Pickup', 'Sedan', 'Hatchback', 'Minivan', 'EV'];
  
  const data: ImportRecord[] = [];
  let id = 1;

  // Generate data for 2023 and 2024
  for (let year = 2023; year <= 2024; year++) {
    const monthsToGenerate = year === 2024 ? 10 : 12; // 2024 up to October
    
    for (let month = 1; month <= monthsToGenerate; month++) {
      brands.forEach(brand => {
        const brandModels = models[brand as keyof typeof models];
        brandModels.forEach(model => {
          // Not all models are imported every month
          if (Math.random() > 0.3) {
            const vehicleType = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
            let baseUnits = Math.floor(Math.random() * 500) + 50;
            
            // Add some seasonal patterns and growth trends
            if (brand === 'Chery' && year === 2024) baseUnits *= 1.4; // Chery growth
            if (brand === 'BYD' && vehicleType === 'EV') baseUnits *= 1.8; // EV growth
            if (month >= 11 && month <= 12) baseUnits *= 1.2; // End of year boost
            
            data.push({
              id: id.toString(),
              fecha: `${year}-${month.toString().padStart(2, '0')}-15`,
              marca: brand,
              modelo: model,
              tipo_vehiculo: vehicleType,
              unidades: Math.floor(baseUnits),
              año: year,
              mes: month
            });
            id++;
          }
        });
      });
    }
  }

  return data;
};

export const mockData = generateMockData();