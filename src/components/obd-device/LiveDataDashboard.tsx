'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Pause,
  Play,
  RefreshCw,
  Gauge,
  Droplets,
  Wind,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  Radio
} from 'lucide-react';
import { obdBluetooth, type LiveDataReading } from '@/lib/obd-bluetooth';
import { getPIDByCode } from '@/data/live-data-pids';
import Link from 'next/link';

interface LiveDataValue extends LiveDataReading {
  status: 'normal' | 'warning' | 'critical';
  normalMin: number;
  normalMax: number;
  warningMin: number;
  warningMax: number;
  trend: 'up' | 'down' | 'stable';
  previousValue?: number;
}

interface LiveDataDashboardProps {
  isDeviceConnected?: boolean;
  onRequestConnect?: () => void;
}

// PIDs to read for live data (most common and useful)
const DASHBOARD_PIDS = [
  '0104', // Engine Load
  '0105', // Coolant Temp
  '0106', // STFT Bank 1
  '0107', // LTFT Bank 1
  '010B', // MAP
  '010C', // RPM
  '010D', // Speed
  '010F', // IAT
  '0110', // MAF
  '0111', // Throttle
  '012F', // Fuel Level
  '0142', // Voltage
];

// Simulation data generator
const generateSimulationData = (previousData: Record<string, number>): LiveDataReading[] => {
  const simulationConfig: Record<string, { base: number; variance: number; unit: string; name: string; abnormalChance?: number }> = {
    '0104': { base: 35, variance: 25, unit: '%', name: 'Engine Load' },
    '0105': { base: 92, variance: 8, unit: '°C', name: 'Coolant Temperature', abnormalChance: 0.1 }, // Sometimes overheating
    '0106': { base: 0, variance: 8, unit: '%', name: 'Short Term Fuel Trim B1' },
    '0107': { base: 2, variance: 5, unit: '%', name: 'Long Term Fuel Trim B1', abnormalChance: 0.15 }, // Often abnormal
    '010B': { base: 35, variance: 15, unit: 'kPa', name: 'Intake Manifold Pressure' },
    '010C': { base: 850, variance: 200, unit: 'RPM', name: 'Engine RPM' },
    '010D': { base: 0, variance: 5, unit: 'km/h', name: 'Vehicle Speed' },
    '010F': { base: 28, variance: 10, unit: '°C', name: 'Intake Air Temperature' },
    '0110': { base: 8, variance: 6, unit: 'g/s', name: 'MAF Air Flow Rate' },
    '0111': { base: 15, variance: 10, unit: '%', name: 'Throttle Position' },
    '012F': { base: 65, variance: 5, unit: '%', name: 'Fuel Tank Level' },
    '0142': { base: 14.2, variance: 0.5, unit: 'V', name: 'Control Module Voltage', abnormalChance: 0.05 },
  };

  const timestamp = Date.now();

  return DASHBOARD_PIDS.map(pid => {
    const config = simulationConfig[pid];
    if (!config) {
      return { pid, name: 'Unknown', value: 0, unit: '', timestamp };
    }

    const prev = previousData[pid] ?? config.base;

    // Create some abnormal values occasionally
    let value: number;
    const pidInfo = getPIDByCode(pid);

    const warnMax = pidInfo?.warningMax ?? config.base + config.variance * 1.5;
    const warnMin = pidInfo?.warningMin ?? config.base - config.variance * 1.5;
    const normalMax = pidInfo?.normalRangeMax ?? config.base + config.variance;
    const normalMin = pidInfo?.normalRangeMin ?? config.base - config.variance;

    if (config.abnormalChance && Math.random() < config.abnormalChance && pidInfo) {
      // Generate abnormal value outside normal range
      const isHigh = Math.random() > 0.5;
      if (isHigh) {
        value = normalMax + (warnMax - normalMax) * (0.3 + Math.random() * 0.7);
      } else {
        value = normalMin - (normalMin - warnMin) * (0.3 + Math.random() * 0.7);
      }
    } else {
      // Normal smooth variation
      const change = (Math.random() - 0.5) * config.variance * 0.3;
      value = prev + change;

      // Keep within reasonable bounds
      value = Math.max(config.base - config.variance, Math.min(config.base + config.variance, value));
    }

    return {
      pid,
      name: config.name,
      value: Number(value.toFixed(1)),
      unit: config.unit,
      timestamp,
    };
  });
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'fuel':
      return <Droplets className="w-4 h-4" />;
    case 'emissions':
      return <Wind className="w-4 h-4" />;
    case 'sensors':
      return <Gauge className="w-4 h-4" />;
    case 'engine':
      return <Zap className="w-4 h-4" />;
    default:
      return <Activity className="w-4 h-4" />;
  }
};

