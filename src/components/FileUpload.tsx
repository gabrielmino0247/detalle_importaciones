import React, { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { ImportRecord } from '../types';

interface FileUploadProps {
  onDataUpdate: (data: ImportRecord[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus('idle');
    setErrorMessage('');

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Transform Excel data to ImportRecord format
      const transformedData: ImportRecord[] = jsonData.map((row: any, index: number) => {
        // Handle different possible column names (Spanish/English)
        const fecha = row.fecha || row.Fecha || row.date || row.Date || '';
        const marca = row.marca || row.Marca || row.brand || row.Brand || '';
        const modelo = row.modelo || row.Modelo || row.model || row.Model || '';
        const tipo_vehiculo = row.tipo_vehiculo || row['Tipo de Vehículo'] || row.tipo || row.type || row.vehicleType || '';
        const unidades = parseInt(row.unidades || row.Unidades || row.units || row.Units || '0');

        // Parse date to extract year and month
        let año = 2024;
        let mes = 1;
        
        if (fecha) {
          const dateStr = fecha.toString();
          // Try different date formats
          let parsedDate: Date | null = null;
          
          // Try Excel date number format
          if (!isNaN(Number(dateStr))) {
            parsedDate = XLSX.SSF.parse_date_code(Number(dateStr));
          } else {
            // Try standard date formats
            parsedDate = new Date(dateStr);
          }
          
          if (parsedDate && !isNaN(parsedDate.getTime())) {
            año = parsedDate.getFullYear();
            mes = parsedDate.getMonth() + 1;
          }
        }

        return {
          id: (index + 1).toString(),
          fecha: fecha.toString(),
          marca: marca.toString(),
          modelo: modelo.toString(),
          tipo_vehiculo: tipo_vehiculo.toString(),
          unidades: isNaN(unidades) ? 0 : unidades,
          año,
          mes
        };
      });

      // Validate data
      const validData = transformedData.filter(record => 
        record.marca && record.modelo && record.unidades > 0
      );

      if (validData.length === 0) {
        throw new Error('No se encontraron datos válidos en el archivo. Verifique que contenga las columnas: fecha, marca, modelo, tipo_vehiculo, unidades');
      }

      onDataUpdate(validData);
      setUploadStatus('success');
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Error processing file:', error);
      setUploadStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Error al procesar el archivo');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FileSpreadsheet className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Actualizar Datos</h3>
        </div>
        
        {uploadStatus === 'success' && (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Datos actualizados correctamente</span>
          </div>
        )}
        
        {uploadStatus === 'error' && (
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Error al cargar archivo</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Sube tu archivo Excel actualizado para refrescar el dashboard con los nuevos datos de importaciones.
        </p>

        <div className="flex items-center space-x-4">
          <button
            onClick={triggerFileInput}
            disabled={isUploading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isUploading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'Procesando...' : 'Subir Archivo Excel'}</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
          />

          <div className="text-xs text-gray-500">
            Formatos soportados: .xlsx, .xls
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Formato esperado del archivo:</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• <strong>fecha</strong>: Fecha de importación (formato: YYYY-MM-DD o Excel date)</li>
            <li>• <strong>marca</strong>: Marca del vehículo (ej: Toyota, Chevrolet)</li>
            <li>• <strong>modelo</strong>: Modelo del vehículo (ej: Hilux, Corolla)</li>
            <li>• <strong>tipo_vehiculo</strong>: Tipo de vehículo (ej: SUV, Pickup, Sedan)</li>
            <li>• <strong>unidades</strong>: Cantidad de unidades importadas (número)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};