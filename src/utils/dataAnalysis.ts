import { ImportRecord, KPIData, RankingItem, MarketShareData, NewVehicle } from '../types';

export const calculateKPIs = (data: ImportRecord[], currentYear: number, currentMonth: number): KPIData => {
  const currentYearData = data.filter(d => d.año === currentYear);
  const currentMonthData = data.filter(d => d.año === currentYear && d.mes === currentMonth);
  const previousMonthData = data.filter(d => 
    (d.año === currentYear && d.mes === currentMonth - 1) || 
    (currentMonth === 1 && d.año === currentYear - 1 && d.mes === 12)
  );
  const previousYearData = data.filter(d => d.año === currentYear - 1);

  const totalVehicles = currentYearData.reduce((sum, record) => sum + record.unidades, 0);
  const totalBrands = new Set(currentYearData.map(d => d.marca)).size;
  const totalModels = new Set(currentYearData.map(d => `${d.marca}-${d.modelo}`)).size;

  const currentMonthTotal = currentMonthData.reduce((sum, record) => sum + record.unidades, 0);
  const previousMonthTotal = previousMonthData.reduce((sum, record) => sum + record.unidades, 0);
  const previousYearTotal = previousYearData.reduce((sum, record) => sum + record.unidades, 0);

  const monthlyVariation = previousMonthTotal > 0 
    ? ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100 
    : 0;
  
  const yearlyVariation = previousYearTotal > 0 
    ? ((totalVehicles - previousYearTotal) / previousYearTotal) * 100 
    : 0;

  return {
    totalVehicles,
    totalBrands,
    totalModels,
    monthlyVariation,
    yearlyVariation
  };
};

export const getBrandRanking = (data: ImportRecord[], limit: number = 10): RankingItem[] => {
  const brandTotals = data.reduce((acc, record) => {
    acc[record.marca] = (acc[record.marca] || 0) + record.unidades;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(brandTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
};

export const getModelRanking = (data: ImportRecord[], limit: number = 10): RankingItem[] => {
  const modelTotals = data.reduce((acc, record) => {
    const key = `${record.marca} ${record.modelo}`;
    acc[key] = (acc[key] || 0) + record.unidades;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(modelTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
};

export const getVehicleTypeRanking = (data: ImportRecord[]): RankingItem[] => {
  const typeTotals = data.reduce((acc, record) => {
    acc[record.tipo_vehiculo] = (acc[record.tipo_vehiculo] || 0) + record.unidades;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(typeTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

export const getModelsPerBrand = (data: ImportRecord[]): RankingItem[] => {
  const brandModels = data.reduce((acc, record) => {
    if (!acc[record.marca]) {
      acc[record.marca] = new Set();
    }
    acc[record.marca].add(record.modelo);
    return acc;
  }, {} as Record<string, Set<string>>);

  return Object.entries(brandModels)
    .map(([name, models]) => ({ name, value: models.size }))
    .sort((a, b) => b.value - a.value);
};

export const getNewVehicles = (data: ImportRecord[], currentYear: number, currentMonth: number): NewVehicle[] => {
  const currentMonthData = data.filter(d => d.año === currentYear && d.mes === currentMonth);
  const previousYearData = data.filter(d => d.año === currentYear - 1);
  
  const previousYearModels = new Set(
    previousYearData.map(d => `${d.marca}-${d.modelo}`)
  );

  return currentMonthData
    .filter(record => !previousYearModels.has(`${record.marca}-${record.modelo}`))
    .map(record => ({
      marca: record.marca,
      modelo: record.modelo,
      tipo_vehiculo: record.tipo_vehiculo,
      unidades: record.unidades
    }));
};

export const getBrandGrowth = (data: ImportRecord[], currentYear: number, currentMonth: number): RankingItem[] => {
  const currentMonthData = data.filter(d => d.año === currentYear && d.mes === currentMonth);
  const previousMonthData = data.filter(d => 
    (d.año === currentYear && d.mes === currentMonth - 1) || 
    (currentMonth === 1 && d.año === currentYear - 1 && d.mes === 12)
  );

  const currentTotals = currentMonthData.reduce((acc, record) => {
    acc[record.marca] = (acc[record.marca] || 0) + record.unidades;
    return acc;
  }, {} as Record<string, number>);

  const previousTotals = previousMonthData.reduce((acc, record) => {
    acc[record.marca] = (acc[record.marca] || 0) + record.unidades;
    return acc;
  }, {} as Record<string, number>);

  return Object.keys(currentTotals)
    .map(brand => {
      const current = currentTotals[brand] || 0;
      const previous = previousTotals[brand] || 0;
      const growth = previous > 0 ? ((current - previous) / previous) * 100 : 0;
      
      return {
        name: brand,
        value: current,
        growth
      };
    })
    .sort((a, b) => (b.growth || 0) - (a.growth || 0));
};

export const getMarketShare = (data: ImportRecord[]): MarketShareData[] => {
  const total = data.reduce((sum, record) => sum + record.unidades, 0);
  const brandTotals = data.reduce((acc, record) => {
    acc[record.marca] = (acc[record.marca] || 0) + record.unidades;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(brandTotals)
    .map(([name, value]) => ({
      name,
      value,
      percentage: (value / total) * 100
    }))
    .sort((a, b) => b.value - a.value);
};

export const generateInsights = (data: ImportRecord[], currentYear: number, currentMonth: number): string[] => {
  const brandRanking = getBrandRanking(data, 3);
  const brandGrowth = getBrandGrowth(data, currentYear, currentMonth);
  const vehicleTypes = getVehicleTypeRanking(data);
  const newVehicles = getNewVehicles(data, currentYear, currentMonth);

  const insights: string[] = [];

  // Market leader insight
  if (brandRanking.length > 0) {
    insights.push(`${brandRanking[0].name} mantiene el liderazgo del mercado con ${brandRanking[0].value.toLocaleString()} unidades importadas.`);
  }

  // Growth leader insight
  const growthLeader = brandGrowth.find(b => (b.growth || 0) > 0);
  if (growthLeader && growthLeader.growth) {
    insights.push(`${growthLeader.name} lidera el crecimiento con un aumento del ${growthLeader.growth.toFixed(1)}% en el último mes.`);
  }

  // Vehicle type insight
  if (vehicleTypes.length > 0) {
    insights.push(`Los vehículos tipo ${vehicleTypes[0].name} dominan las importaciones con ${vehicleTypes[0].value.toLocaleString()} unidades.`);
  }

  // New vehicles insight
  if (newVehicles.length > 0) {
    insights.push(`Se detectaron ${newVehicles.length} nuevos modelos en el mercado este mes.`);
  }

  return insights;
};