const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="w-3 h-3 text-info-500" />;
    case 'down':
      return <TrendingDown className="w-3 h-3 text-info-500" />;
    default:
      return <Minus className="w-3 h-3 text-secondary-400" />;
  }
};

export default function LiveDataDashboard({ isDeviceConnected = false, onRequestConnect }: LiveDataDashboardProps) {
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [liveData, setLiveData] = useState<LiveDataValue[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [updateInterval, setUpdateInterval] = useState(1000); // 1 second
  const [showOnlyAbnormal, setShowOnlyAbnormal] = useState(false);
  const previousValuesRef = useRef<Record<string, number>>({});
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const simulationDataRef = useRef<Record<string, number>>({});

  const isConnected = isDeviceConnected || isSimulationMode;

  // Calculate value status based on PID reference ranges
  const calculateStatus = useCallback((pid: string, value: number): {
    status: 'normal' | 'warning' | 'critical';
    normalMin: number;
    normalMax: number;
    warningMin: number;
    warningMax: number;
  } => {
    const pidInfo = getPIDByCode(pid);

    if (!pidInfo) {
      return {
        status: 'normal',
        normalMin: 0,
        normalMax: 100,
        warningMin: 0,
        warningMax: 100,
      };
    }

    const { normalRangeMin, normalRangeMax } = pidInfo;
    const warnMin = pidInfo.warningMin ?? normalRangeMin * 0.5;
    const warnMax = pidInfo.warningMax ?? normalRangeMax * 1.5;

    let status: 'normal' | 'warning' | 'critical' = 'normal';

    // Check if value is within normal range
    if (value >= normalRangeMin && value <= normalRangeMax) {
      status = 'normal';
    }
    // Check if value is within warning range but outside normal
    else if (value >= warnMin && value <= warnMax) {
      status = 'warning';
    }
    // Value is outside warning range - critical
    else {
      status = 'critical';
    }

    return {
      status,
      normalMin: normalRangeMin,
      normalMax: normalRangeMax,
      warningMin: warnMin,
      warningMax: warnMax,
    };
  }, []);

  // Calculate trend based on previous value
  const calculateTrend = useCallback((pid: string, currentValue: number): 'up' | 'down' | 'stable' => {
    const previousValue = previousValuesRef.current[pid];

    if (previousValue === undefined) {
      return 'stable';
    }

    const diff = currentValue - previousValue;
    const threshold = Math.abs(previousValue * 0.02); // 2% threshold

    if (diff > threshold) return 'up';
    if (diff < -threshold) return 'down';
    return 'stable';
  }, []);

  // Read live data from OBD device or simulation
  const readLiveData = useCallback(async () => {
    try {
      let readings: LiveDataReading[];

      if (isSimulationMode) {
        // Generate simulation data
        readings = generateSimulationData(simulationDataRef.current);
        // Store values for next iteration
        readings.forEach(r => {
          simulationDataRef.current[r.pid] = r.value;
        });
      } else if (isDeviceConnected) {
        // Read from actual OBD device
        readings = await obdBluetooth.readMultiplePIDs(DASHBOARD_PIDS);
      } else {
        return;
      }

      const processedData: LiveDataValue[] = readings.map((reading) => {
        const statusInfo = calculateStatus(reading.pid, reading.value);
        const trend = calculateTrend(reading.pid, reading.value);

        // Store current value for next trend calculation
        const previousValue = previousValuesRef.current[reading.pid];
        previousValuesRef.current[reading.pid] = reading.value;

        return {
          ...reading,
          ...statusInfo,
          trend,
          previousValue,
        };
      });

      setLiveData(processedData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('[LiveDataDashboard] Error reading live data:', error);
    }
  }, [calculateStatus, calculateTrend, isSimulationMode, isDeviceConnected]);

  // Start/stop live data reading
  useEffect(() => {
    if (isRunning && isConnected) {
      readLiveData(); // Initial read
      intervalRef.current = setInterval(readLiveData, updateInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, isConnected, updateInterval, readLiveData]);

  // Filter data based on showOnlyAbnormal
  const displayData = showOnlyAbnormal
    ? liveData.filter(d => d.status !== 'normal')
    : liveData;

  // Count abnormal values
  const abnormalCount = liveData.filter(d => d.status !== 'normal').length;
  const criticalCount = liveData.filter(d => d.status === 'critical').length;
  const warningCount = liveData.filter(d => d.status === 'warning').length;

  // Get status color
  const getStatusColor = (status: 'normal' | 'warning' | 'critical') => {
    switch (status) {
      case 'critical':
        return 'bg-error-50 border-error-200 text-error-800';
      case 'warning':
        return 'bg-warning-50 border-warning-200 text-warning-800';
      default:
        return 'bg-success-50 border-success-200 text-success-800';
    }
  };

  const getStatusBadgeColor = (status: 'normal' | 'warning' | 'critical') => {
    switch (status) {
      case 'critical':
        return 'bg-error-100 text-error-700';
      case 'warning':
        return 'bg-warning-100 text-warning-700';
      default:
        return 'bg-success-100 text-success-700';
    }
  };

  // Calculate gauge percentage
  const getGaugePercentage = (value: number, min: number, max: number): number => {
    const range = max - min;
    if (range === 0) return 50;
    const percentage = ((value - min) / range) * 100;
    return Math.max(0, Math.min(100, percentage));
  };

  if (!isConnected) {
    return (
      <div className="bg-white rounded-2xl shadow-card p-6 border border-secondary-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-secondary-800">
              Canlı Veri Dashboard
            </h2>
            <p className="text-secondary-500 text-sm">
              Anlık motor verileri ve referans aralığı dışı uyarılar
            </p>
          </div>
        </div>

        <div className="text-center py-8 bg-secondary-50 rounded-xl border border-secondary-100">
          <Activity className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
          <p className="text-secondary-600 mb-4">
            Canlı veri okumak için OBD cihazınızı bağlayın veya demo modunu kullanın
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onRequestConnect && (
              <button
                onClick={onRequestConnect}
                className="px-6 py-2.5 bg-info-600 hover:bg-info-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Radio className="w-4 h-4" />
                OBD Cihazını Bağla
              </button>
            )}
            <button
              onClick={() => setIsSimulationMode(true)}
              className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-secondary-900 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 shadow-glow"
            >
              <Play className="w-4 h-4" />
              Demo Modunu Başlat
            </button>
          </div>

          <p className="text-xs text-secondary-400 mt-3">
            Demo modu, gerçekçi simülasyon verileri ile sistemi test etmenizi sağlar
          </p>
        </div>

        {/* Features Preview */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-success-50 rounded-lg border border-success-200">
            <CheckCircle className="w-5 h-5 text-success-600 mx-auto mb-1" />
            <p className="text-xs text-success-700">Normal Değerler</p>
          </div>
          <div className="text-center p-3 bg-warning-50 rounded-lg border border-warning-200">
            <AlertTriangle className="w-5 h-5 text-warning-600 mx-auto mb-1" />
            <p className="text-xs text-warning-700">Uyarı Değerleri</p>
          </div>
          <div className="text-center p-3 bg-error-50 rounded-lg border border-error-200">
            <AlertTriangle className="w-5 h-5 text-error-600 mx-auto mb-1" />
            <p className="text-xs text-error-700">Kritik Değerler</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 border border-secondary-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSimulationMode ? 'bg-primary-100' : 'bg-info-100'}`}>
            <Activity className={`w-6 h-6 ${isSimulationMode ? 'text-primary-600' : 'text-info-600'}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-secondary-800">
                Canlı Veri Dashboard
              </h2>
              {isSimulationMode && (
                <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                  Demo
                </span>
              )}
              {isDeviceConnected && !isSimulationMode && (
                <span className="px-2 py-0.5 bg-success-100 text-success-700 text-xs font-medium rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-success-500 rounded-full animate-pulse" />
                  Bağlı
                </span>
              )}
            </div>
            <p className="text-secondary-500 text-sm">
              {lastUpdate
                ? `Son güncelleme: ${lastUpdate.toLocaleTimeString('tr-TR')}`
                : 'Veri bekleniyor...'
              }
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
              isRunning
                ? 'bg-warning-100 text-warning-700 hover:bg-warning-200'
                : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                Durdur
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Başlat
              </>
            )}
          </button>
          <button
            onClick={readLiveData}
            disabled={isRunning}
            className="p-2 bg-secondary-100 text-secondary-600 hover:bg-secondary-200 rounded-lg transition-colors disabled:opacity-50"
            title="Manuel yenile"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-success-50 border border-success-200 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <CheckCircle className="w-5 h-5 text-success-600" />
            <span className="text-2xl font-bold text-success-700">
              {liveData.length - abnormalCount}
            </span>
          </div>
          <p className="text-xs text-success-600">Normal</p>
        </div>
        <div className="bg-warning-50 border border-warning-200 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <AlertTriangle className="w-5 h-5 text-warning-600" />
            <span className="text-2xl font-bold text-warning-700">{warningCount}</span>
          </div>
          <p className="text-xs text-warning-600">Uyarı</p>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <AlertTriangle className="w-5 h-5 text-error-600" />
            <span className="text-2xl font-bold text-error-700">{criticalCount}</span>
          </div>
          <p className="text-xs text-error-600">Kritik</p>
        </div>
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showOnlyAbnormal}
            onChange={(e) => setShowOnlyAbnormal(e.target.checked)}
            className="w-4 h-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-secondary-600">
            Sadece anormal değerleri göster
          </span>
        </label>
        <select
          value={updateInterval}
          onChange={(e) => setUpdateInterval(Number(e.target.value))}
          className="text-sm border border-secondary-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value={500}>0.5 saniye</option>
          <option value={1000}>1 saniye</option>
          <option value={2000}>2 saniye</option>
          <option value={5000}>5 saniye</option>
        </select>
      </div>

      {/* Live Data Grid */}
      {displayData.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {displayData.map((data) => {
            const pidInfo = getPIDByCode(data.pid);
            const gaugePercentage = getGaugePercentage(
              data.value,
              data.warningMin,
              data.warningMax
            );

            return (
              <Link
                key={data.pid}
                href={`/obd/canli-veri/${data.pid.toLowerCase()}`}
                className={`border-2 rounded-xl p-4 transition-all hover:shadow-md ${getStatusColor(data.status)}`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {pidInfo && getCategoryIcon(pidInfo.category)}
                    <span className="font-mono text-xs bg-black/10 px-1.5 py-0.5 rounded">
                      {data.pid}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(data.trend)}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadgeColor(data.status)}`}>
                      {data.status === 'critical' ? 'Kritik' : data.status === 'warning' ? 'Uyarı' : 'Normal'}
                    </span>
                  </div>
                </div>

                {/* Name */}
                <h3 className="font-semibold text-sm mb-2 line-clamp-1">
                  {pidInfo?.nameTr || data.name}
                </h3>

                {/* Value */}
                <div className="flex items-end justify-between mb-2">
                  <span className="text-2xl font-bold">
                    {typeof data.value === 'number' ? data.value.toFixed(1) : data.value}
                  </span>
                  <span className="text-sm opacity-70">{data.unit}</span>
                </div>

                {/* Gauge Bar */}
                <div className="relative h-2 bg-secondary-200 rounded-full overflow-hidden">
                  <div
                    className={`absolute left-0 top-0 h-full rounded-full transition-all duration-300 ${
                      data.status === 'critical'
                        ? 'bg-error-500'
                        : data.status === 'warning'
                        ? 'bg-warning-500'
                        : 'bg-success-500'
                    }`}
                    style={{ width: `${gaugePercentage}%` }}
                  />
                  {/* Normal range indicator */}
                  <div
                    className="absolute top-0 h-full bg-success-300/50"
                    style={{
                      left: `${getGaugePercentage(data.normalMin, data.warningMin, data.warningMax)}%`,
                      width: `${getGaugePercentage(data.normalMax, data.warningMin, data.warningMax) - getGaugePercentage(data.normalMin, data.warningMin, data.warningMax)}%`
                    }}
                  />
                </div>

                {/* Range Labels */}
                <div className="flex justify-between text-xs opacity-60 mt-1">
                  <span>{data.normalMin}</span>
                  <span>Normal: {data.normalMin}-{data.normalMax}</span>
                  <span>{data.normalMax}</span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 bg-secondary-50 rounded-xl border border-secondary-100">
          {showOnlyAbnormal ? (
            <>
              <CheckCircle className="w-12 h-12 text-success-500 mx-auto mb-3" />
              <p className="text-secondary-600">
                Tüm değerler normal aralıkta
              </p>
            </>
          ) : (
            <>
              <Activity className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
              <p className="text-secondary-600">
                {isRunning ? 'Veri okunuyor...' : 'Başlat butonuna tıklayın'}
              </p>
            </>
          )}
        </div>
      )}

      {/* Disconnect Button */}
      <div className="mt-6 text-center">
        <button
          onClick={() => {
            setIsRunning(false);
            setIsSimulationMode(false);
            setLiveData([]);
            previousValuesRef.current = {};
            simulationDataRef.current = {};
          }}
          className="text-sm text-secondary-500 hover:text-secondary-700"
        >
          {isSimulationMode ? 'Demo Modunu Kapat' : 'Bağlantıyı Kes'}
        </button>
      </div>
    </div>
  );
}
