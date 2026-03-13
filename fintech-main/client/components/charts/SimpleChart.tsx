import { GlassCard } from "../common/GlassCard";
import { useState } from "react";

interface DataPoint {
  time: string;
  price: number;
  volume: number;
}

interface SimpleChartProps {
  data: DataPoint[];
  title?: string;
  height?: string;
}

export function SimpleChart({
  data,
  title = "Price Chart",
  height = "h-96",
}: SimpleChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <GlassCard heavy className={`p-6 ${height} flex items-center justify-center`}>
        <p className="text-muted-foreground">No data available</p>
      </GlassCard>
    );
  }

  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;
  
  // Add padding to the range for better visualization
  const padding = priceRange * 0.1;
  const adjustedMin = minPrice - padding;
  const adjustedMax = maxPrice + padding;
  const adjustedRange = adjustedMax - adjustedMin;

  // Chart dimensions
  const chartWidth = 1000;
  const chartHeight = 350;
  const chartPadding = { top: 20, right: 20, bottom: 50, left: 60 };

  // Calculate points
  const points = data.map((d, i) => {
    const x = chartPadding.left + (i / (data.length - 1)) * (chartWidth - chartPadding.left - chartPadding.right);
    const normalizedPrice = ((d.price - adjustedMin) / adjustedRange);
    const y = chartHeight - chartPadding.bottom - (normalizedPrice * (chartHeight - chartPadding.top - chartPadding.bottom));
    return { x, y, ...d };
  });

  // ✅ CHANGED: Zigzag/linear path using straight lines (L commands) instead of bezier curves
  const createZigzagPath = (points: typeof points) => {
    if (points.length < 2) return "";
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    
    return path;
  };

  const linePath = createZigzagPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - chartPadding.bottom} L ${points[0].x} ${chartHeight - chartPadding.bottom} Z`;

  // Y-axis labels
  const yAxisSteps = 5;
  const yAxisLabels = Array.from({ length: yAxisSteps }, (_, i) => {
    const value = adjustedMax - (i * adjustedRange / (yAxisSteps - 1));
    const y = chartPadding.top + (i * (chartHeight - chartPadding.top - chartPadding.bottom) / (yAxisSteps - 1));
    return { value, y };
  });

  // X-axis labels - show every nth label based on data length
  const xAxisStep = Math.ceil(data.length / 6);
  const xAxisLabels = points.filter((_, i) => i % xAxisStep === 0 || i === points.length - 1);

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `$${(price / 1000).toFixed(1)}k`;
    }
    return `$${price.toFixed(0)}`;
  };

  const changePercent = ((data[data.length - 1].price - data[0].price) / data[0].price * 100).toFixed(2);
  const isPositive = parseFloat(changePercent) >= 0;

  return (
    <GlassCard heavy className={`p-6 flex flex-col gap-4 ${height}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">{title}</h3>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Current Value</p>
            <p className="text-lg font-bold text-profit">
              ${data[data.length - 1].price.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Change</p>
            <p className={`text-lg font-bold ${isPositive ? 'text-profit' : 'text-red-500'}`}>
              {isPositive ? '+' : ''}{changePercent}%
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 relative">
        <svg 
          className="w-full h-full" 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          style={{ overflow: 'visible' }}
        >
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(201, 168, 76)" stopOpacity="0.3" />
              <stop offset="50%" stopColor="rgb(201, 168, 76)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="rgb(201, 168, 76)" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(168, 137, 60)" />
              <stop offset="100%" stopColor="rgb(226, 188, 106)" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {yAxisLabels.map((label, i) => (
            <g key={i}>
              <line
                x1={chartPadding.left}
                y1={label.y}
                x2={chartWidth - chartPadding.right}
                y2={label.y}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
                strokeDasharray="5,5"
              />
            </g>
          ))}

          {/* Y-axis labels */}
          {yAxisLabels.map((label, i) => (
            <text
              key={i}
              x={chartPadding.left - 10}
              y={label.y}
              textAnchor="end"
              dominantBaseline="middle"
              fill="rgba(255,255,255,0.5)"
              fontSize="11"
              fontWeight="500"
            >
              {formatPrice(label.value)}
            </text>
          ))}

          {/* Area under curve */}
          <path
            d={areaPath}
            fill="url(#areaGradient)"
          />

          {/* ✅ CHANGED: Main line now zigzag/sharp with strokeLinejoin="miter" for crisp corners */}
          <path
            d={linePath}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            strokeLinecap="butt"
            strokeLinejoin="miter"
            style={{
              filter: "drop-shadow(0 0 8px rgba(34, 197, 94, 0.4))"
            }}
          />

          {/* Data points */}
          {points.map((point, i) => (
            <g key={i}>
              <circle
                cx={point.x}
                cy={point.y}
                r={hoveredPoint === i ? 6 : 0}
                fill="rgb(201, 168, 76)"
                stroke="white"
                strokeWidth="2"
                style={{
                  transition: "all 0.2s ease",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
                }}
              />
              <rect
                x={point.x - 15}
                y={0}
                width={30}
                height={chartHeight}
                fill="transparent"
                onMouseEnter={() => setHoveredPoint(i)}
                onMouseLeave={() => setHoveredPoint(null)}
                style={{ cursor: "pointer" }}
              />
            </g>
          ))}

          {/* Hover tooltip */}
          {hoveredPoint !== null && (
            <g>
              <rect
                x={points[hoveredPoint].x - 50}
                y={points[hoveredPoint].y - 60}
                width={100}
                height={50}
                rx={8}
                fill="rgba(0,0,0,0.9)"
                stroke="rgba(34, 197, 94, 0.5)"
                strokeWidth="1"
              />
              <text
                x={points[hoveredPoint].x}
                y={points[hoveredPoint].y - 40}
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontWeight="bold"
              >
                ${points[hoveredPoint].price.toLocaleString()}
              </text>
              <text
                x={points[hoveredPoint].x}
                y={points[hoveredPoint].y - 22}
                textAnchor="middle"
                fill="rgba(255,255,255,0.7)"
                fontSize="10"
              >
                {points[hoveredPoint].time}
              </text>
            </g>
          )}

          {/* X-axis labels */}
          {xAxisLabels.map((point, i) => (
            <text
              key={i}
              x={point.x}
              y={chartHeight - chartPadding.bottom + 20}
              textAnchor="middle"
              fill="rgba(255,255,255,0.5)"
              fontSize="10"
              fontWeight="500"
            >
              {point.time}
            </text>
          ))}
        </svg>
      </div>

      {/* Stats Footer */}
      <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/10">
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Starting</p>
          <p className="text-sm font-bold text-white">${data[0].price.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Peak</p>
          <p className="text-sm font-bold text-profit">${maxPrice.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Low</p>
          <p className="text-sm font-bold text-yellow-500">${minPrice.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Growth</p>
          <p className={`text-sm font-bold ${isPositive ? 'text-profit' : 'text-red-500'}`}>
            {isPositive ? '↑' : '↓'} {Math.abs(parseFloat(changePercent))}%
          </p>
          </div>
      </div>
    </GlassCard>
  );
}