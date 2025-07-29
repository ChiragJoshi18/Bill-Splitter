import React from 'react';

interface ChartProps {
  data: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
  height?: number;
  showValues?: boolean;
  showPercentages?: boolean;
}

export function BarChart({ data, height = 200, showValues = true, showPercentages = false }: ChartProps) {
  const maxValue = Math.max(...data.map(item => item.value));
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="w-full" style={{ height }}>
      <div className="flex items-end justify-between gap-2 h-full">
        {data.map((item, index) => {
          const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          const percentageOfTotal = total > 0 ? (item.value / total) * 100 : 0;
          
          return (
            <div key={index} className="flex flex-col items-center gap-2 flex-1">
              <div className="relative w-full">
                <div 
                  className="bg-blue-500 rounded-t transition-all hover:bg-blue-600 w-full"
                  style={{ 
                    height: `${Math.max(10, percentage)}%`,
                    backgroundColor: item.color || `hsl(${index * 60}, 70%, 50%)`
                  }}
                />
                {showValues && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium">
                    ₹{item.value.toLocaleString()}
                  </div>
                )}
              </div>
              <div className="text-center">
                <div className="text-xs font-medium truncate max-w-16">
                  {item.label}
                </div>
                {showPercentages && (
                  <div className="text-xs text-muted-foreground">
                    {percentageOfTotal.toFixed(1)}%
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PieChart({ data, height = 200, showValues = true }: ChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return (
    <div className="relative" style={{ height }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" className="transform -rotate-90">
        {data.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0;
          const angle = (percentage / 100) * 360;
          const startAngle = currentAngle;
          currentAngle += angle;

          const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
          const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
          const x2 = 50 + 40 * Math.cos(((startAngle + angle) * Math.PI) / 180);
          const y2 = 50 + 40 * Math.sin(((startAngle + angle) * Math.PI) / 180);

          const largeArcFlag = angle > 180 ? 1 : 0;

          const pathData = [
            `M 50 50`,
            `L ${x1} ${y1}`,
            `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
          ].join(' ');

          return (
            <path
              key={index}
              d={pathData}
              fill={item.color || `hsl(${index * 60}, 70%, 50%)`}
              className="transition-all hover:opacity-80"
            />
          );
        })}
      </svg>
      
      {showValues && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold">₹{total.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
        </div>
      )}
    </div>
  );
}

export function LineChart({ data, height = 200, showValues = true }: ChartProps) {
  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = maxValue > minValue 
      ? 100 - ((item.value - minValue) / (maxValue - minValue)) * 100 
      : 50;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full" style={{ height }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" className="overflow-visible">
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          points={points}
          className="text-blue-500"
        />
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = maxValue > minValue 
            ? 100 - ((item.value - minValue) / (maxValue - minValue)) * 100 
            : 50;
          
          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r="2"
                fill="currentColor"
                className="text-blue-500"
              />
              {showValues && (
                <text
                  x={x}
                  y={y - 5}
                  textAnchor="middle"
                  fontSize="8"
                  fill="currentColor"
                  className="text-gray-600"
                >
                  ₹{item.value.toLocaleString()}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      
      {/* X-axis labels */}
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        {data.map((item, index) => (
          <div key={index} className="text-center flex-1">
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

interface ProgressBarProps {
  value: number;
  max?: number;
  height?: number;
  color?: string;
  showLabel?: boolean;
  label?: string;
}

export function ProgressBar({ 
  value, 
  max = 100, 
  height = 8, 
  color = 'bg-blue-500',
  showLabel = true,
  label
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span>{label || `${value}/${max}`}</span>
          <span className="text-muted-foreground">{percentage.toFixed(1)}%</span>
        </div>
      )}
      <div 
        className="w-full bg-gray-200 rounded-full overflow-hidden"
        style={{ height }}
      >
        <div 
          className={`h-full transition-all duration-300 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function DonutChart({ data, height = 200, showValues = true }: ChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return (
    <div className="relative" style={{ height }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
        />
        
        {data.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0;
          const angle = (percentage / 100) * 360;
          const startAngle = currentAngle;
          currentAngle += angle;

          const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
          const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
          const x2 = 50 + 40 * Math.cos(((startAngle + angle) * Math.PI) / 180);
          const y2 = 50 + 40 * Math.sin(((startAngle + angle) * Math.PI) / 180);

          const largeArcFlag = angle > 180 ? 1 : 0;

          const pathData = [
            `M ${x1} ${y1}`,
            `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`
          ].join(' ');

          return (
            <path
              key={index}
              d={pathData}
              fill="none"
              stroke={item.color || `hsl(${index * 60}, 70%, 50%)`}
              strokeWidth="8"
              strokeLinecap="round"
              className="transition-all hover:stroke-width-10"
            />
          );
        })}
      </svg>
      
      {showValues && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold">₹{total.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
        </div>
      )}
    </div>
  );
} 