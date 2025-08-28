export interface ImportRecord {
  id: string;
  fecha: string;
  marca: string;
  modelo: string;
  tipo_vehiculo: string;
  unidades: number;
  año: number;
  mes: number;
}

export interface KPIData {
  totalVehicles: number;
  totalBrands: number;
  totalModels: number;
  monthlyVariation: number;
  yearlyVariation: number;
}

export interface RankingItem {
  name: string;
  value: number;
  percentage?: number;
  growth?: number;
}

export interface MarketShareData {
  name: string;
  value: number;
  percentage: number;
}

export interface NewVehicle {
  marca: string;
  modelo: string;
  tipo_vehiculo: string;
  unidades: number;
}

export interface FilterState {
  year: string;
  month: string;
  brand: string;
  model: string;
  vehicleType: string;
}