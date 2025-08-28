import React from 'react';
import { useState, useMemo } from 'react';
import { Car, BarChart3, TrendingUp, Users, Calendar, Download } from 'lucide-react';
import { mockData } from './data/mockData';
import { FilterState, ImportRecord } from './types';
import { 
  calculateKPIs, 
  getBrandRanking, 
  getModelRanking, 
  getVehicleTypeRanking,
  getModelsPerBrand,
  getNewVehicles,
  getBrandGrowth,
  getMarketShare,
  generateInsights
} from './utils/dataAnalysis';
import { KPICard } from './components/KPICard';
import { RankingChart } from './components/RankingChart';
import { PieChart } from './components/PieChart';
import { DataTable } from './components/DataTable';
import { FilterPanel } from './components/FilterPanel';
import { InsightsPanel } from './components/InsightsPanel';
import { FileUpload } from './components/FileUpload';

function App() {
  const [currentData, setCurrentData] = useState<ImportRecord[]>(mockData);
  const [filters, setFilters] = useState<FilterState>({
    year: '',
    month: '',
    brand: '',
    model: '',
    vehicleType: ''
  });

  const [topLimit, setTopLimit] = useState(10);

  const handleDataUpdate = (newData: ImportRecord[]) => {
    setCurrentData(newData);
    // Reset filters when new data is loaded
    setFilters({
      year: '',
      month: '',
      brand: '',
      model: '',
      vehicleType: ''
    });
  };

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    return currentData.filter(record => {
      if (filters.year && record.año.toString() !== filters.year) return false;
      if (filters.month && record.mes.toString() !== filters.month) return false;
      if (filters.brand && record.marca !== filters.brand) return false;
      if (filters.model && record.modelo !== filters.model) return false;
      if (filters.vehicleType && record.tipo_vehiculo !== filters.vehicleType) return false;
      return true;
    });
  }, [filters]);

  // Get available filter options
  const availableOptions = useMemo(() => {
    const years = [...new Set(currentData.map(d => d.año.toString()))].sort();
    const months = [...new Set(currentData.map(d => d.mes.toString()))].sort((a, b) => parseInt(a) - parseInt(b));
    const brands = [...new Set(currentData.map(d => d.marca))].sort();
    const models = [...new Set(currentData.map(d => d.modelo))].sort();
    const vehicleTypes = [...new Set(currentData.map(d => d.tipo_vehiculo))].sort();

    return { years, months, brands, models, vehicleTypes };
  }, [currentData]);

  // Calculate analytics
  const currentYear = 2024;
  const currentMonth = 10;
  
  const kpis = useMemo(() => calculateKPIs(filteredData, currentYear, currentMonth), [filteredData]);
  const brandRanking = useMemo(() => getBrandRanking(filteredData, topLimit), [filteredData, topLimit]);
  const modelRanking = useMemo(() => getModelRanking(filteredData, topLimit), [filteredData, topLimit]);
  const vehicleTypeRanking = useMemo(() => getVehicleTypeRanking(filteredData), [filteredData]);
  const modelsPerBrand = useMemo(() => getModelsPerBrand(filteredData), [filteredData]);
  const newVehicles = useMemo(() => getNewVehicles(filteredData, currentYear, currentMonth), [filteredData]);
  const brandGrowth = useMemo(() => getBrandGrowth(filteredData, currentYear, currentMonth), [filteredData]);
  const marketShare = useMemo(() => getMarketShare(filteredData), [filteredData]);
  const insights = useMemo(() => generateInsights(filteredData, currentYear, currentMonth), [filteredData]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Car className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Dashboard de Importaciones Automotrices</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Última actualización: Octubre 2024
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* File Upload */}
        <FileUpload onDataUpdate={handleDataUpdate} />

        {/* Filters */}
        <FilterPanel 
          filters={filters}
          onFilterChange={setFilters}
          availableOptions={availableOptions}
        />

        {/* Insights */}
        <InsightsPanel insights={insights} />

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <KPICard
            title="Total Vehículos Importados"
            value={kpis.totalVehicles}
            variation={kpis.yearlyVariation}
            icon={<Car className="w-6 h-6 text-blue-600" />}
          />
          <KPICard
            title="Marcas Activas"
            value={kpis.totalBrands}
            icon={<Users className="w-6 h-6 text-blue-600" />}
          />
          <KPICard
            title="Modelos Activos"
            value={kpis.totalModels}
            icon={<BarChart3 className="w-6 h-6 text-blue-600" />}
          />
          <KPICard
            title="Variación Mensual"
            value={kpis.monthlyVariation}
            format="percentage"
            icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
          />
          <KPICard
            title="Variación Anual"
            value={kpis.yearlyVariation}
            format="percentage"
            icon={<Calendar className="w-6 h-6 text-blue-600" />}
          />
        </div>

        {/* Top Limit Control */}
        <div className="mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mostrar Top:
            </label>
            <select
              value={topLimit}
              onChange={(e) => setTopLimit(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={5}>Top 5</option>
              <option value={10}>Top 10</option>
              <option value={15}>Top 15</option>
              <option value={20}>Top 20</option>
            </select>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RankingChart
            data={brandRanking}
            title="Ranking de Marcas"
            color="#3B82F6"
          />
          <RankingChart
            data={modelRanking}
            title="Ranking de Modelos"
            color="#10B981"
          />
          <RankingChart
            data={modelsPerBrand}
            title="Modelos por Marca"
            color="#F59E0B"
          />
          <RankingChart
            data={vehicleTypeRanking}
            title="Ranking por Tipo de Vehículo"
            color="#EF4444"
          />
        </div>

        {/* Market Share */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <PieChart
            data={marketShare.slice(0, 8)}
            title="Market Share por Marca"
          />
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Crecimiento de Marcas</h3>
            <div className="space-y-3">
              {brandGrowth.slice(0, 10).map((brand, index) => (
                <div key={brand.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                    <span className="font-medium">{brand.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">{brand.value.toLocaleString()} unidades</span>
                    <span className={`text-sm font-medium ${
                      (brand.growth || 0) > 0 ? 'text-green-600' : 
                      (brand.growth || 0) < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {brand.growth ? `${brand.growth > 0 ? '+' : ''}${brand.growth.toFixed(1)}%` : '0%'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Data Tables */}
        <div className="space-y-6">
          {newVehicles.length > 0 && (
            <DataTable
              data={newVehicles}
              columns={[
                { key: 'marca', label: 'Marca' },
                { key: 'modelo', label: 'Modelo' },
                { key: 'tipo_vehiculo', label: 'Tipo de Vehículo' },
                { key: 'unidades', label: 'Unidades', format: (value) => value.toLocaleString() }
              ]}
              title="Nuevos Vehículos en el Mercado"
            />
          )}

          <DataTable
            data={marketShare}
            columns={[
              { key: 'name', label: 'Marca' },
              { key: 'value', label: 'Unidades', format: (value) => value.toLocaleString() },
              { key: 'percentage', label: 'Market Share', format: (value) => `${value.toFixed(2)}%` }
            ]}
            title="Market Share Detallado"
          />
        </div>
      </main>
    </div>
  );
}

export default App;
