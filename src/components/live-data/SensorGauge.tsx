'use client';

import { useMemo } from 'react';

interface SensorGaugeProps {
  value: number;
  min: number;
  max: number;
  normalMin: number;
  normalMax: number;
  unit: string;
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function SensorGauge({
  value,
  min,
  max,
  normalMin,
  normalMax,
  unit,
  label,
  size = 'md',
}: SensorGaugeProps) {
  const sizeConfig = {
    sm: { width: 120, height: 80, fontSize: 'text-lg', labelSize: 'text-xs' },
    md: { width: 180, height: 120, fontSize: 'text-2xl', labelSize: 'text-sm' },
    lg: { width: 240, height: 160, fontSize: 'text-3xl', labelSize: 'text-base' },
  };

  const config = sizeConfig[size];

  const { angle, status, color } = useMemo(() => {
    // Clamp value between min and max
    const clampedValue = Math.max(min, Math.min(max, value));

    // Calculate angle (0-180 degrees)
    const percentage = (clampedValue - min) / (max - min);
    const calculatedAngle = percentage * 180;

    // Determine status
    let calculatedStatus: 'low' | 'normal' | 'high';
    let calculatedColor: string;

    if (value < normalMin) {
      calculatedStatus = 'low';
      calculatedColor = value < normalMin * 0.5 ? '#ef4444' : '#f59e0b'; // red or yellow
    } else if (value > normalMax) {
      calculatedStatus = 'high';
      calculatedColor = value > normalMax * 1.5 ? '#ef4444' : '#f59e0b'; // red or yellow
    } else {
      calculatedStatus = 'normal';
      calculatedColor = '#22c55e'; // green
    }

    return {
      angle: calculatedAngle,
      status: calculatedStatus,
      color: calculatedColor,
    };
  }, [value, min, max, normalMin, normalMax]);

  // Calculate normal zone arc
  const normalStartAngle = ((normalMin - min) / (max - min)) * 180;
  const normalEndAngle = ((normalMax - min) / (max - min)) * 180;

  // Arc path helpers
  const polarToCartesian = (cx: number, cy: number, r: number, degrees: number) => {
    const radians = ((degrees - 180) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(radians),
      y: cy + r * Math.sin(radians),
    };
  };

  const describeArc = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };

  const cx = config.width / 2;
  const cy = config.height - 10;
  const radius = config.width / 2 - 20;

  // Needle end point
  const needleEnd = polarToCartesian(cx, cy, radius - 10, angle);

  return (
    <div className="flex flex-col items-center">
      <svg width={config.width} height={config.height} className="overflow-visible">
        {/* Background arc */}
        <path
          d={describeArc(cx, cy, radius, 0, 180)}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Warning zones */}
        {normalStartAngle > 0 && (
          <path
            d={describeArc(cx, cy, radius, 0, normalStartAngle)}
            fill="none"
            stroke="#fecaca"
            strokeWidth="12"
            strokeLinecap="round"
          />
        )}
        {normalEndAngle < 180 && (
          <path
            d={describeArc(cx, cy, radius, normalEndAngle, 180)}
            fill="none"
            stroke="#fecaca"
            strokeWidth="12"
            strokeLinecap="round"
          />
        )}

        {/* Normal zone */}
        <path
          d={describeArc(cx, cy, radius, normalStartAngle, normalEndAngle)}
          fill="none"
          stroke="#bbf7d0"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={needleEnd.x}
          y2={needleEnd.y}
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Center circle */}
        <circle cx={cx} cy={cy} r="8" fill={color} />
        <circle cx={cx} cy={cy} r="4" fill="white" />

        {/* Min/Max labels */}
        <text
          x={20}
          y={cy}
          className="text-xs fill-secondary-400"
          textAnchor="middle"
        >
          {min}
        </text>
        <text
          x={config.width - 20}
          y={cy}
          className="text-xs fill-secondary-400"
          textAnchor="middle"
        >
          {max}
        </text>
      </svg>

      {/* Value display */}
      <div className="text-center -mt-2">
        <span className={`font-bold ${config.fontSize}`} style={{ color }}>
          {value.toFixed(1)}
        </span>
        <span className={`text-secondary-500 ml-1 ${config.labelSize}`}>{unit}</span>
      </div>

      {/* Label */}
      <p className={`text-secondary-600 ${config.labelSize} mt-1 text-center`}>{label}</p>

      {/* Status badge */}
      <span
        className={`mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${
          status === 'normal'
            ? 'bg-green-100 text-green-700'
            : status === 'high'
            ? 'bg-yellow-100 text-yellow-700'
            : 'bg-red-100 text-red-700'
        }`}
      >
        {status === 'normal' ? 'Normal' : status === 'high' ? 'Yüksek' : 'Düşük'}
      </span>
    </div>
  );
}
