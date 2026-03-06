'use client';

interface NormalRangeIndicatorProps {
  value: number;
  min: number;
  max: number;
  normalMin: number;
  normalMax: number;
  unit: string;
  showValue?: boolean;
}

export default function NormalRangeIndicator({
  value,
  min,
  max,
  normalMin,
  normalMax,
  unit,
  showValue = true,
}: NormalRangeIndicatorProps) {
  // Calculate percentages
  const range = max - min;
  const valuePercent = ((value - min) / range) * 100;
  const normalMinPercent = ((normalMin - min) / range) * 100;
  const normalMaxPercent = ((normalMax - min) / range) * 100;

  // Determine status
  const isNormal = value >= normalMin && value <= normalMax;
  const isLow = value < normalMin;
  const isHigh = value > normalMax;

  return (
    <div className="w-full">
      {/* Value display */}
      {showValue && (
        <div className="flex items-baseline justify-between mb-2">
          <span
            className={`text-2xl font-bold ${
              isNormal ? 'text-green-600' : isLow ? 'text-yellow-600' : 'text-red-600'
            }`}
          >
            {value.toFixed(1)}
          </span>
          <span className="text-secondary-500 text-sm">{unit}</span>
        </div>
      )}

      {/* Range bar */}
      <div className="relative h-4 rounded-full overflow-hidden bg-secondary-100">
        {/* Warning zone - low */}
        <div
          className="absolute h-full bg-yellow-200"
          style={{
            left: 0,
            width: `${normalMinPercent}%`,
          }}
        />

        {/* Normal zone */}
        <div
          className="absolute h-full bg-green-200"
          style={{
            left: `${normalMinPercent}%`,
            width: `${normalMaxPercent - normalMinPercent}%`,
          }}
        />

        {/* Warning zone - high */}
        <div
          className="absolute h-full bg-red-200"
          style={{
            left: `${normalMaxPercent}%`,
            right: 0,
          }}
        />

        {/* Value indicator */}
        <div
          className={`absolute w-3 h-3 rounded-full top-0.5 -translate-x-1/2 shadow-md ${
            isNormal ? 'bg-green-500' : isLow ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{
            left: `${Math.max(0, Math.min(100, valuePercent))}%`,
          }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-1 text-xs text-secondary-400">
        <span>{min}</span>
        <span className="text-green-600">
          Normal: {normalMin} - {normalMax}
        </span>
        <span>{max}</span>
      </div>
    </div>
  );
}
